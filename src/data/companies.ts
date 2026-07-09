// Company profiles for the two side widgets (SecureVisa Group & ITSEC).
// Content sourced from the official Company Profiles document.
// Each expands into a dropdown: About · Why · Services · Solutions · Proof · Clients · CEO.

export interface CompanyCEO {
  name: string
  title: string
  /** CEO portrait (the single leadership face — not a member grid). */
  photo: string | null
  statement: string
}

export interface Stat {
  value: string
  label: string
}

export interface Company {
  id: 'securevisa' | 'itsec'
  name: string
  tagline: string
  logo: string
  /** Fallback wordmark if the logo image is missing. */
  wordmark: string
  website: string
  accent: string
  side: 'left' | 'right'
  positioning: string
  about: string
  highlights: string[]
  services: string[]
  solutions: string[]
  stats: Stat[]
  clients?: string[]
  ceo: CompanyCEO
}

export const companies: Company[] = [
  {
    id: 'securevisa',
    name: 'SecureVisa Group',
    tagline: 'Licensing Tomorrow’s Finance, Today',
    logo: './assets/logos/securevisa-vertical.png',
    wordmark: 'SECUREVISA',
    website: 'www.securevisanow.com',
    accent: '#33d6ff',
    side: 'left',
    positioning:
      'Dubai’s most trusted authority in building fully licensed AI, Crypto, FinTech, Web3, Gaming, Tokenization and FX ventures.',
    about:
      'SecureVisa Group is Dubai’s authority in complex licensing and regulatory infrastructure. With 20+ years of experience and deep ties to UAE regulators, SVG is the go-to advisor for founders building regulated businesses in emerging industries — from license strategy to banking, compliance, and launch.',
    highlights: [
      'Expert in VARA, SCA, GCGRA, DIFC, ADGM & Central Bank licensing',
      'End-to-end: license strategy → banking → compliance → launch',
      'White-labeled execution for partners, CSPs & law firms',
      'Future-proofed for funding, exits & institutional trust',
      'Cybersecurity & compliance powered by ITSEC',
    ],
    services: [
      'VARA Virtual Asset Licenses (all categories)',
      'SCA Licensing — Categories 1–6',
      'GCGRA Gaming Licensing',
      'DIFC · ADGM · Central Bank UAE setup',
      'Crypto exchanges, wallets & custody',
      'Tokenization — real estate & assets',
    ],
    solutions: [
      'SVG LaunchStack™ — proven 5-step licensing framework',
      'AML/CFT & KYC/KYB onboarding infrastructure',
      'PEP & sanctions screening',
      'Transaction monitoring & real-time alerts',
      'Regulated payment gateways & stablecoins',
      'DAO, governance & Web3 compliance tech stack',
    ],
    stats: [
      { value: '1,500+', label: 'Licenses issued' },
      { value: '15+', label: 'Countries served' },
      { value: '20+ yrs', label: 'Experience' },
    ],
    ceo: {
      name: 'Amir A. Kolahzadeh',
      title: 'CEO & Founder',
      photo: './assets/team/amir-kolahzadeh.webp',
      statement:
        'From license approval to operational resilience — we build regulated ventures that institutions trust.',
    },
  },
  {
    id: 'itsec',
    name: 'ITSEC',
    tagline: 'Securing Networks · Protecting Data · Since 2011',
    logo: './assets/logos/itsec-vertical.png',
    wordmark: 'ITSEC',
    website: 'www.itsecnow.com',
    accent: '#ff7a30',
    side: 'right',
    positioning:
      'Your partner in cybersecurity excellence — future-proofing business in the digital age.',
    about:
      'Established in 2011 in Dubai, ITSEC is a leader in cybersecurity across the GCC, Middle East, and globally. ITSEC combines cutting-edge technology, industry-leading expertise, and AI-driven security to protect digital assets and ensure operational continuity.',
    highlights: [
      '13+ years securing regulated businesses',
      'AI-driven, proactive threat detection',
      'VARA & DFSA compliance and testing',
      'Digital asset, Web3 & AI security',
      'Founder listed in Dubai 100 — Most Influential',
      '93%+ client retention',
    ],
    services: [
      'Cybersecurity Advisory Services',
      'Awareness & Phishing Simulation',
      'Managed Security Services (MDR)',
      'Penetration Testing, VA & Red Team',
      'API Security Testing & Assessment',
      'Mobile & Web Application Security',
    ],
    solutions: [
      'Advanced Endpoint Protection',
      'Crypto Exchange Security',
      'Enterprise Blockchain Security',
      'DDoS & Ransomware Simulation',
      'Cloud Security (Azure / AWS)',
      'Identity & Access Management',
      'Zero Trust Architecture',
    ],
    stats: [
      { value: '2011', label: 'Securing since' },
      { value: '40%', label: 'Attacks prevented' },
      { value: '93%+', label: 'Client retention' },
    ],
    clients: [
      'Dubai Police',
      'Dubai Health Authority',
      'Netflix',
      'Carrefour',
      'flydubai',
      'Dubai Islamic Bank',
      'Saudi Aramco',
      'Siemens',
      'GE',
      'DEWA',
      'DHL',
      'Eagle Hills',
    ],
    ceo: {
      name: 'Amir A. Kolahzadeh',
      title: 'Founder & CEO',
      photo: './assets/team/amir-kolahzadeh.webp',
      statement:
        'With 30+ years in cybersecurity, we don’t just secure systems — we future-proof businesses.',
    },
  },
]
