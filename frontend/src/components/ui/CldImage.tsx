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
    if (src.includes('/upload/')) {
      const uploadIdx = src.indexOf('/upload/');
      const afterUpload = src.substring(uploadIdx + 8);
      // Check if afterUpload already starts with a transformation block before the version or folder
      if (/^(?:f_|w_|h_|c_|q_|g_)[^/]+\//.test(afterUpload)) {
        return src.replace(/\/upload\/(?:f_|w_|h_|c_|q_|g_)[^/]+\//, `/upload/${transformString}/`);
      }
      return src.replace('/upload/', `/upload/${transformString}/`);
    }
    return src;
  }

  // Case 2: Unsplash image URL
  if (src.includes('images.unsplash.com')) {
    try {
      const url = new URL(src);
      if (options.width) url.searchParams.set('w', String(options.width));
      if (options.height) url.searchParams.set('h', String(options.height));
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('q', typeof options.quality === 'number' ? String(options.quality) : '80');
      return url.toString();
    } catch {
      return src;
    }
  }

  // Case 3: Other external URL (e.g. general CDN)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Case 4: Cloudinary public_id (e.g. "cld-sample-5" or "portfolio/images/xyz")
  const cleanPublicId = src.startsWith('/') ? src.slice(1) : src;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${cleanPublicId}`;
}

export const getOptimizedImageUrl = buildCloudinaryUrl;

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
