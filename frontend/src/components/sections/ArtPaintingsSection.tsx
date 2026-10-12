import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, ZoomIn, Brush, Layers, Sparkles, Maximize2 } from 'lucide-react';
import { artApi } from '@/api/content.api';

interface Artwork {
  id: string | number;
  title: string;
  medium: string;
  year: string;
  description: string;
  imageUrl: string;
  palette: string[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export const ArtPaintingsSection: React.FC = () => {
  const [selected, setSelected] = useState<Artwork | null>(null);
  const { data: dbArtworks, isLoading } = artApi.useGetAll();

  const artworks: Artwork[] =
    dbArtworks && dbArtworks.length > 0
      ? dbArtworks.map((item) => ({
          id: item.id,
          title: item.title,
          medium: item.medium || 'Mixed Media',
          year: item.year || '2024',
          description: item.description || '',
          imageUrl: item.imageUrl,
          palette: item.palette
            ? item.palette.split(',').map((c) => c.trim()).filter(Boolean)
            : ['#6366f1', '#a855f7', '#ec4899'],
        }))
      : [];

  return (
    <section id="art" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-900">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Creative Expressions
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Art &amp; Paintings
        </h3>
        <p className="mt-3 text-sm text-neutral-400 font-light tracking-wide max-w-xl mx-auto">
          Where science meets soul — a gallery of paintings, sketches, and digital works born from
          curiosity, colour, and quiet contemplation.
        </p>
      </motion.div>

      {artworks.length === 0 ? (
        <div className="text-center py-16 rounded-sm border border-neutral-900 bg-neutral-950/70 max-w-lg mx-auto">
          <Palette className="w-8 h-8 text-neutral-500 mx-auto mb-3 opacity-60" />
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Artworks will appear here once added in the Admin panel.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-8 mb-14"
          >
            {[
              { icon: Brush, label: 'Mediums', value: `${new Set(artworks.map((a) => a.medium)).size}` },
              { icon: Layers, label: 'Works', value: `${artworks.length}` },
              { icon: Sparkles, label: 'Years Active', value: `${new Set(artworks.map((a) => a.year)).size}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center w-9 h-9 mx-auto rounded-none bg-neutral-900 border border-neutral-800 mb-2">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-xl font-bold font-mono text-white">{value}</div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork, i) => (
          <motion.div
            key={artwork.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onClick={() => setSelected(artwork)}
            className="group relative overflow-hidden rounded-none border border-neutral-850 bg-neutral-950 cursor-pointer hover:border-neutral-600 transition-colors"
          >
            {/* Image */}
            <div className="relative h-60 overflow-hidden bg-neutral-900">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Zoom Icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-none bg-black/80 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Maximize2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  {artwork.medium}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {artwork.year}
                </span>
              </div>
              <h3 className="text-base font-bold uppercase tracking-wider text-white line-clamp-1">
                {artwork.title}
              </h3>
              <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {artwork.description}
              </p>
            </div>
          </motion.div>
        ))}
          </div>
        </>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-none overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/80 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Full Image */}
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="w-full max-h-[60vh] object-cover"
              />

              {/* Modal Details */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-wider text-white">{selected.title}</h3>
                    <p className="text-xs uppercase font-mono tracking-widest text-neutral-400 mt-1">
                      {selected.medium} &bull; {selected.year}
                    </p>
                  </div>
                  {/* Palette Swatches */}
                  <div className="flex items-center gap-1.5 mt-1 shrink-0">
                    {selected.palette.map((color) => (
                      <span
                        key={color}
                        className="w-4 h-4 rounded-full ring-1 ring-white/20 shadow"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {selected.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
