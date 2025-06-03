'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { createBlogSchema, type CreateBlogInput } from '@/lib/validations/blog-validations';
import Image from 'next/image';

interface NewBlogFormProps {
  userId: string;
}

export default function NewBlogForm({ userId }: NewBlogFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreateBlogInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('content', data.content);
      formData.append('image', data.image);
      formData.append('userId', userId);

      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Greška pri stvaranju članka');
      }

      const result = await response.json();
      toast.success('Članak je uspješno objavljen!');
      router.push(`/blog/${result.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Došlo je do neočekivane greške';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle className='text-lg'>Novi članak</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Naziv članka</Label>
            <Input
              id="name"
              placeholder="Unesite naziv vašeg članka..."
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Kratki opis</Label>
            <Textarea
              id="description"
              placeholder="Napišite kratki opis koji će privući čitatelje..."
              rows={3}
              {...register('description')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Naslovna slika</Label>
            <div className="flex flex-col gap-4">
              {imagePreview ? (
                <div className="relative w-full max-w-md">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={200}
                    className="rounded-lg object-cover w-full h-48"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Kliknite za odabir slike ili ju povucite ovdje
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WebP do 5MB
                  </p>
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </div>
            {errors.image && (
              <p className="text-sm text-red-600">{errors.image.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Sadržaj članka</Label>
            <Textarea
              id="content"
              placeholder="Napišite sadržaj vašeg članka..."
              rows={8}
              {...register('content')}
              disabled={isLoading}
              className="min-h-[200px]"
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Odustani
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Objavi članak
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
