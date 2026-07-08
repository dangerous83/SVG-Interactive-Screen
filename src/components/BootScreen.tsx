import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import BrandLogo from './BrandLogo'
import { useSound } from '../hooks/useSound'

/*
  Boot / initialization sequence. Reveals the SecureVisa × ITSEC lockup and steps
  through the layer-online checklist, then hands off to the dashboard.
*/
const STEPS = [
  'Licensing Layer Online',
  'Compliance Layer Online',
  'Cyber Defense Layer Online',
  'Team Intelligence Loaded',
]

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const { play } = useSound()
  const [step, setStep] = useState(-1)

  useEffect(() => {
    play('boot-start')
    const timers: number[] = []
    // Reveal each step ~650ms apart after an initial logo beat.
    STEPS.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setStep(i)
          play('hover-soft')
        }, 900 + i * 650),
      )
    })
    // Finish shortly after the last step.
    timers.push(
      window.setTimeout(() => {
        play('transition-whoosh')
        onComplete()
      }, 900 + STEPS.length * 650 + 700),
    )
    return () => timers.forEach(clearTimeout)
  }, [onComplete, play])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
    >
      {/* Expanding energy ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        className="absolute h-64 w-64 rounded-full border border-sv-cyan/40"
      />

      {/* Logo lockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="z-10 flex items-center gap-8"
      >
        <BrandLogo
          src="./assets/logos/securevisa-vertical.png"
          alt="SecureVisa"
          fallback="SECUREVISA"
          className="h-28 w-auto object-contain 2xl:h-36"
        />
        <span className="font-display text-5xl font-thin text-sv-cyan/50">×</span>
        <BrandLogo
          src="./assets/logos/itsec-vertical.png"
          alt="ITSEC"
          fallback="ITSEC"
          className="h-28 w-auto object-contain 2xl:h-36"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="z-10 mt-10 text-center font-display text-2xl font-bold uppercase tracking-[0.35em] text-white/80 2xl:text-3xl"
      >
        Initializing Regulatory Cyber Command Center
      </motion.h1>

      {/* Loading checklist */}
      <div className="z-10 mt-10 flex w-full max-w-xl flex-col gap-3">
        {STEPS.map((label, i) => {
          const done = step >= i
          return (
            <AnimatePresence key={label}>
              {step >= i - 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: done ? 1 : 0.3, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="glass flex items-center gap-4 rounded-xl px-5 py-3"
                >
                  {done ? (
                    <Check className="h-6 w-6 text-sv-cyan" />
                  ) : (
                    <Loader2 className="h-6 w-6 animate-spin text-white/40" />
                  )}
                  <span className="font-mono text-lg tracking-wide text-white/80">
                    {label}
                  </span>
                  <span className="ml-auto font-mono text-sm text-sv-cyan">
                    {done ? 'OK' : '···'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="z-10 mt-10 font-mono text-sm uppercase tracking-[0.3em] text-white/40"
      >
        Secure Boot · v1.0
      </motion.div>
    </motion.div>
  )
}
