import { detectFlaggedIssues } from './flags.js';
import { validatePetition } from './grader.js';
import { caseTypeLabel, emptyPetition, faultGroundLabel, groundTypeLabel, priorityLabel, propertyApproachLabel, readinessClassClass, readinessClassLabel, serviceMethodLabel, yesNoLabel } from './types.js';

// United States Divorce Petition: petition for dissolution of marriage, decree
// and vital-records divorce certificate. Wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. A sticky top-of-page progress summary reflects how many
// fields have been answered, and a live readout shows the running readiness
// class (ready-to-file / incomplete / not-yet-eligible), the property regime of
// the filing state, and the earliest permitted decree date. Submission runs the
// pure engine (readiness classification plus flagged issues) and renders an
// inline report. State is persisted to localStorage so a partial fill survives a
// page reload.
//
// This is a DOCUMENTATION-SUPPORT instrument, NOT legal advice. Divorce is
// state law and the court decides.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------
const STORAGE_KEY = 'united-states-divorce-petition.front-end-with-html.v1';

/** @returns {import('./types.js').DivorcePetition} */
// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  // Merge over a fresh empty so any newly-added fields default correctly.
  const fresh = emptyPetition();

  for (const key of Object.keys(fresh)) {
    if (parsed && typeof parsed[key] === 'object' && parsed[key] !== null) {
      fresh[key] = { ...fresh[key], ...parsed[key] };
    } else if (parsed && typeof parsed[key] !== 'object' && parsed[key] !== undefined) {
      fresh[key] = parsed[key];
    }
  }
  return fresh;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyPetition();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved petition; starting fresh.', e);
    return emptyPetition();
  }
}

/** @param {import('./types.js').DivorcePetition} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save certificate to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored petition.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

// Captured before loadState() reads it, so js/restore-banner.js can tell
// "a previous draft was restored" apart from "this is a blank first visit"
// without needing to know the STORAGE_KEY itself (its exact naming isn't
// uniform fleet-wide -- some forms still carry the pre-consolidation
// `.front-end-form-with-html.v1` suffix).
let hadDraftAtLoad = false;
try {
  hadDraftAtLoad = localStorage.getItem(STORAGE_KEY) !== null;
} catch (e) {
  // Ignore; loadState() below will hit the same failure and fall back safely.
}

/** @type {import('./types.js').DivorcePetition} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-divorce-petition',
  hadDraftAtLoad,
  getState: () => state,
  setState: (raw) => {
    state = mergeIntoDefaults(raw);
    saveState(state);
    lastResult = null;
    const _rep = document.getElementById('report');
    if (_rep) _rep.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
    renderErrorSummary([]);
    renderForm();
    updateProgress();
    updateConditionalSections();
    refreshLiveStatus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const TOTAL_STEPS = 7;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a deeply-nested field on the state and persist. Re-runs progress,
 * conditional visibility, and the live-status readout after each change.
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
  refreshLiveStatus();
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

/** Map an <input type=…> to its Lily class name. */
function lilyInputClass(type) {
  switch (type) {
    case 'email':          return 'email-input';
    case 'number':         return 'number-input';
    case 'date':           return 'date-input';
    case 'datetime-local': return 'date-input';
    case 'time':           return 'time-input';
    case 'tel':            return 'tel-input';
    case 'url':            return 'url-input';
    case 'search':         return 'search-input';
    default:               return 'text-input';
  }
}

function textInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field];
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
  if (opts.min !== undefined) attrs.push(`min="${esc(opts.min)}"`);
  if (opts.max !== undefined) attrs.push(`max="${esc(opts.max)}"`);
  if (opts.required) attrs.push('required', 'data-required');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}"${opts.required ? ' data-required' : ''}>${esc(opts.label)}</label>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <input ${attrs.join(' ')}>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v;
    if (input.value === '' && (type === 'date' || type === 'datetime-local' || type === 'time')) {
      v = null;
    } else if (type === 'number') {
      v = input.value === '' ? null : Number(input.value);
    } else {
      v = input.value;
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
    <label class="label" for="${id}"${opts.required ? ' data-required' : ''}>${esc(opts.label)}</label>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      ${opts.required ? 'required data-required' : ''}
      aria-describedby="${id}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setField(opts.section, opts.field, ta.value);
    clearFieldError(id);
  });
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
      `<option value="${esc(o.value)}"${String(o.value) === String(current) ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label class="label" for="${id}"${opts.required ? ' data-required' : ''}>${esc(opts.label)}</label>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <select id="${id}" name="${id}" class="select" aria-describedby="${id}-error"${opts.required ? ' required data-required' : ''}>
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    setField(opts.section, opts.field, sel.value);
    clearFieldError(id);
  });
  return wrapper;
}

function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-fieldset';
  wrapper.id = `${groupId}-fieldset`;
  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.textContent = opts.label;
  if (opts.required) legend.setAttribute('data-required', '');
  wrapper.appendChild(legend);
  if (opts.hint) {
    const hint = document.createElement('span');
    hint.className = 'hint';
    hint.textContent = opts.hint;
    wrapper.appendChild(hint);
  }
  const list = document.createElement('div');
  list.className = 'radio-group';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', `${groupId}-fieldset`);
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.className = 'radio-input';
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
  const err = document.createElement('span');
  err.className = 'error-message';
  err.id = `${groupId}-error`;
  err.setAttribute('aria-live', 'polite');
  wrapper.appendChild(err);
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
  legend.innerHTML =
    `<span class="section-step">Step ${opts.stepNumber} of ${TOTAL_STEPS}</span>` +
    `<span class="section-title">${esc(opts.title)}</span>` +
    desc;
  card.appendChild(legend);
  return card;
}

// ----------------------------------------------------------------------
// Option lists
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const stateOptions = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
  .map((s) => ({ value: s, label: s }));

const caseTypeOptions = ['uncontested', 'contested'].map((v) => ({ value: v, label: caseTypeLabel(v) }));
const groundTypeOptions = ['no-fault', 'fault'].map((v) => ({ value: v, label: groundTypeLabel(v) }));
const faultGroundOptions = ['adultery', 'cruelty', 'abandonment', 'felony-conviction', 'impotence', 'other'].map((v) => ({ value: v, label: faultGroundLabel(v) }));
const propertyOptions = ['community', 'equitable'].map((v) => ({ value: v, label: propertyApproachLabel(v) }));
const serviceOptions = ['personal', 'acceptance', 'mail', 'publication', 'none'].map((v) => ({ value: v, label: serviceMethodLabel(v) }));

// ----------------------------------------------------------------------
// Section renderers (1 per petition step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Filing and grounds',
    description: 'Where the petition is filed, whether it is agreed, and the ground pleaded.'
  });
  card.appendChild(selectInput({
    label: 'Filing state', section: 'filing', field: 'state', options: stateOptions, required: true,
    hint: 'Divorce law is state law. States outside the verified rule table use a default rule and raise a "verify state rule" flag.'
  }));
  card.appendChild(textInput({ label: 'County of the filing court', section: 'filing', field: 'county', placeholder: 'e.g. Cook' }));
  card.appendChild(textInput({ label: 'Filing date', section: 'filing', field: 'filingDate', type: 'date' }));
  card.appendChild(radioGroup({ label: 'Uncontested or contested?', section: 'filing', field: 'caseType', options: caseTypeOptions }));
  card.appendChild(radioGroup({ label: 'Ground pleaded', section: 'filing', field: 'groundType', options: groundTypeOptions }));
  card.appendChild(selectInput({ label: 'Fault ground (if fault)', section: 'filing', field: 'faultGround', options: faultGroundOptions }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Spouses and residency',
    description: 'The parties, the marriage, separation, and how long the petitioner has lived in the state and county.'
  });
  card.appendChild(textInput({ label: 'Petitioner (filing spouse) — full legal name', section: 'spouses', field: 'petitionerName', required: true }));
  card.appendChild(textInput({ label: 'Respondent (other spouse) — full legal name', section: 'spouses', field: 'respondentName', required: true }));
  card.appendChild(textInput({ label: 'Date of marriage', section: 'spouses', field: 'marriageDate', type: 'date' }));
  card.appendChild(textInput({ label: 'Place of marriage', section: 'spouses', field: 'marriagePlace', placeholder: 'City, state or country' }));
  card.appendChild(textInput({ label: 'Date spouses began living separate and apart', section: 'spouses', field: 'separationDate', type: 'date', hint: 'Leave blank if still living together.' }));
  card.appendChild(textInput({ label: 'Petitioner months of residency in the filing state', section: 'spouses', field: 'petitionerResidencyMonths', type: 'number', min: 0, max: 1200 }));
  card.appendChild(textInput({ label: 'Petitioner days of residency in the filing county', section: 'spouses', field: 'countyResidencyDays', type: 'number', min: 0, max: 36500 }));
  card.appendChild(radioGroup({ label: 'Married in, or lived together as spouses in, the filing state?', section: 'spouses', field: 'marriedOrLivedInState', options: yesNo, hint: 'Shortens the New York residency period from two years to one.' }));
  card.appendChild(radioGroup({ label: 'Is the respondent on active military duty?', section: 'spouses', field: 'respondentMilitary', options: yesNo }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Children and support',
    description: 'Minor children, custody and parenting time, and the child-support guideline worksheet.'
  });
  card.appendChild(radioGroup({ label: 'Are there minor children of the marriage?', section: 'children', field: 'hasMinorChildren', options: yesNo }));
  card.appendChild(textInput({ label: 'Number of minor children', section: 'children', field: 'childrenCount', type: 'number', min: 0, max: 30 }));
  card.appendChild(textInput({ label: 'Months the children have lived in the filing state', section: 'children', field: 'childrenHomeStateMonths', type: 'number', min: 0, max: 1200, hint: 'UCCJEA home-state test: six consecutive months.' }));
  card.appendChild(radioGroup({ label: 'Is either spouse pregnant with a child of the marriage?', section: 'children', field: 'pregnant', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Custody and parenting-time plan documented?', section: 'children', field: 'custodyPlanDocumented', options: yesNo }));
  card.appendChild(radioGroup({ label: 'State child-support guideline worksheet completed?', section: 'children', field: 'childSupportWorksheetCompleted', options: yesNo }));
  card.appendChild(textInput({ label: 'Monthly child support from the worksheet (US dollars)', section: 'children', field: 'childSupportMonthlyAmount', type: 'number', min: 0, max: 1000000 }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Property and settlement',
    description: 'Community or equitable division, the settlement agreement, financial disclosure, and spousal support.'
  });
  card.appendChild(radioGroup({ label: 'Property-division approach pleaded', section: 'property', field: 'propertyDivisionApproach', options: propertyOptions, hint: 'Community property in AZ, CA, NV, TX, WA and a few other states; equitable distribution elsewhere.' }));
  card.appendChild(radioGroup({ label: 'Marital settlement agreement signed by both spouses?', section: 'property', field: 'settlementAgreementSigned', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Financial disclosure or affidavit filed or ready?', section: 'property', field: 'financialDisclosureFiled', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Spousal support (alimony or maintenance) requested?', section: 'property', field: 'spousalSupportRequested', options: yesNo }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Service of process',
    description: 'How and when the respondent is served, and whether the respondent has responded.'
  });
  card.appendChild(selectInput({ label: 'Service method', section: 'service', field: 'serviceMethod', options: serviceOptions }));
  card.appendChild(textInput({ label: 'Date served or acceptance signed', section: 'service', field: 'serviceDate', type: 'date' }));
  card.appendChild(radioGroup({ label: 'Has the respondent filed a response or appearance?', section: 'service', field: 'respondentResponded', options: yesNo }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Decree and divorce certificate',
    description: 'The final decree, name restoration, and the vital-records divorce certificate.'
  });
  card.appendChild(radioGroup({ label: 'Has the court entered the decree?', section: 'decree', field: 'decreeEntered', options: yesNo }));
  card.appendChild(textInput({ label: 'Decree date', section: 'decree', field: 'decreeDate', type: 'date' }));
  card.appendChild(radioGroup({ label: 'Restore a former name in the decree?', section: 'decree', field: 'nameRestorationRequested', options: yesNo }));
  card.appendChild(textInput({ label: 'Former name to restore', section: 'decree', field: 'nameToRestore' }));
  card.appendChild(radioGroup({ label: 'Request a vital-records divorce certificate or certified decree?', section: 'decree', field: 'certificateRequested', options: yesNo }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Summary and readiness',
    description: 'The live readiness class, the property regime, and the earliest permitted decree date. Submit to generate the full report.'
  });
  card.appendChild(readOnlyReadout({
    label: 'Live readiness status',
    id: 'live-status-readout',
    render: () => renderLiveStatus()
  }));
  return card;
}

// ----------------------------------------------------------------------
// Live readout
// ----------------------------------------------------------------------

/** Render the live status: readiness badge, property regime, earliest decree date. */
function renderLiveStatus() {
  const result = validatePetition(state);
  const badge =
    `<span class="risk-badge ${readinessClassClass(result.readinessClass)}">${esc(readinessClassLabel(result.readinessClass))}</span>`;
  const regime = `<span class="muted">Property: ${esc(propertyApproachLabel(result.propertyRegime))}</span>`;
  const earliest = result.earliestDecreeDate
    ? `<span class="muted">— earliest decree ${esc(result.earliestDecreeDate)}</span>`
    : `<span class="muted">— no waiting period, or the date is not yet determinable</span>`;
  return `${badge} ${regime} ${earliest}`;
}

function refreshLiveStatus() {
  const el = document.getElementById('live-status-readout');
  if (el) el.innerHTML = renderLiveStatus();
}

// ----------------------------------------------------------------------
// Conditional sections
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, field] = path.split('.');
    const current = state[section] ? state[section][field] : undefined;
    host.style.display = String(current) === target ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

// Each section maps to one or more progress "slots". A slot counts as answered
// when ANY of its fields is answered.
const STEP_SLOTS = {
  filing: [['state'], ['county'], ['filingDate'], ['caseType'], ['groundType']],
  spouses: [['petitionerName'], ['respondentName'], ['marriageDate'], ['petitionerResidencyMonths']],
  children: [['hasMinorChildren'], ['custodyPlanDocumented'], ['childSupportWorksheetCompleted']],
  property: [['propertyDivisionApproach'], ['settlementAgreementSigned'], ['financialDisclosureFiled']],
  service: [['serviceMethod'], ['serviceDate']],
  decree: [['decreeEntered'], ['certificateRequested']]
};

function isAnswered(section, field) {
  const v = state[section][field];
  return v !== null && v !== undefined && v !== '';
}

function updateProgress() {
  let answered = 0;
  let total = 0;
  const sectionAnswered = {};
  const sectionTotal = {};

  for (const section of Object.keys(STEP_SLOTS)) {
    const slots = STEP_SLOTS[section];
    sectionTotal[section] = slots.length;
    sectionAnswered[section] = 0;
    for (const slot of slots) {
      total++;
      const slotAnswered = slot.some((field) => isAnswered(section, field));
      if (slotAnswered) {
        answered++;
        sectionAnswered[section]++;
      }
    }
  }

  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  updateStepListStatuses(sectionAnswered, sectionTotal);
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

function cell(value) {
  return value === null || value === undefined || value === '' ? '<span class="muted">—</span>' : esc(value);
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const { readinessClass, propertyRegime, earliestDecreeDate, stateRuleKnown, flaggedIssues, timestamp } = lastResult;

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No flags raised.</p>`
    : `
      <ul class="flags">
        ${flaggedIssues.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(priorityLabel(f.priority))}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}${f.suggestedAction ? ` — ${esc(f.suggestedAction)}` : ''}</span>
          </li>
        `).join('')}
      </ul>
    `;

  let guidance;
  if (readinessClass === 'not-yet-eligible') {
    guidance = `<p>This petition is <strong>not yet eligible</strong>: a residency requirement, a separation period, or a waiting period in the filing state is not yet satisfied. Filing or entering a decree early risks dismissal or a void decree. Wait until the period has run, then re-check.</p>`;
  } else if (readinessClass === 'incomplete') {
    guidance = `<p>This petition is <strong>incomplete</strong>: required details, a custody plan or child-support worksheet, a settlement agreement for an uncontested case, or an available ground is missing. Resolve the flagged items before filing.</p>`;
  } else {
    guidance = `<p>This petition looks <strong>ready to file</strong>: the filing state's residency and separation rules appear satisfied and the required items are present. Confirm the current county forms and fee with the clerk of court. This is a documentation check, not legal advice.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United States Divorce Petition — Readiness Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${readinessClassClass(readinessClass)}">
        <div>
          <span class="risk-banner-label">Readiness class</span>
          <span class="risk-banner-value">${esc(readinessClassLabel(readinessClass))}</span>
        </div>
        ${stateRuleKnown ? '' : '<span class="risk-badge risk-moderate">Verify state rule</span>'}
      </div>

      <p><strong>Property regime in the filing state:</strong> ${esc(propertyApproachLabel(propertyRegime))}</p>
      <p><strong>Earliest permitted decree date:</strong> ${earliestDecreeDate ? esc(earliestDecreeDate) : '<span class="muted">None (no waiting period) or not yet determinable</span>'}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Petition summary</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Filing</th><td>${cell(state.filing.state)} / ${cell(state.filing.county)}, ${cell(state.filing.filingDate)}</td></tr>
          <tr><th scope="row">Case</th><td>${cell(caseTypeLabel(state.filing.caseType))}; ${cell(groundTypeLabel(state.filing.groundType))}${state.filing.faultGround ? ' — ' + esc(faultGroundLabel(state.filing.faultGround)) : ''}</td></tr>
          <tr><th scope="row">Parties</th><td>${cell(state.spouses.petitionerName)} v. ${cell(state.spouses.respondentName)}</td></tr>
          <tr><th scope="row">Marriage</th><td>${cell(state.spouses.marriageDate)}, ${cell(state.spouses.marriagePlace)}</td></tr>
          <tr><th scope="row">Children</th><td>${cell(yesNoLabel(state.children.hasMinorChildren))}${state.children.childrenCount !== null ? ' (' + esc(state.children.childrenCount) + ')' : ''}</td></tr>
          <tr><th scope="row">Settlement agreement</th><td>${cell(yesNoLabel(state.property.settlementAgreementSigned))}</td></tr>
          <tr><th scope="row">Service</th><td>${cell(serviceMethodLabel(state.service.serviceMethod))}, ${cell(state.service.serviceDate)}</td></tr>
          <tr><th scope="row">Decree</th><td>${cell(yesNoLabel(state.decree.decreeEntered))}, ${cell(state.decree.decreeDate)}</td></tr>
        </tbody>
      </table>

      <h3>Next steps</h3>
      <p>File the petition and fee with the clerk of the court in the county, serve the respondent, observe any waiting period, and submit the decree. After the decree, order certified copies, and a divorce certificate from the state vital-records office if you need one.</p>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">Documentation support, not legal advice. The court decides.</p>

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
}

function submitForm() {
  const _errors = validateForm();
  if (_errors.length > 0) return;
  const result = validatePetition(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    readinessClass: result.readinessClass,
    propertyRegime: result.propertyRegime,
    earliestDecreeDate: result.earliestDecreeDate,
    stateRuleKnown: result.stateRuleKnown,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh petition?')) return;
  clearState();
  state = emptyPetition();
  lastResult = null;
  const _rep = document.getElementById('report');
  if (_rep) _rep.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshLiveStatus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1, section: 'filing',   title: 'Filing' },
  { step: 2, section: 'spouses',  title: 'Spouses' },
  { step: 3, section: 'children', title: 'Children' },
  { step: 4, section: 'property', title: 'Property' },
  { step: 5, section: 'service',  title: 'Service' },
  { step: 6, section: 'decree',   title: 'Decree' },
  { step: 7, section: 'summary',  title: 'Summary' }
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
  const required = form.querySelectorAll('input[data-required], select[data-required], textarea[data-required]');
  const seen = new Set();
  required.forEach((input) => {
    let id = input.id;
    if (input.type === 'radio') id = input.name;
    if (seen.has(id)) return;
    seen.add(id);
    // Skip fields hidden inside a collapsed conditional section.
    const conditional = input.closest('[data-conditional]');
    if (conditional && conditional.style.display === 'none') return;
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
}

function init() {
  renderStepList();
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshLiveStatus();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
