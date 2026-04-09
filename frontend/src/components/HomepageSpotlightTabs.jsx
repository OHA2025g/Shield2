import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import MediaCarousel from './MediaCarousel';
import { getFeaturedVideo } from '../api';
import { cn } from '../lib/utils';

/**
 * Homepage: Events & Programmes carousel and Featured Story video as one unified “spotlight” card.
 */
const HomepageSpotlightTabs = () => {
  const [video, setVideo] = useState(null);

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

  const mediaShell = 'rounded-xl border border-gray-200/90 bg-gray-950 shadow-sm ring-1 ring-black/5 overflow-hidden';

  return (
    <section className="py-12 sm:py-14 bg-gradient-to-b from-slate-50 via-gray-50/80 to-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="events" className="w-full">
          <div
            className={cn(
              'rounded-2xl border border-gray-200/90 bg-white shadow-md shadow-gray-200/40',
              'overflow-hidden ring-1 ring-gray-950/5'
            )}
          >
            <div className="border-b border-gray-100 bg-gradient-to-b from-slate-50/90 to-gray-50/50 px-3 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">
                Spotlight
              </p>
              <TabsList
                className={cn(
                  'grid h-auto w-full grid-cols-2 gap-1 rounded-xl p-1.5',
                  'bg-white/90 border border-gray-200/80 shadow-inner shadow-gray-200/50'
                )}
              >
                <TabsTrigger
                  value="events"
                  className={cn(
                    'rounded-lg py-3 text-sm font-semibold sm:text-base',
                    'data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm',
                    'data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-800'
                  )}
                >
                  Events &amp; Programmes
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className={cn(
                    'rounded-lg py-3 text-sm font-semibold sm:text-base',
                    'data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm',
                    'data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-800'
                  )}
                >
                  Featured Story
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-gradient-to-b from-gray-50/40 to-white px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6">
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
                  <div className="space-y-4">
                    {video.title && (
                      <p className="text-center text-base sm:text-lg font-semibold text-gray-900 leading-snug px-1">
                        {video.title}
                      </p>
                    )}
                    <div className={cn(mediaShell, 'aspect-video bg-black')}>
                      <iframe
                        title={video.title || 'Featured video'}
                        src={embedUrl}
                        className="h-full w-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                    {video.description && (
                      <p className="text-center text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed px-1">
                        {video.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-gray-200',
                      'bg-gray-50/80 px-4 py-12 text-center text-sm text-gray-500'
                    )}
                  >
                    No featured story video yet. Add one in Admin → Extra Content → Featured Video.
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
