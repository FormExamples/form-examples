import { calculateWaitingTimeStatus } from './composite-grader.js';
import { STEPS, createEmptyCard } from './types.js';

const root = window;
const doc = document;

  
  const STORAGE_KEY = 'thoracic-surgery-waiting-list-card-draft-v1';

  const state = createEmptyCard();

  function load() {
    try {
      const raw = root.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach(function (k) {
          if (k in state && typeof parsed[k] === 'object' && parsed[k] !== null) {
            Object.assign(state[k], parsed[k]);
          }
        });
      }
    } catch (e) {
      /* ignore */
    }
  }

  function save() {
    try {
      root.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }

  // Map every form control with data-bind="section.field" to the matching
  // path in state, and wire a two-way binding via the appropriate event.
  function bindInputs() {
    const inputs = doc.querySelectorAll('[data-bind]');
    inputs.forEach(function (el) {
      const path = el.getAttribute('data-bind').split('.');
      const section = path[0];
      const field = path[1];
      const cur = state[section] && state[section][field];

      if (el.type === 'radio') {
        el.checked = String(cur) === el.value;
      } else if (el.type === 'checkbox') {
        el.checked = !!cur;
      } else if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
        el.value = cur == null ? '' : cur;
      } else if (el.type === 'number') {
        el.value = cur == null ? '' : cur;
      } else {
        el.value = cur == null ? '' : cur;
      }

      const evt = el.tagName === 'SELECT' || el.type === 'radio' || el.type === 'checkbox'
        ? 'change'
        : 'input';

      el.addEventListener(evt, function () {
        let value;
        if (el.type === 'radio') {
          if (!el.checked) return;
          value = el.value;
        } else if (el.type === 'checkbox') {
          value = el.checked;
        } else if (el.type === 'number') {
          value = el.value === '' ? null : Number(el.value);
        } else if (el.type === 'date' || el.type === 'time') {
          value = el.value === '' ? null : el.value;
        } else {
          value = el.value;
        }
        state[section][field] = value;
        save();
        recompute();
        updateProgress();
      });
    });
  }

  function buildStepList() {
    const list = doc.getElementById('step-list');
    if (!list) return;
    list.innerHTML = '';
    STEPS.forEach(function (s) {
      const li = doc.createElement('li');
      li.className = 'step-list-item';
      li.setAttribute('data-status', 'waiting');

      const link = doc.createElement('a');
      link.href = '#step-' + s.number;
      link.className = 'step-list-item-link';
      link.innerHTML =
        '<span class="step-list-item-number">' + s.number + '</span>' +
        '<span class="step-list-item-title">' + s.title + '</span>';
      li.appendChild(link);
      list.appendChild(li);
    });
  }

  function countSectionFilled(obj) {
    let filled = 0;
    let total = 0;
    Object.keys(obj).forEach(function (k) {
      total += 1;
      const v = obj[k];
      if (v !== null && v !== undefined && v !== '' && !(typeof v === 'number' && Number.isNaN(v))) {
        filled += 1;
      }
    });
    return { filled: filled, total: total };
  }

  function updateProgress() {
    const sections = ['practitioner', 'patient', 'referral', 'waitingList', 'appointment', 'communication', 'signoff'];
    let filled = 0;
    let total = 0;
    sections.forEach(function (s) {
      const c = countSectionFilled(state[s]);
      filled += c.filled;
      total += c.total;
    });
    const pct = total === 0 ? 0 : Math.round((filled / total) * 100);
    const bar = doc.getElementById('progress');
    if (bar) bar.value = pct;
    const txt = doc.getElementById('progress-text');
    if (txt) txt.textContent = filled + ' fields answered (' + pct + '%)';

    // Update step-list item status
    const items = doc.querySelectorAll('#step-list .step-list-item');
    items.forEach(function (li, idx) {
      const slug = STEPS[idx].slug;
      const sectionKey =
        slug === 'waiting-list' ? 'waitingList' : slug === 'signoff' ? 'signoff' : slug;
      const c = countSectionFilled(state[sectionKey]);
      let status = 'waiting';
      if (c.total > 0 && c.filled >= c.total) status = 'finished';
      else if (c.filled > 0) status = 'in-progress';
      li.setAttribute('data-status', status);
    });
  }

  function humaniseStatus(v) {
    return (
      {
        'within-target': 'Within target',
        'approaching-breach': 'Approaching breach',
        breached: 'Breached',
        'long-wait': 'Long wait (> 52 weeks)'
      }[v] || '—'
    );
  }

  function recompute() {
    const r = calculateWaitingTimeStatus(state);
    renderReport(r);
  }

  function renderReport(r) {
    const panel = doc.getElementById('report');
    if (!panel) return;
    if (!state.waitingList.rttClockStartDate || !state.waitingList.clinicalPriority) {
      panel.innerHTML =
        '<p class="empty-message">Enter the RTT clock-start date and clinical priority on step 4 to compute the Waiting Time Status.</p>';
      return;
    }
    const flagsHtml =
      r.additionalFlags.length === 0
        ? '<p class="empty-message">No flags detected.</p>'
        : '<ul class="report-list">' +
          r.additionalFlags
            .map(function (f) {
              return (
                '<li><strong>[' +
                f.priority +
                ']</strong> <code>' +
                f.category +
                '</code> — ' +
                f.description +
                ' <em>' +
                f.suggestedAction +
                '</em></li>'
              );
            })
            .join('') +
          '</ul>';

    const rulesHtml =
      r.firedRules.length === 0
        ? ''
        : '<details class="report-details"><summary>Fired rules (' +
          r.firedRules.length +
          ')</summary><ul class="report-list">' +
          r.firedRules
            .map(function (rl) {
              return '<li><code>' + rl.ruleId + '</code> — ' + rl.description + '</li>';
            })
            .join('') +
          '</ul></details>';

    panel.innerHTML =
      '<h2 class="panel-title">Waiting Time Status</h2>' +
      '<p class="report-summary"><strong>' +
      humaniseStatus(r.waitingTimeStatus) +
      '</strong> · Priority ' +
      (r.clinicalPriority || '—') +
      ' · Target ' +
      (r.targetWaitWeeks == null ? '—' : r.targetWaitWeeks + ' weeks') +
      '</p>' +
      '<dl class="report-grid">' +
      '<div><dt>Days waited</dt><dd>' + (r.daysWaited == null ? '—' : r.daysWaited) + '</dd></div>' +
      '<div><dt>Days to target</dt><dd>' + (r.daysToTarget == null ? '—' : r.daysToTarget) + '</dd></div>' +
      '<div><dt>Days to breach</dt><dd>' + (r.daysToBreach == null ? '—' : r.daysToBreach) + '</dd></div>' +
      '<div><dt>Days to appointment</dt><dd>' + (r.daysToAppointment == null ? '—' : r.daysToAppointment) + '</dd></div>' +
      '</dl>' +
      '<h3 class="panel-subtitle">Flags</h3>' +
      flagsHtml +
      rulesHtml;
  }

  function onSubmit() {
    state.signoff.signedAt = new Date().toISOString();
    state.status = 'submitted';
    const signedAtInput = doc.querySelector('[data-bind="signoff.signedAt"]');
    if (signedAtInput) signedAtInput.value = state.signoff.signedAt;
    save();
    recompute();
    doc.getElementById('report').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function onReset() {
    if (!root.confirm('Clear the draft card and start over?')) return;
    try { root.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    root.location.reload();
  }

  function init() {
    load();
    buildStepList();
    bindInputs();
    updateProgress();
    recompute();

    const submitBtn = doc.getElementById('submit-btn');
    if (submitBtn) submitBtn.addEventListener('click', onSubmit);
    const resetBtn = doc.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', onReset);
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
