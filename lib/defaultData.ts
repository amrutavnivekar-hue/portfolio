export const defaultProfile = {
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
  image: '/images/profile.jpg',
  resume_path: '/resume.pdf',
};

export const defaultContact = {
  email: 'nivekaramruta@gmail.com',
  phone: '+91 7666751096',
  location: 'Pune, Maharashtra, India',
  linkedin: 'https://linkedin.com/in/amruta-nivekar',
  github: 'https://github.com/Amruta-nivekar',
  twitter: 'https://twitter.com/Amruta_nivekar',
};

export const defaultEducation = [
  {
    id: 1,
    degree_name: 'Bachelor of Computer Applications',
    institution: 'Savitribai Phule Pune University',
    duration: 'Oct 2021 - June 2024',
    score: 'GPA: 8.36 / 10',
    coursework: 'Computer Fundamentals, Software Engineering, Database Management Systems',
    display_order: 1,
  },
];

export const defaultCertifications = [
  {
    id: 1,
    name: 'RedHat Certified System Administrator (RHCSA) Training',
    organization: 'RedHat Certified Training',
    date: '2025',
    link: 'https://www.redhat.com',
    display_order: 1,
  },
  {
    id: 2,
    name: 'Accenture Data Analytics & Visualization Job Simulation',
    organization: 'Forage / Accenture',
    date: '2024',
    link: 'https://www.theforage.com',
    display_order: 2,
  },
];

export const defaultTestimonials = [
  {
    id: 1,
    author_name: 'Technical Delivery Manager',
    author_role: 'Fujitsu Noida',
    text: 'Amrutaa is a highly reliable support engineer who handles incidents under tight SLAs. Her Active Directory administration and problem-solving skills are exceptional.',
    image: '/images/testimonial1.jpg',
    display_order: 1,
  },
  {
    id: 2,
    author_name: 'IT Operations Lead',
    author_role: 'Infinite Computer Solutions',
    text: 'Working with Amrutaa was a pleasure. She displayed extreme competence in network troubleshooting and user-account management, ensuring near-perfect SLA compliance.',
    image: '/images/testimonial2.jpg',
    display_order: 2,
  },
];

export const defaultExperiences = [
  {
    id: 1,
    company: 'Fujitsu',
    role: 'Application Support Engineer',
    duration: 'Nov 2025 - Present',
    technologies: 'ServiceNow, Nextthink, Active Directory, Windows, macOS, ITIL, LAN, VPN, Wi-Fi',
    description:
      'Provide L1/L2 support for enterprise applications and end users. Manage incidents, service requests, and change requests in line with ITIL practices via ServiceNow, ensuring SLA compliance. Monitor endpoint performance using Nextthink to proactively resolve issues. Administer Active Directory including user accounts, password resets, and group policies.',
    display_order: 1,
  },
  {
    id: 2,
    company: 'Infinite Computer Solutions',
    role: 'Associate Technical Support Engineer',
    duration: 'Jan 2025 - Nov 2025',
    technologies: 'Active Directory, ServiceNow, ITIL, Windows, macOS, LAN, Wi-Fi, VPN',
    description:
      'Provided technical support for Windows and Mac systems. Handled incidents, service requests, and change requests in ServiceNow, adhering to ITIL best practices and meeting SLAs. Administered Active Directory user accounts, security groups, and group policies. Monitored system performance and escalated critical incidents to higher-level teams.',
    display_order: 2,
  },
  {
    id: 3,
    company: 'ICICI Lombard',
    role: 'Associate Development Manager',
    duration: 'May 2024 - July 2024',
    technologies: 'Project Management, Client Coordination, Team Leadership',
    description:
      'Developed strong leadership and project management skills, coordinating team activities to optimize performance and productivity. Coordinated with clients to analyze requirements and deliver suitable technical solutions.',
    display_order: 3,
  },
];

export const defaultSkillCategories = [
  {
    name: 'Technical & Languages',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'SQL', level: 85 },
      { name: 'SQLite', level: 85 },
      { name: 'MongoDB', level: 75 },
      { name: 'HTML/CSS', level: 90 },
      { name: 'PHP', level: 80 },
      { name: 'XML', level: 85 },
    ],
  },
  {
    name: 'Systems & Support Tools',
    skills: [
      { name: 'Active Directory', level: 95 },
      { name: 'Microsoft Entra ID', level: 90 },
      { name: 'Azure Administration', level: 80 },
      { name: 'Linux Operations', level: 85 },
      { name: 'ServiceNow CRM', level: 90 },
      { name: 'Nextthink Monitor', level: 85 },
    ],
  },
  {
    name: 'IT Operations',
    skills: [
      { name: 'ITIL Practices', level: 90 },
      { name: 'Incident Management', level: 95 },
      { name: 'SLA Compliance', level: 95 },
      { name: 'Network Troubleshooting', level: 90 },
      { name: 'Windows/Mac Support', level: 95 },
    ],
  },
  {
    name: 'Soft Skills',
    skills: [
      { name: 'Problem Solving', level: 95 },
      { name: 'Team Leadership', level: 90 },
      { name: 'Client Coordination', level: 90 },
      { name: 'Troubleshooting', level: 95 },
      { name: 'Communication', level: 90 },
    ],
  },
  {
    name: 'Languages Spoken',
    skills: [
      { name: 'English', level: 95 },
      { name: 'Hindi', level: 90 },
      { name: 'Marathi', level: 95 },
    ],
  },
];

export const defaultProjects = [
  {
    id: 1,
    name: 'Personal Finance Management Application',
    description:
      'Developed a secure personal finance application featuring secure user authentication, transaction tracking, budgeting, and comprehensive financial reporting using database backends.',
    technologies: 'Python, SQLite',
    thumbnail: '/images/project1.jpg',
    github: 'https://github.com/Amruta-nivekar',
    demo: 'https://github.com/Amruta-nivekar',
    display_order: 1,
  },
  {
    id: 2,
    name: 'NGO Planet',
    description:
      'Created an interactive web platform for NGO engagement, allowing users to locate nearby organizations, process secure donations, and sign up for volunteer opportunities.',
    technologies: 'HTML, CSS, PHP, XML',
    thumbnail: '/images/project2.jpg',
    github: 'https://github.com/Amruta-nivekar',
    demo: 'https://github.com/Amruta-nivekar',
    display_order: 2,
  },
];

export const defaultAchievements = [
  { id: 1, title: 'Professional Roles', count: '3', icon: '💼', display_order: 1 },
  { id: 2, title: 'Academic GPA', count: '8.36', icon: '🎓', display_order: 2 },
  { id: 3, title: 'Core Projects', count: '2', icon: '🚀', display_order: 3 },
  { id: 4, title: 'Certifications', count: '2', icon: '🏆', display_order: 4 },
];
