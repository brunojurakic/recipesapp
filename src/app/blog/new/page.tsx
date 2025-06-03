import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getCurrentUser } from '@/db/queries/user-queries';
import { headers } from 'next/headers';
import NewBlogForm from '@/components/forms/NewBlogForm';

export const metadata: Metadata = {
  title: 'ReceptiNet - Napiši novi blog',
  description: 'Stvorite novi članak o kulinarstvu i podijelite svoje znanje s ostalima.',
  robots: 'noindex',
};

export default async function NewBlogPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const currentUser = session ? await getCurrentUser() : null;

  if (!currentUser) {
    redirect('/login');
  }

  const isAdmin = currentUser?.role?.name === "Admin";
  const isModerator = currentUser?.role?.name === "Moderator";
  const canCreateBlog = isAdmin || isModerator;

  if (!canCreateBlog) {
    redirect('/blog');
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-25">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Napiši novi članak
          </h1>
          <p className="text-lg text-muted-foreground">
            Stvorite novi članak i podijelite svoje kulinarske savjete, metode ili iskustva
          </p>
        </div>

        <NewBlogForm userId={currentUser.id} />
      </div>
    </div>
  );
}
