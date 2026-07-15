import { calculateMaturity } from './engine.js';
import { ALL_ITEMS, PRACTICES_ITEMS, SECTION_LABEL, STAKEHOLDERS_ITEMS, TEAMS_ITEMS } from './items.js';

// Agile Checklist — single-page wizard (vanilla JS, Lily-classes contract).
//
// 5-section continuous wizard rendered in document order:
//   1 Respondent identification
//   2 Teams (25 items)
//   3 Stakeholders (14 items)
//   4 Practices (18 items)
//   5 Summary and action plan
//
// Each of the 57 checklist items is a tri-state Yes/No/N/A answer rendered
// as a Lily .radio-group inside a .field. The engine runs entirely
// client-side, persists draft state to localStorage, and renders an inline
// report with composite maturity, fired coaching rules, operational flags,
// and a per-item table.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.AgileChecklist`. Whole file is wrapped in an IIFE so
// its top-level identifiers don't leak to the global scope.

const TOTAL_STEPS = 5;

const ROLES = [
  { value: 'team-member', label: 'Team member' },
  { value: 'team-lead', label: 'Team lead' },
  { value: 'scrum-master', label: 'Scrum master' },
  { value: 'product-owner', label: 'Product owner' },
  { value: 'engineering-manager', label: 'Engineering manager' },
  { value: 'agile-coach', label: 'Agile coach' },
  { value: 'executive-sponsor', label: 'Executive sponsor' },
  { value: 'other', label: 'Other' },
];

const PERIODS = [
  { value: 'sprint', label: 'Per sprint' },
  { value: 'quarter', label: 'Quarterly' },
  { value: 'half-year', label: 'Half-yearly' },
  { value: 'annual', label: 'Annual' },
  { value: 'ad-hoc', label: 'Ad-hoc' },
];

const YES_NO_NA = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-applicable', label: 'N/A' },
];

// ----------------------------------------------------------------------
// State + persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'agile-checklist:v1';

function emptyAnswers() {
  const a = {};
  ALL_ITEMS.forEach(function (i) { a[i.id] = ''; });
  return a;
}

function emptyState() {
  return {
    respondent: {
      fullName: '',
      email: '',
      role: '',
      yearsInAgile: null,
      teamName: '',
      organisationName: '',
      assessmentDate: '',
      assessmentPeriod: '',
    },
    answers: emptyAnswers(),
    actionPlan: {
      topAction1: '',
      topAction2: '',
      topAction3: '',
      coachNotes: '',
      overallNotes: '',
    },
  };
}

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
    const fresh = emptyState();
    return {
      savedAt: parsed.savedAt || '',
      data: {
        respondent: Object.assign({}, fresh.respondent, parsed.data && parsed.data.respondent),
        answers: Object.assign({}, fresh.answers, parsed.data && parsed.data.answers),
        actionPlan: Object.assign({}, fresh.actionPlan, parsed.data && parsed.data.actionPlan),
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
        respondent: state.respondent,
        answers: state.answers,
        actionPlan: state.actionPlan,
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

let state = emptyState();
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
    case 'email':  return 'email-input';
    case 'number': return 'number-input';
    case 'date':   return 'date-input';
    case 'time':   return 'time-input';
    case 'tel':    return 'tel-input';
    case 'url':    return 'url-input';
    case 'search': return 'search-input';
    default:       return 'text-input';
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
  if (opts.min !== undefined) attrs.push('min="' + opts.min + '"');
  if (opts.max !== undefined) attrs.push('max="' + opts.max + '"');
  if (opts.step !== undefined) attrs.push('step="' + opts.step + '"');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML =
    '<label class="label" for="' + id + '">' + labelText + '</label>' +
    '<input ' + attrs.join(' ') + '>' +
    '<span class="error-message" id="' + id + '-error"></span>';

  const input = wrapper.querySelector('input');
  input.setAttribute('aria-describedby', id + '-error');
  input.addEventListener('input', function () {
    let v = input.value;
    if (type === 'number') v = v === '' ? null : Number(v);
    target[opts.field] = v;
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

function selectInput(opts) {
  const id = opts.id || (opts.section + '-' + opts.field);
  const target = state[opts.section];
  const current = target[opts.field] == null ? '' : target[opts.field];
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = ['<option value="">— Select —</option>']
    .concat(opts.options.map(function (o) {
      return '<option value="' + esc(o.value) + '"' +
        (o.value === current ? ' selected' : '') + '>' + esc(o.label) + '</option>';
    }))
    .join('');

  wrapper.innerHTML =
    '<label class="label" for="' + id + '">' + esc(opts.label) + '</label>' +
    '<select id="' + id + '" name="' + id + '" class="select" aria-describedby="' + id + '-error">' +
      optionsHtml +
    '</select>' +
    '<span class="error-message" id="' + id + '-error"></span>';

  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', function () {
    target[opts.field] = sel.value;
    persistDraft();
    clearFieldError(id);
  });
  return wrapper;
}

/**
 * Lily-styled radio group rendered as a <fieldset class="field"> with
 * <legend class="label"> and an inner <div class="radio-group" role="radiogroup">.
 *
 * `onChange(value)` is invoked when the selection changes. Falls back to
 * mutating state[opts.section][opts.field] when no onChange is given.
 */
function radioGroup(opts) {
  const groupId = opts.id || (opts.section + '-' + opts.field);
  const target = opts.section ? state[opts.section] : null;
  const current = opts.value != null
    ? opts.value
    : (target ? target[opts.field] : '');
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field';
  wrapper.id = groupId + '-fieldset';

  const legend = document.createElement('legend');
  legend.className = 'label';
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
    const checked = current === option.value ? ' checked' : '';
    label.innerHTML =
      '<input class="radio-input" type="radio" id="' + radioId + '" name="' + groupId +
        '" value="' + esc(option.value) + '"' + checked + '>' +
      '<span>' + esc(option.label) + '</span>';
    const input = label.querySelector('input');
    input.addEventListener('change', function () {
      if (!input.checked) return;
      if (opts.onChange) {
        opts.onChange(option.value);
      } else if (target) {
        target[opts.field] = option.value;
        persistDraft();
      }
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
    '<span class="section-step">Section ' + opts.stepNumber + ' of ' + TOTAL_STEPS + '</span>' +
    '<h2 class="section-title">' + esc(opts.title) + '</h2>' +
    desc;
  card.appendChild(legend);
  return card;
}

// ----------------------------------------------------------------------
// Item row (tri-state Yes/No/N-A radio group for a single checklist item)
// ----------------------------------------------------------------------

function renderItemRow(item) {
  const wrap = document.createElement('div');
  wrap.className = 'item-row';
  wrap.dataset.id = item.id;

  const idBadge = document.createElement('code');
  idBadge.className = 'item-id';
  idBadge.textContent = item.id;

  const text = document.createElement('p');
  text.className = 'item-text';
  text.textContent = item.text;

  const groupId = 'answer-' + item.id;
  const group = radioGroup({
    label: item.id + ' — answer',
    id: groupId,
    options: YES_NO_NA,
    value: state.answers[item.id] || '',
    onChange: function (v) {
      state.answers[item.id] = v;
      persistDraft();
      updateSectionSummary();
      updateProgress();
    },
  });
  // Hide the legend visually for item rows — the item text is the label.
  group.querySelector('legend.label').className = 'visually-hidden';
  group.style.margin = '0';

  wrap.appendChild(idBadge);
  wrap.appendChild(text);
  wrap.appendChild(group);
  return wrap;
}

function renderItemList(items) {
  const list = document.createElement('div');
  list.className = 'item-list';
  items.forEach(function (item) { list.appendChild(renderItemRow(item)); });
  return list;
}

// ----------------------------------------------------------------------
// Section renderers (one per wizard step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Respondent identification',
    description:
      'Tell us who is completing the checklist. None of these fields affect the maturity calculation.',
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'Full name', section: 'respondent', field: 'fullName' }));
  grid.appendChild(textInput({ label: 'Email', section: 'respondent', field: 'email', type: 'email' }));
  grid.appendChild(selectInput({ label: 'Role', section: 'respondent', field: 'role', options: ROLES }));
  grid.appendChild(textInput({
    label: 'Years working in agile', section: 'respondent', field: 'yearsInAgile',
    type: 'number', min: 0, max: 50,
  }));
  grid.appendChild(textInput({ label: 'Team being assessed', section: 'respondent', field: 'teamName' }));
  grid.appendChild(textInput({ label: 'Organisation / programme', section: 'respondent', field: 'organisationName' }));
  grid.appendChild(textInput({ label: 'Assessment date', section: 'respondent', field: 'assessmentDate', type: 'date' }));
  grid.appendChild(selectInput({ label: 'Assessment cadence', section: 'respondent', field: 'assessmentPeriod', options: PERIODS }));
  card.appendChild(grid);

  return card;
}

function renderSectionStep(stepNumber, sectionKey, items, title, description) {
  const card = sectionCard({ stepNumber: stepNumber, title: title, description: description });

  const summary = document.createElement('p');
  summary.className = 'section-summary';
  summary.id = 'summary-' + sectionKey;
  summary.textContent = '';
  card.appendChild(summary);

  card.appendChild(renderItemList(items));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Summary, action plan',
    description:
      'Capture the top three actions to act on after this checklist. The maturity report below will refresh when you press "Generate report".',
  });

  card.appendChild(textInput({ label: 'Top action 1', section: 'actionPlan', field: 'topAction1' }));
  card.appendChild(textInput({ label: 'Top action 2', section: 'actionPlan', field: 'topAction2' }));
  card.appendChild(textInput({ label: 'Top action 3', section: 'actionPlan', field: 'topAction3' }));
  card.appendChild(textArea({ label: 'Coach notes', section: 'actionPlan', field: 'coachNotes' }));
  card.appendChild(textArea({ label: 'Overall notes', section: 'actionPlan', field: 'overallNotes' }));

  return card;
}

const STEP_RENDERERS = [
  renderStep1,
  function () {
    return renderSectionStep(
      2, 'teams', TEAMS_ITEMS,
      'Teams (25 items)',
      'Concrete behaviours of the people doing the work — autonomy, collaboration, learning, finishing, and motivation. Answer Yes when the behaviour is reliably true today, No when it is not, and N/A when the item does not apply.',
    );
  },
  function () {
    return renderSectionStep(
      3, 'stakeholders', STAKEHOLDERS_ITEMS,
      'Stakeholders (14 items)',
      'Behaviours of sponsors, executives, and other people outside the team whose decisions shape what the team can do — trust, delegation, experimentation, communication.',
    );
  },
  function () {
    return renderSectionStep(
      4, 'practices', PRACTICES_ITEMS,
      'Practices (18 items)',
      'Operating practices that bind teams and stakeholders together — pace of decisions, focus on finished work, transparency, and scope discipline.',
    );
  },
  renderStep5,
];

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1, key: 'respondent',   title: 'Respondent' },
  { step: 2, key: 'teams',        title: 'Teams' },
  { step: 3, key: 'stakeholders', title: 'Stakeholders' },
  { step: 4, key: 'practices',    title: 'Practices' },
  { step: 5, key: 'summary',      title: 'Summary' },
];

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

const RESPONDENT_TRACKED = [
  'fullName', 'email', 'role', 'yearsInAgile', 'teamName',
  'organisationName', 'assessmentDate', 'assessmentPeriod',
];
const SUMMARY_TRACKED = [
  'topAction1', 'topAction2', 'topAction3', 'coachNotes', 'overallNotes',
];

function isAnswered(v) {
  return v !== null && v !== undefined && v !== '';
}

function updateProgress() {
  let answered = 0;
  const sectionAnswered = {};
  const sectionTotal = {};

  // Respondent fields
  sectionTotal.respondent = RESPONDENT_TRACKED.length;
  sectionAnswered.respondent = 0;
  RESPONDENT_TRACKED.forEach(function (f) {
    if (isAnswered(state.respondent[f])) sectionAnswered.respondent += 1;
  });

  // Checklist items (the canonical "answered" count for the form footer)
  [
    { key: 'teams', items: TEAMS_ITEMS },
    { key: 'stakeholders', items: STAKEHOLDERS_ITEMS },
    { key: 'practices', items: PRACTICES_ITEMS },
  ].forEach(function (sec) {
    sectionTotal[sec.key] = sec.items.length;
    sectionAnswered[sec.key] = 0;
    sec.items.forEach(function (it) {
      if (isAnswered(state.answers[it.id])) sectionAnswered[sec.key] += 1;
    });
    answered += sectionAnswered[sec.key];
  });

  // Summary / action plan
  sectionTotal.summary = SUMMARY_TRACKED.length;
  sectionAnswered.summary = 0;
  SUMMARY_TRACKED.forEach(function (f) {
    if (isAnswered(state.actionPlan[f])) sectionAnswered.summary += 1;
  });

  const total = ALL_ITEMS.length; // 57
  const percent = Math.round((answered / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) {
    text.textContent = answered + ' of ' + total + ' items answered (' + percent + '%)';
  }
  updateStepListStatuses(sectionAnswered, sectionTotal);
}

function updateSectionSummary() {
  [
    { key: 'teams', items: TEAMS_ITEMS },
    { key: 'stakeholders', items: STAKEHOLDERS_ITEMS },
    { key: 'practices', items: PRACTICES_ITEMS },
  ].forEach(function (sec) {
    let y = 0, n = 0, na = 0, blank = 0;
    sec.items.forEach(function (it) {
      const a = state.answers[it.id];
      if (a === 'yes') y += 1;
      else if (a === 'no') n += 1;
      else if (a === 'not-applicable') na += 1;
      else blank += 1;
    });
    const applicable = y + n;
    const pct = applicable === 0 ? null : Math.round((y / applicable) * 100);
    const el = document.getElementById('summary-' + sec.key);
    if (!el) return;
    const parts = [y + ' yes', n + ' no', na + ' n/a', blank + ' unanswered'];
    el.textContent = parts.join(' · ') + (pct === null ? '' : ' — ' + pct + '% yes');
  });
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
  lines.push('section,key,value');
  Object.keys(state.respondent).forEach(function (k) {
    lines.push(['respondent', k, state.respondent[k]].map(csvEsc).join(','));
  });
  lines.push(['summary', 'maturity', result.maturity].map(csvEsc).join(','));
  lines.push(['summary', 'overallPercent',
    result.overallPercent === null ? '' : result.overallPercent.toFixed(0)].map(csvEsc).join(','));
  lines.push(['summary', 'teamsPercent',
    result.teams.percent === null ? '' : result.teams.percent.toFixed(0)].map(csvEsc).join(','));
  lines.push(['summary', 'stakeholdersPercent',
    result.stakeholders.percent === null ? '' : result.stakeholders.percent.toFixed(0)].map(csvEsc).join(','));
  lines.push(['summary', 'practicesPercent',
    result.practices.percent === null ? '' : result.practices.percent.toFixed(0)].map(csvEsc).join(','));
  lines.push(['summary', 'answeredCount', String(result.answeredCount)].map(csvEsc).join(','));
  lines.push('');
  lines.push('itemId,section,text,answer');
  ALL_ITEMS.forEach(function (item) {
    lines.push([
      item.id, SECTION_LABEL[item.section], item.text, state.answers[item.id] || '',
    ].map(csvEsc).join(','));
  });
  lines.push('');
  lines.push('actionPlan,key,value');
  Object.keys(state.actionPlan).forEach(function (k) {
    lines.push(['actionPlan', k, state.actionPlan[k]].map(csvEsc).join(','));
  });
  lines.push('');
  lines.push('flag,priority,description,suggestedAction');
  result.additionalFlags.forEach(function (f) {
    lines.push([f.flagId, f.priority, f.description, f.suggestedAction].map(csvEsc).join(','));
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

function maturityLabel(m) {
  return m.toUpperCase().replace(/-/g, ' ');
}

function pctOrDash(p) {
  return p === null ? '—' : p.toFixed(0) + '%';
}

function renderReport() {
  const result = calculateMaturity(state.answers);
  const reportEl = document.getElementById('report');
  if (!reportEl) return;

  const bannerHtml =
    '<div class="maturity-banner maturity-' + esc(result.maturity) + '">' +
      '<p><strong>Composite maturity: </strong>' + esc(maturityLabel(result.maturity)) + '</p>' +
      '<p><strong>Overall: </strong>' + esc(pctOrDash(result.overallPercent)) + ' yes' +
        ' (' + result.answeredCount + '/' + ALL_ITEMS.length + ' answered)</p>' +
      '<p><strong>Sections: </strong>' +
        'Teams ' + esc(pctOrDash(result.teams.percent)) + ' (' + esc(result.teams.band) + ')  ·  ' +
        'Stakeholders ' + esc(pctOrDash(result.stakeholders.percent)) + ' (' + esc(result.stakeholders.band) + ')  ·  ' +
        'Practices ' + esc(pctOrDash(result.practices.percent)) + ' (' + esc(result.practices.band) + ')' +
      '</p>' +
      (result.additionalFlags.length
        ? '<ul class="flag-list">' +
            result.additionalFlags.map(function (f) {
              return '<li><strong>[' + esc(f.priority.toUpperCase()) + '] </strong>' +
                esc(f.description) + ' — ' + esc(f.suggestedAction) + '</li>';
            }).join('') +
          '</ul>'
        : '<p>No operational flags raised.</p>') +
    '</div>';

  const firedHtml = result.firedRules.length
    ? '<details class="fired-rules"><summary>Fired coaching rules (' + result.firedRules.length + ')</summary>' +
      '<ul class="flag-list">' +
        result.firedRules.map(function (r) {
          return '<li><code>' + esc(r.ruleId) + '</code> — ' + esc(r.description || '(no coaching note)') + '</li>';
        }).join('') +
      '</ul></details>'
    : '';

  const itemRowsHtml = ALL_ITEMS.map(function (item) {
    const a = state.answers[item.id] || '';
    const cls = a ? 'ans-' + a : 'ans-blank';
    return '<tr class="' + cls + '">' +
      '<td class="mono">' + esc(item.id) + '</td>' +
      '<td>' + esc(SECTION_LABEL[item.section]) + '</td>' +
      '<td>' + esc(item.text) + '</td>' +
      '<td class="ans">' + esc(a ? a.toUpperCase().replace(/-/g, ' ') : '—') + '</td>' +
    '</tr>';
  }).join('');

  reportEl.innerHTML =
    '<div class="report-header">' +
      '<h2>Checklist report</h2>' +
      '<button type="button" id="download-csv" class="button" data-variant="primary">Download CSV</button>' +
    '</div>' +
    '<p class="muted">Generated ' + esc(new Date().toLocaleString()) + '</p>' +
    bannerHtml +
    firedHtml +
    '<h3>Per-item answers</h3>' +
    '<table class="item-table">' +
      '<thead><tr>' +
        '<th>ID</th><th>Section</th><th>Item</th><th>Answer</th>' +
      '</tr></thead>' +
      '<tbody>' + itemRowsHtml + '</tbody>' +
    '</table>' +
    '<div class="report-actions">' +
      '<button type="button" id="print-btn" class="button" data-variant="secondary">Print / save PDF</button>' +
      '<button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>' +
    '</div>';

  document.getElementById('download-csv').addEventListener('click', function () {
    downloadCsv('agile-checklist.csv', buildCsv(result));
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
  if (!confirm('Clear all answers and start a fresh assessment?')) return;
  state = emptyState();
  clearDraft();
  hideDraftBanner();
  const out = document.getElementById('report');
  if (out) out.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  updateSectionSummary();
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
  updateSectionSummary();
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
