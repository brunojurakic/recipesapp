import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCurrentUser } from '@/db/queries/user-queries';
import { deleteBlog, getBlogById } from '@/db/queries/blog-queries';
import { headers } from 'next/headers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json(
        { message: 'Članak nije pronađen' },
        { status: 404 }
      );
    }

    const isAuthor = blog.userId === currentUser.id;
    const isAdmin = currentUser?.role?.name === "Admin";
    const isModerator = currentUser?.role?.name === "Moderator";
    const canDelete = isAuthor || isAdmin || isModerator;

    if (!canDelete) {
      return NextResponse.json(
        { message: 'Nemate dozvolu za brisanje ovog članka' },
        { status: 403 }
      );
    }

    const deletedBlog = await deleteBlog(id);
    
    if (!deletedBlog) {
      return NextResponse.json(
        { message: 'Greška pri brisanju članka' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Članak je uspješno obrisan' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { message: 'Greška pri brisanju članka' },
      { status: 500 }
    );
  }
}
