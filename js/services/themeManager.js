/**
 * Gestor OOP del tema cálido claro / oscuro con actualización automática del logotipo SVG.
 */
export class ThemeManager {
  static STORAGE_KEY = 'lueur-theme';
  static THEMES = Object.freeze({ LIGHT: 'light', DARK: 'dark' });
  static LOGOS = Object.freeze({
    light: './assets/lueur-logo-light.svg',
    dark: './assets/lueur-logo-dark.svg'
  });

  /**
   * @param {object} [options]
   * @param {Document} [options.doc]
   * @param {Storage} [options.storage]
   * @param {import('./i18nManager.js').I18nManager} [options.i18n]
   */
  constructor({
    doc = typeof document !== 'undefined' ? document : null,
    storage = typeof localStorage !== 'undefined' ? localStorage : null,
    i18n = null
  } = {}) {
    this.doc = doc;
    this.storage = storage;
    this.i18n = i18n;
    this.currentTheme = this.#resolveInitialTheme();
  }

  /**
   * @returns {'light'|'dark'}
   */
  #resolveInitialTheme() {
    try {
      const saved = this.storage?.getItem(ThemeManager.STORAGE_KEY);
      if (saved === ThemeManager.THEMES.LIGHT || saved === ThemeManager.THEMES.DARK) {
        return saved;
      }
    } catch {
      // Ignore storage access errors
    }

    const docTheme = this.doc?.documentElement?.getAttribute('data-theme');
    return docTheme === ThemeManager.THEMES.DARK ? ThemeManager.THEMES.DARK : ThemeManager.THEMES.LIGHT;
  }

  /**
   * @returns {'light'|'dark'}
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * @param {'light'|'dark'} theme
   * @returns {string} ruta del logo aplicado
   */
  getLogoPath(theme = this.currentTheme) {
    return ThemeManager.LOGOS[theme] || ThemeManager.LOGOS.light;
  }

  /**
   * Aplica el tema al DOM, actualiza el logo y guarda preferencia.
   * @param {'light'|'dark'} theme
   * @returns {'light'|'dark'}
   */
  applyTheme(theme) {
    const valid = theme === ThemeManager.THEMES.DARK ? ThemeManager.THEMES.DARK : ThemeManager.THEMES.LIGHT;
    this.currentTheme = valid;

    try {
      this.storage?.setItem(ThemeManager.STORAGE_KEY, valid);
    } catch {
      // Ignore storage restrictions
    }

    if (this.doc) {
      this.doc.documentElement.setAttribute('data-theme', valid);
      const logo = this.doc.getElementById('brand-logo');
      if (logo) {
        logo.setAttribute('src', this.getLogoPath(valid));
      }

      const btn = this.doc.getElementById('theme-toggle-btn');
      const icon = this.doc.getElementById('theme-toggle-icon');
      const label = this.doc.getElementById('theme-toggle-label');
      if (btn) {
        btn.setAttribute('aria-pressed', valid === ThemeManager.THEMES.DARK ? 'true' : 'false');
      }
      if (icon) {
        icon.textContent = valid === ThemeManager.THEMES.DARK ? '☀' : '☾';
      }
      if (label && this.i18n) {
        const key = valid === ThemeManager.THEMES.DARK ? 'theme_to_light' : 'theme_to_dark';
        label.setAttribute('data-i18n', key);
        label.textContent = this.i18n.t(key);
      }
    }

    return this.currentTheme;
  }

  /**
   * Alterna entre modo claro y modo oscuro.
   * @returns {'light'|'dark'}
   */
  toggleTheme() {
    return this.applyTheme(
      this.currentTheme === ThemeManager.THEMES.DARK
        ? ThemeManager.THEMES.LIGHT
        : ThemeManager.THEMES.DARK
    );
  }
}
