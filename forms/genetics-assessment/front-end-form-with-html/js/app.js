// Genetics Assessment - clinical wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure genetics scoring engine and renders an inline report. State
// is persisted to localStorage so a partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.GeneticsAssessment`. Pulling them off here keeps the
// rest of this file referring to short local names.
(function () {
'use strict';

const NS = window.GeneticsAssessment;
const {
  emptyAssessment,
  emptyRelative,
  riskLevelLabel,
  riskLevelClass,
  calculateAge,
  calculateManchesterScore,
  countBethesdaMet,
  gradeGenetics,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'genetics-assessment.front-end-form-with-html.v1';

/** Merge saved state on top of an empty fresh state, so that newly-added
 *  fields default correctly when older saved state is rehydrated. */
function deepMerge(fresh, saved) {
  if (saved === null || saved === undefined) return fresh;
  if (Array.isArray(fresh)) {
    return Array.isArray(saved) ? saved : fresh;
  }
  if (typeof fresh === 'object' && fresh !== null) {
    if (typeof saved !== 'object' || saved === null) return fresh;
    const out = {};
    for (const key of Object.keys(fresh)) {
      out[key] = deepMerge(fresh[key], saved[key]);
    }
    // Carry over any keys in saved that are not in fresh too (defensive)
    for (const key of Object.keys(saved)) {
      if (!(key in out)) out[key] = saved[key];
    }
    return out;
  }
  return saved !== undefined ? saved : fresh;
}

/** @returns {import('./types.js').AssessmentData} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    return deepMerge(emptyAssessment(), parsed);
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save assessment to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored assessment.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').AssessmentData} */
let state = loadState();

/** @type {import('./types.js').GradingResult | null} */
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/** Resolve a dotted path like 'targetedRiskScoring.manchester' to a nested
 *  object reference within `state`. */
function resolvePath(path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), state);
}

/**
 * Set a deeply-nested field. `section` may be a dotted path
 * (e.g. 'targetedRiskScoring.manchester'); `field` is the leaf key.
 *
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  const obj = resolvePath(section);
  if (!obj) return;
  obj[field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
  refreshLiveScores();
}

/** Escape user-entered text for safe rendering. */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ----------------------------------------------------------------------
// Component builders
// ----------------------------------------------------------------------

/**
 * Build a labelled text input.
 * @param {{ label: string, section: string, field: string, type?: string,
 *           placeholder?: string, required?: boolean, min?: number,
 *           max?: number, step?: number, unit?: string, hint?: string }} opts
 */
function textInput(opts) {
  const id = `${opts.section.replace(/\./g, '-')}-${opts.field}`;
  const value = resolvePath(opts.section)[opts.field];
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="text-input"`,
    `value="${esc(value ?? '')}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required');
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
    ${opts.hint ? `<p class="hint">${esc(opts.hint)}</p>` : ''}
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') {
      v = v === '' ? null : Number(v);
    }
    setField(opts.section, opts.field, v);
  });
  return wrapper;
}

/**
 * Build a labelled multi-line text area.
 * @param {{ label: string, section: string, field: string, rows?: number,
 *           placeholder?: string, hint?: string }} opts
 */
function textArea(opts) {
  const id = `${opts.section.replace(/\./g, '-')}-${opts.field}`;
  const value = resolvePath(opts.section)[opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      class="text-area-input">${esc(value)}</textarea>
    ${opts.hint ? `<p class="hint">${esc(opts.hint)}</p>` : ''}
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => setField(opts.section, opts.field, ta.value));
  return wrapper;
}

/**
 * Build a select / dropdown input.
 * @param {{ label: string, section: string, field: string,
 *           options: { value: string, label: string }[] }} opts
 */
function selectInput(opts) {
  const id = `${opts.section.replace(/\./g, '-')}-${opts.field}`;
  const current = resolvePath(opts.section)[opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select">${optionsHtml}</select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
  return wrapper;
}

/**
 * Build a radio group.
 * @param {{ label: string, section: string, field: string,
 *           options: { value: string, label: string }[], hint?: string }} opts
 */
function radioGroup(opts) {
  const groupId = `${opts.section.replace(/\./g, '-')}-${opts.field}`;
  const current = resolvePath(opts.section)[opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.textContent = opts.label;
  wrapper.appendChild(legend);

  if (opts.hint) {
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = opts.hint;
    wrapper.appendChild(hint);
  }

  const list = document.createElement('div');
  list.className = 'radio-options';
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.className = 'radio-option';
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    label.innerHTML = `
      <input type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) setField(opts.section, opts.field, option.value);
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  return wrapper;
}

/**
 * Build a section card.
 * @param {{ stepNumber: number, title: string, description?: string }} opts
 */
function sectionCard(opts) {
  const card = document.createElement('section');
  card.className = 'section-card';
  card.dataset.step = String(opts.stepNumber);
  card.id = `step-${opts.stepNumber}`;
  const desc = opts.description
    ? `<p class="section-description">${esc(opts.description)}</p>`
    : '';
  card.innerHTML = `
    <header class="section-header">
      <span class="section-step">Section ${opts.stepNumber} of 9</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

/** Build a sub-section header. */
function subHeader(text, first) {
  const h = document.createElement('h3');
  h.className = 'section-subheader' + (first ? ' first' : '');
  h.textContent = text;
  return h;
}

// ----------------------------------------------------------------------
// Repeating-list editors
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];
const yesNoUnknown = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: 'Unknown' }
];

const sexOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other / unknown' }
];

/**
 * Editor for the proband's own list of cancers
 * (PersonalMedicalHistory.cancers).
 */
function probandCancerEditor() {
  const wrapper = document.createElement('div');
  wrapper.className = 'list-editor';

  function rerender() {
    const rows = state.personalMedicalHistory.cancers;
    wrapper.innerHTML = '';
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'pedigree-tier-hint';
      empty.textContent = 'No cancers added.';
      wrapper.appendChild(empty);
    }
    rows.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = 'relative-row';
      r.innerHTML = `
        <div class="relative-row-header">
          <span class="relative-label">Cancer #${idx + 1}</span>
          <button type="button" class="btn btn-secondary btn-remove" aria-label="Remove cancer">Remove</button>
        </div>
        <div class="relative-grid three">
          <label class="relative-cell">
            <span>Type / site</span>
            <input type="text" class="text-input" data-key="type" value="${esc(row.type)}" placeholder="e.g. Breast, Ovarian, Colorectal">
          </label>
          <label class="relative-cell">
            <span>Age at diagnosis</span>
            <input type="number" class="text-input" data-key="ageAtDiagnosis" min="0" max="120" value="${row.ageAtDiagnosis ?? ''}">
          </label>
          <label class="relative-cell">
            <span>Bilateral?</span>
            <select class="select" data-key="bilateral">
              <option value=""${row.bilateral === '' ? ' selected' : ''}>—</option>
              <option value="yes"${row.bilateral === 'yes' ? ' selected' : ''}>Yes</option>
              <option value="no"${row.bilateral === 'no' ? ' selected' : ''}>No</option>
            </select>
          </label>
        </div>
        <div class="relative-grid">
          <label class="relative-cell">
            <span>Treatment / notes</span>
            <input type="text" class="text-input" data-key="treatment" value="${esc(row.treatment)}" placeholder="e.g. surgery + chemo">
          </label>
        </div>
      `;
      r.querySelectorAll('input, select').forEach((inp) => {
        const handler = () => {
          const k = inp.dataset.key;
          let v = inp.value;
          if (k === 'ageAtDiagnosis') v = v === '' ? null : Number(v);
          rows[idx][k] = v;
          saveState(state);
          updateProgress();
          refreshLiveScores();
        };
        inp.addEventListener('input', handler);
        inp.addEventListener('change', handler);
      });
      r.querySelector('.btn-remove').addEventListener('click', () => {
        rows.splice(idx, 1);
        saveState(state);
        rerender();
        updateProgress();
        refreshLiveScores();
      });
      wrapper.appendChild(r);
    });

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'button';
    addBtn.setAttribute('data-variant', 'secondary');
    addBtn.textContent = '+ Add cancer';
    addBtn.style.marginTop = '0.5rem';
    addBtn.addEventListener('click', () => {
      rows.push({ type: '', ageAtDiagnosis: null, bilateral: '', treatment: '' });
      saveState(state);
      rerender();
      updateProgress();
      refreshLiveScores();
    });
    wrapper.appendChild(addBtn);
  }

  rerender();
  return wrapper;
}

/**
 * Editor for one fixed-slot Relative (e.g. mother, paternal grandmother).
 * `path` is the dotted path within state.familyPedigree to the relative.
 *
 * @param {{ path: string, label: string, side: 'maternal' | 'paternal' | 'self' }} opts
 */
function fixedRelativeEditor(opts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative-row fixed';

  function rerender() {
    const r = resolvePath(`familyPedigree.${opts.path}`);
    wrapper.innerHTML = `
      <div class="relative-row-header">
        <span class="relative-label">${esc(opts.label)}</span>
      </div>
      <div class="relative-grid">
        <label class="relative-cell">
          <span>Name (optional)</span>
          <input type="text" class="text-input" data-key="name" value="${esc(r.name)}" placeholder="Initials or first name">
        </label>
        <label class="relative-cell">
          <span>Affected with cancer?</span>
          <select class="select" data-key="affectedWithCancer">
            <option value=""${r.affectedWithCancer === '' ? ' selected' : ''}>—</option>
            <option value="yes"${r.affectedWithCancer === 'yes' ? ' selected' : ''}>Yes</option>
            <option value="no"${r.affectedWithCancer === 'no' ? ' selected' : ''}>No</option>
            <option value="unknown"${r.affectedWithCancer === 'unknown' ? ' selected' : ''}>Unknown</option>
          </select>
        </label>
      </div>
      <div class="relative-grid three">
        <label class="relative-cell">
          <span>Deceased?</span>
          <select class="select" data-key="deceased">
            <option value=""${r.deceased === '' ? ' selected' : ''}>—</option>
            <option value="yes"${r.deceased === 'yes' ? ' selected' : ''}>Yes</option>
            <option value="no"${r.deceased === 'no' ? ' selected' : ''}>No</option>
            <option value="unknown"${r.deceased === 'unknown' ? ' selected' : ''}>Unknown</option>
          </select>
        </label>
        <label class="relative-cell">
          <span>Age at death</span>
          <input type="number" class="text-input" data-key="ageAtDeath" min="0" max="120" value="${r.ageAtDeath ?? ''}">
        </label>
        <label class="relative-cell">
          <span>Cause of death</span>
          <input type="text" class="text-input" data-key="causeOfDeath" value="${esc(r.causeOfDeath)}" placeholder="If known">
        </label>
      </div>
      <div class="relative-grid">
        <label class="relative-cell">
          <span>Notes (other conditions)</span>
          <input type="text" class="text-input" data-key="notes" value="${esc(r.notes)}" placeholder="e.g. cardiac, neurological">
        </label>
      </div>
      <div data-cancer-host></div>
    `;

    wrapper.querySelectorAll('input[data-key], select[data-key]').forEach((inp) => {
      const handler = () => {
        const k = inp.dataset.key;
        let v = inp.value;
        if (k === 'ageAtDeath') v = v === '' ? null : Number(v);
        r[k] = v;
        saveState(state);
        updateProgress();
        refreshLiveScores();
      };
      inp.addEventListener('input', handler);
      inp.addEventListener('change', handler);
    });

    const cancerHost = wrapper.querySelector('[data-cancer-host]');
    cancerHost.appendChild(relativeCancerEditor(r));
  }

  rerender();
  return wrapper;
}

/** Editor for the cancers array on a single Relative. */
function relativeCancerEditor(relative) {
  const host = document.createElement('div');
  host.style.marginTop = '0.5rem';

  function rerender() {
    host.innerHTML = '';
    const rows = relative.cancers;
    rows.forEach((row, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'relative-grid three';
      wrap.style.marginBottom = '0.375rem';
      wrap.innerHTML = `
        <label class="relative-cell">
          <span>Cancer ${idx + 1} type</span>
          <input type="text" class="text-input" data-key="type" value="${esc(row.type)}" placeholder="e.g. Breast">
        </label>
        <label class="relative-cell">
          <span>Age at diagnosis</span>
          <input type="number" class="text-input" data-key="ageAtDiagnosis" min="0" max="120" value="${row.ageAtDiagnosis ?? ''}">
        </label>
        <label class="relative-cell" style="justify-content:flex-end;">
          <span>&nbsp;</span>
          <button type="button" class="btn btn-secondary btn-remove">Remove cancer</button>
        </label>
      `;
      wrap.querySelectorAll('input').forEach((inp) => {
        inp.addEventListener('input', () => {
          const k = inp.dataset.key;
          let v = inp.value;
          if (k === 'ageAtDiagnosis') v = v === '' ? null : Number(v);
          rows[idx][k] = v;
          saveState(state);
          updateProgress();
          refreshLiveScores();
        });
      });
      wrap.querySelector('.btn-remove').addEventListener('click', () => {
        rows.splice(idx, 1);
        saveState(state);
        rerender();
        updateProgress();
        refreshLiveScores();
      });
      host.appendChild(wrap);
    });
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'button';
    addBtn.setAttribute('data-variant', 'secondary');
    addBtn.style.padding = '0.375rem 0.75rem';
    addBtn.style.fontSize = '0.8125rem';
    addBtn.textContent = '+ Add cancer to this relative';
    addBtn.addEventListener('click', () => {
      rows.push({ type: '', ageAtDiagnosis: null });
      saveState(state);
      rerender();
      updateProgress();
      refreshLiveScores();
    });
    host.appendChild(addBtn);
  }

  rerender();
  return host;
}

/**
 * Editor for an array of repeating Relatives (siblings, children, cousins,
 * aunts/uncles).
 *
 * @param {{ field: string, label: string, hint?: string,
 *           side: 'maternal' | 'paternal' | 'self', generation: 1|2|3,
 *           addLabel: string, defaultRelation: string }} opts
 */
function relativeListEditor(opts) {
  const wrapper = document.createElement('div');

  const header = document.createElement('h3');
  header.className = 'pedigree-tier-header';
  header.textContent = opts.label;
  wrapper.appendChild(header);

  if (opts.hint) {
    const hint = document.createElement('p');
    hint.className = 'pedigree-tier-hint';
    hint.textContent = opts.hint;
    wrapper.appendChild(hint);
  }

  const list = document.createElement('div');
  list.className = 'relative-list';
  wrapper.appendChild(list);

  function rerender() {
    list.innerHTML = '';
    const rows = state.familyPedigree[opts.field];

    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'pedigree-tier-hint';
      empty.textContent = 'None added.';
      list.appendChild(empty);
    }

    rows.forEach((r, idx) => {
      const row = document.createElement('div');
      row.className = 'relative-row';
      row.innerHTML = `
        <div class="relative-row-header">
          <span class="relative-label">${esc(opts.defaultRelation)} #${idx + 1}</span>
          <button type="button" class="btn btn-secondary btn-remove">Remove</button>
        </div>
        <div class="relative-grid three">
          <label class="relative-cell">
            <span>Name (optional)</span>
            <input type="text" class="text-input" data-key="name" value="${esc(r.name)}">
          </label>
          <label class="relative-cell">
            <span>Sex</span>
            <select class="select" data-key="sex">
              <option value=""${r.sex === '' ? ' selected' : ''}>—</option>
              <option value="female"${r.sex === 'female' ? ' selected' : ''}>Female</option>
              <option value="male"${r.sex === 'male' ? ' selected' : ''}>Male</option>
              <option value="other"${r.sex === 'other' ? ' selected' : ''}>Other / unknown</option>
            </select>
          </label>
          <label class="relative-cell">
            <span>Affected with cancer?</span>
            <select class="select" data-key="affectedWithCancer">
              <option value=""${r.affectedWithCancer === '' ? ' selected' : ''}>—</option>
              <option value="yes"${r.affectedWithCancer === 'yes' ? ' selected' : ''}>Yes</option>
              <option value="no"${r.affectedWithCancer === 'no' ? ' selected' : ''}>No</option>
              <option value="unknown"${r.affectedWithCancer === 'unknown' ? ' selected' : ''}>Unknown</option>
            </select>
          </label>
        </div>
        <div class="relative-grid three">
          <label class="relative-cell">
            <span>Deceased?</span>
            <select class="select" data-key="deceased">
              <option value=""${r.deceased === '' ? ' selected' : ''}>—</option>
              <option value="yes"${r.deceased === 'yes' ? ' selected' : ''}>Yes</option>
              <option value="no"${r.deceased === 'no' ? ' selected' : ''}>No</option>
              <option value="unknown"${r.deceased === 'unknown' ? ' selected' : ''}>Unknown</option>
            </select>
          </label>
          <label class="relative-cell">
            <span>Age at death</span>
            <input type="number" class="text-input" data-key="ageAtDeath" min="0" max="120" value="${r.ageAtDeath ?? ''}">
          </label>
          <label class="relative-cell">
            <span>Cause of death</span>
            <input type="text" class="text-input" data-key="causeOfDeath" value="${esc(r.causeOfDeath)}">
          </label>
        </div>
        <div class="relative-grid">
          <label class="relative-cell">
            <span>Notes</span>
            <input type="text" class="text-input" data-key="notes" value="${esc(r.notes)}">
          </label>
        </div>
        <div data-cancer-host></div>
      `;

      row.querySelectorAll('input[data-key], select[data-key]').forEach((inp) => {
        const handler = () => {
          const k = inp.dataset.key;
          let v = inp.value;
          if (k === 'ageAtDeath') v = v === '' ? null : Number(v);
          rows[idx][k] = v;
          saveState(state);
          updateProgress();
          refreshLiveScores();
        };
        inp.addEventListener('input', handler);
        inp.addEventListener('change', handler);
      });
      row.querySelector('.btn-remove').addEventListener('click', () => {
        rows.splice(idx, 1);
        saveState(state);
        rerender();
        updateProgress();
        refreshLiveScores();
      });
      const cancerHost = row.querySelector('[data-cancer-host]');
      cancerHost.appendChild(relativeCancerEditor(rows[idx]));

      list.appendChild(row);
    });

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'button';
    addBtn.setAttribute('data-variant', 'secondary');
    addBtn.style.marginTop = '0.5rem';
    addBtn.textContent = `+ ${opts.addLabel}`;
    addBtn.addEventListener('click', () => {
      rows.push(emptyRelative({
        relation: opts.defaultRelation,
        side: opts.side,
        generation: opts.generation
      }));
      saveState(state);
      rerender();
      updateProgress();
      refreshLiveScores();
    });
    list.appendChild(addBtn);
  }

  rerender();
  return wrapper;
}

/**
 * Editor for the prior-tests list (PriorGeneticTesting.priorTests).
 */
function priorTestEditor() {
  const wrapper = document.createElement('div');

  function rerender() {
    const rows = state.priorGeneticTesting.priorTests;
    wrapper.innerHTML = '';
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'pedigree-tier-hint';
      empty.textContent = 'No prior genetic tests recorded.';
      wrapper.appendChild(empty);
    }
    rows.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = 'relative-row';
      r.innerHTML = `
        <div class="relative-row-header">
          <span class="relative-label">Prior test #${idx + 1}</span>
          <button type="button" class="btn btn-secondary btn-remove">Remove</button>
        </div>
        <div class="relative-grid three">
          <label class="relative-cell">
            <span>Test name</span>
            <input type="text" class="text-input" data-key="testName" value="${esc(row.testName)}" placeholder="e.g. BRCA1/2 panel">
          </label>
          <label class="relative-cell">
            <span>Laboratory</span>
            <input type="text" class="text-input" data-key="laboratory" value="${esc(row.laboratory)}">
          </label>
          <label class="relative-cell">
            <span>Date</span>
            <input type="date" class="text-input" data-key="testDate" value="${esc(row.testDate)}">
          </label>
        </div>
        <div class="relative-grid">
          <label class="relative-cell">
            <span>Result summary</span>
            <input type="text" class="text-input" data-key="resultSummary" value="${esc(row.resultSummary)}" placeholder="e.g. No pathogenic variant identified">
          </label>
        </div>
      `;
      r.querySelectorAll('input').forEach((inp) => {
        inp.addEventListener('input', () => {
          rows[idx][inp.dataset.key] = inp.value;
          saveState(state);
          updateProgress();
        });
      });
      r.querySelector('.btn-remove').addEventListener('click', () => {
        rows.splice(idx, 1);
        saveState(state);
        rerender();
        updateProgress();
      });
      wrapper.appendChild(r);
    });
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'button';
    addBtn.setAttribute('data-variant', 'secondary');
    addBtn.style.marginTop = '0.5rem';
    addBtn.textContent = '+ Add prior test';
    addBtn.addEventListener('click', () => {
      rows.push({ testName: '', laboratory: '', testDate: '', resultSummary: '' });
      saveState(state);
      rerender();
      updateProgress();
    });
    wrapper.appendChild(addBtn);
  }

  rerender();
  return wrapper;
}

// ----------------------------------------------------------------------
// Section renderers (one per step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Proband Demographics',
    description: 'Basic identifying information for the patient (proband).'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First name', section: 'probandDemographics', field: 'firstName', required: true }));
  grid.appendChild(textInput({ label: 'Last name', section: 'probandDemographics', field: 'lastName', required: true }));
  card.appendChild(grid);

  const grid2 = document.createElement('div');
  grid2.className = 'two-col';
  grid2.appendChild(textInput({
    label: 'Date of birth', section: 'probandDemographics', field: 'dateOfBirth',
    type: 'date', required: true
  }));
  grid2.appendChild(radioGroup({
    label: 'Sex',
    section: 'probandDemographics',
    field: 'sex',
    options: sexOptions
  }));
  card.appendChild(grid2);

  const grid3 = document.createElement('div');
  grid3.className = 'two-col';
  grid3.appendChild(textInput({ label: 'Medical record number (MRN)', section: 'probandDemographics', field: 'mrn' }));
  grid3.appendChild(textInput({
    label: 'Preferred contact',
    section: 'probandDemographics', field: 'preferredContact',
    placeholder: 'Phone, email, etc.'
  }));
  card.appendChild(grid3);

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Presenting Concern',
    description: 'Why is the patient being seen in genetics today?'
  });

  card.appendChild(textArea({
    label: 'Chief concern (in patient\u2019s own words)',
    section: 'presentingConcern', field: 'chiefConcern',
    rows: 2,
    placeholder: 'e.g. "My mother had ovarian cancer at 47 and I want to know my risk."'
  }));

  card.appendChild(textArea({
    label: 'Reason for referral (clinician)',
    section: 'presentingConcern', field: 'referralReason',
    rows: 2
  }));

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Referring clinician',
    section: 'presentingConcern', field: 'referringClinician'
  }));
  grid.appendChild(selectInput({
    label: 'Urgency',
    section: 'presentingConcern', field: 'urgency',
    options: [
      { value: 'routine', label: 'Routine' },
      { value: 'soon', label: 'Soon (within 6 weeks)' },
      { value: 'urgent', label: 'Urgent (within 2 weeks)' }
    ]
  }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Suspected syndrome (if any)',
    section: 'presentingConcern', field: 'suspectedSyndrome',
    placeholder: 'e.g. HBOC, Lynch, Li-Fraumeni, FAP, etc.',
    hint: 'Leave blank if no syndrome is currently suspected.'
  }));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Personal Medical History',
    description: 'The proband\u2019s own medical, oncologic and developmental history.'
  });

  card.appendChild(radioGroup({
    label: 'Personal cancer history?',
    section: 'personalMedicalHistory', field: 'personalCancerHistory',
    options: yesNo
  }));

  const cancerHost = document.createElement('div');
  cancerHost.dataset.conditional = 'personalMedicalHistory.personalCancerHistory=yes';
  cancerHost.appendChild(subHeader('Cancer diagnoses', true));
  cancerHost.appendChild(probandCancerEditor());
  cancerHost.appendChild(radioGroup({
    label: 'Has the proband had multiple primary cancers?',
    section: 'personalMedicalHistory', field: 'multiplePrimaryCancers',
    options: yesNo
  }));
  card.appendChild(cancerHost);

  card.appendChild(radioGroup({
    label: 'Congenital anomalies / birth defects?',
    section: 'personalMedicalHistory', field: 'congenitalAnomalies',
    options: yesNo
  }));
  const anomaliesHost = document.createElement('div');
  anomaliesHost.dataset.conditional = 'personalMedicalHistory.congenitalAnomalies=yes';
  anomaliesHost.appendChild(textArea({
    label: 'Details of congenital anomalies',
    section: 'personalMedicalHistory', field: 'congenitalAnomaliesDetails',
    rows: 2
  }));
  card.appendChild(anomaliesHost);

  card.appendChild(radioGroup({
    label: 'Developmental delay or intellectual disability?',
    section: 'personalMedicalHistory', field: 'developmentalDelay',
    options: yesNo
  }));

  card.appendChild(radioGroup({
    label: 'Prior therapeutic radiation exposure?',
    section: 'personalMedicalHistory', field: 'priorRadiation',
    options: yesNo
  }));

  card.appendChild(textArea({
    label: 'Other significant medical history',
    section: 'personalMedicalHistory', field: 'otherSignificantHistory',
    rows: 3,
    placeholder: 'Cardiac, neurologic, dermatologic, GI features relevant to genetics review\u2026'
  }));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Three-Generation Family Pedigree',
    description: 'Document the proband\u2019s parents, siblings, children, grandparents, aunts/uncles and cousins. Add cancer details for each affected relative.'
  });

  // Generation 1: grandparents
  card.appendChild(subHeader('Maternal grandparents', true));
  card.appendChild(fixedRelativeEditor({ path: 'maternalGrandmother', label: 'Maternal grandmother', side: 'maternal' }));
  card.appendChild(fixedRelativeEditor({ path: 'maternalGrandfather', label: 'Maternal grandfather', side: 'maternal' }));

  card.appendChild(subHeader('Paternal grandparents'));
  card.appendChild(fixedRelativeEditor({ path: 'paternalGrandmother', label: 'Paternal grandmother', side: 'paternal' }));
  card.appendChild(fixedRelativeEditor({ path: 'paternalGrandfather', label: 'Paternal grandfather', side: 'paternal' }));

  // Generation 2: parents
  card.appendChild(subHeader('Parents'));
  card.appendChild(fixedRelativeEditor({ path: 'mother', label: 'Mother', side: 'maternal' }));
  card.appendChild(fixedRelativeEditor({ path: 'father', label: 'Father', side: 'paternal' }));

  // Generation 2: aunts/uncles (maternal & paternal)
  card.appendChild(relativeListEditor({
    field: 'maternalAuntsUncles',
    label: 'Maternal aunts and uncles',
    side: 'maternal',
    generation: 2,
    addLabel: 'Add maternal aunt/uncle',
    defaultRelation: 'Maternal aunt/uncle',
    hint: 'Mother\u2019s siblings.'
  }));
  card.appendChild(relativeListEditor({
    field: 'paternalAuntsUncles',
    label: 'Paternal aunts and uncles',
    side: 'paternal',
    generation: 2,
    addLabel: 'Add paternal aunt/uncle',
    defaultRelation: 'Paternal aunt/uncle',
    hint: 'Father\u2019s siblings.'
  }));

  // Generation 3: siblings, children, cousins
  card.appendChild(relativeListEditor({
    field: 'siblings',
    label: 'Siblings',
    side: 'self',
    generation: 3,
    addLabel: 'Add sibling',
    defaultRelation: 'Sibling',
    hint: 'Brothers and sisters of the proband (full and half).'
  }));
  card.appendChild(relativeListEditor({
    field: 'children',
    label: 'Children',
    side: 'self',
    generation: 3,
    addLabel: 'Add child',
    defaultRelation: 'Child'
  }));
  card.appendChild(relativeListEditor({
    field: 'maternalCousins',
    label: 'Maternal cousins',
    side: 'maternal',
    generation: 3,
    addLabel: 'Add maternal cousin',
    defaultRelation: 'Maternal cousin'
  }));
  card.appendChild(relativeListEditor({
    field: 'paternalCousins',
    label: 'Paternal cousins',
    side: 'paternal',
    generation: 3,
    addLabel: 'Add paternal cousin',
    defaultRelation: 'Paternal cousin'
  }));

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Consanguinity & Ancestry',
    description: 'Reproductive partner relatedness and population background.'
  });

  card.appendChild(radioGroup({
    label: 'Is there consanguinity in the family (parents related by blood, e.g. first cousins)?',
    section: 'consanguinityAncestry', field: 'consanguinity',
    options: yesNo
  }));
  const consHost = document.createElement('div');
  consHost.dataset.conditional = 'consanguinityAncestry.consanguinity=yes';
  consHost.appendChild(textInput({
    label: 'Consanguinity details',
    section: 'consanguinityAncestry', field: 'consanguinityDetails',
    placeholder: 'e.g. first cousins, double first cousins'
  }));
  card.appendChild(consHost);

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Maternal ancestry / origin',
    section: 'consanguinityAncestry', field: 'maternalAncestry'
  }));
  grid.appendChild(textInput({
    label: 'Paternal ancestry / origin',
    section: 'consanguinityAncestry', field: 'paternalAncestry'
  }));
  card.appendChild(grid);

  card.appendChild(radioGroup({
    label: 'Ashkenazi Jewish ancestry?',
    section: 'consanguinityAncestry', field: 'ashkenaziJewish',
    options: yesNo,
    hint: 'Three BRCA1/2 founder variants are common in this population.'
  }));
  card.appendChild(radioGroup({
    label: 'Sephardic Jewish ancestry?',
    section: 'consanguinityAncestry', field: 'sephardicJewish',
    options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Other founding-population ancestry (Quebecois, Finnish, Icelandic, Afrikaner, etc.)?',
    section: 'consanguinityAncestry', field: 'foundingPopulation',
    options: yesNo
  }));
  const foundHost = document.createElement('div');
  foundHost.dataset.conditional = 'consanguinityAncestry.foundingPopulation=yes';
  foundHost.appendChild(textInput({
    label: 'Founding-population details',
    section: 'consanguinityAncestry', field: 'foundingPopulationDetails'
  }));
  card.appendChild(foundHost);

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Targeted Risk Scoring',
    description: 'Inputs for the Manchester Score (BRCA1/2), Revised Bethesda criteria (Lynch syndrome), Tyrer-Cuzick (breast cancer) and PREMM5 (Lynch). Live scores update as you type.'
  });

  // ─── Manchester Score ───────────────────────────────────
  card.appendChild(subHeader('Manchester Score for BRCA1/2', true));
  const manHint = document.createElement('p');
  manHint.className = 'pedigree-tier-hint';
  manHint.textContent = 'Enter a count for each cancer category in the proband and in first/second-degree relatives. Each entry contributes pre-defined points; summed across both columns the total is the Manchester score.';
  card.appendChild(manHint);

  const manGrid1 = document.createElement('div');
  manGrid1.className = 'three-col';
  manGrid1.appendChild(textInput({ label: 'Proband — female breast <30',  section: 'targetedRiskScoring.manchester', field: 'probandFemaleBreastUnder30', type: 'number', min: 0, max: 10 }));
  manGrid1.appendChild(textInput({ label: 'Proband — female breast 30-39', section: 'targetedRiskScoring.manchester', field: 'probandFemaleBreast30to39',  type: 'number', min: 0, max: 10 }));
  manGrid1.appendChild(textInput({ label: 'Proband — female breast 40-49', section: 'targetedRiskScoring.manchester', field: 'probandFemaleBreast40to49',  type: 'number', min: 0, max: 10 }));
  card.appendChild(manGrid1);

  const manGrid2 = document.createElement('div');
  manGrid2.className = 'two-col';
  manGrid2.appendChild(textInput({ label: 'Proband — ovarian <60', section: 'targetedRiskScoring.manchester', field: 'probandOvarianUnder60', type: 'number', min: 0, max: 10 }));
  manGrid2.appendChild(textInput({ label: 'Proband — male breast (any age)', section: 'targetedRiskScoring.manchester', field: 'probandMaleBreast', type: 'number', min: 0, max: 10 }));
  card.appendChild(manGrid2);

  const manGrid3 = document.createElement('div');
  manGrid3.className = 'three-col';
  manGrid3.appendChild(textInput({ label: 'Relatives — female breast <30',  section: 'targetedRiskScoring.manchester', field: 'relativeFemaleBreastUnder30', type: 'number', min: 0, max: 30 }));
  manGrid3.appendChild(textInput({ label: 'Relatives — female breast 30-39', section: 'targetedRiskScoring.manchester', field: 'relativeFemaleBreast30to39',  type: 'number', min: 0, max: 30 }));
  manGrid3.appendChild(textInput({ label: 'Relatives — female breast 40-49', section: 'targetedRiskScoring.manchester', field: 'relativeFemaleBreast40to49',  type: 'number', min: 0, max: 30 }));
  card.appendChild(manGrid3);

  const manGrid4 = document.createElement('div');
  manGrid4.className = 'two-col';
  manGrid4.appendChild(textInput({ label: 'Relatives — ovarian <60', section: 'targetedRiskScoring.manchester', field: 'relativeOvarianUnder60', type: 'number', min: 0, max: 30 }));
  manGrid4.appendChild(textInput({ label: 'Relatives — male breast (any age)', section: 'targetedRiskScoring.manchester', field: 'relativeMaleBreast', type: 'number', min: 0, max: 30 }));
  card.appendChild(manGrid4);

  const manGrid5 = document.createElement('div');
  manGrid5.className = 'two-col';
  manGrid5.appendChild(textInput({ label: 'Relatives — pancreatic <60', section: 'targetedRiskScoring.manchester', field: 'relativePancreaticUnder60', type: 'number', min: 0, max: 30 }));
  manGrid5.appendChild(textInput({ label: 'Relatives — prostate <60', section: 'targetedRiskScoring.manchester', field: 'relativeProstateUnder60', type: 'number', min: 0, max: 30 }));
  card.appendChild(manGrid5);

  // ─── Bethesda criteria ──────────────────────────────────
  card.appendChild(subHeader('Revised Bethesda Criteria (Lynch syndrome)'));
  card.appendChild(radioGroup({
    label: '1. Colorectal cancer diagnosed in proband under age 50?',
    section: 'targetedRiskScoring.bethesda', field: 'crcUnder50', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: '2. Synchronous or metachronous colorectal or other Lynch-spectrum tumour?',
    section: 'targetedRiskScoring.bethesda', field: 'synchronousMetachronous', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: '3. CRC under 60 with high microsatellite instability (MSI-H) histology?',
    section: 'targetedRiskScoring.bethesda', field: 'msiHistology', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: '4. CRC plus >=1 first-degree relative with a Lynch-spectrum tumour, one diagnosed <50?',
    section: 'targetedRiskScoring.bethesda', field: 'firstDegreeLynchTumour', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: '5. CRC plus >=2 first- or second-degree relatives with Lynch-spectrum tumours at any age?',
    section: 'targetedRiskScoring.bethesda', field: 'multipleRelativesLynch', options: yesNo
  }));

  // ─── Tyrer-Cuzick ───────────────────────────────────────
  card.appendChild(subHeader('Tyrer-Cuzick (IBIS) — breast cancer'));
  const tcHint = document.createElement('p');
  tcHint.className = 'pedigree-tier-hint';
  tcHint.textContent = 'Capture inputs for the IBIS model. The model itself is not run in-browser; if you have already calculated the 10-year and lifetime risks externally, paste them at the bottom.';
  card.appendChild(tcHint);

  const tcGrid1 = document.createElement('div');
  tcGrid1.className = 'three-col';
  tcGrid1.appendChild(textInput({ label: 'Age (years)', section: 'targetedRiskScoring.tyrerCuzick', field: 'ageYears', type: 'number', min: 0, max: 120 }));
  tcGrid1.appendChild(textInput({ label: 'Age at menarche', section: 'targetedRiskScoring.tyrerCuzick', field: 'ageAtMenarche', type: 'number', min: 5, max: 25 }));
  tcGrid1.appendChild(radioGroup({ label: 'Parous?', section: 'targetedRiskScoring.tyrerCuzick', field: 'parous', options: yesNo }));
  card.appendChild(tcGrid1);

  const tcGrid2 = document.createElement('div');
  tcGrid2.className = 'three-col';
  tcGrid2.appendChild(textInput({ label: 'Age at first live birth', section: 'targetedRiskScoring.tyrerCuzick', field: 'ageAtFirstLiveBirth', type: 'number', min: 10, max: 60 }));
  tcGrid2.appendChild(radioGroup({ label: 'Menopausal?', section: 'targetedRiskScoring.tyrerCuzick', field: 'menopausal', options: yesNo }));
  tcGrid2.appendChild(textInput({ label: 'Age at menopause', section: 'targetedRiskScoring.tyrerCuzick', field: 'ageAtMenopause', type: 'number', min: 20, max: 70 }));
  card.appendChild(tcGrid2);

  const tcGrid3 = document.createElement('div');
  tcGrid3.className = 'two-col';
  tcGrid3.appendChild(textInput({ label: 'Height (cm)', section: 'targetedRiskScoring.tyrerCuzick', field: 'heightCm', type: 'number', min: 50, max: 250 }));
  tcGrid3.appendChild(textInput({ label: 'Weight (kg)', section: 'targetedRiskScoring.tyrerCuzick', field: 'weightKg', type: 'number', min: 1, max: 400 }));
  card.appendChild(tcGrid3);

  card.appendChild(radioGroup({ label: 'Currently on HRT?', section: 'targetedRiskScoring.tyrerCuzick', field: 'hrtCurrent', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Prior benign breast disease?', section: 'targetedRiskScoring.tyrerCuzick', field: 'priorBenignBreastDisease', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Atypical hyperplasia?', section: 'targetedRiskScoring.tyrerCuzick', field: 'atypicalHyperplasia', options: yesNo }));
  card.appendChild(radioGroup({ label: 'LCIS (lobular carcinoma in situ)?', section: 'targetedRiskScoring.tyrerCuzick', field: 'lcis', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Mammographically dense breast tissue?', section: 'targetedRiskScoring.tyrerCuzick', field: 'dense', options: yesNo }));

  const tcGrid4 = document.createElement('div');
  tcGrid4.className = 'two-col';
  tcGrid4.appendChild(textInput({ label: 'External 10-year risk (%)', section: 'targetedRiskScoring.tyrerCuzick', field: 'externalTenYearRisk', type: 'number', min: 0, max: 100, step: 0.1, unit: '%' }));
  tcGrid4.appendChild(textInput({ label: 'External lifetime risk (%)', section: 'targetedRiskScoring.tyrerCuzick', field: 'externalLifetimeRisk', type: 'number', min: 0, max: 100, step: 0.1, unit: '%' }));
  card.appendChild(tcGrid4);

  // ─── PREMM5 ─────────────────────────────────────────────
  card.appendChild(subHeader('PREMM5 — Lynch syndrome'));
  card.appendChild(radioGroup({ label: 'Proband has had colorectal cancer?', section: 'targetedRiskScoring.premm5', field: 'probandColorectal', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Proband has had endometrial cancer?', section: 'targetedRiskScoring.premm5', field: 'probandEndometrial', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Proband has had another Lynch-spectrum tumour (gastric, ovarian, urothelial, small bowel, biliary, brain, sebaceous)?', section: 'targetedRiskScoring.premm5', field: 'probandOtherLynchTumour', options: yesNo }));
  card.appendChild(textInput({ label: 'Youngest age at which the proband had any Lynch-spectrum tumour', section: 'targetedRiskScoring.premm5', field: 'youngestProbandAgeAtLynchTumour', type: 'number', min: 0, max: 120 }));

  const pmGrid = document.createElement('div');
  pmGrid.className = 'two-col';
  pmGrid.appendChild(textInput({ label: 'First-degree relatives with CRC', section: 'targetedRiskScoring.premm5', field: 'firstDegreeWithCRC', type: 'number', min: 0, max: 20 }));
  pmGrid.appendChild(textInput({ label: 'First-degree relatives with endometrial cancer', section: 'targetedRiskScoring.premm5', field: 'firstDegreeWithEndometrial', type: 'number', min: 0, max: 20 }));
  card.appendChild(pmGrid);

  const pmGrid2 = document.createElement('div');
  pmGrid2.className = 'two-col';
  pmGrid2.appendChild(textInput({ label: 'First-degree relatives with other Lynch tumour', section: 'targetedRiskScoring.premm5', field: 'firstDegreeWithOtherLynch', type: 'number', min: 0, max: 20 }));
  pmGrid2.appendChild(textInput({ label: 'Second-degree relatives with any Lynch tumour', section: 'targetedRiskScoring.premm5', field: 'secondDegreeWithLynch', type: 'number', min: 0, max: 20 }));
  card.appendChild(pmGrid2);

  card.appendChild(textInput({ label: 'Youngest age at which any relative had a Lynch tumour', section: 'targetedRiskScoring.premm5', field: 'youngestRelativeAgeAtLynchTumour', type: 'number', min: 0, max: 120 }));
  card.appendChild(textInput({ label: 'External PREMM5 score (%)', section: 'targetedRiskScoring.premm5', field: 'externalPREMM5Percent', type: 'number', min: 0, max: 100, step: 0.1, unit: '%', hint: 'If you have run PREMM5 externally, paste the percent here. Threshold for testing is >=5%.' }));

  // ─── Live scores readout ───────────────────────────────
  const live = document.createElement('div');
  live.className = 'live-scores';
  live.id = 'live-scores';
  live.innerHTML = `
    <h4>Live computed scores</h4>
    <div class="live-scores-grid">
      <div class="live-score-row"><span class="label">Manchester Score (BRCA1/2)</span><span class="value" id="live-manchester">0</span></div>
      <div class="live-score-row"><span class="label">Bethesda criteria met</span><span class="value" id="live-bethesda">0 / 5</span></div>
      <div class="live-score-row"><span class="label">PREMM5 (external)</span><span class="value" id="live-premm5">—</span></div>
      <div class="live-score-row"><span class="label">Tyrer-Cuzick lifetime (external)</span><span class="value" id="live-tc">—</span></div>
    </div>
  `;
  card.appendChild(live);

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Prior Genetic Testing',
    description: 'Tests already undertaken on the proband or a close relative.'
  });

  card.appendChild(radioGroup({
    label: 'Has the proband had any prior genetic testing?',
    section: 'priorGeneticTesting', field: 'priorTesting',
    options: yesNo
  }));

  const testsHost = document.createElement('div');
  testsHost.dataset.conditional = 'priorGeneticTesting.priorTesting=yes';
  testsHost.appendChild(subHeader('Prior tests', true));
  testsHost.appendChild(priorTestEditor());
  card.appendChild(testsHost);

  card.appendChild(radioGroup({
    label: 'Variants of uncertain significance (VUS) previously reported?',
    section: 'priorGeneticTesting', field: 'variantsOfUncertainSignificance',
    options: yesNo
  }));
  const vusHost = document.createElement('div');
  vusHost.dataset.conditional = 'priorGeneticTesting.variantsOfUncertainSignificance=yes';
  vusHost.appendChild(textArea({
    label: 'VUS details',
    section: 'priorGeneticTesting', field: 'variantsOfUncertainSignificanceDetails',
    rows: 2
  }));
  card.appendChild(vusHost);

  card.appendChild(radioGroup({
    label: 'Is there a known familial pathogenic variant in a close relative?',
    section: 'priorGeneticTesting', field: 'familialVariantKnown',
    options: yesNo
  }));
  const famHost = document.createElement('div');
  famHost.dataset.conditional = 'priorGeneticTesting.familialVariantKnown=yes';
  famHost.appendChild(textArea({
    label: 'Familial variant details (gene, variant, relative)',
    section: 'priorGeneticTesting', field: 'familialVariantDetails',
    rows: 2,
    placeholder: 'e.g. BRCA1 c.5266dupC in maternal aunt'
  }));
  card.appendChild(famHost);

  card.appendChild(radioGroup({
    label: 'Has the proband had prior formal genetic counselling?',
    section: 'priorGeneticTesting', field: 'priorGeneticCounselling',
    options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Notes from prior counselling',
    section: 'priorGeneticTesting', field: 'priorCounsellingNotes',
    rows: 2
  }));

  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Patient Understanding & Concerns',
    description: 'Patient\u2019s perspective, expectations and consent.'
  });

  card.appendChild(textArea({
    label: 'What is the patient\u2019s understanding of why they have been referred?',
    section: 'patientUnderstandingConcerns', field: 'understandingOfReferral',
    rows: 3
  }));
  card.appendChild(textArea({
    label: 'Patient\u2019s primary concerns',
    section: 'patientUnderstandingConcerns', field: 'primaryConcerns',
    rows: 2
  }));
  card.appendChild(textArea({
    label: 'Patient\u2019s expectations of this appointment',
    section: 'patientUnderstandingConcerns', field: 'expectations',
    rows: 2
  }));

  card.appendChild(radioGroup({
    label: 'Insurance / employment implications a concern?',
    section: 'patientUnderstandingConcerns', field: 'insuranceConcerns',
    options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Confidentiality concerns?',
    section: 'patientUnderstandingConcerns', field: 'confidentialityConcerns',
    options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Reproductive implications a concern?',
    section: 'patientUnderstandingConcerns', field: 'reproductiveImplications',
    options: yesNo
  }));

  card.appendChild(textArea({
    label: 'Support system (who can the patient talk to?)',
    section: 'patientUnderstandingConcerns', field: 'supportSystem',
    rows: 2
  }));

  card.appendChild(radioGroup({
    label: 'Does the patient consent to genetic testing today?',
    section: 'patientUnderstandingConcerns', field: 'consentToTesting',
    options: yesNo
  }));

  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Recommendation & Referral Plan',
    description: 'Clinician-assigned risk and onward referral / testing recommendations.'
  });

  card.appendChild(radioGroup({
    label: 'Clinician-assigned risk level',
    section: 'recommendationReferralPlan', field: 'clinicianAssignedRisk',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'high', label: 'High' }
    ]
  }));

  card.appendChild(subHeader('Testing recommendations', true));
  card.appendChild(radioGroup({ label: 'Recommend BRCA1/2 testing?',  section: 'recommendationReferralPlan', field: 'recommendBRCATesting',  options: yesNo }));
  card.appendChild(radioGroup({ label: 'Recommend Lynch syndrome germline panel?', section: 'recommendationReferralPlan', field: 'recommendLynchTesting', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Recommend MMR IHC / MSI on tumour tissue?', section: 'recommendationReferralPlan', field: 'recommendMMRIHC', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Recommend broad multigene panel?', section: 'recommendationReferralPlan', field: 'recommendPanelTesting', options: yesNo }));
  card.appendChild(textInput({
    label: 'Recommended panel name(s) (if applicable)',
    section: 'recommendationReferralPlan', field: 'recommendedPanel',
    placeholder: 'e.g. Hereditary cancer 36-gene panel'
  }));

  card.appendChild(subHeader('Onward referrals'));
  card.appendChild(radioGroup({ label: 'Refer to clinical genetics?',         section: 'recommendationReferralPlan', field: 'referClinicalGenetics',     options: yesNo }));
  card.appendChild(radioGroup({ label: 'Refer to high-risk breast surveillance?', section: 'recommendationReferralPlan', field: 'referBreastSurveillance', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Refer for surveillance colonoscopy?', section: 'recommendationReferralPlan', field: 'referColonoscopy',          options: yesNo }));
  card.appendChild(radioGroup({ label: 'Refer for psychological support?',    section: 'recommendationReferralPlan', field: 'referPsychologicalSupport', options: yesNo }));

  card.appendChild(selectInput({
    label: 'Referral urgency',
    section: 'recommendationReferralPlan', field: 'referralUrgency',
    options: [
      { value: 'routine', label: 'Routine' },
      { value: 'soon', label: 'Soon (within 6 weeks)' },
      { value: 'urgent', label: 'Urgent (within 2 weeks)' }
    ]
  }));

  card.appendChild(textArea({
    label: 'Clinician summary',
    section: 'recommendationReferralPlan', field: 'clinicianSummary',
    rows: 4,
    placeholder: 'Free-text summary of the assessment, plan and follow-up\u2026'
  }));

  const sigGrid = document.createElement('div');
  sigGrid.className = 'three-col';
  sigGrid.appendChild(textInput({ label: 'Clinician name', section: 'recommendationReferralPlan', field: 'clinicianName' }));
  sigGrid.appendChild(textInput({ label: 'Role', section: 'recommendationReferralPlan', field: 'clinicianRole', placeholder: 'e.g. Genetic counsellor' }));
  sigGrid.appendChild(textInput({ label: 'Date', section: 'recommendationReferralPlan', field: 'signatureDate', type: 'date' }));
  card.appendChild(sigGrid);

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections + live readouts
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const eq = expr.indexOf('=');
    const path = expr.slice(0, eq);
    const target = expr.slice(eq + 1);
    const lastDot = path.lastIndexOf('.');
    const sectionPath = path.slice(0, lastDot);
    const field = path.slice(lastDot + 1);
    const obj = sectionPath.split('.').reduce((o, k) => (o == null ? o : o[k]), state);
    const current = obj ? obj[field] : '';
    host.style.display = String(current) === target ? '' : 'none';
  });
}

function refreshLiveScores() {
  const liveMan = document.getElementById('live-manchester');
  const liveBet = document.getElementById('live-bethesda');
  const livePremm = document.getElementById('live-premm5');
  const liveTC = document.getElementById('live-tc');
  if (!liveMan && !liveBet && !livePremm && !liveTC) return;

  const m = calculateManchesterScore(state);
  if (liveMan) {
    liveMan.textContent = String(m);
    liveMan.classList.toggle('alert', m >= 15);
  }

  const b = countBethesdaMet(state);
  if (liveBet) {
    liveBet.textContent = `${b} / 5`;
    liveBet.classList.toggle('alert', b >= 1);
  }

  const premm = state.targetedRiskScoring.premm5.externalPREMM5Percent;
  if (livePremm) {
    livePremm.textContent = (premm === null || premm === undefined || premm === '')
      ? '—'
      : `${premm}%`;
    const num = Number(premm);
    livePremm.classList.toggle('alert', !isNaN(num) && num >= 5);
  }

  const tc = state.targetedRiskScoring.tyrerCuzick.externalLifetimeRisk;
  if (liveTC) {
    liveTC.textContent = (tc === null || tc === undefined || tc === '')
      ? '—'
      : `${tc}%`;
    const num = Number(tc);
    liveTC.classList.toggle('alert', !isNaN(num) && num >= 17);
  }
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  // Step 1: Demographics
  ['probandDemographics', 'firstName'],
  ['probandDemographics', 'lastName'],
  ['probandDemographics', 'dateOfBirth'],
  ['probandDemographics', 'sex'],
  // Step 2: Presenting Concern
  ['presentingConcern', 'chiefConcern'],
  ['presentingConcern', 'referralReason'],
  ['presentingConcern', 'urgency'],
  // Step 3: Personal Medical History
  ['personalMedicalHistory', 'personalCancerHistory'],
  ['personalMedicalHistory', 'congenitalAnomalies'],
  ['personalMedicalHistory', 'developmentalDelay'],
  ['personalMedicalHistory', 'priorRadiation'],
  // Step 5: Consanguinity & Ancestry
  ['consanguinityAncestry', 'consanguinity'],
  ['consanguinityAncestry', 'ashkenaziJewish'],
  ['consanguinityAncestry', 'sephardicJewish'],
  ['consanguinityAncestry', 'foundingPopulation'],
  // Step 6: Targeted scoring (Bethesda)
  ['targetedRiskScoring.bethesda', 'crcUnder50'],
  ['targetedRiskScoring.bethesda', 'synchronousMetachronous'],
  ['targetedRiskScoring.bethesda', 'msiHistology'],
  ['targetedRiskScoring.bethesda', 'firstDegreeLynchTumour'],
  ['targetedRiskScoring.bethesda', 'multipleRelativesLynch'],
  // Step 6: PREMM5 indicators
  ['targetedRiskScoring.premm5', 'probandColorectal'],
  ['targetedRiskScoring.premm5', 'probandEndometrial'],
  ['targetedRiskScoring.premm5', 'probandOtherLynchTumour'],
  // Step 7: Prior testing
  ['priorGeneticTesting', 'priorTesting'],
  ['priorGeneticTesting', 'variantsOfUncertainSignificance'],
  ['priorGeneticTesting', 'familialVariantKnown'],
  ['priorGeneticTesting', 'priorGeneticCounselling'],
  // Step 8: Patient understanding
  ['patientUnderstandingConcerns', 'understandingOfReferral'],
  ['patientUnderstandingConcerns', 'insuranceConcerns'],
  ['patientUnderstandingConcerns', 'confidentialityConcerns'],
  ['patientUnderstandingConcerns', 'reproductiveImplications'],
  ['patientUnderstandingConcerns', 'consentToTesting'],
  // Step 9: Recommendations
  ['recommendationReferralPlan', 'clinicianAssignedRisk'],
  ['recommendationReferralPlan', 'recommendBRCATesting'],
  ['recommendationReferralPlan', 'recommendLynchTesting'],
  ['recommendationReferralPlan', 'referClinicalGenetics']
];

function updateProgress() {
  let answered = 0;
  for (const [section, field] of TRACKED_FIELDS) {
    const obj = section.split('.').reduce((o, k) => (o == null ? o : o[k]), state);
    if (!obj) continue;
    const v = obj[field];
    if (v !== null && v !== undefined && v !== '') answered++;
  }
  const total = TRACKED_FIELDS.length;
  const percent = Math.round((answered / total) * 100);
  const bar = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  if (bar) bar.style.width = `${percent}%`;
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  const aria = document.getElementById('progress-bar');
  if (aria) aria.setAttribute('aria-valuenow', String(percent));
}

// ----------------------------------------------------------------------
// Submit / Report
// ----------------------------------------------------------------------

function priorityClass(priority) {
  switch (priority) {
    case 'high': return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low': return 'flag-low';
    default: return '';
  }
}

function severityLabel(sev) {
  switch (sev) {
    case 'high': return 'High';
    case 'moderate': return 'Moderate';
    case 'low': return 'Low';
    default: return '';
  }
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    riskLevel,
    manchesterScore,
    bethesdaMet,
    premm5Score,
    tyrerCuzickLifetime,
    firedRules,
    additionalFlags,
    timestamp
  } = lastResult;

  const flagsList = additionalFlags.length === 0
    ? `<p class="muted">No additional flags raised.</p>`
    : `
      <ul class="flags">
        ${additionalFlags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.message)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const firedRows = firedRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.id)}</th>
      <td>${esc(r.category)}</td>
      <td>${esc(r.description)}</td>
      <td class="num">${esc(severityLabel(r.severity))}</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No risk rules fired.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">Severity</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  const scoreTable = `
    <table class="subscales">
      <thead>
        <tr><th scope="col">Instrument</th><th scope="col">Result</th><th scope="col">Threshold</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Manchester Score</th><td>${manchesterScore}</td><td>>=15 consider; >=20 moderate; >=30 high</td></tr>
        <tr><th scope="row">Bethesda criteria met</th><td>${bethesdaMet} / 5</td><td>>=1 indicates MMR IHC / MSI testing</td></tr>
        <tr><th scope="row">PREMM5 (external)</th><td>${premm5Score === null ? '—' : `${premm5Score}%`}</td><td>>=5% indicates Lynch testing</td></tr>
        <tr><th scope="row">Tyrer-Cuzick lifetime (external)</th><td>${tyrerCuzickLifetime ? `${tyrerCuzickLifetime}%` : '—'}</td><td>>=17% moderate; >=30% high (NICE FH)</td></tr>
      </tbody>
    </table>
  `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Genetics Assessment Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>Overall Risk Level</h3>
      <p class="risk-summary">
        <span class="risk-level-badge ${riskLevelClass(riskLevel)}">${esc(riskLevelLabel(riskLevel))}</span>
      </p>
      <p class="muted">Risk level is the maximum severity of any rule that fired below.</p>

      <h3>Computed scores</h3>
      ${scoreTable}

      <h3>Fired rules</h3>
      ${firedTable}

      <h3>Flagged Issues</h3>
      ${flagsList}

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
}

function submitForm() {
  const grading = gradeGenetics(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    riskLevel: grading.riskLevel,
    manchesterScore: grading.manchesterScore,
    bethesdaMet: grading.bethesdaMet,
    premm5Score: grading.premm5Score,
    tyrerCuzickLifetime: grading.tyrerCuzickLifetime,
    firedRules: grading.firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh assessment?')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  document.getElementById('report').innerHTML = '';
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshLiveScores();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function renderForm() {
  const host = document.getElementById('form-sections');
  host.innerHTML = '';
  host.appendChild(renderStep1());
  host.appendChild(renderStep2());
  host.appendChild(renderStep3());
  host.appendChild(renderStep4());
  host.appendChild(renderStep5());
  host.appendChild(renderStep6());
  host.appendChild(renderStep7());
  host.appendChild(renderStep8());
  host.appendChild(renderStep9());
}

function init() {
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshLiveScores();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
