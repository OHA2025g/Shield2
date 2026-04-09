import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// PUBLIC API FUNCTIONS
export const api = {
  // Contact form submission
  submitContactForm: async (formData) => {
    const response = await apiClient.post('/contact', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      inquiryType: formData.inquiryType || 'general'
    });
    return response.data;
  },

  // Volunteer registration
  submitVolunteerForm: async (formData) => {
    const response = await apiClient.post('/volunteer', formData);
    return response.data;
  },

  // Newsletter signup
  subscribeNewsletter: async (email) => {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return response.data;
  },

  // Submit donation
  submitDonation: async (donationData) => {
    const response = await apiClient.post('/donation', donationData);
    return response.data;
  },

  submitCourseEnquiry: async (data) => {
    const response = await apiClient.post('/course-enquiry', data);
    return response.data;
  },

  submitCareerApplication: async (data) => {
    const response = await apiClient.post('/career-application', data);
    return response.data;
  },

  submitContentContribution: async (data) => {
    const response = await apiClient.post('/content-submissions', data);
    return response.data;
  },

  // Get published news
  getPublishedNews: async () => {
    const response = await apiClient.get('/news');
    return response.data;
  },

  getNewsById: async (id) => {
  const response = await apiClient.get(`/news/${id}`);
  return response.data;
  },

    // Get published blogs
  getPublishedBlogs: async () => {
    const response = await apiClient.get('/blogs');
    return response.data;
  },

  getBlogById: async (id) => {
  const response = await apiClient.get(`/blogs/${id}`);
  return response.data;
  },

  // Get impact statistics
  getImpactStats: async () => {
    const response = await apiClient.get('/impact-stats');
    return response.data;
  },

  // ADMIN API FUNCTIONS
  admin: {
    // Admin login
    login: async (credentials) => {
      const response = await apiClient.post('/admin/login', credentials);
      if (response.data.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    // Admin logout
    logout: () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },

    // Get contacts
    getContacts: async () => {
      const response = await apiClient.get('/admin/contacts');
      return response.data;
    },

    // Get volunteers
    getVolunteers: async () => {
      const response = await apiClient.get('/admin/volunteers');
      return response.data;
    },

    // Get newsletter subscribers
    getNewsletterSubscribers: async () => {
      const response = await apiClient.get('/admin/newsletters');
      return response.data;
    },

    // Get all news (including drafts)
    getAllNews: async () => {
      const response = await apiClient.get('/admin/news');
      return response.data;
    },

    // Create news
    createNews: async (newsData) => {
      const response = await apiClient.post('/admin/news', newsData);
      return response.data;
    },

    // Update news
    updateNews: async (id, newsData) => {
      const response = await apiClient.put(`/admin/news/${id}`, newsData);
      return response.data;
    },

    // Delete news
    deleteNews: async (id) => {
      const response = await apiClient.delete(`/admin/news/${id}`);
      return response.data;
    },

    // Get all blogs (including drafts)
    getAllBlogs: async () => {
      const response = await apiClient.get('/admin/blogs');
      return response.data;
    },

    // Create a blog
    createBlog: async (blogData) => {
      const response = await apiClient.post('/admin/blogs', blogData);
      return response.data;
    },

    // Update a blog
    updateBlog: async (id, blogData) => {
      const response = await apiClient.put(`/admin/blogs/${id}`, blogData);
      return response.data;
    },

    // Delete a blog
    deleteBlog: async (id) => {
      const response = await apiClient.delete(`/admin/blogs/${id}`);
      return response.data;
    },

    // Update impact statistics
    updateImpactStats: async (statsData) => {
      const response = await apiClient.put('/admin/impact-stats', statsData);
      return response.data;
    },

    // Get site content
    getSiteContent: async () => {
      const response = await apiClient.get('/admin/site-content');
      return response.data;
    },

    // Update site content
    updateSiteContent: async (contentData) => {
      const response = await apiClient.put('/admin/site-content', { content: contentData });
      return response.data;
    },

    // Update contact information
    updateContactInfo: async (contactData) => {
      const response = await apiClient.put('/admin/contact-info', contactData);
      return response.data;
    },

    mergeGovernmentSchemesPage: async (partial) => {
      const response = await apiClient.put('/admin/government-schemes-page', partial);
      return response.data;
    },

    listContentSubmissions: async (status = null) => {
      const response = await apiClient.get('/admin/content-submissions', {
        params: status ? { status } : {},
      });
      return response.data;
    },

    updateContentSubmission: async (id, payload) => {
      const response = await apiClient.put(`/admin/content-submissions/${id}`, payload);
      return response.data;
    },

    deleteContentSubmission: async (id) => {
      const response = await apiClient.delete(`/admin/content-submissions/${id}`);
      return response.data;
    },

    // Success Stories Management
    getAllSuccessStories: async () => {
      const response = await apiClient.get('/admin/success-stories');
      return response.data;
    },

    addSuccessStory: async (storyData) => {
      const response = await apiClient.post('/admin/success-stories', storyData);
      return response.data;
    },

    updateSuccessStory: async (storyId, storyData) => {
      const response = await apiClient.put(`/admin/success-stories/${storyId}`, storyData);
      return response.data;
    },

    deleteSuccessStory: async (storyId) => {
      const response = await apiClient.delete(`/admin/success-stories/${storyId}`);
      return response.data;
    },

    // Leadership Team Management
    getAllTeamMembers: async () => {
      const response = await apiClient.get('/admin/leadership-team');
      return response.data;
    },

    addTeamMember: async (memberData) => {
      const response = await apiClient.post('/admin/leadership-team', memberData);
      return response.data;
    },

    updateTeamMember: async (memberId, memberData) => {
      const response = await apiClient.put(`/admin/leadership-team/${memberId}`, memberData);
      return response.data;
    },

    deleteTeamMember: async (memberId) => {
      const response = await apiClient.delete(`/admin/leadership-team/${memberId}`);
      return response.data;
    },

    // Page Sections Management
    getPageSections: async (page) => {
      const response = await apiClient.get(`/admin/page-sections/${page}`);
      return response.data;
    },

    addPageSection: async (sectionData) => {
      const response = await apiClient.post('/admin/page-sections', sectionData);
      return response.data;
    },

    updatePageSection: async (sectionId, sectionData) => {
      const response = await apiClient.put(`/admin/page-sections/${sectionId}`, sectionData);
      return response.data;
    },

    deletePageSection: async (sectionId) => {
      const response = await apiClient.delete(`/admin/page-sections/${sectionId}`);
      return response.data;
    },

    // Gallery Items Management
    getAllGalleryItems: async () => {
      const response = await apiClient.get('/admin/gallery-items');
      return response.data;
    },

    addGalleryItem: async (itemData) => {
      const response = await apiClient.post('/admin/gallery-items', itemData);
      return response.data;
    },

    updateGalleryItem: async (itemId, itemData) => {
      const response = await apiClient.put(`/admin/gallery-items/${itemId}`, itemData);
      return response.data;
    },

    deleteGalleryItem: async (itemId) => {
      const response = await apiClient.delete(`/admin/gallery-items/${itemId}`);
      return response.data;
    },

    // Testimonials Management
    getAllTestimonials: async () => {
      const response = await apiClient.get('/admin/testimonials');
      return response.data;
    },

    addTestimonial: async (testimonialData) => {
      const response = await apiClient.post('/admin/testimonials', testimonialData);
      return response.data;
    },

    updateTestimonial: async (testimonialId, testimonialData) => {
      const response = await apiClient.put(`/admin/testimonials/${testimonialId}`, testimonialData);
      return response.data;
    },

    deleteTestimonial: async (testimonialId) => {
      const response = await apiClient.delete(`/admin/testimonials/${testimonialId}`);
      return response.data;
    },

    // Impact Highlights Management
    getAllImpactHighlights: async () => {
      const response = await apiClient.get('/admin/impact-highlights');
      return response.data;
    },

    addImpactHighlight: async (highlightData) => {
      const response = await apiClient.post('/admin/impact-highlights', highlightData);
      return response.data;
    },

    updateImpactHighlight: async (highlightId, highlightData) => {
      const response = await apiClient.put(`/admin/impact-highlights/${highlightId}`, highlightData);
      return response.data;
    },

    deleteImpactHighlight: async (highlightId) => {
      const response = await apiClient.delete(`/admin/impact-highlights/${highlightId}`);
      return response.data;
    },

    // Donations Management
    getAllDonations: async () => {
      const response = await apiClient.get('/admin/donations');
      return response.data;
    },

    updateDonation: async (donationId, donationData) => {
      const response = await apiClient.put(`/admin/donations/${donationId}`, donationData);
      return response.data;
    },

    deleteDonation: async (donationId) => {
      const response = await apiClient.delete(`/admin/donations/${donationId}`);
      return response.data;
    },

    // Database Management
    getDatabaseCollections: async () => {
      const response = await apiClient.get('/admin/database/collections');
      return response.data;
    },

    getCollectionData: async (collectionName, limit = 100, skip = 0) => {
      const response = await apiClient.get(`/admin/database/${collectionName}?limit=${limit}&skip=${skip}`);
      return response.data;
    },

    deleteDocument: async (collectionName, documentId) => {
      const response = await apiClient.delete(`/admin/database/${collectionName}/${documentId}`);
      return response.data;
    },

    getDatabaseStats: async () => {
      const response = await apiClient.get('/admin/database/stats');
      return response.data;
    },

    // User Management
    getUsers: async () => {
      const response = await apiClient.get('/admin/users');
      return response.data;
    },

    createUser: async (userData) => {
      const response = await apiClient.post('/admin/users', userData);
      return response.data;
    },

    updateUser: async (userId, userData) => {
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return response.data;
    },

    updateUserPassword: async (userId, passwordData) => {
      const response = await apiClient.put(`/admin/users/${userId}/password`, passwordData);
      return response.data;
    },

    deleteUser: async (userId) => {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    },

    // Site Settings/Branding Management
    getSiteSettings: async () => {
      const response = await apiClient.get('/admin/site-settings');
      return response.data;
    },

    updateSiteSettings: async (settingsData) => {
      const response = await apiClient.put('/admin/site-settings', settingsData);
      return response.data;
    },

    // Detailed Page Sections Management
    getDetailedPageSections: async (page) => {
      const response = await apiClient.get(`/admin/detailed-page-sections/${page}`);
      return response.data;
    },

    addDetailedPageSection: async (sectionData) => {
      const response = await apiClient.post('/admin/detailed-page-sections', sectionData);
      return response.data;
    },

    updateDetailedPageSection: async (sectionId, sectionData) => {
      const response = await apiClient.put(`/admin/detailed-page-sections/${sectionId}`, sectionData);
      return response.data;
    },

    deleteDetailedPageSection: async (sectionId) => {
      const response = await apiClient.delete(`/admin/detailed-page-sections/${sectionId}`);
      return response.data;
    },

    // Org Overview
    getOrgOverview: async () => {
      const response = await apiClient.get('/admin/org-overview');
      return response.data;
    },
    updateOrgOverview: async (data) => {
      const response = await apiClient.put('/admin/org-overview', data);
      return response.data;
    },

    // Placement Stories
    getPlacementStories: async () => apiClient.get('/admin/placement-stories').then(r => r.data),
    createPlacementStory: async (data) => apiClient.post('/admin/placement-stories', data).then(r => r.data),
    updatePlacementStory: async (id, data) => apiClient.put(`/admin/placement-stories/${id}`, data).then(r => r.data),
    deletePlacementStory: async (id) => apiClient.delete(`/admin/placement-stories/${id}`).then(r => r.data),

    // Featured Video
    getFeaturedVideo: async () => apiClient.get('/admin/featured-video').then(r => r.data),
    updateFeaturedVideo: async (data) => apiClient.put('/admin/featured-video', data).then(r => r.data),

    // Daily Quotes (legacy single-language rows)
    getDailyQuotes: async () => apiClient.get('/admin/daily-quotes').then(r => r.data),
    createDailyQuote: async (data) => apiClient.post('/admin/daily-quotes', data).then(r => r.data),
    updateDailyQuote: async (id, data) => apiClient.put(`/admin/daily-quotes/${id}`, data).then(r => r.data),
    deleteDailyQuote: async (id) => apiClient.delete(`/admin/daily-quotes/${id}`).then(r => r.data),

    // Daily quote groups (EN + MR + HI per slideshow slide)
    getDailyQuoteGroups: async () => apiClient.get('/admin/daily-quote-groups').then(r => r.data),
    createDailyQuoteGroup: async (data) => apiClient.post('/admin/daily-quote-groups', data).then(r => r.data),
    updateDailyQuoteGroup: async (id, data) => apiClient.put(`/admin/daily-quote-groups/${id}`, data).then(r => r.data),
    deleteDailyQuoteGroup: async (id) => apiClient.delete(`/admin/daily-quote-groups/${id}`).then(r => r.data),

    // Government Schemes
    getGovernmentSchemes: async () => apiClient.get('/admin/government-schemes').then(r => r.data),
    createGovernmentScheme: async (data) => apiClient.post('/admin/government-schemes', data).then(r => r.data),
    updateGovernmentScheme: async (id, data) => apiClient.put(`/admin/government-schemes/${id}`, data).then(r => r.data),
    deleteGovernmentScheme: async (id) => apiClient.delete(`/admin/government-schemes/${id}`).then(r => r.data),

    // Funds Utilization
    getFundsUtilization: async () => apiClient.get('/admin/funds-utilization').then(r => r.data),
    createFundsUtilization: async (data) => apiClient.post('/admin/funds-utilization', data).then(r => r.data),
    updateFundsUtilization: async (id, data) => apiClient.put(`/admin/funds-utilization/${id}`, data).then(r => r.data),
    deleteFundsUtilization: async (id) => apiClient.delete(`/admin/funds-utilization/${id}`).then(r => r.data),

    // Youth Courses
    getYouthCourses: async () => apiClient.get('/admin/youth-courses').then(r => r.data),
    createYouthCourse: async (data) => apiClient.post('/admin/youth-courses', data).then(r => r.data),
    updateYouthCourse: async (id, data) => apiClient.put(`/admin/youth-courses/${id}`, data).then(r => r.data),
    deleteYouthCourse: async (id) => apiClient.delete(`/admin/youth-courses/${id}`).then(r => r.data),

    // Senior Centres
    getSeniorCentres: async () => apiClient.get('/admin/senior-centres').then(r => r.data),
    createSeniorCentre: async (data) => apiClient.post('/admin/senior-centres', data).then(r => r.data),
    updateSeniorCentre: async (id, data) => apiClient.put(`/admin/senior-centres/${id}`, data).then(r => r.data),
    deleteSeniorCentre: async (id) => apiClient.delete(`/admin/senior-centres/${id}`).then(r => r.data),

    // Course Enquiries
    getCourseEnquiries: async () => apiClient.get('/admin/course-enquiries').then(r => r.data),

    // Career Applications
    getCareerApplications: async () => apiClient.get('/admin/career-applications').then(r => r.data),

    // Awards & Accreditations
    getAwardsAccreditations: async () => apiClient.get('/admin/awards-accreditations').then(r => r.data),
    createAwardAccreditation: async (data) => apiClient.post('/admin/awards-accreditations', data).then(r => r.data),
    updateAwardAccreditation: async (id, data) => apiClient.put(`/admin/awards-accreditations/${id}`, data).then(r => r.data),
    deleteAwardAccreditation: async (id) => apiClient.delete(`/admin/awards-accreditations/${id}`).then(r => r.data),

    // Resource Links
    getResourceLinks: async () => apiClient.get('/admin/resource-links').then(r => r.data),
    createResourceLink: async (data) => apiClient.post('/admin/resource-links', data).then(r => r.data),
    updateResourceLink: async (id, data) => apiClient.put(`/admin/resource-links/${id}`, data).then(r => r.data),
    deleteResourceLink: async (id) => apiClient.delete(`/admin/resource-links/${id}`).then(r => r.data),

    // Management Messages
    getManagementMessages: async () => apiClient.get('/admin/management-messages').then(r => r.data),
    createManagementMessage: async (data) => apiClient.post('/admin/management-messages', data).then(r => r.data),
    updateManagementMessage: async (id, data) => apiClient.put(`/admin/management-messages/${id}`, data).then(r => r.data),
    deleteManagementMessage: async (id) => apiClient.delete(`/admin/management-messages/${id}`).then(r => r.data),

    // Engagement Options
    getEngagementOptions: async () => apiClient.get('/admin/engagement-options').then(r => r.data),
    updateEngagementOptions: async (data) => apiClient.put('/admin/engagement-options', data).then(r => r.data),
  }
};

// Public site content API (no authentication required)
export const getPublicSiteContent = async () => {
  try {
    const response = await apiClient.get('/site-content');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch public site content:', error);
    throw error;
  }
};

// Success Stories API (public)
export const getSuccessStories = async () => {
  try {
    const response = await apiClient.get('/success-stories');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch success stories:', error);
    throw error;
  }
};

// Leadership Team API (public)
export const getLeadershipTeam = async () => {
  try {
    const response = await apiClient.get('/leadership-team');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leadership team:', error);
    throw error;
  }
};

// Page Sections API (public)
export const getPageSections = async (page) => {
  try {
    const response = await apiClient.get(`/page-sections/${page}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch page sections for ${page}:`, error);
    throw error;
  }
};

// Gallery Items API (public). Pass category e.g. 'homepage_hero' | 'events_programmes' for homepage carousels.
export const getGalleryItems = async (category = null) => {
  try {
    const params = category ? { params: { category } } : {};
    const response = await apiClient.get('/gallery-items', params);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    throw error;
  }
};

// Testimonials API (public)
export const getTestimonials = async () => {
  try {
    const response = await apiClient.get('/testimonials');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    throw error;
  }
};

// Site Settings API (public)
export const getSiteSettings = async () => {
  try {
    const response = await apiClient.get('/site-settings');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    throw error;
  }
};

// Detailed Page Sections API (public)
export const getDetailedPageSections = async (page) => {
  try {
    const response = await apiClient.get(`/detailed-page-sections/${page}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch detailed page sections for ${page}:`, error);
    throw error;
  }
};

// Impact Highlights API (public)
export const getImpactHighlights = async () => {
  try {
    const response = await apiClient.get('/impact-highlights');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch impact highlights:', error);
    throw error;
  }
};

// New public APIs (org overview, placement stories, featured video, daily quote, etc.)
export const getOrgOverview = () => apiClient.get('/org-overview').then(r => r.data);
export const getPlacementStories = () => apiClient.get('/placement-stories').then(r => r.data);
export const getFeaturedVideo = () => apiClient.get('/featured-video').then(r => r.data);
export const getDailyQuote = (language = null) =>
  apiClient.get('/daily-quote', { params: language ? { language } : {} }).then((r) => r.data);

export const getDailyQuoteGroups = () => apiClient.get('/daily-quote-groups').then((r) => r.data);
export const getGovernmentSchemes = () => apiClient.get('/government-schemes').then(r => r.data);
export const getFundsUtilization = () => apiClient.get('/funds-utilization').then(r => r.data);
export const getYouthCourses = () => apiClient.get('/youth-courses').then(r => r.data);
export const getSeniorCentres = () => apiClient.get('/senior-centres').then(r => r.data);
export const getAwardsAccreditations = () => apiClient.get('/awards-accreditations').then(r => r.data);
export const getResourceLinks = () => apiClient.get('/resource-links').then(r => r.data);
export const getManagementMessages = () => apiClient.get('/management-messages').then(r => r.data);
export const getEngagementOptions = () => apiClient.get('/engagement-options').then(r => r.data);
