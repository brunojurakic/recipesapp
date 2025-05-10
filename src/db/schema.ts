import { pgTable, text, timestamp, boolean, integer} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
});

export const recipe = pgTable("recipe", {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  servings: integer('servings').notNull(), // how many people
  preparationTime: integer('preparation_time').notNull(), // in minutes
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const category = pgTable("category", {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique()
});

export const recipeCategory = pgTable("recipe_category", {
  recipeId: text('recipe_id').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').notNull().references(() => category.id, { onDelete: 'cascade' })
});

export const ingredient = pgTable("ingredient", {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique()
});

export const recipeIngredient = pgTable("recipe_ingredient", {
  recipeId: text('recipe_id').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  ingredientId: text('ingredient_id').notNull().references(() => ingredient.id, { onDelete: 'cascade' }),
  quantity: text('quantity').notNull(),
});

export const instruction = pgTable("instruction", {
  id: text('id').primaryKey(),
  recipeId: text('recipe_id').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  stepNumber: integer('step_number').notNull(),
  content: text('content').notNull()
});

export const review = pgTable("review", {
  id: text('id').primaryKey(),
  recipeId: text('recipe_id').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  content: text('content'),
  rating: integer('rating').notNull(), // 1-5
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const bookmark = pgTable("bookmark", {
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  recipeId: text('recipe_id').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull()
});

export const schema = {user, session, account, verification}