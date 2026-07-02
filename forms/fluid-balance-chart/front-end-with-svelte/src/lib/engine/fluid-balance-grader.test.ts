import { describe, it, expect } from 'vitest';
import { calculateGrade } from './fluid-balance-grader';
import { significantBalanceThresholdMl } from './fluid-balance-rules';
import type { ChartData, Entry } from './types';

/**
 * A blank chart (mirrors the store's `createDefaultAssessment`). Defined locally
 * so the engine tests never import the store, which pulls in the SvelteKit-only
 * `$app/environment` module.
 */
function createDefaultChart(): ChartData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			patientIdentifier: '',
			wardOrUnit: '',
			chartStartAt: '',
			chartPeriodHours: 24
		},
		patient: { weightKg: null },
		intake: [],
		output: [],
		note: { clinicalNote: '' }
	};
}

function entry(entryAt: string, category: Entry['category'], volumeMl: number | null): Entry {
	return { entryAt, category, description: '', volumeMl };
}

describe('fluid-balance grader — reconciliation', () => {
	it('sums intake, output, and the net balance', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 70;
		d.intake = [entry('2026-06-22T08:00', 'oral', 1000), entry('2026-06-22T10:00', 'iv', 500)];
		d.output = [entry('2026-06-22T12:00', 'urine', 600)];
		const g = calculateGrade(d);
		expect(g.totalIntakeMl).toBe(1500);
		expect(g.totalOutputMl).toBe(600);
		expect(g.netBalanceMl).toBe(900);
	});

	it('produces a negative net balance when output exceeds intake', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 70;
		d.intake = [entry('2026-06-22T08:00', 'oral', 500)];
		d.output = [entry('2026-06-22T12:00', 'urine', 800)];
		const g = calculateGrade(d);
		expect(g.netBalanceMl).toBe(-300);
	});

	it('accumulates per-category subtotals', () => {
		const d = createDefaultChart();
		d.intake = [entry('2026-06-22T08:00', 'oral', 300), entry('2026-06-22T09:00', 'oral', 200), entry('2026-06-22T10:00', 'iv', 500)];
		d.output = [entry('2026-06-22T12:00', 'urine', 400)];
		const g = calculateGrade(d);
		expect(g.intakeByCategory['oral']).toBe(500);
		expect(g.intakeByCategory['iv']).toBe(500);
		expect(g.outputByCategory['urine']).toBe(400);
	});

	it('ignores entries with a missing volume', () => {
		const d = createDefaultChart();
		d.intake = [entry('2026-06-22T08:00', 'oral', 1000), entry('', 'iv', null)];
		const g = calculateGrade(d);
		expect(g.totalIntakeMl).toBe(1000);
	});

	it('builds a time-sorted running balance whose last point equals the net balance', () => {
		const d = createDefaultChart();
		d.intake = [entry('2026-06-22T14:00', 'oral', 400)];
		d.output = [entry('2026-06-22T09:00', 'urine', 300), entry('2026-06-22T12:00', 'drains', 100)];
		const g = calculateGrade(d);
		// Sorted: 09:00 (−300), 12:00 (−400), 14:00 (0).
		expect(g.runningBalance.map((p) => p.balanceMl)).toEqual([-300, -400, 0]);
		expect(g.runningBalance[g.runningBalance.length - 1].balanceMl).toBe(g.netBalanceMl);
	});

	it('computes the weight-indexed urine-output rate in mL/kg/h', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 60;
		d.context.chartPeriodHours = 24;
		d.output = [entry('2026-06-22T12:00', 'urine', 720)];
		const g = calculateGrade(d);
		// 720 / 60 / 24 = 0.5
		expect(g.urineOutputRateMlPerKgPerHour).toBeCloseTo(0.5, 5);
	});

	it('leaves the urine-output rate null when weight is missing', () => {
		const d = createDefaultChart();
		d.output = [entry('2026-06-22T12:00', 'urine', 720)];
		const g = calculateGrade(d);
		expect(g.urineOutputRateMlPerKgPerHour).toBeNull();
	});
});

describe('fluid-balance grader — classification', () => {
	it('classifies a small net balance as Balanced', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 70;
		d.intake = [entry('2026-06-22T08:00', 'oral', 2000)];
		d.output = [entry('2026-06-22T12:00', 'urine', 1900)];
		const g = calculateGrade(d);
		expect(g.fluidStatus).toBe('balanced');
	});

	it('classifies a large positive balance as Positive', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 70;
		d.intake = [entry('2026-06-22T08:00', 'iv', 3000)];
		d.output = [entry('2026-06-22T12:00', 'urine', 1500)];
		const g = calculateGrade(d);
		expect(g.netBalanceMl).toBe(1500);
		expect(g.fluidStatus).toBe('positive');
	});

	it('classifies a large negative balance as Negative', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 70;
		d.intake = [entry('2026-06-22T08:00', 'oral', 1000)];
		d.output = [entry('2026-06-22T12:00', 'urine', 2500)];
		const g = calculateGrade(d);
		expect(g.netBalanceMl).toBe(-1500);
		expect(g.fluidStatus).toBe('negative');
	});

	it('oliguria takes precedence: urine rate below 0.5 mL/kg/h over >= 6 h', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 60;
		d.context.chartPeriodHours = 24;
		// 700 / 60 / 24 = 0.486 mL/kg/h (< 0.5)
		d.output = [entry('2026-06-22T12:00', 'urine', 700)];
		const g = calculateGrade(d);
		expect(g.urineOutputRateMlPerKgPerHour).toBeLessThan(0.5);
		expect(g.fluidStatus).toBe('oliguria');
	});

	it('does not fire oliguria exactly at the 0.5 mL/kg/h boundary', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 60;
		d.context.chartPeriodHours = 24;
		// 720 / 60 / 24 = 0.50 mL/kg/h (not < 0.5)
		d.output = [entry('2026-06-22T12:00', 'urine', 720)];
		const g = calculateGrade(d);
		expect(g.fluidStatus).not.toBe('oliguria');
	});

	it('scales the significant-balance threshold to the charting period', () => {
		expect(significantBalanceThresholdMl(24)).toBe(1000);
		expect(significantBalanceThresholdMl(48)).toBe(2000);

		const d = createDefaultChart();
		// Weight omitted so the urine rate is null and oliguria cannot pre-empt.
		d.context.chartPeriodHours = 48; // threshold now ±2000 mL
		d.intake = [entry('2026-06-22T08:00', 'iv', 3000)];
		d.output = [entry('2026-06-23T08:00', 'urine', 1500)];
		const g = calculateGrade(d);
		// net +1500 over 48 h is below the +2000 threshold → balanced, not positive.
		expect(g.netBalanceMl).toBe(1500);
		expect(g.positiveThresholdMl).toBe(2000);
		expect(g.fluidStatus).toBe('balanced');
	});
});

describe('fluid-balance grader — flagged issues', () => {
	it('raises no flags for a balanced, fully-recorded chart', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 70;
		d.intake = [entry('2026-06-22T08:00', 'oral', 2000)];
		d.output = [entry('2026-06-22T12:00', 'urine', 1900)];
		const g = calculateGrade(d);
		expect(g.flaggedIssues).toHaveLength(0);
	});

	it('raises the fluid-overload flag on a significant positive balance', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 70;
		d.intake = [entry('2026-06-22T08:00', 'iv', 3000)];
		d.output = [entry('2026-06-22T12:00', 'urine', 1500)];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-FLUID-OVERLOAD-001')).toBe(true);
	});

	it('raises the dehydration flag on a significant negative balance', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 70;
		d.intake = [entry('2026-06-22T08:00', 'oral', 1000)];
		d.output = [entry('2026-06-22T12:00', 'urine', 2500)];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-DEHYDRATION-001')).toBe(true);
	});

	it('raises the oliguria flag when the urine rate is below 0.5 mL/kg/h', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 60;
		d.output = [entry('2026-06-22T12:00', 'urine', 700)];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-OLIGURIA-001')).toBe(true);
	});

	it('raises the anuria flag when the urine rate is below 0.05 mL/kg/h', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 60;
		// 50 / 60 / 24 = 0.035 mL/kg/h (< 0.05)
		d.output = [entry('2026-06-22T12:00', 'urine', 50)];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-ANURIA-001')).toBe(true);
	});

	it('raises the missing-weight flag when weight is absent', () => {
		const d = createDefaultChart();
		d.intake = [entry('2026-06-22T08:00', 'oral', 500)];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-WEIGHT-001')).toBe(true);
	});

	it('raises the no-entries flag when nothing is recorded', () => {
		const d = createDefaultChart();
		d.patient.weightKg = 70;
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-NO-ENTRIES-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultChart();
		// no weight (medium) + significant positive balance (high)
		d.intake = [entry('2026-06-22T08:00', 'iv', 3000)];
		d.output = [entry('2026-06-22T12:00', 'urine', 1500)];
		const g = calculateGrade(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = g.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
