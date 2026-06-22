# Get In Water audit

Audited `Three-Cats-LSP/Get-In-Water` at commit `165384c81a0c49f8e0d7416c28d65e11214376ce` (2026-06-21). The deployed page has the same normalized content as `main`; its different byte hash is caused by LF versus CRLF line endings.

## Findings

### High: Backup import permits stored script injection

`importBackupJSON` accepts arbitrary object IDs after checking only that `masterTemplate` and `trips` exist (`index.html:2643-2662`). Imported trip, template, category, and item IDs are then interpolated without attribute or JavaScript-string escaping into `onclick`, `onchange`, `id`, and `value` attributes. Examples include `index.html:1436-1447`, `1520-1531`, `1605-1613`, `1689-1728`, and `1803-1812`.

A crafted backup can close the quoted handler argument and inject JavaScript. On the website this executes in the application origin and can read or replace all checklist data. In the Capacitor build the same web code also has access to exposed native plugins, increasing impact.

Fix by validating imported data against a strict schema and regenerating every imported ID. Prefer `addEventListener` with data stored in DOM properties rather than inline handlers. At minimum, use separate HTML-attribute and JavaScript-string encoders; the existing `esc()` is not sufficient for handler context.

### High: Android source cannot be reproduced from the repository configuration

`capacitor.config.json:4` sets `webDir` to `www`, but no `www` directory exists. The repository also has no generated `android/app/src/main/assets/public` tree. Consequently `npm run cap:sync` cannot copy the checked-in root web app into Android as configured, and a clean Android build cannot contain the current UI without undocumented preprocessing.

Fix by moving/building the web assets into `www`, or changing the build pipeline and `webDir` to a real generated directory. Add a clean CI job that runs install, Capacitor sync, tests, and `assembleDebug` from a fresh checkout.

### Medium: PDF export is not offline, despite the offline claim

The PDF library is loaded from cdnjs (`index.html:18`), while both PDF fonts are fetched from jsDelivr at export time (`index.html:2671-2707`). None of these resources appears in the service worker precache (`sw.js:2-11`). After a fresh offline launch, `window.jspdf` is unavailable; after an online launch followed by lost connectivity, font fetching still fails unless the browser HTTP cache happens to retain both files.

This contradicts the README statement that the Android app has full offline support. Vendor jsPDF and both fonts with the application and precache them.

### Medium: Failed PDF exports still report success

`buildPdfDoc` returns `null` when jsPDF or fonts are unavailable (`index.html:2734-2739`). Both callers conditionally save only when a document exists, but unconditionally call `showExportToast()` afterward (`index.html:2839-2852` and `2855-2908`), producing the default `Saved!` message (`index.html:1033`).

Only show success after `doc.save()` succeeds. Return an explicit result or throw and present one error path.

### Medium: Public Downloads saving is unreliable on modern Android

`capacitor-bridge.js:74-83` first writes `Download/<name>` via Capacitor Filesystem `EXTERNAL_STORAGE`. Scoped storage prevents ordinary direct writes to arbitrary public external-storage paths on modern Android; the manifest's legacy storage permissions (`android/app/src/main/AndroidManifest.xml:41-44`) do not restore that access. The code silently falls back to app-specific external storage or cache, while the README advertises direct Downloads export.

Use Android's MediaStore or Storage Access Framework for public Downloads, or change the UI/documentation to state that files are saved to app storage and shared through the system sheet.

### Low: No automated tests cover application behavior

The only Android tests are generated examples, and `package.json` defines no web test, lint, or validation script. Core migration, import, quantity/mode transitions, export, and service-worker behavior are unprotected. This is especially risky because almost all behavior lives in a single 2,900-line HTML file.

Add focused tests for backup schema rejection, migration, packing/return quantities, offline exports, and Capacitor download fallbacks.

## Checks performed

- Cloned and inspected commit `165384c81a0c49f8e0d7416c28d65e11214376ce`.
- Parsed all three inline script blocks successfully.
- Compared deployed and repository `index.html`; normalized Git diff is empty.
- Exercised the live UI: loaded the app, created a 38-item trip, rendered its checklist, and checked browser warnings/errors (none).
- Confirmed live APK, service worker, manifest, and font URLs return HTTP 200.
- Reviewed PWA caching, backup/migration, export, native bridge, widget provider, manifest, and Gradle configuration.

## Verification limits

The audit environment had neither Node/npm nor Java configured. Therefore `npm ci`, `npm audit`, Capacitor sync, Gradle unit tests, and APK assembly could not be executed. The Gradle wrapper specifically stopped because `JAVA_HOME` and `java` were absent. Dependency vulnerability status remains unverified.
