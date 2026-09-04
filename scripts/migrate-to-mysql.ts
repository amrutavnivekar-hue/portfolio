import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { query } from '../lib/db';

// XML file paths
const DATA_DIR = path.join(process.cwd(), 'data');

// Helper to parse XML file
async function parseXmlFile(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  const xmlContent = fs.readFileSync(filePath, 'utf-8');
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlContent);
  return result;
}

// Migrate Profile
async function migrateProfile() {
  console.log('Migrating Profile...');
  const data = await parseXmlFile('profile.xml');
  const profile = data.profile;
  
  await query(`
    INSERT INTO profile (name, role, title, bio, email, phone, location, linkedin, github, twitter, image_path, resume_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    profile.name[0],
    profile.role[0],
    profile.title[0],
    profile.bio[0],
    profile.email[0],
    profile.phone[0],
    profile.location[0],
    profile.linkedin[0],
    profile.github[0],
    profile.twitter[0],
    profile.image[0],
    profile.resume[0]
  ]);
  
  console.log('Profile migrated successfully');
  const result = await query('SELECT id FROM profile ORDER BY id DESC LIMIT 1') as any[];
  return result[0].id;
}

// Migrate Contact
async function migrateContact(profileId: number) {
  console.log('Migrating Contact...');
  const data = await parseXmlFile('contact.xml');
  const contact = data.contact;
  
  await query(`
    INSERT INTO contact (profile_id, email, phone, linkedin, github, twitter, location)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    profileId,
    contact.email[0],
    contact.phone[0],
    contact.linkedin[0],
    contact.github[0],
    contact.twitter[0],
    contact.location[0]
  ]);
  
  console.log('Contact migrated successfully');
}

// Migrate Experiences
async function migrateExperiences(profileId: number) {
  console.log('Migrating Experiences...');
  const data = await parseXmlFile('experience.xml');
  const experiences = data.experiences.experience;
  
  for (let i = 0; i < experiences.length; i++) {
    const exp = experiences[i];
    await query(`
      INSERT INTO experiences (profile_id, company, role, duration, technologies, description, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      profileId,
      exp.company[0],
      exp.role[0],
      exp.duration[0],
      exp.technologies[0],
      exp.description[0],
      i
    ]);
  }
  
  console.log('Experiences migrated successfully');
}

// Migrate Education
async function migrateEducation(profileId: number) {
  console.log('Migrating Education...');
  const data = await parseXmlFile('education.xml');
  const degrees = data.education.degree;
  
  for (let i = 0; i < degrees.length; i++) {
    const degree = degrees[i];
    await query(`
      INSERT INTO education (profile_id, degree_name, institution, duration, score, coursework, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      profileId,
      degree.name[0],
      degree.institution[0],
      degree.year[0],
      degree.score[0],
      degree.coursework[0],
      i
    ]);
  }
  
  console.log('Education migrated successfully');
}

// Migrate Skills
async function migrateSkills() {
  console.log('Migrating Skills...');
  const data = await parseXmlFile('skills.xml');
  const categories = data.skills.category;
  
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const categoryName = category.$.name;
    
    // Insert category
    await query(`
      INSERT INTO skill_categories (name, display_order)
      VALUES (?, ?)
    `, [categoryName, i]);
    
    const categoryIdResult = await query('SELECT id FROM skill_categories WHERE name = ?', [categoryName]) as any[];
    const categoryId = categoryIdResult[0].id;
    
    // Insert skills
    const skills = category.skill;
    for (let j = 0; j < skills.length; j++) {
      const skill = skills[j];
      await query(`
        INSERT INTO skills (category_id, name, level, display_order)
        VALUES (?, ?, ?, ?)
      `, [categoryId, skill.$.name, parseInt(skill.$.level), j]);
    }
  }
  
  console.log('Skills migrated successfully');
}

// Migrate Certifications
async function migrateCertifications(profileId: number) {
  console.log('Migrating Certifications...');
  const data = await parseXmlFile('certifications.xml');
  const certifications = data.certifications.certification;
  
  for (let i = 0; i < certifications.length; i++) {
    const cert = certifications[i];
    await query(`
      INSERT INTO certifications (profile_id, name, organization, date, link, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      profileId,
      cert.name[0],
      cert.organization[0],
      cert.date[0],
      cert.link[0],
      i
    ]);
  }
  
  console.log('Certifications migrated successfully');
}

// Migrate Projects
async function migrateProjects(profileId: number) {
  console.log('Migrating Projects...');
  const data = await parseXmlFile('projects.xml');
  const projects = data.projects.project;
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    await query(`
      INSERT INTO projects (profile_id, name, description, technologies, thumbnail_path, github_link, demo_link, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      profileId,
      project.name[0],
      project.description[0],
      project.technologies[0],
      project.thumbnail[0],
      project.github[0],
      project.demo[0],
      i
    ]);
  }
  
  console.log('Projects migrated successfully');
}

// Migrate Achievements
async function migrateAchievements(profileId: number) {
  console.log('Migrating Achievements...');
  const data = await parseXmlFile('achievements.xml');
  const achievements = data.achievements.achievement;
  
  for (let i = 0; i < achievements.length; i++) {
    const achievement = achievements[i];
    await query(`
      INSERT INTO achievements (profile_id, title, count_value, icon, display_order)
      VALUES (?, ?, ?, ?, ?)
    `, [
      profileId,
      achievement.title[0],
      achievement.count[0],
      achievement.icon[0],
      i
    ]);
  }
  
  console.log('Achievements migrated successfully');
}

// Migrate Testimonials
async function migrateTestimonials(profileId: number) {
  console.log('Migrating Testimonials...');
  const data = await parseXmlFile('testimonials.xml');
  const testimonials = data.testimonials.testimonial;
  
  for (let i = 0; i < testimonials.length; i++) {
    const testimonial = testimonials[i];
    await query(`
      INSERT INTO testimonials (profile_id, author_name, author_role, text, image_path, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      profileId,
      testimonial.name[0],
      testimonial.role[0],
      testimonial.text[0],
      testimonial.image[0],
      i
    ]);
  }
  
  console.log('Testimonials migrated successfully');
}

// Main migration function
async function migrateAll() {
  try {
    console.log('Starting migration from XML to MySQL...');
    
    // Migrate profile first to get profile_id
    const profileId = await migrateProfile();
    
    // Migrate related data
    await migrateContact(profileId);
    await migrateExperiences(profileId);
    await migrateEducation(profileId);
    await migrateCertifications(profileId);
    await migrateProjects(profileId);
    await migrateAchievements(profileId);
    await migrateTestimonials(profileId);
    
    // Migrate skills (doesn't need profile_id)
    await migrateSkills();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateAll();
