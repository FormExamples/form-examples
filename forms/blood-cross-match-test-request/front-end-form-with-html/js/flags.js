// Safety-flag detection for the Blood Cross-Match Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: massive-haemorrhage-stat, two-sample-rule-not-met,
// known-antibodies-extra-time, previous-transfusion-reaction, mislabel-risk,
// missing-clinical-details, missing-blood-group, and other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.BloodCrossMatchTestRequest`.

(function () {
'use strict';
window.BloodCrossMatchTestRequest =
  window.BloodCrossMatchTestRequest || {};
const NS = window.BloodCrossMatchTestRequest;

/**
 * Detect safety flags for a blood cross-match / transfusion request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ identitySafetyBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Massive haemorrhage (stat) ------------------------------------
  if (
    data.triage.massiveHaemorrhage === true ||
    data.request.requestType === 'emergency-o-negative'
  ) {
    flags.push({
      flagId: 'F-MASSIVE-HAEMORRHAGE-STAT-001',
      category: 'massive-haemorrhage-stat',
      priority: 'high',
      description: 'Declared major / massive haemorrhage or emergency O-negative request.',
      suggestedAction: 'Activate the major haemorrhage protocol and issue emergency O-negative red cells now; do not wait for full compatibility testing.'
    });
  }

  // --- Two-sample (group-check) rule not met -------------------------
  const needsCompatibility =
    data.request.requestType === 'crossmatch' ||
    data.request.requestType === 'group-and-save' ||
    data.request.requestType === 'antibody-screen';
  if (
    needsCompatibility &&
    data.sample.sampleCollected === 'yes' &&
    data.sample.twoSampleRuleMet !== true
  ) {
    flags.push({
      flagId: 'F-TWO-SAMPLE-RULE-001',
      category: 'two-sample-rule-not-met',
      priority: 'high',
      description: 'BSH / SHOT two-sample (group-check) rule not satisfied.',
      suggestedAction: 'Obtain a second independent group sample before issuing non-emergency red cells.'
    });
  }

  // --- Known antibodies (extra crossmatch time) ----------------------
  if (data.history.knownAntibodies === true) {
    flags.push({
      flagId: 'F-KNOWN-ANTIBODIES-001',
      category: 'known-antibodies-extra-time',
      priority: 'medium',
      description: 'Patient has known red-cell alloantibodies; antigen-negative units and extra crossmatch time are required.',
      suggestedAction: 'Allow additional time to source antigen-negative units; review antibody specificity and historical records before vetting.'
    });
  }

  // --- Previous transfusion reaction ---------------------------------
  if (data.history.previousTransfusionReaction === true) {
    flags.push({
      flagId: 'F-PREVIOUS-REACTION-001',
      category: 'previous-transfusion-reaction',
      priority: 'medium',
      description: 'Patient has had a previous transfusion reaction.',
      suggestedAction: 'Review the nature of the previous reaction; consider washed / irradiated components and premedication as indicated.'
    });
  }

  // --- Mislabel / WBIT risk ------------------------------------------
  if (
    data.sample.sampleCollected === 'yes' &&
    data.sample.labellingCheckComplete !== true
  ) {
    flags.push({
      flagId: 'F-MISLABEL-RISK-001',
      category: 'mislabel-risk',
      priority: 'high',
      description: 'Sample labelling check not confirmed — Wrong Blood in Tube (WBIT) risk.',
      suggestedAction: 'Verify the fully hand-labelled sample against positive patient identification; reject and re-bleed if any discrepancy.'
    });
  } else if (data.patient.positivePatientIdConfirmed !== true) {
    flags.push({
      flagId: 'F-MISLABEL-RISK-002',
      category: 'mislabel-risk',
      priority: 'medium',
      description: 'Positive patient identification not confirmed.',
      suggestedAction: 'Confirm core patient identifiers at the bedside before sampling and labelling.'
    });
  }

  // --- Missing blood group -------------------------------------------
  if (
    !data.history.patientBloodGroup ||
    data.history.patientBloodGroup === 'unknown'
  ) {
    flags.push({
      flagId: 'F-MISSING-BLOOD-GROUP-001',
      category: 'missing-blood-group',
      priority: 'medium',
      description: 'Patient ABO/Rh blood group is unknown or not recorded.',
      suggestedAction: 'Group the patient before issuing group-specific red cells; use O-negative if blood is needed before the group is confirmed.'
    });
  }

  // --- Missing clinical details --------------------------------------
  if (
    !data.indication.clinicalDetails ||
    data.indication.clinicalDetails.trim() === ''
  ) {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'low',
      description: 'No clinical details recorded to support the request.',
      suggestedAction: 'Query the referrer for the clinical details supporting transfusion before vetting.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
