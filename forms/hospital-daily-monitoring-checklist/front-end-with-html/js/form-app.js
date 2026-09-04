import { emptyAssessment } from './types.js';
import { summariseChecklist } from './summary.js';
import { CHECKLIST_ITEMS, SECTIONS } from './items.js';

// Hospital Daily Monitoring Checklist — single-page wizard (vanilla JS,
// Lily-classes contract).
//
// 24-step continuous wizard rendered in document order:
//   1       Inspection details
//   2..23   One step per hospital area (22 areas, 97 checkpoints)
//   24      Summary & sign-off
//
// Each of the 97 checkpoints is answered independently as satisfactory /
// needs-attention / not-applicable (a Lily .radio-group), with an optional
// free-text remark (a Lily .text-input). There is no clinical grading
// engine — this is an operational tally/summary, not a scored instrument.
// Everything runs client-side and persists draft state to localStorage.

const STORAGE_KEY = 'hospital-daily-monitoring-checklist:v1';

const STATUS_OPTIONS = [
  { value: 'satisfactory', label: 'Satisfactory' },
  { value: 'needs-attention', label: 'Needs attention' },
  { value: 'not-applicable', label: 'Not applicable' },
];

// ----------------------------------------------------------------------
// Step catalogue (derived from SECTIONS so it can never drift)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [{ step: 1, key: 'inspection', title: 'Inspection details' }]
  .concat(SECTIONS.map(function (s, i) {
    return { step: i + 2, key: 'section-' + s.number, title: s.title, sectionNumber: s.number };
  }))
  .concat([{ step: SECTIONS.length + 2, key: 'summary', title: 'Summary & sign-off' }]);

const TOTAL_STEPS = STEP_DEFINITIONS.length; // 24

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
        inspectionDetails: Object.assign({}, fresh.inspectionDetails, parsed.data && parsed.data.inspectionDetails),
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
        inspectionDetails: state.inspectionDetails,
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
    target[opts.field] = input.value;
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

/**
 * Lily-styled radio group rendered as a <fieldset class="field"> with
 * <legend class="label"> and an inner <div class="radio-group" role="radiogroup">.
 */
function radioGroup(opts) {
  const groupId = opts.id;
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field';
  wrapper.id = groupId + '-fieldset';

  const legend = document.createElement('legend');
  legend.className = opts.legendClass || 'label';
  legend.textContent = opts.label;
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-group';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', wrapper.id);

  opts.options.forEach(function (option) {
    const radioId = groupId + '-' + option.value;
    const label = document.createElement('label');
    label.htmlFor = radioId;
    const checked = opts.value === option.value ? ' checked' : '';
    label.innerHTML =
      '<input class="radio-input" type="radio" id="' + radioId + '" name="' + groupId +
        '" value="' + esc(option.value) + '"' + checked + '>' +
      '<span>' + esc(option.label) + '</span>';
    const input = label.querySelector('input');
    input.addEventListener('change', function () {
      if (!input.checked) return;
      opts.onChange(option.value);
      clearFieldError(groupId);
    });
    list.appendChild(label);
  });
  wrapper.appendChild(list);

  const errSpan = document.createElement('span');
  errSpan.className = 'error-message';
  errSpan.id = groupId + '-error';
  wrapper.appendChild(errSpan);
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
// Checkpoint row (status radio group + remarks input for one checkpoint)
// ----------------------------------------------------------------------

function itemStatusRadioGroup(id, labelText) {
  return radioGroup({
    label: labelText,
    legendClass: 'visually-hidden',
    id: 'item-' + id + '-status',
    options: STATUS_OPTIONS,
    value: state.items[id].status || '',
    onChange: function (v) {
      state.items[id].status = v;
      persistDraft();
      updateProgress();
      updateNeedsAttentionPreview();
    },
  });
}

function itemRemarksInput(id) {
  const fieldId = 'item-' + id + '-remarks';
  const value = state.items[id].remarks || '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field item-remarks-field';
  wrapper.innerHTML =
    '<label class="label visually-hidden" for="' + fieldId + '">Remarks for checkpoint ' + esc(id) + '</label>' +
    '<input id="' + fieldId + '" name="' + fieldId + '" type="text" class="text-input" ' +
      'placeholder="Remarks (optional)" value="' + esc(value) + '">';
  const input = wrapper.querySelector('input');
  input.addEventListener('input', function () {
    state.items[id].remarks = input.value;
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
  controls.appendChild(itemStatusRadioGroup(item.id, 'Checkpoint ' + item.id + ' status'));
  controls.appendChild(itemRemarksInput(item.id));
  body.appendChild(controls);

  wrap.appendChild(idBadge);
  wrap.appendChild(body);
  return wrap;
}

function renderItemList(items) {
  const list = document.createElement('div');
  list.className = 'item-list';
  let lastSubsection = null;
  items.forEach(function (item) {
    if (item.subsection && item.subsection !== lastSubsection) {
      const heading = document.createElement('h3');
      heading.className = 'subsection-title';
      heading.textContent = item.subsection;
      list.appendChild(heading);
      lastSubsection = item.subsection;
    }
    list.appendChild(renderItemRow(item));
  });
  return list;
}

// ----------------------------------------------------------------------
// Section renderers (one per wizard step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Inspection details',
    description: 'Record who is carrying out this round and where.',
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'Hospital / site name', section: 'inspectionDetails', field: 'hospitalName' }));
  grid.appendChild(textInput({ label: 'Department / site', section: 'inspectionDetails', field: 'departmentOrSite' }));
  grid.appendChild(textInput({ label: 'Inspection date', section: 'inspectionDetails', field: 'inspectionDate', type: 'date' }));
  grid.appendChild(textInput({ label: 'Inspecting officer name', section: 'inspectionDetails', field: 'inspectingOfficerName' }));
  grid.appendChild(textInput({ label: 'Inspecting officer designation', section: 'inspectionDetails', field: 'inspectingOfficerDesignation' }));
  card.appendChild(grid);

  return card;
}

function renderSectionStep(stepNumber, sectionNumber, sectionTitle) {
  const items = CHECKLIST_ITEMS.filter(function (it) { return it.section === sectionNumber; });
  const card = sectionCard({
    stepNumber: stepNumber,
    title: sectionNumber + '. ' + sectionTitle,
    description: items.length + (items.length === 1 ? ' checkpoint' : ' checkpoints') +
      ' — mark each satisfactory, needs attention, or not applicable, with an optional remark.',
  });

  const summary = document.createElement('p');
  summary.className = 'section-summary';
  summary.id = 'summary-section-' + sectionNumber;
  summary.textContent = '';
  card.appendChild(summary);

  card.appendChild(renderItemList(items));
  return card;
}

function renderStep24() {
  const stepNumber = TOTAL_STEPS;
  const card = sectionCard({
    stepNumber: stepNumber,
    title: 'Summary & sign-off',
    description: 'Review checkpoints flagged as needing attention, capture overall notes and the action plan, then sign off.',
  });

  const preview = document.createElement('div');
  preview.id = 'needs-attention-preview';
  preview.className = 'needs-attention-preview';
  card.appendChild(preview);

  card.appendChild(textArea({ label: 'Overall notes', section: 'summary', field: 'overallNotes', rows: 4 }));
  card.appendChild(textArea({ label: 'Action plan', section: 'summary', field: 'actionPlan', rows: 4 }));
  card.appendChild(textInput({ label: 'Signed at', section: 'summary', field: 'signedAt', type: 'datetime-local' }));

  return card;
}

const STEP_RENDERERS = [renderStep1]
  .concat(SECTIONS.map(function (s, i) {
    return function () { return renderSectionStep(i + 2, s.number, s.title); };
  }))
  .concat([renderStep24]);

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

const INSPECTION_TRACKED = [
  'hospitalName', 'departmentOrSite', 'inspectionDate',
  'inspectingOfficerName', 'inspectingOfficerDesignation',
];
const SUMMARY_TRACKED = ['overallNotes', 'actionPlan', 'signedAt'];

function isAnswered(v) {
  return v !== null && v !== undefined && v !== '';
}

function updateProgress() {
  let answered = 0;
  const sectionAnswered = {};
  const sectionTotal = {};

  sectionTotal.inspection = INSPECTION_TRACKED.length;
  sectionAnswered.inspection = 0;
  INSPECTION_TRACKED.forEach(function (f) {
    if (isAnswered(state.inspectionDetails[f])) sectionAnswered.inspection += 1;
  });

  SECTIONS.forEach(function (s) {
    const key = 'section-' + s.number;
    const items = CHECKLIST_ITEMS.filter(function (it) { return it.section === s.number; });
    sectionTotal[key] = items.length;
    sectionAnswered[key] = 0;
    items.forEach(function (it) {
      if (isAnswered(state.items[it.id].status)) {
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

  const total = CHECKLIST_ITEMS.length; // 97
  const percent = Math.round((answered / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) {
    text.textContent = answered + ' of ' + total + ' checkpoints answered (' + percent + '%)';
  }
  updateStepListStatuses(sectionAnswered, sectionTotal);
}

function sectionSummaryText(sectionNumber) {
  const items = CHECKLIST_ITEMS.filter(function (it) { return it.section === sectionNumber; });
  let sat = 0, na2 = 0, needs = 0, blank = 0;
  items.forEach(function (it) {
    const st = state.items[it.id].status;
    if (st === 'satisfactory') sat += 1;
    else if (st === 'needs-attention') needs += 1;
    else if (st === 'not-applicable') na2 += 1;
    else blank += 1;
  });
  return sat + ' satisfactory · ' + needs + ' needs attention · ' + na2 + ' n/a · ' + blank + ' unanswered';
}

function updateSectionSummaries() {
  SECTIONS.forEach(function (s) {
    const el = document.getElementById('summary-section-' + s.number);
    if (el) el.textContent = sectionSummaryText(s.number);
  });
}

// ----------------------------------------------------------------------
// Summary tally (no clinical grading engine — a tally/summary, not a
// scored grader)
// ----------------------------------------------------------------------


function updateNeedsAttentionPreview() {
  const el = document.getElementById('needs-attention-preview');
  if (!el) return;
  const result = summariseChecklist(state);
  if (result.needsAttentionCount === 0) {
    el.innerHTML = '<p class="empty-message">No checkpoints marked "needs attention" yet.</p>';
    return;
  }
  const bySection = {};
  result.needsAttentionItems.forEach(function (it) {
    if (!bySection[it.sectionTitle]) bySection[it.sectionTitle] = [];
    bySection[it.sectionTitle].push(it);
  });
  const groupsHtml = Object.keys(bySection).map(function (sectionTitle) {
    const rows = bySection[sectionTitle].map(function (it) {
      return '<li><code class="item-id">' + esc(it.id) + '</code> ' + esc(it.text) +
        (it.remarks ? ' — <em>' + esc(it.remarks) + '</em>' : '') + '</li>';
    }).join('');
    return '<h4>' + esc(sectionTitle) + '</h4><ul class="flag-list">' + rows + '</ul>';
  }).join('');
  el.innerHTML =
    '<div class="alert" data-type="warning">' +
      '<p><strong>' + result.needsAttentionCount + ' checkpoint' +
      (result.needsAttentionCount === 1 ? '' : 's') +
      ' need attention</strong> across ' + result.sectionsWithNeedsAttention.length +
      ' area' + (result.sectionsWithNeedsAttention.length === 1 ? '' : 's') + '.</p>' +
    '</div>' +
    groupsHtml;
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
  lines.push('inspectionDetails,key,value');
  Object.keys(state.inspectionDetails).forEach(function (k) {
    lines.push(['inspectionDetails', k, state.inspectionDetails[k]].map(csvEsc).join(','));
  });
  lines.push('');
  lines.push('summary,key,value');
  lines.push(['summary', 'answeredCount', String(result.answeredCount)].map(csvEsc).join(','));
  lines.push(['summary', 'needsAttentionCount', String(result.needsAttentionCount)].map(csvEsc).join(','));
  lines.push(['summary', 'overallNotes', state.summary.overallNotes].map(csvEsc).join(','));
  lines.push(['summary', 'actionPlan', state.summary.actionPlan].map(csvEsc).join(','));
  lines.push(['summary', 'signedAt', state.summary.signedAt].map(csvEsc).join(','));
  lines.push('');
  lines.push('itemId,section,sectionTitle,text,status,remarks');
  CHECKLIST_ITEMS.forEach(function (item) {
    const resp = state.items[item.id];
    lines.push([
      item.id, item.section, item.sectionTitle, item.text, resp.status || '', resp.remarks || '',
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
  const result = summariseChecklist(state);
  const reportEl = document.getElementById('report');
  if (!reportEl) return;

  const bannerType = result.needsAttentionCount > 0 ? 'warning' : 'success';
  const bannerHtml =
    '<div class="alert" data-type="' + bannerType + '">' +
      '<p><strong>Checkpoints answered: </strong>' + result.answeredCount + ' / ' + CHECKLIST_ITEMS.length + '</p>' +
      '<p><strong>Needs attention: </strong>' + result.needsAttentionCount +
        ' checkpoint' + (result.needsAttentionCount === 1 ? '' : 's') +
        ' across ' + result.sectionsWithNeedsAttention.length + ' area' +
        (result.sectionsWithNeedsAttention.length === 1 ? '' : 's') + '</p>' +
    '</div>';

  const needsAttentionHtml = result.needsAttentionItems.length
    ? '<ul class="flag-list">' +
        result.needsAttentionItems.map(function (it) {
          return '<li><code class="item-id">' + esc(it.id) + '</code> ' +
            '<strong>' + esc(it.sectionTitle) + '</strong> — ' + esc(it.text) +
            (it.remarks ? ' — <em>' + esc(it.remarks) + '</em>' : '') + '</li>';
        }).join('') +
      '</ul>'
    : '<p class="empty-message">No checkpoints marked "needs attention".</p>';

  const itemRowsHtml = CHECKLIST_ITEMS.map(function (item) {
    const resp = state.items[item.id];
    const status = resp.status || '';
    const cls = status ? 'ans-' + status : 'ans-blank';
    return '<tr class="' + cls + '">' +
      '<td class="mono">' + esc(item.id) + '</td>' +
      '<td>' + esc(item.sectionTitle) + '</td>' +
      '<td>' + esc(item.text) + '</td>' +
      '<td class="ans">' + esc(status ? status.replace(/-/g, ' ').toUpperCase() : '—') + '</td>' +
      '<td>' + esc(resp.remarks || '') + '</td>' +
    '</tr>';
  }).join('');

  reportEl.innerHTML =
    '<div class="report-header">' +
      '<h2>Checklist report</h2>' +
      '<button type="button" id="download-csv" class="button" data-variant="primary">Download CSV</button>' +
    '</div>' +
    '<p class="muted">Generated ' + esc(new Date().toLocaleString()) + '</p>' +
    bannerHtml +
    '<h3>Checkpoints needing attention</h3>' +
    needsAttentionHtml +
    '<h3>Per-checkpoint answers</h3>' +
    '<table class="item-table">' +
      '<thead><tr>' +
        '<th>ID</th><th>Area</th><th>Checkpoint</th><th>Status</th><th>Remarks</th>' +
      '</tr></thead>' +
      '<tbody>' + itemRowsHtml + '</tbody>' +
    '</table>' +
    '<div class="report-actions">' +
      '<button type="button" id="print-btn" class="button" data-variant="secondary">Print / save PDF</button>' +
      '<button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>' +
    '</div>';

  document.getElementById('download-csv').addEventListener('click', function () {
    downloadCsv('hospital-daily-monitoring-checklist.csv', buildCsv(result));
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
  if (!confirm('Clear all answers and start a fresh inspection round?')) return;
  state = emptyAssessment();
  clearDraft();
  hideDraftBanner();
  const out = document.getElementById('report');
  if (out) out.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  updateSectionSummaries();
  updateNeedsAttentionPreview();
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
  updateNeedsAttentionPreview();
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
