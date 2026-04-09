import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { getGalleryItems } from '../api';
import { Button } from './ui/button';

const MediaCarousel = ({ categoryFilter = null, title = "Gallery", autoScrollInterval = 5000, embedded = false }) => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGalleryItems(categoryFilter || undefined);
        let list = data.items || [];
        if (categoryFilter) {
          list = list.filter((i) => i.category === categoryFilter);
        }
        // Only include items with valid image or video so we never show empty/broken slides
        list = list.filter((i) => {
          if (i.type === 'video') return i.video_url && String(i.video_url).trim();
          return i.image && String(i.image).trim();
        });
        setItems(list);
      } catch (e) {
        setItems([]);
      }
      setLoading(false);
    };
    load();
  }, [categoryFilter]);

  useEffect(() => {
    setImageError(false);
  }, [currentIndex]);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, autoScrollInterval);
    return () => clearInterval(t);
  }, [items.length, autoScrollInterval]);

  if (loading || items.length === 0) return null;

  const goPrev = () => { setImageError(false); setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1)); };
  const goNext = () => { setImageError(false); setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1)); };
  const item = items[currentIndex];
  const showImage = item.type !== 'video' && item.image && item.image.trim();
  const usePlaceholder = imageError || !showImage;

  const inner = (
    <>
      {title && !embedded && (
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">{title}</h2>
      )}
      <div className="relative overflow-hidden rounded-xl border border-gray-200/90 bg-gray-950 shadow-sm ring-1 ring-black/5">
          {item.type === 'video' && item.video_url ? (
            <div className="aspect-video bg-black">
              {item.video_url.includes('youtube.com') || item.video_url.includes('youtu.be') ? (
                <iframe
                  title={item.title}
                  src={item.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full text-white">
                  <Play className="h-16 w-16" />
                </a>
              )}
            </div>
          ) : usePlaceholder ? (
            <div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-gray-600">
              <span className="text-sm">Image unavailable</span>
            </div>
          ) : (
            <img
              src={item.image}
              alt={item.title || 'Event'}
              className="w-full aspect-video object-cover"
              onError={() => setImageError(true)}
            />
          )}
          {item.badge_image && String(item.badge_image).trim().startsWith('http') && (
            <div className="absolute top-3 left-3 z-10 h-9 w-9 overflow-hidden rounded-md border border-white/30 bg-black/40 shadow-md">
              <img
                src={item.badge_image}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.closest('div')?.remove();
                }}
              />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <h3 className="font-semibold">{item.title}</h3>
            {item.description && <p className="text-sm text-white/90 line-clamp-2">{item.description}</p>}
          </div>
          {items.length > 1 && (
            <>
              <Button variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white" onClick={goPrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white" onClick={goNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {items.map((_, i) => (
                  <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`} aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
            </>
          )}
        </div>
    </>
  );

  if (embedded) {
    return <div className="w-full">{inner}</div>;
  }

  return (
    <section className="py-6 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{inner}</div>
    </section>
  );
};

export default MediaCarousel;
