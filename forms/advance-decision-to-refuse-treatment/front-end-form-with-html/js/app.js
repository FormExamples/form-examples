// Advance Decision To Refuse Treatment (ADRT) - patient wizard
// (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure validity-checking engine and renders an inline report.
// State is persisted to localStorage so a partial fill survives a page
// reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.AdvanceDecisionToRefuseTreatment`. Pulling them off
// here keeps the rest of this file referring to short local names. The
// whole file is wrapped in an IIFE so its top-level identifiers don't
// leak to the global scope.
(function () {
'use strict';

const NS = window.AdvanceDecisionToRefuseTreatment;
const {
  emptyAssessment,
  hasLifeSustainingRefusal,
  validityStatusLabel,
  validityStatusClass,
  calculateValidity,
  detectAdditionalFlags
} = NS;

const TOTAL_STEPS = 10;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'advance-decision-to-refuse-treatment.front-end-form-with-html.v1';

/** Deep-merge a partial parsed object into a fresh empty assessment so
 * that newly-added fields default correctly. Nested objects are merged
 * shallowly per top-level section, with their inner objects (e.g. each
 * treatment refusal) merged one level deeper. Arrays are taken as-is.
 *
 * @param {*} parsed
 * @returns {import('./types.js').AssessmentData}
 */
function mergeIntoEmpty(parsed) {
  const fresh = emptyAssessment();
  if (!parsed || typeof parsed !== 'object') return fresh;
  for (const key of Object.keys(fresh)) {
    const src = parsed[key];
    if (!src || typeof src !== 'object') continue;
    const dst = fresh[key];
    for (const innerKey of Object.keys(dst)) {
      if (!(innerKey in src)) continue;
      const srcVal = src[innerKey];
      const dstVal = dst[innerKey];
      if (Array.isArray(dstVal)) {
        if (Array.isArray(srcVal)) dst[innerKey] = srcVal;
      } else if (
        dstVal && typeof dstVal === 'object' &&
        srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal)
      ) {
        dst[innerKey] = { ...dstVal, ...srcVal };
      } else if (srcVal !== undefined) {
        dst[innerKey] = srcVal;
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
    return mergeIntoEmpty(JSON.parse(raw));
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} s */
function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
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

/** Escape user-entered text for safe rendering. */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Set a deeply-nested top-level field on the state and persist.
 * Handles top-level (`section.field`) and nested
 * (`section.subobject.field`) paths.
 *
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
}

/** Set a nested treatment-refusal field, e.g.
 *  `setNestedField('treatmentsRefusedGeneral', 'antibiotics', 'refused', 'yes')`.
 */
function setNestedField(section, subKey, field, value) {
  state[section][subKey][field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
}

// ----------------------------------------------------------------------
// Component builders
// ----------------------------------------------------------------------

/**
 * Build a labelled text input bound to `state[section][field]`.
 * If `nestedKey` is given, binds to `state[section][nestedKey][field]`.
 * @param {{ label: string, section: string, field: string,
 *           nestedKey?: string, type?: string, placeholder?: string,
 *           required?: boolean }} opts
 */
function textInput(opts) {
  const id = opts.nestedKey
    ? `${opts.section}-${opts.nestedKey}-${opts.field}`
    : `${opts.section}-${opts.field}`;
  const value = opts.nestedKey
    ? state[opts.section][opts.nestedKey][opts.field]
    : state[opts.section][opts.field];
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

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    if (opts.nestedKey) {
      setNestedField(opts.section, opts.nestedKey, opts.field, input.value);
    } else {
      setField(opts.section, opts.field, input.value);
    }
  });
  return wrapper;
}

/**
 * Build a labelled multi-line text area bound to state.
 * @param {{ label: string, section: string, field: string,
 *           nestedKey?: string, rows?: number, placeholder?: string,
 *           required?: boolean }} opts
 */
function textArea(opts) {
  const id = opts.nestedKey
    ? `${opts.section}-${opts.nestedKey}-${opts.field}`
    : `${opts.section}-${opts.field}`;
  const value = opts.nestedKey
    ? state[opts.section][opts.nestedKey][opts.field]
    : state[opts.section][opts.field];
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      class="textarea">${esc(value ?? '')}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    if (opts.nestedKey) {
      setNestedField(opts.section, opts.nestedKey, opts.field, ta.value);
    } else {
      setField(opts.section, opts.field, ta.value);
    }
  });
  return wrapper;
}

/**
 * Build a select / dropdown input.
 * @param {{ label: string, section: string, field: string,
 *           nestedKey?: string, required?: boolean,
 *           options: { value: string, label: string }[] }} opts
 */
function selectInput(opts) {
  const id = opts.nestedKey
    ? `${opts.section}-${opts.nestedKey}-${opts.field}`
    : `${opts.section}-${opts.field}`;
  const current = (opts.nestedKey
    ? state[opts.section][opts.nestedKey][opts.field]
    : state[opts.section][opts.field]) ?? '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <select id="${id}" name="${id}" class="select-input">
      ${optionsHtml}
    </select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    if (opts.nestedKey) {
      setNestedField(opts.section, opts.nestedKey, opts.field, sel.value);
    } else {
      setField(opts.section, opts.field, sel.value);
    }
  });
  return wrapper;
}

/**
 * Build a radio group bound to state.
 * @param {{ label: string, section: string, field: string,
 *           nestedKey?: string, required?: boolean,
 *           options: { value: string, label: string }[] }} opts
 */
function radioGroup(opts) {
  const groupId = opts.nestedKey
    ? `${opts.section}-${opts.nestedKey}-${opts.field}`
    : `${opts.section}-${opts.field}`;
  const current = opts.nestedKey
    ? state[opts.section][opts.nestedKey][opts.field]
    : state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.innerHTML = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  wrapper.appendChild(legend);

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
      if (!input.checked) return;
      if (opts.nestedKey) {
        setNestedField(opts.section, opts.nestedKey, opts.field, option.value);
      } else {
        setField(opts.section, opts.field, option.value);
      }
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
      <span class="section-step">Section ${opts.stepNumber} of ${TOTAL_STEPS}</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

/** Build a sub-section header inside a card. */
function subsectionHeader(title, hint) {
  const el = document.createElement('div');
  el.className = 'subsection-header';
  el.innerHTML = `
    <h3>${esc(title)}</h3>
    ${hint ? `<p class="hint">${esc(hint)}</p>` : ''}
  `;
  return el;
}

/** Build a notice / callout box. */
function noticeBox(kind, title, html) {
  const el = document.createElement('div');
  el.className = `notice notice-${kind}`;
  el.innerHTML = `
    <p class="notice-title">${esc(title)}</p>
    ${html}
  `;
  return el;
}

// ----------------------------------------------------------------------
// Per-treatment subgroup builders
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];
const yesNoRefuse = [
  { value: 'yes', label: 'Yes - Refuse' },
  { value: 'no', label: 'No - Do not refuse' }
];
const yesNoLifeRisk = [
  { value: 'yes', label: 'Yes - even if my life is at risk' },
  { value: 'no', label: 'No' }
];

/** General-treatment subgroup with conditional specification. */
function generalTreatmentBlock(label, key, specPlaceholder) {
  const wrap = document.createElement('div');
  wrap.className = 'subgroup';

  wrap.appendChild(radioGroup({
    label,
    section: 'treatmentsRefusedGeneral',
    nestedKey: key,
    field: 'refused',
    options: yesNoRefuse
  }));

  const spec = document.createElement('div');
  spec.dataset.conditional = `treatmentsRefusedGeneral.${key}.refused=yes`;
  spec.appendChild(textArea({
    label: 'Specification',
    section: 'treatmentsRefusedGeneral',
    nestedKey: key,
    field: 'specification',
    placeholder: specPlaceholder,
    rows: 2
  }));
  wrap.appendChild(spec);

  return wrap;
}

/** Life-sustaining subgroup with required "even if life at risk"
 * confirmation and conditional specification. */
function lifeSustainingBlock(label, key, specPlaceholder) {
  const wrap = document.createElement('div');
  wrap.className = 'subgroup subgroup-life';

  wrap.appendChild(radioGroup({
    label,
    section: 'treatmentsRefusedLifeSustaining',
    nestedKey: key,
    field: 'refused',
    options: yesNoRefuse
  }));

  const inner = document.createElement('div');
  inner.dataset.conditional = `treatmentsRefusedLifeSustaining.${key}.refused=yes`;

  const lifeRisk = document.createElement('div');
  lifeRisk.className = 'subgroup-life-inner';
  lifeRisk.appendChild(radioGroup({
    label: 'I confirm this refusal applies even if my life is at risk as a result',
    section: 'treatmentsRefusedLifeSustaining',
    nestedKey: key,
    field: 'evenIfLifeAtRisk',
    options: yesNoLifeRisk,
    required: true
  }));
  inner.appendChild(lifeRisk);

  inner.appendChild(textArea({
    label: 'Specification',
    section: 'treatmentsRefusedLifeSustaining',
    nestedKey: key,
    field: 'specification',
    placeholder: specPlaceholder,
    rows: 2
  }));
  wrap.appendChild(inner);

  return wrap;
}

// ----------------------------------------------------------------------
// "Other treatments" repeating-list editors
// ----------------------------------------------------------------------

/** Editor for `treatmentsRefusedGeneral.otherTreatments`. */
function otherTreatmentsEditor() {
  const wrap = document.createElement('div');
  wrap.className = 'list-editor';

  function rerender() {
    const rows = state.treatmentsRefusedGeneral.otherTreatments;
    wrap.innerHTML = '';
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'list-empty';
      empty.textContent = 'No other treatments added.';
      wrap.appendChild(empty);
    }
    rows.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = 'list-row';
      r.innerHTML = `
        <div class="list-grid">
          <input type="text" class="text-input" data-key="treatment"
            value="${esc(row.treatment)}" placeholder="Treatment name">
          <textarea class="textarea" rows="2" data-key="specification"
            placeholder="Specification">${esc(row.specification)}</textarea>
        </div>
        <button type="button" class="btn btn-icon"
          aria-label="Remove treatment">&times;</button>
      `;
      r.querySelectorAll('input, textarea').forEach((inp) => {
        inp.addEventListener('input', () => {
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
      wrap.appendChild(r);
    });
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-add';
    addBtn.textContent = '+ Add Another Treatment';
    addBtn.addEventListener('click', () => {
      rows.push({ treatment: '', refused: 'yes', specification: '' });
      saveState(state);
      rerender();
      updateProgress();
    });
    wrap.appendChild(addBtn);
  }

  rerender();
  return wrap;
}

/** Editor for `treatmentsRefusedLifeSustaining.otherLifeSustaining`. */
function otherLifeSustainingEditor() {
  const wrap = document.createElement('div');
  wrap.className = 'list-editor';

  function rerender() {
    const rows = state.treatmentsRefusedLifeSustaining.otherLifeSustaining;
    wrap.innerHTML = '';
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'list-empty';
      empty.textContent = 'No other life-sustaining treatments added.';
      wrap.appendChild(empty);
    }
    rows.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = 'list-row life-row';
      r.innerHTML = `
        <div class="list-grid">
          <input type="text" class="text-input" data-key="treatment"
            value="${esc(row.treatment)}" placeholder="Life-sustaining treatment name">
          <fieldset class="field radio-group" data-key="evenIfLifeAtRisk">
            <legend>This refusal applies even if my life is at risk</legend>
            <div class="radio-options">
              <label class="radio-option">
                <input type="radio" name="other-ls-life-${idx}" value="yes"${row.evenIfLifeAtRisk === 'yes' ? ' checked' : ''}>
                <span>Yes - even if my life is at risk</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="other-ls-life-${idx}" value="no"${row.evenIfLifeAtRisk === 'no' ? ' checked' : ''}>
                <span>No</span>
              </label>
            </div>
          </fieldset>
          <textarea class="textarea" rows="2" data-key="specification"
            placeholder="Specification">${esc(row.specification)}</textarea>
        </div>
        <button type="button" class="btn btn-icon"
          aria-label="Remove treatment">&times;</button>
      `;

      const txt = r.querySelector('input[data-key="treatment"]');
      txt.addEventListener('input', () => {
        rows[idx].treatment = txt.value;
        saveState(state);
        updateProgress();
      });

      r.querySelectorAll(`input[name="other-ls-life-${idx}"]`).forEach((rb) => {
        rb.addEventListener('change', () => {
          if (rb.checked) {
            rows[idx].evenIfLifeAtRisk = rb.value;
            saveState(state);
            updateProgress();
          }
        });
      });

      const ta = r.querySelector('textarea[data-key="specification"]');
      ta.addEventListener('input', () => {
        rows[idx].specification = ta.value;
        saveState(state);
        updateProgress();
      });

      r.querySelector('button').addEventListener('click', () => {
        rows.splice(idx, 1);
        saveState(state);
        rerender();
        updateProgress();
      });
      wrap.appendChild(r);
    });
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-add btn-add-life';
    addBtn.textContent = '+ Add Another Life-Sustaining Treatment';
    addBtn.addEventListener('click', () => {
      rows.push({ treatment: '', refused: 'yes', evenIfLifeAtRisk: '', specification: '' });
      saveState(state);
      rerender();
      updateProgress();
    });
    wrap.appendChild(addBtn);
  }

  rerender();
  return wrap;
}

// ----------------------------------------------------------------------
// Section renderers
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Personal Information',
    description: 'Your full legal details as they will appear on the ADRT document.'
  });

  card.appendChild(textInput({ label: 'Full Legal Name', section: 'personalInformation', field: 'fullLegalName', required: true }));
  card.appendChild(textInput({ label: 'Date of Birth', section: 'personalInformation', field: 'dateOfBirth', type: 'date', required: true }));
  card.appendChild(textInput({ label: 'NHS Number', section: 'personalInformation', field: 'nhsNumber', placeholder: 'e.g. 943 476 5919' }));
  card.appendChild(textInput({ label: 'Address', section: 'personalInformation', field: 'address', required: true }));
  card.appendChild(textInput({ label: 'Postcode', section: 'personalInformation', field: 'postcode', required: true }));
  card.appendChild(textInput({ label: 'Telephone', section: 'personalInformation', field: 'telephone' }));
  card.appendChild(textInput({ label: 'Email', section: 'personalInformation', field: 'email', type: 'email' }));

  card.appendChild(subsectionHeader('GP Details'));
  card.appendChild(textInput({ label: 'GP Name', section: 'personalInformation', field: 'gpName' }));
  card.appendChild(textInput({ label: 'GP Practice', section: 'personalInformation', field: 'gpPractice' }));
  card.appendChild(textInput({ label: 'GP Address', section: 'personalInformation', field: 'gpAddress' }));
  card.appendChild(textInput({ label: 'GP Telephone', section: 'personalInformation', field: 'gpTelephone' }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Capacity Declaration',
    description: 'Confirmation that you have the mental capacity to make this decision.'
  });

  card.appendChild(noticeBox(
    'info',
    'Important Legal Notice',
    `<p>Under the Mental Capacity Act 2005, you must have the mental capacity to make this advance decision. This means you must be able to understand, retain, and weigh the information relevant to the decision, and communicate your decision.</p>`
  ));

  card.appendChild(radioGroup({
    label: 'I confirm that I have the mental capacity to make this advance decision',
    section: 'capacityDeclaration', field: 'confirmsCapacity',
    options: yesNo, required: true
  }));
  card.appendChild(radioGroup({
    label: 'I understand the consequences of refusing the treatments specified in this document, including that I may die as a result',
    section: 'capacityDeclaration', field: 'understandsConsequences',
    options: yesNo, required: true
  }));
  card.appendChild(radioGroup({
    label: 'I confirm that I am making this decision freely and without undue influence from any other person',
    section: 'capacityDeclaration', field: 'noUndueInfluence',
    options: yesNo, required: true
  }));

  card.appendChild(subsectionHeader('Professional Capacity Assessment (if available)'));
  card.appendChild(radioGroup({
    label: 'Has a healthcare professional assessed your mental capacity?',
    section: 'capacityDeclaration', field: 'professionalCapacityAssessment',
    options: yesNo
  }));

  const profDetails = document.createElement('div');
  profDetails.dataset.conditional = 'capacityDeclaration.professionalCapacityAssessment=yes';
  profDetails.appendChild(textInput({ label: 'Assessed by (name)', section: 'capacityDeclaration', field: 'assessedByName' }));
  profDetails.appendChild(textInput({ label: 'Role / Title', section: 'capacityDeclaration', field: 'assessedByRole' }));
  profDetails.appendChild(textInput({ label: 'Assessment Date', section: 'capacityDeclaration', field: 'assessmentDate', type: 'date' }));
  profDetails.appendChild(textArea({
    label: 'Assessment Details',
    section: 'capacityDeclaration', field: 'assessmentDetails',
    placeholder: 'Summary of the capacity assessment findings',
    rows: 3
  }));
  card.appendChild(profDetails);

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Circumstances',
    description: 'Describe the specific circumstances when this ADRT should apply.'
  });

  card.appendChild(noticeBox(
    'info',
    'Guidance',
    `<p>Be as specific as possible about when this ADRT applies. The more precise your description, the easier it will be for healthcare professionals to determine whether the circumstances match your wishes.</p>`
  ));

  card.appendChild(textArea({
    label: 'Specific Circumstances',
    section: 'circumstances', field: 'specificCircumstances',
    rows: 5, required: true,
    placeholder: "e.g. 'In the event that I develop advanced dementia and can no longer recognise my family or communicate meaningfully...'"
  }));
  card.appendChild(textArea({
    label: 'Medical Conditions / Situations',
    section: 'circumstances', field: 'medicalConditions',
    rows: 4,
    placeholder: 'Describe any existing or anticipated medical conditions relevant to this ADRT'
  }));
  card.appendChild(textArea({
    label: 'Additional Situation Description',
    section: 'circumstances', field: 'situationsDescription',
    rows: 4,
    placeholder: 'Any further details about the circumstances in which this ADRT should apply'
  }));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Treatments Refused — General',
    description: 'Select which general treatments you wish to refuse in the circumstances described.'
  });

  card.appendChild(noticeBox(
    'warning',
    'Important',
    `<p>This section covers general treatments that are NOT life-sustaining. Life-sustaining treatment refusals require additional legal safeguards and are covered in the next step.</p>`
  ));

  card.appendChild(generalTreatmentBlock(
    'Antibiotics', 'antibiotics',
    "Please specify which antibiotics or circumstances (e.g. 'only for life-threatening infections')"
  ));
  card.appendChild(generalTreatmentBlock(
    'Blood Transfusion', 'bloodTransfusion',
    'Please specify any conditions or limitations'
  ));
  card.appendChild(generalTreatmentBlock(
    'IV Fluids', 'ivFluids',
    'Please specify any conditions or limitations'
  ));
  card.appendChild(generalTreatmentBlock(
    'Tube Feeding', 'tubeFeeding',
    'Please specify any conditions or limitations'
  ));
  card.appendChild(generalTreatmentBlock(
    'Dialysis', 'dialysis',
    'Please specify any conditions or limitations'
  ));
  card.appendChild(generalTreatmentBlock(
    'Non-invasive Ventilation (e.g. CPAP/BiPAP)', 'ventilation',
    'Please specify any conditions or limitations'
  ));

  card.appendChild(subsectionHeader('Other Treatments to Refuse'));
  card.appendChild(otherTreatmentsEditor());

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Treatments Refused — Life-Sustaining',
    description: 'Refusal of life-sustaining treatment has additional legal requirements.'
  });

  card.appendChild(noticeBox(
    'danger',
    'IMPORTANT LEGAL REQUIREMENT',
    `<p>Under the Mental Capacity Act 2005, for an ADRT to be legally valid for life-sustaining treatment, you <strong>MUST</strong>:</p>
     <ul>
       <li>Explicitly state that the refusal applies <strong>"even if life is at risk"</strong></li>
       <li>The ADRT must be <strong>in writing</strong></li>
       <li>It must be <strong>signed</strong> by you</li>
       <li>Your signature must be <strong>witnessed</strong></li>
     </ul>
     <p>Without these requirements, the ADRT will NOT be legally binding for life-sustaining treatment.</p>`
  ));

  card.appendChild(lifeSustainingBlock(
    'Cardiopulmonary Resuscitation (CPR)', 'cpr',
    'Any specific conditions or details about your CPR refusal'
  ));
  card.appendChild(lifeSustainingBlock(
    'Mechanical Ventilation (life support machine)', 'mechanicalVentilation',
    'Any specific conditions or details'
  ));
  card.appendChild(lifeSustainingBlock(
    'Artificial Nutrition and Hydration (including tube feeding and IV nutrition)',
    'artificialNutritionHydration',
    'Any specific conditions or details'
  ));

  card.appendChild(subsectionHeader('Other Life-Sustaining Treatments to Refuse'));
  card.appendChild(otherLifeSustainingEditor());

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Exceptions & Conditions',
    description: 'Circumstances where your treatment refusals would NOT apply.'
  });

  card.appendChild(noticeBox(
    'info',
    'Guidance',
    `<p>You may wish to specify circumstances where your refusal of treatment does NOT apply. For example, you might refuse treatment in the case of advanced dementia but not in the case of a temporary illness from which you could recover.</p>`
  ));

  card.appendChild(radioGroup({
    label: 'Are there any circumstances where your treatment refusals would NOT apply?',
    section: 'exceptionsConditions', field: 'hasExceptions',
    options: yesNo
  }));
  const excDetails = document.createElement('div');
  excDetails.dataset.conditional = 'exceptionsConditions.hasExceptions=yes';
  excDetails.appendChild(textArea({
    label: 'Describe the exceptions',
    section: 'exceptionsConditions', field: 'exceptionsDescription',
    rows: 4,
    placeholder: 'Describe the circumstances in which your treatment refusals would NOT apply'
  }));
  card.appendChild(excDetails);

  card.appendChild(radioGroup({
    label: 'Does this ADRT have any time limitations?',
    section: 'exceptionsConditions', field: 'hasTimeLimitations',
    options: yesNo
  }));
  const timeDetails = document.createElement('div');
  timeDetails.dataset.conditional = 'exceptionsConditions.hasTimeLimitations=yes';
  timeDetails.appendChild(textArea({
    label: 'Time limitations',
    section: 'exceptionsConditions', field: 'timeLimitationsDescription',
    rows: 3,
    placeholder: "e.g. 'This ADRT is valid for 5 years from the date of signing'"
  }));
  card.appendChild(timeDetails);

  card.appendChild(textArea({
    label: 'Conditions that would invalidate this ADRT (optional)',
    section: 'exceptionsConditions', field: 'invalidatingConditions',
    rows: 3,
    placeholder: "e.g. 'This ADRT is invalidated if a new treatment becomes available for my condition'"
  }));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Other Wishes',
    description: 'Preferences that inform your care (these are NOT legally binding).'
  });

  card.appendChild(noticeBox(
    'warning',
    'Please note',
    `<p>This section records your preferences and wishes. Unlike the treatment refusals in the previous sections, these wishes are <strong>not legally binding</strong> but will be taken into account by healthcare professionals when planning your care.</p>`
  ));

  card.appendChild(textArea({
    label: 'Preferred Care Setting',
    section: 'otherWishes', field: 'preferredCareSetting',
    rows: 3,
    placeholder: "e.g. 'I wish to remain at home if possible' or 'I would prefer to be in a hospice'"
  }));
  card.appendChild(textArea({
    label: 'Comfort Measures',
    section: 'otherWishes', field: 'comfortMeasures',
    rows: 3,
    placeholder: "e.g. 'Please ensure adequate pain relief' or 'I would like to listen to music'"
  }));
  card.appendChild(textArea({
    label: 'Spiritual or Religious Wishes',
    section: 'otherWishes', field: 'spiritualReligiousWishes',
    rows: 3,
    placeholder: 'Any spiritual, religious, or cultural preferences for your care'
  }));
  card.appendChild(textArea({
    label: 'Other Preferences',
    section: 'otherWishes', field: 'otherPreferences',
    rows: 3,
    placeholder: 'Any other wishes or preferences about your care'
  }));

  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Lasting Power of Attorney',
    description: 'Details of any Lasting Power of Attorney (LPA) that may affect this ADRT.'
  });

  card.appendChild(noticeBox(
    'warning',
    'Important Legal Interaction',
    `<p>If you have a Health and Welfare LPA that was registered <strong>after</strong> you made this ADRT, the LPA attorney may have authority to consent to the treatments you have refused. It is important to clarify the relationship between your ADRT and any LPA.</p>`
  ));

  card.appendChild(radioGroup({
    label: 'Do you have a Lasting Power of Attorney (LPA)?',
    section: 'lastingPowerOfAttorney', field: 'hasLPA',
    options: yesNo
  }));

  const lpaDetails = document.createElement('div');
  lpaDetails.dataset.conditional = 'lastingPowerOfAttorney.hasLPA=yes';

  lpaDetails.appendChild(selectInput({
    label: 'Type of LPA',
    section: 'lastingPowerOfAttorney', field: 'lpaType',
    required: true,
    options: [
      { value: 'health-and-welfare', label: 'Health and Welfare' },
      { value: 'property-and-financial', label: 'Property and Financial Affairs' },
      { value: 'both', label: 'Both' }
    ]
  }));

  lpaDetails.appendChild(radioGroup({
    label: 'Is the LPA registered with the Office of the Public Guardian?',
    section: 'lastingPowerOfAttorney', field: 'lpaRegistered',
    options: yesNo
  }));

  const regDate = document.createElement('div');
  regDate.dataset.conditional = 'lastingPowerOfAttorney.lpaRegistered=yes';
  regDate.appendChild(textInput({
    label: 'Registration Date',
    section: 'lastingPowerOfAttorney', field: 'lpaRegistrationDate',
    type: 'date'
  }));
  lpaDetails.appendChild(regDate);

  lpaDetails.appendChild(textInput({
    label: 'Name(s) of Attorney(s) / Donee(s)',
    section: 'lastingPowerOfAttorney', field: 'doneeNames'
  }));
  lpaDetails.appendChild(textArea({
    label: 'Relationship between this ADRT and the LPA',
    section: 'lastingPowerOfAttorney', field: 'relationshipBetweenADRTAndLPA',
    rows: 4,
    placeholder: "Describe how the ADRT and LPA interact. For example: 'This ADRT takes precedence over the LPA for the specific treatments refused.'"
  }));
  card.appendChild(lpaDetails);

  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Healthcare Professional Review',
    description: 'Details of the clinician who reviewed this ADRT.'
  });

  card.appendChild(noticeBox(
    'info',
    'Recommended',
    `<p>While not a strict legal requirement, having a healthcare professional review your ADRT significantly strengthens its validity. A clinician can confirm your understanding of the treatment refusals and their consequences.</p>`
  ));

  card.appendChild(textInput({
    label: 'Reviewing Clinician Name',
    section: 'healthcareProfessionalReview', field: 'reviewedByClinicianName'
  }));
  card.appendChild(textInput({
    label: 'Role / Title',
    section: 'healthcareProfessionalReview', field: 'reviewedByClinicianRole',
    placeholder: 'e.g. Consultant, GP, Specialist Nurse'
  }));
  card.appendChild(textInput({
    label: 'Review Date',
    section: 'healthcareProfessionalReview', field: 'reviewDate',
    type: 'date'
  }));

  card.appendChild(textArea({
    label: 'Clinical Opinion on Capacity',
    section: 'healthcareProfessionalReview', field: 'clinicalOpinionOnCapacity',
    rows: 4,
    placeholder: "Clinician's assessment of the patient's mental capacity to make this advance decision"
  }));

  card.appendChild(radioGroup({
    label: 'Does the reviewing clinician have any concerns about this ADRT?',
    section: 'healthcareProfessionalReview', field: 'anyConcerns',
    options: yesNo
  }));
  const concerns = document.createElement('div');
  concerns.dataset.conditional = 'healthcareProfessionalReview.anyConcerns=yes';
  concerns.appendChild(textArea({
    label: 'Details of concerns',
    section: 'healthcareProfessionalReview', field: 'concernsDetails',
    rows: 4,
    placeholder: 'Please describe the concerns'
  }));
  card.appendChild(concerns);

  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Legal Signatures',
    description: 'Signatures and declarations to make this ADRT legally binding.'
  });

  card.appendChild(noticeBox(
    'danger',
    'LEGAL REQUIREMENTS',
    `<p>For this ADRT to be legally valid, it must be signed by you and witnessed. If you have refused any life-sustaining treatment, additional requirements apply as detailed below.</p>`
  ));

  // Patient signature
  const patient = document.createElement('div');
  patient.className = 'subgroup';
  const pHeader = document.createElement('h3');
  pHeader.textContent = 'Patient Signature';
  pHeader.style.margin = '0 0 0.75rem';
  patient.appendChild(pHeader);
  patient.appendChild(radioGroup({
    label: 'I confirm that I have read and understand the contents of this ADRT',
    section: 'legalSignatures', field: 'patientStatementOfUnderstanding',
    options: yesNo, required: true
  }));
  patient.appendChild(radioGroup({
    label: 'Patient has signed this document',
    section: 'legalSignatures', field: 'patientSignature',
    options: yesNo, required: true
  }));
  patient.appendChild(textInput({
    label: 'Date of Patient Signature',
    section: 'legalSignatures', field: 'patientSignatureDate',
    type: 'date', required: true
  }));
  card.appendChild(patient);

  // Witness
  const witness = document.createElement('div');
  witness.className = 'subgroup';
  const wHeader = document.createElement('h3');
  wHeader.textContent = 'Witness';
  wHeader.style.margin = '0 0 0.75rem';
  witness.appendChild(wHeader);
  witness.appendChild(radioGroup({
    label: 'Witness has signed this document',
    section: 'legalSignatures', field: 'witnessSignature',
    options: yesNo, required: true
  }));
  witness.appendChild(textInput({
    label: 'Witness Full Name',
    section: 'legalSignatures', field: 'witnessName', required: true
  }));
  witness.appendChild(textInput({
    label: 'Witness Address',
    section: 'legalSignatures', field: 'witnessAddress'
  }));
  witness.appendChild(textInput({
    label: 'Date of Witness Signature',
    section: 'legalSignatures', field: 'witnessSignatureDate',
    type: 'date'
  }));
  card.appendChild(witness);

  // Life-sustaining additional requirements (data-conditional based on
  // whether any life-sustaining refusal exists). We use a special token
  // `__hasLifeSustainingRefusal` recognised by updateConditionalSections.
  const lsBlock = document.createElement('div');
  lsBlock.className = 'subgroup subgroup-life';
  lsBlock.dataset.conditional = '__hasLifeSustainingRefusal=yes';

  const lsHeader = document.createElement('h3');
  lsHeader.textContent = 'Additional Requirements for Life-Sustaining Treatment Refusal';
  lsHeader.style.margin = '0 0 0.5rem';
  lsHeader.style.color = '#7f1d1d';
  lsBlock.appendChild(lsHeader);

  const lsIntro = document.createElement('p');
  lsIntro.style.margin = '0 0 0.75rem';
  lsIntro.style.fontSize = '0.875rem';
  lsIntro.style.color = '#7f1d1d';
  lsIntro.textContent =
    'Because you have refused one or more life-sustaining treatments, the following additional legal requirements must be met under the Mental Capacity Act 2005.';
  lsBlock.appendChild(lsIntro);

  lsBlock.appendChild(radioGroup({
    label: 'I have provided a written statement that my refusal of life-sustaining treatment applies even if my life is at risk',
    section: 'legalSignatures', field: 'lifeSustainingWrittenStatement',
    options: yesNo, required: true
  }));

  const stmtText = document.createElement('div');
  stmtText.dataset.conditional = 'legalSignatures.lifeSustainingWrittenStatement=yes';
  stmtText.appendChild(textArea({
    label: 'Written Statement',
    section: 'legalSignatures', field: 'lifeSustainingStatementText',
    rows: 4,
    placeholder: "e.g. 'I understand that the treatments I have refused may be necessary to sustain my life, and I confirm that my refusal applies even if my life is at risk as a result.'"
  }));
  lsBlock.appendChild(stmtText);

  lsBlock.appendChild(radioGroup({
    label: 'Patient has signed the life-sustaining treatment refusal section',
    section: 'legalSignatures', field: 'lifeSustainingSignature',
    options: yesNo, required: true
  }));

  lsBlock.appendChild(radioGroup({
    label: 'Witness has signed the life-sustaining treatment refusal section',
    section: 'legalSignatures', field: 'lifeSustainingWitnessSignature',
    options: yesNo, required: true
  }));

  const lsWitness = document.createElement('div');
  lsWitness.dataset.conditional = 'legalSignatures.lifeSustainingWitnessSignature=yes';
  lsWitness.appendChild(textInput({
    label: 'Life-Sustaining Witness Full Name',
    section: 'legalSignatures', field: 'lifeSustainingWitnessName',
    required: true
  }));
  lsWitness.appendChild(textInput({
    label: 'Life-Sustaining Witness Address',
    section: 'legalSignatures', field: 'lifeSustainingWitnessAddress'
  }));
  lsBlock.appendChild(lsWitness);

  card.appendChild(lsBlock);

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections
// ----------------------------------------------------------------------

/** Resolve a `section.field` or `section.subKey.field` path into the
 * current state value (or '' for missing). */
function resolvePath(path) {
  if (path === '__hasLifeSustainingRefusal') {
    return hasLifeSustainingRefusal(state) ? 'yes' : 'no';
  }
  const parts = path.split('.');
  let cur = state;
  for (const p of parts) {
    if (cur == null) return '';
    cur = cur[p];
  }
  return cur ?? '';
}

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const eq = expr.indexOf('=');
    const path = expr.slice(0, eq);
    const target = expr.slice(eq + 1);
    const current = resolvePath(path);
    host.style.display = String(current) === target ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

/** List of tracked top-level fields. Each entry is either
 * [section, field] or [section, subKey, field]. */
const TRACKED_FIELDS = [
  // Personal Information (core)
  ['personalInformation', 'fullLegalName'],
  ['personalInformation', 'dateOfBirth'],
  ['personalInformation', 'nhsNumber'],
  ['personalInformation', 'address'],
  ['personalInformation', 'postcode'],
  ['personalInformation', 'gpName'],
  // Capacity Declaration
  ['capacityDeclaration', 'confirmsCapacity'],
  ['capacityDeclaration', 'understandsConsequences'],
  ['capacityDeclaration', 'noUndueInfluence'],
  ['capacityDeclaration', 'professionalCapacityAssessment'],
  // Circumstances
  ['circumstances', 'specificCircumstances'],
  // Treatments — General (refused yes/no per treatment)
  ['treatmentsRefusedGeneral', 'antibiotics', 'refused'],
  ['treatmentsRefusedGeneral', 'bloodTransfusion', 'refused'],
  ['treatmentsRefusedGeneral', 'ivFluids', 'refused'],
  ['treatmentsRefusedGeneral', 'tubeFeeding', 'refused'],
  ['treatmentsRefusedGeneral', 'dialysis', 'refused'],
  ['treatmentsRefusedGeneral', 'ventilation', 'refused'],
  // Treatments — Life-Sustaining
  ['treatmentsRefusedLifeSustaining', 'cpr', 'refused'],
  ['treatmentsRefusedLifeSustaining', 'mechanicalVentilation', 'refused'],
  ['treatmentsRefusedLifeSustaining', 'artificialNutritionHydration', 'refused'],
  // Exceptions & Conditions
  ['exceptionsConditions', 'hasExceptions'],
  ['exceptionsConditions', 'hasTimeLimitations'],
  // LPA
  ['lastingPowerOfAttorney', 'hasLPA'],
  // Healthcare Professional Review
  ['healthcareProfessionalReview', 'reviewedByClinicianName'],
  ['healthcareProfessionalReview', 'reviewDate'],
  ['healthcareProfessionalReview', 'anyConcerns'],
  // Legal Signatures
  ['legalSignatures', 'patientStatementOfUnderstanding'],
  ['legalSignatures', 'patientSignature'],
  ['legalSignatures', 'patientSignatureDate'],
  ['legalSignatures', 'witnessSignature'],
  ['legalSignatures', 'witnessName']
];

function readTracked(entry) {
  if (entry.length === 2) {
    return state[entry[0]][entry[1]];
  }
  return state[entry[0]][entry[1]][entry[2]];
}

function updateProgress() {
  let answered = 0;
  for (const entry of TRACKED_FIELDS) {
    const v = readTracked(entry);
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
    case 'high':   return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low':    return 'flag-low';
    default:       return '';
  }
}

function severityClass(sev) {
  return `sev-${sev}`;
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const { validityStatus, firedRules, additionalFlags, timestamp } = lastResult;

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

  const ruleRows = firedRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.id)}</th>
      <td>${esc(r.category)}</td>
      <td>${esc(r.description)}</td>
      <td class="severity ${severityClass(r.severity)}">${esc(r.severity)}</td>
    </tr>
  `).join('');

  const ruleTable = firedRules.length === 0
    ? `<p class="muted">No validity issues detected — all required fields satisfied.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Category</th>
            <th scope="col">Issue</th>
            <th scope="col">Severity</th>
          </tr>
        </thead>
        <tbody>${ruleRows}</tbody>
      </table>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>ADRT Validity Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>Validity Status</h3>
      <p class="validity-summary">
        <span class="validity-badge ${validityStatusClass(validityStatus)}">${esc(validityStatusLabel(validityStatus))}</span>
      </p>
      <p class="muted">${firedRules.length} validity issue(s) fired across ${firedRules.length === 0 ? '0' : firedRules.length} rule(s).</p>

      <h3>Validity Issues</h3>
      ${ruleTable}

      <h3>Flagged Issues</h3>
      ${flagsList}

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="btn btn-secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
}

function submitForm() {
  const { validityStatus, firedRules } = calculateValidity(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    validityStatus,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh ADRT?')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  document.getElementById('report').innerHTML = '';
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
})();
