import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CyberBackground from './components/CyberBackground'
import BootScreen from './components/BootScreen'
import StatusBar from './components/StatusBar'
import Dashboard from './components/Dashboard'
import EcosystemMap from './components/EcosystemMap'
import TeamCommand from './components/TeamCommand'
import { useSound } from './hooks/useSound'

type Screen = 'boot' | 'dashboard' | 'ecosystem' | 'team'

export default function App() {
  const { play, unlock } = useSound()
  const [screen, setScreen] = useState<Screen>('boot')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Unlock the Web Audio context on the first user gesture (browser requirement).
  useEffect(() => {
    const onFirst = () => {
      unlock()
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
          <StatusBar isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />

          <main className="relative z-10 flex-1 overflow-hidden">
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
        </>
      )}
    </div>
  )
}
