import { useEffect, useRef } from 'react'

/*
  CyberScene — a live, looping "cyber HUD" background rendered on a canvas.
  Used as the dashboard backdrop (a guaranteed-visible alternative to a video
  file: no codec / autoplay / decode issues, and it always loops). Deep-navy
  gradient + scrolling grid + radar sweep & rings + glowing network nodes +
  drifting particles + vertical data streams + scan sweep.
*/

const COL = { cy: '51,214,255', bl: '0,117,201', or: '255,122,48' } as const

function rng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

export default function CyberScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas)
      return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0
    let H = 0
    let particles: { x: number; y: number; r: number; vy: number; hue: keyof typeof COL; tw: number; ph: number }[] = []
    let nodes: { x: number; y: number; pulse: number; ph: number; hue: keyof typeof COL }[] = []
    let links: [number, number][] = []

    const build = () => {
      const rp = rng(99)
      particles = Array.from({ length: 150 }, () => ({
        x: rp() * W,
        y: rp() * H,
        r: 0.6 + rp() * 1.9,
        vy: (rp() < 0.5 ? 1 : -1) * (6 + rp() * 22),
        hue: rp() < 0.78 ? 'cy' : rp() < 0.6 ? 'bl' : 'or',
        tw: 0.5 + rp() * 1.5,
        ph: rp() * Math.PI * 2,
      }))
      const rnd = rng(7)
      nodes = Array.from({ length: 26 }, () => ({
        x: rnd() * W,
        y: rnd() * H,
        pulse: 0.4 + rnd() * 1.1,
        ph: rnd() * Math.PI * 2,
        hue: rnd() < 0.7 ? 'cy' : 'or',
      }))
      links = []
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          if (Math.hypot(dx, dy) < Math.min(W, H) * 0.22) links.push([i, j])
        }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = Math.max(1, Math.round(W * dpr))
      canvas.height = Math.max(1, Math.round(H * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    const draw = (nowMs: number) => {
      const t = nowMs / 1000
      const CX = W / 2
      const CY = H / 2

      // Background gradient
      const g = ctx.createRadialGradient(CX, CY * 0.6, 40, CX, CY, Math.max(W, H) * 0.75)
      g.addColorStop(0, '#0b1a3c')
      g.addColorStop(0.5, '#070e22')
      g.addColorStop(1, '#03060f')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      // Scrolling grid
      const gs = 74
      const off = (t * 14) % gs
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(0,117,201,0.14)'
      for (let x = -gs + off; x < W; x += gs) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }
      for (let y = -gs + off; y < H; y += gs) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      // Radar rings + sweep
      const rad = Math.min(W, H) * 0.52
      ctx.strokeStyle = 'rgba(51,214,255,0.12)'
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.arc(CX, CY, (i / 4) * rad, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.save()
      ctx.translate(CX, CY)
      ctx.rotate(t * 0.6)
      const sg = ctx.createLinearGradient(0, 0, rad, 0)
      sg.addColorStop(0, 'rgba(51,214,255,0.22)')
      sg.addColorStop(1, 'rgba(51,214,255,0)')
      ctx.fillStyle = sg
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, rad, -0.38, 0.02)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Network links + nodes
      for (const [a, b] of links) {
        ctx.strokeStyle = 'rgba(51,214,255,0.08)'
        ctx.beginPath()
        ctx.moveTo(nodes[a].x, nodes[a].y)
        ctx.lineTo(nodes[b].x, nodes[b].y)
        ctx.stroke()
      }
      for (const n of nodes) {
        const p = 0.45 + 0.55 * Math.abs(Math.sin(t * n.pulse + n.ph))
        ctx.fillStyle = `rgba(${COL[n.hue]},${0.3 + 0.6 * p})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2.4 + 2.4 * p, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = `rgba(${COL[n.hue]},${0.14 * p})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, 11 + 11 * p, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Particles (wrap vertically)
      for (const pt of particles) {
        let y = pt.y + ((t * pt.vy) % H)
        y = ((y % H) + H) % H
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * pt.tw + pt.ph))
        ctx.fillStyle = `rgba(${COL[pt.hue]},${0.55 * tw})`
        ctx.beginPath()
        ctx.arc(pt.x, y, pt.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Vertical data streams
      for (let i = 0; i < 11; i++) {
        const x = ((i + 0.5) / 11) * W + Math.sin(i * 3.1) * 30
        const speed = 60 + (i % 3) * 55
        const sy = (t * speed) % (H + 240) - 120
        const grd = ctx.createLinearGradient(0, sy - 120, 0, sy + 120)
        grd.addColorStop(0, 'rgba(51,214,255,0)')
        grd.addColorStop(0.5, i % 4 === 0 ? 'rgba(255,122,48,0.4)' : 'rgba(51,214,255,0.34)')
        grd.addColorStop(1, 'rgba(51,214,255,0)')
        ctx.strokeStyle = grd
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(x, sy - 120)
        ctx.lineTo(x, sy + 120)
        ctx.stroke()
      }

      // Horizontal scan sweep
      const scanY = (t * 90) % (H + 200) - 100
      const scg = ctx.createLinearGradient(0, scanY - 90, 0, scanY + 90)
      scg.addColorStop(0, 'rgba(51,214,255,0)')
      scg.addColorStop(0.5, 'rgba(51,214,255,0.08)')
      scg.addColorStop(1, 'rgba(51,214,255,0)')
      ctx.fillStyle = scg
      ctx.fillRect(0, scanY - 90, W, 180)

      // Vignette
      const vg = ctx.createRadialGradient(CX, CY, H * 0.3, CX, CY, Math.max(W, H) * 0.75)
      vg.addColorStop(0, 'rgba(3,6,15,0)')
      vg.addColorStop(1, 'rgba(3,6,15,0.6)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, W, H)

      raf = requestAnimationFrame(draw)
    }

    let raf = 0
    resize()
    window.addEventListener('resize', resize)
    if (prefersReduced) draw(0)
    else raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
}
