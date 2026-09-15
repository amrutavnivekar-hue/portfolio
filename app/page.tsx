import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Experience from '@/components/Experience/Experience';
import Skills from '@/components/Skills/Skills';
import Education from '@/components/Education/Education';
import Certifications from '@/components/Certifications/Certifications';
import Projects from '@/components/Projects/Projects';
import Achievements from '@/components/Achievements/Achievements';
import Testimonials from '@/components/Testimonials/Testimonials';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import { query } from '@/lib/db';

import {
  defaultProfile,
  defaultContact,
  defaultEducation,
  defaultCertifications,
  defaultTestimonials,
  defaultExperiences,
  defaultSkillCategories,
  defaultProjects,
  defaultAchievements,
} from '@/lib/defaultData';

export const revalidate = 60; // Revalidate at most once every minute for edge caching

async function getProfile() {
  try {
    const rows = (await query('SELECT * FROM profile ORDER BY id DESC LIMIT 1')) as any[];
    return rows?.[0] || defaultProfile;
  } catch {
    return defaultProfile;
  }
}

async function getExperiences() {
  try {
    const rows = (await query('SELECT * FROM experiences ORDER BY display_order ASC')) as any[];
    return rows && rows.length > 0 ? rows : defaultExperiences;
  } catch {
    return defaultExperiences;
  }
}

async function getSkillCategories() {
  try {
    const [categories, skills] = await Promise.all([
      query('SELECT * FROM skill_categories ORDER BY display_order ASC') as Promise<any[]>,
      query('SELECT * FROM skills ORDER BY display_order ASC') as Promise<any[]>,
    ]);
    const mapped = (categories || []).map((cat: any) => ({
      name: cat.name,
      skills: (skills || [])
        .filter((s: any) => s.category_id === cat.id)
        .map((s: any) => ({ name: s.name, level: s.level })),
    }));
    return mapped.length > 0 ? mapped : defaultSkillCategories;
  } catch {
    return defaultSkillCategories;
  }
}

async function getEducation() {
  try {
    const rows = (await query('SELECT * FROM education ORDER BY display_order ASC')) as any[];
    return rows && rows.length > 0 ? rows : defaultEducation;
  } catch {
    return defaultEducation;
  }
}

async function getCertifications() {
  try {
    const rows = (await query('SELECT * FROM certifications ORDER BY display_order ASC')) as any[];
    return rows && rows.length > 0 ? rows : defaultCertifications;
  } catch {
    return defaultCertifications;
  }
}

async function getAchievements() {
  try {
    const rows = (await query('SELECT * FROM achievements ORDER BY display_order ASC')) as any[];
    return rows && rows.length > 0 ? rows : defaultAchievements;
  } catch {
    return defaultAchievements;
  }
}

async function getProjects() {
  try {
    const rows = (await query('SELECT * FROM projects ORDER BY display_order ASC')) as any[];
    return rows && rows.length > 0 ? rows : defaultProjects;
  } catch {
    return defaultProjects;
  }
}

async function getTestimonials() {
  try {
    const rows = (await query('SELECT * FROM testimonials ORDER BY display_order ASC')) as any[];
    return rows && rows.length > 0 ? rows : defaultTestimonials;
  } catch {
    return defaultTestimonials;
  }
}

async function getContact() {
  try {
    const rows = (await query('SELECT * FROM contact ORDER BY id DESC LIMIT 1')) as any[];
    return rows?.[0] || defaultContact;
  } catch {
    return defaultContact;
  }
}

export default async function Home() {
  const [
    profile,
    experiences,
    skillCategories,
    education,
    certifications,
    projects,
    achievements,
    testimonials,
    contact,
  ] = await Promise.all([
    getProfile(),
    getExperiences(),
    getSkillCategories(),
    getEducation(),
    getCertifications(),
    getProjects(),
    getAchievements(),
    getTestimonials(),
    getContact(),
  ]);

  return (
    <main>
      <Navbar />
      <Hero profile={profile} />
      <About profile={profile} />
      <Experience experiences={experiences} />
      <Skills categories={skillCategories} />
      <Education education={education} />
      <Certifications certifications={certifications} />
      <Projects projects={projects} />
      <Achievements achievements={achievements} />
      <Testimonials testimonials={testimonials} />
      <Contact contact={contact} />
      <Footer />
    </main>
  );
}
