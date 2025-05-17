import { access, mkdir, writeFile } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

export const parseJSON = (val: FormDataEntryValue | null) => {
  if (!val) return [];
  try {
    return JSON.parse(val as string);
  } catch {
    return [];
  }
};


export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await access(dirPath);
  } catch (error) {
    console.log(error)
    await mkdir(dirPath, { recursive: true });
  }
}


export async function saveImage(image: File): Promise<string | null> {
  if (!image || !(image instanceof File)) {
    return null;
  }
  const uploadsDir: string = join(process.cwd(), 'public/uploads')
  const uniqueId = crypto.randomUUID();
  const originalName = image.name;
  const fileExtension = originalName.split('.').pop() || 'jpg';
  const fileName = `${uniqueId}.${fileExtension}`;

  const filePath = join(uploadsDir, fileName);

  await ensureDirectoryExists(uploadsDir);

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}
