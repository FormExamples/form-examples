// Boundary tests for the Health Screening Questionnaire scoring engine.
//
// Every PAR-Q+ item and both AUDIT-C thresholds (5/4 increasing-risk, 8
// higher-risk) are asserted on both sides — exactly the places a screening
// tool goes wrong. The same cases run against the HTML front-end's
// JavaScript engine, so the two implementations cannot silently diverge.

import { describe, expect, it } from 'vitest';
import { calculateHealthScreening, computeBodyMassIndex } from './grader';
import { createDefaultQuestionnaire } from './defaults';
import type {
	HealthScreeningQuestionnaire,
	ParqSection,
	SmokingAlcoholSection,
	SymptomSection
} from './types';

function blank(): HealthScreeningQuestionnaire {
	return createDefaultQuestionnaire();
}

function withParq(over: Partial<ParqSection>): HealthScreeningQuestionnaire {
	const d = blank();
	Object.assign(d.parq, over);
	return d;
}

function allParqNo(): HealthScreeningQuestionnaire {
	return withParq({
		parqDiagnosedHeartCondition: 'no',
		parqChestPainAtRest: 'no',
		parqChestPainDuringActivity: 'no',
		parqDizzinessOrLossOfConsciousness: 'no',
		parqOtherChronicMedicalCondition: 'no',
		parqPrescribedMedicationForChronicCondition: 'no',
		parqBoneOrJointProblem: 'no'
	});
}

function withAuditC(over: Partial<SmokingAlcoholSection>): HealthScreeningQuestionnaire {
	const d = blank();
	Object.assign(d.smokingAlcohol, over);
	return d;
}

function withSymptom(over: Partial<SymptomSection>): HealthScreeningQuestionnaire {
	const d = blank();
	Object.assign(d.symptoms, over);
	return d;
}

describe('empty questionnaire', () => {
	it('scores low with no flags and no PAR-Q+/AUDIT-C result yet', () => {
		const r = calculateHealthScreening(blank());
		expect(r.parqPlusClearance).toBe('');
		expect(r.auditCScore).toBeNull();
		expect(r.auditCBand).toBe('');
		expect(r.computedRiskBand).toBe('low');
		expect(r.computedRecommendation).toBe('clear-to-proceed');
		expect(r.flags).toHaveLength(0);
	});
});

describe('PAR-Q+ clearance', () => {
	it('clears when all 7 items are no', () => {
		expect(calculateHealthScreening(allParqNo()).parqPlusClearance).toBe('cleared');
	});

	it.each<[keyof ParqSection]>([
		['parqDiagnosedHeartCondition'],
		['parqChestPainAtRest'],
		['parqChestPainDuringActivity'],
		['parqDizzinessOrLossOfConsciousness'],
		['parqOtherChronicMedicalCondition'],
		['parqPrescribedMedicationForChronicCondition'],
		['parqBoneOrJointProblem']
	])('requires further assessment when %s is yes', (field) => {
		const d = allParqNo();
		d.parq[field] = 'yes';
		const r = calculateHealthScreening(d);
		expect(r.parqPlusClearance).toBe('further-assessment-required');
	});

	it('raises the medical-clearance flag when further assessment is required', () => {
		const d = allParqNo();
		d.parq.parqChestPainDuringActivity = 'yes';
		const r = calculateHealthScreening(d);
		expect(r.flags.some((f) => f.category === 'parq-positive-medical-clearance-needed')).toBe(true);
	});
});

describe('AUDIT-C score', () => {
	it('is null when all three items are unanswered', () => {
		expect(calculateHealthScreening(blank()).auditCScore).toBeNull();
	});

	it('sums the three items', () => {
		const d = withAuditC({ auditCFrequency: 2, auditCTypicalQuantity: 1, auditCBingeFrequency: 0 });
		expect(calculateHealthScreening(d).auditCScore).toBe(3);
	});
});

describe('AUDIT-C band — men (threshold 5 / 8)', () => {
	function withScoreMale(score: number): HealthScreeningQuestionnaire {
		const d = withAuditC({ auditCFrequency: score, auditCTypicalQuantity: 0, auditCBingeFrequency: 0 });
		d.patient.sex = 'male';
		return d;
	}

	it.each([
		[4, 'low'],
		[5, 'increasing-risk'], // inclusive lower bound
		[7, 'increasing-risk'],
		[8, 'higher-risk'] // inclusive lower bound
	])('score %i bands %s', (score, expected) => {
		expect(calculateHealthScreening(withScoreMale(score)).auditCBand).toBe(expected);
	});
});

describe('AUDIT-C band — women (threshold 4 / 8)', () => {
	function withScoreFemale(score: number): HealthScreeningQuestionnaire {
		const d = withAuditC({ auditCFrequency: score, auditCTypicalQuantity: 0, auditCBingeFrequency: 0 });
		d.patient.sex = 'female';
		return d;
	}

	it.each([
		[3, 'low'],
		[4, 'increasing-risk'], // inclusive lower bound
		[7, 'increasing-risk'],
		[8, 'higher-risk']
	])('score %i bands %s', (score, expected) => {
		expect(calculateHealthScreening(withScoreFemale(score)).auditCBand).toBe(expected);
	});
});

describe('AUDIT-C higher-risk flag', () => {
	it('fires alcohol-higher-risk at score 8 and not at score 7', () => {
		const d8 = withAuditC({ auditCFrequency: 4, auditCTypicalQuantity: 4, auditCBingeFrequency: 0 });
		d8.patient.sex = 'male';
		expect(calculateHealthScreening(d8).flags.some((f) => f.category === 'alcohol-higher-risk')).toBe(true);

		const d7 = withAuditC({ auditCFrequency: 4, auditCTypicalQuantity: 3, auditCBingeFrequency: 0 });
		d7.patient.sex = 'male';
		expect(calculateHealthScreening(d7).flags.some((f) => f.category === 'alcohol-higher-risk')).toBe(false);
	});
});

describe('composite risk band — refer-urgently', () => {
	it('fires on unexplained chest pain', () => {
		const d = withSymptom({ symptomUnexplainedChestPain: 'yes' });
		expect(calculateHealthScreening(d).computedRiskBand).toBe('refer-urgently');
	});

	it('fires on dizzy spells or fainting', () => {
		const d = withSymptom({ symptomDizzySpellsOrFainting: 'yes' });
		expect(calculateHealthScreening(d).computedRiskBand).toBe('refer-urgently');
	});

	it('raises the urgent-cardiac-symptom flag', () => {
		const d = withSymptom({ symptomUnexplainedChestPain: 'yes' });
		expect(calculateHealthScreening(d).flags.some((f) => f.category === 'urgent-cardiac-symptom')).toBe(true);
	});
});

describe('composite risk band — high', () => {
	it('fires on another red-flag symptom', () => {
		const d = withSymptom({ symptomShortnessOfBreathOnExertion: 'yes' });
		expect(calculateHealthScreening(d).computedRiskBand).toBe('high');
	});

	it('fires when AUDIT-C is higher-risk', () => {
		const d = withAuditC({ auditCFrequency: 4, auditCTypicalQuantity: 4, auditCBingeFrequency: 0 });
		expect(calculateHealthScreening(d).computedRiskBand).toBe('high');
	});

	it('fires on family history of premature cardiac event combined with a chronic condition', () => {
		const d = blank();
		d.familyHistory.familyHistoryPrematureCardiacEvent = 'yes';
		d.medicalHistory.conditionHypertension = 'yes';
		expect(calculateHealthScreening(d).computedRiskBand).toBe('high');
	});

	it('does not fire on family history alone, without a chronic condition', () => {
		const d = blank();
		d.familyHistory.familyHistoryPrematureCardiacEvent = 'yes';
		expect(calculateHealthScreening(d).computedRiskBand).toBe('low');
	});
});

describe('composite risk band — moderate', () => {
	it('fires when PAR-Q+ requires further assessment', () => {
		const d = allParqNo();
		d.parq.parqBoneOrJointProblem = 'yes';
		expect(calculateHealthScreening(d).computedRiskBand).toBe('moderate');
	});

	it('fires when AUDIT-C is increasing-risk', () => {
		const d = withAuditC({ auditCFrequency: 2, auditCTypicalQuantity: 2, auditCBingeFrequency: 0 });
		d.patient.sex = 'female';
		expect(calculateHealthScreening(d).computedRiskBand).toBe('moderate');
	});

	it('fires on exactly one chronic condition without a red-flag symptom', () => {
		const d = blank();
		d.medicalHistory.conditionAsthma = 'yes';
		expect(calculateHealthScreening(d).computedRiskBand).toBe('moderate');
	});
});

describe('composite risk band — max-grade ordering', () => {
	it('refer-urgently beats every other finding', () => {
		const d = blank();
		d.symptoms.symptomUnexplainedChestPain = 'yes';
		d.medicalHistory.conditionAsthma = 'yes';
		d.smokingAlcohol.auditCFrequency = 4;
		d.smokingAlcohol.auditCTypicalQuantity = 4;
		d.smokingAlcohol.auditCBingeFrequency = 4;
		expect(calculateHealthScreening(d).computedRiskBand).toBe('refer-urgently');
	});
});

describe('unexplained weight loss flag', () => {
	it('fires independently of the risk band', () => {
		const d = withSymptom({ symptomUnexplainedWeightLoss: 'yes' });
		const r = calculateHealthScreening(d);
		expect(r.flags.some((f) => f.category === 'unexplained-weight-loss')).toBe(true);
	});
});

describe('body mass index', () => {
	it('is null when height or weight is missing', () => {
		expect(computeBodyMassIndex(blank())).toBeNull();
	});

	it('computes from height and weight', () => {
		const d = blank();
		d.vitals.heightAsCm = 180;
		d.vitals.weightAsKg = 81;
		// 81 / 1.8^2 = 25.0
		expect(computeBodyMassIndex(d)).toBe(25.0);
	});
});

describe('paediatric routing', () => {
	function withAge(years: number): HealthScreeningQuestionnaire {
		const d = blank();
		d.context.assessmentDate = '2026-01-01';
		const birthYear = 2026 - years;
		d.patient.birthDate = `${birthYear}-01-01`; // same month/day as the assessment date: exactly `years` old
		return d;
	}

	it('is not paediatric at exactly 16', () => {
		const d = blank();
		d.context.assessmentDate = '2026-01-01';
		d.patient.birthDate = '2010-01-01';
		expect(calculateHealthScreening(d).isPaediatric).toBe(false);
	});

	it('is paediatric at 15', () => {
		const d = withAge(15);
		const r = calculateHealthScreening(d);
		expect(r.isPaediatric).toBe(true);
		expect(r.computedRiskBand).toBe('');
		expect(r.computedRecommendation).toBe('paediatric-pathway');
		expect(r.flags.some((f) => f.category === 'paediatric')).toBe(true);
	});
});

describe('assessor override', () => {
	it('changes the final risk band and recommendation but never the flags', () => {
		const d = withSymptom({ symptomUnexplainedChestPain: 'yes' });
		d.summary.overrideRiskBand = 'moderate';
		d.summary.overrideReason = 'Assessed in person; chest pain explained by a recent musculoskeletal injury.';
		const r = calculateHealthScreening(d);
		expect(r.computedRiskBand).toBe('refer-urgently');
		expect(r.finalRiskBand).toBe('moderate');
		expect(r.finalRecommendation).toBe('routine-review');
		// The safety flag still fires, regardless of the override.
		expect(r.flags.some((f) => f.category === 'urgent-cardiac-symptom')).toBe(true);
	});

	it('defaults the final risk band to the computed value when no override is set', () => {
		const d = withSymptom({ symptomPalpitations: 'yes' });
		const r = calculateHealthScreening(d);
		expect(r.finalRiskBand).toBe(r.computedRiskBand);
		expect(r.finalRecommendation).toBe(r.computedRecommendation);
	});
});
