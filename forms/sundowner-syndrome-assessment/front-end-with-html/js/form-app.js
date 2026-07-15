import { cmaiItems, cmaiScaleOptions, npiDomains, npiFrequencyOptions, npiSeverityOptions } from './cmai-rules.js';
import { detectAdditionalFlags } from './flagged-issues.js';
import { gradeSundowner } from './sundowner-grader.js';
import { CMAI_ITEM_IDS, NPI_DOMAIN_KEYS, emptyAssessment, severityClass, severityFromCMAI, severityLabel } from './types.js';

// Sundowner Syndrome Assessment - patient/carer wizard (vanilla JS, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure CMAI/NPI scoring engine and renders an inline report.
// State is persisted to localStorage so a partial fill survives reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.SundownerSyndromeAssessment`. Pulling them off here
// keeps the rest of this file referring to short local names. The whole
// file is wrapped in an IIFE so its top-level identifiers don't leak to
// the global scope.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'sundowner-syndrome-assessment.front-end-form-with-html.v1';

/** Deep merge that prefers the parsed structure but fills in missing keys. */
function rehydrate(parsed) {
  const fresh = emptyAssessment();
  if (!parsed || typeof parsed !== 'object') return fresh;
  for (const key of Object.keys(fresh)) {
    if (parsed[key] && typeof parsed[key] === 'object') {
      // Special-case the nested CMAI / NPI maps so newly-added items
      // default correctly without dropping saved scores.
      if (key === 'behaviouralSymptoms') {
        const freshBs = fresh.behaviouralSymptoms;
        const parsedBs = parsed.behaviouralSymptoms;
        const cmai = { ...freshBs.cmai, ...(parsedBs.cmai || {}) };
        const npi = { ...freshBs.npi };
        if (parsedBs.npi && typeof parsedBs.npi === 'object') {
          for (const k of Object.keys(parsedBs.npi)) {
            const v = parsedBs.npi[k] || {};
            npi[k] = {
              frequency: Number(v.frequency) || 0,
              severity: Number(v.severity) || 0
            };
          }
        }
        fresh.behaviouralSymptoms = {
          ...freshBs,
          ...parsedBs,
          cmai,
          npi
        };
      } else if (Array.isArray(fresh[key])) {
        fresh[key] = Array.isArray(parsed[key]) ? parsed[key] : fresh[key];
      } else {
        fresh[key] = { ...fresh[key], ...parsed[key] };
      }
    }
  }
  return fresh;
}

/** @returns {import('./types.js').AssessmentData} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    return rehydrate(JSON.parse(raw));
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} st */
function saveState(st) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
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

/**
 * Set a top-level (section, field) value. Persists, refreshes progress
 * and conditional visibility.
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
}

/**
 * Set a CMAI item score (1..7) on `behaviouralSymptoms.cmai[id]`.
 */
function setCmai(id, value) {
  state.behaviouralSymptoms.cmai[id] = Number(value) || 0;
  saveState(state);
  updateProgress();
}

/**
 * Set NPI domain frequency or severity on `behaviouralSymptoms.npi[key]`.
 * Recomputes the per-row product readout.
 */
function setNpi(key, which, value) {
  if (!state.behaviouralSymptoms.npi[key]) {
    state.behaviouralSymptoms.npi[key] = { frequency: 0, severity: 0 };
  }
  state.behaviouralSymptoms.npi[key][which] = Number(value) || 0;
  saveState(state);
  updateProgress();
  refreshNpiProduct(key);
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
// Component builders (Lily-shaped)
// ----------------------------------------------------------------------

const TOTAL_STEPS = 10;

function lilyInputClass(type) {
  switch (type) {
    case 'email':  return 'email-input';
    case 'number': return 'number-input';
    case 'date':   return 'date-input';
    case 'time':   return 'time-input';
    case 'tel':    return 'tel-input';
    case 'url':    return 'url-input';
    case 'search': return 'search-input';
    default:       return 'text-input';
  }
}

function textInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field];
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value ?? '')}"`,
    `aria-describedby="${id}-error"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required', 'data-required');
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') {
      v = v === '' ? null : Number(v);
    }
    setField(opts.section, opts.field, v);
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      aria-describedby="${id}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => { setField(opts.section, opts.field, ta.value); clearFieldError(id); });
  return wrapper;
}

function selectInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(String(o.value))}"${String(o.value) === String(current) ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select" aria-describedby="${id}-error">
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => { setField(opts.section, opts.field, sel.value); clearFieldError(id); });
  return wrapper;
}

function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field';
  wrapper.id = `${groupId}-fieldset`;

  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.innerHTML = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-group';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', wrapper.id);
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    const requiredAttr = opts.required ? ' data-required' : '';
    label.innerHTML = `
      <input class="radio-input" type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}${requiredAttr}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) {
        setField(opts.section, opts.field, option.value);
        clearFieldError(groupId);
      }
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);

  const errSpan = document.createElement('span');
  errSpan.className = 'error-message';
  errSpan.id = `${groupId}-error`;
  wrapper.appendChild(errSpan);
  return wrapper;
}

function sectionCard(opts) {
  const card = document.createElement('fieldset');
  card.className = 'fieldset';
  card.dataset.step = String(opts.stepNumber);
  card.id = `step-${opts.stepNumber}`;
  const desc = opts.description
    ? `<span class="section-description">${esc(opts.description)}</span>`
    : '';
  const legend = document.createElement('legend');
  legend.className = 'fieldset-legend';
  legend.innerHTML =
    `<span class="section-step">Section ${opts.stepNumber} of ${TOTAL_STEPS}</span>` +
    `<span class="section-title">${esc(opts.title)}</span>` +
    desc;
  card.appendChild(legend);
  return card;
}

// ----------------------------------------------------------------------
// CMAI scale renderer (29 items × 1-7 radios)
// ----------------------------------------------------------------------

function renderCmaiList() {
  const wrapper = document.createElement('div');
  wrapper.className = 'cmai-wrapper';

  const legend = document.createElement('p');
  legend.className = 'cmai-legend';
  legend.innerHTML = `
    For each behaviour below, please rate how often the patient has shown
    it in the last two weeks. <strong>1</strong> = Never;
    <strong>2</strong> = Less than once a week;
    <strong>3</strong> = Once or twice a week;
    <strong>4</strong> = Several times a week;
    <strong>5</strong> = Once or twice a day;
    <strong>6</strong> = Several times a day;
    <strong>7</strong> = Several times an hour.
  `;
  wrapper.appendChild(legend);

  const list = document.createElement('ol');
  list.className = 'cmai-list';

  for (const item of cmaiItems) {
    const li = document.createElement('li');
    li.className = 'cmai-item';
    li.innerHTML = `
      <span class="cmai-item-label">
        <span class="cmai-item-id">#${item.number}</span>${esc(item.label)}
      </span>
    `;
    const scale = document.createElement('div');
    scale.className = 'cmai-scale radio-group';
    scale.setAttribute('role', 'radiogroup');
    scale.setAttribute('aria-label', `${item.label} — frequency 1 to 7`);

    const groupName = `cmai-${item.id}`;
    const current = state.behaviouralSymptoms.cmai[item.id] || 0;
    for (const opt of cmaiScaleOptions) {
      const radioId = `${groupName}-${opt.value}`;
      const label = document.createElement('label');
      label.htmlFor = radioId;
      const checked = current === opt.value ? ' checked' : '';
      label.innerHTML = `
        <input class="radio-input" type="radio" id="${radioId}" name="${groupName}" value="${opt.value}"${checked}>
        <span>${esc(opt.label)}</span>
      `;
      const input = label.querySelector('input');
      input.addEventListener('change', () => {
        if (input.checked) setCmai(item.id, opt.value);
      });
      scale.appendChild(label);
    }
    li.appendChild(scale);
    list.appendChild(li);
  }
  wrapper.appendChild(list);
  return wrapper;
}

// ----------------------------------------------------------------------
// NPI domain editor (12 domains × frequency + severity)
// ----------------------------------------------------------------------

function refreshNpiProduct(key) {
  const out = document.getElementById(`npi-product-${key}`);
  if (!out) return;
  const e = state.behaviouralSymptoms.npi[key] || { frequency: 0, severity: 0 };
  const f = Number(e.frequency) || 0;
  const s = Number(e.severity) || 0;
  if (f >= 1 && f <= 4 && s >= 1 && s <= 3) {
    out.innerHTML = `<strong>${f * s}</strong> / 12`;
  } else {
    out.innerHTML = '<span class="muted">— / 12</span>';
  }
}

function renderNpiList() {
  const wrapper = document.createElement('div');
  wrapper.className = 'npi-wrapper';

  const legend = document.createElement('p');
  legend.className = 'cmai-legend';
  legend.innerHTML = `
    For each domain, rate the <strong>frequency</strong> and
    <strong>severity</strong> of any symptoms over the past month.
    Frequency: 1 = occasional, 2 = often, 3 = frequent, 4 = very frequent /
    daily. Severity: 1 = mild, 2 = moderate, 3 = severe. The score for
    each domain is frequency × severity (0–12).
  `;
  wrapper.appendChild(legend);

  const list = document.createElement('ol');
  list.className = 'npi-list';

  for (let i = 0; i < npiDomains.length; i++) {
    const domain = npiDomains[i];
    const li = document.createElement('li');
    li.className = 'npi-item';

    const header = document.createElement('div');
    header.className = 'npi-item-header';
    header.innerHTML = `
      <span class="npi-item-id">#${i + 1}</span>${esc(domain.label)}
      <p class="muted" style="margin-top: 0.125rem;">${esc(domain.description)}</p>
    `;
    li.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'npi-grid';

    // Frequency
    const freqCell = document.createElement('label');
    freqCell.className = 'npi-cell';
    const freqId = `npi-${domain.key}-frequency`;
    const currentFreq = state.behaviouralSymptoms.npi[domain.key]?.frequency || 0;
    freqCell.innerHTML = `
      <span>Frequency</span>
      <select id="${freqId}" class="select">
        <option value="0"${currentFreq === 0 ? ' selected' : ''}>— Select —</option>
        ${npiFrequencyOptions.map((o) =>
          `<option value="${o.value}"${currentFreq === o.value ? ' selected' : ''}>${esc(o.label)}</option>`
        ).join('')}
      </select>
    `;
    freqCell.querySelector('select').addEventListener('change', (e) => {
      setNpi(domain.key, 'frequency', e.target.value);
    });
    grid.appendChild(freqCell);

    // Severity
    const sevCell = document.createElement('label');
    sevCell.className = 'npi-cell';
    const sevId = `npi-${domain.key}-severity`;
    const currentSev = state.behaviouralSymptoms.npi[domain.key]?.severity || 0;
    sevCell.innerHTML = `
      <span>Severity</span>
      <select id="${sevId}" class="select">
        <option value="0"${currentSev === 0 ? ' selected' : ''}>— Select —</option>
        ${npiSeverityOptions.map((o) =>
          `<option value="${o.value}"${currentSev === o.value ? ' selected' : ''}>${esc(o.label)}</option>`
        ).join('')}
      </select>
    `;
    sevCell.querySelector('select').addEventListener('change', (e) => {
      setNpi(domain.key, 'severity', e.target.value);
    });
    grid.appendChild(sevCell);

    // Product readout
    const product = document.createElement('div');
    product.className = 'npi-product';
    product.id = `npi-product-${domain.key}`;
    const f = currentFreq;
    const s = currentSev;
    if (f >= 1 && f <= 4 && s >= 1 && s <= 3) {
      product.innerHTML = `<strong>${f * s}</strong> / 12`;
    } else {
      product.innerHTML = '<span class="muted">— / 12</span>';
    }
    grid.appendChild(product);

    li.appendChild(grid);
    list.appendChild(li);
  }
  wrapper.appendChild(list);
  return wrapper;
}

// ----------------------------------------------------------------------
// Repeating list editor for medications (Step 7)
// ----------------------------------------------------------------------

function medicationListEditor() {
  const wrapper = document.createElement('div');
  wrapper.className = 'list-editor';

  function rerender() {
    const rows = state.medicationReview.currentMedications;
    wrapper.innerHTML = '';
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = 'No medications added.';
      wrapper.appendChild(empty);
    }
    rows.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = 'list-row med-row';
      r.style.cssText = 'display:flex; gap:0.5rem; margin-bottom:0.5rem; padding:0.625rem; border:1px solid var(--color-border); border-radius:var(--radius-sm); background:#fafbfc;';
      r.innerHTML = `
        <div style="display:grid; grid-template-columns:1fr; gap:0.5rem; flex:1;">
          <label class="npi-cell"><span>Name</span>
            <input type="text" class="text-input" data-key="name" value="${esc(row.name)}" placeholder="e.g. Quetiapine">
          </label>
          <label class="npi-cell"><span>Dose</span>
            <input type="text" class="text-input" data-key="dose" value="${esc(row.dose)}" placeholder="e.g. 25 mg">
          </label>
          <label class="npi-cell"><span>Frequency</span>
            <input type="text" class="text-input" data-key="frequency" value="${esc(row.frequency)}" placeholder="e.g. nocte">
          </label>
          <label class="npi-cell"><span>Indication</span>
            <input type="text" class="text-input" data-key="indication" value="${esc(row.indication)}" placeholder="e.g. agitation">
          </label>
        </div>
        <button type="button" class="button" data-variant="secondary" style="align-self:flex-start;" aria-label="Remove medication">&times;</button>
      `;
      r.querySelectorAll('input').forEach((inp) => {
        inp.addEventListener('input', () => {
          const k = inp.dataset.key;
          rows[idx][k] = inp.value;
          saveState(state);
          updateProgress();
        });
      });
      r.querySelector('button').addEventListener('click', () => {
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
    addBtn.textContent = '+ Add medication';
    addBtn.style.marginTop = '0.25rem';
    addBtn.addEventListener('click', () => {
      rows.push({ name: '', dose: '', frequency: '', indication: '' });
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
// Section renderers (1 per step)
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Demographics',
    description: 'Basic patient information.'
  });
  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First name', section: 'demographics', field: 'firstName' }));
  grid.appendChild(textInput({ label: 'Last name', section: 'demographics', field: 'lastName' }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Date of birth',
    section: 'demographics', field: 'dateOfBirth', type: 'date'
  }));
  card.appendChild(textInput({
    label: 'Age',
    section: 'demographics', field: 'ageYears',
    type: 'number', min: 0, max: 130, unit: 'years'
  }));
  card.appendChild(radioGroup({
    label: 'Sex',
    section: 'demographics', field: 'sex',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]
  }));
  card.appendChild(textInput({
    label: 'Primary diagnosis (e.g. Alzheimer\'s, vascular dementia, Lewy-body)',
    section: 'demographics', field: 'primaryDiagnosis'
  }));
  card.appendChild(selectInput({
    label: 'Care setting',
    section: 'demographics', field: 'careSetting',
    options: [
      { value: 'home-with-family', label: 'Home with family carer' },
      { value: 'home-alone', label: 'Home, lives alone' },
      { value: 'home-with-formal-care', label: 'Home with formal care package' },
      { value: 'residential-care', label: 'Residential care home' },
      { value: 'nursing-home', label: 'Nursing home' },
      { value: 'hospital', label: 'Hospital ward' },
      { value: 'other', label: 'Other' }
    ]
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Cognitive Status',
    description: 'Baseline cognition and dementia stage.'
  });
  card.appendChild(selectInput({
    label: 'Dementia stage',
    section: 'cognitiveStatus', field: 'dementiaStage',
    options: [
      { value: 'normal', label: 'No dementia' },
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'Cognitive impairment',
    section: 'cognitiveStatus', field: 'cognitiveImpairment',
    options: [
      { value: 'none', label: 'None' },
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' }
    ]
  }));
  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'MMSE / MOCA score',
    section: 'cognitiveStatus', field: 'mmseScore',
    type: 'number', min: 0, max: 30
  }));
  grid.appendChild(textInput({
    label: 'Date of cognitive testing',
    section: 'cognitiveStatus', field: 'mmseDate', type: 'date'
  }));
  card.appendChild(grid);
  card.appendChild(radioGroup({
    label: 'Prior history of delirium?',
    section: 'cognitiveStatus', field: 'priorDeliriumHistory',
    options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Cognitive notes',
    section: 'cognitiveStatus', field: 'cognitiveNotes',
    placeholder: 'Recent changes, fluctuations, focal deficits…'
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Behavioural Symptoms — CMAI and NPI',
    description: 'Cohen-Mansfield Agitation Inventory (29 items) and Neuropsychiatric Inventory (12 domains).'
  });

  const cmaiHeader = document.createElement('h3');
  cmaiHeader.textContent = 'CMAI — agitation inventory';
  cmaiHeader.style.cssText = 'font-size:1rem; margin:0.5rem 0; font-weight:600;';
  card.appendChild(cmaiHeader);
  card.appendChild(renderCmaiList());

  const npiHeader = document.createElement('h3');
  npiHeader.textContent = 'NPI — neuropsychiatric inventory';
  npiHeader.style.cssText = 'font-size:1rem; margin:1.5rem 0 0.5rem; font-weight:600;';
  card.appendChild(npiHeader);
  card.appendChild(renderNpiList());

  card.appendChild(textArea({
    label: 'Other behavioural notes',
    section: 'behaviouralSymptoms', field: 'behaviouralNotes',
    placeholder: 'Anything not captured above…',
    rows: 3
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Temporal Pattern Assessment',
    description: 'When during the day does sundowning typically occur?'
  });
  const grid = document.createElement('div');
  grid.className = 'three-col';
  grid.appendChild(textInput({
    label: 'Typical onset time',
    section: 'temporalPattern', field: 'typicalOnsetTime', type: 'time'
  }));
  grid.appendChild(textInput({
    label: 'Typical offset / settle time',
    section: 'temporalPattern', field: 'typicalOffsetTime', type: 'time'
  }));
  grid.appendChild(textInput({
    label: 'Peak time',
    section: 'temporalPattern', field: 'peakTime', type: 'time'
  }));
  card.appendChild(grid);

  card.appendChild(selectInput({
    label: 'Episode frequency',
    section: 'temporalPattern', field: 'episodeFrequency',
    options: [
      { value: 'none', label: 'None' },
      { value: 'occasional', label: 'Occasional (less than weekly)' },
      { value: 'frequent', label: 'Frequent (most days)' },
      { value: 'continuous', label: 'Continuous / daily' }
    ]
  }));
  card.appendChild(textInput({
    label: 'Average duration of an episode',
    section: 'temporalPattern', field: 'averageDurationMinutes',
    type: 'number', min: 0, max: 1440, unit: 'minutes'
  }));
  card.appendChild(radioGroup({
    label: 'Worse around dusk?',
    section: 'temporalPattern', field: 'worseAtDusk', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Worse seasonally (e.g. shorter days)?',
    section: 'temporalPattern', field: 'worseSeasonally', options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Temporal pattern notes',
    section: 'temporalPattern', field: 'temporalNotes',
    placeholder: 'Days of the week, recent changes, weekday vs weekend…'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Trigger Identification',
    description: 'Which of the following appear to trigger or worsen the patient\'s episodes?'
  });
  const triggers = [
    ['fatigue', 'Fatigue / overtiredness'],
    ['hunger', 'Hunger or low blood sugar'],
    ['pain', 'Untreated pain'],
    ['infection', 'Infection (e.g. UTI, chest)'],
    ['dehydration', 'Dehydration'],
    ['sensoryOverload', 'Sensory overload (noise, crowds)'],
    ['unfamiliarSurroundings', 'Unfamiliar surroundings'],
    ['carerChange', 'Change of carer / staff'],
    ['lowLight', 'Low light / dusk'],
    ['medicationTiming', 'Medication timing or interactions']
  ];
  for (const [field, label] of triggers) {
    card.appendChild(radioGroup({
      label, section: 'triggerIdentification', field, options: yesNo
    }));
  }
  card.appendChild(textArea({
    label: 'Other triggers',
    section: 'triggerIdentification', field: 'otherTriggers',
    placeholder: 'Any other situations that seem to trigger episodes…'
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Sleep-Wake Cycle',
    description: 'Sleep history and circadian-rhythm disturbance.'
  });
  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Usual bedtime hour (24-hour clock)',
    section: 'sleepWakeCycle', field: 'bedtimeHourClock',
    type: 'number', min: 0, max: 23
  }));
  grid.appendChild(textInput({
    label: 'Average hours of sleep per night',
    section: 'sleepWakeCycle', field: 'averageHoursOfSleep',
    type: 'number', min: 0, max: 24, step: 0.5, unit: 'hours'
  }));
  card.appendChild(grid);

  card.appendChild(radioGroup({
    label: 'Difficulty falling asleep?',
    section: 'sleepWakeCycle', field: 'difficultyFallingAsleep', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Nighttime wandering?',
    section: 'sleepWakeCycle', field: 'nighttimeWandering', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Early morning waking?',
    section: 'sleepWakeCycle', field: 'earlyMorningWaking', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Daytime napping?',
    section: 'sleepWakeCycle', field: 'daytimeNapping', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Average number of awakenings per night',
    section: 'sleepWakeCycle', field: 'nightAwakeningCount',
    type: 'number', min: 0, max: 30
  }));
  card.appendChild(radioGroup({
    label: 'Reversed sleep cycle (sleeps in day, awake at night)?',
    section: 'sleepWakeCycle', field: 'reversedSleepCycle', options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Sleep notes',
    section: 'sleepWakeCycle', field: 'sleepNotes',
    placeholder: 'Sleep environment, recent changes, melatonin use…'
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Medication Review',
    description: 'Current medications, anticholinergic / sedative burden, recent changes.'
  });

  const listHeader = document.createElement('h3');
  listHeader.textContent = 'Current medications';
  listHeader.style.cssText = 'font-size:0.95rem; font-weight:600; margin:0 0 0.5rem;';
  card.appendChild(listHeader);
  card.appendChild(medicationListEditor());

  card.appendChild(radioGroup({
    label: 'Significant anticholinergic burden?',
    section: 'medicationReview', field: 'anticholinergicBurden', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Sedative use (benzodiazepines, Z-drugs)?',
    section: 'medicationReview', field: 'sedativeUse', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Antipsychotic use?',
    section: 'medicationReview', field: 'antipsychoticUse', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Recent medication change (last 30 days)?',
    section: 'medicationReview', field: 'recentMedicationChange', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Details of recent medication change',
    section: 'medicationReview', field: 'recentMedicationChangeDetails'
  }));
  card.appendChild(selectInput({
    label: 'Medication adherence',
    section: 'medicationReview', field: 'medicationAdherence',
    options: [
      { value: 'good', label: 'Good — taken as prescribed' },
      { value: 'partial', label: 'Partial — occasional missed doses' },
      { value: 'poor', label: 'Poor — frequently missed or unsupervised' }
    ]
  }));
  card.appendChild(textArea({
    label: 'Medication notes',
    section: 'medicationReview', field: 'medicationNotes',
    placeholder: 'Allergies, intolerances, deprescribing plan…'
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Environmental Assessment',
    description: 'Physical and social environment factors.'
  });
  card.appendChild(radioGroup({
    label: 'Adequate daylight exposure during the day?',
    section: 'environmentalAssessment', field: 'adequateDaylight', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Excessive noise in the environment?',
    section: 'environmentalAssessment', field: 'excessiveNoise', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Unfamiliar environment (recent move, hospital admission)?',
    section: 'environmentalAssessment', field: 'unfamiliarEnvironment', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Cluttered or visually busy environment?',
    section: 'environmentalAssessment', field: 'cluttered', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Mirrors or strong shadows that may cause misperceptions?',
    section: 'environmentalAssessment', field: 'mirrorsOrShadows', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Consistent daily routine?',
    section: 'environmentalAssessment', field: 'consistentRoutine', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Adequate social contact during the day?',
    section: 'environmentalAssessment', field: 'adequateSocialContact', options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Environmental notes',
    section: 'environmentalAssessment', field: 'environmentalNotes',
    placeholder: 'Layout of bedroom, lighting, signage, orientation aids…'
  }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Carer Impact & Support',
    description: 'Effect on the primary carer and current support arrangements.'
  });
  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Primary carer name',
    section: 'carerImpact', field: 'primaryCarer'
  }));
  grid.appendChild(textInput({
    label: 'Relationship to patient',
    section: 'carerImpact', field: 'carerRelationship',
    placeholder: 'e.g. spouse, daughter, professional'
  }));
  card.appendChild(grid);
  card.appendChild(selectInput({
    label: 'Carer strain level',
    section: 'carerImpact', field: 'carerStrainLevel',
    options: [
      { value: 'none', label: 'None' },
      { value: 'minimal', label: 'Minimal' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' }
    ]
  }));
  card.appendChild(radioGroup({
    label: 'Is the carer\'s sleep disturbed by the patient?',
    section: 'carerImpact', field: 'carerSleepDisturbed', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Signs of carer burnout (exhaustion, low mood, withdrawal)?',
    section: 'carerImpact', field: 'carerBurnoutSigns', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Respite care arrangements in place?',
    section: 'carerImpact', field: 'respiteCareInPlace', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Engaged with formal support services (memory clinic, day centre)?',
    section: 'carerImpact', field: 'formalSupportEngaged', options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Carer notes',
    section: 'carerImpact', field: 'carerNotes',
    placeholder: 'Carer concerns, requests, family dynamics…'
  }));
  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Management Plan',
    description: 'Proposed plan, referrals, and review.'
  });
  card.appendChild(radioGroup({
    label: 'Non-pharmacological plan in place?',
    section: 'managementPlan', field: 'nonPharmacologicalPlan', options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Non-pharmacological plan details',
    section: 'managementPlan', field: 'nonPharmacologicalDetails',
    placeholder: 'Routine, activities, validation therapy, reminiscence…'
  }));
  card.appendChild(radioGroup({
    label: 'Environmental modifications planned?',
    section: 'managementPlan', field: 'environmentalModifications', options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Environmental modification details',
    section: 'managementPlan', field: 'environmentalModificationDetails',
    placeholder: 'Lighting, signage, declutter, bright-light therapy…'
  }));
  card.appendChild(radioGroup({
    label: 'Medication review required?',
    section: 'managementPlan', field: 'medicationReviewRequired', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Referral required?',
    section: 'managementPlan', field: 'referralRequired', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Referral details',
    section: 'managementPlan', field: 'referralDetails',
    placeholder: 'e.g. memory clinic, old-age psychiatry, social services'
  }));
  card.appendChild(textInput({
    label: 'Planned review date',
    section: 'managementPlan', field: 'reviewDate', type: 'date'
  }));
  card.appendChild(textArea({
    label: 'Plan summary',
    section: 'managementPlan', field: 'planSummary',
    placeholder: 'Overall plan and goals to share with the team and family…',
    rows: 4
  }));
  return card;
}

// ----------------------------------------------------------------------
// Conditional sections (for any data-conditional hosts; currently unused
// but kept symmetrical with the asthma reference for forward compatibility)
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, field] = path.split('.');
    const current = state[section]?.[field];
    host.style.display = String(current) === target ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  // Demographics
  ['demographics', 'firstName'],
  ['demographics', 'lastName'],
  ['demographics', 'dateOfBirth'],
  ['demographics', 'sex'],
  ['demographics', 'ageYears'],
  ['demographics', 'primaryDiagnosis'],
  ['demographics', 'careSetting'],
  // Cognitive status
  ['cognitiveStatus', 'dementiaStage'],
  ['cognitiveStatus', 'cognitiveImpairment'],
  ['cognitiveStatus', 'priorDeliriumHistory'],
  // Temporal pattern
  ['temporalPattern', 'episodeFrequency'],
  ['temporalPattern', 'worseAtDusk'],
  ['temporalPattern', 'worseSeasonally'],
  // Trigger identification
  ['triggerIdentification', 'fatigue'],
  ['triggerIdentification', 'hunger'],
  ['triggerIdentification', 'pain'],
  ['triggerIdentification', 'infection'],
  ['triggerIdentification', 'dehydration'],
  ['triggerIdentification', 'sensoryOverload'],
  ['triggerIdentification', 'unfamiliarSurroundings'],
  ['triggerIdentification', 'carerChange'],
  ['triggerIdentification', 'lowLight'],
  ['triggerIdentification', 'medicationTiming'],
  // Sleep-wake cycle
  ['sleepWakeCycle', 'difficultyFallingAsleep'],
  ['sleepWakeCycle', 'nighttimeWandering'],
  ['sleepWakeCycle', 'earlyMorningWaking'],
  ['sleepWakeCycle', 'daytimeNapping'],
  ['sleepWakeCycle', 'reversedSleepCycle'],
  // Medication review meta
  ['medicationReview', 'anticholinergicBurden'],
  ['medicationReview', 'sedativeUse'],
  ['medicationReview', 'antipsychoticUse'],
  ['medicationReview', 'recentMedicationChange'],
  ['medicationReview', 'medicationAdherence'],
  // Environmental assessment
  ['environmentalAssessment', 'adequateDaylight'],
  ['environmentalAssessment', 'excessiveNoise'],
  ['environmentalAssessment', 'unfamiliarEnvironment'],
  ['environmentalAssessment', 'cluttered'],
  ['environmentalAssessment', 'mirrorsOrShadows'],
  ['environmentalAssessment', 'consistentRoutine'],
  ['environmentalAssessment', 'adequateSocialContact'],
  // Carer impact
  ['carerImpact', 'carerStrainLevel'],
  ['carerImpact', 'carerSleepDisturbed'],
  ['carerImpact', 'carerBurnoutSigns'],
  ['carerImpact', 'respiteCareInPlace'],
  ['carerImpact', 'formalSupportEngaged'],
  // Management plan
  ['managementPlan', 'nonPharmacologicalPlan'],
  ['managementPlan', 'environmentalModifications'],
  ['managementPlan', 'medicationReviewRequired'],
  ['managementPlan', 'referralRequired']
];

function computeSectionTallies() {
  const sectionAnswered = {};
  const sectionTotal = {};
  let answered = 0;
  // Top-level tracked fields
  for (const [section, field] of TRACKED_FIELDS) {
    sectionTotal[section] = (sectionTotal[section] || 0) + 1;
    const v = state[section]?.[field];
    if (v !== null && v !== undefined && v !== '') {
      sectionAnswered[section] = (sectionAnswered[section] || 0) + 1;
      answered++;
    }
  }
  // CMAI items: count as behaviouralSymptoms entries
  for (const id of CMAI_ITEM_IDS) {
    sectionTotal.behaviouralSymptoms = (sectionTotal.behaviouralSymptoms || 0) + 1;
    const v = state.behaviouralSymptoms.cmai[id];
    if (typeof v === 'number' && v >= 1) {
      sectionAnswered.behaviouralSymptoms = (sectionAnswered.behaviouralSymptoms || 0) + 1;
      answered++;
    }
  }
  // NPI domains: count a domain answered if both frequency and severity set
  for (const key of NPI_DOMAIN_KEYS) {
    sectionTotal.behaviouralSymptoms = (sectionTotal.behaviouralSymptoms || 0) + 1;
    const e = state.behaviouralSymptoms.npi[key];
    if (e && e.frequency >= 1 && e.severity >= 1) {
      sectionAnswered.behaviouralSymptoms = (sectionAnswered.behaviouralSymptoms || 0) + 1;
      answered++;
    }
  }
  return { answered, sectionAnswered, sectionTotal };
}

function totalTrackedFields() {
  return TRACKED_FIELDS.length + CMAI_ITEM_IDS.length + NPI_DOMAIN_KEYS.length;
}

function updateProgress() {
  const { answered, sectionAnswered, sectionTotal } = computeSectionTallies();
  const total = totalTrackedFields();
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  updateStepListStatuses(sectionAnswered, sectionTotal);
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1,  section: 'demographics',             title: 'Demographics' },
  { step: 2,  section: 'cognitiveStatus',          title: 'Cognitive Status' },
  { step: 3,  section: 'behaviouralSymptoms',      title: 'Behavioural (CMAI/NPI)' },
  { step: 4,  section: 'temporalPattern',          title: 'Temporal Pattern' },
  { step: 5,  section: 'triggerIdentification',    title: 'Triggers' },
  { step: 6,  section: 'sleepWakeCycle',           title: 'Sleep-Wake' },
  { step: 7,  section: 'medicationReview',         title: 'Medications' },
  { step: 8,  section: 'environmentalAssessment',  title: 'Environment' },
  { step: 9,  section: 'carerImpact',              title: 'Carer Impact' },
  { step: 10, section: 'managementPlan',           title: 'Management Plan' }
];

function renderStepList() {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  ol.innerHTML = '';
  for (const def of STEP_DEFINITIONS) {
    const li = document.createElement('li');
    li.className = 'step-list-item';
    li.dataset.status = 'waiting';
    li.dataset.step = String(def.step);
    li.setAttribute('aria-label', `Step ${def.step}: ${def.title}`);
    li.innerHTML = `<span>${esc(def.title)}</span>`;
    li.addEventListener('click', () => {
      const target = document.getElementById(`step-${def.step}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    ol.appendChild(li);
  }
}

function updateStepListStatuses(sectionAnswered, sectionTotal) {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  for (const def of STEP_DEFINITIONS) {
    const li = ol.querySelector(`[data-step="${def.step}"]`);
    if (!li) continue;
    const a = sectionAnswered[def.section] || 0;
    const t = sectionTotal[def.section] || 0;
    if (t > 0 && a === t) {
      li.dataset.status = 'finished';
      li.removeAttribute('aria-current');
    } else if (a > 0) {
      li.dataset.status = 'in-progress';
      if (firstUnfinished === -1) firstUnfinished = def.step;
    } else {
      li.dataset.status = 'waiting';
      li.removeAttribute('aria-current');
    }
  }
  if (firstUnfinished === -1) firstUnfinished = STEP_DEFINITIONS[0].step;
  const current = ol.querySelector(`[data-step="${firstUnfinished}"]`);
  if (current) {
    current.setAttribute('aria-current', 'step');
    if (current.dataset.status === 'waiting') {
      current.dataset.status = 'in-progress';
    }
  }
  ol.dataset.current = String(firstUnfinished - 1);
}

// ----------------------------------------------------------------------
// Validation (per-field + error summary)
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
  const fs = document.getElementById(`${id}-fieldset`);
  if (fs) fs.removeAttribute('aria-invalid');
}

function setFieldError(id, message) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = message;
  const input = document.getElementById(id);
  if (input) input.setAttribute('aria-invalid', 'true');
}

function validateForm() {
  const errors = [];
  const form = document.getElementById('assessment-form');
  if (!form) return errors;
  const required = form.querySelectorAll('[data-required]');
  const seen = new Set();
  required.forEach((input) => {
    let id = input.id;
    if (input.type === 'radio') id = input.name;
    if (seen.has(id)) return;
    seen.add(id);
    let value = '';
    if (input.type === 'radio') {
      const chosen = form.querySelector(`input[name="${id}"]:checked`);
      value = chosen ? chosen.value : '';
    } else {
      value = (input.value || '').trim();
    }
    if (!value) {
      const fs = document.getElementById(`${id}-fieldset`);
      const labelEl = form.querySelector(`label[for="${id}"]`);
      const label = (fs ? fs.querySelector('legend') : labelEl);
      const labelText = label
        ? label.textContent.replace(/\s*\*\s*$/, '').trim()
        : id;
      errors.push({ id, message: `${labelText} is required` });
      setFieldError(id, `${labelText} is required`);
    } else {
      clearFieldError(id);
    }
  });
  renderErrorSummary(errors);
  return errors;
}

function renderErrorSummary(errors) {
  const summary = document.getElementById('error-summary');
  if (!summary) return;
  if (errors.length === 0) {
    summary.hidden = true;
    summary.innerHTML = '';
    return;
  }
  summary.hidden = false;
  summary.innerHTML =
    '<strong>Please correct the following:</strong>' +
    '<ul>' +
    errors.map((e) =>
      `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`
    ).join('') +
    '</ul>';
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (typeof summary.focus === 'function') {
    summary.setAttribute('tabindex', '-1');
    summary.focus({ preventScroll: true });
  }
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

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    cmaiScore, npiScore, severity,
    cmaiAnsweredCount, npiAnsweredCount,
    firedRules, additionalFlags, timestamp
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
      <td>${esc(r.description)}<br><span class="muted">${esc(r.detail)}</span></td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No rules fired.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Category</th>
            <th scope="col">Finding</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Sundowner Syndrome Assessment Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>Overall severity</h3>
      <p class="score-summary">
        <span class="severity-badge ${severityClass(severity)}">${esc(severityLabel(severity))}</span>
        <span class="score-badge">CMAI ${cmaiScore} / 203</span>
        <span class="score-badge">NPI ${npiScore} / 144</span>
      </p>
      <p class="muted">
        Based on ${cmaiAnsweredCount} of 29 CMAI items observed and
        ${npiAnsweredCount} of 12 NPI domains endorsed. CMAI thresholds:
        29-45 mild, 46-75 moderate, 76-120 severe, &gt;120 critical.
      </p>

      <h3>Fired rules</h3>
      ${firedTable}

      <h3>Flagged issues</h3>
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
  const errs = validateForm();
  if (errs.length > 0) return;
  const grading = gradeSundowner(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    cmaiScore: grading.cmaiScore,
    npiScore: grading.npiScore,
    severity: grading.severity,
    cmaiAnsweredCount: grading.cmaiAnsweredCount,
    npiAnsweredCount: grading.npiAnsweredCount,
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
  const _rep = document.getElementById('report');
  if (_rep) _rep.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  updateConditionalSections();
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
  host.appendChild(renderStep10());
}

function init() {
  renderStepList();
  renderForm();
  updateProgress();
  updateConditionalSections();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
