import { emptyAssessment } from './types.js';
import { DASHBOARD_METRICS, CATEGORIES } from './metrics.js';

// Hospital Dashboard Metrics — single-page wizard (vanilla JS, Lily-classes
// contract).
//
// 16-step continuous wizard rendered in document order:
//   1        Reporting period
//   2..15    One step per departmental category (14 categories, 67 metrics)
//   16       Summary & sign-off
//
// Each of the 67 metrics is recorded independently as a decimal value (a
// Lily .number-input), with an optional free-text note (a Lily .text-input).
// There is no clinical grading engine — this is an operational
// completeness tally, not a scored instrument. Everything runs client-side
// and persists draft state to localStorage.

const STORAGE_KEY = 'hospital-dashboard-metrics:v1';

// ----------------------------------------------------------------------
// Step catalogue (derived from CATEGORIES so it can never drift)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [{ step: 1, key: 'reporting-period', title: 'Reporting period' }]
  .concat(CATEGORIES.map(function (c, i) {
    return { step: i + 2, key: 'category-' + c.number, title: c.title, categoryNumber: c.number };
  }))
  .concat([{ step: CATEGORIES.length + 2, key: 'summary', title: 'Summary & sign-off' }]);

const TOTAL_STEPS = STEP_DEFINITIONS.length; // 16

// ----------------------------------------------------------------------
// State + persistence
// ----------------------------------------------------------------------

function safeLs() {
  try { return window.localStorage; } catch (_) { return null; }
}

function loadDraft() {
  const ls = safeLs();
  if (!ls) return null;
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const fresh = emptyAssessment();
    const items = {};
    Object.keys(fresh.items).forEach(function (id) {
      items[id] = Object.assign({}, fresh.items[id], parsed.data && parsed.data.items && parsed.data.items[id]);
    });
    return {
      savedAt: parsed.savedAt || '',
      data: {
        reportingPeriod: Object.assign({}, fresh.reportingPeriod, parsed.data && parsed.data.reportingPeriod),
        items: items,
        summary: Object.assign({}, fresh.summary, parsed.data && parsed.data.summary),
      },
    };
  } catch (_) {
    return null;
  }
}

function persistDraft() {
  const ls = safeLs();
  if (!ls) return '';
  const savedAt = new Date().toISOString();
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify({
      savedAt: savedAt,
      data: {
        reportingPeriod: state.reportingPeriod,
        items: state.items,
        summary: state.summary,
      },
    }));
  } catch (_) { /* quota — ignore */ }
  setSavedLabel(savedAt);
  return savedAt;
}

function clearDraft() {
  const ls = safeLs();
  if (!ls) return;
  try { ls.removeItem(STORAGE_KEY); } catch (_) {}
  setSavedLabel('');
}

function setSavedLabel(iso) {
  const el = document.getElementById('saved-indicator');
  if (!el) return;
  if (!iso) { el.textContent = ''; return; }
  try {
    const d = new Date(iso);
    el.textContent = 'Saved ' + d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
  } catch (_) { el.textContent = ''; }
}

let state = emptyAssessment();
let draftRestored = false;
const restored = loadDraft();
if (restored) {
  state = restored.data;
  draftRestored = true;
}

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

function lilyInputClass(type) {
  switch (type) {
    case 'email':          return 'email-input';
    case 'number':          return 'number-input';
    case 'date':            return 'date-input';
    case 'datetime-local':  return 'date-input';
    case 'time':            return 'time-input';
    case 'tel':             return 'tel-input';
    case 'url':             return 'url-input';
    case 'search':          return 'search-input';
    default:                return 'text-input';
  }
}

// ----------------------------------------------------------------------
// Component builders (Lily class contracts)
// ----------------------------------------------------------------------

function textInput(opts) {
  const id = opts.id || (opts.section + '-' + opts.field);
  const target = state[opts.section];
  const value = target[opts.field];
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    'id="' + id + '"',
    'name="' + id + '"',
    'type="' + type + '"',
    'class="' + lilyInputClass(type) + '"',
    'value="' + esc(value == null ? '' : value) + '"',
  ];
  if (opts.placeholder) attrs.push('placeholder="' + esc(opts.placeholder) + '"');
  if (opts.min != null) attrs.push('min="' + esc(opts.min) + '"');
  if (opts.max != null) attrs.push('max="' + esc(opts.max) + '"');
  if (opts.required) attrs.push('required', 'data-required');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML =
    '<label class="label" for="' + id + '">' + labelText + '</label>' +
    '<input ' + attrs.join(' ') + '>' +
    '<span class="error-message" id="' + id + '-error"></span>';

  const input = wrapper.querySelector('input');
  input.setAttribute('aria-describedby', id + '-error');
  input.addEventListener('input', function () {
    if (type === 'number') {
      target[opts.field] = input.value === '' ? null : Number(input.value);
    } else {
      target[opts.field] = input.value;
    }
    persistDraft();
    updateProgress();
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = opts.id || (opts.section + '-' + opts.field);
  const target = state[opts.section];
  const value = target[opts.field] == null ? '' : target[opts.field];
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML =
    '<label class="label" for="' + id + '">' + esc(opts.label) + '</label>' +
    '<textarea id="' + id + '" name="' + id + '" rows="' + (opts.rows || 3) + '"' +
      (opts.placeholder ? ' placeholder="' + esc(opts.placeholder) + '"' : '') +
      ' aria-describedby="' + id + '-error"' +
      ' class="text-area-input">' + esc(value) + '</textarea>' +
    '<span class="error-message" id="' + id + '-error"></span>';
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', function () {
    target[opts.field] = ta.value;
    persistDraft();
    clearFieldError(id);
  });
  return wrapper;
}

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
    '<span class="section-step">Step ' + opts.stepNumber + ' of ' + TOTAL_STEPS + '</span>' +
    '<h2 class="section-title">' + esc(opts.title) + '</h2>' +
    desc;
  card.appendChild(legend);
  return card;
}

// ----------------------------------------------------------------------
// Metric row (numeric value input + notes input for one metric)
// ----------------------------------------------------------------------

function itemValueInput(id, labelText) {
  const fieldId = 'item-' + id + '-value';
  const value = state.items[id].value;
  const wrapper = document.createElement('div');
  wrapper.className = 'field item-value-field';
  wrapper.innerHTML =
    '<label class="label visually-hidden" for="' + fieldId + '">' + esc(labelText) + '</label>' +
    '<input id="' + fieldId + '" name="' + fieldId + '" type="number" step="any" class="number-input" ' +
      'placeholder="Value" value="' + esc(value == null ? '' : value) + '">';
  const input = wrapper.querySelector('input');
  input.addEventListener('input', function () {
    state.items[id].value = input.value === '' ? null : Number(input.value);
    persistDraft();
    updateProgress();
    updateRecordedPreview();
  });
  return wrapper;
}

function itemNotesInput(id) {
  const fieldId = 'item-' + id + '-notes';
  const value = state.items[id].notes || '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field item-notes-field';
  wrapper.innerHTML =
    '<label class="label visually-hidden" for="' + fieldId + '">Notes for metric ' + esc(id) + '</label>' +
    '<input id="' + fieldId + '" name="' + fieldId + '" type="text" class="text-input" ' +
      'placeholder="Notes (optional)" value="' + esc(value) + '">';
  const input = wrapper.querySelector('input');
  input.addEventListener('input', function () {
    state.items[id].notes = input.value;
    persistDraft();
  });
  return wrapper;
}

function renderItemRow(item) {
  const wrap = document.createElement('div');
  wrap.className = 'item-row';
  wrap.dataset.id = item.id;

  const idBadge = document.createElement('code');
  idBadge.className = 'item-id';
  idBadge.textContent = item.id;

  const body = document.createElement('div');
  body.className = 'item-body';

  const text = document.createElement('p');
  text.className = 'item-text';
  text.textContent = item.text;
  body.appendChild(text);

  const controls = document.createElement('div');
  controls.className = 'item-controls';
  controls.appendChild(itemValueInput(item.id, 'Value for metric ' + item.id + ' (' + item.text + ')'));
  controls.appendChild(itemNotesInput(item.id));
  body.appendChild(controls);

  wrap.appendChild(idBadge);
  wrap.appendChild(body);
  return wrap;
}

function renderItemList(items) {
  const list = document.createElement('div');
  list.className = 'item-list';
  items.forEach(function (item) {
    list.appendChild(renderItemRow(item));
  });
  return list;
}

// ----------------------------------------------------------------------
// Step renderers (one per wizard step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Reporting period',
    description: 'Record the hospital/site and the reporting period this KPI dashboard covers.',
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'Hospital / site name', section: 'reportingPeriod', field: 'hospitalName' }));
  grid.appendChild(textInput({ label: 'Prepared by', section: 'reportingPeriod', field: 'preparedByName' }));
  grid.appendChild(textInput({ label: 'Period month', section: 'reportingPeriod', field: 'periodMonth', type: 'number', min: 1, max: 12, placeholder: '1-12' }));
  grid.appendChild(textInput({ label: 'Period year', section: 'reportingPeriod', field: 'periodYear', type: 'number', min: 2000, max: 2100, placeholder: 'e.g. 2026' }));
  card.appendChild(grid);

  return card;
}

function renderCategoryStep(stepNumber, categoryNumber, categoryTitle) {
  const items = DASHBOARD_METRICS.filter(function (it) { return it.category === categoryNumber; });
  const card = sectionCard({
    stepNumber: stepNumber,
    title: categoryNumber + '. ' + categoryTitle,
    description: items.length + (items.length === 1 ? ' metric' : ' metrics') +
      ' — record each metric’s numeric value, with an optional note.',
  });

  const summary = document.createElement('p');
  summary.className = 'section-summary';
  summary.id = 'summary-category-' + categoryNumber;
  summary.textContent = '';
  card.appendChild(summary);

  card.appendChild(renderItemList(items));
  return card;
}

function renderStep16() {
  const stepNumber = TOTAL_STEPS;
  const card = sectionCard({
    stepNumber: stepNumber,
    title: 'Summary & sign-off',
    description: 'Review how many metrics have been recorded by category, capture overall notes, then sign off.',
  });

  const preview = document.createElement('div');
  preview.id = 'recorded-preview';
  preview.className = 'recorded-preview';
  card.appendChild(preview);

  card.appendChild(textArea({ label: 'Overall notes', section: 'summary', field: 'overallNotes', rows: 4 }));
  card.appendChild(textInput({ label: 'Signed at', section: 'summary', field: 'signedAt', type: 'datetime-local' }));

  return card;
}

const STEP_RENDERERS = [renderStep1]
  .concat(CATEGORIES.map(function (c, i) {
    return function () { return renderCategoryStep(i + 2, c.number, c.title); };
  }))
  .concat([renderStep16]);

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

function renderStepList() {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  ol.innerHTML = '';
  STEP_DEFINITIONS.forEach(function (def) {
    const li = document.createElement('li');
    li.className = 'step-list-item';
    li.dataset.status = 'waiting';
    li.dataset.step = String(def.step);
    li.setAttribute('aria-label', 'Step ' + def.step + ': ' + def.title);
    li.innerHTML = '<span>' + esc(def.title) + '</span>';
    li.addEventListener('click', function () {
      const target = document.getElementById('step-' + def.step);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    ol.appendChild(li);
  });
}

function updateStepListStatuses(sectionAnswered, sectionTotal) {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  STEP_DEFINITIONS.forEach(function (def) {
    const li = ol.querySelector('[data-step="' + def.step + '"]');
    if (!li) return;
    const a = sectionAnswered[def.key] || 0;
    const t = sectionTotal[def.key] || 0;
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
  });
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
// Progress tracking
// ----------------------------------------------------------------------

const REPORTING_PERIOD_TRACKED = ['hospitalName', 'periodMonth', 'periodYear', 'preparedByName'];
const SUMMARY_TRACKED = ['overallNotes', 'signedAt'];

function isAnswered(v) {
  return v !== null && v !== undefined && v !== '';
}

function updateProgress() {
  let answered = 0;
  const sectionAnswered = {};
  const sectionTotal = {};

  sectionTotal['reporting-period'] = REPORTING_PERIOD_TRACKED.length;
  sectionAnswered['reporting-period'] = 0;
  REPORTING_PERIOD_TRACKED.forEach(function (f) {
    if (isAnswered(state.reportingPeriod[f])) sectionAnswered['reporting-period'] += 1;
  });

  CATEGORIES.forEach(function (c) {
    const key = 'category-' + c.number;
    const items = DASHBOARD_METRICS.filter(function (it) { return it.category === c.number; });
    sectionTotal[key] = items.length;
    sectionAnswered[key] = 0;
    items.forEach(function (it) {
      if (isAnswered(state.items[it.id].value)) {
        sectionAnswered[key] += 1;
        answered += 1;
      }
    });
  });

  sectionTotal.summary = SUMMARY_TRACKED.length;
  sectionAnswered.summary = 0;
  SUMMARY_TRACKED.forEach(function (f) {
    if (isAnswered(state.summary[f])) sectionAnswered.summary += 1;
  });

  const total = DASHBOARD_METRICS.length; // 67
  const percent = Math.round((answered / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) {
    text.textContent = answered + ' of ' + total + ' metrics recorded (' + percent + '%)';
  }
  updateStepListStatuses(sectionAnswered, sectionTotal);
}

function categorySummaryText(categoryNumber) {
  const items = DASHBOARD_METRICS.filter(function (it) { return it.category === categoryNumber; });
  let recorded = 0;
  items.forEach(function (it) {
    if (isAnswered(state.items[it.id].value)) recorded += 1;
  });
  return recorded + ' of ' + items.length + ' recorded';
}

function updateSectionSummaries() {
  CATEGORIES.forEach(function (c) {
    const el = document.getElementById('summary-category-' + c.number);
    if (el) el.textContent = categorySummaryText(c.number);
  });
}

// ----------------------------------------------------------------------
// Summary tally (no clinical grading engine — a completeness tally, not a
// scored grader)
// ----------------------------------------------------------------------

function summariseMetrics() {
  let recordedCount = 0;
  const categoryCounts = {};
  CATEGORIES.forEach(function (c) {
    categoryCounts[c.number] = { recorded: 0, total: 0, title: c.title };
  });

  DASHBOARD_METRICS.forEach(function (item) {
    categoryCounts[item.category].total += 1;
    if (isAnswered(state.items[item.id].value)) {
      categoryCounts[item.category].recorded += 1;
      recordedCount += 1;
    }
  });

  return {
    recordedCount: recordedCount,
    categoryCounts: categoryCounts,
  };
}

function updateRecordedPreview() {
  const el = document.getElementById('recorded-preview');
  if (!el) return;
  const result = summariseMetrics();
  const rowsHtml = CATEGORIES.map(function (c) {
    const counts = result.categoryCounts[c.number];
    return '<li><strong>' + counts.recorded + ' / ' + counts.total + '</strong> — ' + esc(c.title) + '</li>';
  }).join('');
  el.innerHTML =
    '<div class="alert" data-type="' + (result.recordedCount === DASHBOARD_METRICS.length ? 'success' : 'info') + '">' +
      '<p><strong>' + result.recordedCount + ' of ' + DASHBOARD_METRICS.length +
      ' metrics recorded</strong> across ' + CATEGORIES.length + ' categories.</p>' +
    '</div>' +
    '<ul class="category-tally-list">' + rowsHtml + '</ul>';
}

// ----------------------------------------------------------------------
// Validation
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(id + '-error');
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
}

function setFieldError(id, message) {
  const el = document.getElementById(id + '-error');
  if (el) el.textContent = message;
  const input = document.getElementById(id);
  if (input) input.setAttribute('aria-invalid', 'true');
}

function validateForm() {
  const errors = [];
  const form = document.getElementById('assessment-form');
  if (!form) return errors;
  const required = form.querySelectorAll('[data-required]');
  required.forEach(function (input) {
    const id = input.id;
    const value = (input.value || '').trim();
    if (!value) {
      const labelEl = form.querySelector('label[for="' + id + '"]');
      const label = labelEl
        ? labelEl.textContent.replace(/\s*\*\s*$/, '').trim()
        : id;
      errors.push({ id: id, message: label + ' is required' });
      setFieldError(id, label + ' is required');
    } else {
      clearFieldError(id);
    }
  });
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
      errors.map(function (e) {
        return '<li><a href="#' + esc(e.id) + '">' + esc(e.message) + '</a></li>';
      }).join('') +
    '</ul>';
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  try { summary.focus({ preventScroll: true }); } catch (_) { /* not focusable on older browsers */ }
}

// ----------------------------------------------------------------------
// CSV export
// ----------------------------------------------------------------------

function csvEsc(v) {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function buildCsv(result) {
  const lines = [];
  lines.push('reportingPeriod,key,value');
  Object.keys(state.reportingPeriod).forEach(function (k) {
    lines.push(['reportingPeriod', k, state.reportingPeriod[k]].map(csvEsc).join(','));
  });
  lines.push('');
  lines.push('summary,key,value');
  lines.push(['summary', 'recordedCount', String(result.recordedCount)].map(csvEsc).join(','));
  lines.push(['summary', 'overallNotes', state.summary.overallNotes].map(csvEsc).join(','));
  lines.push(['summary', 'signedAt', state.summary.signedAt].map(csvEsc).join(','));
  lines.push('');
  lines.push('metricId,category,categoryTitle,text,value,notes');
  DASHBOARD_METRICS.forEach(function (item) {
    const resp = state.items[item.id];
    lines.push([
      item.id, item.category, item.categoryTitle, item.text,
      resp.value == null ? '' : resp.value, resp.notes || '',
    ].map(csvEsc).join(','));
  });
  return lines.join('\n') + '\n';
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ----------------------------------------------------------------------
// Report
// ----------------------------------------------------------------------

function renderReport() {
  const result = summariseMetrics();
  const reportEl = document.getElementById('report');
  if (!reportEl) return;

  const bannerType = result.recordedCount === DASHBOARD_METRICS.length ? 'success' : 'info';
  const bannerHtml =
    '<div class="alert" data-type="' + bannerType + '">' +
      '<p><strong>Metrics recorded: </strong>' + result.recordedCount + ' / ' + DASHBOARD_METRICS.length + '</p>' +
    '</div>';

  const categoryRowsHtml = CATEGORIES.map(function (c) {
    const counts = result.categoryCounts[c.number];
    return '<tr><td class="mono">' + c.number + '</td><td>' + esc(c.title) + '</td>' +
      '<td>' + counts.recorded + ' / ' + counts.total + '</td></tr>';
  }).join('');

  const itemRowsHtml = DASHBOARD_METRICS.map(function (item) {
    const resp = state.items[item.id];
    const hasValue = isAnswered(resp.value);
    return '<tr class="' + (hasValue ? 'ans-recorded' : 'ans-blank') + '">' +
      '<td class="mono">' + esc(item.id) + '</td>' +
      '<td>' + esc(item.categoryTitle) + '</td>' +
      '<td>' + esc(item.text) + '</td>' +
      '<td class="ans">' + (hasValue ? esc(String(resp.value)) : '—') + '</td>' +
      '<td>' + esc(resp.notes || '') + '</td>' +
    '</tr>';
  }).join('');

  reportEl.innerHTML =
    '<div class="report-header">' +
      '<h2>Dashboard report</h2>' +
      '<button type="button" id="download-csv" class="button" data-variant="primary">Download CSV</button>' +
    '</div>' +
    '<p class="muted">Generated ' + esc(new Date().toLocaleString()) + '</p>' +
    bannerHtml +
    '<h3>Metrics recorded by category</h3>' +
    '<table class="item-table">' +
      '<thead><tr><th>#</th><th>Category</th><th>Recorded</th></tr></thead>' +
      '<tbody>' + categoryRowsHtml + '</tbody>' +
    '</table>' +
    '<h3>Per-metric values</h3>' +
    '<table class="item-table">' +
      '<thead><tr>' +
        '<th>ID</th><th>Category</th><th>Metric</th><th>Value</th><th>Notes</th>' +
      '</tr></thead>' +
      '<tbody>' + itemRowsHtml + '</tbody>' +
    '</table>' +
    '<div class="report-actions">' +
      '<button type="button" id="print-btn" class="button" data-variant="secondary">Print / save PDF</button>' +
      '<button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>' +
    '</div>';

  document.getElementById('download-csv').addEventListener('click', function () {
    downloadCsv('hospital-dashboard-metrics.csv', buildCsv(result));
  });
  document.getElementById('print-btn').addEventListener('click', function () { window.print(); });
  document.getElementById('start-over-btn').addEventListener('click', resetAll);

  reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitForm() {
  const errors = validateForm();
  if (errors.length > 0) return;
  renderReport();
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function renderForm() {
  const host = document.getElementById('form-sections');
  if (!host) return;
  host.innerHTML = '';
  STEP_RENDERERS.forEach(function (r) { host.appendChild(r()); });
}

function resetAll() {
  if (!confirm('Clear all recorded values and start a fresh reporting period?')) return;
  state = emptyAssessment();
  clearDraft();
  hideDraftBanner();
  const out = document.getElementById('report');
  if (out) out.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  updateSectionSummaries();
  updateRecordedPreview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDraftBanner() {
  const banner = document.getElementById('draft-banner');
  if (banner) banner.hidden = false;
}

function hideDraftBanner() {
  const banner = document.getElementById('draft-banner');
  if (banner) banner.hidden = true;
}

function bindDraftButtons() {
  const keep = document.getElementById('draft-keep');
  const discard = document.getElementById('draft-discard');
  if (keep) keep.addEventListener('click', hideDraftBanner);
  if (discard) discard.addEventListener('click', resetAll);
}

function init() {
  renderStepList();
  renderForm();
  updateProgress();
  updateSectionSummaries();
  updateRecordedPreview();
  if (draftRestored) {
    showDraftBanner();
    if (restored && restored.savedAt) setSavedLabel(restored.savedAt);
  }
  bindDraftButtons();
  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', resetAll);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
