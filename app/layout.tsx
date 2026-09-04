import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Amruta Nivekar | Full Stack Developer',
  description: 'Portfolio of Amruta Nivekar - Full Stack Developer specializing in React, Next.js, and modern web technologies.',
  keywords: ['Full Stack Developer', 'React', 'Next.js', 'Web Developer', 'Portfolio'],
  openGraph: {
    title: 'Amruta Nivekar | Full Stack Developer',
    description: 'Portfolio of Amruta Nivekar - Full Stack Developer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amruta Nivekar | Full Stack Developer',
    description: 'Portfolio of Amruta Nivekar - Full Stack Developer',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
