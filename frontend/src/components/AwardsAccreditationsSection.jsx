import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { getAwardsAccreditations } from '../api';
import { Award } from 'lucide-react';

const AwardsAccreditationsSection = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAwardsAccreditations()
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Awards & Accreditations</h2>
          <p className="text-sm text-gray-600">Recognition and official empanelments</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                {item.image && (
                  <div className="mb-4 rounded overflow-hidden h-32 bg-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex items-center text-yellow-600 mb-2">
                  <Award className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium capitalize">{item.type || 'award'}</span>
                  {item.year && <span className="text-gray-400 text-sm ml-2">({item.year})</span>}
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsAccreditationsSection;
