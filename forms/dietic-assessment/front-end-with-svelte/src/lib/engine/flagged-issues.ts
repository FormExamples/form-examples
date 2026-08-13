// Safety-flag detection.
//
// Flags fire independently of the MUST score and are never suppressed by a
// dietitian override of the risk category — see doc/safety-case-notes.md
// hazard H-07. Flag IDs are stable and identical across every front-end and
// the back-end.

import type { GlimResult, SarcfResult, ScoffResult } from './glim-rules';
import type { MustResult } from './must-rules';
import type {
	AdditionalFlag,
	DieticAssessment,
	FlagCategory,
	FlagPriority,
	RefeedingRisk
} from './types';
import { num } from './utils';

export interface FlagContext {
	must: MustResult;
	glim: GlimResult;
	sarcf: SarcfResult;
	scoff: ScoffResult;
	refeedingRisk: RefeedingRisk;
	age: number | null;
}

/** Detect safety flags for a dietetic assessment, most severe first. */
export function detectFlags(data: DieticAssessment, context: FlagContext): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];
	const push = (
		flagId: string,
		category: FlagCategory,
		priority: FlagPriority,
		description: string,
		suggestedAction: string
	) => flags.push({ flagId, category, priority, description, suggestedAction });

	const { must, sarcf, scoff, refeedingRisk, age } = context;

	// --- Malnutrition risk ------------------------------------------------
	if (must.total >= 2) {
		push('F-HIGH-MALNUTRITION-RISK-001', 'high-malnutrition-risk', 'high',
			`MUST score ${must.total} places the patient in the high-risk category.`,
			'Treat: agree a dietetic care plan, improve and increase overall nutritional intake, and monitor against it.');
	}
	if (must.bmi !== null && must.bmi < 16.0) {
		push('F-SEVERE-UNDERWEIGHT-001', 'severe-underweight', 'high',
			`Body mass index ${must.bmi} kg/m² is below 16.0.`,
			'Assess for refeeding-syndrome risk before starting nutrition support, and involve the nutrition support team.');
	}
	if (
		must.weightLossPercent !== null &&
		must.weightLossPercent > 15 &&
		data.anthropometry.weightLossIsIntentional !== 'yes'
	) {
		push('F-SEVERE-WEIGHT-LOSS-001', 'severe-weight-loss', 'high',
			`Unintentional weight loss of ${must.weightLossPercent}% in the last 3 to 6 months.`,
			'Investigate the cause of the weight loss and start nutrition support with refeeding precautions.');
	}

	// --- Refeeding syndrome -----------------------------------------------
	if (refeedingRisk === 'highest') {
		push('F-REFEEDING-SYNDROME-RISK-002', 'refeeding-syndrome-risk', 'high',
			'Highest risk of refeeding syndrome per NICE CG32.',
			'Check potassium, phosphate, magnesium, and calcium before feeding. Start at 5 kcal/kg/day with cardiac monitoring and specialist nutrition-support-team input.');
	} else if (refeedingRisk === 'high') {
		push('F-REFEEDING-SYNDROME-RISK-001', 'refeeding-syndrome-risk', 'high',
			'High risk of refeeding syndrome per NICE CG32.',
			'Check potassium, phosphate, magnesium, and calcium before feeding. Start at no more than 10 kcal/kg/day, give thiamine and a B-vitamin preparation, and monitor daily for the first week.');
	}

	// --- Swallowing --------------------------------------------------------
	if (data.gastrointestinal.dysphagia === 'yes' && data.gastrointestinal.speechAndLanguageTherapy !== 'yes') {
		push('F-DYSPHAGIA-ASPIRATION-RISK-001', 'dysphagia-aspiration-risk', 'high',
			'Dysphagia reported with no speech-and-language-therapy assessment recorded.',
			'Refer to speech and language therapy before agreeing a texture or fluid consistency; withhold oral intake if the swallow is unsafe.');
	}
	if (data.gastrointestinal.dysphagiaScreenOutcome === 'fail') {
		push('F-DYSPHAGIA-ASPIRATION-RISK-002', 'dysphagia-aspiration-risk', 'high',
			'The swallow screen was failed.',
			'Keep the patient nil by mouth pending a speech-and-language-therapy swallow assessment.');
	}

	// --- Intake ------------------------------------------------------------
	const intake = num(data.dietaryRecall.proportionOfUsualIntakePercent);
	if (intake !== null && intake < 50) {
		push('F-INADEQUATE-ORAL-INTAKE-001', 'inadequate-oral-intake', 'high',
			`Oral intake is ${intake}% of usual, below half of the estimated requirement.`,
			'Start food-first fortification and consider oral nutritional supplements; review whether an alternative feeding route is needed.');
	}
	const negligibleDays = num(data.screening.daysOfNegligibleIntake);
	if (negligibleDays !== null && negligibleDays > 5) {
		push('F-INADEQUATE-ORAL-INTAKE-002', 'inadequate-oral-intake', 'high',
			`Little or no nutritional intake for ${negligibleDays} days.`,
			'Escalate to the nutrition support team; assess refeeding risk before starting nutrition support.');
	}

	// --- Micronutrients and electrolytes -----------------------------------
	const ferritin = num(data.biochemistry.ferritinUgPerL);
	const b12 = num(data.biochemistry.vitaminB12NgPerL);
	const folate = num(data.biochemistry.folateUgPerL);
	const vitD = num(data.biochemistry.vitaminDNmolPerL);
	const lowMicros = [
		ferritin !== null && ferritin < 30 ? 'ferritin' : null,
		b12 !== null && b12 < 180 ? 'vitamin B12' : null,
		folate !== null && folate < 3 ? 'folate' : null,
		vitD !== null && vitD < 25 ? 'vitamin D' : null
	].filter((v): v is string => v !== null);
	if (lowMicros.length > 0) {
		push('F-MICRONUTRIENT-DEFICIENCY-001', 'micronutrient-deficiency', 'medium',
			`Below the reference range: ${lowMicros.join(', ')}.`,
			'Correct the deficiency per local policy and identify the dietary or absorptive cause.');
	}

	const potassium = num(data.biochemistry.potassiumMmolPerL);
	const magnesium = num(data.biochemistry.magnesiumMmolPerL);
	const phosphate = num(data.biochemistry.phosphateMmolPerL);
	const lowLytes = [
		potassium !== null && potassium < 3.5 ? 'potassium' : null,
		magnesium !== null && magnesium < 0.7 ? 'magnesium' : null,
		phosphate !== null && phosphate < 0.8 ? 'phosphate' : null
	].filter((v): v is string => v !== null);
	if (lowLytes.length > 0) {
		push('F-ELECTROLYTE-DERANGEMENT-001', 'electrolyte-derangement', 'high',
			`Low ${lowLytes.join(', ')}.`,
			'Correct before or alongside feeding; a low pre-feeding electrolyte is a refeeding-syndrome high-risk criterion.');
	}

	// --- Hydration ---------------------------------------------------------
	const fluid = num(data.hydration.fluidIntakeMlPerDay);
	const dehydrationSign = ['mild-dehydration', 'moderate-dehydration', 'severe-dehydration'].includes(
		data.hydration.hydrationSigns
	);
	if (dehydrationSign || (fluid !== null && fluid < 1000)) {
		push('F-DEHYDRATION-RISK-001', 'dehydration-risk', 'medium',
			dehydrationSign
				? `Clinical signs of ${data.hydration.hydrationSigns.replace('-', ' ')}.`
				: `Fluid intake of ${fluid} ml per day is well below the usual requirement.`,
			'Agree a fluid target with the patient and monitor intake; review any fluid restriction with the responsible clinician.');
	}

	// --- Food insecurity ----------------------------------------------------
	if (
		data.environment.worriedFoodWouldRunOut === 'yes' ||
		data.environment.skippedMealsForMoney === 'yes' ||
		data.environment.usesFoodBank === 'yes'
	) {
		push('F-FOOD-INSECURITY-001', 'food-insecurity', 'high',
			'The food-insecurity screen is positive.',
			'Refer to social prescribing or welfare advice; keep the care plan within the stated food budget and available cooking facilities.');
	}

	// --- Disordered eating --------------------------------------------------
	if (scoff.positive || data.history.conditionEatingDisorder === 'yes') {
		push('F-DISORDERED-EATING-CONCERN-001', 'disordered-eating-concern', 'high',
			scoff.positive
				? `SCOFF score ${scoff.score} is at or above the threshold of 2.`
				: 'A diagnosed eating disorder is recorded.',
			'Refer to the eating-disorder service; avoid weight-focused goals and consider not sharing the weight reading.');
	}

	// --- Skin ---------------------------------------------------------------
	if (
		data.physicalExam.pressureUlcerPresent === 'yes' &&
		['2', '3', '4', 'unstageable'].includes(data.physicalExam.pressureUlcerCategory)
	) {
		push('F-PRESSURE-ULCER-001', 'pressure-ulcer', 'high',
			`Pressure ulcer category ${data.physicalExam.pressureUlcerCategory} is present.`,
			'Increase energy and protein provision to support wound healing and involve the tissue-viability team.');
	}

	// --- Sarcopenia ----------------------------------------------------------
	const grip = num(data.physicalExam.handGripStrengthKg);
	const lowGrip =
		grip !== null &&
		((data.patient.sex === 'male' && grip < 27) || (data.patient.sex === 'female' && grip < 16));
	if (sarcf.atRisk || lowGrip) {
		push('F-SARCOPENIA-RISK-001', 'sarcopenia-risk', 'medium',
			sarcf.atRisk
				? `SARC-F score ${sarcf.score} is at or above the at-risk threshold of 4.`
				: `Hand-grip strength ${grip} kg is below the sex-adjusted cut-off.`,
			'Combine a higher-protein plan with resistance exercise and consider a physiotherapy referral.');
	}

	// --- Diabetes ------------------------------------------------------------
	const hba1c = num(data.biochemistry.hba1cMmolPerMol);
	if (hba1c !== null && hba1c > 75) {
		push('F-UNCONTROLLED-DIABETES-001', 'uncontrolled-diabetes', 'medium',
			`HbA1c ${hba1c} mmol/mol indicates poorly controlled diabetes.`,
			'Coordinate the carbohydrate plan with the diabetes team before increasing energy intake.');
	}

	// --- Renal ---------------------------------------------------------------
	const egfr = num(data.biochemistry.egfrMlPerMin);
	const highProteinPlan =
		data.preferences.therapeuticDiet === 'high-energy-high-protein' ||
		['oral-nutritional-supplements', 'enteral-nutrition', 'parenteral-nutrition'].includes(
			data.plan.interventionType
		);
	if (egfr !== null && egfr < 30 && highProteinPlan) {
		push('F-RENAL-DIETARY-CONFLICT-001', 'renal-dietary-conflict', 'high',
			`eGFR ${egfr} ml/min with a high-protein or supplemented plan.`,
			'Discuss protein, potassium, and phosphate targets with the renal dietetic team before implementing the plan.');
	}

	// --- Medicines -----------------------------------------------------------
	if (data.medication.drugNutrientInteraction === 'yes') {
		push('F-DRUG-NUTRIENT-INTERACTION-001', 'drug-nutrient-interaction', 'medium',
			data.medication.drugNutrientInteractionDetail ||
				'A drug-nutrient interaction was identified during the medication review.',
			'Review the interaction with the prescriber or pharmacist and adjust timing or the plan accordingly.');
	}

	// --- Allergy --------------------------------------------------------------
	if (data.preferences.allergySeverity === 'anaphylaxis') {
		push('F-ALLERGY-ANAPHYLAXIS-RISK-001', 'allergy-anaphylaxis-risk', 'high',
			`A food allergy with anaphylaxis is recorded${data.preferences.foodAllergyDetail ? `: ${data.preferences.foodAllergyDetail}` : ''}.`,
			'Exclude the allergen from every part of the plan, check supplement and enteral-feed ingredients, and confirm an adrenaline auto-injector is carried and in date.');
	}

	// --- Enteral feeding --------------------------------------------------------
	if (data.medication.enteralNutrition === 'yes' && data.medication.enteralTubeProblem === 'yes') {
		push('F-ENTERAL-TUBE-COMPLICATION-001', 'enteral-tube-complication', 'high',
			'A tube or tolerance problem is reported with enteral feeding in place.',
			'Escalate to the nutrition support team or the responsible clinician; do not adjust the regimen without confirming tube position and patency.');
	}

	// --- Alcohol ------------------------------------------------------------------
	const alcohol = num(data.hydration.alcoholUnitsPerWeek);
	if (alcohol !== null && alcohol > 14) {
		push('F-ALCOHOL-EXCESS-001', 'alcohol-excess', 'medium',
			`Alcohol intake of ${alcohol} units per week is above the United Kingdom low-risk guideline of 14.`,
			'Offer brief advice, assess thiamine status, and consider referral to alcohol services.');
	}

	// --- Life stage ------------------------------------------------------------------
	if (['pregnant', 'breastfeeding'].includes(data.history.pregnancyStatus)) {
		push('F-PREGNANCY-LACTATION-001', 'pregnancy-lactation', 'medium',
			`The patient is ${data.history.pregnancyStatus}.`,
			'Apply pregnancy or lactation energy, protein, and micronutrient requirements, and check that supplements are suitable.');
	}
	if (age !== null && age < 16) {
		push('F-PAEDIATRIC-001', 'paediatric', 'high',
			`The patient is ${age} years old; MUST is not validated below 16 years.`,
			'Use a paediatric screening tool such as STAMP or PYMS and refer to the paediatric dietetic service. Treat the score on this report as invalid.');
	}

	// --- Capacity and safeguarding ---------------------------------------------------
	if (
		data.behavioural.capacityConcern === 'yes' ||
		['moderate', 'severe'].includes(data.behavioural.cognitiveImpairment)
	) {
		push('F-CAPACITY-CONCERN-001', 'capacity-concern', 'medium',
			data.behavioural.capacityConcern === 'yes'
				? 'A concern about capacity to consent to or follow the plan is recorded.'
				: `${data.behavioural.cognitiveImpairment === 'severe' ? 'Severe' : 'Moderate'} cognitive impairment is recorded.`,
			'Assess capacity for the specific decision, involve a carer or advocate, and simplify the plan and its written resources.');
	}
	if (data.behavioural.safeguardingConcern === 'yes') {
		push('F-SAFEGUARDING-001', 'safeguarding', 'high',
			'A safeguarding concern is recorded.',
			'Follow local safeguarding policy and raise a concern with the safeguarding lead the same day.');
	}

	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	return flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
