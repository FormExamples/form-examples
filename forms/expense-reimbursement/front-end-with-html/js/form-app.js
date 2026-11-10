import { calculateGrade } from './grader.js';
import { claimTotals, usedItems } from './rules.js';
import { EXPENSE_CATEGORIES, emptyClaim, emptyItem } from './types.js';

// Expense Reimbursement — claim wizard (vanilla JS).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page progress
// summary reflects how many fields have been answered. Submission runs the pure
// three-axis grader and renders an inline claim report. State is persisted to
// localStorage so a partial fill survives a page reload.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'expense-reimbursement.front-end-with-html.v1';
try { window.__A11Y_DRAFT_KEY__ = STORAGE_KEY; } catch (e) {}
const TOTAL_STEPS = 6;

// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  const fresh = emptyClaim();

  for (const key of Object.keys(fresh)) {
    const v = parsed && parsed[key];
    if (key === 'items') {
      fresh.items =
        Array.isArray(v) && v.length > 0
          ? v.map((it, i) => ({ ...emptyItem(i + 1), ...it, lineNumber: i + 1 }))
          : [emptyItem(1)];
    } else if (v && typeof v === 'object') {
      fresh[key] = { ...fresh[key], ...v };
    }
  }
  return fresh;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyClaim();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved claim; starting fresh.', e);
    return emptyClaim();
  }
}

function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn('Could not save claim to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored claim.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

// Captured before loadState() reads it, so js/restore-banner.js can tell
// "a previous draft was restored" apart from "this is a blank first visit"
// without needing to know the STORAGE_KEY itself.
let hadDraftAtLoad = false;
try {
  hadDraftAtLoad = localStorage.getItem(STORAGE_KEY) !== null;
} catch (e) {
  // Ignore; loadState() below will hit the same failure and fall back safely.
}

let state = loadState();
/** @type {ReturnType<typeof calculateGrade> | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'expense-reimbursement',
  hadDraftAtLoad,
  getState: () => state,
  setState: (raw) => {
    state = mergeIntoDefaults(raw);
    saveState(state);
    resetView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const EMPTY_REPORT = '<p class="empty-message">Submit the form to see the claim report.</p>';

function resetView() {
  lastResult = null;
  document.getElementById('report').innerHTML = EMPTY_REPORT;
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  updateConditionalSections();
  updateTotals();
}

/** The object a field lives on: an explicit `obj` (an expense line) or a state section. */
function target(opts) {
  return opts.obj || state[opts.section];
}

/** DOM id for a field; expense lines are namespaced by line number. */
function fid(opts) {
  return opts.obj ? `item-${opts.obj.lineNumber}-${opts.field}` : `${opts.section}-${opts.field}`;
}

function setField(opts, value) {
  target(opts)[opts.field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
  updateTotals();
}

function setBool(opts, checked) {
  target(opts)[opts.field] = !!checked;
  saveState(state);
  updateProgress();
  updateConditionalSections();
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ----------------------------------------------------------------------
// Component builders
// ----------------------------------------------------------------------

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

function textInput(opts) {
  const id = fid(opts);
  const value = target(opts)[opts.field];
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value ?? '')}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required', 'data-required');
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
    <span class="error-message" id="${id}-error"></span>
  `;

  const input = wrapper.querySelector('input');
  input.setAttribute('aria-describedby', `${id}-error`);
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') v = v === '' ? null : Number(v);
    setField(opts, v);
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = fid(opts);
  const value = target(opts)[opts.field] ?? '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.required ? 'data-required' : ''}
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      aria-describedby="${id}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setField(opts, ta.value);
    clearFieldError(id);
  });
  return wrapper;
}

function selectInput(opts) {
  const id = fid(opts);
  const current = target(opts)[opts.field] ?? '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <select id="${id}" name="${id}" class="select"${opts.required ? ' data-required' : ''} aria-describedby="${id}-error">
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    setField(opts, sel.value);
    clearFieldError(id);
  });
  return wrapper;
}

/** Single boolean toggle (checkbox) bound to a boolean field. */
function boolField(opts) {
  const id = fid(opts);
  const checked = target(opts)[opts.field] === true;
  const wrapper = document.createElement('div');
  wrapper.className = 'bool-field';
  wrapper.innerHTML = `
    <input type="checkbox" class="checkbox-input" id="${id}" name="${id}"${checked ? ' checked' : ''}>
    <label for="${id}">${esc(opts.label)}</label>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('change', () => {
    setBool(opts, input.checked);
  });
  return wrapper;
}

function sectionCard(opts) {
  const card = document.createElement('fieldset');
  card.className = 'fieldset';
  card.dataset.step = String(opts.stepNumber);
  card.id = `step-${opts.stepNumber}`;
  const desc = opts.description
    ? `<span class="section-description">${esc(opts.description)}</span>`
    : '';
  const legend = document.createElement('legend');
  legend.className = 'fieldset-legend';
  legend.innerHTML = `
    <span class="section-step">Step ${opts.stepNumber} of ${TOTAL_STEPS}</span>
    <h2 class="section-title">${esc(opts.title)}</h2>
    ${desc}
  `;
  card.appendChild(legend);
  return card;
}

function subHead(text) {
  const h = document.createElement('h3');
  h.textContent = text;
  return h;
}

function grid(cols, children) {
  const g = document.createElement('div');
  g.className = cols;
  for (const c of children) g.appendChild(c);
  return g;
}

// ----------------------------------------------------------------------
// Option lists
// ----------------------------------------------------------------------

const MANAGER_ROLE_OPTIONS = [
  { value: 'line-manager', label: 'Line manager' },
  { value: 'budget-holder', label: 'Budget holder' },
  { value: 'finance', label: 'Finance' },
  { value: 'senior-manager', label: 'Senior manager' },
  { value: 'other', label: 'Other' }
];

const CATEGORY_OPTIONS = EXPENSE_CATEGORIES.map(([value, label]) => ({ value, label }));

const CURRENCY_OPTIONS = ['GBP', 'EUR', 'USD', 'CHF', 'AUD', 'CAD'].map((c) => ({ value: c, label: c }));

const PAYMENT_METHOD_OPTIONS = [
  { value: 'personal-credit-card', label: 'Personal credit card' },
  { value: 'personal-debit-card', label: 'Personal debit card' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' }
];

const REPAYMENT_METHOD_OPTIONS = [
  { value: 'payroll', label: 'Add to my next payroll' },
  { value: 'bank-transfer', label: 'Bank transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' }
];

// ----------------------------------------------------------------------
// Step renderers
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Worker',
    description: 'Who paid the expense and wants to be repaid.'
  });
  card.appendChild(textInput({ label: 'Your name', section: 'worker', field: 'name', required: true }));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Job title', section: 'worker', field: 'jobTitle' }),
    textInput({ label: 'Department / team', section: 'worker', field: 'department' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Employee reference', section: 'worker', field: 'employeeReference' }),
    textInput({ label: 'Cost centre', section: 'worker', field: 'costCentre' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Email', section: 'worker', field: 'email', type: 'email' }),
    textInput({ label: 'Phone', section: 'worker', field: 'phone', type: 'tel' })
  ]));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Approver',
    description: 'The manager who will review the claim.'
  });
  card.appendChild(textInput({ label: 'Approver name', section: 'manager', field: 'name', required: true }));
  card.appendChild(grid('two-col', [
    selectInput({ label: 'Role', section: 'manager', field: 'role', options: MANAGER_ROLE_OPTIONS }),
    textInput({ label: 'Job title', section: 'manager', field: 'jobTitle' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Department', section: 'manager', field: 'department' }),
    textInput({ label: 'Email', section: 'manager', field: 'email', type: 'email' })
  ]));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Claim',
    description: 'What the expenses were for.'
  });
  card.appendChild(grid('two-col', [
    textInput({ label: 'Claim date', section: 'claim', field: 'claimDate', type: 'date', required: true }),
    textInput({ label: 'Claim title', section: 'claim', field: 'title', required: true, placeholder: 'e.g. Resuscitation course travel' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Period start', section: 'claim', field: 'periodStart', type: 'date' }),
    textInput({ label: 'Period end', section: 'claim', field: 'periodEnd', type: 'date' })
  ]));
  card.appendChild(textArea({
    label: 'Business purpose',
    section: 'claim',
    field: 'businessPurpose',
    required: true,
    rows: 3,
    placeholder: 'Why were these expenses needed for your work?'
  }));
  card.appendChild(grid('three-col', [
    textInput({ label: 'Project or cost code', section: 'claim', field: 'projectOrCostCode' }),
    selectInput({ label: 'Claim currency', section: 'claim', field: 'currency', options: CURRENCY_OPTIONS }),
    textInput({ label: 'Advance already received', section: 'claim', field: 'advanceReceivedAmount', type: 'number', min: 0, step: '0.01' })
  ]));
  return card;
}

function renderItem(item) {
  const n = item.lineNumber;
  const box = document.createElement('div');
  box.className = 'expense-line';
  box.dataset.line = String(n);
  const head = document.createElement('div');
  head.className = 'expense-line-head';
  head.innerHTML = `<h3>Expense ${n}</h3>`;
  if (state.items.length > 1) {
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'button';
    rm.dataset.variant = 'secondary';
    rm.textContent = 'Remove';
    rm.setAttribute('aria-label', `Remove expense ${n}`);
    rm.addEventListener('click', () => removeItem(n));
    head.appendChild(rm);
  }
  box.appendChild(head);
  const o = (field, extra) => ({ obj: item, field, ...extra });
  box.appendChild(grid('three-col', [
    textInput(o('expenseDate', { label: 'Date', type: 'date' })),
    selectInput(o('category', { label: 'Category', options: CATEGORY_OPTIONS })),
    textInput(o('merchant', { label: 'Merchant / supplier' }))
  ]));
  box.appendChild(textInput(o('description', { label: 'Description' })));
  box.appendChild(grid('three-col', [
    textInput(o('amount', { label: 'Amount (including VAT)', type: 'number', min: 0, step: '0.01' })),
    textInput(o('vatAmount', { label: 'VAT included', type: 'number', min: 0, step: '0.01' })),
    selectInput(o('currency', { label: 'Currency paid in', options: CURRENCY_OPTIONS }))
  ]));
  box.appendChild(grid('three-col', [
    textInput(o('exchangeRate', { label: 'Exchange rate to claim currency', type: 'number', min: 0, step: '0.000001' })),
    selectInput(o('paymentMethod', { label: 'How you paid', options: PAYMENT_METHOD_OPTIONS })),
    textInput(o('mileageDistanceMiles', { label: 'Mileage (miles)', type: 'number', min: 0, step: '0.1' }))
  ]));
  box.appendChild(grid('two-col', [
    textInput(o('receiptReference', { label: 'Receipt reference' })),
    textInput(o('receiptMissingReason', { label: 'If there is no receipt, why not?' }))
  ]));
  box.appendChild(boolField(o('receiptAttached', { label: 'Receipt attached' })));
  box.appendChild(boolField(o('priorApprovalObtained', { label: 'My manager approved this in advance' })));
  return box;
}

function addItem() {
  state.items.push(emptyItem(state.items.length + 1));
  saveState(state);
  renderForm();
  updateProgress();
  updateTotals();
  const last = document.querySelector(`[data-line="${state.items.length}"] input, [data-line="${state.items.length}"] select`);
  if (last) last.focus();
}

function removeItem(lineNumber) {
  state.items = state.items.filter((i) => i.lineNumber !== lineNumber);
  state.items.forEach((i, idx) => { i.lineNumber = idx + 1; });
  saveState(state);
  renderForm();
  updateProgress();
  updateTotals();
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Expenses',
    description: 'One entry per receipt or purchase you paid for yourself.'
  });
  for (const item of state.items) card.appendChild(renderItem(item));
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'button';
  add.dataset.variant = 'secondary';
  add.id = 'add-item-btn';
  add.textContent = 'Add another expense';
  add.addEventListener('click', addItem);
  card.appendChild(add);
  const totals = document.createElement('p');
  totals.id = 'totals';
  totals.className = 'subtitle';
  totals.setAttribute('aria-live', 'polite');
  card.appendChild(totals);
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Repayment',
    description: 'How you would like to be repaid.'
  });
  card.appendChild(selectInput({ label: 'Repayment method', section: 'repayment', field: 'method', options: REPAYMENT_METHOD_OPTIONS }));
  const bank = document.createElement('div');
  bank.setAttribute('data-conditional', 'repayment.method=bank-transfer');
  bank.appendChild(grid('two-col', [
    textInput({ label: 'Account holder name', section: 'repayment', field: 'bankAccountName' }),
    textInput({ label: 'Last four digits of account number', section: 'repayment', field: 'bankAccountLastFour', placeholder: '1234' })
  ]));
  const note = document.createElement('p');
  note.className = 'subtitle';
  note.textContent = 'Never enter your full account number here; finance will confirm the rest securely.';
  bank.appendChild(note);
  card.appendChild(bank);
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Declaration & submit',
    description: 'Confirm the claim is honest, then submit to compute the three-axis grade and flags.'
  });
  card.appendChild(boolField({ label: 'These expenses were incurred wholly for work', section: 'declarations', field: 'whollyForWork' }));
  card.appendChild(boolField({ label: 'I have not claimed any of these expenses before', section: 'declarations', field: 'noDuplicateClaim' }));
  card.appendChild(boolField({ label: 'I have attached the receipts', section: 'declarations', field: 'receiptsAttached' }));
  card.appendChild(textInput({ label: 'Type your name to sign', section: 'declarations', field: 'signedName', required: true }));
  return card;
}

const STEP_RENDERERS = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6];

// ----------------------------------------------------------------------
// Conditional sections and live totals
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, targetValue] = expr.split('=');
    const [section, field] = path.split('.');
    const current = String(state[section]?.[field] ?? '');
    host.style.display = current === targetValue ? '' : 'none';
  });
}

function formatMoney(n) {
  return `${state.claim.currency || 'GBP'} ${Number(n).toFixed(2)}`;
}

function updateTotals() {
  const el = document.getElementById('totals');
  if (!el) return;
  const t = claimTotals(state);
  el.textContent =
    `Total ${formatMoney(t.total)} (VAT ${formatMoney(t.vat)}) · ` +
    `advance ${formatMoney(t.advance)} · to repay ${formatMoney(t.amountToRepay)}`;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  { section: 'worker', get: (s) => s.worker.name },
  { section: 'worker', get: (s) => s.worker.jobTitle },
  { section: 'manager', get: (s) => s.manager.name },
  { section: 'claim', get: (s) => s.claim.claimDate },
  { section: 'claim', get: (s) => s.claim.title },
  { section: 'claim', get: (s) => s.claim.businessPurpose },
  { section: 'items', get: (s) => (usedItems(s).length > 0 ? 'yes' : '') },
  { section: 'repayment', get: (s) => s.repayment.method },
  { section: 'declarations', get: (s) => s.declarations.signedName }
];

function isAnswered(v) {
  return v !== null && v !== undefined && v !== '';
}

function updateProgress() {
  let answered = 0;
  const sectionAnswered = {};
  const sectionTotal = {};
  for (const f of TRACKED_FIELDS) {
    sectionTotal[f.section] = (sectionTotal[f.section] || 0) + 1;
    if (isAnswered(f.get(state))) {
      answered++;
      sectionAnswered[f.section] = (sectionAnswered[f.section] || 0) + 1;
    }
  }
  const total = TRACKED_FIELDS.length;
  const percent = Math.round((answered / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  updateStepListStatuses(sectionAnswered, sectionTotal);
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1, section: 'worker',       title: 'Worker' },
  { step: 2, section: 'manager',      title: 'Approver' },
  { step: 3, section: 'claim',        title: 'Claim' },
  { step: 4, section: 'items',        title: 'Expenses' },
  { step: 5, section: 'repayment',    title: 'Repayment' },
  { step: 6, section: 'declarations', title: 'Declaration' }
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

function updateStepListStatuses(sectionAnswered, sectionTotal) {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  for (const def of STEP_DEFINITIONS) {
    const li = ol.querySelector(`[data-step="${def.step}"]`);
    if (!li) continue;
    const a = sectionAnswered[def.section] || 0;
    const t = sectionTotal[def.section] || 0;
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
    if (current.dataset.status === 'waiting') {
      current.dataset.status = 'in-progress';
    }
  }
  ol.dataset.current = String(firstUnfinished - 1);
}


// ----------------------------------------------------------------------
// Validation
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
}

function setFieldError(id, message) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = message;
  const input = document.getElementById(id);
  if (input) input.setAttribute('aria-invalid', 'true');
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
      const label = labelEl ? labelEl.textContent.replace(/\s*\*\s*$/, '').trim() : id;
      errors.push({ id, message: `${label} is required` });
      setFieldError(id, `${label} is required`);
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
  summary.innerHTML = `
    <strong>Please correct the following:</strong>
    <ul>
      ${errors.map((e) => `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`).join('')}
    </ul>
  `;
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  summary.focus({ preventScroll: true });
}


// ----------------------------------------------------------------------
// Submit / Report
// ----------------------------------------------------------------------

function priorityClass(priority) {
  switch (priority) {
    case 'high': return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low': return 'flag-low';
    default: return '';
  }
}

function titleCase(s) {
  return String(s || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    complianceBand,
    completenessPercent,
    approvalTier,
    total,
    amountToRepay,
    recommendation,
    recommendationLabel,
    firedRules,
    flags,
    timestamp
  } = lastResult;

  const flagsList = flags.length === 0
    ? `<p class="muted">No policy or fraud-prevention flags raised.</p>`
    : `
      <ul class="flags">
        ${flags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}</span>
            <span class="flag-action">${esc(f.suggestedAction)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const firedRows = firedRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.ruleId)}</th>
      <td>${esc(r.axis)}</td>
      <td>${esc(r.category)}</td>
      <td>${esc(r.description)}</td>
    </tr>
  `).join('');

  const firedTable = `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Rule</th>
            <th scope="col">Axis</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  const lineRows = usedItems(state).map((i) => `
    <tr>
      <th scope="row">${i.lineNumber}</th>
      <td>${esc(i.expenseDate || '—')}</td>
      <td>${esc(titleCase(i.category) || '—')}</td>
      <td>${esc(i.description || '—')}</td>
      <td>${esc(i.merchant || '—')}</td>
      <td>${esc(i.currency)} ${i.amount === null ? '—' : esc(Number(i.amount).toFixed(2))}</td>
      <td>${i.receiptAttached ? 'Yes' : 'No'}</td>
    </tr>
  `).join('');

  out.innerHTML = `
    <h2>Expense Reimbursement Report</h2>
    <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())} · Worker: ${esc(state.worker.name || '—')} · Claim: ${esc(state.claim.title || '—')} · Approver: ${esc(state.manager.name || '—')}</p>

    <div class="recommendation-banner">
      <span class="band-badge rec-${esc(recommendation)}">${esc(recommendationLabel)}</span>
      <span class="band-badge appr-${esc(approvalTier)}">${esc(titleCase(approvalTier))}</span>
    </div>

    <h3>Three-axis grade</h3>
    <div class="axis-grid">
      <div class="axis-card">
        <span class="axis-name">A · Policy compliance</span>
        <span class="axis-value">
          <span class="band-badge comp-${esc(complianceBand)}">${esc(titleCase(complianceBand))}</span>
        </span>
      </div>
      <div class="axis-card">
        <span class="axis-name">B · Completeness</span>
        <span class="axis-value"><strong>${completenessPercent}%</strong></span>
        <div class="completeness-bar"><span style="width:${completenessPercent}%"></span></div>
      </div>
      <div class="axis-card">
        <span class="axis-name">C · Approval tier</span>
        <span class="axis-value"><span class="band-badge appr-${esc(approvalTier)}">${esc(titleCase(approvalTier))}</span></span>
      </div>
      <div class="axis-card">
        <span class="axis-name">Amount to repay</span>
        <span class="axis-value"><strong>${esc(formatMoney(amountToRepay))}</strong></span>
        <span class="muted">Claim total ${esc(formatMoney(total))}</span>
      </div>
    </div>

    <h3>Expenses</h3>
    <table class="subscales">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Date</th>
          <th scope="col">Category</th>
          <th scope="col">Description</th>
          <th scope="col">Merchant</th>
          <th scope="col">Amount</th>
          <th scope="col">Receipt</th>
        </tr>
      </thead>
      <tbody>${lineRows}</tbody>
    </table>

    <h3>Fired rules</h3>
    ${firedTable}

    <h3>Policy &amp; fraud-prevention flags</h3>
    ${flagsList}

    <div class="report-actions">
      <button type="button" id="print-btn" class="button" data-variant="secondary">Print / save PDF</button>
      <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
  document.getElementById('print-btn').addEventListener('click', () => window.print());
}

function submitForm() {
  const errors = validateForm();
  if (errors.length > 0) return;
  const result = calculateGrade(state);
  lastResult = {
    ...result,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh claim?')) return;
  clearState();
  state = emptyClaim();
  resetView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function renderForm() {
  const host = document.getElementById('form-sections');
  host.innerHTML = '';
  for (const r of STEP_RENDERERS) host.appendChild(r());
  updateConditionalSections();
  updateTotals();
}

function init() {
  renderStepList();
  renderForm();
  updateProgress();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
