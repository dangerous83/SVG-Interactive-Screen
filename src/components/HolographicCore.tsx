import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

/*
  Central holographic network core — a rotating globe / radar built from layered SVG.
  Pure SVG + CSS animation keeps it GPU-light for smooth 4K rendering (no Three.js).
  `active` slightly intensifies the glow when a module panel is open.
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
      {/* Outer glow */}
      <motion.div
        animate={{ scale: active ? 1.06 : 1, opacity: active ? 0.9 : 0.7 }}
        transition={{ duration: 0.6 }}
        className="absolute h-[36vh] w-[36vh] rounded-full bg-itsec-blue/20 blur-[90px]"
      />

      {/* Rotating ring stack */}
      <div className="relative h-[32vh] w-[32vh] max-h-[420px] max-w-[420px]">
        {/* Ring 1 */}
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-sv-cyan/30" />
        {/* Ring 2 (dashed, reverse) */}
        <div
          className="absolute inset-[6%] animate-spin-reverse rounded-full border-2 border-dashed border-itsec-blue/40"
          style={{ animationDuration: '50s' }}
        />
        {/* Ring 3 */}
        <div
          className="absolute inset-[14%] animate-spin-slow rounded-full border border-sv-orange/30"
          style={{ animationDuration: '30s' }}
        />

        {/* SVG globe + radar */}
        <svg viewBox="0 0 400 400" className="absolute inset-[10%]">
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#33d6ff" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#0075c9" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0075c9" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="radarSweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#33d6ff" stopOpacity="0" />
              <stop offset="100%" stopColor="#33d6ff" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          <circle cx="200" cy="200" r="160" fill="url(#coreGlow)" />

          {/* Longitude / latitude lines (globe feel) */}
          <g stroke="#33d6ff" strokeOpacity="0.35" fill="none" strokeWidth="1">
            <circle cx="200" cy="200" r="150" strokeOpacity="0.25" />
            <ellipse cx="200" cy="200" rx="150" ry="55" />
            <ellipse cx="200" cy="200" rx="150" ry="110" />
            <ellipse cx="200" cy="200" rx="55" ry="150" />
            <ellipse cx="200" cy="200" rx="110" ry="150" />
            <line x1="50" y1="200" x2="350" y2="200" strokeOpacity="0.2" />
            <line x1="200" y1="50" x2="200" y2="350" strokeOpacity="0.2" />
          </g>

          {/* Radar sweep */}
          <g>
            <path d="M200 200 L200 50 A150 150 0 0 1 305 95 Z" fill="url(#radarSweep)">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Crypto / network nodes */}
          {[
            [200, 60],
            [330, 150],
            [300, 300],
            [150, 340],
            [70, 220],
            [110, 90],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <line
                x1="200"
                y1="200"
                x2={cx}
                y2={cy}
                stroke="#0075c9"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
              <circle cx={cx} cy={cy} r="5" fill="#33d6ff">
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur={`${2 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </svg>

        {/* Core shield hub (tappable = Explore Ecosystem shortcut) */}
        <motion.button
          onClick={onActivate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full"
          aria-label="Explore Ecosystem"
        >
          <div className="glass-strong flex h-full w-full flex-col items-center justify-center rounded-full shadow-glow-cyan">
            <ShieldCheck className="h-1/3 w-1/3 text-sv-cyan" strokeWidth={1.4} />
            <span className="mt-1 font-display text-[0.7rem] font-bold tracking-[0.25em] text-white/80 2xl:text-sm">
              CORE
            </span>
          </div>
        </motion.button>
      </div>
    </div>
  )
}
