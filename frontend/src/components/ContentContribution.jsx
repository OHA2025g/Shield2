import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { api } from '../api';
import { useToast } from '../hooks/use-toast';
import { ClipboardList, Send } from 'lucide-react';

const selectClass =
  'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const STEPS = [
  { title: '1. Create', text: 'Staff or partners draft text, images, or page updates using the form below.' },
  { title: '2. Creative review', text: 'Communications reviews tone, branding, and clarity.' },
  { title: '3. Technical check', text: 'Web editors verify links, accessibility, and layout constraints.' },
  { title: '4. Leadership approval', text: 'Top management gives final approval before anything goes live.' },
  { title: '5. Publish', text: 'Approved items are added to the site through the admin CMS by authorised users.' },
];

const ContentContribution = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    body: '',
    content_type: 'general',
    submitter_name: '',
    submitter_email: '',
    submitter_phone: '',
    affiliation: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.body.trim().length < 20) {
      toast({ title: 'Please add more detail', description: 'The content field should be at least 20 characters.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await api.submitContentContribution(form);
      toast({
        title: 'Submission received',
        description: 'Your content will follow the internal review process. You may be contacted by email.',
      });
      setForm({
        title: '',
        body: '',
        content_type: 'general',
        submitter_name: '',
        submitter_email: '',
        submitter_phone: '',
        affiliation: '',
      });
    } catch (err) {
      toast({
        title: 'Could not submit',
        description: err.response?.data?.detail || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <ClipboardList className="h-7 w-7" />
            <span className="text-sm font-semibold uppercase tracking-wide">Internal & partners</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Contribute website content</h1>
          <p className="text-gray-600 mt-2">
            Shield Foundation members and authorised partners can propose updates here. Submissions are{' '}
            <strong>not</strong> published automatically—they follow the approval process below.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Approval process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.title} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{s.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit content for review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cc-title">Title / topic</Label>
                <Input
                  id="cc-title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  minLength={3}
                  placeholder="e.g. Update to Youth Program page — new batch dates"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cc-type">Type</Label>
                <select
                  id="cc-type"
                  className={selectClass}
                  value={form.content_type}
                  onChange={(e) => setForm((f) => ({ ...f, content_type: e.target.value }))}
                >
                  <option value="general">General suggestion</option>
                  <option value="news_suggestion">News / announcement</option>
                  <option value="blog_draft">Blog draft</option>
                  <option value="gallery">Gallery / media</option>
                  <option value="page_edit">Page copy edit</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cc-body">Content (draft text, bullet notes, or pasted copy)</Label>
                <Textarea
                  id="cc-body"
                  rows={10}
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  required
                  minLength={20}
                  placeholder="Paste your draft, outline image ideas, or list exact wording you propose…"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cc-name">Your name</Label>
                  <Input
                    id="cc-name"
                    value={form.submitter_name}
                    onChange={(e) => setForm((f) => ({ ...f, submitter_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cc-email">Email</Label>
                  <Input
                    id="cc-email"
                    type="email"
                    value={form.submitter_email}
                    onChange={(e) => setForm((f) => ({ ...f, submitter_email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cc-phone">Phone (optional)</Label>
                  <Input
                    id="cc-phone"
                    value={form.submitter_phone}
                    onChange={(e) => setForm((f) => ({ ...f, submitter_phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cc-aff">Role / department / affiliation (optional)</Label>
                  <Input
                    id="cc-aff"
                    value={form.affiliation}
                    onChange={(e) => setForm((f) => ({ ...f, affiliation: e.target.value }))}
                    placeholder="e.g. Programs team — Dharavi centre"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Sending…' : 'Submit for review'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-8">
          <Link to="/" className="text-blue-700 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default ContentContribution;
