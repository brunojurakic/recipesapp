'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

export default function Error({ error, reset, }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-2xl font-semibold">Nešto je pošlo po zlu!</h2>
      <p className="text-muted-foreground">Učitavanje recepata nije uspjelo. Molimo pokušajte ponovno.</p>
      <Button onClick={reset} variant="outline">
        <RefreshCcw className="h-4 w-4" />
        Pokušaj ponovno
      </Button>
    </div>
  )
}
