import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import {
  user,
  verification,
  session,
  account,
  recipe,
  category,
  recipeCategory,
  ingredient,
  instruction,
  review,
  bookmark,
  allergy,
  recipeAllergy,
  userAllergy,
  role,
  unit
} from '@/db/schema';

export type User = InferSelectModel<typeof user>;
export type Verification = InferSelectModel<typeof verification>;
export type Session = InferSelectModel<typeof session>;
export type Account = InferSelectModel<typeof account>;
export type Recipe = InferSelectModel<typeof recipe>;
export type Category = InferSelectModel<typeof category>;
export type RecipeCategory = InferSelectModel<typeof recipeCategory>;
export type Ingredient = InferSelectModel<typeof ingredient>;
export type Instruction = InferSelectModel<typeof instruction>;
export type Review = InferSelectModel<typeof review>;
export type Bookmark = InferSelectModel<typeof bookmark>;
export type Allergy = InferSelectModel<typeof allergy>;
export type RecipeAllergy = InferSelectModel<typeof recipeAllergy>;
export type UserAllergy = InferSelectModel<typeof userAllergy>;
export type Role = InferSelectModel<typeof role>;
export type Unit = InferSelectModel<typeof unit>;

export type InsertUser = InferInsertModel<typeof user>;
export type InsertVerification = InferInsertModel<typeof verification>;
export type InsertSession = InferInsertModel<typeof session>;
export type InsertAccount = InferInsertModel<typeof account>;
export type InsertRecipe = InferInsertModel<typeof recipe>;
export type InsertCategory = InferInsertModel<typeof category>;
export type InsertRecipeCategory = InferInsertModel<typeof recipeCategory>;
export type InsertIngredient = InferInsertModel<typeof ingredient>;
export type InsertInstruction = InferInsertModel<typeof instruction>;
export type InsertReview = InferInsertModel<typeof review>;
export type InsertBookmark = InferInsertModel<typeof bookmark>;
export type InsertAllergy = InferInsertModel<typeof allergy>;
export type InsertRecipeAllergy = InferInsertModel<typeof recipeAllergy>;
export type InsertUserAllergy = InferInsertModel<typeof userAllergy>;
export type InsertRole = InferInsertModel<typeof role>;
export type InsertUnit = InferInsertModel<typeof unit>;

export type RecipeWithUser = Recipe & {
  user: {
    name: string | null;
  };
};

export type RecipeWithCategories = Recipe & {
  categories: Array<{
    category: {
      id: string;
      name: string;
    };
  }>;
};

export type RecipeWithUserAndCategories = Recipe & {
  user: {
    name: string | null;
  };
  categories: Array<{
    category: {
      id: string;
      name: string;
    };
  }>;
};

export type RecipeWithAllergies = Recipe & {
  allergies: Array<{
    allergy: {
      id: string;
      name: string;
    };
  }>;
};

export type RecipeWithIngredients = Recipe & {
  ingredients: Array<Ingredient & {
    unit: Unit;
  }>;
};

export type RecipeWithInstructions = Recipe & {
  instructions: Instruction[];
};

export type RecipeWithReviews = Recipe & {
  reviews: Array<Review & {
    user: {
      name: string | null;
    };
  }>;
};

export type RecipeFull = Recipe & {
  user: {
    name: string | null;
  };
  categories: Array<{
    category: Category;
  }>;
  allergies: Array<{
    allergy: Allergy;
  }>;
  ingredients: Array<Ingredient & {
    unit: Unit;
  }>;
  instructions: Instruction[];
  reviews: Array<Review & {
    user: {
      name: string | null;
    };
  }>;
};

export type BookmarkWithRecipe = Bookmark & {
  recipe: RecipeWithUserAndCategories;
};

export type UserWithAllergies = User & {
  allergies: Array<{
    allergy: Allergy;
  }>;
};

export type ReviewWithUser = Review & {
  user: {
    name: string | null;
    image?: string | null;
  };
};

export type IngredientWithUnit = Ingredient & {
  unit: Unit;
};

export type CreateRecipeData = Omit<InsertRecipe, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRecipeData = Partial<Omit<InsertRecipe, 'id' | 'userId' | 'createdAt'>>;

export type CreateReviewData = Omit<InsertReview, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateReviewData = Partial<Omit<InsertReview, 'id' | 'userId' | 'recipeId' | 'createdAt'>>;

export type CreateIngredientData = Omit<InsertIngredient, 'id'>;
export type CreateInstructionData = Omit<InsertInstruction, 'id'>;

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}>;

export type RecipeSearchFilters = {
  query?: string;
  categories?: string[];
  allergies?: string[];
  minServings?: number;
  maxServings?: number;
  maxPreparationTime?: number;
  userId?: string;
};

export type RecipeSortOption = 'newest' | 'oldest' | 'title_asc' | 'title_desc' | 'prep_time_asc' | 'prep_time_desc';
