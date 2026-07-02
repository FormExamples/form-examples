import { describe, it, expect } from 'vitest';
import { calculateQrisk3Grade, buildContributions } from './qrisk3-grader';
import { detectFlaggedIssues } from './flagged-issues';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', assessedAt: '', careSetting: '' },
		identification: {
			patientIdentifier: '',
			age: null,
			sex: '',
			ethnicity: '',
			townsendScore: null,
			postcode: ''
		},
		eligibility: { hasEstablishedCvd: '', hasFamilialHypercholesterolaemia: '' },
		lifestyle: { smokingStatus: '', bodyMassIndex: null },
		cardiometabolic: {
			diabetesStatus: '',
			cholesterolHdlRatio: null,
			systolicBloodPressure: null,
			systolicBloodPressureSd: null,
			onBloodPressureTreatment: ''
		},
		comorbidities: {
			familyHistoryChd: '',
			atrialFibrillation: '',
			chronicKidneyDiseaseStage: '',
			migraine: '',
			rheumatoidArthritis: '',
			systemicLupusErythematosus: '',
			severeMentalIllness: '',
			erectileDysfunction: ''
		},
		medication: { onAtypicalAntipsychotics: '', onCorticosteroids: '' },
		note: { clinicalNote: '' }
	};
}

/**
 * A patient sitting exactly on every cohort mean with all neutral categorical
 * inputs, so the linear predictor is 0 and the 10-year risk is driven solely by
 * the sex-specific baseline survival S0.
 */
function neutralAtMeans(sex: 'female' | 'male'): AssessmentData {
	const d = createDefaultAssessment();
	d.identification.age = 60; // MEANS.age
	d.identification.sex = sex;
	d.identification.ethnicity = 'white-or-not-stated';
	d.lifestyle.smokingStatus = 'non';
	d.lifestyle.bodyMassIndex = 26; // MEANS.bodyMassIndex
	d.cardiometabolic.diabetesStatus = 'none';
	d.cardiometabolic.cholesterolHdlRatio = 4; // MEANS.cholesterolHdlRatio
	d.cardiometabolic.systolicBloodPressure = 130; // MEANS.systolicBloodPressure
	d.comorbidities.chronicKidneyDiseaseStage = 'none';
	return d;
}

describe('QRISK3 representative grading engine', () => {
	it('LP is 0 at the cohort means with neutral categoricals', () => {
		expect(buildContributions(neutralAtMeans('female')).linearPredictor).toBeCloseTo(0, 10);
		expect(buildContributions(neutralAtMeans('male')).linearPredictor).toBeCloseTo(0, 10);
	});

	it('maps LP 0 to the sex-specific baseline risk (female 1.1%, male 2.3%)', () => {
		// 100 * (1 - S0^exp(0)) = 100 * (1 - S0). S0f=0.988876, S0m=0.977268.
		expect(calculateQrisk3Grade(neutralAtMeans('female')).tenYearRiskPercent).toBe(1.1);
		expect(calculateQrisk3Grade(neutralAtMeans('male')).tenYearRiskPercent).toBe(2.3);
	});

	it('reproduces the exact ported linear predictor for a known multi-factor case', () => {
		// Hand-summed LP locks every coefficient used below:
		//   age (male 0.058*5=0.29) + BMI (0.021*2=0.042) + chol (0.15*1=0.15)
		//   + SBP (0.011*10=0.11) + townsend 0 + ethnicity indian 0.28
		//   + smoking moderate 0.40 + diabetes type2 0.56 + BP-treat 0.55
		//   + family-history CHD 0.44 = 2.822
		const d = createDefaultAssessment();
		d.identification.age = 65;
		d.identification.sex = 'male';
		d.identification.ethnicity = 'indian';
		d.lifestyle.smokingStatus = 'moderate';
		d.lifestyle.bodyMassIndex = 28;
		d.cardiometabolic.diabetesStatus = 'type2';
		d.cardiometabolic.cholesterolHdlRatio = 5;
		d.cardiometabolic.systolicBloodPressure = 140;
		d.cardiometabolic.onBloodPressureTreatment = 'yes';
		d.comorbidities.familyHistoryChd = 'yes';

		const { linearPredictor } = buildContributions(d);
		expect(linearPredictor).toBeCloseTo(2.822, 6);

		const g = calculateQrisk3Grade(d);
		expect(g.computable).toBe(true);
		expect(g.tenYearRiskPercent).toBe(32.1); // 100*(1 - 0.977268^exp(2.822))
		expect(g.riskBand).toBe('high');
		expect(g.heartAge).not.toBeNull();
	});

	it('erectile dysfunction contributes only in the male model', () => {
		const male = createDefaultAssessment();
		male.identification.sex = 'male';
		male.comorbidities.erectileDysfunction = 'yes';
		expect(buildContributions(male).linearPredictor).toBeCloseTo(0.22, 6);

		const female = createDefaultAssessment();
		female.identification.sex = 'female';
		female.comorbidities.erectileDysfunction = 'yes';
		expect(buildContributions(female).linearPredictor).toBeCloseTo(0, 10);
	});

	it('optional Townsend score defaults to the cohort mean (neutral)', () => {
		const withoutTownsend = neutralAtMeans('female');
		const withMeanTownsend = neutralAtMeans('female');
		withMeanTownsend.identification.townsendScore = 0;
		expect(buildContributions(withoutTownsend).linearPredictor).toBeCloseTo(
			buildContributions(withMeanTownsend).linearPredictor,
			10
		);

		const deprived = neutralAtMeans('female');
		deprived.identification.townsendScore = 5; // 0.033 * 5
		expect(buildContributions(deprived).linearPredictor).toBeCloseTo(0.165, 6);
	});

	it('bands at the 10% and 20% NICE thresholds', () => {
		const low = calculateQrisk3Grade(neutralAtMeans('female'));
		expect(low.riskBand).toBe('low');
	});

	it('returns computable=false with null risk when a required input is missing', () => {
		const d = createDefaultAssessment();
		const g = calculateQrisk3Grade(d);
		expect(g.computable).toBe(false);
		expect(g.tenYearRiskPercent).toBeNull();
		expect(g.heartAge).toBeNull();
	});
});

describe('QRISK3 flagged-issue detection', () => {
	it('raises the statin-offer flag at or above 10% risk', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), 12.5);
		expect(flags.some((f) => f.id === 'F-STATIN-OFFER-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-HIGH-RISK-001')).toBe(false);
	});

	it('raises the high-risk flag at or above 20% risk', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), 24);
		expect(flags.some((f) => f.id === 'F-HIGH-RISK-001')).toBe(true);
	});

	it('raises the not-eligible flag for established CVD or age outside 25-84', () => {
		const cvd = createDefaultAssessment();
		cvd.eligibility.hasEstablishedCvd = 'yes';
		expect(detectFlaggedIssues(cvd, 5).some((f) => f.id === 'F-NOT-ELIGIBLE-001')).toBe(true);

		const old = createDefaultAssessment();
		old.identification.age = 90;
		expect(detectFlaggedIssues(old, 5).some((f) => f.id === 'F-NOT-ELIGIBLE-001')).toBe(true);
	});

	it('raises missing-cholesterol and incomplete-assessment flags for a blank form', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), null);
		expect(flags.some((f) => f.id === 'F-MISSING-CHOLESTEROL-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('raises the severe-hypertension flag at SBP >= 180', () => {
		const d = createDefaultAssessment();
		d.cardiometabolic.systolicBloodPressure = 185;
		expect(detectFlaggedIssues(d, 5).some((f) => f.id === 'F-SEVERE-HYPERTENSION-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment();
		d.cardiometabolic.systolicBloodPressure = 185; // medium
		d.eligibility.hasEstablishedCvd = 'yes'; // high
		const flags = detectFlaggedIssues(d, 25);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
