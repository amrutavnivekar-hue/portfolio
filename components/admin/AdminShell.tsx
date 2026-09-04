'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useMemo, useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/history', label: 'History' },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const crumbs = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-admin-theme', nextTheme);
  };

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const filtered = navItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen md:grid-cols-[250px_1fr]">
        <aside className="border-r border-white/10 bg-slate-900/80 p-5">
          <h1 className="text-xl font-bold text-blue-400">Portfolio CMS</h1>
          <p className="mt-1 text-xs text-slate-400">XML-first content manager</p>
          <nav className="mt-8 space-y-2">
            {filtered.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="p-4 md:p-8">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4">
            <div>
              <div className="text-xs text-slate-400">Breadcrumb</div>
              <div className="text-sm capitalize text-slate-200">{crumbs.join(' / ') || 'admin'}</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                placeholder="Search navigation..."
              />
              <button onClick={toggleTheme} className="rounded-lg border border-white/10 px-3 py-2 text-sm">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
              <button onClick={logout} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">
                Logout
              </button>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
