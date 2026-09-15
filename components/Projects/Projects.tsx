'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { defaultProjects } from '@/lib/defaultData';

interface Project {
  name: string;
  description: string;
  technologies: string;
  github_link?: string;
  demo_link?: string;
  github?: string;
  demo?: string;
}

interface ProjectsProps {
  projects?: any[];
}

export default function Projects({ projects }: ProjectsProps) {
  const list: Project[] = projects && projects.length > 0 ? projects : defaultProjects;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
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
    <section id="projects" className="py-20 px-4">
      <motion.h2
        className="section-title gradient-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Projects
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Featured projects and case studies
      </motion.p>

      <motion.div
        className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {list.map((project, index) => {
          const githubUrl = project.github_link || project.github;
          const demoUrl = project.demo_link || project.demo;
          const techList = typeof project.technologies === 'string'
            ? project.technologies.split(',').map(t => t.trim()).filter(Boolean)
            : [];

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass rounded-2xl overflow-hidden card-hover group"
            >
              <div className="h-48 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] opacity-20 flex items-center justify-center">
                <div className="text-6xl">🚀</div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{project.name}</h3>

                <p className="text-[var(--text)] opacity-80 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {techList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {techList.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[var(--primary)] bg-opacity-20 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  {githubUrl && (
                    <motion.a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-[var(--primary)] transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaGithub />
                      <span>Code</span>
                    </motion.a>
                  )}

                  {demoUrl && (
                    <motion.a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-lg hover:opacity-90 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaExternalLinkAlt />
                      <span>Live Demo</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
