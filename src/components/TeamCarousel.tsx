import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { members } from '../data/team'
import { useSound } from '../hooks/useSound'
import MemberCard from './MemberCard'

/*
  Bottom team strip on the dashboard. Horizontally scrollable / swipeable carousel
  of member cards. Tapping a card expands it in place; arrow buttons nudge scroll.
*/
export default function TeamCarousel({ onOpenTeam }: { onOpenTeam: () => void }) {
  const { play } = useSound()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const scroll = (dir: 1 | -1) => {
    play('hover-soft')
    scrollRef.current?.scrollBy({ left: dir * 640, behavior: 'smooth' })
  }

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  return (
    <motion.section
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="glass relative z-20 border-t border-sv-cyan/20"
    >
      <div className="flex items-center justify-between px-8 py-3">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-sv-cyan" />
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.2em] text-white/85">
            Command Team
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTeam}
            className="touch-target glass holo-border rounded-2xl px-6 text-base font-semibold tracking-wide text-white/85"
          >
            View All Members
          </button>
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="touch-target glass flex items-center justify-center rounded-2xl"
          >
            <ChevronLeft className="h-8 w-8 text-white/80" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="touch-target glass flex items-center justify-center rounded-2xl"
          >
            <ChevronRight className="h-8 w-8 text-white/80" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x gap-5 overflow-x-auto px-8 pb-5"
        style={{ scrollbarWidth: 'thin' }}
      >
        {members.map((m) => (
          <div
            key={m.id}
            className={`shrink-0 snap-start transition-all ${
              expandedId === m.id ? 'w-72' : 'w-48'
            }`}
          >
            <MemberCard
              member={m}
              expanded={expandedId === m.id}
              onToggle={toggle}
              compact
            />
          </div>
        ))}
      </div>
    </motion.section>
  )
}
