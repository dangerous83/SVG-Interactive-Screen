// Command Center modules — SecureVisa (compliance/licensing) + ITSEC (cybersecurity).
// Icons use lucide-react. `related` references member ids from data/team.ts.

import type { LucideIcon } from 'lucide-react'
import {
  ScrollText,
  ShieldCheck,
  Boxes,
  Building2,
  ClipboardCheck,
  Network,
  Bug,
  FileCode2,
  Landmark,
  Gavel,
  UserCog,
  BrainCircuit,
  Siren,
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
}

export const securevisaModules: CommandModule[] = [
  {
    id: 'uae-licensing',
    short: 'UAE Licensing',
    org: 'securevisa',
    title: 'UAE Licensing',
    tag: 'Regulatory Gateway',
    description:
      'End-to-end licensing support for regulated businesses entering the UAE market.',
    keyPoints: [
      'VARA licensing',
      'CMA / SCA pathway',
      'DFSA / DIFC setup',
      'ADGM FSRA setup',
      'CBUAE banking & payments',
      'GCGRA advisory where applicable',
    ],
    cta: 'Map Your Licensing Path',
    icon: ScrollText,
    related: ['amir-sv', 'nadenne-sv', 'john-sv'],
  },
  {
    id: 'crypto-web3',
    short: 'Crypto & Web3',
    org: 'securevisa',
    title: 'Crypto & Web3 Compliance',
    tag: 'Virtual Asset Assurance',
    description:
      'Structured compliance support for exchanges, broker-dealers, custodians, token issuers, and virtual asset businesses.',
    keyPoints: [
      'AML / CFT framework',
      'KYC / KYT controls',
      'Travel Rule readiness',
      'Wallet screening',
      'On-chain transaction monitoring',
      'Regulator-ready documentation',
    ],
    cta: 'Build Your Compliance Layer',
    icon: ShieldCheck,
    related: ['nadenne-sv', 'esmaeil-sv', 'sahaara-sv'],
  },
  {
    id: 'tokenization-rwa',
    short: 'Tokenization',
    org: 'securevisa',
    title: 'Tokenization & RWA',
    tag: 'Real-World Assets',
    description:
      'Regulatory and compliance support for real-world asset tokenization, including real estate and investment-linked digital assets.',
    keyPoints: [
      'Tokenized real estate',
      'RWA project structure',
      'Investor disclosure framework',
      'Licensing pathway mapping',
      'Compliance documentation',
    ],
    cta: 'Structure Your Token Offering',
    icon: Boxes,
    related: ['amir-sv', 'sahaara-sv', 'nadenne-sv'],
  },
  {
    id: 'corporate-structuring',
    short: 'Structuring',
    org: 'securevisa',
    title: 'Corporate Structuring',
    tag: 'Foundation & Setup',
    description:
      'Business setup, feasibility, jurisdiction planning, and application preparation for regulated UAE ventures.',
    keyPoints: [
      'Business activity mapping',
      'Jurisdiction selection',
      'Licensing document preparation',
      'Regulator submission support',
      'Post-approval compliance planning',
    ],
    cta: 'Plan Your Structure',
    icon: Building2,
    related: ['kassey-sv', 'john-sv', 'sahaara-sv'],
  },
  {
    id: 'ongoing-compliance',
    short: 'Ongoing Compliance',
    org: 'securevisa',
    title: 'Ongoing Compliance',
    tag: 'Continuous Assurance',
    description:
      'Continuous compliance monitoring and audit readiness after licensing approval.',
    keyPoints: [
      'Regulatory reporting',
      'AML/CFT assessments',
      'goAML reporting',
      'Policy updates',
      'Compliance calendar',
      'Audit preparation',
    ],
    cta: 'Stay Audit-Ready',
    icon: ClipboardCheck,
    related: ['nadenne-sv', 'tina-sv', 'cathyrene-sv'],
  },
  {
    id: 'ecosystem-advantage',
    short: 'Ecosystem',
    org: 'securevisa',
    title: 'Ecosystem Advantage',
    tag: 'One Command Center',
    description:
      'SecureVisa combines licensing, compliance technology, cybersecurity assurance, and strategic advisory under one roof.',
    keyPoints: [
      'Licensing',
      'Compliance',
      'Cybersecurity',
      'Regulatory technology',
      'Business advisory',
      'UAE market execution',
    ],
    cta: 'Explore the Ecosystem',
    icon: Network,
    related: ['amir-sv', 'esmaeil-sv', 'kassey-sv'],
  },
]

export const itsecModules: CommandModule[] = [
  {
    id: 'vapt',
    short: 'VAPT',
    org: 'itsec',
    title: 'VAPT & Security Assessment',
    tag: 'Offensive Security',
    description:
      'Advanced vulnerability assessment and penetration testing for web, mobile, cloud, APIs, and enterprise systems.',
    keyPoints: [
      'Web application testing',
      'API security',
      'Mobile security',
      'Infrastructure testing',
      'Cloud assessment',
      'Executive reporting',
    ],
    cta: 'Request an Assessment',
    icon: Bug,
    related: ['esmaeil-it', 'anas-it', 'hassan-it'],
  },
  {
    id: 'smart-contract-audit',
    short: 'Contract Audit',
    org: 'itsec',
    title: 'Smart Contract Audit',
    tag: 'Web3 Security',
    description:
      'Security review for blockchain protocols, tokens, wallets, and smart contract systems.',
    keyPoints: [
      'Solidity review',
      'Logic vulnerability detection',
      'Exploit risk analysis',
      'Token contract validation',
      'Web3 security reporting',
    ],
    cta: 'Audit Your Contracts',
    icon: FileCode2,
    related: ['esmaeil-it', 'hassan-it', 'amir-it'],
  },
  {
    id: 'exchange-security',
    short: 'Exchange Security',
    org: 'itsec',
    title: 'Crypto Exchange Security',
    tag: 'Platform Defense',
    description:
      'Cybersecurity controls for exchanges, broker-dealers, trading platforms, and digital asset infrastructure.',
    keyPoints: [
      'Platform security testing',
      'Wallet security',
      'Access control validation',
      'Cloud and API hardening',
      'Incident readiness',
      'Regulator evidence pack',
    ],
    cta: 'Secure Your Platform',
    icon: Landmark,
    related: ['esmaeil-it', 'anas-it', 'kashif-it'],
  },
  {
    id: 'regulatory-cyber',
    short: 'Reg. Cybersecurity',
    org: 'itsec',
    title: 'Compliance & Regulatory Cybersecurity',
    tag: 'Control Validation',
    description:
      'Cybersecurity testing and control validation aligned with UAE regulatory expectations.',
    keyPoints: [
      'VARA cybersecurity support',
      'DFSA alignment',
      'CBUAE alignment',
      'ADGM support',
      'DESC cybersecurity mapping',
      'Audit evidence preparation',
    ],
    cta: 'Validate Your Controls',
    icon: Gavel,
    related: ['kashif-it', 'esmaeil-it', 'amir-it'],
  },
  {
    id: 'vciso',
    short: 'vCISO',
    org: 'itsec',
    title: 'vCISO & Advisory',
    tag: 'Security Leadership',
    description:
      'Executive cybersecurity leadership for regulated companies requiring ongoing governance and security strategy.',
    keyPoints: [
      'Security roadmap',
      'Board-level reporting',
      'Risk management',
      'Policy governance',
      'Incident response planning',
      'Vendor security review',
    ],
    cta: 'Engage a vCISO',
    icon: UserCog,
    related: ['esmaeil-it', 'kashif-it', 'amir-it'],
  },
  {
    id: 'ai-security',
    short: 'AI Security',
    org: 'itsec',
    title: 'AI Security Testing',
    tag: 'Emerging Threats',
    description:
      'Security assessment for AI-enabled platforms, models, automations, and high-risk digital systems.',
    keyPoints: [
      'AI application testing',
      'Prompt injection review',
      'Data leakage risk',
      'Model abuse scenarios',
      'Secure AI governance',
    ],
    cta: 'Test Your AI Systems',
    icon: BrainCircuit,
    related: ['esmaeil-it', 'hassan-it', 'kashif-it'],
  },
  {
    id: 'incident-response',
    short: 'Incident Response',
    org: 'itsec',
    title: 'Incident Response',
    tag: 'Rapid Containment',
    description:
      'Rapid support for security incidents, suspicious activity, and breach containment.',
    keyPoints: [
      'Threat triage',
      'Containment support',
      'Forensic readiness',
      'Recovery planning',
      'Executive incident brief',
      'Post-incident hardening',
    ],
    cta: 'Activate Response',
    icon: Siren,
    related: ['esmaeil-it', 'anas-it', 'hassan-it'],
  },
]

export const allModules: CommandModule[] = [...securevisaModules, ...itsecModules]

export function moduleById(id: string): CommandModule | undefined {
  return allModules.find((m) => m.id === id)
}
