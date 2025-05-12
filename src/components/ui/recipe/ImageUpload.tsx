import Image from "next/image";

interface ImageUploadProps {
  imageUrl: string | null;
  onImageChange: (file: File) => void;
}

export function ImageUpload({ imageUrl, onImageChange }: ImageUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">Recipe Image</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {imageUrl ? (
            <div className="relative w-full h-48">
              <Image
                src={imageUrl}
                alt="Recipe preview"
                fill
                className="object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="flex text-sm text-zinc-600">
              <label htmlFor="image" className="relative cursor-pointer rounded-md font-medium text-zinc-900 hover:text-zinc-500">
                <span>Upload a file</span>
                <input
                  id="image"
                  name="image"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImageChange(file);
                    }
                  }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
          )}
          <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
}
