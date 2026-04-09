from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional
from datetime import datetime
import uuid

# Contact Models
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    inquiry_type: str = Field(..., alias="inquiryType")

class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str]
    subject: str
    message: str
    inquiry_type: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="new")

# Volunteer Models
class VolunteerCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    skills: Optional[str] = Field(None, max_length=500)
    availability: str
    interests: List[str]
    experience: Optional[str] = Field(None, max_length=1000)

class Volunteer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    skills: Optional[str]
    availability: str
    interests: List[str]
    experience: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")

# Newsletter Models
class NewsletterSubscribe(BaseModel):
    email: EmailStr

class Newsletter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)

# News Models
class NewsCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=20, max_length=5000)
    status: str = Field(default="draft")

    @validator('status')
    def validate_status(cls, v):
        if v not in ['draft', 'published']:
            raise ValueError('Status must be either draft or published')
        return v

class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    content: Optional[str] = Field(None, min_length=20, max_length=5000)
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['draft', 'published']:
            raise ValueError('Status must be either draft or published')
        return v

class News(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    status: str
    author: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Blog Models
class BlogCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=20, max_length=5000)
    excerpt: str = Field(..., min_length=20, max_length=300)
    category: str = Field(..., min_length=3, max_length=50)
    tags: List[str] = []
    image: Optional[str] = None  # URL of the blog image
    status: str = Field(default="draft")

    @validator('status')
    def validate_status(cls, v):
        if v not in ['draft', 'published']:
            raise ValueError('Status must be either draft or published')
        return v


class BlogUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    content: Optional[str] = Field(None, min_length=20, max_length=5000)
    excerpt: Optional[str] = Field(None, min_length=20, max_length=300)
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    image: Optional[str] = None
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['draft', 'published']:
            raise ValueError('Status must be either draft or published')
        return v


class Blog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    excerpt: str
    category: str
    tags: List[str] = []
    image: Optional[str] = None
    status: str
    author: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# Admin Models
class AdminLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    name: str
    role: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

# Impact Stats Models
class ImpactStatsUpdate(BaseModel):
    youth_trained: Optional[int] = Field(None, ge=0)
    youth_placed: Optional[int] = Field(None, ge=0)
    seniors_supported: Optional[int] = Field(None, ge=0)
    women_empowered: Optional[int] = Field(None, ge=0)

class ImpactStats(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    youth_trained: int = Field(default=1300)
    youth_placed: int = Field(default=1000)
    seniors_supported: int = Field(default=6000)
    women_empowered: int = Field(default=200)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str

# Response Models
class MessageResponse(BaseModel):
    message: str
    success: bool = True

class LoginResponse(BaseModel):
    message: str
    success: bool = True
    user: AdminUser
    token: str

# Site Content Models
class SiteContentUpdate(BaseModel):
    content: dict  # Flexible structure for site content

class ContactInfoUpdate(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    office_hours: Optional[str] = None

# Testimonials Models
class Testimonial(BaseModel):
    id: str
    name: str
    role: str
    company: Optional[str] = None
    content: str
    image: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class TestimonialCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., min_length=2, max_length=100)
    company: Optional[str] = Field(None, max_length=100)
    content: str = Field(..., min_length=10, max_length=5000)
    image: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    order: int = 0
    is_active: bool = True

class TestimonialUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    role: Optional[str] = Field(None, min_length=2, max_length=100)
    company: Optional[str] = Field(None, max_length=100)
    content: Optional[str] = Field(None, min_length=10, max_length=5000)
    image: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Success Stories Models (category: senior_citizens | youth_skill_training for home section)
class SuccessStory(BaseModel):
    id: str
    name: str
    story: str
    image: str
    achievement: str
    location: str
    program: str
    category: Optional[str] = None  # senior_citizens | youth_skill_training
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class SuccessStoryCreate(BaseModel):
    name: str
    story: str
    image: str
    achievement: str
    location: str
    program: str
    category: Optional[str] = None
    order: int = 0
    is_active: bool = True

class SuccessStoryUpdate(BaseModel):
    name: Optional[str] = None
    story: Optional[str] = None
    image: Optional[str] = None
    achievement: Optional[str] = None
    location: Optional[str] = None
    program: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Leadership Team Models
class TeamMember(BaseModel):
    id: str
    name: str
    role: str
    image: str
    description: str
    category: str = "Trustee"  # Trustee, Programs Team, Admin & Finance
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class TeamMemberCreate(BaseModel):
    name: str
    role: str
    image: str
    description: str
    category: str = "Trustee"  # Trustee, Programs Team, Admin & Finance
    order: int = 0
    is_active: bool = True

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Page Content Models for configurable sections
class PageSection(BaseModel):
    id: str
    page: str  # 'about', 'programs', 'impact', 'gallery'
    section: str  # 'journey', 'partners', 'overview', etc.
    title: str
    content: dict  # Flexible content structure
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class PageSectionCreate(BaseModel):
    page: str
    section: str
    title: str
    content: dict
    order: int = 0
    is_active: bool = True

class PageSectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[dict] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Gallery Item Models (category used for event/programme carousels; type image|video; video_url for YouTube etc.)
# Reserved categories: homepage_hero (full-bleed hero rotation), events_programmes (homepage Events & Programmes carousel)
class GalleryItem(BaseModel):
    id: str
    title: str
    description: str
    image: str
    category: str
    date: str
    type: str = "image"  # image, video
    video_url: Optional[str] = None  # YouTube or other video URL when type=video
    badge_image: Optional[str] = None  # small corner logo on carousel slide (e.g. Events & Programmes)
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class GalleryItemCreate(BaseModel):
    title: str
    description: str
    image: str
    category: str
    date: str
    type: str = "image"
    video_url: Optional[str] = None
    badge_image: Optional[str] = None
    order: int = 0
    is_active: bool = True

class GalleryItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    type: Optional[str] = None
    video_url: Optional[str] = None
    badge_image: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# User Management Models
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="admin")  # admin, editor, viewer

    @validator('role')
    def validate_role(cls, v):
        if v not in ['super_admin', 'admin', 'editor', 'viewer']:
            raise ValueError('Role must be one of: super_admin, admin, editor, viewer')
        return v

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

    @validator('role')
    def validate_role(cls, v):
        if v is not None and v not in ['super_admin', 'admin', 'editor', 'viewer']:
            raise ValueError('Role must be one of: super_admin, admin, editor, viewer')
        return v

class UserPasswordUpdate(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    name: str
    email: str
    role: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

# Site Settings/Branding Models
class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    site_title: str = "Shield Foundation"
    site_description: str = "Adding Life to Years"
    primary_color: str = "#2563eb"  # blue-600
    secondary_color: str = "#eab308"  # yellow-500
    accent_color: str = "#ffffff"  # white
    # Social Media Links
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    twitter_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str

class SiteSettingsUpdate(BaseModel):
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    site_title: Optional[str] = None
    site_description: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    twitter_url: Optional[str] = None
    linkedin_url: Optional[str] = None

# Enhanced Page Section Models for CMS
class PageSectionContent(BaseModel):
    """Flexible content structure for different types of page sections"""
    text: Optional[str] = None
    html: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    links: Optional[List[dict]] = None
    items: Optional[List[dict]] = None
    subsections: Optional[List[dict]] = None
    metadata: Optional[dict] = None

class DetailedPageSection(BaseModel):
    id: str
    page: str  # 'about', 'programs', 'impact', 'gallery'
    section: str  # 'hero', 'journey', 'partners', 'overview', etc.
    title: str
    content: PageSectionContent
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class DetailedPageSectionCreate(BaseModel):
    page: str
    section: str
    title: str
    content: PageSectionContent
    order: int = 0
    is_active: bool = True

class DetailedPageSectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[PageSectionContent] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Donation Models
class DonationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    amount: float = Field(..., gt=0)
    currency: str = Field(default="INR", max_length=10)
    payment_method: str = Field(default="online", max_length=50)  # online, bank_transfer, cheque, cash
    message: Optional[str] = Field(None, max_length=1000)
    anonymous: bool = Field(default=False)
    recurring: bool = Field(default=False)
    frequency: Optional[str] = Field(None, max_length=20)  # monthly, quarterly, yearly

class DonationUpdate(BaseModel):
    status: Optional[str] = None  # pending, completed, failed, cancelled
    payment_reference: Optional[str] = None
    notes: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['pending', 'completed', 'failed', 'cancelled']:
            raise ValueError('Status must be one of: pending, completed, failed, cancelled')
        return v

class Donation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str]
    amount: float
    currency: str
    payment_method: str
    message: Optional[str]
    anonymous: bool
    recurring: bool
    frequency: Optional[str]
    status: str = Field(default="pending")
    payment_reference: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Impact Highlights Models
class ImpactHighlight(BaseModel):
    id: str
    title: str
    description: str
    icon: Optional[str] = None  # Icon name or URL
    value: str  # The highlighted number/metric (e.g., "5,000+")
    category: str  # e.g., "Youth", "Seniors", "Women", "Community"
    color: Optional[str] = "blue"  # Color theme for the highlight
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ImpactHighlightCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=10, max_length=500)
    icon: Optional[str] = Field(None, max_length=100)
    value: str = Field(..., min_length=1, max_length=50)
    category: str = Field(..., min_length=2, max_length=50)
    color: Optional[str] = Field("blue", max_length=20)
    order: int = 0
    is_active: bool = True

class ImpactHighlightUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, min_length=10, max_length=500)
    icon: Optional[str] = Field(None, max_length=100)
    value: Optional[str] = Field(None, min_length=1, max_length=50)
    category: Optional[str] = Field(None, min_length=2, max_length=50)
    color: Optional[str] = Field(None, max_length=20)
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Org Overview (Home: Aim, Objectives, Mission, Vision, Who We Are, Achievements, SHIELD full form)
class OrgOverview(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    aim: Optional[str] = None
    objectives: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    who_we_are: Optional[str] = None
    what_we_do: Optional[str] = None
    key_achievements: Optional[str] = None
    impact_highlights_text: Optional[str] = None
    shield_full_form: Optional[str] = None  # e.g. "Senior Health and Improvement for Elders with Life Dignity"
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

class OrgOverviewUpdate(BaseModel):
    aim: Optional[str] = None
    objectives: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    who_we_are: Optional[str] = None
    what_we_do: Optional[str] = None
    key_achievements: Optional[str] = None
    impact_highlights_text: Optional[str] = None
    shield_full_form: Optional[str] = None


# Placement Stories (beneficiaries' employment journeys)
class PlacementStory(BaseModel):
    id: str
    name: str
    story: str
    image: Optional[str] = None
    role_placed: Optional[str] = None
    company: Optional[str] = None
    program: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class PlacementStoryCreate(BaseModel):
    name: str
    story: str
    image: Optional[str] = None
    role_placed: Optional[str] = None
    company: Optional[str] = None
    program: Optional[str] = None
    order: int = 0
    is_active: bool = True

class PlacementStoryUpdate(BaseModel):
    name: Optional[str] = None
    story: Optional[str] = None
    image: Optional[str] = None
    role_placed: Optional[str] = None
    company: Optional[str] = None
    program: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Featured Video (e.g. Daniel's home-bound patient video - YouTube link)
class FeaturedVideo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    youtube_url: str = ""
    description: Optional[str] = None
    is_active: bool = True
    updated_at: Optional[datetime] = None

class FeaturedVideoUpdate(BaseModel):
    title: Optional[str] = None
    youtube_url: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


# Daily Quote (inspirational quote on humanity, multilingual)
class DailyQuote(BaseModel):
    id: str
    quote: str
    author: Optional[str] = None
    image_url: Optional[str] = None
    language: str = "en"
    quote_date: str  # YYYY-MM-DD
    is_active: bool = True
    order: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class DailyQuoteCreate(BaseModel):
    quote: str
    author: Optional[str] = None
    image_url: Optional[str] = None
    language: str = "en"
    quote_date: str
    is_active: bool = True
    order: int = 0

class DailyQuoteUpdate(BaseModel):
    quote: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    language: Optional[str] = None
    quote_date: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


# Government Schemes (MCED & MSSDS empanelment 2013 - students trained by project/course)
class GovernmentSchemeRecord(BaseModel):
    id: str
    scheme_name: str  # MCED | MSSDS
    project_category: Optional[str] = None
    course_name: Optional[str] = None
    academic_year: Optional[str] = None
    students_trained: int = 0
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class GovernmentSchemeRecordCreate(BaseModel):
    scheme_name: str
    project_category: Optional[str] = None
    course_name: Optional[str] = None
    academic_year: Optional[str] = None
    students_trained: int = 0
    order: int = 0
    is_active: bool = True

class GovernmentSchemeRecordUpdate(BaseModel):
    scheme_name: Optional[str] = None
    project_category: Optional[str] = None
    course_name: Optional[str] = None
    academic_year: Optional[str] = None
    students_trained: Optional[int] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Funds Utilisation (transparency: donations received and utilised)
class FundsUtilizationRecord(BaseModel):
    id: str
    period_label: str  # e.g. "FY 2023-24"
    amount_received: float = 0
    amount_utilised: float = 0
    utilisation_details: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class FundsUtilizationRecordCreate(BaseModel):
    period_label: str
    amount_received: float = 0
    amount_utilised: float = 0
    utilisation_details: Optional[str] = None
    order: int = 0
    is_active: bool = True

class FundsUtilizationRecordUpdate(BaseModel):
    period_label: Optional[str] = None
    amount_received: Optional[float] = None
    amount_utilised: Optional[float] = None
    utilisation_details: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Youth Course (Programs: course name, description, duration, job prospects)
class YouthCourse(BaseModel):
    id: str
    name: str
    description: str
    duration: Optional[str] = None
    job_prospects: Optional[str] = None
    eligibility: Optional[str] = None
    image: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class YouthCourseCreate(BaseModel):
    name: str
    description: str
    duration: Optional[str] = None
    job_prospects: Optional[str] = None
    eligibility: Optional[str] = None
    image: Optional[str] = None
    order: int = 0
    is_active: bool = True

class YouthCourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    job_prospects: Optional[str] = None
    eligibility: Optional[str] = None
    image: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Senior Centre (Programs: centre-wise programmes and activities)
class SeniorCentre(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    programmes: List[str] = []
    activities: List[str] = []
    address: Optional[str] = None
    image: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class SeniorCentreCreate(BaseModel):
    name: str
    description: Optional[str] = None
    programmes: List[str] = []
    activities: List[str] = []
    address: Optional[str] = None
    image: Optional[str] = None
    order: int = 0
    is_active: bool = True

class SeniorCentreUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    programmes: Optional[List[str]] = None
    activities: Optional[List[str]] = None
    address: Optional[str] = None
    image: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Course Enquiry (dropdown enquiry per course - public submit)
class CourseEnquiryCreate(BaseModel):
    course_id: str
    course_name: Optional[str] = None
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    message: Optional[str] = Field(None, max_length=1000)

class CourseEnquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: str
    course_name: Optional[str] = None
    name: str
    email: str
    phone: Optional[str] = None
    message: Optional[str] = None
    status: str = "new"
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Career Application (apply anytime for future recruitment / talent mapping)
class CareerApplicationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    current_role: Optional[str] = Field(None, max_length=150)
    experience_years: Optional[str] = Field(None, max_length=50)
    skills: Optional[str] = Field(None, max_length=1000)
    areas_of_interest: Optional[str] = Field(None, max_length=500)
    message: Optional[str] = Field(None, max_length=2000)
    resume_url: Optional[str] = Field(None, max_length=500)


# Awards, Accreditations, Testimonials (display section)
class AwardAccreditation(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    type: str = "award"  # award | accreditation | certification
    year: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class AwardAccreditationCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    type: str = "award"
    year: Optional[str] = None
    order: int = 0
    is_active: bool = True

class AwardAccreditationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    type: Optional[str] = None
    year: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Resource Links (documents, LinkedIn, Instagram, Facebook - social also in site_settings)
class ResourceLink(BaseModel):
    id: str
    title: str
    url: str
    type: str = "link"  # document | link | social
    description: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ResourceLinkCreate(BaseModel):
    title: str
    url: str
    type: str = "link"
    description: Optional[str] = None
    order: int = 0
    is_active: bool = True

class ResourceLinkUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Management Message (periodic messages from top management)
class ManagementMessage(BaseModel):
    id: str
    title: Optional[str] = None
    message: str
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    image: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ManagementMessageCreate(BaseModel):
    title: Optional[str] = None
    message: str
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    image: Optional[str] = None
    order: int = 0
    is_active: bool = True

class ManagementMessageUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    image: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# Engagement Options (volunteer, donate books/medical, monetary/QR, career form - stored as single doc)
class EngagementOptions(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    volunteering_text: Optional[str] = None
    volunteering_link: Optional[str] = None
    donate_books_medical_text: Optional[str] = None
    monetary_qr_image_url: Optional[str] = None
    monetary_payment_options: Optional[str] = None
    career_form_url: Optional[str] = None  # Google Form link
    support_options: Optional[dict] = None  # e.g. {"Support Our Cause": ["Sponsorships", "Donations", "CSR", "Placement tie-ups"]}
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

class EngagementOptionsUpdate(BaseModel):
    volunteering_text: Optional[str] = None
    volunteering_link: Optional[str] = None
    donate_books_medical_text: Optional[str] = None
    monetary_qr_image_url: Optional[str] = None
    monetary_payment_options: Optional[str] = None
    career_form_url: Optional[str] = None
    support_options: Optional[dict] = None


# Government schemes page (merged into site_content.governmentSchemes)
class GovSchemeOfficialLink(BaseModel):
    title: str
    url: str


class GovernmentSchemesPageMerge(BaseModel):
    page_intro: Optional[str] = None
    mced_intro: Optional[str] = None
    mssds_intro: Optional[str] = None
    programmes_note: Optional[str] = None
    eligibility_note: Optional[str] = None
    official_links: Optional[List[GovSchemeOfficialLink]] = None
    # Narrative blocks for state / national schemes (Mumbai & Maharashtra)
    youth_schemes_note: Optional[str] = None
    senior_schemes_note: Optional[str] = None


# Internal content contribution workflow (member submissions → review → approval)
class ContentSubmissionCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=300)
    body: str = Field(..., min_length=20, max_length=50000)
    content_type: str = Field(default="general")  # news_suggestion, blog_draft, gallery, page_edit, general
    submitter_name: str = Field(..., min_length=2, max_length=120)
    submitter_email: EmailStr
    submitter_phone: Optional[str] = Field(None, max_length=40)
    affiliation: Optional[str] = Field(None, max_length=200)


class ContentSubmissionAdminUpdate(BaseModel):
    status: Optional[str] = None
    creative_notes: Optional[str] = None
    technical_notes: Optional[str] = None
    leadership_notes: Optional[str] = None
