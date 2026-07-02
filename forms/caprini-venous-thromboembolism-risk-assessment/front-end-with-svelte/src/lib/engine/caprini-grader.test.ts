import { describe, it, expect } from 'vitest';
import { calculateCapriniGrade, bandForScore } from './caprini-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { capriniRules } from './caprini-rules';
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
			admissionType: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		onePoint: {
			minorSurgery: '',
			recentMajorSurgery: '',
			varicoseVeins: '',
			inflammatoryBowelDisease: '',
			swollenLegs: '',
			obesity: '',
			acuteMyocardialInfarction: '',
			congestiveHeartFailure: '',
			sepsis: '',
			seriousLungDisease: '',
			abnormalPulmonaryFunction: '',
			medicalPatientBedRest: '',
			oralContraceptiveOrHrt: '',
			pregnancyOrPostpartum: '',
			adversePregnancyHistory: ''
		},
		twoPoint: {
			arthroscopicSurgery: '',
			majorOpenSurgery: '',
			laparoscopicSurgery: '',
			malignancy: '',
			confinedToBed: '',
			immobilisingCast: '',
			centralVenousAccess: ''
		},
		threePoint: {
			historyOfVte: '',
			familyHistoryOfThrombosis: '',
			factorVLeiden: '',
			prothrombin20210a: '',
			lupusAnticoagulant: '',
			anticardiolipinAntibodies: '',
			elevatedHomocysteine: '',
			heparinInducedThrombocytopenia: '',
			otherThrombophilia: ''
		},
		fivePoint: {
			stroke: '',
			electiveArthroplasty: '',
			hipPelvisLegFracture: '',
			acuteSpinalCordInjury: '',
			multipleTrauma: ''
		},
		bleeding: { highBleedingRisk: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-negative (score 0) assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'surgeon',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'surgical-ward',
		admissionType: 'surgical'
	};
	d.identification = { patientIdentifier: 'SUR-1001', ageBand: 'under-41', sex: 'male' };
	const answerNo = (section: Record<string, string>) => {
		for (const key of Object.keys(section)) section[key] = 'no';
	};
	answerNo(d.onePoint as unknown as Record<string, string>);
	answerNo(d.twoPoint as unknown as Record<string, string>);
	answerNo(d.threePoint as unknown as Record<string, string>);
	answerNo(d.fivePoint as unknown as Record<string, string>);
	d.bleeding.highBleedingRisk = 'no';
	return d;
}

describe('Caprini grading engine', () => {
	it('scores 0 for a fully-negative patient (very-low risk)', () => {
		const r = calculateCapriniGrade(createNegativePatient());
		expect(r.capriniScore).toBe(0);
		expect(r.ageBandPoints).toBe(0);
		expect(r.riskBand).toBe('very-low');
		expect(r.recommendedProphylaxis).toBe('early-ambulation');
		expect(r.bleedingDowngraded).toBe(false);
	});

	it('applies the age-band weights (under-41=0, 41-60=1, 61-74=2, 75-plus=3)', () => {
		const bands: [AssessmentData['identification']['ageBand'], number][] = [
			['under-41', 0],
			['41-60', 1],
			['61-74', 2],
			['75-plus', 3]
		];
		for (const [band, pts] of bands) {
			const d = createNegativePatient();
			d.identification.ageBand = band;
			const r = calculateCapriniGrade(d);
			expect(r.ageBandPoints).toBe(pts);
			expect(r.capriniScore).toBe(pts);
		}
	});

	it('band boundary very-low/low at score 1 vs 2', () => {
		const d1 = createNegativePatient(); // 41-60 = 1 point
		d1.identification.ageBand = '41-60';
		expect(bandForScore(calculateCapriniGrade(d1).capriniScore)).toBe('very-low');

		const d2 = createNegativePatient();
		d2.identification.ageBand = '61-74'; // 2 points
		expect(calculateCapriniGrade(d2).riskBand).toBe('low');
	});

	it('band boundary moderate/high at score 4 vs 5', () => {
		const d4 = createNegativePatient();
		d4.identification.ageBand = 'under-41';
		d4.onePoint.obesity = 'yes'; // 1
		d4.threePoint.historyOfVte = 'yes'; // 3
		const r4 = calculateCapriniGrade(d4);
		expect(r4.capriniScore).toBe(4);
		expect(r4.riskBand).toBe('moderate');
		expect(r4.recommendedProphylaxis).toBe('pharmacological-or-mechanical');

		const d5 = createNegativePatient();
		d5.fivePoint.stroke = 'yes'; // 5
		const r5 = calculateCapriniGrade(d5);
		expect(r5.capriniScore).toBe(5);
		expect(r5.riskBand).toBe('high');
		expect(r5.recommendedProphylaxis).toBe('pharmacological-plus-mechanical');
	});

	it('sums a representative fired-factor mix with the age band', () => {
		const d = createNegativePatient();
		d.identification.ageBand = '75-plus'; // 3
		d.onePoint.obesity = 'yes'; // 1
		d.onePoint.sepsis = 'yes'; // 1
		d.twoPoint.malignancy = 'yes'; // 2
		d.threePoint.factorVLeiden = 'yes'; // 3
		d.fivePoint.multipleTrauma = 'yes'; // 5
		const r = calculateCapriniGrade(d);
		expect(r.groupSubtotals['1-point']).toBe(2);
		expect(r.groupSubtotals['2-point']).toBe(2);
		expect(r.groupSubtotals['3-point']).toBe(3);
		expect(r.groupSubtotals['5-point']).toBe(5);
		expect(r.capriniScore).toBe(3 + 2 + 2 + 3 + 5);
		expect(r.riskBand).toBe('high');
	});

	it('downgrades a pharmacological recommendation to mechanical on high bleeding risk', () => {
		const d = createNegativePatient();
		d.fivePoint.stroke = 'yes'; // high band
		d.bleeding.highBleedingRisk = 'yes';
		const r = calculateCapriniGrade(d);
		expect(r.baseProphylaxis).toBe('pharmacological-plus-mechanical');
		expect(r.bleedingDowngraded).toBe(true);
		expect(r.recommendedProphylaxis).toBe('mechanical');
	});

	it('does not downgrade a non-pharmacological recommendation', () => {
		const d = createNegativePatient();
		d.identification.ageBand = '61-74'; // low band, mechanical
		d.bleeding.highBleedingRisk = 'yes';
		const r = calculateCapriniGrade(d);
		expect(r.riskBand).toBe('low');
		expect(r.bleedingDowngraded).toBe(false);
		expect(r.recommendedProphylaxis).toBe('mechanical');
	});

	it('records the age-band audit row when an age band is chosen', () => {
		const d = createNegativePatient();
		d.identification.ageBand = '61-74';
		const r = calculateCapriniGrade(d);
		expect(r.firedFactors[0].factor).toBe('age_band');
		expect(r.firedFactors[0].points).toBe(2);
	});

	it('a missing input contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateCapriniGrade(d);
		expect(r.capriniScore).toBe(0);
		expect(r.riskBand).toBe('very-low');
	});

	it('all rule IDs are unique', () => {
		const ids = capriniRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('has 36 weighted factor rules (15 + 7 + 9 + 5)', () => {
		expect(capriniRules.length).toBe(36);
	});
});

describe('Caprini flagged-issue detection', () => {
	it('raises no red flags for a complete very-low negative patient', () => {
		const d = createNegativePatient();
		const flags = detectFlaggedIssues(d, 0, 'very-low');
		expect(flags).toHaveLength(0);
	});

	it('raises the high-VTE-risk flag when the score is 5 or more', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 6, 'high');
		expect(flags.some((f) => f.id === 'F-HIGH-VTE-RISK-001')).toBe(true);
	});

	it('raises the bleeding-contraindication flag on high bleeding + moderate/high band', () => {
		const d = createNegativePatient();
		d.bleeding.highBleedingRisk = 'yes';
		const flags = detectFlaggedIssues(d, 4, 'moderate');
		expect(flags.some((f) => f.id === 'F-BLEEDING-CONTRAINDICATION-001')).toBe(true);
	});

	it('raises prior-VTE and known-thrombophilia flags', () => {
		const d = createNegativePatient();
		d.threePoint.historyOfVte = 'yes';
		d.threePoint.factorVLeiden = 'yes';
		const flags = detectFlaggedIssues(d, 6, 'high');
		expect(flags.some((f) => f.id === 'F-PRIOR-VTE-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-KNOWN-THROMBOPHILIA-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when inputs are missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, 0, 'very-low');
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.threePoint.historyOfVte = 'yes'; // medium
		d.bleeding.highBleedingRisk = 'yes'; // high (with high band)
		const flags = detectFlaggedIssues(d, 6, 'high');
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
