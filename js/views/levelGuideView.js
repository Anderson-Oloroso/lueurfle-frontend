import { CommandHelper } from '../utils/commandHelper.js';

/**
 * Vista modular que presenta el perfil OCEAN (Big Five) de Lueur y las 3 fases CEFR.
 */
export class LevelGuideView {
  static OCEAN_TRAITS = Object.freeze([
    {
      key: 'O',
      score: 85,
      nameEs: 'Apertura (O)',
      nameEn: 'Openness (O)',
      descEs: 'Analogías culturales francófonas y escenarios cotidianos reales.',
      descEn: 'Francophone cultural analogies and real-life daily scenarios.'
    },
    {
      key: 'C',
      score: 92,
      nameEs: 'Responsabilidad (C)',
      nameEn: 'Conscientiousness (C)',
      descEs: 'Progresión CEFR rigurosa y respuestas fundamentadas en Qdrant.',
      descEn: 'Strict CEFR progression and answers grounded in Qdrant.'
    },
    {
      key: 'E',
      score: 72,
      nameEs: 'Extraversión (E)',
      nameEn: 'Extraversion (E)',
      descEs: 'Diálogo cálido y motivador que invita a practicar en voz activa.',
      descEn: 'Warm, motivating dialogue encouraging active French practice.'
    },
    {
      key: 'A',
      score: 90,
      nameEs: 'Amabilidad (A)',
      nameEn: 'Agreeableness (A)',
      descEs: 'Corrección respetuosa, paciencia pedagógica y refuerzo positivo.',
      descEn: 'Respectful feedback, pedagogical patience, and positive reinforcement.'
    },
    {
      key: 'N',
      score: 10,
      nameEs: 'Serenidad / Bajo Neuroticismo (N)',
      nameEn: 'Composure / Low Neuroticism (N)',
      descEs: 'Calma total ante errores o intentos de desvío fuera del francés.',
      descEn: 'Complete composure facing mistakes or off-topic prompts.'
    }
  ]);

  /**
   * @param {object} params
   * @param {Document} params.doc
   * @param {import('../services/i18nManager.js').I18nManager} params.i18n
   * @param {(level: string) => void} params.onActivateLevel
   */
  constructor({ doc, i18n, onActivateLevel }) {
    this.doc = doc;
    this.i18n = i18n;
    this.onActivateLevel = onActivateLevel;
    this.oceanGridEl = doc.getElementById('ocean-traits-grid');
    this.levelsGridEl = doc.getElementById('levels-detail-grid');
  }

  render() {
    const lang = this.i18n.getLanguage();

    if (this.oceanGridEl) {
      this.oceanGridEl.innerHTML = '';
      LevelGuideView.OCEAN_TRAITS.forEach((trait) => {
        const card = this.doc.createElement('article');
        card.className = 'ocean-card';

        const title = this.doc.createElement('h2');
        title.textContent = `${lang === 'en' ? trait.nameEn : trait.nameEs} · ${trait.score}/100`;

        const meter = this.doc.createElement('div');
        meter.className = 'ocean-meter';
        const fill = this.doc.createElement('div');
        fill.className = 'ocean-meter__fill';
        fill.style.width = `${trait.score}%`;
        meter.appendChild(fill);

        const desc = this.doc.createElement('p');
        desc.textContent = lang === 'en' ? trait.descEn : trait.descEs;

        card.append(title, meter, desc);
        this.oceanGridEl.appendChild(card);
      });
    }

    if (this.levelsGridEl) {
      this.levelsGridEl.innerHTML = '';
      CommandHelper.COMMANDS.forEach((cmd) => {
        const card = this.doc.createElement('article');
        card.className = 'level-detail-card';

        const badge = this.doc.createElement('span');
        badge.className = `badge badge--${cmd.level}`;
        badge.textContent = `${cmd.command} · ${cmd.cefr}`;

        const desc = this.doc.createElement('p');
        desc.textContent = lang === 'en' ? cmd.labelEn : cmd.labelEs;

        const btn = this.doc.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn--secondary btn--sm';
        btn.textContent = this.i18n.t('btn_activate_phase');
        btn.addEventListener('click', () => this.onActivateLevel?.(cmd.level));

        card.append(badge, desc, btn);
        this.levelsGridEl.appendChild(card);
      });
    }
  }
}
