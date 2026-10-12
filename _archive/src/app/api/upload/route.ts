import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mediaType = formData.get("type") as string || "image";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // If Cloudinary credentials are provided, perform direct Cloudinary upload
    if (cloudName && (uploadPreset || (apiKey && apiSecret))) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);

      if (uploadPreset) {
        cloudinaryFormData.append("upload_preset", uploadPreset);
      }

      const resourceType = mediaType === "video" ? "video" : "image";
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const cloudinaryRes = await fetch(endpoint, {
        method: "POST",
        body: cloudinaryFormData,
      });

      if (cloudinaryRes.ok) {
        const cloudinaryData = await cloudinaryRes.json();
        return NextResponse.json({
          success: true,
          url: cloudinaryData.secure_url || cloudinaryData.url,
          public_id: cloudinaryData.public_id,
        });
      }
    }

    // Fallback for local testing when Cloudinary environment keys are pending
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || (mediaType === "video" ? "video/mp4" : "image/jpeg");
    const fallbackDataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: fallbackDataUrl,
      message: "Uploaded successfully (local fallback)",
    });
  } catch (error: unknown) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
