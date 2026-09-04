-- Portfolio Database Data Insert Script
-- MySQL Database Migration from XML
-- Created: 2026-06-03

-- Insert Profile Data
INSERT INTO profile (name, role, title, bio, email, phone, location, linkedin, github, twitter, image_path, resume_path)
VALUES (
    'Amrutaa Nivekar',
    'Application Support Engineer',
    'Delivering Efficient IT Support & Technical Solutions',
    'Detail-oriented Application Support Engineer and Technical Support specialist with a solid foundation in IT support, systems administration, and software development. Experienced in Active Directory administration, Incident/Request management under ITIL practices using ServiceNow, and endpoint monitoring with Nextthink. Highly capable in Windows/Mac systems, network troubleshooting (LAN, VPN, Wi-Fi), and development technologies like Python, SQL, and SQLite.',
    'nivekaramruta@gmail.com',
    '+91 7666751096',
    'Pune, Maharashtra, India',
    'https://linkedin.com/in/amruta-nivekar',
    'https://github.com/Amruta-nivekar',
    'https://twitter.com/Amruta_nivekar',
    '/images/profile.jpg',
    '/resume.pdf'
);

-- Get the profile_id (assuming it's 1 after insert)
SET @profile_id = LAST_INSERT_ID();

-- Insert Contact Data
INSERT INTO contact (profile_id, email, phone, linkedin, github, twitter, location)
VALUES (
    @profile_id,
    'nivekaramruta@gmail.com',
    '+91 7666751096',
    'https://linkedin.com/in/amruta-nivekar',
    'https://github.com/Amruta-nivekar',
    'https://twitter.com/Amruta_nivekar',
    'Pune, Maharashtra, India'
);

-- Insert Experience Data
INSERT INTO experiences (profile_id, company, role, duration, technologies, description, display_order)
VALUES 
(@profile_id, 'Fujitsu', 'Application Support Engineer', 'Nov 2025 - Present', 
 'ServiceNow, Nextthink, Active Directory, Windows, macOS, ITIL, LAN, VPN, Wi-Fi',
 'Provide L1/L2 support for enterprise applications and end users. Manage incidents, service requests, and change requests in line with ITIL practices via ServiceNow, ensuring SLA compliance. Monitor endpoint performance using Nextthink to proactively resolve issues. Administer Active Directory including user accounts, password resets, and group policies.',
 1),
(@profile_id, 'Infinite Computer Solutions', 'Associate Technical Support Engineer', 'Jan 2025 - Nov 2025',
 'Active Directory, ServiceNow, ITIL, Windows, macOS, LAN, Wi-Fi, VPN',
 'Provided technical support for Windows and Mac systems. Handled incidents, service requests, and change requests in ServiceNow, adhering to ITIL best practices and meeting SLAs. Administered Active Directory user accounts, security groups, and group policies. Monitored system performance and escalated critical incidents to higher-level teams.',
 2),
(@profile_id, 'ICICI Lombard', 'Associate Development Manager', 'May 2024 - July 2024',
 'Project Management, Client Coordination, Team Leadership',
 'Developed strong leadership and project management skills, coordinating team activities to optimize performance and productivity. Coordinated with clients to analyze requirements and deliver suitable technical solutions.',
 3);

-- Insert Education Data
INSERT INTO education (profile_id, degree_name, institution, duration, score, coursework, display_order)
VALUES (
    @profile_id,
    'Bachelor of Computer Applications',
    'Savitribai Phule Pune University',
    'Oct 2021 - June 2024',
    'GPA: 8.36 / 10',
    'Computer Fundamentals, Software Engineering, Database Management Systems',
    1
);
-- Insert Skill Categories
INSERT INTO skill_categories (name, display_order)
VALUES 
('Technical & Languages', 1),
('Systems & Support Tools', 2),
('IT Operations', 3),
('Soft Skills', 4),
('Languages Spoken', 5);

-- Get category IDs by name (reliable, order-independent)
SET @cat_tech = (SELECT id FROM skill_categories WHERE name = 'Technical & Languages');
SET @cat_sys  = (SELECT id FROM skill_categories WHERE name = 'Systems & Support Tools');
SET @cat_ops  = (SELECT id FROM skill_categories WHERE name = 'IT Operations');
SET @cat_soft = (SELECT id FROM skill_categories WHERE name = 'Soft Skills');
SET @cat_lang = (SELECT id FROM skill_categories WHERE name = 'Languages Spoken');

-- Insert Skills Data
INSERT INTO skills (category_id, name, level, display_order)
VALUES 
-- Technical & Languages
(@cat_tech, 'Python', 90, 1),
(@cat_tech, 'SQL', 85, 2),
(@cat_tech, 'SQLite', 85, 3),
(@cat_tech, 'MongoDB', 75, 4),
(@cat_tech, 'HTML/CSS', 90, 5),
(@cat_tech, 'PHP', 80, 6),
(@cat_tech, 'XML', 85, 7),
-- Systems & Support Tools
(@cat_sys, 'Active Directory', 95, 1),
(@cat_sys, 'Microsoft Entra ID', 90, 2),
(@cat_sys, 'Azure Administration', 80, 3),
(@cat_sys, 'Linux Operations', 85, 4),
(@cat_sys, 'ServiceNow CRM', 90, 5),
(@cat_sys, 'Nextthink Monitor', 85, 6),
-- IT Operations
(@cat_ops, 'ITIL Practices', 90, 1),
(@cat_ops, 'Incident Management', 95, 2),
(@cat_ops, 'SLA Compliance', 95, 3),
(@cat_ops, 'Network Troubleshooting', 90, 4),
(@cat_ops, 'Windows/Mac Support', 95, 5),
-- Soft Skills
(@cat_soft, 'Problem Solving', 95, 1),
(@cat_soft, 'Team Leadership', 90, 2),
(@cat_soft, 'Client Coordination', 90, 3),
(@cat_soft, 'Troubleshooting', 95, 4),
(@cat_soft, 'Communication', 90, 5),
-- Languages Spoken
(@cat_lang, 'English', 95, 1),
(@cat_lang, 'Hindi', 90, 2),
(@cat_lang, 'Marathi', 95, 3);

-- Insert Certifications Data
INSERT INTO certifications (profile_id, name, organization, date, link, display_order)
VALUES 
(@profile_id, 'RedHat Certified System Administrator (RHCSA) Training', 'RedHat Certified Training', '2025', 'https://www.redhat.com', 1),
(@profile_id, 'Accenture Data Analytics & Visualization Job Simulation', 'Forage / Accenture', '2024', 'https://www.theforage.com', 2);

-- Insert Projects Data
INSERT INTO projects (profile_id, name, description, technologies, thumbnail_path, github_link, demo_link, display_order)
VALUES 
(@profile_id, 'Personal Finance Management Application',
 'Developed a secure personal finance application featuring secure user authentication, transaction tracking, budgeting, and comprehensive financial reporting using database backends.',
 'Python, SQLite',
 '/images/project1.jpg',
 'https://github.com/Amruta-nivekar',
 'https://github.com/Amruta-nivekar',
 1),
(@profile_id, 'NGO Planet',
 'Created an interactive web platform for NGO engagement, allowing users to locate nearby organizations, process secure donations, and sign up for volunteer opportunities.',
 'HTML, CSS, PHP, XML',
 '/images/project2.jpg',
 'https://github.com/Amruta-nivekar',
 'https://github.com/Amruta-nivekar',
 2);

-- Insert Achievements Data
INSERT INTO achievements (profile_id, title, count_value, icon, display_order)
VALUES 
(@profile_id, 'Professional Roles', '3', '💼', 1),
(@profile_id, 'Academic GPA', '8.36', '🎓', 2),
(@profile_id, 'Core Projects', '2', '🚀', 3),
(@profile_id, 'Certifications', '2', '🏆', 4);

-- Insert Testimonials Data
INSERT INTO testimonials (profile_id, author_name, author_role, text, image_path, display_order)
VALUES 
(@profile_id, 'Technical Delivery Manager', 'Fujitsu Noida',
 'Amrutaa is a highly reliable support engineer who handles incidents under tight SLAs. Her Active Directory administration and problem-solving skills are exceptional.',
 '/images/testimonial1.jpg',
 1),
(@profile_id, 'IT Operations Lead', 'Infinite Computer Solutions',
 'Working with Amrutaa was a pleasure. She displayed extreme competence in network troubleshooting and user-account management, ensuring near-perfect SLA compliance.',
 '/images/testimonial2.jpg',
 2);

COMMIT;
