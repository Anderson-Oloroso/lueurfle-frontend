import { CommandHelper } from '../utils/commandHelper.js';

/**
 * Vista flotante de autocompletado para los comandos /basico, /intermedio y /avanzado.
 */
export class CommandMenuView {
  /**
   * @param {object} params
   * @param {HTMLElement} params.container
   * @param {import('../services/i18nManager.js').I18nManager} params.i18n
   * @param {(command: string) => void} params.onSelect
   */
  constructor({ container, i18n, onSelect }) {
    this.container = container;
    this.i18n = i18n;
    this.onSelect = onSelect;
    this.items = [];
    this.selectedIndex = 0;
  }

  /**
   * Actualiza las opciones visibles según el texto del compositor.
   * @param {string} inputValue
   */
  update(inputValue) {
    this.items = CommandHelper.filterSuggestions(inputValue);
    this.selectedIndex = 0;
    this.render();
  }

  hide() {
    this.items = [];
    this.container.innerHTML = '';
    this.container.hidden = true;
  }

  isOpen() {
    return !this.container.hidden && this.items.length > 0;
  }

  /**
   * @param {1|-1} delta
   */
  moveSelection(delta) {
    if (!this.items.length) return;
    this.selectedIndex = (this.selectedIndex + delta + this.items.length) % this.items.length;
    this.render();
  }

  /**
   * @returns {string|null}
   */
  getSelectedCommand() {
    return this.items[this.selectedIndex]?.command || null;
  }

  render() {
    if (!this.items.length) {
      this.hide();
      return;
    }

    const lang = this.i18n.getLanguage();
    this.container.innerHTML = '';
    this.items.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.role = 'option';
      btn.className = `command-option${index === this.selectedIndex ? ' is-selected' : ''}`;
      btn.setAttribute('aria-selected', index === this.selectedIndex ? 'true' : 'false');

      const code = document.createElement('code');
      code.textContent = item.command;

      const desc = document.createElement('span');
      desc.textContent = lang === 'en' ? `${item.cefr} · ${item.labelEn}` : `${item.cefr} · ${item.labelEs}`;

      btn.append(code, desc);
      btn.addEventListener('click', () => {
        this.onSelect?.(item.command);
        this.hide();
      });
      this.container.appendChild(btn);
    });

    this.container.hidden = false;
  }
}
