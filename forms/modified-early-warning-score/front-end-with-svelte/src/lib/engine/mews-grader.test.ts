import { describe, it, expect } from 'vitest';
import { gradeMews, computeSubscores } from './mews-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
	scoreSystolicBloodPressure,
	scoreHeartRate,
	scoreRespiratoryRate,
	scoreTemperature,
	scoreAvpu
} from './mews-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			observedAt: '',
			careSetting: '',
			wardLocation: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		bloodPressure: { systolicBloodPressure: null },
		heartRate: { heartRate: null },
		respiratory: { respiratoryRate: null },
		temperature: { temperature: null },
		consciousness: { avpu: '' },
		summary: { previousMewsScore: null, clinicalNotes: '' }
	};
}

/** A fully-answered, all-normal (aggregate 0) observation set. */
function createNormalPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse J. Okafor',
		clinicianRole: 'nurse',
		observedAt: '2026-06-24T09:30',
		careSetting: 'acute-ward',
		wardLocation: 'AMU Bay 3'
	};
	d.identification = { patientIdentifier: 'WD-100482', ageBand: '40-59', sex: 'female' };
	d.bloodPressure.systolicBloodPressure = 122; // 0
	d.heartRate.heartRate = 72; // 0
	d.respiratory.respiratoryRate = 14; // 0
	d.temperature.temperature = 36.8; // 0
	d.consciousness.avpu = 'alert'; // 0
	return d;
}

describe('MEWS per-parameter scoring bands', () => {
	it('systolic blood pressure bands', () => {
		expect(scoreSystolicBloodPressure(70)).toBe(3);
		expect(scoreSystolicBloodPressure(71)).toBe(2);
		expect(scoreSystolicBloodPressure(80)).toBe(2);
		expect(scoreSystolicBloodPressure(81)).toBe(1);
		expect(scoreSystolicBloodPressure(100)).toBe(1);
		expect(scoreSystolicBloodPressure(101)).toBe(0);
		expect(scoreSystolicBloodPressure(199)).toBe(0);
		expect(scoreSystolicBloodPressure(200)).toBe(2);
		expect(scoreSystolicBloodPressure(null)).toBeNull();
	});

	it('heart rate bands', () => {
		expect(scoreHeartRate(40)).toBe(2);
		expect(scoreHeartRate(41)).toBe(1);
		expect(scoreHeartRate(50)).toBe(1);
		expect(scoreHeartRate(51)).toBe(0);
		expect(scoreHeartRate(100)).toBe(0);
		expect(scoreHeartRate(101)).toBe(1);
		expect(scoreHeartRate(110)).toBe(1);
		expect(scoreHeartRate(111)).toBe(2);
		expect(scoreHeartRate(129)).toBe(2);
		expect(scoreHeartRate(130)).toBe(3);
	});

	it('respiratory rate bands', () => {
		expect(scoreRespiratoryRate(8)).toBe(2);
		expect(scoreRespiratoryRate(9)).toBe(0);
		expect(scoreRespiratoryRate(14)).toBe(0);
		expect(scoreRespiratoryRate(15)).toBe(1);
		expect(scoreRespiratoryRate(20)).toBe(1);
		expect(scoreRespiratoryRate(21)).toBe(2);
		expect(scoreRespiratoryRate(29)).toBe(2);
		expect(scoreRespiratoryRate(30)).toBe(3);
	});

	it('temperature bands', () => {
		expect(scoreTemperature(34.9)).toBe(2);
		expect(scoreTemperature(35.0)).toBe(0);
		expect(scoreTemperature(38.4)).toBe(0);
		expect(scoreTemperature(38.5)).toBe(2);
	});

	it('AVPU bands', () => {
		expect(scoreAvpu('alert')).toBe(0);
		expect(scoreAvpu('voice')).toBe(1);
		expect(scoreAvpu('pain')).toBe(2);
		expect(scoreAvpu('unresponsive')).toBe(3);
		expect(scoreAvpu('')).toBeNull();
	});
});

describe('MEWS aggregate grading engine', () => {
	it('scores aggregate 0 / low band for a fully-normal patient', () => {
		const r = gradeMews(createNormalPatient());
		expect(r.mewsScore).toBe(0);
		expect(r.riskBand).toBe('low');
		expect(r.singleParameterTrigger).toBe(false);
		expect(r.complete).toBe(true);
	});

	it('medium band for aggregate 2-4', () => {
		const d = createNormalPatient();
		d.bloodPressure.systolicBloodPressure = 96; // 1
		d.heartRate.heartRate = 105; // 1
		d.respiratory.respiratoryRate = 16; // 1
		const r = gradeMews(d);
		expect(r.mewsScore).toBe(3);
		expect(r.riskBand).toBe('medium');
		expect(r.singleParameterTrigger).toBe(false);
	});

	it('high band for aggregate >= 5', () => {
		const d = createNormalPatient();
		d.bloodPressure.systolicBloodPressure = 78; // 2
		d.heartRate.heartRate = 118; // 2
		d.temperature.temperature = 38.6; // 2
		const r = gradeMews(d);
		expect(r.mewsScore).toBeGreaterThanOrEqual(5);
		expect(r.riskBand).toBe('high');
		expect(r.singleParameterTrigger).toBe(false);
		expect(r.monitoringFrequency).toContain('Continuous');
	});

	it('sets the single-parameter trigger when any subscore is 3', () => {
		const d = createNormalPatient();
		d.consciousness.avpu = 'unresponsive'; // scores 3
		const r = gradeMews(d);
		expect(r.singleParameterTrigger).toBe(true);
		expect(r.mewsScore).toBe(3);
	});

	it('unanswered parameters contribute 0 and mark the grade incomplete', () => {
		const r = gradeMews(createDefaultAssessment());
		expect(r.mewsScore).toBe(0);
		expect(r.complete).toBe(false);
	});

	it('all fired-rule IDs are unique', () => {
		const d = createNormalPatient();
		d.consciousness.avpu = 'unresponsive';
		d.respiratory.respiratoryRate = 22;
		const ids = gradeMews(d).firedRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('MEWS flagged-issue detection', () => {
	it('raises no safety flags for a complete normal patient', () => {
		const d = createNormalPatient();
		const g = gradeMews(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			mewsScore: g.mewsScore,
			singleParameterTrigger: g.singleParameterTrigger
		});
		expect(flags).toHaveLength(0);
	});

	it('raises aggregate-escalation and single-parameter flags for a deteriorating patient', () => {
		const d = createNormalPatient();
		d.consciousness.avpu = 'unresponsive'; // 3 — trigger + reduced consciousness
		d.respiratory.respiratoryRate = 32; // 3 — tachypnoea
		const g = gradeMews(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			mewsScore: g.mewsScore,
			singleParameterTrigger: g.singleParameterTrigger
		});
		expect(flags.some((f) => f.id === 'F-AGGREGATE-ESCALATION-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-SINGLE-PARAMETER-3-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-REDUCED-CONSCIOUSNESS-001')).toBe(true);
	});

	it('raises the deteriorating-trend flag when the aggregate rises', () => {
		const d = createNormalPatient();
		d.respiratory.respiratoryRate = 16; // 1 → aggregate 1
		d.summary.previousMewsScore = 0;
		const g = gradeMews(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			mewsScore: g.mewsScore,
			singleParameterTrigger: g.singleParameterTrigger
		});
		expect(flags.some((f) => f.id === 'F-DETERIORATING-TREND-001')).toBe(true);
	});

	it('raises hypotension when systolic BP <= 100', () => {
		const d = createNormalPatient();
		d.bloodPressure.systolicBloodPressure = 96;
		const g = gradeMews(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			mewsScore: g.mewsScore,
			singleParameterTrigger: g.singleParameterTrigger
		});
		expect(flags.some((f) => f.id === 'F-HYPOTENSION-001')).toBe(true);
	});

	it('raises the incomplete-observation flag when observations are missing', () => {
		const d = createDefaultAssessment();
		const g = gradeMews(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			mewsScore: g.mewsScore,
			singleParameterTrigger: g.singleParameterTrigger
		});
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-OBSERVATION-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNormalPatient();
		d.temperature.temperature = 38.6; // medium (pyrexia)
		d.bloodPressure.systolicBloodPressure = 96; // high (hypotension)
		const g = gradeMews(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			mewsScore: g.mewsScore,
			singleParameterTrigger: g.singleParameterTrigger
		});
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
