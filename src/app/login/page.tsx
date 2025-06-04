"use client"

import { useState } from "react"
import { Loader2, UtensilsCrossed } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { getTranslatedError } from "@/lib/error-messages"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    if (!email.trim()) {
      toast.error("Email je obavezan")
      return
    }

    if (!password) {
      toast.error("Lozinka je obavezna")
      return
    }

    await signIn.email(
      { email, password, callbackURL: "/" },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          router.push("/")
        },
        onError: (ctx) => {
          setLoading(false)
          const croatianMessage = getTranslatedError(
            ctx.error.code,
            ctx.error.message,
          )
          toast.error(croatianMessage)
        },
      },
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex flex-col items-center mb-2">
              <Link href={"/"} className="flex items-center gap-2">
                <UtensilsCrossed className="h-8 w-8" />
                <h1 className="text-3xl font-bold">ReceptiNet</h1>
              </Link>
            </div>
            <CardTitle className="text-2xl">Prijava</CardTitle>
            <CardDescription>
              Unesite svoje podatke za pristup računu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ime@google.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full"
              disabled={loading}
              onClick={handleSignIn}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              Prijava
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Ili nastavite s
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={async () => {
                await signIn.social(
                  { provider: "google", callbackURL: "/" },
                  {
                    onRequest: () => setLoading(true),
                    onSuccess: () => {
                      router.push("/")
                    },
                    onError: () => setLoading(false),
                  },
                )
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 256 262"
                className="mr-2"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              Prijava putem Google-a
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Nemate račun?</span>{" "}
              <Link href="/signup" className="underline hover:text-primary">
                Registracija
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
