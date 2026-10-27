const preloadedUrls = new Set<string>();

/**
 * Preloads an image URL into browser memory and HTTP cache.
 * Safe to call repeatedly; duplicate URLs are skipped.
 */
export function preloadImage(url: string, priority: 'high' | 'low' = 'high'): void {
  if (!url || typeof window === 'undefined' || preloadedUrls.has(url)) return;
  preloadedUrls.add(url);

  try {
    const img = new Image();
    img.decoding = 'async';
    if ('fetchPriority' in img) {
      (img as HTMLImageElement & { fetchPriority: string }).fetchPriority = priority;
    }
    img.src = url;
  } catch {
    // Graceful fallback if image constructor fails
  }
}

/**
 * Preloads an array of image URLs during idle browser time
 * to ensure that initial visible gallery items open instantaneously.
 */
export function preloadImagesIdle(urls: string[]): void {
  if (typeof window === 'undefined' || !urls || urls.length === 0) return;

  const run = () => {
    urls.slice(0, 10).forEach((url) => {
      if (url) preloadImage(url, 'low');
    });
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 500);
  }
}
