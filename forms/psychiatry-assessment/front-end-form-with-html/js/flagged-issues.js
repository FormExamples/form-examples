// Detects additional flags that should be highlighted for the psychiatrist,
// independent of the GAF score. These are safety-critical alerts.
//
// Mirrors the SvelteKit reference engine (`src/lib/engine/flagged-issues.ts`)
// with one elevation: any active suicidal ideation, plan, or intent is
// raised to the `urgent` priority bucket so the front-end report styles it
// in red as the most prominent banner.

(function () {
'use strict';
window.PsychiatryAssessment = window.PsychiatryAssessment || {};

/**
 * @param {import('./types.js').AssessmentData} data
 * @returns {import('./types.js').AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {import('./types.js').AdditionalFlag[]} */
  const flags = [];

  // ─── Suicidal ideation alerts (URGENT) ───────────────────
  if (data.riskAssessment.suicidalIdeation === 'yes') {
    flags.push({
      id: 'FLAG-SUICIDE-001',
      category: 'Suicide Risk',
      message: 'Active suicidal ideation reported',
      priority: 'urgent'
    });
  }
  if (data.riskAssessment.suicidalPlan === 'yes') {
    flags.push({
      id: 'FLAG-SUICIDE-002',
      category: 'Suicide Risk',
      message: 'Suicidal plan identified - immediate safety planning required',
      priority: 'urgent'
    });
  }
  if (data.riskAssessment.suicidalIntent === 'yes') {
    flags.push({
      id: 'FLAG-SUICIDE-003',
      category: 'Suicide Risk',
      message: 'Suicidal intent expressed - consider urgent admission',
      priority: 'urgent'
    });
  }
  if (data.riskAssessment.suicidalMeans === 'yes') {
    flags.push({
      id: 'FLAG-SUICIDE-004',
      category: 'Suicide Risk',
      message: 'Access to means of self-harm - means restriction counselling needed',
      priority: 'high'
    });
  }

  // ─── Psychotic symptoms ─────────────────────────────────
  if (data.moodAndAnxiety.psychoticSymptoms === 'yes') {
    flags.push({
      id: 'FLAG-PSYCHOSIS-001',
      category: 'Psychosis',
      message: 'Psychotic symptoms present' +
        (data.moodAndAnxiety.psychoticDetails
          ? ': ' + data.moodAndAnxiety.psychoticDetails
          : ''),
      priority: 'high'
    });
  }
  if (data.mentalStatusExam.perceptualDisturbances === 'yes') {
    flags.push({
      id: 'FLAG-PSYCHOSIS-002',
      category: 'Psychosis',
      message: 'Perceptual disturbances' +
        (data.mentalStatusExam.perceptualDetails
          ? ': ' + data.mentalStatusExam.perceptualDetails
          : ''),
      priority: 'high'
    });
  }

  // ─── Involuntary status ─────────────────────────────────
  if (data.demographics.legalStatus === 'involuntary') {
    flags.push({
      id: 'FLAG-LEGAL-001',
      category: 'Legal Status',
      message: 'Patient admitted involuntarily - ensure legal requirements met',
      priority: 'high'
    });
  }

  // ─── Substance withdrawal risk ──────────────────────────
  if (data.substanceUse.withdrawalRisk === 'yes') {
    flags.push({
      id: 'FLAG-WITHDRAWAL-001',
      category: 'Substance Withdrawal',
      message: 'Withdrawal risk identified' +
        (data.substanceUse.withdrawalDetails
          ? ': ' + data.substanceUse.withdrawalDetails
          : '') +
        ' - monitor vital signs',
      priority: 'high'
    });
  }

  // ─── Violence risk ──────────────────────────────────────
  if (
    data.riskAssessment.violenceRisk === 'high' ||
    data.riskAssessment.violenceRisk === 'imminent'
  ) {
    const imminent = data.riskAssessment.violenceRisk === 'imminent';
    flags.push({
      id: 'FLAG-VIOLENCE-001',
      category: 'Violence Risk',
      message:
        (imminent ? 'Imminent' : 'High') +
        ' violence risk - safety precautions required',
      priority: imminent ? 'urgent' : 'high'
    });
  }

  // ─── Medication non-compliance ──────────────────────────
  if (data.currentMedications.compliance === 'no') {
    flags.push({
      id: 'FLAG-MED-001',
      category: 'Medication',
      message: 'Medication non-compliance' +
        (data.currentMedications.complianceDetails
          ? ': ' + data.currentMedications.complianceDetails
          : ''),
      priority: 'medium'
    });
  }

  // ─── Self-harm alerts ───────────────────────────────────
  if (data.riskAssessment.selfHarmCurrent === 'yes') {
    flags.push({
      id: 'FLAG-SELFHARM-001',
      category: 'Self-Harm',
      message: 'Current self-harm behaviour reported',
      priority: 'high'
    });
  }

  // ─── Safeguarding concerns ──────────────────────────────
  if (data.riskAssessment.safeguardingConcerns === 'yes') {
    flags.push({
      id: 'FLAG-SAFEGUARD-001',
      category: 'Safeguarding',
      message: 'Safeguarding concerns identified' +
        (data.riskAssessment.safeguardingDetails
          ? ': ' + data.riskAssessment.safeguardingDetails
          : ''),
      priority: 'high'
    });
  }

  // ─── Mania screen positive ──────────────────────────────
  if (data.moodAndAnxiety.maniaScreen === 'yes') {
    flags.push({
      id: 'FLAG-MANIA-001',
      category: 'Mania',
      message: 'Mania screen positive' +
        (data.moodAndAnxiety.maniaDetails
          ? ': ' + data.moodAndAnxiety.maniaDetails
          : '') +
        ' - consider bipolar disorder',
      priority: 'medium'
    });
  }

  // ─── Capacity concerns ──────────────────────────────────
  if (data.capacityAndConsent.decisionMakingCapacity === 'lacks-capacity') {
    flags.push({
      id: 'FLAG-CAPACITY-001',
      category: 'Capacity',
      message: 'Patient lacks decision-making capacity - best interests assessment required',
      priority: 'high'
    });
  }

  // ─── Homelessness ───────────────────────────────────────
  if (data.socialHistory.housing === 'homeless') {
    flags.push({
      id: 'FLAG-HOUSING-001',
      category: 'Social',
      message: 'Patient is homeless - consider housing support and follow-up arrangements',
      priority: 'medium'
    });
  }

  // ─── Previous suicide attempts ──────────────────────────
  if (data.psychiatricHistory.previousSuicideAttempts === 'yes') {
    flags.push({
      id: 'FLAG-HISTORY-001',
      category: 'Psychiatric History',
      message: 'Previous suicide attempts documented' +
        (data.psychiatricHistory.suicideAttemptDetails
          ? ': ' + data.psychiatricHistory.suicideAttemptDetails
          : ''),
      priority: 'high'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(window.PsychiatryAssessment, { detectAdditionalFlags });
})();
