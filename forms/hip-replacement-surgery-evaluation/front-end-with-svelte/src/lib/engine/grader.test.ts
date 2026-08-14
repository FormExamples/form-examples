import { describe, expect, it } from 'vitest';
import { createDefaultEvaluation } from './defaults';
import { calculateHipEvaluation, deriveCandidacy } from './grader';
import { ohsCategoryFromTotal, scoreOhs } from './ohs-rules';
import type { HipReplacementSurgeryEvaluation } from './types';

/** Build a full evaluation with every OHS item set to the given value. */
function withOhsTotal(total: number): HipReplacementSurgeryEvaluation {
	const data = createDefaultEvaluation();
	// Distribute the total across the 12 items, each 0..4, in a simple way:
	// as many 4s as fit, then the remainder, then 0s.
	const items: (keyof typeof data.ohs)[] = [
		'painSeverity',
		'washingAndDrying',
		'transport',
		'dressingSocks',
		'shopping',
		'walkingPain',
		'limping',
		'kneeling',
		'nightPain',
		'workInterference',
		'givingWay',
		'stairs'
	];
	let remaining = total;
	for (const key of items) {
		const value = Math.max(0, Math.min(4, remaining));
		data.ohs[key] = value;
		remaining -= value;
	}
	return data;
}

describe('scoreOhs', () => {
	it('sums the 12 items 0..48', () => {
		const data = withOhsTotal(24);
		expect(scoreOhs(data).total).toBe(24);
	});

	it('treats unanswered items as 0', () => {
		const data = createDefaultEvaluation();
		expect(scoreOhs(data).total).toBe(0);
	});

	it('caps at 48 when every item is 4', () => {
		const data = withOhsTotal(48);
		expect(scoreOhs(data).total).toBe(48);
	});
});

describe('ohsCategoryFromTotal boundaries', () => {
	it('19 is severe, 20 is moderate', () => {
		expect(ohsCategoryFromTotal(19)).toBe('severe');
		expect(ohsCategoryFromTotal(20)).toBe('moderate');
	});
	it('29 is moderate, 30 is mild-to-moderate', () => {
		expect(ohsCategoryFromTotal(29)).toBe('moderate');
		expect(ohsCategoryFromTotal(30)).toBe('mild-to-moderate');
	});
	it('39 is mild-to-moderate, 40 is satisfactory', () => {
		expect(ohsCategoryFromTotal(39)).toBe('mild-to-moderate');
		expect(ohsCategoryFromTotal(40)).toBe('satisfactory');
	});
	it('0 is severe, 48 is satisfactory', () => {
		expect(ohsCategoryFromTotal(0)).toBe('severe');
		expect(ohsCategoryFromTotal(48)).toBe('satisfactory');
	});
});

describe('deriveCandidacy', () => {
	it('conservative measures not exhausted always wins', () => {
		expect(deriveCandidacy(10, 4, 'no').candidacy).toBe('continue-conservative');
		expect(deriveCandidacy(45, 0, 'no').candidacy).toBe('continue-conservative');
	});

	it('not-indicated when OHS >= 40', () => {
		expect(deriveCandidacy(40, 4, 'yes').candidacy).toBe('not-indicated');
		expect(deriveCandidacy(39, 4, 'yes').candidacy).not.toBe('not-indicated');
	});

	it('not-indicated when KL <= 1', () => {
		expect(deriveCandidacy(10, 1, 'yes').candidacy).toBe('not-indicated');
		expect(deriveCandidacy(10, 2, 'yes').candidacy).not.toBe('not-indicated');
	});

	it('strong-candidate at OHS <= 19 and KL >= 3', () => {
		expect(deriveCandidacy(19, 3, 'yes').candidacy).toBe('strong-candidate');
		expect(deriveCandidacy(20, 3, 'yes').candidacy).not.toBe('strong-candidate');
		expect(deriveCandidacy(19, 2, 'yes').candidacy).not.toBe('strong-candidate');
	});

	it('candidate at OHS <= 29 and KL >= 2 (but not strong-candidate band)', () => {
		expect(deriveCandidacy(29, 2, 'yes').candidacy).toBe('candidate');
		expect(deriveCandidacy(30, 2, 'yes').candidacy).not.toBe('candidate');
	});

	it('mdt-review is the fallback for a mixed picture', () => {
		// OHS 25 (< 29, in candidate range) but KL grade unknown (null).
		expect(deriveCandidacy(25, null, 'yes').candidacy).toBe('mdt-review');
	});

	it('null KL grade never satisfies a >= threshold', () => {
		expect(deriveCandidacy(15, null, 'yes').candidacy).not.toBe('strong-candidate');
		expect(deriveCandidacy(15, null, 'yes').candidacy).not.toBe('candidate');
	});
});

describe('calculateHipEvaluation', () => {
	it('computes a full strong-candidate result end to end', () => {
		const data = withOhsTotal(15);
		data.imaging.kellgrenLawrenceGrade = 4;
		data.conservative.conservativeMeasuresExhausted = 'yes';
		const result = calculateHipEvaluation(data);
		expect(result.ohsTotal).toBe(15);
		expect(result.ohsCategory).toBe('severe');
		expect(result.computedCandidacy).toBe('strong-candidate');
		expect(result.finalCandidacy).toBe('strong-candidate');
		expect(result.overrideReason).toBe('');
	});

	it('applies a clinician override with a reason', () => {
		const data = withOhsTotal(15);
		data.imaging.kellgrenLawrenceGrade = 4;
		data.conservative.conservativeMeasuresExhausted = 'yes';
		data.summary.overrideCandidacy = 'mdt-review';
		data.summary.overrideReason = 'Complex comorbidity requires multidisciplinary review.';
		const result = calculateHipEvaluation(data);
		expect(result.computedCandidacy).toBe('strong-candidate');
		expect(result.finalCandidacy).toBe('mdt-review');
		expect(result.overrideReason).toBe('Complex comorbidity requires multidisciplinary review.');
	});

	it('computes BMI from height and weight', () => {
		const data = createDefaultEvaluation();
		data.patient.heightAsCm = 170;
		data.patient.weightAsKg = 130;
		const result = calculateHipEvaluation(data);
		expect(result.bmi).toBeCloseTo(45.0, 1);
	});

	it('flags high-bmi-surgical-risk at BMI >= 40', () => {
		const below = createDefaultEvaluation();
		below.patient.heightAsCm = 170;
		below.patient.weightAsKg = 112; // BMI ~38.8
		expect(calculateHipEvaluation(below).flags.some((f) => f.category === 'high-bmi-surgical-risk')).toBe(
			false
		);

		const atThreshold = createDefaultEvaluation();
		atThreshold.patient.heightAsCm = 170;
		atThreshold.patient.weightAsKg = 116; // BMI ~40.1
		expect(
			calculateHipEvaluation(atThreshold).flags.some((f) => f.category === 'high-bmi-surgical-risk')
		).toBe(true);
	});

	it('flags conservative-treatment-not-exhausted', () => {
		const data = createDefaultEvaluation();
		data.conservative.conservativeMeasuresExhausted = 'no';
		expect(
			calculateHipEvaluation(data).flags.some(
				(f) => f.category === 'conservative-treatment-not-exhausted'
			)
		).toBe(true);
	});

	it('flags pre-op-bloods-incomplete when any baseline test is not done', () => {
		const data = createDefaultEvaluation();
		expect(calculateHipEvaluation(data).flags.some((f) => f.category === 'pre-op-bloods-incomplete')).toBe(
			true
		);

		const complete = createDefaultEvaluation();
		complete.baselineTests = {
			fullBloodCountDone: 'yes',
			renalFunctionDone: 'yes',
			clottingOrInrDone: 'yes',
			ecgDone: 'yes',
			mrsaScreenDone: 'yes',
			urinalysisDone: 'yes'
		};
		expect(
			calculateHipEvaluation(complete).flags.some((f) => f.category === 'pre-op-bloods-incomplete')
		).toBe(false);
	});

	it('flags leg-length-discrepancy-significant above 2cm', () => {
		const atThreshold = createDefaultEvaluation();
		atThreshold.gait.legLengthDiscrepancyAsCm = 2;
		expect(
			calculateHipEvaluation(atThreshold).flags.some(
				(f) => f.category === 'leg-length-discrepancy-significant'
			)
		).toBe(false);

		const above = createDefaultEvaluation();
		above.gait.legLengthDiscrepancyAsCm = 2.1;
		expect(
			calculateHipEvaluation(above).flags.some((f) => f.category === 'leg-length-discrepancy-significant')
		).toBe(true);
	});

	it('flags trendelenburg-positive', () => {
		const data = createDefaultEvaluation();
		data.gait.trendelenburgSign = 'yes';
		expect(calculateHipEvaluation(data).flags.some((f) => f.category === 'trendelenburg-positive')).toBe(
			true
		);
	});

	it('flags bilateral-symptomatic', () => {
		const data = createDefaultEvaluation();
		data.history.affectedSide = 'bilateral';
		expect(calculateHipEvaluation(data).flags.some((f) => f.category === 'bilateral-symptomatic')).toBe(
			true
		);
	});

	it('flags paediatric below 16 years and not at 16', () => {
		const child = createDefaultEvaluation();
		child.clinician.assessmentDate = '2026-01-01';
		child.patient.birthDate = '2011-06-01'; // age 14 at assessment
		expect(calculateHipEvaluation(child).flags.some((f) => f.category === 'paediatric')).toBe(true);

		const adult = createDefaultEvaluation();
		adult.clinician.assessmentDate = '2026-01-01';
		adult.patient.birthDate = '2010-01-01'; // age 16 at assessment
		expect(calculateHipEvaluation(adult).flags.some((f) => f.category === 'paediatric')).toBe(false);
	});

	it('never suppresses safety flags via the candidacy override', () => {
		const data = withOhsTotal(15);
		data.imaging.kellgrenLawrenceGrade = 4;
		data.conservative.conservativeMeasuresExhausted = 'no';
		data.gait.trendelenburgSign = 'yes';
		data.summary.overrideCandidacy = 'strong-candidate';
		data.summary.overrideReason = 'Clinician judgement.';
		const result = calculateHipEvaluation(data);
		expect(result.finalCandidacy).toBe('strong-candidate');
		expect(result.computedCandidacy).toBe('continue-conservative');
		expect(result.flags.some((f) => f.category === 'conservative-treatment-not-exhausted')).toBe(true);
		expect(result.flags.some((f) => f.category === 'trendelenburg-positive')).toBe(true);
	});
});
