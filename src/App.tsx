import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ZoomIn } from 'lucide-react'
import CyberBackground from './components/CyberBackground'
import BootScreen from './components/BootScreen'
import Dashboard from './components/Dashboard'
import EcosystemMap from './components/EcosystemMap'
import TeamCommand from './components/TeamCommand'
import { THEMES } from './components/CommandDock'
import { useSound } from './hooks/useSound'

type Screen = 'boot' | 'dashboard' | 'ecosystem' | 'team'

export default function App() {
  const { play, unlock } = useSound()
  const [screen, setScreen] = useState<Screen>('boot')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [themeIndex, setThemeIndex] = useState(0)
  const theme = THEMES[themeIndex].id

  // Accessibility zoom — scales the whole rem-based UI consistently.
  const ZOOM_LEVELS = [1, 1.15, 1.3, 1.45]
  const [zoomIndex, setZoomIndex] = useState(0)

  // Apply the selected theme (backdrop mood) to the document root.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Apply the zoom multiplier to the document root.
  useEffect(() => {
    document.documentElement.style.setProperty('--zoom', String(ZOOM_LEVELS[zoomIndex]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomIndex])

  const cycleTheme = useCallback(() => {
    play('icon-select')
    setThemeIndex((i) => (i + 1) % THEMES.length)
  }, [play])

  const zoomIn = useCallback(() => {
    play('hover-soft')
    setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play])
  const zoomOut = useCallback(() => {
    play('hover-soft')
    setZoomIndex((i) => Math.max(0, i - 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play])

  // On the FIRST user gesture: unlock audio AND enter fullscreen (kiosk mode —
  // hides the browser tab/URL bar). Browsers only allow fullscreen from a user
  // gesture, so this fires on the first tap/click/keypress rather than on load.
  useEffect(() => {
    const onFirst = () => {
      unlock()
      const el = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>
      }
      if (!document.fullscreenElement) {
        const req = el.requestFullscreen?.bind(el) ?? el.webkitRequestFullscreen?.bind(el)
        try {
          void req?.()
        } catch {
          /* fullscreen may be blocked (e.g. inside an iframe) — F11 still works */
        }
      }
      window.removeEventListener('pointerdown', onFirst)
      window.removeEventListener('keydown', onFirst)
    }
    window.addEventListener('pointerdown', onFirst)
    window.addEventListener('keydown', onFirst)
    return () => {
      window.removeEventListener('pointerdown', onFirst)
      window.removeEventListener('keydown', onFirst)
    }
  }, [unlock])

  // Track fullscreen changes (e.g. user pressing F11 / Esc).
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    play('icon-select')
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // Fullscreen may be blocked; the UI still scales for kiosk use (F11 fallback).
    }
  }, [play])

  const goto = useCallback(
    (next: Screen) => {
      play('transition-whoosh')
      setScreen(next)
    },
    [play],
  )

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <CyberBackground dim={false} />

      <AnimatePresence mode="wait">
        {screen === 'boot' && (
          <BootScreen key="boot" onComplete={() => setScreen('dashboard')} />
        )}
      </AnimatePresence>

      {screen !== 'boot' && (
        <>
          <main className="relative z-10 h-full flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {screen === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <Dashboard
                    onExplore={() => goto('ecosystem')}
                    onOpenTeam={() => goto('team')}
                    theme={theme}
                    onCycleTheme={cycleTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                  />
                </motion.div>
              )}

              {screen === 'ecosystem' && (
                <EcosystemMap key="ecosystem" onBack={() => goto('dashboard')} />
              )}

              {screen === 'team' && (
                <TeamCommand key="team" onBack={() => goto('dashboard')} />
              )}
            </AnimatePresence>
          </main>

          {/* Accessibility zoom control */}
          <ZoomControl
            percent={Math.round(ZOOM_LEVELS[zoomIndex] * 100)}
            canOut={zoomIndex > 0}
            canIn={zoomIndex < ZOOM_LEVELS.length - 1}
            onIn={zoomIn}
            onOut={zoomOut}
          />
        </>
      )}
    </div>
  )
}

/** On-screen A−/A+ zoom control (accessibility — scales the whole UI). */
function ZoomControl({
  percent,
  canOut,
  canIn,
  onIn,
  onOut,
}: {
  percent: number
  canOut: boolean
  canIn: boolean
  onIn: () => void
  onOut: () => void
}) {
  return (
    <div className="glass-strong holo-border fixed bottom-6 left-6 z-50 flex items-center gap-1 rounded-2xl px-2 py-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onOut}
        disabled={!canOut}
        aria-label="Zoom out"
        className="flex h-14 w-14 items-center justify-center rounded-xl text-white/85 disabled:opacity-30"
      >
        <Minus className="h-6 w-6" />
      </motion.button>
      <div className="flex min-w-[74px] flex-col items-center px-1">
        <ZoomIn className="h-4 w-4 text-sv-cyan" />
        <span className="font-mono text-sm font-semibold tabular-nums text-white/85">{percent}%</span>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onIn}
        disabled={!canIn}
        aria-label="Zoom in"
        className="flex h-14 w-14 items-center justify-center rounded-xl text-white/85 disabled:opacity-30"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  )
}
