import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

/*
  Sound system for the Command Center.

  Strategy:
   1. If an audio file exists at /public/assets/sounds/<name>.(mp3|wav|ogg) it is used.
      (Drop your own files there to replace the synthesized tones — see README.)
   2. Otherwise the sound is synthesized on the fly with the Web Audio API so the
      experience works fully OFFLINE with zero audio assets.

  All sound is OPTIONAL and gated behind a global mute toggle (default: muted, so a
  kiosk never blasts audio unexpectedly until an operator un-mutes).
*/

export type SoundName =
  | 'boot-start'
  | 'hover-soft'
  | 'icon-select'
  | 'panel-open'
  | 'panel-close'
  | 'transition-whoosh'
  | 'success-confirm'
  | 'error-alert'
  | 'ambient-loop'
  | 'reveal'

// Optional real files. Missing files silently fall back to synthesis.
const FILE_SOURCES: Record<SoundName, string> = {
  'boot-start': './assets/sounds/boot-start.mp3',
  'hover-soft': './assets/sounds/hover-soft.mp3',
  'icon-select': './assets/sounds/icon-select.mp3',
  'panel-open': './assets/sounds/panel-open.mp3',
  'panel-close': './assets/sounds/panel-close.mp3',
  'transition-whoosh': './assets/sounds/transition-whoosh.mp3',
  'success-confirm': './assets/sounds/success-confirm.mp3',
  'error-alert': './assets/sounds/error-alert.mp3',
  'ambient-loop': './assets/sounds/ambient-loop.mp3',
  reveal: './assets/sounds/reveal.mp3',
}

interface SynthSpec {
  type: OscillatorType
  notes: number[] // frequencies in Hz, played as a quick sequence/chord
  duration: number
  gain: number
  sweepTo?: number // optional glide target for whooshes
}

// Gains raised across the board for a stronger, more present high-tech feel.
const SYNTH: Record<SoundName, SynthSpec> = {
  'boot-start': { type: 'sine', notes: [220, 330, 440, 660], duration: 0.9, gain: 0.32 },
  'hover-soft': { type: 'sine', notes: [880], duration: 0.06, gain: 0.1 },
  'icon-select': { type: 'triangle', notes: [523.25, 783.99], duration: 0.16, gain: 0.28 },
  'panel-open': { type: 'sine', notes: [392, 587.33, 880], duration: 0.35, gain: 0.3 },
  'panel-close': { type: 'sine', notes: [880, 587.33, 392], duration: 0.28, gain: 0.24 },
  'transition-whoosh': { type: 'sawtooth', notes: [180], duration: 0.45, gain: 0.16, sweepTo: 1100 },
  'success-confirm': { type: 'triangle', notes: [523.25, 659.25, 783.99], duration: 0.4, gain: 0.3 },
  'error-alert': { type: 'square', notes: [220, 180], duration: 0.3, gain: 0.22 },
  'ambient-loop': { type: 'sine', notes: [110], duration: 4, gain: 0.03 },
  // Strong high-tech "systems online" sweep for the module reveal.
  reveal: { type: 'sawtooth', notes: [70, 180, 360, 720, 1080], duration: 0.85, gain: 0.42, sweepTo: 1800 },
}

class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private buffers = new Map<SoundName, AudioBuffer | null>()
  private ambientNode: AudioBufferSourceNode | OscillatorNode | null = null
  private ambientGain: GainNode | null = null
  private volume = 1.0
  muted = false

  private ensureCtx() {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (!AC) return null
      this.ctx = new AC()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.volume
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  /** Must be called from a user gesture to unlock audio on most browsers. */
  unlock() {
    this.ensureCtx()
  }

  private async loadFile(name: SoundName): Promise<AudioBuffer | null> {
    if (this.buffers.has(name)) return this.buffers.get(name)!
    const ctx = this.ensureCtx()
    if (!ctx) return null
    try {
      const res = await fetch(FILE_SOURCES[name])
      if (!res.ok) throw new Error('not found')
      const arr = await res.arrayBuffer()
      const buf = await ctx.decodeAudioData(arr)
      this.buffers.set(name, buf)
      return buf
    } catch {
      this.buffers.set(name, null) // remember absence -> use synth
      return null
    }
  }

  private playBuffer(buf: AudioBuffer, loop = false, gain = 0.6) {
    const ctx = this.ensureCtx()
    if (!ctx || !this.master) return null
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = loop
    const g = ctx.createGain()
    g.gain.value = gain
    src.connect(g).connect(this.master)
    src.start()
    return { src, g }
  }

  private playSynth(name: SoundName) {
    const ctx = this.ensureCtx()
    if (!ctx || !this.master) return
    const spec = SYNTH[name]
    const now = ctx.currentTime
    const step = spec.notes.length > 1 ? spec.duration / spec.notes.length : spec.duration
    spec.notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = spec.type
      osc.frequency.setValueAtTime(freq, now + i * step)
      if (spec.sweepTo) {
        osc.frequency.exponentialRampToValueAtTime(spec.sweepTo, now + i * step + step)
      }
      const start = now + i * step
      const end = start + step * 0.98
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(spec.gain, start + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, end)
      osc.connect(g).connect(this.master!)
      osc.start(start)
      osc.stop(end + 0.02)
    })
  }

  async play(name: SoundName) {
    if (this.muted) return
    const buf = await this.loadFile(name)
    if (buf) this.playBuffer(buf, false, 0.95)
    else this.playSynth(name)
  }

  async startAmbient() {
    if (this.muted || this.ambientNode) return
    const ctx = this.ensureCtx()
    if (!ctx || !this.master) return
    const buf = await this.loadFile('ambient-loop')
    this.ambientGain = ctx.createGain()
    this.ambientGain.gain.value = 0
    this.ambientGain.connect(this.master)
    if (buf) {
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.loop = true
      src.connect(this.ambientGain)
      src.start()
      this.ambientNode = src
    } else {
      // Synthesized low ambient drone
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 70
      osc.connect(this.ambientGain)
      osc.start()
      this.ambientNode = osc
    }
    this.ambientGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2)
  }

  stopAmbient() {
    if (!this.ambientNode || !this.ctx || !this.ambientGain) return
    const g = this.ambientGain
    const node = this.ambientNode
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8)
    setTimeout(() => {
      try {
        node.stop()
      } catch {
        /* already stopped */
      }
    }, 900)
    this.ambientNode = null
    this.ambientGain = null
  }

  setMuted(m: boolean) {
    this.muted = m
    if (m) this.stopAmbient()
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v))
    if (this.master) this.master.gain.value = this.volume
  }
}

const engine = new SoundEngine()

interface SoundContextValue {
  muted: boolean
  toggleMute: () => void
  volume: number
  setVolume: (v: number) => void
  play: (name: SoundName) => void
  unlock: () => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  // Sound is ON by default so the high-tech effects are heard; operators can
  // mute from the dock's Volume control or the status-bar toggle.
  const [muted, setMuted] = useState(false)
  const [volume, setVolumeState] = useState(1.0)
  const ambientOn = useRef(false)

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      engine.setMuted(next)
      if (!next) {
        engine.unlock()
        engine.play('success-confirm')
        if (ambientOn.current) void engine.startAmbient()
        else {
          ambientOn.current = true
          void engine.startAmbient()
        }
      }
      return next
    })
  }, [])

  const play = useCallback((name: SoundName) => {
    engine.play(name)
  }, [])

  const unlock = useCallback(() => {
    engine.unlock()
  }, [])

  const setVolume = useCallback((v: number) => {
    engine.setVolume(v)
    setVolumeState(v)
  }, [])

  useEffect(() => {
    engine.setMuted(muted)
  }, [muted])

  const value = useMemo(
    () => ({ muted, toggleMute, volume, setVolume, play, unlock }),
    [muted, toggleMute, volume, setVolume, play, unlock],
  )

  return createElement(SoundContext.Provider, { value }, children)
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound must be used within a SoundProvider')
  return ctx
}
