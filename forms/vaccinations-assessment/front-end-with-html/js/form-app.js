import { createDefaultAssessment } from './data-model.js';
import { calculateVaccinationStatus } from './vaccination-grader.js';
import { detectAdditionalFlags } from './flagged-issues.js';
import { TOTAL_STEPS, steps } from './steps.js';

let data = createDefaultAssessment();

// ─── Autosave (localStorage) ───────────────────────────
// Persist the whole assessment to localStorage on every edit and rehydrate it
// on load so a partial fill survives a page reload.
const STORAGE_KEY = 'vaccinations-assessment.front-end-with-html.v1';

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save vaccinations-assessment draft to localStorage.', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) mergeInto(data, JSON.parse(raw));
  } catch (e) {
    console.warn('Could not read vaccinations-assessment draft from localStorage.', e);
  }
}

// Deep-merge a saved snapshot onto the canonical `data` shape: nested objects
// recurse, arrays and primitives are copied, unknown/renamed keys are ignored
// so the shape from createDefaultAssessment() always wins for missing keys.
function mergeInto(target, src) {
  if (!src || typeof src !== 'object') return;
  for (const key of Object.keys(target)) {
    if (!(key in src)) continue;
    const tv = target[key];
    const sv = src[key];
    if (Array.isArray(tv)) {
      if (Array.isArray(sv)) target[key] = sv;
    } else if (tv && typeof tv === 'object' && sv && typeof sv === 'object') {
      mergeInto(tv, sv);
    } else {
      target[key] = sv;
    }
  }
}

// ─── Navigation ────────────────────────────────────────
window.submitForm = function () {
  collectAllFields();
  const { level, score, firedRules } = calculateVaccinationStatus(data);
  const additionalFlags = detectAdditionalFlags(data);
  const result = {
    vaccinationLevel: level,
    vaccinationScore: score,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
  // Persist for the dashboard, then render the report inline: this is a
  // single-page wizard, so the report appears in the `#report` region below
  // the form rather than navigating away to a separate page.
  sessionStorage.setItem('vaccinationData', JSON.stringify(data));
  sessionStorage.setItem('vaccinationResult', JSON.stringify(result));
  renderReport(result);
};

// ─── Report rendering (inline, single-page) ────────────
const LEVEL_LABELS = {
  draft: 'Draft — incomplete',
  contraindicated: 'Contraindicated',
  overdue: 'Overdue',
  partiallyComplete: 'Partially complete',
  upToDate: 'Up to date'
};

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function priorityClass(p) {
  const key = String(p || '').toLowerCase();
  return key === 'high' ? 'flag-high' : key === 'medium' ? 'flag-medium' : 'flag-low';
}

function renderReport(result) {
  const out = document.getElementById('report');
  if (!out) return;

  const { vaccinationLevel, vaccinationScore, firedRules, additionalFlags } = result;
  const levelLabel = LEVEL_LABELS[vaccinationLevel] || vaccinationLevel;

  const rulesList = firedRules.length === 0
    ? `<p class="muted">No grading rules fired.</p>`
    : `<ul class="flags">${firedRules.map((r) => `
        <li class="${priorityClass(r.concernLevel)}">
          <span class="flag-priority">${esc(String(r.concernLevel || '').toUpperCase())}</span>
          <span class="flag-id">${esc(r.id)}</span>
          <span class="flag-category">${esc(r.category)}</span>
          <span class="flag-message">${esc(r.description)}</span>
        </li>`).join('')}</ul>`;

  const flagsList = additionalFlags.length === 0
    ? `<p class="muted">No additional flags.</p>`
    : `<ul class="flags">${additionalFlags.map((f) => `
        <li class="${priorityClass(f.priority)}">
          <span class="flag-priority">${esc(String(f.priority || '').toUpperCase())}</span>
          <span class="flag-id">${esc(f.id)}</span>
          <span class="flag-category">${esc(f.category)}</span>
          <span class="flag-message">${esc(f.message)}</span>
        </li>`).join('')}</ul>`;

  out.innerHTML = `
    <h2>Vaccination Assessment Report</h2>
    <p class="report-level"><strong>Status:</strong> ${esc(levelLabel)}</p>
    <p class="report-score"><strong>Score:</strong> ${esc(vaccinationScore)}</p>
    <h3>Fired rules (${firedRules.length})</h3>
    ${rulesList}
    <h3>Additional flags (${additionalFlags.length})</h3>
    ${flagsList}`;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Data binding: populate form from data ─────────────
function populateStep(step) {
  const section = document.getElementById('step-' + step);
  if (!section) return;

  // Text/select/textarea/date fields
  document.querySelectorAll('[data-field]').forEach(el => {
    const path = el.getAttribute('data-field');
    const val = getNestedValue(data, path);
    if (el.type === 'radio') {
      el.checked = (el.value === val);
    } else if (el.tagName === 'SELECT' && el.hasAttribute('data-numeric')) {
      el.value = val !== null ? String(val) : '';
    } else {
      el.value = val || '';
    }
  });
}

// ─── Data binding: collect form into data ──────────────
function collectAllFields() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const path = el.getAttribute('data-field');
    if (el.type === 'radio') {
      if (el.checked) setNestedValue(data, path, el.value);
    } else if (el.tagName === 'SELECT' && el.hasAttribute('data-numeric')) {
      setNestedValue(data, path, el.value === '' ? null : Number(el.value));
    } else {
      setNestedValue(data, path, el.value);
    }
  });
}

// ─── Conditional fields ────────────────────────────────
function updateConditionalFields() {
  document.querySelectorAll('[data-show-if]').forEach(el => {
    const condition = el.getAttribute('data-show-if');
    const [path, values] = condition.split('=');
    const currentVal = getNestedValue(data, path);
    const allowed = values.split('|');
    el.style.display = allowed.includes(currentVal) ? 'block' : 'none';
  });
}

// Apply a single control's current value into `data`. Returns true if the
// element is a form field (has data-field), false otherwise.
function applyFieldFromElement(el) {
  const field = el && el.getAttribute && el.getAttribute('data-field');
  if (!field) return false;
  if (el.type === 'radio') {
    if (el.checked) setNestedValue(data, field, el.value);
  } else if (el.tagName === 'SELECT' && el.hasAttribute('data-numeric')) {
    setNestedValue(data, field, el.value === '' ? null : Number(el.value));
  } else {
    setNestedValue(data, field, el.value);
  }
  return true;
}

// Listen for any field edit: update `data`, refresh conditional fields, and
// autosave. `change` covers radios/selects; `input` covers text/textarea typing.
function handleFieldEvent(e) {
  if (!applyFieldFromElement(e.target)) return;
  updateConditionalFields();
  saveState();
}
document.addEventListener('change', handleFieldEvent);
document.addEventListener('input', handleFieldEvent);

// Populate every control from `data` (used on load to rehydrate a saved draft).
function hydrateFields() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const path = el.getAttribute('data-field');
    const val = getNestedValue(data, path);
    if (el.type === 'radio') {
      el.checked = (el.value === val);
    } else if (el.tagName === 'SELECT' && el.hasAttribute('data-numeric')) {
      el.value = (val !== null && val !== '') ? String(val) : '';
    } else {
      el.value = val == null ? '' : val;
    }
  });
  updateConditionalFields();
}

// ─── Utilities ─────────────────────────────────────────
function getNestedValue(obj, path) {
  return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : '', obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// Show form immediately (single-page layout)
document.addEventListener('DOMContentLoaded', () => {
  loadState();      // rehydrate any saved draft into `data` before…
  hydrateFields();  // …reflecting it onto the rendered controls
  const form = document.getElementById('form-container');
  if (form) form.classList.remove('hidden');
});
