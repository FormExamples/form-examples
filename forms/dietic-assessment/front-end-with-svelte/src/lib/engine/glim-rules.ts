// GLIM, SARC-F, SCOFF, and refeeding-syndrome rules.
//
// GLIM requires at least one phenotypic criterion AND at least one etiologic
// criterion; severity is set by the phenotypic criteria alone. See
// doc/glim-criteria.md and doc/refeeding-syndrome-risk.md.
//
// Every function here is pure.

import type { MustResult } from './must-rules';
import type { DieticAssessment, FiredRule, GlimDiagnosis, RefeedingRisk } from './types';
import { num, rule } from './utils';

export interface GlimPhenotypicResult {
	criteria: string[];
	severity: GlimDiagnosis;
	firedRules: FiredRule[];
}

export interface GlimResult {
	phenotypic: string[];
	etiologic: string[];
	diagnosis: GlimDiagnosis;
	firedRules: FiredRule[];
}

export interface SarcfResult {
	score: number | null;
	atRisk: boolean;
	firedRules: FiredRule[];
}

export interface ScoffResult {
	score: number | null;
	positive: boolean;
	firedRules: FiredRule[];
}

export interface RefeedingResult {
	risk: RefeedingRisk;
	firedRules: FiredRule[];
}

/** GLIM phenotypic criteria; the worst band across criteria sets severity. */
export function scoreGlimPhenotypic(
	data: DieticAssessment,
	must: MustResult,
	age: number | null
): GlimPhenotypicResult {
	const criteria: string[] = [];
	const firedRules: FiredRule[] = [];
	let severity: GlimDiagnosis = 'none';

	const worsen = (band: GlimDiagnosis) => {
		if (band === 'severe') severity = 'severe';
		else if (band === 'moderate' && severity !== 'severe') severity = 'moderate';
	};

	const pct = must.weightLossPercent;
	if (pct !== null && data.anthropometry.weightLossIsIntentional !== 'yes') {
		if (pct > 10) {
			criteria.push('weight-loss');
			worsen('severe');
			firedRules.push(rule('R-GLIM-P-WL', 'glim', 'phenotypic', null, 'severe', 'weight history',
				`Unintentional weight loss of ${pct}% within 6 months meets the GLIM severe threshold.`));
		} else if (pct >= 5) {
			criteria.push('weight-loss');
			worsen('moderate');
			firedRules.push(rule('R-GLIM-P-WL', 'glim', 'phenotypic', null, 'moderate', 'weight history',
				`Unintentional weight loss of ${pct}% within 6 months meets the GLIM moderate threshold.`));
		}
	}

	const bmi = must.bmi;
	if (bmi !== null) {
		const older = age !== null && age >= 70;
		const severeCut = older ? 20 : 18.5;
		const moderateCut = older ? 22 : 20;
		if (bmi < severeCut) {
			criteria.push('low-bmi');
			worsen('severe');
			firedRules.push(rule('R-GLIM-P-BMI', 'glim', 'phenotypic', null, 'severe', 'anthropometry',
				`Body mass index ${bmi} kg/m² is below ${severeCut}, the GLIM severe threshold for this age band.`));
		} else if (bmi < moderateCut) {
			criteria.push('low-bmi');
			worsen('moderate');
			firedRules.push(rule('R-GLIM-P-BMI', 'glim', 'phenotypic', null, 'moderate', 'anthropometry',
				`Body mass index ${bmi} kg/m² is below ${moderateCut}, the GLIM moderate threshold for this age band.`));
		}
	}

	const wasting = data.physicalExam.muscleWastingSeverity;
	const sites = [
		data.physicalExam.muscleWastingTemples,
		data.physicalExam.muscleWastingClavicles,
		data.physicalExam.muscleWastingQuadriceps
	].filter((v) => v === 'yes').length;
	if (wasting === 'severe') {
		criteria.push('reduced-muscle-mass');
		worsen('severe');
		firedRules.push(rule('R-GLIM-P-MM', 'glim', 'phenotypic', null, 'severe', 'physical examination',
			`Severe muscle wasting on physical examination (${sites} of 3 sites affected).`));
	} else if (wasting === 'mild' || wasting === 'moderate') {
		criteria.push('reduced-muscle-mass');
		worsen('moderate');
		firedRules.push(rule('R-GLIM-P-MM', 'glim', 'phenotypic', null, 'moderate', 'physical examination',
			`${wasting === 'mild' ? 'Mild' : 'Moderate'} muscle wasting on physical examination (${sites} of 3 sites affected).`));
	}

	return { criteria: [...new Set(criteria)], severity, firedRules };
}

/** GLIM etiologic criteria: reduced intake or assimilation, and inflammation. */
export function scoreGlimEtiologic(data: DieticAssessment): {
	criteria: string[];
	firedRules: FiredRule[];
} {
	const criteria: string[] = [];
	const firedRules: FiredRule[] = [];

	const intakePercent = num(data.dietaryRecall.proportionOfUsualIntakePercent);
	const malabsorptive = [
		data.history.conditionCoeliac === 'yes',
		data.history.conditionInflammatoryBowelDisease === 'yes',
		data.gastrointestinal.malabsorptionSigns === 'yes',
		data.medication.parenteralNutrition === 'yes',
		data.history.gastrointestinalSurgery !== '' && data.history.gastrointestinalSurgery !== 'none'
	].some(Boolean);

	if (intakePercent !== null && intakePercent <= 50) {
		criteria.push('reduced-intake');
		firedRules.push(rule('R-GLIM-E-INTAKE', 'glim', 'etiologic', null, '', 'dietary intake',
			`Oral intake is ${intakePercent}% of usual, at or below the GLIM 50% threshold.`));
	} else if (malabsorptive) {
		criteria.push('reduced-assimilation');
		firedRules.push(rule('R-GLIM-E-INTAKE', 'glim', 'etiologic', null, '', 'gastrointestinal',
			'A gastrointestinal condition or surgery is recorded that adversely affects assimilation or absorption.'));
	}

	const crp = num(data.biochemistry.cReactiveProteinMgPerL);
	const inflammatory = [
		data.screening.acutelyIll === 'yes',
		data.history.conditionCancer === 'yes',
		data.history.conditionRespiratoryDisease === 'yes',
		data.history.conditionChronicKidneyDisease === 'yes',
		data.history.conditionLiverDisease === 'yes',
		data.history.recentSurgery === 'yes',
		crp !== null && crp > 10
	].some(Boolean);

	if (inflammatory) {
		criteria.push('inflammation');
		firedRules.push(rule('R-GLIM-E-INFLAM', 'glim', 'etiologic', null, '', 'disease burden',
			crp !== null && crp > 10
				? `Acute or chronic disease burden with C-reactive protein ${crp} mg/L.`
				: 'Acute or chronic disease burden recorded in the medical history.'));
	}

	return { criteria: [...new Set(criteria)], firedRules };
}

/** Full GLIM assessment. */
export function scoreGlim(
	data: DieticAssessment,
	must: MustResult,
	age: number | null
): GlimResult {
	const phenotypic = scoreGlimPhenotypic(data, must, age);
	const etiologic = scoreGlimEtiologic(data);
	const firedRules = [...phenotypic.firedRules, ...etiologic.firedRules];

	const diagnosis: GlimDiagnosis =
		phenotypic.criteria.length > 0 && etiologic.criteria.length > 0
			? phenotypic.severity
			: 'none';

	if (diagnosis !== 'none') {
		firedRules.push(rule('R-GLIM-DX', 'glim', 'diagnosis', null, diagnosis, 'nutrition diagnosis',
			`GLIM ${diagnosis} malnutrition: ${phenotypic.criteria.length} phenotypic and ${etiologic.criteria.length} etiologic criteria met.`));
	}

	return {
		phenotypic: phenotypic.criteria,
		etiologic: etiologic.criteria,
		diagnosis,
		firedRules
	};
}

/** SARC-F sarcopenia case-finding score, 0 to 10. At-risk threshold is 4. */
export function scoreSarcf(data: DieticAssessment): SarcfResult {
	const parts = [
		data.activity.sarcfStrength,
		data.activity.sarcfWalking,
		data.activity.sarcfRisingFromChair,
		data.activity.sarcfClimbingStairs,
		data.activity.sarcfFalls
	].map(num);

	if (parts.every((p) => p === null)) return { score: null, atRisk: false, firedRules: [] };

	const score = parts.reduce<number>((sum, p) => sum + (p ?? 0), 0);
	const atRisk = score >= 4;
	const firedRules = atRisk
		? [rule('R-SARCF-AT-RISK', 'sarcf', 'total', score, 'moderate', 'function',
				`SARC-F score ${score} is at or above the at-risk threshold of 4.`)]
		: [];
	return { score, atRisk, firedRules };
}

/** SCOFF disordered-eating screening score, 0 to 5. Threshold is 2. */
export function scoreScoff(data: DieticAssessment): ScoffResult {
	const answers = [
		data.behavioural.scoffMakeYourselfSick,
		data.behavioural.scoffLostControl,
		data.behavioural.scoffLostOneStone,
		data.behavioural.scoffBelieveYourselfFat,
		data.behavioural.scoffFoodDominates
	];
	if (answers.every((a) => a === '')) return { score: null, positive: false, firedRules: [] };

	const score = answers.filter((a) => a === 'yes').length;
	const positive = score >= 2;
	const firedRules = positive
		? [rule('R-SCOFF-POSITIVE', 'scoff', 'total', score, 'moderate', 'behavioural',
				`SCOFF score ${score} is at or above the threshold of 2 for further eating-disorder assessment.`)]
		: [];
	return { score, positive, firedRules };
}

/** Refeeding-syndrome risk per NICE CG32. */
export function scoreRefeedingRisk(data: DieticAssessment, must: MustResult): RefeedingResult {
	const firedRules: FiredRule[] = [];
	const bmi = must.bmi;
	const pct = must.weightLossPercent;
	const days = num(data.screening.daysOfNegligibleIntake);
	const potassium = num(data.biochemistry.potassiumMmolPerL);
	const magnesium = num(data.biochemistry.magnesiumMmolPerL);
	const phosphate = num(data.biochemistry.phosphateMmolPerL);

	if ((bmi !== null && bmi < 14) || (days !== null && days > 15)) {
		firedRules.push(rule('R-REFEED-HIGHEST', 'refeeding', 'risk', null, 'critical', 'refeeding',
			bmi !== null && bmi < 14
				? `Body mass index ${bmi} kg/m² is below 14.`
				: `Negligible nutritional intake for ${days} days, more than 15.`));
		return { risk: 'highest', firedRules };
	}

	const major: FiredRule[] = [];
	if (bmi !== null && bmi < 16) {
		major.push(rule('R-REFEED-H-BMI', 'refeeding', 'risk', null, 'critical', 'refeeding',
			`Body mass index ${bmi} kg/m² is below 16.`));
	}
	if (pct !== null && pct > 15 && data.anthropometry.weightLossIsIntentional !== 'yes') {
		major.push(rule('R-REFEED-H-WL', 'refeeding', 'risk', null, 'critical', 'refeeding',
			`Unintentional weight loss of ${pct}% exceeds 15% in the last 3 to 6 months.`));
	}
	if (days !== null && days > 10) {
		major.push(rule('R-REFEED-H-INTAKE', 'refeeding', 'risk', null, 'critical', 'refeeding',
			`Little or no nutritional intake for ${days} days, more than 10.`));
	}
	const lowLytes = [
		potassium !== null && potassium < 3.5 ? 'potassium' : null,
		magnesium !== null && magnesium < 0.7 ? 'magnesium' : null,
		phosphate !== null && phosphate < 0.8 ? 'phosphate' : null
	].filter((v): v is string => v !== null);
	if (lowLytes.length > 0) {
		major.push(rule('R-REFEED-H-LYTES', 'refeeding', 'risk', null, 'critical', 'refeeding',
			`Low pre-feeding ${lowLytes.join(', ')}.`));
	}

	if (major.length > 0) {
		firedRules.push(...major);
		return { risk: 'high', firedRules };
	}

	const minor: FiredRule[] = [];
	if (bmi !== null && bmi < 18.5) {
		minor.push(rule('R-REFEED-M-BMI', 'refeeding', 'risk', null, 'high', 'refeeding',
			`Body mass index ${bmi} kg/m² is below 18.5.`));
	}
	if (pct !== null && pct > 10 && data.anthropometry.weightLossIsIntentional !== 'yes') {
		minor.push(rule('R-REFEED-M-WL', 'refeeding', 'risk', null, 'high', 'refeeding',
			`Unintentional weight loss of ${pct}% exceeds 10% in the last 3 to 6 months.`));
	}
	if (days !== null && days > 5) {
		minor.push(rule('R-REFEED-M-INTAKE', 'refeeding', 'risk', null, 'high', 'refeeding',
			`Little or no nutritional intake for ${days} days, more than 5.`));
	}
	const alcohol = num(data.hydration.alcoholUnitsPerWeek);
	if (alcohol !== null && alcohol > 14) {
		minor.push(rule('R-REFEED-M-HISTORY', 'refeeding', 'risk', null, 'high', 'refeeding',
			`Alcohol intake of ${alcohol} units per week, a NICE CG32 refeeding minor criterion.`));
	}

	if (minor.length >= 2) {
		firedRules.push(...minor);
		return { risk: 'high', firedRules };
	}

	return { risk: 'none', firedRules: [] };
}
