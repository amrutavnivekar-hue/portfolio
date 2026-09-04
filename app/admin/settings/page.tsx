'use client';

import { useEffect, useState } from 'react';

interface Template {
  id: number;
  name: string;
  subject: string;
  body: string;
  created_at: string;
}

const cardBorder: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)',
};
const inputCls = 'w-full rounded-lg px-3 py-2 text-sm outline-none';
const inputStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: 'var(--background)',
  color: 'var(--text)',
  border: '1px solid color-mix(in srgb, var(--primary) 40%, transparent)',
  ...extra,
});

const MAIL_PROVIDERS = [
  {
    id: 'gmail',
    label: 'Gmail',
    icon: '📧',
    hint: 'Opens Gmail compose in your browser',
    urlFn: (to: string, subject: string, body: string) =>
      `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  },
  {
    id: 'outlook',
    label: 'Outlook',
    icon: '📨',
    hint: 'Opens Outlook compose in your browser',
    urlFn: (to: string, subject: string, body: string) =>
      `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  },
  {
    id: 'yahoo',
    label: 'Yahoo Mail',
    icon: '📬',
    hint: 'Opens Yahoo Mail compose in your browser',
    urlFn: (to: string, subject: string, body: string) =>
      `https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}&subj=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  },
  {
    id: 'mailto',
    label: 'Default Mail App',
    icon: '🖥️',
    hint: 'Opens your system default mail client',
    urlFn: (to: string, subject: string, body: string) =>
      `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  },
];

export default function SettingsPage() {
  // ── Mail settings ──────────────────────────────────────────
  const [provider, setProvider] = useState('gmail');
  const [replyEmail, setReplyEmail] = useState('');
  const [mailSaving, setMailSaving] = useState(false);
  const [mailMsg, setMailMsg] = useState('');

  // ── Templates ──────────────────────────────────────────────
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tplLoading, setTplLoading] = useState(true);
  const [tplError, setTplError] = useState('');

  // New / edit form
  const [editing, setEditing] = useState<Template | null>(null);
  const [form, setForm] = useState({ name: '', subject: '', body: '' });
  const [formMode, setFormMode] = useState<'new' | 'edit' | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  // ── Load ───────────────────────────────────────────────────
  useEffect(() => {
    // Load mail settings
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.mail_provider) setProvider(data.mail_provider);
        if (data.reply_email) setReplyEmail(data.reply_email);
      })
      .catch(() => {});

    // Load templates
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setTplLoading(true);
    setTplError('');
    try {
      const res = await fetch('/api/admin/reply-templates');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setTplError(err.message);
    } finally {
      setTplLoading(false);
    }
  };

  // ── Save mail settings ─────────────────────────────────────
  const saveMailSettings = async () => {
    setMailSaving(true);
    setMailMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          { key: 'mail_provider', value: provider },
          { key: 'reply_email', value: replyEmail },
        ]),
      });
      if (!res.ok) throw new Error('Failed to save');
      setMailMsg('✓ Mail settings saved');
    } catch {
      setMailMsg('✗ Failed to save');
    } finally {
      setMailSaving(false);
      setTimeout(() => setMailMsg(''), 3000);
    }
  };

  // ── Template CRUD ──────────────────────────────────────────
  const openNew = () => {
    setEditing(null);
    setForm({ name: '', subject: '', body: '' });
    setFormMode('new');
    setFormMsg('');
  };

  const openEdit = (tpl: Template) => {
    setEditing(tpl);
    setForm({ name: tpl.name, subject: tpl.subject, body: tpl.body });
    setFormMode('edit');
    setFormMsg('');
  };

  const closeForm = () => { setFormMode(null); setEditing(null); setFormMsg(''); };

  const saveTemplate = async () => {
    if (!form.name || !form.subject || !form.body) {
      setFormMsg('All fields are required.');
      return;
    }
    setFormSaving(true);
    setFormMsg('');
    try {
      const url = formMode === 'edit' && editing
        ? `/api/admin/reply-templates/${editing.id}`
        : '/api/admin/reply-templates';
      const method = formMode === 'edit' ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setFormMsg('✓ Saved');
      await loadTemplates();
      setTimeout(closeForm, 800);
    } catch (err: any) {
      setFormMsg(`✗ ${err.message}`);
    } finally {
      setFormSaving(false);
    }
  };

  const deleteTemplate = async (id: number) => {
    if (!confirm('Delete this template?')) return;
    await fetch(`/api/admin/reply-templates/${id}`, { method: 'DELETE' });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const selectedProvider = MAIL_PROVIDERS.find((p) => p.id === provider)!;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Settings</h2>
        <p className="mt-1 text-sm opacity-60">Configure mail provider and reply templates</p>
      </div>

      {/* ── Mail Configuration ─────────────────────────────── */}
      <section className="rounded-xl p-6 space-y-5" style={{ background: 'var(--surface)', ...cardBorder }}>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Mail Configuration</h3>
          <p className="text-xs opacity-50 mt-0.5">
            When you reply to a contact form submission, replies will open in your chosen mail provider.
          </p>
        </div>

        {/* Provider picker */}
        <div>
          <label className="block text-sm font-medium opacity-70 mb-2">Mail Provider</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MAIL_PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className="rounded-xl p-3 text-left transition-opacity hover:opacity-90"
                style={
                  provider === p.id
                    ? { background: 'var(--primary)', color: '#fff', border: '2px solid var(--primary)' }
                    : { background: 'var(--background)', color: 'var(--text)', border: '2px solid color-mix(in srgb, var(--text) 20%, transparent)' }
                }
              >
                <div className="text-xl mb-1">{p.icon}</div>
                <div className="text-xs font-semibold">{p.label}</div>
                <div className="text-xs opacity-60 mt-0.5 leading-tight">{p.hint}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Your reply email */}
        <div>
          <label className="block text-sm font-medium opacity-70 mb-1">
            Your Reply-From Email
          </label>
          <p className="text-xs opacity-50 mb-2">
            This is YOUR email address that replies will be sent from (used to pre-fill the compose window).
          </p>
          <input
            type="email"
            className={inputCls}
            style={inputStyle()}
            value={replyEmail}
            onChange={(e) => setReplyEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        {/* Preview */}
        {replyEmail && (
          <div className="rounded-lg p-3 text-xs opacity-70"
            style={{ background: 'var(--background)', border: '1px solid color-mix(in srgb, var(--text) 15%, transparent)' }}>
            <span className="font-medium">Preview: </span>
            Clicking "Reply" on a message will open{' '}
            <span style={{ color: 'var(--primary)' }}>{selectedProvider.label}</span>
            {' '}with your address <span style={{ color: 'var(--primary)' }}>{replyEmail}</span> pre-filled.
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={saveMailSettings}
            disabled={mailSaving}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: 'var(--primary)' }}
          >
            {mailSaving ? 'Saving...' : 'Save Mail Settings'}
          </button>
          {mailMsg && (
            <span className="text-sm" style={{ color: mailMsg.startsWith('✓') ? 'var(--accent)' : '#ef4444' }}>
              {mailMsg}
            </span>
          )}
        </div>
      </section>

      {/* ── Reply Templates ────────────────────────────────── */}
      <section className="rounded-xl p-6 space-y-4" style={{ background: 'var(--surface)', ...cardBorder }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Reply Templates</h3>
            <p className="text-xs opacity-50 mt-0.5">
              Create reusable reply templates. Use <code className="px-1 rounded text-xs"
                style={{ background: 'var(--background)' }}>{'{name}'}</code> and{' '}
              <code className="px-1 rounded text-xs" style={{ background: 'var(--background)' }}>{'{email}'}</code>{' '}
              as placeholders — they'll be filled with the sender's details.
            </p>
          </div>
          <button
            onClick={openNew}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-white shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            + New Template
          </button>
        </div>

        {tplError && (
          <p className="text-sm text-red-400">{tplError}</p>
        )}

        {tplLoading && <p className="text-sm opacity-40">Loading templates...</p>}

        {/* Template list */}
        {!tplLoading && templates.length === 0 && formMode !== 'new' && (
          <div className="rounded-xl p-8 text-center"
            style={{ background: 'var(--background)', border: '1px solid color-mix(in srgb, var(--text) 12%, transparent)' }}>
            <p className="text-2xl mb-2">📝</p>
            <p className="text-sm opacity-50">No templates yet. Create your first one.</p>
          </div>
        )}

        <div className="space-y-3">
          {templates.map((tpl) => (
            <div key={tpl.id} className="rounded-xl p-4"
              style={{ background: 'var(--background)', border: '1px solid color-mix(in srgb, var(--text) 15%, transparent)' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{tpl.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--primary)' }}>
                    Subject: {tpl.subject}
                  </p>
                  <p className="text-xs opacity-60 mt-1 line-clamp-2 whitespace-pre-wrap">{tpl.body}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(tpl)}
                    className="rounded px-2 py-1.5 text-xs font-medium"
                    style={{ background: 'var(--surface)', color: 'var(--text)', ...cardBorder }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTemplate(tpl.id)}
                    className="rounded px-2 py-1.5 text-xs font-medium text-white"
                    style={{ background: '#dc2626' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New / Edit form */}
        {formMode && (
          <div className="rounded-xl p-5 space-y-4"
            style={{ background: 'var(--background)', border: '2px solid var(--primary)' }}>
            <h4 className="font-semibold" style={{ color: 'var(--primary)' }}>
              {formMode === 'edit' ? `Edit: ${editing?.name}` : 'New Template'}
            </h4>

            <div>
              <label className="block text-xs font-medium opacity-70 mb-1">Template Name</label>
              <input
                className={inputCls}
                style={inputStyle()}
                placeholder='e.g. "Quick Thanks", "Follow Up"'
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-medium opacity-70 mb-1">Subject Line</label>
              <input
                className={inputCls}
                style={inputStyle()}
                placeholder='e.g. "Re: Your enquiry — Amruta Nivekar"'
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-medium opacity-70 mb-1">Message Body</label>
              <p className="text-xs opacity-40 mb-1">
                Use <code>{'{name}'}</code> for sender name, <code>{'{email}'}</code> for their email.
              </p>
              <textarea
                className={inputCls}
                style={inputStyle()}
                rows={6}
                placeholder={`Hi {name},\n\nThank you for reaching out! ...\n\nBest regards,\nAmruta`}
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={saveTemplate}
                disabled={formSaving}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: 'var(--primary)' }}
              >
                {formSaving ? 'Saving...' : formMode === 'edit' ? 'Update Template' : 'Create Template'}
              </button>
              <button
                onClick={closeForm}
                className="rounded-lg px-4 py-2 text-sm font-medium"
                style={{ background: 'var(--surface)', color: 'var(--text)', ...cardBorder }}
              >
                Cancel
              </button>
              {formMsg && (
                <span className="text-sm" style={{ color: formMsg.startsWith('✓') ? 'var(--accent)' : '#ef4444' }}>
                  {formMsg}
                </span>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
