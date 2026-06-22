#!/usr/bin/env node
/** Lightweight checks for backup sanitization and service worker (audit follow-up). */
import { createRequire } from 'module';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { sanitizeImportedBackup, cleanText } = require('../backup-sanitize.js');

let n = 0;
function test(name, fn) {
  n++;
  fn();
  console.log('ok', name);
}

const makeId = (() => {
  let i = 0;
  return () => 'id_test_' + (++i);
})();

test('cleanText strips control chars', () => {
  assert.strictEqual(cleanText('hello\x00world', 50), 'helloworld');
});

test('rejects backup without trips array', () => {
  assert.throws(() => sanitizeImportedBackup({ data: { masterTemplate: { categories: [], items: [] } } }, makeId));
});

test('regenerates IDs so injected onclick cannot survive', () => {
  const malicious = {
    data: {
      masterTemplate: {
        categories: [{ id: "x');alert(1);//", name: 'Cat', order: 0 }],
        items: [{ id: "y');alert(1);//", categoryId: "x');alert(1);//", name: 'Mask', qty: 1 }]
      },
      trips: [{
        id: "z');alert(1);//",
        name: 'Trip',
        categories: [{ id: "a');alert(1);//", name: 'Cat', order: 0 }],
        items: [{ id: "b');alert(1);//", categoryId: "a');alert(1);//", name: 'Fins', qty: 1 }]
      }],
      settings: { theme: 'dark', homeSort: 'created' }
    }
  };
  const out = sanitizeImportedBackup(malicious, makeId);
  assert.match(out.trips[0].id, /^id_test_/);
  assert.match(out.trips[0].items[0].id, /^id_test_/);
  assert.ok(!out.trips[0].id.includes("'"));
  assert.strictEqual(out.settings.pinnedTripId, null);
});

test('sanitizes item names with HTML', () => {
  const out = sanitizeImportedBackup({
    data: {
      masterTemplate: {
        categories: [{ id: 'c1', name: 'Gear', order: 0 }],
        items: [{ id: 'i1', categoryId: 'c1', name: '<script>alert(1)</script>', qty: 1 }]
      },
      trips: [],
      settings: {}
    }
  }, makeId);
  assert.ok(!out.masterTemplate.items[0].name.includes('<'));
});

const swSource = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
test('sw.js registers install, activate, and fetch handlers', () => {
  assert.match(swSource, /addEventListener\(\s*['"]install['"]/);
  assert.match(swSource, /addEventListener\(\s*['"]activate['"]/);
  assert.match(swSource, /addEventListener\(\s*['"]fetch['"]/);
  assert.match(swSource, /skipWaiting/);
  assert.match(swSource, /clients\.claim/);
});

test('sw.js precaches vendored PDF assets', () => {
  assert.match(swSource, /vendor\/jspdf\.umd\.min\.js/);
  assert.match(swSource, /vendor\/fonts\/DejaVuSans\.ttf/);
});

console.log(`\n${n} checks passed`);
