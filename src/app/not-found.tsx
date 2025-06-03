import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileX, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 pt-25">
      <div className="text-center max-w-md w-full">
        <Card>
          <CardHeader className="">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FileX className="h-10 w-10 text-gray-600 dark:text-gray-400" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              404
            </CardTitle>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Stranica nije pronađena
            </h2>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Stranica koju tražite ne postoji ili je premještena.
            </p>

            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Početna stranica
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/recipes">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Svi recepti
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
