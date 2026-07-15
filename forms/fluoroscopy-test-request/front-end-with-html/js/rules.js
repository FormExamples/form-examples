import { isBariumStudy, isIonisingStudy } from './types.js';

// Four-axis rule catalogue for the Fluoroscopy Test Request engine.
//
// Derived from index.md and sql/05: (A) appropriateness 1-9 + band by
// indication x study type (ACR / RCR iRefer); (B) safety band + radiation-dose
// band from pregnancy / contrast-allergy / aspiration / contrast-choice for
// suspected perforation; (C) request completeness over mandatory fields;
// (D) triage tier with acuity escalation. Rule IDs are stable and identical
// across every front-end and the back-end (R-APPROP-*, R-SAFETY-*, R-DOSE-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria / RCR iRefer 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal study type (or set of types). When the
// requested study type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[studyType], plausible:[studyType] }.
// Anything not listed for an indication is treated as a mismatch.
const INDICATION_STUDY_MAP = {
  'dysphagia':                  { ideal: ['barium-swallow', 'water-soluble-contrast-swallow'], plausible: ['barium-meal'] },
  'reflux':                     { ideal: ['barium-meal', 'barium-swallow'], plausible: ['water-soluble-contrast-swallow'] },
  'suspected-obstruction':      { ideal: ['barium-follow-through', 'water-soluble-contrast-swallow'], plausible: ['barium-meal', 'barium-enema'] },
  'suspected-perforation':      { ideal: ['water-soluble-contrast-swallow'], plausible: [] },
  'constipation':               { ideal: ['defecating-proctogram', 'barium-enema'], plausible: ['barium-follow-through'] },
  'infertility-tubal-patency':  { ideal: ['hysterosalpingogram'], plausible: [] },
  'vesicoureteric-reflux':      { ideal: ['micturating-cystourethrogram'], plausible: [] },
  'joint-assessment':           { ideal: ['arthrogram'], plausible: ['fluoroscopy-guided-procedure'] },
  'other':                      { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x studyType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or study type has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, studyType) {
  if (!indication || !studyType) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or study type not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_STUDY_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(studyType)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${studyType} study is the recommended examination for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(studyType)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Requested ${studyType} study may be appropriate for "${indication}" but is not the first-line examination.`
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
      description: `Requested ${studyType} study is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B (part 1) — Radiation dose band (study-type dependent)
// ----------------------------------------------------------------------
//
// Typical effective-dose bands per study type, from index.md.

const STUDY_DOSE_BANDS = {
  'barium-swallow': 'low',
  'water-soluble-contrast-swallow': 'low',
  'barium-meal': 'moderate',
  'barium-follow-through': 'moderate',
  'barium-enema': 'high',
  'defecating-proctogram': 'moderate',
  'hysterosalpingogram': 'moderate',
  'micturating-cystourethrogram': 'moderate',
  'arthrogram': 'low',
  'fluoroscopy-guided-procedure': 'moderate',
  'other': 'moderate'
};

/**
 * Determine the radiation-dose band for the requested study type.
 *
 * @returns {{ band:string, firedRule:object|null }}
 */
function scoreRadiationDose(studyType) {
  if (!studyType) {
    return {
      band: '',
      firedRule: {
        ruleId: 'R-DOSE-UNSPECIFIED',
        axis: 'safety',
        category: 'radiation-dose',
        description: 'Study type not yet specified — radiation dose not assessed.'
      }
    };
  }
  const band = STUDY_DOSE_BANDS[studyType] || 'moderate';
  const studyKey = studyType.toUpperCase().replace(/[^A-Z]+/g, '-');
  return {
    band,
    firedRule: {
      ruleId: `R-DOSE-${studyKey}`,
      axis: 'safety',
      category: 'radiation-dose',
      description: `Estimated radiation-dose band for a ${studyType} study is ${band}.`
    }
  };
}

// ----------------------------------------------------------------------
// Axis B (part 2) — Safety band (IR(ME)R justification, pregnancy,
// contrast allergy, aspiration risk, contrast-choice for perforation)
// ----------------------------------------------------------------------
//
// The safety band is the most-severe outcome across the safety rules:
//   contraindicated > caution > ok.
// Pregnancy with an ionising study, or barium chosen when perforation is
// suspected, force `contraindicated`.

const SAFETY_ORDER = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
function maxSafety(a, b) {
  const ia = SAFETY_ORDER.indexOf(a);
  const ib = SAFETY_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

/**
 * Compute the safety band and the fired safety rules.
 *
 * @returns {{ band:string, firedRules:object[] }}
 */
function scoreSafety(data) {
  let band = 'ok';
  const firedRules = [];
  const studyType = data.request.studyType;
  const indication = data.request.primaryIndication;

  // Pregnancy with an ionising study — contraindicated.
  const pregnant =
    data.safety.pregnancyStatus === 'pregnant' ||
    data.safety.pregnancyStatus === 'possible';
  if (pregnant && isIonisingStudy(studyType)) {
    band = maxSafety(band, 'contraindicated');
    firedRules.push({
      ruleId: 'R-SAFETY-PREGNANCY-IONISING',
      axis: 'safety',
      category: 'pregnancy',
      description: 'Pregnant or possibly pregnant with an ionising-radiation study — contraindicated; justify or defer per IR(ME)R.'
    });
  }

  // Suspected perforation with a barium study — contraindicated (use
  // water-soluble contrast).
  if (indication === 'suspected-perforation' && isBariumStudy(studyType)) {
    band = maxSafety(band, 'contraindicated');
    firedRules.push({
      ruleId: 'R-SAFETY-PERFORATION-BARIUM',
      axis: 'safety',
      category: 'suspected-perforation-contrast-choice',
      description: 'Barium study requested when perforation is suspected — contraindicated; redirect to a water-soluble contrast study.'
    });
  }

  // Contrast allergy — caution.
  if (data.safety.contrastAllergy === true) {
    band = maxSafety(band, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-CONTRAST-ALLERGY',
      axis: 'safety',
      category: 'contrast-allergy',
      description: 'Known contrast-media allergy — caution; review premedication and contrast choice.'
    });
  }

  // Aspiration risk — caution (favours water-soluble contrast over barium).
  if (data.safety.aspirationRisk === true) {
    band = maxSafety(band, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-ASPIRATION-RISK',
      axis: 'safety',
      category: 'aspiration-risk',
      description: 'Aspiration risk — caution; favour water-soluble (non-ionic, low-osmolar) contrast over barium.'
    });
  }

  // Unknown pregnancy status with an ionising study — caution.
  if (
    data.safety.pregnancyStatus === 'unknown' &&
    isIonisingStudy(studyType)
  ) {
    band = maxSafety(band, 'caution');
    firedRules.push({
      ruleId: 'R-SAFETY-PREGNANCY-UNKNOWN',
      axis: 'safety',
      category: 'pregnancy',
      description: 'Pregnancy status unknown with an ionising-radiation study — caution; confirm status before exposure.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-SAFETY-OK',
      axis: 'safety',
      category: 'safety',
      description: 'No safety contraindications or cautions identified.'
    });
  }

  return { band, firedRules };
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
  { weight: 2, present: (d) => !!d.request.studyType, ruleId: 'R-COMPLETE-STUDY-TYPE', label: 'requested study type' },
  { weight: 2, present: (d) => !!d.safety.pregnancyStatus, ruleId: 'R-COMPLETE-PREGNANCY-STATUS', label: 'pregnancy status' },
  { weight: 1, present: (d) => !!d.safety.irMeRJustification && d.safety.irMeRJustification.trim() !== '', ruleId: 'R-COMPLETE-IRMER-JUSTIFICATION', label: 'IR(ME)R justification' },
  { weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
  { weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
  { weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
  { weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
  { weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
  { weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

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
// Axis D — Triage priority (acuity escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then acuity
// rules auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 4-6 weeks',
  'urgent': 'Within 24-72 hours',
  'emergency': 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Acuity escalation rules, each forcing at least the given tier.
const TRIAGE_RULES = [
  {
    ruleId: 'R-TRIAGE-SUSPECTED-PERFORATION',
    tier: 'emergency',
    fires: (d) => d.request.primaryIndication === 'suspected-perforation',
    description: 'Suspected perforation — emergency contrast study.'
  },
  {
    ruleId: 'R-TRIAGE-SUSPECTED-OBSTRUCTION',
    tier: 'urgent',
    fires: (d) => d.request.primaryIndication === 'suspected-obstruction',
    description: 'Suspected obstruction — urgent contrast study.'
  }
];

/**
 * Compute the triage tier, target timeframe, and fired triage rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, firedRules:object[] }}
 */
function scoreTriage(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];

  for (const rule of TRIAGE_RULES) {
    if (rule.fires(data)) {
      tier = maxTier(tier, rule.tier);
      firedRules.push({
        ruleId: rule.ruleId,
        axis: 'triage',
        category: 'acuity',
        description: rule.description
      });
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'triage',
      category: 'requested',
      description: `No acuity escalation; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    firedRules
  };
}

export { scoreAppropriateness, appropriatenessBand, scoreRadiationDose, scoreSafety, scoreCompleteness, scoreTriage, maxTier, maxSafety, TRIAGE_ORDER, SAFETY_ORDER, TARGET_TIMEFRAMES, STUDY_DOSE_BANDS, INDICATION_STUDY_MAP };
