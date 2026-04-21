import api from "@/api";
import { mapFileTypesToActual } from "@/types/type";
import axios from "axios";

type UploadProgress = {
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
  completedFiles: number;
  totalFiles: number;
};

type UploadOptions = {
  concurrencyLimit?: number;
  onProgress?: (progress: UploadProgress) => void;
};

// browser allows max 6 concurrent connection to a single domain
export const uploadFilesWithConcurrency = async (files: File[], options: UploadOptions = {}) => {
  const { concurrencyLimit = 3, onProgress } = options;
  const results: Promise<void>[] = [];
  const executing: Promise<void>[] = [];
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const uploadedBytesByFile: number[] = files.map(() => 0);
  let completedFiles = 0;

  const reportProgress = () => {
    const uploadedBytes = uploadedBytesByFile.reduce((sum, value) => sum + value, 0);
    const percentage = totalBytes === 0 ? 100 : Math.min(100, (uploadedBytes / totalBytes) * 100);

    onProgress?.({
      percentage,
      uploadedBytes,
      totalBytes,
      completedFiles,
      totalFiles: files.length,
    });
  };

  reportProgress();

  for (const [index, file] of files.entries()) {
    const p = uploadSingleFile(file, uploadedBytes => {
      uploadedBytesByFile[index] = Math.min(file.size, uploadedBytes);
      reportProgress();
    }).then(result => {
      uploadedBytesByFile[index] = file.size;
      completedFiles += 1;
      reportProgress();

      // Remove this promise from the executing list when done
      executing.splice(executing.indexOf(p), 1);
      return result;
    });

    results.push(p);
    executing.push(p);

    // 2. If we reached the limit, wait for ONE of them to finish before adding more
    if (executing.length >= concurrencyLimit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
};

async function uploadSingleFile(file: File, onFileProgress: (uploadedBytes: number) => void) {
  const fileType = file.type.split("/").pop();
  if (!fileType) return;

  const res = await api.post("/user/upload-url", {
    contentType: mapFileTypesToActual[fileType],
    fileName: file.name,
    fileSize: file.size,
  });
  const signedUrl = res.data.signedUrl;

  await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },

    // an important axios event
    onUploadProgress: event => {
      onFileProgress(event.loaded);
    },
  });
}
