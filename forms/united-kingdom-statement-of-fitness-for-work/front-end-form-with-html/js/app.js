/* UK Fit Note — wizard renderer, autosave, and report generation. */

(function () {
  'use strict';
  const ns = window.FitNote;

  const STORAGE_KEY = 'united-kingdom-statement-of-fitness-for-work.front-end-form-with-html.v1';
  const TOTAL_FIELDS = 38;

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return ns.emptyFitNote();
      return mergeDeep(ns.emptyFitNote(), JSON.parse(raw));
    } catch (_) {
      return ns.emptyFitNote();
    }
  }

  function mergeDeep(target, source) {
    if (!source || typeof source !== 'object') return target;
    for (const key of Object.keys(target)) {
      if (target[key] !== null && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        target[key] = mergeDeep(target[key], source[key] || {});
      } else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
    return target;
  }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    updateProgress();
  }

  function countAnswered() {
    let n = 0;
    if (state.clinician.name) n++;
    if (state.clinician.profession) n++;
    if (state.clinician.registrationBody) n++;
    if (state.clinician.registrationNumber) n++;
    if (state.clinician.isPrivatePractice) n++;
    if (state.medicalPractice.name) n++;
    if (state.medicalPractice.postalAddressAsFullText) n++;
    if (state.medicalPractice.postcode) n++;
    if (state.medicalPractice.setting) n++;
    if (state.patient.name) n++;
    if (state.patient.birthDate) n++;
    if (state.patient.unitedKingdomNhsNumber) n++;
    if (state.patient.postalAddressAsFullText) n++;
    if (state.patient.employerName) n++;
    if (state.patient.occupation) n++;
    if (state.assessmentDate) n++;
    if (state.assessmentMethod) n++;
    if (state.generalFitnessConsidered) n++;
    if (state.diagnosisText) n++;
    if (state.diagnosisCategory) n++;
    if (state.conditionFirstRecordedDate) n++;
    if (state.isAutomaticDisability) n++;
    if (state.isNonMedical) n++;
    if (state.fitnessForWork) n++;
    if (state.fitnessForWork === 'may_be_fit') {
      if (state.adaptationPhasedReturn) n++;
      if (state.adaptationAlteredHours) n++;
      if (state.adaptationAmendedDuties) n++;
      if (state.adaptationWorkplaceAdaptations) n++;
    } else {
      n += 4; // not applicable
    }
    if (state.comments) n++;
    if (state.periodType) n++;
    if (state.periodType === 'duration' && state.periodDurationValue) n++;
    if (state.periodType === 'from_to' && state.periodFrom && state.periodTo) n++;
    if (state.willAssessAgain) n++;
    if (state.issuedVia) n++;
    if (state.issueSetting) n++;
    if (state.safeguardingConcern) n++;
    return n;
  }

  function updateProgress() {
    const answered = countAnswered();
    const pct = Math.round((answered / TOTAL_FIELDS) * 100);
    const bar = document.getElementById('progress-bar-fill');
    if (bar) bar.style.width = pct + '%';
    const meter = document.getElementById('progress-bar');
    if (meter) meter.setAttribute('aria-valuenow', String(pct));
    const text = document.getElementById('progress-text');
    if (text) text.textContent = answered + ' fields answered (' + pct + '%)';
  }

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const k of Object.keys(attrs || {})) {
      if (k === 'class') node.className = attrs[k];
      else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }

  function textField(label, getter, setter, help, type) {
    const id = 'fld-' + Math.random().toString(36).slice(2);
    return el('div', { class: 'field' },
      el('label', { for: id }, label),
      help ? el('span', { class: 'help' }, help) : null,
      el('input', {
        id,
        type: type || 'text',
        value: getter() == null ? '' : String(getter()),
        oninput: (e) => { setter(e.target.value); persist(); }
      })
    );
  }

  function textareaField(label, getter, setter, help) {
    const id = 'fld-' + Math.random().toString(36).slice(2);
    const ta = el('textarea', {
      id,
      oninput: (e) => { setter(e.target.value); persist(); }
    });
    ta.value = getter() || '';
    return el('div', { class: 'field' },
      el('label', { for: id }, label),
      help ? el('span', { class: 'help' }, help) : null,
      ta
    );
  }

  function selectField(label, options, getter, setter, help) {
    const id = 'fld-' + Math.random().toString(36).slice(2);
    const sel = el('select', { id, onchange: (e) => { setter(e.target.value); persist(); } },
      el('option', { value: '' }, '— select —'),
      ...options.map(o => {
        const opt = el('option', { value: o.value || o }, o.label || o);
        if ((o.value || o) === getter()) opt.setAttribute('selected', '');
        return opt;
      })
    );
    return el('div', { class: 'field' },
      el('label', { for: id }, label),
      help ? el('span', { class: 'help' }, help) : null,
      sel
    );
  }

  function yesNoField(label, getter, setter, help) {
    const name = 'rb-' + Math.random().toString(36).slice(2);
    const group = el('div', { class: 'radio-group' });
    [['yes', 'Yes'], ['no', 'No']].forEach(([v, l]) => {
      const rb = el('label', {},
        el('input', { type: 'radio', name, value: v, onchange: () => { setter(v); persist(); } }),
        ' ' + l
      );
      if (getter() === v) rb.querySelector('input').setAttribute('checked', '');
      group.appendChild(rb);
    });
    return el('div', { class: 'field' },
      el('label', {}, label),
      help ? el('span', { class: 'help' }, help) : null,
      group
    );
  }

  function radioField(label, options, getter, setter, help) {
    const name = 'rb-' + Math.random().toString(36).slice(2);
    const group = el('div', { class: 'radio-group' });
    options.forEach(o => {
      const v = o.value || o;
      const rb = el('label', {},
        el('input', { type: 'radio', name, value: v, onchange: () => { setter(v); persist(); render(); } }),
        ' ' + (o.label || o)
      );
      if (getter() === v) rb.querySelector('input').setAttribute('checked', '');
      group.appendChild(rb);
    });
    return el('div', { class: 'field' },
      el('label', {}, label),
      help ? el('span', { class: 'help' }, help) : null,
      group
    );
  }

  function section(num, title, ...fields) {
    return el('fieldset', {},
      el('legend', {}, 'Step ' + num + ' — ' + title),
      ...fields
    );
  }

  function render() {
    const root = document.getElementById('form-sections');
    root.innerHTML = '';

    root.appendChild(section(1, 'Issuer (healthcare professional)',
      textField('Full name', () => state.clinician.name, v => state.clinician.name = v, 'Required (DWP policy 3.7).'),
      selectField('Profession', ns.PROFESSIONS, () => state.clinician.profession, v => state.clinician.profession = v),
      selectField('Registration body', ['GMC','NMC','HCPC','GPhC','other'], () => state.clinician.registrationBody, v => state.clinician.registrationBody = v),
      textField('Registration number', () => state.clinician.registrationNumber, v => state.clinician.registrationNumber = v),
      yesNoField('Private practice?', () => state.clinician.isPrivatePractice, v => state.clinician.isPrivatePractice = v),
      textField('Medical practice name', () => state.medicalPractice.name, v => state.medicalPractice.name = v),
      textareaField('Practice postal address', () => state.medicalPractice.postalAddressAsFullText, v => state.medicalPractice.postalAddressAsFullText = v, 'Required (DWP policy 3.7).'),
      textField('Postcode', () => state.medicalPractice.postcode, v => state.medicalPractice.postcode = v),
      selectField('Care setting', ['primary_care','secondary_care_inpatient','secondary_care_discharge','occupational_health','pharmacy','community_clinic','private_practice'], () => state.medicalPractice.setting, v => state.medicalPractice.setting = v)
    ));

    root.appendChild(section(2, 'Patient',
      textField('Patient full name', () => state.patient.name, v => state.patient.name = v),
      textField('Date of birth', () => state.patient.birthDate, v => state.patient.birthDate = v, '', 'date'),
      textField('NHS number', () => state.patient.unitedKingdomNhsNumber, v => state.patient.unitedKingdomNhsNumber = v, '10 digits'),
      textareaField('Postal address', () => state.patient.postalAddressAsFullText, v => state.patient.postalAddressAsFullText = v),
      textField('Employer name', () => state.patient.employerName, v => state.patient.employerName = v),
      textField('Occupation', () => state.patient.occupation, v => state.patient.occupation = v)
    ));

    root.appendChild(section(3, 'Assessment',
      textField('Assessment date', () => state.assessmentDate, v => state.assessmentDate = v, '', 'date'),
      selectField('Assessment method', ns.ASSESSMENT_METHODS, () => state.assessmentMethod, v => state.assessmentMethod = v, 'DWP policy 3.1.'),
      yesNoField('Considered fitness for work in general?', () => state.generalFitnessConsidered, v => state.generalFitnessConsidered = v, 'DWP policy 5.1.')
    ));

    root.appendChild(section(4, 'Diagnosis',
      textareaField('Condition(s) causing absence', () => state.diagnosisText, v => state.diagnosisText = v),
      textField('SNOMED CT code (optional)', () => state.diagnosisSnomedCode, v => state.diagnosisSnomedCode = v),
      textField('SNOMED display (optional)', () => state.diagnosisSnomedDisplay, v => state.diagnosisSnomedDisplay = v),
      selectField('Diagnosis category', ns.DIAGNOSIS_CATEGORIES, () => state.diagnosisCategory, v => state.diagnosisCategory = v),
      textField('Condition first recorded date', () => state.conditionFirstRecordedDate, v => state.conditionFirstRecordedDate = v, 'Drives the first-6-months rule.', 'date'),
      yesNoField('Automatic disability (HIV / cancer / MS)?', () => state.isAutomaticDisability, v => state.isAutomaticDisability = v, 'Equality Act 2010 s.6.'),
      yesNoField('Reason is non-medical?', () => state.isNonMedical, v => state.isNonMedical = v, 'DWP policy 3.6: cannot issue fit notes for non-medical reasons.')
    ));

    root.appendChild(section(5, 'Fitness for work',
      radioField('I advise that the patient is:', [
        { value: 'not_fit',    label: 'Not fit for work' },
        { value: 'may_be_fit', label: 'May be fit for work taking account of the following advice' },
      ], () => state.fitnessForWork, v => state.fitnessForWork = v, 'A fit note cannot certify someone "fit for work" (DWP policy 3.2).')
    ));

    if (state.fitnessForWork === 'may_be_fit') {
      root.appendChild(section(6, 'Adaptations (tick all that apply)',
        yesNoField('Phased return to work', () => state.adaptationPhasedReturn, v => state.adaptationPhasedReturn = v),
        yesNoField('Altered hours', () => state.adaptationAlteredHours, v => state.adaptationAlteredHours = v),
        yesNoField('Amended duties', () => state.adaptationAmendedDuties, v => state.adaptationAmendedDuties = v),
        yesNoField('Workplace adaptations', () => state.adaptationWorkplaceAdaptations, v => state.adaptationWorkplaceAdaptations = v)
      ));
    }

    root.appendChild(section(7, 'Comments',
      textareaField('Advice about what the patient can do at work', () => state.comments, v => state.comments = v, 'Be practical (DWP policy 5.6); e.g. "no heavy lifting", "should not drive", "take regular breaks if using a display screen".')
    ));

    root.appendChild(section(8, 'Period',
      radioField('Period entry mode', [
        { value: 'duration', label: 'Duration (e.g. 4 weeks)' },
        { value: 'from_to',  label: 'From a date to a date' },
      ], () => state.periodType, v => state.periodType = v),
      state.periodType === 'duration' ? textField('Duration value', () => state.periodDurationValue, v => state.periodDurationValue = v ? Number(v) : null, '', 'number') : null,
      state.periodType === 'duration' ? selectField('Duration unit', ['days','weeks','months'], () => state.periodDurationUnit, v => state.periodDurationUnit = v) : null,
      state.periodType === 'from_to'  ? textField('From', () => state.periodFrom, v => state.periodFrom = v, '', 'date') : null,
      state.periodType === 'from_to'  ? textField('To',   () => state.periodTo,   v => state.periodTo   = v, '', 'date') : null
    ));

    root.appendChild(section(9, 'Follow-up',
      yesNoField('Will assess again at the end of this period?', () => state.willAssessAgain, v => state.willAssessAgain = v),
      state.willAssessAgain === 'yes' ? textField('Planned review date', () => state.plannedReviewDate, v => state.plannedReviewDate = v, '', 'date') : null
    ));

    root.appendChild(section(10, 'Sign-off',
      selectField('Issued via', ['digital','printed_computer_generated','printed_handwritten'], () => state.issuedVia, v => state.issuedVia = v),
      selectField('Issue setting', ['primary_care','secondary_care_discharge','occupational_health','pharmacy','community'], () => state.issueSetting, v => state.issueSetting = v),
      yesNoField('Safeguarding concern raised?', () => state.safeguardingConcern, v => state.safeguardingConcern = v),
      state.safeguardingConcern === 'yes' ? textareaField('Safeguarding notes (not printed on the fit note)', () => state.safeguardingNotes, v => state.safeguardingNotes = v) : null
    ));

    persist();
  }

  function renderReport() {
    const grade = ns.gradeFitNote(state);
    const root = document.getElementById('report');
    root.innerHTML = '';

    const dl = el('dl', { class: 'report-grid' });
    const addRow = (k, v) => { dl.appendChild(el('dt', {}, k)); dl.appendChild(el('dd', {}, String(v || '—'))); };
    addRow('Patient',                 state.patient.name);
    addRow('NHS number',              state.patient.unitedKingdomNhsNumber);
    addRow('Issuer',                  state.clinician.name + ' (' + (state.clinician.profession || '—') + ')');
    addRow('Practice',                state.medicalPractice.name);
    addRow('Assessment date',         state.assessmentDate);
    addRow('Assessment method',       state.assessmentMethod);
    addRow('Diagnosis',               state.diagnosisText);
    addRow('Fitness category',        grade.fitnessCategory);
    addRow('Adaptation intensity',    grade.adaptationIntensity);
    addRow('Adaptation count',        grade.adaptationCount);
    addRow('Period (days)',           grade.periodDays);
    addRow('Period compliance',       grade.periodCompliance);
    addRow('First 6 months of condition', grade.isWithinFirstSixMonthsOfCondition);
    addRow('Valid?',                  grade.isValid);
    addRow('Recommendation',          grade.recommendation);
    addRow('Comments',                state.comments);

    const flags = el('ul', { class: 'flag-list' });
    grade.safetyFlags.forEach(f => {
      flags.appendChild(el('li', { class: 'flag ' + f.priority },
        el('strong', {}, f.category),
        el('p', {}, f.description),
        el('p', { class: 'flag-meta' }, 'Suggested action: ' + f.suggestedAction)
      ));
    });

    root.appendChild(el('div', { class: 'report-card' },
      el('h2', {}, 'UK Statement of Fitness for Work'),
      dl,
      el('h3', {}, 'Safety flags (' + grade.safetyFlags.length + ')'),
      grade.safetyFlags.length === 0 ? el('p', {}, 'No flags fired.') : flags
    ));

    root.scrollIntoView({ behavior: 'smooth' });
  }

  function reset() {
    if (!confirm('Discard the current fit note and start again?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = ns.emptyFitNote();
    render();
    document.getElementById('report').innerHTML = '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    document.getElementById('submit-btn').addEventListener('click', renderReport);
    document.getElementById('reset-btn').addEventListener('click', reset);
  });
})();
