// WHO Surgical Safety Checklist — single-page wizard controller (vanilla JS).
//
// Renders five step panels (Case details, Sign In, Time Out, Sign Out,
// Summary) into the #step-panels host declared in index.html, wires up
// navigation, persists state to localStorage on every change, and exposes
// JSON / XML / CSV / TSV / Print exports on the summary panel.
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
const TOTAL_STEPS = 5; // 0..4

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
let currentStep = 0;

function setField(section, field, value) {
  state[section][field] = value;
  saveState();
  updateProgress();
  refreshStepIndicator();
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
// Field builders
// ----------------------------------------------------------------------

function textInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field];
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="text-input"`,
    `value="${esc(value ?? '')}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}${opts.required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') v = v === '' ? null : Number(v);
    setField(opts.section, opts.field, v);
  });
  return wrapper;
}

function textArea(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      class="textarea">${esc(value)}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () =>
    setField(opts.section, opts.field, ta.value));
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
    <label for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select-input">${optionsHtml}</select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () =>
    setField(opts.section, opts.field, sel.value));
  return wrapper;
}

function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
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
      if (input.checked) setField(opts.section, opts.field, option.value);
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  return wrapper;
}

/** Wrap a child element in a numbered checklist-item card. */
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
// Step-panel builder
// ----------------------------------------------------------------------

function stepPanel(stepNumber, title, description) {
  const panel = document.createElement('section');
  panel.className = 'step-panel';
  panel.id = `step-panel-${stepNumber}`;
  panel.dataset.step = String(stepNumber);
  panel.setAttribute('aria-labelledby', `step-panel-${stepNumber}-title`);
  const desc = description
    ? `<p class="step-panel-description">${esc(description)}</p>`
    : '';
  panel.innerHTML = `
    <header class="step-panel-header">
      <span class="step-panel-step">Step ${stepNumber + 1} of ${TOTAL_STEPS}</span>
      <h2 class="step-panel-title" id="step-panel-${stepNumber}-title">${esc(title)}</h2>
      ${desc}
    </header>
  `;
  return panel;
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
// Step 0 — Case details
// ----------------------------------------------------------------------

function buildStep0() {
  const panel = stepPanel(
    0,
    'Case details',
    'Identify the patient, operating team, site, and procedure. Captured once per case.'
  );

  const patientHeader = document.createElement('h3');
  patientHeader.textContent = 'Patient';
  panel.appendChild(patientHeader);

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
  panel.appendChild(patientGrid);

  const teamHeader = document.createElement('h3');
  teamHeader.textContent = 'Lead operating team';
  panel.appendChild(teamHeader);

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
  panel.appendChild(teamGrid);

  const siteHeader = document.createElement('h3');
  siteHeader.textContent = 'Site and timing';
  panel.appendChild(siteHeader);

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
  panel.appendChild(siteGrid);

  const procHeader = document.createElement('h3');
  procHeader.textContent = 'Procedure';
  panel.appendChild(procHeader);

  panel.appendChild(textInput({
    section: 'caseDetails', field: 'plannedProcedure',
    label: 'Planned procedure', required: true,
    placeholder: 'e.g., laparoscopic cholecystectomy'
  }));
  panel.appendChild(selectInput({
    section: 'caseDetails', field: 'surgicalSpecialty',
    label: 'Surgical specialty',
    options: SURGICAL_SPECIALTY_OPTIONS
  }));
  panel.appendChild(radioGroup({
    section: 'caseDetails', field: 'urgency',
    label: 'Urgency (NCEPOD)',
    options: URGENCY_OPTIONS,
    required: true
  }));
  panel.appendChild(radioGroup({
    section: 'caseDetails', field: 'laterality',
    label: 'Laterality',
    options: LATERALITY_OPTIONS,
    required: true
  }));

  return panel;
}

// ----------------------------------------------------------------------
// Coordinator sign-off block (shared by Sign In / Time Out / Sign Out)
// ----------------------------------------------------------------------

function coordinatorBlock(section, headingText) {
  const wrapper = document.createElement('div');
  wrapper.className = 'summary-section';

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
    <label for="${stampId}">Sign-off timestamp</label>
    <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
      <input type="datetime-local" id="${stampId}" class="text-input"
             value="${esc(state[section].completedAt || '')}" style="max-width:16rem;">
      <button type="button" class="btn btn-secondary" data-stamp-now="${section}">
        Stamp now
      </button>
    </div>
  `;
  const input = stampWrap.querySelector('input');
  input.addEventListener('input', () =>
    setField(section, 'completedAt', input.value));
  const btn = stampWrap.querySelector('button');
  btn.addEventListener('click', () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const iso =
      now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) +
      'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
    input.value = iso;
    setField(section, 'completedAt', iso);
  });
  wrapper.appendChild(stampWrap);

  return wrapper;
}

// ----------------------------------------------------------------------
// Step 1 — Sign In
// ----------------------------------------------------------------------

function buildStep1() {
  const panel = stepPanel(
    1,
    'Phase 1 — Sign In',
    'Complete before induction of anaesthesia. Required participants: nurse and anaesthetist.'
  );

  panel.appendChild(checklistItem(1,
    'Has the patient confirmed his/her identity, site, procedure, and consent?',
    radioGroup({
      section: 'signIn', field: 'identitySiteProcedureConsent',
      label: 'Identity, site, procedure, consent confirmed',
      options: YES_ONLY, required: true
    })
  ));

  panel.appendChild(checklistItem(2,
    'Is the surgical site marked?',
    radioGroup({
      section: 'signIn', field: 'siteMarked',
      label: 'Site marking',
      options: YES_NA, required: true
    })
  ));

  panel.appendChild(checklistItem(3,
    'Is the anaesthesia machine and medication check complete?',
    radioGroup({
      section: 'signIn', field: 'anaesthesiaCheckComplete',
      label: 'Anaesthesia check complete',
      options: YES_ONLY, required: true
    })
  ));

  panel.appendChild(checklistItem(4,
    'Is the pulse oximeter on the patient and functioning?',
    radioGroup({
      section: 'signIn', field: 'pulseOximeterOnPatient',
      label: 'Pulse oximeter on and functioning',
      options: YES_ONLY, required: true
    })
  ));

  panel.appendChild(checklistItem(5,
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

  panel.appendChild(checklistItem(6,
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

  panel.appendChild(checklistItem(7,
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

  panel.appendChild(coordinatorBlock('signIn', 'Sign In sign-off'));
  return panel;
}

// ----------------------------------------------------------------------
// Step 2 — Time Out (incl. team-member roster)
// ----------------------------------------------------------------------

let teamRosterHost = null;

function renderTeamRoster() {
  if (!teamRosterHost) return;
  teamRosterHost.innerHTML = '';

  if (state.teamMembers.length === 0) {
    const p = document.createElement('p');
    p.className = 'team-empty';
    p.textContent = 'No team members added yet. Use “Add team member” below.';
    teamRosterHost.appendChild(p);
  }

  state.teamMembers.forEach((row, idx) => {
    const r = document.createElement('div');
    r.className = 'team-row';

    const grid = document.createElement('div');
    grid.className = 'team-grid';

    // Name
    const nameCell = document.createElement('label');
    nameCell.className = 'team-cell';
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
    roleCell.className = 'team-cell';
    const roleOpts = [`<option value="">— Role —</option>`,
      ...TEAM_ROLE_OPTIONS.map((o) =>
        `<option value="${esc(o.value)}"${o.value === row.role ? ' selected' : ''}>${esc(o.label)}</option>`)
    ].join('');
    roleCell.innerHTML = `
      <span>Role</span>
      <select class="select-input">${roleOpts}</select>
    `;
    roleCell.querySelector('select').addEventListener('change', (e) =>
      setTeamMemberField(idx, 'role', e.target.value));
    grid.appendChild(roleCell);

    // Introduced?
    const introCell = document.createElement('label');
    introCell.className = 'team-cell';
    const introOpts = [`<option value="">—</option>`,
      ...YES_NO.map((o) =>
        `<option value="${esc(o.value)}"${o.value === row.introducedDuringTimeOut ? ' selected' : ''}>${esc(o.label)}</option>`)
    ].join('');
    introCell.innerHTML = `
      <span>Introduced?</span>
      <select class="select-input">${introOpts}</select>
    `;
    introCell.querySelector('select').addEventListener('change', (e) =>
      setTeamMemberField(idx, 'introducedDuringTimeOut', e.target.value));
    grid.appendChild(introCell);

    // Notes
    const notesCell = document.createElement('label');
    notesCell.className = 'team-cell';
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
    removeBtn.className = 'btn btn-icon';
    removeBtn.setAttribute('aria-label', `Remove team member ${idx + 1}`);
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => removeTeamMember(idx));
    grid.appendChild(removeBtn);

    r.appendChild(grid);
    teamRosterHost.appendChild(r);
  });
}

function buildStep2() {
  const panel = stepPanel(
    2,
    'Phase 2 — Time Out',
    'Complete before skin incision. Required participants: nurse, anaesthetist, surgeon.'
  );

  // Item 1 — team introductions
  panel.appendChild(checklistItem(1,
    'Confirm all team members have introduced themselves by name and role.',
    radioGroup({
      section: 'timeOut', field: 'teamIntroductionsConfirmed',
      label: 'Team introductions complete',
      options: YES_ONLY, required: true
    })
  ));

  // Team roster
  const rosterCard = document.createElement('div');
  rosterCard.className = 'team-roster';
  const rh = document.createElement('h3');
  rh.textContent = 'Operating-team roster';
  rosterCard.appendChild(rh);

  teamRosterHost = document.createElement('div');
  rosterCard.appendChild(teamRosterHost);

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn-add';
  addBtn.textContent = '+ Add team member';
  addBtn.addEventListener('click', addTeamMember);
  rosterCard.appendChild(addBtn);

  panel.appendChild(rosterCard);
  renderTeamRoster();

  panel.appendChild(checklistItem(2,
    'Confirm the patient\u2019s name, procedure, and where the incision will be made.',
    radioGroup({
      section: 'timeOut', field: 'patientProcedureIncisionConfirmed',
      label: 'Patient, procedure, incision confirmed',
      options: YES_ONLY, required: true
    })
  ));

  panel.appendChild(checklistItem(3,
    'Has antibiotic prophylaxis been given within the last 60 minutes?',
    radioGroup({
      section: 'timeOut', field: 'antibioticProphylaxisWithin60Min',
      label: 'Antibiotic prophylaxis',
      options: YES_NA, required: true
    })
  ));

  panel.appendChild(checklistItem(4,
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
  panel.appendChild(surgGrid);

  panel.appendChild(checklistItem(7,
    'Anticipated critical events — Anaesthetist: patient-specific concerns?',
    textArea({
      section: 'timeOut', field: 'anaesthetistPatientConcerns',
      label: 'Patient-specific anaesthesia concerns',
      rows: 2
    })
  ));

  panel.appendChild(checklistItem(8,
    'Nursing team: has sterility (including indicator results) been confirmed?',
    radioGroup({
      section: 'timeOut', field: 'nursingSterilityConfirmed',
      label: 'Sterility confirmed',
      options: YES_ONLY, required: true
    })
  ));

  panel.appendChild(checklistItem(9,
    'Nursing team: are there equipment issues or any concerns?',
    textArea({
      section: 'timeOut', field: 'nursingEquipmentConcerns',
      label: 'Equipment concerns',
      rows: 2
    })
  ));

  panel.appendChild(checklistItem(10,
    'Is essential imaging displayed?',
    radioGroup({
      section: 'timeOut', field: 'essentialImagingDisplayed',
      label: 'Essential imaging displayed',
      options: YES_NA, required: true
    })
  ));

  panel.appendChild(coordinatorBlock('timeOut', 'Time Out sign-off'));
  return panel;
}

// ----------------------------------------------------------------------
// Step 3 — Sign Out
// ----------------------------------------------------------------------

function buildStep3() {
  const panel = stepPanel(
    3,
    'Phase 3 — Sign Out',
    'Complete before the patient leaves the operating room. Required participants: nurse, anaesthetist, surgeon.'
  );

  panel.appendChild(checklistItem(1,
    'Nurse verbally confirms: name of the procedure recorded.',
    radioGroup({
      section: 'signOut', field: 'procedureNameConfirmed',
      label: 'Procedure name confirmed',
      options: YES_ONLY, required: true
    })
  ));

  panel.appendChild(checklistItem(2,
    'Nurse verbally confirms: instrument, sponge, and needle counts.',
    radioGroup({
      section: 'signOut', field: 'countsConfirmed',
      label: 'Counts confirmed',
      options: YES_NO, required: true
    })
  ));

  panel.appendChild(checklistItem(3,
    'Nurse verbally confirms: specimen labelling (read aloud, including patient name).',
    radioGroup({
      section: 'signOut', field: 'specimensLabelled',
      label: 'Specimens labelled',
      options: YES_NO_NA, required: true
    })
  ));

  panel.appendChild(checklistItem(4,
    'Nurse verbally confirms: any equipment problems to be addressed.',
    textArea({
      section: 'signOut', field: 'equipmentProblems',
      label: 'Equipment problems',
      rows: 2
    })
  ));

  panel.appendChild(checklistItem(5,
    'To surgeon, anaesthetist, and nurse: key concerns for recovery and management of this patient.',
    textArea({
      section: 'signOut', field: 'recoveryConcerns',
      label: 'Recovery and management concerns',
      rows: 2
    })
  ));

  panel.appendChild(coordinatorBlock('signOut', 'Sign Out sign-off'));
  return panel;
}

// ----------------------------------------------------------------------
// Step 4 — Summary, safety flags, exports
// ----------------------------------------------------------------------

let summaryHost = null;

function buildStep4() {
  const panel = stepPanel(
    4,
    'Summary, safety flags & export',
    'Review the captured record, see the computed safety flags, and export the case file.'
  );

  summaryHost = document.createElement('div');
  panel.appendChild(summaryHost);

  // Abandon-case input lives under the summary so it is always visible.
  const abandonWrapper = document.createElement('div');
  abandonWrapper.className = 'summary-section';
  abandonWrapper.innerHTML = `<h3>Abandon case (if applicable)</h3>`;
  abandonWrapper.appendChild(textArea({
    section: 'summary', field: 'abandonedReason',
    label: 'Reason the case was abandoned (leave blank if completed normally)',
    rows: 2,
    placeholder: 'e.g., patient cancelled, equipment failure, deteriorating condition'
  }));
  panel.appendChild(abandonWrapper);

  // Export buttons
  const exportSection = document.createElement('div');
  exportSection.className = 'summary-section';
  exportSection.innerHTML = `
    <h3>Export</h3>
    <p class="step-panel-description" style="margin-bottom:0.5rem;">
      Download the case record in the format most useful for your downstream
      system, or open a printable summary.
    </p>
    <div class="export-actions">
      <button type="button" class="btn btn-secondary" data-export="json">Download JSON</button>
      <button type="button" class="btn btn-secondary" data-export="xml">Download XML</button>
      <button type="button" class="btn btn-secondary" data-export="csv">Download CSV</button>
      <button type="button" class="btn btn-secondary" data-export="tsv">Download TSV</button>
      <button type="button" class="btn btn-primary" data-export="print">Open printable summary</button>
    </div>
  `;
  panel.appendChild(exportSection);

  exportSection.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-export]');
    if (!btn) return;
    handleExport(btn.dataset.export);
  });

  return panel;
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

function renderSummary() {
  if (!summaryHost) return;

  const status = deriveStatus(state);
  const flags = computeFlags(state);

  const cd = state.caseDetails;
  const s = state.signIn;
  const t = state.timeOut;
  const o = state.signOut;

  const sections = [];

  // Status pill
  sections.push(`
    <div class="summary-section">
      <h3>Status</h3>
      <p>
        <span class="status-pill status-${status}">${esc(statusLabel(status))}</span>
      </p>
    </div>
  `);

  // Case details
  sections.push(`
    <div class="summary-section">
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
    </div>
  `);

  // Sign In
  sections.push(`
    <div class="summary-section">
      <h3>Phase 1 — Sign In ${isSignInComplete(state) ? '<span class="status-pill status-completed">complete</span>' : ''}</h3>
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
    </div>
  `);

  // Time Out
  sections.push(`
    <div class="summary-section">
      <h3>Phase 2 — Time Out ${isTimeOutComplete(state) ? '<span class="status-pill status-completed">complete</span>' : ''}</h3>
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
    </div>
  `);

  // Team roster
  if (state.teamMembers.length > 0) {
    sections.push(`
      <div class="summary-section">
        <h3>Operating-team roster (${state.teamMembers.length})</h3>
        <dl class="summary-grid">
          ${state.teamMembers.map((m, i) => `
            ${dlRow(`#${i + 1} Name`, m.name)}
            ${dlRow(`#${i + 1} Role`, m.role)}
            ${dlRow(`#${i + 1} Introduced`, m.introducedDuringTimeOut)}
            ${dlRow(`#${i + 1} Notes`, m.notes)}
          `).join('')}
        </dl>
      </div>
    `);
  }

  // Sign Out
  sections.push(`
    <div class="summary-section">
      <h3>Phase 3 — Sign Out ${isSignOutComplete(state) ? '<span class="status-pill status-completed">complete</span>' : ''}</h3>
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
    </div>
  `);

  // Safety flags
  sections.push(safetyFlagsHtml(flags));

  summaryHost.innerHTML = sections.join('');
}

function dlRow(label, value) {
  const isEmpty = value == null || value === '';
  const display = isEmpty ? '—' : esc(value);
  const cls = isEmpty ? ' class="unanswered"' : '';
  return `<dt>${esc(label)}</dt><dd${cls}>${display}</dd>`;
}

function safetyFlagsHtml(flags) {
  if (!flags || flags.length === 0) {
    return `
      <div class="summary-section">
        <h3>Safety flags</h3>
        <p class="flags-empty">No safety flags raised.</p>
      </div>
    `;
  }
  const items = flags.map((f) => `
    <li class="flag-${esc(f.priority)}">
      <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
      <span class="flag-category">${esc(f.category)}</span>
      <span class="flag-message">${esc(f.message)}</span>
    </li>
  `).join('');
  return `
    <div class="summary-section">
      <h3>Safety flags (${flags.length})</h3>
      <ul class="flags">${items}</ul>
    </div>
  `;
}

// ----------------------------------------------------------------------
// Wizard navigation
// ----------------------------------------------------------------------

function showStep(step) {
  if (step < 0) step = 0;
  if (step > TOTAL_STEPS - 1) step = TOTAL_STEPS - 1;
  currentStep = step;

  const panels = document.querySelectorAll('#step-panels .step-panel');
  panels.forEach((p) => {
    const n = Number(p.dataset.step);
    if (n === currentStep) {
      p.classList.remove('step-panel-hidden');
    } else {
      p.classList.add('step-panel-hidden');
    }
  });

  // Prev / Next button enable/disable
  const prev = document.getElementById('prev-btn');
  const next = document.getElementById('next-btn');
  if (prev) prev.disabled = currentStep === 0;
  if (next) next.disabled = currentStep === TOTAL_STEPS - 1;

  refreshStepIndicator();

  if (currentStep === TOTAL_STEPS - 1) {
    renderSummary();
  }

  // Scroll to top of wizard for clarity.
  const top = document.getElementById('wizard');
  if (top && typeof top.scrollIntoView === 'function') {
    top.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
}

function refreshStepIndicator() {
  const items = document.querySelectorAll('#step-indicator .step-indicator-item');
  items.forEach((it) => {
    const n = Number(it.dataset.step);
    it.classList.remove('current', 'complete');
    if (n === currentStep) it.classList.add('current');
    if (isStepComplete(n) && n !== currentStep) it.classList.add('complete');
  });
}

function isStepComplete(n) {
  switch (n) {
    case 0:
      return state.caseDetails.patientName !== '' &&
             state.caseDetails.plannedProcedure !== '' &&
             state.caseDetails.urgency !== '' &&
             state.caseDetails.laterality !== '';
    case 1:
      return isSignInComplete(state);
    case 2:
      return isTimeOutComplete(state);
    case 3:
      return isSignOutComplete(state);
    case 4:
      return deriveStatus(state) === 'completed' ||
             deriveStatus(state) === 'abandoned';
    default:
      return false;
  }
}

// ----------------------------------------------------------------------
// Progress (answered fields / total)
// ----------------------------------------------------------------------

// Stable list of fields counted for the progress bar. Numeric fields count
// as "answered" when non-null; text/enum fields when non-empty.
const REQUIRED_FIELDS = [
  // Case details
  ['caseDetails', 'patientName', 'string'],
  ['caseDetails', 'plannedProcedure', 'string'],
  ['caseDetails', 'urgency', 'string'],
  ['caseDetails', 'laterality', 'string'],
  // Sign In
  ['signIn', 'identitySiteProcedureConsent', 'string'],
  ['signIn', 'siteMarked', 'string'],
  ['signIn', 'anaesthesiaCheckComplete', 'string'],
  ['signIn', 'pulseOximeterOnPatient', 'string'],
  ['signIn', 'knownAllergy', 'string'],
  ['signIn', 'difficultAirwayAspirationRisk', 'string'],
  ['signIn', 'bloodLossRisk', 'string'],
  ['signIn', 'coordinatorName', 'string'],
  ['signIn', 'completedAt', 'string'],
  // Time Out
  ['timeOut', 'teamIntroductionsConfirmed', 'string'],
  ['timeOut', 'patientProcedureIncisionConfirmed', 'string'],
  ['timeOut', 'antibioticProphylaxisWithin60Min', 'string'],
  ['timeOut', 'nursingSterilityConfirmed', 'string'],
  ['timeOut', 'essentialImagingDisplayed', 'string'],
  ['timeOut', 'coordinatorName', 'string'],
  ['timeOut', 'completedAt', 'string'],
  // Sign Out
  ['signOut', 'procedureNameConfirmed', 'string'],
  ['signOut', 'countsConfirmed', 'string'],
  ['signOut', 'specimensLabelled', 'string'],
  ['signOut', 'coordinatorName', 'string'],
  ['signOut', 'completedAt', 'string']
];

function updateProgress() {
  let answered = 0;
  for (const [section, field, kind] of REQUIRED_FIELDS) {
    const v = state[section][field];
    if (kind === 'number') {
      if (v != null) answered++;
    } else {
      if (v != null && v !== '') answered++;
    }
  }
  const total = REQUIRED_FIELDS.length;
  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);

  const fill = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  const bar = document.getElementById('progress-bar');
  if (fill) fill.style.width = pct + '%';
  if (bar) bar.setAttribute('aria-valuenow', String(pct));
  if (text) text.textContent =
    `${answered} of ${total} required fields answered (${pct}%)`;
}

// ----------------------------------------------------------------------
// Initialisation
// ----------------------------------------------------------------------

function buildAllPanels() {
  const host = document.getElementById('step-panels');
  if (!host) return;
  host.innerHTML = '';
  host.appendChild(buildStep0());
  host.appendChild(buildStep1());
  host.appendChild(buildStep2());
  host.appendChild(buildStep3());
  host.appendChild(buildStep4());
}

function wireNavigation() {
  const prev = document.getElementById('prev-btn');
  const next = document.getElementById('next-btn');
  const reset = document.getElementById('reset-btn');

  if (prev) prev.addEventListener('click', () => showStep(currentStep - 1));
  if (next) next.addEventListener('click', () => showStep(currentStep + 1));
  if (reset) {
    reset.addEventListener('click', () => {
      const ok = window.confirm(
        'Start over? This will discard all answers on this device.'
      );
      if (!ok) return;
      clearState();
      state = emptyChecklist();
      currentStep = 0;
      buildAllPanels();
      showStep(0);
      updateProgress();
    });
  }

  // Step-indicator buttons
  const indicator = document.getElementById('step-indicator');
  if (indicator) {
    indicator.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-go-step]');
      if (!btn) return;
      const n = Number(btn.dataset.goStep);
      if (Number.isFinite(n)) showStep(n);
    });
  }
}

function init() {
  buildAllPanels();
  wireNavigation();
  updateProgress();
  showStep(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose a small public surface for debugging in the browser console.
Object.assign(window.WhoSurgicalSafetyChecklist, {
  _getState: () => state,
  _getCurrentStep: () => currentStep,
  _showStep: showStep,
  _renderSummary: renderSummary
});
})();
