export interface ProjectTech {
  name: string
  category: 'frontend' | 'backend' | 'infra' | 'tool'
}

export interface ProjectSection {
  title: string
  content: string
}

export interface ProjectStat {
  label: string
  value: string
}

export interface Project {
  id: string
  title: string
  role: string
  tags: string[]
  summary: string
  gradient: string
  image?: string // path relative to public/ e.g. '/projects/moonhouse-hero.webp'
  link?: string
  linkLabel?: string
  // Extended data for modal
  description: string
  techStack: ProjectTech[]
  sections: ProjectSection[]
  stats: ProjectStat[]
  testimonial?: {
    quote: string
    author: string
    role: string
  }
}

export const PROJECTS: Project[] = [
  {
    id: 'side-effects',
    title: 'Side Effects Studio',
    role: 'Designer, Artist & Developer',
    tags: ['TouchDesigner', 'GLSL', 'Three.js', 'p5.js', 'Processing'],
    summary:
      'Creative studio exploring generative art, real-time visuals, and interactive experiences.',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
    image: '/projects/side-effects-hero.webp',
    link: 'https://studio.robertobh.dev',
    linkLabel: 'Visit Studio',
    description:
      'Side Effects is my creative studio — a space for exploring the intersection of art, code, and real-time systems. From generative visuals and shader experiments to interactive installations, the studio is where I push the boundaries of creative technology.',
    techStack: [
      { name: 'TouchDesigner', category: 'tool' },
      { name: 'GLSL', category: 'frontend' },
      { name: 'Three.js', category: 'frontend' },
      { name: 'p5.js', category: 'frontend' },
      { name: 'Processing', category: 'tool' },
    ],
    sections: [
      {
        title: 'Generative Visuals',
        content:
          'Real-time generative systems built with TouchDesigner and custom GLSL shaders. Audio-reactive compositions, particle systems, and procedural animations that evolve organically.',
      },
      {
        title: 'Creative Coding',
        content:
          'Experiments in p5.js, Processing, and Three.js — from algorithmic patterns and noise fields to interactive web-based installations. Each piece explores a different aspect of computational aesthetics.',
      },
      {
        title: 'Web Experiences',
        content:
          'Interactive browser-based experiences using WebGL, React Three Fiber, and custom shaders. The studio site itself is a showcase of these technologies working together.',
      },
    ],
    stats: [
      { label: 'Tools', value: '5+' },
      { label: 'Medium', value: 'Real-time' },
      { label: 'Focus', value: 'Generative' },
    ],
  },
  {
    id: 'moonhouse',
    title: 'Moonhouse Restaurant',
    role: 'Designer & Creative Director',
    tags: ['Figma', 'Directus', 'Astro', 'CMS Architecture'],
    summary: 'Full brand design and CMS architecture for a restaurant in Fayetteville, AR.',
    gradient: 'linear-gradient(135deg, #1a1a0a 0%, #2d1f0e 50%, #3d2614 100%)',
    image: '/projects/moonhouse-hero.webp',
    link: 'https://moonhouse-ar.com',
    linkLabel: 'Visit Site',
    description:
      'Designed the complete visual identity and web experience for Moonhouse Coffee Bar & Bistro. Architected a fully CMS-driven system using Directus so restaurant owners can update every aspect of the site — menu, gallery, hours, text — without any developer involvement.',
    techStack: [
      { name: 'Figma', category: 'tool' },
      { name: 'Astro', category: 'frontend' },
      { name: 'React', category: 'frontend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'Directus', category: 'backend' },
    ],
    sections: [
      {
        title: 'Design Concept',
        content:
          'Created the complete UI in Figma — from the textured psychedelic header to the warm black-and-gold palette that reflects the physical space. The design balances vintage charm with modern minimalism, matching the century-old house that Moonhouse inhabits.',
      },
      {
        title: 'CMS Architecture',
        content:
          'Designed the Directus data model with 10+ collections: Gallery Images, Menu Items, Categories, Variants, Info Cards, Opening Hours, Banner, Landing Text, and more. Every visible element on the site is editable through the dashboard — a decision that proved critical when the restaurant changed its entire menu concept.',
      },
      {
        title: 'Developer Handoff',
        content:
          'Delivered pixel-perfect Figma specs to the development team (Dari Developer). Defined the content structure, API schema, and SEO strategy including Open Graph, JSON-LD, and multi-language support (English/Spanish).',
      },
    ],
    stats: [
      { label: 'CMS Collections', value: '10+' },
      { label: 'Menu Items', value: '36' },
      { label: 'Languages', value: '2' },
    ],
  },
  {
    id: 'giftcard',
    title: 'Giftcard System',
    role: 'Full-Stack Developer',
    tags: ['Python', 'Flask', 'SQLite', 'QR'],
    summary: 'Gift card management platform with role-based access.',
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #0e2d1f 50%, #143d26 100%)',
    image: '/projects/giftcard-preview.webp',
    linkLabel: 'Case Study',
    description:
      'A self-hosted gift card management system built for Moonhouse restaurant. Handles card generation, redemption, recharging, and balance tracking with role-based access control.',
    techStack: [
      { name: 'Python', category: 'backend' },
      { name: 'Flask', category: 'backend' },
      { name: 'SQLite', category: 'backend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'Gunicorn', category: 'infra' },
      { name: 'Nginx', category: 'infra' },
      { name: 'Ubuntu', category: 'infra' },
    ],
    sections: [
      {
        title: 'Card Generation',
        content:
          'Each card gets a unique 16-character alphanumeric code with both QR and Code128 barcode generation. Cards are printable, laminated, and reusable with configurable denominations.',
      },
      {
        title: 'Access Control',
        content:
          'Role-based system with admin and cashier tiers. Admins manage cards, users, and system settings. Cashiers handle day-to-day redemptions, verifications, and recharges through a streamlined mobile-friendly interface.',
      },
      {
        title: 'Production Infrastructure',
        content:
          "Self-hosted on a Hetzner VPS running Ubuntu. Deployed with Gunicorn behind Nginx reverse proxy, SSL via Let's Encrypt, automated daily backups with 7-day retention, and systemd process management.",
      },
      {
        title: 'Money Precision',
        content:
          'All monetary values stored as integer cents to eliminate floating-point precision issues. Custom template filters handle display formatting. Full audit trail for every transaction.',
      },
    ],
    stats: [
      { label: 'Tests', value: '117' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Backup', value: 'Daily' },
    ],
  },
]
