/**
 * Utilidad OOP para el catálogo de comandos slash (/basico, /intermedio, /avanzado)
 * y renderizado seguro sin XSS de respuestas Markdown ligeras.
 */
export class CommandHelper {
  static COMMANDS = Object.freeze([
    Object.freeze({
      command: '/basico',
      level: 'basico',
      cefr: 'A1-A2',
      labelEs: 'Básico · Primeros pasos en francés',
      labelEn: 'Basic · First steps in French'
    }),
    Object.freeze({
      command: '/intermedio',
      level: 'intermedio',
      cefr: 'B1-B2',
      labelEs: 'Intermedio · Fluidez y tiempos verbales',
      labelEn: 'Intermediate · Fluency and tenses'
    }),
    Object.freeze({
      command: '/avanzado',
      level: 'avanzado',
      cefr: 'C1-C2',
      labelEs: 'Avanzado · Inmersión y matices',
      labelEn: 'Advanced · Immersion and nuance'
    })
  ]);

  /**
   * Filtra comandos sugeridos cuando el usuario escribe un slash '/' al inicio.
   * @param {string} input
   * @returns {Array<object>}
   */
  static filterSuggestions(input) {
    const text = String(input || '').trimStart();
    if (!text.startsWith('/') || /\s/.test(text)) {
      return [];
    }
    const normalized = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    return CommandHelper.COMMANDS.filter((item) => item.command.startsWith(normalized));
  }

  /**
   * Detecta el comando y el nivel correspondiente al inicio de un mensaje.
   * @param {string} rawMessage
   * @returns {{ command: string|null, level: 'basico'|'intermedio'|'avanzado'|null, cleanMessage: string }}
   */
  static parse(rawMessage) {
    const trimmed = String(rawMessage || '').trim();
    const match = trimmed.match(/^\/(basico|intermedio|avanzado)(?:\s+([\s\S]*))?$/i);
    if (!match) {
      return { command: null, level: null, cleanMessage: trimmed };
    }
    const level = match[1].toLowerCase();
    return {
      command: `/${level}`,
      level,
      cleanMessage: (match[2] || '').trim()
    };
  }

  /**
   * Escapa HTML peligroso y convierte énfasis básico (**negrita**, *cursiva*, `código`) de forma segura.
   * @param {string} rawText
   * @returns {string}
   */
  static formatSafeHtml(rawText) {
    const escaped = String(rawText || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

    const paragraphs = escaped.split(/\n{2,}/);
    return paragraphs
      .map((block) => {
        const inline = block
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br>');
        return `<p>${inline}</p>`;
      })
      .join('');
  }
}
