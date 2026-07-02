import { describe, it, expect } from 'vitest';
import { calculateChildPughGrade } from './child-pugh-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { childPughRules } from './child-pugh-rules';
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
			aetiology: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		bilirubin: { totalBilirubin: null },
		albumin: { serumAlbumin: null },
		coagulation: { inr: null, prothrombinTimeProlongation: null },
		ascitesStep: { ascites: '' },
		encephalopathyStep: { encephalopathy: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-1-point (Class A, score 5) assessment. */
function allMinPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'hepatologist',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'hepatology-clinic',
		aetiology: 'alcohol'
	};
	d.identification = { patientIdentifier: 'HEP-1001', ageBand: '40-59', sex: 'male' };
	d.bilirubin.totalBilirubin = 20; // < 34 → 1
	d.albumin.serumAlbumin = 42; // > 35 → 1
	d.coagulation.inr = 1.1; // < 1.7 → 1
	d.ascitesStep.ascites = 'none'; // → 1
	d.encephalopathyStep.encephalopathy = 'none'; // → 1
	return d;
}

/** A fully-answered, all-3-point (Class C, score 15) assessment. */
function allMaxPatient(): AssessmentData {
	const d = allMinPatient();
	d.bilirubin.totalBilirubin = 80; // > 50 → 3
	d.albumin.serumAlbumin = 22; // < 28 → 3
	d.coagulation.inr = 3.0; // > 2.3 → 3
	d.ascitesStep.ascites = 'moderate-severe'; // → 3
	d.encephalopathyStep.encephalopathy = 'grade-3-4'; // → 3
	return d;
}

describe('Child-Pugh grader — per-parameter thresholds', () => {
	it('scores each parameter at its 1-point band', () => {
		const r = calculateChildPughGrade(allMinPatient());
		expect(r.bilirubinPoint).toBe(1);
		expect(r.albuminPoint).toBe(1);
		expect(r.coagulationPoint).toBe(1);
		expect(r.ascitesPoint).toBe(1);
		expect(r.encephalopathyPoint).toBe(1);
		expect(r.childPughScore).toBe(5);
		expect(r.childPughClass).toBe('A');
		expect(r.complete).toBe(true);
	});

	it('scores each parameter at its 3-point band', () => {
		const r = calculateChildPughGrade(allMaxPatient());
		expect(r.bilirubinPoint).toBe(3);
		expect(r.albuminPoint).toBe(3);
		expect(r.coagulationPoint).toBe(3);
		expect(r.ascitesPoint).toBe(3);
		expect(r.encephalopathyPoint).toBe(3);
		expect(r.childPughScore).toBe(15);
		expect(r.childPughClass).toBe('C');
	});

	it('bands bilirubin at the 34 and 50 boundaries', () => {
		const d = allMinPatient();
		d.bilirubin.totalBilirubin = 33.9;
		expect(calculateChildPughGrade(d).bilirubinPoint).toBe(1);
		d.bilirubin.totalBilirubin = 34;
		expect(calculateChildPughGrade(d).bilirubinPoint).toBe(2);
		d.bilirubin.totalBilirubin = 50;
		expect(calculateChildPughGrade(d).bilirubinPoint).toBe(2);
		d.bilirubin.totalBilirubin = 50.1;
		expect(calculateChildPughGrade(d).bilirubinPoint).toBe(3);
	});

	it('bands albumin at the 35 and 28 boundaries', () => {
		const d = allMinPatient();
		d.albumin.serumAlbumin = 35.1;
		expect(calculateChildPughGrade(d).albuminPoint).toBe(1);
		d.albumin.serumAlbumin = 35;
		expect(calculateChildPughGrade(d).albuminPoint).toBe(2);
		d.albumin.serumAlbumin = 28;
		expect(calculateChildPughGrade(d).albuminPoint).toBe(2);
		d.albumin.serumAlbumin = 27.9;
		expect(calculateChildPughGrade(d).albuminPoint).toBe(3);
	});

	it('bands INR at the 1.7 and 2.3 boundaries', () => {
		const d = allMinPatient();
		d.coagulation.inr = 1.69;
		expect(calculateChildPughGrade(d).coagulationPoint).toBe(1);
		d.coagulation.inr = 1.7;
		expect(calculateChildPughGrade(d).coagulationPoint).toBe(2);
		d.coagulation.inr = 2.3;
		expect(calculateChildPughGrade(d).coagulationPoint).toBe(2);
		d.coagulation.inr = 2.31;
		expect(calculateChildPughGrade(d).coagulationPoint).toBe(3);
	});

	it('prefers INR over prothrombin time, using PT only as a fallback', () => {
		const d = allMinPatient();
		// INR present → PT ignored.
		d.coagulation.inr = 1.0;
		d.coagulation.prothrombinTimeProlongation = 8;
		expect(calculateChildPughGrade(d).coagulationPoint).toBe(1);
		// No INR → PT fallback (4-6 s → 2).
		d.coagulation.inr = null;
		d.coagulation.prothrombinTimeProlongation = 5;
		expect(calculateChildPughGrade(d).coagulationPoint).toBe(2);
		d.coagulation.prothrombinTimeProlongation = 7;
		expect(calculateChildPughGrade(d).coagulationPoint).toBe(3);
	});
});

describe('Child-Pugh grader — class boundaries', () => {
	it('bands total 6 as Class A and 7 as Class B (6/7 boundary)', () => {
		// Base is score 5 (all 1-point). Bump bilirubin to 2 → score 6.
		const six = allMinPatient();
		six.bilirubin.totalBilirubin = 40; // 2 pt
		const r6 = calculateChildPughGrade(six);
		expect(r6.childPughScore).toBe(6);
		expect(r6.childPughClass).toBe('A');

		// Add albumin 2 pt → score 7.
		const seven = allMinPatient();
		seven.bilirubin.totalBilirubin = 40; // 2 pt
		seven.albumin.serumAlbumin = 30; // 2 pt
		const r7 = calculateChildPughGrade(seven);
		expect(r7.childPughScore).toBe(7);
		expect(r7.childPughClass).toBe('B');
	});

	it('bands total 9 as Class B and 10 as Class C (9/10 boundary)', () => {
		// bilirubin 2 + albumin 2 + coag 2 + ascites 2 + enceph 1 = 9.
		const nine = allMinPatient();
		nine.bilirubin.totalBilirubin = 40; // 2
		nine.albumin.serumAlbumin = 30; // 2
		nine.coagulation.inr = 2.0; // 2
		nine.ascitesStep.ascites = 'mild'; // 2
		nine.encephalopathyStep.encephalopathy = 'none'; // 1
		const r9 = calculateChildPughGrade(nine);
		expect(r9.childPughScore).toBe(9);
		expect(r9.childPughClass).toBe('B');

		// Bump encephalopathy to grade-1-2 (2 pt) → score 10.
		const ten = calculateChildPughGrade({
			...nine,
			encephalopathyStep: { encephalopathy: 'grade-1-2' }
		});
		expect(ten.childPughScore).toBe(10);
		expect(ten.childPughClass).toBe('C');
	});

	it('fixes the survival and surgical-risk estimates per class', () => {
		expect(calculateChildPughGrade(allMinPatient()).surgicalRisk).toBe('low');
		expect(calculateChildPughGrade(allMaxPatient()).surgicalRisk).toBe('high');
		expect(calculateChildPughGrade(allMaxPatient()).oneYearSurvival).toBe('~45%');
	});
});

describe('Child-Pugh grader — completeness', () => {
	it('marks a blank assessment incomplete and raises a data-completeness flag', () => {
		const r = calculateChildPughGrade(createDefaultAssessment());
		expect(r.complete).toBe(false);
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('computes a partial total over answered parameters only', () => {
		const d = createDefaultAssessment();
		d.bilirubin.totalBilirubin = 20; // 1
		d.albumin.serumAlbumin = 42; // 1
		const r = calculateChildPughGrade(d);
		expect(r.complete).toBe(false);
		expect(r.childPughScore).toBe(2);
	});

	it('all rule IDs are unique', () => {
		const ids = childPughRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Child-Pugh flagged-issue detection', () => {
	it('raises no red flags for a complete Class A patient', () => {
		const r = calculateChildPughGrade(allMinPatient());
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises decompensation, transplant, and high-surgical-risk flags for Class C', () => {
		const r = calculateChildPughGrade(allMaxPatient());
		const ids = r.flaggedIssues.map((f) => f.id);
		expect(ids).toContain('F-CLASS-C-DECOMPENSATED-001');
		expect(ids).toContain('F-TRANSPLANT-CONSIDERATION-001');
		expect(ids).toContain('F-HIGH-SURGICAL-RISK-001');
		expect(ids).toContain('F-ENCEPHALOPATHY-001');
		expect(ids).toContain('F-REFRACTORY-ASCITES-001');
		expect(ids).toContain('F-SEVERE-COAGULOPATHY-001');
	});

	it('raises the moderate-surgical-risk flag for Class B', () => {
		const d = allMinPatient();
		d.bilirubin.totalBilirubin = 40; // 2
		d.albumin.serumAlbumin = 30; // 2 → score 7 (Class B)
		const r = calculateChildPughGrade(d);
		expect(r.childPughClass).toBe('B');
		expect(r.flaggedIssues.some((f) => f.id === 'F-MODERATE-SURGICAL-RISK-001')).toBe(true);
	});

	it('does not raise the class-C flags for an incomplete partial total', () => {
		const d = createDefaultAssessment();
		d.encephalopathyStep.encephalopathy = 'grade-3-4'; // 3 pt but rest missing
		const r = calculateChildPughGrade(d);
		expect(r.complete).toBe(false);
		expect(r.flaggedIssues.some((f) => f.id === 'F-CLASS-C-DECOMPENSATED-001')).toBe(false);
		// Encephalopathy flag is independent of completeness.
		expect(r.flaggedIssues.some((f) => f.id === 'F-ENCEPHALOPATHY-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const r = calculateChildPughGrade(allMaxPatient());
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('detectFlaggedIssues can be called directly on a grading result', () => {
		const grade = calculateChildPughGrade(allMaxPatient());
		const flags = detectFlaggedIssues(allMaxPatient(), grade);
		expect(flags.length).toBeGreaterThan(0);
	});
});
