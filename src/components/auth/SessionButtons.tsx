"use client"

import Link from "next/link"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const InteractiveHeader = () => {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  return (
    <div className="flex items-center gap-4" style={{ minWidth: "150px" }}>
      {isPending ? (
        <Loader2 className="animate-spin text-muted-foreground" />
      ) : session ? (
        <>
          <Link
            href="/profile"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Profil
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
          >
            Odjava
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Prijava
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Registracija
          </Link>
        </>
      )}
    </div>
  )
}

export default InteractiveHeader
