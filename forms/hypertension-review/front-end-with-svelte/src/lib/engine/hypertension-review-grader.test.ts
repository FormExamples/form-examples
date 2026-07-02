import { describe, it, expect } from 'vitest';
import { review, computeControlStatus, gradeReviewStatus, computeComponentStatuses } from './hypertension-review-grader';
import { selectTarget, classifyControl, computeStage } from './hypertension-review-rules';
import { detectFlaggedIssues } from './flagged-issues';
import type { AssessmentData } from './types';

/**
 * A blank review (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', reviewedAt: '', practiceSite: '' },
		identification: { patientIdentifier: '', ageBand: '', sex: '', ethnicity: '' },
		diagnosis: {
			diagnosisDate: '',
			type2Diabetes: '',
			chronicKidneyDisease: '',
			establishedCvd: '',
			atrialFibrillation: ''
		},
		clinicBp: { clinicSystolic: null, clinicDiastolic: null, posturalDrop: '' },
		homeBp: { homeSystolic: null, homeDiastolic: null, monitoringMethod: '' },
		medication: { antihypertensiveAgents: null, adherence: '', sideEffects: '' },
		cardiovascularRisk: { qriskPercent: null, smokingStatus: '', statinTherapy: '' },
		bloods: {
			serumCreatinine: null,
			egfr: null,
			serumPotassium: null,
			hba1c: null,
			totalCholesterol: null,
			hdlCholesterol: null
		},
		urine: { urineAcr: null },
		lifestyle: { bmi: null, lifestyleAdvice: '' },
		complications: { complications: '' },
		summary: { reviewContext: '' }
	};
}

/** A record with every review component documented and BP at target. */
function createFullyDocumented(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification.ageBand = '40-59';
	d.clinicBp.clinicSystolic = 132;
	d.clinicBp.clinicDiastolic = 82;
	d.homeBp.homeSystolic = 128;
	d.homeBp.homeDiastolic = 80;
	d.medication.adherence = 'good';
	d.cardiovascularRisk.qriskPercent = 8;
	d.cardiovascularRisk.smokingStatus = 'never';
	d.bloods.serumCreatinine = 82;
	d.bloods.egfr = 88;
	d.bloods.serumPotassium = 4.2;
	d.bloods.hba1c = 38;
	d.bloods.totalCholesterol = 4.6;
	d.bloods.hdlCholesterol = 1.4;
	d.urine.urineAcr = 1.2;
	d.lifestyle.bmi = 26;
	d.lifestyle.lifestyleAdvice = 'Diet and exercise advised.';
	return d;
}

describe('BP target selection', () => {
	it('defaults to clinic 140/90 for age under 80 with no comorbidity', () => {
		const d = createDefaultAssessment();
		d.identification.ageBand = '40-59';
		const t = selectTarget(d);
		expect(t.clinic).toEqual({ systolic: 140, diastolic: 90 });
		expect(t.home).toEqual({ systolic: 135, diastolic: 85 });
	});

	it('relaxes to 150/90 for age 80 and over', () => {
		const d = createDefaultAssessment();
		d.identification.ageBand = '>=80';
		expect(selectTarget(d).clinic).toEqual({ systolic: 150, diastolic: 90 });
	});

	it('holds at 140/90 for type 2 diabetes despite age 80 and over', () => {
		const d = createDefaultAssessment();
		d.identification.ageBand = '>=80';
		d.diagnosis.type2Diabetes = 'yes';
		expect(selectTarget(d).clinic).toEqual({ systolic: 140, diastolic: 90 });
	});

	it('tightens to 130/80 for CKD with type 2 diabetes', () => {
		const d = createDefaultAssessment();
		d.diagnosis.chronicKidneyDisease = 'yes';
		d.diagnosis.type2Diabetes = 'yes';
		expect(selectTarget(d).clinic).toEqual({ systolic: 130, diastolic: 80 });
	});

	it('tightens to 130/80 for CKD with ACR 70 and over', () => {
		const d = createDefaultAssessment();
		d.diagnosis.chronicKidneyDisease = 'yes';
		d.urine.urineAcr = 72;
		const t = selectTarget(d);
		expect(t.clinic).toEqual({ systolic: 130, diastolic: 80 });
		expect(t.group).toContain('ACR');
	});
});

describe('control classification', () => {
	it('classifies controlled when the primary (home) reading is at or below target', () => {
		const d = createDefaultAssessment();
		d.identification.ageBand = '40-59';
		d.homeBp.homeSystolic = 135; // == home target 135/85
		d.homeBp.homeDiastolic = 85;
		const t = selectTarget(d);
		expect(classifyControl(d, t)).toEqual({ controlClass: 'controlled', primarySource: 'home' });
	});

	it('classifies uncontrolled when the home reading is above target', () => {
		const d = createDefaultAssessment();
		d.identification.ageBand = '40-59';
		d.homeBp.homeSystolic = 136; // > home target 135
		d.homeBp.homeDiastolic = 84;
		const t = selectTarget(d);
		expect(classifyControl(d, t).controlClass).toBe('uncontrolled');
	});

	it('uses clinic when no home reading is present', () => {
		const d = createDefaultAssessment();
		d.identification.ageBand = '40-59';
		d.clinicBp.clinicSystolic = 141; // > clinic target 140
		d.clinicBp.clinicDiastolic = 88;
		const t = selectTarget(d);
		const r = classifyControl(d, t);
		expect(r.primarySource).toBe('clinic');
		expect(r.controlClass).toBe('uncontrolled');
	});

	it('boundary: clinic 140/90 is controlled, 141/90 is uncontrolled', () => {
		const d = createDefaultAssessment();
		d.identification.ageBand = '40-59';
		d.clinicBp.clinicSystolic = 140;
		d.clinicBp.clinicDiastolic = 90;
		expect(classifyControl(d, selectTarget(d)).controlClass).toBe('controlled');
		d.clinicBp.clinicSystolic = 141;
		expect(classifyControl(d, selectTarget(d)).controlClass).toBe('uncontrolled');
	});

	it('severe-uncontrolled fires on the clinic reading 180/120 and over', () => {
		const d = createDefaultAssessment();
		d.identification.ageBand = '40-59';
		d.clinicBp.clinicSystolic = 182;
		d.clinicBp.clinicDiastolic = 96;
		d.homeBp.homeSystolic = 120; // even a normal home reading does not override severe
		d.homeBp.homeDiastolic = 78;
		expect(classifyControl(d, selectTarget(d)).controlClass).toBe('severe-uncontrolled');
	});

	it('classifies none when no reading is present', () => {
		const d = createDefaultAssessment();
		expect(classifyControl(d, selectTarget(d)).primarySource).toBe('none');
	});
});

describe('hypertension staging', () => {
	it('is none with no reading', () => {
		expect(computeStage(createDefaultAssessment())).toBe('none');
	});

	it('is stage-3-severe for clinic 180/120 and over', () => {
		const d = createDefaultAssessment();
		d.clinicBp.clinicSystolic = 184;
		d.clinicBp.clinicDiastolic = 110;
		expect(computeStage(d)).toBe('stage-3-severe');
	});

	it('is stage-2 when clinic and home both cross the stage-2 thresholds', () => {
		const d = createDefaultAssessment();
		d.clinicBp.clinicSystolic = 162;
		d.clinicBp.clinicDiastolic = 98;
		d.homeBp.homeSystolic = 152;
		d.homeBp.homeDiastolic = 92;
		expect(computeStage(d)).toBe('stage-2');
	});

	it('is stage-1 when clinic and home both cross the stage-1 thresholds', () => {
		const d = createDefaultAssessment();
		d.clinicBp.clinicSystolic = 144;
		d.clinicBp.clinicDiastolic = 92;
		d.homeBp.homeSystolic = 137;
		d.homeBp.homeDiastolic = 86;
		expect(computeStage(d)).toBe('stage-1');
	});

	it('falls back to the clinic reading alone when no home reading', () => {
		const d = createDefaultAssessment();
		d.clinicBp.clinicSystolic = 145;
		d.clinicBp.clinicDiastolic = 92;
		expect(computeStage(d)).toBe('stage-1');
	});
});

describe('review completeness', () => {
	it('is incomplete with no blood pressure recorded', () => {
		const d = createDefaultAssessment();
		const cs = computeComponentStatuses(d);
		expect(gradeReviewStatus(d, cs)).toBe('incomplete');
	});

	it('is partial when BP is present but some secondary components are missing', () => {
		const d = createDefaultAssessment();
		d.clinicBp.clinicSystolic = 132;
		d.clinicBp.clinicDiastolic = 82;
		d.medication.adherence = 'good';
		const cs = computeComponentStatuses(d);
		expect(gradeReviewStatus(d, cs)).toBe('partial');
	});

	it('is complete when BP and all secondary components are documented', () => {
		const d = createFullyDocumented();
		const cs = computeComponentStatuses(d);
		expect(gradeReviewStatus(d, cs)).toBe('complete');
	});
});

describe('full review engine', () => {
	it('grades an empty review incomplete, not classified, no stage', () => {
		const r = review(createDefaultAssessment());
		expect(r.reviewStatus).toBe('incomplete');
		expect(r.controlStatus.primarySource).toBe('none');
		expect(r.controlStatus.hypertensionStage).toBe('none');
		expect(r.flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('grades a fully-documented, at-target review complete and controlled with no flags', () => {
		const r = review(createFullyDocumented());
		expect(r.reviewStatus).toBe('complete');
		expect(r.controlStatus.controlClass).toBe('controlled');
		expect(r.flags).toHaveLength(0);
	});

	it('emits the target, control, stage and completeness audit rows', () => {
		const r = review(createFullyDocumented());
		const cats = r.firedRules.map((x) => x.category);
		expect(cats).toEqual(['target', 'control', 'stage', 'completeness']);
	});
});

describe('flagged-issue detection', () => {
	it('raises the severe-hypertension flag for clinic 180/120 and over', () => {
		const d = createDefaultAssessment();
		d.clinicBp.clinicSystolic = 186;
		d.clinicBp.clinicDiastolic = 122;
		const flags = detectFlaggedIssues(d, { controlClass: 'severe-uncontrolled' });
		expect(flags.some((f) => f.id === 'F-SEVERE-HYPERTENSION-001')).toBe(true);
	});

	it('raises the uncontrolled-bp flag when the control class is uncontrolled', () => {
		const d = createFullyDocumented();
		const flags = detectFlaggedIssues(d, { controlClass: 'uncontrolled' });
		expect(flags.some((f) => f.id === 'F-UNCONTROLLED-BP-001')).toBe(true);
	});

	it('raises the missing-bloods flag when annual bloods are absent', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-MISSING-BLOODS-001')).toBe(true);
	});

	it('raises the missing-acr flag when no urine ACR is recorded', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-MISSING-ACR-001')).toBe(true);
	});

	it('raises the high-cv-risk-untreated flag for QRISK 10 and over without a statin', () => {
		const d = createFullyDocumented();
		d.cardiovascularRisk.qriskPercent = 14;
		d.cardiovascularRisk.statinTherapy = 'no';
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-HIGH-CV-RISK-UNTREATED-001')).toBe(true);
	});

	it('does not raise the high-cv-risk flag when a statin is recorded', () => {
		const d = createFullyDocumented();
		d.cardiovascularRisk.qriskPercent = 14;
		d.cardiovascularRisk.statinTherapy = 'yes';
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-HIGH-CV-RISK-UNTREATED-001')).toBe(false);
	});

	it('raises the adherence-concern flag for poor adherence or side effects', () => {
		const d = createFullyDocumented();
		d.medication.adherence = 'poor';
		expect(
			detectFlaggedIssues(d, {}).some((f) => f.id === 'F-ADHERENCE-CONCERN-001')
		).toBe(true);
	});

	it('raises the postural-drop flag when a postural drop is recorded', () => {
		const d = createFullyDocumented();
		d.clinicBp.posturalDrop = 'yes';
		expect(detectFlaggedIssues(d, {}).some((f) => f.id === 'F-POSTURAL-DROP-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment();
		d.clinicBp.clinicSystolic = 186; // severe (high)
		d.clinicBp.clinicDiastolic = 124;
		const flags = detectFlaggedIssues(d, {
			controlClass: 'severe-uncontrolled',
			reviewStatus: 'partial'
		});
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('control-status computation is stable via the grader helper', () => {
		const d = createFullyDocumented();
		const cs = computeControlStatus(d);
		expect(cs.controlClass).toBe('controlled');
		expect(cs.primarySource).toBe('home');
	});
});
