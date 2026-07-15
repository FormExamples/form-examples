// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Hematology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'critical' | 'severeAbnormality' | 'moderateAbnormality' |
 *           'mildAbnormality' | 'normal' | 'draft'} AbnormalityLevel
 */

/**
 * @typedef {Object} PatientInformation
 * @property {string} patientName
 * @property {string} dateOfBirth
 * @property {string} medicalRecordNumber
 * @property {string} referringPhysician
 * @property {string} clinicalIndication
 * @property {string} specimenDate
 * @property {string} specimenType
 */

/**
 * @typedef {Object} BloodCountAnalysis
 * @property {number | null} hemoglobin
 * @property {number | null} hematocrit
 * @property {number | null} redBloodCellCount
 * @property {number | null} whiteBloodCellCount
 * @property {number | null} plateletCount
 * @property {number | null} meanCorpuscularVolume
 * @property {number | null} meanCorpuscularHemoglobin
 * @property {number | null} redCellDistributionWidth
 */

/**
 * @typedef {Object} CoagulationStudies
 * @property {number | null} prothrombinTime
 * @property {number | null} inr
 * @property {number | null} activatedPartialThromboplastinTime
 * @property {number | null} fibrinogen
 * @property {number | null} dDimer
 * @property {number | null} bleedingTime
 */

/**
 * @typedef {Object} PeripheralBloodFilm
 * @property {string} redCellMorphology
 * @property {string} whiteBloodCellDifferential
 * @property {string} plateletMorphology
 * @property {string} abnormalCellMorphology
 * @property {number | null} filmQuality
 * @property {string} filmComments
 */

/**
 * @typedef {Object} IronStudies
 * @property {number | null} serumIron
 * @property {number | null} totalIronBindingCapacity
 * @property {number | null} transferrinSaturation
 * @property {number | null} serumFerritin
 * @property {number | null} reticulocyteCount
 */

/**
 * @typedef {Object} HemoglobinopathyScreening
 * @property {string} hemoglobinElectrophoresis
 * @property {string} sickleCellScreen
 * @property {string} thalassemiaScreen
 * @property {string} hplcResults
 * @property {string} geneticTestingNotes
 */

/**
 * @typedef {Object} BoneMarrowAssessment
 * @property {string} aspirateFindings
 * @property {string} biopsyFindings
 * @property {number | null} cellularity
 * @property {string} cytogeneticsResults
 * @property {string} flowCytometryResults
 * @property {string} boneMarrowComments
 */

/**
 * @typedef {Object} TransfusionHistory
 * @property {string} previousTransfusions
 * @property {string} transfusionReactions
 * @property {string} bloodGroupType
 * @property {string} antibodyScreen
 * @property {string} crossmatchResults
 */

/**
 * @typedef {Object} TreatmentMedications
 * @property {string} currentMedications
 * @property {string} chemotherapyRegimen
 * @property {string} anticoagulantTherapy
 * @property {string} ironTherapy
 * @property {string} treatmentResponse
 * @property {string} adverseEffects
 */

/**
 * @typedef {Object} ClinicalReview
 * @property {string} clinicalSummary
 * @property {string} diagnosis
 * @property {string} followUpPlan
 * @property {number | null} urgencyLevel
 * @property {string} reviewerName
 * @property {string} reviewDate
 * @property {string} additionalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientInformation} patientInformation
 * @property {BloodCountAnalysis} bloodCountAnalysis
 * @property {CoagulationStudies} coagulationStudies
 * @property {PeripheralBloodFilm} peripheralBloodFilm
 * @property {IronStudies} ironStudies
 * @property {HemoglobinopathyScreening} hemoglobinopathyScreening
 * @property {BoneMarrowAssessment} boneMarrowAssessment
 * @property {TransfusionHistory} transfusionHistory
 * @property {TreatmentMedications} treatmentMedications
 * @property {ClinicalReview} clinicalReview
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {string} concernLevel
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {AbnormalityLevel} abnormalityLevel
 * @property {number} abnormalityScore
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    patientInformation: {
      patientName: '',
      dateOfBirth: '',
      medicalRecordNumber: '',
      referringPhysician: '',
      clinicalIndication: '',
      specimenDate: '',
      specimenType: ''
    },
    bloodCountAnalysis: {
      hemoglobin: null,
      hematocrit: null,
      redBloodCellCount: null,
      whiteBloodCellCount: null,
      plateletCount: null,
      meanCorpuscularVolume: null,
      meanCorpuscularHemoglobin: null,
      redCellDistributionWidth: null
    },
    coagulationStudies: {
      prothrombinTime: null,
      inr: null,
      activatedPartialThromboplastinTime: null,
      fibrinogen: null,
      dDimer: null,
      bleedingTime: null
    },
    peripheralBloodFilm: {
      redCellMorphology: '',
      whiteBloodCellDifferential: '',
      plateletMorphology: '',
      abnormalCellMorphology: '',
      filmQuality: null,
      filmComments: ''
    },
    ironStudies: {
      serumIron: null,
      totalIronBindingCapacity: null,
      transferrinSaturation: null,
      serumFerritin: null,
      reticulocyteCount: null
    },
    hemoglobinopathyScreening: {
      hemoglobinElectrophoresis: '',
      sickleCellScreen: '',
      thalassemiaScreen: '',
      hplcResults: '',
      geneticTestingNotes: ''
    },
    boneMarrowAssessment: {
      aspirateFindings: '',
      biopsyFindings: '',
      cellularity: null,
      cytogeneticsResults: '',
      flowCytometryResults: '',
      boneMarrowComments: ''
    },
    transfusionHistory: {
      previousTransfusions: '',
      transfusionReactions: '',
      bloodGroupType: '',
      antibodyScreen: '',
      crossmatchResults: ''
    },
    treatmentMedications: {
      currentMedications: '',
      chemotherapyRegimen: '',
      anticoagulantTherapy: '',
      ironTherapy: '',
      treatmentResponse: '',
      adverseEffects: ''
    },
    clinicalReview: {
      clinicalSummary: '',
      diagnosis: '',
      followUpPlan: '',
      urgencyLevel: null,
      reviewerName: '',
      reviewDate: '',
      additionalNotes: ''
    }
  };
}

/**
 * Collect all numeric lab values from the assessment data as (number | null)[].
 * Order mirrors the SvelteKit reference engine.
 * @param {AssessmentData} data
 * @returns {(number | null)[]}
 */
function collectNumericItems(data) {
  return [
    // Blood Count Analysis (8 items)
    data.bloodCountAnalysis.hemoglobin,
    data.bloodCountAnalysis.hematocrit,
    data.bloodCountAnalysis.redBloodCellCount,
    data.bloodCountAnalysis.whiteBloodCellCount,
    data.bloodCountAnalysis.plateletCount,
    data.bloodCountAnalysis.meanCorpuscularVolume,
    data.bloodCountAnalysis.meanCorpuscularHemoglobin,
    data.bloodCountAnalysis.redCellDistributionWidth,
    // Coagulation Studies (6 items)
    data.coagulationStudies.prothrombinTime,
    data.coagulationStudies.inr,
    data.coagulationStudies.activatedPartialThromboplastinTime,
    data.coagulationStudies.fibrinogen,
    data.coagulationStudies.dDimer,
    data.coagulationStudies.bleedingTime,
    // Iron Studies (5 items)
    data.ironStudies.serumIron,
    data.ironStudies.totalIronBindingCapacity,
    data.ironStudies.transferrinSaturation,
    data.ironStudies.serumFerritin,
    data.ironStudies.reticulocyteCount
  ];
}

/**
 * Compute the deviation of a value from its reference range, scaled 0..1.
 * Returns null if the value is null.
 * @param {number | null} value
 * @param {number} low
 * @param {number} high
 * @param {number} severeLow
 * @param {number} severeHigh
 * @returns {number | null}
 */
function deviation(value, low, high, severeLow, severeHigh) {
  if (value === null || value === undefined) return null;
  if (value >= low && value <= high) return 0.0;
  if (value < low) {
    const dist = (low - value) / Math.max(low - severeLow, 0.01);
    return Math.min(dist, 1.0);
  }
  const dist = (value - high) / Math.max(severeHigh - high, 0.01);
  return Math.min(dist, 1.0);
}

/**
 * Calculate a composite abnormality score (0-100) from lab values.
 *
 * The score is based on how far each lab value deviates from its normal range.
 * 0 = all values normal, 100 = maximally abnormal.
 *
 * Returns null if no scored numeric items are answered.
 * @param {AssessmentData} data
 * @returns {number | null}
 */
function calculateAbnormalityScore(data) {
  const deviations = [];

  // Hemoglobin: normal 12-17 g/dL, severe <6 or >22
  let v = deviation(data.bloodCountAnalysis.hemoglobin, 12.0, 17.0, 6.0, 22.0);
  if (v !== null) deviations.push(v);

  // Hematocrit: normal 36-52%, severe <20 or >65
  v = deviation(data.bloodCountAnalysis.hematocrit, 36.0, 52.0, 20.0, 65.0);
  if (v !== null) deviations.push(v);

  // RBC: normal 4.0-6.0, severe <2.0 or >8.0
  v = deviation(data.bloodCountAnalysis.redBloodCellCount, 4.0, 6.0, 2.0, 8.0);
  if (v !== null) deviations.push(v);

  // WBC: normal 4.0-11.0, severe <1.0 or >30.0
  v = deviation(data.bloodCountAnalysis.whiteBloodCellCount, 4.0, 11.0, 1.0, 30.0);
  if (v !== null) deviations.push(v);

  // Platelets: normal 150-400, severe <20 or >1000
  v = deviation(data.bloodCountAnalysis.plateletCount, 150.0, 400.0, 20.0, 1000.0);
  if (v !== null) deviations.push(v);

  // MCV: normal 80-100, severe <50 or >130
  v = deviation(data.bloodCountAnalysis.meanCorpuscularVolume, 80.0, 100.0, 50.0, 130.0);
  if (v !== null) deviations.push(v);

  // MCH: normal 27-33, severe <15 or >45
  v = deviation(data.bloodCountAnalysis.meanCorpuscularHemoglobin, 27.0, 33.0, 15.0, 45.0);
  if (v !== null) deviations.push(v);

  // RDW: normal 11.5-14.5%, severe <8 or >25
  v = deviation(data.bloodCountAnalysis.redCellDistributionWidth, 11.5, 14.5, 8.0, 25.0);
  if (v !== null) deviations.push(v);

  // PT: normal 11-13.5 seconds, severe <8 or >30
  v = deviation(data.coagulationStudies.prothrombinTime, 11.0, 13.5, 8.0, 30.0);
  if (v !== null) deviations.push(v);

  // INR: normal 0.8-1.2, severe <0.5 or >5.0
  v = deviation(data.coagulationStudies.inr, 0.8, 1.2, 0.5, 5.0);
  if (v !== null) deviations.push(v);

  // aPTT: normal 25-35 seconds, severe <15 or >80
  v = deviation(data.coagulationStudies.activatedPartialThromboplastinTime, 25.0, 35.0, 15.0, 80.0);
  if (v !== null) deviations.push(v);

  // Fibrinogen: normal 200-400 mg/dL, severe <50 or >800
  v = deviation(data.coagulationStudies.fibrinogen, 200.0, 400.0, 50.0, 800.0);
  if (v !== null) deviations.push(v);

  // D-dimer: normal 0-0.5 mg/L, severe >5.0
  v = deviation(data.coagulationStudies.dDimer, 0.0, 0.5, 0.0, 5.0);
  if (v !== null) deviations.push(v);

  // Serum iron: normal 60-170 mcg/dL, severe <10 or >300
  v = deviation(data.ironStudies.serumIron, 60.0, 170.0, 10.0, 300.0);
  if (v !== null) deviations.push(v);

  // TIBC: normal 250-370 mcg/dL, severe <100 or >600
  v = deviation(data.ironStudies.totalIronBindingCapacity, 250.0, 370.0, 100.0, 600.0);
  if (v !== null) deviations.push(v);

  // Transferrin saturation: normal 20-50%, severe <5 or >90
  v = deviation(data.ironStudies.transferrinSaturation, 20.0, 50.0, 5.0, 90.0);
  if (v !== null) deviations.push(v);

  // Ferritin: normal 20-250 ng/mL, severe <5 or >1000
  v = deviation(data.ironStudies.serumFerritin, 20.0, 250.0, 5.0, 1000.0);
  if (v !== null) deviations.push(v);

  // Reticulocyte count: normal 0.5-2.5%, severe <0.1 or >10
  v = deviation(data.ironStudies.reticulocyteCount, 0.5, 2.5, 0.1, 10.0);
  if (v !== null) deviations.push(v);

  if (deviations.length === 0) return null;

  const sum = deviations.reduce((a, b) => a + b, 0);
  const avg = sum / deviations.length;
  const score = Math.round(avg * 100);
  return Math.min(score, 100);
}

/**
 * Calculate the blood count dimension score (0-100).
 * @param {AssessmentData} data
 * @returns {number | null}
 */
function bloodCountScore(data) {
  const items = collectNumericItems(data);
  const answered = items.slice(0, 8).filter((x) => x !== null);
  if (answered.length === 0) return null;
  const empty = emptyAssessment();
  empty.bloodCountAnalysis = Object.assign({}, data.bloodCountAnalysis);
  return calculateAbnormalityScore(empty);
}

/**
 * Calculate the coagulation dimension score (0-100).
 * @param {AssessmentData} data
 * @returns {number | null}
 */
function coagulationScore(data) {
  const items = collectNumericItems(data);
  const answered = items.slice(8, 14).filter((x) => x !== null);
  if (answered.length === 0) return null;
  const empty = emptyAssessment();
  empty.coagulationStudies = Object.assign({}, data.coagulationStudies);
  return calculateAbnormalityScore(empty);
}

/**
 * Calculate the iron-studies dimension score (0-100).
 * @param {AssessmentData} data
 * @returns {number | null}
 */
function ironStudiesScore(data) {
  const items = collectNumericItems(data);
  const answered = items.slice(14, 19).filter((x) => x !== null);
  if (answered.length === 0) return null;
  const empty = emptyAssessment();
  empty.ironStudies = Object.assign({}, data.ironStudies);
  return calculateAbnormalityScore(empty);
}

/**
 * Friendly label for an abnormality level.
 * @param {AbnormalityLevel} level
 */
function abnormalityLevelLabel(level) {
  switch (level) {
    case 'critical': return 'Critical';
    case 'severeAbnormality': return 'Severe Abnormality';
    case 'moderateAbnormality': return 'Moderate Abnormality';
    case 'mildAbnormality': return 'Mild Abnormality';
    case 'normal': return 'Normal';
    case 'draft': return 'Draft';
    default: return 'Unknown';
  }
}

/**
 * CSS class hint for the abnormality-level badge.
 * @param {AbnormalityLevel} level
 */
function abnormalityLevelClass(level) {
  switch (level) {
    case 'critical': return 'level-critical';
    case 'severeAbnormality': return 'level-severe';
    case 'moderateAbnormality': return 'level-moderate';
    case 'mildAbnormality': return 'level-mild';
    case 'normal': return 'level-normal';
    case 'draft': return 'level-draft';
    default: return 'level-draft';
  }
}

export { emptyAssessment, collectNumericItems, calculateAbnormalityScore, bloodCountScore, coagulationScore, ironStudiesScore, abnormalityLevelLabel, abnormalityLevelClass };
