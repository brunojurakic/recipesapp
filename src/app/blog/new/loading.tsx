import { Loader2 } from "lucide-react"

export default function BlogLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 flex flex-col items-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary mx-auto mb-4" />
        <span className="text-lg text-muted-foreground">
          Učitavanje novog bloga...
        </span>
      </div>
    </div>
  )
}
