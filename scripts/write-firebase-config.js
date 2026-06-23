#!/usr/bin/env node
/** Write firebase-config.js from FIREBASE_WEB_CONFIG (base64) or keep existing / copy example. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'firebase-config.js');
const example = path.join(root, 'firebase-config.example.js');

const raw = process.env.FIREBASE_WEB_CONFIG;
if (raw) {
  const content = Buffer.from(raw, 'base64').toString('utf8');
  if (!content.includes('GIW_FIREBASE_CONFIG')) {
    console.error('FIREBASE_WEB_CONFIG must be base64 of firebase-config.js source');
    process.exit(1);
  }
  fs.writeFileSync(out, content.endsWith('\n') ? content : content + '\n', 'utf8');
  console.log('Wrote firebase-config.js from FIREBASE_WEB_CONFIG');
  process.exit(0);
}

if (fs.existsSync(out)) {
  console.log('firebase-config.js already present');
  process.exit(0);
}

if (fs.existsSync(example)) {
  fs.copyFileSync(example, out);
  console.warn('Copied firebase-config.example.js → firebase-config.js (sync disabled until configured)');
  process.exit(0);
}

console.error('Missing firebase-config.js — set FIREBASE_WEB_CONFIG or copy firebase-config.example.js');
process.exit(1);
