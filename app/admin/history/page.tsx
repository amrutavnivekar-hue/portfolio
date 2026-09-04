'use client';

import { useEffect, useState } from 'react';

const ACTION_COLORS: Record<string, string> = {
  save:              'var(--secondary)',
  publish:           'var(--accent)',
  restore:           'var(--primary)',
  delete:            'var(--secondary)',
  revision_restored: 'var(--primary)',
};

export default function HistoryPage() {
  const [activity, setActivity] = useState<any[]>([]);
  const [error,    setError]    = useState('');
  const [filter,   setFilter]   = useState('');

  useEffect(() => {
    fetch('/api/admin/activity')
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Failed');
        setActivity(Array.isArray(d) ? d : []);
      })
      .catch((e: any) => setError(e.message));
  }, []);

  const filtered = activity.filter(log =>
    !filter ||
    String(log.action).toLowerCase().includes(filter.toLowerCase()) ||
    String(log.section || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>Activity Logs</h2>
          <p className="mt-1 text-xs sm:text-sm opacity-60">Track edits, publishes, restores, and section operations.</p>
        </div>
        <input value={filter} onChange={e => setFilter(e.target.value)}
          placeholder="Filter by action / section…"
          className="rounded-lg px-3 py-2 text-sm w-full sm:w-52"
          style={{ background: 'var(--background)', color: 'var(--text)',
            border: '1px solid color-mix(in srgb, var(--primary) 40%, transparent)', outline: 'none' }} />
      </div>

      {error && (
        <div className="rounded-lg p-3 text-sm text-red-400"
          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}>
          {error}
        </div>
      )}

      <div className="rounded-xl p-4" style={{ background: 'var(--surface)',
        border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)' }}>
        <div className="space-y-2">
          {filtered.map((log, i) => (
            <div key={i} className="flex flex-wrap sm:flex-nowrap items-start gap-3 rounded-lg p-3 text-sm"
              style={{ border: '1px solid color-mix(in srgb, var(--text) 12%, transparent)' }}>
              {/* Action badge */}
              <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                style={{ background: ACTION_COLORS[String(log.action)] || 'var(--primary)' }}>
                {String(log.action || 'event')}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm truncate">{String(log.section || 'global')}</p>
                <p className="text-xs opacity-50 mt-0.5">
                  {String(log.user || 'system')} · {new Date(String(log.timestamp)).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {!filtered.length && !error && (
            <p className="text-sm opacity-50 py-4 text-center">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
