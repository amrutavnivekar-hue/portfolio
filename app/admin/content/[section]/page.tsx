'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

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
  return JSON.parse(JSON.stringify(value));
}

function renderSimpleInput(
  field: FieldSchema,
  value: any,
  onChange: (val: any) => void,
  keyName: string
) {
  const commonClass = 'mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm';
  if (field.type === 'textarea' || field.type === 'richtext') {
    return (
      <textarea
        key={keyName}
        className={commonClass}
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
    const res = await fetch(`/api/admin/content/${section}`);
    const data = await res.json();
    setPayload(data);
    setModel(data.model);
    setHistory([deepClone(data.model)]);
    setFuture([]);
    setStatus('Loaded');
  };

  const loadRevisions = async () => {
    const res = await fetch(`/api/admin/revisions/${section}`);
    const data = await res.json();
    setRevisions(data);
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
    const res = await fetch(`/api/admin/content/${section}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Failed to save');
      return;
    }
    setStatus('Draft saved');
    loadRevisions();
  };

  const publish = async () => {
    setStatus('Publishing...');
    const res = await fetch(`/api/admin/content/${section}/publish`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Failed to publish');
      return;
    }
    setStatus('Published');
    loadRevisions();
  };

  const restore = async (revisionId: string) => {
    await fetch(`/api/admin/revisions/${section}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revisionId }),
    });
    await load();
    await loadRevisions();
    setStatus('Revision restored as draft');
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

  if (!payload) return <div className="text-sm text-slate-400">Loading section...</div>;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold">{payload.schema.label}</h2>
            <p className="text-sm text-slate-400">{payload.schema.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={undo} className="rounded border border-white/20 px-3 py-2 text-xs">Undo</button>
            <button onClick={redo} className="rounded border border-white/20 px-3 py-2 text-xs">Redo</button>
            <button onClick={autosave} className="rounded bg-amber-600 px-3 py-2 text-xs font-semibold">Save Draft</button>
            <button onClick={publish} className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold">Publish</button>
          </div>
        </div>
        <p className="mb-3 text-xs text-blue-300">{status}</p>

        <div className="space-y-4">
          {payload.schema.fields.map((field) => {
            if (field.type !== 'list') {
              return (
                <div key={field.key}>
                  <label className="text-sm text-slate-300">{field.label}</label>
                  {renderSimpleInput(field, model[field.key], (val) => setField(field.key, val), field.key)}
                </div>
              );
            }

            const items: Record<string, any>[] = Array.isArray(model[field.key]) ? model[field.key] : [];
            const itemShape = field.repeatableItemShape || [];

            return (
              <div key={field.key} className="rounded-lg border border-white/10 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200">{field.label}</label>
                  <button
                    onClick={() => setField(field.key, [...items, {}])}
                    className="rounded bg-blue-600 px-2 py-1 text-xs"
                  >
                    Add Item
                  </button>
                </div>
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={`${field.key}-${idx}`} className="rounded-lg border border-white/10 p-3">
                      <div className="mb-2 flex justify-end">
                        <button
                          onClick={() => setField(field.key, items.filter((_, i) => i !== idx))}
                          className="rounded bg-red-600 px-2 py-1 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {itemShape.map((childField) => {
                          if (childField.type !== 'list') {
                            return (
                              <div key={`${field.key}-${idx}-${childField.key}`}>
                                <label className="text-xs text-slate-300">{childField.label}</label>
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
                            <div key={`${field.key}-${idx}-${childField.key}`} className="md:col-span-2 rounded border border-white/10 p-2">
                              <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs text-slate-200">{childField.label}</label>
                                <button
                                  onClick={() => {
                                    const next = deepClone(items);
                                    next[idx][childField.key] = [...nestedItems, {}];
                                    setField(field.key, next);
                                  }}
                                  className="rounded bg-blue-600 px-2 py-1 text-xs"
                                >
                                  Add {childField.label}
                                </button>
                              </div>
                              <div className="space-y-2">
                                {nestedItems.map((nestedItem, nestedIndex) => (
                                  <div key={`${field.key}-${idx}-${childField.key}-${nestedIndex}`} className="rounded border border-white/10 p-2">
                                    <div className="mb-2 flex justify-end">
                                      <button
                                        onClick={() => {
                                          const next = deepClone(items);
                                          next[idx][childField.key] = nestedItems.filter((_, i) => i !== nestedIndex);
                                          setField(field.key, next);
                                        }}
                                        className="rounded bg-red-600 px-2 py-1 text-xs"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                    <div className="grid gap-2 md:grid-cols-2">
                                      {nestedShape.map((nestedField) => (
                                        <div key={`${field.key}-${idx}-${childField.key}-${nestedIndex}-${nestedField.key}`}>
                                          <label className="text-xs text-slate-300">{nestedField.label}</label>
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

      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Live Preview</h3>
            <div className="flex gap-1">
              {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDevice(mode)}
                  className={`rounded px-2 py-1 text-xs ${device === mode ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className={`mx-auto rounded-lg border border-white/10 bg-slate-950 p-3 ${previewWidth}`}>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap text-xs text-emerald-300">
              {JSON.stringify(model, null, 2)}
            </pre>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
          <h3 className="font-semibold">Version History</h3>
          <div className="mt-3 space-y-2">
            {revisions.map((rev) => (
              <div key={rev.id} className="rounded border border-white/10 p-2">
                <p className="text-xs text-slate-200">{rev.type} by {rev.createdBy}</p>
                <p className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleString()}</p>
                <button onClick={() => restore(rev.id)} className="mt-2 rounded bg-amber-600 px-2 py-1 text-xs">
                  Restore as Draft
                </button>
              </div>
            ))}
            {!revisions.length ? <p className="text-xs text-slate-400">No revisions yet.</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
