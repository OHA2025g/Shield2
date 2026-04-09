import React, { useState, useEffect, useCallback } from 'react';
import { Quote } from 'lucide-react';
import { getDailyQuote } from '../api';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिन्दी' },
];

const DailyQuoteSection = () => {
  const [quote, setQuote] = useState(null);
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('shield_quote_lang') || 'en';
    } catch {
      return 'en';
    }
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback((lang) => {
    setLoading(true);
    getDailyQuote(lang)
      .then(setQuote)
      .catch(() => setQuote(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(language);
  }, [language, load]);

  const selectLang = (code) => {
    setLanguage(code);
    try {
      localStorage.setItem('shield_quote_lang', code);
    } catch {
      /* ignore */
    }
  };

  if (!loading && (!quote || !quote.quote)) return null;

  return (
    <section className="relative w-full py-8 overflow-hidden" aria-label="Quote of the day">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-indigo-700/95 to-blue-800/95" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(254,240,138,0.1) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <div className="flex items-center justify-center gap-2">
            <Quote className="h-6 w-6 text-yellow-300" />
            <span className="text-xs font-semibold uppercase tracking-wider text-yellow-200/90">Quote of the day</span>
          </div>
          <div className="flex flex-wrap justify-center gap-1" role="group" aria-label="Quote language">
            {LANGUAGES.map(({ code, label }) => (
              <Button
                key={code}
                type="button"
                size="sm"
                variant={language === code ? 'secondary' : 'ghost'}
                className={cn(
                  'h-8 text-xs',
                  language === code ? 'bg-white/90 text-blue-900 hover:bg-white' : 'text-white/90 hover:bg-white/10'
                )}
                onClick={() => selectLang(code)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        {loading ? (
          <p className="text-white/80 text-sm animate-pulse">Loading quote…</p>
        ) : (
          <>
            <blockquote className="text-lg md:text-xl lg:text-2xl font-medium italic leading-snug text-white drop-shadow mb-2">
              &ldquo;{quote.quote}&rdquo;
            </blockquote>
            {quote.author && <p className="text-sm text-blue-100">— {quote.author}</p>}
            {quote.image_url && (
              <div className="mt-4 flex justify-center">
                <img
                  src={quote.image_url}
                  alt=""
                  className="max-h-28 rounded-lg object-cover ring-2 ring-white/20"
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DailyQuoteSection;
