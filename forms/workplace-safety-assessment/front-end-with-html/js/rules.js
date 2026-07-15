// Workplace Safety Assessment — declarative scoring rules.
//
// Each rule maps a single audit checklist item to a severity grade if the
// answer indicates non-compliance. Severity grades:
//
//   1 = Compliant       (no finding raised)
//   2 = Minor           (low-risk gap; action within 90 days)
//   3 = Major           (moderate-risk gap; action within 30 days)
//   4 = Critical        (imminent risk; immediate corrective action)
//
// Each rule's `evaluate(data)` returns:
//   - 1 when the audited control is in place (yes / no in the safe direction
//     / N/A meaning not applicable);
//   - 2-4 when a finding is raised;
//   - 0 when the auditor has not answered the item (excluded from scoring).
//
// The grader then aggregates fired rules by category and selects the highest
// severity to determine the overall outcome.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').SeverityGrade} SeverityGrade
 *
 * @typedef {Object} SafetyRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {SeverityGrade} severity
 * @property {(d: AssessmentData) => number} evaluate
 */

/** Severity for a "no" answer to a positively-phrased control question. */
function gradeNoIsBad(answer, severity) {
  if (answer === '' || answer === undefined || answer === null) return 0;
  if (answer === 'yes' || answer === 'na') return 1;
  return severity; // 'no' -> finding at the rule's severity
}

/** Severity for a "yes" answer to a negatively-phrased question (presence of bad thing). */
function gradeYesIsBad(answer, severity) {
  if (answer === '' || answer === undefined || answer === null) return 0;
  if (answer === 'no' || answer === 'na') return 1;
  return severity; // 'yes' -> finding at the rule's severity
}

/** @type {SafetyRule[]} */
const safetyRules = [
  // ─── Section 1: Demographics & Site Details ───────────────────────────
  {
    id: 'WS-001',
    category: 'Site Details',
    description: 'Findings from previous audit have been closed out.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.siteDetails.previousFindingsClosed, 3)
  },

  // ─── Section 2: PPE & Hazard Controls ─────────────────────────────────
  {
    id: 'WS-002',
    category: 'PPE & Hazard Controls',
    description: 'Appropriate PPE is available for the task.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.ppeHazardControls.ppeAvailable, 3)
  },
  {
    id: 'WS-003',
    category: 'PPE & Hazard Controls',
    description: 'PPE is being correctly used by staff.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.ppeHazardControls.ppeCorrectlyUsed, 2)
  },
  {
    id: 'WS-004',
    category: 'PPE & Hazard Controls',
    description: 'PPE stock is maintained at adequate levels.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.ppeHazardControls.ppeStockMaintained, 2)
  },
  {
    id: 'WS-005',
    category: 'PPE & Hazard Controls',
    description: 'Hazard signage is visible where required.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.ppeHazardControls.hazardSignageVisible, 2)
  },
  {
    id: 'WS-006',
    category: 'PPE & Hazard Controls',
    description: 'Signage is legible and not faded.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.ppeHazardControls.signageLegible, 2)
  },
  {
    id: 'WS-007',
    category: 'PPE & Hazard Controls',
    description: 'General housekeeping is satisfactory.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.ppeHazardControls.housekeepingSatisfactory, 2)
  },
  {
    id: 'WS-008',
    category: 'PPE & Hazard Controls',
    description: 'Slip, trip and fall hazards are controlled.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.ppeHazardControls.slipTripHazardsControlled, 3)
  },

  // ─── Section 3: Chemical & Biological Hazards ─────────────────────────
  {
    id: 'WS-009',
    category: 'Chemical & Biological',
    description: 'COSHH register is present and up to date.',
    severity: 4,
    evaluate: (d) => gradeNoIsBad(d.chemicalBiologicalHazards.coshhRegisterPresent, 4)
  },
  {
    id: 'WS-010',
    category: 'Chemical & Biological',
    description: 'Safety Data Sheets (SDS) are available for hazardous substances.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.chemicalBiologicalHazards.sdsAvailable, 3)
  },
  {
    id: 'WS-011',
    category: 'Chemical & Biological',
    description: 'Chemicals are labelled correctly per CLP.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.chemicalBiologicalHazards.chemicalsLabelledCorrectly, 3)
  },
  {
    id: 'WS-012',
    category: 'Chemical & Biological',
    description: 'Chemicals are stored securely (locked, segregated, ventilated).',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.chemicalBiologicalHazards.chemicalsStoredSecurely, 3)
  },
  {
    id: 'WS-013',
    category: 'Chemical & Biological',
    description: 'Spill kits are available, accessible and stocked.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.chemicalBiologicalHazards.spillKitsAvailable, 3)
  },
  {
    id: 'WS-014',
    category: 'Chemical & Biological',
    description: 'No untreated chemical or biological spills observed.',
    severity: 4,
    evaluate: (d) => gradeYesIsBad(d.chemicalBiologicalHazards.untreatedSpillsObserved, 4)
  },
  {
    id: 'WS-015',
    category: 'Chemical & Biological',
    description: 'Sharps containers are in date and not over-filled.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.chemicalBiologicalHazards.sharpsContainersInDate, 3)
  },
  {
    id: 'WS-016',
    category: 'Chemical & Biological',
    description: 'Clinical waste is correctly segregated.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.chemicalBiologicalHazards.clinicalWasteSegregated, 3)
  },
  {
    id: 'WS-017',
    category: 'Chemical & Biological',
    description: 'Biological agent risk assessment is current.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.chemicalBiologicalHazards.biologicalRiskAssessmentCurrent, 3)
  },

  // ─── Section 4: Electrical Safety ─────────────────────────────────────
  {
    id: 'WS-018',
    category: 'Electrical Safety',
    description: 'Portable Appliance Testing (PAT) is in date.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.electricalSafety.patTestingInDate, 3)
  },
  {
    id: 'WS-019',
    category: 'Electrical Safety',
    description: 'Fixed wiring electrical installation test is in date.',
    severity: 4,
    evaluate: (d) => gradeNoIsBad(d.electricalSafety.fixedWiringTestInDate, 4)
  },
  {
    id: 'WS-020',
    category: 'Electrical Safety',
    description: 'No damaged electrical equipment observed.',
    severity: 4,
    evaluate: (d) => gradeYesIsBad(d.electricalSafety.damagedEquipmentObserved, 4)
  },
  {
    id: 'WS-021',
    category: 'Electrical Safety',
    description: 'No overloaded sockets or daisy-chained extension leads.',
    severity: 3,
    evaluate: (d) => gradeYesIsBad(d.electricalSafety.overloadedSocketsObserved, 3)
  },
  {
    id: 'WS-022',
    category: 'Electrical Safety',
    description: 'Extension leads are managed safely (not trip hazards).',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.electricalSafety.extensionLeadsManagedSafely, 2)
  },
  {
    id: 'WS-023',
    category: 'Electrical Safety',
    description: 'Consumer unit / distribution board is accessible and labelled.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.electricalSafety.consumerUnitAccessible, 3)
  },

  // ─── Section 5: Fire Safety & Emergency Egress ────────────────────────
  {
    id: 'WS-024',
    category: 'Fire Safety',
    description: 'Fire risk assessment is current and on file.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.fireSafety.fireRiskAssessmentCurrent, 3)
  },
  {
    id: 'WS-025',
    category: 'Fire Safety',
    description: 'Fire extinguishers have a current annual service record.',
    severity: 4,
    evaluate: (d) => gradeNoIsBad(d.fireSafety.fireExtinguishersServiced, 4)
  },
  {
    id: 'WS-026',
    category: 'Fire Safety',
    description: 'Fire extinguishers are accessible and unobstructed.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.fireSafety.fireExtinguishersAccessible, 3)
  },
  {
    id: 'WS-027',
    category: 'Fire Safety',
    description: 'Fire alarm is tested weekly with records.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.fireSafety.fireAlarmTestedWeekly, 3)
  },
  {
    id: 'WS-028',
    category: 'Fire Safety',
    description: 'Emergency egress routes are clear and unobstructed.',
    severity: 4,
    evaluate: (d) => gradeNoIsBad(d.fireSafety.emergencyEgressClear, 4)
  },
  {
    id: 'WS-029',
    category: 'Fire Safety',
    description: 'Emergency lighting is functional.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.fireSafety.emergencyLightingFunctional, 3)
  },
  {
    id: 'WS-030',
    category: 'Fire Safety',
    description: 'No fire doors held open illegally (e.g. by wedges).',
    severity: 3,
    evaluate: (d) => gradeYesIsBad(d.fireSafety.fireDoorsHeldOpenIllegally, 3)
  },
  {
    id: 'WS-031',
    category: 'Fire Safety',
    description: 'Assembly point is signposted and accessible.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.fireSafety.assemblyPointSignposted, 2)
  },

  // ─── Section 6: Ergonomics & Manual Handling ──────────────────────────
  {
    id: 'WS-032',
    category: 'Ergonomics & Manual Handling',
    description: 'Manual handling risk assessment is current.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.ergonomicsManualHandling.manualHandlingAssessmentCurrent, 3)
  },
  {
    id: 'WS-033',
    category: 'Ergonomics & Manual Handling',
    description: 'Lifting aids and hoists are available and serviced.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.ergonomicsManualHandling.liftingAidsAvailable, 3)
  },
  {
    id: 'WS-034',
    category: 'Ergonomics & Manual Handling',
    description: 'DSE (Display Screen Equipment) assessments completed for staff.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.ergonomicsManualHandling.dseAssessmentsCompleted, 2)
  },
  {
    id: 'WS-035',
    category: 'Ergonomics & Manual Handling',
    description: 'Workstations are appropriately adjustable.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.ergonomicsManualHandling.workstationsAdjustable, 2)
  },
  {
    id: 'WS-036',
    category: 'Ergonomics & Manual Handling',
    description: 'No repetitive strain or postural concerns reported.',
    severity: 2,
    evaluate: (d) => gradeYesIsBad(d.ergonomicsManualHandling.repetitiveStrainConcerns, 2)
  },
  {
    id: 'WS-037',
    category: 'Ergonomics & Manual Handling',
    description: 'Patient handling plans are in place where applicable.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.ergonomicsManualHandling.patientHandlingPlansInPlace, 3)
  },

  // ─── Section 7: Emergency Procedures ──────────────────────────────────
  {
    id: 'WS-038',
    category: 'Emergency Procedures',
    description: 'Evacuation procedure is posted prominently.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.emergencyProcedures.evacuationProcedurePosted, 3)
  },
  {
    id: 'WS-039',
    category: 'Emergency Procedures',
    description: 'First-aid kits are stocked and in date.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.emergencyProcedures.firstAidKitsStocked, 3)
  },
  {
    id: 'WS-040',
    category: 'Emergency Procedures',
    description: 'First-aider roster is current.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.emergencyProcedures.firstAiderRosterCurrent, 3)
  },
  {
    id: 'WS-041',
    category: 'Emergency Procedures',
    description: 'AED (defibrillator) available where required.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.emergencyProcedures.aedAvailable, 2)
  },
  {
    id: 'WS-042',
    category: 'Emergency Procedures',
    description: 'AED service / battery / pad checks are in date.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.emergencyProcedures.aedServiceInDate, 3)
  },
  {
    id: 'WS-043',
    category: 'Emergency Procedures',
    description: 'Emergency contact numbers are displayed.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.emergencyProcedures.emergencyContactsDisplayed, 2)
  },
  {
    id: 'WS-044',
    category: 'Emergency Procedures',
    description: 'A drill or live exercise has been conducted in the last 12 months.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.emergencyProcedures.drillConductedLast12Months, 3)
  },

  // ─── Section 8: Training & Competence ─────────────────────────────────
  {
    id: 'WS-045',
    category: 'Training & Competence',
    description: 'Mandatory training is up to date for all staff.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.trainingCompetence.mandatoryTrainingUpToDate, 3)
  },
  {
    id: 'WS-046',
    category: 'Training & Competence',
    description: 'Trained fire marshals are appointed and on rota.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.trainingCompetence.fireMarshalsTrained, 3)
  },
  {
    id: 'WS-047',
    category: 'Training & Competence',
    description: 'Manual handling training is current for relevant staff.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.trainingCompetence.manualHandlingTrainingCurrent, 2)
  },
  {
    id: 'WS-048',
    category: 'Training & Competence',
    description: 'Infection control training is current.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.trainingCompetence.infectionControlTrainingCurrent, 3)
  },
  {
    id: 'WS-049',
    category: 'Training & Competence',
    description: 'Training records are accessible for audit.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.trainingCompetence.trainingRecordsAccessible, 2)
  },
  {
    id: 'WS-050',
    category: 'Training & Competence',
    description: 'Induction is completed for new starters.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.trainingCompetence.inductionForNewStartersCompleted, 2)
  },

  // ─── Section 9: Incident Reporting & Near Misses ──────────────────────
  {
    id: 'WS-051',
    category: 'Incident Reporting',
    description: 'Incident reporting system is in active use.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.incidentReporting.incidentReportingSystemUsed, 3)
  },
  {
    id: 'WS-052',
    category: 'Incident Reporting',
    description: 'RIDDOR-reportable incidents have been reported to HSE.',
    severity: 4,
    evaluate: (d) => gradeNoIsBad(d.incidentReporting.riddorReportableIncidentsReported, 4)
  },
  {
    id: 'WS-053',
    category: 'Incident Reporting',
    description: 'Near-miss reporting culture is active.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.incidentReporting.nearMissReportingActive, 2)
  },
  {
    id: 'WS-054',
    category: 'Incident Reporting',
    description: 'Lessons learned are shared across the team.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.incidentReporting.lessonsLearnedShared, 2)
  },
  {
    id: 'WS-055',
    category: 'Incident Reporting',
    description: 'Actions arising from incidents are tracked to completion.',
    severity: 3,
    evaluate: (d) => gradeNoIsBad(d.incidentReporting.actionsFromIncidentsTracked, 3)
  },

  // ─── Section 10: Sign-off & Action Plan ───────────────────────────────
  {
    id: 'WS-056',
    category: 'Sign-off',
    description: 'Findings have been debriefed with the site manager.',
    severity: 2,
    evaluate: (d) => gradeNoIsBad(d.signoffActionPlan.debriefDelivered, 2)
  }
];

export { safetyRules };
