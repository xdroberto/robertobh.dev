import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import WaveShader from './WaveShader'

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      }}
      dpr={[1, 2]}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <WaveShader />
      </Suspense>
    </Canvas>
  )
}
