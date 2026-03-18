import Section from '../components/layout/Section'

export default function Contact() {
  return (
    <Section id="contact" className="pb-32">
      <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
      <div className="w-12 h-0.5 bg-[var(--color-accent)] mb-8" />

      <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto mb-8">
        Interested in working together or have a question? Feel free to reach out.
      </p>

      <div className="flex justify-center gap-6">
        <a
          href="mailto:robertobecerrilhurtado@gmail.com"
          className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Say Hello
        </a>
        <a
          href="https://github.com/xdroberto"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)] transition-colors"
        >
          GitHub
        </a>
      </div>

      <footer className="mt-24 text-sm text-[var(--color-text-secondary)]/50">
        &copy; {new Date().getFullYear()} Roberto BH
      </footer>
    </Section>
  )
}
