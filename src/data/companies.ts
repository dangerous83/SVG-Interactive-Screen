// Company profiles for the two side widgets (SecureVisa & ITSEC).
// Each expands into a dropdown with About · Services · Solutions · CEO.
// Edit the copy here to match each company's official wording.

export interface CompanyCEO {
  name: string
  title: string
  /** CEO portrait (the single leadership face — not a member grid). */
  photo: string | null
  statement: string
}

export interface Company {
  id: 'securevisa' | 'itsec'
  name: string
  tagline: string
  logo: string
  /** Fallback wordmark if the logo image is missing. */
  wordmark: string
  accent: string
  side: 'left' | 'right'
  about: string
  services: string[]
  solutions: string[]
  ceo: CompanyCEO
}

export const companies: Company[] = [
  {
    id: 'securevisa',
    name: 'SecureVisa Group',
    tagline: 'Regulatory Licensing & Compliance',
    logo: './assets/logos/securevisa-vertical.png',
    wordmark: 'SECUREVISA',
    accent: '#33d6ff',
    side: 'left',
    about:
      'SecureVisa is a UAE-based regulatory licensing and compliance group that helps regulated, crypto, and virtual-asset businesses enter and operate in the UAE market — end to end, from application through ongoing supervision.',
    services: [
      'UAE Licensing — VARA · DFSA · ADGM · CBUAE',
      'Crypto & Web3 Compliance',
      'Tokenization & Real-World Assets',
      'Corporate Structuring & Feasibility',
      'Ongoing Compliance & goAML Reporting',
    ],
    solutions: [
      'AML / CFT frameworks',
      'KYC / KYT & Travel Rule readiness',
      'Wallet screening & transaction monitoring',
      'Regulator-ready documentation',
      'Regulatory technology (RegTech) enablement',
      'Audit & inspection readiness',
    ],
    ceo: {
      name: 'Mr. Amir A. Kolahzadeh',
      title: 'CEO & Founder',
      photo: './assets/team/amir-kolahzadeh.webp',
      statement:
        'We take regulated businesses from license approval to operational resilience — under one roof.',
    },
  },
  {
    id: 'itsec',
    name: 'ITSEC',
    tagline: 'Cybersecurity & Assurance',
    logo: './assets/logos/itsec-vertical.png',
    wordmark: 'ITSEC',
    accent: '#ff7a30',
    side: 'right',
    about:
      'ITSEC is a cybersecurity firm delivering offensive and defensive security for regulated businesses, exchanges, and digital-asset platforms — aligned to UAE regulatory expectations.',
    services: [
      'VAPT & Security Assessment',
      'Smart Contract & Web3 Audit',
      'Crypto Exchange & Platform Security',
      'Compliance & Regulatory Cybersecurity',
      'vCISO & Security Advisory',
      'AI Security Testing',
      'Incident Response',
    ],
    solutions: [
      'Platform, wallet & API hardening',
      'Access-control validation',
      'Cloud security assessment',
      'Incident readiness & recovery',
      'Regulator evidence packs',
      'Secure AI governance',
    ],
    ceo: {
      name: 'Amir A. Kolahzadeh',
      title: 'Founder & CEO',
      photo: './assets/team/amir-kolahzadeh.webp',
      statement: 'Security that regulators trust and businesses can operate on.',
    },
  },
]
