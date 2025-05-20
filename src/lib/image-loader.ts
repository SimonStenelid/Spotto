import { ImageLoaderProps } from 'next/image'

export function imageLoader({ src, width, quality = 75 }: ImageLoaderProps): string {
  // If the image is from a remote URL, return it as is
  if (src.startsWith('http')) {
    return src
  }

  // For local images, use Next.js Image Optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
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