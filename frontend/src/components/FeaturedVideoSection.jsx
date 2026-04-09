import React, { useState, useEffect } from 'react';
import { getFeaturedVideo } from '../api';

const FeaturedVideoSection = () => {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    getFeaturedVideo()
      .then(setVideo)
      .catch(() => setVideo(null));
  }, []);

  if (!video || !video.youtube_url || !video.is_active) return null;

  const embedUrl = video.youtube_url
    .replace('watch?v=', 'embed/')
    .replace('youtu.be/', 'youtube.com/embed/')
    .split('&')[0];

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Story</h2>
          {video.title && <p className="text-sm text-gray-600">{video.title}</p>}
        </div>
        <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
          <iframe
            title={video.title || 'Featured video'}
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        {video.description && <p className="mt-4 text-gray-600 text-center">{video.description}</p>}
      </div>
    </section>
  );
};

export default FeaturedVideoSection;
