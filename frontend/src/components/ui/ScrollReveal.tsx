import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

/**
 * ScrollReveal wraps elements with a smooth, cinematic scroll-triggered
 * fade-in and slide-up animation using Framer Motion.
 * Starts with translateY: yOffset & opacity: 0, transitions to translateY: 0 & opacity: 1
 * precisely as the element enters the viewport.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.85,
  yOffset = 26,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // fluid cinematic cubic bezier curve
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
