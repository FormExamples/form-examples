// Flagged-issue detection. Independent of the grade aggregation (which the
// safety-grader computes), this module raises auditor-facing flags
// prioritised as high / medium / low for the kinds of finding that warrant
// targeted follow-up beyond the headline grade.
//
// High-priority triggers:
//   - No fire-extinguisher servicing record
//   - Blocked emergency egress
//   - Electrical safety failures (damaged equipment, fixed-wiring overdue)
//   - Untreated chemical or biological spills
//   - COSHH register missing
//   - RIDDOR-reportable incidents not reported to HSE
//
// Medium-priority triggers:
//   - PPE gaps (unavailable, mis-used, low stock)
//   - Manual handling assessment overdue
//   - Mandatory training overdue
//   - Near-miss reporting under-engaged
//
// Low-priority triggers:
//   - Signage faded or illegible
//   - Minor housekeeping issues

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.WorkplaceSafetyAssessment.
(function () {
'use strict';
window.WorkplaceSafetyAssessment = window.WorkplaceSafetyAssessment || {};

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── HIGH-priority flags ──────────────────────────────────────
  if (data.fireSafety.fireExtinguishersServiced === 'no') {
    flags.push({
      id: 'FLAG-FIRE-001',
      category: 'Fire Safety',
      message: 'Fire extinguishers have no current annual service record — immediate servicing required.',
      priority: 'high'
    });
  }

  if (data.fireSafety.emergencyEgressClear === 'no') {
    flags.push({
      id: 'FLAG-FIRE-002',
      category: 'Fire Safety',
      message: 'Emergency egress route is blocked or obstructed — clear immediately and re-inspect.',
      priority: 'high'
    });
  }

  if (data.electricalSafety.damagedEquipmentObserved === 'yes') {
    flags.push({
      id: 'FLAG-ELEC-001',
      category: 'Electrical Safety',
      message: 'Damaged electrical equipment observed — quarantine and remove from service.',
      priority: 'high'
    });
  }

  if (data.electricalSafety.fixedWiringTestInDate === 'no') {
    flags.push({
      id: 'FLAG-ELEC-002',
      category: 'Electrical Safety',
      message: 'Fixed wiring test (EICR) is not in date — book a competent electrician.',
      priority: 'high'
    });
  }

  if (data.chemicalBiologicalHazards.untreatedSpillsObserved === 'yes') {
    flags.push({
      id: 'FLAG-CHEM-001',
      category: 'Chemical & Biological',
      message: 'Untreated chemical or biological spill observed — clean up using spill kit and PPE.',
      priority: 'high'
    });
  }

  if (data.chemicalBiologicalHazards.coshhRegisterPresent === 'no') {
    flags.push({
      id: 'FLAG-CHEM-002',
      category: 'Chemical & Biological',
      message: 'COSHH register is missing — required by the Control of Substances Hazardous to Health Regulations 2002.',
      priority: 'high'
    });
  }

  if (data.incidentReporting.riddorReportableIncidentsReported === 'no') {
    flags.push({
      id: 'FLAG-INC-001',
      category: 'Incident Reporting',
      message: 'RIDDOR-reportable incidents have not been reported to HSE — legal duty under RIDDOR 2013.',
      priority: 'high'
    });
  }

  // ─── MEDIUM-priority flags ────────────────────────────────────
  if (data.ppeHazardControls.ppeAvailable === 'no') {
    flags.push({
      id: 'FLAG-PPE-001',
      category: 'PPE & Hazard Controls',
      message: 'Appropriate PPE is not available for the task — re-stock and retrain.',
      priority: 'medium'
    });
  }

  if (data.ppeHazardControls.ppeCorrectlyUsed === 'no') {
    flags.push({
      id: 'FLAG-PPE-002',
      category: 'PPE & Hazard Controls',
      message: 'PPE is not being correctly used — coaching and supervision required.',
      priority: 'medium'
    });
  }

  if (data.ppeHazardControls.ppeStockMaintained === 'no') {
    flags.push({
      id: 'FLAG-PPE-003',
      category: 'PPE & Hazard Controls',
      message: 'PPE stock levels inadequate — review re-order triggers.',
      priority: 'medium'
    });
  }

  if (data.ergonomicsManualHandling.manualHandlingAssessmentCurrent === 'no') {
    flags.push({
      id: 'FLAG-MH-001',
      category: 'Ergonomics & Manual Handling',
      message: 'Manual handling risk assessment is overdue — schedule reassessment.',
      priority: 'medium'
    });
  }

  if (data.trainingCompetence.mandatoryTrainingUpToDate === 'no') {
    flags.push({
      id: 'FLAG-TRN-001',
      category: 'Training & Competence',
      message: 'Mandatory training is overdue for one or more staff — book refreshers.',
      priority: 'medium'
    });
  }

  if (data.trainingCompetence.infectionControlTrainingCurrent === 'no') {
    flags.push({
      id: 'FLAG-TRN-002',
      category: 'Training & Competence',
      message: 'Infection control training is not current — book refreshers.',
      priority: 'medium'
    });
  }

  if (data.incidentReporting.nearMissReportingActive === 'no') {
    flags.push({
      id: 'FLAG-INC-002',
      category: 'Incident Reporting',
      message: 'Near-miss reporting is under-engaged — promote a no-blame reporting culture.',
      priority: 'medium'
    });
  }

  // Disproportionately low near-miss vs incident counts also flag.
  const incidents = data.incidentReporting.incidentsLast12Months;
  const nearMisses = data.incidentReporting.nearMissesLast12Months;
  if (
    incidents !== null &&
    nearMisses !== null &&
    incidents > 0 &&
    nearMisses < incidents
  ) {
    flags.push({
      id: 'FLAG-INC-003',
      category: 'Incident Reporting',
      message: `Near-miss count (${nearMisses}) is lower than incident count (${incidents}) — likely under-reporting.`,
      priority: 'medium'
    });
  }

  // ─── LOW-priority flags ───────────────────────────────────────
  if (data.ppeHazardControls.signageLegible === 'no') {
    flags.push({
      id: 'FLAG-SIG-001',
      category: 'PPE & Hazard Controls',
      message: 'Signage is faded or illegible — replace at next opportunity.',
      priority: 'low'
    });
  }

  if (data.ppeHazardControls.hazardSignageVisible === 'no') {
    flags.push({
      id: 'FLAG-SIG-002',
      category: 'PPE & Hazard Controls',
      message: 'Hazard signage is missing in places — install where required.',
      priority: 'low'
    });
  }

  if (data.ppeHazardControls.housekeepingSatisfactory === 'no') {
    flags.push({
      id: 'FLAG-HSK-001',
      category: 'PPE & Hazard Controls',
      message: 'Minor housekeeping issues observed — schedule a tidy-up.',
      priority: 'low'
    });
  }

  if (data.fireSafety.assemblyPointSignposted === 'no') {
    flags.push({
      id: 'FLAG-FIRE-003',
      category: 'Fire Safety',
      message: 'Assembly point is not clearly signposted — install signage.',
      priority: 'low'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.WorkplaceSafetyAssessment.detectAdditionalFlags = detectAdditionalFlags;
})();
