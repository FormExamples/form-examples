// Patient → clinician handoff (consumer side).
//
// Consumes the localStorage handoff written by the patient self-report form's
// "Send to clinician assessment" action. It runs BEFORE form-app.js (included
// first): it pre-seeds the clinician draft's patient identity + anthropometrics
// so the wizard opens pre-filled, and renders a banner summarising the
// patient-reported history so the clinician can verify it against their own
// objective findings. Idempotent and one-shot (the handoff is consumed on use).
//
// Self-contained progressive enhancement. Wrapped in an IIFE.

(function () {
'use strict';

var HANDOFF_KEY = 'pre-operative-assessment.handoff.v1';
var DRAFT_KEY = 'pre-operative-assessment-by-clinician.front-end-with-html.v1';
var REPORTED_KEY = 'pre-operative-assessment-by-clinician.patient-reported.v1';

/** Read + parse a localStorage JSON value, tolerating errors. */
function readJson(key) {
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function pick(next, prev) {
  return next !== undefined && next !== null && next !== '' ? next : prev;
}

/** Merge the handoff patient identity into any existing clinician draft. */
function seedDraft(handoff) {
  var draft = readJson(DRAFT_KEY) || {};
  var p = handoff.patient || {};
  var cur = draft.patient || {};
  draft.patient = Object.assign({}, cur, {
    firstName: pick(p.firstName, cur.firstName || ''),
    lastName: pick(p.lastName, cur.lastName || ''),
    dateOfBirth: pick(p.dateOfBirth, cur.dateOfBirth || ''),
    sex: pick(p.sex, cur.sex || ''),
    weightKg: pick(p.weightKg, cur.weightKg != null ? cur.weightKg : null),
    heightCm: pick(p.heightCm, cur.heightCm != null ? cur.heightCm : null)
  });
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    /* ignore */
  }
}

/** Consume the one-shot handoff synchronously, before form-app loads. */
function consume() {
  var url = new URL(window.location.href);
  var flagged = url.searchParams.get('handoff') === '1';
  var handoff = readJson(HANDOFF_KEY);
  if (!handoff || !flagged) return;
  seedDraft(handoff);
  try {
    localStorage.setItem(REPORTED_KEY, JSON.stringify(handoff.selfReport || {}));
    localStorage.removeItem(HANDOFF_KEY); // one-shot
  } catch (e) {
    /* ignore */
  }
}

/** Render a banner summarising the patient-reported self-assessment. */
function renderBanner() {
  var r = readJson(REPORTED_KEY);
  if (!r) return;
  var main = document.querySelector('main');
  if (!main || document.getElementById('patient-reported-banner')) return;

  var parts = [];
  if (r.alcoholUnitsPerWeek != null) parts.push(r.alcoholUnitsPerWeek + ' alcohol units/week');
  if (r.exerciseTolerance) parts.push('exercise tolerance: ' + r.exerciseTolerance);
  if (r.estimatedMETs != null) parts.push('~' + r.estimatedMETs + ' METs');
  if (r.medicationCount) parts.push(r.medicationCount + ' medication(s)');
  if (r.allergyCount) parts.push(r.allergyCount + ' allerg' + (r.allergyCount === 1 ? 'y' : 'ies'));
  var summary = parts.length ? parts.join('; ') : 'no additional self-report detail provided';

  var box = document.createElement('div');
  box.id = 'patient-reported-banner';
  box.setAttribute('role', 'note');
  box.style.cssText =
    'margin:0 0 1rem;padding:0.75rem 1rem;border:1px solid var(--color-border,#cbd5e1);' +
    'border-left:4px solid var(--color-primary,#2563eb);border-radius:6px;' +
    'background:var(--color-surface,#f8fafc);font-size:0.95rem;line-height:1.5;';
  box.innerHTML =
    '<strong>Patient self-report imported:</strong> patient identity and ' +
    'measurements have been pre-filled. Reported history — ' +
    summary +
    '. <em>Verify against your objective examination and record the clinician findings.</em>';
  main.insertBefore(box, main.firstChild);
}

// Pre-seed must happen before form-app.js reads its draft (this file is
// included first), so run it synchronously at load.
consume();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderBanner);
} else {
  renderBanner();
}
})();
