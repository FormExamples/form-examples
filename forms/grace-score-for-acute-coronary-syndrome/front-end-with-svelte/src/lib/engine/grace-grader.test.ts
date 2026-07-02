import { describe, it, expect } from 'vitest';
import { calculateGraceGrade } from './grace-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
	bandForTotal,
	bandLookup,
	normaliseCreatinine,
	worseBand
} from './utils';
import {
	AGE_BANDS,
	CREATININE_BANDS,
	HEART_RATE_BANDS,
	IN_HOSPITAL_THRESHOLDS,
	SBP_BANDS,
	SIX_MONTH_THRESHOLDS,
	UMOL_PER_MGDL
} from './grace-rules';
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
			presentationType: ''
		},
		identification: { patientIdentifier: '', ageYears: null, sex: '' },
		haemodynamics: { heartRate: null, systolicBloodPressure: null },
		renal: { serumCreatinine: null, serumCreatinineUnit: '' },
		heartFailure: { killipClass: '' },
		highRiskFeatures: {
			cardiacArrestAtAdmission: '',
			stSegmentDeviation: '',
			elevatedCardiacEnzymes: ''
		},
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, low-risk assessment (~56 points). */
function createLowRiskPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'emergency-physician',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'emergency-department',
		presentationType: 'unstable-angina'
	};
	d.identification = { patientIdentifier: 'ED-1001', ageYears: 48, sex: 'male' };
	d.haemodynamics = { heartRate: 60, systolicBloodPressure: 150 };
	d.renal = { serumCreatinine: 0.7, serumCreatinineUnit: 'mg/dL' };
	d.heartFailure = { killipClass: 'I' };
	d.highRiskFeatures = {
		cardiacArrestAtAdmission: 'no',
		stSegmentDeviation: 'no',
		elevatedCardiacEnzymes: 'no'
	};
	return d;
}

describe('GRACE band lookups (ported point tables)', () => {
	it('age bands fire at each boundary', () => {
		expect(bandLookup(29, AGE_BANDS).points).toBe(0);
		expect(bandLookup(30, AGE_BANDS).points).toBe(8);
		expect(bandLookup(39, AGE_BANDS).points).toBe(8);
		expect(bandLookup(40, AGE_BANDS).points).toBe(25);
		expect(bandLookup(89, AGE_BANDS).points).toBe(91);
		expect(bandLookup(90, AGE_BANDS).points).toBe(100);
	});

	it('heart-rate bands fire at each boundary', () => {
		expect(bandLookup(49, HEART_RATE_BANDS).points).toBe(0);
		expect(bandLookup(50, HEART_RATE_BANDS).points).toBe(3);
		expect(bandLookup(109, HEART_RATE_BANDS).points).toBe(15);
		expect(bandLookup(110, HEART_RATE_BANDS).points).toBe(24);
		expect(bandLookup(199, HEART_RATE_BANDS).points).toBe(38);
		expect(bandLookup(200, HEART_RATE_BANDS).points).toBe(46);
	});

	it('systolic-BP bands are inverse and fire at each boundary', () => {
		expect(bandLookup(79, SBP_BANDS).points).toBe(58);
		expect(bandLookup(80, SBP_BANDS).points).toBe(53);
		expect(bandLookup(119, SBP_BANDS).points).toBe(43);
		expect(bandLookup(120, SBP_BANDS).points).toBe(34);
		expect(bandLookup(199, SBP_BANDS).points).toBe(10);
		expect(bandLookup(200, SBP_BANDS).points).toBe(0);
	});

	it('creatinine bands fire at each boundary', () => {
		expect(bandLookup(0.39, CREATININE_BANDS).points).toBe(1);
		expect(bandLookup(0.4, CREATININE_BANDS).points).toBe(4);
		expect(bandLookup(1.99, CREATININE_BANDS).points).toBe(13);
		expect(bandLookup(2.0, CREATININE_BANDS).points).toBe(21);
		expect(bandLookup(3.99, CREATININE_BANDS).points).toBe(21);
		expect(bandLookup(4.0, CREATININE_BANDS).points).toBe(28);
	});

	it('a missing (null) value contributes 0 points', () => {
		expect(bandLookup(null, AGE_BANDS).points).toBe(0);
		expect(bandLookup(null, SBP_BANDS).points).toBe(0);
	});
});

describe('GRACE creatinine normalisation', () => {
	it('divides µmol/L by 88.4 and passes mg/dL through', () => {
		expect(normaliseCreatinine(88.4, 'umol/L')).toBeCloseTo(1.0, 5);
		expect(normaliseCreatinine(2 * UMOL_PER_MGDL, 'umol/L')).toBeCloseTo(2.0, 5);
		expect(normaliseCreatinine(1.5, 'mg/dL')).toBe(1.5);
		expect(normaliseCreatinine(null, 'umol/L')).toBeNull();
	});
});

describe('GRACE mortality-band thresholds', () => {
	it('in-hospital band boundaries (108 low, 109-140 intermediate, 141 high)', () => {
		expect(bandForTotal(108, IN_HOSPITAL_THRESHOLDS)).toBe('low');
		expect(bandForTotal(109, IN_HOSPITAL_THRESHOLDS)).toBe('intermediate');
		expect(bandForTotal(140, IN_HOSPITAL_THRESHOLDS)).toBe('intermediate');
		expect(bandForTotal(141, IN_HOSPITAL_THRESHOLDS)).toBe('high');
	});

	it('6-month band boundaries (88 low, 89-118 intermediate, 119 high)', () => {
		expect(bandForTotal(88, SIX_MONTH_THRESHOLDS)).toBe('low');
		expect(bandForTotal(89, SIX_MONTH_THRESHOLDS)).toBe('intermediate');
		expect(bandForTotal(118, SIX_MONTH_THRESHOLDS)).toBe('intermediate');
		expect(bandForTotal(119, SIX_MONTH_THRESHOLDS)).toBe('high');
	});

	it('worseBand selects the higher-rank band (max-band rule)', () => {
		expect(worseBand('low', 'intermediate')).toBe('intermediate');
		expect(worseBand('intermediate', 'high')).toBe('high');
		expect(worseBand('low', 'low')).toBe('low');
		expect(worseBand('high', 'low')).toBe('high');
	});
});

describe('GRACE grading engine (end to end)', () => {
	it('sums the weighted point tables for a low-risk patient (~56, overall low)', () => {
		const r = calculateGraceGrade(createLowRiskPatient());
		// age 48 (25) + HR 60 (3) + SBP 150 (24) + creat 0.7 (4) + Killip I (0) = 56
		expect(r.agePoints).toBe(25);
		expect(r.heartRatePoints).toBe(3);
		expect(r.sbpPoints).toBe(24);
		expect(r.creatininePoints).toBe(4);
		expect(r.killipPoints).toBe(0);
		expect(r.gracePoints).toBe(56);
		expect(r.inHospitalMortalityBand).toBe('low');
		expect(r.sixMonthMortalityBand).toBe('low');
		expect(r.riskCategory).toBe('low');
	});

	it('an intermediate total (89-118) is driven by the 6-month band', () => {
		const d = createLowRiskPatient();
		d.identification.ageYears = 68; // 58
		d.haemodynamics.heartRate = 78; // 9
		d.haemodynamics.systolicBloodPressure = 135; // 34
		d.renal.serumCreatinine = 0.9; // 7
		d.highRiskFeatures.elevatedCardiacEnzymes = 'yes'; // 14
		// total = 58 + 9 + 34 + 7 + 0 + 14 = 122 → high; adjust enzymes off for 108
		d.highRiskFeatures.elevatedCardiacEnzymes = 'no';
		const r = calculateGraceGrade(d);
		expect(r.gracePoints).toBe(108); // 58+9+34+7
		expect(r.inHospitalMortalityBand).toBe('low'); // 108 <= 108
		expect(r.sixMonthMortalityBand).toBe('intermediate'); // 108 > 88
		expect(r.riskCategory).toBe('intermediate'); // worse band
	});

	it('the yes/no contributors add 39 / 28 / 14 points', () => {
		const base = calculateGraceGrade(createLowRiskPatient()).gracePoints;
		const arrest = createLowRiskPatient();
		arrest.highRiskFeatures.cardiacArrestAtAdmission = 'yes';
		expect(calculateGraceGrade(arrest).arrestPoints).toBe(39);
		expect(calculateGraceGrade(arrest).gracePoints).toBe(base + 39);

		const st = createLowRiskPatient();
		st.highRiskFeatures.stSegmentDeviation = 'yes';
		expect(calculateGraceGrade(st).stPoints).toBe(28);

		const enz = createLowRiskPatient();
		enz.highRiskFeatures.elevatedCardiacEnzymes = 'yes';
		expect(calculateGraceGrade(enz).enzymePoints).toBe(14);
	});

	it('Killip class contributes I=0, II=20, III=39, IV=59', () => {
		const points = (cls: 'I' | 'II' | 'III' | 'IV') => {
			const d = createLowRiskPatient();
			d.heartFailure.killipClass = cls;
			return calculateGraceGrade(d).killipPoints;
		};
		expect(points('I')).toBe(0);
		expect(points('II')).toBe(20);
		expect(points('III')).toBe(39);
		expect(points('IV')).toBe(59);
	});

	it('normalises µmol/L creatinine before banding', () => {
		const d = createLowRiskPatient();
		d.renal = { serumCreatinine: 4 * UMOL_PER_MGDL, serumCreatinineUnit: 'umol/L' };
		expect(calculateGraceGrade(d).creatininePoints).toBe(28); // >= 4.0 mg/dL
	});

	it('a fully-blank assessment scores 0 and is low risk', () => {
		const r = calculateGraceGrade(createDefaultAssessment());
		expect(r.gracePoints).toBe(0);
		expect(r.riskCategory).toBe('low');
	});
});

describe('GRACE flagged-issue detection', () => {
	it('raises no red flags for a complete low-risk patient', () => {
		expect(detectFlaggedIssues(createLowRiskPatient(), 'low')).toHaveLength(0);
	});

	it('raises the high-risk-category flag when the category is high', () => {
		const flags = detectFlaggedIssues(createLowRiskPatient(), 'high');
		expect(flags.some((f) => f.id === 'F-HIGH-RISK-CATEGORY-001')).toBe(true);
	});

	it('raises cardiac-arrest, Killip, hypotension, renal, and ST flags', () => {
		const d = createLowRiskPatient();
		d.highRiskFeatures.cardiacArrestAtAdmission = 'yes';
		d.heartFailure.killipClass = 'III';
		d.haemodynamics.systolicBloodPressure = 82;
		d.renal = { serumCreatinine: 2.4, serumCreatinineUnit: 'mg/dL' };
		d.highRiskFeatures.stSegmentDeviation = 'yes';
		const flags = detectFlaggedIssues(d, 'high');
		expect(flags.some((f) => f.id === 'F-CARDIAC-ARREST-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-KILLIP-CLASS-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-HYPOTENSION-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-RENAL-IMPAIRMENT-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-ST-DEVIATION-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when an input is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), 'low');
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createLowRiskPatient();
		d.haemodynamics.systolicBloodPressure = 82; // high
		d.highRiskFeatures.stSegmentDeviation = 'yes'; // medium
		const flags = detectFlaggedIssues(d, 'high');
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
