interface ImageLoaderProps {
  src: string;
  width?: number;
  quality?: number;
}

export function imageLoader({ src, width, quality = 75 }: ImageLoaderProps) {
  // If it's an external URL, return it as is
  if (src.startsWith('http')) {
    return src;
  }

  // For local images in development, just use the public path
  if (import.meta.env.DEV) {
    return src.startsWith('/') ? src : `/${src}`;
  }

  // For production, use the configured base URL
  const baseUrl = import.meta.env.VITE_APP_URL || '';
  
  try {
    const url = new URL(src, baseUrl);
    
    // Add width and quality parameters if needed
    if (width) {
      url.searchParams.set('w', width.toString());
    }
    if (quality) {
      url.searchParams.set('q', quality.toString());
    }

    return url.toString();
  } catch (error) {
    console.warn('Failed to construct URL:', error);
    // Fallback to just returning the src
    return src;
  }
}

export function getImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.onerror = reject
    img.src = src
  })
} 