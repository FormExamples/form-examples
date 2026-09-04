// Medical Information Form for Air Travel (MEDIF) — pure fitness-to-fly
// engine. Extracted verbatim from form-app.js so it can be imported headless
// (bin/test-engines, bin/test-personas) as well as by the wizard.
//
// Mirrors the SvelteKit engine (`composite-grader.ts` + rule modules): a
// max-grade engine where the worst-band finding sets the overall band
// ('fit' by default), plus prioritised safety flags and the medical-desk
// recommendation. No DOM, no side effects; the only impurity is that the
// "days ago" rules and the 10-day validity window read the wall clock.

// Priority order used by the max-grade engine. Worst band wins.
const BAND_RANK = {
  'fit': 0,
  'fit-with-conditions': 1,
  'requires-review': 2,
  'unfit-to-fly': 3
};

const BAND_LABEL = {
  'fit': 'Fit to fly',
  'fit-with-conditions': 'Fit with conditions',
  'requires-review': 'Requires airline-medical-desk review',
  'unfit-to-fly': 'Unfit to fly'
};

const BAND_DESK_RECOMMENDATION = {
  'fit': 'Proceed; no medical clearance needed beyond this form.',
  'fit-with-conditions':
    'Clear with documented conditions (oxygen flow rate, seat allocation, etc.).',
  'requires-review':
    'Submit to airline medical desk; senior physician review required.',
  'unfit-to-fly':
    'Do not fly until reassessed by the treating physician.'
};

// Every field name expected by the engine and persisted state. Used by
// `collectFormData()` to drive a deterministic order and by progress
// tracking to know how many fields are total.
const FIELD_NAMES = [
  // Step 1
  'submitterName','submitterRole','submitterEmail','submitterPhone',
  'submitterOrganisation','airlineBookingReference',
  // Step 2
  'passengerName','passengerDateOfBirth','passengerSex',
  'passengerNationality','passengerPassportNumber',
  'passengerNationalHealthId','passengerAddress','emergencyContact',
  // Step 3
  'airlineIataCode','airlineName','outboundFlightNumber','outboundDate',
  'outboundOriginIata','outboundDestinationIata','returnFlightNumber',
  'returnDate','cabinClass','sectorDurationMinutes',
  'transitAirportsIata','specialAssistanceCodes',
  // Step 4
  'reasonEquipment','reasonRecentAcuteEvent','reasonUnstableCondition',
  'reasonCommunicableDisease','reasonPregnancy','reasonMobilityEscort',
  'reasonPsychiatric',
  // Step 5
  'physicianName','physicianSpecialty','physicianRegistrationNumber',
  'physicianClinic','physicianEmail','physicianPhone','physicianAddress',
  // Step 6
  'primaryDiagnosis','icd10Codes','diagnosisDate','currentTreatment',
  'lastAdmissionDate','lastDischargeDate','lastSpecialistReviewDate',
  // Step 7
  'restingSystolicBp','restingDiastolicBp','restingHeartRate','nyhaClass',
  'recentMiDate','recentStentDate','onAnticoagulant','pacemakerOrIcd',
  'unstableAngina','exerciseToleranceMetres',
  // Step 8
  'restingSpo2Percent','predictedInflightSpo2Percent',
  'hypoxicChallengeResult','recentPneumothoraxDate','asthmaSeverity',
  'copdSeverity','cpapOrBipapUse','recentPulmonaryEmbolismDate',
  // Step 9
  'lastSurgeryDate','lastSurgerySite','cabinGasRisk',
  'recentFractureCast','recentDvtDate','scubaDivingWithin24h',
  'recentStrokeDate',
  // Step 10
  'isPregnant','gestationWeeks','pregnancyType',
  'pregnancyComplications','expectedDeliveryDate','obstetricianContact',
  // Step 11
  'communicableDiseaseStatus','lastSymptomDate','isolationRequired',
  'vaccinationStatus','currentAntimicrobials',
  // Step 12
  'requiresSupplementalOxygen','oxygenFlowRateLpm','oxygenDuration',
  'requiresPoc','pocMakeModel','pocBatteryHours',
  'requiresStretcher','requiresIncubator','requiresIvPump',
  'requiresMedicalEscort','requiresExtraSeat',
  'requiresAccessibleLavatory','wheelchairType','accompanyingCarer',
  // Step 13
  'regularMedications','controlledDrugs',
  'dangerousGoodsBatteryDeclaration','sharpsInCabin',
  'refrigeratedMedication','customsDocumentationAvailable',
  'haemoglobinGPerL',
  // Step 14
  'physicianDeclaration','physicianSignatureName',
  'physicianSignatureDate','validUntilDate','additionalNotes'
];

const NUMERIC_FIELDS = [
  'sectorDurationMinutes','restingSystolicBp','restingDiastolicBp',
  'restingHeartRate','exerciseToleranceMetres','restingSpo2Percent',
  'predictedInflightSpo2Percent','gestationWeeks','oxygenFlowRateLpm',
  'pocBatteryHours','haemoglobinGPerL'
];

function isNumericField(name) {
  return NUMERIC_FIELDS.indexOf(name) !== -1;
}

function isDateField(name) {
  return /Date$/.test(name);
}

/**
 * Build a fresh, fully-blank MEDIF in the flat shape form-app.js's
 * collectFormData() produces and evaluateFitness() consumes: every
 * FIELD_NAMES entry present, '' for text / enum fields and null for numeric
 * and date fields. `evaluateFitness(emptyMedif())` is the 'fit' baseline.
 */
function emptyMedif() {
  const out = {};
  for (const name of FIELD_NAMES) {
    out[name] = isNumericField(name) || isDateField(name) ? null : '';
  }
  return out;
}

function isAnswered(name, value) {
  if (isNumericField(name)) {
    return value !== null && value !== undefined && !Number.isNaN(value);
  }
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function answeredCount(data) {
  let n = 0;
  for (const name of FIELD_NAMES) {
    if (isAnswered(name, data[name])) n += 1;
  }
  return n;
}

/** Days between an ISO yyyy-mm-dd string and today; null if not parseable. */
function daysAgo(isoDate) {
  if (!isoDate) return null;
  const then = new Date(isoDate + 'T00:00:00Z');
  if (isNaN(then.getTime())) return null;
  const now = new Date();
  const ms = now.getTime() - then.getTime();
  return Math.floor(ms / 86400000);
}

/** Add N days to today's ISO date. */
function isoToday(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + (offsetDays || 0));
  return d.toISOString().slice(0, 10);
}

function worseBand(a, b) {
  return BAND_RANK[a] >= BAND_RANK[b] ? a : b;
}

/**
 * Apply the airline-aligned MEDIF rules from ../AGENTS.md.
 * Max-grade: worst-band finding sets the overall band. Default is 'fit'.
 * Returns { band, firedRules, safetyFlags, deskRecommendation, validUntil }.
 */
function evaluateFitness(d) {
  let band = 'fit';
  const firedRules = [];
  const safetyFlags = [];

  function fire(id, ruleBand, description) {
    firedRules.push({ id, band: ruleBand, description });
    band = worseBand(band, ruleBand);
  }
  function flag(id, priority, category, message) {
    safetyFlags.push({ id, priority, category, message });
  }

  // --- Cardiac ---
  const miDays = daysAgo(d.recentMiDate);
  if (miDays !== null && miDays <= 7) {
    fire('R-CARDIAC-MI-7D', 'unfit-to-fly',
      `Acute MI within 7 days (${miDays}d ago).`);
    flag('F-CARDIAC-MI', 'high', 'cardiac',
      'Acute myocardial infarction within 7 days.');
  } else if (miDays !== null && miDays <= 14) {
    fire('R-CARDIAC-MI-14D', 'requires-review',
      `Recent MI within 14 days (${miDays}d ago).`);
    flag('F-CARDIAC-MI-RECENT', 'medium', 'cardiac',
      'Myocardial infarction 8-14 days ago.');
  }
  if (d.unstableAngina === 'yes') {
    fire('R-CARDIAC-UNSTABLE-ANGINA', 'requires-review',
      'Unstable angina present.');
    flag('F-CARDIAC-UNSTABLE-ANGINA', 'medium', 'cardiac',
      'Unstable angina — cabin hypoxia may provoke ischaemia.');
  }
  if (d.nyhaClass === 'IV') {
    fire('R-CARDIAC-NYHA-IV', 'unfit-to-fly',
      'NYHA class IV — symptoms at rest.');
    flag('F-CARDIAC-NYHA-IV', 'high', 'cardiac',
      'NYHA functional class IV.');
  } else if (d.nyhaClass === 'III') {
    fire('R-CARDIAC-NYHA-III', 'requires-review',
      'NYHA class III — marked limitation.');
  }

  // --- Pulmonary ---
  const pneumoDays = daysAgo(d.recentPneumothoraxDate);
  if (pneumoDays !== null && pneumoDays <= 14) {
    fire('R-PULM-PNEUMOTHORAX-14D', 'unfit-to-fly',
      `Pneumothorax within 14 days (${pneumoDays}d ago).`);
    flag('F-PULM-PNEUMOTHORAX', 'high', 'pulmonary',
      'Cabin pressure expands trapped air; pneumothorax within 14 days.');
  }
  if (d.restingSpo2Percent !== null && d.restingSpo2Percent < 85) {
    fire('R-PULM-SPO2-LT-85', 'unfit-to-fly',
      `Resting SpO2 ${d.restingSpo2Percent}% on room air < 85%.`);
    flag('F-PULM-HYPOXAEMIA', 'high', 'pulmonary',
      'Severe resting hypoxaemia on room air.');
  } else if (d.restingSpo2Percent !== null && d.restingSpo2Percent < 92) {
    fire('R-PULM-SPO2-LT-92', 'requires-review',
      `Resting SpO2 ${d.restingSpo2Percent}% suggests in-flight supplementation needed.`);
    flag('F-PULM-LOW-SPO2', 'medium', 'pulmonary',
      'Borderline room-air saturation; consider in-flight O2.');
  }
  if (d.hypoxicChallengeResult === 'fail') {
    fire('R-PULM-HCT-FAIL', 'requires-review',
      'Hypoxic challenge test: fail.');
  }
  if (d.copdSeverity === 'severe') {
    fire('R-PULM-COPD-SEVERE', 'requires-review',
      'Severe COPD.');
    flag('F-PULM-COPD-SEVERE', 'medium', 'pulmonary',
      'Severe COPD — review oxygen prescription for cruise altitude.');
  }
  if (d.asthmaSeverity === 'severe-uncontrolled') {
    fire('R-PULM-ASTHMA-SEVERE', 'requires-review',
      'Severe uncontrolled asthma.');
    flag('F-PULM-ASTHMA-SEVERE', 'medium', 'pulmonary',
      'Severe uncontrolled asthma.');
  } else if (d.asthmaSeverity === 'mild-controlled') {
    flag('F-PULM-ASTHMA-MILD', 'low', 'pulmonary',
      'Mild controlled asthma — carry reliever in cabin.');
  }
  const peDays = daysAgo(d.recentPulmonaryEmbolismDate);
  if (peDays !== null && peDays <= 42) {
    fire('R-PULM-PE-6WK', 'requires-review',
      `Pulmonary embolism within 6 weeks (${peDays}d ago).`);
    flag('F-PULM-PE', 'medium', 'pulmonary',
      'Recent pulmonary embolism within 6 weeks.');
  }

  // --- Gas expansion / surgery / fracture ---
  const surgeryDays = daysAgo(d.lastSurgeryDate);
  if (d.cabinGasRisk === 'intra-ocular-gas' ||
      d.cabinGasRisk === 'intra-cranial-gas' ||
      d.cabinGasRisk === 'intra-abdominal-gas') {
    fire('R-GAS-CAVITY', 'unfit-to-fly',
      `Trapped gas (${d.cabinGasRisk}) — cabin pressure expansion risk.`);
    flag('F-GAS-CAVITY', 'high', 'gas-expansion',
      'Trapped gas in body cavity; cabin pressure causes expansion.');
  } else if (d.cabinGasRisk === 'pneumothorax') {
    flag('F-GAS-PNEUMO', 'high', 'gas-expansion',
      'Pneumothorax noted as cabin gas-expansion risk.');
    band = worseBand(band, 'unfit-to-fly');
    firedRules.push({ id: 'R-GAS-PNEUMO', band: 'unfit-to-fly',
      description: 'Pneumothorax noted as cabin gas-expansion risk.' });
  } else if (d.cabinGasRisk === 'plaster-cast') {
    fire('R-GAS-CAST', 'requires-review',
      'Plaster cast — risk of expansion under cabin pressure; bivalve may be required.');
    flag('F-GAS-CAST', 'medium', 'gas-expansion',
      'Plaster cast — bivalve or split before flight.');
  }
  if (surgeryDays !== null && surgeryDays <= 10) {
    fire('R-SURG-RECENT-10D', 'requires-review',
      `Recent surgery within 10 days (${surgeryDays}d ago).`);
    flag('F-SURG-RECENT', 'medium', 'surgery',
      'Recent surgery within 10 days.');
  } else if (surgeryDays !== null && surgeryDays <= 14) {
    flag('F-SURG-2WK', 'medium', 'surgery',
      'Surgery 11-14 days ago.');
  }
  if (d.recentFractureCast === 'yes') {
    flag('F-MSK-FRACTURE', 'low', 'mobility',
      'Recent fracture with cast.');
  }
  const dvtDays = daysAgo(d.recentDvtDate);
  if (dvtDays !== null && dvtDays <= 28) {
    fire('R-DVT-RECENT', 'requires-review',
      `Recent DVT within 4 weeks (${dvtDays}d ago).`);
    flag('F-DVT', 'medium', 'haematology',
      'Recent deep vein thrombosis.');
  }
  if (d.scubaDivingWithin24h === 'yes') {
    fire('R-SCUBA-24H', 'unfit-to-fly',
      'Scuba diving within 24 hours of departure.');
    flag('F-SCUBA', 'high', 'gas-expansion',
      'Scuba diving within 24h — decompression-sickness risk.');
  }
  const strokeDays = daysAgo(d.recentStrokeDate);
  if (strokeDays !== null && strokeDays <= 10) {
    fire('R-STROKE-10D', 'requires-review',
      `Recent stroke within 10 days (${strokeDays}d ago).`);
    flag('F-STROKE', 'medium', 'cardiac',
      'Recent stroke within 10 days.');
  }

  // --- Pregnancy ---
  if (d.isPregnant === 'yes' && d.gestationWeeks !== null) {
    const gw = d.gestationWeeks;
    const isSingleton = d.pregnancyType === 'singleton' || d.pregnancyType === '';
    if (isSingleton && gw > 36) {
      fire('R-PREG-SINGLETON-GT-36', 'unfit-to-fly',
        `Singleton pregnancy ${gw} weeks (> 36).`);
      flag('F-PREG-LATE', 'high', 'pregnancy',
        'Late singleton pregnancy beyond 36 weeks.');
    } else if (!isSingleton && gw > 32) {
      fire('R-PREG-MULTIPLE-GT-32', 'unfit-to-fly',
        `Multiple pregnancy ${gw} weeks (> 32).`);
      flag('F-PREG-MULTIPLE-LATE', 'high', 'pregnancy',
        'Late multiple pregnancy beyond 32 weeks.');
    } else if (isSingleton && gw >= 28) {
      fire('R-PREG-SINGLETON-28-36', 'requires-review',
        `Singleton pregnancy ${gw} weeks (28-36) — physician certificate required.`);
      flag('F-PREG-CERT', 'medium', 'pregnancy',
        'Late pregnancy — airline pregnancy certificate required.');
    } else if (!isSingleton && gw >= 24) {
      fire('R-PREG-MULTIPLE-24-32', 'requires-review',
        `Multiple pregnancy ${gw} weeks (24-32) — physician certificate required.`);
      flag('F-PREG-MULTIPLE-CERT', 'medium', 'pregnancy',
        'Multiple pregnancy late stage — certificate required.');
    }
  }

  // --- Communicable disease ---
  if (d.communicableDiseaseStatus === 'infectious') {
    fire('R-COMM-INFECTIOUS', 'unfit-to-fly',
      'Active communicable disease in infectious period.');
    flag('F-COMM-INFECTIOUS', 'high', 'communicable',
      'Contagious communicable disease.');
  } else if (d.communicableDiseaseStatus === 'convalescent') {
    fire('R-COMM-CONVALESCENT', 'requires-review',
      'Convalescent communicable disease.');
    flag('F-COMM-CONVALESCENT', 'medium', 'communicable',
      'Convalescent communicable disease.');
  }

  // --- Anaemia ---
  if (d.haemoglobinGPerL !== null && d.haemoglobinGPerL < 75) {
    fire('R-ANAEMIA-SEVERE', 'unfit-to-fly',
      `Severe anaemia: Hb ${d.haemoglobinGPerL} g/L (< 75).`);
    flag('F-ANAEMIA', 'high', 'anaemia',
      'Severe anaemia Hb < 75 g/L.');
  } else if (d.haemoglobinGPerL !== null && d.haemoglobinGPerL < 85) {
    fire('R-ANAEMIA-MOD', 'requires-review',
      `Moderate anaemia: Hb ${d.haemoglobinGPerL} g/L.`);
    flag('F-ANAEMIA-MOD', 'medium', 'anaemia',
      'Moderate anaemia.');
  }

  // --- Equipment ---
  if (d.requiresSupplementalOxygen === 'yes') {
    const flow = d.oxygenFlowRateLpm;
    if (flow !== null && flow > 4) {
      fire('R-O2-GT-4LPM', 'requires-review',
        `Supplemental oxygen ${flow} L/min > 4 L/min sustained.`);
      flag('F-O2-HIGH-FLOW', 'high', 'equipment',
        'High-flow oxygen request; dangerous-goods declaration required.');
    } else {
      fire('R-O2-LOW-FLOW', 'fit-with-conditions',
        `Supplemental oxygen ${flow == null ? 'requested' : flow + ' L/min'}.`);
    }
  }
  if (d.requiresPoc === 'yes') {
    fire('R-POC', 'fit-with-conditions',
      'Portable oxygen concentrator in cabin.');
    flag('F-POC', 'low', 'equipment',
      'POC — confirm IATA-approved device and adequate batteries.');
    // Battery hours must exceed sector duration + 50%.
    if (d.pocBatteryHours !== null && d.sectorDurationMinutes !== null) {
      const requiredHours = (d.sectorDurationMinutes / 60) * 1.5;
      if (d.pocBatteryHours < requiredHours) {
        fire('R-POC-BATTERY-INSUFFICIENT', 'requires-review',
          `POC battery ${d.pocBatteryHours}h < required ${requiredHours.toFixed(1)}h (sector + 50%).`);
        flag('F-POC-BATTERY', 'high', 'equipment',
          'POC battery insufficient for sector duration + 50% margin.');
      }
    }
  }
  if (d.requiresStretcher === 'yes') {
    fire('R-STRETCHER', 'requires-review',
      'Stretcher requested — sector-specific airline approval required.');
    flag('F-STRETCHER', 'medium', 'equipment',
      'Stretcher requires advance airline approval.');
  }
  if (d.requiresIncubator === 'yes') {
    fire('R-INCUBATOR', 'requires-review',
      'Infant incubator requested.');
    flag('F-INCUBATOR', 'medium', 'equipment',
      'Infant incubator requires advance airline approval.');
  }
  if (d.requiresIvPump === 'yes') {
    fire('R-IV-PUMP', 'requires-review',
      'IV pump in cabin.');
    flag('F-IV-PUMP', 'medium', 'equipment',
      'IV pump — dangerous-goods battery declaration.');
  }
  if (d.dangerousGoodsBatteryDeclaration === 'yes') {
    fire('R-DG-BATTERY', 'requires-review',
      'Dangerous-goods battery declaration required.');
    flag('F-DG-BATTERY', 'medium', 'equipment',
      'IATA Dangerous Goods Regulations battery declaration.');
  }
  if (d.requiresMedicalEscort === 'yes') {
    flag('F-ESCORT', 'low', 'mobility',
      'Medical escort accompanies passenger.');
  }
  if (d.wheelchairType === 'WCHC') {
    flag('F-WCHC', 'low', 'mobility',
      'WCHC — passenger needs cabin-level wheelchair assistance.');
  }

  // --- Submitter / coverage ---
  if (d.reasonPsychiatric === 'yes') {
    fire('R-PSYCH', 'requires-review',
      'Recent psychiatric event requiring clearance.');
    flag('F-PSYCH', 'medium', 'psychiatric',
      'Psychiatric clearance required.');
  }

  // Sort flags by priority high > medium > low.
  const pRank = { high: 0, medium: 1, low: 2 };
  safetyFlags.sort((a, b) => pRank[a.priority] - pRank[b.priority]);

  // Sort fired rules by band severity (worst first).
  firedRules.sort((a, b) => BAND_RANK[b.band] - BAND_RANK[a.band]);

  return {
    band,
    firedRules,
    safetyFlags,
    deskRecommendation: BAND_DESK_RECOMMENDATION[band],
    validUntil: isoToday(10) // typical 10-day validity window
  };
}

export {
  BAND_RANK, BAND_LABEL, BAND_DESK_RECOMMENDATION, FIELD_NAMES,
  emptyMedif, isNumericField, isDateField, isAnswered, answeredCount,
  daysAgo, isoToday, worseBand, evaluateFitness
};
