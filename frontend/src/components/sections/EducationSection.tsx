import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Briefcase } from 'lucide-react';
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
      className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-8 lg:px-12 bg-light-paper text-black overflow-hidden select-none"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="scroll-reveal text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] uppercase font-bold tracking-[0.3em] text-neutral-600 mb-1.5 sm:mb-2 block">
            Academic Journey
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black font-heading leading-tight">
            Education &amp; Qualifications
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="py-3.5 px-5 sm:py-6 sm:px-7 rounded-none bg-neutral-950 border border-neutral-850 shadow-xl space-y-3"
              >
                <Skeleton className="h-4 w-28 bg-neutral-850" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 sm:h-5 w-3/4 bg-neutral-850" />
                  <Skeleton className="h-3 w-1/2 bg-neutral-850" />
                </div>
                <Skeleton className="h-3 sm:h-4 w-full bg-neutral-850 mt-2" />
              </div>
            ))}
          </div>
        ) : !education || education.length === 0 ? (
          <div className="text-center py-12 sm:py-16 rounded-none border border-neutral-300 bg-white/70 max-w-lg mx-auto shadow-sm px-4">
            <GraduationCap className="w-8 h-8 text-neutral-500 mx-auto mb-3 opacity-60" />
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-medium">
              Education details will appear here once added in the Admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
            {education.map((item, idx) => {
              const isCurrent = !item.endDate;
              const dateText = `${formatDate(item.startDate)} — ${
                item.endDate ? formatDate(item.endDate) : 'Present'
              }`;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="relative group bg-neutral-950 text-white border border-neutral-850 hover:border-neutral-600 py-3.5 px-5 sm:py-6 sm:px-7 shadow-xl flex flex-col justify-between transition-colors duration-200"
                >
                  <div>
                    {/* Date Badge */}
                    <div className="flex items-center justify-between mb-2.5 sm:mb-3 pb-2 border-b border-neutral-900">
                      <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-400 shrink-0" />
                        {dateText}
                      </span>
                    </div>

                    {/* Degree Title & Institution */}
                    <div>
                      <h4 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide text-white font-heading leading-tight break-words">
                        {item.degree}
                      </h4>
                      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mt-1 leading-snug">
                        {item.institution}
                      </p>
                    </div>

                    {/* Field of Study */}
                    {item.field && (
                      <p className="mt-2 text-[10px] sm:text-[11px] font-mono text-neutral-400 leading-normal">
                        {item.field}
                      </p>
                    )}
                  </div>

                  {/* Academic Achievements / GPA / Experience Details */}
                  {item.description && (
                    <div className="mt-2.5 pt-2 sm:mt-4 sm:pt-3 border-t border-neutral-900">
                      {item.description.includes('\n') ? (() => {
                        const lines = item.description
                          .split('\n')
                          .map((l) => l.trim())
                          .filter(Boolean);
                        const hasRoleWithDate =
                          lines.length >= 2 &&
                          (lines[1].toLowerCase().includes('present') || /\d{4}/.test(lines[1]));

                        if (hasRoleWithDate) {
                          const isCurrentRole = lines[1].toLowerCase().includes('present');
                          return (
                            <div className="space-y-1.5 text-left">
                              <div className="flex items-center gap-1.5">
                                <Briefcase className="w-3 h-3 text-neutral-400 shrink-0" />
                                <h5 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-200 font-heading">
                                  {lines[0]}
                                </h5>
                              </div>
                              <div className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                {isCurrentRole && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                )}
                                <span>{lines[1]}</span>
                              </div>
                              {lines.length > 2 && (
                                <p className="text-[10px] sm:text-[11px] font-mono text-neutral-400 leading-relaxed">
                                  {lines.slice(2).join(' ')}
                                </p>
                              )}
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-1 text-left">
                            {lines.map((line, lIdx) => (
                              <p
                                key={lIdx}
                                className="text-[10px] sm:text-[11px] font-mono text-neutral-400 leading-relaxed"
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        );
                      })() : item.description.includes('|') ? (
                        <div className="flex flex-wrap gap-1.5">
                          {item.description.split('|').map((pill, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider bg-black border border-neutral-800 text-neutral-300"
                            >
                              {pill.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider bg-black border border-neutral-800 text-neutral-300">
                            {item.description.trim()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EducationSection;
