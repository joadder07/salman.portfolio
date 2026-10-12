# Personal Portfolio Website - Project Guidelines

## 1. Tech Stack
*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS + Framer Motion (for smooth animations)
*   **Database:** MongoDB (using Mongoose)
*   **Authentication:** NextAuth.js (for securing the Admin Dashboard)
*   **Media Storage:** Cloudinary (for uploading photos/videos)
*   **Icons:** Lucide-react or React Icons

## 2. Core Features & Architecture
The website will have two main parts: the Public View and the Admin Dashboard.

### A. Public View (Pages)
*   **Hero Section:** Professional greeting, profile picture, and a short bio emphasizing research and tech skills.
*   **About Me:** 
    *   Education: Daffodil International University (DIU).
    *   Affiliation: IntelliNova Research Team (INRT).
*   **Projects Section (Dynamic):** Display project cards with images, titles, descriptions, and links. Example pre-fill data:
    *   *SHEMAS:* Smart Hall Energy Monitoring & Alert System (IoT).
    *   *FieldShift:* CropWise AI / NASA Space Apps project.
    *   *AMANAT:* Data Privacy Framework.
*   **Gallery Section (Dynamic):** Masonry or grid layout for photos and embedded videos from events/hackathons.
*   **Contact Section:** A working contact form that saves messages to the database, plus social links (LinkedIn, GitHub).

### B. Admin Dashboard (Protected Route: `/admin`)
*   Only accessible via secure login.
*   **Manage Projects:** CRUD (Create, Read, Update, Delete) operations for projects.
*   **Manage Gallery:** Upload new images/videos (integrated with Cloudinary) and delete old ones.
*   **View Messages:** Read messages submitted through the public contact form.

## 3. Database Models (Mongoose Schemas)
Please create the following schemas in the `models` directory:
1.  **Project:** `{ title, description, imageUrl, techStack, githubLink, liveLink, createdAt }`
2.  **GalleryItem:** `{ title, mediaUrl, type (image/video), createdAt }`
3.  **Message:** `{ name, email, message, createdAt }`

## 4. AI Coding Instructions & Rules
*   **Step-by-Step Execution:** Do not generate the whole project at once. Build the UI first, then the API routes, then integrate MongoDB.
*   **Design Aesthetic:** Use a modern, dark/light mode toggle, clean typography, and subtle hover animations using Framer Motion.
*   **API Routes:** Use Next.js Route Handlers (`app/api/...`) for backend logic.
*   **Language:** The UI will be in English, but keep support for Bangla fonts (like Noto Sans Bengali) in case Bangla text is added later.