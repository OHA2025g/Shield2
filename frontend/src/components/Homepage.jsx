import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Heart, Users, GraduationCap, Award, Phone, Mail, MapPin, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { api, getPublicSiteContent } from '../api';

import Header from './Header';
import Footer from './Footer';
import TestimonialsSection from './TestimonialsSection';
import OrgOverviewSection from './OrgOverviewSection';
import HeroBackgroundCarousel from './HeroBackgroundCarousel';
import MediaCarousel from './MediaCarousel';
import SuccessStoriesByCategory from './SuccessStoriesByCategory';
import FeaturedVideoSection from './FeaturedVideoSection';
import EngagementSection from './EngagementSection';
import DailyQuoteSection from './DailyQuoteSection';
import ManagementMessagesSection from './ManagementMessagesSection';

const Homepage = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', inquiryType: 'general' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [impactStats, setImpactStats] = useState({});

  // Site content state
  const [siteContent, setSiteContent] = useState({});

  // Load site content and impact statistics on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load impact statistics
        const stats = await api.getImpactStats();
        setImpactStats(stats);
        
        // Load site content from database API
        try {
          const backendContent = await getPublicSiteContent();
          if (backendContent.content && Object.keys(backendContent.content).length > 0) {
            setSiteContent(backendContent.content);
          } else {
            setSiteContent({});
          }
        } catch (error) {
          console.log('Using empty site content');
          setSiteContent({});
        }
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.submitContactForm(contactForm);
      toast({
        title: "Success",
        description: response.message,
      });
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '', inquiryType: 'general' });
    } catch (error) {
      // Handle FastAPI validation errors properly
      let errorMessage = "Failed to send message. Please try again.";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            const validationErrors = error.response.data.detail.map(err => {
              const field = err.loc?.join(' ') || 'field';
              return `${field}: ${err.msg}`;
            }).join(', ');
            errorMessage = `Validation error: ${validationErrors}`;
          } else if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    
    try {
      const response = await api.subscribeNewsletter(newsletterEmail);
      toast({
        title: "Success",
        description: response.message,
      });
      setNewsletterEmail('');
    } catch (error) {
      // Handle FastAPI validation errors properly
      let errorMessage = "Failed to subscribe. Please try again.";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            const validationErrors = error.response.data.detail.map(err => {
              const field = err.loc?.join(' ') || 'field';
              return `${field}: ${err.msg}`;
            }).join(', ');
            errorMessage = `Validation error: ${validationErrors}`;
          } else if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      
      {/* Hero Section with NGO imagery carousel (always an image, never grey) */}
      <section
        className="relative py-20 overflow-hidden min-h-[420px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1523240795612-9a1b7227348e?w=1920&h=1080&fit=crop)`,
        }}
      >
        <HeroBackgroundCarousel />
        <div className="absolute inset-0 z-[1] bg-black/35" aria-hidden="true" />
        <div className="relative z-[2] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-6">
              {siteContent?.homepage?.hero?.title || "Adding Life to Years"}
            </h1>
            <p className="text-xl md:text-2xl text-white/95 drop-shadow mb-8 max-w-4xl mx-auto">
              {siteContent?.homepage?.hero?.description || "Empowering Youth & Caring for Seniors - Shield Foundation equips and empowers communities so that every individual can live with dignity till the end of life."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-lg"
              >
                <Link to="/contact">
                  {siteContent?.homepage?.hero?.primaryButton || "Support Our Cause"}
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white bg-white/10 hover:bg-white/20 px-8 py-3 text-lg shadow-lg"
              >
                <Link to="/contact">
                  {siteContent?.homepage?.hero?.secondaryButton || "Partner With Us"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                {impactStats.youthTrained?.toLocaleString()}+
              </div>
              <div className="text-gray-600 text-sm">Youth Trained</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-1">
                {impactStats.youthPlaced?.toLocaleString()}+
              </div>
              <div className="text-gray-600 text-sm">Youth Placed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                {impactStats.seniorsSupported?.toLocaleString()}+
              </div>
              <div className="text-gray-600 text-sm">Seniors Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-1">
                {impactStats.womenEmpowered}+
              </div>
              <div className="text-gray-600 text-sm">Women Empowered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Organisation Overview (About SHIELD Foundation) */}
      <OrgOverviewSection />

      <DailyQuoteSection />

      {/* Programs Overview */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {siteContent?.homepage?.programs?.title || "Our Core Programs"}
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {siteContent?.homepage?.programs?.subtitle || "Shield Foundation focuses on two major domains that create lasting impact in communities"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Youth Skilling */}
            <Card className="h-full hover:shadow-md transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-9 w-9 text-blue-600 mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <CardTitle className="text-lg">
                      {siteContent?.homepage?.programs?.youthProgram?.title || "Youth Skilling & Livelihoods"}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {siteContent?.homepage?.programs?.youthProgram?.partnership || ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3 flex flex-col flex-grow">
                <div className="flex-grow">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {siteContent?.homepage?.programs?.youthProgram?.description || "Specialized vocational training programs for underprivileged youth focusing on CRS, ITES-BPO, and Nursing Assistant courses."}
                  </p>
                  <div className="space-y-1 mb-3">
                    {siteContent?.homepage?.programs?.youthProgram?.feature1 && (
                      <div className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                        {siteContent.homepage.programs.youthProgram.feature1}
                      </div>
                    )}
                    {siteContent?.homepage?.programs?.youthProgram?.feature2 && (
                      <div className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                        {siteContent.homepage.programs.youthProgram.feature2}
                      </div>
                    )}
                    {siteContent?.homepage?.programs?.youthProgram?.feature3 && (
                      <div className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                        {siteContent.homepage.programs.youthProgram.feature3}
                      </div>
                    )}
                    {!siteContent?.homepage?.programs?.youthProgram?.feature1 && (
                      <>
                        <div className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                          {impactStats.youthTrained?.toLocaleString()}+ youth trained across all programs
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                          {impactStats.youthPlaced?.toLocaleString()}+ placed with reputed employers
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                          Average salary: ₹8,700 - ₹13,946/month
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto text-sm">
                  <Link to="/programs">
                    {siteContent?.homepage?.programs?.youthProgram?.buttonText || "Learn More"} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Senior Citizens */}
            <Card className="h-full hover:shadow-md transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center mb-2">
                  <Heart className="h-9 w-9 text-yellow-500 mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <CardTitle className="text-lg">
                      {siteContent?.homepage?.programs?.seniorProgram?.title || "Senior Citizens Services"}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {siteContent?.homepage?.programs?.seniorProgram?.subtitle || "Multi-Service Support Centers"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3 flex flex-col flex-grow">
                <div className="flex-grow">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {siteContent?.homepage?.programs?.seniorProgram?.description || "Comprehensive healthcare, psychosocial, legal, and recreational services for elderly in Dharavi and beyond."}
                  </p>
                  <div className="space-y-1 mb-3">
                    {siteContent?.homepage?.programs?.seniorProgram?.feature1 && (
                      <div className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                        {siteContent.homepage.programs.seniorProgram.feature1}
                      </div>
                    )}
                    {siteContent?.homepage?.programs?.seniorProgram?.feature2 && (
                      <div className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                        {siteContent.homepage.programs.seniorProgram.feature2}
                      </div>
                    )}
                    {siteContent?.homepage?.programs?.seniorProgram?.feature3 && (
                      <div className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                        {siteContent.homepage.programs.seniorProgram.feature3}
                      </div>
                    )}
                    {!siteContent?.homepage?.programs?.seniorProgram?.feature1 && (
                      <>
                        <div className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                          2000+ seniors in daily exercise & yoga
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                          750+ free cataract surgeries performed
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                          500+ elder abuse cases addressed
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Button asChild size="sm" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black mt-auto text-sm">
                  <Link to="/programs">
                    {siteContent?.homepage?.programs?.seniorProgram?.buttonText || "Learn More"} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dynamic Media Gallery - Events & Programmes carousel */}
      <MediaCarousel
        title="Events & Programmes"
        categoryFilter="events_programmes"
        autoScrollInterval={6000}
      />

      {/* Success Stories - Senior Citizens & Youth Skill Training */}
      <SuccessStoriesByCategory />

      {/* Featured Video (e.g. Daniel's home-bound patient story) */}
      <FeaturedVideoSection />

      <ManagementMessagesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Visitor Engagement & Support (Support / Partner / Contribute) */}
      <EngagementSection />

      {/* Contact Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <p className="text-white/80 text-sm">{siteContent?.contact?.contactInfo?.email || ""}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <p className="text-white/80 text-sm">{siteContent?.contact?.contactInfo?.phone || ""}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Address</p>
                    <p className="text-white/80 text-sm">{siteContent?.contact?.contactInfo?.address || ""}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Office Hours</p>
                    <p className="text-white/80 text-sm">{siteContent?.contact?.contactInfo?.office_hours || ""}</p>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8 p-4 bg-white/10 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Button 
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black whitespace-nowrap"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
