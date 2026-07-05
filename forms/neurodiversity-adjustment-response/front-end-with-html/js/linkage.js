// Request → response handoff (consumer side).
//
// Consumes the localStorage handoff written by the request form's "Draft the
// employer response" action. It runs BEFORE form-app.js: it pre-seeds the
// response draft (worker + manager identity, originating request reference) so
// the wizard opens pre-filled, and it renders a banner listing the adjustment
// categories the worker requested so the responder can mark each agreed or
// declined. Idempotent and one-shot (the handoff is consumed on use).
//
// Self-contained, progressive enhancement. Wrapped in an IIFE.

(function () {
'use strict';

var HANDOFF_KEY = 'neurodiversity-adjustment.handoff.v1';
var DRAFT_KEY = 'neurodiversity-adjustment-response.front-end-with-html.v1';
var REQUESTED_KEY = 'neurodiversity-adjustment-response.requested.v1';

var CATEGORY_LABELS = {
  'working-environment': 'Working environment',
  'equipment-technology': 'Equipment / technology',
  'working-arrangements': 'Working arrangements',
  'communication': 'Communication',
  'support-mentoring': 'Support / mentoring',
  'recruitment-process': 'Recruitment process',
  'policy-dress': 'Policy / dress code',
  'other': 'Other'
};

/** Read + parse a localStorage JSON value, tolerating errors. */
function readJson(key) {
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/** Merge the handoff identity into any existing response draft. */
function seedDraft(handoff) {
  var draft = readJson(DRAFT_KEY) || {};
  draft.worker = Object.assign({}, draft.worker, {
    name: handoff.worker.name || (draft.worker && draft.worker.name) || '',
    jobTitle: handoff.worker.jobTitle || (draft.worker && draft.worker.jobTitle) || '',
    department: handoff.worker.department || (draft.worker && draft.worker.department) || ''
  });
  draft.manager = Object.assign({}, draft.manager, {
    name: handoff.manager.name || (draft.manager && draft.manager.name) || '',
    jobTitle: handoff.manager.jobTitle || (draft.manager && draft.manager.jobTitle) || '',
    department: handoff.manager.department || (draft.manager && draft.manager.department) || ''
  });
  draft.response = Object.assign({}, draft.response, {
    requestReference: handoff.requestReference || (draft.response && draft.response.requestReference) || ''
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
    localStorage.setItem(REQUESTED_KEY, JSON.stringify(handoff.requestedCategories || []));
    localStorage.removeItem(HANDOFF_KEY); // one-shot
  } catch (e) {
    /* ignore */
  }
}

/** Render a banner listing the categories the worker requested. */
function renderBanner() {
  var requested = readJson(REQUESTED_KEY);
  if (!requested || !requested.length) return;
  var main = document.querySelector('main');
  if (!main || document.getElementById('requested-banner')) return;
  var labels = requested
    .map(function (c) { return CATEGORY_LABELS[c] || c; })
    .join(', ');
  var box = document.createElement('div');
  box.id = 'requested-banner';
  box.className = 'requested-banner';
  box.setAttribute('role', 'note');
  box.innerHTML =
    '<strong>Adjustments requested by the worker:</strong> ' +
    labels +
    '. <span class="requested-hint">Mark each one agreed, offer an alternative, or record why it is declined.</span>';
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
