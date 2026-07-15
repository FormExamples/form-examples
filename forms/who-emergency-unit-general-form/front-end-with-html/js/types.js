// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the WHO Emergency Unit Form:
// General. This file publishes the empty-state factory and shared
// helpers used across the wizard.

/** @returns {object} A fresh, empty AssessmentData instance. */
function emptyAssessment() {
  return {
    patientRegistration: {
      hospitalRegistrationNumber: '',
      surname: '',
      firstName: '',
      sex: '',
      dateOfBirth: '',
      age: null,
      ageCategory: '',
      weightKg: null,
      dateOfArrival: '',
      timeOfArrival: '',
      arrivalMode: '',
      ambulanceLevel: '',
      emergencySystemActivationDate: '',
      emergencySystemActivationTime: '',
      emergencySystemDispatchDate: '',
      emergencySystemDispatchTime: '',
      emergencyPersonnelArrivalDate: '',
      emergencyPersonnelArrivalTime: '',
      occupation: '',
      patientResidence: '',
      patientResidenceUnknown: false,
      racialAndEthnicIdentity: '',
      racialAndEthnicIdentityUnknown: false,
      interpreterRequired: '',
      contactPerson: '',
      contactPhone: '',
      contactRelation: '',
      priorFacilitiesCount: null,
      referredFrom: '',
      ambulatory: false,
      nonAmbulatory: false,
      acute: false,
      chronic: false,
      dailyActivitiesLimited: ''
    },
    chiefComplaintAndVitals: {
      chiefComplaint: '',
      triageCategory: '',
      initialVitals: {
        time: '',
        tempC: null,
        bpSystolic: null,
        bpDiastolic: null,
        pulse: null,
        respiratoryRate: null,
        spo2: null,
        spo2OnOxygen: '',
        painScore: null
      },
      providerAssessmentDate: '',
      providerAssessmentTime: '',
      deadOnArrival: false
    },
    highRiskSigns: {
      abnormalAvpu: false,
      abnormalHeartRate: false,
      stridorOrVoiceChange: false,
      poorPerfusion: false,
      abnormalTemperature: false,
      lowSpo2: false,
      respiratoryDistress: false,
      vomitsEverythingOrCannotFeed: false
    },
    airway: {
      normal: false,
      angioedema: false,
      stridor: false,
      voiceChanges: false,
      oralAirwayBurns: false,
      obstructedByTongue: false,
      obstructedByBlood: false,
      obstructedBySecretions: false,
      obstructedByVomit: false,
      obstructedByForeignBody: false,
      interventionRepositioning: false,
      interventionSuction: false,
      interventionOpa: false,
      interventionNpa: false,
      interventionLma: false,
      interventionBvm: false,
      interventionEtt: false,
      notes: ''
    },
    breathing: {
      normal: false,
      spontaneousRespiratoryRate: null,
      chestRiseShallow: false,
      chestRiseRetractions: false,
      chestRiseParadoxical: false,
      tracheaMidline: false,
      tracheaDeviatedLeft: false,
      tracheaDeviatedRight: false,
      breathSoundsLeft: '',
      breathSoundsRight: '',
      oxygenLitres: null,
      oxygenNasalCannula: false,
      oxygenMask: false,
      oxygenNonRebreather: false,
      oxygenBvm: false,
      oxygenCpapBipap: false,
      oxygenVentilator: false,
      bronchodilator: false,
      chestNeedleLeftSize: '',
      chestNeedleLeftDepth: '',
      chestNeedleRightSize: '',
      chestNeedleRightDepth: '',
      notes: ''
    },
    circulation: {
      normal: false,
      skinWarm: false,
      skinDry: false,
      skinPale: false,
      skinCyanotic: false,
      skinMoist: false,
      skinCool: false,
      capillaryRefillUnder3: false,
      capillaryRefillSeconds: null,
      pulsesWeak: false,
      pulsesAsymmetric: false,
      jvd: '',
      accessIvLocation: '',
      accessIvSize: '',
      accessCvlLocation: '',
      accessCvlSize: '',
      accessIoLocation: '',
      accessIoSize: '',
      ivfMls: null,
      ivfNs: false,
      ivfLr: false,
      ivfOther: '',
      bloodOrdered: false,
      epinephrineGiven: false,
      notes: ''
    },
    disability: {
      normal: false,
      avpu: '',
      movesAllExtremities: false,
      deficit: false,
      deficitDescription: '',
      pupilSizeLeft: null,
      pupilSizeRight: null,
      pupilReactivityLeft: '',
      pupilReactivityRight: '',
      bloodGlucoseMmol: null,
      interventionGlucose: false,
      interventionAntiepileptic: false,
      interventionNaloxone: false,
      interventionOthers: '',
      notes: ''
    },
    historyOfPresentIllness: {
      narrative: ''
    },
    reviewOfSystems: {
      general: { normal: false, notes: '' },
      heent: { normal: false, notes: '' },
      respiratory: { normal: false, notes: '' },
      cardiovascular: { normal: false, notes: '' },
      gastrointestinal: { normal: false, notes: '' },
      pelvisGuRectal: { normal: false, notes: '' },
      femaleReproductive: { normal: false, notes: '' },
      maleReproductive: { normal: false, notes: '' },
      skin: { normal: false, notes: '' },
      musculoskeletal: { normal: false, notes: '' },
      hematologic: { normal: false, notes: '' },
      neurological: { normal: false, notes: '' },
      psychiatric: { normal: false, notes: '' },
      pediatricSpecific: { normal: false, notes: '' }
    },
    pastMedicalHistory: {
      historyObtainedFrom: '',
      medications: '',
      medicationsUnknown: false,
      allergies: '',
      allergiesUnknown: false,
      lastMenstrualCycle: '',
      gravida: null,
      para: null,
      lmpUnknown: false,
      pregnant: '',
      pregnancyReported: false,
      pregnancyTestingDone: false,
      vaccinationsStatus: '',
      vaccinationsDate: '',
      tobaccoUse: false,
      alcoholUse: false,
      drugUse: false,
      ivDrugUse: false,
      substanceUseUnknown: false,
      pmhHtn: false,
      pmhDm: false,
      pmhCopd: false,
      pmhPsych: false,
      pmhRenalDisease: false,
      pmhUnknown: false,
      pmhOther: '',
      familyHistory: '',
      familyHistoryUnknown: false,
      pastSurgeries: '',
      pastSurgeriesUnknown: false,
      safeAtHome: ''
    },
    physicalExam: {
      general: { normal: false, notes: '' },
      neuroPsych: { normal: false, notes: '' },
      heent: { normal: false, notes: '' },
      neck: { normal: false, notes: '' },
      respiratory: { normal: false, notes: '' },
      cardiac: { normal: false, notes: '' },
      abdominal: { normal: false, notes: '' },
      pelvisGuRectal: { normal: false, notes: '' },
      lymph: { normal: false, notes: '' },
      musculoskeletal: { normal: false, notes: '' },
      skin: { normal: false, notes: '' }
    },
    diagnostics: {
      cbc: { wbc: null, hgb: null, plt: null, hct: null, pending: false },
      lytes: {
        na: null, cl: null, bun: null, k: null,
        hco3: null, cr: null, glucose: null, pending: false
      },
      upt: '',
      malaria: '',
      hivRapid: '',
      bloodType: '',
      urineDip: {
        glucose: false, nitrites: false, ketones: false,
        leukocytes: false, blood: false, protein: false
      },
      otherLabsImaging: '',
      ecg: { rate: null, sinusRhythm: '', ischemia: '', interpretation: '' }
    },
    additionalInterventions: {
      medications: {
        time: '',
        ivfMls: null,
        ivfType: '',
        bloodProductsUnits: '',
        opioidAnalgesia: '',
        otherAnalgesia: '',
        sedationParalytics: '',
        antimicrobials: '',
        tetanus: '',
        other: ''
      },
      procedures: {
        intubationTime: '',
        intubationOutcome: '',
        chestTubeTime: '',
        chestTubeOutcome: '',
        lumbarPunctureTime: '',
        lumbarPunctureOutcome: '',
        lacerationRepairTime: '',
        lacerationRepairOutcome: '',
        other: ''
      }
    },
    assessmentAndPlan: {
      narrative: ''
    },
    reassessment: {
      time: '',
      tempC: null,
      pulse: null,
      bpSystolic: null,
      bpDiastolic: null,
      respiratoryRate: null,
      spo2: null,
      spo2OnOxygen: '',
      conditionSame: false,
      conditionChanges: ''
    },
    disposition: {
      checklistCompleted: '',
      edDepartureDate: '',
      edDepartureTime: '',
      diagnosesImpressions: '',
      disposition: '',
      admitWard: '',
      dischargePlanDiscussed: '',
      transferTo: '',
      leftWithoutBeingSeen: false,
      diedCause: '',
      finalVitals: {
        tempC: null,
        pulse: null,
        bpSystolic: null,
        bpDiastolic: null,
        respiratoryRate: null,
        spo2: null,
        spo2OnOxygen: ''
      },
      acceptingProvider: '',
      emergencyUnitProvider: '',
      signature: '',
      signatureDate: ''
    }
  };
}

/** True if a string is non-empty after trimming. */
function hasText(s) {
  return typeof s === 'string' && s.trim() !== '';
}

/** True if a value is a finite number. */
function hasNumber(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

/** True if a Yes/No field has been answered (yes or no). */
function isYesNoAnswered(value) {
  return value === 'yes' || value === 'no';
}

/** True if any airway intervention has been recorded. */
function hasAirwayIntervention(data) {
  const a = data.airway;
  return (
    a.interventionRepositioning ||
    a.interventionSuction ||
    a.interventionOpa ||
    a.interventionNpa ||
    a.interventionLma ||
    a.interventionBvm ||
    a.interventionEtt
  );
}

/** True if any breathing/oxygen intervention has been recorded. */
function hasBreathingIntervention(data) {
  const b = data.breathing;
  return (
    b.oxygenNasalCannula ||
    b.oxygenMask ||
    b.oxygenNonRebreather ||
    b.oxygenBvm ||
    b.oxygenCpapBipap ||
    b.oxygenVentilator ||
    b.bronchodilator
  );
}

/** True if any circulation intervention (access / fluids / blood / epi) is recorded. */
function hasCirculationIntervention(data) {
  const c = data.circulation;
  return (
    hasText(c.accessIvLocation) ||
    hasText(c.accessCvlLocation) ||
    hasText(c.accessIoLocation) ||
    hasNumber(c.ivfMls) ||
    c.bloodOrdered ||
    c.epinephrineGiven
  );
}

/** Human-readable label for a SectionKey. */
function sectionLabel(section) {
  switch (section) {
    case 'patientRegistration': return 'Patient Registration';
    case 'chiefComplaintAndVitals': return 'Chief Complaint & Vitals';
    case 'highRiskSigns': return 'High Risk Signs';
    case 'airway': return 'Airway (A)';
    case 'breathing': return 'Breathing (B)';
    case 'circulation': return 'Circulation (C)';
    case 'disability': return 'Disability (D)';
    case 'historyOfPresentIllness': return 'History of Present Illness';
    case 'reviewOfSystems': return 'Review of Systems';
    case 'pastMedicalHistory': return 'Past Medical History';
    case 'physicalExam': return 'Physical Exam';
    case 'diagnostics': return 'Diagnostics';
    case 'additionalInterventions': return 'Additional Interventions';
    case 'assessmentAndPlan': return 'Assessment & Plan';
    case 'reassessment': return 'Reassessment';
    case 'disposition': return 'Disposition';
    default: return section;
  }
}

/** Human-readable label for a flag priority. */
function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return '';
  }
}

export { emptyAssessment, hasText, hasNumber, isYesNoAnswered, hasAirwayIntervention, hasBreathingIntervention, hasCirculationIntervention, sectionLabel, priorityLabel };
