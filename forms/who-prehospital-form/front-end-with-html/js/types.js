// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the WHO Prehospital Form
// (SCF Prehospital). This file publishes the empty-state factory and
// shared helpers used across the wizard.

/** @returns {object} A fresh PeEntry (Physical Exam per-system). */
function emptyPeEntry() {
  return { normal: false, notes: '' };
}

/** @returns {object} A fresh, empty Reassessment entry. */
function emptyReassessment() {
  return {
    time: '',
    hr: null,
    rr: null,
    tempC: null,
    spo2: null,
    spo2OnOxygen: '',
    rbs: null,
    pain: null,
    unchanged: false
  };
}

/** @returns {object} A fresh, empty AssessmentData instance. */
function emptyAssessment() {
  return {
    callerAndScene: {
      massCasualty: false,
      callerName: '',
      callerPhone: '',
      patientName: '',
      dateOfBirthOrAge: '',
      sex: '',
      patientAddress: '',
      occupation: '',
      date: '',
      sceneCallType: '',
      runNumber: '',
      sceneLocationType: '',
      sceneLocationOther: '',
      timeCallReceived: '',
      timeEnRouteToScene: '',
      timeArrivedAtScene: '',
      timeTransporting: '',
      timeAtFacility: '',
      timeInService: ''
    },
    chiefComplaintAndVitals: {
      chiefComplaint: '',
      injury: false,
      initialVitals: {
        time: '',
        hr: null,
        rr: null,
        bp: '',
        tempC: null,
        rbs: null,
        spo2: null,
        spo2OnOxygen: ''
      },
      careInProgressOnArrival: '',
      pregnant: '',
      painScore: null
    },
    highRiskSigns: {
      stridor: false,
      cyanosis: false,
      respiratoryDistress: false,
      poorPerfusion: false,
      weakFastPulse: false,
      capillaryRefillOver3s: false,
      heavyBleeding: false,
      childLethargy: false,
      childSunkenEyes: false,
      childSlowSkinPinch: false,
      childPoorDrinking: false,
      adultHrUnder50OrOver150: false,
      unresponsive: false,
      acuteConvulsions: false,
      hypoglycaemia: false,
      acuteFocalNeurologicDeficit: false,
      alteredMentalStatusWithFeverHypothermiaStiffNeckHeadache: false,
      highRiskTrauma: false,
      threatenedLimb: false,
      snakeBite: false,
      poisoningIngestionChemicalExposure: false,
      violentOrAggressive: false,
      tempOver39OrUnder36: false,
      acuteTesticularPainOrPriapism: false,
      pregnantWithHighRiskFindings: false,
      adultSevereChestOrAbdominalPainOrEcgIschaemia: false,
      infantUnder8Days: false,
      infantUnder2MonthsWithTempOver39OrUnder36: false
    },
    triage: {
      category: '',
      triagedFor: ''
    },
    airway: {
      normal: false,
      voiceChanges: false,
      stridor: false,
      oralAirwayBurns: false,
      angioedema: false,
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
      cSpineNotNeeded: false,
      cSpineDone: false,
      notes: ''
    },
    breathing: {
      normal: false,
      spontaneousRespiration: '',
      chestRiseShallow: false,
      chestRiseRetractions: false,
      chestRiseParadoxical: false,
      tracheaMidline: false,
      tracheaDeviatedLeft: false,
      tracheaDeviatedRight: false,
      breathSoundsNormal: false,
      breathSoundsNotes: '',
      oxygenLitres: null,
      oxygenNasalCannula: false,
      oxygenFaceMask: false,
      oxygenNonRebreather: false,
      oxygenBvm: false,
      oxygenBipapCpap: false,
      oxygenOther: '',
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
      capillaryRefill3OrMore: false,
      pulsesWeak: false,
      pulsesAsymmetric: false,
      jvd: '',
      activeBleedingSite: '',
      bleedingControlledBandage: false,
      bleedingControlledTourniquet: false,
      bleedingControlledDirectPressure: false,
      bleedingControlTime: '',
      accessIvSite: '',
      accessIvSize: '',
      accessIoSite: '',
      accessIoSize: '',
      ivfMls: null,
      ivfNs: false,
      ivfLr: false,
      ivfOther: '',
      pelvisStabilized: false,
      femurFractureStabilized: false,
      notes: ''
    },
    disability: {
      normal: false,
      bloodGlucose: null,
      avpu: '',
      gcsEye: null,
      gcsVerbal: null,
      gcsMotor: null,
      movesLeftArm: false,
      movesRightArm: false,
      movesLeftLeg: false,
      movesRightLeg: false,
      pupilSizeLeft: null,
      pupilSizeRight: null,
      pupilReactivityLeft: '',
      pupilReactivityRight: '',
      interventionGlucoseChecked: false,
      interventionGlucoseGiven: false,
      interventionNaloxoneGiven: false,
      notes: ''
    },
    exposure: {
      normal: false,
      exposedCompletely: false,
      notes: ''
    },
    sampleHistory: {
      signsSymptoms: '',
      signsSymptomsUnknown: false,
      allergies: '',
      allergiesUnknown: false,
      medications: '',
      medicationsUnknown: false,
      pastMedical: '',
      pastMedicalUnknown: false,
      pastSurgeries: '',
      pastSurgeriesUnknown: false,
      lastAteHours: null,
      lastAteUnknown: false,
      events: '',
      eventsUnknown: false
    },
    injuryDetails: {
      intent: '',
      mechanismFall: false,
      mechanismHitByFallingObject: false,
      mechanismStabCut: false,
      mechanismGunshot: false,
      mechanismSexualAssault: false,
      mechanismOtherBluntForce: false,
      mechanismSuffocationChokingHanging: false,
      mechanismDrowning: false,
      mechanismDrowningLifeVest: '',
      mechanismBurnCausedBy: '',
      mechanismPoisoningToxicExposure: false,
      mechanismUnknown: false,
      mechanismOther: '',
      roadTrafficDriver: false,
      roadTrafficPassenger: false,
      roadTrafficPedestrian: false,
      roadTrafficEjected: false,
      roadTrafficExtricated: false,
      vehicleType: '',
      vehicleOther: '',
      safetyAirbag: false,
      safetySeatbelt: false,
      safetyHelmet: false,
      safetyOtherRestraint: ''
    },
    physicalExam: {
      general: emptyPeEntry(),
      heent: emptyPeEntry(),
      respiratory: emptyPeEntry(),
      cardiac: emptyPeEntry(),
      abdominal: emptyPeEntry(),
      pelvisGu: emptyPeEntry(),
      neurologic: emptyPeEntry(),
      psychiatric: emptyPeEntry(),
      musculoskeletal: emptyPeEntry(),
      skin: emptyPeEntry()
    },
    additionalInterventions: {
      medsBronchodilators: false,
      medsEpinephrine: false,
      medsAspirin: false,
      medsSeizureMedication: false,
      medsAnalgesia: false,
      medsIvFluidInfusion: false,
      medsOther: '',
      procWoundBandaging: false,
      procBurnDressing: false,
      procSplintingReduction: false,
      procPelvicStabilization: false,
      procEcg: false,
      procOther: ''
    },
    assessmentAndPlan: {
      summary: '',
      differential: '',
      presumptiveDiagnoses: ''
    },
    reassessments: [],
    disposition: {
      disposition: '',
      handoverTime: '',
      handoverToName: '',
      handoverToCadre: '',
      handoverToSignature: '',
      finalVitals: {
        time: '',
        hr: null,
        rr: null,
        tempC: null,
        bp: '',
        spo2: null,
        spo2OnOxygen: ''
      },
      planDiscussedWithPatient: '',
      providerName: '',
      providerSignature: '',
      providerSignatureDate: ''
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

/** True if any breathing/oxygen/ventilation intervention has been recorded. */
function hasBreathingIntervention(data) {
  const b = data.breathing;
  return (
    hasNumber(b.oxygenLitres) ||
    b.oxygenNasalCannula ||
    b.oxygenFaceMask ||
    b.oxygenNonRebreather ||
    b.oxygenBvm ||
    b.oxygenBipapCpap ||
    hasText(b.oxygenOther)
  );
}

/** True if any IV/IO access or fluid bolus has been recorded. */
function hasIvAccessOrFluids(data) {
  const c = data.circulation;
  return (
    hasText(c.accessIvSite) ||
    hasText(c.accessIoSite) ||
    hasNumber(c.ivfMls) ||
    c.ivfNs ||
    c.ivfLr ||
    hasText(c.ivfOther)
  );
}

/** GCS total or null when any component is missing. */
function gcsTotal(data) {
  const d = data.disability;
  if (hasNumber(d.gcsEye) && hasNumber(d.gcsVerbal) && hasNumber(d.gcsMotor)) {
    return d.gcsEye + d.gcsVerbal + d.gcsMotor;
  }
  return null;
}

/** Human-readable label for a SectionKey. */
function sectionLabel(section) {
  switch (section) {
    case 'callerAndScene': return 'Caller & Scene';
    case 'chiefComplaintAndVitals': return 'Chief Complaint & Vitals';
    case 'highRiskSigns': return 'High Risk Signs';
    case 'triage': return 'Triage';
    case 'airway': return 'Airway (A)';
    case 'breathing': return 'Breathing (B)';
    case 'circulation': return 'Circulation (C)';
    case 'disability': return 'Disability (D)';
    case 'exposure': return 'Exposure (E)';
    case 'sampleHistory': return 'SAMPLE History';
    case 'injuryDetails': return 'Injury Details';
    case 'physicalExam': return 'Physical Exam';
    case 'additionalInterventions': return 'Additional Interventions';
    case 'assessmentAndPlan': return 'Assessment & Plan';
    case 'reassessments': return 'Reassessment';
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

export { emptyAssessment, emptyReassessment, hasText, hasNumber, isYesNoAnswered, hasAirwayIntervention, hasBreathingIntervention, hasIvAccessOrFluids, gcsTotal, sectionLabel, priorityLabel };
