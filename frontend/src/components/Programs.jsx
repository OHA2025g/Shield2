import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Users, Award, CheckCircle, Building, Calendar, Clock, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { getPublicSiteContent, getDetailedPageSections, getYouthCourses, getSeniorCentres } from '../api';
import { api } from '../api';
import { useToast } from '../hooks/use-toast';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import Header from './Header';
import Footer from './Footer';

const Programs = () => {
  const { toast } = useToast();
  const [siteContent, setSiteContent] = useState({});
  const [pageSections, setPageSections] = useState([]);
  const [youthCourses, setYouthCourses] = useState([]);
  const [seniorCentres, setSeniorCentres] = useState([]);
  const [activeTab, setActiveTab] = useState('youth');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryCourse, setEnquiryCourse] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [enquiryLoading, setEnquiryLoading] = useState(false);

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
          const sectionsData = await getDetailedPageSections('programs');
          setPageSections(sectionsData.sections || []);
        } catch (sectionsError) {
          console.log('Using empty page sections');
        }
        getYouthCourses().then((d) => setYouthCourses(d.courses || [])).catch(() => setYouthCourses([]));
        getSeniorCentres().then((d) => setSeniorCentres(d.centres || [])).catch(() => setSeniorCentres([]));
      } catch (error) {
        setSiteContent({});
      }
    };
    loadData();
  }, []);

  const openEnquiry = (course) => {
    setEnquiryCourse(course);
    setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    setEnquiryOpen(true);
  };

  const submitEnquiry = async (e) => {
    e.preventDefault();
    if (!enquiryCourse) return;
    setEnquiryLoading(true);
    try {
      await api.submitCourseEnquiry({
        course_id: enquiryCourse.id,
        course_name: enquiryCourse.name,
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone || undefined,
        message: enquiryForm.message || undefined,
      });
      toast({ title: 'Thank you!', description: 'We will get back to you soon.' });
      setEnquiryOpen(false);
    } catch (err) {
      toast({ title: 'Error', description: 'Could not submit. Please try again.', variant: 'destructive' });
    }
    setEnquiryLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-yellow-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {siteContent.programs?.hero?.title || "Our Programs"}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {siteContent.programs?.hero?.subtitle || "Shield Foundation focuses on two major domains that create lasting impact in communities"}
          </p>
          {siteContent.programs?.hero?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              {siteContent.programs?.hero?.description}
            </p>
          )}
          <div className="mt-6">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/apply#course">Enrol in a course – fill the form →</Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Our Programs - Tabbed Interface */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 mb-8 h-14">
              <TabsTrigger value="youth" className="text-base py-3 h-full flex items-center justify-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Youth Skills & Livelihood
              </TabsTrigger>
              <TabsTrigger value="seniors" className="text-base py-3 h-full flex items-center justify-center">
                <Heart className="h-5 w-5 mr-2" />
                Senior Citizens Services
              </TabsTrigger>
            </TabsList>

            {/* Youth Skills and Livelihood Tab */}
            <TabsContent value="youth" className="space-y-8">
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="flex items-center mb-4">
                    <GraduationCap className="h-12 w-12 text-blue-600 mr-4" />
        <div>
                      <CardTitle className="text-3xl text-gray-900">Youth Skills & Livelihood</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        Empowering youth with vocational skills for sustainable livelihoods
                      </CardDescription>
                    </div>
                </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Featured Image */}
                  {pageSections.find(s => s.title?.toLowerCase().includes('youth'))?.content?.image_url && (
                    <div className="text-center mb-6">
                      <img 
                        src={pageSections.find(s => s.title?.toLowerCase().includes('youth')).content.image_url}
                        alt="Youth Skills and Livelihood"
                        width="800"
                        height="450"
                        className="rounded-lg shadow-lg mx-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="prose max-w-none text-lg text-gray-700 leading-relaxed">
                    <p>
                      {pageSections.find(s => s.title?.toLowerCase().includes('youth'))?.content?.text ||
                       "Specialized vocational training programs for underprivileged youth focusing on CRS, ITES-BPO, and Nursing Assistant courses."}
                    </p>
                  </div>

                  {/* HTML Content */}
                  {pageSections.find(s => s.title?.toLowerCase().includes('youth'))?.content?.html && (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: pageSections.find(s => s.title?.toLowerCase().includes('youth')).content.html 
                      }}
                    />
                  )}

                  {/* Key Highlights - Editable from Admin */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-6 w-6 text-blue-600 mr-2" />
                      Key Highlights
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pageSections.find(s => s.title?.toLowerCase().includes('youth'))?.content?.items?.length > 0 ? (
                        // Display highlights from admin panel
                        pageSections.find(s => s.title?.toLowerCase().includes('youth')).content.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              {item.title && item.description ? (
                                <>
                                  <strong className="font-bold">{item.title}:</strong> {item.description}
                                </>
                              ) : item.title || item.description}
                            </span>
                          </div>
                        ))
                      ) : (
                        // Fallback to default highlights
                        <>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Vocational training in CRS, ITES-BPO, Nursing Assistant</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">High placement rates with reputed employers</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Average salary: ₹8,700 - ₹13,946/month</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Soft skills and personality development</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Course-wise details with enquiry */}
                  {youthCourses.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Courses</h3>
                      <div className="space-y-4">
                        {youthCourses.map((course) => (
                          <Card key={course.id} className="border-blue-100">
                            <CardContent className="pt-6">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg text-gray-900">{course.name}</h4>
                                  <p className="text-gray-600 mt-1">{course.description}</p>
                                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                    {course.duration && (
                                      <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {course.duration}</span>
                                    )}
                                    {course.job_prospects && (
                                      <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1" /> {course.job_prospects}</span>
                                    )}
                                  </div>
                                  {course.eligibility && <p className="text-sm text-gray-500 mt-1">Eligibility: {course.eligibility}</p>}
                                </div>
                                <Button variant="outline" size="sm" className="shrink-0" onClick={() => openEnquiry(course)}>
                                  Enquire / Apply
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Senior Citizens Services Tab */}
            <TabsContent value="seniors" className="space-y-8">
              <Card className="border-2 border-yellow-200">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                  <div className="flex items-center mb-4">
                    <Heart className="h-12 w-12 text-yellow-600 mr-4" />
                    <div>
                      <CardTitle className="text-3xl text-gray-900">Senior Citizens Services</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        Adding life to years through comprehensive senior care
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Featured Image */}
                  {pageSections.find(s => s.title?.toLowerCase().includes('senior'))?.content?.image_url && (
                    <div className="text-center mb-6">
                      <img 
                        src={pageSections.find(s => s.title?.toLowerCase().includes('senior')).content.image_url}
                        alt="Senior Citizens Services"
                        width="800"
                        height="450"
                        className="rounded-lg shadow-lg mx-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="prose max-w-none text-lg text-gray-700 leading-relaxed">
                    <p>
                      {pageSections.find(s => s.title?.toLowerCase().includes('senior'))?.content?.text ||
                       "Comprehensive health and social support programs for senior citizens focusing on physical well-being, mental health, and community engagement."}
                    </p>
                  </div>

                  {/* HTML Content */}
                  {pageSections.find(s => s.title?.toLowerCase().includes('senior'))?.content?.html && (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: pageSections.find(s => s.title?.toLowerCase().includes('senior')).content.html 
                      }}
                    />
                  )}

                  {/* Key Highlights - Editable from Admin */}
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-6 w-6 text-yellow-600 mr-2" />
                      Key Highlights
                            </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pageSections.find(s => s.title?.toLowerCase().includes('senior'))?.content?.items?.length > 0 ? (
                        // Display highlights from admin panel
                        pageSections.find(s => s.title?.toLowerCase().includes('senior')).content.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              {item.title && item.description ? (
                                <>
                                  <strong className="font-bold">{item.title}:</strong> {item.description}
                                </>
                              ) : item.title || item.description}
                            </span>
                          </div>
                        ))
                      ) : (
                        // Fallback to default highlights
                        <>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Regular health check-ups and medical support</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Social activities and community engagement</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Physiotherapy and wellness programs</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Mental health and counseling support</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Centre-wise bifurcation */}
                  {seniorCentres.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Centres</h3>
                      <div className="space-y-6">
                        {seniorCentres.map((centre) => (
                          <Card key={centre.id} className="border-yellow-100">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{centre.name}</CardTitle>
                              {centre.description && <CardDescription>{centre.description}</CardDescription>}
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {centre.programmes?.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Programmes</h4>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                                    {centre.programmes.map((p, i) => <li key={i}>{p}</li>)}
                                  </ul>
                                </div>
                              )}
                              {centre.activities?.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Key Activities</h4>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                                    {centre.activities.map((a, i) => <li key={i}>{a}</li>)}
                                  </ul>
                                </div>
                              )}
                              {centre.address && <p className="text-sm text-gray-500"><Building className="h-4 w-4 inline mr-1" /> {centre.address}</p>}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Course Enquiry Dialog */}
      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enquire: {enquiryCourse?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitEnquiry} className="space-y-4">
            <Input placeholder="Your Name *" value={enquiryForm.name} onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })} required />
            <Input type="email" placeholder="Email *" value={enquiryForm.email} onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })} required />
            <Input placeholder="Phone" value={enquiryForm.phone} onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })} />
            <Textarea placeholder="Message / Additional information" value={enquiryForm.message} onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })} rows={3} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEnquiryOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={enquiryLoading}>{enquiryLoading ? 'Sending...' : 'Submit'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Get Involved Today</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're looking to develop new skills or support our community programs, 
            we have opportunities for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/contact">
                <Users className="h-5 w-5 mr-2" />
                Join Our Programs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/contact">
                <Heart className="h-5 w-5 mr-2" />
                Become a Volunteer
              </Link>
            </Button>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Programs;
