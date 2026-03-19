import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Points } from 'three'
import * as THREE from 'three'

// Seeded random to avoid impure Math.random in render
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

export default function ParticleField({ count = 2000 }) {
  const ref = useRef<Points>(null)

  // Generate positions once with seeded random (pure)
  const [positions] = useState(() => {
    const rand = seededRandom(42)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 20
      pos[i * 3 + 1] = (rand() - 0.5) * 20
      pos[i * 3 + 2] = (rand() - 0.5) * 20
    }
    return pos
  })

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={new THREE.Color('#6366f1')}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}
