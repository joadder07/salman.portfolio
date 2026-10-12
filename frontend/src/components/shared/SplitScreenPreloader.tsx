import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * SplitScreenPreloader provides an immediate 0.9s split and fade effect:
 * 1. Immediate Execution: Starts as soon as the component mounts without any initial delay.
 * 2. Exact 0.9s Duration: Both the black panels splitting (translateY: -100% and 100%)
 *    and the underlying white background fading out (opacity: 0) animate over exactly 0.9 seconds.
 * 3. Direct Cleanup: Unmounts immediately upon completion to reveal the interactive homepage.
 */
export const SplitScreenPreloader: React.FC = () => {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Safety fallback unmount slightly after the 0.9s animation finishes
    const timer = setTimeout(() => {
      setIsFinished(true);
    }, 950);

    return () => clearTimeout(timer);
  }, []);

  if (isFinished) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* The Fading White Background: immediately fades from opacity-100 to opacity-0 over exactly 0.9s */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: 0.9,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-white will-change-[opacity]"
      />

      {/* Top Black Panel: immediately slides up out of view (-100%) over exactly 0.9s */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        transition={{
          duration: 0.9,
          ease: [0.77, 0, 0.175, 1], // Cinematic smooth cubic-bezier curve
        }}
        className="absolute top-0 left-0 w-full h-1/2 bg-black will-change-transform z-10"
      />

      {/* Bottom Black Panel: immediately slides down out of view (100%) over exactly 0.9s */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: '100%' }}
        transition={{
          duration: 0.9,
          ease: [0.77, 0, 0.175, 1],
        }}
        onAnimationComplete={() => {
          setIsFinished(true);
        }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-black will-change-transform z-10"
      />
    </div>
  );
};

export default SplitScreenPreloader;



