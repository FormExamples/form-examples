// SCORE2-Diabetes - Types and factory functions.
//
// Classic <script> module: attaches its public symbols to
// `window.SystematicCoronaryRiskEvaluation2Diabetes`. Wrapped in an IIFE
// so its top-level identifiers do not leak.
(function () {
'use strict';

const NS = (window.SystematicCoronaryRiskEvaluation2Diabetes =
  window.SystematicCoronaryRiskEvaluation2Diabetes || {});

/**
 * @returns {Object} Empty AssessmentData record with all sections present.
 */
function createDefaultAssessmentData() {
  return {
    patientDemographics: {
      fullName: '',
      dateOfBirth: '',
      sex: '',
      nhsNumber: '',
      heightCm: null,
      weightKg: null,
      ethnicity: ''
    },
    diabetesHistory: {
      diabetesType: '',
      ageAtDiagnosis: null,
      diabetesDurationYears: null,
      hba1cValue: null,
      hba1cUnit: '',
      fastingGlucose: null,
      diabetesTreatment: '',
      insulinDurationYears: null
    },
    cardiovascularHistory: {
      previousMi: '',
      previousStroke: '',
      previousTia: '',
      peripheralArterialDisease: '',
      heartFailure: '',
      atrialFibrillation: '',
      familyCvdHistory: '',
      familyCvdDetails: '',
      currentChestPain: '',
      currentDyspnoea: ''
    },
    bloodPressure: {
      systolicBp: null,
      diastolicBp: null,
      onAntihypertensive: '',
      numberOfBpMedications: null,
      bpAtTarget: '',
      homeBpMonitoring: ''
    },
    lipidProfile: {
      totalCholesterol: null,
      hdlCholesterol: null,
      ldlCholesterol: null,
      triglycerides: null,
      nonHdlCholesterol: null,
      onStatin: '',
      statinName: '',
      onOtherLipidTherapy: ''
    },
    renalFunction: {
      egfr: null,
      creatinine: null,
      urineAcr: null,
      proteinuria: '',
      ckdStage: ''
    },
    lifestyleFactors: {
      smokingStatus: '',
      cigarettesPerDay: null,
      yearsSinceQuit: null,
      alcoholUnitsPerWeek: null,
      physicalActivity: '',
      dietQuality: '',
      bmi: null,
      waistCircumferenceCm: null
    },
    currentMedications: {
      metformin: '',
      sglt2Inhibitor: '',
      glp1Agonist: '',
      sulfonylurea: '',
      dpp4Inhibitor: '',
      insulin: '',
      aceInhibitorOrArb: '',
      antiplatelet: '',
      anticoagulant: '',
      otherMedications: ''
    },
    complicationsScreening: {
      retinopathyStatus: '',
      lastEyeScreeningDate: '',
      neuropathySymptoms: '',
      monofilamentTest: '',
      footPulses: '',
      footUlcerHistory: '',
      ankleBrachialIndex: null,
      erectileDysfunction: ''
    },
    riskAssessmentSummary: {
      riskRegion: '',
      additionalRiskFactors: '',
      clinicalNotes: '',
      agreedTreatmentTargets: '',
      followUpInterval: ''
    }
  };
}

NS.createDefaultAssessmentData = createDefaultAssessmentData;
})();
