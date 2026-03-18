import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

// Color uniforms
uniform vec3 bgColorDown;
uniform vec3 bgColorUp;
uniform vec3 color1In;
uniform vec3 color1Out;
uniform vec3 color2In;
uniform vec3 color2Out;
uniform vec3 color3In;
uniform vec3 color3Out;

// Settings
uniform float lineThickness;
uniform float idleWaveHeight;

// Grain
uniform float grainIntensity;

varying vec2 vUv;

float squared(float value) {
  return value * value;
}

float smootherstep(float edge0, float edge1, float x) {
  float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// Film grain
float gaussian(float z, float u, float o) {
  return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
}

vec3 applyGrain(vec3 color, vec2 uv) {
  float t = iTime * 2.0;
  float seed = dot(uv, vec2(12.9898, 78.233));
  float noise = fract(sin(seed) * 43758.5453 + t);
  noise = gaussian(noise, 0.0, 0.5 * 0.5);
  vec3 grain = vec3(noise) * (1.0 - color);
  color += grain * grainIntensity;
  return color;
}

void main() {
  vec2 p = vUv;

  // Background gradient
  vec3 bgCol = mix(bgColorDown, bgColorUp, clamp(p.y * 2.0, 0.0, 1.0));

  float speed = 0.1;

  // Subtle mouse influence on wave center
  float mouseInfluence = (iMouse.y - 0.5) * 0.02;

  // Idle wave animations - 3 overlapping sine waves
  float idleWave1 = idleWaveHeight * sin(p.x * 5.0 + iTime * 0.2);
  float idleWave2 = idleWaveHeight * 0.8 * sin(p.x * 5.0 + iTime * 0.2 + 0.3);
  float idleWave3 = idleWaveHeight * 1.2 * sin(p.x * 5.0 + iTime * 0.2 - 0.2);

  // Base curve
  float curve = idleWaveHeight * sin(6.25 * p.x + speed * iTime);

  // Line A - warm gold
  float lineAFreq = 40.0;
  float lineASpeed = 1.5 * speed;
  float lineAAnim = 0.5 + mouseInfluence + curve + idleWave1 * sin(lineAFreq * p.x + (-lineASpeed * iTime));
  float lineADist = distance(p.y, lineAAnim) * (2.0 / lineThickness);
  float lineAShape = smootherstep(1.0 - clamp(lineADist, 0.0, 1.0), 1.0, 0.99);
  vec3 lineACol = (1.0 - lineAShape) * mix(color1In, color1Out, lineAShape);

  // Ball A
  float ballAX = 0.2 + 0.05 * sin(iTime * 0.2 * speed);
  float ballADist = distance(p, vec2(ballAX, lineAAnim));
  float ballAShape = smootherstep(1.0 - clamp(ballADist * 0.5, 0.0, 1.0), 1.0, 0.99);
  vec3 ballACol = (1.0 - ballAShape) * mix(color1In, color1Out, ballAShape) * 0.8;

  // Line B - red/pink
  float lineBFreq = 50.0;
  float lineBSpeed = 2.0 * speed;
  float lineBAnim = 0.5 + mouseInfluence + curve + idleWave2 * sin(lineBFreq * p.x + lineBSpeed * iTime) * sin(lineBSpeed * iTime);
  float lineBDist = distance(p.y, lineBAnim) * (2.0 / lineThickness);
  float lineBShape = smootherstep(1.0 - clamp(lineBDist, 0.0, 1.0), 1.0, 0.99);
  vec3 lineBCol = (1.0 - lineBShape) * mix(color2In, color2Out, lineBShape);

  // Ball B
  float ballBX = 0.8 - 0.05 * sin(iTime * 0.3 * speed);
  float ballBDist = distance(p, vec2(ballBX, lineBAnim));
  float ballBShape = smootherstep(1.0 - clamp(ballBDist * 0.5, 0.0, 1.0), 1.0, 0.99);
  vec3 ballBCol = (1.0 - ballBShape) * mix(color2In, color2Out, ballBShape) * 0.8;

  // Line C - orange
  float lineCFreq = 60.0;
  float lineCSpeed = 2.5 * speed;
  float lineCAnim = 0.5 + mouseInfluence + curve * 0.7 + idleWave3 * sin(lineCFreq * p.x + lineCSpeed * iTime) * sin(lineCSpeed * (iTime + 0.1));
  float lineCDist = distance(p.y, lineCAnim) * (2.0 / lineThickness);
  float lineCShape = smootherstep(1.0 - clamp(lineCDist, 0.0, 1.0), 1.0, 0.99);
  vec3 lineCCol = (1.0 - lineCShape) * mix(color3In, color3Out, lineCShape);

  // Ball C
  float ballCX = 0.5 + 0.05 * sin(iTime * 0.4 * speed);
  float ballCDist = distance(p, vec2(ballCX, lineCAnim));
  float ballCShape = smootherstep(1.0 - clamp(ballCDist * 0.5, 0.0, 1.0), 1.0, 0.99);
  vec3 ballCCol = (1.0 - ballCShape) * mix(color3In, color3Out, ballCShape) * 0.8;

  // Combine
  vec3 fcolor = bgCol + lineACol + lineBCol + lineCCol + ballACol + ballBCol + ballCCol;

  // Film grain
  fcolor = applyGrain(fcolor, p);

  gl_FragColor = vec4(fcolor, 1.0);
}
`

function c(r: number, g: number, b: number) {
  return new THREE.Vector3(r / 255, g / 255, b / 255)
}

export default function WaveShader() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { size } = useThree()
  const mouse = useRef({ x: 0.5, y: 0.5 })

  const uniforms = useMemo(
    () => ({
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector2(0.5, 0.5) },
      lineThickness: { value: 1.8 },
      idleWaveHeight: { value: 0.012 },
      grainIntensity: { value: 0.075 },
      // Warm palette (James Webb / RAM vibe)
      bgColorDown: { value: c(30, 12, 8) },
      bgColorUp: { value: c(12, 8, 4) },
      color1In: { value: c(255, 200, 0) },
      color1Out: { value: c(255, 100, 0) },
      color2In: { value: c(255, 100, 100) },
      color2Out: { value: c(200, 50, 50) },
      color3In: { value: c(255, 150, 50) },
      color3Out: { value: c(200, 100, 0) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state) => {
    const material = meshRef.current?.material as THREE.ShaderMaterial
    if (!material) return
    material.uniforms.iTime.value = state.clock.elapsedTime
    material.uniforms.iResolution.value.set(size.width, size.height)
    material.uniforms.iMouse.value.set(mouse.current.x, mouse.current.y)
  })

  // Track mouse globally
  if (typeof window !== 'undefined') {
    window.onmousemove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth
      mouse.current.y = e.clientY / window.innerHeight
    }
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
