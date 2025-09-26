export interface UploadableFile {
  file: File;
  tags: string[];
  title?: string;
  notes?: string;
}

export const readFilesAsBase64 = async (files: UploadableFile['file'][]): Promise<Array<{ name: string; content: string; type: string }>> => {
  const readers = files.map(
    (file) =>
      new Promise<{ name: string; content: string; type: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            content: (reader.result as string).split(',')[1] ?? '',
            type: file.type || 'application/octet-stream'
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })
  );

  return Promise.all(readers);
};
