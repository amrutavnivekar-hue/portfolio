'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaCalendar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  technologies: string;
  description: string;
}

interface ExperienceProps {
  experiences: ExperienceItem[];
}

export default function Experience({ experiences }: ExperienceProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const goTo = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  const prev = () => { if (active > 0) goTo(active - 1); };
  const next = () => { if (active < experiences.length - 1) goTo(active + 1); };

  const cardVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    }),
  };

  if (!experiences.length) return null;

  const exp = experiences[active];

  return (
    <section id="experience" className="py-20 px-4">
      <motion.h2
        className="section-title gradient-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Experience
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        My professional journey
      </motion.p>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* ── Left: Vertical timeline nav ── */}
          <div className="md:w-56 shrink-0">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] opacity-30 rounded-full" />

              <div className="space-y-0">
                {experiences.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="relative flex items-start gap-4 w-full text-left py-4 group"
                  >
                    {/* Dot */}
                    <div className={`relative z-10 mt-1 w-[14px] h-[14px] shrink-0 rounded-full border-2 transition-all duration-300 ${
                      active === i
                        ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] border-transparent scale-125 shadow-lg shadow-[var(--primary)]/40'
                        : 'bg-[var(--background)] border-[var(--primary)] opacity-50 group-hover:opacity-100'
                    }`} />

                    {/* Label */}
                    <div className={`transition-all duration-300 ${active === i ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`}>
                      <p className={`text-sm font-semibold leading-tight ${active === i ? 'text-[var(--primary)]' : ''}`}>
                        {e.company}
                      </p>
                      <p className="text-xs opacity-70 mt-0.5">{e.duration}</p>
                    </div>

                    {/* Active indicator bar */}
                    {active === i && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Sliding card ── */}
          <div className="flex-1 min-w-0">
            {/* Slider card area */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="glass rounded-2xl p-6 md:p-8"
                >
                  {/* Card header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
                      <FaBuilding className="text-white text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl leading-tight">{exp.company}</h3>
                      <p className="text-[var(--primary)] font-medium mt-0.5">{exp.role}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm opacity-60">
                        <FaCalendar className="shrink-0" />
                        <span>{exp.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm opacity-80 leading-relaxed mb-6">
                    {exp.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.split(', ').map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[var(--primary)] bg-opacity-20 border border-[var(--primary)] border-opacity-20 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prev / Next controls + dots */}
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={prev}
                disabled={active === 0}
                className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:bg-opacity-20 transition-all"
              >
                <FaChevronLeft className="text-xs" /> Prev
              </button>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {experiences.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      active === i
                        ? 'w-6 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]'
                        : 'w-2 bg-[var(--primary)] opacity-30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                disabled={active === experiences.length - 1}
                className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:bg-opacity-20 transition-all"
              >
                Next <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
