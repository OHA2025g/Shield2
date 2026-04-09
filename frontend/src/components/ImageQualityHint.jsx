import React from 'react';

const HINTS = {
  hero: 'Recommended for hero backgrounds: at least 1920×1080 px, landscape JPEG or WebP, under ~800 KB for fast loading. Use high-contrast subjects that read well with a dark overlay.',
  carousel:
    'For carousels: 16∶9 or wider, min ~1200×675 px, sharp focus, good lighting. Avoid heavy compression artifacts.',
  logo: 'Logos and badges: square or near-square PNG/SVG with transparent background; at least 256×256 px.',
  general:
    'Use original or licensed images. Prefer HTTPS URLs, descriptive file names, and alt text when editing content.',
};

/**
 * Short guidance for editors to keep visuals crisp on the public site (point 13).
 */
const ImageQualityHint = ({ context = 'general', className = '' }) => (
  <p className={`text-xs text-muted-foreground leading-snug ${className}`}>{HINTS[context] || HINTS.general}</p>
);

export default ImageQualityHint;
