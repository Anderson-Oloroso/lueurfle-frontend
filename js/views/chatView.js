import { CommandHelper } from '../utils/commandHelper.js';

/**
 * Vista modular de la conversación con Lueur, badges CEFR e historial de sesiones.
 */
export class ChatView {
  static CEFR_BY_LEVEL = Object.freeze({
    basico: 'A1-A2',
    intermedio: 'B1-B2',
    avanzado: 'C1-C2'
  });

  /**
   * @param {object} params
   * @param {Document} params.doc
   * @param {import('../services/i18nManager.js').I18nManager} params.i18n
   */
  constructor({ doc, i18n }) {
    this.doc = doc;
    this.i18n = i18n;
    this.messagesEl = doc.getElementById('chat-messages');
    this.sessionsListEl = doc.getElementById('sessions-list');
    this.activeBadgeEl = doc.getElementById('chat-active-badge');
    this.headerLevelTextEl = doc.getElementById('header-level-text');
    this.sendBtn = doc.getElementById('send-btn');
    this.inputEl = doc.getElementById('chat-input');
    this.thinkingEl = null;
  }

  /**
   * Actualiza los indicadores visuales de fase activa (/basico, /intermedio, /avanzado).
   * @param {'basico'|'intermedio'|'avanzado'} level
   */
  setActiveLevel(level) {
    const normalized = ChatView.CEFR_BY_LEVEL[level] ? level : 'basico';
    const text = `/${normalized} · ${ChatView.CEFR_BY_LEVEL[normalized]}`;

    if (this.activeBadgeEl) {
      this.activeBadgeEl.className = `badge badge--${normalized}`;
      this.activeBadgeEl.textContent = text;
    }
    if (this.headerLevelTextEl) {
      this.headerLevelTextEl.textContent = text;
    }
  }

  /**
   * Renderiza una lista completa de mensajes.
   * @param {Array<object>} messages
   */
  renderMessages(messages = []) {
    if (!this.messagesEl) return;
    this.messagesEl.innerHTML = '';
    messages.forEach((msg) => this.appendMessage(msg));
  }

  /**
   * Añade un mensaje de forma segura (sin XSS).
   * @param {object} msg
   */
  appendMessage(msg) {
    if (!this.messagesEl) return;

    const article = this.doc.createElement('article');
    const roleClass = msg.role === 'user' ? 'message--user' : 'message--assistant';
    const blockedClass = msg.isBlocked ? ' message--blocked' : '';
    article.className = `message ${roleClass}${blockedClass}`;

    const meta = this.doc.createElement('header');
    meta.className = 'message__meta';

    const author = this.doc.createElement('span');
    author.textContent = msg.role === 'user' ? this.i18n.t('msg_you') : this.i18n.t('msg_lueur');
    meta.appendChild(author);

    if (msg.levelUsed) {
      const badge = this.doc.createElement('span');
      badge.className = `badge badge--${msg.levelUsed}`;
      badge.textContent = `/${msg.levelUsed}`;
      meta.appendChild(badge);
    }

    const body = this.doc.createElement('div');
    body.className = 'message__body';
    body.innerHTML = CommandHelper.formatSafeHtml(msg.content);

    article.append(meta, body);

    if (Array.isArray(msg.sources) && msg.sources.length > 0) {
      const sourcesEl = this.doc.createElement('footer');
      sourcesEl.className = 'message__sources';
      sourcesEl.textContent = `${this.i18n.t('msg_sources')} ${msg.sources.join(', ')}`;
      article.appendChild(sourcesEl);
    }

    this.messagesEl.appendChild(article);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  /**
   * @param {boolean} isLoading
   */
  setLoading(isLoading) {
    if (this.sendBtn) this.sendBtn.disabled = isLoading;
    if (!this.messagesEl) return;

    if (isLoading && !this.thinkingEl) {
      const el = this.doc.createElement('article');
      el.className = 'message message--assistant';
      el.textContent = this.i18n.t('msg_thinking');
      this.thinkingEl = el;
      this.messagesEl.appendChild(el);
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    } else if (!isLoading && this.thinkingEl) {
      this.thinkingEl.remove();
      this.thinkingEl = null;
    }
  }

  /**
   * Renderiza la lista de sesiones en el sidebar.
   * @param {Array<object>} sessions
   * @param {string|null} activeSessionId
   * @param {(id: string) => void} onSelect
   */
  renderSessions(sessions = [], activeSessionId, onSelect) {
    if (!this.sessionsListEl) return;
    this.sessionsListEl.innerHTML = '';

    sessions.forEach((session) => {
      const li = this.doc.createElement('li');
      const btn = this.doc.createElement('button');
      btn.type = 'button';
      btn.className = `session-item${session.id === activeSessionId ? ' is-active' : ''}`;

      const title = this.doc.createElement('span');
      title.textContent = session.title;

      const badge = this.doc.createElement('span');
      badge.className = `badge badge--${session.currentLevel || 'basico'}`;
      badge.textContent = `/${session.currentLevel || 'basico'}`;

      btn.append(title, badge);
      btn.addEventListener('click', () => onSelect?.(session.id));
      li.appendChild(btn);
      this.sessionsListEl.appendChild(li);
    });
  }
}
