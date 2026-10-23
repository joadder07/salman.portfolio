import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { FadeUpHeading } from '@/components/ui';
import { petApi } from '@/api/content.api';
import { Skeleton } from '@/components/shared';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';

export const PetsSection: React.FC = () => {
  const { data: pets, isLoading } = petApi.useGetAll();

  return (
    <section id="pets" className="py-24 px-4">
      <FadeUpHeading className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Furry Companions
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Meet My Pets
        </h3>
      </FadeUpHeading>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-none overflow-hidden border border-neutral-850 bg-neutral-950 p-4 space-y-3">
              <Skeleton className="w-full h-44 rounded-none bg-neutral-900" />
              <Skeleton className="h-5 w-1/2 rounded-none bg-neutral-850" />
              <Skeleton className="h-3 w-3/4 rounded-none bg-neutral-850" />
            </div>
          ))}
        </div>
      ) : !pets || pets.length === 0 ? (
        <div className="text-center py-16 rounded-sm border border-neutral-900 bg-neutral-950/70 max-w-lg mx-auto">
          <PawPrint className="w-8 h-8 text-neutral-500 mx-auto mb-3 opacity-60" />
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Pet profiles will appear here once added in the Admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, idx) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="rounded-none border border-neutral-850 bg-neutral-950 p-5 h-full flex flex-col justify-between hover:border-neutral-600 transition-colors">
                <div>
                  {pet.imageUrl && (
                    <div className="w-full h-48 rounded-none overflow-hidden mb-4 bg-neutral-900">
                      <img
                        src={getOptimizedImageUrl(pet.imageUrl, {
                          width: 600,
                          height: 400,
                          crop: 'fill',
                          quality: 'auto',
                          format: 'auto',
                        })}
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 gpu-accelerated-image"
                        loading="lazy"
                        decoding="async"
                        style={{ transform: 'translate3d(0, 0, 0)' }}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold uppercase tracking-wider text-white">{pet.name}</h4>
                    <span className="text-[10px] font-mono uppercase bg-neutral-900 text-neutral-400 px-2.5 py-0.5 rounded-none border border-neutral-800 tracking-wider">
                      {pet.species} {pet.breed ? `• ${pet.breed}` : ''}
                    </span>
                  </div>
                  {pet.description && (
                    <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed">
                      {pet.description}
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
