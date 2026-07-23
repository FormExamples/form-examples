// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Pre-operative Assessment by
// Clinician form.
//
// Builds the canonical empty `ClinicianAssessment` shape so newly-added
// fields default correctly when older saved state is rehydrated from
// localStorage.

/**
 * Build a fresh, fully-blank clinician assessment.
 * Strings default to ''; numeric fields default to null; lists default to [].
 */
function emptyAssessment() {
  return {
    clinician: {
      clinicianName: '',
      clinicianRole: '',
      registrationBody: '',
      registrationNumber: '',
      siteName: '',
      assessmentDate: '',
      assessmentTime: ''
    },
    patient: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nhsNumber: '',
      hospitalNumber: '',
      sex: '',
      weightKg: null,
      heightCm: null,
      bmi: null
    },
    surgery: {
      plannedProcedure: '',
      indicationForSurgery: '',
      surgicalSpecialty: '',
      urgency: '',
      laterality: '',
      surgicalSeverity: '',
      anticipatedBloodLossMl: null,
      anticipatedDurationMinutes: null,
      consultantSurgeon: '',
      anaesthetistName: '',
      plannedDate: ''
    },
    vitals: {
      systolicBp: null,
      diastolicBp: null,
      heartRate: null,
      respiratoryRate: null,
      spo2Percent: null,
      temperatureCelsius: null,
      capillaryRefillSeconds: null,
      painScore010: null,
      onRoomAir: '',
      supplementalOxygenLitres: null
    },
    airway: {
      mallampatiClass: '',
      thyromentalDistanceCm: null,
      mouthOpeningCm: null,
      interIncisorGapCm: null,
      neckRom: '',
      cervicalSpineStability: '',
      dentition: '',
      beard: '',
      upperLipBiteTest: '',
      priorDifficultIntubation: '',
      previousSurgeries: '',
      previousAnaestheticIssues: '',
      previousAnaestheticIssuesDetails: '',
      familyHistoryAnaestheticComplications: '',
      familyHistoryAnaestheticComplicationsDetails: '',
      stopbangSnoring: '',
      stopbangTired: '',
      stopbangObservedApnoea: '',
      stopbangPressure: '',
      stopbangBmiGt35: '',
      stopbangAgeGt50: '',
      stopbangNeckGt40: '',
      stopbangMale: '',
      airwayNotes: ''
    },
    cardiovascular: {
      heartRhythm: '',
      murmurPresent: '',
      murmurDescription: '',
      peripheralPulses: '',
      jvpRaised: '',
      peripheralOedema: '',
      ecgPerformed: '',
      ecgRhythm: '',
      ecgRateBpm: null,
      ecgAxis: '',
      ecgIschaemicChanges: '',
      ecgNotes: '',
      echoPerformed: '',
      echoEfPercent: null,
      echoNotes: '',
      historyIhd: '',
      historyChf: '',
      historyStrokeTia: '',
      recentMiWithin3Months: '',
      pacemakerOrIcd: '',
      severeValveDysfunction: '',
      activeAngina: ''
    },
    respiratory: {
      breathSounds: '',
      wheeze: '',
      crackles: '',
      crepitations: '',
      chestWallDeformity: '',
      asthma: '',
      copd: '',
      cxrPerformed: '',
      cxrFindings: '',
      pftPerformed: '',
      pftFev1PercentPredicted: null,
      pftFev1FvcRatio: null,
      smokingStatus: '',
      packYears: null,
      covidHistory: '',
      daysSinceCovid: null,
      covidUnresolvedSymptoms: ''
    },
    neurological: {
      gcsTotal: null,
      gcsEye: null,
      gcsVerbal: null,
      gcsMotor: null,
      cognitionTool: '',
      cognitionScore: null,
      cognitiveImpairment: '',
      capacityConcern: '',
      cranialNervesNotes: '',
      motorPower: '',
      sensoryNotes: '',
      reflexes: '',
      recentStrokeTia: '',
      daysSinceStrokeTia: null,
      seizureDisorder: ''
    },
    renalHepatic: {
      creatinineUmolL: null,
      egfrMlMin173m2: null,
      ureaMmolL: null,
      potassiumMmolL: null,
      sodiumMmolL: null,
      dialysisStatus: '',
      ckdStage: '',
      bilirubinUmolL: null,
      altUL: null,
      astUL: null,
      alpUL: null,
      albuminGL: null,
      chronicLiverDisease: '',
      childPughClass: '',
      urinalysisFindings: ''
    },
    haematology: {
      hbGL: null,
      wcc109L: null,
      platelets109L: null,
      mcvFL: null,
      ferritinUgL: null,
      transferrinSaturationPercent: null,
      inr: null,
      apttSeconds: null,
      fibrinogenGL: null,
      onAnticoagulant: '',
      anticoagulantType: '',
      anticoagulantHoldPlan: '',
      groupAndSave: '',
      crossmatchUnits: null,
      lastTransfusionDate: '',
      anaemiaSeverity: ''
    },
    endocrine: {
      diabetesType: '',
      diabetesOnInsulin: '',
      hba1cMmolMol: null,
      fastingGlucoseMmolL: null,
      randomGlucoseMmolL: null,
      diabetesControl: '',
      diabetesComplications: '',
      thyroidStatus: '',
      tshMuL: null,
      adrenalStatus: '',
      onLongTermSteroids: '',
      steroidDoseMg: null,
      steroidCoverPlan: ''
    },
    gastrointestinal: {
      abdominalExam: '',
      abdominalNotes: '',
      refluxSymptoms: '',
      hiatusHernia: '',
      previousGastricSurgery: '',
      ngTube: '',
      stoma: '',
      fastingConfirmed: '',
      lastSolidFoodAt: '',
      lastClearFluidAt: '',
      rapidSequenceInductionNeeded: ''
    },
    musculoskeletal: {
      spineExam: '',
      spineNotes: '',
      neuraxialSuitable: '',
      jointRomHip: '',
      jointRomShoulder: '',
      jointRomNeck: '',
      skinIvAccess: '',
      skinBlockSite: '',
      pressureUlcerRisk: ''
    },
    medications: [],
    allergies: [],
    functionalCapacity: {
      metsEstimate: null,
      dasiScore: null,
      ecogPerformanceStatus: null,
      clinicalFrailtyScale: null,
      sixMinuteWalkMetres: null,
      stsOneMinuteReps: null,
      tugSeconds: null,
      cpetPerformed: '',
      cpetVo2PeakMlKgMin: null,
      cpetAnaerobicThresholdMlKgMin: null,
      cpetNotes: '',
      malnutritionRisk: '',
      unintentionalWeightLossKg: null,
      livingSituation: '',
      supportAtHome: '',
      mobilityStatus: '',
      fallsRiskWithinYear: ''
    },
    anaesthesiaPlan: {
      technique: '',
      airwayPlan: '',
      rsiPlanned: '',
      monitoringLevel: '',
      analgesiaPlan: '',
      regionalBlockPlanned: '',
      dvtProphylaxis: '',
      antibioticProphylaxis: '',
      postOpDisposition: '',
      anticipatedLengthOfStayDays: null,
      specialEquipment: '',
      bloodProductsRequired: '',
      vteRiskLevel: '',
      covidScreeningResult: '',
      dischargeDestination: '',
      followUpRequirements: '',
      socialServicesInvolvement: '',
      reablementPhysiotherapyNeeds: ''
    },
    summary: {
      finalAsaGrade: '',
      overrideReason: '',
      recommendation: '',
      clinicianNotes: '',
      consentStatus: '',
      interpreterRequired: '',
      discussionProcedure: '',
      discussionAnaesthetic: '',
      discussionRisksBenefits: '',
      discussionAlternatives: '',
      signedAt: ''
    }
  };
}

/** Compute BMI (kg/m^2) rounded to 1 decimal. Returns null on invalid input. */
function computeBmi(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

/** BMI category label. */
function bmiCategory(bmi) {
  if (bmi == null) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III (Morbid)';
}

const ASA_ORDER = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/** Return whichever of two ASA grades is more severe. */
function maxAsa(a, b) {
  return ASA_ORDER.indexOf(a) >= ASA_ORDER.indexOf(b) ? a : b;
}

/** True for high-risk surgery (RCRI component 1). */
function isHighRiskSurgery(severity) {
  return severity === 'major' || severity === 'major-plus';
}

/** Pretty label for a composite-risk band. */
function riskLabel(level) {
  switch (level) {
    case 'low': return 'Low risk';
    case 'moderate': return 'Moderate risk';
    case 'high': return 'High risk';
    case 'critical': return 'Critical risk';
    default: return '';
  }
}

export { emptyAssessment, computeBmi, bmiCategory, maxAsa, isHighRiskSurgery, riskLabel, ASA_ORDER };
