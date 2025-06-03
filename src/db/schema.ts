import { pgTable, text, timestamp, boolean, integer, uuid, check, real } from "drizzle-orm/pg-core";
import { relations, sql } from 'drizzle-orm';

export const user = pgTable("Korisnik", {
  id: text('id_korisnika').primaryKey(),
  name: text('ime').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verificiran').notNull(),
  image: text('profilna_slika'),
  roleId: uuid('id_uloge').references(() => role.id, { onDelete: 'set null' }),
  createdAt: timestamp('datum_kreiranja').notNull(),
  updatedAt: timestamp('datum_azuriranja').notNull()
}, (table) => [
  check('name_length', sql`length(${table.name}) >= 2 AND length(${table.name}) <= 50`),
  check('email_format', sql`${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'`),
  check('created_before_updated', sql`${table.createdAt} <= ${table.updatedAt}`)
]);

export const verification = pgTable("OauthVerifikacija", {
  id: text('id_oauth').primaryKey(),
  identifier: text('identifikator').notNull(),
  value: text('vrijednost').notNull(),
  expiresAt: timestamp('vrijedi_do').notNull(),
  createdAt: timestamp('datum_kreiranja').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('datum_azuriranja').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const session = pgTable("Sjednica", {
  id: text('id_sjednice').primaryKey(),
  expiresAt: timestamp('vrijedi_do').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('datum_kreiranja').notNull(),
  updatedAt: timestamp('datum_azuriranja').notNull(),
  ipAddress: text('ip_adresa'),
  userAgent: text('korisnicki_agent'),
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' })
}, (table) => [
  check('expires_in_future', sql`${table.expiresAt} > ${table.createdAt}`),
  check('created_before_updated', sql`${table.createdAt} <= ${table.updatedAt}`)
]);

export const account = pgTable("Racun", {
  id: text('id_racuna').primaryKey(),
  accountId: text('racun_putem_pruzatelja').notNull(),
  providerId: text('ime_pruzatelja_autentifikacije').notNull(),
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('token_pristupa'),
  refreshToken: text('token_osvjezavanja'),
  idToken: text('token'),
  accessTokenExpiresAt: timestamp('token_pristupa_istice'),
  refreshTokenExpiresAt: timestamp('token_osvjezavanja_istice'),
  scope: text('scope'),
  password: text('hash_lozinke'),
  createdAt: timestamp('datum_kreiranja').notNull(),
  updatedAt: timestamp('datum_azuriranja').notNull()
});

export const recipe = pgTable("Recept", {
  id: uuid('id_recepta').defaultRandom().primaryKey(),
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('naslov').notNull(),
  description: text('opis').notNull(),
  image_path: text('path_do_slike').notNull(),
  servings: integer('porcije').notNull(),
  preparationTime: integer('vrijeme_pripreme').notNull(),
  createdAt: timestamp('datum_kreiranja').notNull(),
  updatedAt: timestamp('datum_azuriranja').notNull()
}, (table) => [
  check('servings_positive', sql`${table.servings} > 0`),
  check('preparation_time_positive', sql`${table.preparationTime} > 0`),
  check('title_length', sql`length(${table.title}) >= 3 AND length(${table.title}) <= 100`),
  check('description_length', sql`length(${table.description}) >= 10`),
  check('created_before_updated', sql`${table.createdAt} <= ${table.updatedAt}`)
]);

export const category = pgTable("KategorijaJela", {
  id: uuid('id_kategorije').defaultRandom().primaryKey(),
  name: text('naziv').notNull().unique(),
  image_path: text('url_slike').notNull()
}, (table) => [
  check('name_length', sql`length(${table.name}) >= 2 AND length(${table.name}) <= 30`)
]);

export const recipeCategory = pgTable("Pripada_kategoriji", {
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  categoryId: uuid('id_kategorije').notNull().references(() => category.id, { onDelete: 'cascade' })
});

export const ingredient = pgTable("Sastojak", {
  id: uuid('id_sastojka').defaultRandom().primaryKey(),
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  name: text('naziv').notNull(),
  quantity: real('kolicina').notNull(),
  unitId: uuid('id_jedinice').notNull().references(() => unit.id, { onDelete: 'restrict' }),
}, (table) => [
  check('name_length', sql`length(${table.name}) >= 2 AND length(${table.name}) <= 50`),
  check('quantity_positive', sql`${table.quantity} > 0`)
]);

export const instruction = pgTable("Uputa", {
  id: uuid('id_upute').defaultRandom().primaryKey(),
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  stepNumber: integer('korak').notNull(),
  content: text('sadrzaj').notNull()
}, (table) => [
  check('step_number_positive', sql`${table.stepNumber} > 0`),
  check('content_length', sql`length(${table.content}) >= 5`)
]);

export const review = pgTable("Recenzija", {
  id: uuid('id_recenzije').defaultRandom().primaryKey(),
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  content: text('sadrzaj').notNull(),
  rating: integer('ocjena').notNull(),
  createdAt: timestamp('datum_kreiranja').notNull(),
  updatedAt: timestamp('datum_azuriranja').notNull()
}, (table) => [
  check('rating_range', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  check('content_length', sql`length(${table.content}) >= 10`),
  check('created_before_updated', sql`${table.createdAt} <= ${table.updatedAt}`)
]);

export const bookmark = pgTable("Oznacio", {
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  createdAt: timestamp('datum_kreiranja').notNull()
});

export const allergy = pgTable("Alergija", {
  id: uuid('id_alergije').defaultRandom().primaryKey(),
  name: text('naziv').notNull().unique()
}, (table) => [
  check('name_length', sql`length(${table.name}) >= 2 AND length(${table.name}) <= 30`)
]);

export const recipeAllergy = pgTable("SadrziAlergiju", {
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  allergyId: uuid('id_alergije').notNull().references(() => allergy.id, { onDelete: 'cascade' })
});

export const userAllergy = pgTable("KorisnikAlergija", {
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  allergyId: uuid('id_alergije').notNull().references(() => allergy.id, { onDelete: 'cascade' })
});

export const role = pgTable("Uloga", {
  id: uuid("id_uloge").defaultRandom().primaryKey(),
  name: text("naziv").notNull().unique(),
  description: text("opis")
}, (table) => [
  check('name_length', sql`length(${table.name}) >= 2 AND length(${table.name}) <= 20`),
  check('description_length', sql`${table.description} IS NULL OR length(${table.description}) >= 5`)
]);

export const unit = pgTable("MjernaJedinica", {
  id: uuid("id_jedinice").defaultRandom().primaryKey(),
  name: text("naziv").notNull().unique(),
  abbreviation: text("kratica").notNull(),
  type: text("tip").notNull()
}, (table) => [
  check('name_length', sql`length(${table.name}) >= 2 AND length(${table.name}) <= 30`),
  check('abbreviation_length', sql`length(${table.abbreviation}) >= 1 AND length(${table.abbreviation}) <= 10`),
  check('type_length', sql`length(${table.type}) >= 2 AND length(${table.type}) <= 20`)
]);

export const blog = pgTable("Blog", {
  id: uuid('id_bloga').defaultRandom().primaryKey(),
  name: text('naziv').notNull(),
  description: text('opis').notNull(),
  content: text('sadrzaj').notNull(),
  imagePath: text('url_slike').notNull(),
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  viewCount: integer('broj_pregleda').notNull().default(0),
  likeCount: integer('broj_lajkova').notNull().default(0),
  createdAt: timestamp('datum_kreiranja').notNull(),
  updatedAt: timestamp('datum_azuriranja').notNull()
}, (table) => [
  check('name_length', sql`length(${table.name}) >= 3 AND length(${table.name}) <= 100`),
  check('description_length', sql`length(${table.description}) >= 10 AND length(${table.description}) <= 500`),
  check('content_length', sql`length(${table.content}) >= 50`),
  check('view_count_non_negative', sql`${table.viewCount} >= 0`),
  check('like_count_non_negative', sql`${table.likeCount} >= 0`),
  check('created_before_updated', sql`${table.createdAt} <= ${table.updatedAt}`)
]);

export const blogLike = pgTable("LajakoBlog", {
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  blogId: uuid('id_bloga').notNull().references(() => blog.id, { onDelete: 'cascade' }),
  createdAt: timestamp('datum_kreiranja').notNull()
});

export const userRelations = relations(user, ({ one, many }) => ({
  recipes: many(recipe),
  reviews: many(review),
  bookmarks: many(bookmark),
  allergies: many(userAllergy),
  blogs: many(blog),
  blogLikes: many(blogLike),
  role: one(role, {
    fields: [user.roleId],
    references: [role.id],
  }),
}));

export const recipeRelations = relations(recipe, ({ one, many }) => ({
  user: one(user, {
    fields: [recipe.userId],
    references: [user.id],
  }),
  categories: many(recipeCategory),
  allergies: many(recipeAllergy),
  instructions: many(instruction),
  ingredients: many(ingredient),
  reviews: many(review),
  bookmarks: many(bookmark),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  recipes: many(recipeCategory),
}));

export const recipeCategoryRelations = relations(recipeCategory, ({ one }) => ({
  recipe: one(recipe, {
    fields: [recipeCategory.recipeId],
    references: [recipe.id],
  }),
  category: one(category, {
    fields: [recipeCategory.categoryId],
    references: [category.id],
  }),
}));

export const allergyRelations = relations(allergy, ({ many }) => ({
  recipes: many(recipeAllergy),
  users: many(userAllergy),
}));

export const recipeAllergyRelations = relations(recipeAllergy, ({ one }) => ({
  recipe: one(recipe, {
    fields: [recipeAllergy.recipeId],
    references: [recipe.id],
  }),
  allergy: one(allergy, {
    fields: [recipeAllergy.allergyId],
    references: [allergy.id],
  }),
}));

export const instructionRelations = relations(instruction, ({ one }) => ({
  recipe: one(recipe, {
    fields: [instruction.recipeId],
    references: [recipe.id],
  }),
}));

export const ingredientRelations = relations(ingredient, ({ one }) => ({
  recipe: one(recipe, {
    fields: [ingredient.recipeId],
    references: [recipe.id],
  }),
  unit: one(unit, {
    fields: [ingredient.unitId],
    references: [unit.id],
  }),
}));

export const unitRelations = relations(unit, ({ many }) => ({
  ingredients: many(ingredient),
}));

export const reviewRelations = relations(review, ({ one }) => ({
  recipe: one(recipe, {
    fields: [review.recipeId],
    references: [recipe.id],
  }),
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
}));

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  recipe: one(recipe, {
    fields: [bookmark.recipeId],
    references: [recipe.id],
  }),
  user: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
}));

export const userAllergyRelations = relations(userAllergy, ({ one }) => ({
  user: one(user, {
    fields: [userAllergy.userId],
    references: [user.id],
  }),
  allergy: one(allergy, {
    fields: [userAllergy.allergyId],
    references: [allergy.id],
  }),
}));

export const roleRelations = relations(role, ({ many }) => ({
  users: many(user),
}));

export const blogRelations = relations(blog, ({ one, many }) => ({
  user: one(user, {
    fields: [blog.userId],
    references: [user.id],
  }),
  likes: many(blogLike),
}));

export const blogLikeRelations = relations(blogLike, ({ one }) => ({
  blog: one(blog, {
    fields: [blogLike.blogId],
    references: [blog.id],
  }),
  user: one(user, {
    fields: [blogLike.userId],
    references: [user.id],
  }),
}));

export const schema = { user, session, account, verification }