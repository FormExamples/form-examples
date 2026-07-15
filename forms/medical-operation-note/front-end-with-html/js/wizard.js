import { calculateOperationGrade } from './composite-grader.js';
import { renderReport } from './report.js';
import { emptyOperationNote } from './types.js';
import { esc } from './utils.js';

// Medical Operation Note — operating-team wizard (vanilla JS).
//
// Single-page continuous wizard: every section is rendered into the page
// in document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered.
// Submission runs the pure composite-grader and renders an inline
// report. State is persisted to localStorage so a partial fill survives
// a page reload.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY =
  'medical-operation-note.front-end-form-with-html.v1';
const TOTAL_STEPS = 12;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyOperationNote();
    const parsed = JSON.parse(raw);
    const fresh = emptyOperationNote();
    for (const key of Object.keys(fresh)) {
      const v = parsed && parsed[key];
      if (Array.isArray(fresh[key])) {
        fresh[key] = Array.isArray(v) ? v : [];
      } else if (v && typeof v === 'object') {
        fresh[key] = { ...fresh[key], ...v };
      }
    }
    return fresh;
  } catch (e) {
    console.warn('Could not parse saved op note; starting fresh.', e);
    return emptyOperationNote();
  }
}

function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn('Could not save op note to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored op note.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

let state = loadState();
/** @type {ReturnType<typeof calculateOperationGrade> | null} */
let lastResult = null;

function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
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
    `value="${esc(value ?? '')}"`
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
    <span class="error-message" id="${id}-error"></span>
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
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select" aria-describedby="${id}-error">
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    let v = sel.value;
    if (opts.numeric) v = v === '' ? null : Number(v);
    setField(opts.section, opts.field, v);
    clearFieldError(id);
  });
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
  legend.textContent = opts.label;
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-group';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', wrapper.id);
  for (const option of opts.options) {
    const radioId = `${groupId}-${String(option.value).replace(/[^a-z0-9-]+/gi, '_')}`;
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
  legend.innerHTML = `
    <span class="section-step">Step ${opts.stepNumber} of ${TOTAL_STEPS}</span>
    <h2 class="section-title">${esc(opts.title)}</h2>
    ${desc}
  `;
  card.appendChild(legend);
  return card;
}

function subHeading(text) {
  const h = document.createElement('h3');
  h.textContent = text;
  return h;
}

// ----------------------------------------------------------------------
// Common option lists
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no',  label: 'No'  }
];

const LIST_TYPE_OPTIONS = [
  { value: 'elective',  label: 'Elective' },
  { value: 'cepod',     label: 'CEPOD / emergency list' },
  { value: 'trauma',    label: 'Trauma' },
  { value: 'obstetric', label: 'Obstetric' },
  { value: 'day-case',  label: 'Day case' },
  { value: 'endoscopy', label: 'Endoscopy' }
];

const URGENCY_OPTIONS = [
  { value: 'elective',  label: 'Elective (NCEPOD 4)' },
  { value: 'scheduled', label: 'Scheduled (NCEPOD 3)' },
  { value: 'urgent',    label: 'Urgent (NCEPOD 2)' },
  { value: 'immediate', label: 'Immediate (NCEPOD 1)' }
];

const LATERALITY_OPTIONS = [
  { value: 'left',      label: 'Left' },
  { value: 'right',     label: 'Right' },
  { value: 'bilateral', label: 'Bilateral' },
  { value: 'midline',   label: 'Midline' },
  { value: 'na',        label: 'N/A' }
];

const ANAESTHESIA_TYPE_OPTIONS = [
  { value: 'ga',           label: 'General anaesthesia' },
  { value: 'regional',     label: 'Regional' },
  { value: 'neuraxial',    label: 'Neuraxial (spinal / epidural)' },
  { value: 'sedation',     label: 'Sedation' },
  { value: 'mac',          label: 'Monitored anaesthesia care (MAC)' },
  { value: 'local',        label: 'Local infiltration' }
];

const AIRWAY_OPTIONS = [
  { value: 'face-mask',       label: 'Face mask' },
  { value: 'supraglottic',    label: 'Supraglottic device' },
  { value: 'ett',             label: 'Endotracheal tube' },
  { value: 'awake-foi',       label: 'Awake fibreoptic intubation' },
  { value: 'surgical-airway', label: 'Surgical airway' },
  { value: 'na',              label: 'N/A' }
];

const ANAESTHETIC_EVENT_OPTIONS = [
  { value: 'none',                   label: 'No anaesthetic event' },
  { value: 'failed-intubation',      label: 'Failed intubation' },
  { value: 'awareness',              label: 'Awareness under anaesthesia' },
  { value: 'anaphylaxis',            label: 'Anaphylaxis' },
  { value: 'malignant-hyperthermia', label: 'Malignant hyperthermia' },
  { value: 'sux-apnoea',             label: 'Suxamethonium apnoea' },
  { value: 'aspiration',             label: 'Pulmonary aspiration' },
  { value: 'dental-injury',          label: 'Dental injury' },
  { value: 'hypotension',            label: 'Sustained intra-op hypotension' },
  { value: 'other',                  label: 'Other' }
];

const POSITION_OPTIONS = [
  { value: 'supine',         label: 'Supine' },
  { value: 'prone',          label: 'Prone' },
  { value: 'lateral',        label: 'Lateral' },
  { value: 'lithotomy',      label: 'Lithotomy' },
  { value: 'jackknife',      label: 'Jackknife' },
  { value: 'beach-chair',    label: 'Beach chair' },
  { value: 'trendelenburg',  label: 'Trendelenburg' },
  { value: 'reverse-trendelenburg', label: 'Reverse Trendelenburg' }
];

const APPROACH_OPTIONS = [
  { value: 'open',          label: 'Open' },
  { value: 'laparoscopic',  label: 'Laparoscopic' },
  { value: 'endoscopic',    label: 'Endoscopic' },
  { value: 'arthroscopic',  label: 'Arthroscopic' },
  { value: 'robotic',       label: 'Robotic-assisted' },
  { value: 'percutaneous',  label: 'Percutaneous' }
];

const CLAVIEN_DINDO_OPTIONS = [
  { value: '0',    label: '0 — No deviation' },
  { value: 'I',    label: 'I — Minor deviation' },
  { value: 'II',   label: 'II — Pharmacological intervention / transfusion' },
  { value: 'IIIa', label: 'IIIa — Intervention, not under GA' },
  { value: 'IIIb', label: 'IIIb — Intervention, under GA' },
  { value: 'IVa',  label: 'IVa — Single-organ life-threatening' },
  { value: 'IVb',  label: 'IVb — Multi-organ life-threatening' },
  { value: 'V',    label: 'V — Death' }
];

const NEVER_EVENT_OPTIONS = [
  { value: 'wrong-site',      label: 'Wrong-site surgery' },
  { value: 'wrong-side',      label: 'Wrong-side surgery' },
  { value: 'wrong-patient',   label: 'Wrong-patient surgery' },
  { value: 'wrong-procedure', label: 'Wrong-procedure surgery' },
  { value: 'wrong-implant',   label: 'Wrong-implant' },
  { value: 'retained-item',   label: 'Retained foreign object' }
];

const DESTINATION_OPTIONS = [
  { value: 'day-case',      label: 'Day-case discharge' },
  { value: 'ward',          label: 'Ward' },
  { value: 'pacu',          label: 'PACU' },
  { value: 'enhanced-care', label: 'Enhanced care' },
  { value: 'hdu',           label: 'HDU' },
  { value: 'icu',           label: 'ICU' }
];

const ASA_OPTIONS = [
  { value: 1, label: 'ASA I — Healthy' },
  { value: 2, label: 'ASA II — Mild systemic disease' },
  { value: 3, label: 'ASA III — Severe systemic disease' },
  { value: 4, label: 'ASA IV — Severe disease, constant threat to life' },
  { value: 5, label: 'ASA V — Moribund' },
  { value: 6, label: 'ASA VI — Declared brain-dead' }
];

const COMPOSITE_RISK_OPTIONS = [
  { value: 'routine',     label: 'Routine' },
  { value: 'complicated', label: 'Complicated' },
  { value: 'high-risk',   label: 'High-risk' },
  { value: 'critical',    label: 'Critical' }
];

// ----------------------------------------------------------------------
// Step renderers
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Operation identification',
    description: 'Hospital, theatre, list type, and operative timings.'
  });
  card.appendChild(textInput({ label: 'Hospital', section: 'operation', field: 'hospital', required: true }));
  const g = document.createElement('div'); g.className = 'two-col';
  g.appendChild(textInput({ label: 'Theatre / OR number', section: 'operation', field: 'theatreNumber' }));
  g.appendChild(selectInput({ label: 'List type', section: 'operation', field: 'listType', options: LIST_TYPE_OPTIONS }));
  card.appendChild(g);
  card.appendChild(textInput({ label: 'Operation date', section: 'operation', field: 'operationDate', type: 'date' }));
  const t1 = document.createElement('div'); t1.className = 'three-col';
  t1.appendChild(textInput({ label: 'Case start time', section: 'operation', field: 'caseStartTime', type: 'time' }));
  t1.appendChild(textInput({ label: 'Anaesthesia start', section: 'operation', field: 'anaesthesiaStartTime', type: 'time' }));
  t1.appendChild(textInput({ label: 'Knife to skin', section: 'operation', field: 'knifeToSkinTime', type: 'time' }));
  card.appendChild(t1);
  const t2 = document.createElement('div'); t2.className = 'two-col';
  t2.appendChild(textInput({ label: 'End of surgery', section: 'operation', field: 'endOfSurgeryTime', type: 'time' }));
  t2.appendChild(textInput({ label: 'Case end time', section: 'operation', field: 'caseEndTime', type: 'time' }));
  card.appendChild(t2);
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Patient identification',
    description: 'Patient demographics and WHO Sign-In confirmation.'
  });
  const g1 = document.createElement('div'); g1.className = 'two-col';
  g1.appendChild(textInput({ label: 'NHS number', section: 'patient', field: 'nhsNumber' }));
  g1.appendChild(textInput({ label: 'MRN', section: 'patient', field: 'mrn' }));
  card.appendChild(g1);

  const g2 = document.createElement('div'); g2.className = 'two-col';
  g2.appendChild(textInput({ label: 'First name', section: 'patient', field: 'firstName' }));
  g2.appendChild(textInput({ label: 'Last name', section: 'patient', field: 'lastName' }));
  card.appendChild(g2);

  const g3 = document.createElement('div'); g3.className = 'two-col';
  g3.appendChild(textInput({ label: 'Date of birth', section: 'patient', field: 'dateOfBirth', type: 'date' }));
  g3.appendChild(selectInput({
    label: 'Sex', section: 'patient', field: 'sex',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'intersex', label: 'Intersex' },
      { value: 'unknown', label: 'Unknown' }
    ]
  }));
  card.appendChild(g3);

  const g4 = document.createElement('div'); g4.className = 'two-col';
  g4.appendChild(textInput({ label: 'Weight', section: 'patient', field: 'weightKg', type: 'number', min: 0, max: 400, step: 0.1, unit: 'kg' }));
  g4.appendChild(textInput({ label: 'Height', section: 'patient', field: 'heightCm', type: 'number', min: 0, max: 250, step: 0.1, unit: 'cm' }));
  card.appendChild(g4);

  card.appendChild(textArea({ label: 'Allergies summary', section: 'patient', field: 'allergiesSummary', rows: 2, placeholder: 'e.g. NKDA / penicillin (anaphylaxis) / latex' }));

  const g5 = document.createElement('div'); g5.className = 'two-col';
  g5.appendChild(selectInput({
    label: 'Consent status', section: 'patient', field: 'consentStatus',
    options: [
      { value: 'signed-form-1', label: 'Signed Consent Form 1 (adult, capacity)' },
      { value: 'signed-form-2', label: 'Signed Consent Form 2 (parental)' },
      { value: 'signed-form-3', label: 'Signed Consent Form 3 (no GA)' },
      { value: 'signed-form-4', label: 'Signed Consent Form 4 (best interest)' },
      { value: 'verbal-emergency', label: 'Verbal in emergency' },
      { value: 'not-required', label: 'Not required' }
    ]
  }));
  g5.appendChild(radioGroup({ label: 'Operative side marked?', section: 'patient', field: 'sideMarked', options: [...yesNo, { value: 'na', label: 'N/A' }] }));
  card.appendChild(g5);

  card.appendChild(radioGroup({ label: 'WHO Sign-In completed?', section: 'patient', field: 'whoSignInCompleted', options: yesNo }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Surgical team',
    description: 'Names and registration numbers of all team members present.'
  });
  const g1 = document.createElement('div'); g1.className = 'two-col';
  g1.appendChild(textInput({ label: 'Lead surgeon', section: 'team', field: 'leadSurgeonName', required: true }));
  g1.appendChild(textInput({ label: 'Lead surgeon GMC', section: 'team', field: 'leadSurgeonGmc' }));
  card.appendChild(g1);
  const g2 = document.createElement('div'); g2.className = 'two-col';
  g2.appendChild(textInput({ label: 'First assistant', section: 'team', field: 'firstAssistant' }));
  g2.appendChild(textInput({ label: 'Second assistant', section: 'team', field: 'secondAssistant' }));
  card.appendChild(g2);
  const g3 = document.createElement('div'); g3.className = 'two-col';
  g3.appendChild(textInput({ label: 'Anaesthetist', section: 'team', field: 'anaesthetistName' }));
  g3.appendChild(textInput({ label: 'Anaesthetist GMC', section: 'team', field: 'anaesthetistGmc' }));
  card.appendChild(g3);
  const g4 = document.createElement('div'); g4.className = 'three-col';
  g4.appendChild(textInput({ label: 'ODP', section: 'team', field: 'odp' }));
  g4.appendChild(textInput({ label: 'Scrub nurse', section: 'team', field: 'scrubNurse' }));
  g4.appendChild(textInput({ label: 'Circulating nurse', section: 'team', field: 'circulatingNurse' }));
  card.appendChild(g4);
  card.appendChild(textArea({ label: 'Students present (names / roles)', section: 'team', field: 'studentsPresent', rows: 2 }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Diagnoses & procedures',
    description: 'Pre- and post-operative diagnoses, planned vs actual procedure, OPCS-4 coding.'
  });
  card.appendChild(textInput({ label: 'Pre-operative diagnosis', section: 'diagnoses', field: 'preOperativeDiagnosis' }));
  card.appendChild(textInput({ label: 'Post-operative diagnosis', section: 'diagnoses', field: 'postOperativeDiagnosis' }));
  card.appendChild(textArea({ label: 'Planned procedure(s)', section: 'diagnoses', field: 'plannedProcedure', rows: 2 }));
  card.appendChild(textArea({ label: 'Procedure(s) actually performed', section: 'diagnoses', field: 'procedurePerformed', rows: 3, required: true }));
  card.appendChild(textInput({ label: 'OPCS-4 codes (comma separated)', section: 'diagnoses', field: 'opcs4Codes', placeholder: 'e.g. H01.1, Y79.1' }));
  const g = document.createElement('div'); g.className = 'two-col';
  g.appendChild(selectInput({ label: 'Urgency (NCEPOD)', section: 'diagnoses', field: 'urgency', options: URGENCY_OPTIONS }));
  g.appendChild(selectInput({ label: 'Laterality', section: 'diagnoses', field: 'laterality', options: LATERALITY_OPTIONS }));
  card.appendChild(g);
  card.appendChild(textArea({ label: 'Indication', section: 'diagnoses', field: 'indication', rows: 2 }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Anaesthesia',
    description: 'Anaesthetic type, airway, agents, monitoring, intra-op fluids, and events.'
  });
  const g = document.createElement('div'); g.className = 'two-col';
  g.appendChild(selectInput({ label: 'Anaesthesia type', section: 'anaesthesia', field: 'type', options: ANAESTHESIA_TYPE_OPTIONS }));
  g.appendChild(selectInput({ label: 'Airway', section: 'anaesthesia', field: 'airway', options: AIRWAY_OPTIONS }));
  card.appendChild(g);

  card.appendChild(textInput({ label: 'Induction agent', section: 'anaesthesia', field: 'inductionAgent', placeholder: 'e.g. propofol 200 mg + fentanyl 100 µg' }));
  card.appendChild(textInput({ label: 'Maintenance agent', section: 'anaesthesia', field: 'maintenanceAgent', placeholder: 'e.g. sevoflurane 2% in O2/air' }));
  card.appendChild(textInput({ label: 'Neuromuscular blockade', section: 'anaesthesia', field: 'neuromuscularBlockade', placeholder: 'e.g. rocuronium 50 mg' }));
  card.appendChild(textArea({ label: 'Regional block details', section: 'anaesthesia', field: 'regionalBlockDetails', rows: 2, placeholder: 'e.g. ultrasound-guided TAP block, 20 mL 0.25% levobupivacaine each side' }));
  card.appendChild(textArea({ label: 'Lines and monitoring', section: 'anaesthesia', field: 'linesAndMonitoring', rows: 2, placeholder: 'e.g. 18G PIVC ×2, arterial line right radial, 5-lead ECG, NIBP, ETCO2, SpO2, temp' }));

  card.appendChild(subHeading('Intra-operative fluids'));
  const f = document.createElement('div'); f.className = 'three-col';
  f.appendChild(textInput({ label: 'Crystalloid', section: 'anaesthesia', field: 'crystalloidMl', type: 'number', min: 0, max: 20000, unit: 'mL' }));
  f.appendChild(textInput({ label: 'Colloid', section: 'anaesthesia', field: 'colloidMl', type: 'number', min: 0, max: 10000, unit: 'mL' }));
  f.appendChild(textInput({ label: 'Blood products (total)', section: 'anaesthesia', field: 'bloodMl', type: 'number', min: 0, max: 20000, unit: 'mL' }));
  card.appendChild(f);

  card.appendChild(selectInput({ label: 'Anaesthetic event', section: 'anaesthesia', field: 'anaestheticEvent', options: ANAESTHETIC_EVENT_OPTIONS }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Position, prep & approach',
    description: 'Patient position, skin prep, draping, surgical approach, incision, and tourniquet.'
  });
  const g = document.createElement('div'); g.className = 'two-col';
  g.appendChild(selectInput({ label: 'Patient position', section: 'approach', field: 'patientPosition', options: POSITION_OPTIONS }));
  g.appendChild(textInput({ label: 'Pressure-area protection', section: 'approach', field: 'pressureAreaProtection', placeholder: 'e.g. gel pads, heel raisers' }));
  card.appendChild(g);

  const g2 = document.createElement('div'); g2.className = 'two-col';
  g2.appendChild(textInput({ label: 'Prep solution', section: 'approach', field: 'prepSolution', placeholder: 'e.g. 2% chlorhexidine in 70% alcohol' }));
  g2.appendChild(textInput({ label: 'Drapes', section: 'approach', field: 'drapes', placeholder: 'e.g. disposable adhesive 4-towel' }));
  card.appendChild(g2);

  const g3 = document.createElement('div'); g3.className = 'two-col';
  g3.appendChild(selectInput({ label: 'Surgical approach', section: 'approach', field: 'surgicalApproach', options: APPROACH_OPTIONS }));
  g3.appendChild(textInput({ label: 'Incision type', section: 'approach', field: 'incisionType', placeholder: 'e.g. midline laparotomy' }));
  card.appendChild(g3);

  const g4 = document.createElement('div'); g4.className = 'two-col';
  g4.appendChild(textInput({ label: 'Incision length', section: 'approach', field: 'incisionLengthCm', type: 'number', min: 0, max: 100, step: 0.1, unit: 'cm' }));
  g4.appendChild(textInput({ label: 'Table tilt', section: 'approach', field: 'tableTilt', placeholder: 'e.g. 15° head-down' }));
  card.appendChild(g4);

  card.appendChild(radioGroup({ label: 'Tourniquet used?', section: 'approach', field: 'tourniquetUsed', options: yesNo }));
  const tq = document.createElement('div');
  tq.dataset.conditional = 'approach.tourniquetUsed=yes';
  const tq1 = document.createElement('div'); tq1.className = 'two-col';
  tq1.appendChild(textInput({ label: 'Tourniquet site', section: 'approach', field: 'tourniquetSite', placeholder: 'e.g. right thigh' }));
  tq1.appendChild(textInput({ label: 'Tourniquet pressure', section: 'approach', field: 'tourniquetPressureMmHg', type: 'number', min: 0, max: 500, unit: 'mmHg' }));
  tq.appendChild(tq1);
  const tq2 = document.createElement('div'); tq2.className = 'two-col';
  tq2.appendChild(textInput({ label: 'Time on', section: 'approach', field: 'tourniquetTimeOn', type: 'time' }));
  tq2.appendChild(textInput({ label: 'Time off', section: 'approach', field: 'tourniquetTimeOff', type: 'time' }));
  tq.appendChild(tq2);
  card.appendChild(tq);
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Operative findings & technique',
    description: 'Numbered free-text technique, pathology, anomalies, intra-op imaging.'
  });
  card.appendChild(textArea({ label: 'Operative technique (numbered step-by-step)', section: 'findings', field: 'techniqueSteps', rows: 6,
    placeholder: '1. ...\n2. ...\n3. ...' }));
  card.appendChild(textArea({ label: 'Pathology found', section: 'findings', field: 'pathologyFound', rows: 3 }));
  card.appendChild(textArea({ label: 'Anatomical anomalies', section: 'findings', field: 'anatomicalAnomalies', rows: 2 }));
  const g = document.createElement('div'); g.className = 'two-col';
  g.appendChild(radioGroup({ label: 'Intra-operative photographs taken?', section: 'findings', field: 'photographsTaken', options: yesNo }));
  g.appendChild(radioGroup({ label: 'Frozen section requested?', section: 'findings', field: 'frozenSectionRequested', options: yesNo }));
  card.appendChild(g);
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Materials, implants & prostheses',
    description: 'Sutures, staples, clips, mesh, screws, plates, joints, grafts, lot / serial / batch.'
  });
  card.appendChild(textArea({ label: 'Sutures used (type, gauge, count)', section: 'materials', field: 'suturesUsed', rows: 2, placeholder: 'e.g. Vicryl 2/0 ×3, PDS 1 ×1' }));
  const g1 = document.createElement('div'); g1.className = 'two-col';
  g1.appendChild(textInput({ label: 'Staples used', section: 'materials', field: 'staplesUsed' }));
  g1.appendChild(textInput({ label: 'Clips used', section: 'materials', field: 'clipsUsed' }));
  card.appendChild(g1);
  const g2 = document.createElement('div'); g2.className = 'two-col';
  g2.appendChild(radioGroup({ label: 'Mesh used?', section: 'materials', field: 'meshUsed', options: yesNo }));
  g2.appendChild(textInput({ label: 'Screws used', section: 'materials', field: 'screwsUsed' }));
  card.appendChild(g2);
  const g3 = document.createElement('div'); g3.className = 'two-col';
  g3.appendChild(textInput({ label: 'Plates used', section: 'materials', field: 'platesUsed' }));
  g3.appendChild(radioGroup({ label: 'Prosthetic joint?', section: 'materials', field: 'prostheticJoint', options: yesNo }));
  card.appendChild(g3);
  card.appendChild(radioGroup({ label: 'Vascular graft placed?', section: 'materials', field: 'vascularGraft', options: yesNo }));

  card.appendChild(subHeading('Implant traceability'));
  const im1 = document.createElement('div'); im1.className = 'two-col';
  im1.appendChild(textInput({ label: 'Lot number', section: 'materials', field: 'implantLot' }));
  im1.appendChild(textInput({ label: 'Serial number', section: 'materials', field: 'implantSerial' }));
  card.appendChild(im1);
  const im2 = document.createElement('div'); im2.className = 'two-col';
  im2.appendChild(textInput({ label: 'Batch number', section: 'materials', field: 'implantBatch' }));
  im2.appendChild(textInput({ label: 'Expiry', section: 'materials', field: 'implantExpiry', type: 'date' }));
  card.appendChild(im2);
  card.appendChild(textInput({ label: 'Manufacturer', section: 'materials', field: 'manufacturer' }));
  card.appendChild(radioGroup({ label: 'Implant registry submitted?', section: 'materials', field: 'registrySubmitted', options: [...yesNo, { value: 'na', label: 'N/A' }] }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Drains, packs & specimens',
    description: 'Drains, packs left in situ, urinary catheter, NG tube, specimens to pathology.'
  });
  card.appendChild(radioGroup({ label: 'Drains placed?', section: 'drains', field: 'drainsPlaced', options: yesNo }));
  const dr = document.createElement('div');
  dr.dataset.conditional = 'drains.drainsPlaced=yes';
  const dr1 = document.createElement('div'); dr1.className = 'two-col';
  dr1.appendChild(textInput({ label: 'Drain site', section: 'drains', field: 'drainSite' }));
  dr1.appendChild(textInput({ label: 'Output target', section: 'drains', field: 'drainOutputTargetMl', type: 'number', min: 0, max: 5000, unit: 'mL/24h' }));
  dr.appendChild(dr1);
  dr.appendChild(textInput({ label: 'Drain removal plan', section: 'drains', field: 'drainRemovalPlan', placeholder: 'e.g. when < 30 mL/24h' }));
  card.appendChild(dr);

  card.appendChild(radioGroup({ label: 'Packs left in situ?', section: 'drains', field: 'packsLeftInSitu', options: yesNo }));
  const pk = document.createElement('div');
  pk.dataset.conditional = 'drains.packsLeftInSitu=yes';
  const pk1 = document.createElement('div'); pk1.className = 'two-col';
  pk1.appendChild(textInput({ label: 'Pack count', section: 'drains', field: 'packCount', type: 'number', min: 0, max: 100 }));
  pk1.appendChild(textInput({ label: 'Removal by date', section: 'drains', field: 'packRemovalByDate', type: 'date' }));
  pk.appendChild(pk1);
  card.appendChild(pk);

  const g = document.createElement('div'); g.className = 'two-col';
  g.appendChild(radioGroup({ label: 'Urinary catheter?', section: 'drains', field: 'urinaryCatheter', options: yesNo }));
  g.appendChild(radioGroup({ label: 'NG tube?', section: 'drains', field: 'ngTube', options: yesNo }));
  card.appendChild(g);

  card.appendChild(radioGroup({ label: 'Specimens sent to pathology?', section: 'drains', field: 'specimensSent', options: yesNo }));
  const sp = document.createElement('div');
  sp.dataset.conditional = 'drains.specimensSent=yes';
  sp.appendChild(textInput({ label: 'Specimen label(s)', section: 'drains', field: 'specimenLabel' }));
  const sp1 = document.createElement('div'); sp1.className = 'two-col';
  sp1.appendChild(textInput({ label: 'Container', section: 'drains', field: 'specimenContainer' }));
  sp1.appendChild(textInput({ label: 'Fixative', section: 'drains', field: 'specimenFixative', placeholder: 'e.g. formalin / fresh' }));
  sp.appendChild(sp1);
  const sp2 = document.createElement('div'); sp2.className = 'two-col';
  sp2.appendChild(textInput({ label: 'Pathology destination', section: 'drains', field: 'specimenDestination' }));
  sp2.appendChild(selectInput({
    label: 'Urgency', section: 'drains', field: 'specimenUrgency',
    options: [{ value: 'urgent', label: 'Urgent' }, { value: 'routine', label: 'Routine' }]
  }));
  sp.appendChild(sp2);
  card.appendChild(sp);
  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Safety, counts, EBL & complications',
    description: 'Swab / needle / instrument counts, estimated blood loss, transfusion, intra-op complications, never-event check.'
  });

  card.appendChild(subHeading('Swab count'));
  const s = document.createElement('div'); s.className = 'three-col';
  s.appendChild(textInput({ label: 'First count', section: 'safety', field: 'swabCountFirst', type: 'number', min: 0, max: 999 }));
  s.appendChild(textInput({ label: 'Final count', section: 'safety', field: 'swabCountFinal', type: 'number', min: 0, max: 999 }));
  s.appendChild(radioGroup({ label: 'Agreed?', section: 'safety', field: 'swabCountAgreed', options: yesNo }));
  card.appendChild(s);

  card.appendChild(subHeading('Needle count'));
  const n = document.createElement('div'); n.className = 'three-col';
  n.appendChild(textInput({ label: 'First count', section: 'safety', field: 'needleCountFirst', type: 'number', min: 0, max: 999 }));
  n.appendChild(textInput({ label: 'Final count', section: 'safety', field: 'needleCountFinal', type: 'number', min: 0, max: 999 }));
  n.appendChild(radioGroup({ label: 'Agreed?', section: 'safety', field: 'needleCountAgreed', options: yesNo }));
  card.appendChild(n);

  card.appendChild(subHeading('Instrument count'));
  const i = document.createElement('div'); i.className = 'three-col';
  i.appendChild(textInput({ label: 'First count', section: 'safety', field: 'instrumentCountFirst', type: 'number', min: 0, max: 999 }));
  i.appendChild(textInput({ label: 'Final count', section: 'safety', field: 'instrumentCountFinal', type: 'number', min: 0, max: 999 }));
  i.appendChild(radioGroup({ label: 'Agreed?', section: 'safety', field: 'instrumentCountAgreed', options: yesNo }));
  card.appendChild(i);

  card.appendChild(textArea({ label: 'Count discrepancy resolution', section: 'safety', field: 'countDiscrepancyResolution', rows: 2 }));

  card.appendChild(subHeading('Blood loss & transfusion'));
  card.appendChild(textInput({ label: 'Estimated blood loss', section: 'safety', field: 'estimatedBloodLossMl', type: 'number', min: 0, max: 30000, unit: 'mL' }));
  const tx = document.createElement('div'); tx.className = 'four-col';
  tx.appendChild(textInput({ label: 'PRBC', section: 'safety', field: 'transfusionPrbcUnits', type: 'number', min: 0, max: 100, unit: 'units' }));
  tx.appendChild(textInput({ label: 'FFP', section: 'safety', field: 'transfusionFfpUnits', type: 'number', min: 0, max: 100, unit: 'units' }));
  tx.appendChild(textInput({ label: 'Platelets', section: 'safety', field: 'transfusionPlateletsUnits', type: 'number', min: 0, max: 100, unit: 'units' }));
  tx.appendChild(textInput({ label: 'Cryoprecipitate', section: 'safety', field: 'transfusionCryoUnits', type: 'number', min: 0, max: 100, unit: 'units' }));
  card.appendChild(tx);
  card.appendChild(radioGroup({ label: 'Massive haemorrhage protocol activated?', section: 'safety', field: 'massiveHaemorrhageProtocolActivated', options: yesNo }));

  card.appendChild(subHeading('Complications'));
  card.appendChild(radioGroup({ label: 'Intra-operative complication?', section: 'safety', field: 'intraOpComplication', options: yesNo }));
  const cmp = document.createElement('div');
  cmp.dataset.conditional = 'safety.intraOpComplication=yes';
  cmp.appendChild(textArea({ label: 'Description', section: 'safety', field: 'complicationDescription', rows: 2 }));
  cmp.appendChild(selectInput({ label: 'Clavien-Dindo grade', section: 'safety', field: 'clavienDindoGrade', options: CLAVIEN_DINDO_OPTIONS }));
  card.appendChild(cmp);

  card.appendChild(radioGroup({ label: 'Never-event flagged?', section: 'safety', field: 'neverEventFlagged', options: yesNo }));
  const ne = document.createElement('div');
  ne.dataset.conditional = 'safety.neverEventFlagged=yes';
  ne.appendChild(selectInput({ label: 'Never-event type', section: 'safety', field: 'neverEventType', options: NEVER_EVENT_OPTIONS }));
  card.appendChild(ne);

  const g = document.createElement('div'); g.className = 'two-col';
  g.appendChild(radioGroup({ label: 'Retained item suspected?', section: 'safety', field: 'retainedItemSuspected', options: yesNo }));
  g.appendChild(radioGroup({ label: 'Conversion to open?', section: 'safety', field: 'conversionToOpen', options: [...yesNo, { value: 'na', label: 'N/A' }] }));
  card.appendChild(g);

  const g2 = document.createElement('div'); g2.className = 'two-col';
  g2.appendChild(radioGroup({ label: 'Intra-op cardiac/resp arrest?', section: 'safety', field: 'intraOpArrest', options: yesNo }));
  g2.appendChild(radioGroup({ label: 'Equipment problem?', section: 'safety', field: 'equipmentProblem', options: yesNo }));
  card.appendChild(g2);
  card.appendChild(radioGroup({ label: 'Sterility breach?', section: 'safety', field: 'sterilityBreach', options: yesNo }));
  return card;
}

function renderStep11() {
  const card = sectionCard({
    stepNumber: 11,
    title: 'Post-operative plan',
    description: 'Recovery destination, monitoring, fluids, analgesia, antibiotics, VTE, debrief.'
  });
  const g = document.createElement('div'); g.className = 'two-col';
  g.appendChild(selectInput({ label: 'Pre-op planned destination', section: 'postOp', field: 'preOpPlannedDestination', options: DESTINATION_OPTIONS }));
  g.appendChild(selectInput({ label: 'Actual recovery destination', section: 'postOp', field: 'recoveryDestination', options: DESTINATION_OPTIONS }));
  card.appendChild(g);

  card.appendChild(textInput({ label: 'Monitoring frequency', section: 'postOp', field: 'monitoringFrequency', placeholder: 'e.g. obs q15 min for 2 h, then q1 h' }));
  card.appendChild(textArea({ label: 'IV fluids plan', section: 'postOp', field: 'ivFluidsPlan', rows: 2 }));
  card.appendChild(textArea({ label: 'Analgesia plan', section: 'postOp', field: 'analgesiaPlan', rows: 2 }));
  card.appendChild(textArea({ label: 'Antibiotics plan', section: 'postOp', field: 'antibioticsPlan', rows: 2 }));
  card.appendChild(textArea({ label: 'VTE prophylaxis plan', section: 'postOp', field: 'vteProphylaxisPlan', rows: 2 }));

  const g2 = document.createElement('div'); g2.className = 'two-col';
  g2.appendChild(textInput({ label: 'Diet plan', section: 'postOp', field: 'dietPlan' }));
  g2.appendChild(textInput({ label: 'Mobilisation plan', section: 'postOp', field: 'mobilisationPlan' }));
  card.appendChild(g2);

  card.appendChild(textArea({ label: 'Wound care plan', section: 'postOp', field: 'woundCarePlan', rows: 2 }));
  card.appendChild(textInput({ label: 'Drain removal plan', section: 'postOp', field: 'drainRemovalPlan' }));
  card.appendChild(textArea({ label: 'Follow-up plan', section: 'postOp', field: 'followUpPlan', rows: 2 }));
  card.appendChild(textArea({ label: 'Special instructions', section: 'postOp', field: 'specialInstructions', rows: 2 }));

  const g3 = document.createElement('div'); g3.className = 'two-col';
  g3.appendChild(radioGroup({ label: 'WHO Sign-Out completed?', section: 'postOp', field: 'whoSignOutCompleted', options: yesNo }));
  g3.appendChild(radioGroup({ label: 'Team debrief completed?', section: 'postOp', field: 'debriefCompleted', options: yesNo }));
  card.appendChild(g3);
  return card;
}

function renderStep12() {
  const card = sectionCard({
    stepNumber: 12,
    title: 'Summary, grade & sign-off',
    description: 'Carry-over ASA, optional surgeon override, attestation, and electronic signature.'
  });

  card.appendChild(selectInput({
    label: 'ASA Physical Status (carry-over from pre-op)',
    section: 'summary', field: 'asaPhysicalStatus', numeric: true, options: ASA_OPTIONS
  }));

  card.appendChild(subHeading('Surgeon override (optional)'));
  card.appendChild(selectInput({
    label: 'Override composite risk grade',
    section: 'summary', field: 'surgeonOverrideGrade', options: COMPOSITE_RISK_OPTIONS
  }));
  card.appendChild(textArea({
    label: 'Override reason (required when overriding)',
    section: 'summary', field: 'surgeonOverrideReason', rows: 2
  }));

  card.appendChild(subHeading('Attestation'));
  card.appendChild(textArea({
    label: 'Final attestation',
    section: 'summary', field: 'finalAttestation', rows: 3,
    placeholder: 'I confirm this op note is a true and contemporaneous record of the procedure performed.'
  }));
  card.appendChild(textInput({
    label: 'Electronic signature (typed full name)',
    section: 'summary', field: 'electronicSignature', required: true
  }));
  card.appendChild(textInput({
    label: 'Dictation timestamp',
    section: 'summary', field: 'dictationTimestamp', type: 'datetime-local'
  }));
  return card;
}

const STEP_RENDERERS = [
  renderStep1, renderStep2, renderStep3, renderStep4,
  renderStep5, renderStep6, renderStep7, renderStep8,
  renderStep9, renderStep10, renderStep11, renderStep12
];

// ----------------------------------------------------------------------
// Conditional sections
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, field] = path.split('.');
    const current = String(state[section]?.[field] ?? '');
    host.style.display = current === target ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  // 1
  ['operation', 'hospital'], ['operation', 'theatreNumber'], ['operation', 'listType'],
  ['operation', 'operationDate'], ['operation', 'caseStartTime'],
  ['operation', 'knifeToSkinTime'], ['operation', 'endOfSurgeryTime'],
  // 2
  ['patient', 'nhsNumber'], ['patient', 'firstName'], ['patient', 'lastName'],
  ['patient', 'dateOfBirth'], ['patient', 'sex'], ['patient', 'consentStatus'],
  ['patient', 'sideMarked'], ['patient', 'whoSignInCompleted'],
  // 3
  ['team', 'leadSurgeonName'], ['team', 'anaesthetistName'],
  ['team', 'scrubNurse'], ['team', 'circulatingNurse'],
  // 4
  ['diagnoses', 'preOperativeDiagnosis'], ['diagnoses', 'postOperativeDiagnosis'],
  ['diagnoses', 'procedurePerformed'], ['diagnoses', 'urgency'],
  ['diagnoses', 'laterality'],
  // 5
  ['anaesthesia', 'type'], ['anaesthesia', 'airway'], ['anaesthesia', 'anaestheticEvent'],
  // 6
  ['approach', 'patientPosition'], ['approach', 'prepSolution'],
  ['approach', 'surgicalApproach'], ['approach', 'incisionType'],
  ['approach', 'tourniquetUsed'],
  // 7
  ['findings', 'techniqueSteps'], ['findings', 'pathologyFound'],
  ['findings', 'photographsTaken'], ['findings', 'frozenSectionRequested'],
  // 8
  ['materials', 'suturesUsed'], ['materials', 'meshUsed'],
  ['materials', 'prostheticJoint'], ['materials', 'vascularGraft'],
  ['materials', 'registrySubmitted'],
  // 9
  ['drains', 'drainsPlaced'], ['drains', 'packsLeftInSitu'],
  ['drains', 'urinaryCatheter'], ['drains', 'ngTube'], ['drains', 'specimensSent'],
  // 10
  ['safety', 'swabCountAgreed'], ['safety', 'needleCountAgreed'],
  ['safety', 'instrumentCountAgreed'], ['safety', 'estimatedBloodLossMl'],
  ['safety', 'intraOpComplication'], ['safety', 'neverEventFlagged'],
  ['safety', 'retainedItemSuspected'], ['safety', 'conversionToOpen'],
  ['safety', 'intraOpArrest'],
  // 11
  ['postOp', 'preOpPlannedDestination'], ['postOp', 'recoveryDestination'],
  ['postOp', 'monitoringFrequency'], ['postOp', 'analgesiaPlan'],
  ['postOp', 'vteProphylaxisPlan'], ['postOp', 'whoSignOutCompleted'],
  ['postOp', 'debriefCompleted'],
  // 12
  ['summary', 'asaPhysicalStatus'], ['summary', 'finalAttestation'],
  ['summary', 'electronicSignature']
];

function updateProgress() {
  let answered = 0;
  const sectionAnswered = {};
  const sectionTotal = {};
  for (const [section, field] of TRACKED_FIELDS) {
    sectionTotal[section] = (sectionTotal[section] || 0) + 1;
    const v = state[section][field];
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
  { step: 1,  section: 'operation',  title: 'Operation' },
  { step: 2,  section: 'patient',    title: 'Patient' },
  { step: 3,  section: 'team',       title: 'Team' },
  { step: 4,  section: 'diagnoses',  title: 'Dx + Proc' },
  { step: 5,  section: 'anaesthesia',title: 'Anaesthesia' },
  { step: 6,  section: 'approach',   title: 'Position + Approach' },
  { step: 7,  section: 'findings',   title: 'Findings' },
  { step: 8,  section: 'materials',  title: 'Materials' },
  { step: 9,  section: 'drains',     title: 'Drains + Specimens' },
  { step: 10, section: 'safety',     title: 'Safety + EBL' },
  { step: 11, section: 'postOp',     title: 'Post-op plan' },
  { step: 12, section: 'summary',    title: 'Summary + Sign-off' }
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
  const form = document.getElementById('operation-note-form');
  if (!form) return errors;
  const required = form.querySelectorAll('[data-required]');
  required.forEach((input) => {
    const id = input.id;
    const value = (input.value || '').trim();
    if (!value) {
      const labelEl = form.querySelector(`label[for="${id}"]`);
      const label = labelEl ? labelEl.textContent.replace(/\s*\*\s*$/, '').trim() : id;
      errors.push({ id, message: `${label} is required` });
      setFieldError(id, `${label} is required`);
    } else {
      clearFieldError(id);
    }
  });

  // Cross-field: surgeon override grade requires a reason
  if (state.summary.surgeonOverrideGrade && !state.summary.surgeonOverrideReason.trim()) {
    const id = 'summary-surgeonOverrideReason';
    errors.push({ id, message: 'Override reason is required when overriding the computed grade' });
    setFieldError(id, 'Override reason is required when overriding the computed grade');
  }

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
// Submit
// ----------------------------------------------------------------------

function submitForm() {
  const errors = validateForm();
  if (errors.length > 0) return;
  const result = calculateOperationGrade(state);
  lastResult = { ...result, timestamp: new Date().toISOString(), data: state };
  if (typeof renderReport === 'function') {
    renderReport(lastResult, { onStartOver: startOver });
  }
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh op note?')) return;
  clearState();
  state = emptyOperationNote();
  lastResult = null;
  const report = document.getElementById('report');
  if (report) report.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
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
  for (const r of STEP_RENDERERS) host.appendChild(r());
}

function init() {
  renderStepList();
  renderForm();
  updateProgress();
  updateConditionalSections();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

// Expose state for the report renderer (it needs the full data object).
export const getState = () => state;
export const getLastResult = () => lastResult;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
