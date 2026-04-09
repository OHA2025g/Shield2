import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { api } from '../../api';
import { useToast } from '../../hooks/use-toast';
import { Trash2 } from 'lucide-react';

const STATUSES = [
  'submitted',
  'creative_review',
  'technical_review',
  'pending_leadership',
  'approved',
  'rejected',
  'published',
];

const STATUS_LABEL = {
  submitted: 'Submitted',
  creative_review: 'Creative review',
  technical_review: 'Technical review',
  pending_leadership: 'Pending leadership',
  approved: 'Approved',
  rejected: 'Rejected',
  published: 'Published',
};

const ContentWorkflowAdmin = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    const q = filter === 'all' ? null : filter;
    api.admin
      .listContentSubmissions(q)
      .then((d) => setSubmissions(d.submissions || []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const saveRow = async (id, snapshot) => {
    try {
      await api.admin.updateContentSubmission(id, {
        status: snapshot.status,
        creative_notes: snapshot.creative_notes,
        technical_notes: snapshot.technical_notes,
        leadership_notes: snapshot.leadership_notes,
      });
      toast({ title: 'Saved' });
      setEditing((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
      load();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const quickAdvance = async (id, next) => {
    try {
      await api.admin.updateContentSubmission(id, { status: next });
      toast({ title: 'Status updated' });
      load();
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this submission permanently?')) return;
    try {
      await api.admin.deleteContentSubmission(id);
      toast({ title: 'Deleted' });
      load();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content contribution workflow</h2>
        <p className="text-sm text-gray-600 mt-1">
          Track member submissions through creative review, technical validation, and leadership approval.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600">Filter:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s] || s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm" onClick={load}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No submissions in this view. Members use the public &quot;Contribute website content&quot; page.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {submissions.map((s) => {
            const cur = editing[s.id];
            const e = {
              status: cur?.status ?? s.status ?? 'submitted',
              creative_notes: cur?.creative_notes ?? s.creative_notes ?? '',
              technical_notes: cur?.technical_notes ?? s.technical_notes ?? '',
              leadership_notes: cur?.leadership_notes ?? s.leadership_notes ?? '',
            };
            const patch = (partial) =>
              setEditing((prev) => {
                const p = prev[s.id] || {};
                const base = {
                  status: p.status ?? s.status ?? 'submitted',
                  creative_notes: p.creative_notes ?? s.creative_notes ?? '',
                  technical_notes: p.technical_notes ?? s.technical_notes ?? '',
                  leadership_notes: p.leadership_notes ?? s.leadership_notes ?? '',
                };
                return { ...prev, [s.id]: { ...base, ...partial } };
              });
            return (
              <Card key={s.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{s.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {s.submitter_name} · {s.submitter_email}
                        {s.affiliation ? ` · ${s.affiliation}` : ''}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{s.content_type || 'general'}</Badge>
                        <Badge>{STATUS_LABEL[s.status] || s.status}</Badge>
                        <span className="text-xs text-gray-500">
                          {s.created_at ? new Date(s.created_at).toLocaleString() : ''}
                        </span>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(s.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {s.body}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => quickAdvance(s.id, 'creative_review')} disabled={s.status === 'creative_review'}>
                      → Creative review
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => quickAdvance(s.id, 'technical_review')} disabled={s.status === 'technical_review'}>
                      → Technical review
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => quickAdvance(s.id, 'pending_leadership')} disabled={s.status === 'pending_leadership'}>
                      → Leadership
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => quickAdvance(s.id, 'approved')}>
                      Approve
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => quickAdvance(s.id, 'rejected')} className="text-red-700 border-red-200">
                      Reject
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={e.status}
                        onValueChange={(v) => patch({ status: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((st) => (
                            <SelectItem key={st} value={st}>
                              {STATUS_LABEL[st]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Creative review notes</Label>
                    <Textarea
                      rows={2}
                      value={e.creative_notes}
                      onChange={(ev) => patch({ creative_notes: ev.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Technical review notes</Label>
                    <Textarea
                      rows={2}
                      value={e.technical_notes}
                      onChange={(ev) => patch({ technical_notes: ev.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Leadership notes</Label>
                    <Textarea
                      rows={2}
                      value={e.leadership_notes}
                      onChange={(ev) => patch({ leadership_notes: ev.target.value })}
                    />
                  </div>
                  <Button type="button" onClick={() => saveRow(s.id, e)}>
                    Save notes & status
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentWorkflowAdmin;
