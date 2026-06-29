import type {
	AssessmentData,
	FiredRule,
	GradingResult,
	CombinedSeverity,
	SpaqBand,
	Phq9Band
} from './types';
import { spaqItems, phq9Items, classifySpaq, classifyPhq9 } from './sad-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure SAD grader. Computes the SPAQ Global Seasonality Score (0-24) and band,
 * the PHQ-9 depression score (0-27) and band, and the combined severity.
 *
 * Combined severity rules (first match wins):
 *   1. critical — active suicidal ideation/intent, self-harm or previous
 *                 attempt, PHQ-9 item 9 >= 1, or PHQ-9 total >= 20.
 *   2. severe   — PHQ-9 band severe, or SAD likely with PHQ-9 moderately-severe.
 *   3. moderate — SAD likely, or PHQ-9 band moderate / moderately-severe.
 *   4. mild     — SPAQ subsyndromal, or PHQ-9 band mild.
 *   5. no-sad   — otherwise.
 */
export function calculateSadGrade(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];

	// ─── SPAQ Global Seasonality Score ───────────────────────
	let spaqScore = 0;
	for (const item of spaqItems) {
		const sub = data[item.section] as unknown as
			| Record<string, Record<string, number | null>>
			| undefined;
		const v = sub && sub[item.subsection] ? sub[item.subsection][item.field] : null;
		if (typeof v === 'number' && Number.isFinite(v)) {
			spaqScore += v;
			firedRules.push({
				id: item.id,
				category: `SPAQ • ${item.category}`,
				description: item.label,
				score: v
			});
		}
	}
	const spaqBand: SpaqBand = classifySpaq(spaqScore);

	// ─── PHQ-9 ───────────────────────────────────────────────
	let phq9Score = 0;
	const phq9 = data.currentMood?.phq9 ?? ({} as AssessmentData['currentMood']['phq9']);
	for (const item of phq9Items) {
		const v = phq9[item.field];
		if (typeof v === 'number' && Number.isFinite(v)) {
			phq9Score += v;
			firedRules.push({
				id: item.id,
				category: `PHQ-9 • ${item.category}`,
				description: item.label,
				score: v
			});
		}
	}
	const phq9Band: Phq9Band = classifyPhq9(phq9Score);

	// ─── Combined severity ───────────────────────────────────
	const risk = data.riskAssessment;
	const phq9Q9 = typeof phq9.q9 === 'number' ? phq9.q9 : 0;

	let combinedSeverity: CombinedSeverity;
	if (
		risk.suicidalIdeation === 'yes' ||
		risk.suicidalIntent === 'yes' ||
		risk.selfHarm === 'yes' ||
		risk.previousAttempt === 'yes' ||
		phq9Q9 >= 1 ||
		phq9Score >= 20
	) {
		combinedSeverity = 'critical';
	} else if (
		phq9Band === 'severe' ||
		(spaqBand === 'sad-likely' && phq9Band === 'moderately-severe')
	) {
		combinedSeverity = 'severe';
	} else if (
		spaqBand === 'sad-likely' ||
		phq9Band === 'moderate' ||
		phq9Band === 'moderately-severe'
	) {
		combinedSeverity = 'moderate';
	} else if (spaqBand === 'subsyndromal' || phq9Band === 'mild') {
		combinedSeverity = 'mild';
	} else {
		combinedSeverity = 'no-sad';
	}

	const additionalFlags = detectAdditionalFlags(data, {
		phq9Score,
		spaqBand,
		combinedSeverity
	});

	return {
		spaqScore,
		spaqBand,
		phq9Score,
		phq9Band,
		combinedSeverity,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
