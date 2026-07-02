import type { AssessmentData, Classification, FiredRule, GradingResult } from './types';
import { camRules } from './cam-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Whether the CAM-ICU arousal gate blocks assessment: variant is CAM-ICU and
 * the RASS score is -4 or -5 (unrousable).
 */
export function isUnableToAssess(data: AssessmentData): boolean {
	return (
		data.context.camVariant === 'cam-icu' &&
		data.feature4.rassScore !== null &&
		(data.feature4.rassScore === -4 || data.feature4.rassScore === -5)
	);
}

/**
 * Evaluate the four CAM feature rules, returning a positive map keyed by
 * feature number plus an audit trail of fired rules.
 */
export function evaluateFeatures(data: AssessmentData): {
	positives: Record<number, boolean>;
	firedRules: FiredRule[];
} {
	const positives: Record<number, boolean> = {};
	const firedRules: FiredRule[] = [];
	for (const rule of camRules) {
		let positive = false;
		try {
			positive = rule.evaluate(data) === true;
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`CAM rule ${rule.id} evaluation failed:`, e);
		}
		positives[rule.featureNumber] = positive;
		firedRules.push({
			id: rule.id,
			feature: rule.feature,
			positive,
			category: rule.category,
			description: `${rule.description} — ${positive ? 'POSITIVE' : 'negative'}`
		});
	}
	return { positives, firedRules };
}

/**
 * Pure function: compute the full CAM classification for the supplied
 * assessment data. This is a status / classification form — there is NO
 * numeric total, no cut-off, and no band table.
 *
 * Diagnostic algorithm (spec §4):
 *   deliriumPresent = feature1 AND feature2 AND (feature3 OR feature4)
 *   classification  = deliriumPresent ? 'present' : 'absent'
 *
 * Edge case (spec §4): for the CAM-ICU variant, a patient who is unrousable
 * (RASS -4 or -5) cannot be assessed. The algorithm is NOT evaluated and the
 * classification is 'unable-to-assess'; deliriumPresent is null and the
 * positive-feature set is empty.
 */
export function calculateCamGrade(data: AssessmentData): GradingResult {
	const motoricSubtype = data.observations.motoricSubtype;
	const timestamp = new Date().toISOString();

	// ─── Arousal gate (CAM-ICU RASS -4/-5) ──────────────────────────
	if (isUnableToAssess(data)) {
		const classification: Classification = 'unable-to-assess';
		return {
			classification,
			deliriumPresent: null,
			positiveFeatures: [],
			feature1Positive: null,
			feature2Positive: null,
			feature3Positive: null,
			feature4Positive: null,
			motoricSubtype,
			firedRules: [
				{
					id: 'R-AROUSAL-GATE-01',
					feature: 'arousal',
					positive: null,
					category: 'arousal-gate',
					description: `CAM-ICU RASS ${data.feature4.rassScore} (unrousable) — cannot assess; classification unable-to-assess`
				}
			],
			flaggedIssues: detectFlaggedIssues(data, classification),
			timestamp
		};
	}

	// ─── Evaluate the four features ─────────────────────────────────
	const { positives, firedRules } = evaluateFeatures(data);
	const f1 = positives[1];
	const f2 = positives[2];
	const f3 = positives[3];
	const f4 = positives[4];

	// ─── Fixed CAM diagnostic algorithm ─────────────────────────────
	const deliriumPresent = f1 && f2 && (f3 || f4);
	const classification: Classification = deliriumPresent ? 'present' : 'absent';

	const positiveFeatures = [1, 2, 3, 4].filter((n) => positives[n]);

	// Record the algorithm-combiner decision as an audit row, mirroring the
	// grade_rule table's `algorithm` feature.
	firedRules.push({
		id: 'R-ALGORITHM-01',
		feature: 'algorithm',
		positive: null,
		category: 'algorithm-combiner',
		description: deliriumPresent
			? '1 AND 2 AND (3 OR 4) satisfied — delirium present'
			: '1 AND 2 AND (3 OR 4) not satisfied — delirium absent'
	});

	return {
		classification,
		deliriumPresent,
		positiveFeatures,
		feature1Positive: f1,
		feature2Positive: f2,
		feature3Positive: f3,
		feature4Positive: f4,
		motoricSubtype,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, classification),
		timestamp
	};
}
