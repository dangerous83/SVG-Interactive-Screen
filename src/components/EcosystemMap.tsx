import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import {
  ScrollText,
  ShieldCheck,
  Boxes,
  Building2,
  Bug,
  FileCode2,
  Gavel,
  UserCog,
  Siren,
  type LucideIcon,
} from 'lucide-react'
import { useSound } from '../hooks/useSound'

/*
  Ecosystem Map: two connected pillars (SecureVisa + ITSEC) joined by an animated
  data bridge, with the unifying statement in the center.
*/
interface Pillar {
  label: string
  icon: LucideIcon
}

const svPillars: Pillar[] = [
  { label: 'Licensing', icon: ScrollText },
  { label: 'Compliance', icon: ShieldCheck },
  { label: 'Tokenization', icon: Boxes },
  { label: 'Corporate Structuring', icon: Building2 },
]

const itPillars: Pillar[] = [
  { label: 'VAPT', icon: Bug },
  { label: 'Smart Contract Audit', icon: FileCode2 },
  { label: 'Cybersecurity', icon: Gavel },
  { label: 'vCISO', icon: UserCog },
  { label: 'Incident Response', icon: Siren },
]

function PillarColumn({
  title,
  subtitle,
  items,
  accent,
  align,
}: {
  title: string
  subtitle: string
  items: Pillar[]
  accent: string
  align: 'left' | 'right'
}) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className={align === 'right' ? 'text-right' : 'text-left'}>
        <h2
          className="font-display text-3xl font-extrabold tracking-wide 2xl:text-4xl"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <p className="text-lg text-white/50">{subtitle}</p>
      </div>
      {items.map((p, i) => {
        const Icon = p.icon
        return (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, type: 'spring', stiffness: 120 }}
            className={`glass holo-border flex items-center gap-4 rounded-2xl p-4 ${
              align === 'right' ? 'flex-row-reverse text-right' : ''
            }`}
            style={{ boxShadow: `0 0 26px ${accent}22` }}
          >
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${accent}22`, border: `1px solid ${accent}55` }}
            >
              <Icon className="h-7 w-7" style={{ color: accent }} strokeWidth={1.6} />
            </span>
            <span className="font-display text-xl font-bold text-white 2xl:text-2xl">
              {p.label}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function EcosystemMap({ onBack }: { onBack: () => void }) {
  const { play } = useSound()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex h-full flex-col p-8"
    >
      <button
        onClick={() => {
          play('panel-close')
          onBack()
        }}
        aria-label="Back to dashboard"
        className="touch-target glass holo-border mb-6 flex w-fit items-center gap-3 rounded-2xl px-6 text-lg font-semibold text-white/85"
      >
        <ArrowLeft className="h-7 w-7" /> Dashboard
      </button>

      <div className="relative flex flex-1 items-center gap-8">
        <PillarColumn
          title="SecureVisa"
          subtitle="Regulatory & Compliance"
          items={svPillars}
          accent="#33d6ff"
          align="left"
        />

        {/* Center unifying node */}
        <div className="relative flex w-80 shrink-0 flex-col items-center justify-center">
          {/* Animated connecting bridge */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="bridge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#33d6ff" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ff7a30" />
              </linearGradient>
            </defs>
            <motion.line
              x1="0" y1="50%" x2="100%" y2="50%"
              stroke="url(#bridge)"
              strokeWidth="2"
              strokeDasharray="8 10"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -200 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </svg>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="glass-strong holo-border relative z-10 flex flex-col items-center rounded-3xl p-8 text-center shadow-glow-cyan"
          >
            <span className="font-display text-6xl font-thin text-white/40">×</span>
            <p className="mt-2 font-display text-2xl font-extrabold leading-snug text-white text-glow 2xl:text-3xl">
              From License Approval to Operational Resilience
            </p>
            <p className="mt-3 text-base uppercase tracking-[0.2em] text-white/50">
              One Unified Command Center
            </p>
          </motion.div>
        </div>

        <PillarColumn
          title="ITSEC"
          subtitle="Cybersecurity & Assurance"
          items={itPillars}
          accent="#ff7a30"
          align="right"
        />
      </div>
    </motion.div>
  )
}
