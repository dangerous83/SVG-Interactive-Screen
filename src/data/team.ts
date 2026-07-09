// Team / member data for the Command Center.
//
// PHOTOS: place member photos in /public/assets/team/<slug>.webp (or .jpg).
// If a `photo` path is missing or fails to load, the UI falls back to initials.
// Missing photos (create & drop in to enable): kashif-akhtar, anas-thajudeen, hassan-razeen.

export type Org = 'securevisa' | 'itsec'

export type MemberCategory =
  | 'Leadership'
  | 'Compliance'
  | 'Cybersecurity'
  | 'Marketing'
  | 'Operations'
  | 'Finance'
  | 'Legal'

export interface Member {
  id: string
  name: string
  role: string
  org: Org
  categories: MemberCategory[]
  /** Public path to portrait; null => render initials placeholder */
  photo: string | null
  blurb: string
  expertise: string[]
}

const P = (slug: string) => `./assets/team/${slug}.webp`

export const members: Member[] = [
  // ─────────────────────────── SecureVisa ───────────────────────────
  {
    id: 'amir-sv',
    name: 'Mr. Amir A. Kolahzadeh',
    role: 'CEO & Founder',
    org: 'securevisa',
    categories: ['Leadership'],
    photo: P('amir-kolahzadeh'),
    blurb: 'Founder-led vision uniting licensing, compliance and cyber assurance.',
    expertise: ['Regulatory Strategy', 'UAE Market Entry', 'Executive Advisory', 'Web3 Compliance'],
  },
  {
    id: 'esmaeil-sv',
    name: 'Esmaeil Rahimian',
    role: 'CTO | CISO',
    org: 'securevisa',
    categories: ['Leadership', 'Cybersecurity'],
    photo: P('esmaeil-rahimian'),
    blurb: 'Bridges regulatory technology with enterprise-grade security architecture.',
    expertise: ['Security Architecture', 'RegTech', 'Cloud Security', 'Risk Governance'],
  },
  {
    id: 'kassey-sv',
    name: 'Kassey Sierra',
    role: 'Chief Operations Officer',
    org: 'securevisa',
    categories: ['Leadership', 'Operations'],
    photo: P('kassey-sierra'),
    blurb: 'Orchestrates delivery across licensing, compliance and client success.',
    expertise: ['Operations', 'Delivery Management', 'Process Design', 'Client Success'],
  },
  {
    id: 'melika-sv',
    name: 'Melika Estemrari',
    role: 'Sales Manager',
    org: 'securevisa',
    categories: ['Operations', 'Marketing'],
    photo: P('melika-estemrari'),
    blurb: 'Guides regulated ventures from first contact to licensing engagement.',
    expertise: ['Business Development', 'Client Advisory', 'Market Growth'],
  },
  {
    id: 'alvin-sv',
    name: 'Alvin Jampazar',
    role: 'Marketing Manager',
    org: 'securevisa',
    categories: ['Marketing'],
    photo: P('alvin-jampazar'),
    blurb: 'Shapes the brand narrative across the SecureVisa ecosystem.',
    expertise: ['Brand Strategy', 'Digital Marketing', 'Content', 'Creative Direction'],
  },
  {
    id: 'tina-sv',
    name: 'Tina Ramos',
    role: 'Finance Manager',
    org: 'securevisa',
    categories: ['Finance', 'Operations'],
    photo: P('tina-ramos'),
    blurb: 'Steers financial planning and fiscal integrity across engagements.',
    expertise: ['Financial Planning', 'Controls', 'Reporting'],
  },
  {
    id: 'nadenne-sv',
    name: 'Nadenne Adame',
    role: 'Head of Compliance & Assurance',
    org: 'securevisa',
    categories: ['Compliance', 'Leadership'],
    photo: P('nadenne-adame'),
    blurb: 'Leads AML/CFT frameworks and regulator-ready assurance programs.',
    expertise: ['AML / CFT', 'Regulatory Reporting', 'Assurance', 'goAML'],
  },
  {
    id: 'sahaara-sv',
    name: 'Sahaara Wijithananda',
    role: 'Junior Legal Officer',
    org: 'securevisa',
    categories: ['Legal', 'Compliance'],
    photo: P('sahaara-wijithananda'),
    blurb: 'Supports legal structuring and regulatory documentation.',
    expertise: ['Legal Research', 'Documentation', 'Regulatory Filings'],
  },
  {
    id: 'cathyrene-sv',
    name: 'Cathyrene Tan',
    role: 'Operations Executive',
    org: 'securevisa',
    categories: ['Operations'],
    photo: P('cathyrene-tan'),
    blurb: 'Keeps engagement operations precise and on schedule.',
    expertise: ['Operations', 'Coordination', 'Client Onboarding'],
  },
  {
    id: 'jessa-sv',
    name: 'Jessa Pastor',
    role: 'Admin Coordinator',
    org: 'securevisa',
    categories: ['Operations'],
    photo: P('jessa-pastor'),
    blurb: 'Coordinates administrative workflows across the command center.',
    expertise: ['Administration', 'Scheduling', 'Documentation'],
  },
  {
    id: 'john-sv',
    name: 'John Montilla',
    role: 'Government Relations Officer',
    org: 'securevisa',
    categories: ['Operations', 'Compliance'],
    photo: P('john-montilla'),
    blurb: 'Manages liaison with UAE authorities and regulatory bodies.',
    expertise: ['Government Relations', 'Regulator Liaison', 'Submissions'],
  },
  {
    id: 'manuelito-sv',
    name: 'Manuelito Victoria',
    role: 'Operations Associate',
    org: 'securevisa',
    categories: ['Operations'],
    photo: P('manuelito-victoria'),
    blurb: 'Drives day-to-day operational execution and support.',
    expertise: ['Operations Support', 'Coordination', 'Logistics'],
  },

  // ───────────────────────────── ITSEC ─────────────────────────────
  {
    id: 'amir-it',
    name: 'Amir A. Kolahzadeh',
    role: 'Founder & CEO',
    org: 'itsec',
    categories: ['Leadership'],
    photo: P('amir-kolahzadeh'),
    blurb: 'Sets the strategic direction for offensive and defensive security.',
    expertise: ['Cybersecurity Strategy', 'Executive Leadership', 'Web3 Security'],
  },
  {
    id: 'esmaeil-it',
    name: 'Esmaeil Rahimian',
    role: 'CISO / CTO',
    org: 'itsec',
    categories: ['Leadership', 'Cybersecurity'],
    photo: P('esmaeil-rahimian'),
    blurb: 'Directs security engineering, VAPT programs and vCISO delivery.',
    expertise: ['Penetration Testing', 'Security Architecture', 'vCISO', 'Incident Response'],
  },
  {
    id: 'alvin-it',
    name: 'Alvin Jampazar',
    role: 'Marketing Manager',
    org: 'itsec',
    categories: ['Marketing'],
    photo: P('alvin-jampazar'),
    blurb: 'Communicates ITSEC capabilities to the regulated market.',
    expertise: ['Brand Strategy', 'Digital Marketing', 'Content'],
  },
  {
    id: 'hassan-it',
    name: 'Hassan Razeen',
    role: 'Software Engineer / IT',
    org: 'itsec',
    categories: ['Cybersecurity', 'Operations'],
    photo: P('hassan-razeen'),
    blurb: 'Builds secure tooling and automation for assessment workflows.',
    expertise: ['Software Engineering', 'Automation', 'Secure Development'],
  },
]

/** Derive up-to-two-letter initials for the placeholder avatar. */
export function initials(name: string): string {
  const clean = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s+/i, '').trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const teamFilters: Array<'All' | Org | MemberCategory> = [
  'All',
  'securevisa',
  'itsec',
  'Leadership',
  'Compliance',
  'Cybersecurity',
  'Marketing',
  'Operations',
]

export const filterLabel: Record<string, string> = {
  All: 'All',
  securevisa: 'SecureVisa',
  itsec: 'ITSEC',
  Leadership: 'Leadership',
  Compliance: 'Compliance',
  Cybersecurity: 'Cybersecurity',
  Marketing: 'Marketing',
  Operations: 'Operations',
}
