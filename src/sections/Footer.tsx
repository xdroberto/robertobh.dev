import { motion } from 'framer-motion'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/xdroberto' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/roberto-becerril-hurtado/' },
  { label: 'Email', href: 'mailto:robertobecerrilhurtado@gmail.com' },
]

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#2a2420]/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        {/* Main: CTA left, links right */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-12">
          <div className="max-w-sm">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-xl sm:text-2xl font-semibold text-[#e0dcd8] mb-3"
            >
              Let's build something.
            </motion.h3>
            <p className="text-xs sm:text-sm text-[#8a8480] leading-relaxed">
              Open to collaboration and interesting conversations about technology.
            </p>
          </div>

          <div className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2.5 sm:items-end">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase text-[#8a8480]/60 hover:text-[#ffcc00] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-[#2a2420]/30 mb-5" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[9px] sm:text-[10px] tracking-[0.12em] text-[#8a8480]/40">
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} Roberto BH</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              Made in{' '}
              <svg className="w-4 h-[10px] shrink-0" viewBox="0 0 60 36" aria-label="Mexico">
                <rect width="20" height="36" fill="#006847" />
                <rect x="20" width="20" height="36" fill="#fff" />
                <rect x="40" width="20" height="36" fill="#ce1126" />
                <circle cx="30" cy="18" r="4" fill="#6d3a1a" />
              </svg>
            </span>
          </div>
          <a
            href="https://donate.unrwa.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {/* Palestine flag with triangle */}
            <svg className="w-4 h-[10px] shrink-0" viewBox="0 0 60 36" aria-label="Palestine">
              <rect width="60" height="12" fill="#000" />
              <rect y="12" width="60" height="12" fill="#fff" />
              <rect y="24" width="60" height="12" fill="#009736" />
              <polygon points="0,0 20,18 0,36" fill="#ce1126" />
            </svg>
            <span className="text-[#8a8480]/40 group-hover:text-[#8a8480]/60 transition-colors">
              Donate for Palestine
            </span>
            <svg className="w-2.5 h-2.5 text-[#ce1126]/40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
