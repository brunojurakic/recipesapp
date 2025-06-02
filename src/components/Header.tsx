import Link from 'next/link'
import { UtensilsCrossed, Shield } from 'lucide-react'
import SessionButtons from './auth/SessionButtons'
import { MobileMenu } from './MobileMenu'
import { auth } from '@/lib/auth'
import { getCurrentUser } from '@/db/queries/user-queries'
import { headers } from 'next/headers'

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const currentUser = session ? await getCurrentUser() : null
  const isAdmin = currentUser?.role?.name === "Admin"
  const isModerator = currentUser?.role?.name === "Moderator"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-zinc-900" />
            <span className="text-lg font-semibold text-zinc-900">ReceptiNet</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 flex-1 justify-center">
            <Link href="/recipes" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Recepti
            </Link>
            <Link href="/categories" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Kategorije
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            {isModerator && !isAdmin && (
              <Link href="/moderator" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1">
                <Shield className="h-4 w-4 text-black" />
                Moderator
              </Link>
            )}
          </nav>

          <div className="hidden sm:flex">
            <SessionButtons />
          </div>

          <div className="flex sm:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header