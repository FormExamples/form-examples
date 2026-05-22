import { emptyAuthorization } from './types.js';
import { validateAuthorization } from './validate-authorization.js';

const STORAGE_KEY = 'us-hipaa-authorization-draft';

function readDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...emptyAuthorization(), ...JSON.parse(raw) };
    }
  } catch (_) {}
  return emptyAuthorization();
}

function writeDraft(authorization) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authorization));
  } catch (_) {}
}

function setDeep(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in cur)) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function snakeToCamel(name) {
  return name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function inputPathToObjectPath(name) {
  const [section, ...rest] = name.split('.');
  return [snakeToCamel(section), snakeToCamel(rest.join('.'))].join('.');
}

function readInputs(authorization) {
  const inputs = document.querySelectorAll('[name]');
  for (const input of inputs) {
    if (input.type === 'radio' || input.type === 'checkbox') {
      if (!input.checked) continue;
    }
    const path = inputPathToObjectPath(input.name);
    let v = input.value;
    if (input.type === 'checkbox') v = input.checked ? 'yes' : '';
    if (input.type === 'date') v = input.value || null;
    if (input.type === 'number') v = input.value === '' ? null : Number(input.value);
    setDeep(authorization, path, v);
  }
  return authorization;
}

function renderResult(result) {
  const status = document.getElementById('validity-status');
  status.textContent = `Validity: ${result.validityStatus}; completeness ${result.completenessScore}% (${result.completenessStatus}).`;

  const rules = document.getElementById('fired-rules');
  rules.replaceChildren(...result.firedRules.map((r) => {
    const li = document.createElement('li');
    li.textContent = `[${r.priority}] ${r.ruleId} — ${r.description} (${r.citation})`;
    return li;
  }));

  const flags = document.getElementById('additional-flags');
  flags.replaceChildren(...result.additionalFlags.map((f) => {
    const li = document.createElement('li');
    li.textContent = `[${f.priority}] ${f.flagId} — ${f.message}`;
    return li;
  }));

  const fill = document.getElementById('progress-bar-fill');
  fill.style.width = `${result.completenessScore}%`;
  document.getElementById('progress-text').textContent = `${result.completenessScore}% complete`;
}

function recompute() {
  const a = readInputs(emptyAuthorization());
  writeDraft(a);
  renderResult(validateAuthorization(a));
}

function hydrate() {
  const a = readDraft();
  for (const input of document.querySelectorAll('[name]')) {
    const path = inputPathToObjectPath(input.name);
    const [sec, key] = path.split('.');
    const v = a[sec]?.[key];
    if (v === undefined || v === null || v === '') continue;
    if (input.type === 'radio') input.checked = input.value === v;
    else if (input.type === 'checkbox') input.checked = v === 'yes';
    else input.value = v;
  }
  recompute();
}

document.addEventListener('input', recompute);
document.addEventListener('change', recompute);
window.addEventListener('DOMContentLoaded', hydrate);
