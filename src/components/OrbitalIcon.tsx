import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { CommandModule } from '../data/modules'
import { useSound } from '../hooks/useSound'

/*
  A single orbital module node — a large circular icon medallion that sits on the
  ring around the central core. Icon-first with a short caption underneath, so the
  home screen reads as an interactive command dashboard, not a text-heavy website.
  Touch target is well above the 72px minimum. Scales up + glows when selected/focused.
*/
interface OrbitalIconProps {
  module: CommandModule
  selected: boolean
  focused?: boolean
  /** Dim when another node's panel is open. */
  dimmed?: boolean
  onSelect: (id: string) => void
  index?: number
  /** Absolute placement on the ring (left/top %), supplied by the Dashboard. */
  style?: CSSProperties
}

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
      animate={{
        opacity: dimmed ? 0.25 : 1,
        scale: active ? 1.12 : 1,
      }}
      transition={{
        delay: 0.03 * index,
        type: 'spring',
        stiffness: 160,
        damping: 18,
      }}
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
      {/* Icon medallion */}
      <span
        className={`relative flex h-[5.75rem] w-[5.75rem] items-center justify-center rounded-full transition-all duration-300 ${
          active ? 'glass-strong' : 'glass'
        }`}
        style={{
          border: `1px solid ${accent}${active ? 'aa' : '55'}`,
          boxShadow: active
            ? `0 0 46px ${accent}77, inset 0 0 26px ${accent}33`
            : `0 0 18px ${accent}22`,
        }}
      >
        {/* Rotating focus ring */}
        {active && (
          <motion.span
            className="absolute inset-[-8px] rounded-full border border-dashed"
            style={{ borderColor: `${accent}88` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        )}
        <Icon
          className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
          style={{ color: accent }}
          strokeWidth={1.6}
        />
      </span>

      {/* Short caption */}
      <span
        className={`max-w-[8.5rem] text-center font-display text-[0.95rem] font-bold uppercase leading-tight tracking-wide transition-colors 2xl:text-base ${
          active ? 'text-white text-glow' : 'text-white/70'
        }`}
      >
        {module.short}
      </span>
    </motion.button>
  )
}
