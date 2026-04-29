import { useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector2, Vector3, type Mesh, type ShaderMaterial } from 'three'

// Global tempo. Lower = more contemplative wave motion. 1.0 = original.
const TIME_SCALE = 0.45

// Mobile detection — runs once at module load. Used to pick a lighter quality
// preset that drops the chromatic aberration, grain, vignette and the two
// most expensive line/ball pairs (C and D). Roughly halves fragment cost.
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

// Cap framerate on mobile to ~30fps to give the GPU breathing room and keep
// the frame budget below 33ms even when the OS is throttling the renderer.
const MIN_FRAME_INTERVAL = isMobile ? 1 / 30 : 0

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
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

// Chromatic aberration
uniform float caIntensity;

// Adaptive quality flags (uniforms allow GPU to fast-skip whole blocks)
uniform float fullQuality;       // 1.0 = render lines C/D too, 0.0 = only A/B
uniform float caEnabled;         // 1.0 = chromatic aberration on
uniform float grainEnabled;      // 1.0 = film grain on
uniform float vignetteEnabled;   // 1.0 = vignette on

varying vec2 vUv;

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

  // Energy functions - fluid breathing cycles
  float energy1 = 0.5 + 0.5 * sin(iTime * 0.12) * sin(iTime * 0.18 + 1.2);
  float energy2 = 0.5 + 0.5 * sin(iTime * 0.10 + 2.0) * sin(iTime * 0.14);

  // Wide breathing cycle
  float breath = 0.5 + 0.5 * sin(iTime * 0.05);
  float breathWide = pow(breath, 3.0) * 0.08;

  // Gentle pulse
  float pulse = pow(0.5 + 0.5 * sin(iTime * 0.5), 12.0) * 0.12;

  // === LINE A - Gold/Orange (slow, majestic sweeps) ===
  float lineAWave = 0.025 + 0.05 * energy1 + breathWide;
  float lineAFreq = 3.0 + 6.0 * energy1;
  float lineASpeed = 0.12 + 0.24 * energy1;

  float lineAAnim = 0.5 + mouseInfluence
    + lineAWave * sin(lineAFreq * p.x - lineASpeed * iTime)
    + 0.03 * sin(p.x * 1.5 + iTime * 0.05)
    + energy1 * 0.015 * sin(p.x * 5.0 - iTime * 0.2);

  float lineAThick = lineThickness * (1.0 + energy1 * 0.4 + pulse * 0.6);
  float lineADist = distance(p.y, lineAAnim) * (2.0 / lineAThick);
  float lineAShape = smootherstep(1.0 - clamp(lineADist, 0.0, 1.0), 1.0, 0.99);
  vec3 lineACol = (1.0 - lineAShape) * mix(color1In, color1Out, lineAShape);

  // Ball A
  float ballAX = 0.2 + 0.2 * sin(iTime * 0.012);
  float ballADist = distance(p, vec2(ballAX, lineAAnim));
  float ballASize = 0.35 + 0.25 * energy1;
  float ballAShape = smootherstep(1.0 - clamp(ballADist * ballASize, 0.0, 1.0), 1.0, 0.99);
  vec3 ballACol = (1.0 - ballAShape) * mix(color1In, color1Out, ballAShape) * 0.5;

  // === LINE B - Red/Pink (graceful, medium curves) ===
  float lineBWave = 0.02 + 0.04 * energy2 + breathWide * 0.8;
  float lineBFreq = 4.0 + 8.0 * energy2;
  float lineBSpeed = 0.16 + 0.30 * energy2;

  float lineBAnim = 0.5 + mouseInfluence
    + lineBWave * sin(lineBFreq * p.x + lineBSpeed * iTime)
    + 0.025 * sin(p.x * 2.0 + iTime * 0.06 + 1.0)
    + energy2 * 0.012 * sin(p.x * 6.0 + iTime * 0.14);

  float lineBThick = lineThickness * (1.0 + energy2 * 0.35);
  float lineBDist = distance(p.y, lineBAnim) * (2.0 / lineBThick);
  float lineBShape = smootherstep(1.0 - clamp(lineBDist, 0.0, 1.0), 1.0, 0.99);
  vec3 lineBCol = (1.0 - lineBShape) * mix(color2In, color2Out, lineBShape);

  // Ball B
  float ballBX = 0.8 - 0.15 * sin(iTime * 0.015 + 2.0);
  float ballBDist = distance(p, vec2(ballBX, lineBAnim));
  float ballBSize = 0.35 + 0.25 * energy2;
  float ballBShape = smootherstep(1.0 - clamp(ballBDist * ballBSize, 0.0, 1.0), 1.0, 0.99);
  vec3 ballBCol = (1.0 - ballBShape) * mix(color2In, color2Out, ballBShape) * 0.5;

  // Subtle pulse flash on background
  bgCol = mix(bgCol, bgCol * 1.2, pulse * 0.3);

  // Combine A + B
  vec3 fcolor = bgCol + lineACol + lineBCol + ballACol + ballBCol;

  // === LINE C + D — only on full-quality tier (desktop) ===
  if (fullQuality > 0.5) {
    float energy3 = 0.5 + 0.5 * sin(iTime * 0.14 + 4.0) * sin(iTime * 0.10 + 0.7);
    float energy4 = 0.5 + 0.5 * sin(iTime * 0.08 + 3.0) * sin(iTime * 0.13 + 1.8);

    // === LINE C - Orange (delicate, flowing) ===
    float lineCWave = 0.015 + 0.035 * energy3 + breathWide * 0.6;
    float lineCFreq = 5.0 + 10.0 * energy3;
    float lineCSpeed = 0.18 + 0.36 * energy3;

    float lineCAnim = 0.5 + mouseInfluence
      + lineCWave * sin(lineCFreq * p.x + lineCSpeed * iTime + 0.8)
      + 0.02 * sin(p.x * 2.5 + iTime * 0.08 - 0.5)
      + energy3 * 0.01 * sin(p.x * 7.0 - iTime * 0.10);

    float lineCThick = lineThickness * (1.0 + energy3 * 0.3);
    float lineCDist = distance(p.y, lineCAnim) * (2.0 / lineCThick);
    float lineCShape = smootherstep(1.0 - clamp(lineCDist, 0.0, 1.0), 1.0, 0.99);
    vec3 lineCCol = (1.0 - lineCShape) * mix(color3In, color3Out, lineCShape);

    float ballCX = 0.5 + 0.12 * sin(iTime * 0.018 + 4.0);
    float ballCDist = distance(p, vec2(ballCX, lineCAnim));
    float ballCSize = 0.35 + 0.25 * energy3;
    float ballCShape = smootherstep(1.0 - clamp(ballCDist * ballCSize, 0.0, 1.0), 1.0, 0.99);
    vec3 ballCCol = (1.0 - ballCShape) * mix(color3In, color3Out, ballCShape) * 0.5;

    // === LINE D - Electric Blue (ethereal, wide sweeps) ===
    float lineDWave = 0.02 + 0.045 * energy4 + breathWide * 0.9;
    float lineDFreq = 3.5 + 7.0 * energy4;
    float lineDSpeed = 0.14 + 0.28 * energy4;

    float lineDAnim = 0.5 + mouseInfluence
      + lineDWave * sin(lineDFreq * p.x - lineDSpeed * iTime + 1.5)
      + 0.028 * sin(p.x * 1.8 + iTime * 0.06 + 2.0)
      + energy4 * 0.014 * sin(p.x * 4.0 + iTime * 0.08);

    float lineDThick = lineThickness * (1.0 + energy4 * 0.35);
    float lineDDist = distance(p.y, lineDAnim) * (2.0 / lineDThick);
    float lineDShape = smootherstep(1.0 - clamp(lineDDist, 0.0, 1.0), 1.0, 0.99);
    vec3 lineDCol = (1.0 - lineDShape) * mix(color4In, color4Out, lineDShape);

    float ballDX = 0.35 + 0.15 * sin(iTime * 0.013 + 1.5);
    float ballDDist = distance(p, vec2(ballDX, lineDAnim));
    float ballDSize = 0.35 + 0.25 * energy4;
    float ballDShape = smootherstep(1.0 - clamp(ballDDist * ballDSize, 0.0, 1.0), 1.0, 0.99);
    vec3 ballDCol = (1.0 - ballDShape) * mix(color4In, color4Out, ballDShape) * 0.5;

    fcolor += lineCCol + lineDCol + ballCCol + ballDCol;
  }

  // Chromatic aberration — desktop only by default
  if (caEnabled > 0.5) {
    vec2 center = p - 0.5;
    float dist = length(center);
    float caAmount = caIntensity * dist * dist;
    vec3 colorR = fcolor * (1.0 + caAmount * 2.0);
    vec3 colorB = fcolor * (1.0 - caAmount * 1.5);
    fcolor = vec3(
      mix(fcolor.r, colorR.r, 0.6),
      fcolor.g,
      mix(fcolor.b, colorB.b, 0.6)
    );
  }

  // Vignette
  if (vignetteEnabled > 0.5) {
    vec2 vCenter = p - 0.5;
    float vDist = length(vCenter);
    fcolor *= 1.0 - vDist * vDist * 0.3;
  }

  // Film grain
  if (grainEnabled > 0.5) {
    fcolor = applyGrain(fcolor, p);
  }

  gl_FragColor = vec4(fcolor, 1.0);
}
`

function c(r: number, g: number, b: number) {
  return new Vector3(r / 255, g / 255, b / 255)
}

export default function WaveShader() {
  const meshRef = useRef<Mesh>(null)
  const { gl } = useThree()
  const mouse = useRef({ x: 0.5, y: 0.5 })

  // Custom time accumulator — pauses when tab is hidden, caps delta per frame
  // and throttles to MIN_FRAME_INTERVAL so mobile GPUs don't melt.
  const timeRef = useRef({
    accumulated: 0,
    lastClock: -1,
    lastRender: 0,
    paused: false,
  })

  const uniforms = useMemo(
    () => ({
      iResolution: { value: new Vector2(1, 1) },
      iTime: { value: 0 },
      iMouse: { value: new Vector2(0.5, 0.5) },
      lineThickness: { value: 1.8 },
      grainIntensity: { value: 0.03 },
      caIntensity: { value: 0.15 },
      bgColorDown: { value: c(30, 12, 8) },
      bgColorUp: { value: c(12, 8, 4) },
      color1In: { value: c(255, 200, 0) },
      color1Out: { value: c(255, 100, 0) },
      color2In: { value: c(255, 100, 100) },
      color2Out: { value: c(200, 50, 50) },
      color3In: { value: c(255, 150, 50) },
      color3Out: { value: c(200, 100, 0) },
      color4In: { value: c(80, 160, 255) },
      color4Out: { value: c(30, 80, 200) },
      // Quality flags kept as uniforms for future tiering, but we now render
      // the full visual on every device — earlier mobile profiling showed the
      // flicker did NOT come from shader cost, so simplifying it just made
      // the hero look weaker without any FPS gain.
      fullQuality: { value: 1 },
      caEnabled: { value: 1 },
      grainEnabled: { value: 1 },
      vignetteEnabled: { value: 1 },
    }),
    [],
  )

  // Pause/resume time when tab visibility changes — also reacts to Page
  // Lifecycle freeze events (bfcache, tab discard) to avoid time jumps.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        timeRef.current.paused = true
      } else {
        timeRef.current.paused = false
        timeRef.current.lastClock = -1
      }
    }
    const onFreeze = () => {
      timeRef.current.paused = true
    }
    const onResume = () => {
      timeRef.current.paused = false
      timeRef.current.lastClock = -1
    }
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('freeze', onFreeze)
    document.addEventListener('resume', onResume)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('freeze', onFreeze)
      document.removeEventListener('resume', onResume)
    }
  }, [])

  useFrame((state) => {
    const material = meshRef.current?.material as ShaderMaterial
    if (!material) return

    const clock = state.clock.elapsedTime
    const t = timeRef.current

    if (t.paused) {
      t.lastClock = clock
      return
    }

    if (t.lastClock < 0) {
      t.lastClock = clock
      t.lastRender = clock
    }

    // Frame budget cap (mobile only) — skip render if not enough time elapsed
    if (MIN_FRAME_INTERVAL > 0 && clock - t.lastRender < MIN_FRAME_INTERVAL) {
      // Don't update lastClock — we want next frame's delta to include skipped time
      return
    }
    t.lastRender = clock

    // Cap delta to 1/15s (~67ms) to prevent any jumps after long pauses
    const delta = Math.min(clock - t.lastClock, 1 / 15)
    t.accumulated += delta * TIME_SCALE
    t.lastClock = clock

    material.uniforms.iTime.value = t.accumulated
    material.uniforms.iResolution.value.set(state.size.width, state.size.height)
    material.uniforms.iMouse.value.set(mouse.current.x, mouse.current.y)
  })

  // Mouse tracking (desktop only — mobile mouseInfluence stays at 0)
  const onMove = useCallback((e: MouseEvent) => {
    mouse.current.x = e.clientX / window.innerWidth
    mouse.current.y = e.clientY / window.innerHeight
  }, [])

  useEffect(() => {
    if (isMobile) return
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [onMove])

  // Handle WebGL context loss gracefully — prevent default so the browser
  // tries to restore, and emit a warning so we can spot it in the field.
  useEffect(() => {
    const canvas = gl.domElement
    const onLost = (e: Event) => {
      e.preventDefault()
      timeRef.current.paused = true
      console.warn('[WaveShader] WebGL context lost — waiting for restore')
    }
    const onRestored = () => {
      timeRef.current.paused = false
      timeRef.current.lastClock = -1
      console.warn('[WaveShader] WebGL context restored')
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }, [gl])

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
