#!/usr/bin/env python3
"""
One-off import of org overview, gallery case studies, leadership messages, awards,
and government schemes page text into MongoDB.

Usage (PowerShell):
  $env:MONGO_URL = "mongodb://USER:PASS@HOST:PORT/?tls=false"
  $env:DB_NAME = "shield_foundation2"
  python scripts/import_shield_content.py

Do not commit credentials. Requires: pip install pymongo (or run from backend venv).
"""
from __future__ import annotations

import os
import sys
import uuid
from datetime import datetime, timezone

_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, _SCRIPTS_DIR)

import shield_import_payload as P  # noqa: E402


def main() -> None:
    mongo_url = os.environ.get("MONGO_URL")
    db_name = os.environ.get("DB_NAME", "shield_foundation2")
    if not mongo_url:
        print("Set MONGO_URL (and optionally DB_NAME).", file=sys.stderr)
        sys.exit(1)

    try:
        from pymongo import MongoClient
    except ImportError:
        print("Install pymongo: pip install pymongo", file=sys.stderr)
        sys.exit(1)

    client = MongoClient(mongo_url, serverSelectionTimeoutMS=15000)
    client.admin.command("ping")
    db = client[db_name]
    now = datetime.now(timezone.utc)

    # --- org_overview (single document) ---
    db.org_overview.delete_many({})
    db.org_overview.insert_one(
        {
            "vision": P.VISION,
            "mission": P.MISSION,
            "shield_full_form": P.SHIELD_FULL_FORM,
            "updated_at": now,
            "updated_by": "import_shield_content.py",
        }
    )
    print("org_overview: replaced with vision, mission, SHIELD full form.")

    # --- management_messages ---
    db.management_messages.delete_many({})
    messages = [
        {
            "id": str(uuid.uuid4()),
            "title": "Message from Rosita Mascarenhas",
            "message": P.MSG_ROSITA,
            "author_name": "Rosita Mascarenhas",
            "author_role": "Leadership",
            "image": "",
            "order": 0,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Association with Shield Foundation",
            "message": P.MSG_SHARAD,
            "author_name": "Sharad Dicholkar",
            "author_role": "Retired Assistant General Manager, Reserve Bank of India, Mumbai",
            "image": "",
            "order": 1,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Founder's Message",
            "message": P.MSG_SWATI,
            "author_name": "Mrs. Swati Ingole",
            "author_role": "Founder, Shield Foundation",
            "image": "",
            "order": 2,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
    ]
    db.management_messages.insert_many(messages)
    print(f"management_messages: inserted {len(messages)}.")

    # --- awards_accreditations ---
    db.awards_accreditations.delete_many({})
    award_docs = []
    for i, a in enumerate(P.AWARDS):
        award_docs.append(
            {
                "id": str(uuid.uuid4()),
                "title": a["title"],
                "description": a.get("description") or "",
                "image": "",
                "type": a.get("type", "award"),
                "year": a.get("year") or "",
                "order": i,
                "is_active": True,
                "created_at": now,
                "updated_at": now,
            }
        )
    if award_docs:
        db.awards_accreditations.insert_many(award_docs)
    print(f"awards_accreditations: replaced with {len(award_docs)} items.")

    # --- gallery_items (case studies only — remove prior import ids if re-run) ---
    import_ids = [
        "import-case-laxmi-physio",
        "import-case-torane-home",
        "import-case-abdul-matunga",
    ]
    db.gallery_items.delete_many({"id": {"$in": import_ids}})
    gallery_docs = [
        {
            "id": import_ids[0],
            "title": "Case Study: Physiotherapy — Mrs. Laxmi",
            "description": P.CASE_LAXMI,
            "image": P.IMG_PHYSIO,
            "category": "case_study",
            "date": now.strftime("%Y-%m-%d"),
            "type": "image",
            "video_url": None,
            "badge_image": None,
            "order": 0,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "id": import_ids[1],
            "title": "Case Study: Home-Based Care — Mr. Shrirang Torane (82)",
            "description": P.CASE_TORANE,
            "image": P.IMG_HOME_CARE,
            "category": "case_study",
            "date": now.strftime("%Y-%m-%d"),
            "type": "image",
            "video_url": None,
            "badge_image": None,
            "order": 1,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
        {
            "id": import_ids[2],
            "title": "Case Study: Mr. Abdul Satar — Matunga Labour Camp",
            "description": P.CASE_ABDUL,
            "image": P.IMG_COMMUNITY,
            "category": "case_study",
            "date": now.strftime("%Y-%m-%d"),
            "type": "image",
            "video_url": None,
            "badge_image": None,
            "order": 2,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        },
    ]
    db.gallery_items.insert_many(gallery_docs)
    print(f"gallery_items: inserted {len(gallery_docs)} case studies (category case_study).")

    # --- site_content.governmentSchemes merge ---
    cur = db.site_content.find_one(sort=[("updated_at", -1)])
    content = dict((cur or {}).get("content") or {})
    gs = dict(content.get("governmentSchemes") or {})
    gs.update(
        {
            "page_intro": P.PAGE_INTRO_GOV,
            "youth_schemes_note": P.YOUTH_SCHEMES_NOTE,
            "senior_schemes_note": P.SENIOR_SCHEMES_NOTE,
            "official_links": P.OFFICIAL_LINKS,
        }
    )
    content["governmentSchemes"] = gs
    payload = {"content": content, "updated_at": now, "updated_by": "import_shield_content.py"}
    if cur and cur.get("_id"):
        db.site_content.update_one({"_id": cur["_id"]}, {"$set": payload})
    else:
        db.site_content.insert_one(payload)
    print("site_content: merged governmentSchemes (intro, youth/senior notes, official links).")

    print("Done.")
    client.close()


if __name__ == "__main__":
    main()
