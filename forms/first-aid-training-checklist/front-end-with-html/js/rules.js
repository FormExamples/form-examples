// First Aid at Work (FAW) Competency Assessment checklist rules (declarative).
//
// Each rule maps a single observed skill to a tri-state value:
//   'yes' = demonstrated correctly (passes the rule)
//   'no'  = not yet demonstrated (deficiency)
//   'na'  = not assessed in this session (excluded from grading)
//   ''    = examiner has not yet recorded an answer (excluded)
//
// Critical life-saving skills (per HSE / St John): any 'no' on a rule with
// critical=true forces an overall Fail. Non-critical 'no' answers are
// counted as deficiencies; 1-2 deficiencies → Needs Development; 3 or
// more → Fail.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').TriState} TriState
 *
 * @typedef {Object} FawRule
 * @property {string} id
 * @property {number} step
 * @property {string} category
 * @property {string} label
 * @property {boolean} critical
 * @property {TriState} defaultExpectation
 * @property {(d: AssessmentData) => TriState} evaluate
 */

/**
 * Helper: read a tri-state field, normalising missing/unknown values.
 * @param {AssessmentData} d
 * @param {string} section
 * @param {string} field
 * @returns {TriState}
 */
function read(d, section, field) {
  const v = d[section] && d[section][field];
  if (v === 'yes' || v === 'no' || v === 'na') return v;
  return '';
}

/** @type {FawRule[]} */
const fawRules = [
  // --- Step 2: Scene Assessment & Safety ---------------------------------
  {
    id: 'FAW-SS-SAFE',
    step: 2,
    category: 'Scene Safety',
    label: 'Confirms the scene is safe before approaching the casualty.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'sceneAssessmentSafety', 'sceneSafe')
  },
  {
    id: 'FAW-SS-PPE',
    step: 2,
    category: 'Scene Safety',
    label: 'Applies appropriate personal protective equipment (gloves, face shield).',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'sceneAssessmentSafety', 'ppeApplied')
  },
  {
    id: 'FAW-SS-HAZARDS',
    step: 2,
    category: 'Scene Safety',
    label: 'Identifies and mitigates environmental hazards (traffic, electricity, chemicals).',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'sceneAssessmentSafety', 'hazardsIdentified')
  },
  {
    id: 'FAW-SS-BYSTANDERS',
    step: 2,
    category: 'Scene Safety',
    label: 'Manages bystanders so they do not impede care or compromise safety.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'sceneAssessmentSafety', 'bystandersControlled')
  },

  // --- Step 3: Primary Survey (DRABC) ------------------------------------
  {
    id: 'FAW-PS-DANGER',
    step: 3,
    category: 'Primary Survey',
    label: 'D — checks for Danger to self, casualty, and bystanders.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'primarySurveyDRABC', 'dangerCheck')
  },
  {
    id: 'FAW-PS-RESPONSE',
    step: 3,
    category: 'Primary Survey',
    label: 'R — assesses Response using AVPU / shake-and-shout.',
    critical: true,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'primarySurveyDRABC', 'responseCheck')
  },
  {
    id: 'FAW-PS-AIRWAY',
    step: 3,
    category: 'Primary Survey',
    label: 'A — opens and clears Airway with head tilt-chin lift (or jaw thrust).',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'primarySurveyDRABC', 'airwayManagement')
  },
  {
    id: 'FAW-PS-BREATHING',
    step: 3,
    category: 'Primary Survey',
    label: 'B — checks Breathing (look, listen, feel) for up to 10 seconds.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'primarySurveyDRABC', 'breathingCheck')
  },
  {
    id: 'FAW-PS-CIRCULATION',
    step: 3,
    category: 'Primary Survey',
    label: 'C — assesses Circulation and obvious life-threatening bleeding.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'primarySurveyDRABC', 'circulationAssessment')
  },
  {
    id: 'FAW-PS-RECOVERY',
    step: 3,
    category: 'Primary Survey',
    label: 'Places unconscious-but-breathing casualty in the recovery position.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'primarySurveyDRABC', 'recoveryPositionWhenAppropriate')
  },

  // --- Step 4: CPR & AED -------------------------------------------------
  {
    id: 'FAW-CPR-COMPRESSIONS',
    step: 4,
    category: 'CPR & AED',
    label: 'Delivers effective chest compressions at 100-120/min, 5-6 cm depth.',
    critical: true,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'cprAed', 'effectiveCompressions')
  },
  {
    id: 'FAW-CPR-VENTILATIONS',
    step: 4,
    category: 'CPR & AED',
    label: 'Delivers effective rescue breaths producing visible chest rise.',
    critical: true,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'cprAed', 'effectiveVentilations')
  },
  {
    id: 'FAW-CPR-RATIO',
    step: 4,
    category: 'CPR & AED',
    label: 'Maintains a 30:2 compression-to-ventilation ratio.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'cprAed', 'ratio30to2')
  },
  {
    id: 'FAW-AED-POWER',
    step: 4,
    category: 'CPR & AED',
    label: 'Powers on the AED as soon as it is available and follows voice prompts.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'cprAed', 'aedPowerOnPromptly')
  },
  {
    id: 'FAW-AED-PADS',
    step: 4,
    category: 'CPR & AED',
    label: 'Places AED pads in correct anterolateral position on bare chest.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'cprAed', 'aedPadPlacement')
  },
  {
    id: 'FAW-AED-SAFE-SHOCK',
    step: 4,
    category: 'CPR & AED',
    label: 'Delivers shock safely with verbal "stand clear" — no unsafe contact.',
    critical: true,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'cprAed', 'aedSafeShockDelivery')
  },

  // --- Step 5: Choking Management ----------------------------------------
  {
    id: 'FAW-CHOKE-COUGH',
    step: 5,
    category: 'Choking',
    label: 'Encourages an effective cough first when the airway is partially obstructed.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'chokingManagement', 'encouragedCoughing')
  },
  {
    id: 'FAW-CHOKE-BACKBLOWS',
    step: 5,
    category: 'Choking',
    label: 'Delivers up to 5 firm back blows between the shoulder blades.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'chokingManagement', 'fiveBackBlows')
  },
  {
    id: 'FAW-CHOKE-THRUSTS',
    step: 5,
    category: 'Choking',
    label: 'Delivers up to 5 abdominal thrusts (Heimlich) with correct hand position.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'chokingManagement', 'fiveAbdominalThrusts')
  },
  {
    id: 'FAW-CHOKE-ALTERNATE',
    step: 5,
    category: 'Choking',
    label: 'Alternates back blows and abdominal thrusts until obstruction is dislodged.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'chokingManagement', 'alternatesUntilDislodged')
  },
  {
    id: 'FAW-CHOKE-UNCONSCIOUS',
    step: 5,
    category: 'Choking',
    label: 'Begins CPR immediately if the choking casualty becomes unconscious.',
    critical: true,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'chokingManagement', 'unconsciousChokingCpr')
  },

  // --- Step 6: Bleeding & Wound Care -------------------------------------
  {
    id: 'FAW-BLEED-PRESSURE',
    step: 6,
    category: 'Bleeding',
    label: 'Applies firm direct pressure to control major external bleeding.',
    critical: true,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'bleedingWoundCare', 'directPressureApplied')
  },
  {
    id: 'FAW-BLEED-ELEVATE',
    step: 6,
    category: 'Bleeding',
    label: 'Elevates and immobilises the injured part where appropriate.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'bleedingWoundCare', 'elevatedAndImmobilised')
  },
  {
    id: 'FAW-BLEED-DRESSING',
    step: 6,
    category: 'Bleeding',
    label: 'Applies a sterile dressing and bandage with appropriate pressure.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'bleedingWoundCare', 'appliedDressingCorrectly')
  },
  {
    id: 'FAW-BLEED-TOURNIQUET',
    step: 6,
    category: 'Bleeding',
    label: 'Applies a tourniquet correctly for catastrophic limb haemorrhage when indicated.',
    critical: true,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'bleedingWoundCare', 'tourniquetWhenIndicated')
  },
  {
    id: 'FAW-BLEED-HAEMOSTATIC',
    step: 6,
    category: 'Bleeding',
    label: 'Applies haemostatic dressing/wound packing for junctional haemorrhage.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'bleedingWoundCare', 'haemostaticDressingApplied')
  },
  {
    id: 'FAW-BLEED-SHOCK',
    step: 6,
    category: 'Bleeding',
    label: 'Treats casualty for shock (lay flat, raise legs, keep warm).',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'bleedingWoundCare', 'treatedForShock')
  },

  // --- Step 7: Burns & Scalds --------------------------------------------
  {
    id: 'FAW-BURN-COOL',
    step: 7,
    category: 'Burns & Scalds',
    label: 'Cools the burn with running cool water for at least 20 minutes.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'burnsScalds', 'cooledForTwentyMinutes')
  },
  {
    id: 'FAW-BURN-REMOVE',
    step: 7,
    category: 'Burns & Scalds',
    label: 'Removes jewellery and loose clothing before swelling — but not stuck items.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'burnsScalds', 'removedJewelleryAndLooseClothing')
  },
  {
    id: 'FAW-BURN-COVER',
    step: 7,
    category: 'Burns & Scalds',
    label: 'Covers the burn loosely with cling film or a sterile non-adherent dressing.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'burnsScalds', 'coveredWithClingFilmOrSterileDressing')
  },
  {
    id: 'FAW-BURN-NOCREAM',
    step: 7,
    category: 'Burns & Scalds',
    label: 'Avoids applying creams, butter, ice, or bursting blisters.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'burnsScalds', 'avoidedCreamsOrIce')
  },
  {
    id: 'FAW-BURN-REFER',
    step: 7,
    category: 'Burns & Scalds',
    label: 'Refers serious burns to hospital (size, depth, age, location criteria).',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'burnsScalds', 'referredAppropriately')
  },

  // --- Step 8: Fractures, Sprains & Spinal Injury ------------------------
  {
    id: 'FAW-FX-IMMOB',
    step: 8,
    category: 'Fractures & Spinal',
    label: 'Immobilises a suspected fracture in the position found.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'fracturesSprainsSpinal', 'immobilisedInjuredLimb')
  },
  {
    id: 'FAW-FX-RICE',
    step: 8,
    category: 'Fractures & Spinal',
    label: 'Applies RICE (Rest, Ice, Compression, Elevation) for sprains and strains.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'fracturesSprainsSpinal', 'appliedRiceForSprains')
  },
  {
    id: 'FAW-FX-SPINAL-SUPPORT',
    step: 8,
    category: 'Fractures & Spinal',
    label: 'Provides manual in-line head/neck support when spinal injury is suspected.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'fracturesSprainsSpinal', 'suspectedSpinalManualSupport')
  },
  {
    id: 'FAW-FX-LOGROLL',
    step: 8,
    category: 'Fractures & Spinal',
    label: 'Performs a coordinated log roll with team members where indicated.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'fracturesSprainsSpinal', 'performedLogRollWithTeam')
  },
  {
    id: 'FAW-FX-NOMOVE',
    step: 8,
    category: 'Fractures & Spinal',
    label: 'Avoids unnecessary movement of suspected spinal or unstable fractures.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'fracturesSprainsSpinal', 'avoidedUnnecessaryMovement')
  },

  // --- Step 9: Medical Emergencies ---------------------------------------
  {
    id: 'FAW-MED-ANAPHYLAXIS',
    step: 9,
    category: 'Medical Emergencies',
    label: 'Recognises anaphylaxis (airway / breathing / circulation symptoms).',
    critical: true,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'medicalEmergencies', 'recognisedAnaphylaxis')
  },
  {
    id: 'FAW-MED-EPIPEN',
    step: 9,
    category: 'Medical Emergencies',
    label: 'Administers an EpiPen / adrenaline auto-injector safely into the outer thigh.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'medicalEmergencies', 'administeredEpiPenSafely')
  },
  {
    id: 'FAW-MED-ASTHMA',
    step: 9,
    category: 'Medical Emergencies',
    label: 'Assists casualty with a reliever inhaler during an asthma attack.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'medicalEmergencies', 'assistedAsthmaInhaler')
  },
  {
    id: 'FAW-MED-HYPO',
    step: 9,
    category: 'Medical Emergencies',
    label: 'Manages hypoglycaemia with sugary drink/glucose if conscious.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'medicalEmergencies', 'managedHypoglycaemia')
  },
  {
    id: 'FAW-MED-SEIZURE',
    step: 9,
    category: 'Medical Emergencies',
    label: 'Manages a seizure: protect head, time the seizure, recovery position after.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'medicalEmergencies', 'managedSeizureSafely')
  },
  {
    id: 'FAW-MED-STROKE',
    step: 9,
    category: 'Medical Emergencies',
    label: 'Recognises stroke using FAST (Face, Arms, Speech, Time).',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'medicalEmergencies', 'recognisedStrokeFAST')
  },
  {
    id: 'FAW-MED-CHEST-PAIN',
    step: 9,
    category: 'Medical Emergencies',
    label: 'Recognises chest pain / suspected MI and provides appropriate care.',
    critical: false,
    defaultExpectation: 'yes',
    evaluate: (d) => read(d, 'medicalEmergencies', 'recognisedChestPain')
  }
];

export { fawRules };
