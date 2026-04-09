import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Quote } from 'lucide-react';
import { getDailyQuoteGroups } from '../api';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिन्दी' },
];

function pickQuoteText(group, lang) {
  const l = lang === 'mr' || lang === 'hi' ? lang : 'en';
  const direct = group[`quote_${l}`];
  if (direct && String(direct).trim()) return String(direct).trim();
  return (
    (group.quote_en && String(group.quote_en).trim()) ||
    (group.quote_mr && String(group.quote_mr).trim()) ||
    (group.quote_hi && String(group.quote_hi).trim()) ||
    ''
  );
}

function pickAuthorText(group, lang) {
  const l = lang === 'mr' || lang === 'hi' ? lang : 'en';
  const direct = group[`author_${l}`];
  if (direct && String(direct).trim()) return String(direct).trim();
  return (
    (group.author_en && String(group.author_en).trim()) ||
    (group.author_mr && String(group.author_mr).trim()) ||
    (group.author_hi && String(group.author_hi).trim()) ||
    ''
  );
}

const DailyQuoteSection = () => {
  const [groups, setGroups] = useState([]);
  const [rotateSeconds, setRotateSeconds] = useState(8);
  const [index, setIndex] = useState(0);
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('shield_quote_lang') || 'en';
    } catch {
      return 'en';
    }
  });
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  const loadGroups = useCallback(() => {
    setLoading(true);
    getDailyQuoteGroups()
      .then((data) => {
        const g = data?.groups || [];
        setGroups(g);
        setRotateSeconds(Number(data?.rotate_interval_seconds) > 0 ? Number(data.rotate_interval_seconds) : 8);
        setIndex(0);
      })
      .catch(() => {
        setGroups([]);
        setIndex(0);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const total = groups.length;
  const current = total > 0 ? groups[Math.min(index, total - 1)] : null;
  const quoteText = useMemo(() => (current ? pickQuoteText(current, language) : ''), [current, language]);
  const authorText = useMemo(() => (current ? pickAuthorText(current, language) : ''), [current, language]);

  useEffect(() => {
    if (total <= 1 || paused) return undefined;
    const ms = Math.max(3, rotateSeconds) * 1000;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, ms);
    return () => clearInterval(t);
  }, [total, rotateSeconds, paused]);

  const selectLang = (code) => {
    setLanguage(code);
    try {
      localStorage.setItem('shield_quote_lang', code);
    } catch {
      /* ignore */
    }
  };

  const goTo = (i) => setIndex(((i % total) + total) % total);

  if (!loading && (!total || !quoteText)) return null;

  return (
    <section
      className="relative w-full py-8 overflow-hidden"
      aria-label="Quote of the day"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
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
            <span className="text-xs font-semibold uppercase tracking-wider text-yellow-200/90">Quotes</span>
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
          <p className="text-white/80 text-sm animate-pulse">Loading quotes…</p>
        ) : (
          <>
            <div key={`${current?.id}-${language}-${index}`} className="animate-in fade-in-0 duration-500">
              <div className="mx-auto w-full max-w-3xl min-h-[6.5rem] max-h-[12rem] sm:max-h-[14rem] overflow-y-auto overscroll-y-contain rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center [scrollbar-width:thin] shadow-sm">
                <blockquote className="text-base sm:text-lg md:text-xl font-medium italic leading-snug text-white drop-shadow">
                  &ldquo;{quoteText}&rdquo;
                </blockquote>
                {authorText && (
                  <p className="mt-2 text-sm text-blue-100">
                    — {authorText}
                  </p>
                )}
              </div>
              {current?.image_url && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={current.image_url}
                    alt=""
                    className="max-h-28 rounded-lg object-cover ring-2 ring-white/20"
                  />
                </div>
              )}
            </div>

            {total > 1 && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-[11px] text-white/70">
                  {index + 1} / {total} · rotates every {rotateSeconds}s {paused ? '(paused)' : ''}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5" role="tablist" aria-label="Quote slides">
                  {groups.map((g, i) => (
                    <button
                      key={g.id || i}
                      type="button"
                      aria-label={`Show quote ${i + 1}`}
                      aria-current={i === index ? 'true' : undefined}
                      className={cn(
                        'h-2.5 w-2.5 rounded-full transition-colors',
                        i === index ? 'bg-yellow-300' : 'bg-white/35 hover:bg-white/55'
                      )}
                      onClick={() => goTo(i)}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-white/90 hover:bg-white/10 h-8"
                    onClick={() => goTo(index - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-white/90 hover:bg-white/10 h-8"
                    onClick={() => goTo(index + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DailyQuoteSection;
