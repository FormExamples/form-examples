// WHO Surgical Safety Checklist — single-page form controller (vanilla JS).
//
// Renders five fieldset sections (Case details, Sign In, Time Out, Sign Out,
// Summary) into the #form-sections host, wires up navigation via the
// step-list table of contents, persists state to localStorage on every
// change, validates required fields on submit, and renders an inline report
// with computed safety flags and JSON / XML / CSV / TSV / Print exports.
//
// Sibling files loaded as plain <script> tags (in order) attach their public
// API to `window.WhoSurgicalSafetyChecklist`. The whole file is wrapped in an
// IIFE so its locals do not leak to the global scope.

(function () {
'use strict';

const NS = window.WhoSurgicalSafetyChecklist;
const {
  emptyChecklist,
  emptyTeamMember,
  deriveStatus,
  isSignInComplete,
  isTimeOutComplete,
  isSignOutComplete,
  statusLabel,
  computeFlags,
  toJson,
  toXml,
  toCsv,
  toTsv,
  toPrintableHtml,
  download,
  openPrintable
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'who-surgical-safety-checklist-draft';
const TOTAL_STEPS = 5;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyChecklist();
    const parsed = JSON.parse(raw);
    return mergeIntoEmpty(parsed);
  } catch (e) {
    console.warn('Could not parse saved checklist; starting fresh.', e);
    return emptyChecklist();
  }
}

function mergeIntoEmpty(parsed) {
  const fresh = emptyChecklist();
  if (!parsed || typeof parsed !== 'object') return fresh;
  for (const key of Object.keys(fresh)) {
    const v = parsed[key];
    if (Array.isArray(fresh[key])) {
      fresh[key] = Array.isArray(v) ? v.map((row) => ({
        ...emptyTeamMember(),
        ...(row || {})
      })) : [];
    } else if (fresh[key] && typeof fresh[key] === 'object') {
      fresh[key] = { ...fresh[key], ...(v && typeof v === 'object' ? v : {}) };
    }
  }
  return fresh;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save checklist to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored checklist.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

let state = loadState();
/** Last grading result rendered into the report region. */
let lastResult = null;

function setField(section, field, value) {
  state[section][field] = value;
  saveState();
  updateProgress();
}

function setTeamMemberField(index, field, value) {
  if (!state.teamMembers[index]) return;
  state.teamMembers[index][field] = value;
  saveState();
  updateProgress();
}

function addTeamMember() {
  state.teamMembers.push(emptyTeamMember());
  saveState();
  renderTeamRoster();
  updateProgress();
}

function removeTeamMember(index) {
  state.teamMembers.splice(index, 1);
  saveState();
  renderTeamRoster();
  updateProgress();
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ----------------------------------------------------------------------
// Component builders (Lily HTML headless contract)
// ----------------------------------------------------------------------

function lilyInputClass(type) {
  switch (type) {
    case 'email':           return 'email-input';
    case 'number':          return 'number-input';
    case 'date':            return 'date-input';
    case 'time':            return 'time-input';
    case 'datetime-local':  return 'datetime-input';
    case 'tel':             return 'tel-input';
    case 'url':             return 'url-input';
    case 'search':          return 'search-input';
    default:                return 'text-input';
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
    setField(opts.section, opts.field, sel.value);
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
    <span class="section-step">Section ${opts.stepNumber} of ${TOTAL_STEPS}</span>
    <h2 class="section-title">${esc(opts.title)}</h2>
    ${desc}
  `;
  card.appendChild(legend);
  return card;
}

/** Wrap a child element/elements in a numbered checklist-item card. */
function checklistItem(num, text, child) {
  const card = document.createElement('div');
  card.className = 'checklist-item';
  card.innerHTML = `
    <div class="checklist-item-header">
      <span class="checklist-item-num">${esc(num)}.</span>
      <span class="checklist-item-text">${esc(text)}</span>
    </div>
  `;
  if (Array.isArray(child)) {
    child.forEach((c) => card.appendChild(c));
  } else if (child) {
    card.appendChild(child);
  }
  return card;
}

// ----------------------------------------------------------------------
// Common option lists
// ----------------------------------------------------------------------

const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const YES_ONLY = [
  { value: 'yes', label: 'Yes — confirmed' }
];

const YES_NA = [
  { value: 'yes', label: 'Yes' },
  { value: 'not-applicable', label: 'Not applicable' }
];

const YES_NO_NA = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-applicable', label: 'Not applicable' }
];

const URGENCY_OPTIONS = [
  { value: 'elective', label: 'Elective' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'immediate', label: 'Immediate' }
];

const LATERALITY_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'bilateral', label: 'Bilateral' },
  { value: 'midline', label: 'Midline' },
  { value: 'na', label: 'Not applicable' }
];

const SURGICAL_SPECIALTY_OPTIONS = [
  { value: 'general-surgery', label: 'General surgery' },
  { value: 'orthopaedics', label: 'Orthopaedics' },
  { value: 'cardiothoracic', label: 'Cardiothoracic' },
  { value: 'neurosurgery', label: 'Neurosurgery' },
  { value: 'vascular', label: 'Vascular' },
  { value: 'plastics', label: 'Plastics / reconstructive' },
  { value: 'ent', label: 'ENT' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
  { value: 'urology', label: 'Urology' },
  { value: 'gynaecology', label: 'Gynaecology / obstetrics' },
  { value: 'paediatric-surgery', label: 'Paediatric surgery' },
  { value: 'maxillofacial', label: 'Maxillofacial' },
  { value: 'dental', label: 'Dental' },
  { value: 'other', label: 'Other' }
];

const TEAM_ROLE_OPTIONS = [
  { value: 'surgeon', label: 'Surgeon' },
  { value: 'assistant-surgeon', label: 'Assistant surgeon' },
  { value: 'anaesthetist', label: 'Anaesthetist' },
  { value: 'circulating-nurse', label: 'Circulating nurse' },
  { value: 'scrub-nurse', label: 'Scrub nurse' },
  { value: 'anaesthetic-assistant', label: 'Anaesthetic assistant' },
  { value: 'perfusionist', label: 'Perfusionist' },
  { value: 'technician', label: 'Technician' },
  { value: 'observer', label: 'Observer' },
  { value: 'other', label: 'Other' }
];

// ----------------------------------------------------------------------
// Coordinator sign-off block (shared by Sign In / Time Out / Sign Out)
// ----------------------------------------------------------------------

function coordinatorBlock(section, headingText) {
  const wrapper = document.createElement('div');
  wrapper.className = 'coordinator-block';

  const h = document.createElement('h3');
  h.textContent = headingText;
  wrapper.appendChild(h);

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    section, field: 'coordinatorName',
    label: 'Coordinator name'
  }));
  grid.appendChild(textInput({
    section, field: 'coordinatorRole',
    label: 'Coordinator role', placeholder: 'e.g., circulating nurse'
  }));
  wrapper.appendChild(grid);

  const stampWrap = document.createElement('div');
  stampWrap.className = 'field';
  const stampId = `${section}-completedAt`;
  stampWrap.innerHTML = `
    <label class="label" for="${stampId}">Sign-off timestamp</label>
    <div class="stamp-row">
      <input type="datetime-local" id="${stampId}" class="datetime-input"
             value="${esc(state[section].completedAt || '')}"
             aria-describedby="${stampId}-error">
      <button type="button" class="button" data-variant="secondary" data-stamp-now="${section}">
        Stamp now
      </button>
    </div>
    <span class="error-message" id="${stampId}-error"></span>
  `;
  const input = stampWrap.querySelector('input');
  input.addEventListener('input', () => {
    setField(section, 'completedAt', input.value);
    clearFieldError(stampId);
  });
  const btn = stampWrap.querySelector('button');
  btn.addEventListener('click', () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const iso =
      now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) +
      'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
    input.value = iso;
    setField(section, 'completedAt', iso);
    clearFieldError(stampId);
  });
  wrapper.appendChild(stampWrap);

  return wrapper;
}

// ----------------------------------------------------------------------
// Step 1 — Case details
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Case details',
    description: 'Identify the patient, operating team, site, and procedure. Captured once per case.'
  });

  const patientHeader = document.createElement('h3');
  patientHeader.className = 'subsection-heading';
  patientHeader.textContent = 'Patient';
  card.appendChild(patientHeader);

  const patientGrid = document.createElement('div');
  patientGrid.className = 'two-col';
  patientGrid.appendChild(textInput({
    section: 'caseDetails', field: 'patientName',
    label: 'Patient name', required: true
  }));
  patientGrid.appendChild(textInput({
    section: 'caseDetails', field: 'patientBirthDate',
    label: 'Date of birth', type: 'date'
  }));
  patientGrid.appendChild(textInput({
    section: 'caseDetails', field: 'patientNhsNumber',
    label: 'NHS number', placeholder: '000 000 0000'
  }));
  patientGrid.appendChild(textInput({
    section: 'caseDetails', field: 'patientMedicalRecordNumber',
    label: 'Medical record number (MRN)'
  }));
  patientGrid.appendChild(textInput({
    section: 'caseDetails', field: 'patientWeightKg',
    label: 'Weight', type: 'number', min: 0, max: 400, step: '0.1',
    unit: 'kg'
  }));
  patientGrid.appendChild(radioGroup({
    section: 'caseDetails', field: 'isPaediatric',
    label: 'Paediatric patient?',
    options: YES_NO
  }));
  card.appendChild(patientGrid);

  const teamHeader = document.createElement('h3');
  teamHeader.className = 'subsection-heading';
  teamHeader.textContent = 'Lead operating team';
  card.appendChild(teamHeader);

  const teamGrid = document.createElement('div');
  teamGrid.className = 'three-col';
  teamGrid.appendChild(textInput({
    section: 'caseDetails', field: 'surgeonName',
    label: 'Lead surgeon'
  }));
  teamGrid.appendChild(textInput({
    section: 'caseDetails', field: 'anaesthetistName',
    label: 'Lead anaesthetist'
  }));
  teamGrid.appendChild(textInput({
    section: 'caseDetails', field: 'leadNurseName',
    label: 'Lead nurse (coordinator)'
  }));
  card.appendChild(teamGrid);

  const siteHeader = document.createElement('h3');
  siteHeader.className = 'subsection-heading';
  siteHeader.textContent = 'Site and timing';
  card.appendChild(siteHeader);

  const siteGrid = document.createElement('div');
  siteGrid.className = 'three-col';
  siteGrid.appendChild(textInput({
    section: 'caseDetails', field: 'siteName',
    label: 'Facility / site'
  }));
  siteGrid.appendChild(textInput({
    section: 'caseDetails', field: 'operatingRoom',
    label: 'Operating room'
  }));
  siteGrid.appendChild(textInput({
    section: 'caseDetails', field: 'caseDate',
    label: 'Case date', type: 'date'
  }));
  card.appendChild(siteGrid);

  const procHeader = document.createElement('h3');
  procHeader.className = 'subsection-heading';
  procHeader.textContent = 'Procedure';
  card.appendChild(procHeader);

  card.appendChild(textInput({
    section: 'caseDetails', field: 'plannedProcedure',
    label: 'Planned procedure', required: true,
    placeholder: 'e.g., laparoscopic cholecystectomy'
  }));
  card.appendChild(selectInput({
    section: 'caseDetails', field: 'surgicalSpecialty',
    label: 'Surgical specialty',
    options: SURGICAL_SPECIALTY_OPTIONS
  }));
  card.appendChild(radioGroup({
    section: 'caseDetails', field: 'urgency',
    label: 'Urgency (NCEPOD)',
    options: URGENCY_OPTIONS,
    required: true
  }));
  card.appendChild(radioGroup({
    section: 'caseDetails', field: 'laterality',
    label: 'Laterality',
    options: LATERALITY_OPTIONS,
    required: true
  }));

  return card;
}

// ----------------------------------------------------------------------
// Step 2 — Sign In (before induction of anaesthesia)
// ----------------------------------------------------------------------

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Phase 1 — Sign In',
    description: 'Complete before induction of anaesthesia. Required participants: nurse and anaesthetist.'
  });

  card.appendChild(checklistItem(1,
    'Has the patient confirmed his/her identity, site, procedure, and consent?',
    radioGroup({
      section: 'signIn', field: 'identitySiteProcedureConsent',
      label: 'Identity, site, procedure, consent confirmed',
      options: YES_ONLY, required: true
    })
  ));

  card.appendChild(checklistItem(2,
    'Is the surgical site marked?',
    radioGroup({
      section: 'signIn', field: 'siteMarked',
      label: 'Site marking',
      options: YES_NA, required: true
    })
  ));

  card.appendChild(checklistItem(3,
    'Is the anaesthesia machine and medication check complete?',
    radioGroup({
      section: 'signIn', field: 'anaesthesiaCheckComplete',
      label: 'Anaesthesia check complete',
      options: YES_ONLY, required: true
    })
  ));

  card.appendChild(checklistItem(4,
    'Is the pulse oximeter on the patient and functioning?',
    radioGroup({
      section: 'signIn', field: 'pulseOximeterOnPatient',
      label: 'Pulse oximeter on and functioning',
      options: YES_ONLY, required: true
    })
  ));

  card.appendChild(checklistItem(5,
    'Does the patient have a known allergy?',
    [
      radioGroup({
        section: 'signIn', field: 'knownAllergy',
        label: 'Known allergy',
        options: YES_NO, required: true
      }),
      textArea({
        section: 'signIn', field: 'knownAllergyDetail',
        label: 'Allergy detail (if yes)',
        rows: 2,
        placeholder: 'Substance, reaction, severity'
      })
    ]
  ));

  card.appendChild(checklistItem(6,
    'Difficult airway or aspiration risk?',
    radioGroup({
      section: 'signIn', field: 'difficultAirwayAspirationRisk',
      label: 'Difficult airway / aspiration risk',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes-equipment-available',
          label: 'Yes — and equipment / assistance available' }
      ],
      required: true
    })
  ));

  card.appendChild(checklistItem(7,
    'Risk of > 500 ml blood loss (7 ml/kg in children)?',
    radioGroup({
      section: 'signIn', field: 'bloodLossRisk',
      label: 'Blood-loss risk',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes-two-ivs-and-fluids-planned',
          label: 'Yes — two IVs / central access and fluids planned' }
      ],
      required: true
    })
  ));

  card.appendChild(coordinatorBlock('signIn', 'Sign In sign-off'));
  return card;
}

// ----------------------------------------------------------------------
// Step 3 — Time Out (before skin incision) + team roster
// ----------------------------------------------------------------------

let teamRosterHost = null;

function renderTeamRoster() {
  if (!teamRosterHost) return;
  teamRosterHost.innerHTML = '';

  if (state.teamMembers.length === 0) {
    const p = document.createElement('p');
    p.className = 'list-empty';
    p.textContent = 'No team members added yet. Use “Add team member” below.';
    teamRosterHost.appendChild(p);
  }

  state.teamMembers.forEach((row, idx) => {
    const r = document.createElement('div');
    r.className = 'list-row team-row';

    const grid = document.createElement('div');
    grid.className = 'list-grid team-grid';

    // Name
    const nameCell = document.createElement('label');
    nameCell.className = 'list-cell';
    nameCell.innerHTML = `
      <span>Name</span>
      <input type="text" class="text-input"
             value="${esc(row.name)}"
             placeholder="Name">
    `;
    nameCell.querySelector('input').addEventListener('input', (e) =>
      setTeamMemberField(idx, 'name', e.target.value));
    grid.appendChild(nameCell);

    // Role
    const roleCell = document.createElement('label');
    roleCell.className = 'list-cell';
    const roleOpts = [`<option value="">— Role —</option>`,
      ...TEAM_ROLE_OPTIONS.map((o) =>
        `<option value="${esc(o.value)}"${o.value === row.role ? ' selected' : ''}>${esc(o.label)}</option>`)
    ].join('');
    roleCell.innerHTML = `
      <span>Role</span>
      <select class="select">${roleOpts}</select>
    `;
    roleCell.querySelector('select').addEventListener('change', (e) =>
      setTeamMemberField(idx, 'role', e.target.value));
    grid.appendChild(roleCell);

    // Introduced?
    const introCell = document.createElement('label');
    introCell.className = 'list-cell';
    const introOpts = [`<option value="">—</option>`,
      ...YES_NO.map((o) =>
        `<option value="${esc(o.value)}"${o.value === row.introducedDuringTimeOut ? ' selected' : ''}>${esc(o.label)}</option>`)
    ].join('');
    introCell.innerHTML = `
      <span>Introduced?</span>
      <select class="select">${introOpts}</select>
    `;
    introCell.querySelector('select').addEventListener('change', (e) =>
      setTeamMemberField(idx, 'introducedDuringTimeOut', e.target.value));
    grid.appendChild(introCell);

    // Notes
    const notesCell = document.createElement('label');
    notesCell.className = 'list-cell';
    notesCell.innerHTML = `
      <span>Notes</span>
      <input type="text" class="text-input"
             value="${esc(row.notes)}"
             placeholder="Trainee, observer, etc.">
    `;
    notesCell.querySelector('input').addEventListener('input', (e) =>
      setTeamMemberField(idx, 'notes', e.target.value));
    grid.appendChild(notesCell);

    // Remove
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'button';
    removeBtn.setAttribute('data-variant', 'icon');
    removeBtn.setAttribute('aria-label', `Remove team member ${idx + 1}`);
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => removeTeamMember(idx));
    grid.appendChild(removeBtn);

    r.appendChild(grid);
    teamRosterHost.appendChild(r);
  });
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Phase 2 — Time Out',
    description: 'Complete before skin incision. Required participants: nurse, anaesthetist, surgeon.'
  });

  // Item 1 — team introductions
  card.appendChild(checklistItem(1,
    'Confirm all team members have introduced themselves by name and role.',
    radioGroup({
      section: 'timeOut', field: 'teamIntroductionsConfirmed',
      label: 'Team introductions complete',
      options: YES_ONLY, required: true
    })
  ));

  // Team roster
  const rosterCard = document.createElement('div');
  rosterCard.className = 'list-editor team-roster';
  const rh = document.createElement('h3');
  rh.className = 'subsection-heading';
  rh.textContent = 'Operating-team roster';
  rosterCard.appendChild(rh);

  teamRosterHost = document.createElement('div');
  rosterCard.appendChild(teamRosterHost);

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'button';
  addBtn.setAttribute('data-variant', 'add');
  addBtn.textContent = '+ Add team member';
  addBtn.addEventListener('click', addTeamMember);
  rosterCard.appendChild(addBtn);

  card.appendChild(rosterCard);
  renderTeamRoster();

  card.appendChild(checklistItem(2,
    'Confirm the patient\u2019s name, procedure, and where the incision will be made.',
    radioGroup({
      section: 'timeOut', field: 'patientProcedureIncisionConfirmed',
      label: 'Patient, procedure, incision confirmed',
      options: YES_ONLY, required: true
    })
  ));

  card.appendChild(checklistItem(3,
    'Has antibiotic prophylaxis been given within the last 60 minutes?',
    radioGroup({
      section: 'timeOut', field: 'antibioticProphylaxisWithin60Min',
      label: 'Antibiotic prophylaxis',
      options: YES_NA, required: true
    })
  ));

  card.appendChild(checklistItem(4,
    'Anticipated critical events — Surgeon: critical or non-routine steps?',
    textArea({
      section: 'timeOut', field: 'surgeonCriticalSteps',
      label: 'Critical or non-routine steps',
      rows: 2
    })
  ));

  const surgGrid = document.createElement('div');
  surgGrid.className = 'two-col';
  surgGrid.appendChild(textInput({
    section: 'timeOut', field: 'surgeonCaseDurationMinutes',
    label: '5. Surgeon: anticipated case duration',
    type: 'number', min: 0, max: 1440, step: 1, unit: 'minutes'
  }));
  surgGrid.appendChild(textInput({
    section: 'timeOut', field: 'surgeonAnticipatedBloodLossMl',
    label: '6. Surgeon: anticipated blood loss',
    type: 'number', min: 0, max: 20000, step: 10, unit: 'ml'
  }));
  card.appendChild(surgGrid);

  card.appendChild(checklistItem(7,
    'Anticipated critical events — Anaesthetist: patient-specific concerns?',
    textArea({
      section: 'timeOut', field: 'anaesthetistPatientConcerns',
      label: 'Patient-specific anaesthesia concerns',
      rows: 2
    })
  ));

  card.appendChild(checklistItem(8,
    'Nursing team: has sterility (including indicator results) been confirmed?',
    radioGroup({
      section: 'timeOut', field: 'nursingSterilityConfirmed',
      label: 'Sterility confirmed',
      options: YES_ONLY, required: true
    })
  ));

  card.appendChild(checklistItem(9,
    'Nursing team: are there equipment issues or any concerns?',
    textArea({
      section: 'timeOut', field: 'nursingEquipmentConcerns',
      label: 'Equipment concerns',
      rows: 2
    })
  ));

  card.appendChild(checklistItem(10,
    'Is essential imaging displayed?',
    radioGroup({
      section: 'timeOut', field: 'essentialImagingDisplayed',
      label: 'Essential imaging displayed',
      options: YES_NA, required: true
    })
  ));

  card.appendChild(coordinatorBlock('timeOut', 'Time Out sign-off'));
  return card;
}

// ----------------------------------------------------------------------
// Step 4 — Sign Out (before patient leaves the OR)
// ----------------------------------------------------------------------

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Phase 3 — Sign Out',
    description: 'Complete before the patient leaves the operating room. Required participants: nurse, anaesthetist, surgeon.'
  });

  card.appendChild(checklistItem(1,
    'Nurse verbally confirms: name of the procedure recorded.',
    radioGroup({
      section: 'signOut', field: 'procedureNameConfirmed',
      label: 'Procedure name confirmed',
      options: YES_ONLY, required: true
    })
  ));

  card.appendChild(checklistItem(2,
    'Nurse verbally confirms: instrument, sponge, and needle counts.',
    radioGroup({
      section: 'signOut', field: 'countsConfirmed',
      label: 'Counts confirmed',
      options: YES_NO, required: true
    })
  ));

  card.appendChild(checklistItem(3,
    'Nurse verbally confirms: specimen labelling (read aloud, including patient name).',
    radioGroup({
      section: 'signOut', field: 'specimensLabelled',
      label: 'Specimens labelled',
      options: YES_NO_NA, required: true
    })
  ));

  card.appendChild(checklistItem(4,
    'Nurse verbally confirms: any equipment problems to be addressed.',
    textArea({
      section: 'signOut', field: 'equipmentProblems',
      label: 'Equipment problems',
      rows: 2
    })
  ));

  card.appendChild(checklistItem(5,
    'To surgeon, anaesthetist, and nurse: key concerns for recovery and management of this patient.',
    textArea({
      section: 'signOut', field: 'recoveryConcerns',
      label: 'Recovery and management concerns',
      rows: 2
    })
  ));

  card.appendChild(coordinatorBlock('signOut', 'Sign Out sign-off'));
  return card;
}

// ----------------------------------------------------------------------
// Step 5 — Summary (abandon-case + exports)
// ----------------------------------------------------------------------

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Summary and export',
    description: 'Record any case abandonment reason and export the case file.'
  });

  // Abandon-case
  const abandonHeader = document.createElement('h3');
  abandonHeader.className = 'subsection-heading';
  abandonHeader.textContent = 'Abandon case (if applicable)';
  card.appendChild(abandonHeader);

  card.appendChild(textArea({
    section: 'summary', field: 'abandonedReason',
    label: 'Reason the case was abandoned (leave blank if completed normally)',
    rows: 2,
    placeholder: 'e.g., patient cancelled, equipment failure, deteriorating condition'
  }));

  // Export buttons
  const exportHeader = document.createElement('h3');
  exportHeader.className = 'subsection-heading';
  exportHeader.textContent = 'Export';
  card.appendChild(exportHeader);

  const exportHint = document.createElement('p');
  exportHint.className = 'hint';
  exportHint.textContent =
    'Download the case record in the format most useful for your downstream system, or open a printable summary.';
  card.appendChild(exportHint);

  const exportSection = document.createElement('div');
  exportSection.className = 'export-actions';
  exportSection.innerHTML = `
    <button type="button" class="button" data-variant="secondary" data-export="json">Download JSON</button>
    <button type="button" class="button" data-variant="secondary" data-export="xml">Download XML</button>
    <button type="button" class="button" data-variant="secondary" data-export="csv">Download CSV</button>
    <button type="button" class="button" data-variant="secondary" data-export="tsv">Download TSV</button>
    <button type="button" class="button" data-variant="primary" data-export="print">Open printable summary</button>
  `;
  card.appendChild(exportSection);

  exportSection.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-export]');
    if (!btn) return;
    handleExport(btn.dataset.export);
  });

  return card;
}

function handleExport(kind) {
  const status = deriveStatus(state);
  const flags = computeFlags(state);
  const basename = exportBasename();

  switch (kind) {
    case 'json':
      download(`${basename}.json`, toJson(state, status, flags),
        'application/json');
      break;
    case 'xml':
      download(`${basename}.xml`, toXml(state, status, flags),
        'application/xml');
      break;
    case 'csv':
      download(`${basename}.csv`, toCsv(state, status, flags),
        'text/csv');
      break;
    case 'tsv':
      download(`${basename}.tsv`, toTsv(state, status, flags),
        'text/tab-separated-values');
      break;
    case 'print':
      openPrintable(toPrintableHtml(state, status, flags));
      break;
  }
}

function exportBasename() {
  const date = state.caseDetails.caseDate || new Date().toISOString().slice(0, 10);
  const name = (state.caseDetails.patientName || 'case')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'case';
  return `who-surgical-safety-${date}-${name}`;
}

// ----------------------------------------------------------------------
// Step renderers and definitions
// ----------------------------------------------------------------------

const STEP_RENDERERS = [
  renderStep1, renderStep2, renderStep3, renderStep4, renderStep5
];

const STEP_DEFINITIONS = [
  { step: 1, section: 'caseDetails', title: 'Case details' },
  { step: 2, section: 'signIn',      title: 'Sign In' },
  { step: 3, section: 'timeOut',     title: 'Time Out' },
  { step: 4, section: 'signOut',     title: 'Sign Out' },
  { step: 5, section: 'summary',     title: 'Summary' }
];

// ----------------------------------------------------------------------
// Progress (answered fields / total) + per-section tallies for step-list
// ----------------------------------------------------------------------

// Stable list of required-ish fields counted for the progress bar.
const TRACKED_FIELDS = [
  // Case details
  ['caseDetails', 'patientName'],
  ['caseDetails', 'plannedProcedure'],
  ['caseDetails', 'urgency'],
  ['caseDetails', 'laterality'],
  // Sign In
  ['signIn', 'identitySiteProcedureConsent'],
  ['signIn', 'siteMarked'],
  ['signIn', 'anaesthesiaCheckComplete'],
  ['signIn', 'pulseOximeterOnPatient'],
  ['signIn', 'knownAllergy'],
  ['signIn', 'difficultAirwayAspirationRisk'],
  ['signIn', 'bloodLossRisk'],
  ['signIn', 'coordinatorName'],
  ['signIn', 'completedAt'],
  // Time Out
  ['timeOut', 'teamIntroductionsConfirmed'],
  ['timeOut', 'patientProcedureIncisionConfirmed'],
  ['timeOut', 'antibioticProphylaxisWithin60Min'],
  ['timeOut', 'nursingSterilityConfirmed'],
  ['timeOut', 'essentialImagingDisplayed'],
  ['timeOut', 'coordinatorName'],
  ['timeOut', 'completedAt'],
  // Sign Out
  ['signOut', 'procedureNameConfirmed'],
  ['signOut', 'countsConfirmed'],
  ['signOut', 'specimensLabelled'],
  ['signOut', 'coordinatorName'],
  ['signOut', 'completedAt']
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
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);

  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;

  updateStepListStatuses(sectionAnswered, sectionTotal);
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

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
      if (t > 0 && firstUnfinished === -1) firstUnfinished = def.step;
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
      ${errors.map((e) =>
        `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`).join('')}
    </ul>
  `;
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ----------------------------------------------------------------------
// Submit / Report
// ----------------------------------------------------------------------

function priorityClass(priority) {
  switch (priority) {
    case 'urgent': return 'flag-urgent';
    case 'high':   return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low':    return 'flag-low';
    default:       return '';
  }
}

function dlRow(label, value) {
  const isEmpty = value == null || value === '';
  const display = isEmpty ? '—' : esc(value);
  const cls = isEmpty ? ' class="unanswered"' : '';
  return `<dt>${esc(label)}</dt><dd${cls}>${display}</dd>`;
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const { status, flags, timestamp } = lastResult;
  const cd = state.caseDetails;
  const s = state.signIn;
  const t = state.timeOut;
  const o = state.signOut;

  const flagsList = (!flags || flags.length === 0)
    ? `<p class="muted">No safety flags raised.</p>`
    : `
      <ul class="flags">
        ${flags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.message)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const teamHtml = state.teamMembers.length === 0
    ? ''
    : `
      <h3>Operating-team roster (${state.teamMembers.length})</h3>
      <dl class="summary-grid">
        ${state.teamMembers.map((m, i) => `
          ${dlRow(`#${i + 1} Name`, m.name)}
          ${dlRow(`#${i + 1} Role`, m.role)}
          ${dlRow(`#${i + 1} Introduced`, m.introducedDuringTimeOut)}
          ${dlRow(`#${i + 1} Notes`, m.notes)}
        `).join('')}
      </dl>
    `;

  out.innerHTML = `
    <h2>WHO Surgical Safety Checklist — Report</h2>
    <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>

    <h3>Status</h3>
    <p>
      <span class="status-badge status-${esc(status)}">${esc(statusLabel(status))}</span>
    </p>

    <h3>Case details</h3>
    <dl class="summary-grid">
      ${dlRow('Patient name', cd.patientName)}
      ${dlRow('Date of birth', cd.patientBirthDate)}
      ${dlRow('NHS number', cd.patientNhsNumber)}
      ${dlRow('MRN', cd.patientMedicalRecordNumber)}
      ${dlRow('Weight (kg)', cd.patientWeightKg)}
      ${dlRow('Paediatric?', cd.isPaediatric)}
      ${dlRow('Lead surgeon', cd.surgeonName)}
      ${dlRow('Lead anaesthetist', cd.anaesthetistName)}
      ${dlRow('Lead nurse', cd.leadNurseName)}
      ${dlRow('Site / facility', cd.siteName)}
      ${dlRow('Operating room', cd.operatingRoom)}
      ${dlRow('Case date', cd.caseDate)}
      ${dlRow('Planned procedure', cd.plannedProcedure)}
      ${dlRow('Surgical specialty', cd.surgicalSpecialty)}
      ${dlRow('Urgency', cd.urgency)}
      ${dlRow('Laterality', cd.laterality)}
    </dl>

    <h3>Phase 1 — Sign In ${isSignInComplete(state) ? '<span class="status-badge status-completed">complete</span>' : ''}</h3>
    <dl class="summary-grid">
      ${dlRow('1. Identity, site, procedure, consent', s.identitySiteProcedureConsent)}
      ${dlRow('2. Site marked', s.siteMarked)}
      ${dlRow('3. Anaesthesia check complete', s.anaesthesiaCheckComplete)}
      ${dlRow('4. Pulse oximeter on patient', s.pulseOximeterOnPatient)}
      ${dlRow('5. Known allergy', s.knownAllergy)}
      ${dlRow('5. Allergy detail', s.knownAllergyDetail)}
      ${dlRow('6. Difficult airway / aspiration risk', s.difficultAirwayAspirationRisk)}
      ${dlRow('7. > 500 ml blood-loss risk', s.bloodLossRisk)}
      ${dlRow('Coordinator', s.coordinatorName)}
      ${dlRow('Coordinator role', s.coordinatorRole)}
      ${dlRow('Signed off at', s.completedAt)}
    </dl>

    <h3>Phase 2 — Time Out ${isTimeOutComplete(state) ? '<span class="status-badge status-completed">complete</span>' : ''}</h3>
    <dl class="summary-grid">
      ${dlRow('1. Team introductions confirmed', t.teamIntroductionsConfirmed)}
      ${dlRow('2. Patient, procedure, incision confirmed', t.patientProcedureIncisionConfirmed)}
      ${dlRow('3. Antibiotic prophylaxis within 60 min', t.antibioticProphylaxisWithin60Min)}
      ${dlRow('4. Surgeon: critical or non-routine steps', t.surgeonCriticalSteps)}
      ${dlRow('5. Surgeon: case duration (minutes)', t.surgeonCaseDurationMinutes)}
      ${dlRow('6. Surgeon: anticipated blood loss (ml)', t.surgeonAnticipatedBloodLossMl)}
      ${dlRow('7. Anaesthetist: patient-specific concerns', t.anaesthetistPatientConcerns)}
      ${dlRow('8. Nursing: sterility confirmed', t.nursingSterilityConfirmed)}
      ${dlRow('9. Nursing: equipment concerns', t.nursingEquipmentConcerns)}
      ${dlRow('10. Essential imaging displayed', t.essentialImagingDisplayed)}
      ${dlRow('Coordinator', t.coordinatorName)}
      ${dlRow('Coordinator role', t.coordinatorRole)}
      ${dlRow('Signed off at', t.completedAt)}
    </dl>

    ${teamHtml}

    <h3>Phase 3 — Sign Out ${isSignOutComplete(state) ? '<span class="status-badge status-completed">complete</span>' : ''}</h3>
    <dl class="summary-grid">
      ${dlRow('1. Procedure name confirmed', o.procedureNameConfirmed)}
      ${dlRow('2. Counts confirmed', o.countsConfirmed)}
      ${dlRow('3. Specimens labelled', o.specimensLabelled)}
      ${dlRow('4. Equipment problems', o.equipmentProblems)}
      ${dlRow('5. Recovery concerns', o.recoveryConcerns)}
      ${dlRow('Coordinator', o.coordinatorName)}
      ${dlRow('Coordinator role', o.coordinatorRole)}
      ${dlRow('Signed off at', o.completedAt)}
    </dl>

    <h3>Safety flags (${flags.length})</h3>
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

  const status = deriveStatus(state);
  const flags = computeFlags(state);
  lastResult = {
    status,
    flags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  const ok = window.confirm(
    'Start over? This will discard all answers on this device.'
  );
  if (!ok) return;
  clearState();
  state = emptyChecklist();
  lastResult = null;
  const out = document.getElementById('report');
  if (out) out.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function renderForm() {
  const host = document.getElementById('form-sections');
  if (!host) return;
  host.innerHTML = '';
  for (const r of STEP_RENDERERS) host.appendChild(r());
}

function init() {
  renderStepList();
  renderForm();
  updateProgress();

  const submit = document.getElementById('submit-btn');
  const reset = document.getElementById('reset-btn');
  if (submit) submit.addEventListener('click', submitForm);
  if (reset) reset.addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose a small public surface for debugging in the browser console.
Object.assign(window.WhoSurgicalSafetyChecklist, {
  _getState: () => state,
  _submitForm: submitForm
});
})();
