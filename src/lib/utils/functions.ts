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

/**
 * Saves an uploaded image to the public/uploads directory with a unique name
 * @param image - The uploaded image file
 * @param uploadsDir - The directory path where the image should be saved (default: public/uploads)
 * @returns The path to the saved image, or null if saving failed
 */
export async function saveImage(image: (File | null)): Promise<string | null> {
  if (!image || !(image instanceof File)) {
    return null;
  }
  const uploadsDir: string = join(process.cwd(), 'public/uploads')
  try {
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
  } catch (error) {
    console.error('Error saving image:', error);
    return null;
  }
}
