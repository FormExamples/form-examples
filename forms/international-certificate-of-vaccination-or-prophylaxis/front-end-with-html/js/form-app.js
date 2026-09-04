import { validateCertificate } from './validator.js';

(() => {
  'use strict';

  const TOTAL_STEPS = 8;
  const STORAGE_KEY = 'icvp-form-state';

  const state = loadState();
  const wizard = document.getElementById('wizard');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const progress = document.getElementById('progress');
  const progressText = document.getElementById('progress-text');
  const stepList = document.getElementById('step-list');
  const firedRulesList = document.getElementById('firedRules');
  const preview = document.getElementById('preview');
  const generate = document.getElementById('generate');

  const STEP_TITLES = [
    'Centre & clinician',
    'Vaccinee identity',
    'Signature & consent',
    'Travel context',
    'Disease & vaccine',
    'Administration',
    'Validity & stamp',
    'Summary & sign-off',
  ];

  // Build the step-list items.
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const li = document.createElement('li');
    li.className = 'step-list-item';
    li.dataset.status = 'waiting';
    li.dataset.step = String(i);
    li.setAttribute('aria-label', 'Step ' + i + ': ' + STEP_TITLES[i - 1]);
    li.innerHTML = '<span>' + STEP_TITLES[i - 1] + '</span>';
    li.addEventListener('click', () => setStep(i));
    stepList.appendChild(li);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return { step: 1, data: {}, ...parsed };
    } catch (_) {
      return { step: 1, data: {} };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // Hydrate inputs from state.
  for (const [name, value] of Object.entries(state.data)) {
    const el = wizard.elements.namedItem(name);
    if (!el) continue;
    if (el.type === 'checkbox') {
      el.checked = value === 'yes' || value === true;
    } else {
      el.value = value ?? '';
    }
  }

  wizard.addEventListener('input', (event) => {
    const el = event.target;
    if (!el.name) return;
    state.data[el.name] = el.type === 'checkbox' ? (el.checked ? 'yes' : '') : el.value;
    saveState();
    if (state.step === TOTAL_STEPS) renderSummary();
  });

  prev.addEventListener('click', () => setStep(state.step - 1));
  next.addEventListener('click', () => setStep(state.step + 1));
  generate.addEventListener('click', () => {
    renderSummary();
    preview.hidden = false;
    window.print();
  });

  function setStep(n) {
    state.step = Math.max(1, Math.min(TOTAL_STEPS, n));
    saveState();
    document.querySelectorAll('fieldset.step').forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.step) === state.step);
    });
    [...stepList.children].forEach((li, idx) => {
      const stepNum = idx + 1;
      if (stepNum === state.step) {
        li.dataset.status = 'in-progress';
        li.setAttribute('aria-current', 'step');
      } else if (stepNum < state.step) {
        li.dataset.status = 'finished';
        li.removeAttribute('aria-current');
      } else {
        li.dataset.status = 'waiting';
        li.removeAttribute('aria-current');
      }
    });
    stepList.dataset.current = String(state.step - 1);
    const pct = Math.round((state.step / TOTAL_STEPS) * 100);
    if (progress) progress.value = pct;
    if (progressText) progressText.textContent = 'Step ' + state.step + ' of ' + TOTAL_STEPS;
    prev.disabled = state.step === 1;
    next.disabled = state.step === TOTAL_STEPS;
    if (state.step === TOTAL_STEPS) renderSummary();
  }

  function renderSummary() {
    const { firedRules } = validateCertificate(state.data);
    firedRulesList.innerHTML = '';
    for (const r of firedRules) {
      const li = document.createElement('li');
      li.className = r.severity;
      li.textContent = `[${r.code}] ${r.message}`;
      firedRulesList.appendChild(li);
    }
    if (firedRules.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'All checks passed.';
      firedRulesList.appendChild(li);
    }

    const d = state.data;
    preview.innerHTML = `
      <h2>International Certificate of Vaccination or Prophylaxis</h2>
      <p><strong>Vaccinee:</strong> ${escape(d.patientGivenNames)} ${escape(d.patientSurname)}
         (DOB ${escape(d.patientBirthDate)}, ${escape(d.patientSex)},
         nationality ${escape(d.patientNationalityAlpha3)})</p>
      <p><strong>Centre:</strong> ${escape(d.centreName)}
         (${escape(d.centreCountryAlpha3)})
         — WHO ref: ${escape(d.whoDesignationReference)}</p>
      <p><strong>Supervising clinician:</strong> ${escape(d.clinicianName)} (${escape(d.clinicianProfessionalStatus)},
         ${escape(d.clinicianRegistrationBody)} ${escape(d.clinicianRegistrationNumber)})</p>
      <h3>Vaccination entry</h3>
      <p><strong>Disease:</strong> ${escape(d.entryDisease)}</p>
      <p><strong>Vaccine:</strong> ${escape(d.entryVaccineName)} —
         manufacturer ${escape(d.entryManufacturer)}, batch ${escape(d.entryBatchNumber)}</p>
      <p><strong>Date of vaccination:</strong> ${escape(d.entryVaccinationDate)}</p>
      <p><strong>Validity:</strong> ${escape(d.entryValidityStartsOn)} →
         ${d.entryValidityIsLifetime === 'yes' ? 'lifetime' : escape(d.entryValidityEndsOn)}</p>
      ${d.medicalWaiver === 'yes' ? `<p><strong>Medical waiver:</strong> ${escape(d.medicalWaiverReason)}</p>` : ''}
      <p><strong>Electronic signature:</strong> ${escape(d.electronicSignature)}</p>
    `;
  }

  function escape(value) {
    return (value ?? '').toString().replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  setStep(state.step);
})();
