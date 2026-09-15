'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';
import { defaultTestimonials } from '@/lib/defaultData';

export default function Testimonials({ testimonials: initialTestimonials }: { testimonials?: any[] }) {
  const testimonials = initialTestimonials && initialTestimonials.length > 0 ? initialTestimonials : defaultTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    nextTestimonial();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevTestimonial();
  };

  if (!testimonials.length) return null;

  const current = testimonials[currentIndex] || testimonials[0];
  const authorName = current.author_name || current.name || 'Anonymous';
  const authorRole = current.author_role || current.role || '';
  const text = current.text || '';

  return (
    <section id="testimonials" className="py-20 px-4">
      <motion.h2
        className="section-title gradient-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Testimonials
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        What clients and colleagues say
      </motion.p>

      <div className="max-w-4xl mx-auto relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="glass rounded-2xl p-8 md:p-12"
          >
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-white">
                  {authorName.charAt(0)}
                </span>
              </div>

              <div className="flex-1">
                <FaQuoteLeft className="text-[var(--primary)] text-3xl mb-4 opacity-50" />

                <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
                  {text}
                </p>

                <div>
                  <h4 className="font-bold text-xl">{authorName}</h4>
                  {authorRole && <p className="text-[var(--primary)]">{authorRole}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[var(--primary)] transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronLeft />
          </motion.button>

          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-[var(--primary)] w-8' : 'glass'
              }`}
            />
          ))}

          <motion.button
            onClick={handleNext}
            className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[var(--primary)] transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronRight />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
