const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '../src/components/character/ThreeDCharacterCanvas.tsx');

const code = `'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RotateCcw, Volume2, RefreshCw, Compass, Sparkles, User, UserCheck, Play, Pause } from 'lucide-react'
import { useCharacter } from './CharacterController'

interface ThreeDCharacterCanvasProps {
  className?: string
  height?: string
  sectionTitle?: string
}

const CHARACTERS = {
  male: {
    label: 'ريان — المهندس',
    path: '/assets/characters/soldier.glb',
    scale: 1.8,
    cameraY: 1.4,
    cameraZ: 2.8,
    targetY: 1.2,
    color: '#1F8A54',
    accent: '#34d399',
    rim: 0x1F8A54 as number,
  },
  female: {
    label: 'سارة — المصممة',
    path: '/assets/characters/michelle.glb',
    scale: 1.0,
    cameraY: 1.5,
    cameraZ: 3.0,
    targetY: 1.1,
    color: '#7c3aed',
    accent: '#a78bfa',
    rim: 0x7c3aed as number,
  },
}

const ANIM_LABELS: Record<string, string> = {
  Idle: 'وقوف', idle: 'وقوف', 'Idle (1)': 'وقوف هادئ',
  Walking: 'مشي', Walk: 'مشي', Run: 'جري', Running: 'جري',
  Wave: 'تلويح', 'Waving Gesture': 'تلويح', Dance: 'رقص',
  Jump: 'قفز', ThumbsUp: 'إعجاب', Talking: 'حديث',
  Sitting: 'جلوس', 'Stand To Sit': 'جلوس', Death: 'سقوط',
  Survey: 'استعراض', 'Breathing Idle': 'وقوف هادئ',
}

export default function ThreeDCharacterCanvas({
  className = '',
  height = '580px',
  sectionTitle = 'استوديو الشخصيات ثلاثي الأبعاد',
}: ThreeDCharacterCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const {
    characterType,
    toggleCharacterType,
    isSpeaking,
    speakPhrase,
    stopSpeaking,
    currentSectionInfo,
  } = useCharacter()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeAnimation, setActiveAnimation] = useState<string>('')
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([])
  const [autoRotate, setAutoRotate] = useState(false)
  const [activeChar, setActiveChar] = useState<'male' | 'female'>('male')
  const [isPlaying, setIsPlaying] = useState(true)

  const cameraRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const controlsRef = useRef<any>(null)
  const mixerRef = useRef<any>(null)
  const actionsRef = useRef<Record<string, any>>({})
  const activeActionRef = useRef<any>(null)
  const clockRef = useRef<any>(null)
  const animFrameIdRef = useRef<number>(0)
  const modelGroupRef = useRef<any>(null)
  const ringRef = useRef<any>(null)
  const ring2Ref = useRef<any>(null)

  const charDef = CHARACTERS[activeChar]

  const playAnimation = useCallback((name: string) => {
    const action = actionsRef.current[name]
    if (!action) return
    if (activeActionRef.current && activeActionRef.current !== action) {
      activeActionRef.current.fadeOut(0.4)
    }
    action.reset().fadeIn(0.4).play()
    activeActionRef.current = action
    setActiveAnimation(name)
  }, [])

  const togglePlay = useCallback(() => {
    const all = Object.values(actionsRef.current)
    if (isPlaying) {
      all.forEach((a: any) => { a.paused = true })
    } else {
      all.forEach((a: any) => { a.paused = false })
    }
    setIsPlaying(p => !p)
  }, [isPlaying])

  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return
    cameraRef.current.position.set(0, charDef.cameraY, charDef.cameraZ)
    controlsRef.current.target.set(0, charDef.targetY, 0)
    controlsRef.current.update()
  }, [charDef])

  // Sync global character type to local
  useEffect(() => {
    setActiveChar(characterType === 'girl' ? 'female' : 'male')
  }, [characterType])

  // Main 3D scene
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    setLoading(true)
    setLoadError(null)
    setAvailableAnimations([])
    setActiveAnimation('')
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0f14, 0.04)

    const w = container.clientWidth || 600
    const h = container.clientHeight || 580
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100)
    camera.position.set(0, charDef.cameraY, charDef.cameraZ)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.minDistance = 0.8
    controls.maxDistance = 6.0
    controls.maxPolarAngle = Math.PI / 2 + 0.15
    controls.target.set(0, charDef.targetY, 0)
    controlsRef.current = controls

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 2.2))
    const key = new THREE.DirectionalLight(0xffffff, 4.0)
    key.position.set(3, 6, 4)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xb7e8ff, 1.8)
    fill.position.set(-4, 3, 2)
    scene.add(fill)
    const rimL = new THREE.DirectionalLight(charDef.rim, 3.5)
    rimL.position.set(0, 5, -5)
    scene.add(rimL)
    const bounce = new THREE.PointLight(charDef.rim, 1.2, 4)
    bounce.position.set(0, -0.5, 1)
    scene.add(bounce)

    // Ground
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.5, 64),
      new THREE.MeshStandardMaterial({ color: 0x0d1117, roughness: 0.9 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.01
    ground.receiveShadow = true
    scene.add(ground)

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.ShadowMaterial({ opacity: 0.55 })
    )
    shadowPlane.rotation.x = -Math.PI / 2
    shadowPlane.receiveShadow = true
    scene.add(shadowPlane)

    // Glow rings
    const rMat = new THREE.MeshBasicMaterial({ color: charDef.rim, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.58, 80), rMat)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.005
    scene.add(ring)
    ringRef.current = ring

    const r2Mat = new THREE.MeshBasicMaterial({ color: charDef.rim, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(0.6, 1.1, 80), r2Mat)
    ring2.rotation.x = -Math.PI / 2
    ring2.position.y = 0.004
    scene.add(ring2)
    ring2Ref.current = ring2

    // Load model
    if (mixerRef.current) { mixerRef.current.stopAllAction(); mixerRef.current = null }
    actionsRef.current = {}

    const loader = new GLTFLoader()
    loader.load(
      charDef.path,
      (gltf: any) => {
        if (modelGroupRef.current) scene.remove(modelGroupRef.current)
        const model = gltf.scene
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const sf = charDef.scale / Math.max(size.x, size.y, size.z)
        model.scale.setScalar(sf)
        model.position.set(-center.x * sf, -box.min.y * sf, -center.z * sf)
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (child.material) {
              child.material.roughness = Math.min(child.material.roughness ?? 0.5, 0.65)
            }
          }
        })
        const group = new THREE.Group()
        group.add(model)
        scene.add(group)
        modelGroupRef.current = group
        camera.position.set(0, charDef.cameraY, charDef.cameraZ)
        controls.target.set(0, charDef.targetY, 0)
        controls.update()

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model)
          mixerRef.current = mixer
          const names: string[] = []
          gltf.animations.forEach((clip: any) => {
            const action = mixer.clipAction(clip)
            action.loop = THREE.LoopRepeat
            actionsRef.current[clip.name] = action
            names.push(clip.name)
          })
          setAvailableAnimations(names)
          const def = names.find(n => /idle|stand|survey|breathing/i.test(n)) || names[0]
          if (def) {
            actionsRef.current[def].play()
            activeActionRef.current = actionsRef.current[def]
            setActiveAnimation(def)
            setIsPlaying(true)
          }
        }
        setLoading(false)
      },
      undefined,
      (err: any) => {
        console.error('GLB error:', err)
        setLoadError('فشل تحميل النموذج')
        setLoading(false)
      }
    )

    const onResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    clockRef.current = new THREE.Clock()
    let elapsed = 0
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate)
      const delta = clockRef.current.getDelta()
      elapsed += delta
      if (mixerRef.current) mixerRef.current.update(delta)
      controls.autoRotate = autoRotate
      controls.autoRotateSpeed = 1.2
      controls.update()
      if (ringRef.current) ringRef.current.material.opacity = 0.35 + Math.sin(elapsed * 2) * 0.15
      if (ring2Ref.current) ring2Ref.current.material.opacity = 0.1 + Math.sin(elapsed * 1.5 + 1) * 0.06
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      window.removeEventListener('resize', onResize)
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
      renderer.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChar])

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
  }, [autoRotate])

  const label = (n: string) => ANIM_LABELS[n] || n

  return (
    <div
      className={\`relative rounded-2xl overflow-hidden flex flex-col border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.85)] \${className}\`}
      style={{ background: 'linear-gradient(160deg,#080d12 0%,#050709 100%)' }}
      dir="rtl"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.025] backdrop-blur-md z-20 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Three.js GLB — WebGL</span>
          </div>
          <span className="text-[13px] font-black text-white hidden sm:block">{sectionTitle}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-white/[0.05] border border-white/[0.08] rounded-xl p-0.5 gap-0.5">
            <button
              onClick={() => { setActiveChar('male'); if (characterType === 'girl') toggleCharacterType() }}
              className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${activeChar === 'male' ? 'bg-[#1F8A54] text-white' : 'text-white/50 hover:text-white'}\`}
            >
              <User size={12} /><span className="hidden sm:inline">ريان</span>
            </button>
            <button
              onClick={() => { setActiveChar('female'); if (characterType === 'boy') toggleCharacterType() }}
              className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${activeChar === 'female' ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'}\`}
            >
              <UserCheck size={12} /><span className="hidden sm:inline">سارة</span>
            </button>
          </div>
          <button onClick={togglePlay} className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white/70 hover:text-white transition-all" title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}>
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            onClick={() => setAutoRotate(r => !r)}
            className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all \${autoRotate ? 'bg-[#1F8A54] border-[#1F8A54] text-white' : 'bg-white/[0.06] border-white/[0.08] text-white/60 hover:text-white'}\`}
          >
            <Compass size={13} className={autoRotate ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{autoRotate ? 'إيقاف' : '360°'}</span>
          </button>
          <button onClick={resetCamera} className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white/60 hover:text-white transition-all" title="إعادة الكاميرا">
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="relative flex-1" style={{ minHeight: height }}>
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#060a0e]/95">
            <div className="w-14 h-14 rounded-full mb-5" style={{ border: '3px solid rgba(255,255,255,0.08)', borderTopColor: charDef.color, animation: 'spin3d 0.9s linear infinite' }} />
            <p className="text-sm font-bold text-white mb-1">جاري تحميل شخصية {activeChar === 'male' ? 'ريان' : 'سارة'}...</p>
            <p className="text-xs text-white/40">نموذج GLB حقيقي مع كامل الأنيميشن</p>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#060a0e] z-20">
            <p className="text-white/50 text-sm">{loadError}</p>
          </div>
        )}

        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {!loading && (
          <div className="absolute top-3 left-3 pointer-events-none z-10 px-3 py-1.5 rounded-full bg-black/60 border border-white/[0.08] text-white/50 text-xs">
            اسحب لتدوير 360° — قرّب وابتعد بالماوس
          </div>
        )}

        {!loading && !loadError && (
          <div
            className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold backdrop-blur-md"
            style={{ background: activeChar === 'male' ? 'rgba(31,138,84,0.15)' : 'rgba(124,58,237,0.15)', borderColor: activeChar === 'male' ? 'rgba(31,138,84,0.4)' : 'rgba(124,58,237,0.4)', color: activeChar === 'male' ? '#34d399' : '#a78bfa' }}
          >
            {activeChar === 'male' ? <User size={12} /> : <UserCheck size={12} />}
            <span>{charDef.label}</span>
          </div>
        )}

        {isSpeaking && (
          <div className="absolute bottom-[215px] right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 border border-emerald-500/60 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
            {[1, 1.4, 0.8, 1.6, 1].map((hv, i) => (
              <span key={i} className="w-1 rounded-full bg-emerald-400" style={{ height: hv * 14 + 'px', animation: 'bounce 0.5s ease-in-out infinite', animationDelay: i * 0.1 + 's' }} />
            ))}
            <span className="text-xs font-bold text-white mr-1">يتحدث الآن</span>
          </div>
        )}

        {!loading && (
          <div className="absolute bottom-4 right-4 z-10 w-72 p-4 rounded-2xl bg-[#0d1219]/92 border border-white/[0.12] backdrop-blur-xl shadow-2xl text-right">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.08]">
              <span className="text-[11px] font-black" style={{ color: charDef.accent }}>{currentSectionInfo.title}</span>
              <span className="text-[10px] text-white/40">{currentSectionInfo.role}</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed mb-3">{currentSectionInfo.message}</p>
            <div className="flex gap-2">
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speakPhrase(currentSectionInfo.message)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-white text-xs font-bold"
                style={{ background: charDef.color, boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
              >
                <Volume2 size={13} />
                <span>{isSpeaking ? 'إيقاف الصوت' : 'اسمع الصوت'}</span>
              </button>
              <button
                onClick={() => { toggleCharacterType(); setActiveChar(c => c === 'male' ? 'female' : 'male') }}
                className="p-2 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.08] text-white/70 hover:text-white transition-all"
                title="تبديل الشخصية"
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animation Controls */}
      {availableAnimations.length > 0 && !loading && (
        <div className="px-4 py-3 border-t border-white/[0.07] bg-white/[0.02] z-20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={12} style={{ color: charDef.accent }} />
            <span className="text-[11px] font-bold text-white/60">حركات الأنيميشن ({availableAnimations.length})</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {availableAnimations.map(anim => (
              <button
                key={anim}
                onClick={() => playAnimation(anim)}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                style={{
                  background: activeAnimation === anim ? charDef.color : 'rgba(255,255,255,0.04)',
                  borderColor: activeAnimation === anim ? charDef.color : 'rgba(255,255,255,0.07)',
                  color: activeAnimation === anim ? '#fff' : 'rgba(255,255,255,0.55)',
                }}
              >
                {label(anim)}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{\`@keyframes spin3d { to { transform: rotate(360deg); } }\`}</style>
    </div>
  )
}
`;

fs.writeFileSync(outPath, code, 'utf8');
const size = fs.statSync(outPath).size;
console.log('SUCCESS: Written', size, 'bytes to', outPath);
