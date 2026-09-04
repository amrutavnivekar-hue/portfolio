export const themes = {
  midnight: {
    name: 'Midnight Professional',
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#38BDF8',
    secondary: '#818CF8',
    accent: '#22C55E',
    text: '#F8FAFC',
  },
  luxury: {
    name: 'Luxury Purple',
    background: '#111827',
    surface: '#1F2937',
    primary: '#A855F7',
    secondary: '#EC4899',
    accent: '#FBBF24',
    text: '#FFFFFF',
  },
  light: {
    name: 'Soft Light',
    background: '#FFFFFF',
    surface: '#F3F4F6',
    primary: '#2563EB',
    secondary: '#14B8A6',
    accent: '#F97316',
    text: '#1E293B',
  },
  rose: {
    name: 'Rose Gold Premium',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    primary: '#D4A373',
    secondary: '#FFD6A5',
    accent: '#E76F51',
    text: '#FAFAFA',
  },
};

export type ThemeKey = keyof typeof themes;

export function getTheme(key: ThemeKey) {
  return themes[key];
}

export function setTheme(key: ThemeKey) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', key);
    document.documentElement.setAttribute('data-theme', key);
  }
}

export function getStoredTheme(): ThemeKey {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as ThemeKey;
    return stored && themes[stored] ? stored : 'midnight';
  }
  return 'midnight';
}

export function applyTheme(key: ThemeKey) {
  const theme = getTheme(key);
  const root = document.documentElement;
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--surface', theme.surface);
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--text', theme.text);
  root.setAttribute('data-theme', key);
}
