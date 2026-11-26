/**
 * Cliente HTTP orientado a objetos para consumir lueurfle-backend.
 */
export class ApiClient {
  /**
   * @param {object} params
   * @param {string} params.baseUrl
   * @param {typeof fetch} [params.fetchImpl]
   */
  constructor({ baseUrl, fetchImpl = (...args) => fetch(...args) }) {
    this.baseUrl = String(baseUrl || '').replace(/\/+$/, '');
    this.fetchImpl = fetchImpl;
  }

  /**
   * @returns {Promise<object>}
   */
  async getLevels() {
    return this.#requestJson('/levels');
  }

  /**
   * @returns {Promise<object[]>}
   */
  async listSessions() {
    const res = await this.#requestJson('/sessions');
    return res.data || [];
  }

  /**
   * @param {object} payload
   * @returns {Promise<object>}
   */
  async createSession(payload = {}) {
    const res = await this.#requestJson('/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.data;
  }

  /**
   * @param {string} sessionId
   * @returns {Promise<object>}
   */
  async getSessionMessages(sessionId) {
    const res = await this.#requestJson(`/sessions/${encodeURIComponent(sessionId)}/messages`);
    return res.data;
  }

  /**
   * @param {object} payload
   * @returns {Promise<object>}
   */
  async sendMessage(payload) {
    const res = await this.#requestJson('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.data;
  }

  /**
   * @param {File} file
   * @param {string} levelTag
   * @returns {Promise<object>}
   */
  async uploadPdf(file, levelTag = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('levelTag', levelTag);

    const res = await this.#requestJson('/documents/upload', {
      method: 'POST',
      body: formData
    });
    return res.data;
  }

  /**
   * @returns {Promise<object>}
   */
  async listDocuments() {
    const res = await this.#requestJson('/documents');
    return res.data;
  }

  /**
   * @returns {Promise<object>}
   */
  async getQdrantStatus() {
    const res = await this.#requestJson('/documents/qdrant-status');
    return res.data;
  }

  /**
   * @param {string} path
   * @param {RequestInit} [init]
   * @returns {Promise<object>}
   */
  async #requestJson(path, init = {}) {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, init);
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      const msg = data?.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }
    return data;
  }
}
