// Flagged-issue detection for the Seasonal Affective Disorder Assessment.
// Independent of the numeric grading (which `gradeSAD` does), this module
// raises clinician-facing flags prioritised as high / medium / low.
//
//  HIGH    — risk and severe-symptom alerts:
//              - active suicidal ideation, intent, plan, previous attempt
//              - self-harm Yes
//              - PHQ-9 item 9 >= 1 (any thoughts of self-harm)
//              - PHQ-9 total >= 20 (severe depression)
//              - SPAQ 'sad-likely' with severe occupational/social impact
//  MEDIUM  — gaps in care:
//              - no current treatment when severity is moderate or worse
//              - no light-therapy access
//              - work/relationships impaired
//              - hypersomnia / morning fatigue
//  LOW     — lifestyle factors that may worsen seasonal mood:
//              - low daily outdoor light exposure
//              - works indoors, curtains closed daytime
//              - high carbohydrate craving

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

(function () {
'use strict';
window.SeasonalAffectiveDisorderAssessment =
  window.SeasonalAffectiveDisorderAssessment || {};

/**
 * Detect prioritised flagged issues for a given assessment + grading.
 *
 * @param {AssessmentData} data
 * @param {{ phq9Score: number, spaqBand: string, combinedSeverity: string }} g
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, g) {
  /** @type {AdditionalFlag[]} */
  const flags = [];
  const risk = data.riskAssessment || {};
  const phq9 = data.currentMood?.phq9 || {};
  const lx = data.lightExposure || {};
  const prev = data.previousTreatments || {};
  const social = data.socialOccupational || {};
  const sleep = data.sleepEnergy || {};
  const appetite = data.appetiteWeight || {};

  // ─── HIGH priority — risk & severe symptoms ──────────────
  if (risk.suicidalIdeation === 'yes') {
    flags.push({
      id: 'FLAG-RISK-001',
      category: 'Risk Assessment',
      message:
        'Active suicidal ideation reported — immediate clinical review and safety planning required.',
      priority: 'high'
    });
  }
  if (risk.suicidalIntent === 'yes') {
    flags.push({
      id: 'FLAG-RISK-002',
      category: 'Risk Assessment',
      message:
        'Suicidal intent disclosed — urgent crisis assessment indicated.',
      priority: 'high'
    });
  }
  if (risk.suicidalPlan && String(risk.suicidalPlan).trim().length > 0) {
    flags.push({
      id: 'FLAG-RISK-003',
      category: 'Risk Assessment',
      message: 'Suicidal plan described — urgent crisis assessment indicated.',
      priority: 'high'
    });
  }
  if (risk.selfHarm === 'yes') {
    flags.push({
      id: 'FLAG-RISK-004',
      category: 'Risk Assessment',
      message: 'Self-harm reported — urgent safety assessment required.',
      priority: 'high'
    });
  }
  if (risk.previousAttempt === 'yes') {
    flags.push({
      id: 'FLAG-RISK-005',
      category: 'Risk Assessment',
      message:
        'Previous suicide attempt — heightened risk; consider specialist mental-health referral.',
      priority: 'high'
    });
  }

  if (typeof phq9.q9 === 'number' && phq9.q9 >= 1) {
    flags.push({
      id: 'FLAG-PHQ9-Q9',
      category: 'PHQ-9 Item 9',
      message: `PHQ-9 item 9 (self-harm thoughts) scored ${phq9.q9}/3 — requires direct clinician follow-up.`,
      priority: 'high'
    });
  }

  if (g && g.phq9Score >= 20) {
    flags.push({
      id: 'FLAG-PHQ9-SEVERE',
      category: 'PHQ-9 Severity',
      message: `PHQ-9 total ${g.phq9Score}/27 — severe depression; consider urgent treatment intensification.`,
      priority: 'high'
    });
  }

  // Severe seasonal occupational / relational impact when SAD likely.
  if (
    g && g.spaqBand === 'sad-likely' &&
    (social.workImpaired === 'yes' || social.relationshipsImpaired === 'yes')
  ) {
    flags.push({
      id: 'FLAG-SEASONAL-IMPACT',
      category: 'Seasonal Impact',
      message:
        'SAD likely with significant impairment of work and/or relationships — prioritise active treatment.',
      priority: 'high'
    });
  }

  // ─── MEDIUM priority — gaps in care ──────────────────────
  const moderatePlus =
    g && (
      g.combinedSeverity === 'moderate' ||
      g.combinedSeverity === 'severe' ||
      g.combinedSeverity === 'critical'
    );
  if (moderatePlus && prev.currentTreatment !== 'yes') {
    flags.push({
      id: 'FLAG-CARE-001',
      category: 'Treatment',
      message:
        'No current treatment despite moderate-or-greater severity — consider initiating evidence-based therapy.',
      priority: 'medium'
    });
  }

  if (lx.lightTherapyAccess === 'no') {
    flags.push({
      id: 'FLAG-CARE-002',
      category: 'Light Therapy',
      message:
        'Patient reports no access to light therapy — consider provision of a 10,000 lux light box.',
      priority: 'medium'
    });
  }

  if (social.workImpaired === 'yes') {
    flags.push({
      id: 'FLAG-CARE-003',
      category: 'Occupational',
      message:
        'Work performance impaired — discuss workplace adjustments and occupational health referral.',
      priority: 'medium'
    });
  }

  if (social.relationshipsImpaired === 'yes') {
    flags.push({
      id: 'FLAG-CARE-004',
      category: 'Social',
      message:
        'Relationships impaired by symptoms — consider couples or family support.',
      priority: 'medium'
    });
  }

  if (sleep.hypersomnia === 'yes') {
    flags.push({
      id: 'FLAG-SLEEP-001',
      category: 'Sleep',
      message:
        'Hypersomnia reported — typical SAD feature; review sleep hygiene and morning light exposure.',
      priority: 'medium'
    });
  }

  if (sleep.morningFatigue === 'yes') {
    flags.push({
      id: 'FLAG-SLEEP-002',
      category: 'Sleep',
      message:
        'Morning fatigue / difficulty waking — consider scheduled morning bright-light therapy.',
      priority: 'medium'
    });
  }

  if (risk.safetyPlanInPlace === 'no' && (
    risk.suicidalIdeation === 'yes' ||
    (typeof phq9.q9 === 'number' && phq9.q9 >= 1)
  )) {
    flags.push({
      id: 'FLAG-CARE-005',
      category: 'Safety Planning',
      message:
        'Risk indicators present but no safety plan in place — develop and document a safety plan now.',
      priority: 'medium'
    });
  }

  // ─── LOW priority — lifestyle / contextual ───────────────
  if (
    typeof lx.dailyOutdoorMinutes === 'number' &&
    lx.dailyOutdoorMinutes < 30
  ) {
    flags.push({
      id: 'FLAG-LIFE-001',
      category: 'Light Exposure',
      message: `Only ${lx.dailyOutdoorMinutes} min/day outdoors — encourage daily outdoor daylight, especially mornings.`,
      priority: 'low'
    });
  }

  if (lx.workIndoors === 'yes') {
    flags.push({
      id: 'FLAG-LIFE-002',
      category: 'Light Exposure',
      message:
        'Works predominantly indoors — discuss daylight breaks and seating near windows.',
      priority: 'low'
    });
  }

  if (lx.curtainsClosedDaytime === 'yes') {
    flags.push({
      id: 'FLAG-LIFE-003',
      category: 'Light Exposure',
      message:
        'Daytime curtains kept closed — encourage opening blinds during daylight hours.',
      priority: 'low'
    });
  }

  if (appetite.carbohydrateCraving === 'yes') {
    flags.push({
      id: 'FLAG-LIFE-004',
      category: 'Lifestyle',
      message:
        'Marked carbohydrate craving — characteristic SAD feature; discuss balanced nutrition.',
      priority: 'low'
    });
  }

  if (
    data.demographics &&
    data.demographics.latitude &&
    /(\d{2,3})\s*[NS]/i.test(data.demographics.latitude)
  ) {
    const m = /(\d{2,3})/.exec(data.demographics.latitude);
    const lat = m ? Number(m[1]) : 0;
    if (lat >= 50) {
      flags.push({
        id: 'FLAG-LIFE-005',
        category: 'Geographic',
        message:
          'Resides at high latitude (≥50°) — short winter daylight is a known SAD risk factor.',
        priority: 'low'
      });
    }
  }

  // Sort: high > medium > low
  const order = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => order[a.priority] - order[b.priority]);
  return flags;
}

window.SeasonalAffectiveDisorderAssessment.detectAdditionalFlags =
  detectAdditionalFlags;
})();
