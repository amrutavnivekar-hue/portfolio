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
        setActivity(data);
      })
      .catch((err: any) => setError(err.message || 'Failed to load activity'));
  }, []);

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
      <h2 className="text-2xl font-semibold">Activity Logs</h2>
      <p className="mt-1 text-sm text-slate-400">Track edits, publishes, restores, and section operations.</p>
      {error ? <p className="mt-4 rounded bg-red-600/20 p-2 text-sm text-red-300">{error}</p> : null}
      <div className="mt-4 space-y-2">
        {activity.map((log, idx) => (
          <div key={idx} className="rounded border border-white/10 p-3 text-sm">
            <p className="text-slate-200">{String(log.action || 'event')} - {String(log.section || 'global')}</p>
            <p className="text-xs text-slate-400">
              {String(log.user || 'system')} at {new Date(String(log.timestamp)).toLocaleString()}
            </p>
          </div>
        ))}
        {!activity.length && !error ? <p className="text-sm text-slate-400">No activity yet.</p> : null}
      </div>
    </div>
  );
}
