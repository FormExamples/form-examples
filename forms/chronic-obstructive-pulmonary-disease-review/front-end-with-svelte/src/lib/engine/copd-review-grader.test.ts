import { describe, it, expect } from 'vitest';
import { gradeCopdReview } from './copd-review-grader';
import { goldGradeOf, symptomBurdenOf, exacerbationRiskOf, abeGroupOf } from './copd-review-rules';
import { detectFlaggedIssues } from './flagged-issues';
import { copdRules } from './copd-review-rules';
import type { AssessmentData } from './types';

/**
 * A blank review (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			reviewedAt: '',
			reviewType: '',
			patientIdentifier: '',
			ageBand: '',
			sex: ''
		},
		diagnosis: { diagnosisYear: null, spirometryConfirmed: '', exposureNotes: '' },
		spirometry: {
			fev1Litres: null,
			fev1PercentPredicted: null,
			fvcLitres: null,
			fev1FvcRatio: null,
			spirometryDate: ''
		},
		symptoms: { mrcGrade: null, mmrcGrade: null, catScore: null },
		exacerbations: {
			exacerbationsLast12m: null,
			hospitalisationsLast12m: null,
			lastExacerbationDate: '',
			rescuePackCourses: null
		},
		smoking: { smokingStatus: '', packYears: null, cessationSupportOffered: '' },
		inhaler: {
			inhaledTherapy: '',
			deviceType: '',
			inhalerTechniqueChecked: '',
			inhalerTechniqueAdequate: '',
			adherence: ''
		},
		vaccinations: { influenzaVaccine: '', pneumococcalVaccine: '', covidVaccine: '' },
		rehab: { pulmonaryRehabStatus: '', oxygenUse: '', restingSpo2: null },
		selfManagement: {
			comorbidities: '',
			selfManagementPlan: '',
			rescuePackSupplied: '',
			nextReviewInterval: ''
		},
		note: { clinicianNote: '' }
	};
}

/** A review with every core and supporting element recorded (complete, low risk). */
function createComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.diagnosis.spirometryConfirmed = 'yes';
	d.spirometry.fev1PercentPredicted = 65; // GOLD 2
	d.symptoms.mrcGrade = 2;
	d.symptoms.mmrcGrade = 1;
	d.symptoms.catScore = 8;
	d.exacerbations.exacerbationsLast12m = 0;
	d.exacerbations.hospitalisationsLast12m = 0;
	d.smoking.smokingStatus = 'ex';
	d.smoking.cessationSupportOffered = 'yes';
	d.inhaler.inhalerTechniqueChecked = 'yes';
	d.inhaler.inhalerTechniqueAdequate = 'yes';
	d.inhaler.adherence = 'good';
	d.vaccinations.influenzaVaccine = 'up-to-date';
	d.vaccinations.pneumococcalVaccine = 'up-to-date';
	d.vaccinations.covidVaccine = 'up-to-date';
	d.rehab.pulmonaryRehabStatus = 'not-indicated';
	d.rehab.oxygenUse = 'none';
	d.selfManagement.selfManagementPlan = 'yes';
	d.selfManagement.rescuePackSupplied = 'yes';
	return d;
}

describe('GOLD airflow-limitation grade boundaries', () => {
	it('is null when FEV₁ % predicted is unrecorded', () => {
		expect(goldGradeOf(createDefaultAssessment())).toBeNull();
	});

	it('grades ≥ 80 as GOLD 1 (mild)', () => {
		const d = createDefaultAssessment();
		d.spirometry.fev1PercentPredicted = 80;
		expect(goldGradeOf(d)).toBe(1);
	});

	it('grades 79 as GOLD 2 (moderate) — boundary just below 80', () => {
		const d = createDefaultAssessment();
		d.spirometry.fev1PercentPredicted = 79;
		expect(goldGradeOf(d)).toBe(2);
	});

	it('grades 50 as GOLD 2 and 49 as GOLD 3', () => {
		const d = createDefaultAssessment();
		d.spirometry.fev1PercentPredicted = 50;
		expect(goldGradeOf(d)).toBe(2);
		d.spirometry.fev1PercentPredicted = 49;
		expect(goldGradeOf(d)).toBe(3);
	});

	it('grades 30 as GOLD 3 and 29 as GOLD 4', () => {
		const d = createDefaultAssessment();
		d.spirometry.fev1PercentPredicted = 30;
		expect(goldGradeOf(d)).toBe(3);
		d.spirometry.fev1PercentPredicted = 29;
		expect(goldGradeOf(d)).toBe(4);
	});
});

describe('Symptom and exacerbation axes', () => {
	it('symptom axis is low with mMRC 1 / CAT 9 and high at mMRC 2 or CAT 10', () => {
		const d = createDefaultAssessment();
		d.symptoms.mmrcGrade = 1;
		d.symptoms.catScore = 9;
		expect(symptomBurdenOf(d)).toBe('low');
		d.symptoms.mmrcGrade = 2;
		expect(symptomBurdenOf(d)).toBe('high');
		d.symptoms.mmrcGrade = 1;
		d.symptoms.catScore = 10;
		expect(symptomBurdenOf(d)).toBe('high');
	});

	it('exacerbation axis is low with 1 moderate / 0 hospitalised and high at 2 or 1', () => {
		const d = createDefaultAssessment();
		d.exacerbations.exacerbationsLast12m = 1;
		d.exacerbations.hospitalisationsLast12m = 0;
		expect(exacerbationRiskOf(d)).toBe('low');
		d.exacerbations.exacerbationsLast12m = 2;
		expect(exacerbationRiskOf(d)).toBe('high');
		d.exacerbations.exacerbationsLast12m = 1;
		d.exacerbations.hospitalisationsLast12m = 1;
		expect(exacerbationRiskOf(d)).toBe('high');
	});
});

describe('ABE assessment-group boundaries', () => {
	it('is null when no symptom or exacerbation data is recorded', () => {
		expect(abeGroupOf(createDefaultAssessment())).toBeNull();
	});

	it('is A with low symptom burden and low exacerbation risk', () => {
		const d = createDefaultAssessment();
		d.symptoms.mmrcGrade = 1;
		d.exacerbations.exacerbationsLast12m = 0;
		expect(abeGroupOf(d)).toBe('A');
	});

	it('is B with high symptom burden and low exacerbation risk', () => {
		const d = createDefaultAssessment();
		d.symptoms.catScore = 15;
		d.exacerbations.exacerbationsLast12m = 0;
		expect(abeGroupOf(d)).toBe('B');
	});

	it('is E with high exacerbation risk regardless of symptom burden', () => {
		const lowSymptom = createDefaultAssessment();
		lowSymptom.symptoms.mmrcGrade = 0;
		lowSymptom.exacerbations.hospitalisationsLast12m = 1;
		expect(abeGroupOf(lowSymptom)).toBe('E');

		const highSymptom = createDefaultAssessment();
		highSymptom.symptoms.catScore = 20;
		highSymptom.exacerbations.exacerbationsLast12m = 3;
		expect(abeGroupOf(highSymptom)).toBe('E');
	});
});

describe('Review-completeness grade', () => {
	it('is incomplete for an empty review', () => {
		expect(gradeCopdReview(createDefaultAssessment()).reviewStatus).toBe('incomplete');
	});

	it('is complete when every core and supporting element is recorded', () => {
		expect(gradeCopdReview(createComplete()).reviewStatus).toBe('complete');
	});

	it('is partial when a supporting item is missing but all core present', () => {
		const d = createComplete();
		d.inhaler.adherence = ''; // drop one supporting item
		expect(gradeCopdReview(d).reviewStatus).toBe('partial');
	});

	it('is incomplete when a core element is missing', () => {
		const d = createComplete();
		d.spirometry.fev1PercentPredicted = null; // drop a core element
		expect(gradeCopdReview(d).reviewStatus).toBe('incomplete');
	});
});

describe('gradeCopdReview end-to-end', () => {
	it('derives all four outputs for a GOLD 3 / group E review', () => {
		const d = createComplete();
		d.spirometry.fev1PercentPredicted = 40; // GOLD 3
		d.symptoms.catScore = 22; // high symptom
		d.exacerbations.exacerbationsLast12m = 3; // high exacerbation
		const r = gradeCopdReview(d);
		expect(r.goldGrade).toBe(3);
		expect(r.symptomBurden).toBe('high');
		expect(r.exacerbationRisk).toBe('high');
		expect(r.abeGroup).toBe('E');
	});
});

describe('Flagged-issue detection', () => {
	it('raises the escalate-therapy flag for group E', () => {
		const d = createComplete();
		d.exacerbations.hospitalisationsLast12m = 2;
		const r = gradeCopdReview(d);
		expect(r.flags.some((f) => f.id === 'F-ESCALATE-THERAPY-001')).toBe(true);
	});

	it('raises the smoking-cessation flag for a current smoker', () => {
		const d = createComplete();
		d.smoking.smokingStatus = 'current';
		const flags = detectFlaggedIssues(d, { abeGroup: 'A', reviewStatus: 'complete' });
		expect(flags.some((f) => f.id === 'F-SMOKING-CESSATION-001')).toBe(true);
	});

	it('raises the poor-inhaler-technique flag when technique is not adequate', () => {
		const d = createComplete();
		d.inhaler.inhalerTechniqueAdequate = 'no';
		const flags = detectFlaggedIssues(d, { abeGroup: 'A', reviewStatus: 'complete' });
		expect(flags.some((f) => f.id === 'F-POOR-INHALER-TECHNIQUE-001')).toBe(true);
	});

	it('raises the missing-vaccinations flag when one is due', () => {
		const d = createComplete();
		d.vaccinations.influenzaVaccine = 'due';
		const flags = detectFlaggedIssues(d, { abeGroup: 'A', reviewStatus: 'complete' });
		expect(flags.some((f) => f.id === 'F-MISSING-VACCINATIONS-001')).toBe(true);
	});

	it('raises the pulmonary-rehab flag for MRC ≥ 3 without referral', () => {
		const d = createComplete();
		d.symptoms.mrcGrade = 4;
		d.rehab.pulmonaryRehabStatus = 'eligible-not-referred';
		const flags = detectFlaggedIssues(d, { abeGroup: 'A', reviewStatus: 'complete' });
		expect(flags.some((f) => f.id === 'F-PULMONARY-REHAB-001')).toBe(true);
	});

	it('raises the incomplete-review flag for an incomplete review', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), {
			abeGroup: null,
			reviewStatus: 'incomplete'
		});
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-REVIEW-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment();
		d.smoking.smokingStatus = 'current'; // high
		d.vaccinations.influenzaVaccine = 'due'; // medium
		const flags = detectFlaggedIssues(d, { abeGroup: 'E', reviewStatus: 'incomplete' });
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('all classification-rule IDs are unique', () => {
		const ids = copdRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
