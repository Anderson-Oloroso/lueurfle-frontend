import { FrontendConfig } from './config/env.js';
import { I18nManager } from './services/i18nManager.js';
import { ThemeManager } from './services/themeManager.js';
import { ApiClient } from './services/apiClient.js';
import { WelcomeView } from './views/welcomeView.js';
import { CommandMenuView } from './views/commandMenuView.js';
import { ChatView } from './views/chatView.js';
import { LibraryView } from './views/libraryView.js';
import { LevelGuideView } from './views/levelGuideView.js';
import { ChatController } from './controllers/chatController.js';
import { UploadController } from './controllers/uploadController.js';

/**
 * Orquestador principal de la aplicación SPA modular Lueur FLE (100% OOP ES Modules).
 */
export class LueurApp {
  /**
   * @param {Document} [doc=document]
   */
  constructor(doc = document) {
    this.doc = doc;
    this.config = new FrontendConfig({ doc });
    this.i18n = new I18nManager({ doc });
    this.themeManager = new ThemeManager({ doc, i18n: this.i18n });
    this.apiClient = new ApiClient({ baseUrl: this.config.apiBaseUrl });

    this.chatView = new ChatView({ doc, i18n: this.i18n });
    this.libraryView = new LibraryView({ doc, i18n: this.i18n });
    this.commandMenuView = new CommandMenuView({
      container: doc.getElementById('command-menu'),
      i18n: this.i18n,
      onSelect: (command) => {
        const input = doc.getElementById('chat-input');
        if (input) {
          input.value = `${command} `;
          input.focus();
        }
      }
    });

    this.chatController = new ChatController({
      doc,
      apiClient: this.apiClient,
      i18n: this.i18n,
      chatView: this.chatView,
      commandMenuView: this.commandMenuView,
      navigateTo: (screen) => this.navigateTo(screen)
    });

    this.uploadController = new UploadController({
      doc,
      apiClient: this.apiClient,
      i18n: this.i18n,
      libraryView: this.libraryView,
      maxPdfSizeBytes: this.config.maxPdfSizeBytes
    });

    this.welcomeView = new WelcomeView({
      doc,
      onStartLevel: (level) => this.chatController.activateLevel(level),
      onStartChat: () => this.navigateTo('chat')
    });

    this.levelGuideView = new LevelGuideView({
      doc,
      i18n: this.i18n,
      onActivateLevel: (level) => this.chatController.activateLevel(level)
    });
  }

  async init() {
    this.i18n.applyTranslations();
    this.themeManager.applyTheme(this.themeManager.getTheme());
    this.levelGuideView.render();
    this.#bindGlobalControls();
    this.navigateTo('welcome');

    await Promise.all([
      this.chatController.initialize(),
      this.uploadController.refreshKnowledgePanel()
    ]);
  }

  /**
   * Cambia entre las 4 pantallas modulares (welcome, chat, library, guide).
   * @param {'welcome'|'chat'|'library'|'guide'} screenName
   */
  navigateTo(screenName) {
    const screens = ['welcome', 'chat', 'library', 'guide'];
    screens.forEach((name) => {
      const section = this.doc.getElementById(`view-${name}`);
      if (section) section.hidden = name !== screenName;
    });

    this.doc.querySelectorAll('.nav-pill[data-nav-target]').forEach((el) => {
      el.classList.toggle('is-active', el.getAttribute('data-nav-target') === screenName);
    });
  }

  #bindGlobalControls() {
    this.doc.querySelectorAll('[data-nav-target]').forEach((el) => {
      el.addEventListener('click', (event) => {
        if (el.tagName === 'A') event.preventDefault();
        const target = el.getAttribute('data-nav-target');
        if (target) this.navigateTo(target);
      });
    });

    this.doc.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      this.themeManager.toggleTheme();
    });

    this.doc.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
      this.i18n.toggleLanguage();
      this.themeManager.applyTheme(this.themeManager.getTheme());
      this.levelGuideView.render();
      this.uploadController.refreshKnowledgePanel();
    });

    const sidebarToggle = this.doc.getElementById('sidebar-toggle-btn');
    const sidebar = this.doc.getElementById('sessions-sidebar');
    sidebarToggle?.addEventListener('click', () => {
      const open = sidebar?.classList.toggle('is-open');
      sidebarToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
}

if (typeof document !== 'undefined') {
  const app = new LueurApp(document);
  app.init();
}
