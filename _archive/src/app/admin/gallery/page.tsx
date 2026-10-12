"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Play,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Video,
} from "lucide-react";
import { IGalleryItem } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminGalleryPage() {
  const { status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form
  const [formData, setFormData] = useState({
    title: "",
    mediaUrl: "",
    type: "image" as "image" | "video",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setItems(data.data || []);
      }
    } catch {
      setNotification({ type: "error", text: "Failed to load gallery items." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadGallery();
    }
  }, [status]);

  const handleOpenCreateModal = () => {
    setFormData({
      title: "",
      mediaUrl: "",
      type: "image",
    });
    setModalError("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setModalError("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("type", formData.type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload media.");
      }

      setFormData((prev) => ({ ...prev, mediaUrl: data.url }));
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.mediaUrl) {
      setModalError("Title and media URL are required.");
      return;
    }

    setIsSubmitting(true);
    setModalError("");

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save item.");
      }

      setIsModalOpen(false);
      setNotification({ type: "success", text: "Gallery media item added successfully!" });
      loadGallery();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to add item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this media item?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete item.");
      }

      setNotification({ type: "success", text: "Item deleted successfully!" });
      loadGallery();
    } catch (err) {
      setNotification({
        type: "error",
        text: err instanceof Error ? err.message : "Delete failed.",
      });
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" />
            <span>Manage Gallery Media</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload photos and videos from hackathons, DIU events, and research labs
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 hover:opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Media Item</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="hover:opacity-75 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All Items ({items.length})
        </button>
        <button
          onClick={() => setFilter("image")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === "image"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Photos ({items.filter((i) => i.type === "image").length})
        </button>
        <button
          onClick={() => setFilter("video")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filter === "video"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Videos ({items.filter((i) => i.type === "video").length})
        </button>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-mono">Loading media gallery...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-3">
          <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto stroke-1" />
          <p className="text-sm font-semibold text-foreground">No media items found</p>
          <p className="text-xs text-muted-foreground">
            Upload images or embed videos from your latest achievements and conferences.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id || item.title}
              className="group rounded-3xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                  {item.type === "video" ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                        Video
                      </span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md transition-colors cursor-pointer"
                    title="Delete Media Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-bold text-foreground line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-border/50 mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="capitalize text-[11px] font-semibold flex items-center gap-1">
                  {item.type === "video" ? <Video className="w-3 h-3 text-red-500" /> : <ImageIcon className="w-3 h-3 text-blue-500" />}
                  <span>{item.type}</span>
                </span>
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline font-mono"
                >
                  Source Link
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-lg w-full rounded-3xl border border-border bg-card shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                Add Media to Gallery
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                  Title / Event Caption *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NASA Space Apps Presentation Session"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                  Media Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value="image"
                      checked={formData.type === "image"}
                      onChange={() => setFormData({ ...formData, type: "image" })}
                    />
                    <span>Photo / Image</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value="video"
                      checked={formData.type === "video"}
                      onChange={() => setFormData({ ...formData, type: "video" })}
                    />
                    <span>Video (Embed / MP4)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                  Media URL or File Upload *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder={
                      formData.type === "video"
                        ? "https://www.youtube.com/embed/... or Cloudinary video URL"
                        : "https://images.unsplash.com/... or Cloudinary image URL"
                    }
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground cursor-pointer shrink-0">
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{isUploading ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept={formData.type === "video" ? "video/*" : "image/*"}
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Supports Cloudinary direct file uploads or embedded YouTube / external media URLs.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Media</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
