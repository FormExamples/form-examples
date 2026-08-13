// Boundary tests for the Dietetic Assessment scoring engine.
//
// The MUST thresholds (BMI 18.5 / 20.0, weight loss 5% / 10%) are exactly the
// places a screening tool goes wrong, so each boundary is asserted on both
// sides. The same cases run against the HTML front-end's JavaScript engine, so
// the two implementations cannot silently diverge.

import { describe, expect, it } from 'vitest';
import { calculateNutritionRisk } from './grader';
import type { AnthropometrySection, DieticAssessment } from './types';
import { createDefaultAssessment } from './defaults';

function blank(): DieticAssessment {
	return createDefaultAssessment();
}

function withAnthro(over: Partial<AnthropometrySection>): DieticAssessment {
	const a = blank();
	Object.assign(a.anthropometry, over);
	return a;
}

/** Build an assessment whose height and weight give exactly this BMI. */
function withBmi(bmi: number): DieticAssessment {
	const heightAsCm = 170;
	const weightAsKg = Math.round(bmi * (heightAsCm / 100) ** 2 * 10) / 10;
	return withAnthro({ heightAsCm, weightAsKg });
}

/** Build an assessment with exactly this percentage unplanned weight loss. */
function withWeightLoss(pct: number): DieticAssessment {
	const usualWeightAsKg = 100;
	const weightAsKg = Math.round(usualWeightAsKg * (1 - pct / 100) * 10) / 10;
	return withAnthro({ heightAsCm: 170, weightAsKg, usualWeightAsKg });
}

describe('empty assessment', () => {
	it('scores zero and raises nothing', () => {
		const r = calculateNutritionRisk(blank());
		expect(r.mustScore).toBe(0);
		expect(r.mustRisk).toBe('low');
		expect(r.glimDiagnosis).toBe('none');
		expect(r.refeedingRisk).toBe('none');
		expect(r.computedCompositeRisk).toBe('low');
		expect(r.recommendation).toBe('routine-care');
		expect(r.flags).toHaveLength(0);
	});
});

describe('MUST step 1 — body mass index', () => {
	it.each([
		[25.0, 0],
		[20.5, 0],
		[20.0, 1], // inclusive upper bound of the 18.5–20.0 band
		[19.0, 1],
		[18.5, 1], // inclusive lower bound
		[18.4, 2],
		[15.0, 2]
	])('BMI %s scores %i', (bmi, expected) => {
		expect(calculateNutritionRisk(withBmi(bmi)).mustBmiScore).toBe(expected);
	});

	it('scores obesity as 0, because MUST screens for malnutrition', () => {
		expect(calculateNutritionRisk(withBmi(35)).mustBmiScore).toBe(0);
	});
});

describe('MUST step 1 — mid-upper-arm-circumference fallback', () => {
	it('estimates from MUAC when the patient declines to be weighed', () => {
		const r = calculateNutritionRisk(
			withAnthro({ measurementMethod: 'declined', midUpperArmCircumferenceAsCm: 22.0 })
		);
		expect(r.mustBmiScore).toBe(1);
		expect(r.mustIsEstimated).toBe(true);
		expect(r.bmi).toBeNull();
	});

	it.each([
		[19.0, 2],
		[22.0, 1],
		[25.0, 0],
		[33.0, 0]
	])('MUAC %s cm scores %i', (muac, expected) => {
		const r = calculateNutritionRisk(
			withAnthro({ measurementMethod: 'declined', midUpperArmCircumferenceAsCm: muac })
		);
		expect(r.mustBmiScore).toBe(expected);
	});

	it('never blocks completion when weighing is declined and no MUAC is given', () => {
		const r = calculateNutritionRisk(withAnthro({ measurementMethod: 'declined' }));
		expect(r.mustScore).toBe(0);
		expect(r.mustIsEstimated).toBe(true);
	});
});

describe('MUST step 2 — unplanned weight loss', () => {
	it.each([
		[4.9, 0],
		[5.0, 1], // inclusive lower bound of the 5–10% band
		[7.5, 1],
		[10.0, 1], // inclusive upper bound
		[10.1, 2],
		[20.0, 2]
	])('loss of %s%% scores %i', (pct, expected) => {
		expect(calculateNutritionRisk(withWeightLoss(pct)).mustWeightLossScore).toBe(expected);
	});

	it('scores intentional loss as 0 and excludes it from GLIM', () => {
		const a = withAnthro({
			heightAsCm: 170,
			weightAsKg: 80,
			usualWeightAsKg: 100,
			weightLossIsIntentional: 'yes'
		});
		const r = calculateNutritionRisk(a);
		expect(r.mustWeightLossScore).toBe(0);
		expect(r.glimPhenotypicCriteria).not.toContain('weight-loss');
	});

	it('falls back to the subjective criterion when no baseline weight exists', () => {
		const r = calculateNutritionRisk(
			withAnthro({ heightAsCm: 170, weightAsKg: 70, clothesOrJewelleryLooser: 'yes' })
		);
		expect(r.mustWeightLossScore).toBe(1);
		expect(r.mustIsEstimated).toBe(true);
	});
});

describe('MUST step 3 — acute disease effect', () => {
	it('requires both conditions', () => {
		const a = blank();
		a.screening.acutelyIll = 'yes';
		expect(calculateNutritionRisk(a).mustAcuteDiseaseScore).toBe(0);
		a.screening.noNutritionalIntakeOver5Days = 'yes';
		expect(calculateNutritionRisk(a).mustAcuteDiseaseScore).toBe(2);
	});
});

describe('MUST risk category', () => {
	it.each([
		[0, 'low'],
		[1, 'medium'],
		[2, 'high']
	])('total %i is %s risk', (total, expected) => {
		// BMI alone can produce 0, 1, or 2; add the acute component for 2+.
		const a = total === 0 ? withBmi(25) : total === 1 ? withBmi(19) : withBmi(17);
		expect(calculateNutritionRisk(a).mustRisk).toBe(expected);
	});
});

describe('oedema adjustment', () => {
	it('subtracts the adjustment before computing body mass index', () => {
		const r = calculateNutritionRisk(
			withAnthro({ heightAsCm: 170, weightAsKg: 60, oedemaPresent: 'yes', oedemaAdjustmentKg: 5 })
		);
		expect(r.adjustedWeightKg).toBe(55);
		expect(r.bmi).toBe(19.0);
	});
});

describe('GLIM', () => {
	it('needs both a phenotypic and an etiologic criterion', () => {
		const noEtiology = withAnthro({ heightAsCm: 170, weightAsKg: 55, usualWeightAsKg: 62 });
		expect(calculateNutritionRisk(noEtiology).glimDiagnosis).toBe('none');
	});

	it('diagnoses at the worst phenotypic band', () => {
		const a = withAnthro({ heightAsCm: 170, weightAsKg: 55, usualWeightAsKg: 62 });
		a.patient.birthDate = '1960-01-01';
		a.dietitian.assessmentDate = '2026-06-01'; // age 66
		a.dietaryRecall.proportionOfUsualIntakePercent = 40;
		const r = calculateNutritionRisk(a);
		expect(r.glimPhenotypicCriteria).toContain('weight-loss');
		expect(r.glimPhenotypicCriteria).toContain('low-bmi');
		expect(r.glimEtiologicCriteria).toContain('reduced-intake');
		// 11.3% loss is the severe band; BMI 19.0 is only moderate for age 66.
		expect(r.glimDiagnosis).toBe('severe');
		expect(r.computedCompositeRisk).toBe('critical');
	});

	it('uses the higher body mass index thresholds from age 70', () => {
		const a = withAnthro({ heightAsCm: 170, weightAsKg: 61 }); // BMI 21.1
		a.patient.birthDate = '1950-01-01';
		a.dietitian.assessmentDate = '2026-06-01'; // age 76
		a.history.conditionCancer = 'yes';
		expect(calculateNutritionRisk(a).glimPhenotypicCriteria).toContain('low-bmi');
	});

	it('satisfies the muscle-mass criterion from the physical examination', () => {
		const a = blank();
		a.physicalExam.muscleWastingSeverity = 'severe';
		a.physicalExam.muscleWastingTemples = 'yes';
		a.screening.acutelyIll = 'yes';
		const r = calculateNutritionRisk(a);
		expect(r.glimPhenotypicCriteria).toContain('reduced-muscle-mass');
		expect(r.glimDiagnosis).toBe('severe');
	});
});

describe('refeeding-syndrome risk (NICE CG32)', () => {
	it('is highest below body mass index 14', () => {
		expect(calculateNutritionRisk(withBmi(13.1)).refeedingRisk).toBe('highest');
	});

	it('is high on one major criterion', () => {
		expect(calculateNutritionRisk(withBmi(15.6)).refeedingRisk).toBe('high');
	});

	it('is high on two minor criteria', () => {
		const a = withBmi(18.0);
		a.screening.daysOfNegligibleIntake = 6;
		expect(calculateNutritionRisk(a).refeedingRisk).toBe('high');
	});

	it('is none on a single minor criterion', () => {
		expect(calculateNutritionRisk(withBmi(18.0)).refeedingRisk).toBe('none');
	});

	it('fires on a low pre-feeding electrolyte', () => {
		const a = blank();
		a.biochemistry.phosphateMmolPerL = 0.6;
		const r = calculateNutritionRisk(a);
		expect(r.refeedingRisk).toBe('high');
		expect(r.flags.map((f) => f.category)).toContain('refeeding-syndrome-risk');
	});
});

describe('composite risk is max-grade', () => {
	it('escalates to critical on an unassessed swallow even at MUST 0', () => {
		const a = blank();
		a.gastrointestinal.dysphagia = 'yes';
		const r = calculateNutritionRisk(a);
		expect(r.mustScore).toBe(0);
		expect(r.computedCompositeRisk).toBe('critical');
		expect(r.flags.map((f) => f.category)).toContain('dysphagia-aspiration-risk');
	});

	it('clears the escalation once speech and language therapy is involved', () => {
		const a = blank();
		a.gastrointestinal.dysphagia = 'yes';
		a.gastrointestinal.speechAndLanguageTherapy = 'yes';
		expect(calculateNutritionRisk(a).computedCompositeRisk).toBe('low');
	});
});

describe('SARC-F', () => {
	it('flags sarcopenia risk at 4', () => {
		const a = blank();
		Object.assign(a.activity, {
			sarcfStrength: 1,
			sarcfWalking: 1,
			sarcfRisingFromChair: 1,
			sarcfClimbingStairs: 1,
			sarcfFalls: 0
		});
		const r = calculateNutritionRisk(a);
		expect(r.sarcfScore).toBe(4);
		expect(r.computedCompositeRisk).toBe('moderate');
		expect(r.flags.map((f) => f.category)).toContain('sarcopenia-risk');
	});

	it('is null when no component is answered', () => {
		expect(calculateNutritionRisk(blank()).sarcfScore).toBeNull();
	});
});

describe('SCOFF', () => {
	it('flags a disordered-eating concern at 2', () => {
		const a = blank();
		a.behavioural.scoffLostControl = 'yes';
		a.behavioural.scoffFoodDominates = 'yes';
		a.behavioural.scoffMakeYourselfSick = 'no';
		const r = calculateNutritionRisk(a);
		expect(r.scoffScore).toBe(2);
		expect(r.flags.map((f) => f.category)).toContain('disordered-eating-concern');
	});
});

describe('safety flags', () => {
	it('raises the paediatric flag below age 16', () => {
		const a = blank();
		a.patient.birthDate = '2016-01-01';
		a.dietitian.assessmentDate = '2026-06-01';
		expect(calculateNutritionRisk(a).flags.map((f) => f.category)).toContain('paediatric');
	});

	it('raises food insecurity from the screening questions', () => {
		const a = blank();
		a.environment.skippedMealsForMoney = 'yes';
		expect(calculateNutritionRisk(a).flags.map((f) => f.category)).toContain('food-insecurity');
	});

	it('sorts the most severe first', () => {
		const a = withBmi(13.0);
		const priorities = calculateNutritionRisk(a).flags.map((f) => f.priority);
		const rank = { high: 0, medium: 1, low: 2 };
		const sorted = [...priorities].sort((x, y) => rank[x] - rank[y]);
		expect(priorities).toEqual(sorted);
	});
});

describe('dietitian override', () => {
	it('changes the risk category but never suppresses a safety flag', () => {
		const a = withBmi(13.1);
		a.plan.overrideCompositeRisk = 'low';
		a.plan.overrideReason = 'Stable long-term low weight, agreed with the consultant.';
		const r = calculateNutritionRisk(a);
		expect(r.computedCompositeRisk).toBe('critical');
		expect(r.finalCompositeRisk).toBe('low');
		expect(r.overrideReason).not.toBe('');
		expect(r.flags.map((f) => f.category)).toContain('refeeding-syndrome-risk');
		expect(r.recommendation).toBe('routine-care');
	});

	it('records no reason when the override matches the computed value', () => {
		const a = blank();
		a.plan.overrideCompositeRisk = 'low';
		a.plan.overrideReason = 'Not needed.';
		expect(calculateNutritionRisk(a).overrideReason).toBe('');
	});
});

describe('purity', () => {
	it('returns the same result for the same input', () => {
		const a = withBmi(19);
		expect(JSON.stringify(calculateNutritionRisk(a))).toBe(
			JSON.stringify(calculateNutritionRisk(a))
		);
	});
});
