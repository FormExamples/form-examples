import { describe, it, expect } from 'vitest';
import { calculateSofaGrade, deriveMortalityBand } from './sofa-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
	scoreRespiration,
	scoreCoagulation,
	scoreLiver,
	scoreCardiovascular,
	scoreCns,
	scoreRenal
} from './sofa-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			assessorName: '',
			assessorRole: '',
			assessorRegistrationNumber: '',
			assessedAt: '',
			careLocation: '',
			hoursSinceAdmission: null
		},
		baseline: {
			patientIdentifier: '',
			ageYears: null,
			sex: '',
			admissionDiagnosis: '',
			suspectedInfection: '',
			baselineSofaTotal: null
		},
		respiration: { pao2: null, fio2: null, pao2Fio2Ratio: null, respiratorySupport: '' },
		coagulation: { platelets: null },
		liver: { bilirubin: null },
		cardiovascular: { map: null, vasopressor: '', vasopressorDose: null },
		cns: { glasgowComaScale: null, sedated: '' },
		renal: { creatinine: null, urineOutput: null },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-normal (total 0) assessment. */
function createNormalPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context.assessorName = 'Dr A. Khan';
	d.context.assessorRole = 'intensivist';
	d.context.careLocation = 'icu';
	d.baseline.patientIdentifier = 'ICU-1001';
	d.baseline.suspectedInfection = 'no';
	d.respiration.pao2Fio2Ratio = 420;
	d.respiration.respiratorySupport = 'none';
	d.coagulation.platelets = 250;
	d.liver.bilirubin = 10;
	d.cardiovascular.map = 80;
	d.cardiovascular.vasopressor = 'none';
	d.cns.glasgowComaScale = 15;
	d.cns.sedated = 'no';
	d.renal.creatinine = 80;
	d.renal.urineOutput = 1500;
	return d;
}

describe('SOFA per-system scorers', () => {
	it('respiration bands on the P/F ratio (400/300/200/100)', () => {
		const d = createNormalPatient();
		d.respiration.respiratorySupport = 'ventilated';
		d.respiration.pao2Fio2Ratio = 400;
		expect(scoreRespiration(d).score).toBe(0);
		d.respiration.pao2Fio2Ratio = 399;
		expect(scoreRespiration(d).score).toBe(1);
		d.respiration.pao2Fio2Ratio = 250;
		expect(scoreRespiration(d).score).toBe(2);
		d.respiration.pao2Fio2Ratio = 150;
		expect(scoreRespiration(d).score).toBe(3);
		d.respiration.pao2Fio2Ratio = 90;
		expect(scoreRespiration(d).score).toBe(4);
	});

	it('respiration caps at 2 without respiratory support', () => {
		const d = createNormalPatient();
		d.respiration.respiratorySupport = 'none';
		d.respiration.pao2Fio2Ratio = 90; // would be 4 with support
		expect(scoreRespiration(d).score).toBe(2);
	});

	it('respiration derives the ratio from PaO2 and FiO2', () => {
		const d = createNormalPatient();
		d.respiration.pao2Fio2Ratio = null;
		d.respiration.pao2 = 100;
		d.respiration.fio2 = 0.4; // 250 → band 2
		expect(scoreRespiration(d).score).toBe(2);
	});

	it('respiration is null when the ratio is unavailable', () => {
		const d = createDefaultAssessment();
		expect(scoreRespiration(d).score).toBeNull();
	});

	it('coagulation bands on platelets (150/100/50/20)', () => {
		const d = createNormalPatient();
		d.coagulation.platelets = 150;
		expect(scoreCoagulation(d).score).toBe(0);
		d.coagulation.platelets = 149;
		expect(scoreCoagulation(d).score).toBe(1);
		d.coagulation.platelets = 99;
		expect(scoreCoagulation(d).score).toBe(2);
		d.coagulation.platelets = 49;
		expect(scoreCoagulation(d).score).toBe(3);
		d.coagulation.platelets = 19;
		expect(scoreCoagulation(d).score).toBe(4);
	});

	it('liver bands on bilirubin umol/L (20/33/102/205)', () => {
		const d = createNormalPatient();
		d.liver.bilirubin = 19;
		expect(scoreLiver(d).score).toBe(0);
		d.liver.bilirubin = 20;
		expect(scoreLiver(d).score).toBe(1);
		d.liver.bilirubin = 33;
		expect(scoreLiver(d).score).toBe(2);
		d.liver.bilirubin = 102;
		expect(scoreLiver(d).score).toBe(3);
		d.liver.bilirubin = 205;
		expect(scoreLiver(d).score).toBe(4);
	});

	it('cardiovascular takes the max of MAP and vasopressor bands', () => {
		const d = createNormalPatient();
		d.cardiovascular.map = 80;
		d.cardiovascular.vasopressor = 'none';
		expect(scoreCardiovascular(d).score).toBe(0);
		d.cardiovascular.map = 60;
		expect(scoreCardiovascular(d).score).toBe(1);
		d.cardiovascular.vasopressor = 'dobutamine';
		expect(scoreCardiovascular(d).score).toBe(2);
		d.cardiovascular.vasopressor = 'noradrenaline';
		d.cardiovascular.vasopressorDose = 0.05;
		expect(scoreCardiovascular(d).score).toBe(3);
		d.cardiovascular.vasopressorDose = 0.2;
		expect(scoreCardiovascular(d).score).toBe(4);
		d.cardiovascular.vasopressor = 'dopamine';
		d.cardiovascular.vasopressorDose = 20;
		expect(scoreCardiovascular(d).score).toBe(4);
	});

	it('cns bands on GCS (15/13/10/6)', () => {
		const d = createNormalPatient();
		d.cns.glasgowComaScale = 15;
		expect(scoreCns(d).score).toBe(0);
		d.cns.glasgowComaScale = 14;
		expect(scoreCns(d).score).toBe(1);
		d.cns.glasgowComaScale = 12;
		expect(scoreCns(d).score).toBe(2);
		d.cns.glasgowComaScale = 8;
		expect(scoreCns(d).score).toBe(3);
		d.cns.glasgowComaScale = 5;
		expect(scoreCns(d).score).toBe(4);
	});

	it('renal takes the max of creatinine and urine-output bands', () => {
		const d = createNormalPatient();
		d.renal.creatinine = 100;
		d.renal.urineOutput = 1500;
		expect(scoreRenal(d).score).toBe(0);
		d.renal.creatinine = 300; // band 3
		expect(scoreRenal(d).score).toBe(3);
		d.renal.urineOutput = 150; // band 4 dominates
		expect(scoreRenal(d).score).toBe(4);
	});
});

describe('SOFA grading engine', () => {
	it('scores a total of 0 for a fully-normal patient (low band)', () => {
		const r = calculateSofaGrade(createNormalPatient());
		expect(r.totalSofa).toBe(0);
		expect(r.complete).toBe(true);
		expect(r.mortalityBand).toBe('low');
		expect(r.sepsis3).toBe(false);
	});

	it('sums the six sub-scores into the total', () => {
		const d = createNormalPatient();
		d.respiration.respiratorySupport = 'ventilated';
		d.respiration.pao2Fio2Ratio = 90; // 4
		d.coagulation.platelets = 19; // 4
		d.liver.bilirubin = 205; // 4
		d.cardiovascular.map = 60;
		d.cardiovascular.vasopressor = 'noradrenaline';
		d.cardiovascular.vasopressorDose = 0.2; // 4
		d.cns.glasgowComaScale = 5; // 4
		d.renal.creatinine = 500; // 4
		const r = calculateSofaGrade(d);
		expect(r.totalSofa).toBe(24);
		expect(r.mortalityBand).toBe('extreme');
	});

	it('marks the assessment incomplete when a system is unscored', () => {
		const d = createNormalPatient();
		d.coagulation.platelets = null;
		const r = calculateSofaGrade(d);
		expect(r.complete).toBe(false);
		expect(r.subScores.coagulation).toBeNull();
	});

	it('derives delta-SOFA from the baseline', () => {
		const d = createNormalPatient();
		d.coagulation.platelets = 49; // 3
		d.baseline.baselineSofaTotal = 1;
		const r = calculateSofaGrade(d);
		expect(r.totalSofa).toBe(3);
		expect(r.deltaSofa).toBe(2);
	});

	it('sets the Sepsis-3 flag when infection is suspected and delta-SOFA >= 2', () => {
		const d = createNormalPatient();
		d.baseline.suspectedInfection = 'yes';
		d.baseline.baselineSofaTotal = 0;
		d.coagulation.platelets = 49; // 3 → delta +3
		const r = calculateSofaGrade(d);
		expect(r.sepsis3).toBe(true);
	});

	it('mortality bands map correctly', () => {
		expect(deriveMortalityBand(0)).toBe('low');
		expect(deriveMortalityBand(6)).toBe('low');
		expect(deriveMortalityBand(7)).toBe('moderate');
		expect(deriveMortalityBand(10)).toBe('high');
		expect(deriveMortalityBand(13)).toBe('veryHigh');
		expect(deriveMortalityBand(15)).toBe('extreme');
	});
});

describe('SOFA flagged-issue detection', () => {
	it('raises no red flags for a complete normal patient', () => {
		const d = createNormalPatient();
		const g = calculateSofaGrade(d);
		expect(g.flaggedIssues).toHaveLength(0);
	});

	it('raises severe single-organ failure when any sub-score is 4', () => {
		const flags = detectFlaggedIssues(createNormalPatient(), {
			subScores: {
				respiration: 4,
				coagulation: 0,
				liver: 0,
				cardiovascular: 0,
				cns: 0,
				renal: 0
			},
			totalSofa: 4,
			deltaSofa: null
		});
		expect(flags.some((f) => f.id === 'F-SEVERE-SINGLE-ORGAN-FAILURE-001')).toBe(true);
	});

	it('raises multi-organ failure when two or more systems are >= 3', () => {
		const flags = detectFlaggedIssues(createNormalPatient(), {
			subScores: {
				respiration: 3,
				coagulation: 3,
				liver: 0,
				cardiovascular: 0,
				cns: 0,
				renal: 0
			},
			totalSofa: 6,
			deltaSofa: null
		});
		expect(flags.some((f) => f.id === 'F-MULTI-ORGAN-FAILURE-001')).toBe(true);
	});

	it('raises rising-SOFA and high-mortality-risk flags', () => {
		const flags = detectFlaggedIssues(createNormalPatient(), {
			subScores: {
				respiration: 3,
				coagulation: 3,
				liver: 3,
				cardiovascular: 3,
				cns: 0,
				renal: 0
			},
			totalSofa: 12,
			deltaSofa: 3
		});
		expect(flags.some((f) => f.id === 'F-RISING-SOFA-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-HIGH-MORTALITY-RISK-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when a sub-score is null', () => {
		const flags = detectFlaggedIssues(createNormalPatient(), {
			subScores: {
				respiration: null,
				coagulation: 0,
				liver: 0,
				cardiovascular: 0,
				cns: 0,
				renal: 0
			},
			totalSofa: 0,
			deltaSofa: null
		});
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const g = calculateSofaGrade(createDefaultAssessment());
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = g.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
