import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getGovernmentSchemes, getPublicSiteContent } from '../api';
import Header from './Header';
import Footer from './Footer';
import { GraduationCap, BookOpen, ExternalLink } from 'lucide-react';

const DEFAULT_PAGE_INTRO =
  'This section highlights government schemes and institutional partnerships relevant to Shield Foundation’s work in youth skilling and senior care. Information is updated periodically so visitors can see current programmes and training data.';

const DEFAULT_MCED_INTRO =
  'The Maharashtra Centre for Entrepreneurship Development (MCED), Mumbai, is an institution established by the Government of Maharashtra to promote entrepreneurship and skill development across the state. MCED conducts training programmes for aspiring entrepreneurs, women, youth, and small business owners—supporting business skills, employability, and sustainable enterprises. Eligibility and programme schedules vary by course; please refer to official resources for the latest details.';

const DEFAULT_MSSDS_INTRO =
  'MSSDS-related training and empanelment data below reflects Shield Foundation’s engagement under government skill initiatives. For authoritative programme descriptions and eligibility, use the official links provided.';

const DEFAULT_PROGRAMMES =
  'Typical programme areas include vocational training, entrepreneurship development, and sector-specific skilling (e.g. IT-enabled services, healthcare support roles). Exact offerings change by academic year and government notification.';

const DEFAULT_ELIGIBILITY =
  'Eligibility usually depends on age, education level, and residency as defined by each scheme or training partner. Candidates should verify requirements on the official portal or through MCED / district skill centres before applying.';

const DEFAULT_OFFICIAL_LINKS = [
  { title: 'Government of Maharashtra', url: 'https://www.maharashtra.gov.in/' },
  { title: 'Maharashtra Skill, Employment & Entrepreneurship (MAHADES)', url: 'https://mahades.maharashtra.gov.in/' },
  { title: 'National Skill Development Corporation (India)', url: 'https://www.nsdcindia.org/' },
];

function ProseBlock({ text, className = '' }) {
  if (!text || !String(text).trim()) return null;
  return (
    <div className={`text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base ${className}`}>
      {text.trim()}
    </div>
  );
}

const GovernmentSchemes = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([getGovernmentSchemes(), getPublicSiteContent()])
      .then(([gov, site]) => {
        if (cancelled) return;
        setRecords(gov.records || []);
        setPage(site?.content?.governmentSchemes || {});
      })
      .catch(() => {
        if (!cancelled) {
          setRecords([]);
          setPage({});
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const mced = records.filter((r) => (r.scheme_name || '').toUpperCase() === 'MCED');
  const mssds = records.filter((r) => (r.scheme_name || '').toUpperCase() === 'MSSDS');

  const pageIntro = page.page_intro?.trim() || DEFAULT_PAGE_INTRO;
  const mcedIntro = page.mced_intro?.trim() || DEFAULT_MCED_INTRO;
  const mssdsIntro = page.mssds_intro?.trim() || DEFAULT_MSSDS_INTRO;
  const programmesNote = page.programmes_note?.trim() || DEFAULT_PROGRAMMES;
  const eligibilityNote = page.eligibility_note?.trim() || DEFAULT_ELIGIBILITY;
  const officialLinks =
    Array.isArray(page.official_links) && page.official_links.length > 0
      ? page.official_links.filter((l) => l && l.title && l.url)
      : DEFAULT_OFFICIAL_LINKS;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="bg-gradient-to-br from-blue-50 to-yellow-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Government Schemes</h1>
          <ProseBlock text={pageIntro} className="max-w-3xl mx-auto text-gray-700 text-lg" />
        </div>
      </section>

      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Programmes & eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Types of programmes</h3>
                <ProseBlock text={programmesNote} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Eligibility</h3>
                <ProseBlock text={eligibilityNote} />
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Official resources</h2>
            <ul className="space-y-2">
              {officialLinks.map((link, i) => (
                <li key={`${link.url}-${i}`}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-medium"
                  >
                    {link.title}
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              Links open official third-party sites. Shield Foundation is not responsible for external content.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading scheme data…</p>
            </div>
          ) : (
            <div className="space-y-10">
              <Card>
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-6 w-6 mr-2" />
                    Maharashtra Centre for Entrepreneurship Development (MCED)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <ProseBlock text={mcedIntro} />
                  {mced.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 pr-4 font-semibold">Project / Category</th>
                            <th className="py-2 pr-4 font-semibold">Course</th>
                            <th className="py-2 pr-4 font-semibold">Academic Year</th>
                            <th className="py-2 font-semibold">Students Trained</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mced.map((r) => (
                            <tr key={r.id} className="border-b border-gray-100">
                              <td className="py-3 pr-4">{r.project_category || '—'}</td>
                              <td className="py-3 pr-4">{r.course_name || '—'}</td>
                              <td className="py-3 pr-4">{r.academic_year || '—'}</td>
                              <td className="py-3">{r.students_trained ?? '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Detailed training rows for MCED will appear here once published by the organisation.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-yellow-50">
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-6 w-6 mr-2" />
                    MSSDS
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <ProseBlock text={mssdsIntro} />
                  {mssds.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 pr-4 font-semibold">Project / Category</th>
                            <th className="py-2 pr-4 font-semibold">Course</th>
                            <th className="py-2 pr-4 font-semibold">Academic Year</th>
                            <th className="py-2 font-semibold">Students Trained</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mssds.map((r) => (
                            <tr key={r.id} className="border-b border-gray-100">
                              <td className="py-3 pr-4">{r.project_category || '—'}</td>
                              <td className="py-3 pr-4">{r.course_name || '—'}</td>
                              <td className="py-3 pr-4">{r.academic_year || '—'}</td>
                              <td className="py-3">{r.students_trained ?? '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Detailed training rows for MSSDS will appear here once published by the organisation.</p>
                  )}
                </CardContent>
              </Card>

              {!loading && records.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                  No tabular training data is published yet. Narrative information and official links above are still available.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default GovernmentSchemes;
