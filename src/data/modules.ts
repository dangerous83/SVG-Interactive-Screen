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
  Users,
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
      'SecureVisa and ITSEC form an integrated regulatory-compliance and cybersecurity group, helping regulated and virtual-asset businesses launch and operate securely in the UAE and the wider GCC.',
    keyPoints: [
      'UAE licensing & regulatory compliance',
      'Crypto, Web3 & virtual-asset assurance',
      'Offensive & defensive cybersecurity',
      'Regulatory technology (RegTech)',
      'Strategic & executive advisory',
      'End-to-end UAE market execution',
    ],
    cta: 'Download Company Profile',
    icon: Building2,
    related: ['amir-sv', 'esmaeil-sv', 'kassey-sv'],
  },
  {
    id: 'history',
    short: 'Our History',
    org: 'securevisa',
    title: 'Our History',
    tag: 'Our Journey',
    description:
      'Founded by compliance and cybersecurity specialists, the group grew from advisory roots into a single command center for licensing, compliance, and cyber resilience across regulated and digital-asset markets.',
    keyPoints: [
      'Established by industry veterans',
      'Rooted in UAE regulatory expertise',
      'Expanded into crypto & Web3 compliance',
      'ITSEC cybersecurity practice added',
      'Regional GCC reach',
      'Trusted by regulated businesses',
    ],
    cta: 'Learn Our Story',
    icon: History,
    related: ['amir-sv', 'esmaeil-sv'],
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
      'SCA / CMA — Securities & Commodities',
      'DFSA · DIFC',
      'ADGM FSRA',
      'CBUAE — Banking & Payments',
      'DESC & GCGRA',
    ],
    cta: 'Map Your Regulator',
    icon: Landmark,
    related: ['nadenne-sv', 'kashif-it', 'john-sv'],
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
      'UAE licensing (VARA / DFSA / ADGM / CBUAE)',
      'AML/CFT frameworks · KYC / KYT',
      'Tokenization & real-world assets (RWA)',
      'Corporate structuring & feasibility',
      'Ongoing compliance & goAML reporting',
      'Regulator-ready documentation',
    ],
    cta: 'Explore Compliance',
    icon: ShieldCheck,
    related: ['nadenne-sv', 'sahaara-sv', 'tina-sv'],
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
      'VAPT & security assessment',
      'Smart contract & Web3 audit',
      'Crypto exchange & platform security',
      'vCISO & security advisory',
      'AI security testing',
      'Incident response & recovery',
    ],
    cta: 'Explore Cybersecurity',
    icon: ShieldAlert,
    related: ['esmaeil-it', 'kashif-it', 'anas-it'],
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
    cta: 'Open the Ecosystem Map',
    icon: Network,
    related: ['amir-sv', 'esmaeil-sv'],
    route: 'ecosystem',
  },
  {
    id: 'team',
    short: 'Team',
    org: 'itsec',
    title: 'Leadership & Team',
    tag: 'Our People',
    description:
      'Meet the SecureVisa and ITSEC leadership and specialists behind the command center.',
    keyPoints: [
      'Executive leadership',
      'Compliance & assurance',
      'Cybersecurity engineering',
      'Operations & advisory',
    ],
    cta: 'View the Team',
    icon: Users,
    related: [],
    route: 'team',
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
      'securevisanow.com',
      'itsecnow.com',
      'United Arab Emirates',
      'Book a consultation',
    ],
    cta: 'Contact Us',
    icon: Mail,
    related: ['kassey-sv', 'alvin-sv'],
  },
]

export const allModules: CommandModule[] = [...securevisaModules, ...itsecModules]

export function moduleById(id: string): CommandModule | undefined {
  return allModules.find((m) => m.id === id)
}
