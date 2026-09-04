'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface SectionItem {
  id: string;
  label: string;
  description: string;
  fields: number;
  enabled: boolean;
  order: number;
  status: 'draft' | 'published';
  updatedAt: string | null;
  updatedBy: string | null;
}

export default function ContentPage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [query, setQuery] = useState('');

  const load = async () => {
    const res = await fetch('/api/admin/content/sections');
    const data = await res.json();
    setSections(data);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      sections.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      ),
    [sections, query]
  );

  const action = async (type: 'publish' | 'duplicate' | 'delete', section: string) => {
    const endpoint =
      type === 'publish'
        ? `/api/admin/content/${section}/publish`
        : type === 'duplicate'
          ? `/api/admin/content/${section}/duplicate`
          : `/api/admin/content/${section}`;
    await fetch(endpoint, { method: type === 'delete' ? 'DELETE' : 'POST' });
    await load();
  };

  const move = async (section: string, direction: -1 | 1) => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === section);
    const swapIdx = idx + direction;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    [sorted[idx], sorted[swapIdx]] = [sorted[swapIdx], sorted[idx]];
    await fetch('/api/admin/content/order', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections: sorted.map((s) => s.id) }),
    });
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Section Builder</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sections..."
          className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{item.label}</h3>
                <p className="text-sm text-slate-400">{item.description}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Fields: {item.fields} | Status: {item.status} | Updated by: {item.updatedBy || 'n/a'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/content/${item.id}`}
                  className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/content/${item.id}`}
                  className="rounded border border-white/20 px-3 py-2 text-xs"
                >
                  Preview
                </Link>
                <button onClick={() => action('publish', item.id)} className="rounded bg-emerald-600 px-3 py-2 text-xs">
                  Publish
                </button>
                <button onClick={() => action('duplicate', item.id)} className="rounded bg-amber-600 px-3 py-2 text-xs">
                  Duplicate
                </button>
                <button onClick={() => action('delete', item.id)} className="rounded bg-red-600 px-3 py-2 text-xs">
                  Delete
                </button>
                <button onClick={() => move(item.id, -1)} className="rounded border border-white/20 px-3 py-2 text-xs">
                  Up
                </button>
                <button onClick={() => move(item.id, 1)} className="rounded border border-white/20 px-3 py-2 text-xs">
                  Down
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
