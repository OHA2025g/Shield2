"""
Copy shield_foundation DB to shield_foundation2 and seed demo data for new collections.
Does NOT modify the original shield_foundation database.
"""
import os
import sys
import uuid
from datetime import datetime
from pathlib import Path

# Load .env from backend
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))
from dotenv import load_dotenv
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL')
if not MONGO_URL:
    print("ERROR: MONGO_URL not set in .env")
    sys.exit(1)

try:
    from pymongo import MongoClient
except ImportError:
    print("ERROR: pymongo required. Run: pip install pymongo")
    sys.exit(1)

SOURCE_DB = "shield_foundation"
TARGET_DB = "shield_foundation2"

def main():
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=10000)
    try:
        client.admin.command('ping')
    except Exception as e:
        print(f"ERROR: Cannot connect to MongoDB: {e}")
        sys.exit(1)

    source = client[SOURCE_DB]
    target = client[TARGET_DB]

    # 1) Copy all collections from source to target (read-only from source; target is replaced)
    existing_collections = source.list_collection_names()
    print(f"Copying {len(existing_collections)} collections from {SOURCE_DB} to {TARGET_DB}...")
    for coll_name in existing_collections:
        docs = list(source[coll_name].find({}))
        # Drop target collection so we get a clean copy (idempotent re-runs)
        target[coll_name].drop()
        if docs:
            target[coll_name].insert_many(docs)
            print(f"  Copied {coll_name}: {len(docs)} documents")
        else:
            target.create_collection(coll_name)
            print(f"  Created empty {coll_name}")

    # 2) Seed demo data for NEW collections (only if empty in target)
    now = datetime.utcnow()
    today = now.strftime("%Y-%m-%d")

    # Org Overview (single doc)
    if target.org_overview.count_documents({}) == 0:
        target.org_overview.insert_one({
            "id": str(uuid.uuid4()),
            "aim": "To add life to years by empowering youth and caring for seniors with dignity.",
            "objectives": "Provide vocational training to youth; deliver comprehensive care and support to senior citizens; foster community engagement and partnerships.",
            "mission": "Adding Life to Years through youth skilling and senior citizen care.",
            "vision": "A society where every individual lives with dignity till the end of life.",
            "who_we_are": "SHIELD Foundation is a Mumbai-based NGO focused on youth employability and senior citizen welfare since its inception.",
            "what_we_do": "We run vocational training programmes (CRS, ITES-BPO, Nursing Assistant), multi-service senior centres, health camps, and placement support.",
            "key_achievements": "1300+ youth trained, 1000+ placed; 6000+ seniors supported; 750+ cataract surgeries; MCED & MSSDS empanelment since 2013.",
            "impact_highlights_text": "Our programmes have transformed lives across Mumbai and Maharashtra.",
            "shield_full_form": "Senior Health and Improvement for Elders with Life Dignity",
            "updated_at": now,
            "updated_by": "migration_script"
        })
        print("  Seeded org_overview")

    # Placement Stories
    if target.placement_stories.count_documents({}) == 0:
        target.placement_stories.insert_many([
            {"id": str(uuid.uuid4()), "name": "Priya M.", "story": "After completing the ITES-BPO course, I was placed as a customer support executive. The training gave me confidence and skills.", "image": "", "role_placed": "Customer Support Executive", "company": "Leading BPO", "program": "Youth Skilling", "order": 0, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "name": "Rahul K.", "story": "Nursing Assistant programme changed my life. I now work at a reputed hospital with a stable income.", "image": "", "role_placed": "Nursing Assistant", "company": "Hospital", "program": "Youth Skilling", "order": 1, "is_active": True, "created_at": now, "updated_at": now},
        ])
        print("  Seeded placement_stories")

    # Featured Video (single doc)
    if target.featured_video.count_documents({}) == 0:
        target.featured_video.insert_one({
            "id": str(uuid.uuid4()),
            "title": "Home-bound patient care – Daniel's documentation",
            "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # Replace with real link when uploaded
            "description": "A glimpse of our home-bound patient support documented by Daniel.",
            "is_active": True,
            "updated_at": now
        })
        print("  Seeded featured_video")

    # Daily Quotes
    if target.daily_quotes.count_documents({}) == 0:
        target.daily_quotes.insert_many([
            {"id": str(uuid.uuid4()), "quote": "The best way to find yourself is to lose yourself in the service of others.", "author": "Mahatma Gandhi", "image_url": "", "language": "en", "quote_date": today, "order": 0, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "quote": "Adding life to years is the greatest gift we can give.", "author": "SHIELD Foundation", "image_url": "", "language": "en", "quote_date": today, "order": 1, "is_active": True, "created_at": now, "updated_at": now},
        ])
        print("  Seeded daily_quotes")

    # Government Schemes
    if target.government_schemes.count_documents({}) == 0:
        target.government_schemes.insert_many([
            {"id": str(uuid.uuid4()), "scheme_name": "MCED", "project_category": "Vocational", "course_name": "CRS", "academic_year": "2023-24", "students_trained": 120, "order": 0, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "scheme_name": "MCED", "project_category": "Vocational", "course_name": "ITES-BPO", "academic_year": "2023-24", "students_trained": 85, "order": 1, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "scheme_name": "MSSDS", "project_category": "Skilling", "course_name": "Nursing Assistant", "academic_year": "2023-24", "students_trained": 60, "order": 2, "is_active": True, "created_at": now, "updated_at": now},
        ])
        print("  Seeded government_schemes")

    # Funds Utilization
    if target.funds_utilization.count_documents({}) == 0:
        target.funds_utilization.insert_many([
            {"id": str(uuid.uuid4()), "period_label": "FY 2023-24", "amount_received": 500000, "amount_utilised": 475000, "utilisation_details": "Programme delivery, stipends, and operational costs.", "order": 0, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "period_label": "FY 2022-23", "amount_received": 420000, "amount_utilised": 410000, "utilisation_details": "Youth training and senior care activities.", "order": 1, "is_active": True, "created_at": now, "updated_at": now},
        ])
        print("  Seeded funds_utilization")

    # Youth Courses
    if target.youth_courses.count_documents({}) == 0:
        target.youth_courses.insert_many([
            {"id": str(uuid.uuid4()), "name": "Customer Relationship & Sales (CRS)", "description": "Training in customer handling, sales support, and soft skills for retail and BPO roles.", "duration": "3 months", "job_prospects": "Customer Executive, Sales Support, BPO", "eligibility": "10th pass", "image": "", "order": 0, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "name": "ITES-BPO", "description": "Voice and non-voice process training for IT-enabled services and business process outsourcing.", "duration": "3 months", "job_prospects": "Customer Support, Back-office", "eligibility": "12th pass", "image": "", "order": 1, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "name": "Nursing Assistant", "description": "Healthcare support training for hospital and care settings.", "duration": "6 months", "job_prospects": "Nursing Assistant, Caregiver", "eligibility": "10th pass", "image": "", "order": 2, "is_active": True, "created_at": now, "updated_at": now},
        ])
        print("  Seeded youth_courses")

    # Senior Centres
    if target.senior_centres.count_documents({}) == 0:
        target.senior_centres.insert_many([
            {"id": str(uuid.uuid4()), "name": "Dharavi Senior Centre", "description": "Multi-service centre for elders in Dharavi.", "programmes": ["Health check-ups", "Yoga & exercise", "Legal aid"], "activities": ["Daily yoga", "Festival celebrations", "Cataract camps"], "address": "Dharavi, Mumbai", "image": "", "order": 0, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "name": "Community Outreach Centre", "description": "Outreach and home-bound support for seniors.", "programmes": ["Mobile health", "Counseling"], "activities": ["Home visits", "Referrals"], "address": "Mumbai", "image": "", "order": 1, "is_active": True, "created_at": now, "updated_at": now},
        ])
        print("  Seeded senior_centres")

    # Awards & Accreditations
    if target.awards_accreditations.count_documents({}) == 0:
        target.awards_accreditations.insert_many([
            {"id": str(uuid.uuid4()), "title": "MCED Empanelment", "description": "Empaneled under MCED for vocational training.", "image": "", "type": "accreditation", "year": "2013", "order": 0, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "title": "MSSDS Empanelment", "description": "Empaneled under MSSDS for skilling programmes.", "image": "", "type": "accreditation", "year": "2013", "order": 1, "is_active": True, "created_at": now, "updated_at": now},
        ])
        print("  Seeded awards_accreditations")

    # Resource Links
    if target.resource_links.count_documents({}) == 0:
        target.resource_links.insert_many([
            {"id": str(uuid.uuid4()), "title": "LinkedIn", "url": "https://www.linkedin.com/company/shield-foundation", "type": "social", "description": "Follow us on LinkedIn", "order": 0, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "title": "Instagram", "url": "https://www.instagram.com/shieldfoundation", "type": "social", "description": "Follow us on Instagram", "order": 1, "is_active": True, "created_at": now, "updated_at": now},
            {"id": str(uuid.uuid4()), "title": "Facebook", "url": "https://www.facebook.com/shieldfoundation", "type": "social", "description": "Like us on Facebook", "order": 2, "is_active": True, "created_at": now, "updated_at": now},
        ])
        print("  Seeded resource_links")

    # Management Messages
    if target.management_messages.count_documents({}) == 0:
        target.management_messages.insert_one({
            "id": str(uuid.uuid4()),
            "title": "Message from leadership",
            "message": "Thank you for being part of our mission to add life to years. Together we are making a difference in the lives of youth and seniors.",
            "author_name": "SHIELD Foundation Team",
            "author_role": "Leadership",
            "image": "",
            "order": 0,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        })
        print("  Seeded management_messages")

    # Engagement Options (single doc)
    if target.engagement_options.count_documents({}) == 0:
        target.engagement_options.insert_one({
            "id": str(uuid.uuid4()),
            "volunteering_text": "Join as a volunteer for individuals or groups. We welcome your time and skills.",
            "volunteering_link": "",
            "donate_books_medical_text": "We accept donations of books and medical equipment. Contact us to arrange.",
            "monetary_qr_image_url": "",
            "monetary_payment_options": "UPI, Bank Transfer, QR code. Visit Donate page for details.",
            "career_form_url": "https://forms.google.com/example-career-form",
            "support_options": {"Support Our Cause": ["Sponsorships", "Donations", "CSR partnerships", "Placement & employment collaborations"]},
            "updated_at": now,
            "updated_by": "migration_script"
        })
        print("  Seeded engagement_options")

    # course_enquiries can stay empty (no demo needed for form submissions)

    # 3) Add more demo data for donations, impact_highlights, and gallery_items
    print("\nAdding more demo data for donations, impact_highlights, gallery_items...")

    extra_donations = [
        {"id": str(uuid.uuid4()), "name": "Rajesh Kumar", "email": "rajesh.k@example.com", "phone": "9876543210", "amount": 5000, "currency": "INR", "payment_method": "online", "message": "Happy to support youth skilling.", "anonymous": False, "recurring": False, "frequency": None, "status": "completed", "payment_reference": "TXN001", "notes": "", "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "name": "Meera Iyer", "email": "meera.i@example.com", "phone": None, "amount": 10000, "currency": "INR", "payment_method": "bank_transfer", "message": "For senior care programmes.", "anonymous": False, "recurring": True, "frequency": "monthly", "status": "completed", "payment_reference": "NEFT002", "notes": "", "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "name": "Anonymous", "email": "anon@example.com", "phone": None, "amount": 2500, "currency": "INR", "payment_method": "online", "message": None, "anonymous": True, "recurring": False, "frequency": None, "status": "completed", "payment_reference": "TXN003", "notes": "", "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "name": "Corporate CSR Ltd", "email": "csr@corporate.com", "phone": "02212345678", "amount": 100000, "currency": "INR", "payment_method": "bank_transfer", "message": "CSR initiative for youth employability.", "anonymous": False, "recurring": False, "frequency": None, "status": "completed", "payment_reference": "CSR2024", "notes": "", "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "name": "Priya Sharma", "email": "priya.s@example.com", "phone": "9123456789", "amount": 2000, "currency": "INR", "payment_method": "online", "message": "Small contribution for the cause.", "anonymous": False, "recurring": False, "frequency": None, "status": "pending", "payment_reference": None, "notes": "", "created_at": now, "updated_at": now},
    ]
    target.donations.insert_many(extra_donations)
    print(f"  Added {len(extra_donations)} demo donations")

    extra_impact_highlights = [
        {"id": str(uuid.uuid4()), "title": "Youth Trained", "description": "Young individuals equipped with vocational skills for employment.", "icon": "graduation-cap", "value": "1,300+", "category": "Youth", "color": "blue", "order": 10, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Youth Placed", "description": "Trainees successfully placed in jobs across sectors.", "icon": "briefcase", "value": "1,000+", "category": "Youth", "color": "yellow", "order": 11, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Seniors Supported", "description": "Elderly citizens receiving care and support at our centres.", "icon": "heart", "value": "6,000+", "category": "Seniors", "color": "blue", "order": 12, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Women Empowered", "description": "Women trained and supported through our programmes.", "icon": "users", "value": "200+", "category": "Women", "color": "yellow", "order": 13, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Cataract Surgeries", "description": "Free cataract surgeries for senior citizens.", "icon": "eye", "value": "750+", "category": "Community", "color": "blue", "order": 14, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Health Camps", "description": "Community health camps conducted annually.", "icon": "activity", "value": "50+", "category": "Community", "color": "yellow", "order": 15, "is_active": True, "created_at": now, "updated_at": now},
    ]
    target.impact_highlights.insert_many(extra_impact_highlights)
    print(f"  Added {len(extra_impact_highlights)} demo impact highlights")

    # Use placeholder images (Unsplash) for gallery demo
    base_img = "https://images.unsplash.com/photo-"
    extra_gallery = [
        {"id": str(uuid.uuid4()), "title": "Youth Skills Workshop", "description": "Participants at a vocational training workshop learning new skills.", "image": f"{base_img}1522071822081-5830d6c0c2a7?w=800&h=600&fit=crop", "category": "youth", "date": "2024-09-15", "type": "image", "video_url": None, "order": 0, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Senior Yoga Session", "description": "Daily yoga and wellness at our Dharavi senior centre.", "image": f"{base_img}1544367567-0f2fcb009e0b?w=800&h=600&fit=crop", "category": "seniors", "date": "2024-08-20", "type": "image", "video_url": None, "order": 1, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Placement Day", "description": "Celebrating successful job placements of our graduates.", "image": f"{base_img}1523240795612-9a1b7227348e?w=800&h=600&fit=crop", "category": "youth", "date": "2024-10-01", "type": "image", "video_url": None, "order": 2, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Health Camp", "description": "Free health check-up camp for the community.", "image": f"{base_img}1576091160399-112ba8d25d1f?w=800&h=600&fit=crop", "category": "events", "date": "2024-07-12", "type": "image", "video_url": None, "order": 3, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Festival Celebration", "description": "Elders and staff celebrating together at the centre.", "image": f"{base_img}1609220136736-443140c7d3b8?w=800&h=600&fit=crop", "category": "seniors", "date": "2024-10-20", "type": "image", "video_url": None, "order": 4, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Nursing Assistant Batch", "description": "Graduates of the Nursing Assistant training programme.", "image": f"{base_img}1559839734-2d71f997e19a?w=800&h=600&fit=crop", "category": "youth", "date": "2024-09-28", "type": "image", "video_url": None, "order": 5, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Volunteer Day", "description": "Our volunteers at a community outreach event.", "image": f"{base_img}1488521787991-ed7bbaae773c?w=800&h=600&fit=crop", "category": "community", "date": "2024-08-05", "type": "image", "video_url": None, "order": 6, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "CRS Training", "description": "Customer Relationship & Sales course in progress.", "image": f"{base_img}1524178232363-1fb2b075b655?w=800&h=600&fit=crop", "category": "youth", "date": "2024-10-10", "type": "image", "video_url": None, "order": 7, "is_active": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Featured Story – Daniel", "description": "Home-bound patient care documented by Daniel (video).", "image": f"{base_img}1559027615-cd4628902d4a?w=800&h=600&fit=crop", "category": "events", "date": "2024-11-01", "type": "video", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "order": 8, "is_active": True, "created_at": now, "updated_at": now},
    ]
    target.gallery_items.insert_many(extra_gallery)
    print(f"  Added {len(extra_gallery)} demo gallery items")

    print(f"\nDone. Database '{TARGET_DB}' is ready. Switch backend .env to DB_NAME={TARGET_DB} and restart the backend.")

if __name__ == "__main__":
    main()
