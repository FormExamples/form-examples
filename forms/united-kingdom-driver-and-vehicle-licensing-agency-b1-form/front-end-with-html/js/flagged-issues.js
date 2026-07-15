import { epilepsyDeclarationRequired } from './types.js';

// DVLA B1 flagged-issue detection. Independent of the completeness check
// (which is handled by the validator), this module raises clinician- or
// DVLA-significant flags for high-risk responses such as missing epilepsy
// declarations, drowsy medication, seizures affecting consciousness, etc.
// Priorities (urgent -> high -> medium -> low) drive sort order in the
// report.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  // --- Epilepsy declaration (urgent if missing) ---------------------
  if (epilepsyDeclarationRequired(data)) {
    const decl = data.seizures.epilepsyDeclaration;
    if (!decl.declarationAccepted || !decl.signedName || !decl.signatureDate) {
      flags.push({
        id: 'FLAG-EPI-001',
        category: 'Epilepsy Declaration',
        message:
          'Epilepsy declaration is required (epilepsy or more than one seizure declared) but is not fully signed.',
        priority: 'urgent'
      });
    }
  }

  // --- Authorisation (urgent if not accepted) -----------------------
  if (!data.authorisation.declarationAccepted) {
    flags.push({
      id: 'FLAG-AUTH-001',
      category: 'Authorisation',
      message:
        'Applicant has not accepted the medical disclosure authorisation - DVLA cannot process the form without it.',
      priority: 'urgent'
    });
  }

  // --- Driving safety: drowsy medication (high) ---------------------
  if (data.medication.makesDrowsyOrConfused === 'yes') {
    flags.push({
      id: 'FLAG-MED-001',
      category: 'Medication',
      message:
        'Patient reports current medication causes drowsiness or confusion when driving.',
      priority: 'high'
    });
  }

  // --- Seizures affecting consciousness (high) ----------------------
  if (
    data.seizures.hadSeizures === 'yes' &&
    data.seizures.diagnosis === 'more-than-one-or-epilepsy' &&
    data.seizures.multiple.affectedConsciousness === 'yes'
  ) {
    flags.push({
      id: 'FLAG-SEIZ-001',
      category: 'Seizures',
      message: 'Seizures have affected level of consciousness.',
      priority: 'high'
    });
  }

  // --- Seizures affecting vehicle control (high) --------------------
  if (
    data.seizures.hadSeizures === 'yes' &&
    data.seizures.diagnosis === 'more-than-one-or-epilepsy' &&
    data.seizures.multiple.wouldHaveAffectedDriving === 'yes'
  ) {
    flags.push({
      id: 'FLAG-SEIZ-002',
      category: 'Seizures',
      message: 'Seizures would have caused difficulty controlling a vehicle.',
      priority: 'high'
    });
  }

  // --- Two or more seizures within 5 years (high) -------------------
  if (
    data.seizures.hadSeizures === 'yes' &&
    data.seizures.multiple.twoOrMoreWithinFiveYears === 'yes'
  ) {
    flags.push({
      id: 'FLAG-SEIZ-003',
      category: 'Seizures',
      message: 'Two or more seizures within a 5-year period reported.',
      priority: 'high'
    });
  }

  // --- Uncontrolled double vision (high) ----------------------------
  if (
    data.doubleVision.hasDoubleVision === 'yes' &&
    data.doubleVision.suppressedOrControlled === 'no'
  ) {
    flags.push({
      id: 'FLAG-DIPL-001',
      category: 'Double Vision',
      message: 'Double vision (diplopia) reported and not suppressed or controlled.',
      priority: 'high'
    });
  }

  // --- Eyesight problems (medium) -----------------------------------
  if (data.eyesight.hasEyesightProblems === 'yes') {
    flags.push({
      id: 'FLAG-EYE-001',
      category: 'Eyesight',
      message: 'Eyesight problems caused by the condition reported.',
      priority: 'medium'
    });
  }

  // --- Blackouts (medium) -------------------------------------------
  if (data.blackouts.hadBlackouts === 'yes') {
    flags.push({
      id: 'FLAG-BLK-001',
      category: 'Blackouts',
      message: 'History of blackouts or altered consciousness reported.',
      priority: 'medium'
    });
  }

  // --- VP shunt (medium) --------------------------------------------
  if (data.vpShunt.hadVpShuntOrDrain === 'yes') {
    flags.push({
      id: 'FLAG-VPS-001',
      category: 'VP Shunt',
      message: 'VP shunt or external ventricular drain reported.',
      priority: 'medium'
    });
  }

  // --- Daily-living assistance (medium) -----------------------------
  if (data.dailyLiving.needsHelp === 'yes') {
    flags.push({
      id: 'FLAG-DL-001',
      category: 'Daily Living',
      message: 'Patient needs help from another person with day-to-day living.',
      priority: 'medium'
    });
  }

  // --- Vehicle adaptations (low) ------------------------------------
  if (data.vehicleAdaptations.needsAdaptations === 'yes') {
    flags.push({
      id: 'FLAG-VEH-001',
      category: 'Vehicle Adaptations',
      message: 'Patient requires special controls or automatic transmission.',
      priority: 'low'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
