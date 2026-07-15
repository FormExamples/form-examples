import { roundOne } from './rules.js';

// Flagged-issue detection (red flags). Independent of the risk zone (which the
// grader produces), this module raises clinician-facing safety flags per
// spec §5:
//
//   - Above exchange-transfusion threshold (high, urgent) — aboveExchange
//   - Above phototherapy threshold (high)                 — abovePhototherapy
//   - High-risk zone (high)                               — riskZone == 'high'
//   - Rapid rise (high)                                   — prior TSB available
//                                                            and rising fast
//   - Early jaundice (high)                               — onset < 24 hours
//   - Risk factors present (medium)                       — any risk-factor flag
//   - High-intermediate zone (medium)                     — riskZone == 'high-intermediate'
//   - Out-of-range age (low)                              — age outside domain
//   - Incomplete assessment (low)                         — age or TSB missing
//
// Rows here mirror the `bhutani_bilirubin_nomogram_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.BhutaniBilirubinNomogram.

/**
 * @param {AssessmentData} data
 * @param {GradingResult} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const tsb = data.measurement.totalSerumBilirubinUmolL;
  const age = data.measurement.ageHours;
  const hasAge = age !== null && age !== undefined && !Number.isNaN(age);
  const hasTsb = tsb !== null && tsb !== undefined && !Number.isNaN(tsb);
  const rf = data.riskFactors;

  // ─── Above exchange-transfusion threshold (HIGH, urgent) ────
  if (grade.aboveExchange) {
    flags.push({
      id: 'F-ABOVE-EXCHANGE-001',
      category: 'above-exchange',
      priority: 'high',
      description:
        `TSB ${roundOne(tsb)} µmol/L is at or above the exchange-transfusion ` +
        `threshold (${grade.exchangeThreshold} µmol/L) for this gestation and age — medical emergency`,
      suggestedAction:
        'Urgent senior / neonatal review; start intensive phototherapy immediately and prepare for exchange transfusion per local protocol.'
    });
  }

  // ─── Above phototherapy threshold (HIGH) ────────────────────
  if (grade.abovePhototherapy && !grade.aboveExchange) {
    flags.push({
      id: 'F-ABOVE-PHOTOTHERAPY-001',
      category: 'above-phototherapy',
      priority: 'high',
      description:
        `TSB ${roundOne(tsb)} µmol/L is at or above the phototherapy ` +
        `threshold (${grade.phototherapyThreshold} µmol/L) for this gestation and age`,
      suggestedAction:
        'Start phototherapy per the gestation-specific NICE chart and repeat the TSB within 4–6 hours.'
    });
  }

  // ─── High-risk zone (HIGH) ──────────────────────────────────
  if (grade.riskZone === 'high') {
    flags.push({
      id: 'F-HIGH-RISK-ZONE-001',
      category: 'high-risk-zone',
      priority: 'high',
      description:
        `TSB is at or above the 95th percentile for age (high-risk zone) — highest ` +
        `probability of subsequent significant hyperbilirubinaemia`,
      suggestedAction:
        'Ensure timely re-testing, review against the treatment thresholds, and arrange close follow-up.'
    });
  }

  // ─── Rapid rise (HIGH) ──────────────────────────────────────
  // Requires a documented prior TSB and age, which this form version does not
  // collect; the branch is retained for parity with the SQL flag category and
  // will fire when a prior measurement is supplied by an upstream record.
  const priorTsb = data.measurement.priorTotalSerumBilirubinUmolL;
  const priorAge = data.measurement.priorAgeHours;
  if (
    hasTsb && hasAge &&
    priorTsb !== null && priorTsb !== undefined &&
    priorAge !== null && priorAge !== undefined &&
    age > priorAge
  ) {
    const rate = (tsb - priorTsb) / (age - priorAge);
    if (rate >= 8.5) {
      flags.push({
        id: 'F-RAPID-RISE-001',
        category: 'rapid-rise',
        priority: 'high',
        description:
          `TSB rising at ${roundOne(rate)} µmol/L per hour — a rate above the ` +
          `age-appropriate concern suggests haemolysis`,
        suggestedAction:
          'Investigate for haemolysis (blood group, DAT, blood film, G6PD) and re-test TSB urgently.'
      });
    }
  }

  // ─── Early jaundice (HIGH) ──────────────────────────────────
  if (rf.earlyOnsetUnder24h === 'yes') {
    flags.push({
      id: 'F-EARLY-JAUNDICE-001',
      category: 'early-jaundice',
      priority: 'high',
      description:
        'Jaundice onset before 24 hours of age — pathological until proven otherwise',
      suggestedAction:
        'Urgent investigation: measure TSB now and repeat, check blood group / DAT and full blood count, and seek senior review.'
    });
  }

  // ─── Risk factors present (MEDIUM) ──────────────────────────
  if (grade.firedRiskFactors.length > 0) {
    const names = grade.firedRiskFactors.map((f) => f.label).join('; ');
    flags.push({
      id: 'F-RISK-FACTORS-001',
      category: 'risk-factors',
      priority: 'medium',
      description:
        `${grade.firedRiskFactors.length} recognised risk factor(s) present: ${names}`,
      suggestedAction:
        'Lower the effective threshold for concern and reassess sooner; correlate with the treatment thresholds.'
    });
  }

  // ─── High-intermediate zone (MEDIUM) ────────────────────────
  if (grade.riskZone === 'high-intermediate') {
    flags.push({
      id: 'F-HIGH-INTERMEDIATE-ZONE-001',
      category: 'high-risk-zone',
      priority: 'medium',
      description:
        'TSB in the 75th–95th percentile band (high-intermediate zone) — increased probability of subsequent significant hyperbilirubinaemia',
      suggestedAction:
        'Closer surveillance and earlier re-measurement of TSB.'
    });
  }

  // ─── Out-of-range age (LOW) ─────────────────────────────────
  if (grade.outOfRange) {
    flags.push({
      id: 'F-OUT-OF-RANGE-AGE-001',
      category: 'other',
      priority: 'low',
      description:
        `Age ${roundOne(age)} h is outside the nomogram domain (0–168 h) — the ` +
        `result was computed at the nearest defined age`,
      suggestedAction:
        'Re-check the recorded age at measurement; interpret the zone with caution.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  if (!hasAge || !hasTsb) {
    const missing = [];
    if (!hasAge) missing.push('age at measurement (hours)');
    if (!hasTsb) missing.push('total serum bilirubin (µmol/L)');
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        `Missing input(s): ${missing.join(', ')} — no risk zone can be assigned`,
      suggestedAction:
        'Record the missing measurement(s) and re-classify.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
