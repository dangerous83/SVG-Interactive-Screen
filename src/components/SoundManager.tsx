import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '../hooks/useSound'

/*
  Mute / un-mute toggle. Audio is OFF by default (kiosk-friendly) and the operator
  taps this to enable hover/click/ambient sound. Large 72px touch target.
*/
export default function SoundManager() {
  const { muted, toggleMute } = useSound()

  return (
    <motion.button
      onClick={toggleMute}
      whileTap={{ scale: 0.92 }}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      className={`touch-target holo-border relative flex items-center gap-3 rounded-2xl px-5 ${
        muted ? 'glass' : 'glass-strong shadow-glow-cyan'
      }`}
    >
      {muted ? (
        <VolumeX className="h-8 w-8 text-white/70" />
      ) : (
        <Volume2 className="h-8 w-8 text-sv-cyan" />
      )}
      <span className="hidden text-lg font-semibold tracking-wide text-white/80 xl:inline">
        {muted ? 'SOUND OFF' : 'SOUND ON'}
      </span>
    </motion.button>
  )
}
