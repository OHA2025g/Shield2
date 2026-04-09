import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Heart, Users, TrendingUp, MapPin } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel';
import { api, getPublicSiteContent, getSuccessStories, getDetailedPageSections, getDailyQuote } from '../api';
import Header from './Header';
import Footer from './Footer';
import ImpactHighlightsSection from './ImpactHighlightsSection';
import PlacementStoriesSection from './PlacementStoriesSection';

const Impact = () => {
  const [siteContent, setSiteContent] = useState({});
  const [successStories, setSuccessStories] = useState([]);
  const [impactStats, setImpactStats] = useState({});
  const [pageSections, setPageSections] = useState([]);
  const [impactHighlights, setImpactHighlights] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const backendContent = await getPublicSiteContent();
        if (backendContent.content && Object.keys(backendContent.content).length > 0) {
          setSiteContent(backendContent.content);
        } else {
          setSiteContent({});
        }

        try {
          const storiesData = await getSuccessStories();
          if (storiesData.stories && storiesData.stories.length > 0) {
            setSuccessStories(storiesData.stories);
          }
        } catch (storiesError) {
          console.log('Using empty success stories');
        }

        try {
          const statsData = await api.getImpactStats();
          if (statsData && Object.keys(statsData).length > 0) {
            setImpactStats(statsData);
          }
        } catch (statsError) {
          console.log('Using fallback impact statistics');
        }

        try {
          const sectionsData = await getDetailedPageSections('impact');
          setPageSections(sectionsData.sections || []);
        } catch (sectionsError) {
          console.log('Using empty page sections');
        }

        try {
          let lang = 'en';
          try {
            lang = localStorage.getItem('shield_quote_lang') || 'en';
          } catch {
            lang = 'en';
          }
          const quote = await getDailyQuote(lang);
          if (quote && quote.quote) setDailyQuote(quote);
        } catch {
          setDailyQuote(null);
        }
      } catch (error) {
        setSiteContent({});
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Our Impact heading, quote in background; reduced height */}
      <section className="relative bg-gradient-to-br from-blue-50 to-yellow-50 pt-5 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[200px] flex flex-col">
        {/* Quote of the day - background layer, moved upward */}
        {dailyQuote && dailyQuote.quote && (
          <div className="absolute inset-0 flex items-center justify-center pt-16 pb-4 px-4 pointer-events-none" aria-hidden="true">
            <blockquote className="text-center max-w-3xl">
              <span className="text-lg md:text-xl lg:text-2xl font-medium italic text-blue-700 leading-snug">
                "{dailyQuote.quote}"
              </span>
              {dailyQuote.author && (
                <span className="block mt-1.5 text-sm font-medium text-blue-600">— {dailyQuote.author}</span>
              )}
            </blockquote>
          </div>
        )}
        {/* Overlay stronger at top for heading, lighter in middle so quote stands out */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-blue-50/50 to-yellow-50/30 pointer-events-none" aria-hidden="true" />
        {/* Our Impact heading only */}
        <div className="relative z-10 max-w-7xl mx-auto text-center flex-shrink-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {siteContent.impact?.hero?.title || "Our Impact"}
          </h1>
          {siteContent.impact?.hero?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-2">
              {siteContent.impact?.hero?.description}
            </p>
          )}
        </div>
      </section>

      {/* Impact Highlights Section - Dynamic from Admin Panel */}
      <ImpactHighlightsSection />

      {/* Placement Stories - just above Success Stories */}
      <PlacementStoriesSection />

      {/* Legacy Impact Highlights (keeping for reference) */}
      {impactHighlights.length > 0 && (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Additional Highlights</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key achievements that demonstrate our commitment to community transformation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {impactHighlights.map((highlight, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {highlight.icon === 'Users' && <Users className="h-8 w-8 text-blue-600" />}
                    {highlight.icon === 'Heart' && <Heart className="h-8 w-8 text-yellow-500" />}
                    {highlight.icon === 'TrendingUp' && <TrendingUp className="h-8 w-8 text-blue-600" />}
                    <CardTitle className="text-xl text-gray-900">{highlight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{highlight.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600 font-semibold">{highlight.metric}</span>
                    <span className="text-gray-500">{highlight.period}</span>
                  </div>
                  <Progress value={highlight.progress} className="mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Success Stories - refined layout */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Success Stories</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Real stories from the lives we've touched and transformed
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {successStories.length > 0 ? (
              successStories.map((story, index) => (
                <Card key={index} className="rounded-xl border border-gray-200/80 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow">
                      {story.program}
                    </span>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{story.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mb-3">
                      <span className="text-blue-600 font-medium">{story.achievement}</span>
                      {story.location && (
                        <span className="flex items-center text-gray-500">
                          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          {story.location}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 flex-1">{story.story}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-14 rounded-xl bg-white border border-gray-200/80">
                <p className="text-gray-500">Success stories coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Dynamic Page Sections */}
      {pageSections.length > 0 && (
        <div className="space-y-16">
          {pageSections.map((section, index) => (
            <section key={section.id} className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-8">
                  {/* Text Content */}
                  {section.content.text && (
                    <div className="prose max-w-none text-lg text-gray-600 leading-relaxed">
                      <p>{section.content.text}</p>
                    </div>
                  )}

                  {/* HTML Content */}
                  {section.content.html && (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content.html }}
                    />
                  )}

                  {/* Featured Image */}
                  {section.content.image_url && (
                    <div className="text-center">
                      <img 
                        src={section.content.image_url} 
                        alt={section.title}
                        className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      />
                    </div>
                  )}

                  {/* Dynamic Items */}
                  {section.content.items && section.content.items.length > 0 && (
                    (section.content.metadata?.display_as_carousel === true) ? (
                      <div className="w-full max-w-6xl mx-auto relative">
                        <Carousel className="w-full">
                          <CarouselContent className="-ml-2 md:-ml-4">
                            {section.content.items.map((item, itemIndex) => (
                              <CarouselItem key={itemIndex} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                                  {item.image_url && item.image_url.trim() !== '' && (
                                    <div className="mb-4 flex items-center justify-center bg-gray-50 rounded-lg p-4" style={{ minHeight: '160px', maxHeight: '160px' }}>
                                      <img 
                                        src={item.image_url} 
                                        alt={item.title || 'Item image'}
                                        className="max-w-full max-h-full object-contain"
                                        style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '132px' }}
                                        onError={(e) => {
                                          console.error('Failed to load image:', item.image_url, 'for item:', item.title);
                                          e.target.style.display = 'none';
                                        }}
                                        onLoad={() => {
                                          console.log('Image loaded successfully:', item.image_url);
                                        }}
                                      />
                                    </div>
                                  )}
                                  {item.title && (
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                      {item.title}
                                    </h3>
                                  )}
                                  {item.description && (
                                    <p className="text-gray-600">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-0 md:-left-12" />
                          <CarouselNext className="right-0 md:-right-12" />
                        </Carousel>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.content.items.map((item, itemIndex) => {
                          // Debug: log item data
                          if (item.image_url) {
                            console.log('Item with image:', { index: itemIndex, title: item.title, image_url: item.image_url });
                          }
                          return (
                          <div key={itemIndex} className="bg-white p-6 rounded-lg shadow-md">
                            {item.image_url && item.image_url.trim() !== '' && (
                              <div className="mb-4 flex items-center justify-center bg-gray-50 rounded-lg p-4" style={{ minHeight: '160px', maxHeight: '160px' }}>
                                <img 
                                  src={item.image_url} 
                                  alt={item.title || 'Item image'}
                                  className="max-w-full max-h-full object-contain"
                                  style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '132px' }}
                                  onError={(e) => {
                                    console.error('Failed to load image:', item.image_url, 'for item:', item.title);
                                    e.target.style.display = 'none';
                                  }}
                                  onLoad={() => {
                                    console.log('Image loaded successfully:', item.image_url);
                                  }}
                                />
                              </div>
                            )}
                            {item.title && (
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {item.title}
                              </h3>
                            )}
                            {item.description && (
                              <p className="text-gray-600">
                                {item.description}
                              </p>
                            )}
                          </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      
      {/* Geographic Impact */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Reach</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Serving communities across Mumbai, Maharashtra, and surrounding areas through our centres and outreach
            </p>
          </div>

          <div className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Presence of Our Centers & Services</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">Matunga Labour Camp</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">Dharavi</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">Chembur</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">Mankhurd</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">Dhaba, Nagpur</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-7xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Total Community Impact</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">8,500+</div>
                  <div className="text-gray-600">Total Beneficiaries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">15+</div>
                  <div className="text-gray-600">Communities Served</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">16+</div>
                  <div className="text-gray-600">Years of Service</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">100%</div>
                  <div className="text-gray-600">Community-Focused</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Impact;
