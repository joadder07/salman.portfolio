export interface IProject {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IGalleryItem {
  _id?: string;
  title: string;
  mediaUrl: string;
  type: "image" | "video";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IMessage {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string | Date;
  isRead?: boolean;
}

export interface IUser {
  _id?: string;
  email: string;
  password?: string;
  name?: string;
  role?: string;
  createdAt?: string | Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
