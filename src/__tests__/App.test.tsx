import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// ----- Mocks -----
// Mock framer-motion so motion.div etc. render as plain HTML
vi.mock('framer-motion', () => {
  const cache = new Map<string, unknown>()
  return {
    motion: new Proxy(
      {},
      {
        get: (_: object, tag: string) => {
          if (!cache.has(tag)) {
            cache.set(
              tag,
              function MotionEl({
                children,
                ...props
              }: {
                children?: React.ReactNode
                [key: string]: unknown
              }) {
                return React.createElement(tag, props, children)
              },
            )
          }
          return cache.get(tag)
        },
      },
    ),
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
    useReducedMotion: () => false,
  }
})

// Mock the lazy-loaded HeroCanvas so we can detect whether App tried to
// render it (we look for a stable test id).
const heroCanvasMock = vi.fn((..._args: unknown[]) =>
  React.createElement('div', { 'data-testid': 'hero-canvas-mock' }, 'mocked hero canvas'),
)
vi.mock('../components/three/HeroCanvas', () => ({
  default: (props: Record<string, unknown>) => heroCanvasMock(props),
}))

// Stub the section components — App renders Navbar, About, ProjectMatrix,
// Activity and Footer. We don't care about their internals here; we want
// the tests to focus on App's WebGL probe, skip link, and <main>.
vi.mock('../components/layout/Navbar', () => ({
  default: () => React.createElement('nav', { 'data-testid': 'navbar-mock' }, 'navbar'),
}))
vi.mock('../sections/About', () => ({
  default: () => React.createElement('section', { id: 'about' }, 'about'),
}))
vi.mock('../sections/ProjectMatrix', () => ({
  default: () => React.createElement('section', { id: 'projects' }, 'projects'),
}))
vi.mock('../sections/Activity', () => ({
  default: () => React.createElement('section', { id: 'activity' }, 'activity'),
}))
vi.mock('../sections/Footer', () => ({
  default: () => React.createElement('footer', null, 'footer'),
}))

// Helper to (re-)import App so the useState init re-runs after we change
// the WebGL detection behavior.
async function loadApp() {
  vi.resetModules()
  // Re-apply mocks after resetModules
  vi.doMock('framer-motion', () => {
    const cache = new Map<string, unknown>()
    return {
      motion: new Proxy(
        {},
        {
          get: (_: object, tag: string) => {
            if (!cache.has(tag)) {
              cache.set(
                tag,
                function MotionEl({
                  children,
                  ...props
                }: {
                  children?: React.ReactNode
                  [key: string]: unknown
                }) {
                  return React.createElement(tag, props, children)
                },
              )
            }
            return cache.get(tag)
          },
        },
      ),
      AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
      useReducedMotion: () => false,
    }
  })
  vi.doMock('../components/three/HeroCanvas', () => ({
    default: (props: Record<string, unknown>) => heroCanvasMock(props as unknown),
  }))
  vi.doMock('../components/layout/Navbar', () => ({
    default: () => React.createElement('nav', { 'data-testid': 'navbar-mock' }, 'navbar'),
  }))
  vi.doMock('../sections/About', () => ({
    default: () => React.createElement('section', { id: 'about' }, 'about'),
  }))
  vi.doMock('../sections/ProjectMatrix', () => ({
    default: () => React.createElement('section', { id: 'projects' }, 'projects'),
  }))
  vi.doMock('../sections/Activity', () => ({
    default: () => React.createElement('section', { id: 'activity' }, 'activity'),
  }))
  vi.doMock('../sections/Footer', () => ({
    default: () => React.createElement('footer', null, 'footer'),
  }))
  const mod = await import('../App')
  return mod.default
}

const realGetContext = HTMLCanvasElement.prototype.getContext

describe('App', () => {
  beforeEach(() => {
    heroCanvasMock.mockClear()
  })

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = realGetContext
  })

  it('renders the static gradient (and not HeroCanvas) when getContext returns null', async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => null,
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext
    const App = await loadApp()
    render(<App />)
    expect(heroCanvasMock).not.toHaveBeenCalled()
    expect(screen.queryByTestId('hero-canvas-mock')).toBeNull()
  })

  it('mounts HeroCanvas (inside Suspense) when getContext returns a truthy context', async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => ({}) as WebGLRenderingContext,
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext
    const App = await loadApp()
    render(<App />)
    // HeroCanvas is React.lazy — even with the mock cached, React.lazy
    // suspends on first render. Await the testid showing up after the
    // chunk resolves and the second commit lands.
    await waitFor(
      () => {
        expect(screen.getByTestId('hero-canvas-mock')).toBeTruthy()
      },
      { timeout: 2000 },
    )
    expect(heroCanvasMock).toHaveBeenCalled()
  })

  it('falls back to the static gradient when getContext throws', async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => {
      throw new Error('GPU unavailable')
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext
    const App = await loadApp()
    render(<App />)
    expect(heroCanvasMock).not.toHaveBeenCalled()
    expect(screen.queryByTestId('hero-canvas-mock')).toBeNull()
  })

  it('renders a skip link with href="#main" as an early focusable element', async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => null,
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext
    const App = await loadApp()
    render(<App />)
    const skip = screen.getByText(/skip to content/i)
    expect(skip).toBeTruthy()
    expect(skip.tagName).toBe('A')
    expect(skip.getAttribute('href')).toBe('#main')
  })

  it('renders <main> with id="main" wrapping the page content', async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => null,
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext
    const App = await loadApp()
    const { container } = render(<App />)
    const main = container.querySelector('main#main') as HTMLElement | null
    expect(main).not.toBeNull()
    expect(main!.tagName).toBe('MAIN')
  })
})
