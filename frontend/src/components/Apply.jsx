import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Briefcase, Heart, BookOpen, Mail } from 'lucide-react';
import { api, getYouthCourses } from '../api';
import Header from './Header';
import Footer from './Footer';

const interestOptions = [
  { id: 'youth', label: 'Youth Skilling Programs' },
  { id: 'seniors', label: 'Senior Citizen Care' },
  { id: 'events', label: 'Events & Activities' },
  { id: 'fundraising', label: 'Fundraising' },
  { id: 'admin', label: 'Administrative Support' },
];

const Apply = () => {
  const { toast } = useToast();
  const location = useLocation();
  const hashToForm = (h) => (['career', 'volunteer', 'course', 'contact'].includes(h) ? h : 'career');
  const [activeForm, setActiveForm] = useState(() => {
    if (typeof window === 'undefined') return 'career';
    const h = window.location.hash.replace('#', '');
    return hashToForm(h);
  });
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  const [careerForm, setCareerForm] = useState({
    name: '', email: '', phone: '', current_role: '', experience_years: '', skills: '', areas_of_interest: '', message: '',
  });
  const [volunteerForm, setVolunteerForm] = useState({
    name: '', email: '', phone: '', skills: '', availability: '', interests: [], experience: '',
  });
  const [courseForm, setCourseForm] = useState({
    course_id: '', course_name: '', name: '', email: '', phone: '', message: '',
  });
  const [contactForm, setContactForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '', inquiryType: 'general',
  });

  useEffect(() => {
    const hash = (location.hash || '').replace('#', '');
    setActiveForm(hashToForm(hash));
  }, [location.hash]);

  useEffect(() => {
    getYouthCourses()
      .then((d) => setCourses(d.courses || []))
      .catch(() => setCourses([]));
  }, []);

  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitCareerApplication({
        name: careerForm.name,
        email: careerForm.email,
        phone: careerForm.phone || undefined,
        current_role: careerForm.current_role || undefined,
        experience_years: careerForm.experience_years || undefined,
        skills: careerForm.skills || undefined,
        areas_of_interest: careerForm.areas_of_interest || undefined,
        message: careerForm.message || undefined,
      });
      toast({ title: 'Application submitted!', description: 'We will get in touch when relevant opportunities arise.' });
      setCareerForm({ name: '', email: '', phone: '', current_role: '', experience_years: '', skills: '', areas_of_interest: '', message: '' });
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.detail || 'Failed to submit. Please try again.', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitVolunteerForm({
        name: volunteerForm.name,
        email: volunteerForm.email,
        phone: volunteerForm.phone,
        skills: volunteerForm.skills || undefined,
        availability: volunteerForm.availability,
        interests: volunteerForm.interests,
        experience: volunteerForm.experience || undefined,
      });
      toast({ title: 'Application submitted!', description: "Thank you for your interest in volunteering. We'll contact you soon." });
      setVolunteerForm({ name: '', email: '', phone: '', skills: '', availability: '', interests: [], experience: '' });
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.detail || 'Failed to submit. Please try again.', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === courseForm.course_id);
    if (!course) {
      toast({ title: 'Please select a course', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await api.submitCourseEnquiry({
        course_id: course.id,
        course_name: course.name,
        name: courseForm.name,
        email: courseForm.email,
        phone: courseForm.phone || undefined,
        message: courseForm.message || undefined,
      });
      toast({ title: 'Enquiry submitted!', description: "We'll get back to you soon." });
      setCourseForm({ course_id: '', course_name: '', name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.detail || 'Failed to submit. Please try again.', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitContactForm({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone || undefined,
        subject: contactForm.subject,
        message: contactForm.message,
        inquiryType: contactForm.inquiryType,
      });
      toast({ title: 'Message sent!', description: "We'll get back to you soon." });
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '', inquiryType: 'general' });
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.detail || 'Failed to send. Please try again.', variant: 'destructive' });
    }
    setLoading(false);
  };

  const toggleInterest = (id) => {
    setVolunteerForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(id) ? prev.interests.filter((i) => i !== id) : [...prev.interests, id],
    }));
  };

  const formTabs = [
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'volunteer', label: 'Volunteer', icon: Heart },
    { id: 'course', label: 'Course enquiry', icon: BookOpen },
    { id: 'contact', label: 'General enquiry', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="bg-gradient-to-br from-blue-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Apply / Get in touch</h1>
          <p className="text-gray-600">Choose an option below and submit the form. All data is saved and we will get back to you.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {formTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { setActiveForm(id); window.history.replaceState(null, '', `#${id}`); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeForm === id ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {activeForm === 'career' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Career application</CardTitle>
              <p className="text-sm text-gray-600">Apply anytime; we use this for future recruitment and talent mapping.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCareerSubmit} className="space-y-4">
                <Input placeholder="Name *" value={careerForm.name} onChange={(e) => setCareerForm((p) => ({ ...p, name: e.target.value }))} required />
                <Input type="email" placeholder="Email *" value={careerForm.email} onChange={(e) => setCareerForm((p) => ({ ...p, email: e.target.value }))} required />
                <Input placeholder="Phone" value={careerForm.phone} onChange={(e) => setCareerForm((p) => ({ ...p, phone: e.target.value }))} />
                <Input placeholder="Current role" value={careerForm.current_role} onChange={(e) => setCareerForm((p) => ({ ...p, current_role: e.target.value }))} />
                <Input placeholder="Years of experience" value={careerForm.experience_years} onChange={(e) => setCareerForm((p) => ({ ...p, experience_years: e.target.value }))} />
                <Input placeholder="Skills" value={careerForm.skills} onChange={(e) => setCareerForm((p) => ({ ...p, skills: e.target.value }))} />
                <Input placeholder="Areas of interest" value={careerForm.areas_of_interest} onChange={(e) => setCareerForm((p) => ({ ...p, areas_of_interest: e.target.value }))} />
                <Textarea placeholder="Message" value={careerForm.message} onChange={(e) => setCareerForm((p) => ({ ...p, message: e.target.value }))} rows={3} />
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">Submit application</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeForm === 'volunteer' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" /> Volunteer application</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <Input placeholder="Name *" value={volunteerForm.name} onChange={(e) => setVolunteerForm((p) => ({ ...p, name: e.target.value }))} required />
                <Input type="email" placeholder="Email *" value={volunteerForm.email} onChange={(e) => setVolunteerForm((p) => ({ ...p, email: e.target.value }))} required />
                <Input placeholder="Phone *" value={volunteerForm.phone} onChange={(e) => setVolunteerForm((p) => ({ ...p, phone: e.target.value }))} required />
                <Input placeholder="Availability *" value={volunteerForm.availability} onChange={(e) => setVolunteerForm((p) => ({ ...p, availability: e.target.value }))} required />
                <Input placeholder="Skills" value={volunteerForm.skills} onChange={(e) => setVolunteerForm((p) => ({ ...p, skills: e.target.value }))} />
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Interests * (select at least one)</p>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <input type="checkbox" checked={volunteerForm.interests.includes(opt.id)} onChange={() => toggleInterest(opt.id)} className="rounded" />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
                <Textarea placeholder="Experience" value={volunteerForm.experience} onChange={(e) => setVolunteerForm((p) => ({ ...p, experience: e.target.value }))} rows={3} />
                <Button type="submit" disabled={loading || volunteerForm.interests.length === 0} className="w-full bg-blue-600 hover:bg-blue-700">Submit</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeForm === 'course' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Course enquiry</CardTitle>
              <p className="text-sm text-gray-600">Enquire about a youth course.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Course *</label>
                  <select
                    required
                    value={courseForm.course_id}
                    onChange={(e) => {
                      const c = courses.find((x) => x.id === e.target.value);
                      setCourseForm((p) => ({ ...p, course_id: e.target.value, course_name: c ? c.name : '' }));
                    }}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select a course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <Input placeholder="Name *" value={courseForm.name} onChange={(e) => setCourseForm((p) => ({ ...p, name: e.target.value }))} required />
                <Input type="email" placeholder="Email *" value={courseForm.email} onChange={(e) => setCourseForm((p) => ({ ...p, email: e.target.value }))} required />
                <Input placeholder="Phone" value={courseForm.phone} onChange={(e) => setCourseForm((p) => ({ ...p, phone: e.target.value }))} />
                <Textarea placeholder="Message" value={courseForm.message} onChange={(e) => setCourseForm((p) => ({ ...p, message: e.target.value }))} rows={3} />
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">Submit enquiry</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeForm === 'contact' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> General enquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <Input placeholder="Name *" value={contactForm.name} onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))} required />
                <Input type="email" placeholder="Email *" value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} required />
                <Input placeholder="Phone" value={contactForm.phone} onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))} />
                <Input placeholder="Subject *" value={contactForm.subject} onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))} required />
                <div>
                  <label className="text-sm font-medium text-gray-700">Enquiry type</label>
                  <select value={contactForm.inquiryType} onChange={(e) => setContactForm((p) => ({ ...p, inquiryType: e.target.value }))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option value="general">General</option>
                    <option value="partnership">Partnership</option>
                    <option value="donation">Donation</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Textarea placeholder="Message *" value={contactForm.message} onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))} rows={4} required />
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">Send message</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          You can also <Link to="/contact" className="text-blue-600 hover:underline">visit the Contact page</Link> for more options.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Apply;
