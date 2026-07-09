import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, X } from 'lucide-react'
import type { CommandModule } from '../data/modules'
import { useSound } from '../hooks/useSound'

/*
  Cinematic module panel. On open it runs a ~0.4s "loading scan" before revealing
  the content. Close via the X button, ESC (handled by parent), or tapping another
  module (parent swaps `module`).
*/
interface InfoPanelProps {
  module: CommandModule | null
  onClose: () => void
}

export default function InfoPanel({ module, onClose }: InfoPanelProps) {
  const { play } = useSound()
  const [scanning, setScanning] = useState(true)

  // Re-run the loading scan whenever the selected module changes.
  useEffect(() => {
    if (!module) return
    setScanning(true)
    play('panel-open')
    const t = setTimeout(() => setScanning(false), 400)
    return () => clearTimeout(t)
  }, [module, play])

  const accent = module?.org === 'securevisa' ? '#33d6ff' : '#ff7a30'
  const Icon = module?.icon

  return (
    <AnimatePresence>
      {module && (
        <motion.aside
          key={module.id}
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
          transition={{ type: 'spring', stiffness: 140, damping: 20 }}
          className="glass-strong holo-border pointer-events-auto relative flex h-full w-full flex-col overflow-hidden rounded-3xl"
          style={{ boxShadow: `0 0 60px ${accent}44` }}
          role="dialog"
          aria-label={`${module.title} details`}
        >
          {/* Loading scan overlay */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-void/70"
              >
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '100%' }}
                  transition={{ duration: 0.4, ease: 'linear' }}
                  className="absolute inset-x-0 h-1/3"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${accent}44, transparent)`,
                  }}
                />
                <span
                  className="font-mono text-lg tracking-[0.3em]"
                  style={{ color: accent }}
                >
                  DECRYPTING MODULE…
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 p-8 pb-6">
            <div className="flex items-center gap-5">
              {Icon && (
                <span
                  className="flex h-20 w-20 items-center justify-center rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${accent}30, transparent 70%)`,
                    border: `1px solid ${accent}66`,
                  }}
                >
                  <Icon className="h-10 w-10" style={{ color: accent }} strokeWidth={1.5} />
                </span>
              )}
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-[0.25em]"
                  style={{ color: accent }}
                >
                  {module.org === 'securevisa' ? 'SecureVisa' : 'ITSEC'} · {module.tag}
                </p>
                <h2 className="font-display text-3xl font-extrabold leading-tight text-white text-glow 2xl:text-4xl">
                  {module.title}
                </h2>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                play('panel-close')
                onClose()
              }}
              aria-label="Close panel"
              className="touch-target glass flex items-center justify-center rounded-2xl"
            >
              <X className="h-8 w-8 text-white/80" />
            </motion.button>
          </div>

          {/* Body (revealed after scan) */}
          <motion.div
            initial={false}
            animate={{ opacity: scanning ? 0 : 1, y: scanning ? 16 : 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 overflow-y-auto p-8 pt-6"
          >
            <p className="max-w-3xl text-xl leading-relaxed text-white/80 2xl:text-2xl">
              {module.description}
            </p>

            {/* Key points */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {module.keyPoints.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: scanning ? 0 : 1, x: 0 }}
                  transition={{ delay: scanning ? 0 : 0.05 * i }}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${accent}22` }}
                  >
                    <Check className="h-5 w-5" style={{ color: accent }} />
                  </span>
                  <span className="text-lg font-medium text-white/85">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA footer — only when the section defines a CTA (info-only sections omit it) */}
          {module.cta && (
            <div className="border-t border-white/10 p-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => play('success-confirm')}
                className="touch-target flex w-full items-center justify-center gap-3 rounded-2xl px-8 text-xl font-bold tracking-wide text-void"
                style={{
                  background: `linear-gradient(120deg, ${accent}, ${
                    module.org === 'securevisa' ? '#0075c9' : '#d2451e'
                  })`,
                  boxShadow: `0 0 40px ${accent}66`,
                }}
              >
                {module.cta}
                <ArrowRight className="h-6 w-6" />
              </motion.button>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
