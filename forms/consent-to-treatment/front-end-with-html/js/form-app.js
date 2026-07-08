// Consent To Treatment - patient wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. A step-list at the top of the page acts as a table of
// contents and reflects per-section completion. A native <progress> element
// reflects overall completion. Submission runs the pure form-completeness
// validator and the additional flag detector and renders an inline report.
// State is persisted to localStorage so a partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.ConsentToTreatment`. Pulling them off here keeps the
// rest of this file referring to short local names. Whole file is wrapped
// in an IIFE so its top-level identifiers don't leak to the global scope.
(function () {
  'use strict';

  const NS = window.ConsentToTreatment;
  const {
    emptyAssessment,
    completenessLabel,
    completenessClass,
    validateForm: validateFormEngine,
    detectAdditionalFlags
  } = NS;

  // ----------------------------------------------------------------------
  // Persistence
  // ----------------------------------------------------------------------

  const STORAGE_KEY = 'consent-to-treatment.front-end-form-with-html.v1';
  const TOTAL_STEPS = 8;

  /** @returns {import('./types.js').AssessmentData} */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyAssessment();
      const parsed = JSON.parse(raw);
      const fresh = emptyAssessment();
      for (const key of Object.keys(fresh)) {
        if (parsed && typeof parsed[key] === 'object' && parsed[key] !== null) {
          fresh[key] = Object.assign({}, fresh[key], parsed[key]);
        }
      }
      return fresh;
    } catch (e) {
      console.warn('Could not parse saved consent form; starting fresh.', e);
      return emptyAssessment();
    }
  }

  /** @param {import('./types.js').AssessmentData} state */
  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save consent form to localStorage.', e);
    }
  }

  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear stored consent form.', e);
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
   * Set a field on the state and persist. Re-runs progress and conditional
   * visibility after each change.
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

  /** Escape user-entered text for safe rendering. */
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

  /**
   * @param {{ label: string, section: string, field: string, type?: string,
   *           placeholder?: string, required?: boolean }} opts
   */
  function textInput(opts) {
    const id = opts.section + '-' + opts.field;
    const value = state[opts.section][opts.field];
    const labelText = esc(opts.label) +
      (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
    const type = opts.type || 'text';
    const attrs = [
      'id="' + id + '"',
      'name="' + id + '"',
      'type="' + type + '"',
      'class="' + lilyInputClass(type) + '"',
      'value="' + esc(value || '') + '"',
      'aria-describedby="' + id + '-error"'
    ];
    if (opts.placeholder) attrs.push('placeholder="' + esc(opts.placeholder) + '"');
    if (opts.required) attrs.push('required', 'data-required');

    const wrapper = document.createElement('div');
    wrapper.className = 'field';
    wrapper.innerHTML =
      '<label class="label" for="' + id + '">' + labelText + '</label>' +
      '<input ' + attrs.join(' ') + '>' +
      '<span class="error-message" id="' + id + '-error"></span>';

    const input = wrapper.querySelector('input');
    input.addEventListener('input', () => {
      setField(opts.section, opts.field, input.value);
      clearFieldError(id);
    });
    return wrapper;
  }

  /**
   * @param {{ label: string, section: string, field: string, rows?: number,
   *           placeholder?: string, required?: boolean }} opts
   */
  function textArea(opts) {
    const id = opts.section + '-' + opts.field;
    const value = state[opts.section][opts.field] || '';
    const labelText = esc(opts.label) +
      (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
    const wrapper = document.createElement('div');
    wrapper.className = 'field';
    const requiredAttr = opts.required ? ' required data-required' : '';
    wrapper.innerHTML =
      '<label class="label" for="' + id + '">' + labelText + '</label>' +
      '<textarea id="' + id + '" name="' + id + '" rows="' + (opts.rows || 3) + '"' +
      (opts.placeholder ? ' placeholder="' + esc(opts.placeholder) + '"' : '') +
      ' aria-describedby="' + id + '-error"' +
      requiredAttr +
      ' class="text-area-input">' + esc(value) + '</textarea>' +
      '<span class="error-message" id="' + id + '-error"></span>';
    const ta = wrapper.querySelector('textarea');
    ta.addEventListener('input', () => {
      setField(opts.section, opts.field, ta.value);
      clearFieldError(id);
    });
    return wrapper;
  }

  /**
   * @param {{ label: string, section: string, field: string, required?: boolean,
   *           options: { value: string, label: string }[] }} opts
   */
  function selectInput(opts) {
    const id = opts.section + '-' + opts.field;
    const current = state[opts.section][opts.field] || '';
    const labelText = esc(opts.label) +
      (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
    const wrapper = document.createElement('div');
    wrapper.className = 'field';

    const optionsHtml = ['<option value="">— Select —</option>']
      .concat(
        opts.options.map((o) =>
          '<option value="' + esc(o.value) + '"' +
          (o.value === current ? ' selected' : '') + '>' +
          esc(o.label) + '</option>'
        )
      )
      .join('');

    const requiredAttr = opts.required ? ' required data-required' : '';
    wrapper.innerHTML =
      '<label class="label" for="' + id + '">' + labelText + '</label>' +
      '<select id="' + id + '" name="' + id + '" class="select"' +
      ' aria-describedby="' + id + '-error"' + requiredAttr + '>' +
      optionsHtml + '</select>' +
      '<span class="error-message" id="' + id + '-error"></span>';
    const sel = wrapper.querySelector('select');
    sel.addEventListener('change', () => {
      setField(opts.section, opts.field, sel.value);
      clearFieldError(id);
    });
    return wrapper;
  }

  /**
   * @param {{ label: string, section: string, field: string, required?: boolean,
   *           options: { value: string, label: string }[] }} opts
   */
  function radioGroup(opts) {
    const groupId = opts.section + '-' + opts.field;
    const current = state[opts.section][opts.field];
    const wrapper = document.createElement('fieldset');
    wrapper.className = 'field';
    wrapper.id = groupId + '-fieldset';

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
      const radioId = groupId + '-' + option.value;
      const label = document.createElement('label');
      label.htmlFor = radioId;
      const checked = current === option.value ? ' checked' : '';
      const requiredAttr = opts.required ? ' data-required' : '';
      label.innerHTML =
        '<input class="radio-input" type="radio" id="' + radioId + '" name="' + groupId +
        '" value="' + esc(option.value) + '"' + checked + requiredAttr + '>' +
        '<span>' + esc(option.label) + '</span>';
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
    errSpan.id = groupId + '-error';
    wrapper.appendChild(errSpan);
    return wrapper;
  }

  /**
   * @param {{ stepNumber: number, title: string, description?: string }} opts
   */
  function sectionCard(opts) {
    const card = document.createElement('fieldset');
    card.className = 'fieldset';
    card.dataset.step = String(opts.stepNumber);
    card.id = 'step-' + opts.stepNumber;
    const desc = opts.description
      ? '<span class="section-description">' + esc(opts.description) + '</span>'
      : '';
    const legend = document.createElement('legend');
    legend.className = 'fieldset-legend';
    legend.innerHTML =
      '<span class="section-step">Section ' + opts.stepNumber + ' of ' + TOTAL_STEPS + '</span>' +
      '<h2 class="section-title">' + esc(opts.title) + '</h2>' +
      desc;
    card.appendChild(legend);
    return card;
  }

  function subHeader(title) {
    const wrap = document.createElement('h3');
    wrap.className = 'sub-header';
    wrap.textContent = title;
    return wrap;
  }

  function infoBlock(text, kind) {
    const wrap = document.createElement('div');
    wrap.className = 'alert';
    const typeAttr = kind === 'warn' ? 'warning'
      : kind === 'note' ? 'info'
      : kind || 'info';
    wrap.setAttribute('data-type', typeAttr);
    wrap.innerHTML = '<p>' + esc(text) + '</p>';
    return wrap;
  }

  // ----------------------------------------------------------------------
  // Section renderers (8 sections)
  // ----------------------------------------------------------------------

  const yesNo = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  function renderStep1() {
    const card = sectionCard({
      stepNumber: 1,
      title: 'Patient Information',
      description: 'Personal details and emergency contact information.'
    });

    const nameGrid = document.createElement('div');
    nameGrid.className = 'two-col';
    nameGrid.appendChild(textInput({ label: 'First Name', section: 'patientInformation', field: 'firstName', required: true }));
    nameGrid.appendChild(textInput({ label: 'Last Name', section: 'patientInformation', field: 'lastName', required: true }));
    card.appendChild(nameGrid);

    card.appendChild(textInput({
      label: 'Date of Birth',
      section: 'patientInformation', field: 'dob',
      type: 'date', required: true
    }));

    card.appendChild(radioGroup({
      label: 'Sex',
      section: 'patientInformation', field: 'sex',
      required: true,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    }));

    card.appendChild(textInput({
      label: 'NHS Number',
      section: 'patientInformation', field: 'nhsNumber',
      placeholder: '000 000 0000', required: true
    }));

    card.appendChild(textInput({
      label: 'Address',
      section: 'patientInformation', field: 'address', required: true
    }));

    card.appendChild(textInput({
      label: 'Phone Number',
      section: 'patientInformation', field: 'phone', required: true
    }));

    card.appendChild(subHeader('Emergency Contact'));
    card.appendChild(textInput({
      label: 'Emergency Contact Name',
      section: 'patientInformation', field: 'emergencyContact', required: true
    }));
    card.appendChild(textInput({
      label: 'Emergency Contact Phone',
      section: 'patientInformation', field: 'emergencyContactPhone', required: true
    }));

    return card;
  }

  function renderStep2() {
    const card = sectionCard({
      stepNumber: 2,
      title: 'Procedure Details',
      description: 'Information about the planned procedure.'
    });

    card.appendChild(textInput({
      label: 'Procedure Name',
      section: 'procedureDetails', field: 'procedureName', required: true
    }));
    card.appendChild(textArea({
      label: 'Procedure Description',
      section: 'procedureDetails', field: 'procedureDescription',
      placeholder: 'Describe the procedure in terms the patient can understand…',
      rows: 4, required: true
    }));

    const grid1 = document.createElement('div');
    grid1.className = 'two-col';
    grid1.appendChild(textInput({
      label: 'Treating Clinician',
      section: 'procedureDetails', field: 'treatingClinician', required: true
    }));
    grid1.appendChild(textInput({
      label: 'Department',
      section: 'procedureDetails', field: 'department', required: true
    }));
    card.appendChild(grid1);

    const grid2 = document.createElement('div');
    grid2.className = 'two-col';
    grid2.appendChild(textInput({
      label: 'Scheduled Date',
      section: 'procedureDetails', field: 'scheduledDate',
      type: 'date', required: true
    }));
    grid2.appendChild(textInput({
      label: 'Estimated Duration',
      section: 'procedureDetails', field: 'estimatedDuration',
      placeholder: 'e.g. 1-2 hours'
    }));
    card.appendChild(grid2);

    card.appendChild(radioGroup({
      label: 'Admission Required',
      section: 'procedureDetails', field: 'admissionRequired',
      options: yesNo, required: true
    }));

    return card;
  }

  function renderStep3() {
    const card = sectionCard({
      stepNumber: 3,
      title: 'Risks & Benefits',
      description: 'Document the risks, benefits, and expected outcomes of the procedure.'
    });

    card.appendChild(textArea({
      label: 'Common Risks',
      section: 'risksBenefits', field: 'commonRisks',
      placeholder: 'List common risks (e.g. pain, bruising, infection)…',
      rows: 3, required: true
    }));
    card.appendChild(textArea({
      label: 'Serious Risks',
      section: 'risksBenefits', field: 'seriousRisks',
      placeholder: 'List serious or rare risks (e.g. organ injury, significant bleeding)…',
      rows: 3, required: true
    }));
    card.appendChild(textArea({
      label: 'Expected Benefits',
      section: 'risksBenefits', field: 'expectedBenefits',
      placeholder: 'Describe the expected benefits of the procedure…',
      rows: 3, required: true
    }));
    card.appendChild(textInput({
      label: 'Success Rate',
      section: 'risksBenefits', field: 'successRate',
      placeholder: 'e.g. 95% successful outcome'
    }));
    card.appendChild(textInput({
      label: 'Recovery Period',
      section: 'risksBenefits', field: 'recoveryPeriod',
      placeholder: 'e.g. 1-2 weeks'
    }));

    return card;
  }

  function renderStep4() {
    const card = sectionCard({
      stepNumber: 4,
      title: 'Alternative Treatments',
      description: 'Document alternative options and consequences of no treatment.'
    });

    card.appendChild(textArea({
      label: 'Alternative Treatment Options',
      section: 'alternativeTreatments', field: 'alternativeOptions',
      placeholder: 'Describe alternative treatments available…',
      rows: 4, required: true
    }));
    card.appendChild(textArea({
      label: 'Consequences of No Treatment',
      section: 'alternativeTreatments', field: 'noTreatmentConsequences',
      placeholder: 'Describe what may happen if the patient chooses not to proceed with treatment…',
      rows: 4, required: true
    }));
    card.appendChild(textArea({
      label: 'Patient Preference',
      section: 'alternativeTreatments', field: 'patientPreference',
      placeholder: 'Record the patient\u2019s stated preference regarding treatment options…',
      rows: 3
    }));

    return card;
  }

  function renderStep5() {
    const card = sectionCard({
      stepNumber: 5,
      title: 'Anesthesia Information',
      description: 'Details about the planned anesthesia and any prior issues.'
    });

    card.appendChild(selectInput({
      label: 'Anesthesia Type',
      section: 'anesthesiaInformation', field: 'anesthesiaType',
      required: true,
      options: [
        { value: 'general', label: 'General Anesthesia' },
        { value: 'regional', label: 'Regional Anesthesia' },
        { value: 'local', label: 'Local Anesthesia' },
        { value: 'sedation', label: 'Sedation' },
        { value: 'none', label: 'None' }
      ]
    }));

    card.appendChild(textArea({
      label: 'Anesthesia Risks',
      section: 'anesthesiaInformation', field: 'anesthesiaRisks',
      placeholder: 'Document specific anesthesia risks discussed with the patient…',
      rows: 3
    }));

    card.appendChild(radioGroup({
      label: 'Previous Anesthesia Problems',
      section: 'anesthesiaInformation', field: 'previousAnesthesiaProblems',
      options: yesNo, required: true
    }));

    const prevDetails = document.createElement('div');
    prevDetails.dataset.conditional = 'anesthesiaInformation.previousAnesthesiaProblems=yes';
    prevDetails.appendChild(textArea({
      label: 'Previous Anesthesia Problem Details',
      section: 'anesthesiaInformation', field: 'previousAnesthesiaDetails',
      placeholder: 'Describe previous anesthesia problems in detail…',
      rows: 3
    }));
    card.appendChild(prevDetails);

    card.appendChild(textArea({
      label: 'Fasting Instructions',
      section: 'anesthesiaInformation', field: 'fastingInstructions',
      placeholder: 'e.g. No food for 6 hours, clear fluids until 2 hours before procedure…',
      rows: 2
    }));

    return card;
  }

  function renderStep6() {
    const card = sectionCard({
      stepNumber: 6,
      title: 'Questions & Understanding',
      description: 'Confirm patient understanding and record any questions.'
    });

    card.appendChild(textArea({
      label: 'Questions Asked by Patient',
      section: 'questionsUnderstanding', field: 'questionsAsked',
      placeholder: 'Record any questions the patient has asked…',
      rows: 3
    }));

    card.appendChild(radioGroup({
      label: 'Patient understands the procedure',
      section: 'questionsUnderstanding', field: 'understandsProcedure',
      options: yesNo, required: true
    }));
    card.appendChild(radioGroup({
      label: 'Patient understands the risks',
      section: 'questionsUnderstanding', field: 'understandsRisks',
      options: yesNo, required: true
    }));
    card.appendChild(radioGroup({
      label: 'Patient understands the alternatives',
      section: 'questionsUnderstanding', field: 'understandsAlternatives',
      options: yesNo, required: true
    }));
    card.appendChild(radioGroup({
      label: 'Patient understands the recovery process',
      section: 'questionsUnderstanding', field: 'understandsRecovery',
      options: yesNo, required: true
    }));

    card.appendChild(textArea({
      label: 'Additional Concerns',
      section: 'questionsUnderstanding', field: 'additionalConcerns',
      placeholder: 'Record any additional concerns raised by the patient…',
      rows: 3
    }));

    return card;
  }

  function renderStep7() {
    const card = sectionCard({
      stepNumber: 7,
      title: 'Patient Rights',
      description: 'Confirm understanding and acknowledgement of patient rights.'
    });

    card.appendChild(infoBlock(
      'Please confirm the following patient rights have been discussed:',
      'note'
    ));

    card.appendChild(radioGroup({
      label: 'Patient understands they have the right to withdraw consent at any time',
      section: 'patientRights', field: 'rightToWithdraw',
      options: yesNo, required: true
    }));
    card.appendChild(radioGroup({
      label: 'Patient understands they have the right to seek a second opinion',
      section: 'patientRights', field: 'rightToSecondOpinion',
      options: yesNo, required: true
    }));
    card.appendChild(radioGroup({
      label: 'Patient confirms consent is given voluntarily and without coercion',
      section: 'patientRights', field: 'informedVoluntarily',
      options: yesNo, required: true
    }));
    card.appendChild(radioGroup({
      label: 'Patient acknowledges that no guarantee of outcome has been made',
      section: 'patientRights', field: 'noGuaranteeAcknowledged',
      options: yesNo, required: true
    }));

    return card;
  }

  function renderStep8() {
    const card = sectionCard({
      stepNumber: 8,
      title: 'Signature & Consent',
      description: 'Final consent confirmation and signature details.'
    });

    card.appendChild(infoBlock(
      'By confirming consent below, the patient agrees to the proposed procedure as described in this form.',
      'warn'
    ));

    card.appendChild(radioGroup({
      label: 'Patient Consent',
      section: 'signatureConsent', field: 'patientConsent',
      required: true,
      options: [
        { value: 'yes', label: 'I consent to the proposed treatment' },
        { value: 'no', label: 'I do not consent' }
      ]
    }));

    card.appendChild(textInput({
      label: 'Signature Date',
      section: 'signatureConsent', field: 'signatureDate',
      type: 'date', required: true
    }));

    card.appendChild(subHeader('Witness Details'));
    const witGrid = document.createElement('div');
    witGrid.className = 'two-col';
    witGrid.appendChild(textInput({
      label: 'Witness Name',
      section: 'signatureConsent', field: 'witnessName', required: true
    }));
    witGrid.appendChild(textInput({
      label: 'Witness Role',
      section: 'signatureConsent', field: 'witnessRole',
      placeholder: 'e.g. Staff Nurse', required: true
    }));
    card.appendChild(witGrid);
    card.appendChild(textInput({
      label: 'Witness Signature Date',
      section: 'signatureConsent', field: 'witnessSignatureDate',
      type: 'date'
    }));

    card.appendChild(subHeader('Clinician Details'));
    const clinGrid = document.createElement('div');
    clinGrid.className = 'two-col';
    clinGrid.appendChild(textInput({
      label: 'Clinician Name',
      section: 'signatureConsent', field: 'clinicianName', required: true
    }));
    clinGrid.appendChild(textInput({
      label: 'Clinician Role',
      section: 'signatureConsent', field: 'clinicianRole',
      placeholder: 'e.g. Consultant Surgeon', required: true
    }));
    card.appendChild(clinGrid);
    card.appendChild(textInput({
      label: 'Clinician Signature Date',
      section: 'signatureConsent', field: 'clinicianSignatureDate',
      type: 'date'
    }));

    card.appendChild(subHeader('Interpreter (if applicable)'));
    card.appendChild(radioGroup({
      label: 'Was an interpreter used?',
      section: 'signatureConsent', field: 'interpreterUsed',
      options: yesNo
    }));
    const interpDetails = document.createElement('div');
    interpDetails.dataset.conditional = 'signatureConsent.interpreterUsed=yes';
    interpDetails.appendChild(textInput({
      label: 'Interpreter Name',
      section: 'signatureConsent', field: 'interpreterName'
    }));
    card.appendChild(interpDetails);

    return card;
  }

  // ----------------------------------------------------------------------
  // Conditional sections
  // ----------------------------------------------------------------------

  function updateConditionalSections() {
    document.querySelectorAll('[data-conditional]').forEach((host) => {
      const expr = host.getAttribute('data-conditional');
      const eqIdx = expr.indexOf('=');
      const path = expr.slice(0, eqIdx);
      const target = expr.slice(eqIdx + 1);
      const dotIdx = path.indexOf('.');
      const section = path.slice(0, dotIdx);
      const field = path.slice(dotIdx + 1);
      const current = state[section] ? state[section][field] : undefined;
      host.style.display = String(current) === target ? '' : 'none';
    });
  }

  // ----------------------------------------------------------------------
  // Progress + step-list
  // ----------------------------------------------------------------------

  const STEP_DEFINITIONS = [
    { step: 1, section: 'patientInformation',      title: 'Patient Information' },
    { step: 2, section: 'procedureDetails',        title: 'Procedure Details' },
    { step: 3, section: 'risksBenefits',           title: 'Risks & Benefits' },
    { step: 4, section: 'alternativeTreatments',   title: 'Alternative Treatments' },
    { step: 5, section: 'anesthesiaInformation',   title: 'Anesthesia Information' },
    { step: 6, section: 'questionsUnderstanding',  title: 'Questions & Understanding' },
    { step: 7, section: 'patientRights',           title: 'Patient Rights' },
    { step: 8, section: 'signatureConsent',        title: 'Signature & Consent' }
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
      li.setAttribute('aria-label', 'Step ' + def.step + ': ' + def.title);
      li.innerHTML = '<span>' + esc(def.title) + '</span>';
      li.addEventListener('click', () => {
        const target = document.getElementById('step-' + def.step);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      ol.appendChild(li);
    }
  }

  function updateProgress() {
    const rules = NS.validationRules;
    const total = rules.length;
    let answered = 0;
    const sectionAnswered = {};
    const sectionTotal = {};
    for (const rule of rules) {
      sectionTotal[rule.section] = (sectionTotal[rule.section] || 0) + 1;
      const v = state[rule.section] ? state[rule.section][rule.field] : undefined;
      if (v !== '' && v !== null && v !== undefined) {
        answered++;
        sectionAnswered[rule.section] = (sectionAnswered[rule.section] || 0) + 1;
      }
    }
    const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
    const bar = document.getElementById('progress');
    if (bar) bar.value = percent;
    const text = document.getElementById('progress-text');
    if (text) {
      text.textContent = answered + ' of ' + total + ' required fields answered (' + percent + '%)';
    }
    updateStepListStatuses(sectionAnswered, sectionTotal);
  }

  function updateStepListStatuses(sectionAnswered, sectionTotal) {
    const ol = document.getElementById('step-list');
    if (!ol) return;
    let firstUnfinished = -1;
    for (const def of STEP_DEFINITIONS) {
      const li = ol.querySelector('[data-step="' + def.step + '"]');
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
    const current = ol.querySelector('[data-step="' + firstUnfinished + '"]');
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
    const el = document.getElementById(id + '-error');
    if (el) el.textContent = '';
    const input = document.getElementById(id);
    if (input) input.removeAttribute('aria-invalid');
    // Also clear on the fieldset wrapper for radio groups
    const fs = document.getElementById(id + '-fieldset');
    if (fs) fs.removeAttribute('aria-invalid');
  }

  function setFieldError(id, message) {
    const el = document.getElementById(id + '-error');
    if (el) el.textContent = message;
    const input = document.getElementById(id);
    if (input) input.setAttribute('aria-invalid', 'true');
  }

  function validateForm() {
    const errors = [];
    const rules = NS.validationRules;
    for (const rule of rules) {
      const value = state[rule.section] ? state[rule.section][rule.field] : undefined;
      const id = rule.section + '-' + rule.field;
      if (value === '' || value === null || value === undefined) {
        errors.push({ id: id, message: rule.message });
        setFieldError(id, rule.message);
      } else {
        clearFieldError(id);
      }
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
    summary.innerHTML =
      '<strong>Please correct the following:</strong>' +
      '<ul>' +
      errors.map((e) =>
        '<li><a href="#' + esc(e.id) + '">' + esc(e.message) + '</a></li>'
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

    const { completenessPercent, status, firedRules, additionalFlags, timestamp } = lastResult;

    const flagsList = additionalFlags.length === 0
      ? '<p class="muted">No additional flags raised.</p>'
      : '<ul class="flags">' +
        additionalFlags.map((f) =>
          '<li class="' + priorityClass(f.priority) + '">' +
          '<span class="flag-priority">' + esc(f.priority.toUpperCase()) + '</span>' +
          '<span class="flag-category">' + esc(f.category) + '</span>' +
          '<span class="flag-message">' + esc(f.message) + '</span>' +
          '</li>'
        ).join('') +
        '</ul>';

    const firedRows = firedRules.length === 0
      ? '<p class="muted">All required fields are complete.</p>'
      : '<table class="subscales">' +
        '<thead><tr>' +
        '<th scope="col">ID</th>' +
        '<th scope="col">Section</th>' +
        '<th scope="col">Missing field</th>' +
        '</tr></thead><tbody>' +
        firedRules.map((r) =>
          '<tr>' +
          '<th scope="row">' + esc(r.id) + '</th>' +
          '<td>' + esc(r.section) + '</td>' +
          '<td>' + esc(r.description) + '</td>' +
          '</tr>'
        ).join('') +
        '</tbody></table>';

    out.innerHTML =
      '<h2>Consent To Treatment Report</h2>' +
      '<p class="muted">Generated ' + esc(new Date(timestamp).toLocaleString()) + '</p>' +

      '<h3>Form Completeness</h3>' +
      '<p class="completeness-summary">' +
      '<span class="completeness-badge ' + completenessClass(completenessPercent) + '">' +
      completenessLabel(completenessPercent) + '</span>' +
      '<span class="status-label">' + esc(status) + '</span>' +
      '</p>' +

      '<h3>Missing required fields</h3>' +
      firedRows +

      '<h3>Flagged Issues</h3>' +
      flagsList +

      '<div class="report-actions">' +
      '<button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>' +
      '</div>';

    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const startBtn = document.getElementById('start-over-btn');
    if (startBtn) startBtn.addEventListener('click', startOver);
  }

  function submitForm() {
    // Run UI-level validation (per-field errors + summary) but do not block
    // the report — the engine itself reports missing-fields in firedRules.
    validateForm();
    const v = validateFormEngine(state);
    const additionalFlags = detectAdditionalFlags(state);
    lastResult = {
      completenessPercent: v.completeness,
      status: v.status,
      firedRules: v.firedRules,
      additionalFlags: additionalFlags,
      timestamp: new Date().toISOString()
    };
    renderReport();
  }

  function startOver() {
    if (!confirm('Clear all answers and start a fresh consent form?')) return;
    clearState();
    state = emptyAssessment();
    lastResult = null;
    const report = document.getElementById('report');
    if (report) {
      report.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
    }
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
})();
