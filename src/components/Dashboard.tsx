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
  Dashboard — the home command view, built as an ORBITAL DASHBOARD.

  Clean start: only the holographic core is shown over the UAE flag backdrop.
  Tapping the CORE reveals the module icon-nodes, each linked to the core by an
  animated data line + node:
    - Left arc:  SecureVisa module nodes (cyan)
    - Right arc: ITSEC module nodes (orange)
  Tapping a node opens its command brief as a cinematic centered overlay; the team
  lives on its own screen behind a single button.
  Keyboard: ESC collapses/closes · Arrows move focus around the ring · Enter opens.
*/

const PRESENTATION_MS = 6000 // 6s per section (spec: 5-8s)

// Background video (UAE flag) — placed in /public/assets/video/uae-flag.mp4.
// Replace that file (same name) to change the backdrop.
const BG_VIDEO = './assets/video/uae-flag.mp4'

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
  const [revealed, setRevealed] = useState(false) // modules hidden until the core is tapped

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

  // Tapping the core toggles the module ring open/closed.
  const toggleReveal = useCallback(() => {
    setRevealed((r) => {
      const next = !r
      play(next ? 'panel-open' : 'panel-close')
      if (!next) {
        setSelectedId(null)
        setFocusIndex(-1)
      }
      return next
    })
  }, [play])

  // ── Presentation controls ────────────────────────────────────────────────
  const startPresentation = useCallback(() => {
    play('transition-whoosh')
    presIndexRef.current = 0
    setRevealed(true)
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
        } else if (revealed) {
          toggleReveal()
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
      // Before the ring is open, Enter / arrows open it.
      if (!revealed) {
        if (e.key === 'Enter' || e.key.startsWith('Arrow')) {
          toggleReveal()
          setFocusIndex(0)
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
  }, [presenting, selectedId, focusIndex, revealed])

  const selectedModule = allModules.find((m) => m.id === selectedId) ?? null
  const selectedPlaced = placed.find((p) => p.module.id === selectedId) ?? null
  const accent = selectedModule?.org === 'itsec' ? '#ff7a30' : '#33d6ff'

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* ── UAE flag video backdrop ───────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          className="h-full w-full object-cover"
          src={BG_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          // Dark fallback so a browser without H.264 shows navy, not black.
          style={{ backgroundColor: '#03060f' }}
        />
        {/* Legibility overlay — flag reads prominently on the clean start,
            then dims once the module ring is open so nodes/panel stay readable. */}
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: revealed ? 'rgba(3,6,15,0.82)' : 'rgba(3,6,15,0.42)' }}
          transition={{ duration: 0.7 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void/75" />
      </div>

      {/* ── Orbital ring region ───────────────────────────────────────────── */}
      <div className="relative z-10 flex-1">
        {/* Org labels appear with the ring */}
        <AnimatePresence>
          {revealed && (
            <>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="pointer-events-none absolute left-8 top-6 font-display text-base font-bold uppercase tracking-[0.35em] text-sv-cyan/70 2xl:text-lg"
              >
                SecureVisa
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="pointer-events-none absolute right-8 top-6 font-display text-base font-bold uppercase tracking-[0.35em] text-sv-orange/70 2xl:text-lg"
              >
                ITSEC
              </motion.span>
            </>
          )}
        </AnimatePresence>

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

        {/* Connector lines from the core to each node (only when revealed) */}
        <AnimatePresence>
          {revealed && <ConnectorWeb placed={placed} activeId={selectedId} focusIndex={focusIndex} />}
        </AnimatePresence>

        {/* Central core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <HolographicCore active={revealed || Boolean(selectedModule)} onActivate={toggleReveal} />
        </div>

        {/* "Tap core" hint before the ring opens */}
        <AnimatePresence>
          {!revealed && (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="pointer-events-none absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-2 text-center"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="font-display text-xl font-bold uppercase tracking-[0.3em] text-sv-cyan 2xl:text-2xl"
              >
                Tap the Core to open modules
              </motion.span>
              <span className="font-mono text-sm uppercase tracking-[0.25em] text-white/40">
                SecureVisa × ITSEC · Regulatory Cyber Command Center
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Module nodes on the ring */}
        <AnimatePresence>
          {revealed &&
            placed.map((p) => (
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
        </AnimatePresence>
      </div>

      {/* ── Bottom control cluster ────────────────────────────────────────── */}
      <div className="relative z-20 flex items-center justify-center gap-5 pb-6 pt-2">
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

/**
 * Data lines fanning out from the core to every node, each with a pulsing node
 * dot at its midpoint. The line to the active/focused node brightens.
 */
function ConnectorWeb({
  placed,
  activeId,
  focusIndex,
}: {
  placed: Placed[]
  activeId: string | null
  focusIndex: number
}) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      preserveAspectRatio="none"
    >
      {placed.map((p, i) => {
        const acc = p.module.org === 'securevisa' ? '#33d6ff' : '#ff7a30'
        const hot = activeId === p.module.id || focusIndex === i
        const mx = (50 + p.left) / 2
        const my = (50 + p.top) / 2
        return (
          <g key={p.module.id}>
            <motion.line
              x1="50%"
              y1="50%"
              x2={`${p.left}%`}
              y2={`${p.top}%`}
              stroke={acc}
              strokeWidth={hot ? 2 : 1}
              strokeDasharray="3 7"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: hot ? 0.75 : 0.28 }}
              transition={{ duration: 0.6, delay: 0.04 * i }}
            />
            <motion.circle
              cx={`${mx}%`}
              cy={`${my}%`}
              r={hot ? 4 : 2.5}
              fill={acc}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, hot ? 1 : 0.7, 0.3] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>
        )
      })}
    </motion.svg>
  )
}

/** Bright animated data line from the core to the selected node (under the panel). */
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
