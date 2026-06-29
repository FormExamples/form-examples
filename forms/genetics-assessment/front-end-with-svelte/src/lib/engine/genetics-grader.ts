// Genetics Assessment grader. Pure functions: take an AssessmentData object,
// compute the Manchester score, count Bethesda criteria met, extract PREMM5 and
// Tyrer-Cuzick external scores, build a grader context, run every rule, and
// resolve the final risk level as the maximum severity of any fired rule.

import type {
	AssessmentData,
	FiredRule,
	GraderContext,
	GradingResult,
	Relative,
	RiskLevel
} from './types';
import { rules } from './rules';
import { detectAdditionalFlags } from './flagged-issues';
import { maxRiskLevel } from './utils';

// Manchester scoring weights (Evans 2004 / Evans & Lalloo). Per-cancer points.
const MAN_WEIGHTS = {
	femaleBreastUnder30: 6,
	femaleBreast30to39: 4,
	femaleBreast40to49: 3,
	maleBreast: 8,
	ovarianUnder60: 8,
	pancreaticUnder60: 1,
	prostateUnder60: 1
};

function nz(n: number | null | undefined): number {
	return n === null || n === undefined || isNaN(n) ? 0 : Number(n);
}

/** Compute the Manchester score for BRCA1/2 from per-cancer counts. */
export function calculateManchesterScore(d: AssessmentData): number {
	const m = d.targetedRiskScoring.manchester;
	let score = 0;
	// Proband contributions
	score += nz(m.probandFemaleBreastUnder30) * MAN_WEIGHTS.femaleBreastUnder30;
	score += nz(m.probandFemaleBreast30to39) * MAN_WEIGHTS.femaleBreast30to39;
	score += nz(m.probandFemaleBreast40to49) * MAN_WEIGHTS.femaleBreast40to49;
	score += nz(m.probandOvarianUnder60) * MAN_WEIGHTS.ovarianUnder60;
	score += nz(m.probandMaleBreast) * MAN_WEIGHTS.maleBreast;
	// Relative contributions
	score += nz(m.relativeFemaleBreastUnder30) * MAN_WEIGHTS.femaleBreastUnder30;
	score += nz(m.relativeFemaleBreast30to39) * MAN_WEIGHTS.femaleBreast30to39;
	score += nz(m.relativeFemaleBreast40to49) * MAN_WEIGHTS.femaleBreast40to49;
	score += nz(m.relativeOvarianUnder60) * MAN_WEIGHTS.ovarianUnder60;
	score += nz(m.relativeMaleBreast) * MAN_WEIGHTS.maleBreast;
	score += nz(m.relativePancreaticUnder60) * MAN_WEIGHTS.pancreaticUnder60;
	score += nz(m.relativeProstateUnder60) * MAN_WEIGHTS.prostateUnder60;
	return score;
}

/** Count how many of the five Revised Bethesda criteria the patient meets. */
export function countBethesdaMet(d: AssessmentData): number {
	const b = d.targetedRiskScoring.bethesda;
	let n = 0;
	if (b.crcUnder50 === 'yes') n++;
	if (b.synchronousMetachronous === 'yes') n++;
	if (b.msiHistology === 'yes') n++;
	if (b.firstDegreeLynchTumour === 'yes') n++;
	if (b.multipleRelativesLynch === 'yes') n++;
	return n;
}

/** Iterate every relative in the pedigree. */
function flattenPedigree(d: AssessmentData): Relative[] {
	const fp = d.familyPedigree;
	const fixed = [
		fp.maternalGrandmother,
		fp.maternalGrandfather,
		fp.paternalGrandmother,
		fp.paternalGrandfather,
		fp.mother,
		fp.father
	];
	return fixed.concat(
		fp.maternalAuntsUncles || [],
		fp.paternalAuntsUncles || [],
		fp.siblings || [],
		fp.children || [],
		fp.maternalCousins || [],
		fp.paternalCousins || []
	);
}

/** Build the context object that rules consume. */
export function buildContext(d: AssessmentData): GraderContext {
	const manchesterScore = calculateManchesterScore(d);
	const bethesdaMet = countBethesdaMet(d);
	const premm5Raw = d.targetedRiskScoring.premm5.externalPREMM5Percent;
	const premm5Score = premm5Raw === null || premm5Raw === undefined ? null : Number(premm5Raw);
	const tcRaw = d.targetedRiskScoring.tyrerCuzick.externalLifetimeRisk;
	const tyrerCuzickLifetime = tcRaw === null || tcRaw === undefined ? 0 : Number(tcRaw);

	const all = flattenPedigree(d);
	let affectedFirstDegree = 0;
	let earlyOnsetUnder50 = 0;
	let paediatricCancers = 0;
	let hasMaleBreast = false;
	let hasOvarian = false;
	let hasPancreatic = false;

	const fp = d.familyPedigree;
	const firstDegree = [fp.mother, fp.father]
		.concat(fp.siblings || [])
		.concat(fp.children || []);

	for (const r of firstDegree) {
		if (r.affectedWithCancer === 'yes' && (r.cancers || []).length > 0) {
			affectedFirstDegree++;
		}
	}

	for (const r of all) {
		for (const c of r.cancers || []) {
			const type = (c.type || '').toLowerCase();
			const age = c.ageAtDiagnosis;
			if (age !== null && age !== undefined && Number.isFinite(Number(age))) {
				if (Number(age) <= 50) earlyOnsetUnder50++;
				if (Number(age) < 18) paediatricCancers++;
			}
			if (type.includes('male breast') || (type.includes('breast') && r.sex === 'male')) {
				hasMaleBreast = true;
			}
			if (type.includes('ovar')) hasOvarian = true;
			if (type.includes('pancrea')) hasPancreatic = true;
		}
	}

	// Proband history
	const probandCancers = d.personalMedicalHistory.cancers || [];
	let hasBilateralBreast = false;
	for (const c of probandCancers) {
		const type = (c.type || '').toLowerCase();
		const age = c.ageAtDiagnosis;
		if (type.includes('breast') && c.bilateral === 'yes') hasBilateralBreast = true;
		if (age !== null && age !== undefined && Number.isFinite(Number(age))) {
			if (Number(age) <= 50) earlyOnsetUnder50++;
			if (Number(age) < 18) paediatricCancers++;
		}
		if (type.includes('ovar')) hasOvarian = true;
		if (type.includes('pancrea')) hasPancreatic = true;
	}
	const hasMultiplePrimaries = d.personalMedicalHistory.multiplePrimaryCancers === 'yes';

	return {
		manchesterScore,
		bethesdaMet,
		premm5Score,
		tyrerCuzickLifetime,
		affectedFirstDegree,
		earlyOnsetUnder50,
		paediatricCancers,
		hasMaleBreast,
		hasOvarian,
		hasPancreatic,
		hasBilateralBreast,
		hasMultiplePrimaries
	};
}

/**
 * Run every rule and return the fired rules, computed scores, additional flags
 * and the final risk level (maximum severity of any fired rule; 'low' if none).
 */
export function gradeGenetics(data: AssessmentData): GradingResult {
	const ctx = buildContext(data);
	const firedRules: FiredRule[] = [];
	let level: RiskLevel = 'low';

	for (const rule of rules) {
		try {
			const severity = rule.evaluate(data, ctx);
			if (severity === 'low' || severity === 'moderate' || severity === 'high') {
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					severity
				});
				level = maxRiskLevel(level, severity);
			}
		} catch (e) {
			console.warn(`Genetics rule ${rule.id} evaluation failed:`, e);
		}
	}

	return {
		riskLevel: level,
		manchesterScore: ctx.manchesterScore,
		bethesdaMet: ctx.bethesdaMet,
		premm5Score: ctx.premm5Score,
		tyrerCuzickLifetime: ctx.tyrerCuzickLifetime,
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}
