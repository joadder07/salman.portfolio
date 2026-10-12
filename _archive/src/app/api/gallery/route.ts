import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { GalleryItem } from "@/models";

const INITIAL_GALLERY = [
  {
    title: "NASA Space Apps Challenge Hackathon Presentation",
    mediaUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    type: "image",
  },
  {
    title: "IoT Hardware Prototyping & Sensor Calibration Lab",
    mediaUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    type: "image",
  },
  {
    title: "IntelliNova Research Team (INRT) Brainstorming Session",
    mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    type: "image",
  },
  {
    title: "Daffodil International University (DIU) Tech Carnival",
    mediaUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    type: "image",
  },
  {
    title: "SHEMAS Energy Monitoring Demo & Live Telemetry",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "video",
  },
  {
    title: "AI & Embedded Machine Learning Workshop",
    mediaUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    type: "image",
  },
];

export async function GET() {
  try {
    await connectToDatabase();

    let items = await GalleryItem.find().sort({ createdAt: -1 });

    if (items.length === 0) {
      await GalleryItem.insertMany(INITIAL_GALLERY);
      items = await GalleryItem.find().sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({
      success: true,
      data: INITIAL_GALLERY,
      message: "Loaded from cache/fallback",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, mediaUrl, type } = body;

    if (!title || !mediaUrl) {
      return NextResponse.json(
        { success: false, error: "Title and media URL are required." },
        { status: 400 }
      );
    }

    const validatedType = type === "video" ? "video" : "image";

    await connectToDatabase();

    const newItem = await GalleryItem.create({
      title,
      mediaUrl,
      type: validatedType,
    });

    return NextResponse.json(
      { success: true, data: newItem, message: "Gallery item added successfully." },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add gallery item.",
      },
      { status: 500 }
    );
  }
}
