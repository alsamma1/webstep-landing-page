const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '../src/components/character/HeroRobotCharacter.tsx');

const code = `'use client'

import { useEffect, useRef } from 'react'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const THREE = typeof window !== 'undefined' ? require('three') : null
import { useCharacter } from './CharacterController'

interface HeroRobotCharacterProps {
  className?: string
  onSpeakRequest?: () => void
}

export default function HeroRobotCharacter({ className = '', onSpeakRequest }: HeroRobotCharacterProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const { isSpeaking } = useCharacter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stateRef = useRef<any>({})

  useEffect(() => {
    const container = mountRef.current
    if (!container || !THREE) return

    const W = container.clientWidth || 480
    const H = container.clientHeight || 520

    // ── Scene ──────────────────────────────────────────
    const scene = new THREE.Scene()

    // ── Camera ─────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 0, 5.5)

    // ── Renderer ───────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    stateRef.current.renderer = renderer
    stateRef.current.scene = scene
    stateRef.current.camera = camera

    // ── Lights ─────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))

    const greenLight = new THREE.PointLight(0x1F8A54, 8, 12)
    greenLight.position.set(0, 2, 3)
    scene.add(greenLight)
    stateRef.current.greenLight = greenLight

    const rim = new THREE.DirectionalLight(0x00ffaa, 1.5)
    rim.position.set(-3, 4, -2)
    scene.add(rim)

    const front = new THREE.DirectionalLight(0xffffff, 2.0)
    front.position.set(2, 1, 5)
    scene.add(front)

    // ── Materials ──────────────────────────────────────
    const holoMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0x1F8A54),
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.88,
      roughness: 0.05,
      metalness: 0.1,
    })

    const greenGlowMat = new THREE.MeshBasicMaterial({ color: 0x34d399 })

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x1F8A54,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })

    const hoodMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0x1F8A54),
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.95,
      roughness: 0.1,
      metalness: 0.05,
    })

    // ── Robot Group ─────────────────────────────────────
    const robot = new THREE.Group()
    scene.add(robot)
    stateRef.current.robot = robot

    // Body (ghost shape — elongated sphere)
    const bodyGeo = new THREE.SphereGeometry(1.0, 64, 64)
    const body = new THREE.Mesh(bodyGeo, holoMat)
    body.scale.set(1, 1.35, 1)
    robot.add(body)
    stateRef.current.body = body
    stateRef.current.holoMat = holoMat

    // Body wireframe
    const bodyWire = new THREE.Mesh(new THREE.SphereGeometry(1.01, 20, 20), wireframeMat)
    bodyWire.scale.set(1, 1.35, 1)
    robot.add(bodyWire)

    // Face
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 48), holoMat)
    face.position.set(0, 0.85, 0.28)
    robot.add(face)

    // Eyes (glowing green)
    const eyeGeo = new THREE.SphereGeometry(0.1, 24, 24)

    const eyeL = new THREE.Mesh(eyeGeo, greenGlowMat.clone())
    eyeL.position.set(-0.24, 0.96, 0.88)
    robot.add(eyeL)
    stateRef.current.eyeL = eyeL

    const eyeR = new THREE.Mesh(eyeGeo, greenGlowMat.clone())
    eyeR.position.set(0.24, 0.96, 0.88)
    robot.add(eyeR)
    stateRef.current.eyeR = eyeR

    // Eye halos
    ;[eyeL, eyeR].forEach(eye => {
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.3 })
      )
      halo.position.copy(eye.position)
      robot.add(halo)
    })

    // Pupils
    for (let i = 0; i < 2; i++) {
      const pupil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.06, 8),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      )
      pupil.rotation.x = Math.PI / 2
      pupil.position.set(i === 0 ? -0.24 : 0.24, 0.96, 0.94)
      robot.add(pupil)
    }

    // Smile
    const smileCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.22, 0.76, 0.95),
      new THREE.Vector3(0, 0.68, 0.97),
      new THREE.Vector3(0.22, 0.76, 0.95)
    )
    const smileGeo = new THREE.BufferGeometry().setFromPoints(smileCurve.getPoints(24))
    const smile = new THREE.Line(smileGeo, new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 }))
    robot.add(smile)

    // Keffiyeh hood (top half sphere — Al-Laeeb style)
    const hoodGeo = new THREE.SphereGeometry(0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5)
    const hood = new THREE.Mesh(hoodGeo, hoodMat)
    hood.position.set(0, 1.38, -0.05)
    hood.rotation.x = -0.1
    robot.add(hood)

    // Hood brim ring (green glow)
    const brim = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.06, 12, 60),
      new THREE.MeshPhysicalMaterial({ color: 0x1F8A54, emissive: new THREE.Color(0x1F8A54), emissiveIntensity: 0.8, roughness: 0.1, metalness: 0.3 })
    )
    brim.position.set(0, 1.38, -0.05)
    brim.rotation.x = Math.PI / 2 - 0.1
    robot.add(brim)
    stateRef.current.brim = brim

    // Hood tail
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.2, -0.6),
      new THREE.Vector3(0.1, 0.6, -0.9),
      new THREE.Vector3(-0.05, 0, -1.1),
      new THREE.Vector3(0, -0.5, -1.0),
    ])
    const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.12, 8, false)
    robot.add(new THREE.Mesh(tailGeo, hoodMat))

    // Arms/fins
    ;[-1, 1].forEach(side => {
      const arm = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), holoMat)
      arm.scale.set(0.6, 1, 0.5)
      arm.position.set(side * 1.05, -0.15, 0)
      arm.rotation.z = side * 0.35
      robot.add(arm)

      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshBasicMaterial({ color: 0x34d399 }))
      tip.position.set(side * 1.32, -0.28, 0.1)
      robot.add(tip)
    })

    // Ghost tail (cone)
    const ghostTail = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 1.2, 32, 1, true),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, side: THREE.BackSide })
    )
    ghostTail.position.set(0, -1.15, 0)
    ghostTail.rotation.x = Math.PI
    robot.add(ghostTail)

    // Waist glow ring
    const waist = new THREE.Mesh(
      new THREE.TorusGeometry(0.82, 0.03, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0x1F8A54, transparent: true, opacity: 0.7 })
    )
    waist.position.set(0, -0.12, 0)
    waist.rotation.x = Math.PI / 2
    robot.add(waist)
    stateRef.current.waist = waist

    // ── Floating Particles ──────────────────────────────
    const pCount = 200
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      const r = 1.8 + Math.random() * 1.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pPos[i * 3 + 1] = r * Math.cos(phi) - 0.2
      pPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x34d399, size: 0.05, transparent: true, opacity: 0.6, sizeAttenuation: true })
    )
    scene.add(particles)
    stateRef.current.particles = particles

    // ── Ground glow rings ───────────────────────────────
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
    stateRef.current.groundRing2 = groundRing2

    // ── Mouse tracking ──────────────────────────────────
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    container.addEventListener('mousemove', onMouseMove)

    // ── Resize ──────────────────────────────────────────
    const onResize = () => {
      const nw = container.clientWidth
      const nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    // ── Clock ───────────────────────────────────────────
    const clock = new THREE.Clock()

    // ── Animation ───────────────────────────────────────
    let frameId: number

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Floating
      robot.position.y = Math.sin(t * 1.2) * 0.12
      robot.position.x = Math.sin(t * 0.7) * 0.04

      // Mouse follow
      const cx = container.clientWidth / 2
      const cy = container.clientHeight / 2
      const tx = ((mouseX - cx) / (cx || 1)) * 0.35
      const ty = ((mouseY - cy) / (cy || 1)) * 0.2
      robot.rotation.y += (tx - robot.rotation.y) * 0.06
      robot.rotation.x += (-ty * 0.5 - robot.rotation.x) * 0.06
      robot.rotation.z = Math.sin(t * 0.9) * 0.02

      // Eye pulse
      const eyePulse = 0.85 + Math.sin(t * 3.5) * 0.15
      if (stateRef.current.eyeL) {
        stateRef.current.eyeL.scale.setScalar(eyePulse)
        stateRef.current.eyeR.scale.setScalar(eyePulse)
      }

      // Green light flicker
      greenLight.intensity = 6 + Math.sin(t * 2.5) * 3

      // Particles rotate
      if (stateRef.current.particles) {
        stateRef.current.particles.rotation.y = t * 0.2
        stateRef.current.particles.rotation.x = Math.sin(t * 0.5) * 0.1
      }

      // Ground ring pulse
      if (stateRef.current.groundRing2) {
        stateRef.current.groundRing2.material.opacity = 0.2 + Math.sin(t * 2) * 0.1
      }

      renderer.render(scene, camera)
    }
    animate()
    stateRef.current.frameId = frameId!

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      container.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Speaking reaction — pulse body glow
  useEffect(() => {
    const mat = stateRef.current.holoMat
    if (!mat) return
    mat.emissiveIntensity = isSpeaking ? 0.6 : 0.25
    mat.opacity = isSpeaking ? 0.95 : 0.88
  }, [isSpeaking])

  return (
    <div
      className={\`relative \${className}\`}
      style={{ width: '100%', height: '100%', minHeight: '480px' }}
    >
      <div
        ref={mountRef}
        className="w-full h-full cursor-pointer"
        style={{ minHeight: '480px' }}
        onClick={onSpeakRequest}
      />

      {/* Speaking badge */}
      {isSpeaking && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white border pointer-events-none"
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

      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/25 pointer-events-none whitespace-nowrap">
        انقر للتفاعل ✦
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
console.log('HeroRobotCharacter.tsx (fixed) written:', fs.statSync(outPath).size, 'bytes');
