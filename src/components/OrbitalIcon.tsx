import { motion } from 'framer-motion'
import type { CommandModule } from '../data/modules'
import { useSound } from '../hooks/useSound'

/*
  A single interactive module node. Large (>=72px) touch target, holographic glow,
  scales up when selected. Used in the left (SecureVisa) and right (ITSEC) rails.
*/
interface OrbitalIconProps {
  module: CommandModule
  selected: boolean
  onSelect: (id: string) => void
  align?: 'left' | 'right'
  index?: number
  /** Keyboard focus highlight (arrow-key navigation) */
  focused?: boolean
}

export default function OrbitalIcon({
  module,
  selected,
  onSelect,
  align = 'left',
  index = 0,
  focused = false,
}: OrbitalIconProps) {
  const { play } = useSound()
  const Icon = module.icon
  const accent = module.org === 'securevisa' ? '#33d6ff' : '#ff7a30'

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: align === 'left' ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index, type: 'spring', stiffness: 120, damping: 18 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => play('hover-soft')}
      onClick={() => {
        play('icon-select')
        onSelect(module.id)
      }}
      aria-pressed={selected}
      className={`touch-target holo-border group relative flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-left transition-shadow ${
        selected ? 'glass-strong' : 'glass'
      } ${align === 'right' ? 'flex-row-reverse text-right' : ''} ${
        focused ? 'ring-2 ring-white/80' : ''
      }`}
      style={{
        boxShadow: selected || focused ? `0 0 42px ${accent}55` : undefined,
      }}
    >
      {/* Icon medallion */}
      <span
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl 2xl:h-[4.25rem] 2xl:w-[4.25rem]"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent}30, transparent 70%)`,
          border: `1px solid ${accent}55`,
        }}
      >
        <Icon
          className="h-8 w-8 2xl:h-9 2xl:w-9"
          style={{ color: accent }}
          strokeWidth={1.6}
        />
        <span
          className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 22px ${accent}55` }}
        />
      </span>

      {/* Label */}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-lg font-bold tracking-wide text-white 2xl:text-xl">
          {module.title}
        </span>
        <span
          className="block truncate text-sm font-medium uppercase tracking-[0.14em] 2xl:text-base"
          style={{ color: accent }}
        >
          {module.tag}
        </span>
      </span>

      {/* Selected pulse marker */}
      {selected && (
        <motion.span
          layoutId="orbital-marker"
          className="absolute inset-y-3 w-1 rounded-full"
          style={{
            [align === 'right' ? 'right' : 'left']: '-2px',
            background: accent,
            boxShadow: `0 0 14px ${accent}`,
          } as React.CSSProperties}
        />
      )}
    </motion.button>
  )
}
