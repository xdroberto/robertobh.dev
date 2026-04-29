// Tech icons sourced from simple-icons (CC0). Each ?raw import loads only the
// requested SVG file, so the bundle stays minimal.
import astroRaw from 'simple-icons/icons/astro.svg?raw'
import directusRaw from 'simple-icons/icons/directus.svg?raw'
import dockerRaw from 'simple-icons/icons/docker.svg?raw'
import figmaRaw from 'simple-icons/icons/figma.svg?raw'
import flaskRaw from 'simple-icons/icons/flask.svg?raw'
import framerRaw from 'simple-icons/icons/framer.svg?raw'
import gunicornRaw from 'simple-icons/icons/gunicorn.svg?raw'
import honoRaw from 'simple-icons/icons/hono.svg?raw'
import nginxRaw from 'simple-icons/icons/nginx.svg?raw'
import nodejsRaw from 'simple-icons/icons/nodedotjs.svg?raw'
import p5jsRaw from 'simple-icons/icons/p5dotjs.svg?raw'
import postgresqlRaw from 'simple-icons/icons/postgresql.svg?raw'
import processingRaw from 'simple-icons/icons/processingfoundation.svg?raw'
import pythonRaw from 'simple-icons/icons/python.svg?raw'
import reactRaw from 'simple-icons/icons/react.svg?raw'
import sqliteRaw from 'simple-icons/icons/sqlite.svg?raw'
import tailwindRaw from 'simple-icons/icons/tailwindcss.svg?raw'
import threejsRaw from 'simple-icons/icons/threedotjs.svg?raw'
import typescriptRaw from 'simple-icons/icons/typescript.svg?raw'
import ubuntuRaw from 'simple-icons/icons/ubuntu.svg?raw'

const ICON_MAP: Record<string, string> = {
  // Frontend
  typescript: typescriptRaw,
  react: reactRaw,
  'react 19': reactRaw,
  'tailwind css': tailwindRaw,
  tailwindcss: tailwindRaw,
  'three.js': threejsRaw,
  'three.js / r3f': threejsRaw,
  'framer motion': framerRaw,
  // Backend & data
  python: pythonRaw,
  'node.js': nodejsRaw,
  'node.js · hono': nodejsRaw,
  hono: honoRaw,
  flask: flaskRaw,
  'flask · fastapi': flaskRaw,
  postgres: postgresqlRaw,
  postgresql: postgresqlRaw,
  'postgres · pgvector': postgresqlRaw,
  sqlite: sqliteRaw,
  'sqlite · drizzle': sqliteRaw,
  // Infra
  docker: dockerRaw,
  nginx: nginxRaw,
  'nginx · systemd': nginxRaw,
  ubuntu: ubuntuRaw,
  gunicorn: gunicornRaw,
  // Creative
  'p5.js': p5jsRaw,
  'p5.js · processing': p5jsRaw,
  processing: processingRaw,
  figma: figmaRaw,
  directus: directusRaw,
  astro: astroRaw,
}

const PATH_RE = /\sd="([^"]+)"/

function extractPath(raw: string): string | null {
  const m = raw.match(PATH_RE)
  return m ? m[1] : null
}

function lookup(name: string): string | null {
  const raw = ICON_MAP[name.toLowerCase()]
  return raw ? extractPath(raw) : null
}

export interface TechIconProps {
  name: string
  className?: string
  /** Render as a span with the icon if found, otherwise null. */
  size?: number
}

export default function TechIcon({ name, className = '', size }: TechIconProps) {
  const path = lookup(name)
  if (!path) return null

  const style = size != null ? { width: size, height: size } : undefined

  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      fill="currentColor"
    >
      <path d={path} />
    </svg>
  )
}
