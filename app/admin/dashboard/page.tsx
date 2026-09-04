'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const cb: React.CSSProperties = { border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)' };
const ib: React.CSSProperties = { border: '1px solid color-mix(in srgb, var(--text) 12%, transparent)' };

export default function AdminDashboard() {
  const [metrics,  setMetrics]  = useState<any>(null);
  const [visitors, setVisitors] = useState<any>(null);
  const [error,    setError]    = useState('');

  useEffect(() => {
    fetch('/api/admin/dashboard/metrics')
      .then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error); setMetrics(d); })
      .catch(e => setError(e.message));
    fetch('/api/admin/visitor-logs')
      .then(async r => { const d = await r.json(); if (r.ok) setVisitors(d); })
      .catch(() => {});
  }, []);

  const cards = metrics ? [
    { label: 'Total Sections', value: metrics.totalSections  ?? 0, sub: 'CMS sections',      icon: '📄' },
    { label: 'Published',      value: metrics.publishedSections ?? 0, sub: 'Live on site',    icon: '✅' },
    { label: 'Drafts',         value: metrics.draftSections   ?? 0, sub: 'Pending publish',   icon: '✏️' },
    { label: 'Revisions',      value: metrics.totalRevisions  ?? 0, sub: 'Total edits saved', icon: '🕓' },
    { label: 'Messages',       value: metrics.totalMessages   ?? 0,
      sub: `${metrics.unreadMessages ?? 0} unread`, icon: '✉️',
      href: '/admin/contact-forms', highlight: (metrics.unreadMessages ?? 0) > 0 },
    { label: 'Visitors (7d)', value: metrics.visitorsThisWeek ?? 0, sub: 'Page views', icon: '👁️' },
  ] : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h2>
        <p className="mt-1 text-sm opacity-60">Overview of your portfolio CMS</p>
      </div>

      {error && (
        <div className="rounded-lg p-3 text-sm text-red-400"
          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}>
          {error}
        </div>
      )}
      {!metrics && !error && <p className="text-sm opacity-40">Loading metrics…</p>}

      {/* Stat cards — 2 cols mobile, 3 desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {cards.map(card => (
          <div key={card.label} className="rounded-xl p-4 sm:p-5 relative"
            style={{ background: 'var(--surface)', ...cb,
              ...(card.highlight ? { borderColor: 'var(--primary)' } : {}) }}>
            {card.highlight && (
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full animate-pulse"
                style={{ background: 'var(--primary)' }} />
            )}
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium opacity-60 uppercase tracking-wider truncate">{card.label}</p>
                <p className="mt-1 text-2xl sm:text-3xl font-bold" style={{ color: 'var(--primary)' }}>{card.value}</p>
                <p className="mt-0.5 text-xs opacity-50 truncate">{card.sub}</p>
              </div>
              <span className="text-xl sm:text-2xl ml-2 shrink-0">{card.icon}</span>
            </div>
            {card.href && (
              <Link href={card.href} className="mt-2 inline-block text-xs font-medium underline"
                style={{ color: 'var(--primary)' }}>View →</Link>
            )}
          </div>
        ))}
      </div>

      {/* Two panels — stack on mobile, side by side on lg */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--surface)', ...cb }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm sm:text-base">Recent CMS Activity</h3>
            <Link href="/admin/history" className="text-xs underline opacity-60"
              style={{ color: 'var(--primary)' }}>View all</Link>
          </div>
          <div className="space-y-2">
            {metrics?.recentActivity?.length > 0
              ? metrics.recentActivity.slice(0, 6).map((log: any, i: number) => (
                <div key={i} className="rounded-lg p-2.5 text-sm" style={ib}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-xs sm:text-sm truncate"
                      style={{ color: 'var(--primary)' }}>{String(log.action || 'event')}</span>
                    <span className="text-xs opacity-40 shrink-0">{new Date(String(log.timestamp)).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs opacity-60 mt-0.5 truncate">
                    {String(log.section || 'global')} · {String(log.user || 'system')}
                  </p>
                </div>
              ))
              : <p className="text-sm opacity-40">No activity yet.</p>}
          </div>
        </div>

        {/* Top Pages */}
        <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--surface)', ...cb }}>
          <h3 className="font-semibold text-sm sm:text-base mb-4">Top Pages (7 days)</h3>
          {visitors?.topPages?.length > 0 ? (
            <div className="space-y-2.5">
              {visitors.topPages.map((page: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs opacity-40 w-4 shrink-0 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs truncate">{page.path}</span>
                      <span className="text-xs font-semibold ml-2 shrink-0"
                        style={{ color: 'var(--primary)' }}>{page.count}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden"
                      style={{ background: 'color-mix(in srgb, var(--text) 10%, transparent)' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${Math.round((page.count / visitors.topPages[0].count) * 100)}%`,
                          background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm opacity-40">No visitor data yet.</p>}
        </div>
      </div>

      {/* Unread callout */}
      {metrics?.unreadMessages > 0 && (
        <div className="rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
          style={{ background: 'color-mix(in srgb, var(--primary) 12%, var(--surface))',
            border: '1px solid var(--primary)' }}>
          <div>
            <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--primary)' }}>
              📬 {metrics.unreadMessages} unread message{metrics.unreadMessages > 1 ? 's' : ''}
            </p>
            <p className="text-xs opacity-60 mt-0.5">Someone reached out via your contact form</p>
          </div>
          <Link href="/admin/contact-forms"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shrink-0"
            style={{ background: 'var(--primary)' }}>Read now</Link>
        </div>
      )}
    </div>
  );
}
