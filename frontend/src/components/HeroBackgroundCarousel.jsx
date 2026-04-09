import React, { useState, useEffect } from 'react';
import { getGalleryItems } from '../api';

const HERO_GALLERY_CATEGORY = 'homepage_hero';

// NGO-style hero images (reliable CDN; used when no admin-managed slides exist)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1523240795612-9a1b7227348e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1609220136736-443140c7d3b8?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop',
];

const ROTATE_MS = 5500;

function preloadImages(urls) {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

const HeroBackgroundCarousel = () => {
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    getGalleryItems(HERO_GALLERY_CATEGORY)
      .then((data) => {
        if (!mounted || !data?.items?.length) return;
        const urls = data.items
          .filter((item) => {
            if (item.type && item.type !== 'image') return false;
            const img = item.image && String(item.image).trim();
            return img && img.length > 10 && (img.startsWith('http://') || img.startsWith('https://'));
          })
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((item) => item.image)
          .filter(Boolean);
        if (urls.length >= 1) {
          setImages(urls);
          preloadImages(urls);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const safeImages = (images.length > 0 ? images : FALLBACK_IMAGES).filter(
    (src) => src && String(src).trim() && (src.startsWith('http://') || src.startsWith('https://'))
  );
  const displayImages = safeImages.length > 0 ? safeImages : FALLBACK_IMAGES;
  const len = displayImages.length;

  useEffect(() => {
    preloadImages(displayImages);
  }, [displayImages.length]);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [len]);

  const currentIndex = len > 0 ? index % len : 0;
  const currentSrc = displayImages[currentIndex];

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{
        backgroundImage: currentSrc ? `url(${currentSrc})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {displayImages.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: i === currentIndex ? 1 : 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden={i !== currentIndex}
        />
      ))}
    </div>
  );
};

export default HeroBackgroundCarousel;
