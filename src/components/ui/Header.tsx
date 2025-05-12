"use client"

import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { except } from 'drizzle-orm/gel-core'

const Header = () => {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-zinc-900" />
            <span className="text-lg font-semibold text-zinc-900">RecipeShare</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 flex-1 justify-center">
            <Link href="/recipes" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Browse Recipes
            </Link>
            <Link href="/categories" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Categories
            </Link>
            <Link href="/featured" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Featured
            </Link>
          </nav>


          <div className="flex items-center gap-4">
            {!isPending && (session ? (
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
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header