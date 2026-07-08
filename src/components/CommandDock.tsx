import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Film,
  Home,
  Keyboard,
  Maximize2,
  Minimize2,
  Network,
  Palette,
  Search,
  Settings2,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import type { CommandModule } from '../data/modules'
import { useSound } from '../hooks/useSound'

/* ── Theme presets (background mood + dock accent) ────────────────────────── */
export type ThemeName = 'midnight' | 'abyss' | 'azure'
export const THEMES: { id: ThemeName; label: string; swatch: string }[] = [
  { id: 'midnight', label: 'Midnight', swatch: '#0a1430' },
  { id: 'abyss', label: 'Abyss', swatch: '#05070f' },
  { id: 'azure', label: 'Azure', swatch: '#08224a' },
]

type OpenPanel = null | 'settings' | 'keyboards' | 'search' | 'volume'

interface CommandDockProps {
  onHome: () => void
  theme: ThemeName
  onCycleTheme: () => void
  modules: CommandModule[]
  onSelectModule: (id: string) => void
  onOpenTeam: () => void
  onOpenEcosystem: () => void
  bgVideoOn: boolean
  onToggleBgVideo: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export default function CommandDock({
  onHome,
  theme,
  onCycleTheme,
  modules,
  onSelectModule,
  onOpenTeam,
  onOpenEcosystem,
  bgVideoOn,
  onToggleBgVideo,
  isFullscreen,
  onToggleFullscreen,
}: CommandDockProps) {
  const { play, muted, toggleMute, volume, setVolume } = useSound()
  const [open, setOpen] = useState<OpenPanel>(null)

  const close = () => {
    play('panel-close')
    setOpen(null)
  }
  const openPanel = (p: Exclude<OpenPanel, null>) => {
    play('icon-select')
    setOpen((cur) => (cur === p ? null : p))
  }

  // ESC closes an open dock panel (handled here so it works even over the ring).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(null)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  const themeLabel = THEMES.find((t) => t.id === theme)?.label ?? 'Theme'

  return (
    <>
      {/* ── The dock bar ──────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        className="glass-strong holo-border pointer-events-auto relative z-40 flex items-center gap-1 rounded-[1.75rem] px-3 py-2 shadow-glow-cyan sm:gap-2 sm:px-4"
      >
        <DockButton icon={<Home />} label="Home" onClick={() => { play('icon-select'); onHome() }} />
        <DockButton
          icon={<Palette />}
          label={themeLabel}
          onClick={() => { play('icon-select'); onCycleTheme() }}
        />
        <DockButton icon={<Settings2 />} label="Settings" active={open === 'settings'} onClick={() => openPanel('settings')} />
        <DockButton
          icon={muted ? <VolumeX /> : <Volume2 />}
          label="Volume"
          active={open === 'volume'}
          onClick={() => openPanel('volume')}
        />
        <DockButton icon={<Keyboard />} label="Keyboards" active={open === 'keyboards'} onClick={() => openPanel('keyboards')} />
        <DockButton icon={<Search />} label="Search" active={open === 'search'} onClick={() => openPanel('search')} />

        {/* Volume popover (anchored above the dock) */}
        <AnimatePresence>
          {open === 'volume' && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="glass-strong holo-border absolute bottom-[calc(100%+1rem)] right-2 flex w-72 flex-col gap-4 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-sv-cyan">
                  Audio
                </span>
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/80"
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {muted ? 'Muted' : 'On'}
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="dock-slider w-full"
                aria-label="Volume level"
              />
              <span className="text-center font-mono text-xs tracking-[0.2em] text-white/40">
                {muted ? 'AUDIO MUTED' : `LEVEL ${Math.round(volume * 100)}%`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Full overlays (Settings / Keyboards / Search) ─────────────────── */}
      <AnimatePresence>
        {open === 'settings' && (
          <DockOverlay title="Settings" icon={<Settings2 />} onClose={close}>
            <Section label="Theme">
              <div className="flex flex-wrap gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { play('icon-select'); if (t.id !== theme) onCycleThemeTo(onCycleTheme, theme, t.id) }}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      t.id === theme ? 'border-sv-cyan/70 bg-sv-cyan/10' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <span className="h-6 w-6 rounded-md" style={{ background: t.swatch, boxShadow: `0 0 12px ${t.swatch}` }} />
                    <span className="font-semibold text-white/85">{t.label}</span>
                    {t.id === theme && <Check className="h-4 w-4 text-sv-cyan" />}
                  </button>
                ))}
              </div>
            </Section>

            <Section label="Display">
              <ToggleRow
                icon={<Film className="h-5 w-5" />}
                label="Background video (BG Cyber)"
                on={bgVideoOn}
                onToggle={() => { play('icon-select'); onToggleBgVideo() }}
              />
              <ToggleRow
                icon={muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                label="Sound effects"
                on={!muted}
                onToggle={toggleMute}
              />
              <ToggleRow
                icon={isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                label="Fullscreen (kiosk)"
                on={isFullscreen}
                onToggle={() => { play('icon-select'); onToggleFullscreen() }}
              />
            </Section>

            <Section label="Views">
              <div className="flex flex-wrap gap-3">
                <LinkButton icon={<Network className="h-5 w-5" />} label="Ecosystem Map" onClick={() => { close(); onOpenEcosystem() }} />
                <LinkButton icon={<Users className="h-5 w-5" />} label="Command Team" onClick={() => { close(); onOpenTeam() }} />
              </div>
            </Section>
          </DockOverlay>
        )}

        {open === 'keyboards' && (
          <DockOverlay title="Keyboard Shortcuts" icon={<Keyboard />} onClose={close}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SHORTCUTS.map((s) => (
                <div key={s.action} className="flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3">
                  <span className="text-white/80">{s.action}</span>
                  <span className="flex gap-1.5">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="rounded-md border border-sv-cyan/30 bg-void/60 px-2.5 py-1 font-mono text-sm text-sv-cyan"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </DockOverlay>
        )}

        {open === 'search' && (
          <SearchOverlay
            modules={modules}
            onClose={close}
            onPick={(id) => {
              setOpen(null)
              onSelectModule(id)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Helper so a Settings theme button can jump straight to a chosen theme by
// cycling until it lands on it (keeps the theme state owned by the parent).
function onCycleThemeTo(cycle: () => void, current: ThemeName, target: ThemeName) {
  const order: ThemeName[] = THEMES.map((t) => t.id)
  let steps = (order.indexOf(target) - order.indexOf(current) + order.length) % order.length
  while (steps-- > 0) cycle()
}

/* ── Sub-components ────────────────────────────────────────────────────────── */

function DockButton({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`group flex min-h-[72px] min-w-[76px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-colors sm:min-w-[92px] ${
        active ? 'bg-sv-cyan/15' : 'hover:bg-white/5'
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center transition-colors ${
          active ? 'text-sv-cyan' : 'text-white/70 group-hover:text-white'
        }`}
      >
        {icon}
      </span>
      <span
        className={`font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] transition-colors ${
          active ? 'text-sv-cyan' : 'text-white/55 group-hover:text-white/80'
        }`}
      >
        {label}
      </span>
    </motion.button>
  )
}

function DockOverlay({
  title,
  icon,
  onClose,
  children,
}: {
  title: string
  icon: React.ReactNode
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 px-6 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong holo-border relative w-full max-w-2xl overflow-hidden rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-7 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sv-cyan/10 text-sv-cyan">
              {icon}
            </span>
            <h2 className="font-display text-2xl font-extrabold text-white text-glow">{title}</h2>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            aria-label="Close"
            className="touch-target glass flex items-center justify-center rounded-2xl"
          >
            <X className="h-7 w-7 text-white/80" />
          </motion.button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-7">{children}</div>
      </motion.div>
    </motion.div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-7 last:mb-0">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/45">{label}</h3>
      {children}
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  on,
  onToggle,
}: {
  icon: React.ReactNode
  label: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="mb-3 flex w-full items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 last:mb-0"
    >
      <span className="flex items-center gap-3 text-white/80">
        <span className="text-sv-cyan">{icon}</span>
        {label}
      </span>
      <span
        className={`relative h-7 w-12 rounded-full transition-colors ${on ? 'bg-sv-cyan/70' : 'bg-white/15'}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`}
        />
      </span>
    </button>
  )
}

function LinkButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="holo-border glass flex items-center gap-3 rounded-2xl px-6 py-4 text-lg font-bold text-white/85"
    >
      <span className="text-sv-cyan">{icon}</span>
      {label}
    </motion.button>
  )
}

function SearchOverlay({
  modules,
  onClose,
  onPick,
}: {
  modules: CommandModule[]
  onClose: () => void
  onPick: (id: string) => void
}) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  const ql = q.trim().toLowerCase()
  const results = ql
    ? modules.filter(
        (m) =>
          m.title.toLowerCase().includes(ql) ||
          m.tag.toLowerCase().includes(ql) ||
          m.short.toLowerCase().includes(ql) ||
          m.keyPoints.some((k) => k.toLowerCase().includes(ql)),
      )
    : modules

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-void/70 px-6 pt-[12vh] backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 170, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong holo-border w-full max-w-2xl overflow-hidden rounded-3xl"
      >
        <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5">
          <Search className="h-7 w-7 shrink-0 text-sv-cyan" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search modules, controls, capabilities…"
            className="w-full bg-transparent text-2xl font-medium text-white placeholder-white/35 outline-none"
          />
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} aria-label="Close" className="glass flex h-11 w-11 items-center justify-center rounded-xl">
            <X className="h-6 w-6 text-white/70" />
          </motion.button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-3">
          {results.length === 0 && (
            <p className="p-6 text-center text-white/50">No modules match “{q}”.</p>
          )}
          {results.map((m) => {
            const acc = m.org === 'securevisa' ? '#33d6ff' : '#ff7a30'
            const Icon = m.icon
            return (
              <button
                key={m.id}
                onClick={() => onPick(m.id)}
                className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-white/5"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${acc}1f`, border: `1px solid ${acc}55` }}
                >
                  <Icon className="h-6 w-6" style={{ color: acc }} strokeWidth={1.6} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-lg font-bold text-white">{m.title}</span>
                  <span className="block truncate text-sm uppercase tracking-[0.15em]" style={{ color: acc }}>
                    {m.org === 'securevisa' ? 'SecureVisa' : 'ITSEC'} · {m.tag}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

const SHORTCUTS: { action: string; keys: string[] }[] = [
  { action: 'Open / close the module ring', keys: ['Tap CORE'] },
  { action: 'Move focus around the ring', keys: ['←', '→', '↑', '↓'] },
  { action: 'Open focused module', keys: ['Enter'] },
  { action: 'Close panel / collapse ring', keys: ['Esc'] },
  { action: 'Search modules', keys: ['Search'] },
  { action: 'Fullscreen kiosk mode', keys: ['F11'] },
]
