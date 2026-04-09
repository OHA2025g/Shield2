import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar, User, Search, Tag, ChevronRight, BookOpen, Award, Newspaper } from 'lucide-react';
import { api, getAwardsAccreditations } from '../api';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AWARDS_FILTER_VALUE = 'Awards & Accreditations';
const NEWS_CATEGORY = 'News';

const stripHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [awardsItems, setAwardsItems] = useState([]);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const response = await api.getPublishedBlogs();
        setBlogPosts(response || []);
      } catch (error) {
        console.log('No blog posts available');
        setBlogPosts([]);
      }
    };
    loadBlogPosts();
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await api.getPublishedNews();
        setNewsArticles(response || []);
      } catch {
        setNewsArticles([]);
      }
    };
    loadNews();
  }, []);

  useEffect(() => {
    getAwardsAccreditations()
      .then((d) => setAwardsItems(d.items || []))
      .catch(() => setAwardsItems([]));
  }, []);

  const publishedPosts = blogPosts.filter((post) => post.status === 'published');

  const newsEntries = useMemo(
    () =>
      newsArticles.map((n) => {
        const plain = stripHtml(n.content);
        return {
          entryType: 'news',
          id: n.id,
          title: n.title,
          excerpt: plain.length > 280 ? `${plain.slice(0, 277)}...` : plain || n.title,
          author: n.author || 'Unknown',
          publishDate: n.date,
          category: NEWS_CATEGORY,
          tags: [],
          image: null,
          status: n.status,
        };
      }),
    [newsArticles]
  );

  const blogEntries = useMemo(
    () =>
      publishedPosts.map((post) => ({
        entryType: 'blog',
        ...post,
      })),
    [publishedPosts]
  );

  const mergedForAll = useMemo(() => {
    const merged = [...blogEntries, ...newsEntries];
    merged.sort((a, b) => {
      const ta = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const tb = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return tb - ta;
    });
    return merged;
  }, [blogEntries, newsEntries]);

  const filteredFeed = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const match = (item) =>
      !term ||
      item.title.toLowerCase().includes(term) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(term)) ||
      (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(term)));

    if (selectedCategory === AWARDS_FILTER_VALUE) return [];
    if (selectedCategory === 'All') return mergedForAll.filter(match);
    if (selectedCategory === NEWS_CATEGORY) return newsEntries.filter(match);
    return blogEntries.filter((post) => post.category === selectedCategory && match(post));
  }, [selectedCategory, mergedForAll, newsEntries, blogEntries, searchTerm]);

  const filteredAwards =
    selectedCategory === AWARDS_FILTER_VALUE
      ? awardsItems.filter(
          (item) =>
            !searchTerm ||
            (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.type || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const blogCategories = [
    ...new Set(publishedPosts.map((post) => post.category).filter(Boolean).filter((c) => c !== NEWS_CATEGORY)),
  ].sort();
  const categories = ['All', NEWS_CATEGORY, ...blogCategories, AWARDS_FILTER_VALUE];

  const recentMerged = useMemo(() => mergedForAll.slice(0, 5), [mergedForAll]);

  const allTags = [...new Set(publishedPosts.flatMap((post) => post.tags || []).filter(Boolean))];

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const detailPath = (item) => (item.entryType === 'news' ? `/news/${item.id}` : `/blog/${item.id}`);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-blue-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Blog & News</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Stories of impact, announcements, compliance documents, case studies, and recognition — all in one place.
            Use the filters to browse news posts, articles by topic, or Awards & Accreditations.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-12">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder={
                      selectedCategory === AWARDS_FILTER_VALUE ? 'Search awards...' : 'Search articles and news...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {selectedCategory === AWARDS_FILTER_VALUE ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAwards.length > 0 ? (
                    filteredAwards.map((item) => (
                      <Card key={item.id} className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                        <CardContent className="pt-6">
                          {item.image && (
                            <div className="mb-4 rounded overflow-hidden h-32 bg-gray-100">
                              <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                            </div>
                          )}
                          <div className="flex items-center text-yellow-600 mb-2">
                            <Award className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium capitalize">{item.type || 'award'}</span>
                            {item.year && <span className="text-gray-400 text-sm ml-2">({item.year})</span>}
                          </div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No awards or accreditations found</h3>
                      <p className="text-gray-600">Try adjusting your search or check back later.</p>
                    </div>
                  )}
                </div>
              ) : filteredFeed.length > 0 ? (
                filteredFeed.map((item) => (
                  <Card
                    key={`${item.entryType}-${item.id}`}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="md:flex">
                      {item.entryType === 'blog' && item.image && (
                        <div className="md:w-1/3">
                          <img src={item.image} alt={item.title} className="w-full h-48 md:h-full object-cover" />
                        </div>
                      )}
                      <div className={item.entryType === 'blog' && item.image ? 'md:w-2/3' : 'w-full'}>
                        <CardHeader>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(item.publishDate)}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {item.author}
                            </div>
                            {item.entryType === 'news' ? (
                              <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-200 gap-1">
                                <Newspaper className="h-3 w-3" />
                                News
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{item.category}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-2xl hover:text-blue-600 transition-colors cursor-pointer">
                            <Link to={detailPath(item)}>{item.title}</Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {(item.tags || []).slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              asChild
                            >
                              <Link to={detailPath(item)}>
                                Read More <ChevronRight className="h-4 w-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-8 sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Recent posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMerged.length > 0 ? (
                      recentMerged.map((item) => (
                        <div
                          key={`${item.entryType}-${item.id}`}
                          className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                        >
                          <h4 className="font-semibold text-sm mb-1 hover:text-blue-600 cursor-pointer transition-colors">
                            <Link to={detailPath(item)}>{item.title}</Link>
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(item.publishDate)}
                            </span>
                            {item.entryType === 'news' && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                News
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No posts yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories
                      .filter((cat) => cat !== 'All')
                      .map((category) => {
                        const count =
                          category === AWARDS_FILTER_VALUE
                            ? awardsItems.length
                            : category === NEWS_CATEGORY
                              ? newsEntries.length
                              : publishedPosts.filter((post) => post.category === category).length;
                        return (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedCategory === category
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{category}</span>
                              <span className="text-gray-500">({count})</span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-100 hover:border-blue-300 text-xs"
                        onClick={() => setSearchTerm(tag)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Subscribe to our newsletter for the latest updates and insights.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Your email address" />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
