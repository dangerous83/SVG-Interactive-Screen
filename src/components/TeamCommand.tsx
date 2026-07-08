import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import {
  members,
  teamFilters,
  filterLabel,
  type Member,
  type MemberCategory,
  type Org,
} from '../data/team'
import { useSound } from '../hooks/useSound'
import MemberCard from './MemberCard'

/*
  Full-screen Team Command view. Large member grid with touch-friendly filter chips:
  All / SecureVisa / ITSEC / Leadership / Compliance / Cybersecurity / Marketing / Operations.
*/
type Filter = 'All' | Org | MemberCategory

function matches(member: Member, filter: Filter): boolean {
  if (filter === 'All') return true
  if (filter === 'securevisa' || filter === 'itsec') return member.org === filter
  return member.categories.includes(filter)
}

export default function TeamCommand({ onBack }: { onBack: () => void }) {
  const { play } = useSound()
  const [filter, setFilter] = useState<Filter>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(
    () => members.filter((m) => matches(m, filter)),
    [filter],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col p-8"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              play('panel-close')
              onBack()
            }}
            aria-label="Back to dashboard"
            className="touch-target glass holo-border flex items-center gap-3 rounded-2xl px-6 text-lg font-semibold text-white/85"
          >
            <ArrowLeft className="h-7 w-7" /> Dashboard
          </button>
          <div>
            <h1 className="font-display text-4xl font-extrabold text-white text-glow 2xl:text-5xl">
              Team Command
            </h1>
            <p className="text-lg text-white/50">
              {filtered.length} members · SecureVisa × ITSEC
            </p>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap gap-3">
        {teamFilters.map((f) => {
          const active = filter === f
          return (
            <button
              key={f}
              onClick={() => {
                play('hover-soft')
                setFilter(f as Filter)
              }}
              className={`min-h-[56px] rounded-2xl px-6 text-lg font-semibold tracking-wide transition-all ${
                active
                  ? 'bg-gradient-to-r from-itsec-blue to-sv-cyan text-void shadow-glow-cyan'
                  : 'glass text-white/70'
              }`}
            >
              {filterLabel[f]}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-2">
        <motion.div
          layout
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
        >
          <AnimatePresence>
            {filtered.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={expandedId === m.id ? 'sm:col-span-2 sm:row-span-2' : ''}
              >
                <MemberCard
                  member={m}
                  expanded={expandedId === m.id}
                  onToggle={(id) =>
                    setExpandedId((prev) => (prev === id ? null : id))
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
