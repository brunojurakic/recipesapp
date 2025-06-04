"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { LoginDialog } from "@/components/common/LoginDialog"

interface BlogLikeButtonProps {
  blogId: string
  onToggle?: (isLiked: boolean) => void
  isInitialLoading?: boolean
}

export function BlogLikeButton({
  blogId,
  onToggle,
  isInitialLoading,
}: BlogLikeButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/blog-likes?blogId=${blogId}`)
        if (!response.ok) {
          if (response.status === 401) {
            setIsLoggedIn(false)
            return
          }
          throw new Error("Failed to check like status")
        }
        setIsLoggedIn(true)
        const data = await response.json()
        setIsLiked(data.isLiked)
      } catch (error) {
        console.error("Error checking like status:", error)
      }
    }

    checkLikeStatus()
  }, [blogId])

  const handleClick = async () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }
    await toggleLike()
  }

  const toggleLike = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/blog-likes", {
        method: "POST",
        body: JSON.stringify({ blogId }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setShowLoginDialog(true)
          return
        }
        throw new Error("Failed to toggle like")
      }

      const data = await response.json()
      setIsLiked(data.isLiked)
      onToggle?.(data.isLiked)
      router.refresh()

      toast.success(data.isLiked ? "Članak je lajkan" : "Lajk je uklonjen")
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Došlo je do greške pri lajkanju članka.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        className="w-full"
        disabled={isLoading || isInitialLoading}
      >
        {isLoading || isInitialLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Učitavanje...
          </>
        ) : (
          <>
            <Heart
              className={`mr-2 h-4 w-4 ${isLiked ? "fill-current text-red-500" : ""}`}
            />
            Sviđa mi se
          </>
        )}
      </Button>

      <LoginDialog
        isOpen={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        description="Za lajkanje članaka potrebno je prijaviti se. Želite li se prijaviti?"
      />
    </>
  )
}
