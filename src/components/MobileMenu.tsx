"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import {
  UtensilsCrossed,
  Menu,
  User,
  LogOut,
  LogIn,
  UserPlus,
  BookOpen,
  Home,
  Tag,
  Shield,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isModerator, setIsModerator] = useState(false)
  const checkedSessionRef = useRef<string | null>(null)
  useEffect(() => {
    const checkAccess = async () => {
      if (session?.user?.id && checkedSessionRef.current !== session.user.id) {
        checkedSessionRef.current = session.user.id
        try {
          const adminRes = await fetch("/api/admin/check")
          const adminData = await adminRes.json()
          setIsAdmin(Boolean(adminData.hasAdminAccess))

          if (!adminData.hasAdminAccess) {
            const modRes = await fetch("/api/moderator/check")
            const modData = await modRes.json()
            setIsModerator(modRes.ok && Boolean(modData.user))
          } else {
            setIsModerator(false)
          }
        } catch {
          setIsAdmin(false)
          setIsModerator(false)
        }
      } else if (!session) {
        setIsAdmin(false)
        setIsModerator(false)
        checkedSessionRef.current = null
      }
    }

    checkAccess()
  }, [session])

  const handleSignOut = async () => {
    setOpen(false)
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Otvori izbornik</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="text-left border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            ReceptiNet
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-6">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              <Home className="h-4 w-4" />
              Početna stranica
            </Link>
            <Link
              href="/recipes"
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              Recepti
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              <Tag className="h-4 w-4" />
              Kategorije
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              Blog
            </Link>
            {session && isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            {session && isModerator && !isAdmin && (
              <Link
                href="/moderator"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Moderator
              </Link>
            )}
          </nav>
        </div>

        <SheetFooter className="flex flex-col space-y-4 border-t pt-4">
          {isPending ? (
            <div className="flex justify-center">
              <svg
                className="animate-spin h-5 w-5 text-muted-foreground"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : session ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4" />
                Profil
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors text-left w-full"
              >
                <LogOut className="h-4 w-4" />
                Odjava
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                Prijava
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <UserPlus className="h-4 w-4" />
                Registracija
              </Link>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
