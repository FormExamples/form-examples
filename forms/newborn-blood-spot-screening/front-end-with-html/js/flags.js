// Flagged-issue detection for newborn blood spot screening. Computed
// independently of the overall outcome, each flag carries a priority. See
// spec/index.md §5.
//
//   Urgent referral    (high)   — any condition suspected
//   Inadequate sample  (high)   — inadequate adequacy or a spot-quality issue
//   Sample out of window (medium) — ageAtSampleDays outside day 5–8
//   Avoidable repeat   (medium) — repeat from technique / card fault
//   Carrier result     (low)    — SCD carrier
//   Conditions declined (low)   — any condition declined
//   Incomplete screening (low)  — any pending / unanswered result
//   Invalid result class (low)  — carrier recorded on a non-SCD condition

/**
 * @typedef {import('./types.js').ScreeningData} ScreeningData
 * @typedef {import('./types.js').ConditionResult} ConditionResult
 * @typedef {import('./types.js').SampleQualityResult} SampleQualityResult
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {ScreeningData} data
 * @param {{ conditionResults: ConditionResult[], sampleQuality: SampleQualityResult, ageAtSampleDays: number | null }} ctx
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, ctx) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const { conditionResults, sampleQuality, ageAtSampleDays } = ctx;

  // ─── Urgent referral (HIGH) — any condition suspected ───────────────
  const suspected = conditionResults.filter((c) => c.result === 'suspected');
  if (suspected.length > 0) {
    const names = suspected.map((c) => c.short).join(', ');
    flags.push({
      id: 'FLAG-REFERRAL-001',
      category: 'Referral',
      message: `Suspected screen positive (${names}) — refer urgently to each named specialist service without waiting for the other results.`,
      priority: 'high'
    });
  }

  // ─── Inadequate sample (HIGH) ───────────────────────────────────────
  const spotIssue = data.sampleQuality.spotQualityIssue;
  if (
    data.sampleQuality.sampleAdequacy === 'inadequate' ||
    (spotIssue !== '' && spotIssue !== 'none')
  ) {
    flags.push({
      id: 'FLAG-SAMPLE-001',
      category: 'Sample quality',
      message: 'Inadequate blood spot sample — cannot be reliably screened; a repeat sample is required.',
      priority: 'high'
    });
  }

  // ─── Sample out of window (MEDIUM) — day 5–8 ────────────────────────
  if (ageAtSampleDays !== null && (ageAtSampleDays < 5 || ageAtSampleDays > 8)) {
    const when = ageAtSampleDays < 5 ? 'early' : 'late';
    flags.push({
      id: 'FLAG-WINDOW-001',
      category: 'Timing',
      message: `Sample taken ${when} (day ${ageAtSampleDays}); optimal is day 5, acceptable day 5–8. Timing may affect reliability and timeliness.`,
      priority: 'medium'
    });
  }

  // ─── Avoidable repeat (MEDIUM) ──────────────────────────────────────
  if (sampleQuality.avoidableRepeat) {
    flags.push({
      id: 'FLAG-REPEAT-001',
      category: 'Sample quality',
      message: `Avoidable repeat (${data.sampleQuality.repeatReason}) attributable to sampling technique or card fault — record for quality monitoring.`,
      priority: 'medium'
    });
  }

  // ─── Carrier result (LOW) — SCD carrier ─────────────────────────────
  if (data.conditions.scdResult === 'carrier') {
    flags.push({
      id: 'FLAG-CARRIER-001',
      category: 'Haemoglobinopathy',
      message: 'Sickle cell carrier detected — communicate carrier status to the family; consider parental testing / genetic counselling.',
      priority: 'low'
    });
  }

  // ─── Conditions declined (LOW) ──────────────────────────────────────
  const declined = conditionResults.filter((c) => c.result === 'declined');
  if (declined.length > 0) {
    const names = declined.map((c) => c.short).join(', ');
    flags.push({
      id: 'FLAG-DECLINED-001',
      category: 'Consent',
      message: `Screening declined for ${names} — confirm the decline is documented and informed.`,
      priority: 'low'
    });
  }

  // ─── Incomplete screening (LOW) — any pending / unanswered ──────────
  const outstanding = conditionResults.filter(
    (c) => c.result === 'pending' || c.result === ''
  );
  if (outstanding.length > 0) {
    const names = outstanding.map((c) => c.short).join(', ');
    flags.push({
      id: 'FLAG-INCOMPLETE-001',
      category: 'Follow-up',
      message: `Results outstanding for ${names} — screening incomplete; follow up.`,
      priority: 'low'
    });
  }

  // ─── Invalid result class (LOW) — carrier on a non-SCD condition ────
  const invalid = conditionResults.filter((c) => c.invalidCarrier);
  if (invalid.length > 0) {
    const names = invalid.map((c) => c.short).join(', ');
    flags.push({
      id: 'FLAG-INVALID-001',
      category: 'Data validity',
      message: `Carrier recorded for ${names}, where a carrier state is not a reportable screen result — correct the record.`,
      priority: 'low'
    });
  }

  // Sort: urgent > high > medium > low.
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
