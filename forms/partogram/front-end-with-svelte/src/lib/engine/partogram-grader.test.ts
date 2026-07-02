import { describe, it, expect } from 'vitest';
import { calculateGrade, latestDilatationObservation } from './partogram-grader';
import { classifyProgress, alertLineExpectedCm, actionLineExpectedCm } from './partogram-rules';
import type { AssessmentData, Observation } from './types';

/**
 * A blank observation row (mirrors the store's `createDefaultObservation`).
 * Defined locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function obs(overrides: Partial<Observation> = {}): Observation {
	return {
		observedAt: '',
		cervicalDilatationCm: null,
		descentFifths: null,
		contractionsPer10Min: null,
		contractionDurationBand: '',
		contractionStrength: '',
		fetalHeartRate: null,
		liquorState: '',
		moulding: '',
		systolicBloodPressure: null,
		diastolicBloodPressure: null,
		pulse: null,
		temperature: null,
		urineVolumeMl: null,
		urineProtein: '',
		urineKetones: '',
		urineGlucose: '',
		oxytocinRate: null,
		drugsAndFluids: '',
		...overrides
	};
}

/** A blank partogram record (mirrors the store's `createDefaultAssessment`). */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', careSetting: '', activePhaseStartAt: '' },
		patient: { patientIdentifier: '', ageBand: '', parity: '', gestationWeeks: null },
		admission: { membranesOnAdmission: '', riskFactors: '', plannedCare: '' },
		observations: []
	};
}

describe('partogram reference-line geometry', () => {
	it('places the alert line at 4 + t and the action line at t', () => {
		expect(alertLineExpectedCm(0)).toBe(4);
		expect(alertLineExpectedCm(6)).toBe(10);
		expect(actionLineExpectedCm(4)).toBe(4);
		expect(actionLineExpectedCm(6)).toBe(6);
	});

	it('classifies on / left / right of the alert line', () => {
		// At t = 2 h: alert expects 6 cm, action expects 2 cm.
		expect(classifyProgress(6, 2)).toBe('normal'); // on the alert line
		expect(classifyProgress(7, 2)).toBe('normal'); // left of (ahead of) alert
		expect(classifyProgress(4, 2)).toBe('alertLineCrossed'); // between the lines
		expect(classifyProgress(2, 2)).toBe('actionLineCrossed'); // on the action line
		expect(classifyProgress(1, 2)).toBe('actionLineCrossed'); // right of the action line
	});
});

describe('partogram grader', () => {
	it('defaults to normal with null lines and an incomplete flag when there are no observations', () => {
		const g = calculateGrade(createDefaultAssessment());
		expect(g.progressClassification).toBe('normal');
		expect(g.latestDilatationCm).toBeNull();
		expect(g.elapsedHours).toBeNull();
		expect(g.alertLineExpectedCm).toBeNull();
		expect(g.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-NONE-001')).toBe(true);
	});

	it('classifies a normal labour on / ahead of the alert line', () => {
		const d = createDefaultAssessment();
		d.context.activePhaseStartAt = '2026-06-22T06:00';
		d.observations = [obs({ observedAt: '2026-06-22T09:00', cervicalDilatationCm: 8 })]; // t=3, alert=7
		const g = calculateGrade(d);
		expect(g.elapsedHours).toBeCloseTo(3, 5);
		expect(g.alertLineExpectedCm).toBeCloseTo(7, 5);
		expect(g.progressClassification).toBe('normal');
		expect(g.firedLines).toHaveLength(0);
	});

	it('classifies alert-line-crossed between the two lines and raises the medium flag', () => {
		const d = createDefaultAssessment();
		d.context.activePhaseStartAt = '2026-06-23T06:00';
		d.observations = [obs({ observedAt: '2026-06-23T09:30', cervicalDilatationCm: 6 })]; // t=3.5, alert=7.5, action=3.5
		const g = calculateGrade(d);
		expect(g.progressClassification).toBe('alertLineCrossed');
		expect(g.firedLines.some((l) => l.id === 'alert')).toBe(true);
		expect(g.flaggedIssues.some((f) => f.id === 'F-ALERT-LINE-001')).toBe(true);
	});

	it('classifies action-line-crossed on / right of the action line and raises the high flag', () => {
		const d = createDefaultAssessment();
		d.context.activePhaseStartAt = '2026-06-24T00:00';
		d.observations = [obs({ observedAt: '2026-06-24T06:00', cervicalDilatationCm: 5 })]; // t=6, alert=10, action=6
		const g = calculateGrade(d);
		expect(g.progressClassification).toBe('actionLineCrossed');
		expect(g.firedLines.some((l) => l.id === 'action')).toBe(true);
		expect(g.flaggedIssues.some((f) => f.id === 'F-ACTION-LINE-001')).toBe(true);
	});

	it('uses the latest dilatation observation by time', () => {
		const d = createDefaultAssessment();
		d.observations = [
			obs({ observedAt: '2026-06-22T06:00', cervicalDilatationCm: 4 }),
			obs({ observedAt: '2026-06-22T10:00', cervicalDilatationCm: 9 })
		];
		const latest = latestDilatationObservation(d.observations);
		expect(latest?.cervicalDilatationCm).toBe(9);
	});
});

describe('partogram flagged-issue detection', () => {
	it('raises the fetal-heart-abnormal flag for an out-of-range FHR', () => {
		const d = createDefaultAssessment();
		d.observations = [obs({ observedAt: '2026-06-22T08:00', fetalHeartRate: 100 })];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-FHR-001')).toBe(true);
	});

	it('does not raise the FHR flag for a normal FHR', () => {
		const d = createDefaultAssessment();
		d.observations = [obs({ observedAt: '2026-06-22T08:00', fetalHeartRate: 140 })];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-FHR-001')).toBe(false);
	});

	it('raises the meconium flag when liquor is meconium-stained', () => {
		const d = createDefaultAssessment();
		d.observations = [obs({ observedAt: '2026-06-22T08:00', liquorState: 'meconium' })];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-MECONIUM-001')).toBe(true);
	});

	it('raises the maternal-fever flag at or above 37.5 C', () => {
		const d = createDefaultAssessment();
		d.observations = [obs({ observedAt: '2026-06-22T08:00', temperature: 37.8 })];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-FEVER-001')).toBe(true);
	});

	it('raises the maternal-hypertension flag at or above 140/90', () => {
		const d = createDefaultAssessment();
		d.observations = [
			obs({ observedAt: '2026-06-22T08:00', systolicBloodPressure: 150, diastolicBloodPressure: 95 })
		];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-HYPERTENSION-001')).toBe(true);
	});

	it('raises the maternal-tachycardia and hypotension flags', () => {
		const d = createDefaultAssessment();
		d.observations = [obs({ observedAt: '2026-06-22T08:00', pulse: 125, systolicBloodPressure: 84 })];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-TACHYCARDIA-001')).toBe(true);
		expect(g.flaggedIssues.some((f) => f.id === 'F-HYPOTENSION-001')).toBe(true);
	});

	it('raises the ketonuria and proteinuria flags for present dipstick results', () => {
		const d = createDefaultAssessment();
		d.observations = [obs({ observedAt: '2026-06-22T08:00', urineKetones: '++', urineProtein: '+' })];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-KETONURIA-001')).toBe(true);
		expect(g.flaggedIssues.some((f) => f.id === 'F-PROTEINURIA-001')).toBe(true);
	});

	it('raises the poor-progress flag when dilatation does not increase over >= 4 h', () => {
		const d = createDefaultAssessment();
		d.observations = [
			obs({ observedAt: '2026-06-22T06:00', cervicalDilatationCm: 5 }),
			obs({ observedAt: '2026-06-22T11:00', cervicalDilatationCm: 5 })
		];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-POOR-PROGRESS-001')).toBe(true);
	});

	it('raises the incomplete-rows flag when a plotted row is missing a time or dilatation', () => {
		const d = createDefaultAssessment();
		d.observations = [obs({ observedAt: '', cervicalDilatationCm: 6 })];
		const g = calculateGrade(d);
		expect(g.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-ROWS-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment();
		d.context.activePhaseStartAt = '2026-06-24T00:00';
		d.observations = [
			obs({
				observedAt: '2026-06-24T06:00',
				cervicalDilatationCm: 5, // action-line crossed → high
				pulse: 130, // tachycardia → medium
				urineKetones: '+' // ketonuria → low
			})
		];
		const g = calculateGrade(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = g.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
