(() => {
  'use strict';

  const TOTAL_STEPS = 8;
  const STORAGE_KEY = 'icvp-form-state';

  const state = loadState();
  const wizard = document.getElementById('wizard');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const progress = document.getElementById('progress');
  const firedRulesList = document.getElementById('firedRules');
  const preview = document.getElementById('preview');
  const generate = document.getElementById('generate');

  // Build the progress dots.
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.textContent = String(i);
    dot.addEventListener('click', () => setStep(i));
    progress.appendChild(dot);
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
    [...progress.children].forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx + 1 === state.step);
    });
    prev.disabled = state.step === 1;
    next.disabled = state.step === TOTAL_STEPS;
    if (state.step === TOTAL_STEPS) renderSummary();
  }

  // Embedded validation engine — VAL001..VAL012.
  function validateCertificate(data) {
    const fired = [];
    const today = new Date().toISOString().slice(0, 10);
    const vaccDate = data.entryVaccinationDate || '';
    const disease = data.entryDisease || '';
    const validityStart = data.entryValidityStartsOn || '';
    const validityEnd = data.entryValidityEndsOn || '';

    // VAL001
    if (vaccDate && vaccDate > today) {
      fired.push({ code: 'VAL001', severity: 'error', message: 'Vaccination date is in the future.' });
    }
    // VAL002
    if (vaccDate && validityStart && validityStart < vaccDate) {
      fired.push({ code: 'VAL002', severity: 'error', message: 'Validity start is before vaccination date.' });
    }
    // VAL003
    if (disease === 'yellow-fever' && vaccDate && validityStart) {
      const expected = addDays(vaccDate, 10);
      if (validityStart !== expected) {
        fired.push({ code: 'VAL003', severity: 'error', message: 'Yellow-fever validity start must be vaccination date + 10 days.' });
      }
    }
    // VAL004
    if (disease === 'yellow-fever' && !validityEnd && (data.entryValidityIsLifetime !== 'yes')) {
      fired.push({ code: 'VAL004', severity: 'warning', message: 'Yellow-fever validity end overridden to lifetime per 2016 IHR amendment.' });
    }
    // VAL005
    if (!data.entryManufacturer || !data.entryBatchNumber) {
      fired.push({ code: 'VAL005', severity: 'error', message: 'Manufacturer and batch number are required.' });
    }
    // VAL006
    if (!data.entryClinicianProfessionalStatus) {
      fired.push({ code: 'VAL006', severity: 'error', message: 'Supervising clinician signature/professional status is required.' });
    }
    // VAL007
    if (data.entryCentreStampApplied !== 'yes') {
      fired.push({ code: 'VAL007', severity: 'error', message: 'Official centre stamp is required.' });
    }
    // VAL008 / VAL009 — age window for yellow fever (9 months .. 60 years)
    if (disease === 'yellow-fever' && data.patientBirthDate && vaccDate) {
      const ageMonths = monthsBetween(data.patientBirthDate, vaccDate);
      if (ageMonths < 9) {
        fired.push({ code: 'VAL008', severity: 'warning', message: 'Vaccinee is younger than 9 months; yellow-fever vaccination is contraindicated.' });
      }
      if (ageMonths / 12 > 60) {
        fired.push({ code: 'VAL009', severity: 'warning', message: 'Vaccinee is older than 60 years; yellow-fever vaccination needs clinician review.' });
      }
    }
    // VAL010
    if (data.declaredPregnancy === 'yes' || data.declaredBreastfeeding === 'yes') {
      fired.push({ code: 'VAL010', severity: 'warning', message: 'Vaccinee declared pregnancy/breastfeeding; yellow-fever vaccination is contraindicated.' });
    }
    // VAL011
    if (data.declaredImmunosuppression === 'yes') {
      fired.push({ code: 'VAL011', severity: 'warning', message: 'Vaccinee declared immunosuppression; yellow-fever vaccination is contraindicated.' });
    }
    // VAL012 — not enforced in the static form; the printed certificate uses English by default.

    return { overallValid: fired.every((r) => r.severity !== 'error'), firedRules: fired };
  }

  function addDays(yyyymmdd, days) {
    const d = new Date(yyyymmdd + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function monthsBetween(birth, vacc) {
    const b = new Date(birth + 'T00:00:00Z');
    const v = new Date(vacc + 'T00:00:00Z');
    return (v.getUTCFullYear() - b.getUTCFullYear()) * 12 + (v.getUTCMonth() - b.getUTCMonth());
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
