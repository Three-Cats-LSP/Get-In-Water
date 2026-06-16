# Get In Water

Dive trip packing checklist — a companion app in the [Three Cats LSP](https://threecats-lsp.com) **Diver's Toolkit**.

Pack your gear for dive trips: maintain a **master gear template**, create **per-trip checklists**, tick items off as you pack, and export **TXT** or **PDF** for printing. Works alongside **[LSP D-Planner](https://threecats-lsp.com/d-planner/)** — plan the dive, then pack for it.

🌐 **Web app**: https://threecats-lsp.com/get-in-water/

**Current version: 1.2.0**

---

## Diver's Toolkit

| App | Purpose |
|-----|---------|
| **[LSP D-Planner](https://threecats-lsp.com/d-planner/)** | Decompression planning (Bühlmann, VPM-B, Rec/Tec) |
| **[T-Viewer](https://threecats-lsp.com/t-viewer/)** | Open and share exported dive plan TXT/PDF files |
| **Get In Water** | Trip packing checklists (this app) |

All apps live on the [Diver's Toolkit hub](https://threecats-lsp.com).

---

## Features

### Master gear template
- Editable category cards (diving gear, camera, travel docs, personal, and more)
- Rename, reorder, add, remove, and duplicate categories
- Add, rename, and remove items within each card
- Collapsible cards with per-category **+** to add items
- Export master template as TXT or PDF

### Trip checklists
- Create trips from the master template (checks start cleared)
- **Multi-day trips** — start/finish dates, or **One day trip** for single-day outings
- Per-trip category cards: rename, reorder, duplicate, add, and remove
- Trip-only items without changing the master template
- Duplicate and delete trips from the home screen
- Progress bar — packed count and percentage
- Reset all checks or delete a trip from the **⋮** menu

### Export
- **TXT** — full checklist or remaining unchecked items only
- **PDF** — formatted export with Unicode/Cyrillic support (DejaVu Sans), full or remaining
- Trip exports include date range in the header when set

### App experience
- LSP D-Planner design system — dark/light theme, card layout, bubble background
- **PWA** — install from the browser (Add to Home Screen / Install prompt on Android; Share → Add to Home Screen on iOS)
- Offline use after install via service worker
- All data stored locally in `localStorage` (`giw_v1`) — no account, no server

---

## Web & Android

### Web / PWA
Open https://threecats-lsp.com/get-in-water/ in any modern browser. Install as a PWA for home-screen access and offline packing lists.

### Android APK
📲 **[Download APK](https://threecats-lsp.com/get-in-water/download.html)**

Built with Capacitor. APK is updated automatically by GitHub Actions on each release.

**Installation:**
1. Open the download page on your Android device
2. Tap **Download APK**
3. Open the downloaded file
4. Allow *Install from unknown sources* if prompted
5. Install and launch Get In Water

---

## UI overview

| Screen | Description |
|--------|-------------|
| **Home** | Trip list with progress, **+** to create a trip, **?** for settings |
| **Trip** | Checklist by category; **+** add card, TXT/PDF export, **⋮** menu (rename, remaining export, reset, delete) |
| **? → Gear template** | Edit the master gear template used for new trips |
| **? → About** | App info and links |

### Category card header
```
[Card name] [↑][↓][copy][×]                    [+][▼]
```
Move, duplicate, and remove sit beside the name; add item and collapse stay on the right.

---

## Repository structure

| Path | Purpose |
|------|---------|
| `index.html` | Self-contained web app |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker — offline caching |
| `capacitor-bridge.js` | Android file export bridge |
| `download.html` | APK download page |
| `icon-192.png`, `icon-512.png` | App icons |
| `android/` | Capacitor Android project |
| `Android Apk/` | Latest built APK (auto-updated by CI) |

---

## Build APK locally

```bash
npm ci
mkdir -p www
cp index.html manifest.json sw.js capacitor-bridge.js icon-192.png icon-512.png www/
npx cap sync android
cd android && ./gradlew assembleDebug
```

---

## Deployment

Static single-file app served from GitHub Pages via [threecats-lsp.com/get-in-water/](https://threecats-lsp.com/get-in-water/). Pushes to `main` trigger APK build and homepage sync through the Three Cats LSP site pipeline.

---

## Disclaimer

Get In Water is a packing checklist only. It does not replace formal dive training, certification, or a calibrated dive computer. Always verify your own gear and dive plans. Use at your own risk.

---

*Developed by Three Cats LSP · [@threecats_lsp](https://www.instagram.com/threecats_lsp)*
