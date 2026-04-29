import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import WaveShader from './WaveShader'

// Cap DPR at 1 on small viewports — phone GPUs are pixel-bound. At dpr=2 the
// shader has to fill 4× more pixels per frame than at dpr=1.
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
const DPR: [number, number] = isMobile ? [1, 1] : [1, 2]

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      gl={{
        antialias: !isMobile,
        alpha: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
        // Smaller framebuffer + less work per frame on mobile
        precision: isMobile ? 'mediump' : 'highp',
      }}
      dpr={DPR}
      // Debounce the resize handler so the iOS URL-bar bouncing during scroll
      // doesn't trigger a re-mount of the renderer every frame.
      resize={{ debounce: { scroll: 250, resize: 50 } }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <WaveShader />
      </Suspense>
    </Canvas>
  )
}
