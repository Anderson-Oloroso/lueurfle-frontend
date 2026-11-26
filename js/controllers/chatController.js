import { CommandHelper } from '../utils/commandHelper.js';

/**
 * Controlador OOP del flujo conversacional, sesiones, comandos slash y cambio de pantallas.
 */
export class ChatController {
  /**
   * @param {object} deps
   * @param {Document} deps.doc
   * @param {import('../services/apiClient.js').ApiClient} deps.apiClient
   * @param {import('../services/i18nManager.js').I18nManager} deps.i18n
   * @param {import('../views/chatView.js').ChatView} deps.chatView
   * @param {import('../views/commandMenuView.js').CommandMenuView} deps.commandMenuView
   * @param {(screenName: string) => void} deps.navigateTo
   */
  constructor({ doc, apiClient, i18n, chatView, commandMenuView, navigateTo }) {
    this.doc = doc;
    this.apiClient = apiClient;
    this.i18n = i18n;
    this.chatView = chatView;
    this.commandMenuView = commandMenuView;
    this.navigateTo = navigateTo;

    this.activeSessionId = null;
    this.activeLevel = 'basico';
    this.localSessions = [];
    this.#bindEvents();
  }

  async initialize() {
    try {
      const sessions = await this.apiClient.listSessions();
      this.localSessions = sessions;
      if (sessions.length > 0) {
        await this.selectSession(sessions[0].id);
      } else {
        await this.startNewSession('basico');
      }
    } catch {
      this.#createOfflineGreeting('basico');
    }
  }

  /**
   * @param {'basico'|'intermedio'|'avanzado'} [level='basico']
   */
  async startNewSession(level = 'basico') {
    this.activeLevel = level;
    this.chatView.setActiveLevel(level);
    try {
      const created = await this.apiClient.createSession({
        level,
        uiLanguage: this.i18n.getLanguage()
      });
      this.activeSessionId = created.id;
      this.localSessions = [
        {
          id: created.id,
          title: created.title,
          currentLevel: created.currentLevel
        },
        ...this.localSessions.filter((s) => s.id !== created.id)
      ];
      this.chatView.renderSessions(this.localSessions, this.activeSessionId, (id) =>
        this.selectSession(id)
      );
      this.chatView.renderMessages([]);
      await this.submitMessage(`/${level}`);
    } catch {
      this.#createOfflineGreeting(level);
    }
  }

  /**
   * @param {string} sessionId
   */
  async selectSession(sessionId) {
    try {
      const session = await this.apiClient.getSessionMessages(sessionId);
      this.activeSessionId = session.id;
      this.activeLevel = session.currentLevel || 'basico';
      this.chatView.setActiveLevel(this.activeLevel);
      this.chatView.renderMessages(session.messages || []);
      this.chatView.renderSessions(this.localSessions, this.activeSessionId, (id) =>
        this.selectSession(id)
      );
      this.navigateTo('chat');
    } catch {
      // Ignore unreachable session
    }
  }

  /**
   * @param {'basico'|'intermedio'|'avanzado'} level
   */
  async activateLevel(level) {
    this.navigateTo('chat');
    await this.submitMessage(`/${level}`);
  }

  /**
   * @param {string} rawText
   */
  async submitMessage(rawText) {
    const message = String(rawText || '').trim();
    if (!message) return;

    const parsed = CommandHelper.parse(message);
    const levelForTurn = parsed.level || this.activeLevel;

    this.chatView.appendMessage({
      role: 'user',
      content: message,
      levelUsed: levelForTurn
    });

    this.chatView.setLoading(true);
    try {
      const data = await this.apiClient.sendMessage({
        sessionId: this.activeSessionId || undefined,
        message,
        level: this.activeLevel,
        uiLanguage: this.i18n.getLanguage()
      });

      this.activeSessionId = data.sessionId;
      this.activeLevel = data.level || levelForTurn;
      this.chatView.setActiveLevel(this.activeLevel);
      this.chatView.setLoading(false);

      this.chatView.appendMessage({
        role: 'assistant',
        content: data.reply,
        levelUsed: this.activeLevel,
        isBlocked: Boolean(data.blocked),
        sources: data.sources || []
      });

      await this.#refreshSessions();
    } catch {
      this.chatView.setLoading(false);
      this.chatView.appendMessage({
        role: 'assistant',
        content: this.i18n.t('msg_backend_offline'),
        levelUsed: this.activeLevel,
        isBlocked: true
      });
    }
  }

  async #refreshSessions() {
    try {
      this.localSessions = await this.apiClient.listSessions();
      this.chatView.renderSessions(this.localSessions, this.activeSessionId, (id) =>
        this.selectSession(id)
      );
    } catch {
      // Keep local list
    }
  }

  #createOfflineGreeting(level) {
    this.activeLevel = level;
    this.chatView.setActiveLevel(level);
    const greeting =
      this.i18n.getLanguage() === 'en'
        ? `Bonjour ! I am **Lueur** (/${level}). Start \`lueurfle-backend\` and \`lueurfle-n8n-rag\` to practice with Qdrant RAG.`
        : `Bonjour ! Soy **Lueur** (/${level}). Inicia \`lueurfle-backend\` y \`lueurfle-n8n-rag\` para practicar con RAG en Qdrant.`;

    this.chatView.renderMessages([
      {
        role: 'assistant',
        content: greeting,
        levelUsed: level
      }
    ]);
  }

  #bindEvents() {
    const form = this.doc.getElementById('chat-composer');
    const input = this.doc.getElementById('chat-input');
    const newSessionBtn = this.doc.getElementById('new-session-btn');

    newSessionBtn?.addEventListener('click', () => {
      this.navigateTo('chat');
      this.startNewSession(this.activeLevel);
    });

    this.doc.querySelectorAll('[data-level-cmd]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-level-cmd');
        if (!cmd) return;
        const level = cmd.replace('/', '');
        this.activateLevel(level);
      });
    });

    input?.addEventListener('input', () => {
      this.commandMenuView.update(input.value);
    });

    input?.addEventListener('keydown', (event) => {
      if (this.commandMenuView.isOpen()) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          this.commandMenuView.moveSelection(1);
          return;
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          this.commandMenuView.moveSelection(-1);
          return;
        }
        if (event.key === 'Tab' || event.key === 'Enter') {
          const selected = this.commandMenuView.getSelectedCommand();
          if (selected) {
            event.preventDefault();
            input.value = `${selected} `;
            this.commandMenuView.hide();
            return;
          }
        }
        if (event.key === 'Escape') {
          this.commandMenuView.hide();
          return;
        }
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        form?.requestSubmit();
      }
    });

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!input) return;
      const text = input.value;
      input.value = '';
      this.commandMenuView.hide();
      await this.submitMessage(text);
    });
  }
}
