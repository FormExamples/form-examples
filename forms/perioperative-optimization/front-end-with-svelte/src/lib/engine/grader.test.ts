// Boundary tests for the Perioperative Optimization engine.
//
// Every domain threshold and both sides of every gating boundary. The same
// cases run against the HTML front-end's JavaScript engine, so the two
// implementations cannot silently diverge.

import { describe, expect, it } from 'vitest';
import { calculateOptimization } from './grader';
import { createDefaultAssessment } from './defaults';
import { weeksBetween } from './gating';
import type { DomainKey, GradingResult, PerioperativeOptimization } from './types';

function emptyAssessment(): PerioperativeOptimization {
	return createDefaultAssessment();
}

function domain(res: GradingResult, key: DomainKey) {
	return res.domains.find((d) => d.domain === key)!;
}

/** Blank assessment with dates set so gating applies. */
function dated(weeks: number): PerioperativeOptimization {
	const a = emptyAssessment();
	a.assessment.assessmentDate = '2026-09-01';
	const surgery = new Date(Date.UTC(2026, 8, 1) + weeks * 7 * 86400000);
	a.procedure.plannedSurgeryDate = surgery.toISOString().slice(0, 10);
	return a;
}

describe('weeksBetween', () => {
	it('weeksBetween 13w', () => {
		expect(weeksBetween('2026-09-01', '2026-12-01')).toEqual(13);
	});
	it('weeksBetween exact 4w', () => {
		expect(weeksBetween('2026-09-01', '2026-09-29')).toEqual(4);
	});
	it('weeksBetween 27 days floors to 3', () => {
		expect(weeksBetween('2026-09-01', '2026-09-28')).toEqual(3);
	});
	it('weeksBetween null when no surgery date', () => {
		expect(weeksBetween('2026-09-01', '')).toEqual(null);
	});
	it('weeksBetween negative when surgery precedes', () => {
		expect(weeksBetween('2026-09-01', '2026-08-25')).toEqual(-1);
	});
});

describe('Blank assessment', () => {
const blank = calculateOptimization(emptyAssessment());
	it('blank readiness', () => {
		expect(blank.computedReadiness).toEqual('ready');
	});
	it('blank gatingApplied', () => {
		expect(blank.gatingApplied).toEqual(false);
	});
	it('blank weeksToSurgery', () => {
		expect(blank.weeksToSurgery).toEqual(null);
	});
	it('blank flags', () => {
		expect(blank.flags.length).toEqual(0);
	});
	it('blank has 8 domains', () => {
		expect(blank.domains.length).toEqual(8);
	});
	it('blank all optimized/na', () => {
		expect(blank.counts.optimized).toEqual(8);
	});
});

describe('Anaemia domain, and the 4 vs 8 week lead time', () => {
{
  const a = dated(10);
  a.patient.sex = 'female';
  a.anaemia.haemoglobinGPerL = 110;
  const r = calculateOptimization(a);
  const d = domain(r, 'anaemia');
  	it('Hb 110 female triggers anaemia', () => {
		expect(d.triggered).toEqual(true);
	});
  	it('oral route lead time 8w', () => {
		expect(d.leadTimeWeeks).toEqual(8);
	});
  	it('10w >= 8w so action-required', () => {
		expect(d.status).toEqual('action-required');
	});
  	it('readiness optimization-required', () => {
		expect(r.computedReadiness).toEqual('optimization-required');
	});
}
{
  const a = dated(6);
  a.patient.sex = 'female';
  a.anaemia.haemoglobinGPerL = 110;
  const r = calculateOptimization(a);
  const d = domain(r, 'anaemia');
  	it('6w < 8w oral -> insufficient-time', () => {
		expect(d.status).toEqual('insufficient-time');
	});
  	it('shortfall 2 weeks', () => {
		expect(d.weeksShortfall).toEqual(2);
	});
  	it('forces defer-surgery', () => {
		expect(r.computedReadiness).toEqual('defer-surgery');
	});
  	it('raises the gating flag', () => {
		expect(r.flags.some((f) => f.category === 'insufficient-time-to-optimize')).toEqual(true);
	});
}
{
  // Same 6 weeks, but IV route drops the lead time to 4.
  const a = dated(6);
  a.patient.sex = 'female';
  a.anaemia.haemoglobinGPerL = 110;
  a.anaemia.anaemiaTreatmentRoute = 'intravenous';
  const r = calculateOptimization(a);
  	it('IV route lead time 4w', () => {
		expect(domain(r, 'anaemia').leadTimeWeeks).toEqual(4);
	});
  	it('6w >= 4w so action-required', () => {
		expect(domain(r, 'anaemia').status).toEqual('action-required');
	});
  	it('no longer defers', () => {
		expect(r.computedReadiness).toEqual('optimization-required');
	});
}
{
  // Started treatment with time available -> in-progress.
  const a = dated(10);
  a.patient.sex = 'male';
  a.anaemia.haemoglobinGPerL = 125;
  a.anaemia.anaemiaTreatmentStarted = 'yes';
  const r = calculateOptimization(a);
  	it('Hb 125 male triggers', () => {
		expect(domain(r, 'anaemia').triggered).toEqual(true);
	});
  	it('started -> in-progress', () => {
		expect(domain(r, 'anaemia').status).toEqual('in-progress');
	});
  	it('readiness optimization-in-progress', () => {
		expect(r.computedReadiness).toEqual('optimization-in-progress');
	});
}
});

describe('Sex-specific haemoglobin thresholds', () => {
{
  const a = dated(20); a.patient.sex = 'male'; a.anaemia.haemoglobinGPerL = 125;
  	it('Hb 125 male is anaemic', () => {
		expect(domain(calculateOptimization(a), 'anaemia').triggered).toEqual(true);
	});
  const b = dated(20); b.patient.sex = 'female'; b.anaemia.haemoglobinGPerL = 125;
  	it('Hb 125 female is not', () => {
		expect(domain(calculateOptimization(b), 'anaemia').triggered).toEqual(false);
	});
}
});

describe('Iron deficiency without anaemia', () => {
{
  const a = dated(20); a.patient.sex = 'male'; a.anaemia.haemoglobinGPerL = 145;
  a.anaemia.ferritinUgPerL = 20;
  const r = calculateOptimization(a);
  	it('normal Hb but ferritin 20 triggers', () => {
		expect(domain(r, 'anaemia').triggered).toEqual(true);
	});
  	it('rule is R-ANAEMIA-3', () => {
		expect(domain(r, 'anaemia').ruleId).toEqual('R-ANAEMIA-3');
	});
}
{
  const a = dated(20); a.patient.sex = 'male'; a.anaemia.haemoglobinGPerL = 145;
  a.anaemia.ferritinUgPerL = 60; a.anaemia.transferrinSaturationPercent = 15;
  const r = calculateOptimization(a);
  	it('functional iron deficiency triggers', () => {
		expect(domain(r, 'anaemia').ruleId).toEqual('R-ANAEMIA-4');
	});
}
});

describe('Severe anaemia forces deferral regardless of time', () => {
{
  const a = dated(52); a.patient.sex = 'male'; a.anaemia.haemoglobinGPerL = 75;
  const r = calculateOptimization(a);
  	it('Hb 75 defers even with a year available', () => {
		expect(r.computedReadiness).toEqual('defer-surgery');
	});
  	it('severe-anaemia flag', () => {
		expect(r.flags.some((f) => f.category === 'severe-anaemia')).toEqual(true);
	});
}
});

describe('Glycaemic control', () => {
{
  const a = dated(20); a.glycaemic.hba1cMmolPerMol = 55; a.glycaemic.diabetesType = 'type-2';
  const r = calculateOptimization(a);
  	it('HbA1c 55 triggers', () => {
		expect(domain(r, 'glycaemic-control').triggered).toEqual(true);
	});
  	it('lead time 12w', () => {
		expect(domain(r, 'glycaemic-control').leadTimeWeeks).toEqual(12);
	});
  	it('20w >= 12w', () => {
		expect(domain(r, 'glycaemic-control').status).toEqual('action-required');
	});
}
{
  const a = dated(52); a.glycaemic.hba1cMmolPerMol = 75; a.glycaemic.diabetesType = 'type-2';
  const r = calculateOptimization(a);
  	it('HbA1c 75 defers regardless of time', () => {
		expect(r.computedReadiness).toEqual('defer-surgery');
	});
  	it('hba1c flag', () => {
		expect(r.flags.some((f) => f.category === 'hba1c-above-threshold')).toEqual(true);
	});
}
{
  const a = dated(20); a.glycaemic.hba1cMmolPerMol = 47; a.glycaemic.diabetesType = 'type-2';
  	it('HbA1c 47 below threshold', () => {
		expect(domain(calculateOptimization(a), 'glycaemic-control').triggered).toEqual(false);
	});
  const b = dated(20); b.glycaemic.hba1cMmolPerMol = 48; b.glycaemic.diabetesType = 'type-2';
  	it('HbA1c 48 at threshold triggers', () => {
		expect(domain(calculateOptimization(b), 'glycaemic-control').triggered).toEqual(true);
	});
}
{
  const a = dated(20); a.glycaemic.hba1cMmolPerMol = 55;
  const r = calculateOptimization(a);
  	it('raised HbA1c with no diagnosis flags', () => {
		expect(r.flags.some((f) => f.category === 'undiagnosed-diabetes')).toEqual(true);
	});
}
{
  const a = dated(20);
  	it('no diabetes -> glycaemic not-applicable', () => {
		expect(domain(calculateOptimization(a), 'glycaemic-control').status).toEqual('not-applicable');
	});
}
});

describe('Smoking gate boundary', () => {
{
  const a = dated(4); a.smoking.smokingStatus = 'current';
  	it('exactly 4w meets the 4w lead time', () => {
		expect(domain(calculateOptimization(a), 'smoking').status).toEqual('action-required');
	});
  const b = dated(3); b.smoking.smokingStatus = 'current';
  	it('3w is short', () => {
		expect(domain(calculateOptimization(b), 'smoking').status).toEqual('insufficient-time');
	});
  	it('shortfall 1', () => {
		expect(domain(calculateOptimization(b), 'smoking').weeksShortfall).toEqual(1);
	});
}
{
  const a = dated(20); a.smoking.smokingStatus = 'never';
  	it('never smoked -> not-applicable', () => {
		expect(domain(calculateOptimization(a), 'smoking').status).toEqual('not-applicable');
	});
  const b = dated(20); b.smoking.smokingStatus = 'former';
  	it('former smoker -> optimized', () => {
		expect(domain(calculateOptimization(b), 'smoking').status).toEqual('optimized');
	});
}
{
  const a = dated(20); a.smoking.smokingStatus = 'current';
  a.procedure.surgicalSeverity = 'major';
  	it('current smoker + major surgery flags', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'active-smoker-major-surgery')).toEqual(true);
	});
}
});

describe('Alcohol / AUDIT-C', () => {
{
  const a = dated(20); a.patient.sex = 'male';
  a.alcohol.auditCFrequency = 2; a.alcohol.auditCTypicalQuantity = 2; a.alcohol.auditCBingeFrequency = 1;
  const r = calculateOptimization(a);
  	it('AUDIT-C sums to 5', () => {
		expect(r.auditCScore).toEqual(5);
	});
  	it('AUDIT-C 5 triggers for men', () => {
		expect(domain(r, 'alcohol').triggered).toEqual(true);
	});
  const b = dated(20); b.patient.sex = 'female';
  b.alcohol.auditCFrequency = 2; b.alcohol.auditCTypicalQuantity = 1; b.alcohol.auditCBingeFrequency = 1;
  const rb = calculateOptimization(b);
  	it('AUDIT-C 4 triggers for women', () => {
		expect(domain(rb, 'alcohol').triggered).toEqual(true);
	});
}
{
  const a = dated(20); a.alcohol.alcoholUnitsPerWeek = 20;
  	it('20 units triggers', () => {
		expect(domain(calculateOptimization(a), 'alcohol').triggered).toEqual(true);
	});
  const b = dated(20); b.alcohol.alcoholUnitsPerWeek = 14;
  	it('14 units does not', () => {
		expect(domain(calculateOptimization(b), 'alcohol').triggered).toEqual(false);
	});
}
{
  const a = dated(20); a.patient.sex = 'male';
  a.alcohol.auditCFrequency = 4; a.alcohol.auditCTypicalQuantity = 4; a.alcohol.auditCBingeFrequency = 2;
  	it('AUDIT-C 10 flags dependence risk', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'alcohol-dependence-risk')).toEqual(true);
	});
}
});

describe('Nutrition / MUST', () => {
{
  const a = dated(20);
  a.nutrition.heightAsCm = 170; a.nutrition.weightAsKg = 50; // BMI 17.3 -> 2
  a.nutrition.usualWeightAsKg = 58;                          // loss 13.8% -> 2
  const r = calculateOptimization(a);
  	it('MUST 4', () => {
		expect(r.mustScore).toEqual(4);
	});
  	it('MUST risk high', () => {
		expect(r.mustRisk).toEqual('high');
	});
  	it('nutrition triggers', () => {
		expect(domain(r, 'nutrition').triggered).toEqual(true);
	});
  	it('nutrition lead time 3w', () => {
		expect(domain(r, 'nutrition').leadTimeWeeks).toEqual(3);
	});
  	it('malnutrition flag', () => {
		expect(r.flags.some((f) => f.category === 'high-malnutrition-risk')).toEqual(true);
	});
}
{
  const a = dated(20);
  a.nutrition.heightAsCm = 170; a.nutrition.weightAsKg = 75; // BMI 26 -> 0
  a.nutrition.usualWeightAsKg = 76;                          // loss 1.3% -> 0
  const r = calculateOptimization(a);
  	it('MUST 0', () => {
		expect(r.mustScore).toEqual(0);
	});
  	it('nutrition not triggered', () => {
		expect(domain(r, 'nutrition').triggered).toEqual(false);
	});
}
});

describe('Physical fitness', () => {
{
  const a = dated(20); a.fitness.metabolicEquivalents = 3;
  const r = calculateOptimization(a);
  	it('METs 3 triggers', () => {
		expect(domain(r, 'physical-fitness').triggered).toEqual(true);
	});
  	it('fitness lead time 6w', () => {
		expect(domain(r, 'physical-fitness').leadTimeWeeks).toEqual(6);
	});
  	it('poor capacity flag', () => {
		expect(r.flags.some((f) => f.category === 'poor-functional-capacity')).toEqual(true);
	});
  const b = dated(20); b.fitness.metabolicEquivalents = 4;
  	it('METs 4 does not trigger', () => {
		expect(domain(calculateOptimization(b), 'physical-fitness').triggered).toEqual(false);
	});
}
{
  const a = dated(20); a.fitness.metabolicEquivalents = 3; a.fitness.prehabilitationEnrolled = 'yes';
  	it('enrolled -> in-progress', () => {
		expect(domain(calculateOptimization(a), 'physical-fitness').status).toEqual('in-progress');
	});
}
});

describe('Medication', () => {
{
  const a = dated(20); a.medication.takesAnticoagulant = 'yes';
  const r = calculateOptimization(a);
  	it('anticoagulant with no plan triggers', () => {
		expect(domain(r, 'medication').triggered).toEqual(true);
	});
  	it('anticoag flag', () => {
		expect(r.flags.some((f) => f.category === 'anticoagulation-plan-missing')).toEqual(true);
	});
  a.medication.medicationHoldPlanAgreed = 'yes';
  const r2 = calculateOptimization(a);
  	it('plan agreed clears the domain', () => {
		expect(domain(r2, 'medication').triggered).toEqual(false);
	});
  	it('plan agreed clears the flag', () => {
		expect(r2.flags.some((f) => f.category === 'anticoagulation-plan-missing')).toEqual(false);
	});
}
{
  const a = dated(20); a.medication.takesSglt2Inhibitor = 'yes';
  	it('SGLT2 with no plan flags', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'sglt2-inhibitor-not-held')).toEqual(true);
	});
}
{
  const a = dated(20); a.medication.takesGlp1Agonist = 'yes';
  a.medication.medicationHoldPlanAgreed = 'yes';
  	it('GLP-1 flags even with a plan agreed', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'glp1-agonist-aspiration-risk')).toEqual(true);
	});
}
{
  const a = dated(20);
  	it('no medicines -> medication not-applicable', () => {
		expect(domain(calculateOptimization(a), 'medication').status).toEqual('not-applicable');
	});
}
{
  const a = dated(20);
  a.medication.takesGlp1Agonist = 'yes';
  a.medication.glp1HeldPerGuideline = 'yes';
  a.medication.glp1GiSymptoms = 'no';
  	it('GLP-1 held per guideline and asymptomatic does not flag aspiration risk', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'glp1-agonist-aspiration-risk')).toEqual(false);
	});
}
});

describe('Fried Frailty Phenotype', () => {
{
  const a = dated(20);
  a.frailty.friedWeakness = 'no'; a.frailty.friedSlowness = 'no';
  a.frailty.friedLowPhysicalActivity = 'no'; a.frailty.friedExhaustion = 'no';
  a.frailty.friedUnintentionalWeightLoss = 'no';
  const r = calculateOptimization(a);
  	it('all-no scores 0 and robust', () => {
		expect(r.friedPhenotypeScore).toEqual(0);
		expect(r.friedFrailtyCategory).toEqual('robust');
	});
}
{
  const a = dated(20);
  a.frailty.friedWeakness = 'yes'; a.frailty.friedSlowness = 'yes';
  a.frailty.friedLowPhysicalActivity = 'yes'; a.frailty.friedExhaustion = 'no';
  a.frailty.friedUnintentionalWeightLoss = 'no';
  const r = calculateOptimization(a);
  	it('3 of 5 scores frail', () => {
		expect(r.friedPhenotypeScore).toEqual(3);
		expect(r.friedFrailtyCategory).toEqual('frail');
	});
}
{
  const a = dated(20);
  const r = calculateOptimization(a);
  	it('unanswered leaves score null', () => {
		expect(r.friedPhenotypeScore).toBeNull();
		expect(r.friedFrailtyCategory).toEqual('');
	});
}
});

describe('Frailty x GLP-1 intersecting risks', () => {
{
  const a = dated(20);
  a.frailty.clinicalFrailtyScale = 6;
  	it('CFS >= 5 without Mini-Cog flags cognitive-assessment-indicated', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'cognitive-assessment-indicated')).toEqual(true);
	});
}
{
  const a = dated(20);
  a.frailty.clinicalFrailtyScale = 6;
  a.frailty.miniCogPerformed = 'yes';
  	it('Mini-Cog performed clears the flag', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'cognitive-assessment-indicated')).toEqual(false);
	});
}
{
  const a = dated(20);
  a.medication.takesGlp1Agonist = 'yes';
  a.frailty.clinicalFrailtyScale = 5;
  	it('frail + GLP-1 flags sarcopenia-risk', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'sarcopenia-risk')).toEqual(true);
	});
}
{
  const a = dated(20);
  a.medication.takesGlp1Agonist = 'yes';
  a.medication.glp1GiSymptoms = 'yes';
  a.frailty.clinicalFrailtyScale = 5;
  	it('frail + GLP-1 + GI symptoms flags dehydration-aki-risk', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'dehydration-aki-risk')).toEqual(true);
	});
}
{
  const a = dated(20);
  a.medication.takesGlp1Agonist = 'yes';
  a.medication.glp1HeldPerGuideline = 'yes';
  a.glycaemic.insulinRegimen = 'basal-bolus';
  	it('held GLP-1 + insulin flags rebound-glycaemic-risk', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'rebound-glycaemic-risk')).toEqual(true);
	});
}
{
  const a = dated(20);
  a.medication.takesGlp1Agonist = 'yes';
  a.glycaemic.insulinRegimen = 'basal-bolus';
  	it('continued GLP-1 + insulin does not flag rebound-glycaemic-risk', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'rebound-glycaemic-risk')).toEqual(false);
	});
}
});

describe('Cardiorespiratory', () => {
{
  const a = dated(20); a.cardioresp.systolicBp = 185; a.cardioresp.diastolicBp = 95;
  const r = calculateOptimization(a);
  	it('SBP 185 triggers', () => {
		expect(domain(r, 'cardiorespiratory').triggered).toEqual(true);
	});
  	it('hypertension flag', () => {
		expect(r.flags.some((f) => f.category === 'uncontrolled-hypertension')).toEqual(true);
	});
  const b = dated(20); b.cardioresp.systolicBp = 179; b.cardioresp.diastolicBp = 109;
  	it('179/109 does not trigger', () => {
		expect(domain(calculateOptimization(b), 'cardiorespiratory').triggered).toEqual(false);
	});
}
{
  const a = dated(20); a.cardioresp.stopBangScore = 6;
  const r = calculateOptimization(a);
  	it('STOP-BANG 6 unassessed triggers', () => {
		expect(domain(r, 'cardiorespiratory').triggered).toEqual(true);
	});
  	it('osa flag', () => {
		expect(r.flags.some((f) => f.category === 'osa-unassessed')).toEqual(true);
	});
  a.cardioresp.sleepApnoeaDiagnosis = 'yes';
  	it('diagnosed OSA clears it', () => {
		expect(domain(calculateOptimization(a), 'cardiorespiratory').triggered).toEqual(false);
	});
}
});

describe('Ungated (no surgery date)', () => {
{
  const a = emptyAssessment();
  a.assessment.assessmentDate = '2026-09-01';
  a.smoking.smokingStatus = 'current';
  a.anaemia.haemoglobinGPerL = 100; a.patient.sex = 'female';
  const r = calculateOptimization(a);
  	it('ungated gatingApplied false', () => {
		expect(r.gatingApplied).toEqual(false);
	});
  	it('ungated smoking action-required', () => {
		expect(domain(r, 'smoking').status).toEqual('action-required');
	});
  	it('ungated anaemia action-required', () => {
		expect(domain(r, 'anaemia').status).toEqual('action-required');
	});
  	it('ungated never defers on time', () => {
		expect(r.computedReadiness).toEqual('optimization-required');
	});
  	it('ungated raises no gating flag', () => {
		expect(r.flags.some((f) => f.category === 'insufficient-time-to-optimize')).toEqual(false);
	});
}
});

describe('Surgery date before assessment date', () => {
{
  const a = emptyAssessment();
  a.assessment.assessmentDate = '2026-09-01';
  a.procedure.plannedSurgeryDate = '2026-08-01';
  a.smoking.smokingStatus = 'current';
  const r = calculateOptimization(a);
  	it('negative weeks reported', () => {
		expect(r.weeksToSurgery !== null && r.weeksToSurgery < 0).toEqual(true);
	});
  	it('negative weeks -> insufficient-time', () => {
		expect(domain(r, 'smoking').status).toEqual('insufficient-time');
	});
}
});

describe('recommendedEarliestSurgeryDate', () => {
{
  const a = dated(2); a.patient.sex = 'female'; a.anaemia.haemoglobinGPerL = 110; // 8w lead, 6 short
  const r = calculateOptimization(a);
  	it('shortfall 6', () => {
		expect(domain(r, 'anaemia').weeksShortfall).toEqual(6);
	});
  	it('recommends 2026-10-27', () => {
		expect(r.recommendedEarliestSurgeryDate).toEqual('2026-10-27');
	});
}
});

describe('Max-grade: worst domain wins', () => {
{
  const a = dated(5);
  a.smoking.smokingStatus = 'current';              // 4w lead: fits -> action-required
  a.patient.sex = 'female';
  a.anaemia.haemoglobinGPerL = 110;                 // 8w lead: short -> insufficient-time
  const r = calculateOptimization(a);
  	it('smoking fits', () => {
		expect(domain(r, 'smoking').status).toEqual('action-required');
	});
  	it('anaemia short', () => {
		expect(domain(r, 'anaemia').status).toEqual('insufficient-time');
	});
  	it('worst domain sets the band', () => {
		expect(r.computedReadiness).toEqual('defer-surgery');
	});
}
});

describe('Override changes the band but never the flags', () => {
{
  const a = dated(2); a.patient.sex = 'female'; a.anaemia.haemoglobinGPerL = 110;
  const before = calculateOptimization(a);
  a.signoff.overrideReadiness = 'ready';
  a.signoff.overrideReason = 'Cancer resection; delay carries the greater risk.';
  const after = calculateOptimization(a);
  	it('computed band unchanged', () => {
		expect(after.computedReadiness).toEqual('defer-surgery');
	});
  	it('final band overridden', () => {
		expect(after.finalReadiness).toEqual('ready');
	});
  	it('reason recorded', () => {
		expect(after.overrideReason.length > 0).toEqual(true);
	});
  	it('flag list is byte-identical', () => {
		expect(JSON.stringify(after.flags)).toEqual(JSON.stringify(before.flags));
	});
  	it('gating flag survives the override', () => {
		expect(after.flags.some((f) => f.category === 'insufficient-time-to-optimize')).toEqual(true);
	});
}
{
  const a = dated(20);
  a.signoff.overrideReadiness = 'ready';
  a.signoff.overrideReason = 'Not needed.';
  	it('no reason stored when override matches computed', () => {
		expect(calculateOptimization(a).overrideReason).toEqual('');
	});
}
});

describe('Paediatric and pregnancy', () => {
{
  const a = dated(20); a.patient.birthDate = '2016-01-01';
  	it('paediatric flag', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'paediatric')).toEqual(true);
	});
}
{
  const a = dated(20); a.history.pregnancyStatus = 'pregnant';
  	it('pregnancy flag', () => {
		expect(calculateOptimization(a).flags.some((f) => f.category === 'pregnancy')).toEqual(true);
	});
}
});

describe('Flags sorted most severe first', () => {
{
  const a = dated(2); a.patient.sex = 'female'; a.anaemia.haemoglobinGPerL = 70;
  a.cardioresp.stopBangScore = 6;
  const priorities = calculateOptimization(a).flags.map((f) => f.priority);
  const rank = { high: 0, medium: 1, low: 2 };
  	it('flags sorted', () => {
		expect(priorities).toEqual([...priorities].sort((x, y) => rank[x] - rank[y]));
	});
}
});

describe('Determinism', () => {
{
  const a = dated(6); a.patient.sex = 'female'; a.anaemia.haemoglobinGPerL = 110;
  	it('deterministic', () => {
		expect(JSON.stringify(calculateOptimization(a))).toEqual(JSON.stringify(calculateOptimization(a)));
	});
}
});
