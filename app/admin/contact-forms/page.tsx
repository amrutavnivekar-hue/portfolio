'use client';

import { useEffect, useState } from 'react';

interface Submission {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface Template {
  id: number;
  name: string;
  subject: string;
  body: string;
}

interface MailSettings {
  mail_provider: string;
  reply_email: string;
}

const MAIL_PROVIDERS: Record<string, (to: string, subject: string, body: string) => string> = {
  gmail: (to, s, b) =>
    `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`,
  outlook: (to, s, b) =>
    `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`,
  yahoo: (to, s, b) =>
    `https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}&subj=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`,
  mailto: (to, s, b) =>
    `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`,
};

const cardBorder: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)',
};
const inputCls = 'w-full rounded-lg px-3 py-2 text-sm outline-none';
const inputStyle: React.CSSProperties = {
  background: 'var(--background)',
  color: 'var(--text)',
  border: '1px solid color-mix(in srgb, var(--primary) 40%, transparent)',
};

function fillTemplate(text: string, name: string, email: string) {
  return text.replace(/\{name\}/g, name).replace(/\{email\}/g, email);
}

export default function ContactFormsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const [templates, setTemplates] = useState<Template[]>([]);
  const [mailSettings, setMailSettings] = useState<MailSettings>({ mail_provider: 'gmail', reply_email: '' });

  // Per-submission reply state
  const [replyState, setReplyState] = useState<Record<number, {
    mode: 'template' | 'custom';
    templateId: number | null;
    customSubject: string;
    customBody: string;
  }>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact-submissions');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    fetch('/api/admin/reply-templates').then((r) => r.json()).then((d) => {
      if (Array.isArray(d)) setTemplates(d);
    }).catch(() => {});
    fetch('/api/admin/settings').then((r) => r.json()).then((d) => {
      if (d) setMailSettings({ mail_provider: d.mail_provider || 'gmail', reply_email: d.reply_email || '' });
    }).catch(() => {});
  }, []);

  const markRead = async (id: number) => {
    await fetch('/api/admin/contact-submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, read: true } : s)));
  };

  const toggle = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
    const sub = submissions.find((s) => s.id === id);
    if (sub && !sub.read) markRead(id);
    // Init reply state for this submission
    setReplyState((prev) => ({
      ...prev,
      [id]: prev[id] || { mode: 'template', templateId: null, customSubject: '', customBody: '' },
    }));
  };

  const setReply = (id: number, patch: Partial<typeof replyState[number]>) => {
    setReplyState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const buildReplyUrl = (sub: Submission) => {
    const rs = replyState[sub.id];
    if (!rs) return null;

    let subject = '';
    let body = '';

    if (rs.mode === 'template' && rs.templateId) {
      const tpl = templates.find((t) => t.id === rs.templateId);
      if (tpl) {
        subject = fillTemplate(tpl.subject, sub.name, sub.email);
        body = fillTemplate(tpl.body, sub.name, sub.email);
      }
    } else if (rs.mode === 'custom') {
      subject = rs.customSubject;
      body = rs.customBody;
    }

    if (!subject && !body) return null;
    const providerFn = MAIL_PROVIDERS[mailSettings.mail_provider] || MAIL_PROVIDERS.gmail;
    return providerFn(sub.email, subject, body);
  };

  const filtered = submissions.filter((s) => {
    if (filter === 'unread') return !s.read;
    if (filter === 'read') return s.read;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Contact Forms</h2>
          <p className="mt-1 text-sm opacity-60">
            {submissions.length} total ·{' '}
            {unreadCount > 0
              ? <span style={{ color: 'var(--primary)' }}>{unreadCount} unread</span>
              : 'all read'}
          </p>
        </div>
        <div className="flex gap-1">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium capitalize"
              style={filter === f
                ? { background: 'var(--primary)', color: '#fff' }
                : { background: 'var(--surface)', color: 'var(--text)', ...cardBorder }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg p-3 text-sm text-red-400"
          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}>
          {error}
        </div>
      )}

      {loading && <p className="text-sm opacity-40">Loading submissions...</p>}

      {!loading && filtered.length === 0 && (
        <div className="rounded-xl p-10 text-center" style={{ background: 'var(--surface)', ...cardBorder }}>
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm opacity-60">
            {filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((sub) => {
          const rs = replyState[sub.id] || { mode: 'template', templateId: null, customSubject: '', customBody: '' };
          const replyUrl = buildReplyUrl(sub);

          return (
            <div key={sub.id} className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${sub.read
                  ? 'color-mix(in srgb, var(--text) 15%, transparent)'
                  : 'var(--primary)'}`,
              }}>

              {/* Summary row */}
              <div className="flex items-start justify-between gap-3 p-4 cursor-pointer hover:opacity-90"
                onClick={() => toggle(sub.id)}>
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                    style={{ background: sub.read ? 'transparent' : 'var(--primary)' }} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm">{sub.name}</span>
                      <span className="text-xs opacity-50">{sub.email}</span>
                    </div>
                    <p className="text-xs opacity-40 mt-0.5">
                      {new Date(sub.created_at).toLocaleString()}
                    </p>
                    {expanded !== sub.id && (
                      <p className="text-sm opacity-70 mt-1 line-clamp-1">{sub.message}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs opacity-40 shrink-0 pt-1">
                  {expanded === sub.id ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded */}
              {expanded === sub.id && (
                <div style={{ borderTop: '1px solid color-mix(in srgb, var(--text) 10%, transparent)' }}>
                  {/* Original message */}
                  <div className="px-4 pt-3 pb-4">
                    <p className="text-xs font-medium opacity-50 uppercase tracking-wider mb-1">Message</p>
                    <p className="text-sm opacity-80 whitespace-pre-wrap leading-relaxed">{sub.message}</p>
                  </div>

                  {/* Reply composer */}
                  <div className="px-4 pb-4 space-y-3"
                    style={{ borderTop: '1px solid color-mix(in srgb, var(--text) 8%, transparent)' }}>
                    <p className="text-xs font-semibold pt-3 uppercase tracking-wider opacity-50">Reply</p>

                    {/* Mode toggle */}
                    <div className="flex gap-2">
                      {(['template', 'custom'] as const).map((m) => (
                        <button key={m} onClick={(e) => { e.stopPropagation(); setReply(sub.id, { mode: m }); }}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium capitalize"
                          style={rs.mode === m
                            ? { background: 'var(--primary)', color: '#fff' }
                            : { background: 'var(--background)', color: 'var(--text)', ...cardBorder }}>
                          {m === 'template' ? '📋 Use Template' : '✍️ Write Custom'}
                        </button>
                      ))}
                    </div>

                    {/* Template selector */}
                    {rs.mode === 'template' && (
                      <div onClick={(e) => e.stopPropagation()}>
                        {templates.length === 0 ? (
                          <p className="text-xs opacity-50">
                            No templates yet —{' '}
                            <a href="/admin/settings" className="underline" style={{ color: 'var(--primary)' }}>
                              create one in Settings
                            </a>
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {/* None option */}
                            <label className="flex items-start gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`tpl-${sub.id}`}
                                checked={rs.templateId === null}
                                onChange={() => setReply(sub.id, { templateId: null })}
                                className="mt-0.5 accent-[var(--primary)]"
                              />
                              <span className="text-sm opacity-60 italic">— No template (just open composer) —</span>
                            </label>
                            {templates.map((tpl) => (
                              <label key={tpl.id} className="flex items-start gap-2 cursor-pointer rounded-lg p-3"
                                style={rs.templateId === tpl.id
                                  ? { background: 'color-mix(in srgb, var(--primary) 12%, var(--background))', border: '1px solid var(--primary)' }
                                  : { background: 'var(--background)', ...cardBorder }}>
                                <input
                                  type="radio"
                                  name={`tpl-${sub.id}`}
                                  checked={rs.templateId === tpl.id}
                                  onChange={() => setReply(sub.id, { templateId: tpl.id })}
                                  className="mt-0.5 accent-[var(--primary)]"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium">{tpl.name}</p>
                                  <p className="text-xs opacity-50 mt-0.5">Subject: {fillTemplate(tpl.subject, sub.name, sub.email)}</p>
                                  <p className="text-xs opacity-40 mt-1 line-clamp-2 whitespace-pre-wrap">
                                    {fillTemplate(tpl.body, sub.name, sub.email)}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Custom composer */}
                    {rs.mode === 'custom' && (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          className={inputCls}
                          style={inputStyle}
                          placeholder="Subject line"
                          value={rs.customSubject}
                          onChange={(e) => setReply(sub.id, { customSubject: e.target.value })}
                        />
                        <textarea
                          className={inputCls}
                          style={inputStyle}
                          rows={5}
                          placeholder={`Hi ${sub.name},\n\n...`}
                          value={rs.customBody}
                          onChange={(e) => setReply(sub.id, { customBody: e.target.value })}
                        />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      {/* Reply button */}
                      {(rs.mode === 'custom' ? (rs.customSubject || rs.customBody) : rs.templateId !== null) && replyUrl
                        ? (
                          <a href={replyUrl} target="_blank" rel="noreferrer"
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                            style={{ background: 'var(--primary)' }}>
                            Reply via {(mailSettings.mail_provider || 'gmail').charAt(0).toUpperCase()
                              + (mailSettings.mail_provider || 'gmail').slice(1)}
                          </a>
                        ) : rs.templateId === null && rs.mode === 'template' ? (
                          <a href={`mailto:${sub.email}`} target="_blank" rel="noreferrer"
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                            style={{ background: 'var(--primary)' }}>
                            Open Composer
                          </a>
                        ) : null
                      }

                      {/* Mark as read */}
                      {!sub.read && (
                        <button onClick={() => markRead(sub.id)}
                          className="rounded-lg px-3 py-2 text-xs font-medium"
                          style={{ background: 'var(--surface)', color: 'var(--text)', ...cardBorder }}>
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
