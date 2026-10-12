import React from 'react';

export interface CldImageCropOptions {
  type?: 'auto' | 'fill' | 'crop' | 'thumb' | 'scale' | 'fit' | 'limit' | 'pad' | string;
  source?: boolean;
  gravity?: string;
}

export interface CldImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  src: string; // Cloudinary public_id (e.g. "cld-sample-5") or full image URL
  width?: number | string;
  height?: number | string;
  crop?: CldImageCropOptions | string;
  gravity?: string;
  quality?: string | number;
  format?: string;
  cloudName?: string;
  alt?: string;
  className?: string;
}

/**
 * Builds an optimized Cloudinary delivery URL with auto-format, auto-quality,
 * resizing, and smart cropping.
 */
export function buildCloudinaryUrl(
  src: string,
  options: {
    width?: number | string;
    height?: number | string;
    crop?: CldImageCropOptions | string;
    gravity?: string;
    quality?: string | number;
    format?: string;
    cloudName?: string;
  } = {}
): string {
  if (!src) return '';

  const cloudName =
    options.cloudName ||
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
    'jmgpicxr';

  // Build transformation segments
  const transforms: string[] = [];

  // Default to auto format & auto quality for modern web optimization (AVIF/WebP)
  transforms.push(`f_${options.format || 'auto'}`);
  transforms.push(`q_${options.quality || 'auto'}`);

  // Resizing
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);

  // Cropping & Gravity
  let cropType = 'auto';
  let gravity = options.gravity;

  if (typeof options.crop === 'string') {
    cropType = options.crop;
  } else if (options.crop && typeof options.crop === 'object') {
    cropType = options.crop.type || 'auto';
    if (options.crop.gravity) gravity = options.crop.gravity;
  }

  if (cropType) {
    transforms.push(`c_${cropType}`);
  }

  if (gravity) {
    transforms.push(`g_${gravity}`);
  } else if (cropType === 'auto' || cropType === 'fill') {
    transforms.push('g_auto');
  }

  const transformString = transforms.join(',');

  // Case 1: src is already a full Cloudinary URL
  if (src.includes('res.cloudinary.com')) {
    // If it already has /upload/, inject or append our optimizations
    if (src.includes('/upload/')) {
      return src.replace('/upload/', `/upload/${transformString}/`);
    }
    return src;
  }

  // Case 2: src is an external URL (e.g. Unsplash or external CDN)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Case 3: src is a Cloudinary public_id (e.g. "cld-sample-5" or "portfolio/images/xyz")
  const cleanPublicId = src.startsWith('/') ? src.slice(1) : src;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${cleanPublicId}`;
}

/**
 * CldImage Component for React + Vite.
 *
 * Provides automatic format (f_auto), automatic quality (q_auto),
 * responsive scaling, and smart cropping — mirroring next-cloudinary
 * while running natively in Vite / React 19 without Next.js dependencies.
 */
export const CldImage: React.FC<CldImageProps> = ({
  src,
  width,
  height,
  crop = { type: 'auto', source: true },
  gravity,
  quality = 'auto',
  format = 'auto',
  cloudName,
  alt = '',
  className = '',
  loading = 'lazy',
  ...rest
}) => {
  const optimizedUrl = buildCloudinaryUrl(src, {
    width,
    height,
    crop,
    gravity,
    quality,
    format,
    cloudName,
  });

  return (
    <img
      src={optimizedUrl}
      width={width}
      height={height}
      alt={alt}
      loading={loading}
      className={className}
      {...rest}
    />
  );
};

export default CldImage;
