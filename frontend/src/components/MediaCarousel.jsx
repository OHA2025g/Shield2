import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { getGalleryItems } from '../api';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const MediaCarousel = ({ categoryFilter = null, title = 'Gallery', autoScrollInterval = 5000, embedded = false }) => {
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

  const goPrev = () => {
    setImageError(false);
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };
  const goNext = () => {
    setImageError(false);
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (embedded && loading) {
    return (
      <div className="w-full space-y-3">
        <div className="aspect-video w-full animate-pulse rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
        <div className="mx-auto h-3 w-2/3 max-w-md animate-pulse rounded-md bg-slate-200/80" />
        <div className="mx-auto h-3 w-1/2 max-w-sm animate-pulse rounded-md bg-slate-100" />
      </div>
    );
  }

  if (!embedded && (loading || items.length === 0)) return null;

  if (embedded && !loading && items.length === 0) {
    return (
      <div
        className={cn(
          'flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200',
          'bg-gradient-to-br from-slate-50 to-gray-100/80 px-4 py-12 text-center'
        )}
      >
        <p className="text-sm font-medium text-gray-600">Check back soon for updates</p>
        <p className="max-w-sm text-xs text-gray-500">
          Add slides under Admin → Extra Content → Events &amp; Programmes carousel.
        </p>
      </div>
    );
  }

  const item = items[currentIndex];
  const showImage = item.type !== 'video' && item.image && item.image.trim();
  const usePlaceholder = imageError || !showImage;

  const titleText = item.title?.trim() || 'Event';
  const descText = item.description?.trim() || '';
  const titleLooksLikePlaceholder =
    titleText.length > 0 && titleText.length <= 4 && !/\s/.test(titleText) && /^[a-z0-9]+$/i.test(titleText);

  const inner = (
    <>
      {title && !embedded && (
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">{title}</h2>
      )}
      <div className="w-full space-y-3">
        <div
          className={cn(
            'group/car relative overflow-hidden rounded-2xl border border-gray-200/90 bg-gray-950',
            'shadow-md ring-1 ring-black/[0.06]'
          )}
        >
          {item.type === 'video' && item.video_url ? (
            <div className="aspect-video w-full bg-black">
              {item.video_url.includes('youtube.com') || item.video_url.includes('youtu.be') ? (
                <iframe
                  title={item.title}
                  src={item.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="h-full w-full"
                  allowFullScreen
                />
              ) : (
                <a
                  href={item.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full items-center justify-center text-white"
                >
                  <Play className="h-16 w-16" />
                </a>
              )}
            </div>
          ) : usePlaceholder ? (
            <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-gray-600">
              <span className="text-sm">Image unavailable</span>
            </div>
          ) : (
            <div className="aspect-video w-full overflow-hidden bg-black">
              <img
                src={item.image}
                alt={item.title || 'Event'}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/car:scale-[1.03]"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {item.badge_image && String(item.badge_image).trim().startsWith('http') && (
            <div className="absolute left-3 top-3 z-10 h-9 w-9 overflow-hidden rounded-md border border-white/30 bg-black/40 shadow-md">
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

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />

          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5 pt-14 sm:pt-20">
            <div
              className={cn(
                'rounded-xl border border-white/35 px-4 py-3 shadow-lg',
                'bg-white/60 backdrop-blur-md supports-[backdrop-filter]:bg-white/[0.58]',
                'dark:border-white/20 dark:bg-white/10'
              )}
            >
              {embedded && (
                <span className="mb-2 inline-block rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                  {item.type === 'video' ? 'Video' : 'Programme'}
                </span>
              )}
              <h3 className="text-base font-bold leading-snug text-gray-900 sm:text-lg">
                {titleLooksLikePlaceholder ? 'Events & programmes' : titleText}
              </h3>
              {descText ? (
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700 line-clamp-2">{descText}</p>
              ) : null}
            </div>
          </div>

          {items.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 z-20 h-9 w-9 -translate-y-1/2 border-white/40 bg-white/90 shadow-md hover:bg-white"
                onClick={goPrev}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 z-20 h-9 w-9 -translate-y-1/2 border-white/40 bg-white/90 shadow-md hover:bg-white"
                onClick={goNext}
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="flex items-center justify-center gap-2 px-1" role="tablist" aria-label="Slide indicators">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === currentIndex ? 'true' : undefined}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === currentIndex ? 'w-8 bg-blue-600 shadow-sm shadow-blue-600/30' : 'w-2 bg-slate-300 hover:bg-slate-400'
                )}
              />
            ))}
          </div>
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
