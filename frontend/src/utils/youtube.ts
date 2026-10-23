/**
 * Utility functions for extracting YouTube video IDs, generating thumbnails,
 * and creating seamless embed URLs.
 */

export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns (watch?v=, youtu.be/, embed/, shorts/, live/)
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([^"&?\/\s]{11})/i;

  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return Boolean(extractYouTubeId(url));
}

/**
 * Returns high-quality thumbnail from YouTube image CDN.
 * hqdefault (480x360) is guaranteed to exist on 100% of YouTube videos.
 * maxresdefault (1280x720) is used if available, or fall back to hqdefault.
 */
export function getYouTubeThumbnail(
  urlOrId: string,
  quality: 'hq' | 'maxres' | 'default' = 'hq'
): string {
  const id = extractYouTubeId(urlOrId);
  if (!id) return '';

  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  if (quality === 'default') {
    return `https://img.youtube.com/vi/${id}/default.jpg`;
  }
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Returns seamless YouTube privacy-enhanced embed URL with autoplay parameters.
 */
export function getYouTubeEmbedUrl(urlOrId: string, autoplay = true): string {
  const id = extractYouTubeId(urlOrId);
  if (!id) return urlOrId;
  const autoParam = autoplay ? '1' : '0';
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoParam}&rel=0&modestbranding=1&playsinline=1`;
}

/**
 * Returns canonical direct watch URL on YouTube.
 */
export function getYouTubeWatchUrl(urlOrId: string): string {
  const id = extractYouTubeId(urlOrId);
  if (!id) return urlOrId;
  return `https://www.youtube.com/watch?v=${id}`;
}

import React from 'react';

export const YouTubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) =>
  React.createElement(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      className: className || 'w-5 h-5',
      ...props,
    },
    React.createElement('path', {
      d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    })
  );
