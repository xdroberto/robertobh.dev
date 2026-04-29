import { motion } from 'framer-motion'
import Section from '../components/layout/Section'
import { useGitHubActivity } from '../hooks/useGitHubActivity'
import { formatRelativeDays } from '../utils/github'

const LEVEL_COLORS = [
  'bg-[#161412]', // 0 - empty
  'bg-[#3a2a20]', // 1 - low
  'bg-[#6b4530]', // 2 - medium
  'bg-[#c47040]', // 3 - high
  'bg-[#ffcc00]', // 4 - max
]

export default function Activity() {
  const { stats, grid, loading, isRealData } = useGitHubActivity()

  const lastRelative = stats.lastContributionDate
    ? formatRelativeDays(stats.lastContributionDate)
    : null

  const topLanguages = stats.languages.slice(0, 4)

  return (
    <Section id="activity">
      <div className="mb-10 sm:mb-14">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#8a8480]">
            Engineering_Activity
          </span>
          {loading && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffcc00] animate-pulse" />
          )}
          {isRealData && (
            <span className="font-mono text-[8px] tracking-wider uppercase text-[#6b4530]">
              Live · GitHub
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16">
        {/* Left: storytelling + stats */}
        <div>
          <p className="text-sm sm:text-base leading-relaxed text-[#8a8480] mb-8 max-w-xl">
            {isRealData ? (
              <>
                <span className="text-[#e0dcd8]">{stats.contributionsLastYear} contributions</span>{' '}
                in the last year across public and private repositories.
                {lastRelative && (
                  <>
                    {' '}
                    Last commit <span className="text-[#e0dcd8]">{lastRelative}</span>.
                  </>
                )}
              </>
            ) : (
              'Activity loaded from the GitHub contribution calendar — public and private repositories combined.'
            )}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 mb-8">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="block font-mono text-2xl sm:text-3xl font-bold text-[#e0dcd8]"
              >
                {stats.contributionsLastYear}
              </motion.span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#8a8480] mt-1 block">
                Contributions / yr
              </span>
            </div>

            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="block font-mono text-2xl sm:text-3xl font-bold text-[#e0dcd8]"
              >
                {stats.publicRepos}
              </motion.span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#8a8480] mt-1 block">
                Public repos
              </span>
            </div>

            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="block font-mono text-2xl sm:text-3xl font-bold text-[#e0dcd8]"
              >
                {stats.languages.length}
              </motion.span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#8a8480] mt-1 block">
                Languages
              </span>
            </div>

            {stats.languages.length > 0 && (
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="block font-mono text-2xl sm:text-3xl font-bold text-[#ffcc00]"
                >
                  {stats.languages[0].name}
                </motion.span>
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#8a8480] mt-1 block">
                  Primary
                </span>
              </div>
            )}
          </div>

          {/* Top languages breakdown */}
          {topLanguages.length > 1 && (
            <div className="flex flex-wrap gap-x-5 gap-y-2 max-w-md">
              {topLanguages.map((lang) => (
                <span
                  key={lang.name}
                  className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#8a8480]/70"
                >
                  <span className="text-[#ffcc00]/70">●</span> {lang.name}
                  <span className="text-[#8a8480]/40 ml-1.5">×{lang.count}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: contribution grid (52 weeks) */}
        <motion.div
          className="w-full lg:w-[600px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <div
            className="grid gap-[2px] sm:gap-[3px] w-full"
            style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' }}
          >
            {grid.map((week, wi) =>
              week.map((level, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`aspect-square rounded-[2px] ${LEVEL_COLORS[level]}`}
                  style={{ gridColumn: wi + 1, gridRow: di + 1 }}
                />
              )),
            )}
          </div>

          <div className="flex items-center justify-between mt-3 w-full">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#8a8480]/50">
              52w
            </span>
            <div className="flex items-center gap-[3px] mx-3">
              {LEVEL_COLORS.map((color, i) => (
                <div
                  key={i}
                  className={`w-[7px] h-[7px] sm:w-[10px] sm:h-[10px] rounded-[2px] ${color}`}
                />
              ))}
            </div>
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#8a8480]/50">
              More
            </span>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
