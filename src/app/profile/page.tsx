"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (!isPending && !session) {
    router.push("/login");
    return null;
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-zinc-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <div className="flex items-center space-x-8">
            <div className="relative h-32 w-32 rounded-full overflow-hidden">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name}'s profile picture`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-zinc-200 flex items-center justify-center">
                  <span className="text-4xl text-zinc-500">
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">{user.name}</h1>
              <p className="text-zinc-500">{user.email}</p>
              <p className="text-sm text-zinc-400 mt-1">
                Član od{" "}
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-zinc-500">Ukupno recepata</h3>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">0</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-zinc-500">Ukupno recenzija</h3>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">0</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-zinc-500">Spremljeni recepti</h3>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">0</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
          <Link
            href="/recipes/new"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800"
          >
            Stvori novi recept
          </Link>
          <Link
            href="/profile/settings"
            className="flex items-center justify-center px-4 py-2 border border-zinc-300 rounded-md shadow-sm text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50"
          >
            Uredi postavke profila
          </Link>
        </div>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">
            Nedavne aktivnosti
          </h2>
          <div className="bg-white shadow rounded-lg divide-y divide-zinc-200">
            <div className="p-6 text-center text-zinc-500">
              Nema nedavnih aktivnosti za prikaz
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
