import { motion } from 'framer-motion'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/xdroberto' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/roberto-becerril-hurtado/' },
  { label: 'Email', href: 'mailto:robertobecerrilhurtado@gmail.com' },
]

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#2a2420]/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16">

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[9px] sm:text-[10px] tracking-[0.12em] text-[#8a8480]/25">
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} Roberto BH</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              Made in
              <span
                className="inline-block w-2.5 h-[7px] rounded-[1px]"
                style={{ background: 'linear-gradient(to right, #006847 33.33%, #fff 33.33%, #fff 66.66%, #ce1126 66.66%)' }}
                title="Mexico"
              />
            </span>
          </div>
          <a
            href="https://donate.unrwa.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#ffcc00]/50 transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            UNRWA &middot; Palestine
          </a>
        </div>
      </div>
    </footer>
  )
}
