'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// ─── SVG geometry ──────────────────────────────────────────────────────────────
// hero-owl.svg has viewBox="0 0 661 627"
// Use natural SVG dimensions so there is no transparent vertical padding.
const IMG_W = 661
const IMG_H = 627
const SVG_W = 661
const SVG_H = 627
const sc = IMG_W / SVG_W                        // = 1.0
const padY = (IMG_H - SVG_H * sc) / 2          // = 0 px

// Eye positions measured from path data in hero-owl.svg
//   Left eye (white ellipse):  centre ≈ (238, 190), semi-axis ≈ 80
//   Right eye (white ellipse): centre ≈ (430, 207), semi-axis ≈ 81
//   Left pupil (#48384C):      centre ≈ (205, 187), semi-axis ≈ 26
//   Right pupil:               centre ≈ (402, 204), semi-axis ≈ 26
const EYES_SVG = [
  { ecx: 238, ecy: 190, er: 80, pcx: 205, pcy: 187, pr: 26 }, // left
  { ecx: 430, ecy: 207, er: 81, pcx: 402, pcy: 204, pr: 26 }, // right
]

// Convert to viewBox-space (0 0 660 914)
const EYES = EYES_SVG.map(({ ecx, ecy, er, pcx, pcy, pr }) => ({
  ecx: ecx * sc,
  ecy: padY + ecy * sc,
  er:  er  * sc,
  pcx: pcx * sc,
  pcy: padY + pcy * sc,
  pr:  pr  * sc,
}))

const MAX_TRAVEL = 16  // max pixels the pupil travels from centre

// ─── Component ─────────────────────────────────────────────────────────────────
const HeroOwlWithEyes = () => {
  const wrapperRef = useRef(null)
  const targetRef  = useRef(EYES.map(() => ({ x: 0, y: 0 })))
  const currentRef = useRef(EYES.map(() => ({ x: 0, y: 0 })))
  const rafRef     = useRef(null)
  const [offsets, setOffsets] = useState(() => EYES.map(() => ({ x: 0, y: 0 })))

  useEffect(() => {
    // Mouse-move: update target positions
    const onMove = (e) => {
      const el = wrapperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const sx = rect.width  / IMG_W
      const sy = rect.height / IMG_H

      EYES.forEach(({ pcx, pcy, er, pr }, i) => {
        // Viewport position of this pupil's centre
        const vpx = rect.left + pcx * sx
        const vpy = rect.top  + pcy * sy
        const dx = e.clientX - vpx
        const dy = e.clientY - vpy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 1) { targetRef.current[i] = { x: 0, y: 0 }; return }
        // Clamp travel to MAX_TRAVEL (also keep pupil inside white area)
        const maxT = Math.min(MAX_TRAVEL, (er - pr) * sx)
        const t = Math.min(dist, maxT) / dist
        targetRef.current[i] = { x: dx * t, y: dy * t }
      })
    }

    // RAF loop: lerp current → target for smooth motion
    const animate = () => {
      let changed = false
      const next = currentRef.current.map(({ x, y }, i) => {
        const tx = targetRef.current[i].x
        const ty = targetRef.current[i].y
        const nx = x + (tx - x) * 0.14
        const ny = y + (ty - y) * 0.14
        if (Math.abs(nx - x) > 0.05 || Math.abs(ny - y) > 0.05) changed = true
        return { x: nx, y: ny }
      })
      currentRef.current = next
      if (changed) setOffsets([...next])
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}
    >
      <Image
        src="/hero-owl.svg"
        width={IMG_W}
        height={IMG_H}
        alt="hero-owl"
        priority
      />

      {/* ── Eye overlay ── */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${IMG_W} ${IMG_H}`}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          {/* Clip path = white-eye boundary, prevents pupil escaping the eyeball */}
          {EYES.map(({ ecx, ecy, er }, i) => (
            <clipPath key={i} id={`nnb-eye-${i}`}>
              <circle cx={ecx} cy={ecy} r={er - 1} />
            </clipPath>
          ))}
        </defs>

        {EYES.map(({ pcx, pcy, pr }, i) => {
          const { x, y } = offsets[i]
          const px = pcx + x
          const py = pcy + y
          return (
            <g key={i}>
              {/* White circle erases the static SVG pupil */}
              <circle cx={pcx} cy={pcy} r={pr + 10} fill="white" />
              {/* Animated dark pupil */}
              <circle cx={px} cy={py} r={pr} fill="#48384C" clipPath={`url(#nnb-eye-${i})`} />
              {/* Specular glint */}
              <circle
                cx={px + pr * 0.4}
                cy={py - pr * 0.4}
                r={Math.max(3, pr * 0.28)}
                fill="white"
                opacity="0.7"
                clipPath={`url(#nnb-eye-${i})`}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default HeroOwlWithEyes
