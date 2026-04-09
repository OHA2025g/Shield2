import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPlacementStories } from '../api';
import { Button } from './ui/button';

const PlacementStoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    getPlacementStories()
      .then((d) => setStories(d.stories || []))
      .catch(() => setStories([]));
  }, []);

  useEffect(() => {
    if (stories.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p === stories.length - 1 ? 0 : p + 1)), 6000);
    return () => clearInterval(t);
  }, [stories.length]);

  if (stories.length === 0) return null;

  const s = stories[idx];
  const goPrev = () => setIdx((p) => (p === 0 ? stories.length - 1 : p - 1));
  const goNext = () => setIdx((p) => (p === stories.length - 1 ? 0 : p + 1));

  return (
    <section className="py-10 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Placement Stories</h2>
          <p className="text-sm text-gray-600">Employment journeys and outcomes of our beneficiaries</p>
        </div>
        <div className="relative">
          <Card className="overflow-hidden shadow-lg">
            <div className="flex flex-col sm:flex-row">
              {s.image && (
                <div className="w-full sm:w-56 h-48 sm:h-auto flex-shrink-0">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="flex-1 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.name}</h3>
                {(s.role_placed || s.company) && (
                  <div className="flex items-center text-blue-600 mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {[s.role_placed, s.company].filter(Boolean).join(' • ')}
                  </div>
                )}
                {s.program && <p className="text-sm text-gray-500 mb-2">Program: {s.program}</p>}
                <p className="text-gray-700">{s.story}</p>
              </CardContent>
            </div>
          </Card>
          {stories.length > 1 && (
            <>
              <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white shadow z-10" onClick={goPrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white shadow z-10" onClick={goNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="flex justify-center mt-4 gap-1">
                {stories.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-blue-600' : 'bg-gray-300'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlacementStoriesSection;
