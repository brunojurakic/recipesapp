# 🥗 ReceptiNet

**ReceptiNet** je moderna web aplikacija za dijeljenje recepata izgrađena s Next.js 15. Korisnici mogu pretraživati, dodavati i ocjenjivati recepte, dok admini mogu moderirati sadržaj.

🌐 **Live Demo**: [receptinet.vercel.app](https://receptinet.vercel.app/)

## 🔧 Tech Stack

| Kategorija | Tehnologije                                                   |
| ---------- | ------------------------------------------------------------- |
| Frontend   | Next.js 15.3.2, React 19, TypeScript, Tailwind CSS, Shadcn/ui |
| Backend    | Next.js API Routes, Drizzle ORM, Zod, Better Auth             |
| Baza       | PostgreSQL (Neon Serverless)                                  |
| Storage    | Vercel Blob                                                   |
| Deploy     | Vercel                                                        |

## ✨ Funkcionalnosti

- 🔐 **Autentikacija** - Better Auth s profilima
- 🍽️ **Recepti** - CRUD, kategorije, alergeni, slike
- 🔍 **Pretraga** - Filtriranje po kategorijama i alergenima
- ⭐ **Recenzije** - Ocjenjivanje i komentari
- 🔒 **Admin** - Dashboard za moderaciju sadržaja
- 📱 **Responzivnost** - Radi na svim uređajima

## 🚀 Pokretanje

```bash
# kloniranje i instalacija projekta
git clone https://github.com/brunojurakicFER/recipesapp.git
cd recipesapp
npm install

# postavljanje .env varijabli
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
BLOB_READ_WRITE_TOKEN="..."

# pokretanje
npm run dev
```
