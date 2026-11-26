/**
 * Gestor estricto de idioma de interfaz: soporta ÚNICAMENTE Español ('es') e Inglés ('en').
 */
export class I18nManager {
  static SUPPORTED_LANGUAGES = Object.freeze(['es', 'en']);
  static STORAGE_KEY = 'lueur-lang';

  static DICTIONARIES = Object.freeze({
    es: Object.freeze({
      skip_to_content: 'Saltar al contenido principal',
      aria_toggle_sidebar: 'Alternar panel de sesiones',
      aria_main_nav: 'Navegación principal',
      aria_lang_toggle: 'Cambiar idioma entre español e inglés',
      aria_theme_toggle: 'Cambiar entre modo claro y oscuro',
      aria_sidebar: 'Sesiones y comandos rápidos',
      aria_level_grid: 'Selector rápido de nivel',
      nav_welcome: 'Inicio',
      nav_chat: 'Tutor Chat',
      nav_library: 'Base PDF · Qdrant',
      nav_guide: 'Fases y OCEAN',
      toggle_lang_label: 'ES / EN',
      theme_to_dark: 'Oscuro',
      theme_to_light: 'Claro',
      sidebar_sessions: 'Sesiones',
      btn_new_session: '+ Nueva',
      sidebar_phases: 'Comandos de fase',
      sidebar_qdrant: 'Conocimiento Qdrant',
      qdrant_checking: 'Verificando Qdrant...',
      qdrant_offline: 'Backend / Qdrant fuera de línea (modo local activo).',
      qdrant_online: 'Qdrant activo · {count} vectores indexados.',
      welcome_eyebrow: 'Tutoría exclusiva de francés · RAG en Qdrant',
      welcome_title: 'Aprende francés con calidez, método y progresión real.',
      welcome_subtitle:
        'Lueur te acompaña paso a paso con una personalidad OCEAN paciente y estructurada. Elige tu fase con comandos rápidos y practica con el respaldo de tus documentos PDF en Qdrant.',
      welcome_cta_chat: 'Comenzar a practicar',
      welcome_cta_pdf: 'Cargar docs.pdf',
      welcome_emblem_caption: 'Lueur · Solo Francés (FLE)',
      level_basico_title: 'Fase Básica',
      level_basico_desc: 'Saludos, pronunciación amigable, vocabulario cotidiano y presente simple sin prisa.',
      level_intermedio_title: 'Fase Intermedia',
      level_intermedio_desc: 'Diálogos fluidos, passé composé e imparfait, conectores y corrección precisa.',
      level_avanzado_title: 'Fase Avanzada',
      level_avanzado_desc: 'Inmersión en francés, subjuntivo, expresiones idiomáticas y matices estilísticos.',
      btn_activate_phase: 'Activar fase',
      chat_title: 'Sesión con Lueur',
      chat_hint: 'Escribe /basico, /intermedio o /avanzado en cualquier momento para cambiar de fase.',
      chat_input_label: 'Mensaje para Lueur',
      chat_placeholder: 'Escribe en francés, pregunta una regla o usa /basico, /intermedio, /avanzado...',
      chat_tip: 'Enter para enviar · Shift+Enter para nueva línea · Solo Francés',
      btn_send: 'Enviar',
      library_title: 'Base de Conocimiento PDF · Qdrant',
      library_subtitle: 'Importa guías y manuales docs.pdf para generar embeddings de 3072 dimensiones en Qdrant mediante n8n.',
      upload_drop_title: 'Selecciona o arrastra tu archivo .pdf',
      upload_drop_hint: 'Solo archivos PDF válidos (%PDF-)',
      upload_level_label: 'Etiqueta de nivel en Qdrant',
      opt_general: 'General (A1–C2)',
      opt_basico: 'Básico (/basico)',
      opt_intermedio: 'Intermedio (/intermedio)',
      opt_avanzado: 'Avanzado (/avanzado)',
      btn_upload_pdf: 'Indexar PDF en Qdrant',
      qdrant_panel_title: 'Colección Vectorial Activa',
      btn_refresh: 'Actualizar',
      qdrant_sources_title: 'Documentos detectados',
      guide_title: 'Fases Pedagógicas y Personalidad OCEAN',
      guide_subtitle: 'Cómo adapta Lueur su tono Big Five y su rigor lingüístico según tu nivel.',
      footer_text: 'Lueur FLE · Tutor estricto de francés con personalidad OCEAN y Qdrant · Por Anderson-Oloroso',
      msg_you: 'Tú',
      msg_lueur: 'Lueur · Tutor FLE',
      msg_sources: 'Fuentes Qdrant:',
      msg_thinking: 'Lueur está consultando Qdrant y redactando tu lección...',
      msg_backend_offline:
        'No pude conectar con el backend en este momento. Verifica que lueurfle-backend y n8n estén activos.',
      upload_no_file: 'Selecciona primero un archivo docs.pdf válido.',
      upload_bad_type: 'Solo se admiten archivos con extensión .pdf.',
      upload_too_large: 'El PDF supera el límite de 15 MB.',
      upload_uploading: 'Enviando PDF a n8n para generar embeddings en Qdrant...',
      upload_success: 'PDF indexado correctamente en Qdrant.',
      upload_error: 'No se pudo indexar el PDF: ',
      no_sources: 'Aún no se detectan documentos indexados o Qdrant está sin conexión.'
    }),
    en: Object.freeze({
      skip_to_content: 'Skip to main content',
      aria_toggle_sidebar: 'Toggle sessions sidebar',
      aria_main_nav: 'Main navigation',
      aria_lang_toggle: 'Switch language between Spanish and English',
      aria_theme_toggle: 'Switch between light and dark theme',
      aria_sidebar: 'Sessions and quick commands',
      aria_level_grid: 'Quick level selector',
      nav_welcome: 'Home',
      nav_chat: 'Tutor Chat',
      nav_library: 'PDF Base · Qdrant',
      nav_guide: 'Phases & OCEAN',
      toggle_lang_label: 'ES / EN',
      theme_to_dark: 'Dark',
      theme_to_light: 'Light',
      sidebar_sessions: 'Sessions',
      btn_new_session: '+ New',
      sidebar_phases: 'Phase commands',
      sidebar_qdrant: 'Qdrant Knowledge',
      qdrant_checking: 'Checking Qdrant...',
      qdrant_offline: 'Backend / Qdrant offline (local UI mode).',
      qdrant_online: 'Qdrant active · {count} indexed vectors.',
      welcome_eyebrow: 'French-only tutoring · Qdrant RAG',
      welcome_title: 'Learn French with warmth, structure, and real progression.',
      welcome_subtitle:
        'Lueur guides you step by step with a patient, structured OCEAN personality. Pick your phase using quick commands and study backed by your PDF documents in Qdrant.',
      welcome_cta_chat: 'Start practicing',
      welcome_cta_pdf: 'Upload docs.pdf',
      welcome_emblem_caption: 'Lueur · French Only (FLE)',
      level_basico_title: 'Basic Phase',
      level_basico_desc: 'Greetings, friendly pronunciation hints, everyday vocabulary, and simple present tense.',
      level_intermedio_title: 'Intermediate Phase',
      level_intermedio_desc: 'Natural dialogues, passé composé & imparfait, logical connectors, and targeted feedback.',
      level_avanzado_title: 'Advanced Phase',
      level_avanzado_desc: 'French immersion, subjunctive mood, idiomatic expressions, and stylistic nuance.',
      btn_activate_phase: 'Activate phase',
      chat_title: 'Session with Lueur',
      chat_hint: 'Type /basico, /intermedio, or /avanzado at any time to switch phases.',
      chat_input_label: 'Message for Lueur',
      chat_placeholder: 'Write in French, ask a grammar question, or use /basico, /intermedio, /avanzado...',
      chat_tip: 'Enter to send · Shift+Enter for new line · French Only',
      btn_send: 'Send',
      library_title: 'PDF Knowledge Base · Qdrant',
      library_subtitle: 'Import docs.pdf guides to generate 3072-dimension embeddings in Qdrant via n8n.',
      upload_drop_title: 'Choose or drag your .pdf file',
      upload_drop_hint: 'Valid PDF files only (%PDF-)',
      upload_level_label: 'Level tag in Qdrant',
      opt_general: 'General (A1–C2)',
      opt_basico: 'Basic (/basico)',
      opt_intermedio: 'Intermediate (/intermedio)',
      opt_avanzado: 'Advanced (/avanzado)',
      btn_upload_pdf: 'Index PDF in Qdrant',
      qdrant_panel_title: 'Active Vector Collection',
      btn_refresh: 'Refresh',
      qdrant_sources_title: 'Detected documents',
      guide_title: 'Pedagogical Phases & OCEAN Personality',
      guide_subtitle: 'How Lueur adapts its Big Five tone and linguistic rigor to your level.',
      footer_text: 'Lueur FLE · Strict French tutor with OCEAN personality and Qdrant · By Anderson-Oloroso',
      msg_you: 'You',
      msg_lueur: 'Lueur · FLE Tutor',
      msg_sources: 'Qdrant sources:',
      msg_thinking: 'Lueur is querying Qdrant and preparing your French lesson...',
      msg_backend_offline:
        'Could not reach the backend right now. Please make sure lueurfle-backend and n8n are running.',
      upload_no_file: 'Please select a valid docs.pdf file first.',
      upload_bad_type: 'Only .pdf files are supported.',
      upload_too_large: 'The PDF exceeds the 15 MB limit.',
      upload_uploading: 'Sending PDF to n8n to generate embeddings in Qdrant...',
      upload_success: 'PDF successfully indexed into Qdrant.',
      upload_error: 'Could not index the PDF: ',
      no_sources: 'No indexed documents detected yet or Qdrant is unreachable.'
    })
  });

  /**
   * @param {object} [options]
   * @param {Document} [options.doc]
   * @param {Storage} [options.storage]
   */
  constructor({
    doc = typeof document !== 'undefined' ? document : null,
    storage = typeof localStorage !== 'undefined' ? localStorage : null
  } = {}) {
    this.doc = doc;
    this.storage = storage;
    this.currentLanguage = this.#loadInitialLanguage();
    this.listeners = new Set();
  }

  /**
   * @returns {'es'|'en'}
   */
  #loadInitialLanguage() {
    try {
      const saved = this.storage?.getItem(I18nManager.STORAGE_KEY);
      if (I18nManager.SUPPORTED_LANGUAGES.includes(saved)) {
        return saved;
      }
    } catch {
      // Ignore storage access restrictions
    }
    return 'es';
  }

  /**
   * @returns {'es'|'en'}
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Aplica estrictamente 'es' o 'en'. Rechaza cualquier tercer idioma.
   * @param {'es'|'en'} lang
   * @returns {'es'|'en'}
   */
  setLanguage(lang) {
    if (!I18nManager.SUPPORTED_LANGUAGES.includes(lang)) {
      throw new Error(`Unsupported UI language "${lang}". Only "es" and "en" are allowed.`);
    }
    this.currentLanguage = lang;
    try {
      this.storage?.setItem(I18nManager.STORAGE_KEY, lang);
    } catch {
      // Ignore storage restrictions
    }
    this.applyTranslations();
    this.listeners.forEach((cb) => cb(this.currentLanguage));
    return this.currentLanguage;
  }

  /**
   * Alterna exclusivamente entre 'es' y 'en'.
   * @returns {'es'|'en'}
   */
  toggleLanguage() {
    return this.setLanguage(this.currentLanguage === 'es' ? 'en' : 'es');
  }

  /**
   * Obtiene una cadena traducida con interpolación opcional {clave}.
   * @param {string} key
   * @param {Record<string, string|number>} [vars]
   * @returns {string}
   */
  t(key, vars = {}) {
    const dict = I18nManager.DICTIONARIES[this.currentLanguage] || I18nManager.DICTIONARIES.es;
    let value = dict[key] ?? I18nManager.DICTIONARIES.es[key] ?? key;
    for (const [varName, varValue] of Object.entries(vars)) {
      value = value.replaceAll(`{${varName}}`, String(varValue));
    }
    return value;
  }

  /**
   * Aplica traducciones al DOM actual.
   */
  applyTranslations() {
    if (!this.doc) return;
    this.doc.documentElement.setAttribute('lang', this.currentLanguage);

    this.doc.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = this.t(key);
    });

    this.doc.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', this.t(key));
    });

    this.doc.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', this.t(key));
    });

    const codeBadge = this.doc.getElementById('lang-toggle-code');
    if (codeBadge) {
      codeBadge.textContent = this.currentLanguage.toUpperCase();
    }
  }

  /**
   * @param {(lang: 'es'|'en') => void} listener
   */
  onChange(listener) {
    this.listeners.add(listener);
  }
}
