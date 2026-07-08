// Plain-JavaScript / JSDoc type definitions for the Workplace Safety
// Assessment auditor checklist. The form covers a UK HSE-aligned audit of a
// healthcare site across 10 sections; each item is captured as a yes/no/N/A
// checklist response plus optional narrative observations.
//
// Conventions:
//   - Yes/No/N/A radios use 'yes' | 'no' | 'na' | '' (where '' = unanswered).
//   - Free-text observation fields default to '' (empty string).
//   - Numeric fields default to null when unanswered.

/**
 * @typedef {'yes' | 'no' | 'na' | ''} YesNoNA
 * @typedef {'compliant' | 'minor' | 'major' | 'critical'} Outcome
 * @typedef {1 | 2 | 3 | 4} SeverityGrade
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} FlagPriority
 */

/**
 * Demographics and site details.
 * @typedef {Object} SiteDetails
 * @property {string} auditorName
 * @property {string} auditorRole
 * @property {string} auditDate
 * @property {string} siteName
 * @property {string} siteAddress
 * @property {string} departmentArea
 * @property {string} siteManager
 * @property {string} previousAuditDate
 * @property {YesNoNA} previousFindingsClosed
 */

/**
 * PPE & Hazard Controls (section 2).
 * @typedef {Object} PPEHazardControls
 * @property {YesNoNA} ppeAvailable
 * @property {YesNoNA} ppeCorrectlyUsed
 * @property {YesNoNA} ppeStockMaintained
 * @property {YesNoNA} hazardSignageVisible
 * @property {YesNoNA} signageLegible
 * @property {YesNoNA} housekeepingSatisfactory
 * @property {YesNoNA} slipTripHazardsControlled
 * @property {string} observations
 */

/**
 * Chemical & Biological Hazards (section 3).
 * @typedef {Object} ChemicalBiologicalHazards
 * @property {YesNoNA} coshhRegisterPresent
 * @property {YesNoNA} sdsAvailable
 * @property {YesNoNA} chemicalsLabelledCorrectly
 * @property {YesNoNA} chemicalsStoredSecurely
 * @property {YesNoNA} spillKitsAvailable
 * @property {YesNoNA} untreatedSpillsObserved
 * @property {YesNoNA} sharpsContainersInDate
 * @property {YesNoNA} clinicalWasteSegregated
 * @property {YesNoNA} biologicalRiskAssessmentCurrent
 * @property {string} observations
 */

/**
 * Electrical Safety (section 4).
 * @typedef {Object} ElectricalSafety
 * @property {YesNoNA} patTestingInDate
 * @property {YesNoNA} fixedWiringTestInDate
 * @property {YesNoNA} damagedEquipmentObserved
 * @property {YesNoNA} overloadedSocketsObserved
 * @property {YesNoNA} extensionLeadsManagedSafely
 * @property {YesNoNA} consumerUnitAccessible
 * @property {string} observations
 */

/**
 * Fire Safety & Emergency Egress (section 5).
 * @typedef {Object} FireSafety
 * @property {YesNoNA} fireRiskAssessmentCurrent
 * @property {YesNoNA} fireExtinguishersServiced
 * @property {YesNoNA} fireExtinguishersAccessible
 * @property {YesNoNA} fireAlarmTestedWeekly
 * @property {YesNoNA} emergencyEgressClear
 * @property {YesNoNA} emergencyLightingFunctional
 * @property {YesNoNA} fireDoorsHeldOpenIllegally
 * @property {YesNoNA} assemblyPointSignposted
 * @property {string} observations
 */

/**
 * Ergonomics & Manual Handling (section 6).
 * @typedef {Object} ErgonomicsManualHandling
 * @property {YesNoNA} manualHandlingAssessmentCurrent
 * @property {YesNoNA} liftingAidsAvailable
 * @property {YesNoNA} dseAssessmentsCompleted
 * @property {YesNoNA} workstationsAdjustable
 * @property {YesNoNA} repetitiveStrainConcerns
 * @property {YesNoNA} patientHandlingPlansInPlace
 * @property {string} observations
 */

/**
 * Emergency Procedures (section 7).
 * @typedef {Object} EmergencyProcedures
 * @property {YesNoNA} evacuationProcedurePosted
 * @property {YesNoNA} firstAidKitsStocked
 * @property {YesNoNA} firstAiderRosterCurrent
 * @property {YesNoNA} aedAvailable
 * @property {YesNoNA} aedServiceInDate
 * @property {YesNoNA} emergencyContactsDisplayed
 * @property {YesNoNA} drillConductedLast12Months
 * @property {string} observations
 */

/**
 * Training & Competence (section 8).
 * @typedef {Object} TrainingCompetence
 * @property {YesNoNA} mandatoryTrainingUpToDate
 * @property {YesNoNA} fireMarshalsTrained
 * @property {YesNoNA} manualHandlingTrainingCurrent
 * @property {YesNoNA} infectionControlTrainingCurrent
 * @property {YesNoNA} trainingRecordsAccessible
 * @property {YesNoNA} inductionForNewStartersCompleted
 * @property {string} observations
 */

/**
 * Incident Reporting & Near Misses (section 9).
 * @typedef {Object} IncidentReporting
 * @property {YesNoNA} incidentReportingSystemUsed
 * @property {YesNoNA} riddorReportableIncidentsReported
 * @property {YesNoNA} nearMissReportingActive
 * @property {number | null} incidentsLast12Months
 * @property {number | null} nearMissesLast12Months
 * @property {YesNoNA} lessonsLearnedShared
 * @property {YesNoNA} actionsFromIncidentsTracked
 * @property {string} observations
 */

/**
 * Sign-off & Action Plan (section 10).
 * @typedef {Object} ActionPlanItem
 * @property {string} description
 * @property {string} owner
 * @property {string} dueDate
 * @property {'critical' | 'major' | 'minor' | ''} priority
 *
 * @typedef {Object} SignoffActionPlan
 * @property {ActionPlanItem[]} actionItems
 * @property {string} overallSummary
 * @property {string} auditorSignature
 * @property {string} signoffDate
 * @property {YesNoNA} debriefDelivered
 */

/**
 * @typedef {Object} AssessmentData
 * @property {SiteDetails} siteDetails
 * @property {PPEHazardControls} ppeHazardControls
 * @property {ChemicalBiologicalHazards} chemicalBiologicalHazards
 * @property {ElectricalSafety} electricalSafety
 * @property {FireSafety} fireSafety
 * @property {ErgonomicsManualHandling} ergonomicsManualHandling
 * @property {EmergencyProcedures} emergencyProcedures
 * @property {TrainingCompetence} trainingCompetence
 * @property {IncidentReporting} incidentReporting
 * @property {SignoffActionPlan} signoffActionPlan
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {SeverityGrade} grade
 */

/**
 * @typedef {Object} CategoryFindings
 * @property {string} category
 * @property {number} compliant
 * @property {number} minor
 * @property {number} major
 * @property {number} critical
 * @property {number} total
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {FlagPriority} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {Outcome} outcome
 * @property {Object<string, CategoryFindings>} findingsByCategory
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number} answeredCount
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.WorkplaceSafetyAssessment`.
(function () {
'use strict';
window.WorkplaceSafetyAssessment = window.WorkplaceSafetyAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    siteDetails: {
      auditorName: '',
      auditorRole: '',
      auditDate: '',
      siteName: '',
      siteAddress: '',
      departmentArea: '',
      siteManager: '',
      previousAuditDate: '',
      previousFindingsClosed: ''
    },
    ppeHazardControls: {
      ppeAvailable: '',
      ppeCorrectlyUsed: '',
      ppeStockMaintained: '',
      hazardSignageVisible: '',
      signageLegible: '',
      housekeepingSatisfactory: '',
      slipTripHazardsControlled: '',
      observations: ''
    },
    chemicalBiologicalHazards: {
      coshhRegisterPresent: '',
      sdsAvailable: '',
      chemicalsLabelledCorrectly: '',
      chemicalsStoredSecurely: '',
      spillKitsAvailable: '',
      untreatedSpillsObserved: '',
      sharpsContainersInDate: '',
      clinicalWasteSegregated: '',
      biologicalRiskAssessmentCurrent: '',
      observations: ''
    },
    electricalSafety: {
      patTestingInDate: '',
      fixedWiringTestInDate: '',
      damagedEquipmentObserved: '',
      overloadedSocketsObserved: '',
      extensionLeadsManagedSafely: '',
      consumerUnitAccessible: '',
      observations: ''
    },
    fireSafety: {
      fireRiskAssessmentCurrent: '',
      fireExtinguishersServiced: '',
      fireExtinguishersAccessible: '',
      fireAlarmTestedWeekly: '',
      emergencyEgressClear: '',
      emergencyLightingFunctional: '',
      fireDoorsHeldOpenIllegally: '',
      assemblyPointSignposted: '',
      observations: ''
    },
    ergonomicsManualHandling: {
      manualHandlingAssessmentCurrent: '',
      liftingAidsAvailable: '',
      dseAssessmentsCompleted: '',
      workstationsAdjustable: '',
      repetitiveStrainConcerns: '',
      patientHandlingPlansInPlace: '',
      observations: ''
    },
    emergencyProcedures: {
      evacuationProcedurePosted: '',
      firstAidKitsStocked: '',
      firstAiderRosterCurrent: '',
      aedAvailable: '',
      aedServiceInDate: '',
      emergencyContactsDisplayed: '',
      drillConductedLast12Months: '',
      observations: ''
    },
    trainingCompetence: {
      mandatoryTrainingUpToDate: '',
      fireMarshalsTrained: '',
      manualHandlingTrainingCurrent: '',
      infectionControlTrainingCurrent: '',
      trainingRecordsAccessible: '',
      inductionForNewStartersCompleted: '',
      observations: ''
    },
    incidentReporting: {
      incidentReportingSystemUsed: '',
      riddorReportableIncidentsReported: '',
      nearMissReportingActive: '',
      incidentsLast12Months: null,
      nearMissesLast12Months: null,
      lessonsLearnedShared: '',
      actionsFromIncidentsTracked: '',
      observations: ''
    },
    signoffActionPlan: {
      actionItems: [],
      overallSummary: '',
      auditorSignature: '',
      signoffDate: '',
      debriefDelivered: ''
    }
  };
}

/**
 * Friendly label for an outcome.
 * @param {Outcome} outcome
 */
function outcomeLabel(outcome) {
  switch (outcome) {
    case 'compliant': return 'Compliant';
    case 'minor': return 'Minor Findings';
    case 'major': return 'Major Findings';
    case 'critical': return 'Critical Findings';
    default: return '';
  }
}

/**
 * CSS class for outcome badge.
 * @param {Outcome} outcome
 */
function outcomeClass(outcome) {
  switch (outcome) {
    case 'compliant': return 'outcome-compliant';
    case 'minor': return 'outcome-minor';
    case 'major': return 'outcome-major';
    case 'critical': return 'outcome-critical';
    default: return '';
  }
}

/**
 * Map a severity grade (1-4) to the equivalent finding-level slug.
 * Grade 1 = compliant; 2 = minor; 3 = major; 4 = critical.
 * @param {SeverityGrade} grade
 * @returns {Outcome}
 */
function gradeToFindingLevel(grade) {
  if (grade >= 4) return 'critical';
  if (grade === 3) return 'major';
  if (grade === 2) return 'minor';
  return 'compliant';
}

/**
 * Friendly label for a severity grade.
 * @param {SeverityGrade} grade
 */
function gradeLabel(grade) {
  switch (grade) {
    case 1: return 'Compliant';
    case 2: return 'Minor';
    case 3: return 'Major';
    case 4: return 'Critical';
    default: return '';
  }
}

/**
 * CSS class for finding-level badge (matches outcome classes).
 * @param {Outcome} level
 */
function findingLevelClass(level) {
  return outcomeClass(level);
}

/**
 * Recommended timeframe text per outcome.
 * @param {Outcome} outcome
 */
function actionTimeframe(outcome) {
  switch (outcome) {
    case 'critical': return 'Immediate corrective action required';
    case 'major': return 'Action within 30 days';
    case 'minor': return 'Action within 90 days';
    case 'compliant': return 'No action required';
    default: return '';
  }
}

Object.assign(window.WorkplaceSafetyAssessment, {
  emptyAssessment,
  outcomeLabel,
  outcomeClass,
  gradeToFindingLevel,
  gradeLabel,
  findingLevelClass,
  actionTimeframe
});
})();
