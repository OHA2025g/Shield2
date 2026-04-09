import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Heart, Book, DollarSign, Briefcase, ChevronDown } from 'lucide-react';
import { getEngagementOptions } from '../api';

const EngagementSection = () => {
  const [options, setOptions] = useState({});
  const [supportOpen, setSupportOpen] = useState(false);
  const supportCloseTimeoutRef = React.useRef(null);

  useEffect(() => {
    getEngagementOptions()
      .then(setOptions)
      .catch(() => setOptions({}));
  }, []);

  const supportOptions = options.support_options || {
    'Support Our Cause': ['Sponsorships', 'Donations', 'CSR partnerships', 'Placement & employment collaborations'],
  };
  const supportEntries = typeof supportOptions === 'object' && !Array.isArray(supportOptions)
    ? Object.entries(supportOptions)
    : [['Support Our Cause', ['Sponsorships', 'Donations', 'CSR', 'Placement tie-ups']]];

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Involved</h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-4">
            Support our cause, partner with us, or contribute in ways that matter.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/apply">Enroll / Apply – Fill a form for any program</Link>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div
            className="relative"
            onMouseEnter={() => {
              if (supportCloseTimeoutRef.current) clearTimeout(supportCloseTimeoutRef.current);
              setSupportOpen(true);
            }}
            onMouseLeave={() => {
              supportCloseTimeoutRef.current = setTimeout(() => setSupportOpen(false), 180);
            }}
          >
            <Button
              variant="outline"
              size="lg"
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-yellow-50"
              asChild
            >
              <Link to="/donate">Support Our Cause <ChevronDown className="ml-2 h-4 w-4 inline" /></Link>
            </Button>
            {supportOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 min-w-[200px]">
                <div className="py-2 px-2 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                  <Link to="/apply#contact" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => setSupportOpen(false)}>Sponsorships (fill form)</Link>
                  <Link to="/donate" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => setSupportOpen(false)}>Donations (fill form)</Link>
                  <Link to="/apply#contact" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => setSupportOpen(false)}>CSR partnerships (fill form)</Link>
                  <Link to="/apply#career" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => setSupportOpen(false)}>Placement tie-ups (fill form)</Link>
                  <Link to="/apply" className="block mt-2 pt-2 border-t border-gray-100 px-3 text-blue-600 text-sm font-medium hover:underline" onClick={() => setSupportOpen(false)}>
                    All application forms →
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Button asChild variant="outline" size="lg" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50">
            <Link to="/contact">Partner With Us</Link>
          </Button>
          <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black">
            <Link to="/donate">Contribute</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          <div className="flex flex-col p-4 rounded-lg bg-white border border-gray-200 shadow-sm min-h-[220px]">
            <Heart className="h-8 w-8 text-blue-600 mb-2 shrink-0" />
            <h3 className="font-semibold text-gray-900 mb-1">Volunteer</h3>
            <p className="text-sm text-gray-600 mb-3 flex-1 min-h-0">{options.volunteering_text || 'Join us as a volunteer for individuals or groups.'}</p>
            <div className="mt-auto pt-2">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-auto">
                <Link to="/apply#volunteer">Fill volunteer form →</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col p-4 rounded-lg bg-white border border-gray-200 shadow-sm min-h-[220px]">
            <Book className="h-8 w-8 text-blue-600 mb-2 shrink-0" />
            <h3 className="font-semibold text-gray-900 mb-1">Donate books or medical instruments</h3>
            <p className="text-sm text-gray-600 mb-3 flex-1 min-h-0">{options.donate_books_medical_text || 'We accept donations of books and medical equipment.'}</p>
            <div className="mt-auto pt-2">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-auto">
                <Link to="/apply#contact">Submit interest form →</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col p-4 rounded-lg bg-white border border-gray-200 shadow-sm min-h-[220px]">
            <DollarSign className="h-8 w-8 text-blue-600 mb-2 shrink-0" />
            <h3 className="font-semibold text-gray-900 mb-1">Monetary support</h3>
            <p className="text-sm text-gray-600 mb-2 flex-1 min-h-0">{options.monetary_payment_options || 'QR code and digital payment options available.'}</p>
            <div className="mt-auto pt-2 flex flex-col gap-2">
              <img
                src={options.monetary_qr_image_url || 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=Donate%20to%20SHIELD%20Foundation%20-%20https%3A%2F%2Fshieldfoundation.org%2Fdonate'}
                alt="Donation QR"
                className="h-20 w-20 object-contain border border-gray-200 rounded self-start"
              />
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-auto">
                <Link to="/donate">Donate (fill form) →</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col p-4 rounded-lg bg-white border border-gray-200 shadow-sm min-h-[220px]">
            <Briefcase className="h-8 w-8 text-blue-600 mb-2 shrink-0" />
            <h3 className="font-semibold text-gray-900 mb-1">Career opportunities</h3>
            <p className="text-sm text-gray-600 mb-3 flex-1 min-h-0">Apply anytime via our form; we use it for future recruitment and talent mapping.</p>
            <div className="mt-auto pt-2">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-auto">
                <Link to="/apply#career">Fill career application form →</Link>
              </Button>
              {options.career_form_url && (
                <a href={options.career_form_url} target="_blank" rel="noopener noreferrer" className="block mt-1 text-gray-500 text-xs hover:underline">
                  Or use external form
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementSection;
