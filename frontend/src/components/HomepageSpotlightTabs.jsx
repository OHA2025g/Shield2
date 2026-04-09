import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import MediaCarousel from './MediaCarousel';
import { getFeaturedVideo } from '../api';

/**
 * Homepage: Events & Programmes carousel and Featured Story video in one tabbed block.
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

  return (
    <section className="py-10 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 h-auto gap-1 p-1 mb-6">
            <TabsTrigger value="events" className="text-sm sm:text-base py-2.5">
              Events & Programmes
            </TabsTrigger>
            <TabsTrigger value="featured" className="text-sm sm:text-base py-2.5">
              Featured Story
            </TabsTrigger>
          </TabsList>
          <TabsContent value="events" className="mt-0 rounded-md focus-visible:outline-none">
            <MediaCarousel title="" categoryFilter="events_programmes" autoScrollInterval={6000} />
          </TabsContent>
          <TabsContent value="featured" className="mt-0 rounded-md focus-visible:outline-none">
            {embedUrl ? (
              <div className="space-y-4">
                <div className="text-center">
                  {video.title && <p className="text-lg font-semibold text-gray-900">{video.title}</p>}
                </div>
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black border border-gray-200">
                  <iframe
                    title={video.title || 'Featured video'}
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                {video.description && (
                  <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto">{video.description}</p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-white py-16 text-center text-gray-500 text-sm">
                No featured story video is set yet. Add one in Admin → Extra Content → Featured Video.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default HomepageSpotlightTabs;
