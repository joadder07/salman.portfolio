import React from 'react';
import { useSiteSettings } from '@/api/settings.api';

export const AboutSection: React.FC = () => {
  const { data: settings } = useSiteSettings();

  return (
    <section id="about" className="py-24 border-t border-neutral-900 px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Background & Philosophy
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Think. Create. Innovate.
        </h3>
        <p className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed font-light tracking-wide">
          {settings?.aboutText ||
            'Passionate researcher and engineer with an obsession for clean architectures, fluid interactions, and intelligent systems.'}
        </p>
      </div>
    </section>
  );
};
