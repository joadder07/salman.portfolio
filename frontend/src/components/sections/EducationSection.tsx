import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { educationApi } from '@/api/content.api';

import { Skeleton } from '@/components/shared';

export const EducationSection: React.FC = () => {
  const { data: education, isLoading } = educationApi.useGetAll();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.getFullYear().toString();
  };

  return (
    <section id="education" className="py-24 border-t border-neutral-900 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Academic Journey
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Education &amp; Qualifications
        </h3>
      </div>

      {isLoading ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-none bg-neutral-950 border border-neutral-850"
            >
              <div className="flex items-start gap-4 w-full">
                <Skeleton className="w-12 h-12 rounded-none bg-neutral-900 shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48 rounded-none bg-neutral-850" />
                  <Skeleton className="h-4 w-36 rounded-none bg-neutral-850" />
                  <Skeleton className="h-3 w-4/5 rounded-none bg-neutral-850 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !education || education.length === 0 ? (
        <div className="text-center py-16 rounded-sm border border-neutral-900 bg-neutral-950/70 max-w-lg mx-auto">
          <GraduationCap className="w-8 h-8 text-neutral-500 mx-auto mb-3 opacity-60" />
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Education details will appear here once added in the Admin panel.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-5">
          {education.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="p-6 rounded-none border border-neutral-850 bg-neutral-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-neutral-600 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-none bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">{item.degree}</h4>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-300 mt-0.5">{item.institution}</p>
                    {item.field && (
                      <p className="text-xs text-neutral-500 mt-0.5 font-mono tracking-wide">{item.field}</p>
                    )}
                    {item.description && (
                      <p className="text-xs text-neutral-400 mt-2 max-w-xl leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs text-neutral-400 font-mono shrink-0">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-none bg-black/80 border border-neutral-800 uppercase tracking-wider text-[11px]">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Present'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
