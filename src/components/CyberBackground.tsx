import { useEffect, useRef } from 'react'

/*
  Ambient background layer: deep gradient + cyber grid + floating particles +
  radar sweep + drifting network lines. Rendered once behind everything.
  Particles use a lightweight canvas so 4K stays smooth (capped count, no libs).
*/

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  hue: number
}

export default function CyberBackground({ dim = false }: { dim?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let particles: Particle[] = []
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Scale particle count with area but cap it for performance on 4K.
      const target = Math.min(90, Math.round((window.innerWidth * window.innerHeight) / 42000))
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 2 + 0.6,
        hue: Math.random() > 0.5 ? 195 : 22, // cyan or orange
      }))
    }

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      // Connective lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.hypot(dx, dy)
          if (dist < 140) {
            ctx.strokeStyle = `rgba(51,214,255,${(1 - dist / 140) * 0.12})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }

      // Particle dots
      for (const p of particles) {
        ctx.beginPath()
        ctx.fillStyle =
          p.hue === 195 ? 'rgba(51,214,255,0.75)' : 'rgba(255,122,48,0.65)'
        ctx.shadowBlur = 8
        ctx.shadowColor = p.hue === 195 ? 'rgba(51,214,255,0.7)' : 'rgba(255,122,48,0.6)'
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!prefersReduced) {
      raf = requestAnimationFrame(draw)
    } else {
      draw() // one static frame
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Radial glow accents */}
      <div className="absolute left-1/2 top-[-20%] h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-itsec-blue/20 blur-[140px]" />
      <div className="absolute bottom-[-20%] left-[10%] h-[50vh] w-[50vh] rounded-full bg-itsec-orange/10 blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[8%] h-[50vh] w-[50vh] rounded-full bg-sv-cyan/10 blur-[140px]" />

      {/* Cyber grid */}
      <div className="cyber-grid-bg absolute inset-0 opacity-70" />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Sweeping scanline */}
      <div className="scanline absolute inset-x-0 top-0 animate-scan" />

      {/* Optional dim overlay when a panel is open */}
      <div
        className={`absolute inset-0 bg-void/60 transition-opacity duration-500 ${
          dim ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(3,6,15,0.85)_100%)]" />
    </div>
  )
}
