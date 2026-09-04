'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { themes, ThemeKey } from '@/lib/theme';
import {
  FaPalette,
  FaTachometerAlt,
  FaLayerGroup,
  FaHistory,
  FaEnvelopeOpen,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const NAV_ITEMS = [
  { href: '/admin/dashboard',     label: 'Dashboard',      Icon: FaTachometerAlt },
  { href: '/admin/content',       label: 'Content',         Icon: FaLayerGroup },
  { href: '/admin/history',       label: 'History',         Icon: FaHistory },
  { href: '/admin/contact-forms', label: 'Contact Forms',   Icon: FaEnvelopeOpen },
  { href: '/admin/settings',      label: 'Settings',        Icon: FaCog },
];

const border = (opacity = 20) =>
  `1px solid color-mix(in srgb, var(--text) ${opacity}%, transparent)`;

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { theme, setTheme } = useTheme();

  // Sidebar states
  const [collapsed,    setCollapsed]    = useState(false);   // desktop collapse
  const [mobileOpen,   setMobileOpen]   = useState(false);   // mobile drawer

  // Header states
  const [showTheme,    setShowTheme]    = useState(false);
  const [sessionOk,    setSessionOk]    = useState(false);
  const [authed,       setAuthed]       = useState(false);
  const [unread,       setUnread]       = useState(0);

  const themeRef  = useRef<HTMLDivElement>(null);
  const isLogin   = pathname === '/admin/login';

  /* ── Session check ────────────────────────────────────────── */
  useEffect(() => {
    if (isLogin) { setSessionOk(true); return; }
    fetch('/api/admin/auth/me')
      .then(r => {
        if (r.ok) {
          setAuthed(true);
          fetch('/api/admin/contact-submissions')
            .then(r2 => r2.json())
            .then(d => Array.isArray(d) && setUnread(d.filter((s: any) => !s.read).length))
            .catch(() => {});
        } else {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        }
      })
      .catch(() => router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`))
      .finally(() => setSessionOk(true));
  }, [pathname, isLogin, router]);

  /* ── Close theme menu on outside click ───────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setShowTheme(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Close mobile drawer on route change ─────────────────── */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  /* ── Crumbs ───────────────────────────────────────────────── */
  const crumbs = pathname.split('/').filter(Boolean);

  if (isLogin) return <>{children}</>;

  if (!sessionOk || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--background)' }}>
        <p className="text-sm opacity-40">Verifying session…</p>
      </div>
    );
  }

  /* ── Sidebar inner ────────────────────────────────────────── */
  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo + collapse btn */}
      <div className="flex items-center justify-between p-4 pb-3">
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="text-base font-bold leading-tight truncate"
              style={{ color: 'var(--primary)' }}>Portfolio CMS</p>
            <p className="text-xs opacity-40 truncate">Content manager</p>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(v => !v)}
            className="ml-auto rounded-lg p-1.5 transition-opacity hover:opacity-70"
            style={{ color: 'var(--text)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FaChevronRight size={13} /> : <FaChevronLeft size={13} />}
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-1.5" style={{ color: 'var(--text)' }}>
            <FaTimes size={16} />
          </button>
        )}
      </div>

      <div className="mx-3 mb-3" style={{ borderBottom: border(10) }} />

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          const badge  = href === '/admin/contact-forms' && unread > 0 ? unread : 0;
          return (
            <Link key={href} href={href}
              title={collapsed && !mobile ? label : undefined}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group"
              style={active
                ? { background: 'var(--primary)', color: '#fff' }
                : { color: 'var(--text)' }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              <Icon size={15} className="shrink-0" />
              {(!collapsed || mobile) && (
                <>
                  <span className="flex-1 truncate">{label}</span>
                  {badge > 0 && (
                    <span className="rounded-full px-1.5 py-0.5 text-xs font-bold leading-none"
                      style={{
                        background: active ? 'rgba(255,255,255,0.3)' : 'var(--primary)',
                        color: '#fff',
                        minWidth: '1.1rem',
                        textAlign: 'center',
                      }}>
                      {badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && !mobile && badge > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full"
                  style={{ background: 'var(--primary)' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <div className="p-2 mt-2" style={{ borderTop: border(10) }}>
        <button onClick={logout}
          title={collapsed && !mobile ? 'Logout' : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            background: 'color-mix(in srgb, var(--secondary) 18%, var(--background))',
            color: 'var(--secondary)',
            border: '1px solid color-mix(in srgb, var(--secondary) 40%, transparent)',
          }}>
          <FaSignOutAlt size={14} className="shrink-0" />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)', color: 'var(--text)' }}>

      {/* ── Desktop sidebar ──────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col sticky top-0 h-screen shrink-0 transition-all duration-200"
        style={{
          width: collapsed ? '64px' : '220px',
          background: 'var(--surface)',
          borderRight: border(15),
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer overlay ────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-64 z-50"
            style={{ background: 'var(--surface)', borderRight: border(15) }}>
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Top header */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3"
          style={{ background: 'var(--surface)', borderBottom: border(15) }}>

          {/* Left — mobile hamburger + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)}
              className="md:hidden rounded-lg p-1.5 transition-opacity hover:opacity-70"
              style={{ color: 'var(--text)' }}>
              <FaBars size={16} />
            </button>
            <div className="hidden sm:block min-w-0">
              <p className="text-xs opacity-40 leading-none mb-0.5">Navigation</p>
              <p className="text-sm font-medium capitalize truncate">
                {crumbs.join(' / ') || 'admin'}
              </p>
            </div>
          </div>

          {/* Right — theme + (no logout here, it's in sidebar) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme picker */}
            <div className="relative" ref={themeRef}>
              <button onClick={() => setShowTheme(v => !v)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-opacity hover:opacity-80"
                style={{ background: 'var(--background)', color: 'var(--text)', border: border(20) }}>
                <FaPalette size={13} style={{ color: 'var(--primary)' }} />
                <span className="hidden sm:inline text-xs">{themes[theme]?.name ?? 'Theme'}</span>
              </button>
              {showTheme && (
                <div className="absolute right-0 mt-1 w-44 rounded-xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: 'var(--surface)', border: border(20) }}>
                  {Object.entries(themes).map(([key, val]) => (
                    <button key={key}
                      onClick={() => { setTheme(key as ThemeKey); setShowTheme(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-opacity hover:opacity-80"
                      style={theme === key
                        ? { background: 'var(--primary)', color: '#fff' }
                        : { color: 'var(--text)' }}>
                      {val.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
