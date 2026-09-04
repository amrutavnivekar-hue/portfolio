-- ============================================================
-- Portfolio Supabase Schema (PostgreSQL)
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Drop existing tables in reverse FK order
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS skill_categories CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS contact CASCADE;
DROP TABLE IF EXISTS profile CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- ── Profile ────────────────────────────────────────────────
CREATE TABLE profile (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    role        VARCHAR(255) NOT NULL,
    title       TEXT,
    bio         TEXT,
    email       VARCHAR(255) NOT NULL,
    phone       VARCHAR(50),
    location    VARCHAR(255),
    linkedin    VARCHAR(500),
    github      VARCHAR(500),
    twitter     VARCHAR(500),
    image_path  VARCHAR(500),
    resume_path VARCHAR(500),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Contact ────────────────────────────────────────────────
CREATE TABLE contact (
    id         SERIAL PRIMARY KEY,
    profile_id INT REFERENCES profile(id) ON DELETE CASCADE,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(50),
    linkedin   VARCHAR(500),
    github     VARCHAR(500),
    twitter    VARCHAR(500),
    location   VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Experiences ────────────────────────────────────────────
CREATE TABLE experiences (
    id            SERIAL PRIMARY KEY,
    profile_id    INT REFERENCES profile(id) ON DELETE CASCADE,
    company       VARCHAR(255) NOT NULL,
    role          VARCHAR(255) NOT NULL,
    duration      VARCHAR(100) NOT NULL,
    technologies  TEXT,
    description   TEXT,
    display_order INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_exp_profile    ON experiences(profile_id);
CREATE INDEX idx_exp_order      ON experiences(display_order);

-- ── Education ──────────────────────────────────────────────
CREATE TABLE education (
    id            SERIAL PRIMARY KEY,
    profile_id    INT REFERENCES profile(id) ON DELETE CASCADE,
    degree_name   VARCHAR(255) NOT NULL,
    institution   VARCHAR(255) NOT NULL,
    duration      VARCHAR(100) NOT NULL,
    score         VARCHAR(100),
    coursework    TEXT,
    display_order INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_edu_profile ON education(profile_id);
CREATE INDEX idx_edu_order   ON education(display_order);

-- ── Skill Categories ───────────────────────────────────────
CREATE TABLE skill_categories (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_scat_order ON skill_categories(display_order);

-- ── Skills ─────────────────────────────────────────────────
CREATE TABLE skills (
    id            SERIAL PRIMARY KEY,
    category_id   INT REFERENCES skill_categories(id) ON DELETE CASCADE,
    name          VARCHAR(255) NOT NULL,
    level         INT DEFAULT 0 CHECK (level >= 0 AND level <= 100),
    display_order INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_skill_cat   ON skills(category_id);
CREATE INDEX idx_skill_order ON skills(display_order);

-- ── Certifications ─────────────────────────────────────────
CREATE TABLE certifications (
    id            SERIAL PRIMARY KEY,
    profile_id    INT REFERENCES profile(id) ON DELETE CASCADE,
    name          VARCHAR(255) NOT NULL,
    organization  VARCHAR(255) NOT NULL,
    date          VARCHAR(100),
    link          VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_cert_profile ON certifications(profile_id);
CREATE INDEX idx_cert_order   ON certifications(display_order);

-- ── Projects ───────────────────────────────────────────────
CREATE TABLE projects (
    id             SERIAL PRIMARY KEY,
    profile_id     INT REFERENCES profile(id) ON DELETE CASCADE,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    technologies   TEXT,
    thumbnail_path VARCHAR(500),
    github_link    VARCHAR(500),
    demo_link      VARCHAR(500),
    display_order  INT DEFAULT 0,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_proj_profile ON projects(profile_id);
CREATE INDEX idx_proj_order   ON projects(display_order);

-- ── Achievements ───────────────────────────────────────────
CREATE TABLE achievements (
    id            SERIAL PRIMARY KEY,
    profile_id    INT REFERENCES profile(id) ON DELETE CASCADE,
    title         VARCHAR(255) NOT NULL,
    count_value   VARCHAR(50),
    icon          VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ach_profile ON achievements(profile_id);
CREATE INDEX idx_ach_order   ON achievements(display_order);

-- ── Testimonials ───────────────────────────────────────────
CREATE TABLE testimonials (
    id            SERIAL PRIMARY KEY,
    profile_id    INT REFERENCES profile(id) ON DELETE CASCADE,
    author_name   VARCHAR(255) NOT NULL,
    author_role   VARCHAR(255),
    text          TEXT NOT NULL,
    image_path    VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_test_profile ON testimonials(profile_id);
CREATE INDEX idx_test_order   ON testimonials(display_order);

-- ── Admin Users ────────────────────────────────────────────
CREATE TABLE admin_users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_admin_username ON admin_users(username);
CREATE INDEX idx_admin_email    ON admin_users(email);

-- Default admin (password: admin123 — change in production)
INSERT INTO admin_users (username, password_hash, email)
VALUES ('admin', '$2a$10$placeholder-hash-change-in-production', 'admin@portfolio.com');

-- ── Row Level Security (RLS) ───────────────────────────────
-- Enable RLS on all tables. Public tables are readable by anyone.
-- Write access requires service role key (used server-side only).

ALTER TABLE profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact          ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences      ENABLE ROW LEVEL SECURITY;
ALTER TABLE education        ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills           ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements     ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users      ENABLE ROW LEVEL SECURITY;

-- Public read policies (portfolio data visible to all)
CREATE POLICY "public_read_profile"          ON profile          FOR SELECT USING (true);
CREATE POLICY "public_read_contact"          ON contact          FOR SELECT USING (true);
CREATE POLICY "public_read_experiences"      ON experiences      FOR SELECT USING (true);
CREATE POLICY "public_read_education"        ON education        FOR SELECT USING (true);
CREATE POLICY "public_read_skill_categories" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "public_read_skills"           ON skills           FOR SELECT USING (true);
CREATE POLICY "public_read_certifications"   ON certifications   FOR SELECT USING (true);
CREATE POLICY "public_read_projects"         ON projects         FOR SELECT USING (true);
CREATE POLICY "public_read_achievements"     ON achievements     FOR SELECT USING (true);
CREATE POLICY "public_read_testimonials"     ON testimonials     FOR SELECT USING (true);

-- admin_users: no public read (auth only via server-side service role)
-- No SELECT policy = blocked for anon/authenticated roles

-- ── Seed Data ──────────────────────────────────────────────

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

INSERT INTO contact (profile_id, email, phone, linkedin, github, twitter, location)
SELECT id, email, phone, linkedin, github, twitter, location FROM profile LIMIT 1;

INSERT INTO experiences (profile_id, company, role, duration, technologies, description, display_order)
SELECT p.id, v.company, v.role, v.duration, v.technologies, v.description, v.display_order
FROM profile p,
(VALUES
    ('Fujitsu', 'Application Support Engineer', 'Nov 2025 - Present',
     'ServiceNow, Nextthink, Active Directory, Windows, macOS, ITIL, LAN, VPN, Wi-Fi',
     'Provide L1/L2 support for enterprise applications and end users. Manage incidents, service requests, and change requests in line with ITIL practices via ServiceNow, ensuring SLA compliance. Monitor endpoint performance using Nextthink to proactively resolve issues. Administer Active Directory including user accounts, password resets, and group policies.',
     1),
    ('Infinite Computer Solutions', 'Associate Technical Support Engineer', 'Jan 2025 - Nov 2025',
     'Active Directory, ServiceNow, ITIL, Windows, macOS, LAN, Wi-Fi, VPN',
     'Provided technical support for Windows and Mac systems. Handled incidents, service requests, and change requests in ServiceNow, adhering to ITIL best practices and meeting SLAs. Administered Active Directory user accounts, security groups, and group policies. Monitored system performance and escalated critical incidents to higher-level teams.',
     2),
    ('ICICI Lombard', 'Associate Development Manager', 'May 2024 - July 2024',
     'Project Management, Client Coordination, Team Leadership',
     'Developed strong leadership and project management skills, coordinating team activities to optimize performance and productivity. Coordinated with clients to analyze requirements and deliver suitable technical solutions.',
     3)
) AS v(company, role, duration, technologies, description, display_order)
LIMIT 1;

INSERT INTO education (profile_id, degree_name, institution, duration, score, coursework, display_order)
SELECT id, 'Bachelor of Computer Applications', 'Savitribai Phule Pune University',
    'Oct 2021 - June 2024', 'GPA: 8.36 / 10',
    'Computer Fundamentals, Software Engineering, Database Management Systems', 1
FROM profile LIMIT 1;

INSERT INTO skill_categories (name, display_order) VALUES
    ('Technical & Languages', 1),
    ('Systems & Support Tools', 2),
    ('IT Operations', 3),
    ('Soft Skills', 4),
    ('Languages Spoken', 5);

INSERT INTO skills (category_id, name, level, display_order)
SELECT sc.id, v.name, v.level, v.display_order
FROM skill_categories sc,
(VALUES
    ('Technical & Languages', 'Python',    90, 1),
    ('Technical & Languages', 'SQL',       85, 2),
    ('Technical & Languages', 'SQLite',    85, 3),
    ('Technical & Languages', 'MongoDB',   75, 4),
    ('Technical & Languages', 'HTML/CSS',  90, 5),
    ('Technical & Languages', 'PHP',       80, 6),
    ('Technical & Languages', 'XML',       85, 7),
    ('Systems & Support Tools', 'Active Directory',    95, 1),
    ('Systems & Support Tools', 'Microsoft Entra ID',  90, 2),
    ('Systems & Support Tools', 'Azure Administration',80, 3),
    ('Systems & Support Tools', 'Linux Operations',    85, 4),
    ('Systems & Support Tools', 'ServiceNow CRM',      90, 5),
    ('Systems & Support Tools', 'Nextthink Monitor',   85, 6),
    ('IT Operations', 'ITIL Practices',         90, 1),
    ('IT Operations', 'Incident Management',    95, 2),
    ('IT Operations', 'SLA Compliance',         95, 3),
    ('IT Operations', 'Network Troubleshooting',90, 4),
    ('IT Operations', 'Windows/Mac Support',    95, 5),
    ('Soft Skills', 'Problem Solving',    95, 1),
    ('Soft Skills', 'Team Leadership',    90, 2),
    ('Soft Skills', 'Client Coordination',90, 3),
    ('Soft Skills', 'Troubleshooting',    95, 4),
    ('Soft Skills', 'Communication',      90, 5),
    ('Languages Spoken', 'English', 95, 1),
    ('Languages Spoken', 'Hindi',   90, 2),
    ('Languages Spoken', 'Marathi', 95, 3)
) AS v(cat_name, name, level, display_order)
WHERE sc.name = v.cat_name;

INSERT INTO certifications (profile_id, name, organization, date, link, display_order)
SELECT p.id, v.name, v.org, v.date, v.link, v.ord
FROM profile p,
(VALUES
    ('RedHat Certified System Administrator (RHCSA) Training', 'RedHat Certified Training', '2025', 'https://www.redhat.com', 1),
    ('Accenture Data Analytics & Visualization Job Simulation', 'Forage / Accenture', '2024', 'https://www.theforage.com', 2)
) AS v(name, org, date, link, ord)
LIMIT 1;

INSERT INTO projects (profile_id, name, description, technologies, thumbnail_path, github_link, demo_link, display_order)
SELECT p.id, v.name, v.description, v.technologies, v.thumbnail_path, v.github_link, v.demo_link, v.ord
FROM profile p,
(VALUES
    ('Personal Finance Management Application',
     'Developed a secure personal finance application featuring secure user authentication, transaction tracking, budgeting, and comprehensive financial reporting using database backends.',
     'Python, SQLite', '/images/project1.jpg', 'https://github.com/Amruta-nivekar', 'https://github.com/Amruta-nivekar', 1),
    ('NGO Planet',
     'Created an interactive web platform for NGO engagement, allowing users to locate nearby organizations, process secure donations, and sign up for volunteer opportunities.',
     'HTML, CSS, PHP, XML', '/images/project2.jpg', 'https://github.com/Amruta-nivekar', 'https://github.com/Amruta-nivekar', 2)
) AS v(name, description, technologies, thumbnail_path, github_link, demo_link, ord)
LIMIT 1;

INSERT INTO achievements (profile_id, title, count_value, icon, display_order)
SELECT p.id, v.title, v.count_value, v.icon, v.ord
FROM profile p,
(VALUES
    ('Professional Roles', '3',    '💼', 1),
    ('Academic GPA',       '8.36', '🎓', 2),
    ('Core Projects',      '2',    '🚀', 3),
    ('Certifications',     '2',    '🏆', 4)
) AS v(title, count_value, icon, ord)
LIMIT 1;

INSERT INTO testimonials (profile_id, author_name, author_role, text, image_path, display_order)
SELECT p.id, v.author_name, v.author_role, v.text, v.image_path, v.ord
FROM profile p,
(VALUES
    ('Technical Delivery Manager', 'Fujitsu Noida',
     'Amrutaa is a highly reliable support engineer who handles incidents under tight SLAs. Her Active Directory administration and problem-solving skills are exceptional.',
     '/images/testimonial1.jpg', 1),
    ('IT Operations Lead', 'Infinite Computer Solutions',
     'Working with Amrutaa was a pleasure. She displayed extreme competence in network troubleshooting and user-account management, ensuring near-perfect SLA compliance.',
     '/images/testimonial2.jpg', 2)
) AS v(author_name, author_role, text, image_path, ord)
LIMIT 1;
