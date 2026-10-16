const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '../src/components/character/HeroRobotCharacter.tsx');

const code = `'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { useCharacter } from './CharacterController'

interface HeroRobotCharacterProps {
  className?: string
  onSpeakRequest?: () => void
}

export default function HeroRobotCharacter({ className = '', onSpeakRequest }: HeroRobotCharacterProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const { isSpeaking, mouseX, mouseY } = useCharacter()

  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const robotRef = useRef<THREE.Group | null>(null)
  const frameRef = useRef<number>(0)
  const clockRef = useRef(new THREE.Clock())

  // Glow eye refs
  const eyeLeftRef = useRef<THREE.Mesh | null>(null)
  const eyeRightRef = useRef<THREE.Mesh | null>(null)
  const bodyRef = useRef<THREE.Mesh | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const W = container.clientWidth
    const H = container.clientHeight

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // ── Camera ─────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 0, 5.5)
    cameraRef.current = camera

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    rendererRef.current = renderer
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // ── Lights ─────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))

    const green = new THREE.PointLight(0x1F8A54, 8, 12)
    green.position.set(0, 2, 3)
    scene.add(green)

    const rim = new THREE.DirectionalLight(0x00ffaa, 1.5)
    rim.position.set(-3, 4, -2)
    scene.add(rim)

    const front = new THREE.DirectionalLight(0xffffff, 2.0)
    front.position.set(2, 1, 5)
    scene.add(front)

    // ── Holographic materials ──────────────────────────────────
    const holoMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0x1F8A54),
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.88,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.15,
      thickness: 0.5,
    })

    const darkMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0a0a,
      emissive: new THREE.Color(0x1F8A54),
      emissiveIntensity: 0.1,
      roughness: 0.2,
      metalness: 0.8,
    })

    const greenGlowMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
    })

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x1F8A54,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })

    // ── Build Robot Group ─────────────────────────────────────
    const robot = new THREE.Group()
    robotRef.current = robot
    scene.add(robot)

    // — Body (main sphere — ghost/laeeb style) —
    const bodyGeo = new THREE.SphereGeometry(1.0, 64, 64)
    const body = new THREE.Mesh(bodyGeo, holoMat)
    body.scale.set(1, 1.35, 1)  // slightly elongated like a ghost
    bodyRef.current = body
    robot.add(body)

    // Body wireframe overlay
    const bodyWire = new THREE.Mesh(
      new THREE.SphereGeometry(1.01, 20, 20),
      wireframeMat
    )
    bodyWire.scale.copy(body.scale)
    robot.add(bodyWire)

    // — Head/Face area (upper part of body) —
    // Face base (slightly flattened sphere on top)
    const faceGeo = new THREE.SphereGeometry(0.72, 48, 48)
    const face = new THREE.Mesh(faceGeo, holoMat)
    face.position.set(0, 0.85, 0.28)
    robot.add(face)

    // — Eyes (glowing green) —
    const eyeGeo = new THREE.SphereGeometry(0.1, 24, 24)

    const eyeL = new THREE.Mesh(eyeGeo, greenGlowMat)
    eyeL.position.set(-0.24, 0.96, 0.88)
    eyeLeftRef.current = eyeL
    robot.add(eyeL)

    const eyeR = new THREE.Mesh(eyeGeo, greenGlowMat)
    eyeR.position.set(0.24, 0.96, 0.88)
    eyeRightRef.current = eyeR
    robot.add(eyeR)

    // Eye glow halos
    ;[eyeL, eyeR].forEach(eye => {
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.3,
      })
      const halo = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), haloMat)
      halo.position.copy(eye.position)
      robot.add(halo)
    })

    // — Pupil glow lines (scanlines) —
    for (let i = 0; i < 2; i++) {
      const lineGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.06, 8)
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
      const line = new THREE.Mesh(lineGeo, lineMat)
      line.rotation.x = Math.PI / 2
      line.position.set(i === 0 ? -0.24 : 0.24, 0.96, 0.94)
      robot.add(line)
    }

    // — Smile line —
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.22, 0.76, 0.95),
      new THREE.Vector3(0, 0.68, 0.97),
      new THREE.Vector3(0.22, 0.76, 0.95)
    )
    const smilePoints = curve.getPoints(24)
    const smileGeo = new THREE.BufferGeometry().setFromPoints(smilePoints)
    const smileLine = new THREE.Line(smileGeo, new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 }))
    robot.add(smileLine)

    // — Keffiyeh-style hood (Al-Laeeb inspired) —
    // Top hat element - a wide rounded shape
    const hoodGeo = new THREE.SphereGeometry(0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5)
    const hoodMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0x1F8A54),
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.95,
      roughness: 0.1,
      metalness: 0.05,
    })
    const hood = new THREE.Mesh(hoodGeo, hoodMat)
    hood.position.set(0, 1.38, -0.05)
    hood.rotation.x = -0.1
    robot.add(hood)

    // Hood brim ring
    const brimGeo = new THREE.TorusGeometry(0.78, 0.06, 12, 60)
    const brimMat = new THREE.MeshPhysicalMaterial({
      color: 0x1F8A54,
      emissive: new THREE.Color(0x1F8A54),
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.3,
    })
    const brim = new THREE.Mesh(brimGeo, brimMat)
    brim.position.set(0, 1.38, -0.05)
    brim.rotation.x = Math.PI / 2 - 0.1
    robot.add(brim)

    // Hood tail flowing behind
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.2, -0.6),
      new THREE.Vector3(0.1, 0.6, -0.9),
      new THREE.Vector3(-0.05, 0, -1.1),
      new THREE.Vector3(0, -0.5, -1.0),
    ])
    const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.12, 8, false)
    const tail = new THREE.Mesh(tailGeo, hoodMat)
    robot.add(tail)

    // — Small arms/fins at sides —
    ;[-1, 1].forEach(side => {
      const armGeo = new THREE.SphereGeometry(0.22, 16, 16)
      armGeo.scale(0.6, 1, 0.5)
      const arm = new THREE.Mesh(armGeo, holoMat)
      arm.position.set(side * 1.05, -0.15, 0)
      arm.rotation.z = side * 0.35
      robot.add(arm)

      // Fingertip glow
      const tipGeo = new THREE.SphereGeometry(0.07, 12, 12)
      const tipMat = new THREE.MeshBasicMaterial({ color: 0x34d399 })
      const tip = new THREE.Mesh(tipGeo, tipMat)
      tip.position.set(side * 1.32, -0.28, 0.1)
      robot.add(tip)
    })

    // — Bottom fade / ghost tail —
    const tailBodyGeo = new THREE.ConeGeometry(0.5, 1.2, 32, 1, true)
    const tailBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    })
    const tailBody = new THREE.Mesh(tailBodyGeo, tailBodyMat)
    tailBody.position.set(0, -1.15, 0)
    tailBody.rotation.x = Math.PI
    robot.add(tailBody)

    // — Body glow ring at waist —
    const waistGeo = new THREE.TorusGeometry(0.82, 0.03, 8, 80)
    const waistMat = new THREE.MeshBasicMaterial({ color: 0x1F8A54, transparent: true, opacity: 0.7 })
    const waist = new THREE.Mesh(waistGeo, waistMat)
    waist.position.set(0, -0.12, 0)
    waist.rotation.x = Math.PI / 2
    robot.add(waist)

    // ── Floating Particles ─────────────────────────────────────
    const pCount = 200
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(pCount * 3)
    const pSizes = new Float32Array(pCount)
    for (let i = 0; i < pCount; i++) {
      const r = 1.8 + Math.random() * 1.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pPos[i * 3 + 1] = r * Math.cos(phi) - 0.2
      pPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      pSizes[i] = Math.random() * 6 + 2
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1))
    const pMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)
    particlesRef.current = particles
    scene.add(particles)

    // ── Ground glow ring ──────────────────────────────────────
    const groundRing = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.6, 80),
      new THREE.MeshBasicMaterial({ color: 0x1F8A54, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    )
    groundRing.rotation.x = -Math.PI / 2
    groundRing.position.y = -1.55
    scene.add(groundRing)

    const groundRing2 = new THREE.Mesh(
      new THREE.RingGeometry(0.35, 0.82, 80),
      new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    )
    groundRing2.rotation.x = -Math.PI / 2
    groundRing2.position.y = -1.55
    scene.add(groundRing2)

    // ── Resize handler ─────────────────────────────────────────
    const onResize = () => {
      if (!container) return
      const nw = container.clientWidth
      const nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    // ── Animation loop ─────────────────────────────────────────
    let prevMouseX = 0
    let prevMouseY = 0
    const targetRotY = { val: 0 }
    const targetRotX = { val: 0 }

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const t = clockRef.current.getElapsedTime()

      // Floating bob
      robot.position.y = Math.sin(t * 1.2) * 0.12

      // Ghost wave: subtle side oscillation when waving
      robot.position.x = Math.sin(t * 0.8) * 0.04

      // Eye pulsing
      if (eyeLeftRef.current && eyeRightRef.current) {
        const eyePulse = 0.85 + Math.sin(t * 3.5) * 0.15
        ;[eyeLeftRef.current, eyeRightRef.current].forEach(e => {
          e.scale.setScalar(eyePulse)
          ;(e.material as THREE.MeshBasicMaterial).color.setHSL(
            0.38, 0.9, 0.45 + Math.sin(t * 4) * 0.12
          )
        })
      }

      // Green point light pulsing
      green.intensity = 6 + Math.sin(t * 2.5) * 3

      // Particle rotation
      if (particlesRef.current) {
        particlesRef.current.rotation.y = t * 0.2
        particlesRef.current.rotation.x = Math.sin(t * 0.5) * 0.1
      }

      // Mouse-follow smooth rotation
      const cx = container.clientWidth / 2
      const cy = container.clientHeight / 2
      const mx = ((prevMouseX - cx) / cx) * 0.35
      const my = ((prevMouseY - cy) / cy) * 0.2
      robot.rotation.y += (mx - robot.rotation.y) * 0.06
      robot.rotation.x += (-my * 0.5 - robot.rotation.x) * 0.06

      // Subtle idle sway
      robot.rotation.z = Math.sin(t * 0.9) * 0.02

      // Waist ring glow pulse
      groundRing2.material.opacity = 0.2 + Math.sin(t * 2) * 0.1

      renderer.render(scene, camera)
    }
    animate()

    // Track mouse from parent window
    const onMouseMove = (e: MouseEvent) => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      prevMouseX = e.clientX - rect.left
      prevMouseY = e.clientY - rect.top
    }
    container.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      container.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
    }
  }, [])

  // Speaking reaction
  useEffect(() => {
    if (!bodyRef.current) return
    const mat = bodyRef.current.material as THREE.MeshPhysicalMaterial
    if (isSpeaking) {
      mat.emissiveIntensity = 0.6
      mat.opacity = 0.95
    } else {
      mat.emissiveIntensity = 0.25
      mat.opacity = 0.88
    }
  }, [isSpeaking])

  return (
    <div
      className={\`relative \${className}\`}
      style={{ width: '100%', height: '100%', minHeight: '480px' }}
      onClick={onSpeakRequest}
    >
      <div
        ref={mountRef}
        className="w-full h-full cursor-pointer"
        style={{ minHeight: '480px' }}
      />

      {/* Speaking badge */}
      {isSpeaking && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white border"
          style={{
            background: 'rgba(10,30,18,0.9)',
            borderColor: 'rgba(52,211,153,0.6)',
            boxShadow: '0 0 20px rgba(52,211,153,0.4)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {[9, 14, 7, 13, 9].map((h, i) => (
            <span
              key={i}
              className="w-0.5 rounded-full bg-emerald-400"
              style={{ height: h, animation: 'voiceBar 0.4s ease infinite alternate', animationDelay: i * 0.08 + 's' }}
            />
          ))}
          <span className="mr-1">يتحدث</span>
        </div>
      )}

      {/* Click hint */}
      <p
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/30 pointer-events-none"
        style={{ whiteSpace: 'nowrap' }}
      >
        انقر للتفاعل
      </p>

      <style>{\`
        @keyframes voiceBar {
          from { transform: scaleY(0.3); opacity: 0.6; }
          to   { transform: scaleY(1);   opacity: 1; }
        }
      \`}</style>
    </div>
  )
}
`;

fs.writeFileSync(outPath, code, 'utf8');
console.log('HeroRobotCharacter.tsx written:', fs.statSync(outPath).size, 'bytes');
