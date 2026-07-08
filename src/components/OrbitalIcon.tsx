import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { CommandModule } from '../data/modules'
import { useSound } from '../hooks/useSound'

/*
  Orbital module node — a "cyber card": an angular (cut-corner) HUD medallion with
  a glowing accent frame, corner target-brackets, an inner radial glow behind the
  icon, a live status dot, and a scan sweep when active. Designed to read as a
  premium security platform, not a plain icon on a square.
*/
interface OrbitalIconProps {
  module: CommandModule
  selected: boolean
  focused?: boolean
  dimmed?: boolean
  onSelect: (id: string) => void
  index?: number
  style?: CSSProperties
}

// Cut top-left + bottom-right corners → angular "cyber card" silhouette.
const CLIP = 'polygon(22% 0, 100% 0, 100% 78%, 78% 100%, 0 100%, 0 22%)'

export default function OrbitalIcon({
  module,
  selected,
  focused = false,
  dimmed = false,
  onSelect,
  index = 0,
  style,
}: OrbitalIconProps) {
  const { play } = useSound()
  const Icon = module.icon
  const accent = module.org === 'securevisa' ? '#33d6ff' : '#ff7a30'
  const active = selected || focused

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: dimmed ? 0.25 : 1, scale: active ? 1.12 : 1 }}
      transition={{ delay: 0.03 * index, type: 'spring', stiffness: 160, damping: 18 }}
      whileHover={{ scale: active ? 1.14 : 1.08 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => play('hover-soft')}
      onClick={() => {
        play('icon-select')
        onSelect(module.id)
      }}
      aria-pressed={selected}
      aria-label={module.title}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 outline-none"
      style={style}
    >
      {/* Medallion */}
      <span className="relative h-[4.6rem] w-[4.6rem]">
        {/* Glow halo */}
        <span
          className="absolute inset-0 rounded-[1.1rem] blur-md transition-opacity duration-300"
          style={{ background: accent, opacity: active ? 0.5 : 0.16 }}
        />

        {/* Accent frame (cut-corner) */}
        <span
          className="absolute inset-0"
          style={{
            clipPath: CLIP,
            background: `linear-gradient(135deg, ${accent}, ${accent}55 55%, ${accent}22)`,
            boxShadow: active ? `0 0 34px ${accent}88` : undefined,
          }}
        >
          {/* Inner dark panel */}
          <span
            className="absolute inset-[1.5px] flex items-center justify-center overflow-hidden"
            style={{
              clipPath: CLIP,
              background:
                'linear-gradient(150deg, rgba(12,24,54,0.96) 0%, rgba(4,9,22,0.98) 100%)',
            }}
          >
            {/* Inner circuit grid */}
            <span
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage: `linear-gradient(${accent}55 1px, transparent 1px), linear-gradient(90deg, ${accent}55 1px, transparent 1px)`,
                backgroundSize: '11px 11px',
              }}
            />
            {/* Radial glow behind the icon */}
            <span
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at 50% 45%, ${accent}33, transparent 65%)` }}
            />
            {/* Scan sweep when active */}
            {active && (
              <motion.span
                className="absolute inset-x-0 h-1/2"
                style={{ background: `linear-gradient(to bottom, transparent, ${accent}44, transparent)` }}
                initial={{ y: '-120%' }}
                animate={{ y: '220%' }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              />
            )}

            <Icon
              className="relative z-10 h-8 w-8 transition-transform duration-300 group-hover:scale-110"
              style={{ color: accent, filter: `drop-shadow(0 0 6px ${accent}aa)` }}
              strokeWidth={1.7}
            />
          </span>
        </span>

        {/* Corner target brackets (on the square corners) */}
        <span
          className="absolute right-1 top-1 h-2.5 w-2.5 border-r-2 border-t-2 transition-colors"
          style={{ borderColor: active ? accent : `${accent}88` }}
        />
        <span
          className="absolute bottom-1 left-1 h-2.5 w-2.5 border-b-2 border-l-2 transition-colors"
          style={{ borderColor: active ? accent : `${accent}88` }}
        />

        {/* Live status dot */}
        <span className="absolute -right-0.5 top-1/2 flex h-2 w-2 -translate-y-1/2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full"
            style={{ background: accent, opacity: 0.7 }}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: accent }} />
        </span>
      </span>

      {/* Caption */}
      <span
        className={`max-w-[7.5rem] text-center font-display text-[0.82rem] font-bold uppercase leading-tight tracking-wide transition-colors 2xl:text-[0.95rem] ${
          active ? 'text-white text-glow' : 'text-white/75'
        }`}
      >
        {module.short}
      </span>
    </motion.button>
  )
}
