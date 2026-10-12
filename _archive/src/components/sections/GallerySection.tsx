"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Play, X, Image as ImageIcon, Sparkles, Maximize2 } from "lucide-react";
import { IGalleryItem } from "@/types";

const INITIAL_GALLERY: IGalleryItem[] = [
  {
    _id: "g1",
    title: "NASA Space Apps Challenge Hackathon Presentation",
    mediaUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "g2",
    title: "IoT Hardware Prototyping & Sensor Calibration Lab",
    mediaUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "g3",
    title: "IntelliNova Research Team (INRT) Brainstorming Session",
    mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "g4",
    title: "Daffodil International University (DIU) Tech Carnival",
    mediaUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "g5",
    title: "SHEMAS Energy Monitoring Demo & Live Telemetry",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // demo video embed url
    type: "video",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "g6",
    title: "AI & Embedded Machine Learning Workshop",
    mediaUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date().toISOString(),
  },
];

export function GallerySection() {
  const [items, setItems] = useState<IGalleryItem[]>(INITIAL_GALLERY);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [activeMedia, setActiveMedia] = useState<IGalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            setItems(data.data);
          }
        }
      } catch {
        // Fallback to sample items
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-semibold uppercase tracking-wider text-primary">
              <Camera className="w-3.5 h-3.5" />
              Moments & Achievements
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Event Highlights & Gallery
            </h2>
            <p className="text-muted-foreground text-base">
              Snapshots and video recordings from hackathons, research symposiums, and engineering workshops at DIU and beyond.
            </p>
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilter("image")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "image"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setFilter("video")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "video"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Videos
            </button>
          </div>
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item._id || item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => setActiveMedia(item)}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer h-64"
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <div className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-20">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                  <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-red-600/90 text-white uppercase tracking-wider">
                    Video Demo
                  </span>
                </div>
              ) : (
                <div className="w-full h-full relative overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Photo
                  </span>
                </div>
              )}

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-end justify-between gap-3">
                <p className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors line-clamp-2">
                  {item.title}
                </p>
                <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-card border border-border shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative bg-black flex items-center justify-center max-h-[70vh]">
                {activeMedia.type === "video" ? (
                  <iframe
                    src={activeMedia.mediaUrl}
                    title={activeMedia.title}
                    className="w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeMedia.mediaUrl}
                    alt={activeMedia.title}
                    className="max-h-[70vh] w-auto object-contain mx-auto"
                  />
                )}
              </div>

              <div className="p-5 border-t border-border bg-card">
                <h3 className="text-base font-bold text-foreground">
                  {activeMedia.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Type: {activeMedia.type.toUpperCase()} • Event Archive
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default GallerySection;
