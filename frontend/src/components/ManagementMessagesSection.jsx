import React, { useState, useEffect } from 'react';
import { getManagementMessages } from '../api';
import { Card, CardContent } from './ui/card';
import { Quote } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

/** Shown when CMS has no active leadership messages (replace via Admin → Extra Content). */
const DEFAULT_LEADER_MESSAGES = [
  {
    id: 'default-swati-ingole',
    title: 'Our commitment',
    message:
      'Shield Foundation remains dedicated to dignified care for seniors and meaningful livelihoods for youth. We invite partners and communities to walk with us as we expand responsible, people-centred programmes.',
    author_name: 'Ms. Swati Ingole',
    author_role: 'Founder & leadership',
    image: '',
  },
  {
    id: 'default-rosita',
    title: 'Together with communities',
    message:
      'True impact grows when we listen to communities and respond with practical support—whether through training, health outreach, or everyday solidarity with families who need it most.',
    author_name: 'Ms. Rosita',
    author_role: 'Leadership',
    image: '',
  },
  {
    id: 'default-sharad-dicholkar',
    title: 'Governance and transparency',
    message:
      'We uphold strong governance, clear reporting, and accountability to donors and beneficiaries alike. Compliance documents and annual reports are shared openly through our Blog & News section.',
    author_name: 'Mr. Sharad Dicholkar',
    author_role: 'Leadership',
    image: '',
  },
];

const ManagementMessagesSection = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getManagementMessages()
      .then((d) => setMessages(d.messages || []))
      .catch(() => setMessages([]));
  }, []);

  const displayMessages = messages.length > 0 ? messages : DEFAULT_LEADER_MESSAGES;

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200" aria-labelledby="leadership-messages-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-blue-700 mb-2">
            <Quote className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">Leadership</span>
          </div>
          <h2 id="leadership-messages-heading" className="text-3xl font-bold text-gray-900">
            Message from Leaders
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm">
            Reflections from Ms. Swati Ingole, Ms. Rosita, and Mr. Sharad Dicholkar. Active messages are managed in the
            admin panel; placeholder text appears below until content is published there.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayMessages.map((m) => (
            <Card
              key={m.id}
              className="flex h-[26rem] sm:h-[27rem] flex-col border border-slate-200 shadow-sm overflow-hidden"
            >
              <CardContent className="flex flex-1 min-h-0 flex-col p-6">
                {m.image && (
                  <div className="mb-3 flex shrink-0 justify-center">
                    <img
                      src={m.image}
                      alt=""
                      className="h-16 w-16 rounded-full object-cover border-2 border-blue-100"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {m.title && <h3 className="shrink-0 text-lg font-semibold text-gray-900 mb-2">{m.title}</h3>}
                <div
                  className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain rounded-md border border-slate-100/80 bg-slate-50/50 px-3 py-2 [scrollbar-width:thin]"
                  tabIndex={0}
                  aria-label="Message preview, scroll to read more"
                >
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{m.message}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="mt-3 shrink-0 self-start">
                      Read full message
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{m.title || 'Message from leaders'}</DialogTitle>
                      <DialogDescription>
                        {m.author_name ? m.author_name : ''}{m.author_role ? ` — ${m.author_role}` : ''}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-auto pr-1">
                      <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{m.message}</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="mt-auto shrink-0 pt-3 border-t border-slate-100">
                  {m.author_name && <p className="font-medium text-gray-900 text-sm">{m.author_name}</p>}
                  {m.author_role && <p className="text-xs text-blue-700">{m.author_role}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManagementMessagesSection;
