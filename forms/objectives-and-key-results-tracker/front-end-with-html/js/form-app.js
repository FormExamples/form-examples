import { gradeObjective } from './engine.js';

// Expose the engine on `window` so the Playwright smoke test (and any
// in-browser tooling) can call it without a cross-origin dynamic import.
if (typeof window !== 'undefined') window.gradeObjective = gradeObjective;

export const state = {
  reporter: { name: '', email: '', role: '' },
  cycle: { level: '', cycle: '', cycleStartDate: '', cycleEndDate: '' },
  objective: { obj_title: '', obj_long_description: '', strategic_theme: '', parent_objective_id: '' },
  participants: { dri: '', contributors: '', reviewers: '', stakeholders: '' },
  alignment: { sa_parent_summary: '', sa_business_value_statement: '' },
  keyResults: [], // 1..5 entries pushed by Step 5
  initiatives: { in_initiatives: '', in_supporting_links: '' },
  risks: { rk_known_risks: '', rk_dependencies: '', rk_blockers: '', rk_mitigation_plans: '' },
  checkIn: { narrative: '', since_last_changes: '', blockers: '', asks: '', confidenceDecileAtCheckIn: null },
  forecast: { fc_expected_end_state: '', fc_residual_risk: '' },
  scores: { progressPercent: null, confidenceDecile: null, stretchTier: null,
    alignmentGrade: null, impactTier: null, smartQuality: null, paceDeviationPercent: null },
  signature: { signed_by: '', override_reason: '', recommendation: '' },
};

// Autosave: persist the whole form state to localStorage on every edit and
// rehydrate it on load so a partial fill survives a page reload.
const STORAGE_KEY = 'objectives-and-key-results-tracker.front-end-with-html.v1';

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save OKR draft to localStorage.', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) mergeInto(state, JSON.parse(raw));
  } catch (e) {
    console.warn('Could not read OKR draft from localStorage.', e);
  }
}

// Deep-merge a saved snapshot onto the canonical `state` shape: nested objects
// recurse, arrays and primitives are copied, unknown keys are ignored.
function mergeInto(target, src) {
  if (!src || typeof src !== 'object') return;
  for (const key of Object.keys(target)) {
    if (!(key in src)) continue;
    const tv = target[key];
    const sv = src[key];
    if (Array.isArray(tv)) {
      if (Array.isArray(sv)) target[key] = sv;
    } else if (tv && typeof tv === 'object' && sv && typeof sv === 'object') {
      mergeInto(tv, sv);
    } else {
      target[key] = sv;
    }
  }
}

const STEPS = [
  { id: 1, title: 'Reporter & cycle' },
  { id: 2, title: 'Objective' },
  { id: 3, title: 'Participants' },
  { id: 4, title: 'Strategic alignment' },
  { id: 5, title: 'Key Results (1–5)' },
  { id: 6, title: 'Initiatives' },
  { id: 7, title: 'Risks & dependencies' },
  { id: 8, title: 'Check-in narrative' },
  { id: 9, title: 'Forecast' },
  { id: 10, title: 'Score & sign-off' },
];

function renderSteps() {
  const wiz = document.querySelector('#wizard');
  for (const s of STEPS) {
    const sec = document.createElement('fieldset');
    sec.className = 'fieldset step'; sec.id = `step-${s.id}`; sec.dataset.step = String(s.id);
    sec.innerHTML = `<legend class="fieldset-legend">${s.id}. ${s.title}</legend><div class="body" data-step="${s.id}"></div>`;
    wiz.appendChild(sec);
  }
  renderStepList();
}

function renderStepList() {
  const ol = document.querySelector('#step-list');
  if (!ol) return;
  ol.innerHTML = '';
  for (const s of STEPS) {
    const li = document.createElement('li');
    li.className = 'step-list-item';
    li.dataset.status = 'waiting';
    li.dataset.step = String(s.id);
    li.setAttribute('aria-label', 'Step ' + s.id + ': ' + s.title);
    li.innerHTML = `<span>${s.title}</span>`;
    li.addEventListener('click', () => {
      const target = document.getElementById(`step-${s.id}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    ol.appendChild(li);
  }
}

function updateStepStatuses() {
  const ol = document.querySelector('#step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  let answered = 0;
  for (const s of STEPS) {
    const fs = document.getElementById(`step-${s.id}`);
    if (!fs) continue;
    let stepAnswered = false;
    fs.querySelectorAll('input, textarea, select').forEach((el) => {
      if (el.value && String(el.value).trim() !== '') stepAnswered = true;
    });
    if (s.id === 5 && state.keyResults.length > 0) stepAnswered = true;
    const li = ol.querySelector(`[data-step="${s.id}"]`);
    if (!li) continue;
    if (stepAnswered) {
      li.dataset.status = 'finished';
      li.removeAttribute('aria-current');
      answered += 1;
    } else {
      li.dataset.status = 'waiting';
      if (firstUnfinished === -1) firstUnfinished = s.id;
    }
  }
  if (firstUnfinished === -1) firstUnfinished = 1;
  const current = ol.querySelector(`[data-step="${firstUnfinished}"]`);
  if (current) {
    current.setAttribute('aria-current', 'step');
    if (current.dataset.status === 'waiting') current.dataset.status = 'in-progress';
  }
  ol.dataset.current = String(firstUnfinished - 1);
  const pct = Math.round((answered / STEPS.length) * 100);
  const progress = document.querySelector('#progress');
  const progressText = document.querySelector('#progress-text');
  if (progress) progress.value = pct;
  if (progressText) progressText.textContent = answered + ' of ' + STEPS.length + ' sections answered (' + pct + '%)';
}

const bind = (selector, path) => {
  const [section, key] = path.split('.');
  const elx = document.querySelector(selector);
  const saved = state[section][key];
  if (saved !== null && saved !== undefined && saved !== '') elx.value = saved;
  elx.addEventListener('input', (e) => {
    state[section][key] = e.target.value;
    saveState();
  });
};

function renderStep1() {
  document.querySelector('[data-step="1"]').innerHTML = `
    <label>Reporter name<input id="r-name"/></label>
    <label>Reporter email<input id="r-email" type="email"/></label>
    <label>Reporter role<input id="r-role"/></label>
    <label>Level<select id="c-level">
      <option value="">—</option><option>individual</option><option>team</option>
      <option>department</option><option>company</option></select></label>
    <label>Cycle<select id="c-cycle">
      <option value="">—</option><option>monthly</option><option>quarterly</option>
      <option>half-yearly</option><option>annual</option><option>custom</option></select></label>
    <label>Cycle start date<input id="c-start" type="date"/></label>
    <label>Cycle end date<input id="c-end" type="date"/></label>
  `;
  bind('#r-name', 'reporter.name'); bind('#r-email', 'reporter.email'); bind('#r-role', 'reporter.role');
  bind('#c-level', 'cycle.level'); bind('#c-cycle', 'cycle.cycle');
  bind('#c-start', 'cycle.cycleStartDate'); bind('#c-end', 'cycle.cycleEndDate');
}

function renderStep2() {
  document.querySelector('[data-step="2"]').innerHTML = `
    <label>Title<input id="o-title"/></label>
    <label>Long description<textarea id="o-desc"></textarea></label>
    <label>Strategic theme<input id="o-theme"/></label>
    <label>Parent objective ID<input id="o-parent"/></label>
  `;
  bind('#o-title', 'objective.obj_title');
  bind('#o-desc', 'objective.obj_long_description');
  bind('#o-theme', 'objective.strategic_theme');
  bind('#o-parent', 'objective.parent_objective_id');
}

function renderStep3() {
  document.querySelector('[data-step="3"]').innerHTML = `
    <label>DRI (directly responsible individual)<input id="p-dri"/></label>
    <label>Contributors<textarea id="p-contrib"></textarea></label>
    <label>Reviewers<textarea id="p-rev"></textarea></label>
    <label>Stakeholders to inform<textarea id="p-stake"></textarea></label>
  `;
  bind('#p-dri', 'participants.dri');
  bind('#p-contrib', 'participants.contributors');
  bind('#p-rev', 'participants.reviewers');
  bind('#p-stake', 'participants.stakeholders');
}

function renderStep4() {
  document.querySelector('[data-step="4"]').innerHTML = `
    <label>How this ladders to the parent / mission<textarea id="a-parent"></textarea></label>
    <label>Business-value statement<textarea id="a-value"></textarea></label>
  `;
  bind('#a-parent', 'alignment.sa_parent_summary');
  bind('#a-value', 'alignment.sa_business_value_statement');
}

function renderKR(i, kr) {
  return `<fieldset data-kr="${i}">
    <legend>Key Result ${i + 1} <button type="button" data-action="remove" data-kr="${i}">remove</button></legend>
    <label>Title<input data-field="title" value="${kr.title}"/></label>
    <label>Type<select data-field="krType">
      <option value="">—</option><option>numeric</option><option>milestone</option><option>binary</option></select></label>
    <label>Unit<input data-field="unit" value="${kr.unit}"/></label>
    <label>Start<input type="number" step="any" data-field="startValue" value="${kr.startValue ?? ''}"/></label>
    <label>Current<input type="number" step="any" data-field="currentValue" value="${kr.currentValue ?? ''}"/></label>
    <label>Target<input type="number" step="any" data-field="targetValue" value="${kr.targetValue ?? ''}"/></label>
    <label>Owner<input data-field="ownerName" value="${kr.ownerName}"/></label>
    <label>Due date<input type="date" data-field="dueDate" value="${kr.dueDate}"/></label>
  </fieldset>`;
}

function renderStep5() {
  const root = document.querySelector('[data-step="5"]');
  const draw = () => {
    root.innerHTML = state.keyResults.map((kr, i) => renderKR(i, kr)).join('') +
      `<button type="button" id="kr-add" ${state.keyResults.length >= 5 ? 'disabled' : ''}>Add Key Result</button>`;
    root.querySelector('#kr-add')?.addEventListener('click', () => {
      if (state.keyResults.length >= 5) return;
      state.keyResults.push({ position: state.keyResults.length + 1, title: '', krType: '', unit: '',
        startValue: null, currentValue: null, targetValue: null, ownerName: '', dueDate: '' });
      saveState();
      draw();
    });
    root.querySelectorAll('[data-action="remove"]').forEach((btn) => btn.addEventListener('click', () => {
      const i = Number(btn.dataset.kr);
      state.keyResults.splice(i, 1);
      state.keyResults.forEach((kr, idx) => { kr.position = idx + 1; });
      saveState();
      draw();
    }));
    root.querySelectorAll('fieldset[data-kr]').forEach((fs) => {
      const i = Number(fs.dataset.kr);
      fs.querySelectorAll('[data-field]').forEach((inp) => {
        const field = inp.dataset.field;
        const saved = state.keyResults[i][field];
        if (saved !== null && saved !== undefined) inp.value = saved;  // hydrate (esp. the <select>)
        inp.addEventListener('input', () => {
          const v = inp.type === 'number' ? (inp.value === '' ? null : Number(inp.value)) : inp.value;
          state.keyResults[i][field] = v;
          saveState();
        });
      });
    });
  };
  draw();
}

function renderStep6() {
  document.querySelector('[data-step="6"]').innerHTML = `
    <label>Initiatives (one per line)<textarea id="i-init"></textarea></label>
    <label>Supporting links (one per line)<textarea id="i-links"></textarea></label>
  `;
  bind('#i-init', 'initiatives.in_initiatives');
  bind('#i-links', 'initiatives.in_supporting_links');
}

function renderStep7() {
  document.querySelector('[data-step="7"]').innerHTML = `
    <label>Known risks<textarea id="rk-risks"></textarea></label>
    <label>Dependencies<textarea id="rk-deps"></textarea></label>
    <label>Blockers<textarea id="rk-block"></textarea></label>
    <label>Mitigation plans<textarea id="rk-mit"></textarea></label>
  `;
  bind('#rk-risks', 'risks.rk_known_risks');
  bind('#rk-deps', 'risks.rk_dependencies');
  bind('#rk-block', 'risks.rk_blockers');
  bind('#rk-mit', 'risks.rk_mitigation_plans');
}

function renderStep8() {
  document.querySelector('[data-step="8"]').innerHTML = `
    <label>Check-in narrative<textarea id="ci-narr"></textarea></label>
    <label>Changes since last check-in<textarea id="ci-changes"></textarea></label>
    <label>Blockers<textarea id="ci-block"></textarea></label>
    <label>Asks / help needed<textarea id="ci-asks"></textarea></label>
    <label>Confidence decile at check-in (1–10)<input id="ci-conf" type="number" min="1" max="10"/></label>
  `;
  bind('#ci-narr', 'checkIn.narrative');
  bind('#ci-changes', 'checkIn.since_last_changes');
  bind('#ci-block', 'checkIn.blockers');
  bind('#ci-asks', 'checkIn.asks');
  const ciConf = document.querySelector('#ci-conf');
  if (state.checkIn.confidenceDecileAtCheckIn !== null && state.checkIn.confidenceDecileAtCheckIn !== undefined) ciConf.value = state.checkIn.confidenceDecileAtCheckIn;
  ciConf.addEventListener('input', (e) => {
    state.checkIn.confidenceDecileAtCheckIn = e.target.value === '' ? null : Number(e.target.value);
    saveState();
  });
}

function renderStep9() {
  document.querySelector('[data-step="9"]').innerHTML = `
    <label>Expected end-state<textarea id="fc-end"></textarea></label>
    <label>Residual risk<textarea id="fc-resid"></textarea></label>
  `;
  bind('#fc-end', 'forecast.fc_expected_end_state');
  bind('#fc-resid', 'forecast.fc_residual_risk');
}

function renderStep10() {
  document.querySelector('[data-step="10"]').innerHTML = `
    <label>Progress percent (0–100)<input id="s-progress" type="number" min="0" max="100"/></label>
    <label>Confidence decile (1–10)<input id="s-confidence" type="number" min="1" max="10"/></label>
    <label>Stretch tier<select id="s-stretch">
      <option value="">—</option><option value="1">1 — committed</option>
      <option value="2">2 — aspirational</option><option value="3">3 — moonshot</option></select></label>
    <label>Alignment grade (1–5)<input id="s-alignment" type="number" min="1" max="5"/></label>
    <label>Impact tier (1–5)<input id="s-impact" type="number" min="1" max="5"/></label>
    <label>SMART quality (0–5)<input id="s-smart" type="number" min="0" max="5"/></label>
    <label>Pace deviation % (-100..+100)<input id="s-pace" type="number" min="-100" max="100"/></label>
    <label>Signed by<input id="s-signed-by"/></label>
    <label>Recommendation<select id="s-rec"><option value="">—</option>
      <option>continue</option><option>escalate</option><option>re-scope</option>
      <option>retire</option><option>split</option><option>merge</option></select></label>
    <label>Override reason (if any)<textarea id="s-override"></textarea></label>
  `;
  const numScore = (selector, key) => {
    const elx = document.querySelector(selector);
    if (state.scores[key] !== null && state.scores[key] !== undefined) elx.value = state.scores[key];
    elx.addEventListener('input', (e) => {
      state.scores[key] = e.target.value === '' ? null : Number(e.target.value);
      saveState();
    });
  };
  numScore('#s-progress', 'progressPercent');
  numScore('#s-confidence', 'confidenceDecile');
  numScore('#s-stretch', 'stretchTier');
  numScore('#s-alignment', 'alignmentGrade');
  numScore('#s-impact', 'impactTier');
  numScore('#s-smart', 'smartQuality');
  numScore('#s-pace', 'paceDeviationPercent');
  bind('#s-signed-by', 'signature.signed_by');
  bind('#s-rec', 'signature.recommendation');
  bind('#s-override', 'signature.override_reason');
}

function buildAssessment() {
  const driPresent = !!state.participants.dri;
  return {
    scores: state.scores,
    keyResults: state.keyResults,
    context: {
      level: state.cycle.level,
      parentObjectiveId: state.objective.parent_objective_id || null,
      parentObjectiveStatus: null,
      driPresent,
      cycleStartDate: state.cycle.cycleStartDate || null,
      cycleEndDate: state.cycle.cycleEndDate || null,
      checkedInAt: state.checkIn.narrative ? new Date().toISOString() : null,
      previousConfidenceDecile: null,
    },
    now: new Date().toISOString(),
  };
}

function wireCompute() {
  document.querySelector('#btn-compute').addEventListener('click', () => {
    const r = gradeObjective(buildAssessment());
    const el = document.querySelector('#result');
    el.innerHTML = `<span class="rag-badge rag-${r.computedCompositeRag}">${r.computedCompositeRag.toUpperCase()}</span>
      <h3>Flags (${r.flags.length})</h3>
      <ul class="flag-list">${r.flags.map(f => `<li><b>${f.flagCode}</b> (${f.priority}): ${f.description}</li>`).join('')}</ul>`;
    el.dataset.lastResult = JSON.stringify(r);
  });
}

function wirePdf() {
  document.querySelector('#btn-pdf').addEventListener('click', () => {
    const last = JSON.parse(document.querySelector('#result').dataset.lastResult || '{}');
    const doc = {
      content: [
        { text: 'OKR Tracker Report', style: 'header' },
        { text: state.objective.obj_title || '(no title)', style: 'subheader' },
        { text: `Level: ${state.cycle.level}  •  Cycle: ${state.cycle.cycleStartDate} → ${state.cycle.cycleEndDate}` },
        { text: `RAG: ${last.computedCompositeRag ?? '(not computed)'}`, style: 'rag', color: last.computedCompositeRag === 'red' ? '#c0392b' : last.computedCompositeRag === 'amber' ? '#c47a00' : '#2c8a3a' },
        { text: 'Key Results', style: 'subheader' },
        { ul: state.keyResults.map(k => `${k.position}. ${k.title} (${k.krType}) — ${k.currentValue}/${k.targetValue} ${k.unit}`) },
        { text: 'Flags', style: 'subheader' },
        { ul: (last.flags ?? []).map(f => `[${f.priority}] ${f.flagCode}: ${f.description}`) },
        { text: `Signed by ${state.signature.signed_by} on ${new Date().toISOString()}` },
      ],
      styles: { header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }, subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }, rag: { fontSize: 16, bold: true, margin: [0, 5, 0, 10] } },
    };
    pdfMake.createPdf(doc).download(`okr-${(state.objective.obj_title || 'objective').replaceAll(/\s+/g, '-')}.pdf`);
  });
}

function wireCopyTriage() {
  document.querySelector('#btn-copy-triage').addEventListener('click', async () => {
    const last = JSON.parse(document.querySelector('#result').dataset.lastResult || '{}');
    const lines = [
      `[OKR] ${state.objective.obj_title || '(no title)'}`,
      `Level: ${state.cycle.level}  Cycle: ${state.cycle.cycleStartDate} → ${state.cycle.cycleEndDate}`,
      `RAG: ${(last.computedCompositeRag ?? 'not-computed').toUpperCase()}  Progress: ${state.scores.progressPercent}%  Conf: ${state.scores.confidenceDecile}/10`,
      `KRs (${state.keyResults.length}):`,
      ...state.keyResults.map(k => `  ${k.position}. ${k.title} — ${k.currentValue}/${k.targetValue} ${k.unit}`),
      `Flags: ${(last.flags ?? []).map(f => `${f.flagCode}(${f.priority})`).join(', ') || '(none)'}`,
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    document.querySelector('#result').insertAdjacentHTML('beforeend', '<p><i>Copied to clipboard.</i></p>');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderSteps(); renderStep1(); renderStep2(); renderStep3(); renderStep4(); renderStep5();
  renderStep6(); renderStep7(); renderStep8(); renderStep9(); renderStep10();
  wireCompute(); wirePdf(); wireCopyTriage();
  const wiz = document.querySelector('#wizard');
  if (wiz) {
    wiz.addEventListener('input', updateStepStatuses);
    wiz.addEventListener('change', updateStepStatuses);
    wiz.addEventListener('click', () => setTimeout(updateStepStatuses, 0));
  }
  updateStepStatuses();
});
