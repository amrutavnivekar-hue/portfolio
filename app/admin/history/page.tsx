'use client';

import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [activity, setActivity] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/activity')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load activity');
        setActivity(Array.isArray(data) ? data : []);
      })
      .catch((err: any) => setError(err.message || 'Failed to load activity'));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Activity Logs</h2>
        <p className="mt-1 text-sm opacity-60">Track edits, publishes, restores, and section operations.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div
        className="rounded-xl border border-white/10 p-4"
        style={{ background: 'var(--surface)' }}
      >
        <div className="space-y-2">
          {activity.map((log, idx) => (
            <div key={idx} className="rounded-lg p-3 text-sm" style={{ border: '1px solid color-mix(in srgb, var(--text) 15%, transparent)' }}>
              <p style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--primary)' }} className="font-medium">
                  {String(log.action || 'event')}
                </span>
                {' '}— {String(log.section || 'global')}
              </p>
              <p className="mt-0.5 text-xs opacity-50">
                {String(log.user || 'system')} · {new Date(String(log.timestamp)).toLocaleString()}
              </p>
            </div>
          ))}
          {!activity.length && !error && (
            <p className="text-sm opacity-50">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
