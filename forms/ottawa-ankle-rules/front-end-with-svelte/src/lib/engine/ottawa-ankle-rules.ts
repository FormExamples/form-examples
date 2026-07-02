import type { AssessmentData, OttawaRule } from './types';

/**
 * Derived input shared by criteria A3 and F3. "Unable to bear weight" is true
 * only when the patient cannot take four steps BOTH immediately after the
 * injury AND at the time of assessment. If either answer is 'yes' (able), or
 * either is unanswered, this is false for the purpose of the decision.
 */
export function unableToBearWeight(d: AssessmentData): boolean {
	return (
		d.weightBearing.ableToBearWeightImmediately === 'no' &&
		d.weightBearing.ableToBearWeightNow === 'no'
	);
}

/**
 * Declarative Ottawa Ankle / Foot Rules criteria.
 *
 * This instrument is a boolean DECISION RULE, not a numeric score. Each of the
 * six positive findings below drives one of the two imaging decisions when its
 * region's zone-of-pain precondition is also present. There are three ankle
 * criteria (A1, A2, A3) and three foot criteria (F1, F2, F3); the two
 * "inability to bear weight" criteria (A3, F3) share a single derived input and
 * therefore feed BOTH decisions. Rows mirror the `ottawa_ankle_rules_grade_rule`
 * SQL table (rule_id, region, criterion, description).
 */
export const ottawaRules: OttawaRule[] = [
	// ─── ANKLE CRITERION A1: LATERAL MALLEOLUS ────────────────────
	{
		id: 'A1',
		region: 'ankle',
		criterion: 'lateral-malleolus-tenderness',
		description:
			'Bone tenderness at the posterior edge or tip of the lateral malleolus (distal 6 cm of the fibula)',
		evaluate: (d) => d.ankleTenderness.lateralMalleolusTenderness === 'yes'
	},

	// ─── ANKLE CRITERION A2: MEDIAL MALLEOLUS ─────────────────────
	{
		id: 'A2',
		region: 'ankle',
		criterion: 'medial-malleolus-tenderness',
		description:
			'Bone tenderness at the posterior edge or tip of the medial malleolus (distal 6 cm of the tibia)',
		evaluate: (d) => d.ankleTenderness.medialMalleolusTenderness === 'yes'
	},

	// ─── ANKLE CRITERION A3: UNABLE TO BEAR WEIGHT ────────────────
	{
		id: 'A3',
		region: 'ankle',
		criterion: 'unable-to-bear-weight',
		description:
			'Inability to bear weight — cannot take four steps both immediately after the injury and at assessment',
		evaluate: (d) => unableToBearWeight(d)
	},

	// ─── FOOT CRITERION F1: BASE OF FIFTH METATARSAL ──────────────
	{
		id: 'F1',
		region: 'foot',
		criterion: 'fifth-metatarsal-base-tenderness',
		description: 'Bone tenderness at the base of the fifth metatarsal',
		evaluate: (d) => d.footTenderness.fifthMetatarsalBaseTenderness === 'yes'
	},

	// ─── FOOT CRITERION F2: NAVICULAR ─────────────────────────────
	{
		id: 'F2',
		region: 'foot',
		criterion: 'navicular-tenderness',
		description: 'Bone tenderness at the navicular',
		evaluate: (d) => d.footTenderness.navicularTenderness === 'yes'
	},

	// ─── FOOT CRITERION F3: UNABLE TO BEAR WEIGHT ─────────────────
	{
		id: 'F3',
		region: 'foot',
		criterion: 'unable-to-bear-weight',
		description:
			'Inability to bear weight — cannot take four steps both immediately after the injury and at assessment',
		evaluate: (d) => unableToBearWeight(d)
	}
];
