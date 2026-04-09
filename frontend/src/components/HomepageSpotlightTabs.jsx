import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CalendarDays, Sparkles } from 'lucide-react';
import MediaCarousel from './MediaCarousel';
import { getFeaturedVideo } from '../api';
import { cn } from '../lib/utils';

/**
 * Homepage: Events & Programmes carousel and Featured Story video in one polished card.
 */
const HomepageSpotlightTabs = () => {
  const [video, setVideo] = useState(null);
  const [mainTab, setMainTab] = useState('events');

  useEffect(() => {
    getFeaturedVideo()
      .then(setVideo)
      .catch(() => setVideo(null));
  }, []);

  const embedUrl =
    video?.youtube_url && video.is_active !== false
      ? video.youtube_url
          .replace('watch?v=', 'embed/')
          .replace('youtu.be/', 'youtube.com/embed/')
          .split('&')[0]
      : null;

  const titleIsPlaceholder =
    video?.title &&
    String(video.title).trim().length > 0 &&
    String(video.title).trim().length < 4 &&
    !/\s/.test(String(video.title).trim());

  const displayVideoTitle =
    video?.title && !titleIsPlaceholder ? video.title : embedUrl ? 'Featured story' : '';

  return (
    <section className="py-12 sm:py-14 bg-gradient-to-b from-slate-50 via-gray-50/80 to-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <div
            className={cn(
              'rounded-2xl border border-gray-200/90 bg-white/80 shadow-lg shadow-gray-200/30',
              'overflow-hidden ring-1 ring-gray-950/[0.04] backdrop-blur-sm'
            )}
          >
            <div
              className={cn(
                'border-b border-gray-100/90 bg-gradient-to-b from-white to-slate-50/90',
                'pl-4 sm:pl-5 border-l-[3px] border-l-blue-600'
              )}
            >
              <div className="py-3 pr-3 sm:py-4 sm:pr-5">
                <div className="relative mx-auto max-w-xl rounded-full bg-gradient-to-b from-slate-200/85 to-slate-300/50 p-1.5 shadow-inner shadow-slate-900/10">
                  <div
                    className={cn(
                      'absolute top-1.5 bottom-1.5 w-[calc(50%-10px)] rounded-full bg-white',
                      'shadow-[0_2px_12px_rgba(30,58,138,0.12),0_1px_2px_rgba(0,0,0,0.06)]',
                      'ring-1 ring-blue-900/[0.06] transition-[left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]'
                    )}
                    style={{
                      left: mainTab === 'events' ? '6px' : 'calc(50% + 4px)',
                    }}
                    aria-hidden
                  />
                  <TabsList className="relative z-10 grid h-11 w-full grid-cols-2 gap-0 bg-transparent p-0">
                    <TabsTrigger
                      value="events"
                      className={cn(
                        'flex h-11 items-center justify-center gap-2 rounded-full bg-transparent text-sm font-semibold',
                        'text-slate-600 shadow-none transition-colors data-[state=active]:text-blue-900 data-[state=active]:shadow-none',
                        'data-[state=inactive]:hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500/30'
                      )}
                    >
                      <CalendarDays className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="hidden sm:inline">Events &amp; Programmes</span>
                      <span className="sm:hidden">Events</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="featured"
                      className={cn(
                        'flex h-11 items-center justify-center gap-2 rounded-full bg-transparent text-sm font-semibold',
                        'text-slate-600 shadow-none transition-colors data-[state=active]:text-blue-900 data-[state=active]:shadow-none',
                        'data-[state=inactive]:hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500/30'
                      )}
                    >
                      <Sparkles className="h-4 w-4 shrink-0 text-amber-500/90" aria-hidden />
                      <span className="hidden sm:inline">Featured Story</span>
                      <span className="sm:hidden">Featured</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-50/50 to-white px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6">
              <TabsContent value="events" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                <MediaCarousel
                  title=""
                  categoryFilter="events_programmes"
                  autoScrollInterval={6000}
                  embedded
                />
              </TabsContent>
              <TabsContent value="featured" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {embedUrl ? (
                  <div className="group/media relative overflow-hidden rounded-2xl border border-gray-200/90 bg-black shadow-md ring-1 ring-black/5">
                    <div className="aspect-video w-full">
                      <iframe
                        title={video.title || 'Featured video'}
                        src={embedUrl}
                        className="h-full w-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                      aria-hidden
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5 pt-12 sm:pt-16">
                      <div
                        className={cn(
                          'rounded-xl border border-white/30 px-4 py-3 shadow-lg',
                          'bg-white/60 backdrop-blur-md supports-[backdrop-filter]:bg-white/[0.55]',
                          'dark:border-white/20 dark:bg-white/10'
                        )}
                      >
                        <span className="mb-2 inline-block rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-900 shadow-sm">
                          Success story
                        </span>
                        {displayVideoTitle && (
                          <p className="text-base font-bold leading-snug text-gray-900 sm:text-lg">{displayVideoTitle}</p>
                        )}
                        {video.description && (
                          <p className="mt-1.5 text-sm leading-relaxed text-gray-700 line-clamp-3">{video.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200',
                      'bg-gradient-to-br from-slate-50 to-gray-100/80 px-4 py-12 text-center'
                    )}
                  >
                    <Sparkles className="h-8 w-8 text-amber-400/80" aria-hidden />
                    <p className="text-sm font-medium text-gray-600">Check back soon for updates</p>
                    <p className="max-w-sm text-xs text-gray-500">
                      A featured story video can be added in Admin → Extra Content → Featured Video.
                    </p>
                  </div>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default HomepageSpotlightTabs;
