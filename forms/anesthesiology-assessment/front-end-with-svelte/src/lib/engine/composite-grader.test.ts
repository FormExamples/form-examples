import { describe, it, expect } from 'vitest';
import { gradeAssessment } from './composite-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { evaluateAsa, asaRiskFromClass } from './asa-rules';
import { evaluateAirway } from './mallampati-rules';
import { evaluateRcri, rcriRiskFromScore } from './rcri-rules';
import { evaluateStopbang, stopbangRiskFromScore } from './stopbang-rules';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';
import type { AssessmentData } from './types';

function healthyPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics.firstName = 'Test';
	d.demographics.lastName = 'Patient';
	d.demographics.dateOfBirth = '1990-01-01';
	d.demographics.sex = 'female';
	d.investigationsAndPlan.asaClass = 'i';
	return d;
}

describe('ASA sub-grader', () => {
	it('maps ASA classes to risk bands', () => {
		expect(asaRiskFromClass('i')).toBe('low');
		expect(asaRiskFromClass('ii')).toBe('low');
		expect(asaRiskFromClass('iii')).toBe('medium');
		expect(asaRiskFromClass('iv')).toBe('high');
		expect(asaRiskFromClass('v')).toBe('critical');
		expect(asaRiskFromClass('vi')).toBe('critical');
		expect(asaRiskFromClass('')).toBe('low');
	});

	it('fires a rule and flags emergency cases', () => {
		const d = healthyPatient();
		d.investigationsAndPlan.asaClass = 'iv';
		d.investigationsAndPlan.emergencyCase = 'yes';
		const r = evaluateAsa(d);
		expect(r.riskLevel).toBe('high');
		expect(r.emergency).toBe(true);
		expect(r.firedRules).toHaveLength(1);
		expect(r.firedRules[0].description).toContain('Emergency');
	});
});

describe('Mallampati / airway sub-grader', () => {
	it('returns low risk for an unremarkable airway', () => {
		const d = healthyPatient();
		d.physicalExam.mallampatiClass = 'ii';
		expect(evaluateAirway(d).riskLevel).toBe('low');
	});

	it('returns high risk for Mallampati IV', () => {
		const d = healthyPatient();
		d.physicalExam.mallampatiClass = 'iv';
		expect(evaluateAirway(d).riskLevel).toBe('high');
	});

	it('escalates to high risk with two medium factors', () => {
		const d = healthyPatient();
		d.physicalExam.mallampatiClass = 'iii';
		d.physicalExam.mouthOpening = 2.5;
		const r = evaluateAirway(d);
		expect(r.mediumFactors).toBe(2);
		expect(r.riskLevel).toBe('high');
	});

	it('returns high risk for a previous difficult intubation', () => {
		const d = healthyPatient();
		d.previousAnaesthesia.difficultIntubation = true;
		expect(evaluateAirway(d).riskLevel).toBe('high');
	});
});

describe('RCRI sub-grader', () => {
	it('maps scores to risk bands', () => {
		expect(rcriRiskFromScore(0)).toBe('low');
		expect(rcriRiskFromScore(1)).toBe('medium');
		expect(rcriRiskFromScore(2)).toBe('high');
		expect(rcriRiskFromScore(3)).toBe('critical');
	});

	it('counts criteria and computes MACE percent', () => {
		const d = healthyPatient();
		d.plannedSurgery.surgeryGrade = 'major';
		d.investigationsAndPlan.rcriIschaemicHeartDisease = 'yes';
		d.investigationsAndPlan.rcriCongestiveHeartFailure = 'yes';
		const r = evaluateRcri(d);
		expect(r.score).toBe(3);
		expect(r.riskLevel).toBe('critical');
		expect(r.macePercent).toBe(5.4);
	});
});

describe('STOP-BANG sub-grader', () => {
	it('maps scores to risk bands', () => {
		expect(stopbangRiskFromScore(2)).toBe('low');
		expect(stopbangRiskFromScore(3)).toBe('medium');
		expect(stopbangRiskFromScore(5)).toBe('high');
	});

	it('counts the eight items', () => {
		const d = healthyPatient();
		d.demographics.sex = 'male';
		d.demographics.dateOfBirth = '1950-01-01';
		d.medicalHistory.hypertension = 'yes';
		d.socialHistory.snoresLoudly = 'yes';
		d.socialHistory.tiredDuringDay = 'yes';
		d.vitalSigns.bmi = 36;
		d.vitalSigns.neckCircumference = 43;
		const r = evaluateStopbang(d);
		expect(r.score).toBe(7);
		expect(r.riskLevel).toBe('high');
	});
});

describe('Composite grader', () => {
	it('returns low risk for a healthy ASA I patient', () => {
		const d = healthyPatient();
		const r = gradeAssessment(d);
		expect(r.overallRisk).toBe('low');
		expect(r.additionalFlags).toHaveLength(0);
	});

	it('promotes the worst sub-risk to the overall risk', () => {
		const d = healthyPatient();
		d.investigationsAndPlan.asaClass = 'ii'; // low
		d.physicalExam.mallampatiClass = 'iv'; // high
		const r = gradeAssessment(d);
		expect(r.overallRisk).toBe('high');
	});

	it('returns critical risk for ASA V', () => {
		const d = healthyPatient();
		d.investigationsAndPlan.asaClass = 'v';
		expect(gradeAssessment(d).overallRisk).toBe('critical');
	});

	it('collects fired rules from every sub-grader', () => {
		const d = healthyPatient();
		d.investigationsAndPlan.asaClass = 'iii';
		d.physicalExam.mallampatiClass = 'iii';
		d.plannedSurgery.surgeryGrade = 'major';
		d.socialHistory.snoresLoudly = 'yes';
		const r = gradeAssessment(d);
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('ASA-001');
		expect(ids).toContain('MALL-001');
		expect(ids).toContain('RCRI-001');
		expect(ids).toContain('SB-S');
	});

	it('produces unique fired-rule ids', () => {
		const d = healthyPatient();
		d.investigationsAndPlan.asaClass = 'iii';
		d.physicalExam.mallampatiClass = 'iii';
		d.physicalExam.jawProtrusion = 'limited';
		d.plannedSurgery.surgeryGrade = 'major';
		d.socialHistory.snoresLoudly = 'yes';
		d.socialHistory.tiredDuringDay = 'yes';
		const r = gradeAssessment(d);
		const ids = r.firedRules.map((f) => f.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Flagged issues', () => {
	it('returns no flags for a healthy patient', () => {
		expect(detectAdditionalFlags(healthyPatient())).toHaveLength(0);
	});

	it('flags latex allergy and anaphylaxis history', () => {
		const d = healthyPatient();
		d.allergies.latexAllergy = 'yes';
		d.allergies.list = [{ allergen: 'Penicillin', type: 'drug', reaction: 'Throat swelling', severity: 'anaphylaxis' }];
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-LATEX')).toBe(true);
		expect(flags.some((f) => f.id.startsWith('FLAG-ANAPH'))).toBe(true);
	});

	it('flags malignant hyperthermia risk', () => {
		const d = healthyPatient();
		d.previousAnaesthesia.malignantHyperthermia = 'yes';
		expect(detectAdditionalFlags(d).some((f) => f.id === 'FLAG-MH')).toBe(true);
	});

	it('flags anticoagulant use', () => {
		const d = healthyPatient();
		d.medications.onAnticoagulants = 'yes';
		expect(detectAdditionalFlags(d).some((f) => f.id === 'FLAG-ANTICOAG')).toBe(true);
	});

	it('sorts flags urgent first', () => {
		const d = healthyPatient();
		d.socialHistory.smoking = 'current'; // low
		d.allergies.list = [{ allergen: 'Latex', type: 'latex', reaction: 'Shock', severity: 'anaphylaxis' }]; // urgent
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => order[f.priority]);
		expect(priorities).toEqual([...priorities].sort((a, b) => a - b));
	});
});
