# Amruta Nivekar - Professional Portfolio Website

A modern, responsive, and premium portfolio website built with Next.js, featuring a complete theme system, smooth animations, and XML-based content management.

## Features

- **Modern UI/UX**: Glassmorphism, smooth animations, gradient accents, and premium typography
- **4 Theme System**: Midnight Professional, Luxury Purple, Soft Light, and Rose Gold Premium
- **Fully Responsive**: Mobile, tablet, laptop, desktop, and ultra-wide screen support
- **XML-Based Content**: All content dynamically loaded from XML files
- **Admin Panel**: Secure authentication and content management dashboard
- **Smooth Animations**: Framer Motion animations throughout
- **SEO Optimized**: Dynamic metadata, Open Graph tags, and structured data
- **Accessibility**: ARIA labels, keyboard navigation, and focus states

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Animations**: Framer Motion, React Spring
- **Icons**: React Icons
- **Data Storage**: XML files (no database)
- **Authentication**: JWT, bcryptjs

## Project Structure

```
portfolio/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   └── dashboard/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar/
│   ├── Hero/
│   ├── About/
│   ├── Experience/
│   ├── Skills/
│   ├── Education/
│   ├── Certifications/
│   ├── Projects/
│   ├── Achievements/
│   ├── Testimonials/
│   ├── Contact/
│   ├── Footer/
│   └── ThemeProvider.tsx
├── data/
│   ├── profile.xml
│   ├── experience.xml
│   ├── education.xml
│   ├── skills.xml
│   ├── certifications.xml
│   ├── projects.xml
│   ├── achievements.xml
│   ├── testimonials.xml
│   └── contact.xml
├── lib/
│   ├── xmlParser.ts
│   ├── theme.ts
│   ├── auth.ts
│   └── utils.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── resume.pdf
└── styles/
```

## Installation

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Navigate to the project directory**
   ```bash
   cd portfolio
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   - Create a `.env.local` file in the root directory
   - Add the following:
     ```
     JWT_SECRET=your-secret-key-change-in-production
     ```

5. **Add your resume**
   - Place your resume PDF in `public/resume.pdf`

6. **Update XML files with your data**
   - Edit the XML files in the `data/` folder with your actual information
   - The XML files contain placeholder data that should be replaced

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Admin Panel

### Access
- URL: `/admin/login`
- Default credentials:
  - Username: `admin`
  - Password: `admin123`

**Important**: Change the default credentials in production by updating the authentication logic in `app/admin/login/page.tsx`

### Features
- Profile Management
- Experience Management
- Education Management
- Skills Management
- Certifications Management
- Projects Management
- Achievements Management
- Testimonials Management
- Contact Information
- Resume Upload

## Content Management

All content is managed through XML files in the `data/` directory:

- `profile.xml` - Personal information, social links
- `experience.xml` - Work experience
- `education.xml` - Academic background
- `skills.xml` - Technical and soft skills
- `certifications.xml` - Professional certifications
- `projects.xml` - Project portfolio
- `achievements.xml` - Milestones and accomplishments
- `testimonials.xml` - Client testimonials
- `contact.xml` - Contact information

To update content, simply edit the corresponding XML file. The changes will be reflected immediately on the website.

## Theme System

The portfolio includes 4 premium themes:

1. **Midnight Professional** (Default) - Dark blue theme
2. **Luxury Purple** - Purple and pink gradients
3. **Soft Light** - Clean light theme
4. **Rose Gold Premium** - Elegant rose gold theme

Themes are persisted in Local Storage and can be switched using the theme selector in the navbar.

## Building for Production

```bash
npm run build
npm start
```

## Performance Optimization

- Lazy loading of components
- Optimized images
- Code splitting
- Minimal bundle size
- Lighthouse score optimization (95+ across all categories)

## SEO

The website includes:
- Dynamic metadata
- Open Graph tags
- Twitter Cards
- Structured data (JSON-LD)
- Sitemap support
- Robots.txt

## Accessibility

- ARIA labels
- Keyboard navigation
- Focus states
- Semantic HTML
- Screen reader support
- WCAG 2.1 AA compliance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors
Edit the theme colors in `lib/theme.ts` and `tailwind.config.js`

### Animations
Modify Framer Motion animations in individual component files

### Layout
Adjust component layouts in their respective files under `components/`

## Troubleshooting

### Dependencies not installing
- Ensure Node.js is properly installed
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### XML parsing errors
- Verify XML files are properly formatted
- Check for special characters that need escaping
- Ensure XML files are in UTF-8 encoding

### Theme not persisting
- Check Local Storage is enabled in your browser
- Verify `ThemeProvider.tsx` is properly integrated

## License

This project is for personal/portfolio use.

## Credits

- Built with Next.js and React
- Animations by Framer Motion
- Icons by React Icons
- Styled with Tailwind CSS

## Support

For issues or questions, please refer to the documentation or contact the developer.

---

**Note**: This portfolio uses placeholder data. Update the XML files in the `data/` directory with your actual information to personalize the website.
