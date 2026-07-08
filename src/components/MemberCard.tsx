import { AnimatePresence, motion } from 'framer-motion'
import type { Member } from '../data/team'
import { useSound } from '../hooks/useSound'
import MemberAvatar from './MemberAvatar'

/*
  Interactive team member card with animated holographic border. Tapping toggles
  an expanded state that reveals a one-line blurb and expertise tags.
*/
interface MemberCardProps {
  member: Member
  expanded: boolean
  onToggle: (id: string) => void
  /** Denser layout for the bottom dashboard carousel */
  compact?: boolean
}

export default function MemberCard({
  member,
  expanded,
  onToggle,
  compact = false,
}: MemberCardProps) {
  const { play } = useSound()
  const accent = member.org === 'securevisa' ? '#33d6ff' : '#ff7a30'

  return (
    <motion.button
      layout
      onHoverStart={() => play('hover-soft')}
      onClick={() => {
        play('icon-select')
        onToggle(member.id)
      }}
      whileTap={{ scale: 0.98 }}
      aria-expanded={expanded}
      className={`holo-border glass group relative flex w-full flex-col items-center overflow-hidden rounded-3xl text-center ${
        compact ? 'p-3' : 'p-5'
      }`}
      style={{ boxShadow: expanded ? `0 0 40px ${accent}55` : undefined }}
    >
      {/* Org tag */}
      <span
        className="absolute left-3 top-3 rounded-md px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.15em]"
        style={{ background: `${accent}22`, color: accent }}
      >
        {member.org === 'securevisa' ? 'SV' : 'ITSEC'}
      </span>

      <MemberAvatar
        member={member}
        className={
          compact
            ? 'mb-3 h-24 w-24 rounded-2xl 2xl:h-28 2xl:w-28'
            : 'mb-4 h-32 w-32 rounded-2xl 2xl:h-40 2xl:w-40'
        }
      />

      <h3
        className={`font-display font-bold leading-tight text-white ${
          compact ? 'text-base 2xl:text-lg' : 'text-xl 2xl:text-2xl'
        }`}
      >
        {member.name}
      </h3>
      <p
        className={`mt-1 font-semibold uppercase tracking-[0.12em] ${
          compact ? 'text-xs 2xl:text-sm' : 'text-sm 2xl:text-base'
        }`}
        style={{ color: accent }}
      >
        {member.role}
      </p>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full overflow-hidden"
          >
            <p className="mt-4 text-base leading-relaxed text-white/70">
              {member.blurb}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {member.expertise.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1 text-sm font-medium"
                  style={{ borderColor: `${accent}55`, color: '#e6f0ff' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
