// Medical Information Form for Air Travel (MEDIF) - single-page wizard
// (vanilla classic-script app).
//
// The page renders all 14 wizard sections inline as HTML. This script:
//   1. tracks how many fields have been answered and updates the
//      sticky progress bar;
//   2. autosaves the partial assessment to localStorage and restores
//      it on reload;
//   3. computes the airline-aligned fitness-to-fly band, the fired
//      rules, and the safety flags;
//   4. renders the post-submit report and offers a JSON download.
//
// Field IDs use camelCase that maps 1:1 onto the snake_case SQL columns
// in ../sql/04_create_table_medical_information_form_for_air_travel.sql.
import {
  BAND_RANK, BAND_LABEL, BAND_DESK_RECOMMENDATION, FIELD_NAMES,
  isNumericField, isDateField, isAnswered, answeredCount,
  daysAgo, isoToday, worseBand, evaluateFitness
} from './engine.js';

(function () {
'use strict';

const STORAGE_KEY =
  'medical-information-form-for-air-travel.front-end-form-with-html.v1';


// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


// ----------------------------------------------------------------------
// State + persistence
// ----------------------------------------------------------------------

function collectFormData() {
  const form = document.getElementById('assessment-form');
  if (!form) return {};
  const out = {};
  for (const name of FIELD_NAMES) {
    const el = form.elements.namedItem(name);
    if (!el) {
      out[name] = isNumericField(name) || isDateField(name) ? null : '';
      continue;
    }
    if (el instanceof RadioNodeList) {
      out[name] = el.value || '';
      continue;
    }
    if (el.type === 'number') {
      out[name] = el.value === '' ? null : Number(el.value);
      continue;
    }
    if (el.type === 'date') {
      out[name] = el.value || null;
      continue;
    }
    out[name] = el.value == null ? '' : String(el.value);
  }
  return out;
}


function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {
    // localStorage may be disabled in private mode; ignore.
  }
}

function restoreState() {
  let saved;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    saved = JSON.parse(raw);
  } catch (_) {
    return;
  }
  if (!saved || typeof saved !== 'object') return;

  const form = document.getElementById('assessment-form');
  if (!form) return;
  for (const name of FIELD_NAMES) {
    const v = saved[name];
    if (v === undefined || v === null) continue;
    const el = form.elements.namedItem(name);
    if (!el) continue;
    if (el instanceof RadioNodeList) {
      for (const radio of el) {
        if (radio.value === v) radio.checked = true;
      }
    } else {
      el.value = v;
    }
  }
}

// ----------------------------------------------------------------------
// Fitness-to-fly engine
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

// Map FIELD_NAMES → step number (1..14). Mirrors index.html step grouping.
const FIELD_TO_STEP = (() => {
  const map = {};
  const groups = [
    [1, ['submitterName','submitterRole','submitterEmail','submitterPhone','submitterOrganisation','airlineBookingReference']],
    [2, ['passengerName','passengerDateOfBirth','passengerSex','passengerNationality','passengerPassportNumber','passengerNationalHealthId','passengerAddress','emergencyContact']],
    [3, ['airlineIataCode','airlineName','outboundFlightNumber','outboundDate','outboundOriginIata','outboundDestinationIata','returnFlightNumber','returnDate','cabinClass','sectorDurationMinutes','transitAirportsIata','specialAssistanceCodes']],
    [4, ['reasonEquipment','reasonRecentAcuteEvent','reasonUnstableCondition','reasonCommunicableDisease','reasonPregnancy','reasonMobilityEscort','reasonPsychiatric']],
    [5, ['physicianName','physicianSpecialty','physicianRegistrationNumber','physicianClinic','physicianEmail','physicianPhone','physicianAddress']],
    [6, ['primaryDiagnosis','icd10Codes','diagnosisDate','currentTreatment','lastAdmissionDate','lastDischargeDate','lastSpecialistReviewDate']],
    [7, ['restingSystolicBp','restingDiastolicBp','restingHeartRate','nyhaClass','recentMiDate','recentStentDate','onAnticoagulant','pacemakerOrIcd','unstableAngina','exerciseToleranceMetres']],
    [8, ['restingSpo2Percent','predictedInflightSpo2Percent','hypoxicChallengeResult','recentPneumothoraxDate','asthmaSeverity','copdSeverity','cpapOrBipapUse','recentPulmonaryEmbolismDate']],
    [9, ['lastSurgeryDate','lastSurgerySite','cabinGasRisk','recentFractureCast','recentDvtDate','scubaDivingWithin24h','recentStrokeDate']],
    [10, ['isPregnant','gestationWeeks','pregnancyType','pregnancyComplications','expectedDeliveryDate','obstetricianContact']],
    [11, ['communicableDiseaseStatus','lastSymptomDate','isolationRequired','vaccinationStatus','currentAntimicrobials']],
    [12, ['requiresSupplementalOxygen','oxygenFlowRateLpm','oxygenDuration','requiresPoc','pocMakeModel','pocBatteryHours','requiresStretcher','requiresIncubator','requiresIvPump','requiresMedicalEscort','requiresExtraSeat','requiresAccessibleLavatory','wheelchairType','accompanyingCarer']],
    [13, ['regularMedications','controlledDrugs','dangerousGoodsBatteryDeclaration','sharpsInCabin','refrigeratedMedication','customsDocumentationAvailable','haemoglobinGPerL']],
    [14, ['physicianDeclaration','physicianSignatureName','physicianSignatureDate','validUntilDate','additionalNotes']]
  ];
  for (const [step, names] of groups) {
    for (const n of names) map[n] = step;
  }
  return map;
})();

const STEP_DEFINITIONS = [
  { step: 1,  title: 'Submitter' },
  { step: 2,  title: 'Passenger' },
  { step: 3,  title: 'Trip' },
  { step: 4,  title: 'Reason' },
  { step: 5,  title: 'Physician' },
  { step: 6,  title: 'Diagnosis' },
  { step: 7,  title: 'Cardiovascular' },
  { step: 8,  title: 'Respiratory' },
  { step: 9,  title: 'Recent events' },
  { step: 10, title: 'Pregnancy' },
  { step: 11, title: 'Communicable' },
  { step: 12, title: 'In-flight needs' },
  { step: 13, title: 'Medications' },
  { step: 14, title: 'Sign-off' }
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

function updateProgress() {
  const data = collectFormData();
  const total = FIELD_NAMES.length;
  let n = 0;
  const stepAnswered = {};
  const stepTotal = {};
  for (const name of FIELD_NAMES) {
    const step = FIELD_TO_STEP[name];
    if (step) stepTotal[step] = (stepTotal[step] || 0) + 1;
    if (isAnswered(name, data[name])) {
      n++;
      if (step) stepAnswered[step] = (stepAnswered[step] || 0) + 1;
    }
  }
  const pct = total === 0 ? 0 : Math.round((n / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = pct;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${n} of ${total} fields answered (${pct}%)`;
  updateStepListStatuses(stepAnswered, stepTotal);
}

function updateStepListStatuses(stepAnswered, stepTotal) {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  for (const def of STEP_DEFINITIONS) {
    const li = ol.querySelector(`[data-step="${def.step}"]`);
    if (!li) continue;
    const a = stepAnswered[def.step] || 0;
    const t = stepTotal[def.step] || 0;
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
    if (current.dataset.status === 'waiting') current.dataset.status = 'in-progress';
  }
  ol.dataset.current = String(firstUnfinished - 1);
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
    <ul>${errors.map((e) => `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`).join('')}</ul>
  `;
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  summary.focus({ preventScroll: true });
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
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  });
  renderErrorSummary(errors);
  return errors;
}

function renderReport(data, result) {
  const root = document.getElementById('report');
  if (!root) return;

  const bandLabel = BAND_LABEL[result.band];
  const bandClass = 'band-' + result.band;

  let rulesHtml;
  if (result.firedRules.length === 0) {
    rulesHtml = '<p class="muted">No fitness-band rules fired. Default band: fit to fly.</p>';
  } else {
    rulesHtml = '<table class="rules"><thead><tr>' +
      '<th>Rule ID</th><th>Band</th><th>Description</th>' +
      '</tr></thead><tbody>' +
      result.firedRules.map((r) =>
        `<tr><td><code>${esc(r.id)}</code></td>` +
        `<td>${esc(r.band)}</td>` +
        `<td>${esc(r.description)}</td></tr>`
      ).join('') +
      '</tbody></table>';
  }

  let flagsHtml;
  if (result.safetyFlags.length === 0) {
    flagsHtml = '<p class="muted">No safety flags detected.</p>';
  } else {
    flagsHtml = '<ul class="flags">' +
      result.safetyFlags.map((f) =>
        `<li class="flag-${esc(f.priority)}">` +
        `<span class="flag-priority">${esc(f.priority)}</span>` +
        `<span class="flag-category">${esc(f.category)}</span>` +
        `<span class="flag-message">${esc(f.message)}</span>` +
        `</li>`
      ).join('') +
      '</ul>';
  }

  root.innerHTML = `
    <h2>MEDIF fitness-to-fly report</h2>
    <p class="muted">Computed ${new Date().toLocaleString()} — valid until ${esc(result.validUntil)}.</p>

    <p class="band-summary">
      <span class="band-badge ${esc(bandClass)}">${esc(bandLabel)}</span>
      <span class="muted">${esc(result.firedRules.length)} rule(s) fired, ${esc(result.safetyFlags.length)} safety flag(s).</span>
    </p>
    <p class="desk-recommendation"><strong>Airline medical desk:</strong> ${esc(result.deskRecommendation)}</p>

    <h3>Fired rules</h3>
    ${rulesHtml}

    <h3>Safety flags</h3>
    ${flagsHtml}

    <h3>Passenger / trip</h3>
    <p class="muted">
      ${esc(data.passengerName || '(passenger)')} —
      ${esc(data.airlineIataCode || '??')}${esc(data.outboundFlightNumber)}
      ${esc(data.outboundOriginIata || '???')} &rarr; ${esc(data.outboundDestinationIata || '???')}
      on ${esc(data.outboundDate || '(date TBD)')}.
    </p>

    <div class="report-actions">
      <button type="button" id="print-btn" class="button" data-variant="secondary">Print / save PDF</button>
    </div>
  `;
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const printBtn = document.getElementById('print-btn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
}

function downloadJson(data, result) {
  const payload = {
    assessment: data,
    result: result
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)],
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'medif-assessment.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ----------------------------------------------------------------------
// Wiring
// ----------------------------------------------------------------------

function onAnyChange() {
  const data = collectFormData();
  saveState(data);
  updateProgress();
}

function onSubmit() {
  const errors = validateForm();
  if (errors.length > 0) return;
  const data = collectFormData();
  saveState(data);
  const result = evaluateFitness(data);
  renderReport(data, result);
}

function onReset() {
  if (!confirm('Clear all answers and start over?')) return;
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* ignore */ }
  const form = document.getElementById('assessment-form');
  if (form) form.reset();
  const root = document.getElementById('report');
  if (root) root.innerHTML = '<p class="empty-message">Submit the form to see the fitness-to-fly report.</p>';
  renderErrorSummary([]);
  updateProgress();
}

function onDownload() {
  const data = collectFormData();
  const result = evaluateFitness(data);
  downloadJson(data, result);
}

function init() {
  renderStepList();
  restoreState();
  updateProgress();

  const form = document.getElementById('assessment-form');
  if (form) {
    form.addEventListener('input', onAnyChange);
    form.addEventListener('change', onAnyChange);
  }
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) submitBtn.addEventListener('click', onSubmit);
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', onReset);
  const dlBtn = document.getElementById('download-btn');
  if (dlBtn) dlBtn.addEventListener('click', onDownload);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
