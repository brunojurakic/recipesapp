import { pgTable, text, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const user = pgTable("Korisnik", {
  id: text('id_korisnika').primaryKey(),
  name: text('ime').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verificiran').notNull(),
  image: text('profilna_slika'),
  roleId: uuid('id_uloge').references(() => role.id, { onDelete: 'set null' }),
  createdAt: timestamp('datum_kreiranja').notNull(),
  updatedAt: timestamp('datum_azuriranja').notNull()
});

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
});

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
});

export const category = pgTable("KategorijaJela", {
  id: uuid('id_kategorije').defaultRandom().primaryKey(),
  name: text('naziv').notNull().unique()
});

export const recipeCategory = pgTable("Pripada_kategoriji", {
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  categoryId: uuid('id_kategorije').notNull().references(() => category.id, { onDelete: 'cascade' })
});

export const ingredient = pgTable("Sastojak", {
  id: uuid('id_sastojka').defaultRandom().primaryKey(),
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  name: text('naziv').notNull(),
  quantity: text('kolicina').notNull(),
  unitId: uuid('id_jedinice').notNull().references(() => unit.id, { onDelete: 'restrict' }),
});

export const instruction = pgTable("Uputa", {
  id: uuid('id_upute').defaultRandom().primaryKey(),
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  stepNumber: integer('korak').notNull(),
  content: text('sadrzaj').notNull()
});

export const review = pgTable("Recenzija", {
  id: uuid('id_recenzije').defaultRandom().primaryKey(),
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  content: text('sadrzaj'),
  rating: integer('ocjena').notNull(), // 1-5
  createdAt: timestamp('datum_kreiranja').notNull(),
  updatedAt: timestamp('datum_azuriranja').notNull()
});

export const bookmark = pgTable("Oznacio", {
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  createdAt: timestamp('datum_kreiranja').notNull()
});

export const allergy = pgTable("Alergija", {
  id: uuid('id_alergije').defaultRandom().primaryKey(),
  name: text('naziv').notNull().unique()
});

export const recipeAllergy = pgTable("SadrziAlergiju", {
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  allergyId: uuid('id_alergije').notNull().references(() => allergy.id, { onDelete: 'cascade' })
});

export const userAllergy = pgTable("KorisnikAlergija", {
  userId: text('id_korisnika').notNull().references(() => user.id, { onDelete: 'cascade' }),
  allergyId: uuid('id_alergije').notNull().references(() => allergy.id, { onDelete: 'cascade' }),
  createdAt: timestamp('datum_kreiranja').notNull()
});

export const role = pgTable("Uloga", {
  id: uuid("id_uloge").defaultRandom().primaryKey(),
  name: text("naziv").notNull().unique(),
  description: text("opis")
});

export const unit = pgTable("MjernaJedinica", {
  id: uuid("id_jedinice").defaultRandom().primaryKey(),
  name: text("naziv").notNull().unique(),
  abbreviation: text("kratica").notNull(),
  type: text("tip").notNull()
});

export const userRelations = relations(user, ({ many }) => ({
  recipes: many(recipe),
  reviews: many(review),
  bookmarks: many(bookmark),
  allergies: many(userAllergy),
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

export const schema = { user, session, account, verification }