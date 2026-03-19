import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/layout/Section'

// Generate a realistic-looking contribution grid
function generateGrid(weeks: number, rows: number): number[][] {
  const grid: number[][] = []
  // Use a seeded approach for consistent rendering
  let seed = 42
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647
    return seed / 2147483647
  }

  for (let w = 0; w < weeks; w++) {
    const col: number[] = []
    // Simulate burst patterns - some weeks are more active
    const weekActivity = rand() > 0.3 ? rand() * 0.8 + 0.2 : rand() * 0.15
    for (let d = 0; d < rows; d++) {
      const val = rand() < weekActivity ? Math.ceil(rand() * 4) : 0
      col.push(val)
    }
    grid.push(col)
  }
  return grid
}

const LEVEL_COLORS = [
  'bg-[#161412]', // 0 - empty
  'bg-[#3a2a20]', // 1 - low
  'bg-[#6b4530]', // 2 - medium
  'bg-[#c47040]', // 3 - high
  'bg-[#ffcc00]', // 4 - max
]

export default function Activity() {
  const grid = useMemo(() => generateGrid(26, 7), [])

  const totalContributions = useMemo(() => {
    return grid.flat().reduce((sum, v) => sum + v, 0)
  }, [grid])

  return (
    <Section id="activity">
      {/* Section label */}
      <div className="mb-10 sm:mb-14">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#8a8480]">
          Engineering_Activity
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16">
        {/* Left: description + stats */}
        <div>
          <p className="text-sm sm:text-base leading-relaxed text-[#8a8480] mb-8 max-w-md">
            Consistent contribution to open-source infrastructure and core system logic. Monitoring
            repository commits and deployment cycles.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 sm:gap-12">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="block font-mono text-2xl sm:text-3xl font-bold text-[#e0dcd8]"
              >
                {totalContributions}
              </motion.span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#8a8480] mt-1 block">
                Contributions
              </span>
            </div>
            <div>
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-[#e0dcd8]">
                6
              </span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#8a8480] mt-1 block">
                Repositories
              </span>
            </div>
            <div>
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-[#e0dcd8]">
                24ms
              </span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#8a8480] mt-1 block">
                Avg Latency
              </span>
            </div>
          </div>
        </div>

        {/* Right: contribution grid */}
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
          <div className="flex gap-[3px] w-max">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level, di) => (
                  <motion.div
                    key={`${wi}-${di}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: wi * 0.01 + di * 0.005 }}
                    className={`w-[10px] h-[10px] sm:w-3 sm:h-3 rounded-[2px] ${LEVEL_COLORS[level]} transition-colors`}
                    title={`Level ${level}`}
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
        </div>
      </div>
    </Section>
  )
}
