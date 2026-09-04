import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

const parser = new xml2js.Parser();

export async function parseXML<T>(filename: string): Promise<T | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    const xmlContent = fs.readFileSync(filePath, 'utf-8');
    const result = await parser.parseStringPromise(xmlContent);
    return result as T;
  } catch (error) {
    console.error(`Error parsing ${filename}:`, error);
    return null;
  }
}

export async function writeXML(filename: string, data: any): Promise<boolean> {
  try {
    const builder = new xml2js.Builder({ xmldec: { version: '1.0', encoding: 'UTF-8' } });
    const xml = builder.buildObject(data);
    const filePath = path.join(process.cwd(), 'data', filename);
    fs.writeFileSync(filePath, xml, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

export async function getProfile() {
  return await parseXML<any>('profile.xml');
}

export async function getExperience() {
  const data = await parseXML<any>('experience.xml');
  return data?.experiences?.experience || [];
}

export async function getEducation() {
  const data = await parseXML<any>('education.xml');
  return data?.education?.degree || [];
}

export async function getSkills() {
  const data = await parseXML<any>('skills.xml');
  return data?.skills?.category || [];
}

export async function getCertifications() {
  const data = await parseXML<any>('certifications.xml');
  return data?.certifications?.certification || [];
}

export async function getProjects() {
  const data = await parseXML<any>('projects.xml');
  return data?.projects?.project || [];
}

export async function getAchievements() {
  const data = await parseXML<any>('achievements.xml');
  return data?.achievements?.achievement || [];
}

export async function getTestimonials() {
  const data = await parseXML<any>('testimonials.xml');
  return data?.testimonials?.testimonial || [];
}

export async function getContact() {
  return await parseXML<any>('contact.xml');
}
