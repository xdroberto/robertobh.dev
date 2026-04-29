// Generates an engraved-medallion SVG for the Legal OS card.
// Run: node scripts/gen-legal-os-image.mjs
import { writeFileSync, mkdirSync } from 'node:fs'

const W = 1200
const H = 800
const CX = 600
const CY = 410
const R = 240

const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

// Build a wavy horizontal line — used to make a guilloche stripe pattern
function wavyLine({ y0, freq, amp, phase, width = W, step = 4 }) {
  let path = ''
  for (let x = -10; x <= width + 10; x += step) {
    const y = y0 + amp * Math.sin(x * freq + phase)
    path += (path === '' ? 'M ' : ' L ') + fmt(x) + ' ' + fmt(y)
  }
  return path
}

// Stack of wavy lines that interfere -> classic security-print look
function guilloche({ y0, count, spacing, freq, amp, phaseShift, color, opacity, strokeWidth = 0.5 }) {
  let out = ''
  for (let i = 0; i < count; i++) {
    const y = y0 + i * spacing
    const phase = i * phaseShift
    const a = amp + (i % 3) * 1.2
    const f = freq * (1 + (i % 5) * 0.025)
    const path = wavyLine({ y0: y, freq: f, amp: a, phase })
    out += `  <path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}"/>\n`
  }
  return out
}

// Concentric arcs around the medallion edge — radial guilloche
function radialPattern({ cx, cy, r, count, color, opacity, strokeWidth = 0.4 }) {
  let out = ''
  for (let i = 0; i < count; i++) {
    const radius = r + i * 1.4
    out += `  <circle cx="${cx}" cy="${cy}" r="${fmt(radius)}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}"/>\n`
  }
  return out
}

// Tick marks around the medallion — like a chapter ring
function tickRing({ cx, cy, rInner, rOuter, count, color, opacity, strokeWidth = 0.6 }) {
  let out = ''
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2
    const x1 = cx + rInner * Math.cos(t)
    const y1 = cy + rInner * Math.sin(t)
    const x2 = cx + rOuter * Math.cos(t)
    const y2 = cy + rOuter * Math.sin(t)
    out += `  <line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}"/>\n`
  }
  return out
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="55%" r="75%">
      <stop offset="0%" stop-color="#3a2e52"/>
      <stop offset="55%" stop-color="#241a36"/>
      <stop offset="100%" stop-color="#10081a"/>
    </radialGradient>
    <radialGradient id="medallionFill" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#ffcc00" stop-opacity="0.10"/>
      <stop offset="55%" stop-color="#ffcc00" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#ffcc00" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffe89a"/>
      <stop offset="45%" stop-color="#ffcc00"/>
      <stop offset="100%" stop-color="#9c7400"/>
    </linearGradient>
    <linearGradient id="metalH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9c7400"/>
      <stop offset="50%" stop-color="#ffe89a"/>
      <stop offset="100%" stop-color="#9c7400"/>
    </linearGradient>
    <linearGradient id="ivory" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f4eadb"/>
      <stop offset="100%" stop-color="#9580c9"/>
    </linearGradient>
    <linearGradient id="panLeft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#b6a3e3" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#3a2e52" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="panRight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffcc00" stop-opacity="0.40"/>
      <stop offset="100%" stop-color="#3a2e52" stop-opacity="0.05"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="80%">
      <stop offset="60%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient>

    <!-- Curved text paths around the medallion -->
    <path id="topArc" d="M ${CX - R + 26} ${CY} a ${R - 26} ${R - 26} 0 0 1 ${(R - 26) * 2} 0" fill="none"/>
    <path id="botArc" d="M ${CX + R - 26} ${CY} a ${R - 26} ${R - 26} 0 0 1 -${(R - 26) * 2} 0" fill="none"/>
  </defs>

  <!-- Background gradient -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Guilloche stripes — two layered passes form the security pattern -->
  <g>
${guilloche({ y0: -20, count: 38, spacing: 24, freq: 0.0125, amp: 14, phaseShift: 0.55, color: '#9580c9', opacity: 0.075 })}${guilloche({ y0: -20, count: 38, spacing: 24, freq: 0.019, amp: 9, phaseShift: -0.85, color: '#ffcc00', opacity: 0.05 })}  </g>

  <!-- Background letter "L" — engraved feel, sits behind the medallion -->
  <text x="${CX}" y="${CY + 165}" text-anchor="middle" font-family="Georgia, 'Bodoni Moda', 'Playfair Display', serif" font-style="italic" font-weight="700" font-size="600" fill="#3a2e52" opacity="0.55" letter-spacing="-20">L</text>

  <!-- Outer medallion glow + fill -->
  <circle cx="${CX}" cy="${CY}" r="${R + 4}" fill="url(#medallionFill)"/>

  <!-- Outer ornamental rings -->
  <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="url(#metalH)" stroke-width="1.4" opacity="0.85"/>
  <circle cx="${CX}" cy="${CY}" r="${R - 4}" fill="none" stroke="#ffcc00" stroke-width="0.4" opacity="0.45"/>
  <circle cx="${CX}" cy="${CY}" r="${R - 12}" fill="none" stroke="#ffcc00" stroke-width="0.3" opacity="0.32" stroke-dasharray="0.5 3"/>
  <circle cx="${CX}" cy="${CY}" r="${R - 36}" fill="none" stroke="#ffcc00" stroke-width="0.5" opacity="0.4"/>
  <circle cx="${CX}" cy="${CY}" r="${R - 40}" fill="none" stroke="#ffcc00" stroke-width="0.3" opacity="0.25"/>

  <!-- Tick ring (chapter ring) -->
${tickRing({ cx: CX, cy: CY, rInner: R - 6, rOuter: R - 12, count: 60, color: '#ffcc00', opacity: 0.5 })}
  <!-- Larger ticks every 6 minor ticks -->
${tickRing({ cx: CX, cy: CY, rInner: R - 4, rOuter: R - 14, count: 12, color: '#ffcc00', opacity: 0.85, strokeWidth: 1 })}

  <!-- Curved engraved text on the medallion edge -->
  <text font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="14" font-weight="500" letter-spacing="6" fill="url(#metalH)" opacity="0.95">
    <textPath href="#topArc" startOffset="50%" text-anchor="middle">⟡  LEX  ·  IUSTITIA  ·  ORDO  ⟡</textPath>
  </text>
  <text font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="11" font-weight="400" letter-spacing="5" fill="#ffcc00" opacity="0.55">
    <textPath href="#botArc" startOffset="50%" text-anchor="middle">PRIVATE BETA  ·  v0.1.0  ·  PRIVATE BETA</textPath>
  </text>

  <!-- Inner engraved arcs — radial guilloche pattern -->
${radialPattern({ cx: CX, cy: CY, r: R - 50, count: 8, color: '#ffcc00', opacity: 0.08, strokeWidth: 0.4 })}

  <!-- ===== Balance (scales of justice) ===== -->
  <g transform="translate(${CX} ${CY})" stroke-linecap="round">
    <!-- Top finial: small star inside concentric rings -->
    <circle cx="0" cy="-150" r="13" fill="none" stroke="url(#metal)" stroke-width="1.2" opacity="0.85"/>
    <circle cx="0" cy="-150" r="6.5" fill="url(#metal)" opacity="0.95"/>
    <path d="M 0 -160 L 2.5 -154 L 9 -154 L 4 -150 L 6 -143 L 0 -147 L -6 -143 L -4 -150 L -9 -154 L -2.5 -154 Z" fill="#fff" opacity="0.85"/>

    <!-- Vertical post -->
    <line x1="0" y1="-138" x2="0" y2="120" stroke="url(#ivory)" stroke-width="2.2" opacity="0.95"/>

    <!-- Center node where beam meets post -->
    <circle cx="0" cy="-78" r="14" fill="none" stroke="#ffcc00" stroke-width="0.5" opacity="0.4"/>
    <circle cx="0" cy="-78" r="7" fill="url(#metal)" opacity="0.95"/>

    <!-- Crossbeam: subtle curves at the ends, long flat in the middle -->
    <path d="M -160 -78 Q -148 -86 -110 -82 L 110 -82 Q 148 -86 160 -78"
          stroke="url(#ivory)" stroke-width="2.2" fill="none" opacity="0.95"/>
    <!-- Decorative finials at beam tips -->
    <circle cx="-160" cy="-78" r="5" fill="url(#metal)" opacity="0.95"/>
    <circle cx="160" cy="-78" r="5" fill="url(#metal)" opacity="0.95"/>
    <circle cx="-160" cy="-78" r="9" fill="none" stroke="#ffcc00" stroke-width="0.4" opacity="0.4"/>
    <circle cx="160" cy="-78" r="9" fill="none" stroke="#ffcc00" stroke-width="0.4" opacity="0.4"/>

    <!-- Chains from beam to pans -->
    <path d="M -160 -76 Q -160 -50 -190 -22" stroke="#b6a3e3" stroke-width="1" fill="none" opacity="0.7"/>
    <path d="M -160 -76 Q -160 -50 -130 -22" stroke="#b6a3e3" stroke-width="1" fill="none" opacity="0.7"/>
    <path d="M -160 -76 L -160 -22" stroke="#b6a3e3" stroke-width="0.8" fill="none" opacity="0.5"/>

    <path d="M 160 -76 Q 160 -50 190 -22" stroke="#b6a3e3" stroke-width="1" fill="none" opacity="0.7"/>
    <path d="M 160 -76 Q 160 -50 130 -22" stroke="#b6a3e3" stroke-width="1" fill="none" opacity="0.7"/>
    <path d="M 160 -76 L 160 -22" stroke="#b6a3e3" stroke-width="0.8" fill="none" opacity="0.5"/>

    <!-- Left pan: rim ellipse + curved bowl -->
    <ellipse cx="-160" cy="-18" rx="50" ry="9" fill="none" stroke="url(#ivory)" stroke-width="1.4" opacity="0.95"/>
    <path d="M -210 -18 Q -160 14 -110 -18 L -118 -10 Q -160 18 -202 -10 Z"
          fill="url(#panLeft)" stroke="url(#ivory)" stroke-width="1.2" opacity="0.95"/>

    <!-- Right pan -->
    <ellipse cx="160" cy="-18" rx="50" ry="9" fill="none" stroke="url(#ivory)" stroke-width="1.4" opacity="0.95"/>
    <path d="M 110 -18 Q 160 14 210 -18 L 202 -10 Q 160 18 118 -10 Z"
          fill="url(#panRight)" stroke="url(#ivory)" stroke-width="1.2" opacity="0.95"/>

    <!-- Stepped pedestal base -->
    <path d="M -78 120 L -42 108 L 42 108 L 78 120 L 73 134 L -73 134 Z"
          fill="#9580c9" fill-opacity="0.10" stroke="url(#ivory)" stroke-width="1.4" opacity="0.95"/>
    <line x1="-58" y1="120" x2="58" y2="120" stroke="url(#ivory)" stroke-width="0.7" opacity="0.55"/>
    <line x1="-44" y1="113" x2="44" y2="113" stroke="url(#ivory)" stroke-width="0.5" opacity="0.4"/>

    <!-- Floor reflection line -->
    <line x1="-110" y1="138" x2="110" y2="138" stroke="#ffcc00" stroke-width="0.4" opacity="0.3"/>
    <line x1="-90" y1="142" x2="90" y2="142" stroke="#ffcc00" stroke-width="0.3" opacity="0.18"/>
  </g>

  <!-- Decorative dotted lines flanking the medallion -->
  <g stroke="#ffcc00" stroke-width="0.45" opacity="0.4" stroke-dasharray="1 5">
    <line x1="40" y1="${CY}" x2="${CX - R - 30}" y2="${CY}"/>
    <line x1="${CX + R + 30}" y1="${CY}" x2="${W - 40}" y2="${CY}"/>
  </g>
  <g fill="#ffcc00" opacity="0.6">
    <circle cx="${CX - R - 36}" cy="${CY}" r="2"/>
    <circle cx="${CX + R + 36}" cy="${CY}" r="2"/>
  </g>

  <!-- Code annotations top-left -->
  <g font-family="ui-monospace, 'JetBrains Mono', monospace" fill="#b6a3e3">
    <text x="60" y="86" font-size="13" opacity="0.45">balance(case_id) === 0</text>
    <text x="60" y="106" font-size="11" opacity="0.32">// equilibrium check</text>
  </g>

  <!-- Top-right monogram -->
  <g transform="translate(${W - 90} 80)" font-family="Georgia, 'Bodoni Moda', serif" font-style="italic" fill="#ffcc00" opacity="0.55">
    <text font-size="44" font-weight="700" text-anchor="middle">L</text>
    <text x="20" y="-2" font-family="ui-monospace, monospace" font-style="normal" font-size="9" letter-spacing="2" opacity="0.65">OS</text>
  </g>

  <!-- Bottom-right label -->
  <text x="${W - 56}" y="${H - 36}" text-anchor="end" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="11" letter-spacing="3" fill="#e0dcd8" opacity="0.55">LEGAL OS  ·  v0.1.0-beta</text>

  <!-- Vignette -->
  <rect width="${W}" height="${H}" fill="url(#vignette)" pointer-events="none"/>
</svg>
`

mkdirSync('public/projects', { recursive: true })
writeFileSync('public/projects/legal-assistant.svg', svg)
console.log(`Wrote public/projects/legal-assistant.svg — ${svg.length} bytes`)
