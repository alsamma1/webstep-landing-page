/**
 * WebStep — GSAP Animation Utilities
 * Centralized animation configurations
 */

// Ease presets
export const EASE = {
  smooth: 'power2.out',
  snappy: 'power3.out',
  expo: 'expo.out',
  bounce: 'back.out(1.4)',
  elastic: 'elastic.out(1, 0.3)',
} as const

// Duration presets (seconds)
export const DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  very_slow: 1.2,
} as const

// Stagger presets
export const STAGGER = {
  tight: 0.05,
  normal: 0.08,
  loose: 0.12,
  very_loose: 0.2,
} as const

// Common reveal animation config
export const fadeUpConfig = {
  from: { opacity: 0, y: 40 },
  to: {
    opacity: 1,
    y: 0,
    duration: DURATION.slow,
    ease: EASE.snappy,
  },
}

export const fadeInConfig = {
  from: { opacity: 0 },
  to: {
    opacity: 1,
    duration: DURATION.normal,
    ease: EASE.smooth,
  },
}

export const slideInRightConfig = {
  from: { opacity: 0, x: 60 },
  to: {
    opacity: 1,
    x: 0,
    duration: DURATION.slow,
    ease: EASE.snappy,
  },
}

export const slideInLeftConfig = {
  from: { opacity: 0, x: -60 },
  to: {
    opacity: 1,
    x: 0,
    duration: DURATION.slow,
    ease: EASE.snappy,
  },
}

export const scaleInConfig = {
  from: { opacity: 0, scale: 0.85 },
  to: {
    opacity: 1,
    scale: 1,
    duration: DURATION.normal,
    ease: EASE.bounce,
  },
}

// ScrollTrigger defaults
export const scrollTriggerDefaults = {
  start: 'top 85%',
  once: true,
} as const

// Character animation timelines
export interface CharacterAnimationConfig {
  target: string | Element
  state: string
}

export async function animateCharacterEntrance(element: Element | null) {
  if (!element) return
  try {
    const { default: gsap } = await import('gsap')
    gsap.fromTo(
      element,
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: EASE.bounce }
    )
  } catch {}
}

export async function animateCharacterFloat(element: Element | null) {
  if (!element) return
  try {
    const { default: gsap } = await import('gsap')
    gsap.to(element, {
      y: -20,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  } catch {}
}

export async function animateStaggerChildren(
  parent: Element | null,
  childSelector: string,
  options?: { delay?: number; start?: string }
) {
  if (!parent) return
  try {
    const { default: gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      parent.querySelectorAll(childSelector),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.slow,
        stagger: STAGGER.normal,
        ease: EASE.snappy,
        delay: options?.delay ?? 0,
        scrollTrigger: {
          trigger: parent,
          start: options?.start ?? 'top 85%',
        },
      }
    )
  } catch {}
}
