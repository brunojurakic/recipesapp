import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCurrentUser } from '@/db/queries/user-queries';
import { createBlog } from '@/db/queries/blog-queries';
import { createBlogSchema } from '@/lib/validations/blog-validations';
import { saveImage } from '@/lib/utils/functions';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json(
        { message: 'Niste prijavljeni' },
        { status: 401 }
      );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { message: 'Korisnik nije pronađen' },
        { status: 404 }
      );
    }

    const isAdmin = currentUser?.role?.name === "Admin";
    const isModerator = currentUser?.role?.name === "Moderator";
    const canCreateBlog = isAdmin || isModerator;

    if (!canCreateBlog) {
      return NextResponse.json(
        { message: 'Nemate dozvolu za stvaranje članaka' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File;

    const validation = createBlogSchema.safeParse({
      name,
      description,
      content,
      image,
    });

    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Neispravni podaci',
          errors: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const imagePath = await saveImage(image);
    if (!imagePath) {
      return NextResponse.json(
        { message: 'Greška pri učitavanju slike' },
        { status: 500 }
      );
    }

    const newBlog = await createBlog({
      name: validation.data.name,
      description: validation.data.description,
      content: validation.data.content,
      imagePath,
      userId: currentUser.id,
    });

    return NextResponse.json(newBlog, { status: 201 });
    
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { message: 'Greška pri stvaranju članka' },
      { status: 500 }
    );
  }
}
