# ReceptiNet

**ReceptiNet** is a modern web application for recipe sharing built with Next.js 15. Users can discover, post, and rate recipes, while administrators and moderators can moderate content.

**Live Demo**: [receptinet.vercel.app](https://receptinet.vercel.app/)

## Technology Stack

| Category   | Technologies                                                   |
| ---------- | ------------------------------------------------------------- |
| Web-app | Next.js 15.3.2, React 19, TypeScript, Tailwind CSS, Shadcn/ui, Drizzle ORM, Zod, Better Auth |
| Database   | PostgreSQL (Neon Serverless)                                  |
| File Storage    | Vercel Blob                                                   |
| Deployment | Vercel                                                        |

## Features

- **Authentication** - Better Auth with user profiles
- **Recipe Management** - Full CRUD operations, categories, allergens, and image uploads
- **Search & Filtering** - Filter recipes by categories, allergens, portions and more
- **Reviews & Ratings** - User rating system and comments
- **Admin Dashboard** - Content moderation and management
- **Responsive Design** - Optimized for all devices
- **Dark Mode** - Choose light or dark theme

## Local development

### Prerequisites

- Node.js 18+ 
- npm
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/brunojurakic/recipesapp.git
cd recipesapp

# Install dependencies
npm install

# Create a .env.local file with the following variables:
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
BLOB_READ_WRITE_TOKEN="..."

# Run the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

| Variable | Description |
| -------- | ----------- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for authentication |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
