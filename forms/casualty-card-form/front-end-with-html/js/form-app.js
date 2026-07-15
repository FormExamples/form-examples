import { detectFlaggedIssues } from './flagged-issues.js';
import { calculateNEWS2 } from './news2-calculator.js';
import { calculateGCSTotal, emptyCasualtyCard, news2ResponseClass, news2ResponseLabel } from './types.js';

// Casualty Card Form — patient wizard (vanilla JavaScript, no build).
//
// Single continuous page; all 14 sections are rendered in document order.
// A sticky top-of-page progress summary reflects how many fields have
// been answered. Submission runs the pure NEWS2 calculator and renders an
// inline aria-live report. State persists in localStorage so a partial
// fill survives a reload.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'casualty-card-form.front-end-form-with-html.v1';
const TOTAL_STEPS = 14;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCasualtyCard();
    const parsed = JSON.parse(raw);
    return mergeIntoFresh(parsed);
  } catch (e) {
    console.warn('Could not parse saved casualty card; starting fresh.', e);
    return emptyCasualtyCard();
  }
}

/** Deep-merge a parsed payload over a fresh empty default. */
function mergeIntoFresh(parsed) {
  const fresh = emptyCasualtyCard();
  if (!parsed || typeof parsed !== 'object') return fresh;
  for (const key of Object.keys(fresh)) {
    if (parsed[key] && typeof parsed[key] === 'object') {
      fresh[key] = deepMerge(fresh[key], parsed[key]);
    }
  }
  return fresh;
}

function deepMerge(target, source) {
  if (Array.isArray(target)) {
    return Array.isArray(source) ? source.slice() : target;
  }
  if (target && typeof target === 'object') {
    const out = { ...target };
    for (const k of Object.keys(target)) {
      if (source && Object.prototype.hasOwnProperty.call(source, k)) {
        out[k] = deepMerge(target[k], source[k]);
      }
    }
    return out;
  }
  return source !== undefined ? source : target;
}

function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn('Could not save casualty card to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored casualty card.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

let state = loadState();
let lastResult = null;

function setField(path, value) {
  setNestedValue(state, path, value);
  recomputeDerived();
  saveState(state);
  updateProgress();
  updateConditionalSections();
  refreshAutoCalculatedReadouts();
}

function getNestedValue(obj, path) {
  return path
    .split('.')
    .reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] === undefined || current[keys[i]] === null) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

function recomputeDerived() {
  state.primarySurvey.disability.gcsTotal = calculateGCSTotal(
    state.primarySurvey.disability.gcsEye,
    state.primarySurvey.disability.gcsVerbal,
    state.primarySurvey.disability.gcsMotor
  );
}

/** HTML-escape a value for safe rendering. */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ----------------------------------------------------------------------
// Component builders
// ----------------------------------------------------------------------

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
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const value = getNestedValue(state, opts.path);
  const labelText =
    esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value == null ? '' : value)}"`
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
    <span class="error-message" id="${id}-error"></span>
  `;

  const input = wrapper.querySelector('input');
  input.setAttribute('aria-describedby', `${id}-error`);
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') v = v === '' ? null : Number(v);
    setField(opts.path, v);
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const value = getNestedValue(state, opts.path) || '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      aria-describedby="${id}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setField(opts.path, ta.value);
    clearFieldError(id);
  });
  return wrapper;
}

function selectInput(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const current = getNestedValue(state, opts.path) || '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const optionsHtml = [
    `<option value="">\u2014 Select \u2014</option>`,
    ...opts.options.map(
      (o) =>
        `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select" aria-describedby="${id}-error">${optionsHtml}</select>
    <span class="error-message" id="${id}-error"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    setField(opts.path, sel.value);
    clearFieldError(id);
  });
  return wrapper;
}

function radioGroup(opts) {
  const groupId = `f-${opts.path.replace(/\./g, '-')}`;
  const current = getNestedValue(state, opts.path);
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field';
  wrapper.id = `${groupId}-fieldset`;

  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.textContent = opts.label;
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
    label.innerHTML = `
      <input class="radio-input" type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) {
        setField(opts.path, option.value);
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

/** Multi-select with checkboxes; binds an array of strings. */
function checkboxGroup(opts) {
  const groupId = `f-${opts.path.replace(/\./g, '-')}`;
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field';
  wrapper.id = `${groupId}-fieldset`;

  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.textContent = opts.label;
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'checkbox-group';
  list.setAttribute('role', 'group');
  list.setAttribute('aria-labelledby', wrapper.id);
  const current = getNestedValue(state, opts.path) || [];
  for (const option of opts.options) {
    const id = `cb-${opts.path.replace(/\./g, '-')}-${option.value.replace(/[^a-zA-Z0-9]+/g, '-')}`;
    const label = document.createElement('label');
    label.htmlFor = id;
    const checked = current.includes(option.value) ? ' checked' : '';
    label.innerHTML = `
      <input class="checkbox-input" type="checkbox" id="${id}" value="${esc(option.value)}"${checked}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      const arr = (getNestedValue(state, opts.path) || []).slice();
      const idx = arr.indexOf(option.value);
      if (input.checked && idx === -1) arr.push(option.value);
      if (!input.checked && idx !== -1) arr.splice(idx, 1);
      setField(opts.path, arr);
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  return wrapper;
}

function readOnlyReadout(opts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field readout';
  wrapper.innerHTML = `
    <label class="label">${esc(opts.label)}</label>
    <div id="${opts.id}" class="readout-value">${opts.render()}</div>
  `;
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
  legend.innerHTML = `
    <span class="section-step">Section ${opts.stepNumber} of ${TOTAL_STEPS}</span>
    <span class="section-title">${esc(opts.title)}</span>
    ${desc}
  `;
  card.appendChild(legend);
  return card;
}

function subsectionTitle(text) {
  const h = document.createElement('h3');
  h.className = 'subsection-title';
  h.textContent = text;
  return h;
}

function conditionalBlock(condition) {
  const div = document.createElement('div');
  div.className = 'conditional-block';
  div.dataset.conditional = condition;
  return div;
}

function conditionalAnyBlock(condition) {
  const div = document.createElement('div');
  div.className = 'conditional-block';
  div.dataset.conditionalAny = condition;
  return div;
}

// ----------------------------------------------------------------------
// Repeating-list editors
// ----------------------------------------------------------------------

/**
 * Generic list editor.
 * `cells` describes each column (label, key, type/options) for one row;
 * `factory` returns a fresh empty row.
 */
function listEditor(opts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'list-editor';

  function rerender() {
    const rows = getNestedValue(state, opts.path) || [];
    wrapper.innerHTML = '';
    if (rows.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'list-empty';
      empty.textContent = opts.emptyLabel || 'None added.';
      wrapper.appendChild(empty);
    }
    rows.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = `list-row ${opts.rowClass || ''}`.trim();
      const cellsHtml = opts.cells
        .map((c) => {
          if (c.type === 'select') {
            const opts2 = [
              `<option value="">\u2014 Select \u2014</option>`,
              ...c.options.map(
                (o) =>
                  `<option value="${esc(o.value)}"${row[c.key] === o.value ? ' selected' : ''}>${esc(o.label)}</option>`
              )
            ].join('');
            return `<label class="list-cell"><span>${esc(c.label)}</span><select class="select" data-key="${c.key}">${opts2}</select></label>`;
          }
          const t = c.type || 'text';
          const placeholder = c.placeholder ? ` placeholder="${esc(c.placeholder)}"` : '';
          return `<label class="list-cell"><span>${esc(c.label)}</span><input type="${t}" class="${lilyInputClass(t)}" data-key="${c.key}" value="${esc(row[c.key] == null ? '' : row[c.key])}"${placeholder}></label>`;
        })
        .join('');
      r.innerHTML = `
        <div class="list-grid ${opts.gridClass || ''}">
          ${cellsHtml}
          <button type="button" class="button" data-variant="icon" aria-label="Remove">&times;</button>
        </div>
      `;
      r.querySelectorAll('input, select').forEach((inp) => {
        const evt = inp.tagName === 'SELECT' ? 'change' : 'input';
        inp.addEventListener(evt, () => {
          rows[idx][inp.dataset.key] = inp.value;
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
    addBtn.setAttribute('data-variant', 'add');
    addBtn.textContent = `+ ${opts.addLabel}`;
    addBtn.addEventListener('click', () => {
      rows.push(opts.factory());
      setNestedValue(state, opts.path, rows);
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
// Section renderers
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const ethnicityOptions = [
  { value: 'white-british', label: 'White British' },
  { value: 'white-irish', label: 'White Irish' },
  { value: 'white-other', label: 'White Other' },
  { value: 'mixed-white-black-caribbean', label: 'Mixed - White & Black Caribbean' },
  { value: 'mixed-white-black-african', label: 'Mixed - White & Black African' },
  { value: 'mixed-white-asian', label: 'Mixed - White & Asian' },
  { value: 'mixed-other', label: 'Mixed Other' },
  { value: 'asian-indian', label: 'Asian Indian' },
  { value: 'asian-pakistani', label: 'Asian Pakistani' },
  { value: 'asian-bangladeshi', label: 'Asian Bangladeshi' },
  { value: 'asian-chinese', label: 'Asian Chinese' },
  { value: 'asian-other', label: 'Asian Other' },
  { value: 'black-african', label: 'Black African' },
  { value: 'black-caribbean', label: 'Black Caribbean' },
  { value: 'black-other', label: 'Black Other' },
  { value: 'other', label: 'Other' },
  { value: 'not-stated', label: 'Not Stated' }
];

const mtsFlowchartOptions = [
  'abdominal-pain', 'allergy', 'asthma', 'back-pain', 'breathing-difficulty',
  'burns-scalds', 'chest-pain', 'collapse', 'dental-problems',
  'diarrhoea-vomiting', 'ear-problems', 'eye-problems', 'falls',
  'head-injury', 'headache', 'limb-problems', 'major-trauma',
  'mental-health', 'neck-pain', 'overdose-poisoning', 'palpitations',
  'rashes', 'self-harm', 'shortness-of-breath', 'sore-throat',
  'unwell-adult', 'unwell-child', 'urinary-problems', 'wound', 'other'
].map((v) => ({
  value: v,
  label: v.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
}));

const bloodTestOptions = [
  'FBC', 'U&E', 'LFTs', 'CRP', 'Coagulation', 'Troponin',
  'D-dimer', 'Amylase', 'Blood glucose', 'Blood gases', 'Lactate', 'Cross-match'
].map((v) => ({ value: v, label: v }));

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Patient Demographics',
    description: 'Patient identification and contact details.'
  });

  const names = document.createElement('div');
  names.className = 'two-col';
  names.appendChild(textInput({ label: 'First Name', path: 'demographics.firstName', required: true }));
  names.appendChild(textInput({ label: 'Last Name', path: 'demographics.lastName', required: true }));
  card.appendChild(names);

  const dob = document.createElement('div');
  dob.className = 'two-col';
  dob.appendChild(textInput({ label: 'Date of Birth', path: 'demographics.dateOfBirth', type: 'date', required: true }));
  dob.appendChild(textInput({ label: 'NHS Number', path: 'demographics.nhsNumber', placeholder: '000 000 0000' }));
  card.appendChild(dob);

  card.appendChild(radioGroup({
    label: 'Sex',
    path: 'demographics.sex',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]
  }));

  card.appendChild(textInput({ label: 'Address', path: 'demographics.address' }));

  const contact = document.createElement('div');
  contact.className = 'two-col';
  contact.appendChild(textInput({ label: 'Postcode', path: 'demographics.postcode' }));
  contact.appendChild(textInput({ label: 'Phone', path: 'demographics.phone', type: 'tel' }));
  card.appendChild(contact);

  card.appendChild(textInput({ label: 'Email', path: 'demographics.email', type: 'email' }));

  const lang = document.createElement('div');
  lang.className = 'two-col';
  lang.appendChild(selectInput({ label: 'Ethnicity', path: 'demographics.ethnicity', options: ethnicityOptions }));
  lang.appendChild(textInput({ label: 'Preferred Language', path: 'demographics.preferredLanguage' }));
  card.appendChild(lang);

  card.appendChild(radioGroup({
    label: 'Interpreter Required?',
    path: 'demographics.interpreterRequired',
    options: yesNo
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Next of Kin & GP',
    description: 'Emergency contact and general practitioner details.'
  });

  card.appendChild(subsectionTitle('Next of Kin'));
  const nokRow = document.createElement('div');
  nokRow.className = 'two-col';
  nokRow.appendChild(textInput({ label: 'Name', path: 'nextOfKinGP.nextOfKin.name' }));
  nokRow.appendChild(textInput({ label: 'Relationship', path: 'nextOfKinGP.nextOfKin.relationship' }));
  card.appendChild(nokRow);
  card.appendChild(textInput({ label: 'Phone', path: 'nextOfKinGP.nextOfKin.phone', type: 'tel' }));
  card.appendChild(radioGroup({
    label: 'Next of Kin Notified?',
    path: 'nextOfKinGP.nextOfKin.notified',
    options: yesNo
  }));

  card.appendChild(subsectionTitle('General Practitioner'));
  card.appendChild(textInput({ label: 'GP Name', path: 'nextOfKinGP.gp.name' }));
  card.appendChild(textInput({ label: 'Practice Name', path: 'nextOfKinGP.gp.practiceName' }));
  card.appendChild(textInput({ label: 'Practice Address', path: 'nextOfKinGP.gp.practiceAddress' }));
  card.appendChild(textInput({ label: 'Practice Phone', path: 'nextOfKinGP.gp.practicePhone', type: 'tel' }));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Arrival & Triage',
    description: 'Attendance details and Manchester Triage System assessment.'
  });

  const arrival = document.createElement('div');
  arrival.className = 'two-col';
  arrival.appendChild(textInput({ label: 'Attendance Date', path: 'arrivalTriage.attendanceDate', type: 'date' }));
  arrival.appendChild(textInput({ label: 'Arrival Time', path: 'arrivalTriage.arrivalTime', type: 'time' }));
  card.appendChild(arrival);

  card.appendChild(radioGroup({
    label: 'Attendance Category',
    path: 'arrivalTriage.attendanceCategory',
    options: [
      { value: 'first', label: 'First' },
      { value: 'follow-up', label: 'Follow-up' },
      { value: 'planned', label: 'Planned' },
      { value: 'unplanned', label: 'Unplanned' }
    ]
  }));

  card.appendChild(selectInput({
    label: 'Arrival Mode',
    path: 'arrivalTriage.arrivalMode',
    options: [
      { value: 'ambulance', label: 'Ambulance' },
      { value: 'walk-in', label: 'Walk-in' },
      { value: 'helicopter', label: 'Helicopter' },
      { value: 'police', label: 'Police' },
      { value: 'other', label: 'Other' }
    ]
  }));

  card.appendChild(selectInput({
    label: 'Referral Source',
    path: 'arrivalTriage.referralSource',
    options: [
      { value: 'self', label: 'Self-referral' },
      { value: 'gp', label: 'GP' },
      { value: '999', label: '999' },
      { value: 'nhs111', label: 'NHS 111' },
      { value: 'other-hospital', label: 'Other Hospital' },
      { value: 'police', label: 'Police' },
      { value: 'other', label: 'Other' }
    ]
  }));

  const ambBlock = conditionalBlock('arrivalTriage.arrivalMode=ambulance');
  ambBlock.appendChild(textInput({
    label: 'Ambulance Incident Number',
    path: 'arrivalTriage.ambulanceIncidentNumber'
  }));
  card.appendChild(ambBlock);

  card.appendChild(subsectionTitle('Triage'));
  const triage = document.createElement('div');
  triage.className = 'two-col';
  triage.appendChild(textInput({ label: 'Triage Time', path: 'arrivalTriage.triageTime', type: 'time' }));
  triage.appendChild(textInput({ label: 'Triage Nurse', path: 'arrivalTriage.triageNurse' }));
  card.appendChild(triage);

  card.appendChild(selectInput({
    label: 'MTS Flowchart',
    path: 'arrivalTriage.mtsFlowchart',
    options: mtsFlowchartOptions
  }));
  card.appendChild(selectInput({
    label: 'MTS Category',
    path: 'arrivalTriage.mtsCategory',
    options: [
      { value: '1-immediate', label: '1 - Immediate (Red)' },
      { value: '2-very-urgent', label: '2 - Very Urgent (Orange)' },
      { value: '3-urgent', label: '3 - Urgent (Yellow)' },
      { value: '4-standard', label: '4 - Standard (Green)' },
      { value: '5-non-urgent', label: '5 - Non-Urgent (Blue)' }
    ]
  }));
  card.appendChild(textInput({ label: 'MTS Discriminator', path: 'arrivalTriage.mtsDiscriminator' }));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Presenting Complaint',
    description: 'Chief complaint and history of presenting illness.'
  });

  card.appendChild(textInput({
    label: 'Chief Complaint', path: 'presentingComplaint.chiefComplaint', required: true
  }));
  card.appendChild(textArea({
    label: 'History of Presenting Complaint',
    path: 'presentingComplaint.historyOfPresentingComplaint',
    rows: 4
  }));

  card.appendChild(subsectionTitle('Symptom Details'));

  const r1 = document.createElement('div');
  r1.className = 'two-col';
  r1.appendChild(textInput({ label: 'Onset', path: 'presentingComplaint.onset', placeholder: 'When did it start?' }));
  r1.appendChild(textInput({ label: 'Duration', path: 'presentingComplaint.duration' }));
  card.appendChild(r1);

  const r2 = document.createElement('div');
  r2.className = 'two-col';
  r2.appendChild(textInput({ label: 'Character', path: 'presentingComplaint.character', placeholder: 'e.g. sharp, dull, burning' }));
  r2.appendChild(textInput({ label: 'Severity', path: 'presentingComplaint.severity' }));
  card.appendChild(r2);

  const r3 = document.createElement('div');
  r3.className = 'two-col';
  r3.appendChild(textInput({ label: 'Location', path: 'presentingComplaint.location' }));
  r3.appendChild(textInput({ label: 'Radiation', path: 'presentingComplaint.radiation' }));
  card.appendChild(r3);

  card.appendChild(textArea({ label: 'Aggravating Factors', path: 'presentingComplaint.aggravatingFactors', rows: 2 }));
  card.appendChild(textArea({ label: 'Relieving Factors', path: 'presentingComplaint.relievingFactors', rows: 2 }));
  card.appendChild(textArea({ label: 'Associated Symptoms', path: 'presentingComplaint.associatedSymptoms', rows: 2 }));
  card.appendChild(textArea({ label: 'Previous Episodes', path: 'presentingComplaint.previousEpisodes', rows: 2 }));
  card.appendChild(textArea({ label: 'Treatment Prior to Arrival', path: 'presentingComplaint.treatmentPriorToArrival', rows: 2 }));

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Pain Assessment',
    description: 'Numeric Rating Scale (NRS) pain evaluation.'
  });

  card.appendChild(radioGroup({
    label: 'Is the patient in pain?',
    path: 'painAssessment.painPresent',
    options: yesNo
  }));

  const cond = conditionalBlock('painAssessment.painPresent=yes');
  cond.appendChild(textInput({
    label: 'Pain Score (0-10 NRS)',
    path: 'painAssessment.painScore',
    type: 'number', min: 0, max: 10
  }));
  cond.appendChild(textInput({ label: 'Pain Location', path: 'painAssessment.painLocation' }));
  cond.appendChild(textInput({
    label: 'Pain Character',
    path: 'painAssessment.painCharacter',
    placeholder: 'e.g. sharp, aching, burning, throbbing'
  }));
  cond.appendChild(textInput({
    label: 'Pain Onset',
    path: 'painAssessment.painOnset',
    placeholder: 'e.g. sudden, gradual'
  }));
  cond.appendChild(radioGroup({
    label: 'Pain Severity Category',
    path: 'painAssessment.painSeverityCategory',
    options: [
      { value: 'mild', label: 'Mild (1-3)' },
      { value: 'moderate', label: 'Moderate (4-6)' },
      { value: 'severe', label: 'Severe (7-10)' }
    ]
  }));
  card.appendChild(cond);

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Medical History',
    description: 'Past medical history, medications, allergies, social history.'
  });

  card.appendChild(textArea({ label: 'Past Medical History', path: 'medicalHistory.pastMedicalHistory', rows: 3 }));
  card.appendChild(textArea({ label: 'Past Surgical History', path: 'medicalHistory.pastSurgicalHistory', rows: 2 }));

  card.appendChild(subsectionTitle('Current Medications'));
  card.appendChild(listEditor({
    path: 'medicalHistory.medications',
    cells: [
      { label: 'Name', key: 'name', placeholder: 'e.g. Apixaban' },
      { label: 'Dose', key: 'dose', placeholder: 'e.g. 5 mg' },
      { label: 'Frequency', key: 'frequency', placeholder: 'e.g. BD' }
    ],
    gridClass: 'med-grid',
    factory: () => ({ name: '', dose: '', frequency: '' }),
    addLabel: 'Add medication',
    emptyLabel: 'No medications added.'
  }));

  card.appendChild(subsectionTitle('Allergies'));
  card.appendChild(listEditor({
    path: 'medicalHistory.allergies',
    cells: [
      { label: 'Allergen', key: 'allergen', placeholder: 'e.g. Penicillin' },
      { label: 'Reaction', key: 'reaction', placeholder: 'e.g. rash, swelling' },
      {
        label: 'Severity', key: 'severity', type: 'select',
        options: [
          { value: 'mild', label: 'Mild' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'anaphylaxis', label: 'Anaphylaxis' }
        ]
      }
    ],
    gridClass: 'allergy-grid',
    factory: () => ({ allergen: '', reaction: '', severity: '' }),
    addLabel: 'Add allergy',
    emptyLabel: 'No allergies recorded.'
  }));

  card.appendChild(radioGroup({
    label: 'Tetanus Status',
    path: 'medicalHistory.tetanusStatus',
    options: [
      { value: 'up-to-date', label: 'Up to Date' },
      { value: 'not-up-to-date', label: 'Not Up to Date' },
      { value: 'unknown', label: 'Unknown' }
    ]
  }));

  card.appendChild(radioGroup({
    label: 'Smoking Status',
    path: 'medicalHistory.smokingStatus',
    options: [
      { value: 'current', label: 'Current' },
      { value: 'ex', label: 'Ex-smoker' },
      { value: 'never', label: 'Never' }
    ]
  }));

  card.appendChild(textInput({ label: 'Alcohol Consumption', path: 'medicalHistory.alcoholConsumption' }));
  card.appendChild(textInput({ label: 'Recreational Drug Use', path: 'medicalHistory.recreationalDrugUse' }));
  card.appendChild(textInput({ label: 'Last Oral Intake', path: 'medicalHistory.lastOralIntake' }));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Vital Signs',
    description: 'Observations for NEWS2 auto-calculation.'
  });

  const r1 = document.createElement('div');
  r1.className = 'two-col';
  r1.appendChild(textInput({
    label: 'Heart Rate', path: 'vitalSigns.heartRate',
    type: 'number', min: 20, max: 250, unit: 'bpm'
  }));
  r1.appendChild(textInput({
    label: 'Respiratory Rate', path: 'vitalSigns.respiratoryRate',
    type: 'number', min: 1, max: 60, unit: '/min'
  }));
  card.appendChild(r1);

  const r2 = document.createElement('div');
  r2.className = 'two-col';
  r2.appendChild(textInput({
    label: 'Systolic BP', path: 'vitalSigns.systolicBP',
    type: 'number', min: 40, max: 300, unit: 'mmHg'
  }));
  r2.appendChild(textInput({
    label: 'Diastolic BP', path: 'vitalSigns.diastolicBP',
    type: 'number', min: 20, max: 200, unit: 'mmHg'
  }));
  card.appendChild(r2);

  const r3 = document.createElement('div');
  r3.className = 'two-col';
  r3.appendChild(textInput({
    label: 'Oxygen Saturation', path: 'vitalSigns.oxygenSaturation',
    type: 'number', min: 50, max: 100, unit: '%'
  }));
  r3.appendChild(textInput({
    label: 'Temperature', path: 'vitalSigns.temperature',
    type: 'number', min: 30, max: 45, step: 0.1, unit: '\u00B0C'
  }));
  card.appendChild(r3);

  card.appendChild(radioGroup({
    label: 'Supplemental Oxygen?',
    path: 'vitalSigns.supplementalOxygen',
    options: yesNo
  }));
  const oxyBlock = conditionalBlock('vitalSigns.supplementalOxygen=yes');
  oxyBlock.appendChild(textInput({
    label: 'Oxygen Flow Rate', path: 'vitalSigns.oxygenFlowRate',
    type: 'number', min: 0, max: 15, step: 0.5, unit: 'L/min'
  }));
  card.appendChild(oxyBlock);

  card.appendChild(textInput({
    label: 'Blood Glucose', path: 'vitalSigns.bloodGlucose',
    type: 'number', min: 0, max: 40, step: 0.1, unit: 'mmol/L'
  }));

  card.appendChild(radioGroup({
    label: 'Consciousness Level (ACVPU)',
    path: 'vitalSigns.consciousnessLevel',
    options: [
      { value: 'alert', label: 'Alert' },
      { value: 'verbal', label: 'Verbal' },
      { value: 'pain', label: 'Pain' },
      { value: 'unresponsive', label: 'Unresponsive' }
    ]
  }));

  card.appendChild(subsectionTitle('Pupils'));
  const pl = document.createElement('div');
  pl.className = 'two-col';
  pl.appendChild(textInput({
    label: 'Left Pupil Size', path: 'vitalSigns.pupilLeftSize',
    type: 'number', min: 1, max: 9, unit: 'mm'
  }));
  pl.appendChild(radioGroup({
    label: 'Left Reactive?',
    path: 'vitalSigns.pupilLeftReactive',
    options: yesNo
  }));
  card.appendChild(pl);

  const pr = document.createElement('div');
  pr.className = 'two-col';
  pr.appendChild(textInput({
    label: 'Right Pupil Size', path: 'vitalSigns.pupilRightSize',
    type: 'number', min: 1, max: 9, unit: 'mm'
  }));
  pr.appendChild(radioGroup({
    label: 'Right Reactive?',
    path: 'vitalSigns.pupilRightReactive',
    options: yesNo
  }));
  card.appendChild(pr);

  const r4 = document.createElement('div');
  r4.className = 'two-col';
  r4.appendChild(textInput({
    label: 'Capillary Refill Time', path: 'vitalSigns.capillaryRefillTime',
    type: 'number', min: 0, max: 10, step: 0.5, unit: 'sec'
  }));
  r4.appendChild(textInput({
    label: 'Weight', path: 'vitalSigns.weight',
    type: 'number', min: 1, max: 400, step: 0.1, unit: 'kg'
  }));
  card.appendChild(r4);

  card.appendChild(readOnlyReadout({
    label: 'Live NEWS2 score',
    id: 'news2-readout',
    render: () => renderNews2Readout()
  }));

  return card;
}

function renderNews2Readout() {
  const r = calculateNEWS2(state.vitalSigns);
  return `<strong>${r.totalScore}</strong> <span class="muted">(${esc(news2ResponseLabel(r.clinicalResponse))})</span>`;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Primary Survey (ABCDE)',
    description: 'Systematic ABCDE assessment.'
  });

  card.appendChild(subsectionTitle('A — Airway'));
  card.appendChild(selectInput({
    label: 'Airway Status',
    path: 'primarySurvey.airway.status',
    options: [
      { value: 'patent', label: 'Patent' },
      { value: 'compromised', label: 'Compromised' },
      { value: 'obstructed', label: 'Obstructed' }
    ]
  }));
  card.appendChild(textInput({
    label: 'Adjuncts Used', path: 'primarySurvey.airway.adjuncts',
    placeholder: 'e.g. OPA, NPA, LMA'
  }));
  card.appendChild(radioGroup({
    label: 'C-Spine Immobilised?',
    path: 'primarySurvey.airway.cSpineImmobilised',
    options: yesNo
  }));

  card.appendChild(subsectionTitle('B — Breathing'));
  card.appendChild(selectInput({
    label: 'Breathing Effort',
    path: 'primarySurvey.breathing.effort',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'laboured', label: 'Laboured' },
      { value: 'shallow', label: 'Shallow' },
      { value: 'absent', label: 'Absent' }
    ]
  }));
  card.appendChild(textInput({
    label: 'Chest Movement', path: 'primarySurvey.breathing.chestMovement',
    placeholder: 'e.g. bilateral, equal'
  }));
  card.appendChild(textInput({
    label: 'Breath Sounds', path: 'primarySurvey.breathing.breathSounds',
    placeholder: 'e.g. clear, wheeze, crackles'
  }));
  card.appendChild(textInput({
    label: 'Trachea Position', path: 'primarySurvey.breathing.tracheaPosition',
    placeholder: 'e.g. central, deviated'
  }));

  card.appendChild(subsectionTitle('C — Circulation'));
  card.appendChild(textInput({
    label: 'Pulse Character', path: 'primarySurvey.circulation.pulseCharacter',
    placeholder: 'e.g. regular, strong'
  }));
  const cRow = document.createElement('div');
  cRow.className = 'two-col';
  cRow.appendChild(textInput({
    label: 'Skin Colour', path: 'primarySurvey.circulation.skinColour',
    placeholder: 'e.g. normal, pale, cyanosed'
  }));
  cRow.appendChild(textInput({
    label: 'Skin Temperature', path: 'primarySurvey.circulation.skinTemperature',
    placeholder: 'e.g. warm, cool, clammy'
  }));
  card.appendChild(cRow);
  card.appendChild(textInput({
    label: 'Capillary Refill', path: 'primarySurvey.circulation.capillaryRefill',
    placeholder: 'e.g. < 2 seconds'
  }));
  card.appendChild(textArea({
    label: 'Haemorrhage', path: 'primarySurvey.circulation.haemorrhage',
    rows: 2, placeholder: 'Describe any bleeding (or "none")'
  }));
  card.appendChild(textInput({
    label: 'IV Access', path: 'primarySurvey.circulation.ivAccess',
    placeholder: 'e.g. 18G left ACF'
  }));

  card.appendChild(subsectionTitle('D — Disability'));
  const gcs = document.createElement('div');
  gcs.className = 'three-col';
  gcs.appendChild(textInput({
    label: 'GCS Eye (1-4)', path: 'primarySurvey.disability.gcsEye',
    type: 'number', min: 1, max: 4
  }));
  gcs.appendChild(textInput({
    label: 'GCS Verbal (1-5)', path: 'primarySurvey.disability.gcsVerbal',
    type: 'number', min: 1, max: 5
  }));
  gcs.appendChild(textInput({
    label: 'GCS Motor (1-6)', path: 'primarySurvey.disability.gcsMotor',
    type: 'number', min: 1, max: 6
  }));
  card.appendChild(gcs);

  card.appendChild(readOnlyReadout({
    label: 'GCS Total',
    id: 'gcs-total-readout',
    render: () => renderGcsReadout()
  }));

  card.appendChild(textInput({
    label: 'Pupils', path: 'primarySurvey.disability.pupils',
    placeholder: 'e.g. equal and reactive'
  }));
  card.appendChild(textInput({
    label: 'Blood Glucose', path: 'primarySurvey.disability.bloodGlucose',
    placeholder: 'e.g. 5.5 mmol/L'
  }));
  card.appendChild(textInput({
    label: 'Limb Movements', path: 'primarySurvey.disability.limbMovements',
    placeholder: 'e.g. all limbs moving'
  }));

  card.appendChild(subsectionTitle('E — Exposure'));
  card.appendChild(textArea({ label: 'Skin Examination', path: 'primarySurvey.exposure.skinExamination', rows: 2 }));
  card.appendChild(textArea({ label: 'Injuries Identified', path: 'primarySurvey.exposure.injuriesIdentified', rows: 2 }));
  card.appendChild(textArea({ label: 'Log Roll Findings', path: 'primarySurvey.exposure.logRollFindings', rows: 2 }));

  return card;
}

function renderGcsReadout() {
  const v = state.primarySurvey.disability.gcsTotal;
  return v == null
    ? '<span class="muted">Auto-calculated</span>'
    : `<strong>${v} / 15</strong>`;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Clinical Examination',
    description: 'Systematic clinical examination findings.'
  });
  card.appendChild(textArea({
    label: 'General Appearance', path: 'clinicalExamination.generalAppearance',
    rows: 2, placeholder: 'e.g. alert, orientated, comfortable at rest'
  }));
  card.appendChild(textArea({ label: 'Head & Face', path: 'clinicalExamination.headAndFace', rows: 2 }));
  card.appendChild(textArea({ label: 'Neck', path: 'clinicalExamination.neck', rows: 2 }));
  card.appendChild(textArea({ label: 'Chest — Cardiovascular', path: 'clinicalExamination.chestCardiovascular', rows: 2 }));
  card.appendChild(textArea({ label: 'Chest — Respiratory', path: 'clinicalExamination.chestRespiratory', rows: 2 }));
  card.appendChild(textArea({ label: 'Abdomen', path: 'clinicalExamination.abdomen', rows: 2 }));
  card.appendChild(textArea({ label: 'Pelvis', path: 'clinicalExamination.pelvis', rows: 2 }));
  card.appendChild(textArea({ label: 'Musculoskeletal / Limbs', path: 'clinicalExamination.musculoskeletalLimbs', rows: 2 }));
  card.appendChild(textArea({ label: 'Neurological', path: 'clinicalExamination.neurological', rows: 2 }));
  card.appendChild(textArea({ label: 'Skin', path: 'clinicalExamination.skin', rows: 2 }));
  card.appendChild(textArea({ label: 'Mental State', path: 'clinicalExamination.mentalState', rows: 2 }));
  card.appendChild(textArea({
    label: 'Body Diagram Notes', path: 'clinicalExamination.bodyDiagramNotes',
    rows: 3, placeholder: 'Document any injury locations or findings'
  }));
  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Investigations',
    description: 'Blood tests, imaging, and other investigations.'
  });

  card.appendChild(checkboxGroup({
    label: 'Blood Tests',
    path: 'investigations.bloodTests',
    options: bloodTestOptions
  }));

  card.appendChild(textInput({ label: 'Urinalysis', path: 'investigations.urinalysis' }));
  card.appendChild(textInput({
    label: 'Pregnancy Test', path: 'investigations.pregnancyTest',
    placeholder: 'e.g. positive, negative, not done'
  }));

  card.appendChild(subsectionTitle('Imaging'));
  card.appendChild(listEditor({
    path: 'investigations.imaging',
    cells: [
      { label: 'Type', key: 'type', placeholder: 'e.g. X-ray, CT, MRI' },
      { label: 'Site', key: 'site' },
      { label: 'Findings', key: 'findings' }
    ],
    gridClass: 'imaging-grid',
    factory: () => ({ type: '', site: '', findings: '' }),
    addLabel: 'Add imaging study',
    emptyLabel: 'No imaging recorded.'
  }));

  card.appendChild(radioGroup({
    label: 'ECG Performed?',
    path: 'investigations.ecgPerformed',
    options: yesNo
  }));
  const ecgBlock = conditionalBlock('investigations.ecgPerformed=yes');
  ecgBlock.appendChild(textArea({
    label: 'ECG Findings', path: 'investigations.ecgFindings', rows: 2
  }));
  card.appendChild(ecgBlock);

  card.appendChild(textArea({
    label: 'Other Investigations', path: 'investigations.otherInvestigations', rows: 2
  }));

  return card;
}

function renderStep11() {
  const card = sectionCard({
    stepNumber: 11,
    title: 'Treatment & Interventions',
    description: 'Medications, fluids, and procedures.'
  });

  card.appendChild(subsectionTitle('Medications Administered'));
  card.appendChild(listEditor({
    path: 'treatment.medicationsAdministered',
    cells: [
      { label: 'Drug', key: 'drug' },
      { label: 'Dose', key: 'dose' },
      { label: 'Route', key: 'route', placeholder: 'e.g. IV, IM, PO' },
      { label: 'Time', key: 'time', type: 'time' },
      { label: 'Given By', key: 'givenBy' }
    ],
    gridClass: 'medadmin-grid',
    factory: () => ({ drug: '', dose: '', route: '', time: '', givenBy: '' }),
    addLabel: 'Add medication',
    emptyLabel: 'No medications administered.'
  }));

  card.appendChild(subsectionTitle('Fluid Therapy'));
  card.appendChild(listEditor({
    path: 'treatment.fluidTherapy',
    cells: [
      { label: 'Type', key: 'type', placeholder: 'e.g. 0.9% NaCl' },
      { label: 'Volume', key: 'volume', placeholder: 'e.g. 1000 mL' },
      { label: 'Rate', key: 'rate', placeholder: 'e.g. 125 mL/hr' },
      { label: 'Time Started', key: 'timeStarted', type: 'time' }
    ],
    gridClass: 'fluid-grid',
    factory: () => ({ type: '', volume: '', rate: '', timeStarted: '' }),
    addLabel: 'Add fluid',
    emptyLabel: 'No fluid therapy recorded.'
  }));

  card.appendChild(subsectionTitle('Procedures'));
  card.appendChild(listEditor({
    path: 'treatment.procedures',
    cells: [
      { label: 'Description', key: 'description' },
      { label: 'Time', key: 'time', type: 'time' }
    ],
    gridClass: 'proc-grid',
    factory: () => ({ description: '', time: '' }),
    addLabel: 'Add procedure',
    emptyLabel: 'No procedures recorded.'
  }));

  card.appendChild(textInput({
    label: 'Oxygen Therapy Device', path: 'treatment.oxygenTherapyDevice',
    placeholder: 'e.g. nasal cannula, non-rebreather'
  }));
  card.appendChild(textInput({
    label: 'Oxygen Therapy Flow Rate', path: 'treatment.oxygenTherapyFlowRate',
    placeholder: 'e.g. 2 L/min'
  }));
  card.appendChild(radioGroup({
    label: 'Tetanus Prophylaxis',
    path: 'treatment.tetanusProphylaxis',
    options: [
      { value: 'given', label: 'Given' },
      { value: 'not-indicated', label: 'Not Indicated' },
      { value: 'status-checked', label: 'Status Checked' }
    ]
  }));

  return card;
}

function renderStep12() {
  const card = sectionCard({
    stepNumber: 12,
    title: 'Assessment & Plan',
    description: 'Working diagnosis and clinical plan.'
  });
  card.appendChild(textInput({
    label: 'Working Diagnosis', path: 'assessmentPlan.workingDiagnosis', required: true
  }));
  card.appendChild(textArea({
    label: 'Differential Diagnoses', path: 'assessmentPlan.differentialDiagnoses', rows: 3
  }));
  card.appendChild(textArea({
    label: 'Clinical Impression', path: 'assessmentPlan.clinicalImpression', rows: 3
  }));
  card.appendChild(textArea({
    label: 'Risk Stratification', path: 'assessmentPlan.riskStratification',
    rows: 2, placeholder: 'e.g. HEART score, Wells score, CURB-65'
  }));
  return card;
}

function renderStep13() {
  const card = sectionCard({
    stepNumber: 13,
    title: 'Disposition',
    description: 'Patient outcome and discharge details.'
  });

  card.appendChild(radioGroup({
    label: 'Disposition',
    path: 'disposition.disposition',
    options: [
      { value: 'admitted', label: 'Admitted' },
      { value: 'discharged', label: 'Discharged' },
      { value: 'transferred', label: 'Transferred' },
      { value: 'left-before-seen', label: 'Left Before Seen' },
      { value: 'self-discharged', label: 'Self-Discharged' }
    ]
  }));

  const adm = conditionalBlock('disposition.disposition=admitted');
  adm.appendChild(subsectionTitle('Admission Details'));
  adm.appendChild(textInput({ label: 'Admitting Specialty', path: 'disposition.admittingSpecialty' }));
  adm.appendChild(textInput({ label: 'Admitting Consultant', path: 'disposition.admittingConsultant' }));
  adm.appendChild(textInput({ label: 'Ward', path: 'disposition.ward' }));
  adm.appendChild(textInput({
    label: 'Level of Care', path: 'disposition.levelOfCare',
    placeholder: 'e.g. Level 1, Level 2, Level 3'
  }));
  card.appendChild(adm);

  const dis = conditionalBlock('disposition.disposition=discharged');
  dis.appendChild(subsectionTitle('Discharge Details'));
  dis.appendChild(textInput({ label: 'Discharge Diagnosis', path: 'disposition.dischargeDiagnosis' }));
  dis.appendChild(textArea({ label: 'Discharge Medications', path: 'disposition.dischargeMedications', rows: 2 }));
  dis.appendChild(textArea({ label: 'Discharge Instructions', path: 'disposition.dischargeInstructions', rows: 3 }));
  dis.appendChild(textInput({
    label: 'Follow-up', path: 'disposition.followUp',
    placeholder: 'e.g. GP in 48 hours, fracture clinic 1 week'
  }));
  dis.appendChild(textArea({
    label: 'Return Precautions', path: 'disposition.returnPrecautions',
    rows: 2, placeholder: 'Safety-net advice for patient'
  }));
  card.appendChild(dis);

  const tr = conditionalBlock('disposition.disposition=transferred');
  tr.appendChild(subsectionTitle('Transfer Details'));
  tr.appendChild(textInput({ label: 'Receiving Hospital', path: 'disposition.receivingHospital' }));
  tr.appendChild(textInput({ label: 'Reason for Transfer', path: 'disposition.reasonForTransfer' }));
  tr.appendChild(textInput({
    label: 'Mode of Transfer', path: 'disposition.modeOfTransfer',
    placeholder: 'e.g. ambulance, helicopter'
  }));
  card.appendChild(tr);

  const tail = document.createElement('div');
  tail.className = 'two-col';
  tail.appendChild(textInput({
    label: 'Discharge / Transfer Time',
    path: 'disposition.dischargeTime', type: 'time'
  }));
  tail.appendChild(textInput({
    label: 'Total Time in Department',
    path: 'disposition.totalTimeInDepartment',
    placeholder: 'e.g. 4h 30m'
  }));
  card.appendChild(tail);

  return card;
}

function renderStep14() {
  const card = sectionCard({
    stepNumber: 14,
    title: 'Safeguarding & Consent',
    description: 'Safeguarding concerns, mental capacity, and completion details.'
  });

  card.appendChild(radioGroup({
    label: 'Safeguarding Concern?',
    path: 'safeguardingConsent.safeguardingConcern',
    options: yesNo
  }));
  const sg = conditionalBlock('safeguardingConsent.safeguardingConcern=yes');
  sg.appendChild(textInput({
    label: 'Safeguarding Type', path: 'safeguardingConsent.safeguardingType',
    placeholder: 'e.g. adult, child, domestic violence'
  }));
  sg.appendChild(radioGroup({
    label: 'Referral Made?',
    path: 'safeguardingConsent.referralMade',
    options: yesNo
  }));
  card.appendChild(sg);

  card.appendChild(textArea({
    label: 'Mental Capacity Assessment',
    path: 'safeguardingConsent.mentalCapacityAssessment',
    rows: 2, placeholder: 'Assessment of capacity to make decisions'
  }));
  card.appendChild(textInput({
    label: 'Mental Health Act Status',
    path: 'safeguardingConsent.mentalHealthActStatus',
    placeholder: 'e.g. Section 136, Section 2, informal'
  }));
  card.appendChild(radioGroup({
    label: 'Consent for Treatment',
    path: 'safeguardingConsent.consentForTreatment',
    options: [
      { value: 'verbal', label: 'Verbal' },
      { value: 'written', label: 'Written' },
      { value: 'lacks-capacity', label: 'Lacks Capacity' }
    ]
  }));

  card.appendChild(subsectionTitle('Completed By'));
  const cb = document.createElement('div');
  cb.className = 'two-col';
  cb.appendChild(textInput({
    label: 'Name', path: 'safeguardingConsent.completedByName', required: true
  }));
  cb.appendChild(textInput({
    label: 'Role', path: 'safeguardingConsent.completedByRole'
  }));
  card.appendChild(cb);
  card.appendChild(textInput({
    label: 'GMC Number', path: 'safeguardingConsent.completedByGmcNumber'
  }));
  card.appendChild(textInput({
    label: 'Senior Reviewing Clinician',
    path: 'safeguardingConsent.seniorReviewingClinician'
  }));

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections + auto-calc readouts
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const eq = expr.indexOf('=');
    const path = expr.slice(0, eq);
    const target = expr.slice(eq + 1);
    const current = String(getNestedValue(state, path) ?? '');
    host.style.display = current === target ? '' : 'none';
  });
  document.querySelectorAll('[data-conditional-any]').forEach((host) => {
    const expr = host.getAttribute('data-conditional-any');
    const eq = expr.indexOf('=');
    const path = expr.slice(0, eq);
    const targetCsv = expr.slice(eq + 1);
    const current = String(getNestedValue(state, path) ?? '');
    host.style.display = targetCsv.split(',').includes(current) ? '' : 'none';
  });
}

function refreshAutoCalculatedReadouts() {
  const gcs = document.getElementById('gcs-total-readout');
  if (gcs) gcs.innerHTML = renderGcsReadout();
  const news2 = document.getElementById('news2-readout');
  if (news2) news2.innerHTML = renderNews2Readout();
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  // Demographics
  'demographics.firstName',
  'demographics.lastName',
  'demographics.dateOfBirth',
  'demographics.sex',
  'demographics.nhsNumber',
  'demographics.postcode',
  'demographics.phone',
  // Next of kin / GP
  'nextOfKinGP.nextOfKin.name',
  'nextOfKinGP.nextOfKin.relationship',
  'nextOfKinGP.nextOfKin.notified',
  'nextOfKinGP.gp.name',
  'nextOfKinGP.gp.practiceName',
  // Arrival & triage
  'arrivalTriage.attendanceDate',
  'arrivalTriage.arrivalTime',
  'arrivalTriage.attendanceCategory',
  'arrivalTriage.arrivalMode',
  'arrivalTriage.referralSource',
  'arrivalTriage.triageTime',
  'arrivalTriage.mtsCategory',
  // Presenting complaint
  'presentingComplaint.chiefComplaint',
  'presentingComplaint.historyOfPresentingComplaint',
  'presentingComplaint.onset',
  // Pain
  'painAssessment.painPresent',
  // Medical history
  'medicalHistory.tetanusStatus',
  'medicalHistory.smokingStatus',
  // Vital signs (NEWS2 inputs)
  'vitalSigns.heartRate',
  'vitalSigns.systolicBP',
  'vitalSigns.respiratoryRate',
  'vitalSigns.oxygenSaturation',
  'vitalSigns.supplementalOxygen',
  'vitalSigns.temperature',
  'vitalSigns.consciousnessLevel',
  // Primary survey ABCDE highlights
  'primarySurvey.airway.status',
  'primarySurvey.breathing.effort',
  'primarySurvey.disability.gcsEye',
  'primarySurvey.disability.gcsVerbal',
  'primarySurvey.disability.gcsMotor',
  // Investigations
  'investigations.ecgPerformed',
  // Treatment
  'treatment.tetanusProphylaxis',
  // Assessment & plan
  'assessmentPlan.workingDiagnosis',
  // Disposition
  'disposition.disposition',
  // Safeguarding & consent
  'safeguardingConsent.safeguardingConcern',
  'safeguardingConsent.consentForTreatment',
  'safeguardingConsent.completedByName'
];

/**
 * Map a TRACKED_FIELDS path to its section key. The section key is the
 * first segment for shallow paths; for the few nested-section paths
 * (e.g. `nextOfKinGP.nextOfKin.name`, `primarySurvey.airway.status`)
 * the top-level segment is the wizard step's section.
 */
function sectionForPath(path) {
  return path.split('.')[0];
}

function updateProgress() {
  let answered = 0;
  const sectionAnswered = {};
  const sectionTotal = {};
  for (const path of TRACKED_FIELDS) {
    const section = sectionForPath(path);
    sectionTotal[section] = (sectionTotal[section] || 0) + 1;
    const v = getNestedValue(state, path);
    if (v !== null && v !== undefined && v !== '') {
      answered++;
      sectionAnswered[section] = (sectionAnswered[section] || 0) + 1;
    }
  }
  const total = TRACKED_FIELDS.length;
  const percent = Math.round((answered / total) * 100);
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
  { step: 1,  section: 'demographics',           title: 'Demographics' },
  { step: 2,  section: 'nextOfKinGP',            title: 'NoK & GP' },
  { step: 3,  section: 'arrivalTriage',          title: 'Arrival & Triage' },
  { step: 4,  section: 'presentingComplaint',    title: 'Presenting Complaint' },
  { step: 5,  section: 'painAssessment',         title: 'Pain' },
  { step: 6,  section: 'medicalHistory',         title: 'Medical History' },
  { step: 7,  section: 'vitalSigns',             title: 'Vital Signs' },
  { step: 8,  section: 'primarySurvey',          title: 'Primary Survey' },
  { step: 9,  section: 'clinicalExamination',    title: 'Clinical Exam' },
  { step: 10, section: 'investigations',         title: 'Investigations' },
  { step: 11, section: 'treatment',              title: 'Treatment' },
  { step: 12, section: 'assessmentPlan',         title: 'Assessment & Plan' },
  { step: 13, section: 'disposition',            title: 'Disposition' },
  { step: 14, section: 'safeguardingConsent',    title: 'Safeguarding & Consent' }
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
// Validation
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
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
  required.forEach((input) => {
    const id = input.id;
    const value = (input.value || '').trim();
    if (!value) {
      const labelEl = form.querySelector(`label[for="${id}"]`);
      const label = labelEl
        ? labelEl.textContent.replace(/\s*\*\s*$/, '').trim()
        : id;
      errors.push({ id, message: `${label} is required` });
      setFieldError(id, `${label} is required`);
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
  summary.innerHTML = `
    <strong>Please correct the following:</strong>
    <ul>
      ${errors.map((e) => `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`).join('')}
    </ul>
  `;
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  summary.focus({ preventScroll: true });
}

// ----------------------------------------------------------------------
// Submit / report
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

  const { news2, flaggedIssues, timestamp } = lastResult;

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No flags raised.</p>`
    : `
      <ul class="flags">
        ${flaggedIssues.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.message)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const paramRows = news2.parameterScores.map((p) => `
    <tr class="${p.score === 3 ? 'score-3' : ''}">
      <th scope="row">${esc(p.parameter)}</th>
      <td>${esc(p.value)}</td>
      <td class="num">${p.score}</td>
    </tr>
  `).join('');

  out.innerHTML = `
    <h2>Casualty Card Report</h2>
    <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>

    <h3>NEWS2 Total Score</h3>
    <p class="news2-summary">
      <span class="news2-score-badge ${news2ResponseClass(news2.clinicalResponse)}">${news2.totalScore}</span>
      <span class="news2-response">${esc(news2ResponseLabel(news2.clinicalResponse))}</span>
    </p>

    <h3>NEWS2 Parameter Scores</h3>
    <table class="subscales">
      <thead>
        <tr>
          <th scope="col">Parameter</th>
          <th scope="col">Value</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>${paramRows}</tbody>
    </table>

    <h3>Flagged Issues</h3>
    ${flagsList}

    <div class="report-actions">
      <button type="button" id="print-btn" class="button" data-variant="secondary">Print / save PDF</button>
      <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('start-over-btn').addEventListener('click', startOver);
  document.getElementById('print-btn').addEventListener('click', () => window.print());
}

function submitForm() {
  const errors = validateForm();
  if (errors.length > 0) return;
  recomputeDerived();
  const news2 = calculateNEWS2(state.vitalSigns);
  const flaggedIssues = detectFlaggedIssues(state, news2);
  lastResult = {
    news2,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh casualty card?')) return;
  clearState();
  state = emptyCasualtyCard();
  lastResult = null;
  document.getElementById('report').innerHTML =
    '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshAutoCalculatedReadouts();
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
  host.appendChild(renderStep11());
  host.appendChild(renderStep12());
  host.appendChild(renderStep13());
  host.appendChild(renderStep14());
}

function init() {
  recomputeDerived();
  renderStepList();
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshAutoCalculatedReadouts();
  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
