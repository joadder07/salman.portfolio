import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar } from 'lucide-react';
import { FadeUpHeading } from '@/components/ui';
import { educationApi } from '@/api/content.api';
import { Skeleton } from '@/components/shared';

export const EducationSection: React.FC = () => {
  const { data: education, isLoading } = educationApi.useGetAll();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.getFullYear().toString();
  };

  return (
    <section
      id="education"
      className="relative py-14 sm:py-20 px-4 bg-white text-black overflow-hidden select-none shadow-xs"
    >
      {/* Unified Inverted Dark-Texture Grain Layer (Matches dark sections exactly) */}
      <div
        className="absolute inset-0 texture-inverted-grain bg-[url('/images/dark-texture.jpg')] bg-cover bg-fixed bg-center pointer-events-none invert mix-blend-multiply"
        style={{ filter: 'invert(1)', mixBlendMode: 'multiply' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <FadeUpHeading className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-[11px] uppercase font-bold tracking-[0.3em] text-neutral-600 mb-1.5">
            Academic Journey
          </h2>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
            <span className="title-highlight-dark">
              Education &amp; Qualifications
            </span>
          </h3>
        </FadeUpHeading>

        {isLoading ? (
          <div className="space-y-3 sm:space-y-3.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-none bg-neutral-950 border border-neutral-850 shadow-xl"
              >
                <div className="flex items-start gap-3 w-full">
                  <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-neutral-900 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-48 rounded-none bg-neutral-850" />
                    <Skeleton className="h-3 w-36 rounded-none bg-neutral-850" />
                    <Skeleton className="h-3 w-4/5 rounded-none bg-neutral-850 mt-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !education || education.length === 0 ? (
          <div className="text-center py-12 rounded-sm border border-neutral-300 bg-neutral-100/80 max-w-lg mx-auto shadow-sm">
            <GraduationCap className="w-7 h-7 text-neutral-500 mx-auto mb-2" />
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
              Education details will appear here once added in the Admin panel.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-3.5">
            {education.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Black / Dark Gray Qualification Card Container - Compact & Slim */}
                <div className="p-4 sm:p-5 rounded-none border border-neutral-850 bg-neutral-950 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:border-neutral-600 transition-colors">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-bold uppercase tracking-wide text-white font-heading truncate">
                        {item.degree}
                      </h4>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mt-0.5">
                        {item.institution}
                      </p>
                      {item.field && (
                        <p className="text-[11px] text-neutral-400 mt-0.5 font-mono tracking-wide">
                          {item.field}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-xs text-neutral-400 mt-1.5 max-w-xl leading-normal font-light">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs text-neutral-400 font-mono shrink-0 self-start sm:self-center">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-black/90 border border-neutral-800 text-neutral-300 uppercase tracking-wider text-[10px] font-mono">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Present'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EducationSection;
