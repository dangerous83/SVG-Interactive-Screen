import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Maximize2, Minimize2, ShieldCheck, Radio } from 'lucide-react'
import BrandLogo from './BrandLogo'
import SoundManager from './SoundManager'

interface StatusBarProps {
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

function LiveDot({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-3 w-3">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ background: color }}
        />
        <span
          className="relative inline-flex h-3 w-3 rounded-full"
          style={{ background: color }}
        />
      </span>
      <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.15em] text-white/70 2xl:text-base">
        {label}
      </span>
    </div>
  )
}

export default function StatusBar({ isFullscreen, onToggleFullscreen }: StatusBarProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const date = now.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass relative z-30 flex items-center justify-between gap-6 border-b border-sv-cyan/20 px-8 py-4"
    >
      {/* Left: brand lockup */}
      <div className="flex shrink-0 items-center gap-4 2xl:gap-6">
        <BrandLogo
          src="./assets/logos/securevisa-white.png"
          alt="SecureVisa"
          fallback="SECUREVISA"
          className="h-8 w-auto object-contain 2xl:h-11"
        />
        <span className="text-2xl font-thin text-sv-cyan/50">×</span>
        <BrandLogo
          src="./assets/logos/itsec-horizontal.png"
          alt="ITSEC"
          fallback="ITSEC"
          className="h-6 w-auto object-contain 2xl:h-9"
        />
      </div>

      {/* Center: live status indicators */}
      <div className="hidden items-center gap-5 xl:flex 2xl:gap-8">
        <LiveDot label="System Online" color="#33d6ff" />
        <LiveDot label="Compliance Layer Active" color="#0075c9" />
        <LiveDot label="Cyber Defense Active" color="#ff7a30" />
      </div>

      {/* Right: clock + controls */}
      <div className="flex shrink-0 items-center gap-4 2xl:gap-5">
        <div className="hidden text-right md:block">
          <div className="font-mono text-xl font-semibold tabular-nums text-white 2xl:text-3xl">
            {time}
          </div>
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-white/50 2xl:text-sm">
            {date}
          </div>
        </div>

        <div className="hidden h-10 w-px bg-sv-cyan/20 sm:block" />

        {/* Quick telemetry chips (shown on very wide / 4K displays) */}
        <div className="hidden items-center gap-2 min-[2000px]:flex">
          <span className="flex items-center gap-1.5 rounded-lg bg-sv-cyan/10 px-3 py-2 text-sm font-medium text-sv-cyan">
            <Activity className="h-4 w-4" /> 100%
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-itsec-blue/15 px-3 py-2 text-sm font-medium text-itsec-blue">
            <ShieldCheck className="h-4 w-4" /> Secure
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-itsec-orange/15 px-3 py-2 text-sm font-medium text-sv-orange">
            <Radio className="h-4 w-4" /> Live
          </span>
        </div>

        <SoundManager />

        <motion.button
          onClick={onToggleFullscreen}
          whileTap={{ scale: 0.92 }}
          aria-label={isFullscreen ? 'Exit presentation mode' : 'Enter fullscreen'}
          className="touch-target holo-border glass flex items-center justify-center rounded-2xl px-5"
        >
          {isFullscreen ? (
            <Minimize2 className="h-8 w-8 text-white/80" />
          ) : (
            <Maximize2 className="h-8 w-8 text-white/80" />
          )}
        </motion.button>
      </div>
    </motion.header>
  )
}
