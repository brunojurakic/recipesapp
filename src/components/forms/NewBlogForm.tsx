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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createBlogSchema, type CreateBlogInput } from '@/lib/validations/blog-validations';

interface NewBlogFormProps {
  userId: string;
}

export default function NewBlogForm({ userId }: NewBlogFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
  });

  const onSubmit = async (data: CreateBlogInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId,
        }),
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
            <Label htmlFor="content">Sadržaj članka</Label>
            <Textarea
              id="content"
              placeholder="Napišite sadržaj vašeg članka..."
              rows={6}
              {...register('content')}
              disabled={isLoading}
              className="h-[144px]"
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
