import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/db/queries/user-queries"
import { updateCategorySchema } from "@/lib/schemas/admin"
import {
  getAllCategoriesWithCounts,
  createCategory,
  findCategoryByName,
  updateCategory,
  deleteCategory,
} from "@/db/queries/category-queries"
import { saveImage } from "@/lib/utils/functions"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 })
    }

    const categoriesWithCounts = await getAllCategoriesWithCounts()

    return NextResponse.json({ categories: categoriesWithCounts })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Greška prilikom dohvaćanja kategorija" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 })
    }

    const formData = await req.formData()
    const name = formData.get("name") as string
    const imageFile = formData.get("image") as File

    if (!name || !imageFile) {
      return NextResponse.json(
        { error: "Naziv i slika su obavezni" },
        { status: 400 },
      )
    }

    if (name.length < 2 || name.length > 30) {
      return NextResponse.json(
        { error: "Naziv mora biti između 2 i 30 znakova" },
        { status: 400 },
      )
    }

    const existingCategory = await findCategoryByName(name)
    if (existingCategory) {
      return NextResponse.json(
        { error: "Kategorija s ovim nazivom već postoji" },
        { status: 400 },
      )
    }

    const imageUrl = await saveImage(imageFile)
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Greška pri upload-u slike" },
        { status: 500 },
      )
    }

    const newCategory = await createCategory(name, imageUrl)

    return NextResponse.json({ category: newCategory })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Greška prilikom stvaranja kategorije" },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")

    if (!categoryId) {
      return NextResponse.json(
        { error: "ID kategorije je obavezan" },
        { status: 400 },
      )
    }

    const contentType = req.headers.get("content-type")
    let name: string
    let imageUrl: string | undefined

    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData()
      name = formData.get("name") as string
      const imageFile = formData.get("image") as File

      if (!name) {
        return NextResponse.json(
          { error: "Naziv je obavezan" },
          { status: 400 },
        )
      }

      if (name.length < 2 || name.length > 30) {
        return NextResponse.json(
          { error: "Naziv mora biti između 2 i 30 znakova" },
          { status: 400 },
        )
      }
      if (imageFile) {
        const uploadedImageUrl = await saveImage(imageFile)
        if (!uploadedImageUrl) {
          return NextResponse.json(
            { error: "Greška pri upload-u slike" },
            { status: 500 },
          )
        }
        imageUrl = uploadedImageUrl
      }
    } else {
      const body = await req.json()
      const validationResult = updateCategorySchema.safeParse(body)

      if (!validationResult.success) {
        const errorMessage =
          validationResult.error.errors[0]?.message || "Neispravni podaci"
        return NextResponse.json({ error: errorMessage }, { status: 400 })
      }

      name = validationResult.data.name!
    }

    const existingCategory = await findCategoryByName(name)
    if (existingCategory && existingCategory.id !== categoryId) {
      return NextResponse.json(
        { error: "Kategorija s ovim nazivom već postoji" },
        { status: 400 },
      )
    }
    const updatedCategory = await updateCategory(
      categoryId,
      name,
      imageUrl || undefined,
    )

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Kategorija nije pronađena" },
        { status: 404 },
      )
    }

    return NextResponse.json({ category: updatedCategory })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Greška prilikom ažuriranja kategorije" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")

    if (!categoryId) {
      return NextResponse.json(
        { error: "ID kategorije je obavezan" },
        { status: 400 },
      )
    }
    const deletedCategory = await deleteCategory(categoryId)

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Kategorija nije pronađena" },
        { status: 404 },
      )
    }

    return NextResponse.json({ category: deletedCategory })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Greška prilikom brisanja kategorije" },
      { status: 500 },
    )
  }
}
