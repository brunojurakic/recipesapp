import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container max-w-7xl mx-auto flex justify-center items-center min-h-[80vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary"/>
        <p className="text-muted-foreground text-sm">Učitavanje recepta...</p>
      </div>
    </div>
  )
}
