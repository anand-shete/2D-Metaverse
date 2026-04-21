import { S3Client } from "@aws-sdk/client-s3";

// sdk automatically uses .env since naming convention followed
export const s3client = new S3Client({
  region: "ap-south-1",
});
