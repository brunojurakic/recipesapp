import { put } from "@vercel/blob";

export const parseJSON = (val: FormDataEntryValue | null) => {
  if (!val) return [];
  try {
    return JSON.parse(val as string);
  } catch {
    return [];
  }
};


export async function saveImage(image: File): Promise<string | null> {
  if (!image || !(image instanceof File)) {
    return null;
  }
  
  try {
    // Upload directly to Vercel Blob storage
    const blob = await put(image.name, image, {
      access: 'public',
      addRandomSuffix: true, // This ensures unique filenames
    });
    
    // Return the URL from the blob
    return blob.url;
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return null;
  }
}
