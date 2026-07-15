// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the WHO Emergency Unit Form:
// Trauma. This file publishes the empty-state factory and shared
// helpers used across the wizard.

function emptyPe() {
  return { normal: false, notes: '' };
}

/** @returns {object} A fresh, empty AssessmentData instance. */
function emptyAssessment() {
  return {
    patientRegistration: {
      hospitalRegistrationNumber: '',
      surname: '',
      firstName: '',
      dateOfBirth: '',
      age: null,
      ageCategory: '',
      sex: '',
      racialAndEthnicIdentity: '',
      racialAndEthnicIdentityUnknown: false,
      interpreterRequired: '',
      occupation: '',
      contactPerson: '',
      contactPhone: '',
      contactRelation: '',
      dateOfArrival: '',
      timeOfArrival: '',
      arrivalMode: '',
      patientResidence: '',
      patientResidenceUnknown: false,
      injuryLocation: '',
      injuryLocationUnknown: false,
      priorFacilitiesCount: null,
      referredFrom: '',
      safeAtHome: '',
      weightKg: null,
      vaccinationsStatus: '',
      vaccinationsDate: '',
      pregnant: '',
      pregnancyReported: false,
      pregnancyTestingDone: false,
      lastMenstrualCycle: '',
      gravida: null,
      para: null,
      lmpUnknown: false,
      tobaccoUse: false,
      alcoholUse: false,
      drugUse: false,
      ivDrugUse: false,
      substanceUseUnknown: false
    },
    chiefComplaintAndVitals: {
      chiefComplaint: '',
      allergies: '',
      allergiesUnknown: false,
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
      deadOnArrival: false,
      timeOfDeath: ''
    },
    highRiskSigns: {
      redStridor: false,
      redCyanosis: false,
      redRespiratoryDistress: false,
      redPoorPerfusion: false,
      redWeakFastPulse: false,
      redCapRefillOver3: false,
      redHeavyBleeding: false,
      redAdultHrAbnormal: false,
      redChildLethargy: false,
      redChildSunkenEyes: false,
      redChildSlowSkinPinch: false,
      redChildPoorDrinking: false,
      redUnresponsive: false,
      redAcuteConvulsions: false,
      redHypoglycaemia: false,
      redAcuteFocalNeuroDeficit: false,
      redAlteredMentalStatusWithFeverEtc: false,
      redThreatenedLimb: false,
      redSnakeBite: false,
      redPoisoningChemicalExposure: false,
      redViolentOrAggressive: false,
      redAcuteTesticularPainOrPriapism: false,
      redAdultSevereChestOrAbdoPain: false,
      redPregnantWithHighRiskFindings: false,
      redInfantUnder8Days: false,
      redInfantUnder2MonthsAbnormalTemp: false,
      traumaFallTwiceHeight: false,
      traumaAllPenetrating: false,
      traumaPenetratingDistalUncontrolledBleeding: false,
      traumaCrushInjury: false,
      traumaPolytrauma: false,
      traumaBleedingDisorderOrAnticoag: false,
      traumaPregnant: false,
      rtHighSpeedCrash: false,
      rtPedestrianOrCyclistHit: false,
      rtOtherInVehicleDied: false,
      rtNoSeatbelt: false,
      rtTrappedOrThrown: false,
      rtDeadOnArrival: false
    },
    triage: {
      category: '',
      triagedFor: '',
      providerAssessmentDate: '',
      providerAssessmentTime: ''
    },
    airway: {
      normal: false,
      swelling: false,
      stridor: false,
      voiceChanges: false,
      burns: false,
      obstructedByTongue: false,
      obstructedByBlood: false,
      obstructedBySecretion: false,
      obstructedByVomit: false,
      obstructedByForeignBody: false,
      interventionRepositioning: false,
      interventionSuction: false,
      interventionOpa: false,
      interventionNpa: false,
      interventionLma: false,
      interventionBvm: false,
      interventionEtt: false,
      spineStabilized: '',
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
      cyanosis: false,
      oxygenLitres: null,
      oxygenNasalCannula: false,
      oxygenMask: false,
      oxygenNonRebreather: false,
      oxygenBvm: false,
      oxygenCpapBipap: false,
      oxygenVentilator: false,
      chestTubeLeftSize: '',
      chestTubeLeftDepth: '',
      chestTubeRightSize: '',
      chestTubeRightDepth: '',
      notes: ''
    },
    circulation: {
      normal: false,
      skinWarm: false,
      skinDry: false,
      skinCool: false,
      skinMoist: false,
      skinPale: false,
      capillaryRefillUnder3: false,
      capillaryRefillSeconds: null,
      pulsesWeak: false,
      pulsesAsymmetric: false,
      jvd: '',
      unstablePelvis: '',
      bleedingControlDirectPressure: false,
      bleedingControlBandage: false,
      bleedingControlTourniquet: false,
      accessIvLocation: '',
      accessIvSize: '',
      accessCentralLocation: '',
      accessCentralSize: '',
      accessIoLocation: '',
      accessIoSize: '',
      accessLine2Location: '',
      accessLine2Size: '',
      ivfMls: null,
      ivfNs: false,
      ivfLr: false,
      ivfOther: '',
      bloodOrdered: false,
      bloodGiven: false,
      bloodTypeAmount: '',
      pelvisStabilized: '',
      notes: ''
    },
    disability: {
      normal: false,
      avpu: '',
      gcsTotal: null,
      gcsEye: null,
      gcsVerbal: null,
      gcsMotor: null,
      gcsQualified: false,
      movesRue: false,
      movesLue: false,
      movesRle: false,
      movesLle: false,
      pupilSizeLeft: null,
      pupilSizeRight: null,
      pupilReactivityLeft: '',
      pupilReactivityRight: '',
      bloodGlucose: null,
      interventionGlucose: false,
      interventionAntidote: false,
      interventionAntiepileptic: false,
      interventionRaiseHeadOfBed: false,
      interventionOther: '',
      notes: ''
    },
    exposureAndFast: {
      exposedCompletely: false,
      exposureNotes: '',
      fastNormal: false,
      fastNotIndicated: false,
      fastNotAvailable: false,
      fastPeritoneum: '',
      fastChest: '',
      fastChestPneumothoraxSide: '',
      fastChestPleuralFluidSide: '',
      fastNotes: ''
    },
    injuryHistory: {
      placeOfInjury: '',
      placeOfInjuryUnknown: false,
      activityAtTimeOfInjury: '',
      activityAtTimeOfInjuryUnknown: false,
      mechRoadTrafficIncident: false,
      mechRoadRole: '',
      mechPatientVehicle: '',
      mechImpactedWith: '',
      mechAirbag: false,
      mechSeatbelt: false,
      mechHelmet: false,
      mechExtricated: false,
      mechEjected: false,
      mechFallFrom: '',
      mechHitByFallingObject: false,
      mechStabCut: false,
      mechGunshot: false,
      mechSexualAssault: false,
      mechOtherBluntForce: false,
      mechSuffocationChokingHanging: false,
      mechDrowning: false,
      mechDrowningLifeVest: '',
      mechBurnCausedBy: '',
      mechPoisoningToxicExposure: false,
      mechUnknown: false,
      firstCareSought: '',
      prehospitalCareProvider: '',
      prehospitalCareGiven: '',
      dateOfInjury: '',
      timeOfInjury: '',
      lossOfConsciousnessDuration: '',
      headTrauma: false,
      neckTrauma: false,
      otherTraumaDetails: '',
      intent: '',
      assaultedBy: '',
      hoursSinceLastMeal: null,
      hoursSinceLastMealUnknown: false,
      substanceUseStatus: '',
      substanceAlcohol: false,
      substanceOther: ''
    },
    pastHistories: {
      pmhNone: false,
      pmhUnknown: false,
      pmhHtn: false,
      pmhDm: false,
      pmhCopd: false,
      pmhPsych: false,
      pmhRenalDisease: false,
      pmhOther: '',
      medicationsNone: false,
      medicationsUnknown: false,
      medications: '',
      pastSurgeriesNone: false,
      pastSurgeriesUnknown: false,
      pastSurgeries: '',
      familyHistoryNone: false,
      familyHistoryUnknown: false,
      familyHistory: ''
    },
    physicalExam: {
      general: emptyPe(),
      neuroPsych: emptyPe(),
      heent: emptyPe(),
      neck: emptyPe(),
      respiratory: emptyPe(),
      cardiac: emptyPe(),
      abdominal: emptyPe(),
      pelvis: emptyPe(),
      guRectal: emptyPe(),
      musculoskeletal: emptyPe(),
      skin: emptyPe(),
      areaOfInjuryDetail: ''
    },
    assessmentAndPlan: {
      narrative: ''
    },
    diagnostics: {
      labHgb: { ordered: false, result: '' },
      labBloodType: { ordered: false, result: '' },
      labChemistry: { ordered: false, result: '' },
      labHepatic: { ordered: false, result: '' },
      labUpt: { ordered: false, result: '' },
      labOther: { ordered: false, result: '' },
      imgChestRadiograph: { ordered: false, result: '' },
      imgPelvicRadiograph: { ordered: false, result: '' },
      imgHeadCt: { ordered: false, result: '' },
      imgCspine: { ordered: false, result: '' },
      imgChestAbdomenCt: { ordered: false, result: '' },
      imgExtremityRadiograph: { ordered: false, result: '' },
      imgOther: { ordered: false, result: '' }
    },
    medicationsAndProcedures: {
      ivfMls: null,
      ivfType: '',
      bloodUnits: '',
      analgesia: '',
      antimicrobials: '',
      tetanus: '',
      medications: [
        { medicationAndDose: '', timeGiven: '', initials: '' },
        { medicationAndDose: '', timeGiven: '', initials: '' },
        { medicationAndDose: '', timeGiven: '', initials: '' },
        { medicationAndDose: '', timeGiven: '', initials: '' },
        { medicationAndDose: '', timeGiven: '', initials: '' }
      ],
      procIntubation: false,
      procThoracostomy: false,
      procSplintingReduction: false,
      procLacerationRepair: false,
      procOther: '',
      procedures: [
        { procedure: '', timeGiven: '', initials: '' },
        { procedure: '', timeGiven: '', initials: '' },
        { procedure: '', timeGiven: '', initials: '' },
        { procedure: '', timeGiven: '', initials: '' },
        { procedure: '', timeGiven: '', initials: '' }
      ]
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
      finalVitals: {
        tempC: null,
        pulse: null,
        bpSystolic: null,
        bpDiastolic: null,
        respiratoryRate: null,
        spo2: null,
        spo2OnOxygen: ''
      },
      diagnosesImpressions: '',
      disposition: '',
      admitWard: '',
      transferTo: '',
      dischargePlanDiscussed: '',
      leftWithoutBeingSeen: false,
      diedCause: '',
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
    hasText(b.chestTubeLeftSize) ||
    hasText(b.chestTubeRightSize)
  );
}

/** True if any circulation intervention (access, fluids, blood, bleeding control) is recorded. */
function hasCirculationIntervention(data) {
  const c = data.circulation;
  return (
    hasText(c.accessIvLocation) ||
    hasText(c.accessCentralLocation) ||
    hasText(c.accessIoLocation) ||
    hasText(c.accessLine2Location) ||
    hasNumber(c.ivfMls) ||
    c.bloodOrdered ||
    c.bloodGiven ||
    c.bleedingControlDirectPressure ||
    c.bleedingControlBandage ||
    c.bleedingControlTourniquet
  );
}

/** Human-readable label for a SectionKey. */
function sectionLabel(section) {
  switch (section) {
    case 'patientRegistration': return 'Patient Registration';
    case 'chiefComplaintAndVitals': return 'Chief Complaint & Vitals';
    case 'highRiskSigns': return 'High Risk Signs';
    case 'triage': return 'Triage';
    case 'airway': return 'Airway (A)';
    case 'breathing': return 'Breathing (B)';
    case 'circulation': return 'Circulation (C)';
    case 'disability': return 'Disability (D)';
    case 'exposureAndFast': return 'Exposure (E) & FAST (F)';
    case 'injuryHistory': return 'Injury History';
    case 'pastHistories': return 'Past Histories';
    case 'physicalExam': return 'Physical Exam';
    case 'assessmentAndPlan': return 'Assessment & Plan';
    case 'diagnostics': return 'Diagnostics';
    case 'medicationsAndProcedures': return 'Medications & Procedures';
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
