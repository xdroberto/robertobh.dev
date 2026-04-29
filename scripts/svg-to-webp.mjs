import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const inputPath = resolve('public/projects/legal-assistant.svg')
const outputPath = resolve('public/projects/legal-assistant.webp')
const svg = readFileSync(inputPath)

await sharp(svg, { density: 200 })
  .resize(1200, 800, { fit: 'cover' })
  .webp({ quality: 80 })
  .toFile(outputPath)

console.log(`Wrote ${outputPath}`)
