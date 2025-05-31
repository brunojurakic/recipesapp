import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/db/queries/user-queries";
import { getAllReviewsForAdmin, deleteReviewById } from "@/db/queries/review-queries";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || (currentUser.role?.name !== "Admin" && currentUser.role?.name !== "Moderator")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reviews = await getAllReviewsForAdmin();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || (currentUser.role?.name !== "Admin" && currentUser.role?.name !== "Moderator")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const success = await deleteReviewById(reviewId);

    if (!success) {
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
