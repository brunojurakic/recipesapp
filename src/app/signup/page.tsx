"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, UtensilsCrossed, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="relative h-screen w-full flex items-center justify-center">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-zinc-50 z-10" />
        
        {/* Background image with blur */}
        <Image
          src="https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop"
          alt="Kitchen background"
          fill
          className="object-cover brightness-[0.85] blur-[3px] filter backdrop-blur-sm scale-105"
          priority
        />
        
        {/* Signup form */}
        <div className="relative z-20 w-full max-w-xl px-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            {/* Logo and title */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-8 w-8 text-zinc-800" />
                <h1 className="text-3xl font-bold text-zinc-800">Recipe Share</h1>
              </div>
              <p className="mt-2 text-zinc-600">Create your account to start sharing recipes</p>
            </div>

            <div className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-zinc-700">
                    First name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Max"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-zinc-700">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Robinson"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password fields */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-zinc-700">
                  Confirm Password
                </label>
                <input
                  id="password_confirmation"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </div>

              {/* Profile Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-zinc-700">
                  Profile Image (optional)
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="p-1 rounded-md hover:bg-zinc-100"
                      >
                        <X className="h-5 w-5 text-zinc-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={async () => {
                  if (password !== passwordConfirmation) {
                    toast.error("Passwords don't match");
                    return;
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
                        toast.error(ctx.error.message);
                        setLoading(false);
                      },
                      onSuccess: async () => router.push("/"),
                    },
                  });
                }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Create account"
                )}
              </button>

              {/* Sign in link */}
              <div className="text-center text-sm">
                <span className="text-zinc-600">Already have an account?</span>
                {' '}
                <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}