import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Pause,
  Play,
  PlayCircle,
  Users,
  X,
} from 'lucide-react'
import { securevisaModules, itsecModules, allModules } from '../data/modules'
import HolographicCore from './HolographicCore'
import OrbitalIcon from './OrbitalIcon'
import InfoPanel from './InfoPanel'
import { useSound } from '../hooks/useSound'

/*
  Dashboard — the home command view, built as an ORBITAL DASHBOARD:
  - Center:      holographic core
  - Left arc:    SecureVisa module icon-nodes (cyan)
  - Right arc:   ITSEC module icon-nodes (orange)
  - Bottom:      compact control cluster (Explore · Presentation · Command Team)
  Tapping a node opens its command brief as a cinematic centered overlay; the team
  lives on its own screen behind a single button (no crowded carousel here).
  Keyboard: ESC closes · Arrow keys move focus around the ring · Enter opens.
*/

const PRESENTATION_MS = 6000 // 6s per section (spec: 5-8s)

interface DashboardProps {
  onExplore: () => void
  onOpenTeam: () => void
}

/** Angular position (degrees, 0°=right, 90°=up) for each node on its arc. */
function arcAngles(count: number, from: number, to: number): number[] {
  if (count === 1) return [(from + to) / 2]
  const step = (to - from) / (count - 1)
  return Array.from({ length: count }, (_, i) => from + step * i)
}

// Left arc sweeps the left half; right arc sweeps the right half.
// The ITSEC arc has 7 nodes vs SecureVisa's 6, so it uses a wider angular sweep
// to keep the spacing (node density) visually consistent between the two sides.
const RX = 38 // horizontal radius (% of ring area)
const RY = 36 // vertical radius (% of ring area) — keeps bottom nodes clear of the controls

interface Placed {
  module: (typeof allModules)[number]
  index: number
  left: number
  top: number
}

export default function Dashboard({ onExplore, onOpenTeam }: DashboardProps) {
  const { play } = useSound()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusIndex, setFocusIndex] = useState<number>(-1)

  // Presentation mode
  const [presenting, setPresenting] = useState(false)
  const [presPaused, setPresPaused] = useState(false)
  const presIndexRef = useRef(0)

  // Pre-compute node placements on the two arcs.
  const placed = useMemo<Placed[]>(() => {
    const out: Placed[] = []
    const leftAngles = arcAngles(securevisaModules.length, 122, 238)
    securevisaModules.forEach((m, i) => {
      const a = (leftAngles[i] * Math.PI) / 180
      out.push({
        module: m,
        index: out.length,
        left: 50 + RX * Math.cos(a),
        top: 50 - RY * Math.sin(a),
      })
    })
    const rightAngles = arcAngles(itsecModules.length, 70, -70)
    itsecModules.forEach((m, i) => {
      const a = (rightAngles[i] * Math.PI) / 180
      out.push({
        module: m,
        index: out.length,
        left: 50 + RX * Math.cos(a),
        top: 50 - RY * Math.sin(a),
      })
    })
    return out
  }, [])

  const selectModule = useCallback((id: string) => setSelectedId(id), [])
  const closePanel = useCallback(() => setSelectedId(null), [])

  // ── Presentation controls ────────────────────────────────────────────────
  const startPresentation = useCallback(() => {
    play('transition-whoosh')
    presIndexRef.current = 0
    setPresenting(true)
    setPresPaused(false)
    setSelectedId(allModules[0].id)
  }, [play])

  const stopPresentation = useCallback(() => {
    setPresenting(false)
    setPresPaused(false)
    setSelectedId(null)
  }, [])

  const presStep = useCallback(
    (dir: 1 | -1) => {
      const n = allModules.length
      presIndexRef.current = (presIndexRef.current + dir + n) % n
      play('transition-whoosh')
      setSelectedId(allModules[presIndexRef.current].id)
    },
    [play],
  )

  // Auto-advance timer for presentation
  useEffect(() => {
    if (!presenting || presPaused) return
    const t = setTimeout(() => presStep(1), PRESENTATION_MS)
    return () => clearTimeout(t)
  }, [presenting, presPaused, selectedId, presStep])

  // ── Keyboard handling ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (presenting) stopPresentation()
        else if (selectedId) {
          play('panel-close')
          closePanel()
        }
        return
      }
      if (presenting) {
        if (e.key === 'ArrowRight') presStep(1)
        if (e.key === 'ArrowLeft') presStep(-1)
        if (e.key === ' ') {
          e.preventDefault()
          setPresPaused((p) => !p)
        }
        return
      }
      const n = allModules.length
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setFocusIndex((i) => (i < 0 ? 0 : (i + 1) % n))
        play('hover-soft')
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setFocusIndex((i) => (i < 0 ? 0 : (i - 1 + n) % n))
        play('hover-soft')
      } else if (e.key === 'Enter' && focusIndex >= 0) {
        play('icon-select')
        selectModule(allModules[focusIndex].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenting, selectedId, focusIndex])

  const selectedModule = allModules.find((m) => m.id === selectedId) ?? null
  const selectedPlaced = placed.find((p) => p.module.id === selectedId) ?? null
  const accent = selectedModule?.org === 'itsec' ? '#ff7a30' : '#33d6ff'

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* ── Orbital ring region ───────────────────────────────────────────── */}
      <div className="relative flex-1">
        {/* Faint org labels to orient the two arcs */}
        <span className="pointer-events-none absolute left-8 top-6 font-display text-base font-bold uppercase tracking-[0.35em] text-sv-cyan/70 2xl:text-lg">
          SecureVisa
        </span>
        <span className="pointer-events-none absolute right-8 top-6 font-display text-base font-bold uppercase tracking-[0.35em] text-sv-orange/70 2xl:text-lg">
          ITSEC
        </span>

        {/* Decorative orbit rings behind the nodes */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="aspect-square h-[86%] animate-spin-slow rounded-full border border-sv-cyan/10" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="aspect-square h-[70%] animate-spin-reverse rounded-full border border-dashed border-white/5"
            style={{ animationDuration: '60s' }}
          />
        </div>

        {/* Central core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <HolographicCore active={Boolean(selectedModule)} onActivate={onExplore} />
        </div>

        {/* Module nodes on the ring */}
        {placed.map((p) => (
          <OrbitalIcon
            key={p.module.id}
            module={p.module}
            index={p.index}
            selected={selectedId === p.module.id}
            focused={!presenting && focusIndex === p.index}
            dimmed={Boolean(selectedModule) && selectedId !== p.module.id}
            onSelect={selectModule}
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
          />
        ))}
      </div>

      {/* ── Bottom control cluster ────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-center gap-5 pb-6 pt-2">
        <ActionButton
          icon={<Compass className="h-7 w-7" />}
          label="Explore Ecosystem"
          onClick={() => {
            play('transition-whoosh')
            onExplore()
          }}
          primary
        />
        <ActionButton
          icon={<PlayCircle className="h-7 w-7" />}
          label="Presentation Mode"
          onClick={startPresentation}
        />
        <ActionButton
          icon={<Users className="h-7 w-7" />}
          label="Command Team"
          onClick={() => {
            play('icon-select')
            onOpenTeam()
          }}
        />
      </div>

      {/* ── Cinematic panel overlay ───────────────────────────────────────── */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-void/70 px-6 backdrop-blur-md"
            onClick={() => {
              if (!presenting) {
                play('panel-close')
                closePanel()
              }
            }}
          >
            {/* Data line from core → selected node */}
            {selectedPlaced && (
              <ConnectorLine
                left={selectedPlaced.left}
                top={selectedPlaced.top}
                accent={accent}
              />
            )}

            <div
              className="relative h-[80%] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <InfoPanel module={selectedModule} onClose={closePanel} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Presentation control bar ──────────────────────────────────────── */}
      <AnimatePresence>
        {presenting && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="glass-strong holo-border fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-3xl px-6 py-4 shadow-glow-cyan"
          >
            <span className="mr-2 font-mono text-sm uppercase tracking-[0.2em] text-sv-cyan">
              Presentation · {presIndexRef.current + 1}/{allModules.length}
            </span>
            <CtrlButton onClick={() => presStep(-1)} aria-label="Previous">
              <ChevronLeft className="h-7 w-7" />
            </CtrlButton>
            <CtrlButton
              onClick={() => setPresPaused((p) => !p)}
              aria-label={presPaused ? 'Resume' : 'Pause'}
            >
              {presPaused ? <Play className="h-7 w-7" /> : <Pause className="h-7 w-7" />}
            </CtrlButton>
            <CtrlButton onClick={() => presStep(1)} aria-label="Next">
              <ChevronRight className="h-7 w-7" />
            </CtrlButton>
            <CtrlButton onClick={stopPresentation} aria-label="Exit presentation">
              <X className="h-7 w-7" />
            </CtrlButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Small presentational helpers ─────────────────────────────────────────── */

function ActionButton({
  icon,
  label,
  onClick,
  primary = false,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  primary?: boolean
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`touch-target holo-border flex items-center gap-3 rounded-2xl px-8 text-xl font-bold tracking-wide ${
        primary
          ? 'bg-gradient-to-r from-itsec-blue to-sv-cyan text-void shadow-glow-cyan'
          : 'glass text-white/85'
      }`}
    >
      {icon}
      {label}
    </motion.button>
  )
}

function CtrlButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="touch-target glass flex items-center justify-center rounded-2xl text-white/85"
      {...(rest as any)}
    >
      {children}
    </motion.button>
  )
}

/** Animated data line from the core (screen center) to the selected node. */
function ConnectorLine({
  left,
  top,
  accent,
}: {
  left: number
  top: number
  accent: string
}) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <motion.line
        x1="50%"
        y1="50%"
        x2={`${left}%`}
        y2={`${top}%`}
        stroke={accent}
        strokeWidth="1.5"
        strokeDasharray="5 9"
        initial={{ strokeDashoffset: 0, opacity: 0 }}
        animate={{ strokeDashoffset: -140, opacity: 0.5 }}
        transition={{
          strokeDashoffset: { duration: 2.5, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 0.4 },
        }}
      />
    </svg>
  )
}
