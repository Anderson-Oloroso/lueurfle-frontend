import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CommandHelper } from '../js/utils/commandHelper.js';
import { I18nManager } from '../js/services/i18nManager.js';
import { ThemeManager } from '../js/services/themeManager.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(k) {
    return this.map.has(k) ? this.map.get(k) : null;
  }
  setItem(k, v) {
    this.map.set(k, String(v));
  }
}

test('CommandHelper filters /basico, /intermedio, /avanzado and sanitizes XSS in Markdown', () => {
  const all = CommandHelper.filterSuggestions('/');
  assert.deepEqual(
    all.map((c) => c.command),
    ['/basico', '/intermedio', '/avanzado']
  );

  const partial = CommandHelper.filterSuggestions('/inter');
  assert.equal(partial.length, 1);
  assert.equal(partial[0].level, 'intermedio');

  const parsed = CommandHelper.parse('/avanzado Expliquez le subjonctif');
  assert.equal(parsed.command, '/avanzado');
  assert.equal(parsed.level, 'avanzado');
  assert.equal(parsed.cleanMessage, 'Expliquez le subjonctif');

  const safeHtml = CommandHelper.formatSafeHtml('<script>alert(1)</script> **Bonjour**');
  assert.doesNotMatch(safeHtml, /<script>/);
  assert.match(safeHtml, /&lt;script&gt;/);
  assert.match(safeHtml, /<strong>Bonjour<\/strong>/);
});

test('I18nManager supports ONLY es and en with 100% key parity', () => {
  assert.deepEqual(I18nManager.SUPPORTED_LANGUAGES, ['es', 'en']);

  const esKeys = Object.keys(I18nManager.DICTIONARIES.es).sort();
  const enKeys = Object.keys(I18nManager.DICTIONARIES.en).sort();
  assert.deepEqual(esKeys, enKeys);

  const i18n = new I18nManager({ doc: null, storage: new MemoryStorage() });
  assert.equal(i18n.getLanguage(), 'es');
  assert.equal(i18n.toggleLanguage(), 'en');
  assert.equal(i18n.toggleLanguage(), 'es');

  assert.throws(() => i18n.setLanguage('fr'), /Unsupported UI language/);
  assert.throws(() => i18n.setLanguage('de'), /Unsupported UI language/);
});

test('ThemeManager toggles light/dark warm themes and maps matching SVG logos', () => {
  const theme = new ThemeManager({ doc: null, storage: new MemoryStorage() });
  assert.equal(theme.getTheme(), 'light');
  assert.equal(theme.getLogoPath(), './assets/lueur-logo-light.svg');

  assert.equal(theme.toggleTheme(), 'dark');
  assert.equal(theme.getLogoPath(), './assets/lueur-logo-dark.svg');

  assert.equal(theme.toggleTheme(), 'light');
  assert.equal(theme.getLogoPath(), './assets/lueur-logo-light.svg');
});

test('index.html uses semantic HTML5 landmarks, Lueur icon, and warm theme/i18n controls', async () => {
  const html = await readFile(path.join(rootDir, 'index.html'), 'utf8');
  for (const tag of ['<header', '<nav', '<aside', '<main', '<section', '<footer']) {
    assert.ok(html.includes(tag), `Missing semantic landmark ${tag}`);
  }
  assert.match(html, /lueur-icon\.svg/);
  assert.match(html, /lueur-logo-light\.svg/);
  assert.match(html, /id="theme-toggle-btn"/);
  assert.match(html, /id="lang-toggle-btn"/);
  assert.match(html, /ES \/ EN/);
});

test('All brand SVG assets exist and contain valid standalone SVG markup', async () => {
  for (const file of ['lueur-icon.svg', 'lueur-logo-light.svg', 'lueur-logo-dark.svg']) {
    const svg = await readFile(path.join(rootDir, 'assets', file), 'utf8');
    assert.match(svg, /^<svg\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg, /<\/svg>\s*$/);
    assert.match(svg, /<title/);
  }
});
