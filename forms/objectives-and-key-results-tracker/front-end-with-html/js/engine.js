const ORDER = { green: 0, amber: 1, red: 2 };
const worstBand = (bands) => bands.reduce((a, b) => (ORDER[b] > ORDER[a] ? b : a), 'green');
const daysBetween = (a, b) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);

const rule = (id, instrument, grade, description) => ({ ruleId: id, instrument, grade, category: instrument, description });

function gradeProgress(s) {
  const p = s.progressPercent;
  const tier = s.stretchTier ?? 1;
  if (p === null) return ['amber', [rule('R-PROGRESS-MISSING', 'progress', 'amber', 'Progress missing.')]];
  const t = { 1: { green: 70, red: 50 }, 2: { green: 30, red: 10 }, 3: { green: 25, red: -1 } }[tier];
  const band = p >= t.green ? 'green' : p < t.red ? 'red' : 'amber';
  return [band, [rule(`R-PROGRESS-${band.toUpperCase()}-T${tier}`, 'progress', band, `Progress ${p}% tier ${tier} → ${band}.`)]];
}
function gradeConfidence(d) {
  if (d === null) return ['amber', [rule('R-CONFIDENCE-MISSING', 'confidence', 'amber', 'Confidence missing.')]];
  const band = d >= 7 ? 'green' : d <= 3 ? 'red' : 'amber';
  return [band, [rule(`R-CONFIDENCE-${band.toUpperCase()}`, 'confidence', band, `Confidence ${d}/10 → ${band}.`)]];
}
function gradeAlignment(g) {
  if (g === null) return ['amber', [rule('R-ALIGNMENT-MISSING', 'alignment', 'amber', 'Alignment missing.')]];
  const band = g >= 4 ? 'green' : g <= 2 ? 'red' : 'amber';
  return [band, [rule(`R-ALIGNMENT-${band.toUpperCase()}`, 'alignment', band, `Alignment ${g}/5 → ${band}.`)]];
}
function gradeSmart(q) {
  if (q === null) return ['amber', [rule('R-SMART-MISSING', 'smart', 'amber', 'SMART missing.')]];
  const band = q >= 4 ? 'green' : q <= 1 ? 'red' : 'amber';
  return [band, [rule(`R-SMART-${band.toUpperCase()}`, 'smart', band, `SMART ${q}/5 → ${band}.`)]];
}
function gradePace(d) {
  if (d === null) return ['amber', [rule('R-PACE-MISSING', 'pace', 'amber', 'Pace missing.')]];
  const band = d >= -10 ? 'green' : d <= -50 ? 'red' : 'amber';
  return [band, [rule(`R-PACE-${band.toUpperCase()}`, 'pace', band, `Pace ${d}% → ${band}.`)]];
}
function gradeStretch(t) {
  const name = { 1: 'COMMITTED', 2: 'ASPIRATIONAL', 3: 'MOONSHOT' }[t ?? 1];
  return ['green', [rule(`R-STRETCH-${name}`, 'stretch', 'green', `Stretch ${name.toLowerCase()} (informational).`)]];
}
function gradeImpact(t) {
  return ['green', [rule(`R-IMPACT-T${t ?? 0}`, 'impact', 'green', `Impact tier ${t ?? 0}/5 (informational).`)]];
}

function computeFlags(a) {
  const flags = []; const s = a.scores; const c = a.context;
  const add = (code, priority, description) => flags.push({ flagCode: code, priority, description });
  if (s.alignmentGrade !== null && s.alignmentGrade <= 2) add('mis-aligned', 'high', `Alignment ${s.alignmentGrade}/5.`);
  if (['individual', 'team', 'department'].includes(c.level) && c.parentObjectiveId === null) add('orphaned', 'high', `Level ${c.level} no parent.`);
  if (s.smartQuality !== null && s.smartQuality <= 1) add('non-smart', 'high', `SMART ${s.smartQuality}/5.`);
  const krTypes = (a.keyResults ?? []).map(k => k.krType);
  if (krTypes.length && !krTypes.some(t => t === 'numeric' || t === 'milestone')) add('unmeasurable', 'high', 'No numeric/milestone KR.');
  if (!c.driPresent) add('no-dri', 'high', 'No DRI.');
  if (s.stretchTier === 1 && s.progressPercent !== null && s.progressPercent < 50 && c.cycleStartDate && c.cycleEndDate) {
    const total = daysBetween(c.cycleStartDate, c.cycleEndDate);
    const elapsed = daysBetween(c.cycleStartDate, a.now);
    if (total > 0 && elapsed / total >= 0.5) add('committed-at-risk', 'high', 'Committed behind ≥50% elapsed.');
  }
  if (s.paceDeviationPercent !== null && s.paceDeviationPercent <= -50) add('pace-collapse', 'high', `Pace ${s.paceDeviationPercent}%.`);
  if (c.previousConfidenceDecile !== null && s.confidenceDecile !== null && c.previousConfidenceDecile - s.confidenceDecile >= 3) add('confidence-collapse', 'medium', 'Confidence dropped ≥3.');
  if (c.checkedInAt && c.cycleStartDate && c.cycleEndDate) {
    const total = daysBetween(c.cycleStartDate, c.cycleEndDate);
    const since = daysBetween(c.checkedInAt, a.now);
    const threshold = Math.max(14, Math.round(total * 0.25));
    if (since > threshold) add('stale-check-in', 'medium', `${since} days since check-in.`);
  }
  if (['retired', 'cancelled', 'missed'].includes(c.parentObjectiveStatus)) add('cascading-broken', 'medium', `Parent ${c.parentObjectiveStatus}.`);
  if ((a.keyResults ?? []).length > 5) add('over-scoped', 'low', `${a.keyResults.length} KRs.`);
  if (s.stretchTier === 3 && s.progressPercent !== null && s.progressPercent >= 70) add('moonshot-progress', 'low', `Moonshot at ${s.progressPercent}%.`);
  return flags;
}

/**
 * Build a fresh, fully-blank assessment in the shape form-app.js's
 * buildAssessment() produces and gradeObjective() consumes: the seven
 * scores (null = unanswered), no key results, a context block with no
 * parent / DRI / cycle dates, and `now` unset (the pace and staleness flags
 * only read it once cycle dates are present; personas should pin it to a
 * fixed ISO instant). `gradeObjective(emptyAssessment())` is the
 * all-missing baseline (every axis amber, composite amber, 'no-dri' flag).
 */
export function emptyAssessment() {
  return {
    scores: {
      progressPercent: null, confidenceDecile: null, stretchTier: null,
      alignmentGrade: null, impactTier: null, smartQuality: null, paceDeviationPercent: null,
    },
    keyResults: [], // { krType: 'numeric' | 'milestone' | ..., ... }
    context: {
      level: '', parentObjectiveId: null, parentObjectiveStatus: null, driPresent: false,
      cycleStartDate: null, cycleEndDate: null, checkedInAt: null, previousConfidenceDecile: null,
    },
    now: null,
  };
}

export function gradeObjective(a) {
  const axes = [gradeProgress(a.scores), gradeConfidence(a.scores.confidenceDecile),
    gradeStretch(a.scores.stretchTier), gradeAlignment(a.scores.alignmentGrade),
    gradeImpact(a.scores.impactTier), gradeSmart(a.scores.smartQuality),
    gradePace(a.scores.paceDeviationPercent)];
  const composite = worstBand(axes.map(([b]) => b));
  const rulesFired = axes.flatMap(([, r]) => r);
  rulesFired.push(rule(`R-COMPOSITE-${composite.toUpperCase()}`, 'composite', composite, `Composite ${composite}.`));
  return { computedCompositeRag: composite, rulesFired, flags: computeFlags(a) };
}
