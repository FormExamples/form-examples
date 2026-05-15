import { gradeObjective } from './engine.js';

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
    const sec = document.createElement('section');
    sec.className = 'step'; sec.id = `step-${s.id}`;
    sec.innerHTML = `<h2>${s.id}. ${s.title}</h2><div class="body" data-step="${s.id}"></div>`;
    wiz.appendChild(sec);
  }
}

const bind = (selector, path) => {
  const [section, key] = path.split('.');
  document.querySelector(selector).addEventListener('input', (e) => {
    state[section][key] = e.target.value;
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
      draw();
    });
    root.querySelectorAll('[data-action="remove"]').forEach((btn) => btn.addEventListener('click', () => {
      const i = Number(btn.dataset.kr);
      state.keyResults.splice(i, 1);
      state.keyResults.forEach((kr, idx) => { kr.position = idx + 1; });
      draw();
    }));
    root.querySelectorAll('fieldset[data-kr]').forEach((fs) => {
      const i = Number(fs.dataset.kr);
      fs.querySelectorAll('[data-field]').forEach((inp) => {
        inp.addEventListener('input', () => {
          const field = inp.dataset.field;
          const v = inp.type === 'number' ? (inp.value === '' ? null : Number(inp.value)) : inp.value;
          state.keyResults[i][field] = v;
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
  document.querySelector('#ci-conf').addEventListener('input', (e) => {
    state.checkIn.confidenceDecileAtCheckIn = e.target.value === '' ? null : Number(e.target.value);
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

document.addEventListener('DOMContentLoaded', () => {
  renderSteps(); renderStep1(); renderStep2(); renderStep3(); renderStep4(); renderStep5();
  renderStep6(); renderStep7(); renderStep8(); renderStep9();
});
