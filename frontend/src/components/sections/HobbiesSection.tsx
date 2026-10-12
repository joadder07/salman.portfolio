import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { hobbyApi } from '@/api/content.api';
import { Skeleton } from '@/components/shared';

export const HobbiesSection: React.FC = () => {
  const { data: hobbies, isLoading } = hobbyApi.useGetAll();

  return (
    <section id="hobbies" className="py-24 border-t border-neutral-900 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Passions &amp; Pastimes
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Hobbies &amp; Interests
        </h3>
        <p className="mt-3 text-sm text-neutral-400 font-light tracking-wide">
          What keeps the curiosity alive outside of code and research.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-none overflow-hidden border border-neutral-850 bg-neutral-950 p-4 space-y-3">
              <Skeleton className="w-full h-36 rounded-none bg-neutral-900" />
              <Skeleton className="h-5 w-1/2 rounded-none bg-neutral-850" />
              <Skeleton className="h-3 w-4/5 rounded-none bg-neutral-850" />
            </div>
          ))}
        </div>
      ) : !hobbies || hobbies.length === 0 ? (
        <div className="text-center py-16 rounded-sm border border-neutral-900 bg-neutral-950/70 max-w-lg mx-auto">
          <Sparkles className="w-8 h-8 text-neutral-500 mx-auto mb-3 opacity-60" />
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Hobbies will appear here once added in the Admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hobbies.map((hobby, idx) => (
            <motion.div
              key={hobby.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="h-full flex flex-col justify-between overflow-hidden rounded-none border border-neutral-850 bg-neutral-950 p-5 hover:border-neutral-600 transition-colors">
                <div>
                  {hobby.imageUrl && (
                    <div className="w-full h-44 rounded-none overflow-hidden mb-4 bg-neutral-900">
                      <img
                        src={hobby.imageUrl}
                        alt={hobby.name}
                        className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h4 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-white" />
                    {hobby.name}
                  </h4>
                  {hobby.description && (
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-light">
                      {hobby.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
