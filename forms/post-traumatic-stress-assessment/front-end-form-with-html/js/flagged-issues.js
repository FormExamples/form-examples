// Safety-critical clinical flag detection for the PCL-5.
//
// Independent of the cluster-based fired rules, this module raises
// clinician-facing flags for:
//
//   - Suicidal ideation / self-destructive behaviour (urgent)
//   - Possible dissociative features (high)
//   - Probable DSM-5 pattern → recommend structured interview (medium)
//   - All-zero or unanswered PCL items (medium)
//   - Trauma event description not recorded (medium)
//
// Item 16 (reckless / self-destructive behaviour) rated ≥ 3 is treated as
// the suicidality-screen trigger and emits an URGENT flag, in line with the
// task brief.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

(function () {
'use strict';
window.PostTraumaticStressAssessment = window.PostTraumaticStressAssessment || {};

/**
 * @param {AssessmentData} data
 * @param {number} total
 * @param {boolean} probableDsm5
 * @param {number} answeredCount
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, total, probableDsm5, answeredCount) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Suicidal ideation / self-destructive behaviour ────────
  // Item 16 ≥ 3 → urgent: prompt clinician to screen for suicidality.
  const item16 = data.clusterEArousalReactivity.item16RecklessOrSelfDestructive ?? 0;
  if (item16 >= 3) {
    flags.push({
      id: 'FLAG-SELFHARM-001',
      category: 'Self-harm / suicidality risk',
      message:
        'Item 16 (taking too many risks or doing things that could cause harm) rated Quite a bit or Extremely — screen for suicidal ideation and complete a safety plan before the patient leaves the consultation.',
      priority: 'urgent'
    });
  }

  // ─── Possible dissociative features ────────────────────────
  // Item 3 (reliving) AND item 8 (memory gaps) both ≥ 3.
  const item3 = data.clusterBIntrusion.item3FeelingReliving ?? 0;
  const item8 = data.clusterDNegativeAlterations.item8TroubleRememberingImportantParts ?? 0;
  if (item3 >= 3 && item8 >= 3) {
    flags.push({
      id: 'FLAG-DISSOCIATION-001',
      category: 'Possible dissociative features',
      message:
        'Items 3 (reliving) and 8 (memory gaps) both rated ≥ 3 — consider the dissociative subtype and add the PCL-5 dissociative items if not already used.',
      priority: 'high'
    });
  }

  // ─── DSM-5 pattern met → structured interview recommended ──
  if (probableDsm5) {
    flags.push({
      id: 'FLAG-STRUCTURED-INTERVIEW-001',
      category: 'Structured clinical interview recommended',
      message:
        'Provisional diagnosis met — arrange a CAPS-5 or equivalent structured interview to confirm the diagnosis and inform treatment planning.',
      priority: 'medium'
    });
  }

  // ─── Severe symptom burden alert ──────────────────────────
  if (total >= 38) {
    flags.push({
      id: 'FLAG-SEVERE-001',
      category: 'Severe symptom burden',
      message:
        'Total score ≥ 38 — trauma-focused psychotherapy (e.g. CPT, PE, EMDR) is indicated; consider pharmacotherapy review.',
      priority: 'high'
    });
  }

  // ─── Assessment incomplete ────────────────────────────────
  if (answeredCount === 0) {
    flags.push({
      id: 'FLAG-NOT-ASSESSED-001',
      category: 'Assessment incomplete',
      message:
        'No PCL-5 items were answered — confirm the patient completed the questionnaire before interpreting the score.',
      priority: 'medium'
    });
  } else if (answeredCount < 20) {
    flags.push({
      id: 'FLAG-NOT-ASSESSED-002',
      category: 'Assessment incomplete',
      message: `Only ${answeredCount} of 20 PCL-5 items answered — total score may under-estimate symptom burden.`,
      priority: 'medium'
    });
  }

  // ─── Trauma event description missing ─────────────────────
  if (!data.traumaEvent.eventDescription || !data.traumaEvent.eventDescription.trim()) {
    flags.push({
      id: 'FLAG-TRAUMA-UNSPECIFIED-001',
      category: 'Trauma event not specified',
      message:
        'No trauma event description recorded — the PCL-5 score must be interpreted in the context of a specified DSM-5 Criterion A event.',
      priority: 'medium'
    });
  }

  // ─── Ongoing trauma exposure ──────────────────────────────
  if (data.traumaEvent.isOngoing) {
    flags.push({
      id: 'FLAG-TRAUMA-ONGOING-001',
      category: 'Ongoing trauma exposure',
      message:
        'Patient indicates the traumatic event or situation is still happening — assess immediate safety and consider whether trauma-focused therapy is appropriate at this time.',
      priority: 'high'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.PostTraumaticStressAssessment.detectAdditionalFlags = detectAdditionalFlags;
})();
