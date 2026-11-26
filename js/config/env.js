/**
 * Resuelve la URL base de la API backend sin hardcodear secretos.
 */
export class FrontendConfig {
  /**
   * @param {object} [options]
   * @param {string} [options.defaultApiBaseUrl='http://localhost:3000/api']
   * @param {Document} [options.doc]
   * @param {Window} [options.win]
   */
  constructor({
    defaultApiBaseUrl = 'http://localhost:3000/api',
    doc = typeof document !== 'undefined' ? document : null,
    win = typeof window !== 'undefined' ? window : null
  } = {}) {
    const runtimeUrl = win?.__LUEUR_CONFIG__?.API_BASE_URL;
    const metaUrl = doc?.querySelector('meta[name="lueur-api-url"]')?.getAttribute('content');
    this.apiBaseUrl = String(runtimeUrl || metaUrl || defaultApiBaseUrl).replace(/\/+$/, '');
    this.maxPdfSizeBytes = 15 * 1024 * 1024;
    Object.freeze(this);
  }
}
