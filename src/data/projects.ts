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
    role: 'Creator & Lead Developer',
    tags: ['React', 'WebGL', 'Three.js', 'GLSL'],
    summary: 'Generative audio-visual environment with real-time rendering.',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
    link: 'https://studio.robertobh.dev',
    linkLabel: 'Launch Studio',
    description:
      'An interactive creative coding platform that merges generative art with real-time audio analysis. Built as a playground for shader experimentation and audio-reactive visuals.',
    techStack: [
      { name: 'React 19', category: 'frontend' },
      { name: 'React Three Fiber', category: 'frontend' },
      { name: 'Three.js', category: 'frontend' },
      { name: 'GLSL', category: 'frontend' },
      { name: 'Web Audio API', category: 'frontend' },
      { name: 'TypeScript', category: 'tool' },
      { name: 'Vite', category: 'tool' },
    ],
    sections: [
      {
        title: 'Shader Pipeline',
        content:
          'Custom GLSL fragment shaders with multi-wave synthesis, chromatic aberration, and noise-based distortion. The rendering pipeline adapts in real-time to audio frequency data, creating a direct link between sound and visuals.',
      },
      {
        title: 'Audio Integration',
        content:
          'The Web Audio API analyzes incoming audio streams to extract frequency bins and amplitude data. These values drive shader uniforms, allowing visual parameters like wave intensity, color shifts, and distortion to respond organically to music.',
      },
      {
        title: 'Performance',
        content:
          'Adaptive DPR scaling based on device capabilities, efficient uniform updates without re-compilation, and WebGL context loss recovery. The system gracefully degrades on mobile while maintaining visual fidelity on desktop.',
      },
    ],
    stats: [
      { label: 'Shaders', value: '4+' },
      { label: 'Avg FPS', value: '60' },
      { label: 'Bundle', value: '<200KB' },
    ],
  },
  {
    id: 'moonhouse',
    title: 'Moonhouse Bistro',
    role: 'Design & Architecture',
    tags: ['Next.js', 'CMS', 'Dashboard'],
    summary: 'Restaurant web presence with dynamic content management.',
    gradient: 'linear-gradient(135deg, #1a1a0a 0%, #2d1f0e 50%, #3d2614 100%)',
    link: 'https://moonhouse-ar.com',
    linkLabel: 'Visit Site',
    description:
      'A full restaurant web platform with a custom dashboard for real-time content management. Designed to give the restaurant complete control over their digital presence without developer intervention.',
    techStack: [
      { name: 'Next.js', category: 'frontend' },
      { name: 'React', category: 'frontend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'Vercel', category: 'infra' },
      { name: 'CMS Dashboard', category: 'backend' },
    ],
    sections: [
      {
        title: 'Content Management',
        content:
          'A dashboard-driven CMS that allows non-technical staff to update menus, hours, events, and gallery images in real-time. Changes propagate instantly without redeployment.',
      },
      {
        title: 'Design System',
        content:
          'Brand-consistent component library with responsive layouts optimized for the restaurant industry. Dark, warm color palette reflecting the physical restaurant ambiance.',
      },
      {
        title: 'SEO & Performance',
        content:
          'Server-side rendering for optimal search engine visibility. Structured data markup for restaurant discovery, optimized images, and sub-second load times.',
      },
    ],
    stats: [
      { label: 'Lighthouse', value: '95+' },
      { label: 'Load Time', value: '<1.5s' },
      { label: 'Mobile Score', value: '98' },
    ],
    testimonial: {
      quote: 'The site perfectly captures the atmosphere of our restaurant. Our customers love it.',
      author: 'Moonhouse Team',
      role: 'Restaurant Owner',
    },
  },
  {
    id: 'giftcard',
    title: 'Giftcard System',
    role: 'Full-Stack Developer',
    tags: ['Python', 'Flask', 'SQLite', 'QR'],
    summary: 'Gift card management platform with role-based access.',
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #0e2d1f 50%, #143d26 100%)',
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
      { label: 'Test Coverage', value: '39 tests' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Backup', value: 'Daily' },
    ],
  },
]
