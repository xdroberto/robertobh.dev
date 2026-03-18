import { useRef, useMemo, useEffect } from 'react'
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
uniform vec3 color4In;
uniform vec3 color4Out;

// Settings
uniform float lineThickness;

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

  // Subtle mouse influence
  float mouseInfluence = (iMouse.y - 0.5) * 0.03;

  // Simulated audio-like energy using sine combinations (organic movement)
  float energy1 = 0.5 + 0.5 * sin(iTime * 0.37) * sin(iTime * 0.53 + 1.2);
  float energy2 = 0.5 + 0.5 * sin(iTime * 0.29 + 2.0) * sin(iTime * 0.67);
  float energy3 = 0.5 + 0.5 * sin(iTime * 0.43 + 4.0) * sin(iTime * 0.31 + 0.7);
  float energy4 = 0.5 + 0.5 * sin(iTime * 0.23 + 3.0) * sin(iTime * 0.47 + 1.8);

  // Simulated kick/pulse
  float pulse = pow(0.5 + 0.5 * sin(iTime * 1.2), 8.0) * 0.3;

  // === LINE A - Gold/Orange (bass-like, slow, wide) ===
  float lineAWave = 0.02 + 0.03 * energy1 + pulse * 0.04;
  float lineAFreq = 8.0 + 30.0 * energy1;
  float lineASpeed = 0.4 + 1.5 * energy1;
  float lineAOffset = energy1 * 0.03 * sin(p.x * 10.0 - iTime * 1.5);

  float lineAAnim = 0.5 + mouseInfluence
    + lineAWave * sin(lineAFreq * p.x - lineASpeed * iTime)
    + 0.02 * sin(p.x * 3.0 + iTime * 0.15)
    + lineAOffset;

  float lineAThick = lineThickness * (1.0 + energy1 * 0.5 + pulse * 1.0);
  float lineADist = distance(p.y, lineAAnim) * (2.0 / lineAThick);
  float lineAShape = smootherstep(1.0 - clamp(lineADist, 0.0, 1.0), 1.0, 0.99);
  vec3 lineACol = (1.0 - lineAShape) * mix(color1In, color1Out, lineAShape);

  // Ball A
  float ballAX = 0.2 + 0.15 * sin(iTime * 0.08);
  float ballADist = distance(p, vec2(ballAX, lineAAnim));
  float ballASize = 0.4 + 0.3 * energy1;
  float ballAShape = smootherstep(1.0 - clamp(ballADist * ballASize, 0.0, 1.0), 1.0, 0.99);
  vec3 ballACol = (1.0 - ballAShape) * mix(color1In, color1Out, ballAShape) * 0.6;

  // === LINE B - Red/Pink (mid-like, medium speed) ===
  float lineBWave = 0.015 + 0.025 * energy2;
  float lineBFreq = 12.0 + 40.0 * energy2;
  float lineBSpeed = 0.6 + 2.0 * energy2;
  float lineBOffset = energy2 * 0.025 * sin(p.x * 15.0 - iTime * 1.2);

  float lineBAnim = 0.5 + mouseInfluence
    + lineBWave * sin(lineBFreq * p.x + lineBSpeed * iTime) * sin(lineBSpeed * iTime * 0.5)
    + 0.015 * sin(p.x * 4.0 + iTime * 0.2 + 1.0)
    + lineBOffset;

  float lineBThick = lineThickness * (1.0 + energy2 * 0.4);
  float lineBDist = distance(p.y, lineBAnim) * (2.0 / lineBThick);
  float lineBShape = smootherstep(1.0 - clamp(lineBDist, 0.0, 1.0), 1.0, 0.99);
  vec3 lineBCol = (1.0 - lineBShape) * mix(color2In, color2Out, lineBShape);

  // Ball B
  float ballBX = 0.8 - 0.12 * sin(iTime * 0.1 + 2.0);
  float ballBDist = distance(p, vec2(ballBX, lineBAnim));
  float ballBSize = 0.4 + 0.3 * energy2;
  float ballBShape = smootherstep(1.0 - clamp(ballBDist * ballBSize, 0.0, 1.0), 1.0, 0.99);
  vec3 ballBCol = (1.0 - ballBShape) * mix(color2In, color2Out, ballBShape) * 0.6;

  // === LINE C - Orange (high-like, fast, complex) ===
  float lineCWave = 0.012 + 0.02 * energy3;
  float lineCFreq = 15.0 + 50.0 * energy3;
  float lineCSpeed = 0.8 + 2.5 * energy3;
  float lineCOffset = energy3 * 0.02 * sin(p.x * 20.0 - iTime * 0.8);

  float lineCAnim = 0.5 + mouseInfluence
    + lineCWave * sin(lineCFreq * p.x + lineCSpeed * iTime) * sin(lineCSpeed * (iTime + 0.3))
    + 0.018 * sin(p.x * 5.0 + iTime * 0.25 - 0.5)
    + lineCOffset;

  float lineCThick = lineThickness * (1.0 + energy3 * 0.3);
  float lineCDist = distance(p.y, lineCAnim) * (2.0 / lineCThick);
  float lineCShape = smootherstep(1.0 - clamp(lineCDist, 0.0, 1.0), 1.0, 0.99);
  vec3 lineCCol = (1.0 - lineCShape) * mix(color3In, color3Out, lineCShape);

  // Ball C
  float ballCX = 0.5 + 0.1 * sin(iTime * 0.12 + 4.0);
  float ballCDist = distance(p, vec2(ballCX, lineCAnim));
  float ballCSize = 0.4 + 0.3 * energy3;
  float ballCShape = smootherstep(1.0 - clamp(ballCDist * ballCSize, 0.0, 1.0), 1.0, 0.99);
  vec3 ballCCol = (1.0 - ballCShape) * mix(color3In, color3Out, ballCShape) * 0.6;

  // === LINE D - Electric Blue (ethereal, flowing) ===
  float lineDWave = 0.018 + 0.028 * energy4;
  float lineDFreq = 10.0 + 35.0 * energy4;
  float lineDSpeed = 0.5 + 1.8 * energy4;
  float lineDOffset = energy4 * 0.022 * sin(p.x * 12.0 - iTime * 1.0);

  float lineDAnim = 0.5 + mouseInfluence
    + lineDWave * sin(lineDFreq * p.x - lineDSpeed * iTime + 1.5)
    + 0.016 * sin(p.x * 3.5 + iTime * 0.18 + 2.0)
    + lineDOffset;

  float lineDThick = lineThickness * (1.0 + energy4 * 0.35);
  float lineDDist = distance(p.y, lineDAnim) * (2.0 / lineDThick);
  float lineDShape = smootherstep(1.0 - clamp(lineDDist, 0.0, 1.0), 1.0, 0.99);
  vec3 lineDCol = (1.0 - lineDShape) * mix(color4In, color4Out, lineDShape);

  // Ball D
  float ballDX = 0.35 + 0.12 * sin(iTime * 0.09 + 1.5);
  float ballDDist = distance(p, vec2(ballDX, lineDAnim));
  float ballDSize = 0.4 + 0.3 * energy4;
  float ballDShape = smootherstep(1.0 - clamp(ballDDist * ballDSize, 0.0, 1.0), 1.0, 0.99);
  vec3 ballDCol = (1.0 - ballDShape) * mix(color4In, color4Out, ballDShape) * 0.6;

  // Subtle pulse flash on background
  bgCol = mix(bgCol, bgCol * 1.3, pulse * 0.5);

  // Combine
  vec3 fcolor = bgCol + lineACol + lineBCol + lineCCol + lineDCol + ballACol + ballBCol + ballCCol + ballDCol;

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
  const { gl } = useThree()
  const mouse = useRef({ x: 0.5, y: 0.5 })

  // Ensure canvas fills viewport
  useEffect(() => {
    gl.setSize(window.innerWidth, window.innerHeight)
    const onResize = () => gl.setSize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [gl])

  const uniforms = useMemo(
    () => ({
      iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector2(0.5, 0.5) },
      lineThickness: { value: 1.8 },
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
      color4In: { value: c(80, 160, 255) },   // Electric blue
      color4Out: { value: c(30, 80, 200) },    // Deep blue
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state) => {
    const material = meshRef.current?.material as THREE.ShaderMaterial
    if (!material) return
    material.uniforms.iTime.value = state.clock.elapsedTime
    material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight)
    material.uniforms.iMouse.value.set(mouse.current.x, mouse.current.y)
  })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth
      mouse.current.y = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

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
