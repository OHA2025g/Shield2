import React, { useState, useEffect } from 'react';
import { getOrgOverview } from '../api';
import { Target, Eye, Heart, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const OrgOverviewSection = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    getOrgOverview()
      .then(setData)
      .catch(() => setData({}));
  }, []);

  const hasContent =
    data.aim ||
    data.objectives ||
    data.mission ||
    data.vision ||
    data.who_we_are ||
    data.what_we_do ||
    data.key_achievements ||
    data.impact_highlights_text ||
    data.shield_full_form;

  if (!hasContent) return null;

  const blocks = [
    data.who_we_are && { title: 'Who We Are', content: data.who_we_are, icon: Heart },
    data.what_we_do && { title: 'What We Do', content: data.what_we_do, icon: null },
    data.aim && { title: 'Aim', content: data.aim, icon: Target },
    data.objectives && { title: 'Objectives', content: data.objectives, icon: null },
    data.mission && { title: 'Mission', content: data.mission, icon: null },
    data.vision && { title: 'Vision', content: data.vision, icon: Eye },
    data.key_achievements && { title: 'Key Achievements', content: data.key_achievements, icon: Award },
    data.impact_highlights_text && { title: 'Impact Highlights', content: data.impact_highlights_text, icon: null },
  ].filter(Boolean);

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">About SHIELD Foundation</h2>
          {data.shield_full_form && (
            <p className="text-blue-600 font-medium italic">{data.shield_full_form}</p>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {blocks.map(({ title, content, icon: Icon }) => (
            <Card key={title} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-[88px] flex flex-col overflow-hidden">
              <CardContent className="p-2.5 flex flex-col flex-1 min-h-0 overflow-hidden">
                <h3 className="text-xs font-semibold text-gray-900 mb-0.5 flex items-center flex-shrink-0">
                  {Icon && <Icon className="h-3 w-3 mr-1 text-blue-600 flex-shrink-0" />}
                  {title}
                </h3>
                <p className="text-[11px] text-gray-700 whitespace-pre-line leading-snug line-clamp-3 overflow-hidden">{content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrgOverviewSection;
