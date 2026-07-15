// Request → response handoff (producer side).
//
// Closes the ACAS loop: a worker's reasonable-adjustments request should flow
// straight into the employer's response. This module adds a "Draft the employer
// response" action that packages the request's worker/manager identity and the
// requested adjustment categories into a same-origin localStorage handoff, then
// opens the sibling response form pre-filled.
//
// Self-contained, progressive enhancement.

(function () {
'use strict';

var HANDOFF_KEY = 'neurodiversity-adjustment.handoff.v1';
var RESPONSE_URL =
  '../../neurodiversity-adjustment-response/front-end-with-html/index.html?handoff=1';

// Request adjustment field -> canonical category key.
var CATEGORY_MAP = {
  adjustmentWorkingEnvironment: 'working-environment',
  adjustmentEquipmentTechnology: 'equipment-technology',
  adjustmentWorkingArrangements: 'working-arrangements',
  adjustmentCommunication: 'communication',
  adjustmentSupportMentoring: 'support-mentoring',
  adjustmentRecruitmentProcess: 'recruitment-process',
  adjustmentPolicyDress: 'policy-dress',
  adjustmentOther: 'other'
};

/** Read the current request draft (whatever the wizard has saved). */
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

/** Build a short, human-readable reference for the request. */
function buildReference(worker) {
  var name = (worker && worker.name ? worker.name : 'worker')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
  var now = new Date();
  var stamp =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  return 'REQ-' + stamp + '-' + (name || 'worker');
}

/** Package the draft into a handoff payload. */
function buildHandoff(draft) {
  var worker = (draft && draft.worker) || {};
  var manager = (draft && draft.manager) || {};
  var adjustments = (draft && draft.adjustments) || {};
  var requested = [];
  Object.keys(CATEGORY_MAP).forEach(function (field) {
    if (adjustments[field] === true) requested.push(CATEGORY_MAP[field]);
  });
  return {
    requestReference: buildReference(worker),
    worker: {
      name: worker.name || '',
      jobTitle: worker.jobTitle || '',
      department: worker.department || ''
    },
    manager: {
      name: manager.name || '',
      jobTitle: manager.jobTitle || '',
      department: manager.department || ''
    },
    requestedCategories: requested,
    createdAt: new Date().toISOString()
  };
}

function handoff() {
  var draft = readDraft();
  var payload = buildHandoff(draft || {});
  if (!payload.worker.name) {
    var go = window.confirm(
      'No worker name has been entered yet. Draft the employer response anyway?'
    );
    if (!go) return;
  }
  try {
    localStorage.setItem(HANDOFF_KEY, JSON.stringify(payload));
  } catch (e) {
    /* ignore */
  }
  window.location.href = RESPONSE_URL;
}

function init() {
  var header = document.querySelector('.page-header-inner');
  if (!header) return;
  var p = document.createElement('p');
  p.className = 'subtitle';
  var a = document.createElement('a');
  a.href = '#';
  a.textContent = 'Draft the employer response →';
  a.setAttribute('title', 'Carry this request into a pre-filled employer response');
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
