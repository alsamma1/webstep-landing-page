'use client'

import Image from 'next/image'

type CharacterState =
  | 'idle' | 'welcome' | 'wave' | 'point' | 'look'
  | 'thinking' | 'success' | 'walk' | 'run' | 'excited'

interface WebStepCharacterProps {
  state?: CharacterState
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
  enableMouseTracking?: boolean
  className?: string
}

const SIZE_MAP: Record<string, number> = {
  sm: 160, md: 220, lg: 280, xl: 360,
}

export default function WebStepCharacter({
  state = 'idle',
  size = 'md',
  animate = true,
  className = '',
}: WebStepCharacterProps) {
  const px = SIZE_MAP[size] ?? 220

  const floatStyle = animate
    ? { animation: 'charFloat 4s ease-in-out infinite' }
    : {}

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: px, height: px, ...floatStyle }}
    >
      {/* حلقة نبض */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: '2px solid rgba(31,138,84,0.2)',
          animation: animate ? 'charPulse 3s ease-out infinite' : 'none',
        }}
      />

      {/* اللوغو */}
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: px * 0.55,
          height: px * 0.55,
          background: 'var(--surface, #fff)',
          border: '2px solid rgba(31,138,84,0.3)',
          boxShadow: '0 8px 32px rgba(31,138,84,0.15)',
        }}
      >
        <Image
          src="/assets/logo.png"
          alt="WebStep"
          width={Math.round(px * 0.35)}
          height={Math.round(px * 0.35)}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      {/* مؤشر الحالة */}
      <div
        className="absolute bottom-2 right-2 w-3 h-3 rounded-full border-2 border-white"
        style={{
          background: state === 'success' ? '#22c55e'
            : state === 'thinking' ? '#f59e0b'
            : '#1F8A54',
          animation: 'charPulse 2s ease-out infinite',
        }}
      />

      <style jsx>{`
        @keyframes charFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes charPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0;   }
        }
      `}</style>
    </div>
  )
}
