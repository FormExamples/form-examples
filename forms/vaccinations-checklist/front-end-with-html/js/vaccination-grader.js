import { detectAdditionalFlags } from './flagged-issues.js';
import { vaccinationRules } from './vaccination-rules.js';

// Vaccinations Checklist grader. Pure functions: take an `AssessmentData`
// object, evaluate the vaccination rules, derive completeness signals for
// childhood / occupational / COVID / flu schedules, and classify overall
// compliance + risk.
//
// Public API:
//   gradeChecklist(data) -> { status, missingVaccinations, firedRules }
//     where status is 'compliant' | 'partial' | 'non-compliant'.
//     This is the contract used by the HTML wizard.
//
//   calculateVaccinationGrade(data) -> full GradingResult
//     (mirrors the SvelteKit reference engine; includes complianceStatus,
//     overallRisk, childhoodComplete, occupationalComplete, covidComplete,
//     fluCurrent, firedRules, additionalFlags, missingVaccinations,
//     timestamp).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ComplianceStatus} ComplianceStatus
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.VaccinationsChecklist.

/**
 * Determine whether childhood immunisation schedule is complete.
 * @param {AssessmentData} data
 * @returns {boolean}
 */
function deriveChildhoodComplete(data) {
  const c = data.childhoodImmunisations;
  return (
    c.mmrDose1 === 'yes' &&
    c.mmrDose2 === 'yes' &&
    c.dtpPrimaryCourse === 'yes' &&
    c.dtpBooster === 'yes' &&
    c.polioPrimaryCourse === 'yes' &&
    c.polioBooster === 'yes'
  );
}

/**
 * Determine whether occupational vaccine requirements are met.
 * Only applicable to healthcare workers.
 * @param {AssessmentData} data
 * @returns {boolean}
 */
function deriveOccupationalComplete(data) {
  const isHealthcare = data.demographics.occupationCategory === 'healthcare';
  if (!isHealthcare) return true;
  const o = data.occupationalVaccines;
  return (
    o.hepatitisBCourse === 'yes' &&
    o.hepatitisBAntiBodyLevel !== 'inadequate' &&
    (o.varicellaVaccine === 'yes' || o.varicellaHistory === 'yes')
  );
}

/**
 * Build a list of human-readable missing-vaccination labels.
 * @param {AssessmentData} data
 * @returns {string[]}
 */
function deriveMissingVaccinations(data) {
  /** @type {string[]} */
  const missing = [];
  const c = data.childhoodImmunisations;
  if (c.mmrDose1 !== 'yes') missing.push('MMR dose 1');
  if (c.mmrDose2 !== 'yes') missing.push('MMR dose 2');
  if (c.dtpPrimaryCourse !== 'yes') missing.push('DTP primary course');
  if (c.dtpBooster !== 'yes') missing.push('DTP booster');
  if (c.polioPrimaryCourse !== 'yes') missing.push('Polio primary course');
  if (c.polioBooster !== 'yes') missing.push('Polio booster');

  if (data.demographics.occupationCategory === 'healthcare') {
    const o = data.occupationalVaccines;
    if (o.hepatitisBCourse !== 'yes') missing.push('Hepatitis B course');
    if (o.hepatitisBAntiBodyLevel === 'inadequate') {
      missing.push('Hepatitis B booster (antibody inadequate)');
    }
    if (o.varicellaVaccine !== 'yes' && o.varicellaHistory !== 'yes') {
      missing.push('Varicella vaccination / history');
    }
  }

  if (data.covid19Vaccination.covidPrimaryCourse !== 'yes') {
    missing.push('COVID-19 primary course');
  }
  if (data.influenzaVaccination.fluVaccineCurrentSeason !== 'yes') {
    missing.push('Current-season influenza vaccine');
  }
  if (
    data.travelVaccines.travelPlanned === 'yes' &&
    data.travelVaccines.yellowFeverVaccine === 'no'
  ) {
    missing.push('Yellow fever vaccine (for planned travel)');
  }
  return missing;
}

/**
 * Derive overall compliance status from data + fired rules.
 * @param {AssessmentData} data
 * @param {FiredRule[]} firedRules
 * @param {boolean} childhoodComplete
 * @param {boolean} occupationalComplete
 * @param {boolean} covidComplete
 * @returns {ComplianceStatus}
 */
function deriveComplianceStatus(
  data,
  firedRules,
  childhoodComplete,
  occupationalComplete,
  covidComplete
) {
  if (
    data.contraindicationsAllergies.liveVaccineContraindicated === 'yes' ||
    (data.vaccinationHistory.immunocompromised === 'yes' &&
      data.vaccinationHistory.adverseReactionSeverity === 'anaphylaxis')
  ) {
    return 'contraindicated';
  }

  const hasCriticalRule = firedRules.some((r) => r.grade >= 4);
  if (hasCriticalRule) return 'non-compliant';

  const hasSignificantRule = firedRules.some((r) => r.grade >= 3);
  if (hasSignificantRule || !childhoodComplete || !occupationalComplete) {
    return 'partially-immunised';
  }

  if (firedRules.some((r) => r.grade >= 2)) return 'partially-immunised';

  if (childhoodComplete && occupationalComplete && covidComplete) return 'fully-immunised';

  return 'partially-immunised';
}

/**
 * Derive overall risk level.
 * @param {FiredRule[]} firedRules
 * @param {ComplianceStatus} complianceStatus
 * @param {AssessmentData} data
 * @returns {RiskLevel}
 */
function deriveOverallRisk(firedRules, complianceStatus, data) {
  const maxGrade =
    firedRules.length > 0 ? Math.max(...firedRules.map((r) => r.grade)) : 0;

  if (maxGrade >= 4 || data.scheduleCompliance.activeExposureIncident === 'yes') {
    return 'critical';
  }

  if (
    maxGrade >= 3 ||
    (complianceStatus === 'non-compliant' &&
      data.demographics.occupationCategory === 'healthcare')
  ) {
    return 'high';
  }

  if (maxGrade >= 2 || complianceStatus === 'partially-immunised') return 'moderate';

  return 'low';
}

/**
 * Map the four-way compliance status onto the simpler three-way wizard
 * status used in the HTML report header.
 * @param {ComplianceStatus} status
 * @returns {'compliant' | 'partial' | 'non-compliant'}
 */
function simplifyStatus(status) {
  switch (status) {
    case 'fully-immunised':     return 'compliant';
    case 'partially-immunised': return 'partial';
    case 'non-compliant':       return 'non-compliant';
    case 'contraindicated':     return 'non-compliant';
    default:                    return 'partial';
  }
}

/**
 * Run all vaccination rules against the assessment data and produce a full
 * GradingResult. Pure: no side effects, no I/O.
 *
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function calculateVaccinationGrade(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of vaccinationRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      console.warn(`Vaccination rule ${rule.id} evaluation failed:`, e);
    }
  }

  const childhoodComplete = deriveChildhoodComplete(data);
  const occupationalComplete = deriveOccupationalComplete(data);
  const covidComplete = data.covid19Vaccination.covidPrimaryCourse === 'yes';
  const fluCurrent = data.influenzaVaccination.fluVaccineCurrentSeason === 'yes';

  const complianceStatus = deriveComplianceStatus(
    data,
    firedRules,
    childhoodComplete,
    occupationalComplete,
    covidComplete
  );
  const overallRisk = deriveOverallRisk(firedRules, complianceStatus, data);

  const additionalFlags =
    typeof detectAdditionalFlags === 'function'
      ? detectAdditionalFlags(data)
      : [];

  const missingVaccinations = deriveMissingVaccinations(data);

  return {
    complianceStatus,
    overallRisk,
    childhoodComplete,
    occupationalComplete,
    covidComplete,
    fluCurrent,
    firedRules,
    additionalFlags,
    missingVaccinations,
    timestamp: new Date().toISOString()
  };
}

/**
 * Lightweight wizard contract: returns the simplified three-way status,
 * the missing-vaccination labels, and the fired rules list.
 *
 * @param {AssessmentData} data
 * @returns {{ status: 'compliant' | 'partial' | 'non-compliant',
 *            missingVaccinations: string[], firedRules: FiredRule[] }}
 */
function gradeChecklist(data) {
  const full = calculateVaccinationGrade(data);
  return {
    status: simplifyStatus(full.complianceStatus),
    missingVaccinations: full.missingVaccinations,
    firedRules: full.firedRules
  };
}

export { deriveChildhoodComplete, deriveOccupationalComplete, deriveMissingVaccinations, deriveComplianceStatus, deriveOverallRisk, simplifyStatus, calculateVaccinationGrade, gradeChecklist };
