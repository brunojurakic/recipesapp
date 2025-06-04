"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, UtensilsCrossed, X } from "lucide-react"
import { signUp } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import {
  getCroatianErrorMessage,
  translateCommonErrors,
} from "@/lib/error-messages"

export default function SignUp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
            <CardTitle className="text-2xl">Otvorite račun</CardTitle>
            <CardDescription>
              Unesite svoje podatke kako biste otvorili račun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Ime</Label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="Ivan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Prezime</Label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Horvat"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Potvrda lozinke</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profilna slika (neobavezno)</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setImage(null)
                        setImagePreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full"
              disabled={loading}
              onClick={async () => {
                if (!firstName.trim()) {
                  toast.error("Ime je obavezno")
                  return
                }

                if (!lastName.trim()) {
                  toast.error("Prezime je obavezno")
                  return
                }

                if (password !== passwordConfirmation) {
                  toast.error("Lozinke se ne podudaraju")
                  return
                }
                await signUp.email({
                  email,
                  password,
                  name: `${firstName} ${lastName}`,
                  image: image ? await convertImageToBase64(image) : "",
                  callbackURL: "/",
                  fetchOptions: {
                    onResponse: () => setLoading(false),
                    onRequest: () => setLoading(true),
                    onError: (ctx) => {
                      const croatianMessage = ctx.error.code
                        ? getCroatianErrorMessage(
                            ctx.error.code,
                            ctx.error.message,
                          )
                        : translateCommonErrors(ctx.error.message)
                      toast.error(croatianMessage)
                      setLoading(false)
                    },
                    onSuccess: async () => router.push("/"),
                  },
                })
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              Stvori račun
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Već imate račun?</span>{" "}
              <Link href="/login" className="underline hover:text-primary">
                Prijava
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
