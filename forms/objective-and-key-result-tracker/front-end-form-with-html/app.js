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

document.addEventListener('DOMContentLoaded', renderSteps);
