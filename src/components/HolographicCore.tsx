import { ShieldCheck } from 'lucide-react'

/*
  Central holographic network core — a STATIC globe / HUD built from layered SVG.
  Deliberately motionless (no spinning rings, no radar sweep, no hover/tap movement)
  so the CORE reads as a solid, professional button on a touch kiosk.
  `active` only intensifies the glow when the module ring is open.
*/
export default function HolographicCore({
  active = false,
  onActivate,
}: {
  active?: boolean
  onActivate?: () => void
}) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow (static) */}
      <div
        className="absolute h-[36vh] w-[36vh] rounded-full bg-itsec-blue/20 blur-[90px]"
        style={{ opacity: active ? 0.9 : 0.7 }}
      />

      {/* Static ring stack */}
      <div className="relative h-[32vh] w-[32vh] max-h-[420px] max-w-[420px]">
        <div className="absolute inset-0 rounded-full border border-sv-cyan/25" />
        <div className="absolute inset-[6%] rounded-full border-2 border-dashed border-itsec-blue/30" />
        <div className="absolute inset-[14%] rounded-full border border-sv-orange/25" />

        {/* SVG globe (static) */}
        <svg viewBox="0 0 400 400" className="absolute inset-[10%]">
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#33d6ff" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#0075c9" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0075c9" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="200" cy="200" r="160" fill="url(#coreGlow)" />

          {/* Longitude / latitude lines (globe feel) */}
          <g stroke="#33d6ff" strokeOpacity="0.32" fill="none" strokeWidth="1">
            <circle cx="200" cy="200" r="150" strokeOpacity="0.22" />
            <ellipse cx="200" cy="200" rx="150" ry="55" />
            <ellipse cx="200" cy="200" rx="150" ry="110" />
            <ellipse cx="200" cy="200" rx="55" ry="150" />
            <ellipse cx="200" cy="200" rx="110" ry="150" />
            <line x1="50" y1="200" x2="350" y2="200" strokeOpacity="0.18" />
            <line x1="200" y1="50" x2="200" y2="350" strokeOpacity="0.18" />
          </g>

          {/* Static network nodes */}
          {[
            [200, 60],
            [330, 150],
            [300, 300],
            [150, 340],
            [70, 220],
            [110, 90],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <line x1="200" y1="200" x2={cx} y2={cy} stroke="#0075c9" strokeOpacity="0.28" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="4" fill="#33d6ff" fillOpacity="0.7" />
            </g>
          ))}
        </svg>

        {/* Core shield hub — tap to open/close the module ring.
            No transform on hover/tap (kiosk UX): hover only intensifies the glow. */}
        <button
          onClick={onActivate}
          className="group absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full"
          aria-label="Toggle command modules"
        >
          <div
            className="glass-strong relative flex h-full w-full flex-col items-center justify-center rounded-full transition-shadow duration-300 group-hover:shadow-[0_0_60px_rgba(51,214,255,0.7)]"
            style={{ boxShadow: active ? '0 0 55px rgba(51,214,255,0.6)' : '0 0 34px rgba(51,214,255,0.4)' }}
          >
            <ShieldCheck className="h-1/3 w-1/3 text-sv-cyan" strokeWidth={1.4} />
            <span className="mt-1 font-display text-[0.7rem] font-bold tracking-[0.25em] text-white/80 2xl:text-sm">
              CORE
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
