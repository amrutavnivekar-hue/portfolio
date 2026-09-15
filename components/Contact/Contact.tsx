'use client';

import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function Contact() {
  const [contact, setContact] = useState<any>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/contact')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(setContact)
      .catch(err => setError(err.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!contact) return null;

  return (
    <section id="contact" className="py-20 px-4">
      <motion.h2
        className="section-title gradient-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Contact
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Get in touch with me
      </motion.p>

      {error && (
        <div className="glass rounded-xl p-4 text-red-400 mb-6">
          Error loading contact: {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-6 gradient-text">Let&apos;s Connect</h3>

          <div className="space-y-6">
            <motion.div
              className="flex items-center gap-4 glass rounded-xl p-4 card-hover"
              whileHover={{ x: 5 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                <FaEnvelope className="text-white" />
              </div>
              <div>
                <p className="text-sm opacity-60">Email</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 glass rounded-xl p-4 card-hover"
              whileHover={{ x: 5 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                <FaPhone className="text-white" />
              </div>
              <div>
                <p className="text-sm opacity-60">Phone</p>
                <p className="font-medium">{contact.phone}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 glass rounded-xl p-4 card-hover"
              whileHover={{ x: 5 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                <FaMapMarkerAlt className="text-white" />
              </div>
              <div>
                <p className="text-sm opacity-60">Location</p>
                <p className="font-medium">{contact.location}</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-8">
            <p className="text-sm opacity-60 mb-4">Follow me on social media</p>
            <div className="flex gap-4">
              {contact.linkedin && (
                <motion.a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[var(--primary)] transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaLinkedin className="text-xl" />
                </motion.a>
              )}

              {contact.github && (
                <motion.a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[var(--primary)] transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGithub className="text-xl" />
                </motion.a>
              )}

              {contact.twitter && (
                <motion.a
                  href={contact.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[var(--primary)] transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTwitter className="text-xl" />
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-white/10 focus:border-[var(--primary)] focus:outline-none transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-white/10 focus:border-[var(--primary)] focus:outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-white/10 focus:border-[var(--primary)] focus:outline-none transition-all resize-none"
                placeholder="Your message..."
              />
            </div>

            <motion.button
              type="submit"
              className="w-full btn-primary disabled:opacity-60"
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </motion.button>

            {submitStatus === 'success' && (
              <p className="text-center text-sm text-green-400">✓ Message sent! I&apos;ll get back to you soon.</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-center text-sm text-red-400">Something went wrong. Please try again.</p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
