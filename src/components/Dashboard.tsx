import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { securevisaModules, itsecModules, allModules } from '../data/modules'
import HolographicCore from './HolographicCore'
import OrbitalIcon from './OrbitalIcon'
import InfoPanel from './InfoPanel'
import CommandDock, { type ThemeName } from './CommandDock'
import CyberScene from './CyberScene'
import { useSound } from '../hooks/useSound'

/*
  Dashboard — the home command view, built as an ORBITAL DASHBOARD.

  Clean start: only the holographic core is shown over the UAE-flag video.
  Tapping the CORE triggers a high-tech reveal of the module icon-nodes (each
  linked to the core by an animated data line + node) and raises the command
  dock. This screen is an information display for SecureVisa × ITSEC — there is
  no auto "presentation"; the operator drives it by touch.
    - Left arc:  SecureVisa module nodes (cyan)
    - Right arc: ITSEC module nodes (orange)
  Keyboard: ESC collapses/closes · Arrows move focus around the ring · Enter opens.
*/

// Background video (the uploaded clip). Replace
// /public/assets/video/background-interactive.mp4 to change it. If a browser
// can't decode it, the animated cyber scene shows instead.
const BG_VIDEO = './assets/video/background-interactive.mp4'

interface DashboardProps {
  onExplore: () => void
  onOpenTeam: () => void
  theme: ThemeName
  onCycleTheme: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

/** Angular position (degrees, 0°=right, 90°=up) for each node on its arc. */
function arcAngles(count: number, from: number, to: number): number[] {
  if (count === 1) return [(from + to) / 2]
  const step = (to - from) / (count - 1)
  return Array.from({ length: count }, (_, i) => from + step * i)
}

// Both arcs are vertically symmetric (mirrored top/bottom) for a balanced,
// professional ring: SecureVisa on the left, ITSEC on the right.
const RX = 38 // horizontal radius (% of ring area)
const RY = 35 // vertical radius (% of ring area)

interface Placed {
  module: (typeof allModules)[number]
  index: number
  left: number
  top: number
}

export default function Dashboard({
  onExplore,
  onOpenTeam,
  theme,
  onCycleTheme,
  isFullscreen,
  onToggleFullscreen,
}: DashboardProps) {
  const { play } = useSound()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusIndex, setFocusIndex] = useState<number>(-1)
  const [revealed, setRevealed] = useState(false) // modules hidden until the core is tapped
  const [bgOn, setBgOn] = useState(true) // background on/off
  const [videoOk, setVideoOk] = useState(true) // false once the video errors (use cyber fallback)

  // Pre-compute node placements on the two arcs.
  const placed = useMemo<Placed[]>(() => {
    const out: Placed[] = []
    const leftAngles = arcAngles(securevisaModules.length, 105, 255)
    securevisaModules.forEach((m, i) => {
      const a = (leftAngles[i] * Math.PI) / 180
      out.push({ module: m, index: out.length, left: 50 + RX * Math.cos(a), top: 50 - RY * Math.sin(a) })
    })
    const rightAngles = arcAngles(itsecModules.length, 75, -75)
    itsecModules.forEach((m, i) => {
      const a = (rightAngles[i] * Math.PI) / 180
      out.push({ module: m, index: out.length, left: 50 + RX * Math.cos(a), top: 50 - RY * Math.sin(a) })
    })
    return out
  }, [])

  // Most nodes open a command brief; a few navigate to their own screen.
  const selectModule = useCallback(
    (id: string) => {
      const m = allModules.find((x) => x.id === id)
      if (m?.route === 'team') {
        play('transition-whoosh')
        onOpenTeam()
        return
      }
      if (m?.route === 'ecosystem') {
        play('transition-whoosh')
        onExplore()
        return
      }
      setSelectedId(id)
    },
    [onOpenTeam, onExplore, play],
  )
  const closePanel = useCallback(() => setSelectedId(null), [])

  // Tapping the core toggles the module ring open/closed with a strong effect.
  const toggleReveal = useCallback(() => {
    setRevealed((r) => {
      const next = !r
      if (next) play('reveal')
      else {
        play('panel-close')
        setSelectedId(null)
        setFocusIndex(-1)
      }
      return next
    })
  }, [play])

  const goHome = useCallback(() => {
    setSelectedId(null)
    setFocusIndex(-1)
    setRevealed(false)
  }, [])

  // ── Keyboard handling ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedId) {
          play('panel-close')
          closePanel()
        } else if (revealed) {
          toggleReveal()
        }
        return
      }
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
  }, [selectedId, focusIndex, revealed])

  const selectedModule = allModules.find((m) => m.id === selectedId) ?? null
  const selectedPlaced = placed.find((p) => p.module.id === selectedId) ?? null
  const accent = selectedModule?.org === 'itsec' ? '#ff7a30' : '#33d6ff'

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* ── Background: uploaded video, with the animated cyber scene as fallback ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {bgOn &&
          (videoOk ? (
            <video
              className="h-full w-full object-cover"
              src={BG_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              onError={() => setVideoOk(false)}
              style={{ backgroundColor: '#03060f' }}
            />
          ) : (
            <CyberScene />
          ))}
        {/* Legibility overlay — a bit stronger once the ring opens so icons stay crisp */}
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: revealed ? 'rgba(3,6,15,0.6)' : 'rgba(3,6,15,0.3)' }}
          transition={{ duration: 0.7 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/70" />
      </div>

      {/* ── Orbital ring region ───────────────────────────────────────────── */}
      <div className="relative z-10 flex-1">
        {/* Decorative orbit rings behind the nodes (static) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="aspect-square h-[86%] rounded-full border border-sv-cyan/10" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="aspect-square h-[70%] rounded-full border border-dashed border-white/5" />
        </div>

        {/* High-tech reveal pulse (one-shot each time the ring opens) */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              key="pulse"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
            >
              <motion.span
                className="aspect-square rounded-full border-2 border-sv-cyan/60"
                initial={{ width: '18%', opacity: 0.7 }}
                animate={{ width: '95%', opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
              className="pointer-events-none absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-2 text-center"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="font-display text-xl font-bold uppercase tracking-[0.3em] text-sv-cyan 2xl:text-2xl"
              >
                Tap the Core to open modules
              </motion.span>
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
                focused={focusIndex === p.index}
                dimmed={Boolean(selectedModule) && selectedId !== p.module.id}
                onSelect={selectModule}
                style={{ left: `${p.left}%`, top: `${p.top}%` }}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* ── Command dock (raised with the ring) ───────────────────────────── */}
      <div className="relative z-20 flex items-center justify-center pb-6 pt-2">
        <AnimatePresence>
          {revealed && (
            <CommandDock
              key="dock"
              onHome={goHome}
              theme={theme}
              onCycleTheme={onCycleTheme}
              modules={allModules}
              onSelectModule={selectModule}
              onOpenTeam={onOpenTeam}
              onOpenEcosystem={onExplore}
              bgVideoOn={bgOn}
              onToggleBgVideo={() => setBgOn((v) => !v)}
              isFullscreen={isFullscreen}
              onToggleFullscreen={onToggleFullscreen}
            />
          )}
        </AnimatePresence>
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
              play('panel-close')
              closePanel()
            }}
          >
            {selectedPlaced && (
              <ConnectorLine left={selectedPlaced.left} top={selectedPlaced.top} accent={accent} />
            )}
            <div className="relative h-[80%] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <InfoPanel module={selectedModule} onClose={closePanel} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Connector graphics ───────────────────────────────────────────────────── */

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
function ConnectorLine({ left, top, accent }: { left: number; top: number; accent: string }) {
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
