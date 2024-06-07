// src/utils/blobToFile.ts
export function blobToFile(blob: Blob, fileName: string): File {
  const file = new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
  return file;
}