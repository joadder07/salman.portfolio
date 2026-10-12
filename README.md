# 🌟 Decoupled Personal Portfolio & Admin Dashboard

A dynamic, themeable personal portfolio website with an admin dashboard built with a strictly decoupled architecture.

## 📁 Repository Structure

```
website/
├── backend/                  # Node.js + Express + Prisma + Neon PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma     # 11 models: User, Education, Photography, Video, Hobby, Pet, Book, Achievement, Comment, Message, SiteSettings
│   │   └── seed.ts           # Admin user & default site settings seed script
│   └── src/
│       ├── config/           # DB, Cloudinary, Env validation (Zod)
│       ├── controllers/      # REST API Controllers
│       ├── helpers/          # API response, error classes, pagination
│       ├── middlewares/      # JWT auth, Zod validation, Multer upload, Error handler
│       ├── models/           # Prisma client models
│       ├── routes/           # RESTful modular routes
│       ├── services/         # Business logic & Prisma queries
│       ├── validators/       # Zod schemas for input validation
│       ├── app.ts            # Express 5 app setup
│       └── server.ts         # Server entry point
├── frontend/                 # React + Vite + TypeScript (SPA)
│   ├── src/
│   │   ├── api/              # Axios client with interceptors + TanStack Query hooks
│   │   ├── assets/           # Images & static assets
│   │   ├── components/       # shadcn/ui & 24devs modular components
│   │   ├── hooks/            # useAuth, useTheme, useMusicPlayer
│   │   ├── pages/            # Public & Admin pages
│   │   ├── routes/           # React Router & ProtectedRoute
│   │   ├── themes/           # Multi-theme CSS variable engine
│   │   ├── utils/            # cn helper, formatters
│   │   └── validators/       # Frontend validation schemas
└── _archive/                 # Archived legacy monolithic codebase
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your Neon DATABASE_URL, JWT_SECRET, and Cloudinary credentials in .env
```

Generate Prisma Client & push schema to your Neon DB:
```bash
npx prisma db push
npm run seed              # Seeds initial admin and default site settings
npm run dev               # Starts API on http://localhost:4000
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev               # Starts Vite dev server on http://localhost:5173
```

---

## 🛡️ Security & Features

- **Stateless JWT Auth:** Access token (15m) + secure httpOnly Refresh token cookie (7d).
- **Password Hashing:** `bcrypt` with 12 salt rounds.
- **Neon Serverless PostgreSQL:** Fast, autoscaling relational database powered by Prisma ORM.
- **Cloudinary Media Uploads:** Direct buffer uploads for photos, videos, and music.
- **Comment Moderation:** Public submissions default to `PENDING` until approved by admin.
- **Direct & Anonymous Messages:** Anonymous submissions display an 'Anonymous' label in the admin inbox.
- **Global Floating Music Player:** Persistent audio playback uninterrupted across page navigations.
- **Dynamic Theming:** Visitor-level theme selection overriding admin defaults.
