import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectDocument extends Document {
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Project image URL is required"],
    },
    techStack: {
      type: [String],
      required: [true, "At least one technology is required"],
      default: [],
    },
    githubLink: {
      type: String,
      trim: true,
      default: "",
    },
    liveLink: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProjectDocument> =
  mongoose.models.Project || mongoose.model<IProjectDocument>("Project", ProjectSchema);

export default Project;
