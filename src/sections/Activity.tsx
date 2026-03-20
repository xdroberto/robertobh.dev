import { motion } from 'framer-motion'
import Section from '../components/layout/Section'
import { useGitHubActivity } from '../hooks/useGitHubActivity'

const LEVEL_COLORS = [
  'bg-[#161412]', // 0 - empty
  'bg-[#3a2a20]', // 1 - low
  'bg-[#6b4530]', // 2 - medium
  'bg-[#c47040]', // 3 - high
  'bg-[#ffcc00]', // 4 - max
]

export default function Activity() {
  const { stats, grid, loading, isRealData } = useGitHubActivity()

  const totalCells = grid.flat().reduce((sum, v) => sum + v, 0)

  return (
    <Section id="activity">
      {/* Section label */}
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
              Live
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16">
        {/* Left: description + stats */}
        <div>
          <p className="text-sm sm:text-base leading-relaxed text-[#8a8480] mb-8 max-w-md">
            {isRealData
              ? 'Real-time contribution data pulled from GitHub. Monitoring repository commits and deployment cycles.'
              : 'Consistent contribution to open-source infrastructure and core system logic. Monitoring repository commits and deployment cycles.'}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 sm:gap-12">
            {/* Contributions / Activity */}
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="block font-mono text-2xl sm:text-3xl font-bold text-[#e0dcd8]"
              >
                {isRealData ? stats.totalContributions : totalCells}
              </motion.span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#8a8480] mt-1 block">
                {isRealData ? 'Events (90d)' : 'Contributions'}
              </span>
            </div>

            {/* Repos */}
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
                Repositories
              </span>
            </div>

            {/* Languages */}
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

            {/* Top language */}
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
        </div>

        {/* Right: contribution grid — single animation on container, not 182 individual ones */}
        <motion.div
          className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <div className="flex gap-[3px] w-max">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className={`w-[10px] h-[10px] sm:w-3 sm:h-3 rounded-[2px] ${LEVEL_COLORS[level]}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-3 w-max min-w-full">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#8a8480]/50">
              Less
            </span>
            <div className="flex items-center gap-[3px] mx-3">
              {LEVEL_COLORS.map((color, i) => (
                <div key={i} className={`w-[10px] h-[10px] sm:w-3 sm:h-3 rounded-[2px] ${color}`} />
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
