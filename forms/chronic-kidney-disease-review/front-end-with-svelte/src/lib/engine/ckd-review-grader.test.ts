import { describe, it, expect } from 'vitest';
import { review, computeComponentStatuses, gradeReviewStatus } from './ckd-review-grader';
import {
	gfrCategory,
	albuminuriaCategory,
	kdigoRiskZone,
	selectBpTarget,
	bloodPressureAtTarget,
	isRapidDecline
} from './ckd-review-rules';
import { detectFlaggedIssues } from './flagged-issues';
import type { AssessmentData } from './types';

/**
 * A blank review (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', reviewedAt: '', careSetting: '', reviewType: '' },
		patient: {
			patientIdentifier: '',
			ageBand: '',
			sex: '',
			diabetesStatus: '',
			primaryCause: '',
			monthsSinceDiagnosis: null
		},
		renal: { egfr: null, egfrSampleDate: '', previousEgfr: null, previousEgfrDate: '' },
		albuminuria: { acr: null, acrSampleDate: '', acrMeasured: '' },
		bloodPressure: { systolicBloodPressure: null, diastolicBloodPressure: null },
		medication: {
			aceiOrArbPrescribed: '',
			sglt2iPrescribed: '',
			statinPrescribed: '',
			nephrotoxicDrugPresent: '',
			nephrotoxicDoseAdjusted: '',
			medicationReviewCompleted: ''
		},
		bloods: {
			hba1c: null,
			potassium: null,
			bicarbonate: null,
			calcium: null,
			phosphate: null,
			pth: null,
			haemoglobin: null
		},
		summary: { referralDecision: '', clinicalNote: '' }
	};
}

/** A record with every review bundle item documented and BP at target. */
function createFullyDocumented(): AssessmentData {
	const d = createDefaultAssessment();
	d.renal.egfr = 72; // G2
	d.albuminuria.acr = 1.4; // A1
	d.albuminuria.acrMeasured = 'yes';
	d.bloodPressure.systolicBloodPressure = 128;
	d.bloodPressure.diastolicBloodPressure = 78;
	d.medication.medicationReviewCompleted = 'yes';
	d.bloods.potassium = 4.4;
	d.bloods.haemoglobin = 134;
	return d;
}

describe('G-stage boundaries', () => {
	it('maps eGFR to the correct G-stage at each boundary', () => {
		expect(gfrCategory(null)).toBe(null);
		expect(gfrCategory(90)).toBe('G1');
		expect(gfrCategory(89)).toBe('G2');
		expect(gfrCategory(60)).toBe('G2');
		expect(gfrCategory(59)).toBe('G3a');
		expect(gfrCategory(45)).toBe('G3a');
		expect(gfrCategory(44)).toBe('G3b');
		expect(gfrCategory(30)).toBe('G3b');
		expect(gfrCategory(29)).toBe('G4');
		expect(gfrCategory(15)).toBe('G4');
		expect(gfrCategory(14)).toBe('G5');
		expect(gfrCategory(5)).toBe('G5');
	});
});

describe('A-stage boundaries', () => {
	it('maps urine ACR to the correct albuminuria stage at each boundary', () => {
		expect(albuminuriaCategory(null)).toBe(null);
		expect(albuminuriaCategory(2.9)).toBe('A1');
		expect(albuminuriaCategory(3)).toBe('A2');
		expect(albuminuriaCategory(30)).toBe('A2');
		expect(albuminuriaCategory(30.1)).toBe('A3');
		expect(albuminuriaCategory(70)).toBe('A3');
	});
});

describe('KDIGO risk-zone heat-map', () => {
	it('is null when either stage is missing', () => {
		expect(kdigoRiskZone(null, 'A1')).toBe(null);
		expect(kdigoRiskZone('G1', null)).toBe(null);
	});

	it('indexes every heat-map cell correctly', () => {
		// G1/G2 row
		expect(kdigoRiskZone('G1', 'A1')).toBe('low');
		expect(kdigoRiskZone('G1', 'A2')).toBe('moderate');
		expect(kdigoRiskZone('G1', 'A3')).toBe('high');
		expect(kdigoRiskZone('G2', 'A1')).toBe('low');
		expect(kdigoRiskZone('G2', 'A2')).toBe('moderate');
		expect(kdigoRiskZone('G2', 'A3')).toBe('high');
		// G3a row
		expect(kdigoRiskZone('G3a', 'A1')).toBe('moderate');
		expect(kdigoRiskZone('G3a', 'A2')).toBe('high');
		expect(kdigoRiskZone('G3a', 'A3')).toBe('very-high');
		// G3b row
		expect(kdigoRiskZone('G3b', 'A1')).toBe('high');
		expect(kdigoRiskZone('G3b', 'A2')).toBe('very-high');
		expect(kdigoRiskZone('G3b', 'A3')).toBe('very-high');
		// G4/G5 rows
		expect(kdigoRiskZone('G4', 'A1')).toBe('very-high');
		expect(kdigoRiskZone('G4', 'A3')).toBe('very-high');
		expect(kdigoRiskZone('G5', 'A1')).toBe('very-high');
		expect(kdigoRiskZone('G5', 'A3')).toBe('very-high');
	});
});

describe('blood-pressure target selection', () => {
	it('defaults to 140/90 with no qualifying comorbidity', () => {
		const d = createDefaultAssessment();
		expect(selectBpTarget(d).target).toEqual({ systolic: 140, diastolic: 90 });
	});

	it('tightens to 130/80 for diabetes', () => {
		const d = createDefaultAssessment();
		d.patient.diabetesStatus = 'type2';
		expect(selectBpTarget(d).target).toEqual({ systolic: 130, diastolic: 80 });
	});

	it('tightens to 130/80 for ACR ≥ 70', () => {
		const d = createDefaultAssessment();
		d.albuminuria.acr = 72;
		const t = selectBpTarget(d);
		expect(t.target).toEqual({ systolic: 130, diastolic: 80 });
		expect(t.group).toContain('ACR');
	});

	it('flags at-target only when both readings are below target', () => {
		const d = createDefaultAssessment();
		const t = selectBpTarget(d).target; // 140/90
		expect(bloodPressureAtTarget(d, t)).toBe(null);
		d.bloodPressure.systolicBloodPressure = 138;
		d.bloodPressure.diastolicBloodPressure = 84;
		expect(bloodPressureAtTarget(d, t)).toBe(true);
		d.bloodPressure.systolicBloodPressure = 142;
		expect(bloodPressureAtTarget(d, t)).toBe(false);
	});
});

describe('rapid eGFR decline', () => {
	it('fires on a ≥ 25 % fall with a G-stage change', () => {
		const d = createDefaultAssessment();
		d.renal.previousEgfr = 68; // G2
		d.renal.egfr = 44; // G3b, > 25% fall
		expect(isRapidDecline(d)).toBe(true);
	});

	it('fires on a ≥ 15/year annualised fall', () => {
		const d = createDefaultAssessment();
		d.renal.previousEgfr = 80;
		d.renal.egfr = 60; // 20 fall over 1 year
		d.renal.previousEgfrDate = '2025-06-01';
		d.renal.egfrSampleDate = '2026-06-01';
		expect(isRapidDecline(d)).toBe(true);
	});

	it('does not fire on a small stable fall', () => {
		const d = createDefaultAssessment();
		d.renal.previousEgfr = 62;
		d.renal.egfr = 60;
		d.renal.previousEgfrDate = '2025-06-01';
		d.renal.egfrSampleDate = '2026-06-01';
		expect(isRapidDecline(d)).toBe(false);
	});
});

describe('review completeness', () => {
	it('is incomplete with no eGFR recorded', () => {
		const cs = computeComponentStatuses(createDefaultAssessment());
		expect(gradeReviewStatus(cs)).toBe('incomplete');
	});

	it('is partial when eGFR present but one bundle item missing', () => {
		const d = createFullyDocumented();
		d.bloods.haemoglobin = null; // core-bloods now unsatisfied → 1 missing
		const cs = computeComponentStatuses(d);
		expect(gradeReviewStatus(cs)).toBe('partial');
	});

	it('is incomplete when eGFR present but two or more items missing', () => {
		const d = createFullyDocumented();
		d.bloods.potassium = null; // core-bloods unsatisfied
		d.albuminuria.acr = null; // acr unsatisfied
		const cs = computeComponentStatuses(d);
		expect(gradeReviewStatus(cs)).toBe('incomplete');
	});

	it('is complete when every bundle item is documented', () => {
		const cs = computeComponentStatuses(createFullyDocumented());
		expect(gradeReviewStatus(cs)).toBe('complete');
	});
});

describe('full review engine', () => {
	it('grades an empty review incomplete, not classified', () => {
		const r = review(createDefaultAssessment());
		expect(r.reviewStatus).toBe('incomplete');
		expect(r.gfrCategory).toBe(null);
		expect(r.albuminuriaCategory).toBe(null);
		expect(r.kdigoRiskZone).toBe(null);
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('grades a fully-documented low-risk review complete with no flags', () => {
		const r = review(createFullyDocumented());
		expect(r.reviewStatus).toBe('complete');
		expect(r.gfrCategory).toBe('G2');
		expect(r.albuminuriaCategory).toBe('A1');
		expect(r.kdigoRiskZone).toBe('low');
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('emits the staging, heat-map, target and completeness audit rows', () => {
		const r = review(createFullyDocumented());
		const sections = r.firedCriteria.map((x) => x.section);
		expect(sections).toEqual([
			'gfr-stage',
			'albuminuria-stage',
			'risk-zone',
			'bp-target',
			'completeness'
		]);
	});

	it('classifies a very-high-risk record and raises the referral flags', () => {
		const d = createFullyDocumented();
		d.renal.egfr = 20; // G4
		d.albuminuria.acr = 85; // A3
		const r = review(d);
		expect(r.gfrCategory).toBe('G4');
		expect(r.albuminuriaCategory).toBe('A3');
		expect(r.kdigoRiskZone).toBe('very-high');
		expect(r.flaggedIssues.some((f) => f.id === 'F-VERY-HIGH-RISK-REFERRAL-001')).toBe(true);
		expect(r.flaggedIssues.some((f) => f.id === 'F-EGFR-REFERRAL-001')).toBe(true);
		expect(r.flaggedIssues.some((f) => f.id === 'F-ACR-REFERRAL-001')).toBe(true);
	});
});

describe('flagged-issue detection', () => {
	it('raises the hyperkalaemia HIGH flag for potassium ≥ 6.0', () => {
		const d = createFullyDocumented();
		d.bloods.potassium = 6.2;
		const flags = detectFlaggedIssues(d, {});
		const k = flags.find((f) => f.category === 'hyperkalaemia');
		expect(k?.priority).toBe('high');
	});

	it('raises the hyperkalaemia MEDIUM flag for potassium 5.5–5.9', () => {
		const d = createFullyDocumented();
		d.bloods.potassium = 5.7;
		const flags = detectFlaggedIssues(d, {});
		const k = flags.find((f) => f.category === 'hyperkalaemia');
		expect(k?.priority).toBe('medium');
	});

	it('raises the anaemia flag for haemoglobin < 110', () => {
		const d = createFullyDocumented();
		d.bloods.haemoglobin = 98;
		expect(detectFlaggedIssues(d, {}).some((f) => f.id === 'F-ANAEMIA-001')).toBe(true);
	});

	it('raises the nephrotoxic-drug flag when a present nephrotoxin is not adjusted', () => {
		const d = createFullyDocumented();
		d.medication.nephrotoxicDrugPresent = 'yes';
		d.medication.nephrotoxicDoseAdjusted = 'no';
		expect(detectFlaggedIssues(d, {}).some((f) => f.id === 'F-NEPHROTOXIC-DRUG-001')).toBe(true);
	});

	it('raises the missing-acr flag when ACR is not measured', () => {
		const d = createDefaultAssessment();
		expect(detectFlaggedIssues(d, {}).some((f) => f.id === 'F-MISSING-ACR-001')).toBe(true);
	});

	it('raises the uncontrolled-bp flag when BP is above target', () => {
		const d = createFullyDocumented();
		expect(detectFlaggedIssues(d, { bloodPressureAtTarget: false }).some((f) => f.id === 'F-UNCONTROLLED-BP-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createFullyDocumented();
		d.renal.egfr = 20; // G4 (high egfr-referral)
		d.albuminuria.acr = 85; // A3 (high acr-referral)
		d.bloods.potassium = 5.7; // medium hyperkalaemia
		const flags = detectFlaggedIssues(d, {
			gfrCategory: 'G4',
			kdigoRiskZone: 'very-high',
			reviewStatus: 'partial',
			bloodPressureAtTarget: false
		});
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
