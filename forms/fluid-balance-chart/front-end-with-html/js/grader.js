import { classifyFluidStatus, significantBalanceThresholdMl } from './rules.js';
import { categoryLabel, fluidStatusLabel } from './types.js';

// Fluid Balance Chart grader. Pure functions: take a `ChartData` object (a
// parent chart header plus its repeating timed intake/output entry list) and
// derive the reconciliation outputs (spec §4). This is NOT a single numeric
// score — it emits:
//
//   totalIntakeMl                 = Σ intake volumes
//   totalOutputMl                 = Σ output volumes
//   netBalanceMl                  = totalIntakeMl − totalOutputMl   (+ = net gain)
//   intakeByCategory{}            = per-category intake subtotals
//   outputByCategory{}            = per-category output subtotals
//   runningBalance[]              = time-sorted cumulative balance (last == net)
//   urineOutputMl                 = outputByCategory['urine']
//   hoursObserved                 = chartPeriodHours (fallback: span of entryAt)
//   urineOutputRateMlPerKgPerHour = urineOutputMl / weightKg / hoursObserved
//   fluidStatus                   = balanced | positive | negative | oliguria
//
// A missing `volumeMl` contributes nothing (treated as absent, not zero-valued).

/**
 * @typedef {import('./types.js').ChartData} ChartData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').Entry} Entry
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').RunningBalancePoint} RunningBalancePoint
 */

/**
 * Coerce a value to a finite number, or null when absent / non-numeric.
 * @param {*} v
 * @returns {number | null}
 */
function num(v) {
  return typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v) ? v : null;
}

/**
 * Span, in hours, between the earliest and latest recorded `entryAt`. Returns 0
 * when fewer than two timestamped entries are present.
 * @param {Entry[]} entries
 * @returns {number}
 */
function spanHours(entries) {
  const times = entries
    .map((e) => (e.entryAt ? Date.parse(e.entryAt) : NaN))
    .filter((t) => !Number.isNaN(t));
  if (times.length < 2) return 0;
  const min = Math.min(...times);
  const max = Math.max(...times);
  return (max - min) / (1000 * 60 * 60);
}

/**
 * Compute the full fluid-balance grade for the supplied chart data.
 * @param {ChartData} data
 * @returns {Omit<GradingResult, 'flaggedIssues' | 'timestamp'>}
 */
function gradeFluidBalance(data) {
  const entries = data.entries || [];

  let totalIntakeMl = 0;
  let totalOutputMl = 0;
  /** @type {Record<string, number>} */
  const intakeByCategory = {};
  /** @type {Record<string, number>} */
  const outputByCategory = {};

  for (const e of entries) {
    const v = num(e.volumeMl);
    if (v === null) continue;
    if (e.direction === 'intake') {
      totalIntakeMl += v;
      if (e.category) intakeByCategory[e.category] = (intakeByCategory[e.category] || 0) + v;
    } else if (e.direction === 'output') {
      totalOutputMl += v;
      if (e.category) outputByCategory[e.category] = (outputByCategory[e.category] || 0) + v;
    }
  }

  const netBalanceMl = totalIntakeMl - totalOutputMl;

  // Running balance: time-sorted entries with a recorded volume; intake adds,
  // output subtracts. The final accumulated value equals netBalanceMl.
  const sorted = entries
    .filter((e) => num(e.volumeMl) !== null && e.entryAt)
    .slice()
    .sort((a, b) => String(a.entryAt).localeCompare(String(b.entryAt)));
  let acc = 0;
  /** @type {RunningBalancePoint[]} */
  const runningBalance = sorted.map((e) => {
    const v = /** @type {number} */ (num(e.volumeMl));
    acc += e.direction === 'intake' ? v : -v;
    return { entryAt: e.entryAt, balanceMl: acc };
  });

  const urineOutputMl = outputByCategory['urine'] || 0;
  const weightKg = num(data.patient.weightKg);

  // hoursObserved: the charting period when set, else the span of the entries.
  const periodHours = num(data.context.chartPeriodHours);
  let hoursObserved = periodHours !== null && periodHours > 0 ? periodHours : spanHours(entries);

  const urineOutputRateMlPerKgPerHour =
    weightKg !== null && weightKg > 0 && hoursObserved > 0
      ? urineOutputMl / weightKg / hoursObserved
      : null;

  const positiveThresholdMl = significantBalanceThresholdMl(hoursObserved);
  const negativeThresholdMl = significantBalanceThresholdMl(hoursObserved);

  const fluidStatus = classifyFluidStatus({
    netBalanceMl,
    urineOutputRateMlPerKgPerHour,
    hoursObserved,
    positiveThresholdMl,
    negativeThresholdMl
  });

  // Audit trail mirroring the grade_rule table.
  /** @type {FiredRule[]} */
  const firedRules = [
    {
      id: 'R-TOTALS-01',
      category: 'totals',
      description: `Intake ${totalIntakeMl} mL, output ${totalOutputMl} mL`
    },
    {
      id: 'R-NET-BALANCE-01',
      category: 'net-balance',
      description: `Net balance ${netBalanceMl >= 0 ? '+' : ''}${netBalanceMl} mL over ${hoursObserved} h`
    },
    {
      id: 'R-URINE-RATE-01',
      category: 'urine-rate',
      description:
        urineOutputRateMlPerKgPerHour === null
          ? 'Urine output rate not computable (weight or hours missing)'
          : `Urine output rate ${urineOutputRateMlPerKgPerHour.toFixed(2)} mL/kg/h`
    },
    {
      id: 'R-FLUID-STATUS-01',
      category: 'fluid-status',
      description: `Fluid status: ${fluidStatusLabel(fluidStatus)}`
    }
  ];
  for (const c of Object.keys(intakeByCategory)) {
    firedRules.push({
      id: 'R-INTAKE-SUBTOTAL-01',
      category: 'intake-subtotal',
      description: `${categoryLabel(c)} intake ${intakeByCategory[c]} mL`
    });
  }
  for (const c of Object.keys(outputByCategory)) {
    firedRules.push({
      id: 'R-OUTPUT-SUBTOTAL-01',
      category: 'output-subtotal',
      description: `${categoryLabel(c)} output ${outputByCategory[c]} mL`
    });
  }

  return {
    totalIntakeMl,
    totalOutputMl,
    netBalanceMl,
    intakeByCategory,
    outputByCategory,
    runningBalance,
    urineOutputMl,
    hoursObserved,
    weightKg,
    urineOutputRateMlPerKgPerHour,
    positiveThresholdMl,
    negativeThresholdMl,
    fluidStatus,
    firedRules
  };
}

export { num, spanHours, gradeFluidBalance };
