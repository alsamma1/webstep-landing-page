const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '../src/components/character/HeroCharacter2D.tsx');

const code = `'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useCharacter } from './CharacterController'

// ── Types ──────────────────────────────────────────────────────────────
type Pose = 'idle' | 'wave' | 'talk' | 'excited' | 'point' | 'welcome' | 'thinking' | 'look'

interface HeroCharacter2DProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  forcePose?: Pose
  showGlow?: boolean
  onClick?: () => void
}

const SIZE_MAP = {
  sm:  { w: 140, h: 220 },
  md:  { w: 200, h: 316 },
  lg:  { w: 280, h: 443 },
  xl:  { w: 360, h: 569 },
}

const CHAR_IMAGES = {
  boy: {
    idle: '/assets/characters/bashir-idle.jpg',
    wave: '/assets/characters/bashir-wave.jpg',
  },
  girl: {
    idle: '/assets/characters/shereen-idle.jpg',
    wave: '/assets/characters/shereen-wave.jpg',
  },
}

export default function HeroCharacter2D({
  className = '',
  size = 'lg',
  forcePose,
  showGlow = true,
  onClick,
}: HeroCharacter2DProps) {
  const {
    characterType,
    state,
    isSpeaking,
    mouseX,
    mouseY,
  } = useCharacter()

  const containerRef = useRef<HTMLDivElement>(null)

  // Determine which image to show
  const effectivePose: Pose = forcePose || (state as Pose) || 'idle'
  const isWaving = effectivePose === 'wave' || effectivePose === 'welcome' || effectivePose === 'excited'
  const gender = characterType === 'boy' ? 'boy' : 'girl'
  const images = CHAR_IMAGES[gender]
  const currentSrc = isWaving ? images.wave : images.idle

  // Blinking state — transparent PNG overlay dims eyes periodically
  const [blink, setBlink] = useState(false)
  useEffect(() => {
    let t: NodeJS.Timeout
    const schedule = () => {
      const delay = 2200 + Math.random() * 3800
      t = setTimeout(() => {
        setBlink(true)
        setTimeout(() => {
          setBlink(false)
          // Occasional double-blink
          if (Math.random() < 0.22) {
            setTimeout(() => {
              setBlink(true)
              setTimeout(() => { setBlink(false); schedule() }, 110)
            }, 80)
          } else {
            schedule()
          }
        }, 130)
      }, delay)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  // Breathing — gentle vertical scale
  const [breatheY, setBreatheY] = useState(0)
  useEffect(() => {
    let frame: number
    const start = Date.now()
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000
      setBreatheY(Math.sin(elapsed * 1.1) * 3)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Mouse-follow head tilt (gentle)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height * 0.2   // focus on face area
    const dx = (mouseX - cx) / (window.innerWidth || 1)
    const dy = (mouseY - cy) / (window.innerHeight || 1)
    setTilt({
      x: Math.max(-4, Math.min(4, -dy * 6)),
      y: Math.max(-6, Math.min(6, dx * 8)),
    })
  }, [mouseX, mouseY])

  // Waving bounce
  const [waveScale, setWaveScale] = useState(1)
  useEffect(() => {
    if (!isWaving) { setWaveScale(1); return }
    let frame: number
    const start = Date.now()
    const tick = () => {
      const t = (Date.now() - start) / 1000
      setWaveScale(1 + Math.abs(Math.sin(t * 6)) * 0.025)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isWaving])

  const { w, h } = SIZE_MAP[size]
  const isBoy = gender === 'boy'
  const glowColor = isBoy
    ? 'radial-gradient(ellipse at 50% 80%, rgba(31,138,84,0.35) 0%, transparent 70%)'
    : 'radial-gradient(ellipse at 50% 80%, rgba(31,138,84,0.28) 0%, transparent 70%)'

  return (
    <div
      ref={containerRef}
      className={\`relative select-none flex flex-col items-center \${className}\`}
      style={{ width: w }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Ambient glow beneath character */}
      {showGlow && (
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
          style={{
            height: h * 0.3,
            background: glowColor,
            filter: 'blur(22px)',
            transition: 'background 0.8s ease',
          }}
          aria-hidden="true"
        />
      )}

      {/* Main character image wrapper */}
      <div
        className="relative z-10"
        style={{
          width: w,
          height: h,
          transform: \`
            perspective(900px)
            rotateX(\${tilt.x}deg)
            rotateY(\${tilt.y}deg)
            translateY(\${breatheY}px)
            scale(\${waveScale})
          \`,
          transformOrigin: '50% 80%',
          transition: 'transform 0.18s ease-out',
          willChange: 'transform',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        {/* Character image */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ borderRadius: '0 0 0 0' }}
        >
          <Image
            src={currentSrc}
            alt={isBoy ? 'بشير — مطوّر WebStep' : 'شيرين — مصممة WebStep'}
            fill
            sizes={\`\${w}px\`}
            className="object-contain object-bottom"
            style={{
              transition: 'opacity 0.35s ease',
              filter: isSpeaking ? 'brightness(1.05)' : 'brightness(1)',
            }}
            priority
          />

          {/* Blink overlay — covers eye area with a slight darkening */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity"
            style={{
              opacity: blink ? 1 : 0,
              transition: 'opacity 0.06s ease',
              // Semi-transparent bar across eye area
              background: isBoy
                ? 'linear-gradient(to bottom, transparent 14%, rgba(180,130,80,0.85) 17%, rgba(180,130,80,0.85) 20%, transparent 23%)'
                : 'linear-gradient(to bottom, transparent 14%, rgba(180,130,80,0.75) 17%, rgba(180,130,80,0.75) 20%, transparent 23%)',
            }}
            aria-hidden="true"
          />

          {/* Speaking ripple glow */}
          {isSpeaking && (
            <div
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{
                background: 'radial-gradient(circle at 50% 18%, rgba(31,138,84,0.12) 0%, transparent 55%)',
                animation: 'speakPulse 0.8s ease-in-out infinite',
              }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Speaking audio visualizer badge */}
        {isSpeaking && (
          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-md border"
            style={{
              background: isBoy ? 'rgba(10,30,18,0.92)' : 'rgba(10,30,18,0.92)',
              borderColor: 'rgba(31,138,84,0.7)',
              boxShadow: '0 0 18px rgba(31,138,84,0.5)',
            }}
          >
            {[9, 15, 7, 13, 9].map((barH, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-[#34d399]"
                style={{
                  height: barH,
                  animation: 'voiceBar 0.45s ease-in-out infinite alternate',
                  animationDelay: \`\${i * 0.09}s\`,
                }}
              />
            ))}
            <span className="mr-1.5">{isBoy ? 'بشير' : 'شيرين'} يتحدث</span>
          </div>
        )}
      </div>

      {/* Hover click hint */}
      {onClick && (
        <div
          className="mt-2 flex items-center gap-1.5 text-xs text-white/35 pointer-events-none transition-opacity"
          style={{ opacity: isWaving ? 0 : 0.7 }}
        >
          <span>انقر للترحيب</span>
        </div>
      )}

      <style>{\`
        @keyframes speakPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes voiceBar {
          from { transform: scaleY(0.35); opacity: 0.7; }
          to   { transform: scaleY(1);    opacity: 1; }
        }
      \`}</style>
    </div>
  )
}
`;

fs.writeFileSync(outPath, code, 'utf8');
console.log('HeroCharacter2D.tsx written:', fs.statSync(outPath).size, 'bytes');
