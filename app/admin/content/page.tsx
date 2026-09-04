'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface SectionItem {
  id: string; label: string; description: string;
  fields: number; enabled: boolean; order: number;
  status: 'draft' | 'published'; updatedAt: string | null; updatedBy: string | null;
}

const cb: React.CSSProperties = { border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)' };
const inp: React.CSSProperties = { background: 'var(--background)', color: 'var(--text)',
  border: '1px solid color-mix(in srgb, var(--primary) 50%, transparent)', outline: 'none' };
const ghost: React.CSSProperties = { background: 'transparent', color: 'var(--text)',
  border: '1px solid color-mix(in srgb, var(--text) 30%, transparent)' };
const danger: React.CSSProperties = {
  background: 'color-mix(in srgb, var(--secondary) 15%, var(--background))',
  color: 'var(--secondary)',
  border: '1px solid color-mix(in srgb, var(--secondary) 50%, transparent)',
};

export default function ContentPage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      const r = await fetch('/api/admin/content/sections');
      const d = await r.json();
      setSections(Array.isArray(d) ? d : []);
    } catch { setSections([]); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() =>
    sections.filter(s =>
      s.label.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
    ), [sections, query]);

  const action = async (type: 'publish' | 'duplicate' | 'delete', id: string) => {
    const ep = type === 'publish' ? `/api/admin/content/${id}/publish`
      : type === 'duplicate' ? `/api/admin/content/${id}/duplicate`
      : `/api/admin/content/${id}`;
    await fetch(ep, { method: type === 'delete' ? 'DELETE' : 'POST' });
    await load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(s => s.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sorted.length) return;
    [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
    await fetch('/api/admin/content/order', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections: sorted.map(s => s.id) }),
    });
    await load();
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>Section Builder</h2>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search sections…"
          className="rounded-lg px-3 py-2 text-sm w-full sm:w-48"
          style={inp} />
      </div>

      <div className="grid gap-3">
        {filtered.map(item => (
          <div key={item.id} className="rounded-xl p-4" style={{ background: 'var(--surface)', ...cb }}>
            {/* Info row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold truncate" style={{ color: 'var(--text)' }}>
                  {item.label}
                </h3>
                <p className="text-xs sm:text-sm opacity-60 mt-0.5">{item.description}</p>
                <p className="mt-1 text-xs opacity-40">
                  Fields: {item.fields} &nbsp;|&nbsp;
                  <span style={{ color: item.status === 'published' ? 'var(--accent)' : 'var(--secondary)', fontWeight: 600 }}>
                    {item.status}
                  </span>
                  &nbsp;|&nbsp;{item.updatedBy || 'n/a'}
                </p>
              </div>

              {/* Action buttons — wrap nicely on mobile */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Link href={`/admin/content/${item.id}`}
                  className="rounded px-2.5 py-1.5 text-xs font-semibold text-white"
                  style={{ background: 'var(--primary)' }}>Edit</Link>
                <Link href={`/admin/content/${item.id}`}
                  className="rounded px-2.5 py-1.5 text-xs font-medium"
                  style={ghost}>Preview</Link>
                <button onClick={() => action('publish', item.id)}
                  className="rounded px-2.5 py-1.5 text-xs font-medium text-white"
                  style={{ background: 'var(--accent)' }}>Publish</button>
                <button onClick={() => action('duplicate', item.id)}
                  className="rounded px-2.5 py-1.5 text-xs font-medium text-white"
                  style={{ background: 'var(--secondary)' }}>Dupe</button>
                <button onClick={() => action('delete', item.id)}
                  className="rounded px-2.5 py-1.5 text-xs font-medium"
                  style={danger}>Del</button>
                <button onClick={() => move(item.id, -1)}
                  className="rounded px-2.5 py-1.5 text-xs font-medium"
                  style={ghost}>↑</button>
                <button onClick={() => move(item.id, 1)}
                  className="rounded px-2.5 py-1.5 text-xs font-medium"
                  style={ghost}>↓</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm opacity-50">No sections found.</p>}
      </div>
    </div>
  );
}
