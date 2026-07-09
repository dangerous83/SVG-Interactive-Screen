import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, ChevronRight, ChevronLeft, Globe, X } from 'lucide-react'
import { companies, type Company } from '../data/companies'
import BrandLogo from './BrandLogo'
import { useSound } from '../hooks/useSound'

/*
  Two edge widgets — SecureVisa (left) and ITSEC (right). Tapping a widget's brand
  icon opens a slide-in drawer with a collapsible dropdown of company information:
  About · Why · Services · Solutions · Proof · Clients · CEO. Company information,
  intentionally separate from the team/employees screen.
*/

type SectionKey = 'about' | 'why' | 'services' | 'solutions' | 'proof' | 'clients' | 'ceo' | ''

export default function CompanyWidgets() {
  const { play } = useSound()
  const [open, setOpen] = useState<Company['id'] | null>(null)

  const toggle = (id: Company['id']) => {
    play(open === id ? 'panel-close' : 'panel-open')
    setOpen((cur) => (cur === id ? null : id))
  }

  return (
    <>
      {companies.map((c) => {
        const isOpen = open === c.id
        const Chevron = c.side === 'left' ? ChevronRight : ChevronLeft
        return (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, x: c.side === 'left' ? -30 : 30 }}
            animate={{ opacity: isOpen ? 0 : 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => toggle(c.id)}
            aria-label={`${c.name} information`}
            className={`glass-strong group fixed top-1/2 z-30 flex min-h-[168px] w-[72px] -translate-y-1/2 flex-col items-center justify-center gap-3 py-4 ${
              c.side === 'left' ? 'left-0 rounded-r-3xl border-l-0' : 'right-0 rounded-l-3xl border-r-0'
            }`}
            style={{ borderColor: `${c.accent}55`, boxShadow: `0 0 26px ${c.accent}22` }}
          >
            <span
              className="absolute inset-y-3 w-[3px] rounded-full"
              style={{ [c.side]: 0, background: c.accent, boxShadow: `0 0 12px ${c.accent}` } as React.CSSProperties}
            />
            <BrandLogo src={c.logo} alt={c.name} fallback={c.wordmark} className="h-12 w-12 object-contain" />
            <span
              className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em]"
              style={{ writingMode: 'vertical-rl', color: c.accent }}
            >
              {c.wordmark}
            </span>
            <Chevron className="h-5 w-5 text-white/60 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        )
      })}

      <AnimatePresence>
        {open && <CompanyDrawer company={companies.find((c) => c.id === open)!} onClose={() => toggle(open)} />}
      </AnimatePresence>
    </>
  )
}

function CompanyDrawer({ company, onClose }: { company: Company; onClose: () => void }) {
  const c = company
  const fromLeft = c.side === 'left'
  const [section, setSection] = useState<SectionKey>('about')
  const pick = (s: SectionKey) => setSection((cur) => (cur === s ? '' : s))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-void/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: fromLeft ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: fromLeft ? '-100%' : '100%' }}
        transition={{ type: 'spring', stiffness: 180, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className={`glass-strong absolute top-0 flex h-full w-full max-w-[480px] flex-col overflow-hidden ${
          fromLeft ? 'left-0 border-r' : 'right-0 border-l'
        }`}
        style={{ borderColor: `${c.accent}55`, boxShadow: `0 0 60px ${c.accent}33` }}
        role="dialog"
        aria-label={`${c.name} information`}
      >
        <span
          className="absolute inset-y-0 w-[3px]"
          style={{ [fromLeft ? 'right' : 'left']: 0, background: c.accent, boxShadow: `0 0 16px ${c.accent}` } as React.CSSProperties}
        />

        {/* Header */}
        <div className="border-b border-white/10 p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <BrandLogo src={c.logo} alt={c.name} fallback={c.wordmark} className="h-14 w-14 object-contain" />
              <div>
                <h2 className="font-display text-2xl font-extrabold leading-tight text-white text-glow">{c.name}</h2>
                <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: c.accent }}>
                  {c.tagline}
                </p>
              </div>
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
          <p className="mt-4 text-base leading-relaxed text-white/70">{c.positioning}</p>
          <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: c.accent }}>
            <Globe className="h-4 w-4" />
            {c.website}
          </div>
        </div>

        {/* Dropdown sections */}
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          <Dropdown label="About" accent={c.accent} open={section === 'about'} onToggle={() => pick('about')}>
            <p className="text-lg leading-relaxed text-white/80">{c.about}</p>
          </Dropdown>

          <Dropdown label="Why Choose Us" accent={c.accent} open={section === 'why'} onToggle={() => pick('why')}>
            <CheckList items={c.highlights} accent={c.accent} />
          </Dropdown>

          <Dropdown label="Services" accent={c.accent} open={section === 'services'} onToggle={() => pick('services')}>
            <CheckList items={c.services} accent={c.accent} />
          </Dropdown>

          <Dropdown label="Solutions" accent={c.accent} open={section === 'solutions'} onToggle={() => pick('solutions')}>
            <CheckList items={c.solutions} accent={c.accent} />
          </Dropdown>

          <Dropdown label="Proof" accent={c.accent} open={section === 'proof'} onToggle={() => pick('proof')}>
            <div className="grid grid-cols-3 gap-3">
              {c.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="rounded-2xl bg-white/5 p-4 text-center"
                >
                  <div className="font-display text-2xl font-extrabold" style={{ color: c.accent }}>
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-white/55">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </Dropdown>

          {c.clients && c.clients.length > 0 && (
            <Dropdown label="Trusted By" accent={c.accent} open={section === 'clients'} onToggle={() => pick('clients')}>
              <div className="flex flex-wrap gap-2">
                {c.clients.map((cl, i) => (
                  <motion.span
                    key={cl}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.03 * i }}
                    className="rounded-full border px-3 py-1.5 text-sm text-white/80"
                    style={{ borderColor: `${c.accent}44`, background: `${c.accent}12` }}
                  >
                    {cl}
                  </motion.span>
                ))}
              </div>
            </Dropdown>
          )}

          <Dropdown label="CEO" accent={c.accent} open={section === 'ceo'} onToggle={() => pick('ceo')}>
            <div className="flex items-center gap-4">
              {c.ceo.photo && (
                <img
                  src={c.ceo.photo}
                  alt={c.ceo.name}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                  style={{ border: `1px solid ${c.accent}66` }}
                />
              )}
              <div>
                <div className="font-display text-xl font-bold text-white">{c.ceo.name}</div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: c.accent }}>
                  {c.ceo.title}
                </div>
              </div>
            </div>
            <p className="mt-4 border-l-2 pl-4 text-lg italic leading-relaxed text-white/80" style={{ borderColor: c.accent }}>
              “{c.ceo.statement}”
            </p>
          </Dropdown>
        </div>
      </motion.aside>
    </motion.div>
  )
}

function CheckList({ items, accent }: { items: string[]; accent: string }) {
  return (
    <ul className="space-y-2">
      {items.map((s, i) => (
        <motion.li
          key={s}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.04 * i }}
          className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5"
        >
          <Check className="h-5 w-5 shrink-0" style={{ color: accent }} />
          <span className="text-white/85">{s}</span>
        </motion.li>
      ))}
    </ul>
  )
}

function Dropdown({
  label,
  accent,
  open,
  onToggle,
  children,
}: {
  label: string
  accent: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="holo-border overflow-hidden rounded-2xl">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-5 py-4 text-left">
        <span className="font-display text-lg font-bold uppercase tracking-[0.15em]" style={{ color: open ? accent : '#ffffff' }}>
          {label}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-5 w-5" style={{ color: accent }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
