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

async function getExperiences() {
  try {
    const rows = await query('SELECT * FROM experiences ORDER BY display_order ASC') as any[];
    return rows;
  } catch {
    return [];
  }
}

async function getSkillCategories() {
  try {
    const categories = await query('SELECT * FROM skill_categories ORDER BY display_order ASC') as any[];
    const skills = await query('SELECT * FROM skills ORDER BY display_order ASC') as any[];
    return categories.map((cat: any) => ({
      name: cat.name,
      skills: skills
        .filter((s: any) => s.category_id === cat.id)
        .map((s: any) => ({ name: s.name, level: s.level })),
    }));
  } catch {
    return [];
  }
}

async function getAchievements() {
  try {
    const rows = await query('SELECT * FROM achievements ORDER BY display_order ASC') as any[];
    return rows;
  } catch {
    return [];
  }
}

async function getProjects() {
  try {
    const rows = await query('SELECT * FROM projects ORDER BY display_order ASC') as any[];
    return rows;
  } catch {
    return [];
  }
}

export default async function Home() {
  const [experiences, skillCategories, achievements, projects] = await Promise.all([
    getExperiences(),
    getSkillCategories(),
    getAchievements(),
    getProjects(),
  ]);

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Experience experiences={experiences} />
      <Skills categories={skillCategories} />
      <Education />
      <Certifications />
      <Projects projects={projects} />
      <Achievements achievements={achievements} />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
