import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Pause,
  Play,
  PlayCircle,
  X,
} from 'lucide-react'
import { securevisaModules, itsecModules, allModules } from '../data/modules'
import HolographicCore from './HolographicCore'
import OrbitalIcon from './OrbitalIcon'
import InfoPanel from './InfoPanel'
import TeamCarousel from './TeamCarousel'
import { useSound } from '../hooks/useSound'

/*
  Dashboard — the home command view.
  - Left rail:  SecureVisa modules
  - Right rail: ITSEC modules
  - Center:     holographic core + primary actions
  - Bottom:     team carousel
  Keyboard: ESC closes panel / exits presentation · Arrow keys move focus ·
  Enter selects the focused module.
*/

const PRESENTATION_MS = 6000 // 6s per section (spec: 5-8s)

interface DashboardProps {
  onExplore: () => void
  onOpenTeam: () => void
}

export default function Dashboard({ onExplore, onOpenTeam }: DashboardProps) {
  const { play } = useSound()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Keyboard focus model across the two rails.
  const columns = [securevisaModules, itsecModules]
  const [focus, setFocus] = useState<{ col: number; row: number }>({ col: 0, row: 0 })

  // Presentation mode
  const [presenting, setPresenting] = useState(false)
  const [presPaused, setPresPaused] = useState(false)
  const presIndexRef = useRef(0)

  const selectModule = useCallback(
    (id: string) => {
      setSelectedId(id)
    },
    [],
  )

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
    // selectedId in deps so each advance re-arms the timer
  }, [presenting, presPaused, selectedId, presStep])

  // ── Keyboard handling ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (presenting) stopPresentation()
        else if (selectedId) closePanel()
        play('panel-close')
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
      // Normal navigation
      setFocus((prev) => {
        let { col, row } = prev
        if (e.key === 'ArrowLeft') col = 0
        else if (e.key === 'ArrowRight') col = 1
        else if (e.key === 'ArrowUp') row = Math.max(0, row - 1)
        else if (e.key === 'ArrowDown') row = Math.min(columns[col].length - 1, row + 1)
        else return prev
        row = Math.min(row, columns[col].length - 1)
        play('hover-soft')
        return { col, row }
      })
      if (e.key === 'Enter') {
        const mod = columns[focus.col][focus.row]
        if (mod) {
          play('icon-select')
          selectModule(mod.id)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenting, selectedId, focus])

  const selectedModule = allModules.find((m) => m.id === selectedId) ?? null
  const panelSide = selectedModule?.org === 'itsec' ? 'right' : 'left'

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Main tri-column region */}
      <div className="relative grid flex-1 grid-cols-[1fr_1.4fr_1fr] gap-4 overflow-hidden px-6 py-4">
        {/* LEFT: SecureVisa */}
        <div
          className={`flex flex-col justify-center gap-2.5 overflow-y-auto py-2 pr-1 transition-opacity duration-500 ${
            selectedModule && panelSide === 'right' ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <RailHeading label="SecureVisa Modules" accent="#33d6ff" />
          {securevisaModules.map((m, i) => (
            <OrbitalIcon
              key={m.id}
              module={m}
              index={i}
              align="left"
              selected={selectedId === m.id}
              focused={!presenting && focus.col === 0 && focus.row === i}
              onSelect={selectModule}
            />
          ))}
        </div>

        {/* CENTER: core + actions OR panel */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Data-line connectors from core to active side */}
          <AnimatePresence>
            {selectedModule && (
              <ConnectorLines side={panelSide} />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!selectedModule ? (
              <motion.div
                key="core"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <HolographicCore onActivate={onExplore} />
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 flex flex-wrap items-center justify-center gap-4"
                >
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
                </motion.div>
                <p className="mt-6 max-w-md text-center text-lg text-white/45">
                  Tap a module to reveal its command brief · Use arrow keys and Enter to navigate
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="panel"
                className="h-[calc(100%-1rem)] w-full max-w-3xl"
              >
                <InfoPanel module={selectedModule} onClose={closePanel} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: ITSEC */}
        <div
          className={`flex flex-col justify-center gap-2.5 overflow-y-auto py-2 pl-1 transition-opacity duration-500 ${
            selectedModule && panelSide === 'left' ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <RailHeading label="ITSEC Modules" accent="#ff7a30" align="right" />
          {itsecModules.map((m, i) => (
            <OrbitalIcon
              key={m.id}
              module={m}
              index={i}
              align="right"
              selected={selectedId === m.id}
              focused={!presenting && focus.col === 1 && focus.row === i}
              onSelect={selectModule}
            />
          ))}
        </div>
      </div>

      {/* Bottom team carousel */}
      <TeamCarousel onOpenTeam={onOpenTeam} />

      {/* Presentation control bar */}
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

function RailHeading({
  label,
  accent,
  align = 'left',
}: {
  label: string
  accent: string
  align?: 'left' | 'right'
}) {
  return (
    <div className={`mb-1 px-2 ${align === 'right' ? 'text-right' : ''}`}>
      <h2
        className="font-display text-lg font-bold uppercase tracking-[0.2em] 2xl:text-xl"
        style={{ color: accent }}
      >
        {label}
      </h2>
      <div
        className="mt-1 h-[2px] w-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </div>
  )
}

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

/** Animated connector lines from the core to the active rail side. */
function ConnectorLines({ side }: { side: 'left' | 'right' }) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
    >
      {[30, 50, 70].map((y, i) => {
        const x2 = side === 'left' ? '-6%' : '106%'
        return (
          <motion.line
            key={i}
            x1="50%"
            y1="50%"
            x2={x2}
            y2={`${y}%`}
            stroke={side === 'left' ? '#33d6ff' : '#ff7a30'}
            strokeWidth="1.5"
            strokeDasharray="6 8"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -140 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            opacity={0.5}
          />
        )
      })}
    </motion.svg>
  )
}
