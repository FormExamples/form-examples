// Fluid Balance Chart grader. Pure functions: take a `ChartData` object (a
// parent chart header plus its two repeating child lists — the intake rows and
// the output rows) and derive the reconciliation outputs (spec §4). This is NOT
// a single numeric score — it emits:
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

import type { ChartData, Direction, Entry, FiredRule, GradingResult, RunningBalancePoint } from './types';
import { categoryLabel, fluidStatusLabel } from './utils';
import { classifyFluidStatus, significantBalanceThresholdMl } from './fluid-balance-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Coerce a value to a finite number, or null when absent / non-numeric. */
export function num(v: unknown): number | null {
	return typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v) ? v : null;
}

/**
 * Span, in hours, between the earliest and latest recorded `entryAt`. Returns 0
 * when fewer than two timestamped entries are present.
 */
export function spanHours(entries: Entry[]): number {
	const times = entries
		.map((e) => (e.entryAt ? Date.parse(e.entryAt) : NaN))
		.filter((t) => !Number.isNaN(t));
	if (times.length < 2) return 0;
	const min = Math.min(...times);
	const max = Math.max(...times);
	return (max - min) / (1000 * 60 * 60);
}

/** Sum a directional entry list, accumulating totals and per-category subtotals. */
function sumEntries(entries: Entry[]): { total: number; byCategory: Record<string, number> } {
	let total = 0;
	const byCategory: Record<string, number> = {};
	for (const e of entries) {
		const v = num(e.volumeMl);
		if (v === null) continue;
		total += v;
		if (e.category) byCategory[e.category] = (byCategory[e.category] || 0) + v;
	}
	return { total, byCategory };
}

/**
 * Pure function: compute the full fluid-balance grade for the supplied chart
 * data, including the audit trail, the flagged issues, and a timestamp.
 */
export function calculateGrade(data: ChartData): GradingResult {
	const intake = data.intake || [];
	const output = data.output || [];

	const { total: totalIntakeMl, byCategory: intakeByCategory } = sumEntries(intake);
	const { total: totalOutputMl, byCategory: outputByCategory } = sumEntries(output);

	const netBalanceMl = totalIntakeMl - totalOutputMl;

	// Running balance: intake rows tagged +, output rows tagged −, time-sorted;
	// entries with a recorded volume and a timestamp only. The final accumulated
	// value equals netBalanceMl.
	const tagged: { entry: Entry; direction: Direction }[] = [
		...intake.map((entry) => ({ entry, direction: 'intake' as Direction })),
		...output.map((entry) => ({ entry, direction: 'output' as Direction }))
	];
	const sorted = tagged
		.filter((t) => num(t.entry.volumeMl) !== null && t.entry.entryAt)
		.slice()
		.sort((a, b) => String(a.entry.entryAt).localeCompare(String(b.entry.entryAt)));
	let acc = 0;
	const runningBalance: RunningBalancePoint[] = sorted.map((t) => {
		const v = num(t.entry.volumeMl) as number;
		acc += t.direction === 'intake' ? v : -v;
		return { entryAt: t.entry.entryAt, balanceMl: acc };
	});

	const urineOutputMl = outputByCategory['urine'] || 0;
	const weightKg = num(data.patient.weightKg);

	// hoursObserved: the charting period when set, else the span of the entries.
	const periodHours = num(data.context.chartPeriodHours);
	const hoursObserved =
		periodHours !== null && periodHours > 0 ? periodHours : spanHours([...intake, ...output]);

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
	const firedRules: FiredRule[] = [
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
			description: `${categoryLabel(c as never)} intake ${intakeByCategory[c]} mL`
		});
	}
	for (const c of Object.keys(outputByCategory)) {
		firedRules.push({
			id: 'R-OUTPUT-SUBTOTAL-01',
			category: 'output-subtotal',
			description: `${categoryLabel(c as never)} output ${outputByCategory[c]} mL`
		});
	}

	const core = {
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

	const flaggedIssues = detectFlaggedIssues(data, core);

	return {
		...core,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
