import { describe, it, expect } from 'vitest';
import { calculatePaduaGrade } from './padua-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { paduaRules } from './padua-rules';
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
			assessedAt: '',
			careSetting: '',
			admissionReason: ''
		},
		identification: { patientIdentifier: '', ageYears: null, sex: '' },
		history: { activeCancer: '', previousVte: '', knownThrombophilia: '' },
		mobility: { reducedMobility: '', recentTraumaOrSurgery: '' },
		cardiorespiratory: {
			heartOrRespiratoryFailure: '',
			acuteMiOrIschaemicStroke: '',
			acuteInfectionOrRheumatological: ''
		},
		metabolic: { bodyMassIndex: null, ongoingHormonalTreatment: '' },
		bleeding: { activeBleeding: '', highBleedingRisk: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-negative (score 0) low-risk assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'acute-medical',
		admissionReason: 'Community-acquired pneumonia'
	};
	d.identification = { patientIdentifier: 'AMU-1001', ageYears: 55, sex: 'male' };
	d.history = { activeCancer: 'no', previousVte: 'no', knownThrombophilia: 'no' };
	d.mobility = { reducedMobility: 'no', recentTraumaOrSurgery: 'no' };
	d.cardiorespiratory = {
		heartOrRespiratoryFailure: 'no',
		acuteMiOrIschaemicStroke: 'no',
		acuteInfectionOrRheumatological: 'no'
	};
	d.metabolic = { bodyMassIndex: 24, ongoingHormonalTreatment: 'no' };
	d.bleeding = { activeBleeding: 'no', highBleedingRisk: 'no' };
	return d;
}

describe('Padua grading engine', () => {
	it('scores 0 for a fully-negative patient (low risk)', () => {
		const r = calculatePaduaGrade(createNegativePatient());
		expect(r.paduaScore).toBe(0);
		expect(r.riskBand).toBe('low');
		expect(r.prophylaxisRecommendation).toBe('none');
	});

	it('awards each factor its weight', () => {
		const d = createNegativePatient();
		d.history.activeCancer = 'yes'; // 3
		expect(calculatePaduaGrade(d).factorPoints.activeCancer).toBe(3);

		const d2 = createNegativePatient();
		d2.mobility.recentTraumaOrSurgery = 'yes'; // 2
		expect(calculatePaduaGrade(d2).factorPoints.recentTraumaOrSurgery).toBe(2);

		const d3 = createNegativePatient();
		d3.metabolic.ongoingHormonalTreatment = 'yes'; // 1
		expect(calculatePaduaGrade(d3).factorPoints.ongoingHormonalTreatment).toBe(1);
	});

	it('elderly-age factor fires at 70, not 69', () => {
		const d69 = createNegativePatient();
		d69.identification.ageYears = 69;
		expect(calculatePaduaGrade(d69).factorPoints.elderlyAge).toBe(0);

		const d70 = createNegativePatient();
		d70.identification.ageYears = 70;
		expect(calculatePaduaGrade(d70).factorPoints.elderlyAge).toBe(1);
	});

	it('obesity factor fires at BMI 30, not 29', () => {
		const d29 = createNegativePatient();
		d29.metabolic.bodyMassIndex = 29;
		expect(calculatePaduaGrade(d29).factorPoints.obesity).toBe(0);

		const d30 = createNegativePatient();
		d30.metabolic.bodyMassIndex = 30;
		expect(calculatePaduaGrade(d30).factorPoints.obesity).toBe(1);
	});

	it('crosses the 3/4 band boundary correctly', () => {
		// 3 points (active cancer only) -> low
		const d3 = createNegativePatient();
		d3.history.activeCancer = 'yes';
		const r3 = calculatePaduaGrade(d3);
		expect(r3.paduaScore).toBe(3);
		expect(r3.riskBand).toBe('low');

		// 4 points (active cancer + recent trauma/surgery) -> high
		const d4 = createNegativePatient();
		d4.history.activeCancer = 'yes'; // 3
		d4.mobility.recentTraumaOrSurgery = 'yes'; // 2 -> total 5
		const r4 = calculatePaduaGrade(d4);
		expect(r4.paduaScore).toBe(5);
		expect(r4.riskBand).toBe('high');
	});

	it('recommends pharmacological prophylaxis for high risk with no bleeding contraindication', () => {
		const d = createNegativePatient();
		d.history.activeCancer = 'yes';
		d.history.previousVte = 'yes'; // 6 -> high
		const r = calculatePaduaGrade(d);
		expect(r.riskBand).toBe('high');
		expect(r.prophylaxisRecommendation).toBe('pharmacological');
	});

	it('downgrades to mechanical prophylaxis when a bleeding contraindication is present', () => {
		const d = createNegativePatient();
		d.history.activeCancer = 'yes';
		d.history.previousVte = 'yes'; // high
		d.bleeding.activeBleeding = 'yes';
		const r = calculatePaduaGrade(d);
		expect(r.riskBand).toBe('high');
		expect(r.prophylaxisRecommendation).toBe('mechanical');
	});

	it('bleeding-risk fields never change the score', () => {
		const d = createNegativePatient();
		d.bleeding.activeBleeding = 'yes';
		d.bleeding.highBleedingRisk = 'yes';
		expect(calculatePaduaGrade(d).paduaScore).toBe(0);
	});

	it('a missing numeric input contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculatePaduaGrade(d);
		expect(r.paduaScore).toBe(0);
		expect(r.riskBand).toBe('low');
	});

	it('sums the maximum possible score to 20', () => {
		const d = createNegativePatient();
		d.history = { activeCancer: 'yes', previousVte: 'yes', knownThrombophilia: 'yes' };
		d.mobility = { reducedMobility: 'yes', recentTraumaOrSurgery: 'yes' };
		d.identification.ageYears = 82;
		d.cardiorespiratory = {
			heartOrRespiratoryFailure: 'yes',
			acuteMiOrIschaemicStroke: 'yes',
			acuteInfectionOrRheumatological: 'yes'
		};
		d.metabolic = { bodyMassIndex: 34, ongoingHormonalTreatment: 'yes' };
		expect(calculatePaduaGrade(d).paduaScore).toBe(20);
	});

	it('all rule IDs are unique', () => {
		const ids = paduaRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Padua flagged-issue detection', () => {
	it('raises no red flags for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags).toHaveLength(0);
	});

	it('raises the high-VTE-risk flag when Padua >= 4', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 6);
		expect(flags.some((f) => f.id === 'F-HIGH-VTE-RISK-001')).toBe(true);
	});

	it('raises the bleeding-contraindication flag', () => {
		const d = createNegativePatient();
		d.bleeding.activeBleeding = 'yes';
		const flags = detectFlaggedIssues(d, 6);
		expect(flags.some((f) => f.id === 'F-BLEEDING-CONTRAINDICATION-001')).toBe(true);
	});

	it('raises active-cancer and previous-VTE medium flags', () => {
		const d = createNegativePatient();
		d.history.activeCancer = 'yes';
		d.history.previousVte = 'yes';
		const flags = detectFlaggedIssues(d, 6);
		expect(flags.some((f) => f.id === 'F-ACTIVE-CANCER-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-PREVIOUS-VTE-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when a numeric input is missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.history.activeCancer = 'yes'; // medium
		d.bleeding.activeBleeding = 'yes'; // high
		const flags = detectFlaggedIssues(d, 6);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
