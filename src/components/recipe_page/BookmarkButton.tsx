"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import { LoginDialog } from "@/components/common/LoginDialog";


interface BookmarkButtonProps {
  recipeId: string;
  onToggle?: (isBookmarked: boolean) => void;
  isInitialLoading?: boolean;
}


export function BookmarkButton({ recipeId, onToggle, isInitialLoading }: BookmarkButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await fetch(`/api/bookmarks?recipeId=${recipeId}`);
        if (!response.ok) {
          if (response.status === 401) {
            setIsLoggedIn(false);
            return;
          }
          throw new Error("Failed to check bookmark status");
        }
        setIsLoggedIn(true);
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    checkBookmarkStatus();
  }, [recipeId]);

  const handleClick = async () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    await toggleBookmark();
  };

  const toggleBookmark = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        body: JSON.stringify({ recipeId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setShowLoginDialog(true);
          return;
        }
        throw new Error("Failed to toggle bookmark");
      }

      const data = await response.json();
      setIsBookmarked(data.isBookmarked);
      onToggle?.(data.isBookmarked);
      router.refresh();

      toast.success(data.isBookmarked ? "Recept je spremljen" : "Recept je uklonjen iz spremljenih");
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Došlo je do greške pri spremanju recepta.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Spremanje...
          </>
        ) : (
          <>
            <Bookmark
              className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
            />
            {isBookmarked ? "Spremljeno" : "Spremi"}
          </>
        )}
      </Button>

      <LoginDialog
        isOpen={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        description="Za spremanje recepta potrebno je prijaviti se. Želite li se prijaviti?"
      />
    </>
  );
}
