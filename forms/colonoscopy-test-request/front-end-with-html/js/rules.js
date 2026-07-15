// Four-axis rule catalogue for the Colonoscopy Test Request engine.
//
// Derived from index.md and sql/05: (A) appropriateness 1-9 + band by
// indication x procedure; (B) cancer-pathway urgency tier
// routine / urgent / two-week-wait / emergency, with NICE NG12 / DG56
// two-week-wait eligibility (FIT >= 10 ug Hb/g or a lower-GI red-flag
// combination) and emergency auto-escalation; (C) request completeness over
// mandatory fields; (D) pre-procedure risk band from anticoagulant /
// antiplatelet stratification, bowel-prep fitness, and ASA grade. Rule IDs are
// stable and identical across every front-end and the back-end
// (R-APPROP-*, R-URGENCY-*, R-COMPLETE-*, R-RISK-*). Pure data + helpers; the
// grader composes them.
//
// Wrapped in an IIFE; published via `window.ColonoscopyTestRequest`.

// NICE DG56: a FIT result at or above this threshold (micrograms of
// haemoglobin per gram of faeces) triggers the suspected-cancer pathway.
const FIT_POSITIVE_THRESHOLD = 10;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ASGE / EPAGE / NICE 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal procedure (or set of procedures). When the
// requested procedure matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[procedure], plausible:[procedure] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_PROCEDURE_MAP = {
  'rectal-bleeding':         { ideal: ['colonoscopy', 'flexible-sigmoidoscopy'], plausible: ['ct-colonography'] },
  'change-in-bowel-habit':   { ideal: ['colonoscopy'], plausible: ['ct-colonography', 'flexible-sigmoidoscopy'] },
  'iron-deficiency-anaemia': { ideal: ['colonoscopy'], plausible: ['ct-colonography'] },
  'positive-fit':            { ideal: ['colonoscopy'], plausible: ['ct-colonography'] },
  'abdominal-mass':          { ideal: ['colonoscopy', 'ct-colonography'], plausible: ['flexible-sigmoidoscopy'] },
  'ibd-diagnosis':           { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
  'ibd-surveillance':        { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
  'polyp-surveillance':      { ideal: ['colonoscopy'], plausible: ['ct-colonography'] },
  'crc-screening':           { ideal: ['colonoscopy'], plausible: ['ct-colonography', 'flexible-sigmoidoscopy'] },
  'abnormal-imaging':        { ideal: ['colonoscopy'], plausible: ['ct-colonography'] },
  'chronic-diarrhoea':       { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
  'other':                   { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x procedure pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or procedure has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, procedure) {
  if (!indication || !procedure) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or procedure not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_PROCEDURE_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(procedure)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${procedure} is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(procedure)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${procedure} may be appropriate for "${indication}" but is not the first-line examination.`
      }
    };
  }
  if (indication === 'other') {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-OTHER',
        axis: 'appropriateness',
        category: 'other',
        description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
      }
    };
  }
  return {
    score: 2,
    band: 'usually-not-appropriate',
    firedRule: {
      ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
      axis: 'appropriateness',
      category: indication,
      description: `Requested ${procedure} is not usually appropriate for "${indication}"; query the referrer.`
    }
  };
}

/** Map a 1-9 appropriateness score to its band. */
function appropriatenessBand(score) {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Cancer-pathway urgency (NICE NG12 / DG56)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then
// suspected-cancer rules escalate it. A FIT >= 10 ug Hb/g (NICE DG56), or a
// NICE NG12 lower-GI red-flag combination, escalates to two-week-wait. An
// acute emergency presentation (emergency setting with active rectal
// bleeding) auto-escalates to emergency. The most-severe tier wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'two-week-wait', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6 weeks (routine)',
  'urgent': 'Within 2 weeks (urgent)',
  'two-week-wait': '<= 14 days (2WW suspected-cancer pathway)',
  'emergency': 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/** True when the FIT result meets the NICE DG56 positive threshold. */
function fitPositive(d) {
  const fit = d.redFlags.fitResultUgG;
  return fit !== null && fit !== undefined && fit !== '' && Number(fit) >= FIT_POSITIVE_THRESHOLD;
}

/** Count NICE NG12 lower-GI red flags present. */
function redFlagCount(d) {
  let n = 0;
  if (d.redFlags.weightLoss) n++;
  if (d.redFlags.anaemia) n++;
  if (d.redFlags.abdominalMass) n++;
  if (d.redFlags.rectalBleeding) n++;
  return n;
}

/**
 * Compute the cancer-pathway urgency tier, target timeframe, two-week-wait
 * eligibility + rationale, and fired urgency rules.
 *
 * @returns {{
 *   tier:string, targetTimeframe:string,
 *   twoWeekWaitEligible:boolean, twoWeekWaitRationale:string,
 *   firedRules:object[]
 * }}
 */
function scoreUrgency(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];
  let twoWeekWaitEligible = false;
  let twoWeekWaitRationale = '';

  // Emergency auto-escalation: acute presentation in the emergency setting
  // with active rectal bleeding.
  if (data.patient.setting === 'emergency' && data.redFlags.rectalBleeding) {
    tier = maxTier(tier, 'emergency');
    firedRules.push({
      ruleId: 'R-URGENCY-EMERGENCY-BLEED',
      axis: 'urgency',
      category: 'acute-presentation',
      description: 'Emergency setting with active rectal bleeding — auto-escalated to emergency.'
    });
  }

  // FIT >= 10 ug Hb/g (NICE DG56) -> suspected-cancer two-week-wait.
  if (fitPositive(data)) {
    tier = maxTier(tier, 'two-week-wait');
    twoWeekWaitEligible = true;
    twoWeekWaitRationale =
      `Positive FIT (${Number(data.redFlags.fitResultUgG)} ug Hb/g >= ${FIT_POSITIVE_THRESHOLD}, NICE DG56) — suspected-cancer pathway.`;
    firedRules.push({
      ruleId: 'R-URGENCY-FIT-2WW',
      axis: 'urgency',
      category: 'positive-fit',
      description: twoWeekWaitRationale
    });
  }

  // NICE NG12 lower-GI red-flag combination -> two-week-wait.
  const flagCount = redFlagCount(data);
  if (flagCount >= 2 || data.redFlags.abdominalMass) {
    tier = maxTier(tier, 'two-week-wait');
    if (!twoWeekWaitEligible) {
      twoWeekWaitEligible = true;
      twoWeekWaitRationale = data.redFlags.abdominalMass
        ? 'Palpable abdominal / rectal mass (NICE NG12) — suspected-cancer pathway.'
        : 'Lower-GI red-flag combination (NICE NG12) — suspected-cancer pathway.';
    }
    firedRules.push({
      ruleId: 'R-URGENCY-RED-FLAG-2WW',
      axis: 'urgency',
      category: 'red-flag-combination',
      description: data.redFlags.abdominalMass
        ? 'Palpable abdominal / rectal mass meets NICE NG12 two-week-wait criteria.'
        : `Lower-GI red-flag combination (${flagCount} red flags) meets NICE NG12 two-week-wait criteria.`
    });
  }

  // Indication recorded explicitly as positive FIT -> two-week-wait.
  if (data.request.primaryIndication === 'positive-fit' && !twoWeekWaitEligible) {
    tier = maxTier(tier, 'two-week-wait');
    twoWeekWaitEligible = true;
    twoWeekWaitRationale = 'Primary indication is a positive FIT — suspected-cancer pathway (NICE DG56).';
    firedRules.push({
      ruleId: 'R-URGENCY-INDICATION-FIT-2WW',
      axis: 'urgency',
      category: 'positive-fit',
      description: twoWeekWaitRationale
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-URGENCY-REQUESTED',
      axis: 'urgency',
      category: 'requested',
      description: `No suspected-cancer escalation; urgency follows the requested tier (${tier}).`
    });
  }

  if (!twoWeekWaitEligible) {
    twoWeekWaitRationale = 'Does not meet NICE NG12 / DG56 two-week-wait suspected-cancer criteria.';
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    twoWeekWaitEligible,
    twoWeekWaitRationale,
    firedRules
  };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication and clinical question are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 2, present: (d) => !!d.request.procedure, ruleId: 'R-COMPLETE-PROCEDURE', label: 'requested procedure' },
  { weight: 2, present: (d) => fitPresent(d), ruleId: 'R-COMPLETE-FIT', label: 'FIT result' },
  { weight: 1, present: (d) => !!d.fitness.asaGrade, ruleId: 'R-COMPLETE-ASA', label: 'ASA grade' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

function fitPresent(d) {
  return (
    d.redFlags.fitResultUgG !== null &&
    d.redFlags.fitResultUgG !== undefined &&
    d.redFlags.fitResultUgG !== ''
  );
}

/**
 * Compute weighted completeness 0-100 and the missing-field rules.
 *
 * @returns {{ percent:number, missing:object[] }}
 */
function scoreCompleteness(data) {
  let totalWeight = 0;
  let presentWeight = 0;
  const missing = [];
  for (const f of COMPLETENESS_FIELDS) {
    totalWeight += f.weight;
    if (f.present(data)) {
      presentWeight += f.weight;
    } else {
      missing.push({
        ruleId: f.ruleId,
        axis: 'completeness',
        category: 'missing-field',
        description: `Missing ${f.label}.`
      });
    }
  }
  const percent = totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
  return { percent, missing };
}

// ----------------------------------------------------------------------
// Axis D — Pre-procedure risk (BSG / ESGE + bowel-prep fitness + ASA)
// ----------------------------------------------------------------------
//
// Risk is stratified from anticoagulant / antiplatelet therapy (high-bleeding
// risk for a high-risk procedure like polypectomy / colonoscopy), bowel-prep
// fitness (and renal function), and ASA physical-status grade. The most-severe
// contributor sets the band; an anticoagulant-management action is emitted
// when relevant.

const RISK_ORDER = ['low', 'moderate', 'high'];

function maxRisk(a, b) {
  const ia = RISK_ORDER.indexOf(a);
  const ib = RISK_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Compute the pre-procedure risk band, anticoagulant action, and fired risk
 * rules.
 *
 * @returns {{ band:string, anticoagulantAction:string, firedRules:object[] }}
 */
function scoreRisk(data) {
  let band = 'low';
  let anticoagulantAction = '';
  const firedRules = [];

  // Anticoagulant / antiplatelet bleeding risk (BSG / ESGE).
  if (data.medication.takingAnticoagulant) {
    band = maxRisk(band, 'high');
    anticoagulantAction = data.medication.anticoagulantAgent
      ? `On ${data.medication.anticoagulantAgent}: plan periprocedural interruption per BSG / ESGE (omit DOAC on the morning of the procedure; bridge warfarin per INR / thrombotic risk).`
      : 'On an anticoagulant: plan periprocedural interruption per BSG / ESGE (omit DOAC on the morning of the procedure; bridge warfarin per INR / thrombotic risk).';
    firedRules.push({
      ruleId: 'R-RISK-ANTICOAG',
      axis: 'risk',
      category: 'high-bleeding-risk',
      description: 'Anticoagulant therapy — high bleeding risk for a high-risk lower-GI procedure (BSG / ESGE).'
    });
  } else if (data.medication.takingAntiplatelet) {
    band = maxRisk(band, 'moderate');
    anticoagulantAction = data.medication.antiplateletAgent
      ? `On ${data.medication.antiplateletAgent}: continue aspirin; consider stopping a thienopyridine (e.g. clopidogrel) 5-7 days before a high-risk procedure per BSG / ESGE.`
      : 'On an antiplatelet: continue aspirin; consider stopping a thienopyridine (e.g. clopidogrel) 5-7 days before a high-risk procedure per BSG / ESGE.';
    firedRules.push({
      ruleId: 'R-RISK-ANTIPLATELET',
      axis: 'risk',
      category: 'antiplatelet',
      description: 'Antiplatelet therapy — moderate bleeding risk; review periprocedural management (BSG / ESGE).'
    });
  }

  // Bowel-prep fitness.
  if (data.fitness.fitForBowelPrep === false) {
    band = maxRisk(band, 'high');
    firedRules.push({
      ruleId: 'R-RISK-UNFIT-PREP',
      axis: 'risk',
      category: 'unfit-for-prep',
      description: 'Not assessed as fit for bowel preparation — review fitness or consider CT colonography.'
    });
  }

  // Renal impairment affects bowel-prep choice.
  const egfr = data.fitness.egfrMlMin;
  if (data.fitness.chronicKidneyDisease || (egfr !== null && egfr !== undefined && egfr !== '' && Number(egfr) < 30)) {
    band = maxRisk(band, 'moderate');
    firedRules.push({
      ruleId: 'R-RISK-RENAL',
      axis: 'risk',
      category: 'renal-impairment',
      description: 'Reduced renal function — avoid sodium-phosphate prep; use an isosmotic PEG-based regimen (BSG / ESGE).'
    });
  }

  // ASA physical status.
  if (data.fitness.asaGrade === 'IV' || data.fitness.asaGrade === 'V') {
    band = maxRisk(band, 'high');
    firedRules.push({
      ruleId: 'R-RISK-ASA-HIGH',
      axis: 'risk',
      category: 'asa-high',
      description: `ASA grade ${data.fitness.asaGrade} — high anaesthetic / sedation risk; senior review and anaesthetic input.`
    });
  } else if (data.fitness.asaGrade === 'III') {
    band = maxRisk(band, 'moderate');
    firedRules.push({
      ruleId: 'R-RISK-ASA-MODERATE',
      axis: 'risk',
      category: 'asa-moderate',
      description: 'ASA grade III — moderate risk; ensure appropriate monitoring and sedation planning.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-RISK-LOW',
      axis: 'risk',
      category: 'low',
      description: 'No anticoagulant, prep-fitness, renal, or ASA risk factors identified.'
    });
  }

  return { band, anticoagulantAction, firedRules };
}

export { scoreAppropriateness, appropriatenessBand, scoreUrgency, scoreCompleteness, scoreRisk, maxTier, maxRisk, fitPositive, redFlagCount, FIT_POSITIVE_THRESHOLD, TRIAGE_ORDER, TARGET_TIMEFRAMES, RISK_ORDER, INDICATION_PROCEDURE_MAP };
