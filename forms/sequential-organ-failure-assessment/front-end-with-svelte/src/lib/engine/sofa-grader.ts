import type {
	AssessmentData,
	FiredRule,
	GradingResult,
	MortalityBand,
	SubScores
} from './types';
import { SYSTEMS, systemScorers } from './sofa-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Band the total SOFA score into a mortality-risk band (spec §4):
 * 0-6 low, 7-9 moderate, 10-12 high, 13-14 veryHigh, 15-24 extreme.
 */
export function deriveMortalityBand(total: number): MortalityBand {
	if (total >= 15) return 'extreme';
	if (total >= 13) return 'veryHigh';
	if (total >= 10) return 'high';
	if (total >= 7) return 'moderate';
	return 'low';
}

/**
 * Pure function: compute the full SOFA grade for the supplied assessment data.
 *
 * Algorithm (spec §4):
 *   subScores[system] = systemScorers[system](data).score   // 0..4 or null
 *   totalSofa   = sum of non-null sub-scores (0..24)
 *   complete    = every sub-score non-null
 *   deltaSofa   = totalSofa - baselineSofaTotal, or null when no baseline
 *   mortalityBand = 0-6 low, 7-9 moderate, 10-12 high, 13-14 veryHigh, 15+ extreme
 *   sepsis3     = suspectedInfection === 'yes' AND deltaSofa != null AND deltaSofa >= 2
 *
 * A missing input yields a null sub-score for that system, contributes 0 to the
 * total, and marks the assessment incomplete; `flagged-issues.ts` raises the
 * completeness flag separately. The engine never guesses.
 */
export function calculateSofaGrade(data: AssessmentData): GradingResult {
	const subScores: SubScores = {
		respiration: null,
		coagulation: null,
		liver: null,
		cardiovascular: null,
		cns: null,
		renal: null
	};
	const firedRules: FiredRule[] = [];

	let totalSofa = 0;
	let complete = true;

	for (const system of SYSTEMS) {
		let result;
		try {
			result = systemScorers[system](data);
		} catch (e) {
			console.warn(`SOFA scorer ${system} failed:`, e);
			result = {
				score: null,
				ruleId: `R-${system.toUpperCase()}-ERR`,
				category: 'threshold-band',
				description: 'Scorer error.'
			} as const;
		}
		subScores[system] = result.score;
		if (result.score === null) {
			complete = false;
		} else {
			totalSofa += result.score;
		}
		firedRules.push({
			id: result.ruleId,
			parameter: system,
			points: result.score,
			category: result.category,
			description: result.description
		});
	}

	const baseline = data.baseline.baselineSofaTotal;
	const hasBaseline = baseline !== null && baseline !== undefined && !Number.isNaN(baseline);
	const deltaSofa = hasBaseline ? totalSofa - baseline : null;

	const mortalityBand = deriveMortalityBand(totalSofa);

	const sepsis3 =
		data.baseline.suspectedInfection === 'yes' && deltaSofa !== null && deltaSofa >= 2;

	// Derivation audit rows, mirroring the grade_rule table's parameter enum.
	firedRules.push({
		id: 'R-TOTAL-01',
		parameter: 'total',
		points: null,
		category: 'total-score',
		description: `Total SOFA ${totalSofa} of 24${complete ? '' : ' (incomplete — one or more systems not scored)'}.`
	});
	if (deltaSofa !== null) {
		firedRules.push({
			id: 'R-DELTA-01',
			parameter: 'delta',
			points: null,
			category: 'delta-sofa',
			description: `Delta-SOFA ${deltaSofa >= 0 ? '+' : ''}${deltaSofa} versus baseline ${baseline}.`
		});
	}
	firedRules.push({
		id: 'R-BAND-01',
		parameter: 'band',
		points: null,
		category: 'mortality-band',
		description: `Total ${totalSofa} — ${mortalityBand} mortality-risk band.`
	});
	if (sepsis3) {
		firedRules.push({
			id: 'R-SEPSIS-01',
			parameter: 'sepsis',
			points: null,
			category: 'sepsis-criterion',
			description: 'Suspected infection with delta-SOFA >= 2 — meets the Sepsis-3 criterion.'
		});
	}

	const flaggedIssues = detectFlaggedIssues(data, { subScores, totalSofa, deltaSofa });

	return {
		subScores,
		totalSofa,
		complete,
		deltaSofa,
		mortalityBand,
		sepsis3,
		firedRules,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
