// Patient → clinician handoff (producer side).
//
// A patient's self-reported pre-operative questionnaire should flow straight
// into the clinician's assessment so identity, anthropometrics, and the
// patient-reported history are not re-keyed. This module adds a "Send to
// clinician assessment" action that packages the patient's demographics and a
// compact self-report summary into a same-origin localStorage handoff, then
// opens the sibling clinician form pre-filled.
//
// Self-contained progressive enhancement; the page is fully usable without it.
// Wrapped in an IIFE; exposes nothing globally.

(function () {
'use strict';

var HANDOFF_KEY = 'pre-operative-assessment.handoff.v1';
var CLINICIAN_URL =
  '../../pre-operative-assessment-by-clinician/front-end-with-html/index.html?handoff=1';

/** Read the current patient draft (whatever the wizard has saved). */
function readDraft() {
  try {
    var key = window.__A11Y_DRAFT_KEY__;
    if (!key) return null;
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function num(v) {
  return typeof v === 'number' && !isNaN(v) ? v : null;
}

/** Package the patient draft into a handoff payload for the clinician form. */
function buildHandoff(draft) {
  var d = (draft && draft.demographics) || {};
  var soc = (draft && draft.socialHistory) || {};
  var fc = (draft && draft.functionalCapacity) || {};
  var meds = (draft && draft.medications) || [];
  var alg = (draft && draft.allergies) || [];
  return {
    source: 'pre-operative-assessment-by-patient',
    createdAt: new Date().toISOString(),
    patient: {
      firstName: d.firstName || '',
      lastName: d.lastName || '',
      dateOfBirth: d.dateOfBirth || '',
      sex: d.sex || '',
      weightKg: num(d.weight),
      heightCm: num(d.height)
    },
    selfReport: {
      alcoholUnitsPerWeek: num(soc.alcoholUnitsPerWeek),
      exerciseTolerance: fc.exerciseTolerance || '',
      estimatedMETs: num(fc.estimatedMETs),
      medicationCount: meds.length,
      allergyCount: alg.length
    }
  };
}

function handoff() {
  var draft = readDraft();
  var payload = buildHandoff(draft || {});
  if (!payload.patient.firstName && !payload.patient.lastName) {
    var go = window.confirm(
      'No patient name has been entered yet. Open the clinician assessment anyway?'
    );
    if (!go) return;
  }
  try {
    localStorage.setItem(HANDOFF_KEY, JSON.stringify(payload));
  } catch (e) {
    /* ignore */
  }
  window.location.href = CLINICIAN_URL;
}

function init() {
  var header = document.querySelector('.page-header-inner');
  if (!header) return;
  var p = document.createElement('p');
  p.className = 'subtitle';
  var a = document.createElement('a');
  a.href = '#';
  a.textContent = 'Send to clinician assessment →';
  a.setAttribute(
    'title',
    'Carry this self-report into a pre-filled clinician pre-operative assessment'
  );
  a.addEventListener('click', function (ev) {
    ev.preventDefault();
    handoff();
  });
  p.appendChild(a);
  header.appendChild(p);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
