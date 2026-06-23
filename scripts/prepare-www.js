#!/usr/bin/env node
/** Copy web assets into www/ for Capacitor sync and vendor/ for offline PDF + Firebase. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const vendor = path.join(root, 'vendor');
const fonts = path.join(vendor, 'fonts');
const firebaseVendor = path.join(vendor, 'firebase');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copy(src, dest) {
  if (!fs.existsSync(src)) {
    console.error('Missing:', src);
    process.exit(1);
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyOptional(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn('Optional missing:', src);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

ensureDir(www);
ensureDir(fonts);
ensureDir(firebaseVendor);

const webFiles = [
  'index.html',
  'manifest.json',
  'capacitor-bridge.js',
  'backup-sanitize.js',
  'firebase-config.js',
  'sync.js',
  'sw.js'
];
webFiles.forEach(f => copy(path.join(root, f), path.join(www, f)));

const iconMap = [
  ['icon-512v2.png', 'icon-512.png'],
  ['icon-192v2.png', 'icon-192.png'],
  ['icon-512-light.png', 'icon-512-light.png'],
  ['icon-192-light.png', 'icon-192-light.png']
];
iconMap.forEach(([src, dest]) => {
  copy(path.join(root, src), path.join(www, dest));
  copy(path.join(root, src), path.join(root, dest));
});

const firebaseFiles = [
  'firebase-app-compat.js',
  'firebase-auth-compat.js',
  'firebase-firestore-compat.js'
];
firebaseFiles.forEach(f => {
  copy(
    path.join(root, 'node_modules', 'firebase', f),
    path.join(firebaseVendor, f)
  );
  copy(path.join(firebaseVendor, f), path.join(www, 'vendor', 'firebase', f));
});

copy(
  path.join(root, 'node_modules', 'jspdf', 'dist', 'jspdf.umd.min.js'),
  path.join(vendor, 'jspdf.umd.min.js')
);
copy(
  path.join(root, 'node_modules', 'dejavu-fonts-ttf', 'ttf', 'DejaVuSans.ttf'),
  path.join(fonts, 'DejaVuSans.ttf')
);
copy(
  path.join(root, 'node_modules', 'dejavu-fonts-ttf', 'ttf', 'DejaVuSans-Bold.ttf'),
  path.join(fonts, 'DejaVuSans-Bold.ttf')
);

copy(path.join(vendor, 'jspdf.umd.min.js'), path.join(www, 'vendor', 'jspdf.umd.min.js'));
copy(path.join(fonts, 'DejaVuSans.ttf'), path.join(www, 'vendor', 'fonts', 'DejaVuSans.ttf'));
copy(path.join(fonts, 'DejaVuSans-Bold.ttf'), path.join(www, 'vendor', 'fonts', 'DejaVuSans-Bold.ttf'));

console.log('Prepared www/ and vendor/ for Capacitor + offline PDF + Firebase');
