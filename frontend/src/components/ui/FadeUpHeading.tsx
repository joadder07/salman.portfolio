import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface FadeUpHeadingProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

/**
 * FadeUpHeading wraps section headings and titles with a smooth
 * 'fade-up on scroll' reveal animation using Framer Motion.
 * Starts with translateY: 50px & opacity: 0, transitions to translateY: 0 & opacity: 1.
 */
export const FadeUpHeading: React.FC<FadeUpHeadingProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  yOffset = 28,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeUpHeading;
