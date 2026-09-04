'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((res) => {
        if (res.ok) {
          const params = new URLSearchParams(window.location.search);
          const next = params.get('next');
          const dest =
            next && next.startsWith('/') && !next.startsWith('//')
              ? next
              : '/admin/dashboard';
          router.replace(dest);
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      const params = new URLSearchParams(window.location.search);
      const nextParam = params.get('next');
      const nextUrl =
        nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
          ? nextParam
          : '/admin/dashboard';
      window.location.replace(nextUrl);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--background)' }}
      >
        <p className="text-sm opacity-50">Checking session...</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: 'var(--background)', color: 'var(--text)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 p-8"
        style={{ background: 'var(--surface)' }}
      >
        <h1
          className="text-center text-2xl font-bold"
          style={{ color: 'var(--primary)' }}
        >
          Portfolio CMS
        </h1>
        <p className="mt-1 text-center text-xs opacity-50">Admin access only</p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit} autoComplete="off">
          <div>
            <label className="mb-1 block text-sm opacity-70">Username</label>
            <input
              autoComplete="off"
              className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
              style={{ background: 'var(--background)', color: 'var(--text)' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm opacity-70">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full rounded-lg border border-white/10 px-3 py-2 pr-10 text-sm outline-none focus:border-[var(--primary)]"
                style={{ background: 'var(--background)', color: 'var(--text)' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
            style={{ background: 'var(--primary)' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
