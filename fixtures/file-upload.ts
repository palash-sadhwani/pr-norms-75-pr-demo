// Deliberately unsafe upload handling examples for PR-Norms.
type Upload = { name: string; mimeType: string; size: number; buffer: Buffer };
export async function storeUploadUnsafe(file: Upload, write: (name: string, data: Buffer) => Promise<void>) {
  await write(file.name, file.buffer);
  return { name: file.name, type: file.mimeType, size: file.size };
}
