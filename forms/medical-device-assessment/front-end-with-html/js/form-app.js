// Medical Device Assessment - single-page wizard (vanilla ES module).
//
// Renders the nine steps defined in steps.js as one continuous page of
// fieldsets. Questions that do not apply to the current answers are hidden
// (never cleared). Every edit autosaves to localStorage; "Submit" runs the
// pure engine (device-grader.js) and renders the report inline.

import { gradeDevice } from './device-grader.js';
import { submitAssessment } from './api.js';
import { classLabel, emptyAssessment, READINESS_LABELS, ROUTE_LABELS } from './types.js';
import { STEPS, YN } from './steps.js';

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const SLUG = 'medical-device-assessment';
const STORAGE_KEY = 'medical-device-assessment.front-end-with-html.v1';

// Merge a possibly partial or foreign-shaped object onto a fresh default
// state, keeping only known keys. Shared by localStorage restore and JSON
// import (js/form-import.js via window.__FORM_STATE__.setState).
function mergeIntoDefaults(parsed) {
  const fresh = emptyAssessment();
  if (!parsed || typeof parsed !== 'object') return fresh;
  for (const key of Object.keys(fresh)) {
    const v = parsed[key];
    if (v === undefined) continue;
    if (fresh[key] && typeof fresh[key] === 'object') {
      if (v && typeof v === 'object') fresh[key] = { ...fresh[key], ...v };
    } else {
      fresh[key] = v;
    }
  }
  return fresh;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? mergeIntoDefaults(JSON.parse(raw)) : emptyAssessment();
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save assessment to localStorage.', e);
  }
}

// Captured before loadState() so js/restore-banner.js can tell a restored
// draft from a blank first visit.
let hadDraftAtLoad = false;
try {
  hadDraftAtLoad = localStorage.getItem(STORAGE_KEY) !== null;
} catch (e) {
  // Ignore; loadState() hits the same failure and falls back safely.
}

let state = loadState();

window.__FORM_STATE__ = {
  slug: SLUG,
  hadDraftAtLoad,
  getState: () => state,
  setState: (raw) => {
    state = mergeIntoDefaults(raw);
    saveState();
    resetReport();
    renderForm();
    refresh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getPath(path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), state);
}

function setPath(path, value) {
  const keys = path.split('.');
  let o = state;
  for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
  o[keys[keys.length - 1]] = value;
}

const idFor = (path) => 'f-' + path.replace(/\./g, '-');

function isAnswered(value) {
  return value !== '' && value !== null && value !== undefined;
}

// ----------------------------------------------------------------------
// Rendering the fields
// ----------------------------------------------------------------------

function renderField(field) {
  const id = idFor(field.path);
  const value = getPath(field.path);
  const wrap = document.createElement('div');
  wrap.className = 'field';
  wrap.dataset.path = field.path;
  const hintId = field.hint ? `${id}-hint` : '';
  const hint = field.hint ? `<span class="hint" id="${hintId}">${esc(field.hint)}</span>` : '';
  const err = `<span class="error-message" id="${id}-error" aria-live="polite"></span>`;
  const req = field.required ? ' <span class="req" aria-hidden="true">*</span>' : '';
  const describedBy = hintId ? ` aria-describedby="${hintId}"` : '';

  if (field.type === 'yn') {
    const labelId = `${id}-label`;
    const radios = YN.map((o) => `
      <label for="${id}-${o.value}">
        <input class="radio-input" type="radio" id="${id}-${o.value}" name="${id}" value="${o.value}"${value === o.value ? ' checked' : ''}>
        <span>${esc(o.label)}</span>
      </label>`).join('');
    wrap.innerHTML = `
      <span class="label" id="${labelId}">${esc(field.label)}</span>
      ${hint}
      <div class="radio-group" role="radiogroup" aria-labelledby="${labelId}"${describedBy}>${radios}</div>
      ${err}`;
    return wrap;
  }

  let control;
  if (field.type === 'select') {
    const blank = field.blankLabel === undefined ? 'Select...' : field.blankLabel;
    const opts = (blank === null ? '' : `<option value="">${esc(blank)}</option>`) + field.options
      .map((o) => `<option value="${esc(o.value)}"${value === o.value ? ' selected' : ''}>${esc(o.label)}</option>`)
      .join('');
    control = `<select class="select" id="${id}" data-path="${field.path}"${describedBy}>${opts}</select>`;
  } else if (field.type === 'textarea') {
    control = `<textarea class="text-area-input" id="${id}" data-path="${field.path}" rows="3"${describedBy}${field.required ? ' data-required' : ''}>${esc(value)}</textarea>`;
  } else {
    const cls = { text: 'text-input', email: 'email-input', tel: 'tel-input', date: 'date-input' }[field.type];
    control = `<input class="${cls}" type="${field.type}" id="${id}" data-path="${field.path}" value="${esc(value ?? '')}"${describedBy}>`;
  }
  wrap.innerHTML = `<label class="label" for="${id}">${esc(field.label)}${req}</label>${hint}${control}${err}`;
  return wrap;
}

function renderStep(def) {
  const fs = document.createElement('fieldset');
  fs.className = 'fieldset';
  fs.id = `step-${def.step}`;
  fs.innerHTML = `
    <legend class="fieldset-legend"><span class="section-step">Step ${def.step} of ${STEPS.length}</span> <span class="section-title">${esc(def.title)}</span></legend>
    <p class="section-description">${esc(def.description)}</p>`;
  for (const f of def.fields) fs.appendChild(renderField(f));
  if (def.step === STEPS.length) {
    const live = document.createElement('div');
    live.className = 'alert';
    live.dataset.type = 'info';
    live.id = 'live-class';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    fs.insertBefore(live, fs.children[2]);
  }
  return fs;
}

function renderForm() {
  const host = document.getElementById('form-sections');
  host.innerHTML = '';
  for (const def of STEPS) host.appendChild(renderStep(def));
}

function renderStepList() {
  const ol = document.getElementById('step-list');
  ol.innerHTML = '';
  for (const def of STEPS) {
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

// ----------------------------------------------------------------------
// Live refresh: conditional visibility, progress, step list, class readout
// ----------------------------------------------------------------------

function refresh() {
  const live = gradeDevice(state);
  let answered = 0;
  let total = 0;
  const sectionAnswered = {};
  const sectionTotal = {};

  for (const def of STEPS) {
    sectionAnswered[def.step] = 0;
    sectionTotal[def.step] = 0;
    for (const f of def.fields) {
      const wrap = document.querySelector(`[data-path="${f.path}"].field`);
      const visible = f.show ? f.show(state, live) : true;
      if (wrap) {
        wrap.hidden = !visible;
        wrap.style.display = visible ? '' : 'none'; // .field's display would otherwise defeat [hidden]
      }
      if (!visible) continue;
      // The status select always has a value and the final-class select's
      // blank is a valid choice, so neither counts toward progress.
      if (f.path === 'status' || f.path === 'finalDeviceClass') continue;
      total++;
      sectionTotal[def.step]++;
      if (isAnswered(getPath(f.path))) {
        answered++;
        sectionAnswered[def.step]++;
      }
    }
  }

  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = pct;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} fields answered (${pct}%)`;

  const ol = document.getElementById('step-list');
  let firstOpen = -1;
  for (const def of STEPS) {
    const li = ol.querySelector(`[data-step="${def.step}"]`);
    const a = sectionAnswered[def.step];
    const t = sectionTotal[def.step];
    li.removeAttribute('aria-current');
    if (t > 0 && a === t) li.dataset.status = 'finished';
    else if (a > 0) {
      li.dataset.status = 'in-progress';
      if (firstOpen === -1) firstOpen = def.step;
    } else li.dataset.status = 'waiting';
  }
  if (firstOpen === -1) {
    firstOpen = STEPS.findIndex((d) => sectionAnswered[d.step] < sectionTotal[d.step]) + 1 || STEPS.length;
  }
  const current = ol.querySelector(`[data-step="${firstOpen}"]`);
  if (current) {
    current.setAttribute('aria-current', 'step');
    if (current.dataset.status === 'waiting') current.dataset.status = 'in-progress';
  }
  ol.dataset.current = String(firstOpen - 1);

  const liveEl = document.getElementById('live-class');
  if (liveEl) {
    liveEl.textContent = live.computedDeviceClass
      ? `Computed class: ${classLabel(live.computedDeviceClass)}. Determining rule ${live.determiningRule}.`
      : 'Computed class: not yet determined. Complete the intended purpose and device kind (step 2 and 3).';
  }
}

function onFieldEvent(e) {
  const el = e.target;
  if (!(el instanceof HTMLElement)) return;
  if (el.matches('input.radio-input')) {
    const path = el.closest('.field').dataset.path;
    if (el.checked) setPath(path, el.value);
  } else if (el.dataset && el.dataset.path) {
    const path = el.dataset.path;
    const v = el.value;
    setPath(path, el.type === 'date' ? (v === '' ? null : v) : v);
  } else {
    return;
  }
  saveState();
  refresh();
}

// ----------------------------------------------------------------------
// Submit / report
// ----------------------------------------------------------------------

function priorityClass(p) {
  return p === 'high' ? 'flag-high' : p === 'medium' ? 'flag-medium' : 'flag-low';
}

function renderErrorSummary(errors) {
  const summary = document.getElementById('error-summary');
  if (errors.length === 0) {
    summary.hidden = true;
    summary.innerHTML = '';
    return;
  }
  summary.hidden = false;
  summary.innerHTML = `<strong>Please correct the following:</strong><ul>${errors
    .map((e) => `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`)
    .join('')}</ul>`;
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  summary.focus({ preventScroll: true });
}

function validate(result) {
  const errors = [];
  const id = idFor('overrideReason');
  const needsReason = state.finalDeviceClass !== '' && state.finalDeviceClass !== result.computedDeviceClass;
  const errEl = document.getElementById(`${id}-error`);
  const input = document.getElementById(id);
  if (needsReason && state.overrideReason.trim() === '') {
    const message = 'Override reason is required when the final class differs from the computed class';
    errors.push({ id, message });
    if (errEl) errEl.textContent = message;
    if (input) input.setAttribute('aria-invalid', 'true');
  } else {
    if (errEl) errEl.textContent = '';
    if (input) input.removeAttribute('aria-invalid');
  }
  return errors;
}

function resetReport() {
  document.getElementById('report').innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
}

function renderReport(r) {
  const overridden = r.finalDeviceClass !== r.computedDeviceClass;
  const rules = r.firedRules.length === 0
    ? '<p class="muted">No classification rules fired.</p>'
    : `<ul class="flags">${r.firedRules.map((x) => `
        <li class="${x.ruleId === r.determiningRule ? 'flag-high' : 'flag-low'}">
          <span class="flag-priority">${esc(x.deviceClass)}</span>
          <span class="flag-category">Rule ${esc(x.annexViiiRule)} (${esc(x.category)})</span>
          <span class="flag-message">${esc(x.description)}${x.ruleId === r.determiningRule ? ' <strong>(determining rule)</strong>' : ''}</span>
        </li>`).join('')}</ul>`;
  const flags = r.additionalFlags.length === 0
    ? '<p class="muted">No flags raised.</p>'
    : `<ul class="flags">${r.additionalFlags.map((f) => `
        <li class="${priorityClass(f.priority)}">
          <span class="flag-priority">${esc(String(f.priority).toUpperCase())}</span>
          <span class="flag-category">${esc(f.category)}</span>
          <span class="flag-message">${esc(f.description)}</span>
          <span class="flag-action">${esc(f.suggestedAction)}</span>
        </li>`).join('')}</ul>`;

  document.getElementById('report').innerHTML = `
    <h2>Medical Device Assessment Report</h2>
    <p><strong>Device:</strong> ${esc(state.deviceName || 'Unnamed device')}</p>
    <table class="subscales">
      <tbody>
        <tr><th scope="row">Computed class</th><td>${esc(classLabel(r.computedDeviceClass))}</td></tr>
        <tr><th scope="row">Final class</th><td><strong>${esc(classLabel(r.finalDeviceClass, r.classSuffix))}</strong>${overridden ? ' (assessor override)' : ''}</td></tr>
        ${overridden ? `<tr><th scope="row">Override reason</th><td>${esc(r.overrideReason)}</td></tr>` : ''}
        <tr><th scope="row">Conformity route</th><td>${esc(ROUTE_LABELS[r.conformityRoute] ?? r.conformityRoute)}</td></tr>
        <tr><th scope="row">Determining rule</th><td>${esc(r.determiningRule || 'None')}</td></tr>
        <tr><th scope="row">Regulatory readiness</th><td>${esc(READINESS_LABELS[r.regulatoryReadiness] ?? r.regulatoryReadiness)}</td></tr>
      </tbody>
    </table>
    <h3>Fired rules (${r.firedRules.length})</h3>
    ${rules}
    <h3>Flags (${r.additionalFlags.length})</h3>
    ${flags}
    <div class="report-actions no-print">
      <button type="button" class="button" data-variant="secondary" id="print-btn">Print report</button>
    </div>`;
  document.getElementById('print-btn').addEventListener('click', () => window.print());
  document.getElementById('report').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Shows the outcome of saving to the back end under the report. A failure
// never hides the report or clears the localStorage draft.
function renderSaveStatus(kind, message) {
  let el = document.getElementById('save-status');
  if (!el) {
    el = document.createElement('div');
    el.id = 'save-status';
    el.className = 'alert no-print';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    const report = document.getElementById('report');
    report.insertBefore(el, report.querySelector('.report-actions'));
  }
  el.dataset.type = kind;
  el.textContent = message;
}

async function saveToBackend(result) {
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  renderSaveStatus('info', 'Saving to the server...');
  try {
    const saved = await submitAssessment(state, result);
    renderSaveStatus(
      'success',
      saved.blocked
        ? `Saved as a draft (assessment id ${saved.assessmentId}). No class could be determined, so no grade was stored.`
        : `Saved assessment ${saved.assessmentId} with ${saved.rules} rule(s) and ${saved.flags} flag(s).`
    );
  } catch (err) {
    renderSaveStatus(
      'error',
      `Could not save to the server (${err && err.message ? err.message : 'request failed'}). Your report is shown above and your draft is kept on this device; submit again when the server is back.`
    );
  } finally {
    btn.disabled = false;
  }
}

async function submitForm() {
  const result = gradeDevice(state);
  const errors = validate(result);
  renderErrorSummary(errors);
  if (errors.length > 0) return;
  renderReport(result);
  await saveToBackend(result);
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh assessment?')) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored assessment.', e);
  }
  state = emptyAssessment();
  resetReport();
  renderForm();
  refresh();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function init() {
  renderStepList();
  renderForm();
  refresh();
  const form = document.getElementById('assessment-form');
  form.addEventListener('input', onFieldEvent);
  form.addEventListener('change', onFieldEvent);
  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
