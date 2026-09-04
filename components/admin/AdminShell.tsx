'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { themes, ThemeKey } from '@/lib/theme';
import { FaPalette } from 'react-icons/fa';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/history', label: 'History' },
  { href: '/admin/contact-forms', label: 'Contact Forms' },
  { href: '/admin/settings', label: 'Settings' },
];

// Border colour that works on both dark and light themes
const borderStyle = { border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)' };
const inputStyle: React.CSSProperties = {
  background: 'var(--background)',
  color: 'var(--text)',
  border: '1px solid color-mix(in srgb, var(--primary) 40%, transparent)',
  outline: 'none',
};

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const crumbs = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) { setSessionChecked(true); return; }
    fetch('/api/admin/auth/me')
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          // Poll unread messages count
          fetch('/api/admin/contact-submissions')
            .then((r) => r.json())
            .then((data) => {
              if (Array.isArray(data)) {
                setUnreadCount(data.filter((s: any) => !s.read).length);
              }
            })
            .catch(() => {});
        } else {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        }
      })
      .catch(() => router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`))
      .finally(() => setSessionChecked(true));
  }, [pathname, isLoginPage, router]);

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const filtered = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  if (isLoginPage) return <>{children}</>;

  if (!sessionChecked || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--background)' }}>
        <p className="text-sm opacity-50">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--text)' }}>
      <div className="grid min-h-screen md:grid-cols-[250px_1fr]">

        {/* Sidebar */}
        <aside
          className="p-5"
          style={{ background: 'var(--surface)', borderRight: '1px solid color-mix(in srgb, var(--text) 15%, transparent)' }}
        >
          <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Portfolio CMS</h1>
          <p className="mt-1 text-xs opacity-50">Content manager</p>
          <nav className="mt-8 space-y-1">
            {filtered.map((item) => {
              const active = pathname.startsWith(item.href);
              const badge = item.href === '/admin/contact-forms' && unreadCount > 0 ? unreadCount : 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all"
                  style={
                    active
                      ? { background: 'var(--primary)', color: '#fff' }
                      : { color: 'var(--text)', opacity: 0.7 }
                  }
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.opacity = '0.7'; }}
                >
                  <span>{item.label}</span>
                  {badge > 0 && (
                    <span className="rounded-full px-1.5 py-0.5 text-xs font-bold text-white"
                      style={{ background: active ? 'rgba(255,255,255,0.3)' : 'var(--primary)', minWidth: '1.25rem', textAlign: 'center' }}>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="p-4 md:p-8">
          <header
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
            style={{ background: 'var(--surface)', ...borderStyle }}
          >
            <div>
              <div className="text-xs opacity-50">Breadcrumb</div>
              <div className="text-sm capitalize font-medium">{crumbs.join(' / ') || 'admin'}</div>
            </div>

            <div className="flex items-center gap-2">
              {/* Nav search */}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-lg px-3 py-2 text-sm"
                style={inputStyle}
                placeholder="Search navigation..."
              />

              {/* Theme picker */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu((v) => !v)}
                  className="rounded-lg px-3 py-2 text-sm flex items-center gap-1 transition-opacity hover:opacity-80"
                  style={{ background: 'var(--surface)', color: 'var(--text)', ...borderStyle }}
                >
                  <FaPalette style={{ color: 'var(--primary)' }} />
                  <span className="hidden sm:inline">{themes[theme]?.name ?? 'Theme'}</span>
                </button>
                {showThemeMenu && (
                  <div
                    className="absolute right-0 mt-1 w-48 rounded-lg shadow-xl z-50 overflow-hidden"
                    style={{ background: 'var(--surface)', ...borderStyle }}
                  >
                    {Object.entries(themes).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => { setTheme(key as ThemeKey); setShowThemeMenu(false); }}
                        className="w-full px-4 py-2 text-left text-sm transition-opacity hover:opacity-80"
                        style={
                          theme === key
                            ? { background: 'var(--primary)', color: '#fff' }
                            : { color: 'var(--text)' }
                        }
                      >
                        {val.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: '#dc2626' }}
              >
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
