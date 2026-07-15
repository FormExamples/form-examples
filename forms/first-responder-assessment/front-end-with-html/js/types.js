// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the First Responder Assessment.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'not-competent' | 'developing' | 'competent' | 'expert' | ''} CompetencyLevel
 * @typedef {'fit-for-duty' | 'fit-with-restrictions' | 'temporarily-unfit' | 'permanently-unfit' | ''} FitnessDecision
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} RiskLevel
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} weight
 * @property {number | null} height
 * @property {number | null} bmi
 */

/**
 * @typedef {Object} RoleQualifications
 * @property {'paramedic' | 'emt' | 'first-aider' | 'advanced-paramedic' | 'community-responder' | 'other' | ''} roleType
 * @property {string} roleTypeOther
 * @property {string} employerOrganisation
 * @property {string} stationBase
 * @property {number | null} yearsOfService
 * @property {string} registrationNumber
 * @property {'hcpc' | 'jrcalc' | 'other' | ''} registrationBody
 * @property {string} registrationExpiryDate
 * @property {'certificate' | 'diploma' | 'foundation-degree' | 'bachelors' | 'masters' | 'doctorate' | 'other' | ''} highestQualification
 * @property {string} qualificationDetails
 * @property {'c1' | 'c1e' | 'c' | 'ce' | 'b' | 'none' | ''} drivingLicenceCategory
 * @property {YesNo} blueLightTrained
 */

/**
 * @typedef {Object} PhysicalFitness
 * @property {CompetencyLevel} cardiovascularFitness
 * @property {number | null} shuttleRunLevel
 * @property {number | null} vo2Max
 * @property {CompetencyLevel} muscularStrength
 * @property {number | null} gripStrengthKg
 * @property {CompetencyLevel} manualHandlingCompetency
 * @property {YesNo} patientCarryAbility
 * @property {CompetencyLevel} flexibilityMobility
 * @property {CompetencyLevel} balanceCoordination
 * @property {number | null} restingHeartRateBpm
 * @property {number | null} bloodPressureSystolic
 * @property {number | null} bloodPressureDiastolic
 * @property {string} physicalFitnessNotes
 */

/**
 * @typedef {Object} ClinicalSkills
 * @property {CompetencyLevel} basicLifeSupport
 * @property {CompetencyLevel} advancedLifeSupport
 * @property {CompetencyLevel} airwayManagement
 * @property {CompetencyLevel} ivCannulation
 * @property {CompetencyLevel} drugAdministration
 * @property {CompetencyLevel} traumaAssessment
 * @property {CompetencyLevel} immobilisationSplinting
 * @property {CompetencyLevel} ecgInterpretation
 * @property {CompetencyLevel} patientAssessment
 * @property {CompetencyLevel} triageCompetency
 * @property {CompetencyLevel} paediatricCompetency
 * @property {CompetencyLevel} obstetricCompetency
 * @property {string} clinicalSkillsNotes
 */

/**
 * @typedef {Object} EquipmentVehicle
 * @property {CompetencyLevel} defibrillatorCompetency
 * @property {CompetencyLevel} monitorCompetency
 * @property {CompetencyLevel} ventilatorCompetency
 * @property {CompetencyLevel} suctionCompetency
 * @property {CompetencyLevel} stretcherCompetency
 * @property {CompetencyLevel} scoopCompetency
 * @property {CompetencyLevel} ambulanceDriving
 * @property {CompetencyLevel} emergencyDriving
 * @property {YesNo} vehicleDailyInspection
 * @property {CompetencyLevel} equipmentCheckCompetency
 * @property {CompetencyLevel} radioCommunications
 * @property {string} equipmentVehicleNotes
 */

/**
 * @typedef {Object} CommunicationSkills
 * @property {CompetencyLevel} patientCommunication
 * @property {CompetencyLevel} relativeCommunication
 * @property {CompetencyLevel} handoverCompetency
 * @property {CompetencyLevel} documentationCompetency
 * @property {CompetencyLevel} multidisciplinaryTeamwork
 * @property {CompetencyLevel} conflictResolution
 * @property {CompetencyLevel} safeguardingAwareness
 * @property {CompetencyLevel} breakingBadNews
 * @property {string} communicationNotes
 */

/**
 * @typedef {Object} PsychologicalReadiness
 * @property {CompetencyLevel} stressManagement
 * @property {'low' | 'moderate' | 'good' | 'excellent' | ''} resilienceLevel
 * @property {YesNo} ptsdScreening
 * @property {'negative' | 'positive' | 'inconclusive' | ''} ptsdScreeningResult
 * @property {YesNo} criticalIncidentExposure
 * @property {string} criticalIncidentDetails
 * @property {YesNo} criticalIncidentDebriefed
 * @property {'good' | 'fair' | 'poor' | ''} sleepQuality
 * @property {'low' | 'moderate' | 'high' | ''} burnoutRisk
 * @property {CompetencyLevel} decisionMakingUnderPressure
 * @property {CompetencyLevel} emotionalRegulation
 * @property {string} psychologicalNotes
 */

/**
 * @typedef {Object} OccupationalHealth
 * @property {'pass' | 'fail' | 'refer' | ''} visionTest
 * @property {YesNo} visionCorrected
 * @property {'pass' | 'fail' | 'refer' | ''} hearingTest
 * @property {YesNo} hearingAidRequired
 * @property {'up-to-date' | 'incomplete' | 'unknown' | ''} immunisationStatus
 * @property {YesNo} hepatitisBImmune
 * @property {string} currentMedications
 * @property {'negative' | 'positive' | 'not-done' | ''} substanceMisuseScreen
 * @property {YesNo} musculoskeletalIssues
 * @property {string} musculoskeletalDetails
 * @property {YesNo} respiratoryIssues
 * @property {string} respiratoryDetails
 * @property {YesNo} skinConditions
 * @property {string} skinConditionDetails
 * @property {number | null} sicknessAbsenceDays
 * @property {string} occupationalHealthNotes
 */

/**
 * @typedef {Object} CpdTraining
 * @property {number | null} cpdHoursLastYear
 * @property {number | null} cpdHoursRequired
 * @property {YesNo} mandatoryTrainingComplete
 * @property {string} blsRecertificationDate
 * @property {string} alsRecertificationDate
 * @property {string} manualHandlingRecertificationDate
 * @property {string} safeguardingTrainingDate
 * @property {string} infectionControlTrainingDate
 * @property {YesNo} majorIncidentTraining
 * @property {string} majorIncidentTrainingDate
 * @property {CompetencyLevel} mentoringCapability
 * @property {YesNo} clinicalSupervisionAttendance
 * @property {CompetencyLevel} reflectivePractice
 * @property {string} cpdTrainingNotes
 */

/**
 * @typedef {Object} FitnessDecisionData
 * @property {FitnessDecision} overallFitness
 * @property {string} restrictionsDetails
 * @property {YesNo} reassessmentRequired
 * @property {string} reassessmentDate
 * @property {string} remedialActions
 * @property {string} referralsRequired
 * @property {string} assessorName
 * @property {string} assessorRole
 * @property {string} assessorRegistration
 * @property {string} assessmentDate
 * @property {string} countersignatureName
 * @property {string} countersignatureDate
 * @property {string} fitnessDecisionNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {RoleQualifications} roleQualifications
 * @property {PhysicalFitness} physicalFitness
 * @property {ClinicalSkills} clinicalSkills
 * @property {EquipmentVehicle} equipmentVehicle
 * @property {CommunicationSkills} communicationSkills
 * @property {PsychologicalReadiness} psychologicalReadiness
 * @property {OccupationalHealth} occupationalHealth
 * @property {CpdTraining} cpdTraining
 * @property {FitnessDecisionData} fitnessDecision
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} domain
 * @property {string} description
 * @property {number} grade
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {CompetencyLevel} overallCompetency
 * @property {FitnessDecision} overallFitness
 * @property {RiskLevel} overallRisk
 * @property {{ physicalFitness: CompetencyLevel, clinicalSkills: CompetencyLevel, equipmentVehicle: CompetencyLevel, communication: CompetencyLevel, psychological: CompetencyLevel }} domainLevels
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
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      weight: null,
      height: null,
      bmi: null
    },
    roleQualifications: {
      roleType: '',
      roleTypeOther: '',
      employerOrganisation: '',
      stationBase: '',
      yearsOfService: null,
      registrationNumber: '',
      registrationBody: '',
      registrationExpiryDate: '',
      highestQualification: '',
      qualificationDetails: '',
      drivingLicenceCategory: '',
      blueLightTrained: ''
    },
    physicalFitness: {
      cardiovascularFitness: '',
      shuttleRunLevel: null,
      vo2Max: null,
      muscularStrength: '',
      gripStrengthKg: null,
      manualHandlingCompetency: '',
      patientCarryAbility: '',
      flexibilityMobility: '',
      balanceCoordination: '',
      restingHeartRateBpm: null,
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      physicalFitnessNotes: ''
    },
    clinicalSkills: {
      basicLifeSupport: '',
      advancedLifeSupport: '',
      airwayManagement: '',
      ivCannulation: '',
      drugAdministration: '',
      traumaAssessment: '',
      immobilisationSplinting: '',
      ecgInterpretation: '',
      patientAssessment: '',
      triageCompetency: '',
      paediatricCompetency: '',
      obstetricCompetency: '',
      clinicalSkillsNotes: ''
    },
    equipmentVehicle: {
      defibrillatorCompetency: '',
      monitorCompetency: '',
      ventilatorCompetency: '',
      suctionCompetency: '',
      stretcherCompetency: '',
      scoopCompetency: '',
      ambulanceDriving: '',
      emergencyDriving: '',
      vehicleDailyInspection: '',
      equipmentCheckCompetency: '',
      radioCommunications: '',
      equipmentVehicleNotes: ''
    },
    communicationSkills: {
      patientCommunication: '',
      relativeCommunication: '',
      handoverCompetency: '',
      documentationCompetency: '',
      multidisciplinaryTeamwork: '',
      conflictResolution: '',
      safeguardingAwareness: '',
      breakingBadNews: '',
      communicationNotes: ''
    },
    psychologicalReadiness: {
      stressManagement: '',
      resilienceLevel: '',
      ptsdScreening: '',
      ptsdScreeningResult: '',
      criticalIncidentExposure: '',
      criticalIncidentDetails: '',
      criticalIncidentDebriefed: '',
      sleepQuality: '',
      burnoutRisk: '',
      decisionMakingUnderPressure: '',
      emotionalRegulation: '',
      psychologicalNotes: ''
    },
    occupationalHealth: {
      visionTest: '',
      visionCorrected: '',
      hearingTest: '',
      hearingAidRequired: '',
      immunisationStatus: '',
      hepatitisBImmune: '',
      currentMedications: '',
      substanceMisuseScreen: '',
      musculoskeletalIssues: '',
      musculoskeletalDetails: '',
      respiratoryIssues: '',
      respiratoryDetails: '',
      skinConditions: '',
      skinConditionDetails: '',
      sicknessAbsenceDays: null,
      occupationalHealthNotes: ''
    },
    cpdTraining: {
      cpdHoursLastYear: null,
      cpdHoursRequired: null,
      mandatoryTrainingComplete: '',
      blsRecertificationDate: '',
      alsRecertificationDate: '',
      manualHandlingRecertificationDate: '',
      safeguardingTrainingDate: '',
      infectionControlTrainingDate: '',
      majorIncidentTraining: '',
      majorIncidentTrainingDate: '',
      mentoringCapability: '',
      clinicalSupervisionAttendance: '',
      reflectivePractice: '',
      cpdTrainingNotes: ''
    },
    fitnessDecision: {
      overallFitness: '',
      restrictionsDetails: '',
      reassessmentRequired: '',
      reassessmentDate: '',
      remedialActions: '',
      referralsRequired: '',
      assessorName: '',
      assessorRole: '',
      assessorRegistration: '',
      assessmentDate: '',
      countersignatureName: '',
      countersignatureDate: '',
      fitnessDecisionNotes: ''
    }
  };
}

// ──────────────────────────────────────────────
// Numeric helpers (BMI, age)
// ──────────────────────────────────────────────

/** Calculate BMI from weight (kg) and height (cm). Returns null if invalid. */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** BMI category label. */
function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III (Morbid)';
}

/** Calculate age from date of birth string. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ──────────────────────────────────────────────
// Competency / fitness / risk / grade label + class helpers
// ──────────────────────────────────────────────

/** @param {CompetencyLevel} level */
function competencyToNumber(level) {
  switch (level) {
    case 'not-competent': return 1;
    case 'developing': return 2;
    case 'competent': return 3;
    case 'expert': return 4;
    default: return 0;
  }
}

/** @param {CompetencyLevel} level */
function competencyLabel(level) {
  switch (level) {
    case 'not-competent': return 'Not Competent';
    case 'developing': return 'Developing';
    case 'competent': return 'Competent';
    case 'expert': return 'Expert';
    default: return 'Not assessed';
  }
}

/** @param {CompetencyLevel} level */
function competencyClass(level) {
  switch (level) {
    case 'not-competent': return 'level-not-competent';
    case 'developing': return 'level-developing';
    case 'competent': return 'level-competent';
    case 'expert': return 'level-expert';
    default: return 'level-none';
  }
}

/** @param {FitnessDecision} decision */
function fitnessDecisionLabel(decision) {
  switch (decision) {
    case 'fit-for-duty': return 'Fit for Duty';
    case 'fit-with-restrictions': return 'Fit with Restrictions';
    case 'temporarily-unfit': return 'Temporarily Unfit';
    case 'permanently-unfit': return 'Permanently Unfit';
    default: return 'Not determined';
  }
}

/** @param {FitnessDecision} decision */
function fitnessDecisionClass(decision) {
  switch (decision) {
    case 'fit-for-duty': return 'fitness-fit-for-duty';
    case 'fit-with-restrictions': return 'fitness-fit-with-restrictions';
    case 'temporarily-unfit': return 'fitness-temporarily-unfit';
    case 'permanently-unfit': return 'fitness-permanently-unfit';
    default: return 'fitness-none';
  }
}

/** @param {RiskLevel} risk */
function riskLevelLabel(risk) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/** @param {RiskLevel} risk */
function riskLevelClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

/** @param {number} grade */
function gradeLabel(grade) {
  switch (grade) {
    case 1: return 'Grade 1 - Minor';
    case 2: return 'Grade 2 - Moderate';
    case 3: return 'Grade 3 - Significant';
    case 4: return 'Grade 4 - Critical';
    default: return `Grade ${grade}`;
  }
}

/** @param {number} grade */
function gradeClass(grade) {
  switch (grade) {
    case 1: return 'grade-1';
    case 2: return 'grade-2';
    case 3: return 'grade-3';
    case 4: return 'grade-4';
    default: return '';
  }
}

/**
 * Aggregate an array of competency levels into a single domain level (worst).
 * @param {CompetencyLevel[]} levels
 * @returns {CompetencyLevel}
 */
function aggregateCompetency(levels) {
  const valid = levels.filter((l) => l !== '');
  if (valid.length === 0) return '';
  const nums = valid.map(competencyToNumber);
  const minVal = Math.min.apply(null, nums);
  switch (minVal) {
    case 1: return 'not-competent';
    case 2: return 'developing';
    case 3: return 'competent';
    case 4: return 'expert';
    default: return '';
  }
}

export { emptyAssessment, calculateBMI, bmiCategory, calculateAge, competencyToNumber, competencyLabel, competencyClass, fitnessDecisionLabel, fitnessDecisionClass, riskLevelLabel, riskLevelClass, gradeLabel, gradeClass, aggregateCompetency };
