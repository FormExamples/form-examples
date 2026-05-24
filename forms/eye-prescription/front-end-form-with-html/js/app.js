// Eye Prescription — form binding, computation, report.
//
// State lives in `state` and is bound to `data-bind="<section>.<field>"`
// inputs via a single delegated `input`/`change` listener. Numbers go to
// the schema as numbers (snapped to 0.25 D where appropriate); empty
// becomes null. Booleans use `data-bind-bool`. Re-classification is
// debounced via requestAnimationFrame.

(function () {
  'use strict';
  const NS = window.EyePrescription;
  const { emptyPrescription, snapQuarter, classify, suggestExpiry } = NS;

  const STORAGE_KEY = 'eye-prescription.front-end-form-with-html.v1';

  // ------------------------------------------------------------------
  // Persistence
  // ------------------------------------------------------------------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyPrescription();
      const parsed = JSON.parse(raw);
      return mergeDeep(emptyPrescription(), parsed);
    } catch (e) {
      console.warn('Could not parse saved prescription; starting fresh.', e);
      return emptyPrescription();
    }
  }
  function saveState(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
    catch (e) { console.warn('Could not save to localStorage.', e); }
  }
  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); }
    catch (e) { /* ignore */ }
  }
  function mergeDeep(target, src) {
    if (!src || typeof src !== 'object') return target;
    for (const k of Object.keys(target)) {
      if (src[k] === undefined) continue;
      if (target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])) {
        target[k] = mergeDeep(target[k], src[k]);
      } else {
        target[k] = src[k];
      }
    }
    return target;
  }

  let state = loadState();
  let rafHandle = 0;

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function setPath(obj, path, value) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    cur[parts[parts.length - 1]] = value;
  }
  function getPath(obj, path) {
    return path.split('.').reduce((a, k) => (a == null ? null : a[k]), obj);
  }
  function fmt(n, digits = 2) {
    if (n === null || n === undefined || n === '') return '—';
    if (typeof n === 'number') {
      const s = n.toFixed(digits);
      return n > 0 ? '+' + s : s;
    }
    return String(n);
  }

  const NUMERIC_QUARTER_PATHS = new Set([
    'rightEye.sphereDiopters', 'leftEye.sphereDiopters',
    'rightEye.cylinderDiopters', 'leftEye.cylinderDiopters',
    'rightEye.additionDiopters', 'leftEye.additionDiopters',
    'rightEye.intermediateAdditionDiopters', 'leftEye.intermediateAdditionDiopters',
    'rightEye.prismHorizontalDiopters', 'rightEye.prismVerticalDiopters',
    'leftEye.prismHorizontalDiopters', 'leftEye.prismVerticalDiopters',
    'examination.priorSphereRight', 'examination.priorSphereLeft'
  ]);

  // ------------------------------------------------------------------
  // Render initial values
  // ------------------------------------------------------------------
  function hydrateInputs() {
    document.querySelectorAll('[data-bind]').forEach(el => {
      const path = el.getAttribute('data-bind');
      const v = getPath(state, path);
      if (v === null || v === undefined) {
        el.value = '';
      } else {
        el.value = String(v);
      }
    });
    document.querySelectorAll('[data-bind-bool]').forEach(el => {
      const path = el.getAttribute('data-bind-bool');
      const v = getPath(state, path);
      el.checked = !!v;
    });
  }

  // ------------------------------------------------------------------
  // Input handler
  // ------------------------------------------------------------------
  function onInput(ev) {
    const el = ev.target;
    if (!(el instanceof HTMLElement)) return;

    const path = el.getAttribute('data-bind');
    const boolPath = el.getAttribute('data-bind-bool');

    if (path) {
      let value = el.value;
      const t = el.tagName;
      const isNumber = t === 'INPUT' && el.type === 'number';
      if (isNumber) {
        value = value === '' ? null : Number(value);
        if (NUMERIC_QUARTER_PATHS.has(path) && ev.type === 'change') {
          value = snapQuarter(value);
          el.value = value === null ? '' : String(value);
        }
      }
      setPath(state, path, value);

      if (path === 'examination.examinationDate' && !state.examination.issueDate) {
        state.examination.issueDate = value || '';
        const inp = document.querySelector('[data-bind="examination.issueDate"]');
        if (inp) inp.value = state.examination.issueDate;
      }
      if (path === 'examination.issueDate' || path === 'patient.birthDate') {
        if (state.examination.issueDate && state.patient.birthDate && !state.examination.expiryDate) {
          state.examination.expiryDate = suggestExpiry(state.patient.birthDate, state.examination.issueDate);
          const inp = document.querySelector('[data-bind="examination.expiryDate"]');
          if (inp) inp.value = state.examination.expiryDate;
        }
      }
    } else if (boolPath) {
      setPath(state, boolPath, el.checked);
    } else {
      return;
    }

    schedule();
  }

  function schedule() {
    if (rafHandle) cancelAnimationFrame(rafHandle);
    rafHandle = requestAnimationFrame(() => {
      saveState(state);
      updateProgress();
      updateLiveSummary();
    });
  }

  // ------------------------------------------------------------------
  // Progress
  // ------------------------------------------------------------------
  function countAnswered(s) {
    let total = 0, answered = 0;
    const visit = (o) => {
      if (o === null || o === undefined) return;
      if (typeof o !== 'object') return;
      for (const k of Object.keys(o)) {
        const v = o[k];
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          visit(v);
        } else {
          total += 1;
          if (typeof v === 'boolean') {
            if (v) answered += 1;
          } else if (v !== '' && v !== null && v !== undefined) {
            answered += 1;
          }
        }
      }
    };
    visit(s);
    return { total, answered };
  }
  function updateProgress() {
    const { total, answered } = countAnswered(state);
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
    const progress = document.getElementById('progress');
    const txt = document.getElementById('progress-text');
    if (progress) progress.value = pct;
    if (txt) txt.textContent = `${answered} of ${total} fields answered (${pct}%)`;
    updateStepListStatuses();
  }

  // -----------------------------------------------------------------
  // Step list (table of contents + completion status)
  // -----------------------------------------------------------------
  const STEP_DEFINITIONS = [
    { step: 1, title: 'Prescriber', section: 'prescriber' },
    { step: 2, title: 'Patient', section: 'patient' },
    { step: 3, title: 'Examination', section: 'examination' },
    { step: 4, title: 'Visual acuity', section: 'visualAcuity' },
    { step: 5, title: 'Right eye', section: 'rightEye' },
    { step: 6, title: 'Left eye', section: 'leftEye' },
    { step: 7, title: 'Addition', section: null },
    { step: 8, title: 'PD', section: 'pupillaryDistance' },
    { step: 9, title: 'Lens', section: 'lensRecommendation' },
    { step: 10, title: 'Ocular health', section: 'ocularHealth' },
    { step: 11, title: 'Summary', section: 'grade' },
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
      li.innerHTML = `<span>${def.title}</span>`;
      li.addEventListener('click', () => {
        const target = document.getElementById(`step-${def.step}`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      ol.appendChild(li);
    }
  }

  function sectionAnswered(sectionKey) {
    if (!sectionKey) return false;
    const sec = state[sectionKey];
    if (!sec || typeof sec !== 'object') return false;
    for (const k of Object.keys(sec)) {
      const v = sec[k];
      if (typeof v === 'boolean') { if (v) return true; }
      else if (v !== '' && v !== null && v !== undefined) return true;
    }
    return false;
  }

  function updateStepListStatuses() {
    const ol = document.getElementById('step-list');
    if (!ol) return;
    let firstUnfinished = -1;
    for (const def of STEP_DEFINITIONS) {
      const li = ol.querySelector(`[data-step="${def.step}"]`);
      if (!li) continue;
      if (sectionAnswered(def.section)) {
        li.dataset.status = 'finished';
        li.removeAttribute('aria-current');
      } else {
        li.dataset.status = 'waiting';
        if (firstUnfinished === -1) firstUnfinished = def.step;
      }
    }
    if (firstUnfinished === -1) firstUnfinished = 1;
    const current = ol.querySelector(`[data-step="${firstUnfinished}"]`);
    if (current) {
      current.setAttribute('aria-current', 'step');
      if (current.dataset.status === 'waiting') current.dataset.status = 'in-progress';
    }
    ol.dataset.current = String(firstUnfinished - 1);
  }

  // ------------------------------------------------------------------
  // Live summary on step 11
  // ------------------------------------------------------------------
  function classLabel(c) {
    if (!c || c === 'none') return '—';
    return c.replace(/-/g, ' ');
  }
  function updateLiveSummary() {
    const host = document.getElementById('live-summary');
    if (!host) return;
    const r = classify(state);
    const effective = state.grade.overrideComplexity || r.complexity;
    const flagPriorityClass = (p) =>
      p === 'high' ? 'danger' : p === 'medium' ? 'warn' : '';
    host.innerHTML = `
      <h3>Live classification</h3>
      <div class="row">
        <strong>Right eye:</strong>
        <span class="pill">${esc(classLabel(r.rightEyeSphereClass))}</span>
        <span class="pill">${esc(classLabel(r.rightEyeCylinderClass))}</span>
      </div>
      <div class="row">
        <strong>Left eye:</strong>
        <span class="pill">${esc(classLabel(r.leftEyeSphereClass))}</span>
        <span class="pill">${esc(classLabel(r.leftEyeCylinderClass))}</span>
      </div>
      <div class="row">
        <strong>Presbyopia:</strong> <span class="pill">${esc(classLabel(r.presbyopiaClass))}</span>
        <strong>Anisometropia:</strong> ${r.anisometropia === null ? '—' : fmt(r.anisometropia)} D
        <strong>Prism:</strong> ${r.prismPresent ? 'present' : 'none'}
      </div>
      <div class="row">
        <strong>Complexity:</strong>
        <span class="pill ${effective === 'complex' ? 'danger' : effective === 'moderate' ? 'warn' : ''}">${esc(effective)}</span>
        ${state.grade.overrideComplexity ? `<span class="pill">overridden from ${esc(r.complexity)}</span>` : ''}
      </div>
      <div class="row">
        <strong>Flags:</strong>
        ${r.additionalFlags.length === 0 ? '<span class="pill">none</span>' :
          r.additionalFlags.map(f =>
            `<span class="pill ${flagPriorityClass(f.priority)}">${esc(f.category)}</span>`
          ).join('')}
      </div>
    `;
  }

  // ------------------------------------------------------------------
  // Report
  // ------------------------------------------------------------------
  function renderReport() {
    const r = classify(state);
    const effective = state.grade.overrideComplexity || r.complexity;
    const host = document.getElementById('report');
    if (!host) return;
    const eye = (e) => `
      <table>
        <tr><th>Sphere</th><td>${fmt(e.sphereDiopters)}</td>
            <th>Cylinder</th><td>${fmt(e.cylinderDiopters)}</td>
            <th>Axis</th><td>${e.axisDegrees == null ? '—' : e.axisDegrees + '°'}</td></tr>
        <tr><th>Addition</th><td>${fmt(e.additionDiopters)}</td>
            <th>Prism H</th><td>${fmt(e.prismHorizontalDiopters)} ${esc(e.baseHorizontal)}</td>
            <th>Prism V</th><td>${fmt(e.prismVerticalDiopters)} ${esc(e.baseVertical)}</td></tr>
      </table>
    `;
    const flags = r.additionalFlags;
    host.innerHTML = `
      <article class="report-card">
        <h2>Spectacle prescription</h2>
        <p>
          <strong>Patient:</strong> ${esc(state.patient.name || '—')}
          (DOB ${esc(state.patient.birthDate || '—')})<br>
          <strong>Prescriber:</strong> ${esc(state.prescriber.name || '—')}
          (GOC ${esc(state.prescriber.gocRegistrationNumber || '—')})<br>
          <strong>Practice:</strong> ${esc(state.prescriber.practiceName || '—')}<br>
          <strong>Examination:</strong> ${esc(state.examination.examinationDate || '—')}
          &middot; <strong>Issue:</strong> ${esc(state.examination.issueDate || '—')}
          &middot; <strong>Expiry:</strong> ${esc(state.examination.expiryDate || '—')}
        </p>

        <h3>Right eye (OD)</h3>
        ${eye(state.rightEye)}

        <h3>Left eye (OS)</h3>
        ${eye(state.leftEye)}

        <h3>Pupillary distance</h3>
        <table>
          <tr><th>Distance total</th><td>${fmt(state.pupillaryDistance.distanceTotalMm, 1)} mm</td>
              <th>Distance R</th><td>${fmt(state.pupillaryDistance.distanceRightMm, 1)} mm</td>
              <th>Distance L</th><td>${fmt(state.pupillaryDistance.distanceLeftMm, 1)} mm</td></tr>
          <tr><th>Near total</th><td>${fmt(state.pupillaryDistance.nearTotalMm, 1)} mm</td>
              <th>Near R</th><td>${fmt(state.pupillaryDistance.nearRightMm, 1)} mm</td>
              <th>Near L</th><td>${fmt(state.pupillaryDistance.nearLeftMm, 1)} mm</td></tr>
        </table>

        <h3>Lens recommendation</h3>
        <p>
          <strong>Type:</strong> ${esc(state.lensRecommendation.lensType || '—')}
          &middot; <strong>Material:</strong> ${esc(state.lensRecommendation.material || '—')}
          ${state.lensRecommendation.aspheric ? '&middot; <em>aspheric</em>' : ''}
        </p>
        <p>
          <strong>Coatings:</strong>
          ${[
            state.lensRecommendation.coatingAntiReflective && 'AR',
            state.lensRecommendation.coatingScratchResistant && 'scratch-resistant',
            state.lensRecommendation.coatingHydrophobic && 'hydrophobic',
            state.lensRecommendation.coatingBlueLight && 'blue-light',
            state.lensRecommendation.coatingPhotochromic && 'photochromic',
            state.lensRecommendation.coatingPolarised && 'polarised',
            state.lensRecommendation.coatingUv400 && 'UV-400'
          ].filter(Boolean).join(', ') || '—'}
        </p>

        <h3>Computed classification</h3>
        <p>
          <strong>Right:</strong> ${esc(classLabel(r.rightEyeSphereClass))}, ${esc(classLabel(r.rightEyeCylinderClass))}<br>
          <strong>Left:</strong> ${esc(classLabel(r.leftEyeSphereClass))}, ${esc(classLabel(r.leftEyeCylinderClass))}<br>
          <strong>Presbyopia:</strong> ${esc(classLabel(r.presbyopiaClass))}<br>
          <strong>Anisometropia:</strong> ${r.anisometropia === null ? '—' : fmt(r.anisometropia) + ' D'}<br>
          <strong>Complexity:</strong>
          <span class="complex-pill complex-${esc(effective)}">${esc(effective)}</span>
          ${state.grade.overrideComplexity ? `(overridden from ${esc(r.complexity)} — reason: ${esc(state.grade.overrideReason || 'not given')})` : ''}
        </p>

        <h3>Safety flags (${flags.length})</h3>
        ${flags.length === 0
          ? '<p class="empty">No safety flags fired.</p>'
          : `<ul class="flag-list">${flags.map(f => `
              <li class="priority-${esc(f.priority)}">
                <span class="flag-cat">${esc(f.category)} &middot; ${esc(f.priority)} &middot; ${esc(f.eye)}</span><br>
                ${esc(f.description)}<br>
                <em>${esc(f.suggestedAction)}</em>
              </li>`).join('')}</ul>`}

        <h3>Fired rules (${r.firedRules.length})</h3>
        ${r.firedRules.length === 0
          ? '<p class="empty">No classification rules fired.</p>'
          : `<ul>${r.firedRules.map(rule => `<li><code>${esc(rule.ruleId)}</code> — ${esc(rule.description)}</li>`).join('')}</ul>`}

        <h3>Raw JSON (for export / debugging)</h3>
        <pre>${esc(JSON.stringify({ prescription: state, classification: r }, null, 2))}</pre>
      </article>
    `;
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ------------------------------------------------------------------
  // Bootstrap
  // ------------------------------------------------------------------
  function init() {
    hydrateInputs();
    renderStepList();
    document.addEventListener('input', onInput, false);
    document.addEventListener('change', onInput, false);
    document.getElementById('submit-btn').addEventListener('click', renderReport);
    document.getElementById('reset-btn').addEventListener('click', () => {
      if (!confirm('Discard all entered data and start over?')) return;
      clearState();
      state = emptyPrescription();
      hydrateInputs();
      const report = document.getElementById('report');
      if (report) report.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
      updateProgress();
      updateLiveSummary();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    updateProgress();
    updateLiveSummary();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
