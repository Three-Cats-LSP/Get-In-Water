#!/usr/bin/env node
/** Copy web assets into www/ for Capacitor sync and vendor/ for offline PDF. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const vendor = path.join(root, 'vendor');
const fonts = path.join(vendor, 'fonts');

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

ensureDir(www);
ensureDir(fonts);

const webFiles = [
  'index.html',
  'manifest.json',
  'capacitor-bridge.js',
  'backup-sanitize.js',
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

console.log('Prepared www/ and vendor/ for Capacitor + offline PDF');
