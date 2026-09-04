/**
 * Seed Supabase with all portfolio data.
 * Run: node scripts/seed-supabase.js
 *
 * Safe to re-run — clears existing data first then re-inserts.
 */

const { createClient } = require('@supabase/supabase-js');

const url = 'https://eqqiigwexnbhewqxrzor.supabase.co';
// Use service role key for seeding (bypasses RLS). 
// Get it from: Supabase Dashboard → Project Settings → API → service_role key
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);

async function clear() {
  // Delete in FK-safe order (children first)
  const tables = ['testimonials','achievements','projects','certifications','skills','skill_categories','education','experiences','contact','profile'];
  for (const t of tables) {
    const { error } = await supabase.from(t).delete().neq('id', 0);
    if (error) console.warn(`  ⚠ Could not clear ${t}: ${error.message}`);
  }
}

async function seed() {
  console.log('🌱 Seeding Supabase...\n');

  // ── Clear old data ─────────────────────────────────────
  process.stdout.write('Clearing old data... ');
  await clear();
  console.log('done');

  // ── Profile ────────────────────────────────────────────
  process.stdout.write('Inserting profile... ');
  const { data: profile, error: pErr } = await supabase.from('profile').insert({
    name: 'Amrutaa Nivekar',
    role: 'Application Support Engineer',
    title: 'Delivering Efficient IT Support & Technical Solutions',
    bio: 'Detail-oriented Application Support Engineer and Technical Support specialist with a solid foundation in IT support, systems administration, and software development. Experienced in Active Directory administration, Incident/Request management under ITIL practices using ServiceNow, and endpoint monitoring with Nextthink. Highly capable in Windows/Mac systems, network troubleshooting (LAN, VPN, Wi-Fi), and development technologies like Python, SQL, and SQLite.',
    email: 'nivekaramruta@gmail.com',
    phone: '+91 7666751096',
    location: 'Pune, Maharashtra, India',
    linkedin: 'https://linkedin.com/in/amruta-nivekar',
    github: 'https://github.com/Amruta-nivekar',
    twitter: 'https://twitter.com/Amruta_nivekar',
    image_path: '/images/profile.jpg',
    resume_path: '/resume.pdf',
  }).select().single();
  if (pErr) { console.error('FAILED:', pErr.message); process.exit(1); }
  const profileId = profile.id;
  console.log(`done (id=${profileId})`);

  // ── Contact ────────────────────────────────────────────
  process.stdout.write('Inserting contact... ');
  const { error: cErr } = await supabase.from('contact').insert({
    profile_id: profileId,
    email: 'nivekaramruta@gmail.com',
    phone: '+91 7666751096',
    linkedin: 'https://linkedin.com/in/amruta-nivekar',
    github: 'https://github.com/Amruta-nivekar',
    twitter: 'https://twitter.com/Amruta_nivekar',
    location: 'Pune, Maharashtra, India',
  });
  if (cErr) console.warn('WARN:', cErr.message); else console.log('done');

  // ── Experiences ────────────────────────────────────────
  process.stdout.write('Inserting experiences... ');
  const { error: eErr } = await supabase.from('experiences').insert([
    {
      profile_id: profileId,
      company: 'Fujitsu',
      role: 'Application Support Engineer',
      duration: 'Nov 2025 - Present',
      technologies: 'ServiceNow, Nextthink, Active Directory, Windows, macOS, ITIL, LAN, VPN, Wi-Fi',
      description: 'Provide L1/L2 support for enterprise applications and end users. Manage incidents, service requests, and change requests in line with ITIL practices via ServiceNow, ensuring SLA compliance. Monitor endpoint performance using Nextthink to proactively resolve issues. Administer Active Directory including user accounts, password resets, and group policies.',
      display_order: 1,
    },
    {
      profile_id: profileId,
      company: 'Infinite Computer Solutions',
      role: 'Associate Technical Support Engineer',
      duration: 'Jan 2025 - Nov 2025',
      technologies: 'Active Directory, ServiceNow, ITIL, Windows, macOS, LAN, Wi-Fi, VPN',
      description: 'Provided technical support for Windows and Mac systems. Handled incidents, service requests, and change requests in ServiceNow, adhering to ITIL best practices and meeting SLAs. Administered Active Directory user accounts, security groups, and group policies. Monitored system performance and escalated critical incidents to higher-level teams.',
      display_order: 2,
    },
    {
      profile_id: profileId,
      company: 'ICICI Lombard',
      role: 'Associate Development Manager',
      duration: 'May 2024 - July 2024',
      technologies: 'Project Management, Client Coordination, Team Leadership',
      description: 'Developed strong leadership and project management skills, coordinating team activities to optimize performance and productivity. Coordinated with clients to analyze requirements and deliver suitable technical solutions.',
      display_order: 3,
    },
  ]);
  if (eErr) console.error('FAILED:', eErr.message); else console.log('done');

  // ── Education ──────────────────────────────────────────
  process.stdout.write('Inserting education... ');
  const { error: edErr } = await supabase.from('education').insert({
    profile_id: profileId,
    degree_name: 'Bachelor of Computer Applications',
    institution: 'Savitribai Phule Pune University',
    duration: 'Oct 2021 - June 2024',
    score: 'GPA: 8.36 / 10',
    coursework: 'Computer Fundamentals, Software Engineering, Database Management Systems',
    display_order: 1,
  });
  if (edErr) console.warn('WARN:', edErr.message); else console.log('done');

  // ── Skill Categories ───────────────────────────────────
  process.stdout.write('Inserting skill categories... ');
  const { data: cats, error: scErr } = await supabase.from('skill_categories').insert([
    { name: 'Technical & Languages',  display_order: 1 },
    { name: 'Systems & Support Tools', display_order: 2 },
    { name: 'IT Operations',           display_order: 3 },
    { name: 'Soft Skills',             display_order: 4 },
    { name: 'Languages Spoken',        display_order: 5 },
  ]).select();
  if (scErr) { console.error('FAILED:', scErr.message); process.exit(1); }
  const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));
  console.log('done');

  // ── Skills ─────────────────────────────────────────────
  process.stdout.write('Inserting skills... ');
  const { error: skErr } = await supabase.from('skills').insert([
    { category_id: catMap['Technical & Languages'],  name: 'Python',             level: 90, display_order: 1 },
    { category_id: catMap['Technical & Languages'],  name: 'SQL',                level: 85, display_order: 2 },
    { category_id: catMap['Technical & Languages'],  name: 'SQLite',             level: 85, display_order: 3 },
    { category_id: catMap['Technical & Languages'],  name: 'MongoDB',            level: 75, display_order: 4 },
    { category_id: catMap['Technical & Languages'],  name: 'HTML/CSS',           level: 90, display_order: 5 },
    { category_id: catMap['Technical & Languages'],  name: 'PHP',                level: 80, display_order: 6 },
    { category_id: catMap['Technical & Languages'],  name: 'XML',                level: 85, display_order: 7 },
    { category_id: catMap['Systems & Support Tools'], name: 'Active Directory',   level: 95, display_order: 1 },
    { category_id: catMap['Systems & Support Tools'], name: 'Microsoft Entra ID', level: 90, display_order: 2 },
    { category_id: catMap['Systems & Support Tools'], name: 'Azure Administration',level: 80, display_order: 3 },
    { category_id: catMap['Systems & Support Tools'], name: 'Linux Operations',   level: 85, display_order: 4 },
    { category_id: catMap['Systems & Support Tools'], name: 'ServiceNow CRM',     level: 90, display_order: 5 },
    { category_id: catMap['Systems & Support Tools'], name: 'Nextthink Monitor',  level: 85, display_order: 6 },
    { category_id: catMap['IT Operations'], name: 'ITIL Practices',          level: 90, display_order: 1 },
    { category_id: catMap['IT Operations'], name: 'Incident Management',     level: 95, display_order: 2 },
    { category_id: catMap['IT Operations'], name: 'SLA Compliance',          level: 95, display_order: 3 },
    { category_id: catMap['IT Operations'], name: 'Network Troubleshooting', level: 90, display_order: 4 },
    { category_id: catMap['IT Operations'], name: 'Windows/Mac Support',     level: 95, display_order: 5 },
    { category_id: catMap['Soft Skills'], name: 'Problem Solving',    level: 95, display_order: 1 },
    { category_id: catMap['Soft Skills'], name: 'Team Leadership',    level: 90, display_order: 2 },
    { category_id: catMap['Soft Skills'], name: 'Client Coordination',level: 90, display_order: 3 },
    { category_id: catMap['Soft Skills'], name: 'Troubleshooting',    level: 95, display_order: 4 },
    { category_id: catMap['Soft Skills'], name: 'Communication',      level: 90, display_order: 5 },
    { category_id: catMap['Languages Spoken'], name: 'English', level: 95, display_order: 1 },
    { category_id: catMap['Languages Spoken'], name: 'Hindi',   level: 90, display_order: 2 },
    { category_id: catMap['Languages Spoken'], name: 'Marathi', level: 95, display_order: 3 },
  ]);
  if (skErr) console.error('FAILED:', skErr.message); else console.log('done');

  // ── Certifications ─────────────────────────────────────
  process.stdout.write('Inserting certifications... ');
  const { error: crErr } = await supabase.from('certifications').insert([
    { profile_id: profileId, name: 'RedHat Certified System Administrator (RHCSA) Training', organization: 'RedHat Certified Training', date: '2025', link: 'https://www.redhat.com', display_order: 1 },
    { profile_id: profileId, name: 'Accenture Data Analytics & Visualization Job Simulation', organization: 'Forage / Accenture', date: '2024', link: 'https://www.theforage.com', display_order: 2 },
  ]);
  if (crErr) console.error('FAILED:', crErr.message); else console.log('done');

  // ── Projects ───────────────────────────────────────────
  process.stdout.write('Inserting projects... ');
  const { error: prErr } = await supabase.from('projects').insert([
    {
      profile_id: profileId,
      name: 'Personal Finance Management Application',
      description: 'Developed a secure personal finance application featuring secure user authentication, transaction tracking, budgeting, and comprehensive financial reporting using database backends.',
      technologies: 'Python, SQLite',
      thumbnail_path: '/images/project1.jpg',
      github_link: 'https://github.com/Amruta-nivekar',
      demo_link: 'https://github.com/Amruta-nivekar',
      display_order: 1,
    },
    {
      profile_id: profileId,
      name: 'NGO Planet',
      description: 'Created an interactive web platform for NGO engagement, allowing users to locate nearby organizations, process secure donations, and sign up for volunteer opportunities.',
      technologies: 'HTML, CSS, PHP, XML',
      thumbnail_path: '/images/project2.jpg',
      github_link: 'https://github.com/Amruta-nivekar',
      demo_link: 'https://github.com/Amruta-nivekar',
      display_order: 2,
    },
  ]);
  if (prErr) console.error('FAILED:', prErr.message); else console.log('done');

  // ── Achievements ───────────────────────────────────────
  process.stdout.write('Inserting achievements... ');
  const { error: acErr } = await supabase.from('achievements').insert([
    { profile_id: profileId, title: 'Professional Roles', count_value: '3',    icon: '💼', display_order: 1 },
    { profile_id: profileId, title: 'Academic GPA',       count_value: '8.36', icon: '🎓', display_order: 2 },
    { profile_id: profileId, title: 'Core Projects',      count_value: '2',    icon: '🚀', display_order: 3 },
    { profile_id: profileId, title: 'Certifications',     count_value: '2',    icon: '🏆', display_order: 4 },
  ]);
  if (acErr) console.error('FAILED:', acErr.message); else console.log('done');

  // ── Testimonials ───────────────────────────────────────
  process.stdout.write('Inserting testimonials... ');
  const { error: tmErr } = await supabase.from('testimonials').insert([
    {
      profile_id: profileId,
      author_name: 'Technical Delivery Manager',
      author_role: 'Fujitsu Noida',
      text: 'Amrutaa is a highly reliable support engineer who handles incidents under tight SLAs. Her Active Directory administration and problem-solving skills are exceptional.',
      image_path: '/images/testimonial1.jpg',
      display_order: 1,
    },
    {
      profile_id: profileId,
      author_name: 'IT Operations Lead',
      author_role: 'Infinite Computer Solutions',
      text: 'Working with Amrutaa was a pleasure. She displayed extreme competence in network troubleshooting and user-account management, ensuring near-perfect SLA compliance.',
      image_path: '/images/testimonial2.jpg',
      display_order: 2,
    },
  ]);
  if (tmErr) console.error('FAILED:', tmErr.message); else console.log('done');

  // ── Final summary ──────────────────────────────────────
  console.log('\n=== Verification ===');
  const checks = ['profile','experiences','education','skill_categories','skills','certifications','projects','achievements','testimonials'];
  for (const t of checks) {
    const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
    console.log(`  ${t}: ${count} rows`);
  }

  console.log('\n✅ Seeding complete!');
}

seed().catch(err => { console.error('Fatal:', err); process.exit(1); });
