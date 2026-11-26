/**
 * Vista modular de bienvenida y selección rápida de fase (/basico, /intermedio, /avanzado).
 */
export class WelcomeView {
  /**
   * @param {object} params
   * @param {Document} params.doc
   * @param {(level: string) => void} params.onStartLevel
   * @param {() => void} params.onStartChat
   */
  constructor({ doc, onStartLevel, onStartChat }) {
    this.doc = doc;
    this.onStartLevel = onStartLevel;
    this.onStartChat = onStartChat;
    this.bindEvents();
  }

  bindEvents() {
    const startBtn = this.doc.getElementById('start-chat-btn');
    startBtn?.addEventListener('click', () => this.onStartChat?.());

    this.doc.querySelectorAll('[data-start-level]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const level = btn.getAttribute('data-start-level');
        if (level) this.onStartLevel?.(level);
      });
    });
  }
}
