import { createDefaultAssessment } from './data-model.js';
import { calculateVaccinationStatus } from './vaccination-grader.js';
import { detectAdditionalFlags } from './flagged-issues.js';
import { TOTAL_STEPS, steps } from './steps.js';

let data = createDefaultAssessment();

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

// Listen for radio/select changes to update conditional fields
document.addEventListener('change', (e) => {
  const field = e.target.getAttribute('data-field');
  if (!field) return;
  if (e.target.type === 'radio' && e.target.checked) {
    setNestedValue(data, field, e.target.value);
  } else if (e.target.tagName === 'SELECT') {
    if (e.target.hasAttribute('data-numeric')) {
      setNestedValue(data, field, e.target.value === '' ? null : Number(e.target.value));
    } else {
      setNestedValue(data, field, e.target.value);
    }
  }
  updateConditionalFields();
});

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
  const form = document.getElementById('form-container');
  if (form) form.classList.remove('hidden');
});
