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
      className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-8 bg-light-paper text-black overflow-hidden select-none"
    >

      <div className="relative z-10 max-w-4xl mx-auto my-4 sm:my-6">
        <FadeUpHeading className="scroll-reveal text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <h2 className="text-[11px] uppercase font-bold tracking-[0.3em] text-neutral-600 mb-1.5 sm:mb-2">
            Academic Journey
          </h2>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black font-heading">
            Education &amp; Qualifications
          </h3>
        </FadeUpHeading>

        {isLoading ? (
          <div className="space-y-2 sm:space-y-3.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start sm:items-center justify-between gap-2.5 sm:gap-4 py-2.5 px-3 sm:py-4 sm:px-5 rounded-none bg-neutral-950 border border-neutral-850 shadow-xl"
              >
                <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                  <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-none bg-neutral-900 shrink-0 mt-0.5" />
                  <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="h-3.5 sm:h-4 w-32 sm:w-48 rounded-none bg-neutral-850" />
                    <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-36 rounded-none bg-neutral-850" />
                    <Skeleton className="h-2.5 sm:h-3 w-3/4 sm:w-4/5 rounded-none bg-neutral-850 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-5 sm:h-6 w-20 sm:w-28 rounded-none bg-neutral-850 shrink-0 self-start sm:self-center" />
              </div>
            ))}
          </div>
        ) : !education || education.length === 0 ? (
          <div className="text-center py-10 sm:py-12 rounded-none border border-neutral-850 bg-neutral-950/70 max-w-lg mx-auto shadow-sm px-4">
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-500 mx-auto mb-2" />
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400">
              Education details will appear here once added in the Admin panel.
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3.5">
            {education.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10px' }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`scroll-reveal scroll-delay-${Math.min((idx % 4) + 1, 4)}`}
              >
                {/* Black / Dark Gray Qualification Card Container */}
                <div className="py-2.5 px-3 sm:py-4 sm:px-5 rounded-none border border-neutral-850 bg-neutral-950 shadow-xl flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 sm:gap-4 hover:border-neutral-600 transition-colors">
                  <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1 w-full xs:w-auto">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-none bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-base font-bold uppercase tracking-wide text-white font-heading leading-tight break-words sm:truncate">
                        {item.degree}
                      </h4>
                      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mt-0.5 leading-snug">
                        {item.institution}
                      </p>
                      {item.field && (
                        <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 font-mono tracking-wide leading-tight">
                          {item.field}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-[10px] sm:text-xs text-neutral-400 mt-1 max-w-xl leading-snug font-light">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row xs:flex-col items-start xs:items-end gap-1 text-xs text-neutral-400 font-mono shrink-0 self-start xs:self-center pl-10.5 xs:pl-0">
                    <span className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-none bg-black/90 border border-neutral-800 text-neutral-300 uppercase tracking-wider text-[9px] sm:text-[10px] font-mono leading-none whitespace-nowrap">
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-400 shrink-0" />
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
