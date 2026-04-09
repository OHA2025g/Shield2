import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAlert } from '../../hooks/use-alert';
import { api } from '../../api';
import { cn } from '../../lib/utils';
import { Edit, Trash2, Save } from 'lucide-react';
import ImageQualityHint from '../ImageQualityHint';

/** Native select styled like shadcn Input */
const nativeSelectClass =
  'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const adminTabsListClass =
  'flex h-auto min-h-10 w-full flex-wrap items-stretch justify-start gap-1.5 rounded-xl border border-border/60 bg-muted/40 p-2.5 text-muted-foreground';

const adminRecordRowClass =
  'flex items-start justify-between gap-3 rounded-lg border border-border/80 bg-card px-4 py-3 shadow-sm';

/** Gallery categories reserved for homepage (see backend models + HeroBackgroundCarousel / MediaCarousel) */
const GALLERY_HERO = 'homepage_hero';
const GALLERY_EVENTS = 'events_programmes';

const TextAreaField = ({ label, value, onChange, rows = 3 }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full" />
  </div>
);

const ExtraContentManagement = () => {
  const { showAlert } = useAlert();
  const [subTab, setSubTab] = useState('org');

  // Org Overview
  const [orgOverview, setOrgOverview] = useState({});
  const [orgForm, setOrgForm] = useState({ aim: '', objectives: '', mission: '', vision: '', who_we_are: '', what_we_do: '', key_achievements: '', impact_highlights_text: '', shield_full_form: '' });

  useEffect(() => {
    if (subTab === 'org') {
      api.admin.getOrgOverview().then((data) => {
        if (data && typeof data === 'object') setOrgForm((prev) => ({ ...prev, ...data }));
      }).catch(() => {});
    }
  }, [subTab]);

  const saveOrgOverview = async () => {
    try {
      await api.admin.updateOrgOverview(orgForm);
      showAlert({ title: 'Saved', description: 'Org overview updated.', variant: 'success' });
    } catch (e) {
      showAlert({ title: 'Error', description: e.response?.data?.detail || 'Failed to save.', variant: 'destructive' });
    }
  };

  // Placement Stories
  const [placementStories, setPlacementStories] = useState([]);
  const [placementForm, setPlacementForm] = useState({ name: '', story: '', image: '', role_placed: '', company: '', program: '', order: 0, is_active: true });
  const [editingPlacement, setEditingPlacement] = useState(null);

  useEffect(() => {
    if (subTab === 'placement') api.admin.getPlacementStories().then((d) => setPlacementStories(d.stories || [])).catch(() => setPlacementStories([]));
  }, [subTab]);

  const savePlacement = async (e) => {
    e.preventDefault();
    try {
      if (editingPlacement) await api.admin.updatePlacementStory(editingPlacement.id, placementForm);
      else await api.admin.createPlacementStory(placementForm);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingPlacement(null);
      setPlacementForm({ name: '', story: '', image: '', role_placed: '', company: '', program: '', order: 0, is_active: true });
      api.admin.getPlacementStories().then((d) => setPlacementStories(d.stories || []));
    } catch (err) {
      showAlert({ title: 'Error', description: err.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const deletePlacement = async (id) => {
    if (!window.confirm('Delete this placement story?')) return;
    try {
      await api.admin.deletePlacementStory(id);
      setPlacementStories((prev) => prev.filter((s) => s.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Featured Video
  const [featuredVideo, setFeaturedVideo] = useState({});
  const [videoForm, setVideoForm] = useState({ title: '', youtube_url: '', description: '', is_active: true });

  useEffect(() => {
    if (subTab === 'video') api.admin.getFeaturedVideo().then((d) => { if (d) setVideoForm({ title: d.title || '', youtube_url: d.youtube_url || '', description: d.description || '', is_active: d.is_active !== false }); }).catch(() => {});
  }, [subTab]);

  const saveVideo = async () => {
    try {
      await api.admin.updateFeaturedVideo(videoForm);
      showAlert({ title: 'Saved', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Homepage quote slideshow: one row = EN + MR + HI for the same quote
  const emptyQuoteGroupForm = () => ({
    quote_en: '',
    quote_mr: '',
    quote_hi: '',
    author_en: '',
    author_mr: '',
    author_hi: '',
    image_url: '',
    order: 0,
    is_active: true,
  });
  const [quoteGroups, setQuoteGroups] = useState([]);
  const [quoteGroupForm, setQuoteGroupForm] = useState(() => emptyQuoteGroupForm());
  const [editingQuoteGroup, setEditingQuoteGroup] = useState(null);
  const [showLegacyQuotes, setShowLegacyQuotes] = useState(false);
  const [dailyQuotes, setDailyQuotes] = useState([]);
  const [quoteForm, setQuoteForm] = useState({
    quote: '',
    author: '',
    image_url: '',
    language: 'en',
    quote_date: new Date().toISOString().slice(0, 10),
    order: 0,
    is_active: true,
  });
  const [editingQuote, setEditingQuote] = useState(null);

  const refreshQuoteGroups = useCallback(() => {
    api.admin.getDailyQuoteGroups().then((d) => setQuoteGroups(d.groups || [])).catch(() => setQuoteGroups([]));
  }, []);

  useEffect(() => {
    if (subTab !== 'quotes') return;
    refreshQuoteGroups();
    api.admin.getDailyQuotes().then((d) => setDailyQuotes(d.quotes || [])).catch(() => setDailyQuotes([]));
  }, [subTab, refreshQuoteGroups]);

  const saveQuoteGroup = async (e) => {
    e.preventDefault();
    const hasAny =
      String(quoteGroupForm.quote_en || '').trim() ||
      String(quoteGroupForm.quote_mr || '').trim() ||
      String(quoteGroupForm.quote_hi || '').trim();
    if (!hasAny) {
      showAlert({ title: 'Add quote text', description: 'Fill at least one of English, Marathi, or Hindi.', variant: 'destructive' });
      return;
    }
    const payload = {
      quote_en: quoteGroupForm.quote_en || '',
      quote_mr: quoteGroupForm.quote_mr || '',
      quote_hi: quoteGroupForm.quote_hi || '',
      author_en: quoteGroupForm.author_en || '',
      author_mr: quoteGroupForm.author_mr || '',
      author_hi: quoteGroupForm.author_hi || '',
      image_url: quoteGroupForm.image_url || '',
      order: Number(quoteGroupForm.order) || 0,
      is_active: quoteGroupForm.is_active !== false,
    };
    try {
      const gid = editingQuoteGroup?.id;
      if (editingQuoteGroup && gid) await api.admin.updateDailyQuoteGroup(gid, payload);
      else await api.admin.createDailyQuoteGroup(payload);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingQuoteGroup(null);
      setQuoteGroupForm(emptyQuoteGroupForm());
      refreshQuoteGroups();
    } catch (err) {
      showAlert({ title: 'Error', description: err.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const deleteQuoteGroup = async (id) => {
    if (!window.confirm('Delete this quote group (all three languages)?')) return;
    try {
      await api.admin.deleteDailyQuoteGroup(id);
      setQuoteGroups((prev) => prev.filter((g) => g.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const saveQuote = async (e) => {
    e.preventDefault();
    try {
      if (editingQuote) await api.admin.updateDailyQuote(editingQuote.id, quoteForm);
      else await api.admin.createDailyQuote(quoteForm);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingQuote(null);
      setQuoteForm({
        quote: '',
        author: '',
        image_url: '',
        language: 'en',
        quote_date: new Date().toISOString().slice(0, 10),
        order: 0,
        is_active: true,
      });
      api.admin.getDailyQuotes().then((d) => setDailyQuotes(d.quotes || []));
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteQuote = async (id) => {
    if (!window.confirm('Delete this quote?')) return;
    try {
      await api.admin.deleteDailyQuote(id);
      setDailyQuotes((prev) => prev.filter((q) => q.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Government Schemes
  const [govSchemes, setGovSchemes] = useState([]);
  const [govForm, setGovForm] = useState({ scheme_name: 'MCED', project_category: '', course_name: '', academic_year: '', students_trained: 0, order: 0, is_active: true });
  const [editingGov, setEditingGov] = useState(null);

  useEffect(() => {
    if (subTab === 'gov') api.admin.getGovernmentSchemes().then((d) => setGovSchemes(d.records || [])).catch(() => setGovSchemes([]));
  }, [subTab]);

  const saveGov = async (e) => {
    e.preventDefault();
    try {
      if (editingGov) await api.admin.updateGovernmentScheme(editingGov.id, govForm);
      else await api.admin.createGovernmentScheme(govForm);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingGov(null);
      setGovForm({ scheme_name: 'MCED', project_category: '', course_name: '', academic_year: '', students_trained: 0, order: 0, is_active: true });
      api.admin.getGovernmentSchemes().then((d) => setGovSchemes(d.records || []));
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteGov = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await api.admin.deleteGovernmentScheme(id);
      setGovSchemes((prev) => prev.filter((r) => r.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Funds Utilization
  const [fundsList, setFundsList] = useState([]);
  const [fundsForm, setFundsForm] = useState({ period_label: '', amount_received: 0, amount_utilised: 0, utilisation_details: '', order: 0, is_active: true });
  const [editingFunds, setEditingFunds] = useState(null);

  useEffect(() => {
    if (subTab === 'funds') api.admin.getFundsUtilization().then((d) => setFundsList(d.records || [])).catch(() => setFundsList([]));
  }, [subTab]);

  const saveFunds = async (e) => {
    e.preventDefault();
    try {
      if (editingFunds) await api.admin.updateFundsUtilization(editingFunds.id, fundsForm);
      else await api.admin.createFundsUtilization(fundsForm);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingFunds(null);
      setFundsForm({ period_label: '', amount_received: 0, amount_utilised: 0, utilisation_details: '', order: 0, is_active: true });
      api.admin.getFundsUtilization().then((d) => setFundsList(d.records || []));
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteFunds = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await api.admin.deleteFundsUtilization(id);
      setFundsList((prev) => prev.filter((r) => r.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Youth Courses
  const [youthCourses, setYouthCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({ name: '', description: '', duration: '', job_prospects: '', eligibility: '', image: '', order: 0, is_active: true });
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    if (subTab === 'courses') api.admin.getYouthCourses().then((d) => setYouthCourses(d.courses || [])).catch(() => setYouthCourses([]));
  }, [subTab]);

  const saveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) await api.admin.updateYouthCourse(editingCourse.id, courseForm);
      else await api.admin.createYouthCourse(courseForm);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingCourse(null);
      setCourseForm({ name: '', description: '', duration: '', job_prospects: '', eligibility: '', image: '', order: 0, is_active: true });
      api.admin.getYouthCourses().then((d) => setYouthCourses(d.courses || []));
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.admin.deleteYouthCourse(id);
      setYouthCourses((prev) => prev.filter((c) => c.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Senior Centres
  const [centres, setCentres] = useState([]);
  const [centreForm, setCentreForm] = useState({ name: '', description: '', programmes: [], activities: [], address: '', image: '', order: 0, is_active: true });
  const [editingCentre, setEditingCentre] = useState(null);
  const [programmesText, setProgrammesText] = useState('');
  const [activitiesText, setActivitiesText] = useState('');

  useEffect(() => {
    if (subTab === 'centres') api.admin.getSeniorCentres().then((d) => setCentres(d.centres || [])).catch(() => setCentres([]));
  }, [subTab]);

  const saveCentre = async (e) => {
    e.preventDefault();
    const payload = {
      ...centreForm,
      programmes: programmesText.split('\n').map((s) => s.trim()).filter(Boolean),
      activities: activitiesText.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editingCentre) await api.admin.updateSeniorCentre(editingCentre.id, payload);
      else await api.admin.createSeniorCentre(payload);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingCentre(null);
      setCentreForm({ name: '', description: '', programmes: [], activities: [], address: '', image: '', order: 0, is_active: true });
      setProgrammesText('');
      setActivitiesText('');
      api.admin.getSeniorCentres().then((d) => setCentres(d.centres || []));
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteCentre = async (id) => {
    if (!window.confirm('Delete this centre?')) return;
    try {
      await api.admin.deleteSeniorCentre(id);
      setCentres((prev) => prev.filter((c) => c.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Course Enquiries (read-only list)
  const [enquiries, setEnquiries] = useState([]);
  useEffect(() => {
    if (subTab === 'enquiries') api.admin.getCourseEnquiries().then((d) => setEnquiries(d.enquiries || [])).catch(() => setEnquiries([]));
  }, [subTab]);

  // Career Applications (read-only list)
  const [careerApplications, setCareerApplications] = useState([]);
  useEffect(() => {
    if (subTab === 'careers') api.admin.getCareerApplications().then((d) => setCareerApplications(d.applications || [])).catch(() => setCareerApplications([]));
  }, [subTab]);

  // Awards & Accreditations
  const [awards, setAwards] = useState([]);
  const [awardForm, setAwardForm] = useState({ title: '', description: '', image: '', type: 'award', year: '', order: 0, is_active: true });
  const [editingAward, setEditingAward] = useState(null);

  useEffect(() => {
    if (subTab === 'awards') api.admin.getAwardsAccreditations().then((d) => setAwards(d.items || [])).catch(() => setAwards([]));
  }, [subTab]);

  const saveAward = async (e) => {
    e.preventDefault();
    try {
      if (editingAward) await api.admin.updateAwardAccreditation(editingAward.id, awardForm);
      else await api.admin.createAwardAccreditation(awardForm);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingAward(null);
      setAwardForm({ title: '', description: '', image: '', type: 'award', year: '', order: 0, is_active: true });
      api.admin.getAwardsAccreditations().then((d) => setAwards(d.items || []));
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteAward = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await api.admin.deleteAwardAccreditation(id);
      setAwards((prev) => prev.filter((a) => a.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Resource Links
  const [resources, setResources] = useState([]);
  const [resourceForm, setResourceForm] = useState({ title: '', url: '', type: 'link', description: '', order: 0, is_active: true });
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    if (subTab === 'resources') api.admin.getResourceLinks().then((d) => setResources(d.links || [])).catch(() => setResources([]));
  }, [subTab]);

  const saveResource = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) await api.admin.updateResourceLink(editingResource.id, resourceForm);
      else await api.admin.createResourceLink(resourceForm);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingResource(null);
      setResourceForm({ title: '', url: '', type: 'link', description: '', order: 0, is_active: true });
      api.admin.getResourceLinks().then((d) => setResources(d.links || []));
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteResource = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await api.admin.deleteResourceLink(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Management Messages
  const [messages, setMessages] = useState([]);
  const [msgForm, setMsgForm] = useState({
    title: '',
    message: '',
    author_name: '',
    author_role: '',
    image: '',
    leadership_member_id: '',
    order: 0,
    is_active: true,
  });
  const [editingMsg, setEditingMsg] = useState(null);
  const [leadershipTeamForMessages, setLeadershipTeamForMessages] = useState([]);

  useEffect(() => {
    if (subTab !== 'messages') return;
    api.admin.getManagementMessages().then((d) => setMessages(d.messages || [])).catch(() => setMessages([]));
    api.admin
      .getAllTeamMembers()
      .then((d) => setLeadershipTeamForMessages(d.members || []))
      .catch(() => setLeadershipTeamForMessages([]));
  }, [subTab]);

  const saveMsg = async (e) => {
    e.preventDefault();
    try {
      if (editingMsg) await api.admin.updateManagementMessage(editingMsg.id, msgForm);
      else await api.admin.createManagementMessage(msgForm);
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingMsg(null);
      setMsgForm({
        title: '',
        message: '',
        author_name: '',
        author_role: '',
        image: '',
        leadership_member_id: '',
        order: 0,
        is_active: true,
      });
      api.admin.getManagementMessages().then((d) => setMessages(d.messages || []));
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await api.admin.deleteManagementMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showAlert({ title: 'Deleted', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  // Engagement Options
  const [engagement, setEngagement] = useState({});
  const [engForm, setEngForm] = useState({ volunteering_text: '', volunteering_link: '', donate_books_medical_text: '', monetary_qr_image_url: '', monetary_payment_options: '', career_form_url: '' });

  useEffect(() => {
    if (subTab === 'engagement') api.admin.getEngagementOptions().then((d) => { if (d && d.id) setEngForm({ volunteering_text: d.volunteering_text || '', volunteering_link: d.volunteering_link || '', donate_books_medical_text: d.donate_books_medical_text || '', monetary_qr_image_url: d.monetary_qr_image_url || '', monetary_payment_options: d.monetary_payment_options || '', career_form_url: d.career_form_url || '' }); }).catch(() => {});
  }, [subTab]);

  const saveEngagement = async () => {
    try {
      await api.admin.updateEngagementOptions(engForm);
      showAlert({ title: 'Saved', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const emptyGovLinks = () => [
    { title: '', url: '' },
    { title: '', url: '' },
    { title: '', url: '' },
  ];
  const [govPageForm, setGovPageForm] = useState({
    page_intro: '',
    mced_intro: '',
    mssds_intro: '',
    programmes_note: '',
    eligibility_note: '',
    youth_schemes_note: '',
    senior_schemes_note: '',
    links: emptyGovLinks(),
  });

  useEffect(() => {
    if (subTab !== 'gov-page') return;
    api.admin
      .getSiteContent()
      .then((d) => {
        const gs = d?.content?.governmentSchemes || {};
        const rawLinks = Array.isArray(gs.official_links) ? gs.official_links : [];
        const padded = [...rawLinks, ...emptyGovLinks()].slice(0, 8).map((l) => ({
          title: (l && l.title) || '',
          url: (l && l.url) || '',
        }));
        setGovPageForm({
          page_intro: gs.page_intro || '',
          mced_intro: gs.mced_intro || '',
          mssds_intro: gs.mssds_intro || '',
          programmes_note: gs.programmes_note || '',
          eligibility_note: gs.eligibility_note || '',
          youth_schemes_note: gs.youth_schemes_note || '',
          senior_schemes_note: gs.senior_schemes_note || '',
          links: padded.length ? padded : emptyGovLinks(),
        });
      })
      .catch(() => {});
  }, [subTab]);

  const saveGovPage = async () => {
    const official_links = govPageForm.links
      .filter((l) => l.title?.trim() && l.url?.trim())
      .map((l) => ({ title: l.title.trim(), url: l.url.trim() }));
    try {
      await api.admin.mergeGovernmentSchemesPage({
        page_intro: govPageForm.page_intro || '',
        mced_intro: govPageForm.mced_intro || '',
        mssds_intro: govPageForm.mssds_intro || '',
        programmes_note: govPageForm.programmes_note || '',
        eligibility_note: govPageForm.eligibility_note || '',
        youth_schemes_note: govPageForm.youth_schemes_note || '',
        senior_schemes_note: govPageForm.senior_schemes_note || '',
        official_links: official_links.length ? official_links : [],
      });
      showAlert({ title: 'Government schemes page saved', variant: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', description: err.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  // Homepage hero backgrounds & Events & Programmes carousel (gallery_items)
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroForm, setHeroForm] = useState({ title: '', image: '', order: 0, is_active: true });
  const [editingHero, setEditingHero] = useState(null);

  const [eventsSlides, setEventsSlides] = useState([]);
  const [eventsForm, setEventsForm] = useState({
    title: '',
    description: '',
    image: '',
    type: 'image',
    video_url: '',
    badge_image: '',
    order: 0,
    is_active: true,
  });
  const [editingEvents, setEditingEvents] = useState(null);

  const refreshHeroSlides = () => {
    api.admin
      .getAllGalleryItems()
      .then((d) => {
        const items = (d.items || [])
          .filter((i) => i.category === GALLERY_HERO)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setHeroSlides(items);
      })
      .catch(() => setHeroSlides([]));
  };

  const refreshEventsSlides = () => {
    api.admin
      .getAllGalleryItems()
      .then((d) => {
        const items = (d.items || [])
          .filter((i) => i.category === GALLERY_EVENTS)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setEventsSlides(items);
      })
      .catch(() => setEventsSlides([]));
  };

  useEffect(() => {
    if (subTab === 'hero-bg') refreshHeroSlides();
  }, [subTab]);

  useEffect(() => {
    if (subTab === 'events-carousel') refreshEventsSlides();
  }, [subTab]);

  const saveHeroSlide = async (e) => {
    e.preventDefault();
    if (!heroForm.image?.trim()) {
      showAlert({ title: 'Image URL required', variant: 'destructive' });
      return;
    }
    const dateStr = new Date().toISOString().slice(0, 10);
    const base = {
      title: heroForm.title.trim() || 'Hero background',
      description: '',
      image: heroForm.image.trim(),
      category: GALLERY_HERO,
      date: dateStr,
      type: 'image',
      order: Number(heroForm.order) || 0,
      is_active: heroForm.is_active !== false,
    };
    try {
      if (editingHero) {
        await api.admin.updateGalleryItem(editingHero.id, {
          title: base.title,
          description: base.description,
          image: base.image,
          order: base.order,
          is_active: base.is_active,
          type: 'image',
          video_url: '',
        });
      } else {
        await api.admin.addGalleryItem({ ...base, video_url: '' });
      }
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingHero(null);
      setHeroForm({ title: '', image: '', order: 0, is_active: true });
      refreshHeroSlides();
    } catch (err) {
      showAlert({ title: 'Error', description: err.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const deleteHeroSlide = async (id) => {
    if (!window.confirm('Delete this hero background slide?')) return;
    try {
      await api.admin.deleteGalleryItem(id);
      showAlert({ title: 'Deleted', variant: 'success' });
      refreshHeroSlides();
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  const saveEventsSlide = async (e) => {
    e.preventDefault();
    if (!eventsForm.title?.trim()) {
      showAlert({ title: 'Title required', variant: 'destructive' });
      return;
    }
    if (eventsForm.type === 'image' && !eventsForm.image?.trim()) {
      showAlert({ title: 'Image URL required for image slides', variant: 'destructive' });
      return;
    }
    if (eventsForm.type === 'video' && !eventsForm.video_url?.trim()) {
      showAlert({ title: 'Video URL required for video slides', variant: 'destructive' });
      return;
    }
    const dateStr = new Date().toISOString().slice(0, 10);
    const videoUrl = eventsForm.type === 'video' ? eventsForm.video_url.trim() : '';
    const badge = eventsForm.badge_image?.trim() || '';
    const base = {
      title: eventsForm.title.trim(),
      description: eventsForm.description || '',
      image: eventsForm.type === 'image' ? eventsForm.image.trim() : (eventsForm.image?.trim() || ''),
      category: GALLERY_EVENTS,
      date: dateStr,
      type: eventsForm.type,
      video_url: videoUrl,
      badge_image: badge,
      order: Number(eventsForm.order) || 0,
      is_active: eventsForm.is_active !== false,
    };
    try {
      if (editingEvents) {
        await api.admin.updateGalleryItem(editingEvents.id, {
          title: base.title,
          description: base.description,
          image: base.image,
          type: base.type,
          video_url: base.video_url,
          badge_image: badge,
          order: base.order,
          is_active: base.is_active,
        });
      } else {
        await api.admin.addGalleryItem(base);
      }
      showAlert({ title: 'Saved', variant: 'success' });
      setEditingEvents(null);
      setEventsForm({
        title: '',
        description: '',
        image: '',
        type: 'image',
        video_url: '',
        badge_image: '',
        order: 0,
        is_active: true,
      });
      refreshEventsSlides();
    } catch (err) {
      showAlert({ title: 'Error', description: err.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const deleteEventsSlide = async (id) => {
    if (!window.confirm('Delete this slide?')) return;
    try {
      await api.admin.deleteGalleryItem(id);
      showAlert({ title: 'Deleted', variant: 'success' });
      refreshEventsSlides();
    } catch (err) {
      showAlert({ title: 'Error', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Website Data & Extra Content</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit public-facing copy, media, and structured lists. Choose a section below — navigation is grouped so items do not overlap.
        </p>
      </div>
      <Tabs value={subTab} onValueChange={setSubTab} className="space-y-3">
        <div className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4 shadow-sm">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Site copy & highlights
            </p>
            <TabsList className={adminTabsListClass}>
              <TabsTrigger value="org" className="shrink-0 data-[state=active]:shadow-sm">
                Org Overview
              </TabsTrigger>
              <TabsTrigger value="placement" className="shrink-0 data-[state=active]:shadow-sm">
                Placement Stories
              </TabsTrigger>
              <TabsTrigger value="video" className="shrink-0 data-[state=active]:shadow-sm">
                Featured Video
              </TabsTrigger>
              <TabsTrigger value="quotes" className="shrink-0 data-[state=active]:shadow-sm">
                Quotes (slideshow)
              </TabsTrigger>
              <TabsTrigger value="gov" className="shrink-0 data-[state=active]:shadow-sm">
                Government Schemes
              </TabsTrigger>
              <TabsTrigger value="gov-page" className="shrink-0 data-[state=active]:shadow-sm">
                Gov schemes page text
              </TabsTrigger>
              <TabsTrigger value="funds" className="shrink-0 data-[state=active]:shadow-sm">
                Funds Utilisation
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="space-y-2 border-t border-border/60 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Homepage media
            </p>
            <TabsList className={adminTabsListClass}>
              <TabsTrigger value="hero-bg" className="shrink-0 data-[state=active]:shadow-sm">
                Hero backgrounds
              </TabsTrigger>
              <TabsTrigger value="events-carousel" className="shrink-0 data-[state=active]:shadow-sm">
                Events & Programmes
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="space-y-2 border-t border-border/60 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Programmes, forms & links
            </p>
            <TabsList className={adminTabsListClass}>
              <TabsTrigger value="courses" className="shrink-0 data-[state=active]:shadow-sm">
                Youth Courses
              </TabsTrigger>
              <TabsTrigger value="centres" className="shrink-0 data-[state=active]:shadow-sm">
                Senior Centres
              </TabsTrigger>
              <TabsTrigger value="enquiries" className="shrink-0 data-[state=active]:shadow-sm">
                Course Enquiries
              </TabsTrigger>
              <TabsTrigger value="careers" className="shrink-0 data-[state=active]:shadow-sm">
                Career Applications
              </TabsTrigger>
              <TabsTrigger value="awards" className="shrink-0 data-[state=active]:shadow-sm">
                Awards & Accreditations
              </TabsTrigger>
              <TabsTrigger value="resources" className="shrink-0 data-[state=active]:shadow-sm">
                Resource Links
              </TabsTrigger>
              <TabsTrigger value="messages" className="shrink-0 data-[state=active]:shadow-sm">
                Management Messages
              </TabsTrigger>
              <TabsTrigger value="engagement" className="shrink-0 data-[state=active]:shadow-sm">
                Engagement Options
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="org" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Org Overview (Aim, Mission, Vision, etc.)</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {['aim', 'objectives', 'mission', 'vision', 'who_we_are', 'what_we_do', 'key_achievements', 'impact_highlights_text', 'shield_full_form'].map((key) => (
                <TextAreaField key={key} label={key.replace(/_/g, ' ')} value={orgForm[key]} onChange={(v) => setOrgForm((p) => ({ ...p, [key]: v }))} rows={2} />
              ))}
              <Button onClick={saveOrgOverview}><Save className="h-4 w-4 mr-2" /> Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gov-page" className="mt-6">
          <Card>
            <CardHeader className="border-b border-border/60 bg-muted/20">
              <CardTitle className="text-lg">Government schemes page (public)</CardTitle>
              <CardDescription>
                Intro text, MCED/MSSDS narratives, programme notes, youth/senior scheme narratives, and official links
                shown on <strong>/government-schemes</strong>. MCED/MSSDS tables are managed under &quot;Government
                Schemes&quot;.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gp-intro">Page introduction</Label>
                <Textarea
                  id="gp-intro"
                  rows={3}
                  value={govPageForm.page_intro}
                  onChange={(e) => setGovPageForm((p) => ({ ...p, page_intro: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gp-mced">MCED narrative</Label>
                <Textarea
                  id="gp-mced"
                  rows={5}
                  value={govPageForm.mced_intro}
                  onChange={(e) => setGovPageForm((p) => ({ ...p, mced_intro: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gp-mssds">MSSDS narrative</Label>
                <Textarea
                  id="gp-mssds"
                  rows={4}
                  value={govPageForm.mssds_intro}
                  onChange={(e) => setGovPageForm((p) => ({ ...p, mssds_intro: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gp-prog">Programmes note</Label>
                <Textarea
                  id="gp-prog"
                  rows={3}
                  value={govPageForm.programmes_note}
                  onChange={(e) => setGovPageForm((p) => ({ ...p, programmes_note: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gp-elig">Eligibility note</Label>
                <Textarea
                  id="gp-elig"
                  rows={3}
                  value={govPageForm.eligibility_note}
                  onChange={(e) => setGovPageForm((p) => ({ ...p, eligibility_note: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gp-youth">Youth schemes (Mumbai / Maharashtra) — long text block</Label>
                <Textarea
                  id="gp-youth"
                  rows={12}
                  value={govPageForm.youth_schemes_note}
                  onChange={(e) => setGovPageForm((p) => ({ ...p, youth_schemes_note: e.target.value }))}
                  placeholder="Shown in its own card on the public page…"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gp-senior">Senior citizen schemes — long text block</Label>
                <Textarea
                  id="gp-senior"
                  rows={12}
                  value={govPageForm.senior_schemes_note}
                  onChange={(e) => setGovPageForm((p) => ({ ...p, senior_schemes_note: e.target.value }))}
                  placeholder="Shown in its own card on the public page…"
                />
              </div>
              <div className="space-y-3">
                <Label>Official links (title + URL)</Label>
                {govPageForm.links.map((link, idx) => (
                  <div key={idx} className="grid gap-2 sm:grid-cols-2">
                    <Input
                      placeholder="Link title"
                      value={link.title}
                      onChange={(e) =>
                        setGovPageForm((p) => {
                          const links = [...p.links];
                          links[idx] = { ...links[idx], title: e.target.value };
                          return { ...p, links };
                        })
                      }
                    />
                    <Input
                      placeholder="https://…"
                      value={link.url}
                      onChange={(e) =>
                        setGovPageForm((p) => {
                          const links = [...p.links];
                          links[idx] = { ...links[idx], url: e.target.value };
                          return { ...p, links };
                        })
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setGovPageForm((p) => ({ ...p, links: [...p.links, { title: '', url: '' }] }))}
                >
                  Add link row
                </Button>
              </div>
              <Button type="button" onClick={saveGovPage}>
                <Save className="h-4 w-4 mr-2" /> Save page content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placement" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Placement Stories</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={savePlacement} className="space-y-2 mb-4">
                <Input placeholder="Name" value={placementForm.name} onChange={(e) => setPlacementForm((p) => ({ ...p, name: e.target.value }))} required />
                <Textarea placeholder="Story" value={placementForm.story} onChange={(e) => setPlacementForm((p) => ({ ...p, story: e.target.value }))} required />
                <Input placeholder="Image URL" value={placementForm.image} onChange={(e) => setPlacementForm((p) => ({ ...p, image: e.target.value }))} />
                <Input placeholder="Role / Company" value={placementForm.role_placed} onChange={(e) => setPlacementForm((p) => ({ ...p, role_placed: e.target.value }))} />
                <Input placeholder="Program" value={placementForm.program} onChange={(e) => setPlacementForm((p) => ({ ...p, program: e.target.value }))} />
                <div className="flex gap-2">
                  <Button type="submit"><Save className="h-4 w-4 mr-2" /> {editingPlacement ? 'Update' : 'Add'}</Button>
                  {editingPlacement && <Button type="button" variant="outline" onClick={() => setEditingPlacement(null)}>Cancel</Button>}
                </div>
              </form>
              <ul className="space-y-2">
                {placementStories.map((s) => (
                  <li key={s.id} className={cn(adminRecordRowClass, 'items-center')}>
                    <span className="min-w-0 flex-1 font-medium text-foreground">{s.name}</span>
                    <div className="flex shrink-0 gap-0.5">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingPlacement(s); setPlacementForm({ name: s.name, story: s.story, image: s.image || '', role_placed: s.role_placed || '', company: s.company || '', program: s.program || '', order: s.order || 0, is_active: s.is_active !== false }); }}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => deletePlacement(s.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Featured Video (YouTube URL)</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="Title" value={videoForm.title} onChange={(e) => setVideoForm((p) => ({ ...p, title: e.target.value }))} />
              <Input placeholder="YouTube URL" value={videoForm.youtube_url} onChange={(e) => setVideoForm((p) => ({ ...p, youtube_url: e.target.value }))} />
              <Textarea placeholder="Description" value={videoForm.description} onChange={(e) => setVideoForm((p) => ({ ...p, description: e.target.value }))} />
              <Button onClick={saveVideo}><Save className="h-4 w-4 mr-2" /> Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="border-b border-border/60 bg-muted/20">
              <CardTitle className="text-lg">Homepage quotes (slideshow)</CardTitle>
              <CardDescription>
                Each row is one slide: add the same thought in English, Marathi, and Hindi. Visitors pick a language; the
                site cycles through all active groups every few seconds. Lower order numbers appear first.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={saveQuoteGroup} className="mb-8 space-y-4">
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Quote — English</Label>
                    <Textarea
                      rows={4}
                      placeholder="English quote"
                      value={quoteGroupForm.quote_en}
                      onChange={(e) => setQuoteGroupForm((p) => ({ ...p, quote_en: e.target.value }))}
                    />
                    <Label className="text-muted-foreground">Author — English (optional)</Label>
                    <Input
                      placeholder="Author"
                      value={quoteGroupForm.author_en}
                      onChange={(e) => setQuoteGroupForm((p) => ({ ...p, author_en: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quote — मराठी</Label>
                    <Textarea
                      rows={4}
                      placeholder="मराठी भाषांतर"
                      value={quoteGroupForm.quote_mr}
                      onChange={(e) => setQuoteGroupForm((p) => ({ ...p, quote_mr: e.target.value }))}
                    />
                    <Label className="text-muted-foreground">Author — Marathi (optional)</Label>
                    <Input
                      placeholder="लेखक"
                      value={quoteGroupForm.author_mr}
                      onChange={(e) => setQuoteGroupForm((p) => ({ ...p, author_mr: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quote — हिन्दी</Label>
                    <Textarea
                      rows={4}
                      placeholder="हिन्दी अनुवाद"
                      value={quoteGroupForm.quote_hi}
                      onChange={(e) => setQuoteGroupForm((p) => ({ ...p, quote_hi: e.target.value }))}
                    />
                    <Label className="text-muted-foreground">Author — Hindi (optional)</Label>
                    <Input
                      placeholder="लेखक"
                      value={quoteGroupForm.author_hi}
                      onChange={(e) => setQuoteGroupForm((p) => ({ ...p, author_hi: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Image URL (optional, shared for all languages)</Label>
                  <Input
                    placeholder="https://…"
                    value={quoteGroupForm.image_url}
                    onChange={(e) => setQuoteGroupForm((p) => ({ ...p, image_url: e.target.value }))}
                  />
                  <ImageQualityHint context="carousel" className="mt-1" />
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-1">
                    <Label>Order</Label>
                    <Input
                      type="number"
                      className="w-28"
                      value={quoteGroupForm.order}
                      onChange={(e) => setQuoteGroupForm((p) => ({ ...p, order: Number(e.target.value || 0) }))}
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={quoteGroupForm.is_active !== false}
                      onChange={(e) => setQuoteGroupForm((p) => ({ ...p, is_active: e.target.checked }))}
                      className="rounded border-input"
                    />
                    Active
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" /> {editingQuoteGroup ? 'Update group' : 'Add quote group'}
                  </Button>
                  {editingQuoteGroup && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingQuoteGroup(null);
                        setQuoteGroupForm(emptyQuoteGroupForm());
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
              <p className="mb-2 text-sm font-medium text-foreground">Active groups (slideshow order)</p>
              <ul className="space-y-2">
                {quoteGroups.map((g) => {
                  const preview =
                    (g.quote_en && String(g.quote_en).trim()) ||
                    (g.quote_mr && String(g.quote_mr).trim()) ||
                    (g.quote_hi && String(g.quote_hi).trim()) ||
                    '';
                  const gid = g.id || g._id;
                  return (
                    <li key={gid} className={cn(adminRecordRowClass, 'items-start')}>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="line-clamp-2 text-sm text-foreground">{preview}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {g.quote_en && String(g.quote_en).trim() ? (
                            <span className="text-[11px] rounded border border-border bg-muted/40 px-1.5 py-0.5">EN</span>
                          ) : null}
                          {g.quote_mr && String(g.quote_mr).trim() ? (
                            <span className="text-[11px] rounded border border-border bg-muted/40 px-1.5 py-0.5">MR</span>
                          ) : null}
                          {g.quote_hi && String(g.quote_hi).trim() ? (
                            <span className="text-[11px] rounded border border-border bg-muted/40 px-1.5 py-0.5">HI</span>
                          ) : null}
                          <span className="text-[11px] text-muted-foreground">order {g.order ?? 0}</span>
                          {g.is_active === false ? (
                            <span className="text-[11px] text-amber-700">inactive</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-0.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingQuoteGroup({ id: gid, ...g });
                            setQuoteGroupForm({
                              quote_en: g.quote_en || '',
                              quote_mr: g.quote_mr || '',
                              quote_hi: g.quote_hi || '',
                              author_en: g.author_en || '',
                              author_mr: g.author_mr || '',
                              author_hi: g.author_hi || '',
                              image_url: g.image_url || '',
                              order: g.order ?? 0,
                              is_active: g.is_active !== false,
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteQuoteGroup(gid)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {quoteGroups.length === 0 && (
                <p className="text-sm text-muted-foreground">No groups yet. Add one with text in any language; fill EN/MR/HI for full trilingual slides.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="cursor-pointer select-none" onClick={() => setShowLegacyQuotes((v) => !v)}>
              <CardTitle className="text-base">Legacy single-language quotes (optional)</CardTitle>
              <CardDescription>
                Used only as a fallback on the Impact page if no quote groups exist. Prefer quote groups above for the
                homepage.
              </CardDescription>
            </CardHeader>
            {showLegacyQuotes && (
              <CardContent className="border-t border-border/60 pt-6">
                <form onSubmit={saveQuote} className="space-y-2 mb-4">
                  <Textarea
                    placeholder="Quote"
                    value={quoteForm.quote}
                    onChange={(e) => setQuoteForm((p) => ({ ...p, quote: e.target.value }))}
                    required
                  />
                  <Input placeholder="Author" value={quoteForm.author} onChange={(e) => setQuoteForm((p) => ({ ...p, author: e.target.value }))} />
                  <div>
                    <Input placeholder="Image URL (optional)" value={quoteForm.image_url} onChange={(e) => setQuoteForm((p) => ({ ...p, image_url: e.target.value }))} />
                    <ImageQualityHint context="carousel" className="mt-1" />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="space-y-1">
                      <Label>Language</Label>
                      <select
                        className={nativeSelectClass}
                        value={quoteForm.language}
                        onChange={(e) => setQuoteForm((p) => ({ ...p, language: e.target.value }))}
                      >
                        <option value="en">English (en)</option>
                        <option value="mr">मराठी (mr)</option>
                        <option value="hi">हिन्दी (hi)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label>Quote date</Label>
                      <Input type="date" value={quoteForm.quote_date} onChange={(e) => setQuoteForm((p) => ({ ...p, quote_date: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={quoteForm.order}
                        onChange={(e) => setQuoteForm((p) => ({ ...p, order: Number(e.target.value || 0) }))}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={quoteForm.is_active !== false}
                      onChange={(e) => setQuoteForm((p) => ({ ...p, is_active: e.target.checked }))}
                    />
                    Active
                  </label>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" /> {editingQuote ? 'Update' : 'Add'}
                  </Button>
                </form>
                <ul className="space-y-2">
                  {dailyQuotes.map((q) => (
                    <li key={q.id} className={cn(adminRecordRowClass, 'items-center')}>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="line-clamp-2 text-sm text-foreground">{q.quote}</span>
                          <span className="text-[11px] text-muted-foreground rounded border px-1.5 py-0.5">
                            {(q.language || 'en').toLowerCase()}
                          </span>
                          {q.quote_date && (
                            <span className="text-[11px] text-muted-foreground rounded border px-1.5 py-0.5">
                              {q.quote_date}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-0.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingQuote(q);
                            setQuoteForm({
                              quote: q.quote,
                              author: q.author || '',
                              image_url: q.image_url || '',
                              language: q.language || 'en',
                              quote_date: q.quote_date || '',
                              order: q.order || 0,
                              is_active: q.is_active !== false,
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteQuote(q.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="gov" className="mt-6">
          <Card>
            <CardHeader className="border-b border-border/60 bg-muted/20">
              <CardTitle className="text-lg leading-snug">Government Schemes (MCED / MSSDS)</CardTitle>
              <CardDescription>
                Add or edit scheme rows shown on the public Government Schemes page.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={saveGov} className="mb-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gov-scheme">Scheme</Label>
                    <select
                      id="gov-scheme"
                      className={nativeSelectClass}
                      value={govForm.scheme_name}
                      onChange={(e) => setGovForm((p) => ({ ...p, scheme_name: e.target.value }))}
                    >
                      <option value="MCED">MCED</option>
                      <option value="MSSDS">MSSDS</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gov-project">Project category</Label>
                    <Input
                      id="gov-project"
                      placeholder="e.g. CRS"
                      value={govForm.project_category}
                      onChange={(e) => setGovForm((p) => ({ ...p, project_category: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gov-course">Course name</Label>
                    <Input
                      id="gov-course"
                      placeholder="Course name"
                      value={govForm.course_name}
                      onChange={(e) => setGovForm((p) => ({ ...p, course_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gov-year">Academic year</Label>
                    <Input
                      id="gov-year"
                      placeholder="e.g. 2023-24"
                      value={govForm.academic_year}
                      onChange={(e) => setGovForm((p) => ({ ...p, academic_year: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="space-y-2 sm:w-44">
                    <Label htmlFor="gov-students">Students trained</Label>
                    <Input
                      id="gov-students"
                      type="number"
                      min={0}
                      value={govForm.students_trained}
                      onChange={(e) => setGovForm((p) => ({ ...p, students_trained: Number(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pb-0.5">
                    <Button type="submit">{editingGov ? 'Update row' : 'Add scheme'}</Button>
                    {editingGov && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingGov(null);
                          setGovForm({
                            scheme_name: 'MCED',
                            project_category: '',
                            course_name: '',
                            academic_year: '',
                            students_trained: 0,
                            order: 0,
                            is_active: true,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </form>
              <p className="mb-2 text-sm font-medium text-foreground">Existing rows</p>
              <ul className="space-y-2">
                {govSchemes.map((r) => (
                  <li key={r.id} className={cn(adminRecordRowClass, 'items-center')}>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="font-medium text-foreground">{r.scheme_name}</span>
                      {r.project_category ? (
                        <span className="text-muted-foreground"> — {r.project_category}</span>
                      ) : null}
                      <span className="text-muted-foreground">
                        {' '}
                        · {r.course_name} ({r.academic_year}): {r.students_trained} students
                      </span>
                    </span>
                    <div className="flex shrink-0 gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingGov(r);
                          setGovForm({
                            scheme_name: r.scheme_name,
                            project_category: r.project_category || '',
                            course_name: r.course_name || '',
                            academic_year: r.academic_year || '',
                            students_trained: r.students_trained || 0,
                            order: r.order || 0,
                            is_active: r.is_active !== false,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteGov(r.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funds" className="mt-6">
          <Card>
            <CardHeader className="border-b border-border/60 bg-muted/20">
              <CardTitle className="text-lg">Funds Utilisation</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={saveFunds} className="mb-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="funds-period">Period</Label>
                    <Input
                      id="funds-period"
                      placeholder="e.g. FY 2023-24"
                      value={fundsForm.period_label}
                      onChange={(e) => setFundsForm((p) => ({ ...p, period_label: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funds-received">Amount received (₹)</Label>
                    <Input
                      id="funds-received"
                      type="number"
                      min={0}
                      value={fundsForm.amount_received}
                      onChange={(e) => setFundsForm((p) => ({ ...p, amount_received: Number(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funds-utilised">Amount utilised (₹)</Label>
                    <Input
                      id="funds-utilised"
                      type="number"
                      min={0}
                      value={fundsForm.amount_utilised}
                      onChange={(e) => setFundsForm((p) => ({ ...p, amount_utilised: Number(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="funds-details">Utilisation details</Label>
                    <Textarea
                      id="funds-details"
                      placeholder="How funds were used"
                      value={fundsForm.utilisation_details}
                      onChange={(e) => setFundsForm((p) => ({ ...p, utilisation_details: e.target.value }))}
                      rows={3}
                      className="resize-y"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit">{editingFunds ? 'Update row' : 'Add period'}</Button>
                  {editingFunds && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingFunds(null);
                        setFundsForm({
                          period_label: '',
                          amount_received: 0,
                          amount_utilised: 0,
                          utilisation_details: '',
                          order: 0,
                          is_active: true,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
              <p className="mb-2 text-sm font-medium text-foreground">Existing rows</p>
              <ul className="space-y-2">
                {fundsList.map((r) => (
                  <li key={r.id} className={cn(adminRecordRowClass, 'items-center')}>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="font-medium text-foreground">{r.period_label}</span>
                      <span className="text-muted-foreground">
                        {' '}
                        · received ₹{r.amount_received} · utilised ₹{r.amount_utilised}
                      </span>
                    </span>
                    <div className="flex shrink-0 gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingFunds(r);
                          setFundsForm({
                            period_label: r.period_label,
                            amount_received: r.amount_received || 0,
                            amount_utilised: r.amount_utilised || 0,
                            utilisation_details: r.utilisation_details || '',
                            order: r.order || 0,
                            is_active: r.is_active !== false,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteFunds(r.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Youth Courses</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={saveCourse} className="space-y-2 mb-4">
                <Input placeholder="Course name" value={courseForm.name} onChange={(e) => setCourseForm((p) => ({ ...p, name: e.target.value }))} required />
                <Textarea placeholder="Description" value={courseForm.description} onChange={(e) => setCourseForm((p) => ({ ...p, description: e.target.value }))} required />
                <Input placeholder="Duration" value={courseForm.duration} onChange={(e) => setCourseForm((p) => ({ ...p, duration: e.target.value }))} />
                <Input placeholder="Job prospects" value={courseForm.job_prospects} onChange={(e) => setCourseForm((p) => ({ ...p, job_prospects: e.target.value }))} />
                <Input placeholder="Eligibility" value={courseForm.eligibility} onChange={(e) => setCourseForm((p) => ({ ...p, eligibility: e.target.value }))} />
                <Input placeholder="Image URL" value={courseForm.image} onChange={(e) => setCourseForm((p) => ({ ...p, image: e.target.value }))} />
                <Button type="submit">{editingCourse ? 'Update' : 'Add'}</Button>
              </form>
              <ul className="space-y-2">
                {youthCourses.map((c) => (
                  <li key={c.id} className={cn(adminRecordRowClass, 'items-center')}>
                    <span className="min-w-0 flex-1 font-medium text-foreground">{c.name}</span>
                    <div className="flex shrink-0 gap-0.5">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingCourse(c); setCourseForm({ name: c.name, description: c.description, duration: c.duration || '', job_prospects: c.job_prospects || '', eligibility: c.eligibility || '', image: c.image || '', order: c.order || 0, is_active: c.is_active !== false }); }}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteCourse(c.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centres" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Senior Centres</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={saveCentre} className="space-y-2 mb-4">
                <Input placeholder="Centre name" value={centreForm.name} onChange={(e) => setCentreForm((p) => ({ ...p, name: e.target.value }))} required />
                <Textarea placeholder="Description" value={centreForm.description} onChange={(e) => setCentreForm((p) => ({ ...p, description: e.target.value }))} />
                <Textarea placeholder="Programmes (one per line)" value={programmesText} onChange={(e) => setProgrammesText(e.target.value)} rows={3} />
                <Textarea placeholder="Activities (one per line)" value={activitiesText} onChange={(e) => setActivitiesText(e.target.value)} rows={3} />
                <Input placeholder="Address" value={centreForm.address} onChange={(e) => setCentreForm((p) => ({ ...p, address: e.target.value }))} />
                <Button type="submit">{editingCentre ? 'Update' : 'Add'}</Button>
              </form>
              <ul className="space-y-2">
                {centres.map((c) => (
                  <li key={c.id} className={cn(adminRecordRowClass, 'items-center')}>
                    <span className="min-w-0 flex-1 font-medium text-foreground">{c.name}</span>
                    <div className="flex shrink-0 gap-0.5">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingCentre(c); setCentreForm({ name: c.name, description: c.description || '', programmes: [], activities: [], address: c.address || '', image: c.image || '', order: c.order || 0, is_active: c.is_active !== false }); setProgrammesText((c.programmes || []).join('\n')); setActivitiesText((c.activities || []).join('\n')); }}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteCentre(c.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enquiries" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Course Enquiries (read-only)</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {enquiries.map((e) => (
                  <li key={e.id} className="rounded-lg border border-border/80 bg-muted/15 p-4 shadow-sm">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{e.name}</span>
                      <span className="text-muted-foreground"> · {e.email} · Course: {e.course_name || e.course_id}</span>
                    </p>
                    {e.message ? <p className="mt-2 text-sm text-muted-foreground">{e.message}</p> : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="careers" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Career Applications (read-only)</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {careerApplications.map((a) => (
                  <li key={a.id} className="rounded-lg border border-border/80 bg-muted/15 p-4 shadow-sm">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{a.name}</span>
                      <span className="text-muted-foreground">
                        {' '}
                        · {a.email}
                        {a.phone ? ` · ${a.phone}` : ''}
                      </span>
                    </p>
                    {a.current_role && <p className="mt-1 text-sm text-muted-foreground">Role: {a.current_role}</p>}
                    {a.skills && <p className="mt-1 text-sm text-muted-foreground">Skills: {a.skills}</p>}
                    {a.message && <p className="mt-2 text-sm text-muted-foreground">{a.message}</p>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Awards & Accreditations</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={saveAward} className="mb-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="award-title">Title</Label>
                  <Input
                    id="award-title"
                    placeholder="Title"
                    value={awardForm.title}
                    onChange={(e) => setAwardForm((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="award-desc">Description</Label>
                  <Textarea
                    id="award-desc"
                    placeholder="Description"
                    value={awardForm.description}
                    onChange={(e) => setAwardForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="award-image">Image URL</Label>
                    <Input
                      id="award-image"
                      placeholder="Image URL"
                      value={awardForm.image}
                      onChange={(e) => setAwardForm((p) => ({ ...p, image: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="award-type">Type</Label>
                    <select
                      id="award-type"
                      className={nativeSelectClass}
                      value={awardForm.type}
                      onChange={(e) => setAwardForm((p) => ({ ...p, type: e.target.value }))}
                    >
                      <option value="award">Award</option>
                      <option value="accreditation">Accreditation</option>
                      <option value="certification">Certification</option>
                    </select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="award-year">Year</Label>
                    <Input
                      id="award-year"
                      placeholder="Year"
                      value={awardForm.year}
                      onChange={(e) => setAwardForm((p) => ({ ...p, year: e.target.value }))}
                    />
                  </div>
                </div>
                <Button type="submit">{editingAward ? 'Update' : 'Add'}</Button>
              </form>
              <ul className="space-y-2">
                {awards.map((a) => (
                  <li key={a.id} className={cn(adminRecordRowClass, 'items-center')}>
                    <span className="min-w-0 flex-1 font-medium text-foreground">{a.title}</span>
                    <div className="flex shrink-0 gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingAward(a);
                          setAwardForm({
                            title: a.title,
                            description: a.description || '',
                            image: a.image || '',
                            type: a.type || 'award',
                            year: a.year || '',
                            order: a.order || 0,
                            is_active: a.is_active !== false,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteAward(a.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Resource Links</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={saveResource} className="space-y-2 mb-4">
                <Input placeholder="Title" value={resourceForm.title} onChange={(e) => setResourceForm((p) => ({ ...p, title: e.target.value }))} required />
                <Input placeholder="URL" value={resourceForm.url} onChange={(e) => setResourceForm((p) => ({ ...p, url: e.target.value }))} required />
                <Input placeholder="Description" value={resourceForm.description} onChange={(e) => setResourceForm((p) => ({ ...p, description: e.target.value }))} />
                <Button type="submit">{editingResource ? 'Update' : 'Add'}</Button>
              </form>
              <ul className="space-y-2">
                {resources.map((r) => (
                  <li key={r.id} className={cn(adminRecordRowClass, 'items-center')}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 flex-1 truncate text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {r.title}
                    </a>
                    <div className="flex shrink-0 gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingResource(r);
                          setResourceForm({
                            title: r.title,
                            url: r.url,
                            type: r.type || 'link',
                            description: r.description || '',
                            order: r.order || 0,
                            is_active: r.is_active !== false,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteResource(r.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Management Messages</CardTitle>
              <CardDescription>
                Optional: link a message to someone on the About page leadership team so their card shows &quot;Read their
                message&quot; and scrolls here. Match by team member, or leave unset and rely on author name similarity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveMsg} className="space-y-2 mb-4">
                <Input placeholder="Title" value={msgForm.title} onChange={(e) => setMsgForm((p) => ({ ...p, title: e.target.value }))} />
                <Textarea placeholder="Message" value={msgForm.message} onChange={(e) => setMsgForm((p) => ({ ...p, message: e.target.value }))} required />
                <Input placeholder="Author name" value={msgForm.author_name} onChange={(e) => setMsgForm((p) => ({ ...p, author_name: e.target.value }))} />
                <Input placeholder="Author role" value={msgForm.author_role} onChange={(e) => setMsgForm((p) => ({ ...p, author_role: e.target.value }))} />
                <div className="space-y-1">
                  <Label>Link to leadership team member (About page)</Label>
                  <select
                    className={nativeSelectClass}
                    value={msgForm.leadership_member_id || ''}
                    onChange={(e) => setMsgForm((p) => ({ ...p, leadership_member_id: e.target.value }))}
                  >
                    <option value="">— None —</option>
                    {leadershipTeamForMessages.map((mem) => (
                      <option key={mem.id || mem._id} value={mem.id || mem._id}>
                        {mem.name}
                        {mem.role ? ` (${mem.role})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit">{editingMsg ? 'Update' : 'Add'}</Button>
              </form>
              <ul className="space-y-2">
                {messages.map((m) => (
                  <li key={m.id} className={cn(adminRecordRowClass, 'items-center')}>
                    <span className="line-clamp-2 min-w-0 flex-1 text-sm text-foreground">{m.title || m.message}</span>
                    <div className="flex shrink-0 gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingMsg(m);
                          setMsgForm({
                            title: m.title || '',
                            message: m.message,
                            author_name: m.author_name || '',
                            author_role: m.author_role || '',
                            image: m.image || '',
                            leadership_member_id: m.leadership_member_id || '',
                            order: m.order || 0,
                            is_active: m.is_active !== false,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteMsg(m.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero-bg" className="mt-6">
          <Card>
            <CardHeader className="border-b border-border/60 bg-muted/20">
              <CardTitle className="text-lg leading-snug">Homepage hero backgrounds</CardTitle>
              <CardDescription>
                Full-width images behind the main headline on the home page. Use direct image URLs (HTTPS). Lower order
                numbers appear first in the rotation.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={saveHeroSlide} className="mb-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="hero-img">Image URL</Label>
                    <Input
                      id="hero-img"
                      placeholder="https://…"
                      value={heroForm.image}
                      onChange={(e) => setHeroForm((p) => ({ ...p, image: e.target.value }))}
                      required
                    />
                    <ImageQualityHint context="hero" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-label">Label (optional)</Label>
                    <Input
                      id="hero-label"
                      placeholder="For your reference in this list only"
                      value={heroForm.title}
                      onChange={(e) => setHeroForm((p) => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-order">Order</Label>
                    <Input
                      id="hero-order"
                      type="number"
                      value={heroForm.order}
                      onChange={(e) => setHeroForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={heroForm.is_active}
                      onChange={(e) => setHeroForm((p) => ({ ...p, is_active: e.target.checked }))}
                      className="rounded border-input"
                    />
                    Active
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit">{editingHero ? 'Update slide' : 'Add slide'}</Button>
                    {editingHero && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingHero(null);
                          setHeroForm({ title: '', image: '', order: 0, is_active: true });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </form>
              <p className="mb-2 text-sm font-medium text-foreground">Slides</p>
              <ul className="space-y-2">
                {heroSlides.map((row) => (
                  <li key={row.id} className={cn(adminRecordRowClass, 'items-center gap-4')}>
                    <img
                      src={row.image}
                      alt=""
                      className="h-14 w-24 shrink-0 rounded-md border object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="min-w-0 flex-1 text-sm">
                      <span className="font-medium text-foreground">{row.title || 'Hero background'}</span>
                      <span className="block truncate text-muted-foreground">{row.image}</span>
                      <span className="text-xs text-muted-foreground">
                        Order {row.order ?? 0}
                        {row.is_active === false ? ' · hidden' : ''}
                      </span>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingHero(row);
                          setHeroForm({
                            title: row.title || '',
                            image: row.image || '',
                            order: row.order || 0,
                            is_active: row.is_active !== false,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteHeroSlide(row.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              {heroSlides.length === 0 && (
                <p className="text-sm text-muted-foreground">No slides yet. Add at least one URL, or the site uses default stock images.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events-carousel" className="mt-6">
          <Card>
            <CardHeader className="border-b border-border/60 bg-muted/20">
              <CardTitle className="text-lg leading-snug">Events & Programmes carousel</CardTitle>
              <CardDescription>
                Slides for the &quot;Events & Programmes&quot; section on the home page. Title and description show as
                overlays; optional corner badge image (small square logo).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={saveEventsSlide} className="mb-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ev-title">Title</Label>
                    <Input
                      id="ev-title"
                      value={eventsForm.title}
                      onChange={(e) => setEventsForm((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ev-desc">Description</Label>
                    <Textarea
                      id="ev-desc"
                      rows={2}
                      value={eventsForm.description}
                      onChange={(e) => setEventsForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ev-type">Type</Label>
                    <select
                      id="ev-type"
                      className={nativeSelectClass}
                      value={eventsForm.type}
                      onChange={(e) => setEventsForm((p) => ({ ...p, type: e.target.value }))}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video (YouTube)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ev-order">Order</Label>
                    <Input
                      id="ev-order"
                      type="number"
                      value={eventsForm.order}
                      onChange={(e) => setEventsForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                    />
                  </div>
                  {eventsForm.type === 'image' ? (
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="ev-image">Image URL</Label>
                      <Input
                        id="ev-image"
                        placeholder="https://…"
                        value={eventsForm.image}
                        onChange={(e) => setEventsForm((p) => ({ ...p, image: e.target.value }))}
                        required
                      />
                      <ImageQualityHint context="carousel" />
                    </div>
                  ) : (
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="ev-video">Video URL</Label>
                      <Input
                        id="ev-video"
                        placeholder="https://www.youtube.com/watch?v=…"
                        value={eventsForm.video_url}
                        onChange={(e) => setEventsForm((p) => ({ ...p, video_url: e.target.value }))}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ev-badge">Corner badge image URL (optional)</Label>
                    <Input
                      id="ev-badge"
                      placeholder="Small square logo, https://…"
                      value={eventsForm.badge_image}
                      onChange={(e) => setEventsForm((p) => ({ ...p, badge_image: e.target.value }))}
                    />
                    <ImageQualityHint context="logo" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={eventsForm.is_active}
                      onChange={(e) => setEventsForm((p) => ({ ...p, is_active: e.target.checked }))}
                      className="rounded border-input"
                    />
                    Active
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit">{editingEvents ? 'Update slide' : 'Add slide'}</Button>
                    {editingEvents && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingEvents(null);
                          setEventsForm({
                            title: '',
                            description: '',
                            image: '',
                            type: 'image',
                            video_url: '',
                            badge_image: '',
                            order: 0,
                            is_active: true,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </form>
              <p className="mb-2 text-sm font-medium text-foreground">Slides</p>
              <ul className="space-y-2">
                {eventsSlides.map((row) => (
                  <li key={row.id} className={cn(adminRecordRowClass, 'items-center gap-4')}>
                    {row.type === 'image' && row.image ? (
                      <img
                        src={row.image}
                        alt=""
                        className="h-14 w-24 shrink-0 rounded-md border object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                        Video
                      </div>
                    )}
                    <div className="min-w-0 flex-1 text-sm">
                      <span className="font-medium text-foreground">{row.title}</span>
                      {row.description ? (
                        <span className="line-clamp-1 block text-muted-foreground">{row.description}</span>
                      ) : null}
                      <span className="text-xs text-muted-foreground">
                        Order {row.order ?? 0}
                        {row.is_active === false ? ' · hidden' : ''}
                      </span>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingEvents(row);
                          setEventsForm({
                            title: row.title || '',
                            description: row.description || '',
                            image: row.image || '',
                            type: row.type === 'video' ? 'video' : 'image',
                            video_url: row.video_url || '',
                            badge_image: row.badge_image || '',
                            order: row.order || 0,
                            is_active: row.is_active !== false,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteEventsSlide(row.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              {eventsSlides.length === 0 && (
                <p className="text-sm text-muted-foreground">No slides yet. The Events & Programmes block stays hidden until you add active slides.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Engagement Options (Volunteer, Donate, Career form)</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <TextAreaField label="Volunteering text" value={engForm.volunteering_text} onChange={(v) => setEngForm((p) => ({ ...p, volunteering_text: v }))} />
              <Input placeholder="Volunteering link" value={engForm.volunteering_link} onChange={(e) => setEngForm((p) => ({ ...p, volunteering_link: e.target.value }))} />
              <TextAreaField label="Donate books/medical text" value={engForm.donate_books_medical_text} onChange={(v) => setEngForm((p) => ({ ...p, donate_books_medical_text: v }))} />
              <Input placeholder="Monetary QR image URL" value={engForm.monetary_qr_image_url} onChange={(e) => setEngForm((p) => ({ ...p, monetary_qr_image_url: e.target.value }))} />
              <TextAreaField label="Monetary payment options text" value={engForm.monetary_payment_options} onChange={(v) => setEngForm((p) => ({ ...p, monetary_payment_options: v }))} />
              <Input placeholder="Career form URL (Google Form)" value={engForm.career_form_url} onChange={(e) => setEngForm((p) => ({ ...p, career_form_url: e.target.value }))} />
              <Button onClick={saveEngagement}><Save className="h-4 w-4 mr-2" /> Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExtraContentManagement;
