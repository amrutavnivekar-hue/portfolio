-- Portfolio Database Schema
-- MySQL Database Migration from XML
-- Created: 2026-06-03

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS skill_categories;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS experiences;
DROP TABLE IF EXISTS contact;
DROP TABLE IF EXISTS profile;

-- Create Profile Table
CREATE TABLE profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    title TEXT,
    bio TEXT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    linkedin VARCHAR(500),
    github VARCHAR(500),
    twitter VARCHAR(500),
    image_path VARCHAR(500),
    resume_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Contact Table (separate from profile for flexibility)
CREATE TABLE contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    linkedin VARCHAR(500),
    github VARCHAR(500),
    twitter VARCHAR(500),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
);

-- Create Experiences Table
CREATE TABLE experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    technologies TEXT,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id),
    INDEX idx_display_order (display_order)
);

-- Create Education Table
CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    degree_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    score VARCHAR(100),
    coursework TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id),
    INDEX idx_display_order (display_order)
);

-- Create Skill Categories Table
CREATE TABLE skill_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
);

-- Create Skills Table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    level INT DEFAULT 0 CHECK (level >= 0 AND level <= 100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE,
    INDEX idx_category_id (category_id),
    INDEX idx_display_order (display_order)
);

-- Create Certifications Table
CREATE TABLE certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    date VARCHAR(100),
    link VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id),
    INDEX idx_display_order (display_order)
);

-- Create Projects Table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    technologies TEXT,
    thumbnail_path VARCHAR(500),
    github_link VARCHAR(500),
    demo_link VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id),
    INDEX idx_display_order (display_order)
);

-- Create Achievements Table
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    title VARCHAR(255) NOT NULL,
    count_value VARCHAR(50),
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id),
    INDEX idx_display_order (display_order)
);

-- Create Testimonials Table
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(255),
    text TEXT NOT NULL,
    image_path VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile_id (profile_id),
    INDEX idx_display_order (display_order)
);

-- Create Admin Users Table (for authentication)
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Insert default admin user (password: admin123 - should be changed in production)
-- Note: This is a placeholder. In production, use proper password hashing
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('admin', '$2a$10$placeholder-hash-change-in-production', 'admin@portfolio.com');

-- Create Views for easier data access

-- View for profile with contact info
CREATE VIEW v_profile_contact AS
SELECT 
    p.id,
    p.name,
    p.role,
    p.title,
    p.bio,
    p.email,
    p.phone,
    p.location,
    p.linkedin,
    p.github,
    p.twitter,
    p.image_path,
    p.resume_path,
    c.email as contact_email,
    c.phone as contact_phone,
    c.linkedin as contact_linkedin,
    c.github as contact_github,
    c.twitter as contact_twitter,
    c.location as contact_location
FROM profile p
LEFT JOIN contact c ON p.id = c.profile_id;

-- View for skills with categories
CREATE VIEW v_skills_with_categories AS
SELECT 
    s.id,
    s.name,
    s.level,
    s.display_order,
    sc.name as category_name,
    sc.display_order as category_order
FROM skills s
JOIN skill_categories sc ON s.category_id = sc.id
ORDER BY sc.display_order, s.display_order;

-- View for experiences with profile
CREATE VIEW v_experiences_profile AS
SELECT 
    e.id,
    e.company,
    e.role,
    e.duration,
    e.technologies,
    e.description,
    e.display_order,
    p.name as profile_name
FROM experiences e
JOIN profile p ON e.profile_id = p.id
ORDER BY e.display_order;

-- View for projects with profile
CREATE VIEW v_projects_profile AS
SELECT 
    pr.id,
    pr.name,
    pr.description,
    pr.technologies,
    pr.thumbnail_path,
    pr.github_link,
    pr.demo_link,
    pr.display_order,
    p.name as profile_name
FROM projects pr
JOIN profile p ON pr.profile_id = p.id
ORDER BY pr.display_order;

-- Create indexes for performance optimization
CREATE INDEX idx_profile_name ON profile(name);
CREATE INDEX idx_experiences_company ON experiences(company);
CREATE INDEX idx_education_institution ON education(institution);
CREATE INDEX idx_certifications_organization ON certifications(organization);
CREATE INDEX idx_projects_name ON projects(name);
CREATE INDEX idx_achievements_title ON achievements(title);
CREATE INDEX idx_testimonials_author ON testimonials(author_name);

-- Grant permissions (adjust as needed for your environment)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON portfolio.* TO 'portfolio_user'@'localhost';
-- GRANT SELECT ON portfolio.* TO 'portfolio_readonly'@'localhost';

COMMIT;
