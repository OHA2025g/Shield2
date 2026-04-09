import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getFundsUtilization } from '../api';
import { DollarSign } from 'lucide-react';

const FundsTransparencySection = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getFundsUtilization()
      .then((d) => setRecords(d.records || []))
      .catch(() => setRecords([]));
  }, []);

  if (records.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Transparency in Funds Utilisation</h2>
          <p className="text-gray-600">Donations received and their utilisation for accountability and trust.</p>
        </div>
        <div className="space-y-4">
          {records.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  {r.period_label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-700">
                  <strong>Received:</strong> ₹{Number(r.amount_received).toLocaleString('en-IN')} &nbsp;|&nbsp;
                  <strong>Utilised:</strong> ₹{Number(r.amount_utilised).toLocaleString('en-IN')}
                </p>
                {r.utilisation_details && <p className="text-sm text-gray-600">{r.utilisation_details}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FundsTransparencySection;
