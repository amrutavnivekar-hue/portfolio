'use client';

import { motion } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt, FaCalendar } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function Certifications() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/certifications')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(setCertifications)
      .catch(err => setError(err.message));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="certifications" className="py-20 px-4">
      <motion.h2
        className="section-title gradient-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Certifications
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Professional certifications and credentials
      </motion.p>

      {error && (
        <div className="glass rounded-xl p-4 text-red-400 mb-6">
          Error loading certifications: {error}
        </div>
      )}

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass rounded-2xl p-6 card-hover group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaCertificate className="text-white text-2xl" />
            </div>

            <h3 className="text-xl font-bold mb-2">{cert.name}</h3>

            <p className="text-[var(--primary)] font-medium mb-3">{cert.organization}</p>

            <div className="flex items-center gap-2 text-sm opacity-60 mb-4">
              <FaCalendar />
              <span>{cert.date}</span>
            </div>

            {cert.link && (
              <motion.a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
                whileHover={{ x: 5 }}
              >
                <span>View Credential</span>
                <FaExternalLinkAlt className="text-xs" />
              </motion.a>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
