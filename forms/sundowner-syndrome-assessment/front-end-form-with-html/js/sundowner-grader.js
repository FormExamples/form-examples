// Sundowner syndrome grader. Pure functions: take an `AssessmentData`
// object, return the CMAI total, NPI total, severity band, and a list of
// fired rules summarising which scoring bands and elevated NPI domains
// were triggered.
//
// CMAI severity thresholds (from the AGENTS.md spec):
//   29-45    -> mild       (occasional restlessness, redirectable)
//   46-75    -> moderate   (daily episodes, requires intervention)
//   76-120   -> severe     (aggressive behaviour, safety risk)
//   >120     -> critical   (self-harm risk, requires constant supervision)
//
// CMAI score is the sum of all 29 items each in 1..7 (range 29..203).
// Items not yet answered (score 0) are scored as 1 ("Never") for the
// purposes of computing the total, which keeps a partially-complete form
// classifiable as "mild" rather than yielding a misleading low total.
// We separately report `cmaiAnsweredCount` so the report can show
// completion progress.
//
// NPI total is the sum across all 12 domains of (frequency * severity),
// each in [0, 12], range 0..144.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Severity} Severity
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

(function () {
'use strict';
window.SundownerSyndromeAssessment = window.SundownerSyndromeAssessment || {};
const NS = window.SundownerSyndromeAssessment;
const {
  severityFromCMAI,
  severityLabel,
  cmaiItems,
  npiDomains,
  CMAI_ITEM_IDS,
  NPI_DOMAIN_KEYS
} = NS;

/**
 * Sum the 29 CMAI items. Unanswered items (stored as 0) are treated as
 * 1 ("Never") so a partly-complete form still classifies sensibly.
 * @param {AssessmentData} data
 * @returns {{ total: number, answered: number }}
 */
function sumCMAI(data) {
  const cmai = data.behaviouralSymptoms?.cmai || {};
  let total = 0;
  let answered = 0;
  for (const id of CMAI_ITEM_IDS) {
    const v = cmai[id];
    if (typeof v === 'number' && v >= 1 && v <= 7) {
      total += v;
      answered++;
    } else {
      // Unanswered: score as 1 (Never)
      total += 1;
    }
  }
  return { total, answered };
}

/**
 * Sum the 12 NPI domain scores (frequency * severity).
 * @param {AssessmentData} data
 * @returns {{ total: number, answered: number, perDomain: { key: string, label: string, score: number, frequency: number, severity: number }[] }}
 */
function sumNPI(data) {
  const npi = data.behaviouralSymptoms?.npi || {};
  let total = 0;
  let answered = 0;
  /** @type {{ key: string, label: string, score: number, frequency: number, severity: number }[]} */
  const perDomain = [];
  for (const domain of npiDomains) {
    const entry = npi[domain.key] || { frequency: 0, severity: 0 };
    const f = Number(entry.frequency) || 0;
    const s = Number(entry.severity) || 0;
    const score = (f >= 1 && f <= 4 && s >= 1 && s <= 3) ? f * s : 0;
    if (score > 0) answered++;
    total += score;
    perDomain.push({
      key: domain.key,
      label: domain.label,
      score,
      frequency: f,
      severity: s
    });
  }
  return { total, answered, perDomain };
}

/**
 * Grade the sundowner assessment.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   cmaiScore: number,
 *   npiScore: number,
 *   severity: Severity,
 *   cmaiAnsweredCount: number,
 *   npiAnsweredCount: number,
 *   firedRules: FiredRule[]
 * }}
 */
function gradeSundowner(data) {
  const cmaiSum = sumCMAI(data);
  const npiSum = sumNPI(data);
  const cmaiScore = cmaiSum.total;
  const npiScore = npiSum.total;
  const severity = severityFromCMAI(cmaiScore);

  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── CMAI band rule ───────────────────────────────────────────
  firedRules.push({
    id: 'CMAI-BAND',
    category: 'CMAI Total',
    description: `CMAI total ${cmaiScore} of 203 (${cmaiSum.answered} of 29 items observed).`,
    detail: `Severity band: ${severityLabel(severity)} (CMAI thresholds: 29-45 mild, 46-75 moderate, 76-120 severe, >120 critical).`
  });

  // ─── Highly-elevated CMAI items (>= 5: at least daily) ────────
  const highCmaiItems = cmaiItems.filter((item) => {
    const v = data.behaviouralSymptoms?.cmai?.[item.id];
    return typeof v === 'number' && v >= 5;
  });
  if (highCmaiItems.length > 0) {
    firedRules.push({
      id: 'CMAI-DAILY',
      category: 'CMAI Items',
      description: `${highCmaiItems.length} CMAI item(s) occurring at least daily.`,
      detail: highCmaiItems.map((i) => `#${i.number} ${i.label}`).join('; ')
    });
  }

  // ─── NPI total band ──────────────────────────────────────────
  const npiBand = npiScore >= 48 ? 'markedly elevated'
    : npiScore >= 24 ? 'moderately elevated'
    : npiScore >= 12 ? 'mildly elevated'
    : 'within normal limits';
  firedRules.push({
    id: 'NPI-TOTAL',
    category: 'NPI Total',
    description: `NPI total ${npiScore} of 144 across 12 domains (${npiSum.answered} domain(s) endorsed).`,
    detail: `NPI total is ${npiBand}.`
  });

  // ─── Elevated NPI sub-domains (score >= 4) ───────────────────
  const elevatedDomains = npiSum.perDomain.filter((d) => d.score >= 4);
  if (elevatedDomains.length > 0) {
    firedRules.push({
      id: 'NPI-DOMAINS',
      category: 'NPI Domains',
      description: `${elevatedDomains.length} NPI domain(s) with score >= 4.`,
      detail: elevatedDomains
        .map((d) => `${d.label} (F${d.frequency} x S${d.severity} = ${d.score})`)
        .join('; ')
    });
  }

  return {
    cmaiScore,
    npiScore,
    severity,
    cmaiAnsweredCount: cmaiSum.answered,
    npiAnsweredCount: npiSum.answered,
    firedRules
  };
}

Object.assign(window.SundownerSyndromeAssessment, {
  gradeSundowner,
  sumCMAI,
  sumNPI
});
})();
