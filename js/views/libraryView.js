/**
 * Vista modular para importar docs.pdf y visualizar métricas reales de Qdrant.
 */
export class LibraryView {
  /**
   * @param {object} params
   * @param {Document} params.doc
   * @param {import('../services/i18nManager.js').I18nManager} params.i18n
   */
  constructor({ doc, i18n }) {
    this.doc = doc;
    this.i18n = i18n;
    this.statusEl = doc.getElementById('upload-status');
    this.selectedNameEl = doc.getElementById('pdf-selected-name');
    this.metricsEl = doc.getElementById('qdrant-metrics');
    this.sourcesEl = doc.getElementById('qdrant-sources-list');
    this.sidebarStatusEl = doc.getElementById('qdrant-sidebar-status');
    this.uploadBtn = doc.getElementById('upload-pdf-btn');
  }

  /**
   * @param {string} filename
   */
  setSelectedFileName(filename) {
    if (this.selectedNameEl) {
      this.selectedNameEl.textContent = filename || this.i18n.t('upload_drop_hint');
    }
  }

  /**
   * @param {string} message
   * @param {boolean} [isUploading=false]
   */
  setUploadStatus(message, isUploading = false) {
    if (this.statusEl) this.statusEl.textContent = message;
    if (this.uploadBtn) this.uploadBtn.disabled = isUploading;
  }

  /**
   * Renderiza estado de la colección Qdrant y fuentes indexadas.
   * @param {object|null} qdrantStatus
   * @param {Array<object>} sources
   */
  renderKnowledgePanel(qdrantStatus, sources = []) {
    const lang = this.i18n.getLanguage();
    if (this.sidebarStatusEl) {
      if (!qdrantStatus || !qdrantStatus.reachable) {
        this.sidebarStatusEl.textContent = this.i18n.t('qdrant_offline');
      } else {
        this.sidebarStatusEl.textContent = this.i18n.t('qdrant_online', {
          count: qdrantStatus.pointsCount ?? 0
        });
      }
    }

    if (this.metricsEl) {
      this.metricsEl.innerHTML = '';
      const metrics = [
        {
          label: lang === 'en' ? 'Collection' : 'Colección',
          value: qdrantStatus?.collectionName || 'lueurfle_french_3072'
        },
        {
          label: lang === 'en' ? 'Status' : 'Estado',
          value: qdrantStatus?.status || 'offline'
        },
        {
          label: lang === 'en' ? 'Points' : 'Puntos',
          value: String(qdrantStatus?.pointsCount ?? 0)
        },
        {
          label: lang === 'en' ? 'Indexed vectors' : 'Vectores indexados',
          value: String(qdrantStatus?.indexedVectorsCount ?? 0)
        }
      ];

      metrics.forEach((metric) => {
        const box = this.doc.createElement('div');
        box.className = 'metric-box';
        const dt = this.doc.createElement('dt');
        dt.textContent = metric.label;
        const dd = this.doc.createElement('dd');
        dd.textContent = metric.value;
        box.append(dt, dd);
        this.metricsEl.appendChild(box);
      });
    }

    if (this.sourcesEl) {
      this.sourcesEl.innerHTML = '';
      if (!sources.length) {
        const li = this.doc.createElement('li');
        li.className = 'source-item';
        li.textContent = this.i18n.t('no_sources');
        this.sourcesEl.appendChild(li);
        return;
      }

      sources.forEach((item) => {
        const li = this.doc.createElement('li');
        li.className = 'source-item';

        const name = this.doc.createElement('span');
        name.textContent = item.source || item.originalName || 'docs.pdf';

        const tag = this.doc.createElement('span');
        tag.className = `badge badge--${item.level && item.level !== 'general' ? item.level : 'basico'}`;
        tag.textContent = item.level || item.levelTag || 'general';

        li.append(name, tag);
        this.sourcesEl.appendChild(li);
      });
    }
  }
}
