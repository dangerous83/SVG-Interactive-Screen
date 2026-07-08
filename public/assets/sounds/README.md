# Sound assets (optional)

The Command Center works **fully offline with zero audio files** — every sound is
synthesized on the fly with the Web Audio API. Sound is **muted by default**; tap the
**SOUND OFF/ON** toggle in the status bar to enable it.

To use your own audio instead of the synthesized tones, drop matching files here:

```
public/assets/sounds/
├── boot-start.mp3
├── hover-soft.mp3
├── icon-select.mp3
├── panel-open.mp3
├── panel-close.mp3
├── transition-whoosh.mp3
├── success-confirm.mp3
├── error-alert.mp3
└── ambient-loop.mp3      (loops continuously while sound is on)
```

- Any missing file automatically falls back to the synthesized tone — no code changes needed.
- `.mp3`, `.wav`, and `.ogg` all decode; update the extensions in
  `src/hooks/useSound.ts` (`FILE_SOURCES`) if you use a format other than `.mp3`.
- Keep files small (a few hundred KB) so the kiosk stays responsive.
