import { pgTable, text, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core";

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
  name: text('naziv').notNull().unique(),
  type: text('vrsta').notNull()
});

export const recipeIngredient = pgTable("Sadrzi_sastojak", {
  recipeId: uuid('id_recepta').notNull().references(() => recipe.id, { onDelete: 'cascade' }),
  ingredientId: uuid('id_sastojka').notNull().references(() => ingredient.id, { onDelete: 'cascade' }),
  unitId: uuid('id_jedinice').notNull().references(() => unit.id, { onDelete: 'restrict' }),
  quantity: text('kolicina').notNull()
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




export const schema = {user, session, account}