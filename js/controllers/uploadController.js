/**
 * Controlador OOP para la validación e ingesta de archivos docs.pdf hacia Qdrant.
 */
export class UploadController {
  /**
   * @param {object} deps
   * @param {Document} deps.doc
   * @param {import('../services/apiClient.js').ApiClient} deps.apiClient
   * @param {import('../services/i18nManager.js').I18nManager} deps.i18n
   * @param {import('../views/libraryView.js').LibraryView} deps.libraryView
   * @param {number} [deps.maxPdfSizeBytes=15728640]
   */
  constructor({ doc, apiClient, i18n, libraryView, maxPdfSizeBytes = 15 * 1024 * 1024 }) {
    this.doc = doc;
    this.apiClient = apiClient;
    this.i18n = i18n;
    this.libraryView = libraryView;
    this.maxPdfSizeBytes = maxPdfSizeBytes;
    this.selectedFile = null;
    this.#bindEvents();
  }

  async refreshKnowledgePanel() {
    try {
      const [status, docsData] = await Promise.all([
        this.apiClient.getQdrantStatus(),
        this.apiClient.listDocuments()
      ]);
      const combined = [
        ...(docsData.recentUploads || []),
        ...(docsData.qdrantSources || [])
      ];
      this.libraryView.renderKnowledgePanel(status, combined);
    } catch {
      this.libraryView.renderKnowledgePanel(null, []);
    }
  }

  #setSelectedFile(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.libraryView.setUploadStatus(this.i18n.t('upload_bad_type'));
      this.selectedFile = null;
      return;
    }
    if (file.size > this.maxPdfSizeBytes) {
      this.libraryView.setUploadStatus(this.i18n.t('upload_too_large'));
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
    this.libraryView.setSelectedFileName(`${file.name} (${Math.ceil(file.size / 1024)} KB)`);
    this.libraryView.setUploadStatus('');
  }

  #bindEvents() {
    const form = this.doc.getElementById('pdf-upload-form');
    const fileInput = this.doc.getElementById('pdf-file-input');
    const dropzone = this.doc.getElementById('pdf-dropzone');
    const levelSelect = this.doc.getElementById('pdf-level-select');
    const refreshBtn = this.doc.getElementById('refresh-qdrant-btn');

    fileInput?.addEventListener('change', () => {
      this.#setSelectedFile(fileInput.files?.[0] || null);
    });

    dropzone?.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropzone.classList.add('is-dragover');
    });

    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('is-dragover');
    });

    dropzone?.addEventListener('drop', (event) => {
      event.preventDefault();
      dropzone.classList.remove('is-dragover');
      this.#setSelectedFile(event.dataTransfer?.files?.[0] || null);
    });

    refreshBtn?.addEventListener('click', () => this.refreshKnowledgePanel());

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!this.selectedFile) {
        this.libraryView.setUploadStatus(this.i18n.t('upload_no_file'));
        return;
      }

      this.libraryView.setUploadStatus(this.i18n.t('upload_uploading'), true);
      try {
        await this.apiClient.uploadPdf(this.selectedFile, levelSelect?.value || 'general');
        this.libraryView.setUploadStatus(this.i18n.t('upload_success'), false);
        this.selectedFile = null;
        if (fileInput) fileInput.value = '';
        this.libraryView.setSelectedFileName('');
        await this.refreshKnowledgePanel();
      } catch (error) {
        this.libraryView.setUploadStatus(`${this.i18n.t('upload_error')}${error.message}`, false);
      }
    });
  }
}
