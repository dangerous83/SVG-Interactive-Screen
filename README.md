# SecureVisa × ITSEC — Interactive Command Center

A premium, futuristic **85‑inch touchscreen web application** for a corporate display —
a cinematic cybersecurity & crypto‑compliance command center with a holographic HUD,
orbital module nodes, expandable cinematic panels, an ecosystem map, a filterable team
grid, an auto‑playing presentation mode, and optional synthesized sound.

Built with **React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide React**.
Optimized for **3840 × 2160 (4K)**, responsive down to **1920 × 1080**, touch‑friendly
(minimum 72 px touch targets), keyboard‑navigable, and **fully offline after build**.

---

## 1. Quick start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server (hot reload)
npm run dev
#    → open the printed URL (default http://localhost:5173)

# 3. Build the production bundle (static, offline-capable)
npm run build

# 4. Preview the production build locally
npm run preview
#    → serves the built app (default http://localhost:4173)
```

The production build in `dist/` is a fully static site — copy it to any machine, USB
stick, or simple file server. It uses a **relative base path**, so it also runs by
opening `dist/index.html` directly or from a subfolder.

> **Fonts:** the display fonts (Orbitron / Rajdhani / JetBrains Mono) load from Google
> Fonts for the premium look, and the UI **falls back to system fonts** if there is no
> network. For a 100 % offline kiosk, self‑host the fonts (see comments in
> `index.html`).

---

## 2. Kiosk / full‑screen presentation mode (Windows + Chrome or Edge)

For an 85‑inch interactive monitor connected to a Windows touchscreen PC:

**Option A — Fastest**
1. Open the app (dev, preview, or the built `index.html`).
2. Press **F11** for browser full screen.
3. Use the in‑app **⤢ fullscreen button** (top‑right) or **Presentation Mode**.

**Option B — Dedicated kiosk shortcut (recommended for a permanent display)**

Create a desktop shortcut with one of these targets (point the URL at your served build):

```text
# Google Chrome
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --start-fullscreen --incognito --disable-pinch --overscroll-history-navigation=0 "http://localhost:4173"

# Microsoft Edge
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk "http://localhost:4173" --edge-kiosk-type=fullscreen --no-first-run
```

Tips for a permanent 4K touch kiosk:
- Set the Windows display resolution to **3840 × 2160** and scaling to **100 %** (the UI
  scales its own typography fluidly for 2–4 m readability).
- Disable screen‑saver / sleep on the kiosk PC.
- To serve the build persistently, run `npm run preview -- --port 4173` (or any static
  file server) and point the kiosk shortcut at it.

---

## 3. Controls & interaction

| Action | Control |
| --- | --- |
| Open a module brief | **Tap** a SecureVisa (left) or ITSEC (right) module node |
| Close a panel | **Tap ✕**, or press **Esc** |
| Switch focus between nodes | **Arrow keys** (← / → switch rails, ↑ / ↓ move within a rail) |
| Open the focused node | **Enter** |
| Explore Ecosystem | Center button, or tap the holographic **CORE** |
| Team Command grid | **View All Members** in the bottom carousel |
| Presentation Mode | Center button — auto‑plays every module (~6 s each) with prev / pause / next / exit; **Space** pauses, **← / →** step, **Esc** exits |
| Fullscreen / kiosk | ⤢ button (top‑right) |
| Sound | **SOUND OFF/ON** toggle (top‑right) — audio is **muted by default** |

---

## 4. Where to replace assets (logos, photos, sounds, backgrounds)

All runtime assets live under **`public/assets/`** and are referenced by relative path,
so replacing a file (keeping the same name) instantly updates the app — no code change.

```
public/assets/
├── logos/
│   ├── securevisa-white.png       ← SecureVisa logo (status bar)
│   ├── securevisa-vertical.png    ← SecureVisa logo (boot screen)
│   ├── itsec-horizontal.png       ← ITSEC logo (status bar)
│   ├── itsec-vertical.png         ← ITSEC logo (boot screen)
│   └── favicon.png                ← browser tab / kiosk icon (see index.html)
├── team/
│   ├── amir-kolahzadeh.webp
│   ├── esmaeil-rahimian.webp
│   ├── kassey-sierra.webp
│   ├── melika-estemrari.webp
│   ├── alvin-jampazar.webp
│   ├── tina-ramos.webp
│   ├── nadenne-adame.webp
│   ├── sahaara-wijithananda.webp
│   ├── cathyrene-tan.webp
│   ├── jessa-pastor.webp
│   ├── john-montilla.webp
│   └── manuelito-victoria.webp
└── sounds/                        ← OPTIONAL (see below)
```

### Logos
Replace the files in `public/assets/logos/`. If an image is missing, the UI shows a
clean text fallback (e.g. `SECUREVISA` / `ITSEC`).

### Member photos
- Replace files in `public/assets/team/` (`.webp` or `.jpg`).
- **Missing photos automatically fall back to a holographic initials avatar.**
- The following members currently have **no photo** (drop a file in to enable — the path
  is noted in `src/data/team.ts`):
  - `public/assets/team/kashif-akhtar.webp` — Kashif Akhtar (ITSEC)
  - `public/assets/team/anas-thajudeen.webp` — Anas Thajudeen (ITSEC)
  - `public/assets/team/hassan-razeen.webp` — Hassan Razeen (ITSEC)
  - After adding a file, set the `photo` field for that member in `src/data/team.ts` to
    `P('kashif-akhtar')` (etc.).

### Sounds
Sound is **optional** and **synthesized in‑browser** (Web Audio API) by default, so it
works with **zero audio files**. To use your own audio, drop matching files into
`public/assets/sounds/` — see **`public/assets/sounds/README.md`** for the full list
(`boot-start`, `hover-soft`, `icon-select`, `panel-open`, `panel-close`,
`transition-whoosh`, `success-confirm`, `error-alert`, `ambient-loop`). Any missing file
falls back to its synthesized tone.

### Background / content
The animated background (grid, particles, radar, glow) is generated in code
(`src/components/CyberBackground.tsx`) — no video asset required. Brand accent colors live
in `tailwind.config.js` (`itsec-blue #0075c9`, `itsec-orange #d2451e`, `sv-cyan`,
`sv-orange`).

---

## 5. Editing content

| What | File |
| --- | --- |
| Module titles, descriptions, key points, CTAs, related team | `src/data/modules.ts` |
| Team members, roles, blurbs, expertise tags, photo paths, filters | `src/data/team.ts` |
| Colors, fonts, shadows, animations | `tailwind.config.js` |
| Global look & glass/HUD styles | `src/styles/globals.css` |

---

## 6. Project structure

```
├── index.html                     # Vite entry (fonts, favicon, meta)
├── public/assets/                 # logos, team photos, (optional) sounds
└── src/
    ├── main.tsx                   # React root + SoundProvider
    ├── App.tsx                    # screen routing, fullscreen, audio unlock
    ├── styles/globals.css         # Tailwind + HUD/glass styles
    ├── data/
    │   ├── modules.ts             # SecureVisa + ITSEC module content
    │   └── team.ts                # team members + filters
    ├── hooks/
    │   └── useSound.ts            # Web Audio engine + <SoundProvider>
    └── components/
        ├── BootScreen.tsx         # animated boot / layer-online sequence
        ├── StatusBar.tsx          # brand, live status, clock, controls
        ├── SoundManager.tsx       # mute / un-mute toggle
        ├── CyberBackground.tsx    # grid + particles + radar + glow
        ├── HolographicCore.tsx    # central rotating network core (SVG)
        ├── OrbitalIcon.tsx        # interactive module node
        ├── InfoPanel.tsx          # cinematic module panel (scan reveal)
        ├── Dashboard.tsx          # home view + keyboard nav + presentation
        ├── EcosystemMap.tsx       # two connected pillars view
        ├── TeamCarousel.tsx       # bottom team strip
        ├── TeamCommand.tsx        # full team grid + filters
        ├── MemberCard.tsx         # expandable member card
        ├── MemberAvatar.tsx       # photo w/ initials fallback
        └── BrandLogo.tsx          # logo w/ text fallback
```

---

## 7. Performance notes

- Particle field is canvas‑based with a **capped count** that scales with resolution —
  smooth at 4K.
- The holographic core is **pure SVG/CSS** (no Three.js) to stay GPU‑light on a Windows
  touchscreen PC.
- Images are lazy‑loaded; the production bundle is ~100 KB gzipped JS.
- Honors `prefers-reduced-motion`.
- **No external API or internet connection required at runtime** (fonts degrade
  gracefully offline).
