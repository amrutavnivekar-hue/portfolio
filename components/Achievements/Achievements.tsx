'use client';

import { motion, useInView } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useRef, useEffect, useState } from 'react';

interface Achievement {
  title: string;
  count_value: string;
  icon: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const AnimatedCounter = ({ value }: { value: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [started, setStarted] = useState(false);

  const numericValue = parseFloat(value);
  const isDecimal = value.includes('.');
  const decimalPlaces = isDecimal ? value.split('.')[1].length : 0;
  const suffix = value.replace(/^[\d.]+/, '');

  // Only start counting when element is in view
  useEffect(() => {
    if (isInView) setStarted(true);
  }, [isInView]);

  const spring = useSpring({
    from: { number: 0 },
    to: { number: started ? numericValue : 0 },
    config: { duration: 2000 },
  });

  return (
    <span ref={ref}>
      <animated.span>
        {spring.number.to((n) =>
          isDecimal ? n.toFixed(decimalPlaces) + suffix : Math.floor(n) + suffix
        )}
      </animated.span>
    </span>
  );
};

export default function Achievements({ achievements }: AchievementsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="achievements" className="py-20 px-4">
      <motion.h2
        className="section-title gradient-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Achievements
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Milestones and accomplishments
      </motion.p>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass rounded-2xl p-8 text-center card-hover"
          >
            <div className="text-5xl mb-4">{achievement.icon}</div>

            <div className="text-4xl font-bold gradient-text mb-2">
              <AnimatedCounter value={String(achievement.count_value)} />
            </div>

            <p className="text-lg font-medium opacity-80">{achievement.title}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
