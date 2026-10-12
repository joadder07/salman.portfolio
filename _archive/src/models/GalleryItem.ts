import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryItemDocument extends Document {
  title: string;
  mediaUrl: string;
  type: "image" | "video";
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItemDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: [true, "Media URL is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GalleryItem: Model<IGalleryItemDocument> =
  mongoose.models.GalleryItem ||
  mongoose.model<IGalleryItemDocument>("GalleryItem", GalleryItemSchema);

export default GalleryItem;
