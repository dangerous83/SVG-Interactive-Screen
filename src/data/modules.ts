// Command Center content — company presentation for the SecureVisa × ITSEC group.
// These are the top-level sections shown as orbital nodes around the core:
// Company Profile, History, Regulators, Services/Solutions, Ecosystem, Team, Contact.
// Icons use lucide-react. `related` references member ids from data/team.ts.
//
// NOTE: History and Company Profile copy below is professional placeholder text —
// edit the `description`/`keyPoints` to match SecureVisa's & ITSEC's official wording.

import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  History,
  Landmark,
  ShieldCheck,
  ShieldAlert,
  Network,
  Mail,
} from 'lucide-react'

export type ModuleOrg = 'securevisa' | 'itsec'

export interface CommandModule {
  id: string
  org: ModuleOrg
  title: string
  /** Short caption shown under the orbital icon node (kept to ~1-2 words). */
  short: string
  tag: string
  description: string
  keyPoints: string[]
  cta: string
  icon: LucideIcon
  related: string[]
  /** Some nodes navigate to another screen instead of opening a panel. */
  route?: 'team' | 'ecosystem'
}

// Left arc — the company & its compliance practice (cyan).
export const securevisaModules: CommandModule[] = [
  {
    id: 'profile',
    short: 'Company Profile',
    org: 'securevisa',
    title: 'Company Profile',
    tag: 'Who We Are',
    description:
      'SecureVisa Group and ITSEC form an integrated licensing, compliance and cybersecurity group in Dubai — helping founders build fully licensed AI, Crypto, FinTech, Web3, Gaming, Tokenization and FX ventures, secured end to end.',
    keyPoints: [
      '1,500+ licenses issued · 15+ countries',
      'SecureVisa — 20+ years in UAE licensing',
      'ITSEC — securing businesses since 2011',
      'Crypto, Web3, AI & virtual-asset expertise',
      'Compliance powered by ITSEC cybersecurity',
      'End-to-end UAE market execution',
    ],
    cta: '', // interactive kiosk for client explanation — no download button
    icon: Building2,
    related: [],
  },
  {
    id: 'history',
    short: 'Our History',
    org: 'securevisa',
    title: 'Our History',
    tag: 'Our Journey',
    description:
      'ITSEC was established in 2011 in Dubai as a cybersecurity leader across the GCC and beyond, while SecureVisa Group built 20+ years of complex-licensing expertise — together forming one command center for regulated ventures.',
    keyPoints: [
      'ITSEC founded in Dubai, 2011',
      'SecureVisa — 20+ years of licensing',
      'Led by Amir A. Kolahzadeh (Dubai 100)',
      'Expanded into AI, Web3 & digital-asset security',
      'Serving the GCC, Middle East & globally',
      'Trusted by leading regulated businesses',
    ],
    cta: '',
    icon: History,
    related: [],
  },
  {
    id: 'regulators',
    short: 'Regulators',
    org: 'securevisa',
    title: 'Regulators',
    tag: 'Regulatory Landscape',
    description:
      'We navigate and align with the UAE’s principal financial, virtual-asset, and cybersecurity regulators — from application to ongoing supervision.',
    keyPoints: [
      'VARA — Virtual Assets Regulatory Authority',
      'SCA — Securities & Commodities (Cat 1–6)',
      'GCGRA — Gaming Regulatory Authority',
      'DFSA · DIFC',
      'ADGM FSRA',
      'Central Bank UAE (CBUAE)',
    ],
    cta: '',
    icon: Landmark,
    related: [],
  },
  {
    id: 'compliance-solutions',
    short: 'Compliance',
    org: 'securevisa',
    title: 'Compliance Solutions',
    tag: 'SecureVisa',
    description:
      'End-to-end licensing and compliance for regulated and virtual-asset businesses entering and operating in the UAE.',
    keyPoints: [
      'VARA, SCA, GCGRA, DIFC, ADGM & CBUAE licensing',
      'SVG LaunchStack™ — 5-step framework',
      'AML/CFT · KYC/KYB onboarding',
      'PEP & sanctions screening',
      'Tokenization — real estate & assets',
      'White-labeled execution for partners',
    ],
    cta: '',
    icon: ShieldCheck,
    related: [],
  },
]

// Right arc — services, the integrated model, and the people (orange).
export const itsecModules: CommandModule[] = [
  {
    id: 'cybersecurity-solutions',
    short: 'Cybersecurity',
    org: 'itsec',
    title: 'Cybersecurity Solutions',
    tag: 'ITSEC',
    description:
      'Offensive and defensive cybersecurity for regulated businesses, exchanges, and digital-asset platforms — aligned to UAE regulatory expectations.',
    keyPoints: [
      'VAPT · Red Team · API, Web & Mobile testing',
      'Crypto exchange & blockchain security',
      'Advanced endpoint protection & MDR',
      'DDoS & ransomware simulation',
      'Cloud security · IAM · Zero Trust',
      'AI security & phishing awareness',
    ],
    cta: '',
    icon: ShieldAlert,
    related: [],
  },
  {
    id: 'ecosystem',
    short: 'Ecosystem',
    org: 'itsec',
    title: 'Ecosystem',
    tag: 'One Command Center',
    description:
      'From license approval to operational resilience — licensing, compliance, cybersecurity, and advisory delivered by one accountable partner.',
    keyPoints: [
      'Licensing → Compliance → Cyber defense',
      'Integrated regulatory + security advisory',
      'RegTech enablement',
      'Single accountable partner',
      'UAE market execution',
    ],
    cta: '',
    icon: Network,
    related: [],
    route: 'ecosystem',
  },
  {
    id: 'contact',
    short: 'Contact',
    org: 'itsec',
    title: 'Contact',
    tag: 'Get in Touch',
    description:
      'Speak with our licensing, compliance, and cybersecurity team about launching or securing your regulated venture.',
    keyPoints: [
      'www.securevisanow.com',
      'www.itsecnow.com',
      'Dubai · United Arab Emirates',
      'Tap a company widget for full profiles',
    ],
    cta: '',
    icon: Mail,
    related: [],
  },
]

export const allModules: CommandModule[] = [...securevisaModules, ...itsecModules]

export function moduleById(id: string): CommandModule | undefined {
  return allModules.find((m) => m.id === id)
}
