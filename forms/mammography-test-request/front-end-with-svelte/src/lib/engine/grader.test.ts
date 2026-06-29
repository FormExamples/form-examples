import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { MammographyRequest } from './types';

/** A fully-completed, routine, appropriate screening request fixture. */
function createRoutineScreening(): MammographyRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr Sarah Owen';
	d.clinician.referralDate = '2026-06-10';
	d.patient.firstName = 'Margaret';
	d.patient.lastName = 'Hughes';
	d.patient.dateOfBirth = '1958-03-14';
	d.patient.nhsNumber = '485 777 3456';
	d.request.examType = 'screening';
	d.request.primaryIndication = 'routine-screening';
	d.request.laterality = 'bilateral';
	d.request.clinicalQuestion = 'Routine three-yearly NHSBSP screening mammogram.';
	d.history.previousMammogram = 'normal';
	d.history.pregnancyOrLactating = 'no';
	d.triage.urgency = 'routine';
	return d;
}

/** A breast-lump request in a patient aged ≥ 30 (NICE NG12 two-week-wait). */
function createBreastLump(): MammographyRequest {
	const d = createRoutineScreening();
	d.patient.firstName = 'Aisha';
	d.patient.lastName = 'Rahman';
	d.patient.dateOfBirth = '1980-11-02';
	d.request.examType = 'diagnostic';
	d.request.primaryIndication = 'breast-lump';
	d.request.laterality = 'left';
	d.request.clinicalQuestion = 'New firm lump left breast — characterise.';
	d.symptoms.symptomLump = true;
	d.triage.urgency = 'urgent';
	return d;
}

describe('Mammography test request four-axis grading engine', () => {
	it('grades a complete, appropriate, routine screening as accept / routine', () => {
		const g = calculateGrade(createRoutineScreening());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.triageTier).toBe('routine');
		expect(g.completenessPercent).toBe(100);
		expect(g.priorityBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.twoWeekWaitEligible).toBe(false);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-ROUTINE-SCREENING-IDEAL')).toBe(true);
	});

	it('auto-escalates an unexplained lump aged ≥ 30 to two-week-wait + high priority', () => {
		const g = calculateGrade(createBreastLump());
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.twoWeekWaitEligible).toBe(true);
		expect(g.priorityBand).toBe('high');
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-NG12-LUMP-30')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-LUMP')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-cancer-2ww')).toBe(true);
		expect(g.flags.some((f) => f.category === 'breast-lump')).toBe(true);
	});

	it('does not escalate a lump under age 30 to two-week-wait', () => {
		const d = createBreastLump();
		d.patient.dateOfBirth = '2005-01-01';
		const g = calculateGrade(d);
		expect(g.twoWeekWaitEligible).toBe(false);
		expect(g.priorityBand).toBe('high'); // priority still high from the lump
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-NG12-LUMP-30')).toBe(false);
	});

	it('marks a mismatched exam type for an indication as usually-not-appropriate → query-referrer', () => {
		const d = createRoutineScreening();
		d.request.examType = 'symptomatic';
		d.request.primaryIndication = 'routine-screening';
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-ROUTINE-SCREENING-MISMATCH')).toBe(true);
	});

	it('scores a plausible-but-suboptimal pairing as may-be-appropriate', () => {
		const d = createRoutineScreening();
		d.request.primaryIndication = 'family-history';
		d.request.examType = 'diagnostic';
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.appropriatenessScore).toBe(5);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-FAMILY-HISTORY-PLAUSIBLE')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const d = createRoutineScreening();
		d.request.primaryIndication = '';
		d.request.clinicalQuestion = '';
		const g = calculateGrade(d);
		// indication (3) + clinical question (3) of 16 total weight missing → 10/16 ≈ 63%.
		expect(g.completenessPercent).toBe(63);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createBreastLump());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Mammography flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const d = createRoutineScreening();
		d.request.primaryIndication = '';
		d.request.clinicalQuestion = '';
		const flags = detectFlags(d);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('flags a pregnant patient for radiation justification', () => {
		const d = createRoutineScreening();
		d.history.pregnancyOrLactating = 'pregnant';
		const flags = detectFlags(d);
		expect(flags.some((f) => f.flagId === 'F-PREGNANCY-LACTATING-001')).toBe(true);
	});

	it('flags a screening request below the usual screening age', () => {
		const d = createRoutineScreening();
		d.patient.dateOfBirth = '2000-01-01';
		const flags = detectFlags(d);
		expect(flags.some((f) => f.category === 'age-below-screening')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const d = createBreastLump();
		d.request.clinicalQuestion = '';
		const flags = detectFlags(d, { twoWeekWaitEligible: true, twoWeekWaitRationale: 'NG12 lump' });
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine appropriate screening', () => {
		const flags = detectFlags(createRoutineScreening());
		expect(flags).toHaveLength(0);
	});
});
