'use client';

import { motion } from 'framer-motion';
import { FaGraduationCap, FaUniversity, FaCalendar } from 'react-icons/fa';
import { useState } from 'react';
import { defaultEducation } from '@/lib/defaultData';

export default function Education({ education: initialEducation }: { education?: any[] }) {
  const educationList = initialEducation && initialEducation.length > 0 ? initialEducation : defaultEducation;

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
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="education" className="py-20 px-4">
      <motion.h2
        className="section-title gradient-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Education
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        My academic background
      </motion.p>

      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Timeline Line */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] rounded-full" />

          <div className="space-y-8 pl-16">
            {educationList.map((degree, index) => {
              const degreeName = degree.degree_name || degree.name || 'Degree';
              const institution = degree.institution || 'University';
              const duration = degree.duration || degree.year || '';
              const score = degree.score || '';

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Timeline Node */}
                  <div className="absolute left-[-2.5rem] top-6 w-6 h-6 bg-[var(--primary)] rounded-full border-4 border-[var(--background)] z-10" />

                  <motion.div
                    className="glass rounded-2xl p-8 card-hover"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center flex-shrink-0">
                        <FaGraduationCap className="text-white text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{degreeName}</h3>
                        <div className="flex items-center gap-2 text-[var(--primary)] mb-2">
                          <FaUniversity />
                          <span className="font-medium">{institution}</span>
                        </div>
                        {duration && (
                          <div className="flex items-center gap-2 text-sm opacity-60">
                            <FaCalendar />
                            <span>{duration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {score && (
                      <div className="glass-dark rounded-xl p-4 inline-block">
                        <p className="text-sm">
                          <span className="opacity-60">Score:</span>{' '}
                          <span className="font-bold text-[var(--accent)]">{score}</span>
                        </p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
