// Boundary tests for the Knee Replacement Surgery Evaluation scoring engine.
//
// The OKS category thresholds (19/20, 29/30, 39/40) and the candidacy
// precedence order are exactly the places a screening tool goes wrong, so
// each boundary is asserted on both sides. The same cases run against the
// HTML front-end's JavaScript engine, so the two implementations cannot
// silently diverge.

import { describe, expect, it } from 'vitest';
import { calculateKneeEvaluation } from './grader';
import { createDefaultEvaluation } from './defaults';
import type { KneeReplacementSurgeryEvaluation } from './types';
import { OKS_ITEM_KEYS } from './types';

function blank(): KneeReplacementSurgeryEvaluation {
	return createDefaultEvaluation();
}

/** Build an evaluation whose 12 OKS items sum to exactly this total. */
function withOksTotal(total: number): KneeReplacementSurgeryEvaluation {
	const d = blank();
	if (total < 0 || total > 48) throw new Error('OKS total out of range 0..48');
	let remaining = total;
	for (const key of OKS_ITEM_KEYS) {
		const v = Math.min(4, remaining);
		(d.oks[key] as number | null) = v;
		remaining -= v;
	}
	return d;
}

describe('empty evaluation', () => {
	it('scores zero OKS, severe band, and raises nothing except missing data', () => {
		const r = calculateKneeEvaluation(blank());
		expect(r.oksTotal).toBe(0);
		expect(r.computedOksCategory).toBe('severe');
		expect(r.maxKellgrenLawrenceGrade).toBeNull();
		expect(r.flags).toHaveLength(0);
	});
});

describe('Oxford Knee Score total', () => {
	it('sums the 12 items with an unanswered item treated as 0', () => {
		const d = blank();
		d.oks.oksPainSeverity = 4;
		d.oks.oksWashingAndDrying = 3;
		const r = calculateKneeEvaluation(d);
		expect(r.oksTotal).toBe(7);
	});

	it('reaches the maximum of 48 when every item scores 4', () => {
		const r = calculateKneeEvaluation(withOksTotal(48));
		expect(r.oksTotal).toBe(48);
	});
});

describe('Oxford Knee Score category boundaries', () => {
	it.each([
		[0, 'severe'],
		[19, 'severe'], // inclusive upper bound of severe
		[20, 'moderate'], // inclusive lower bound of moderate
		[29, 'moderate'], // inclusive upper bound of moderate
		[30, 'mild-to-moderate'], // inclusive lower bound
		[39, 'mild-to-moderate'], // inclusive upper bound
		[40, 'satisfactory'], // inclusive lower bound of satisfactory
		[48, 'satisfactory']
	])('OKS total %i categorises as %s', (total, expected) => {
		const r = calculateKneeEvaluation(withOksTotal(total));
		expect(r.computedOksCategory).toBe(expected);
		expect(r.finalOksCategory).toBe(expected);
	});
});

describe('Kellgren-Lawrence maximum across compartments', () => {
	it('takes the highest grade across medial, lateral, and patellofemoral', () => {
		const d = blank();
		d.imaging.kellgrenLawrenceGradeMedial = 1;
		d.imaging.kellgrenLawrenceGradeLateral = 3;
		d.imaging.kellgrenLawrenceGradePatellofemoral = 2;
		const r = calculateKneeEvaluation(d);
		expect(r.maxKellgrenLawrenceGrade).toBe(3);
	});

	it('is null when no compartment has been graded', () => {
		const r = calculateKneeEvaluation(blank());
		expect(r.maxKellgrenLawrenceGrade).toBeNull();
	});
});

describe('surgical candidacy — strong candidate', () => {
	it('fires when OKS <= 19, KL >= 3, and conservative measures are exhausted', () => {
		const d = withOksTotal(19);
		d.imaging.kellgrenLawrenceGradeMedial = 3;
		d.conservative.conservativeMeasuresExhausted = 'yes';
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).toBe('strong-candidate');
	});

	it('does not fire at OKS 20 (just above the threshold)', () => {
		const d = withOksTotal(20);
		d.imaging.kellgrenLawrenceGradeMedial = 4;
		d.conservative.conservativeMeasuresExhausted = 'yes';
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).not.toBe('strong-candidate');
	});

	it('does not fire at KL 2 (just below the threshold), even with OKS <= 19', () => {
		const d = withOksTotal(10);
		d.imaging.kellgrenLawrenceGradeMedial = 2;
		d.conservative.conservativeMeasuresExhausted = 'yes';
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).toBe('candidate');
	});
});

describe('surgical candidacy — candidate', () => {
	it('fires when OKS <= 29, conservative exhausted, and KL >= 2', () => {
		const d = withOksTotal(29);
		d.imaging.kellgrenLawrenceGradeLateral = 2;
		d.conservative.conservativeMeasuresExhausted = 'yes';
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).toBe('candidate');
	});

	it('does not fire at OKS 30 (just above the threshold)', () => {
		const d = withOksTotal(30);
		d.imaging.kellgrenLawrenceGradeLateral = 2;
		d.conservative.conservativeMeasuresExhausted = 'yes';
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).not.toBe('candidate');
	});
});

describe('surgical candidacy — continue conservative', () => {
	it('fires whenever conservative measures are not exhausted, regardless of OKS or KL', () => {
		const d = withOksTotal(5);
		d.imaging.kellgrenLawrenceGradeMedial = 4;
		d.conservative.conservativeMeasuresExhausted = 'no';
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).toBe('continue-conservative');
	});

	it('fires when conservative measures are simply unanswered', () => {
		const d = withOksTotal(5);
		d.imaging.kellgrenLawrenceGradeMedial = 4;
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).toBe('continue-conservative');
	});
});

describe('surgical candidacy — not indicated', () => {
	it('fires when OKS >= 40 even with conservative measures exhausted', () => {
		const d = withOksTotal(40);
		d.conservative.conservativeMeasuresExhausted = 'yes';
		d.imaging.kellgrenLawrenceGradeMedial = 1;
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).toBe('not-indicated');
	});

	it('fires when Kellgren-Lawrence is 1 or below in every compartment', () => {
		const d = withOksTotal(35);
		d.conservative.conservativeMeasuresExhausted = 'yes';
		d.imaging.kellgrenLawrenceGradeMedial = 1;
		d.imaging.kellgrenLawrenceGradeLateral = 0;
		d.imaging.kellgrenLawrenceGradePatellofemoral = 1;
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).toBe('not-indicated');
	});
});

describe('surgical candidacy — MDT review fallback', () => {
	it('fires for a mixed picture: mild-to-moderate OKS with an arthritic KL grade and conservative measures already exhausted', () => {
		// oksTotal 35 is above the candidate threshold (<=29) but below the
		// not-indicated threshold (>=40); maxKL 2 is above the not-indicated
		// threshold (<=1) but the OKS total rules out both strong-candidate
		// and candidate, so none of the ordered rules match until the fallback.
		const d = withOksTotal(35);
		d.conservative.conservativeMeasuresExhausted = 'yes';
		d.imaging.kellgrenLawrenceGradeMedial = 2;
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).toBe('mdt-review');
	});
});

describe('clinician override', () => {
	it('overrides the final candidacy and requires a reason', () => {
		const d = withOksTotal(19);
		d.imaging.kellgrenLawrenceGradeMedial = 3;
		d.conservative.conservativeMeasuresExhausted = 'yes';
		d.summary.overrideCandidacy = 'mdt-review';
		d.summary.overrideReason = 'Patient has significant frailty; discuss at MDT first.';
		const r = calculateKneeEvaluation(d);
		expect(r.computedCandidacy).toBe('strong-candidate');
		expect(r.finalCandidacy).toBe('mdt-review');
		expect(r.overrideReason).toBe('Patient has significant frailty; discuss at MDT first.');
	});

	it('leaves overrideReason empty when the override equals the computed value', () => {
		const d = withOksTotal(19);
		d.imaging.kellgrenLawrenceGradeMedial = 3;
		d.conservative.conservativeMeasuresExhausted = 'yes';
		d.summary.overrideCandidacy = 'strong-candidate';
		d.summary.overrideReason = 'ignored because it matches computed';
		const r = calculateKneeEvaluation(d);
		expect(r.finalCandidacy).toBe('strong-candidate');
		expect(r.overrideReason).toBe('');
	});
});

describe('safety flag — conservative-treatment-not-exhausted', () => {
	it('fires when a surgical recommendation is made without conservative measures exhausted', () => {
		const d = blank();
		d.plan.planRecommendation = 'total-knee-replacement';
		d.conservative.conservativeMeasuresExhausted = 'no';
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001')).toBe(true);
	});

	it('does not fire when conservative measures are exhausted', () => {
		const d = blank();
		d.plan.planRecommendation = 'total-knee-replacement';
		d.conservative.conservativeMeasuresExhausted = 'yes';
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001')).toBe(false);
	});

	it('does not fire when no surgical recommendation is made', () => {
		const d = blank();
		d.plan.planRecommendation = 'continue-conservative-management';
		d.conservative.conservativeMeasuresExhausted = 'no';
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001')).toBe(false);
	});
});

describe('safety flag — high-bmi-surgical-risk', () => {
	it('fires at BMI 40 exactly', () => {
		const d = blank();
		d.patient.heightAsCm = 170;
		d.patient.weightAsKg = Math.round(40 * 1.7 * 1.7 * 10) / 10; // BMI = 40
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-HIGH-BMI-SURGICAL-RISK-001')).toBe(true);
	});

	it('does not fire just below BMI 40', () => {
		const d = blank();
		d.patient.heightAsCm = 170;
		d.patient.weightAsKg = Math.round(39.9 * 1.7 * 1.7 * 10) / 10; // BMI ~39.9
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-HIGH-BMI-SURGICAL-RISK-001')).toBe(false);
	});
});

describe('safety flag — pre-op-bloods-incomplete', () => {
	it('fires when a surgical recommendation is made with an incomplete checklist', () => {
		const d = blank();
		d.plan.planRecommendation = 'partial-knee-replacement';
		d.preOpBloods.fbcDone = 'yes';
		// renalFunctionDone, clottingDone, ecgDone, mrsaScreenDone, urinalysisDone left unanswered
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-PRE-OP-BLOODS-INCOMPLETE-001')).toBe(true);
	});

	it('does not fire once every checklist item is done', () => {
		const d = blank();
		d.plan.planRecommendation = 'partial-knee-replacement';
		d.preOpBloods.fbcDone = 'yes';
		d.preOpBloods.renalFunctionDone = 'yes';
		d.preOpBloods.clottingDone = 'yes';
		d.preOpBloods.ecgDone = 'yes';
		d.preOpBloods.mrsaScreenDone = 'yes';
		d.preOpBloods.urinalysisDone = 'yes';
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-PRE-OP-BLOODS-INCOMPLETE-001')).toBe(false);
	});
});

describe('safety flag — fixed-flexion-deformity', () => {
	it('fires above 15 degrees', () => {
		const d = blank();
		d.rangeOfMotion.fixedFlexionDeformityPresent = 'yes';
		d.rangeOfMotion.fixedFlexionDeformityDegrees = 16;
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-FIXED-FLEXION-DEFORMITY-001')).toBe(true);
	});

	it('does not fire at exactly 15 degrees', () => {
		const d = blank();
		d.rangeOfMotion.fixedFlexionDeformityPresent = 'yes';
		d.rangeOfMotion.fixedFlexionDeformityDegrees = 15;
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-FIXED-FLEXION-DEFORMITY-001')).toBe(false);
	});
});

describe('safety flag — bilateral-symptomatic', () => {
	it('fires when both knees are recorded as symptomatic', () => {
		const d = blank();
		d.history.kneeSide = 'bilateral';
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-BILATERAL-SYMPTOMATIC-001')).toBe(true);
	});

	it('does not fire for a unilateral knee', () => {
		const d = blank();
		d.history.kneeSide = 'left';
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-BILATERAL-SYMPTOMATIC-001')).toBe(false);
	});
});

describe('safety flag — paediatric', () => {
	it('fires below 16 years', () => {
		const d = blank();
		d.patient.birthDate = '2015-01-01';
		d.clinician.assessmentDate = '2026-01-01'; // age 11
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-PAEDIATRIC-001')).toBe(true);
	});

	it('does not fire at exactly 16 years', () => {
		const d = blank();
		d.patient.birthDate = '2010-01-01';
		d.clinician.assessmentDate = '2026-01-01'; // age 16
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-PAEDIATRIC-001')).toBe(false);
	});

	it('does not fire just below 16 by one day', () => {
		const d = blank();
		d.patient.birthDate = '2010-01-02';
		d.clinician.assessmentDate = '2026-01-01'; // 15 years, 364 days
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-PAEDIATRIC-001')).toBe(true);
	});
});

describe('flags are never suppressed by the clinician override', () => {
	it('the paediatric flag still fires even when the clinician overrides candidacy', () => {
		const d = blank();
		d.patient.birthDate = '2015-01-01';
		d.clinician.assessmentDate = '2026-01-01';
		d.summary.overrideCandidacy = 'strong-candidate';
		d.summary.overrideReason = 'attempted override';
		const r = calculateKneeEvaluation(d);
		expect(r.flags.some((f) => f.flagId === 'F-PAEDIATRIC-001')).toBe(true);
	});
});
