const LINKS = [
  { label: 'GitHub', href: 'https://github.com/xdroberto' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/roberto-becerril-hurtado/' },
  { label: 'Email', href: 'mailto:robertobecerrilhurtado@gmail.com' },
]

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#2a2420]/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32">
        {/* Main: CTA left, links right */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="max-w-sm">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#e0dcd8] mb-3">
              Let's build something.
            </h2>
            <p className="text-xs sm:text-sm text-[#8a8480] leading-relaxed">
              Open to collaboration and interesting conversations about technology.
            </p>
          </div>

          <nav className="flex flex-row flex-wrap sm:flex-col items-start gap-x-6 gap-y-2 sm:gap-3 sm:items-end">
            {LINKS.map((link) => {
              const isExternal = !link.href.startsWith('mailto')
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="font-mono text-[11px] sm:text-xs tracking-[0.15em] uppercase text-[#8a8480] hover:text-[#ffcc00] transition-colors duration-300"
                >
                  {link.label}
                  {isExternal && <span className="sr-only"> (opens in new tab)</span>}
                </a>
              )
            })}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-[#2a2420]/30 mb-5" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-mono text-[9px] sm:text-[10px] tracking-[0.12em] text-[#8a8480]/70">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span>&copy; {new Date().getFullYear()} Roberto BH</span>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1.5">
              Made in
              {/* The Mexican flag without the coat of arms is visually identical
                  to the Italian flag — both are vertical green-white-red. The
                  emoji renders the OS-native flag glyph (with the eagle on
                  iOS/Android/macOS), which is unambiguous and accessible. */}
              <span
                role="img"
                aria-label="Mexico"
                className="leading-none shrink-0 text-sm"
                style={{
                  fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
                }}
              >
                🇲🇽
              </span>
            </span>
          </div>
          <a
            href="https://donate.unrwa.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {/* Palestine flag with triangle */}
            <svg
              className="w-4 h-[10px] shrink-0"
              viewBox="0 0 60 36"
              aria-label="Palestine"
              role="img"
            >
              <rect width="60" height="12" fill="#000" />
              <rect y="12" width="60" height="12" fill="#fff" />
              <rect y="24" width="60" height="12" fill="#009736" />
              <polygon points="0,0 20,18 0,36" fill="#ce1126" />
            </svg>
            <span className="text-[#8a8480]/70 group-hover:text-[#8a8480] transition-colors">
              Donate for Palestine
            </span>
            <span className="sr-only">(opens in new tab)</span>
            <svg
              className="w-2.5 h-2.5 text-[#ce1126]/70 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
