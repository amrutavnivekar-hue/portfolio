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

const borderStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)',
};

const inputStyle: React.CSSProperties = {
  background: 'var(--background)',
  color: 'var(--text)',
  border: '1px solid color-mix(in srgb, var(--primary) 50%, transparent)',
  outline: 'none',
};

const ghostBtnStyle: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--text)',
  border: '1px solid color-mix(in srgb, var(--text) 30%, transparent)',
};

export default function ContentPage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/content/sections');
      const data = await res.json();
      setSections(Array.isArray(data) ? data : []);
    } catch {
      setSections([]);
    }
  };

  useEffect(() => { load(); }, []);

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
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Section Builder</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sections..."
          className="rounded-lg px-3 py-2 text-sm"
          style={inputStyle}
        />
      </div>

      {/* Section cards */}
      <div className="grid gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl p-4"
            style={{ background: 'var(--surface)', ...borderStyle }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Info */}
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text)' }}>{item.label}</h3>
                <p className="text-sm opacity-60">{item.description}</p>
                <p className="mt-1 text-xs opacity-40">
                  Fields: {item.fields} &nbsp;|&nbsp;
                  <span style={{ color: item.status === 'published' ? 'var(--accent)' : 'var(--secondary)', fontWeight: 600 }}>
                    {item.status}
                  </span>
                  &nbsp;|&nbsp; Updated by: {item.updatedBy || 'n/a'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {/* Edit */}
                <Link
                  href={`/admin/content/${item.id}`}
                  className="rounded px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
                  style={{ background: 'var(--primary)' }}
                >
                  Edit
                </Link>

                {/* Preview — uses outline style so it's always visible */}
                <Link
                  href={`/admin/content/${item.id}`}
                  className="rounded px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                  style={ghostBtnStyle}
                >
                  Preview
                </Link>

                {/* Publish */}
                <button
                  onClick={() => action('publish', item.id)}
                  className="rounded px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                  style={{ background: 'var(--accent)' }}
                >
                  Publish
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => action('duplicate', item.id)}
                  className="rounded px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                  style={{ background: 'var(--secondary)' }}
                >
                  Duplicate
                </button>

                {/* Delete */}
                <button
                  onClick={() => action('delete', item.id)}
                  className="rounded px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                  style={{ background: '#dc2626' }}
                >
                  Delete
                </button>

                {/* Up / Down */}
                <button
                  onClick={() => move(item.id, -1)}
                  className="rounded px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                  style={ghostBtnStyle}
                >
                  ↑
                </button>
                <button
                  onClick={() => move(item.id, 1)}
                  className="rounded px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                  style={ghostBtnStyle}
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm opacity-50">No sections found.</p>
        )}
      </div>
    </div>
  );
}
