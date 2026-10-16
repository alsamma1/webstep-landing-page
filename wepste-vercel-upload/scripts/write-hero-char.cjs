const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '../src/components/character/HeroCharacter2D.tsx');

const code = `'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useCharacter } from './CharacterController'

// ── Types ────────────────────────────────────────────────────
type Pose = 'idle' | 'wave' | 'talk' | 'excited' | 'point'

interface HeroCharacter2DProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  forcePose?: Pose
  onClick?: () => void
}

const SIZE = {
  sm:  { w: 140, h: 220 },
  md:  { w: 200, h: 320 },
  lg:  { w: 280, h: 440 },
  xl:  { w: 360, h: 560 },
}

// ── Bashir (Male) — Brand Green SVG character ─────────────────
function BashirSVG({ pose, blink, mouthOpen, armAngle, breathe }: {
  pose: Pose; blink: boolean; mouthOpen: number; armAngle: number; breathe: number;
}) {
  const skin = '#d08b5b'
  const hair = '#1a0a00'
  const shirt = '#1F8A54'
  const pants = '#1e293b'
  const shoe = '#111827'
  const white = '#ffffff'
  const eyeColor = '#1a0a00'

  // Wave arm angle interpolation
  const rArmRot = pose === 'wave' ? armAngle : pose === 'point' ? -30 : 0
  const bodyScale = 1 + breathe * 0.012
  const bodyY = breathe * 1.5

  return (
    <svg viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="bSkin" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#f0b07c" />
          <stop offset="100%" stopColor={skin} />
        </radialGradient>
        <linearGradient id="bShirt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#26a667" />
          <stop offset="100%" stopColor={shirt} />
        </linearGradient>
        <linearGradient id="bPants" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor={pants} />
        </linearGradient>
        <filter id="bShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
        </filter>
        <filter id="bGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="374" rx="52" ry="6" fill="rgba(0,0,0,0.25)" />

      {/* Body group with breathing */}
      <g transform={\`translate(0, \${bodyY}) scale(1, \${bodyScale}) translate(0, \${-bodyY / bodyScale})\`}>

        {/* Shoes */}
        <ellipse cx="82" cy="357" rx="22" ry="9" fill={shoe} />
        <ellipse cx="118" cy="357" rx="22" ry="9" fill={shoe} />

        {/* Legs */}
        <rect x="76" y="285" width="22" height="75" rx="9" fill="url(#bPants)" />
        <rect x="102" y="285" width="22" height="75" rx="9" fill="url(#bPants)" />

        {/* Shirt body */}
        <rect x="62" y="180" width="76" height="112" rx="18" fill="url(#bShirt)" filter="url(#bShadow)" />

        {/* Collar V */}
        <path d="M82 180 Q100 202 118 180" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />

        {/* WebStep W logo on shirt */}
        <text x="100" y="234" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontWeight="bold" fontFamily="Arial">W</text>

        {/* Left arm (static) */}
        <rect x="37" y="187" width="26" height="70" rx="11" fill="url(#bShirt)" />
        <ellipse cx="50" cy="262" rx="14" ry="12" fill="url(#bSkin)" />

        {/* Right arm (waves!) */}
        <g transform={\`rotate(\${-rArmRot}, 148, 195)\`}>
          <rect x="135" y="187" width="26" height="70" rx="11" fill="url(#bShirt)" />
          <ellipse cx="148" cy="262" rx="14" ry="12" fill="url(#bSkin)" />

          {/* Hand fingers waving */}
          {pose === 'wave' && (
            <g transform="translate(148, 262)">
              {[-8,-4,0,4].map((x, i) => (
                <rect
                  key={i}
                  x={x - 3}
                  y={-18}
                  width="5"
                  height="14"
                  rx="3"
                  fill="url(#bSkin)"
                  style={{ animation: \`fingerWave 0.4s ease-in-out \${i * 0.07}s infinite alternate\` }}
                />
              ))}
            </g>
          )}
        </g>

        {/* Neck */}
        <rect x="89" y="155" width="22" height="30" rx="9" fill="url(#bSkin)" />

        {/* Head */}
        <ellipse cx="100" cy="122" rx="44" ry="48" fill="url(#bSkin)" filter="url(#bShadow)" />

        {/* Hair */}
        <path d="M56 105 Q58 72 100 68 Q142 72 144 105 Q138 82 100 78 Q62 82 56 105Z" fill={hair} />
        <ellipse cx="100" cy="78" rx="40" ry="18" fill={hair} />

        {/* Ears */}
        <ellipse cx="56" cy="124" rx="9" ry="11" fill="url(#bSkin)" />
        <ellipse cx="144" cy="124" rx="9" ry="11" fill="url(#bSkin)" />

        {/* Eyebrows */}
        <path d="M74 108 Q83 103 92 108" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />
        <path d="M108 108 Q117 103 126 108" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />

        {/* Eyes */}
        <ellipse cx="83" cy="122" rx="10" ry={blink ? 1.5 : 11} fill={white} style={{ transition: 'ry 0.06s ease' }} />
        <ellipse cx="117" cy="122" rx="10" ry={blink ? 1.5 : 11} fill={white} style={{ transition: 'ry 0.06s ease' }} />
        {!blink && <>
          <circle cx="85" cy="124" r="6" fill={eyeColor} />
          <circle cx="119" cy="124" r="6" fill={eyeColor} />
          <circle cx="87" cy="122" r="2" fill={white} />
          <circle cx="121" cy="122" r="2" fill={white} />
        </>}

        {/* Nose */}
        <ellipse cx="100" cy="136" rx="4" ry="3.5" fill="rgba(170,90,30,0.25)" />
        {/* Nostrils */}
        <ellipse cx="97" cy="138" rx="2" ry="1.5" fill="rgba(160,80,20,0.3)" />
        <ellipse cx="103" cy="138" rx="2" ry="1.5" fill="rgba(160,80,20,0.3)" />

        {/* Mouth */}
        {mouthOpen > 0.3 ? (
          <>
            <path d="M87 150 Q100 162 113 150" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="100" cy="155" rx={4 + mouthOpen * 5} ry={mouthOpen * 6} fill="#b45309" />
          </>
        ) : (
          <path d="M88 150 Q100 160 112 150" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Speaking indicator */}
        {mouthOpen > 0.5 && (
          <g transform="translate(100, 75)">
            {[0, 1, 2].map(i => (
              <rect
                key={i}
                x={i * 8 - 8}
                y={-12}
                width="5"
                height="12"
                rx="2.5"
                fill="#1F8A54"
                opacity="0.8"
                style={{ animation: \`soundBar 0.4s ease-in-out \${i * 0.12}s infinite alternate\` }}
              />
            ))}
          </g>
        )}
      </g>

      <style>{\`
        @keyframes fingerWave { from { transform: translateY(0); } to { transform: translateY(-5px); } }
        @keyframes soundBar { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }
      \`}</style>
    </svg>
  )
}

// ── Shereen (Female) — Brand Purple SVG character ──────────────
function ShereenSVG({ pose, blink, mouthOpen, armAngle, breathe }: {
  pose: Pose; blink: boolean; mouthOpen: number; armAngle: number; breathe: number;
}) {
  const skin = '#edb98a'
  const hair = '#2d0a0a'
  const dress = '#7c3aed'
  const dressLight = '#a78bfa'
  const shoe = '#4c1d95'
  const white = '#ffffff'
  const eyeColor = '#2d0a0a'
  const lipColor = '#c2185b'

  const rArmRot = pose === 'wave' ? armAngle : pose === 'point' ? -30 : 0
  const bodyScale = 1 + breathe * 0.012
  const bodyY = breathe * 1.5

  return (
    <svg viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="sSkin" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#f5c89a" />
          <stop offset="100%" stopColor={skin} />
        </radialGradient>
        <linearGradient id="sDress" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={dressLight} />
          <stop offset="100%" stopColor={dress} />
        </linearGradient>
        <linearGradient id="sHair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a1010" />
          <stop offset="100%" stopColor={hair} />
        </linearGradient>
        <filter id="sShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="374" rx="52" ry="6" fill="rgba(0,0,0,0.25)" />

      {/* Body with breathing */}
      <g transform={\`translate(0, \${bodyY}) scale(1, \${bodyScale}) translate(0, \${-bodyY / bodyScale})\`}>

        {/* Shoes - heeled */}
        <ellipse cx="82" cy="356" rx="20" ry="8" fill={shoe} />
        <ellipse cx="118" cy="356" rx="20" ry="8" fill={shoe} />
        <rect x="76" y="348" width="8" height="12" rx="2" fill={shoe} />
        <rect x="112" y="348" width="8" height="12" rx="2" fill={shoe} />

        {/* Dress/skirt */}
        <path d="M68 240 L58 355 L142 355 L132 240 Z" fill="url(#sDress)" />
        <path d="M68 240 Q100 260 132 240" fill="rgba(255,255,255,0.15)" />

        {/* Body top (dress bodice) */}
        <rect x="62" y="178" width="76" height="70" rx="18" fill="url(#sDress)" filter="url(#sShadow)" />

        {/* Collar necklace detail */}
        <ellipse cx="100" cy="183" rx="15" ry="5" fill="rgba(255,255,255,0.2)" />

        {/* Left arm */}
        <rect x="37" y="185" width="26" height="65" rx="11" fill="url(#sDress)" />
        <ellipse cx="50" cy="254" rx="13" ry="11" fill="url(#sSkin)" />

        {/* Right arm (waves!) */}
        <g transform={\`rotate(\${-rArmRot}, 148, 193)\`}>
          <rect x="135" y="185" width="26" height="65" rx="11" fill="url(#sDress)" />
          <ellipse cx="148" cy="254" rx="13" ry="11" fill="url(#sSkin)" />
          {pose === 'wave' && (
            <g transform="translate(148, 254)">
              {[-8,-4,0,4].map((x, i) => (
                <rect
                  key={i}
                  x={x - 3}
                  y={-18}
                  width="5"
                  height="13"
                  rx="3"
                  fill="url(#sSkin)"
                  style={{ animation: \`fingerWave 0.4s ease-in-out \${i * 0.07}s infinite alternate\` }}
                />
              ))}
            </g>
          )}
        </g>

        {/* Neck */}
        <rect x="89" y="153" width="22" height="30" rx="9" fill="url(#sSkin)" />

        {/* Head */}
        <ellipse cx="100" cy="120" rx="44" ry="46" fill="url(#sSkin)" filter="url(#sShadow)" />

        {/* Long wavy hair - back */}
        <path d="M56 102 Q44 140 48 200 Q60 240 72 220 Q68 165 72 125 Z" fill="url(#sHair)" />
        <path d="M144 102 Q156 140 152 200 Q140 240 128 220 Q132 165 128 125 Z" fill="url(#sHair)" />

        {/* Hair top */}
        <path d="M56 104 Q58 68 100 64 Q142 68 144 104 Q138 76 100 72 Q62 76 56 104Z" fill="url(#sHair)" />
        <ellipse cx="100" cy="72" rx="42" ry="20" fill="url(#sHair)" />

        {/* Hair highlights */}
        <path d="M80 68 Q100 60 120 68" fill="none" stroke="rgba(120,40,40,0.6)" strokeWidth="3" />

        {/* Ears */}
        <ellipse cx="56" cy="122" rx="9" ry="11" fill="url(#sSkin)" />
        <ellipse cx="144" cy="122" rx="9" ry="11" fill="url(#sSkin)" />
        {/* Small earrings */}
        <circle cx="56" cy="125" r="4" fill={dressLight} />
        <circle cx="144" cy="125" r="4" fill={dressLight} />

        {/* Eyebrows — arched feminine */}
        <path d="M74 104 Q83 98 92 104" fill="none" stroke={hair} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M108 104 Q117 98 126 104" fill="none" stroke={hair} strokeWidth="2.5" strokeLinecap="round" />

        {/* Eyes — larger, more expressive */}
        <ellipse cx="83" cy="119" rx="11" ry={blink ? 1.5 : 12} fill={white} style={{ transition: 'ry 0.06s ease' }} />
        <ellipse cx="117" cy="119" rx="11" ry={blink ? 1.5 : 12} fill={white} style={{ transition: 'ry 0.06s ease' }} />
        {!blink && <>
          <circle cx="85" cy="121" r="6.5" fill={eyeColor} />
          <circle cx="119" cy="121" r="6.5" fill={eyeColor} />
          {/* Iris highlight */}
          <circle cx="87" cy="119" r="2.2" fill={white} />
          <circle cx="121" cy="119" r="2.2" fill={white} />
          {/* Eye lashes */}
          <path d="M72 112 L70 108 M76 110 L75 106 M80 109 L80 105" stroke={hair} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M106 110 L105 106 M110 109 L110 105 M114 110 L115 106 M118 112 L120 108" stroke={hair} strokeWidth="1.5" strokeLinecap="round" />
        </>}

        {/* Blush */}
        <ellipse cx="73" cy="130" rx="10" ry="6" fill="rgba(236,72,153,0.15)" />
        <ellipse cx="127" cy="130" rx="10" ry="6" fill="rgba(236,72,153,0.15)" />

        {/* Nose */}
        <ellipse cx="100" cy="133" rx="3.5" ry="3" fill="rgba(180,100,60,0.2)" />

        {/* Mouth — with lipstick */}
        {mouthOpen > 0.3 ? (
          <>
            <path d="M89 148 Q100 158 111 148" fill="none" stroke={lipColor} strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="100" cy="152" rx={3 + mouthOpen * 5} ry={mouthOpen * 6} fill={lipColor} />
          </>
        ) : (
          <>
            <path d="M89 148 Q100 156 111 148" fill="none" stroke={lipColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Cupid's bow */}
            <path d="M91 147 Q96 143 100 147 Q104 143 109 147" fill="none" stroke={lipColor} strokeWidth="1.5" />
          </>
        )}

        {/* Speaking waveform */}
        {mouthOpen > 0.5 && (
          <g transform="translate(100, 72)">
            {[0, 1, 2].map(i => (
              <rect
                key={i}
                x={i * 8 - 8}
                y={-12}
                width="5"
                height="12"
                rx="2.5"
                fill="#a78bfa"
                opacity="0.85"
                style={{ animation: \`soundBar 0.4s ease-in-out \${i * 0.12}s infinite alternate\` }}
              />
            ))}
          </g>
        )}
      </g>

      <style>{\`
        @keyframes fingerWave { from { transform: translateY(0); } to { transform: translateY(-5px); } }
        @keyframes soundBar { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }
      \`}</style>
    </svg>
  )
}

// ── Main HeroCharacter2D Component ─────────────────────────────
export default function HeroCharacter2D({
  className = '',
  size = 'lg',
  forcePose,
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

  // Blink state — realistic random blinking
  const [blink, setBlink] = useState(false)
  useEffect(() => {
    let t: NodeJS.Timeout
    const schedule = () => {
      const delay = 2000 + Math.random() * 3500
      t = setTimeout(() => {
        setBlink(true)
        setTimeout(() => {
          setBlink(false)
          // Double-blink 20% of the time
          if (Math.random() < 0.2) {
            setTimeout(() => {
              setBlink(true)
              setTimeout(() => { setBlink(false); schedule() }, 110)
            }, 90)
          } else {
            schedule()
          }
        }, 120)
      }, delay)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  // Breathing sine wave
  const [breathe, setBreathe] = useState(0)
  useEffect(() => {
    let frame: number
    let start = Date.now()
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000
      setBreathe(Math.sin(elapsed * 1.2) * 0.5 + 0.5)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Waving arm oscillation
  const [armAngle, setArmAngle] = useState(0)
  const pose: Pose = forcePose || (state as Pose) || 'idle'
  useEffect(() => {
    if (pose !== 'wave') { setArmAngle(0); return }
    let frame: number
    let start = Date.now()
    const tick = () => {
      const t = (Date.now() - start) / 1000
      setArmAngle(Math.sin(t * 4) * 35 + 15)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [pose])

  // Mouth animation when speaking
  const [mouthOpen, setMouthOpen] = useState(0)
  useEffect(() => {
    if (!isSpeaking) { setMouthOpen(0); return }
    let frame: number
    let start = Date.now()
    const tick = () => {
      const t = (Date.now() - start) / 1000
      setMouthOpen(Math.abs(Math.sin(t * 7)) * 0.7 + 0.15)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isSpeaking])

  // Head tilt following mouse
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height * 0.3
    const dx = (mouseX - cx) / (window.innerWidth || 1)
    const dy = (mouseY - cy) / (window.innerHeight || 1)
    setTilt({
      x: Math.max(-6, Math.min(6, -dy * 8)),
      y: Math.max(-8, Math.min(8, dx * 10)),
    })
  }, [mouseX, mouseY])

  const { w, h } = SIZE[size]
  const isBoy = characterType === 'boy'
  const glowColor = isBoy ? 'rgba(31,138,84,0.35)' : 'rgba(124,58,237,0.35)'

  const svgProps = { pose, blink, mouthOpen, armAngle, breathe }

  return (
    <div
      ref={containerRef}
      className={\`relative select-none \${className}\`}
      style={{ width: w, height: h, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: \`radial-gradient(circle at 50% 60%, \${glowColor} 0%, transparent 70%)\`,
          filter: 'blur(20px)',
          transform: 'scale(1.3)',
          transition: 'background 0.8s ease',
          animation: 'characterGlow 4s ease-in-out infinite',
        }}
      />

      {/* Ground reflection */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: w * 0.55,
          height: 12,
          background: \`radial-gradient(ellipse, \${glowColor.replace('0.35', '0.3')} 0%, transparent 70%)\`,
          filter: 'blur(6px)',
        }}
      />

      {/* 3D head tilt wrapper */}
      <div
        className="w-full h-full"
        style={{
          transform: \`perspective(800px) rotateX(\${tilt.x}deg) rotateY(\${tilt.y}deg)\`,
          transformOrigin: '50% 40%',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {isBoy
          ? <BashirSVG {...svgProps} />
          : <ShereenSVG {...svgProps} />
        }
      </div>

      {/* Speaking indicator badge */}
      {isSpeaking && (
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-md border"
          style={{
            background: isBoy ? 'rgba(15,40,25,0.9)' : 'rgba(25,10,50,0.9)',
            borderColor: isBoy ? 'rgba(31,138,84,0.6)' : 'rgba(124,58,237,0.6)',
            boxShadow: isBoy ? '0 0 20px rgba(31,138,84,0.4)' : '0 0 20px rgba(124,58,237,0.4)',
          }}
        >
          {[10, 16, 8, 14].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-full"
              style={{
                height: h,
                background: isBoy ? '#34d399' : '#a78bfa',
                animation: 'soundBar 0.4s ease-in-out infinite alternate',
                animationDelay: i * 0.1 + 's',
              }}
            />
          ))}
          <span className="mr-1">{isBoy ? 'بشير' : 'شيرين'} يتحدث</span>
        </div>
      )}

      <style>{\`
        @keyframes characterGlow {
          0%, 100% { opacity: 0.7; transform: scale(1.3); }
          50% { opacity: 1; transform: scale(1.45); }
        }
        @keyframes soundBar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
      \`}</style>
    </div>
  )
}
`;

fs.writeFileSync(outPath, code, 'utf8');
console.log('HeroCharacter2D written:', fs.statSync(outPath).size, 'bytes');
