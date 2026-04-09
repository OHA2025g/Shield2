import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { ChevronLeft, ChevronRight, MapPin, Award } from 'lucide-react';
import { getSuccessStories } from '../api';

const CategoryCarousel = ({ title, stories, autoScroll = 6000 }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (stories.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p === stories.length - 1 ? 0 : p + 1)), autoScroll);
    return () => clearInterval(t);
  }, [stories.length, autoScroll]);

  if (stories.length === 0) return null;

  const story = stories[idx];
  const goPrev = () => setIdx((p) => (p === 0 ? stories.length - 1 : p - 1));
  const goNext = () => setIdx((p) => (p === stories.length - 1 ? 0 : p + 1));

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="relative">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
              <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded text-xs">{story.program}</span>
            </div>
            <CardContent className="flex-1 p-4 flex flex-col justify-center">
              <h4 className="font-bold text-gray-900">{story.name}</h4>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <MapPin className="h-4 w-4 mr-1" />
                {story.location}
              </div>
              <blockquote className="text-gray-600 italic text-sm mb-2 line-clamp-3">"{story.story}"</blockquote>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                <Award className="h-4 w-4 mr-1" />
                {story.achievement}
              </div>
            </CardContent>
          </div>
        </Card>
        {stories.length > 1 && (
          <>
            <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white shadow z-10 h-8 w-8" onClick={goPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white shadow z-10 h-8 w-8" onClick={goNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="flex justify-center mt-2 gap-1">
              {stories.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-blue-600' : 'bg-gray-300'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const SuccessStoriesByCategory = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    getSuccessStories()
      .then((d) => setStories(d.stories || []))
      .catch(() => setStories([]));
  }, []);

  const senior = stories.filter((s) => (s.category || '').toLowerCase() === 'senior_citizens');
  const youth = stories.filter((s) => (s.category || '').toLowerCase() === 'youth_skill_training');
  const hasAny = senior.length > 0 || youth.length > 0;

  if (!hasAny) return null;

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success Stories</h2>
          <p className="text-sm text-gray-600">Stories from our Senior Citizens and Youth Skill Training programmes</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <CategoryCarousel title="Senior Citizens" stories={senior} />
          <CategoryCarousel title="Youth Skill Training" stories={youth} />
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesByCategory;
