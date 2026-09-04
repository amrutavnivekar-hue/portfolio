'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSun, FaMoon, FaPalette, FaDownload } from 'react-icons/fa';
import { useTheme } from '@/components/ThemeProvider';
import { themes, ThemeKey } from '@/lib/theme';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'experience', 'skills', 'education', 'certifications', 'projects', 'achievements', 'testimonials', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleThemeChange = (newTheme: ThemeKey) => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.a
            href="#home"
            className="text-2xl font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
          >
            AN
          </motion.a>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.href.slice(1)
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white'
                    : 'hover:bg-[var(--surface)]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}

            <div className="relative ml-4">
              <motion.button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaPalette className="text-[var(--primary)]" />
              </motion.button>

              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-xl overflow-hidden"
                  >
                    {Object.entries(themes).map(([key, value]) => (
                      <motion.button
                        key={key}
                        onClick={() => handleThemeChange(key as ThemeKey)}
                        className={`w-full px-4 py-3 text-left text-sm transition-all ${
                          theme === key
                            ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]'
                            : 'hover:bg-[var(--surface)]'
                        }`}
                        whileHover={{ x: 5 }}
                      >
                        {value.name}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.a
              href="/resume.pdf"
              download
              className="ml-4 btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload />
              <span>Resume</span>
            </motion.a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <motion.a
              href="/resume.pdf"
              download
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaDownload className="text-[var(--primary)]" />
            </motion.a>

            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-4 mx-4 rounded-lg overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeSection === item.href.slice(1)
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white'
                      : 'hover:bg-[var(--surface)]'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  {item.name}
                </motion.a>
              ))}

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-[var(--primary)] mb-2 px-4">Select Theme</p>
                {Object.entries(themes).map(([key, value]) => (
                  <motion.button
                    key={key}
                    onClick={() => handleThemeChange(key as ThemeKey)}
                    className={`w-full px-4 py-3 text-left text-sm transition-all ${
                      theme === key
                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]'
                        : 'hover:bg-[var(--surface)]'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {value.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
