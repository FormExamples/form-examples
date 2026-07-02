import { describe, it, expect } from 'vitest';
import { triage, computeSubscores, news2Escalation } from './ed-triage-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
	scoreRespiratoryRate,
	scoreSpo2,
	scoreBloodPressure,
	scorePulse,
	scoreTemperature,
	scoreConsciousness
} from './ed-triage-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { nurseName: '', triagedAt: '', careSetting: '' },
		arrival: { arrivalMode: '', arrivedAt: '', referralSource: '' },
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		complaint: { presentingComplaint: '', briefHistory: '', symptomOnset: '' },
		vitals: {
			respiratoryRate: null,
			spo2: null,
			onOxygen: '',
			systolicBp: null,
			pulse: null,
			consciousnessAcvpu: '',
			temperature: null,
			glasgowComaScale: null
		},
		pain: { painScore: null },
		discriminators: {
			airwayThreat: '',
			breathingInadequate: '',
			circulationShock: '',
			haemorrhageMajor: '',
			consciousnessReduced: '',
			seizureActive: '',
			focalNeurology: '',
			sepsisFeatures: '',
			chestPainCardiac: '',
			strokeFeatures: '',
			paediatricRedFlag: ''
		},
		note: { clinicalNotes: '' }
	};
}

/** A fully-answered, all-normal (aggregate 0, pain 0) presentation on air. */
function createNormalPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'Nurse J. Okafor',
		triagedAt: '2026-06-20T09:30',
		careSetting: 'emergency-department'
	};
	d.identification.patientIdentifier = 'ED-2026-0001';
	d.identification.ageBand = 'adult';
	d.vitals.respiratoryRate = 16; // 0
	d.vitals.spo2 = 98; // 0
	d.vitals.onOxygen = 'air'; // 0
	d.vitals.systolicBp = 122; // 0
	d.vitals.pulse = 72; // 0
	d.vitals.consciousnessAcvpu = 'A'; // 0
	d.vitals.temperature = 37.0; // 0
	d.pain.painScore = 0;
	return d;
}

describe('NEWS2 per-parameter scoring bands', () => {
	it('respiratory rate bands', () => {
		expect(scoreRespiratoryRate(8)).toBe(3);
		expect(scoreRespiratoryRate(9)).toBe(1);
		expect(scoreRespiratoryRate(12)).toBe(0);
		expect(scoreRespiratoryRate(21)).toBe(2);
		expect(scoreRespiratoryRate(25)).toBe(3);
		expect(scoreRespiratoryRate(null)).toBeNull();
	});

	it('SpO2 Scale 1 bands', () => {
		expect(scoreSpo2(91)).toBe(3);
		expect(scoreSpo2(92)).toBe(2);
		expect(scoreSpo2(94)).toBe(1);
		expect(scoreSpo2(96)).toBe(0);
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

describe('ED triage classification (MTS priority level)', () => {
	it('classifies a fully-normal minimal presentation as Level 5 (Non-urgent)', () => {
		const r = triage(createNormalPatient());
		expect(r.priorityLevel).toBe(5);
		expect(r.priorityColour).toBe('blue');
		expect(r.priorityName).toBe('Non-urgent');
		expect(r.targetMinutes).toBe(240);
		expect(r.news2Total).toBe(0);
		expect(r.complete).toBe(true);
	});

	it('defaults to Level 4 (Standard) when nothing fires but findings are non-zero', () => {
		const d = createNormalPatient();
		d.pain.painScore = 2; // below the 4-6 moderate band; nothing fires
		const r = triage(d);
		expect(r.priorityLevel).toBe(4);
		expect(r.priorityName).toBe('Standard');
		expect(r.targetMinutes).toBe(120);
	});

	it('forces Level 1 (Immediate) on any life-threat discriminator', () => {
		const d = createNormalPatient();
		d.discriminators.airwayThreat = 'yes';
		const r = triage(d);
		expect(r.priorityLevel).toBe(1);
		expect(r.priorityColour).toBe('red');
		expect(r.priorityName).toBe('Immediate');
		expect(r.targetMinutes).toBe(0);
	});

	it('forces Level 1 on Unresponsive ACVPU (derived discriminator)', () => {
		const d = createNormalPatient();
		d.vitals.consciousnessAcvpu = 'U';
		const r = triage(d);
		expect(r.priorityLevel).toBe(1);
	});

	it('forces Level 2 (Very urgent) on chest pain of possible cardiac origin', () => {
		const d = createNormalPatient();
		d.discriminators.chestPainCardiac = 'yes';
		const r = triage(d);
		expect(r.priorityLevel).toBe(2);
		expect(r.priorityName).toBe('Very urgent');
		expect(r.targetMinutes).toBe(10);
	});

	it('forces Level 3 (Urgent) on moderate pain (4-6)', () => {
		const d = createNormalPatient();
		d.pain.painScore = 5;
		const r = triage(d);
		expect(r.priorityLevel).toBe(3);
		expect(r.priorityName).toBe('Urgent');
		expect(r.targetMinutes).toBe(60);
	});

	it('most-urgent-wins: Level-1 airway beats a Level-3 NEWS2 escalation', () => {
		const d = createNormalPatient();
		d.discriminators.airwayThreat = 'yes'; // Level 1
		d.vitals.temperature = 35.5; // NEWS2 1
		d.vitals.respiratoryRate = 21; // NEWS2 2 -> aggregate 3 (no escalation)
		const r = triage(d);
		expect(r.priorityLevel).toBe(1);
	});
});

describe('NEWS2 escalation raises the MTS level', () => {
	it('aggregate 5-6 forces at least Level 3 (Urgent)', () => {
		const d = createNormalPatient();
		d.vitals.respiratoryRate = 22; // 2
		d.vitals.pulse = 120; // 2
		d.vitals.temperature = 35.5; // 1  -> aggregate 5
		const r = triage(d);
		expect(r.news2Total).toBe(5);
		expect(r.priorityLevel).toBe(3);
	});

	it('aggregate >= 7 forces at least Level 2 (Very urgent)', () => {
		const d = createNormalPatient();
		d.vitals.respiratoryRate = 26; // 3
		d.vitals.spo2 = 91; // 3 -> also < 92 hypoxia (Level 2)
		d.vitals.pulse = 120; // 2 -> aggregate >= 8
		const r = triage(d);
		expect(r.news2Total).toBeGreaterThanOrEqual(7);
		expect(r.news2AnyParameterThree).toBe(true);
		expect(r.priorityLevel).toBe(2);
	});

	it('a single parameter scoring 3 escalates to Level 2 even at a low aggregate', () => {
		const d = createNormalPatient();
		d.vitals.temperature = 34.5; // scores 3, aggregate 3
		const r = triage(d);
		expect(r.news2Total).toBe(3);
		expect(r.news2AnyParameterThree).toBe(true);
		expect(r.priorityLevel).toBe(2);
	});

	it('news2Escalation is a pure helper: no escalation below 5', () => {
		expect(news2Escalation(4, false)).toHaveLength(0);
		expect(news2Escalation(5, false)[0].level).toBe(3);
		expect(news2Escalation(7, false)[0].level).toBe(2);
		expect(news2Escalation(2, true)[0].level).toBe(2);
	});

	it('missing vital signs never lower the category', () => {
		const d = createDefaultAssessment();
		d.discriminators.chestPainCardiac = 'yes'; // Level 2
		const r = triage(d);
		expect(r.priorityLevel).toBe(2);
		expect(r.complete).toBe(false);
	});
});

describe('ED triage flagged-issue detection', () => {
	it('raises no safety flags for a complete normal patient', () => {
		const d = createNormalPatient();
		const r = triage(d);
		const flags = detectFlaggedIssues(d, {
			firedDiscriminators: r.firedDiscriminators,
			news2Total: r.news2Total,
			news2AnyParameterThree: r.news2AnyParameterThree
		});
		expect(flags).toHaveLength(0);
	});

	it('raises resus-immediate for a Level-1 discriminator', () => {
		const d = createNormalPatient();
		d.discriminators.circulationShock = 'yes';
		const r = triage(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-RESUS-IMMEDIATE-001')).toBe(true);
	});

	it('raises sepsis-escalate for sepsis features or high NEWS2', () => {
		const d = createNormalPatient();
		d.discriminators.sepsisFeatures = 'yes';
		const r = triage(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-SEPSIS-ESCALATE-001')).toBe(true);
	});

	it('raises chest-pain and stroke time-critical flags', () => {
		const d = createNormalPatient();
		d.discriminators.chestPainCardiac = 'yes';
		d.discriminators.strokeFeatures = 'yes';
		const r = triage(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-CHEST-PAIN-001')).toBe(true);
		expect(r.flaggedIssues.some((f) => f.id === 'F-STROKE-001')).toBe(true);
	});

	it('raises severe-pain (medium) for pain >= 7', () => {
		const d = createNormalPatient();
		d.pain.painScore = 8;
		const r = triage(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-SEVERE-PAIN-001')).toBe(true);
	});

	it('raises incomplete-vitals (low) when observations are missing', () => {
		const d = createDefaultAssessment();
		const r = triage(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-VITALS-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNormalPatient();
		d.discriminators.airwayThreat = 'yes'; // high
		d.pain.painScore = 8; // medium (severe pain)
		d.vitals.temperature = null; // low (incomplete)
		const r = triage(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('all fired-discriminator IDs are unique', () => {
		const d = createNormalPatient();
		d.discriminators.airwayThreat = 'yes';
		d.discriminators.chestPainCardiac = 'yes';
		const ids = triage(d).firedDiscriminators.map((f) => f.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('computeSubscores adds the +2 oxygen weighting', () => {
		const d = createNormalPatient();
		d.vitals.onOxygen = 'oxygen';
		expect(computeSubscores(d).oxygen).toBe(2);
	});
});
