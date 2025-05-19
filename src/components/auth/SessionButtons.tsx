"use client"

import Link from 'next/link'
import { useSession, signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const InteractiveHeader = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        }
      }
    });
  };

  return (
    <div className="flex items-center gap-4" style={{ minWidth: '150px' }}>
      {isPending ? (
        <Loader2 className="animate-spin text-zinc-600" />
      ) : session ? (
        <>
          <Link
            href="/profile"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:cursor-pointer"
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default InteractiveHeader;
