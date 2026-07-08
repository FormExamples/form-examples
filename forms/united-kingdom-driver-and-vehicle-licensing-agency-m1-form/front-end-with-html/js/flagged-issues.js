// Clinical / safety flags raised independently of completeness validation.
//
//   - Suicidal-thoughts variant of anxiety/depression -> urgent review.
//   - Schizophrenia/psychosis/delusional/schizoaffective disorder -> high.
//   - Personality disorder + bipolar combination -> high (driving fitness).
//   - Eating disorder -> medium.
//   - Bipolar (alone) or Personality disorder (alone) -> medium.
//   - OCD or PTSD -> medium.
//   - Q1 = Yes but no recent contact in 12 months -> medium.
//   - Multiple co-occurring conditions (>=3) -> medium.
//   - Q1 = No -> low informational flag.
//   - Declaration not confirmed -> high.
//
// Ported 1:1 from front-end-form-with-svelte/src/lib/engine/flagged-issues.ts.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

(function () {
'use strict';
window.DvlaM1Form = window.DvlaM1Form || {};
const { priorityOrder } = window.DvlaM1Form;

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];
  const c = data.mentalHealthConditions;
  const q1 = data.diagnosisConfirmation.hasMentalHealthDiagnosis;

  // --- Urgent: suicidal thoughts variant ---------------------------
  if (q1 === 'yes' && c.anxietyDepressionWithImpairment === 'yes') {
    flags.push({
      id: 'FLAG-MH-URGENT-001',
      category: 'Mental Health',
      message:
        'Anxiety or depression with suicidal thoughts or impairment reported - urgent professional review required before DVLA decision.',
      priority: 'urgent'
    });
  }

  // --- High: psychotic spectrum ------------------------------------
  if (q1 === 'yes' && c.schizophreniaOrPsychosis === 'yes') {
    flags.push({
      id: 'FLAG-MH-HIGH-001',
      category: 'Mental Health',
      message:
        'Schizophrenia, psychosis, delusional disorder, or schizoaffective disorder reported - DVLA medical assessor review required.',
      priority: 'high'
    });
  }

  // --- High: bipolar + personality combination ---------------------
  if (
    q1 === 'yes' &&
    c.bipolarAffectiveDisorder === 'yes' &&
    c.personalityDisorder === 'yes'
  ) {
    flags.push({
      id: 'FLAG-MH-HIGH-002',
      category: 'Mental Health',
      message:
        'Co-occurring bipolar affective disorder and personality disorder reported - elevated driving-fitness review required.',
      priority: 'high'
    });
  }

  // --- Medium: eating disorder -------------------------------------
  if (q1 === 'yes' && c.eatingDisorder === 'yes') {
    flags.push({
      id: 'FLAG-MH-HIGH-003',
      category: 'Mental Health',
      message:
        'Eating disorder reported - clinician review of nutritional and cognitive status recommended.',
      priority: 'medium'
    });
  }

  // --- Medium: bipolar (alone) -------------------------------------
  if (
    q1 === 'yes' &&
    c.bipolarAffectiveDisorder === 'yes' &&
    c.personalityDisorder !== 'yes'
  ) {
    flags.push({
      id: 'FLAG-MH-MED-001',
      category: 'Mental Health',
      message: 'Bipolar affective disorder reported - DVLA driving-fitness review.',
      priority: 'medium'
    });
  }

  // --- Medium: personality disorder (alone) ------------------------
  if (
    q1 === 'yes' &&
    c.personalityDisorder === 'yes' &&
    c.bipolarAffectiveDisorder !== 'yes'
  ) {
    flags.push({
      id: 'FLAG-MH-MED-002',
      category: 'Mental Health',
      message: 'Personality disorder reported - DVLA driving-fitness review.',
      priority: 'medium'
    });
  }

  // --- Medium: OCD or PTSD -----------------------------------------
  if (q1 === 'yes' && c.ocdOrPtsd === 'yes') {
    flags.push({
      id: 'FLAG-MH-MED-003',
      category: 'Mental Health',
      message:
        'OCD or PTSD reported - clinician review of impact on driving concentration recommended.',
      priority: 'medium'
    });
  }

  // --- Medium: no recent contact in 12 months ----------------------
  if (q1 === 'yes' && data.recentContact.hadRecentContact === 'no') {
    flags.push({
      id: 'FLAG-CONTACT-MED-001',
      category: 'Recent Contact',
      message:
        'Patient reports no contact with healthcare professional in the last 12 months - request a current review before licensing decision.',
      priority: 'medium'
    });
  }

  // --- Medium: 3+ co-occurring conditions --------------------------
  const conditionCount = countYes(data);
  if (q1 === 'yes' && conditionCount >= 3) {
    flags.push({
      id: 'FLAG-MULTI-MED-001',
      category: 'Comorbidity',
      message: `Patient reports ${conditionCount} co-occurring mental health conditions - comprehensive review required.`,
      priority: 'medium'
    });
  }

  // --- Low: Q1 = No (informational) --------------------------------
  if (q1 === 'no') {
    flags.push({
      id: 'FLAG-NO-DIAGNOSIS-LOW-001',
      category: 'Diagnosis',
      message:
        'Patient reports no mental health diagnosis - the rest of the form was not required.',
      priority: 'low'
    });
  }

  // --- High: declaration not confirmed -----------------------------
  if (data.authorisation.declarationConfirmed !== 'yes') {
    flags.push({
      id: 'FLAG-AUTH-LOW-001',
      category: 'Authorisation',
      message:
        'Declaration not confirmed - submission cannot be processed without authorisation.',
      priority: 'high'
    });
  }

  flags.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));
  return flags;
}

/**
 * Count the number of Q2 mental health conditions marked "yes".
 * @param {AssessmentData} data
 * @returns {number}
 */
function countYes(data) {
  const c = data.mentalHealthConditions;
  let n = 0;
  if (c.anxietyDepressionWithoutImpairment === 'yes') n++;
  if (c.anxietyDepressionWithImpairment === 'yes') n++;
  if (c.bipolarAffectiveDisorder === 'yes') n++;
  if (c.eatingDisorder === 'yes') n++;
  if (c.ocdOrPtsd === 'yes') n++;
  if (c.personalityDisorder === 'yes') n++;
  if (c.schizophreniaOrPsychosis === 'yes') n++;
  if (c.other === 'yes') n++;
  return n;
}

Object.assign(window.DvlaM1Form, {
  detectAdditionalFlags,
  countYes
});
})();
