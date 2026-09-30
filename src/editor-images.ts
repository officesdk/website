import { getImage } from 'astro:assets'
import documentImage from '../public/product/core-editors/hero-document.webp'
import writerImage from '../public/product/core-editors/hero-writer.webp'
import sheetImage from '../public/product/core-editors/hero-sheet.webp'
import presentationImage from '../public/product/core-editors/hero-presentation.webp'

// Astro emits content-hashed variants, so they can be cached immutably.
export const editorImages = await Promise.all(
  [documentImage, writerImage, sheetImage, presentationImage].map(async (src) => {
    const variants = await Promise.all([640, 960, 1600].map(width => getImage({ src, width, format: 'webp', quality: 82 })))
    return {
      src: variants[2].src,
      srcSet: variants.map((image, index) => `${image.src} ${[640, 960, 1600][index]}w`).join(', '),
    }
  }),
)
