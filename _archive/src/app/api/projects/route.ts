import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { Project } from "@/models";

// Pre-fill seed data matching agent.md guidelines
const INITIAL_PROJECTS = [
  {
    title: "SHEMAS: Smart Hall Energy Monitoring & Alert System",
    description:
      "An end-to-end IoT platform engineered for institutional energy monitoring. Incorporates real-time current/voltage telemetry, anomalous surge detection, automated relay controls, and SMS/push threshold alerts.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    techStack: ["IoT (ESP32)", "MQTT", "Node.js", "MongoDB", "Tailwind CSS", "Next.js"],
    githubLink: "https://github.com",
    liveLink: "https://shemas-demo.example.com",
  },
  {
    title: "FieldShift: CropWise AI / NASA Space Apps",
    description:
      "Developed for the NASA Space Apps Challenge to empower sustainable agriculture. Leverages satellite multispectral imagery and computer vision models to diagnose crop stressors, analyze soil moisture, and forecast yield potential.",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80",
    techStack: ["Python", "PyTorch", "NASA EarthData", "Next.js", "FastAPI", "Computer Vision"],
    githubLink: "https://github.com",
    liveLink: "https://cropwise-fieldshift.example.com",
  },
  {
    title: "AMANAT: Data Privacy & Security Framework",
    description:
      "A privacy-preserving data exchange architecture designed for sensitive enterprise and academic records. Implements client-side asymmetric encryption, role-based cryptographic access control, and tamper-evident audit logs.",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    techStack: ["Cryptography", "TypeScript", "Next.js", "Zero-Knowledge Proofs", "MongoDB"],
    githubLink: "https://github.com",
    liveLink: "https://amanat-framework.example.com",
  },
];

export async function GET() {
  try {
    await connectToDatabase();

    let projects = await Project.find().sort({ createdAt: -1 });

    // Seed database if empty so portfolio is instantly functional
    if (projects.length === 0) {
      await Project.insertMany(INITIAL_PROJECTS);
      projects = await Project.find().sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    // If DB is offline/unreachable in local test, return initial projects as fallback
    return NextResponse.json({
      success: true,
      data: INITIAL_PROJECTS,
      message: "Loaded from cache/fallback",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Please log in as admin." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, imageUrl, techStack, githubLink, liveLink } = body;

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Title, description, and image URL are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const formattedTechStack = Array.isArray(techStack)
      ? techStack
      : typeof techStack === "string"
      ? techStack.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const newProject = await Project.create({
      title,
      description,
      imageUrl,
      techStack: formattedTechStack,
      githubLink: githubLink || "",
      liveLink: liveLink || "",
    });

    return NextResponse.json(
      { success: true, data: newProject, message: "Project created successfully." },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create project.",
      },
      { status: 500 }
    );
  }
}
