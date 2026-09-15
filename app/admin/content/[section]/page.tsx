'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

// ─── Live Preview renderer ────────────────────────────────────────────────────
function SectionPreview({ sectionId, model }: { sectionId: string; model: Record<string, any> }) {
  const chip = (text: string, i: number) => (
    <span key={i} className="inline-block rounded-full px-2 py-0.5 text-xs mr-1 mb-1"
      style={{ background: 'color-mix(in srgb, var(--primary) 20%, transparent)', color: 'var(--primary)' }}>
      {text}
    </span>
  );

  const card = (children: React.ReactNode, key: string | number) => (
    <div key={key} className="rounded-xl p-4 mb-3"
      style={{ background: 'color-mix(in srgb, var(--primary) 8%, var(--background))', border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)' }}>
      {children}
    </div>
  );

  const label = (text: string) => (
    <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-50">{text}</p>
  );

  const val = (text: any) => (
    <p className="text-sm" style={{ color: 'var(--text)' }}>{String(text || '—')}</p>
  );

  // ── Profile / Hero ──
  if (sectionId === 'profile') {
    return (
      <div className="rounded-xl p-5 space-y-3" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
            {(model.name || 'A')[0]}
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{model.name || 'Your Name'}</p>
            <p className="text-sm" style={{ color: 'var(--primary)' }}>{model.role || 'Your Role'}</p>
            <p className="text-xs opacity-60">{model.location}</p>
          </div>
        </div>
        {model.title && <p className="text-sm font-medium opacity-80">{model.title}</p>}
        {model.bio && <p className="text-xs opacity-60 line-clamp-3">{model.bio}</p>}
        <div className="flex flex-wrap gap-2 pt-1">
          {model.email && chip(model.email, 0)}
          {model.phone && chip(model.phone, 1)}
        </div>
        <div className="flex gap-2 flex-wrap">
          {model.linkedin && <a href={model.linkedin} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: 'var(--primary)' }}>LinkedIn</a>}
          {model.github && <a href={model.github} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: 'var(--primary)' }}>GitHub</a>}
          {model.twitter && <a href={model.twitter} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: 'var(--primary)' }}>Twitter</a>}
        </div>
      </div>
    );
  }

  // ── Experience ──
  if (sectionId === 'experience') {
    const items: any[] = model.experience || [];
    return (
      <div className="space-y-3">
        {items.length === 0 && <p className="text-xs opacity-40">No experience entries yet.</p>}
        {items.map((exp, i) => card(
          <>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>{exp.role || 'Role'}</p>
            <p className="text-sm" style={{ color: 'var(--primary)' }}>{exp.company || 'Company'}</p>
            <p className="text-xs opacity-50 mb-2">{exp.duration}</p>
            {exp.description && <p className="text-xs opacity-70 line-clamp-2">{exp.description}</p>}
            {exp.technologies && (
              <div className="mt-2 flex flex-wrap">
                {exp.technologies.split(',').map((t: string, j: number) => chip(t.trim(), j))}
              </div>
            )}
          </>,
          i
        ))}
      </div>
    );
  }

  // ── Education ──
  if (sectionId === 'education') {
    const items: any[] = model.degree || [];
    return (
      <div className="space-y-3">
        {items.length === 0 && <p className="text-xs opacity-40">No education entries yet.</p>}
        {items.map((deg, i) => card(
          <>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>{deg.name || 'Degree'}</p>
            <p className="text-sm" style={{ color: 'var(--primary)' }}>{deg.institution}</p>
            <p className="text-xs opacity-50">{deg.year}</p>
            {deg.score && <p className="text-xs mt-1 opacity-70">Score: <strong>{deg.score}</strong></p>}
          </>,
          i
        ))}
      </div>
    );
  }

  // ── Skills ──
  if (sectionId === 'skills') {
    const categories: any[] = model.category || [];
    return (
      <div className="space-y-4">
        {categories.length === 0 && <p className="text-xs opacity-40">No skill categories yet.</p>}
        {categories.map((cat, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)' }}>
            <p className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>{cat.name || 'Category'}</p>
            <div className="space-y-2">
              {(cat.skill || []).map((sk: any, j: number) => (
                <div key={j}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{sk.name}</span>
                    <span style={{ color: 'var(--primary)' }}>{sk.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--text) 15%, transparent)' }}>
                    <div className="h-full rounded-full" style={{ width: `${sk.level || 0}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Certifications ──
  if (sectionId === 'certifications') {
    const items: any[] = model.certification || [];
    return (
      <div className="space-y-3">
        {items.length === 0 && <p className="text-xs opacity-40">No certifications yet.</p>}
        {items.map((cert, i) => card(
          <>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>{cert.name || 'Certification'}</p>
            <p className="text-sm" style={{ color: 'var(--primary)' }}>{cert.organization}</p>
            <p className="text-xs opacity-50">{cert.date}</p>
            {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="text-xs underline mt-1 block" style={{ color: 'var(--secondary)' }}>View Credential →</a>}
          </>,
          i
        ))}
      </div>
    );
  }

  // ── Projects ──
  if (sectionId === 'projects') {
    const items: any[] = model.project || [];
    return (
      <div className="space-y-3">
        {items.length === 0 && <p className="text-xs opacity-40">No projects yet.</p>}
        {items.map((proj, i) => card(
          <>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>{proj.name || 'Project Name'}</p>
            {proj.description && <p className="text-xs opacity-70 my-1 line-clamp-2">{proj.description}</p>}
            {proj.technologies && (
              <div className="flex flex-wrap mt-1">
                {proj.technologies.split(',').map((t: string, j: number) => chip(t.trim(), j))}
              </div>
            )}
            <div className="flex gap-2 mt-2">
              {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: 'var(--primary)' }}>GitHub</a>}
              {proj.demo && <a href={proj.demo} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: 'var(--accent)' }}>Live Demo</a>}
            </div>
          </>,
          i
        ))}
      </div>
    );
  }

  // ── Achievements ──
  if (sectionId === 'achievements') {
    const items: any[] = model.achievement || [];
    return (
      <div className="grid grid-cols-2 gap-3">
        {items.length === 0 && <p className="text-xs opacity-40 col-span-2">No achievements yet.</p>}
        {items.map((ach, i) => (
          <div key={i} className="rounded-xl p-4 text-center" style={{ background: 'var(--surface)', border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)' }}>
            <div className="text-3xl mb-1">{ach.icon || '🏆'}</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{ach.count || '0'}</div>
            <div className="text-xs opacity-70 mt-1">{ach.title}</div>
          </div>
        ))}
      </div>
    );
  }

  // ── Testimonials ──
  if (sectionId === 'testimonials') {
    const items: any[] = model.testimonial || [];
    return (
      <div className="space-y-3">
        {items.length === 0 && <p className="text-xs opacity-40">No testimonials yet.</p>}
        {items.map((t, i) => card(
          <>
            <p className="text-xs italic opacity-80 mb-3">&quot;{t.text || 'Testimonial text...'}&quot;</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                {(t.name || 'A')[0]}
              </div>
              <div>
                <p className="text-xs font-semibold">{t.name}</p>
                <p className="text-xs opacity-50">{t.role}</p>
              </div>
            </div>
          </>,
          i
        ))}
      </div>
    );
  }

  // ── Contact ──
  if (sectionId === 'contact') {
    return (
      <div className="rounded-xl p-5 space-y-3" style={{ background: 'var(--surface)' }}>
        {[
          { label: 'Email', value: model.email },
          { label: 'Phone', value: model.phone },
          { label: 'Location', value: model.location },
        ].map(({ label: l, value: v }) => v ? (
          <div key={l}>
            {label(l)}
            {val(v)}
          </div>
        ) : null)}
        <div className="flex flex-wrap gap-2 pt-1">
          {model.linkedin && <a href={model.linkedin} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: 'var(--primary)' }}>LinkedIn</a>}
          {model.github && <a href={model.github} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: 'var(--primary)' }}>GitHub</a>}
          {model.twitter && <a href={model.twitter} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: 'var(--primary)' }}>Twitter</a>}
        </div>
      </div>
    );
  }

  // ── Fallback ──
  return (
    <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--surface)' }}>
      {Object.entries(model).map(([k, v]) => (
        <div key={k}>
          {label(k)}
          {val(typeof v === 'object' ? JSON.stringify(v) : v)}
        </div>
      ))}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'richtext' | 'url' | 'number' | 'boolean' | 'media' | 'list';

interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  repeatableItemShape?: FieldSchema[];
}

interface SectionPayload {
  schema: {
    id: string;
    label: string;
    description: string;
    fields: FieldSchema[];
  };
  model: Record<string, any>;
}

function deepClone<T>(value: T): T {
  if (value === undefined || value === null) return value;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function renderSimpleInput(
  field: FieldSchema,
  value: any,
  onChange: (val: any) => void,
  keyName: string
) {
  const inputStyle: React.CSSProperties = {
    background: 'var(--background)',
    color: 'var(--text)',
    border: '1px solid color-mix(in srgb, var(--primary) 40%, transparent)',
  };
  const commonClass = 'mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none';

  if (field.type === 'textarea' || field.type === 'richtext') {
    return (
      <textarea
        key={keyName}
        className={commonClass}
        style={inputStyle}
        rows={field.type === 'richtext' ? 5 : 3}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === 'boolean') {
    return (
      <input
        key={keyName}
        type="checkbox"
        className="mt-1 h-4 w-4 accent-[var(--primary)]"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }
  return (
    <input
      key={keyName}
      type={field.type === 'number' ? 'number' : 'text'}
      className={commonClass}
      style={inputStyle}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default function SectionEditorPage() {
  const params = useParams<{ section: string }>();
  const section = params.section;
  const [payload, setPayload] = useState<SectionPayload | null>(null);
  const [model, setModel] = useState<Record<string, any>>({});
  const [status, setStatus] = useState('Loading...');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [history, setHistory] = useState<Record<string, any>[]>([]);
  const [future, setFuture] = useState<Record<string, any>[]>([]);
  const [revisions, setRevisions] = useState<any[]>([]);

  const load = async () => {
    try {
      const res = await fetch(`/api/admin/content/${section}`);
      const data = await res.json();
      if (res.ok && data?.schema) {
        setPayload(data);
        setModel(data.model || {});
        setHistory([deepClone(data.model || {})]);
        setFuture([]);
        setStatus('Loaded');
      } else {
        setStatus(data?.error || 'Failed to load section');
      }
    } catch {
      setStatus('Failed to load section');
    }
  };

  const loadRevisions = async () => {
    try {
      const res = await fetch(`/api/admin/revisions/${section}`);
      const data = await res.json();
      setRevisions(Array.isArray(data) ? data : []);
    } catch {
      setRevisions([]);
    }
  };

  useEffect(() => {
    load();
    loadRevisions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const setField = (key: string, value: any) => {
    setModel((prev) => {
      const next = { ...prev, [key]: value };
      setHistory((h) => [...h, deepClone(next)].slice(-50));
      setFuture([]);
      return next;
    });
  };

  const autosave = async () => {
    setStatus('Saving draft...');
    try {
      const res = await fetch(`/api/admin/content/${section}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
      });
      const data = await res.json();
      setStatus(res.ok ? 'Draft saved' : data?.error || 'Failed to save');
      if (res.ok) loadRevisions();
    } catch {
      setStatus('Failed to save draft');
    }
  };

  const publish = async () => {
    setStatus('Publishing...');
    try {
      const res = await fetch(`/api/admin/content/${section}/publish`, { method: 'POST' });
      const data = await res.json();
      setStatus(res.ok ? 'Published' : data?.error || 'Failed to publish');
      if (res.ok) loadRevisions();
    } catch {
      setStatus('Failed to publish');
    }
  };

  const restore = async (revisionId: string) => {
    try {
      await fetch(`/api/admin/revisions/${section}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionId }),
      });
      await load();
      await loadRevisions();
      setStatus('Revision restored as draft');
    } catch {
      setStatus('Failed to restore revision');
    }
  };

  const undo = () => {
    if (history.length <= 1) return;
    const nextHistory = [...history];
    const current = nextHistory.pop() as Record<string, any>;
    const previous = nextHistory[nextHistory.length - 1];
    setFuture((f) => [current, ...f]);
    setHistory(nextHistory);
    setModel(deepClone(previous));
  };

  const redo = () => {
    if (!future.length) return;
    const [next, ...rest] = future;
    setHistory((h) => [...h, deepClone(next)]);
    setModel(deepClone(next));
    setFuture(rest);
  };

  const previewWidth = useMemo(() => {
    if (device === 'mobile') return 'max-w-sm';
    if (device === 'tablet') return 'max-w-2xl';
    return 'max-w-full';
  }, [device]);

  if (!payload) {
    return <p className="text-sm opacity-50">Loading section...</p>;
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)',
  };
  const innerCardStyle: React.CSSProperties = {
    background: 'var(--background)',
    border: '1px solid color-mix(in srgb, var(--text) 15%, transparent)',
  };
  const ghostBtnStyle: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--text)',
    border: '1px solid color-mix(in srgb, var(--text) 30%, transparent)',
  };
  const inputStyle: React.CSSProperties = {
    background: 'var(--background)',
    color: 'var(--text)',
    border: '1px solid color-mix(in srgb, var(--primary) 50%, transparent)',
  };
  const dangerBtnStyle: React.CSSProperties = {
    background: 'color-mix(in srgb, var(--secondary) 15%, var(--background))',
    color: 'var(--secondary)',
    border: '1px solid color-mix(in srgb, var(--secondary) 50%, transparent)',
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
      {/* Editor panel */}
      <div className="rounded-xl p-4" style={cardStyle}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
              {payload.schema.label}
            </h2>
            <p className="text-sm opacity-60">{payload.schema.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={undo} className="rounded px-3 py-2 text-xs transition-opacity hover:opacity-80" style={ghostBtnStyle}>Undo</button>
            <button onClick={redo} className="rounded px-3 py-2 text-xs transition-opacity hover:opacity-80" style={ghostBtnStyle}>Redo</button>
            <button onClick={autosave} className="rounded px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80" style={{ background: 'var(--secondary)' }}>Save Draft</button>
            <button onClick={publish} className="rounded px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80" style={{ background: 'var(--accent)' }}>Publish</button>
          </div>
        </div>

        <p className="mb-3 text-xs" style={{ color: 'var(--primary)' }}>{status}</p>

        <div className="space-y-4">
          {payload.schema.fields.map((field) => {
            if (field.type !== 'list') {
              return (
                <div key={field.key}>
                  <label className="text-sm opacity-70">{field.label}</label>
                  {renderSimpleInput(field, model[field.key], (val) => setField(field.key, val), field.key)}
                </div>
              );
            }

            const items: Record<string, any>[] = Array.isArray(model[field.key]) ? model[field.key] : [];
            const itemShape = field.repeatableItemShape || [];

            return (
              <div key={field.key} className="rounded-lg p-3" style={innerCardStyle}>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold">{field.label}</label>
                  <button
                    onClick={() => setField(field.key, [...items, {}])}
                    className="rounded px-2 py-1 text-xs text-white"
                    style={{ background: 'var(--primary)' }}
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={`${field.key}-${idx}`} className="rounded-lg p-3" style={cardStyle}>
                      <div className="mb-2 flex justify-end">
                        <button
                          onClick={() => setField(field.key, items.filter((_, i) => i !== idx))}
                          className="rounded px-2 py-1 text-xs hover:opacity-80"
                          style={dangerBtnStyle}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {itemShape.map((childField) => {
                          if (childField.type !== 'list') {
                            return (
                              <div key={`${field.key}-${idx}-${childField.key}`}>
                                <label className="text-xs opacity-60">{childField.label}</label>
                                {renderSimpleInput(
                                  childField,
                                  item[childField.key],
                                  (val) => {
                                    const next = deepClone(items);
                                    next[idx][childField.key] = val;
                                    setField(field.key, next);
                                  },
                                  `${field.key}-${idx}-${childField.key}`
                                )}
                              </div>
                            );
                          }

                          const nestedItems: Record<string, any>[] = Array.isArray(item[childField.key])
                            ? item[childField.key]
                            : [];
                          const nestedShape = childField.repeatableItemShape || [];

                          return (
                            <div key={`${field.key}-${idx}-${childField.key}`} className="md:col-span-2 rounded p-2" style={innerCardStyle}>
                              <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs">{childField.label}</label>
                                <button
                                  onClick={() => {
                                    const next = deepClone(items);
                                    next[idx][childField.key] = [...nestedItems, {}];
                                    setField(field.key, next);
                                  }}
                                  className="rounded px-2 py-1 text-xs text-white"
                                  style={{ background: 'var(--primary)' }}
                                >
                                  + Add {childField.label}
                                </button>
                              </div>
                              <div className="space-y-2">
                                {nestedItems.map((nestedItem, nestedIndex) => (
                                  <div key={`${field.key}-${idx}-${childField.key}-${nestedIndex}`} className="rounded p-2" style={cardStyle}>
                                    <div className="mb-2 flex justify-end">
                                      <button
                                        onClick={() => {
                                          const next = deepClone(items);
                                          next[idx][childField.key] = nestedItems.filter((_, i) => i !== nestedIndex);
                                          setField(field.key, next);
                                        }}
                                        className="rounded px-2 py-1 text-xs hover:opacity-80"
                                        style={dangerBtnStyle}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                    <div className="grid gap-2 md:grid-cols-2">
                                      {nestedShape.map((nestedField) => (
                                        <div key={`${field.key}-${idx}-${childField.key}-${nestedIndex}-${nestedField.key}`}>
                                          <label className="text-xs opacity-60">{nestedField.label}</label>
                                          {renderSimpleInput(
                                            nestedField,
                                            nestedItem[nestedField.key],
                                            (val) => {
                                              const next = deepClone(items);
                                              next[idx][childField.key][nestedIndex][nestedField.key] = val;
                                              setField(field.key, next);
                                            },
                                            `${field.key}-${idx}-${childField.key}-${nestedIndex}-${nestedField.key}`
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel */}
      <div className="space-y-4">
        {/* Preview */}
        <div className="rounded-xl p-4" style={cardStyle}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Live Preview</h3>
            <div className="flex gap-1">
              {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDevice(mode)}
                  className="rounded px-2 py-1 text-xs transition-opacity hover:opacity-80"
                  style={{
                    background: device === mode ? 'var(--primary)' : 'var(--background)',
                    color: device === mode ? 'white' : 'var(--text)',
                    border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)',
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className={`mx-auto overflow-auto max-h-[520px] ${previewWidth}`}>
            <SectionPreview sectionId={payload.schema.id} model={model} />
          </div>
        </div>

        {/* Revision history */}
        <div className="rounded-xl p-4" style={cardStyle}>
          <h3 className="font-semibold">Version History</h3>
          <div className="mt-3 space-y-2">
            {revisions.map((rev) => (
              <div key={rev.id} className="rounded p-2" style={innerCardStyle}>
                <p className="text-xs" style={{ color: 'var(--text)' }}>
                  <span style={{ color: 'var(--primary)' }}>{rev.type}</span> by {rev.createdBy}
                </p>
                <p className="text-xs opacity-50">{new Date(rev.createdAt).toLocaleString()}</p>
                <button
                  onClick={() => restore(rev.id)}
                  className="mt-2 rounded px-2 py-1 text-xs text-white"
                  style={{ background: 'var(--secondary)' }}
                >
                  Restore as Draft
                </button>
              </div>
            ))}
            {!revisions.length && (
              <p className="text-xs opacity-50">No revisions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
