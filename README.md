# Get In Water

Dive trip packing checklist — a companion app in the [Three Cats LSP](https://threecats-lsp.com) ecosystem.

Pack your gear for dive trips: maintain a **master gear template**, create **per-trip checklists**, tick items off as you pack, and export **TXT** or **PDF** for printing.

Companion to **[LSP D-Planner](https://threecats-lsp.com/d-planner/)** (main app).

## Features

- Customizable master gear template (diving gear, camera, travel docs, personal)
- Per-trip checklist copies from the template
- Trip-only items without changing the master list
- Dark / light theme (D-Planner design system)
- Export full or remaining checklist as TXT or PDF
- Android APK via Capacitor

## Web

Open [threecats-lsp.com/get-in-water/](https://threecats-lsp.com/get-in-water/) or run `index.html` locally.

## Android

Download APK from [get-in-water/download.html](https://threecats-lsp.com/get-in-water/download.html).

## Build APK locally

```bash
npm ci
mkdir -p www && cp index.html manifest.json capacitor-bridge.js icon-*.png www/
npx cap sync android
cd android && ./gradlew assembleDebug
```

## License

Part of Three Cats LSP — built by divers, for divers.
