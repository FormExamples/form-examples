// Four-axis rule catalogue for the Biopsy Test Request engine.
//
// Derived from sql-migrations 05-06: (A) appropriateness 1-9 + band by
// indication x biopsy-site/method; (B) periprocedural bleeding-risk band
// low/moderate/high from anticoagulant / antiplatelet use, INR, platelet
// count, and bleeding disorder, plus a recommended anticoagulant action;
// (C) request completeness over mandatory fields; (D) urgency / cancer-pathway
// triage with NICE NG12 two-week-wait eligibility. Rule IDs are stable and
// identical across every front-end and the back-end (R-APPROP-*, R-BLEED-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.
//
// Wrapped in an IIFE; published via `window.BiopsyTestRequest`.

(function () {
'use strict';
window.BiopsyTestRequest = window.BiopsyTestRequest || {};
const NS = window.BiopsyTestRequest;

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal biopsy-site set (where the indication is a
// recognised reason to biopsy that tissue) and a plausible set. When the
// requested site matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score 4-6
// (may-be-appropriate); clearly mismatched pairings score 1-3.

// Map of indication -> { ideal:[biopsySite], plausible:[biopsySite] }.
const INDICATION_SITE_MAP = {
  'suspected-malignancy': { ideal: ['skin', 'breast', 'lymph-node', 'prostate', 'lung', 'bone-marrow', 'gi-tract', 'soft-tissue', 'thyroid'], plausible: ['liver', 'kidney'] },
  'cancer-staging':       { ideal: ['lymph-node', 'breast', 'liver', 'bone-marrow'], plausible: ['lung', 'soft-tissue', 'skin'] },
  'suspected-infection':  { ideal: ['lung', 'lymph-node'], plausible: ['skin', 'soft-tissue', 'liver', 'bone-marrow'] },
  'inflammatory-disease': { ideal: ['kidney', 'gi-tract', 'liver'], plausible: ['skin', 'soft-tissue', 'lung'] },
  'transplant-monitoring': { ideal: ['kidney', 'liver'], plausible: ['bone-marrow'] },
  'lymphadenopathy':      { ideal: ['lymph-node'], plausible: ['bone-marrow', 'soft-tissue'] },
  'characterise-lesion':  { ideal: ['skin', 'liver', 'thyroid', 'soft-tissue', 'bone-marrow'], plausible: ['breast', 'lung', 'kidney', 'lymph-node'] },
  'other':                { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x biopsy-site pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or site has not yet been chosen.
 *
 * @returns {{ score:number, band:string, firedRule:object|null }}
 */
function scoreAppropriateness(indication, biopsySite) {
  if (!indication || !biopsySite) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: 'R-APPROP-UNSPECIFIED',
        axis: 'appropriateness',
        category: indication || 'unspecified',
        description: 'Indication or biopsy site not yet specified — provisional appropriateness.'
      }
    };
  }

  const map = INDICATION_SITE_MAP[indication] || { ideal: [], plausible: [] };
  const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

  if (map.ideal.includes(biopsySite)) {
    return {
      score: 8,
      band: 'usually-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-IDEAL`,
        axis: 'appropriateness',
        category: indication,
        description: `Biopsy of the ${biopsySite} is a recommended investigation for "${indication}".`
      }
    };
  }
  if (map.plausible.includes(biopsySite)) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRule: {
        ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
        axis: 'appropriateness',
        category: indication,
        description: `Biopsy of the ${biopsySite} may be appropriate for "${indication}" but is not the first-line target.`
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
      description: `Biopsy of the ${biopsySite} is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Periprocedural bleeding risk (BSG / ESGE & BSIR)
// ----------------------------------------------------------------------
//
// A diagnostic biopsy is itself a low-bleeding-risk procedure; the band is
// driven by the patient's antithrombotic state, coagulation, and platelets.
// Each contributing factor escalates the band; the most-severe wins. The
// engine also recommends an explicit periprocedural anticoagulant action.

const BLEED_ORDER = ['low', 'moderate', 'high'];

/** Return whichever of two bleeding-risk bands is more severe. */
function maxBand(a, b) {
  const ia = BLEED_ORDER.indexOf(a);
  const ib = BLEED_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Numeric thresholds (BSIR / CIRSE periprocedural coagulation thresholds).
const INR_HIGH = 1.5;       // INR > 1.5 -> high bleeding risk
const INR_MODERATE = 1.4;   // INR 1.4-1.5 -> at least moderate
const PLATELET_HIGH = 50;   // < 50 x10^9/L -> high bleeding risk
const PLATELET_MODERATE = 100; // 50-100 x10^9/L -> at least moderate

/**
 * Stratify periprocedural bleeding risk and recommend an anticoagulant action.
 *
 * @returns {{ band:string, anticoagulantAction:string, firedRules:object[] }}
 */
function scoreBleedingRisk(b) {
  let band = 'low';
  const firedRules = [];

  if (b.takingAnticoagulant === true) {
    band = maxBand(band, 'high');
    firedRules.push({
      ruleId: 'R-BLEED-ANTICOAGULANT',
      axis: 'bleeding-risk',
      category: 'anticoagulant',
      description: b.anticoagulantAgent
        ? `Patient on anticoagulant (${b.anticoagulantAgent}) — high periprocedural bleeding risk.`
        : 'Patient on an anticoagulant — high periprocedural bleeding risk.'
    });
  }
  if (b.takingAntiplatelet === true) {
    band = maxBand(band, 'moderate');
    firedRules.push({
      ruleId: 'R-BLEED-ANTIPLATELET',
      axis: 'bleeding-risk',
      category: 'antiplatelet',
      description: b.antiplateletAgent
        ? `Patient on antiplatelet (${b.antiplateletAgent}) — at least moderate bleeding risk.`
        : 'Patient on an antiplatelet agent — at least moderate bleeding risk.'
    });
  }
  if (b.bleedingDisorder === true) {
    band = maxBand(band, 'high');
    firedRules.push({
      ruleId: 'R-BLEED-DISORDER',
      axis: 'bleeding-risk',
      category: 'bleeding-disorder',
      description: 'Known bleeding disorder / coagulopathy — high periprocedural bleeding risk.'
    });
  }
  if (b.inr !== null && b.inr !== undefined && b.inr !== '') {
    const inr = Number(b.inr);
    if (!Number.isNaN(inr)) {
      if (inr > INR_HIGH) {
        band = maxBand(band, 'high');
        firedRules.push({
          ruleId: 'R-BLEED-INR-HIGH',
          axis: 'bleeding-risk',
          category: 'coagulation',
          description: `INR ${inr} is above ${INR_HIGH} — high bleeding risk; correct before biopsy.`
        });
      } else if (inr >= INR_MODERATE) {
        band = maxBand(band, 'moderate');
        firedRules.push({
          ruleId: 'R-BLEED-INR-MODERATE',
          axis: 'bleeding-risk',
          category: 'coagulation',
          description: `INR ${inr} is borderline (${INR_MODERATE}-${INR_HIGH}) — moderate bleeding risk.`
        });
      }
    }
  }
  if (b.plateletCount !== null && b.plateletCount !== undefined && b.plateletCount !== '') {
    const plt = Number(b.plateletCount);
    if (!Number.isNaN(plt)) {
      if (plt < PLATELET_HIGH) {
        band = maxBand(band, 'high');
        firedRules.push({
          ruleId: 'R-BLEED-PLATELETS-HIGH',
          axis: 'bleeding-risk',
          category: 'thrombocytopenia',
          description: `Platelet count ${plt} x10^9/L is below ${PLATELET_HIGH} — high bleeding risk; consider transfusion cover.`
        });
      } else if (plt < PLATELET_MODERATE) {
        band = maxBand(band, 'moderate');
        firedRules.push({
          ruleId: 'R-BLEED-PLATELETS-MODERATE',
          axis: 'bleeding-risk',
          category: 'thrombocytopenia',
          description: `Platelet count ${plt} x10^9/L is below ${PLATELET_MODERATE} — moderate bleeding risk.`
        });
      }
    }
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-BLEED-LOW',
      axis: 'bleeding-risk',
      category: 'baseline',
      description: 'No antithrombotic agents, coagulopathy, or thrombocytopenia — low bleeding risk.'
    });
  }

  return {
    band,
    anticoagulantAction: recommendAnticoagulantAction(band, b),
    firedRules
  };
}

/** Recommend a periprocedural anticoagulant / antiplatelet action. */
function recommendAnticoagulantAction(band, b) {
  if (band === 'low') return '';
  const parts = [];
  if (b.takingAnticoagulant === true) {
    parts.push('withhold the anticoagulant per local periprocedural protocol (bridge if high thrombotic risk)');
  }
  if (b.takingAntiplatelet === true) {
    parts.push('review antiplatelet timing with the prescriber');
  }
  if (b.bleedingDisorder === true) {
    parts.push('involve haematology and arrange factor / platelet cover');
  }
  if (b.inr !== null && b.inr !== undefined && b.inr !== '' && Number(b.inr) > INR_HIGH) {
    parts.push('correct the INR before the procedure');
  }
  if (b.plateletCount !== null && b.plateletCount !== undefined && b.plateletCount !== '' && Number(b.plateletCount) < PLATELET_HIGH) {
    parts.push('arrange platelet transfusion cover');
  }
  if (parts.length === 0) {
    return 'Confirm coagulation status and follow the local periprocedural protocol before the biopsy.';
  }
  return 'Before the biopsy: ' + parts.join('; ') + '.';
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication and clinical question are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

const COMPLETENESS_FIELDS = [
  { weight: 3, present: (d) => !!d.indication.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
  { weight: 3, present: (d) => !!d.indication.clinicalQuestion && d.indication.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
  { weight: 2, present: (d) => !!d.procedure.biopsySite, ruleId: 'R-COMPLETE-SITE', label: 'biopsy site' },
  { weight: 2, present: (d) => !!d.procedure.biopsyMethod, ruleId: 'R-COMPLETE-METHOD', label: 'biopsy method' },
  { weight: 1, present: (d) => !!d.lesion.lesionDescription && d.lesion.lesionDescription.trim() !== '', ruleId: 'R-COMPLETE-LESION', label: 'lesion description' },
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
// Axis D — Urgency / cancer-pathway triage (NICE NG12)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency. A
// suspected-malignancy or cancer-staging indication makes the request
// two-week-wait eligible and escalates the tier to at least two-week-wait.
// The most-severe escalation wins.

const TRIAGE_ORDER = ['routine', 'urgent', 'two-week-wait', 'emergency'];

const TARGET_TIMEFRAMES = {
  'routine': 'Within 6 weeks',
  'urgent': 'Within 1-2 weeks',
  'two-week-wait': 'Within 14 days (suspected-cancer pathway)',
  'emergency': 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a, b) {
  const ia = TRIAGE_ORDER.indexOf(a);
  const ib = TRIAGE_ORDER.indexOf(b);
  return ia >= ib ? a : b;
}

// Indications that make a request NICE NG12 two-week-wait eligible.
const TWO_WEEK_WAIT_INDICATIONS = ['suspected-malignancy', 'cancer-staging'];

/** Whether the request meets two-week-wait eligibility. */
function isTwoWeekWaitEligible(data) {
  return TWO_WEEK_WAIT_INDICATIONS.includes(data.indication.primaryIndication);
}

/**
 * Compute the triage tier, target timeframe, two-week-wait eligibility, and
 * fired triage rules.
 *
 * @returns {{ tier:string, targetTimeframe:string, twoWeekWaitEligible:boolean, firedRules:object[] }}
 */
function scoreTriage(data) {
  const requested = data.triage.urgency || 'routine';
  let tier = TRIAGE_ORDER.includes(requested) ? requested : 'routine';
  const firedRules = [];
  const twoWeekWaitEligible = isTwoWeekWaitEligible(data);

  if (twoWeekWaitEligible) {
    tier = maxTier(tier, 'two-week-wait');
    firedRules.push({
      ruleId: 'R-TRIAGE-SUSPECTED-CANCER-2WW',
      axis: 'urgency',
      category: 'suspected-cancer',
      description: `"${data.indication.primaryIndication}" indication is NICE NG12 two-week-wait eligible — escalate to the suspected-cancer pathway.`
    });
  }

  if (data.triage.urgency === 'emergency') {
    firedRules.push({
      ruleId: 'R-TRIAGE-EMERGENCY',
      axis: 'urgency',
      category: 'requested',
      description: 'Emergency urgency requested — same-day assessment.'
    });
  }

  if (firedRules.length === 0) {
    firedRules.push({
      ruleId: 'R-TRIAGE-REQUESTED',
      axis: 'urgency',
      category: 'requested',
      description: `No cancer-pathway escalation; triage follows the requested urgency (${tier}).`
    });
  }

  return {
    tier,
    targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
    twoWeekWaitEligible,
    firedRules
  };
}

Object.assign(NS, {
  scoreAppropriateness,
  appropriatenessBand,
  scoreBleedingRisk,
  scoreCompleteness,
  scoreTriage,
  isTwoWeekWaitEligible,
  maxBand,
  maxTier,
  TRIAGE_ORDER,
  BLEED_ORDER,
  TARGET_TIMEFRAMES,
  INDICATION_SITE_MAP,
  TWO_WEEK_WAIT_INDICATIONS
});
})();
