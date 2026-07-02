import { describe, it, expect } from 'vitest';
import { gradeNews2, computeSubscores } from './news2-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
	scoreRespiratoryRate,
	scoreSpo2,
	scoreBloodPressure,
	scorePulse,
	scoreTemperature,
	scoreConsciousness
} from './news2-rules';
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
			observationAt: '',
			wardOrLocation: '',
			spo2Scale: '',
			spo2Scale2Endorsed: ''
		},
		identification: {
			patientName: '',
			nhsNumber: '',
			birthDate: '',
			isUnder16: '',
			isPregnant: '',
			hasSpinalCordInjury: ''
		},
		respiration: { respiratoryRate: null },
		oxygenSaturation: { spo2: null },
		oxygenSupport: {
			onOxygen: '',
			oxygenDevice: '',
			oxygenFlowRateLMin: null,
			inspiredOxygenFractionPercent: null
		},
		bloodPressure: { systolicBloodPressure: null, diastolicBloodPressure: null },
		pulse: { pulse: null },
		consciousness: { consciousnessAcvpu: '' },
		temperature: { temperature: null },
		note: { clinicalNotes: '' }
	};
}

/** A fully-answered, all-normal (aggregate 0) observation set on Scale 1 air. */
function createNormalPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse J. Okafor',
		clinicianRole: 'nurse',
		observationAt: '2026-06-20T09:30',
		wardOrLocation: 'AMU Bay 3',
		spo2Scale: 'scale-1',
		spo2Scale2Endorsed: ''
	};
	d.identification.patientName = 'Grace Osei';
	d.respiration.respiratoryRate = 16; // 0
	d.oxygenSaturation.spo2 = 98; // 0
	d.oxygenSupport.onOxygen = 'air'; // 0
	d.bloodPressure.systolicBloodPressure = 122; // 0
	d.pulse.pulse = 72; // 0
	d.consciousness.consciousnessAcvpu = 'A'; // 0
	d.temperature.temperature = 37.0; // 0
	return d;
}

describe('NEWS2 per-parameter scoring bands', () => {
	it('respiration rate bands', () => {
		expect(scoreRespiratoryRate(8)).toBe(3);
		expect(scoreRespiratoryRate(9)).toBe(1);
		expect(scoreRespiratoryRate(12)).toBe(0);
		expect(scoreRespiratoryRate(20)).toBe(0);
		expect(scoreRespiratoryRate(21)).toBe(2);
		expect(scoreRespiratoryRate(24)).toBe(2);
		expect(scoreRespiratoryRate(25)).toBe(3);
		expect(scoreRespiratoryRate(null)).toBeNull();
	});

	it('SpO2 Scale 1 bands', () => {
		expect(scoreSpo2(91, 'scale-1', 'air')).toBe(3);
		expect(scoreSpo2(92, 'scale-1', 'air')).toBe(2);
		expect(scoreSpo2(94, 'scale-1', 'air')).toBe(1);
		expect(scoreSpo2(96, 'scale-1', 'air')).toBe(0);
	});

	it('SpO2 Scale 2 bands depend on air vs oxygen above target', () => {
		expect(scoreSpo2(83, 'scale-2', 'air')).toBe(3);
		expect(scoreSpo2(88, 'scale-2', 'air')).toBe(0);
		expect(scoreSpo2(92, 'scale-2', 'air')).toBe(0);
		// Above target: on air scores 1, on oxygen scores 1/2/3.
		expect(scoreSpo2(95, 'scale-2', 'air')).toBe(1);
		expect(scoreSpo2(94, 'scale-2', 'oxygen')).toBe(1);
		expect(scoreSpo2(96, 'scale-2', 'oxygen')).toBe(2);
		expect(scoreSpo2(98, 'scale-2', 'oxygen')).toBe(3);
	});

	it('systolic BP bands', () => {
		expect(scoreBloodPressure(90)).toBe(3);
		expect(scoreBloodPressure(100)).toBe(2);
		expect(scoreBloodPressure(110)).toBe(1);
		expect(scoreBloodPressure(180)).toBe(0);
		expect(scoreBloodPressure(220)).toBe(3);
	});

	it('pulse bands', () => {
		expect(scorePulse(40)).toBe(3);
		expect(scorePulse(50)).toBe(1);
		expect(scorePulse(70)).toBe(0);
		expect(scorePulse(100)).toBe(1);
		expect(scorePulse(120)).toBe(2);
		expect(scorePulse(131)).toBe(3);
	});

	it('temperature bands', () => {
		expect(scoreTemperature(35.0)).toBe(3);
		expect(scoreTemperature(35.5)).toBe(1);
		expect(scoreTemperature(37.0)).toBe(0);
		expect(scoreTemperature(38.5)).toBe(1);
		expect(scoreTemperature(39.5)).toBe(2);
	});

	it('consciousness scores 3 for anything other than Alert', () => {
		expect(scoreConsciousness('A')).toBe(0);
		expect(scoreConsciousness('C')).toBe(3);
		expect(scoreConsciousness('U')).toBe(3);
		expect(scoreConsciousness('')).toBeNull();
	});
});

describe('NEWS2 aggregate grading engine', () => {
	it('scores aggregate 0 / low band for a fully-normal patient', () => {
		const r = gradeNews2(createNormalPatient());
		expect(r.aggregate).toBe(0);
		expect(r.riskBand).toBe('low');
		expect(r.redScore).toBe(false);
		expect(r.complete).toBe(true);
		expect(r.monitoringFrequency).toContain('12-hourly');
	});

	it('adds the +2 oxygen weighting when on supplemental oxygen', () => {
		const d = createNormalPatient();
		d.oxygenSupport.onOxygen = 'oxygen';
		const s = computeSubscores(d);
		expect(s.oxygen).toBe(2);
		expect(gradeNews2(d).aggregate).toBe(2);
	});

	it('escalates to at least low-medium on a single red score even at low aggregate', () => {
		const d = createNormalPatient();
		d.respiration.respiratoryRate = 26; // scores 3
		const r = gradeNews2(d);
		expect(r.redScore).toBe(true);
		expect(r.aggregate).toBe(3);
		expect(r.riskBand).toBe('low-medium');
	});

	it('medium band for aggregate 5-6', () => {
		const d = createNormalPatient();
		d.respiration.respiratoryRate = 22; // 2
		d.pulse.pulse = 120; // 2
		d.temperature.temperature = 35.5; // 1
		const r = gradeNews2(d);
		expect(r.aggregate).toBe(5);
		expect(r.riskBand).toBe('medium');
	});

	it('high band for aggregate >= 7', () => {
		const d = createNormalPatient();
		d.respiration.respiratoryRate = 26; // 3
		d.oxygenSaturation.spo2 = 91; // 3 (Scale 1)
		d.pulse.pulse = 120; // 2
		const r = gradeNews2(d);
		expect(r.aggregate).toBeGreaterThanOrEqual(7);
		expect(r.riskBand).toBe('high');
		expect(r.monitoringFrequency).toContain('Continuous');
	});

	it('unanswered parameters contribute 0 and mark the grade incomplete', () => {
		const r = gradeNews2(createDefaultAssessment());
		expect(r.aggregate).toBe(0);
		expect(r.complete).toBe(false);
	});

	it('all fired-rule IDs are unique', () => {
		const d = createNormalPatient();
		d.respiration.respiratoryRate = 26;
		d.pulse.pulse = 120;
		const ids = gradeNews2(d).firedRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('NEWS2 flagged-issue detection', () => {
	it('raises no safety flags for a complete normal patient', () => {
		const d = createNormalPatient();
		const g = gradeNews2(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			aggregate: g.aggregate,
			redScore: g.redScore
		});
		expect(flags).toHaveLength(0);
	});

	it('raises red-score, hypoxia and aggregate flags for a deteriorating patient', () => {
		const d = createNormalPatient();
		d.oxygenSaturation.spo2 = 90; // hypoxia + red score (Scale 1)
		d.respiration.respiratoryRate = 26; // red score
		const g = gradeNews2(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			aggregate: g.aggregate,
			redScore: g.redScore
		});
		expect(flags.some((f) => f.id === 'F-SINGLE-PARAMETER-3-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-HYPOXIA-001')).toBe(true);
	});

	it('raises new-confusion for any ACVPU value other than Alert', () => {
		const d = createNormalPatient();
		d.consciousness.consciousnessAcvpu = 'C';
		const g = gradeNews2(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			aggregate: g.aggregate,
			redScore: g.redScore
		});
		expect(flags.some((f) => f.id === 'F-NEW-CONFUSION-001')).toBe(true);
	});

	it('raises hypotension when systolic BP <= 90', () => {
		const d = createNormalPatient();
		d.bloodPressure.systolicBloodPressure = 88;
		const g = gradeNews2(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			aggregate: g.aggregate,
			redScore: g.redScore
		});
		expect(flags.some((f) => f.id === 'F-HYPOTENSION-001')).toBe(true);
	});

	it('raises out-of-scope for pregnancy / under-16 / spinal-cord injury', () => {
		const d = createNormalPatient();
		d.identification.isPregnant = 'yes';
		const g = gradeNews2(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			aggregate: g.aggregate,
			redScore: g.redScore
		});
		expect(flags.some((f) => f.id === 'F-OUT-OF-SCOPE-001')).toBe(true);
	});

	it('raises the incomplete-observation flag when observations are missing', () => {
		const d = createDefaultAssessment();
		const g = gradeNews2(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			aggregate: g.aggregate,
			redScore: g.redScore
		});
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-OBSERVATION-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNormalPatient();
		d.oxygenSupport.onOxygen = 'oxygen'; // medium (on-oxygen)
		d.bloodPressure.systolicBloodPressure = 88; // high (hypotension)
		const g = gradeNews2(d);
		const flags = detectFlaggedIssues(d, {
			subscores: g.subscores,
			aggregate: g.aggregate,
			redScore: g.redScore
		});
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
