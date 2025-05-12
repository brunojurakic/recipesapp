"use client"

import { useState } from "react";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="relative h-screen w-full flex items-center justify-center">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-zinc-50 z-10" />


        {/* Login form */}
        <div className="relative z-20 w-full max-w-md px-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            {/* Logo and title */}
            <div className="flex flex-col items-center mb-8">
              <Link href={'/'} className="flex items-center gap-2">
                <UtensilsCrossed className="h-8 w-8 text-zinc-800" />
                <h1 className="text-3xl font-bold text-zinc-800">Recipe Share</h1>
              </Link>
              <p className="mt-2 text-zinc-600">Welcome back! Please sign in.</p>
            </div>

            {/* Login form */}
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className=" text-zinc-700 mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="text-zinc-700 mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={async () => {
                  await signIn.email(
                    { email, password, callbackURL: "/" },
                    {
                      onRequest: () => setLoading(true),
                      onSuccess: () => {
                        router.push("/");
                      },
                      onError: () => setLoading(false),
                    },
                  );
                }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/90 text-zinc-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-zinc-300 rounded-md shadow-sm text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={async () => {
                  await signIn.social(
                    { provider: "google", callbackURL: "/" },
                    {
                      onRequest: () => setLoading(true),
                      onSuccess: () => {
                        router.push("/");
                      },
                      onError: () => setLoading(false),
                    },
                  );
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 262">
                  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                </svg>
                Sign in with Google
              </button>

              <div className="text-center text-sm">
                <span className="text-zinc-600">Don&apos;t have an account?</span>
                {' '}
                <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-500">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}