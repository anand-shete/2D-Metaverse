import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlockKeysArr, mapFileTypesToActual, MAX_FILE_SIZE } from "@/types/type";
import { uploadFilesWithConcurrency } from "@/components/utils/file.utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadFiles({ isOpen, onClose }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [completedFiles, setCompletedFiles] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const stopMovementWhileModalOpen = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (BlockKeysArr.includes(key)) event.stopPropagation();

      if (key === "escape") {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", stopMovementWhileModalOpen, true);
    return () => {
      document.removeEventListener("keydown", stopMovementWhileModalOpen, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    const files = fileList ? Array.from(fileList) : [];
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    try {
      if (selectedFiles.length === 0) {
        toast.error("Select at least one file to upload");
        return;
      }
      if (selectedFiles.length > 50) {
        toast.error("You can only upload 50 files at a time");
        return;
      }

      for (const file of selectedFiles) {
        const fileType = file.type.split("/").pop();
        const allowedFiles = Object.keys(mapFileTypesToActual);

        if (!fileType || !allowedFiles.includes(fileType)) {
          toast.error("Allowed file types are .pdf, .pptx, .docx and .txt");
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          toast.error("Please remove files larger than 20MB");
          return;
        }
      }

      setIsUploading(true);
      setUploadProgress(0);
      setCompletedFiles(0);

      await uploadFilesWithConcurrency(selectedFiles, {
        onProgress: progress => {
          setUploadProgress(progress.percentage);
          setCompletedFiles(progress.completedFiles);
        },
      });
      toast.success("Files uploaded to Metaverse archives");
      setSelectedFiles([]);
      onClose();
    } catch (error: any) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-600 bg-white text-slate-900 shadow-2xl">
        <div className="flex items-center justify-between rounded-tl-xl rounded-tr-xl border-b border-slate-700 bg-slate-700 px-5 py-4 text-white">
          <div>
            <h2 className="text-lg font-semibold">Upload your Notes</h2>
            <p className="text-sm text-slate-200">Upload your notes to the metaverse archive</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-slate-600"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <Input
            type="file"
            multiple
            onChange={handleFileSelection}
            className="cursor-pointer border-slate-600 text-slate-700 file:mr-2 file:text-slate-800"
          />

          {isUploading && (
            <div className="space-y-2 rounded-md bg-gray-50 p-3">
              <div className="h-2 w-full overflow-hidden rounded bg-slate-200">
                <div
                  className="h-full bg-slate-700 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{Math.round(uploadProgress)}% uploaded</span>
                <span>
                  {completedFiles}/{selectedFiles.length} files
                </span>
              </div>
            </div>
          )}

          <div className="max-h-48 space-y-2 overflow-y-auto rounded-md bg-gray-50 p-3">
            {selectedFiles.length === 0 ? (
              <p className="text-sm text-gray-500">No files selected</p>
            ) : (
              selectedFiles.map(file => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="flex items-center justify-between rounded bg-slate-100 px-3 py-2 text-sm text-slate-900"
                >
                  <span className="max-w-[80%] truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-700 px-5 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-500 bg-white text-slate-700 hover:bg-slate-100"
            disabled={isUploading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-slate-700 text-white hover:bg-slate-800"
          >
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>
    </div>
  );
}
