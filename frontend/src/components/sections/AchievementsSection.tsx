import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { achievementApi } from '@/api/content.api';
import { Skeleton } from '@/components/shared';

export const AchievementsSection: React.FC = () => {
  const { data: achievements, isLoading } = achievementApi.useGetAll();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <section id="achievements" className="py-24 border-t border-neutral-900 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Milestones &amp; Recognition
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Honors &amp; Achievements
        </h3>
        <p className="mt-3 text-sm text-neutral-400 font-light tracking-wide">
          Hackathon wins, research papers, grants, and academic awards.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-none overflow-hidden border border-neutral-850 bg-neutral-950 p-5 space-y-3">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-none bg-neutral-900 shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-none bg-neutral-850" />
                  <Skeleton className="h-3 w-1/3 rounded-none bg-neutral-850" />
                </div>
              </div>
              <Skeleton className="h-3 w-full rounded-none bg-neutral-850" />
              <Skeleton className="h-3 w-4/5 rounded-none bg-neutral-850" />
            </div>
          ))}
        </div>
      ) : !achievements || achievements.length === 0 ? (
        <div className="text-center py-16 rounded-sm border border-neutral-900 bg-neutral-950/70 max-w-lg mx-auto">
          <Award className="w-8 h-8 text-neutral-500 mx-auto mb-3 opacity-60" />
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Achievements will appear here once added in the Admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {achievements.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="h-full flex flex-col justify-between rounded-none border border-neutral-850 bg-neutral-950 p-6 hover:border-neutral-600 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="p-2.5 rounded-none bg-neutral-900 text-white border border-neutral-800">
                      <Award className="w-4 h-4" />
                    </span>
                    {item.date && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        {formatDate(item.date)}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold uppercase tracking-wider text-white">{item.title}</h4>
                  {item.category && (
                    <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-400 block mt-1">
                      {item.category}
                    </span>
                  )}
                  {item.description && (
                    <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed font-light">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.link && (
                  <div className="pt-4 mt-4 border-t border-neutral-850">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-white transition-colors"
                    >
                      <span>View Credential</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
