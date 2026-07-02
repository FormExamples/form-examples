import type {
	AssessmentData,
	FiredCriterion,
	GradingResult,
	IdeationLevel,
	RiskTier
} from './types';
import { cssrsRules } from './cssrs-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Management recommendation per risk tier (spec §4 tier table).
 */
const MANAGEMENT: Record<RiskTier, string> = {
	high: 'Urgent / immediate psychiatric or crisis response. Do not leave the person alone; ensure safety; remove or restrict access to lethal means; complete a safety plan; arrange emergency mental-health evaluation per local protocol.',
	moderate:
		'Timely mental-health / behavioural evaluation; safety planning; means-restriction counselling; increased monitoring and defined follow-up.',
	low: 'Supportive response; document; discuss with a clinician; provide crisis resources (e.g. helpline); routine follow-up and re-screen on any change.'
};

/**
 * Evaluate every C-SSRS rule and collect the ones that fired.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	for (const rule of cssrsRules) {
		try {
			if (rule.evaluate(data)) {
				fired.push({
					id: rule.id,
					criterion: rule.criterion,
					level: rule.level,
					category: rule.category,
					description: rule.description
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`C-SSRS rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the full C-SSRS classification for the supplied
 * assessment data. This is a status- and severity-classification form — there
 * is NO numeric total, no cut-off, and no band table.
 *
 * Classification algorithm (spec §4):
 *   ideationLevel = highest N in 1..5 whose ideation item == 'yes', else 0
 *
 *   suicidalBehaviourPresent =
 *       actualAttempt == 'yes' || interruptedAttempt == 'yes'
 *    || abortedAttempt == 'yes' || preparatoryActs == 'yes'
 *   (non-suicidal self-injury does NOT count towards this)
 *
 *   recentBehaviour = suicidalBehaviourPresent && behaviourRecency == 'within-3-months'
 *   highLethality   = (actualLethality != null && actualLethality >= 3)
 *                  || (potentialLethality != null && potentialLethality == 2)
 *
 *   riskTier =
 *       HIGH      if ideationLevel >= 4 || recentBehaviour || highLethality
 *       MODERATE  else if ideationLevel == 3 || suicidalBehaviourPresent
 *       LOW       otherwise    // ideationLevel 1-2 with no behaviour, or none
 */
export function calculateCssrsGrade(data: AssessmentData): GradingResult {
	const timestamp = new Date().toISOString();
	const firedCriteria = evaluateCriteria(data);

	// Highest affirmative ideation item sets the ordinal level (0-5).
	let ideationLevel: IdeationLevel = 0;
	for (const f of firedCriteria) {
		if (f.criterion === 'ideation' && f.level > ideationLevel) {
			ideationLevel = f.level as IdeationLevel;
		}
	}

	const b = data.behaviour;
	const suicidalBehaviourPresent =
		b.actualAttempt === 'yes' ||
		b.interruptedAttempt === 'yes' ||
		b.abortedAttempt === 'yes' ||
		b.preparatoryActs === 'yes';

	const recentBehaviour =
		suicidalBehaviourPresent && b.behaviourRecency === 'within-3-months';

	const al = data.lethality.actualLethality;
	const pl = data.lethality.potentialLethality;
	const highLethality = (al !== null && al >= 3) || (pl !== null && pl === 2);

	let riskTier: RiskTier;
	if (ideationLevel >= 4 || recentBehaviour || highLethality) {
		riskTier = 'high';
	} else if (ideationLevel === 3 || suicidalBehaviourPresent) {
		riskTier = 'moderate';
	} else {
		riskTier = 'low';
	}

	// Record the derived tier decision as a `tier` audit row, mirroring the
	// grade_rule table's `tier` criterion.
	firedCriteria.push({
		id: 'R-TIER-01',
		criterion: 'tier',
		level: 0,
		category: 'risk-tier',
		description:
			riskTier === 'high'
				? `High risk tier — ideation level ${ideationLevel}${recentBehaviour ? ', recent suicidal behaviour' : ''}${highLethality ? ', high-lethality attempt' : ''}`
				: riskTier === 'moderate'
					? `Moderate risk tier — ideation level ${ideationLevel}${suicidalBehaviourPresent ? ', non-recent suicidal behaviour' : ''}`
					: `Low risk tier — ideation level ${ideationLevel} with no suicidal behaviour`
	});

	const flaggedIssues = detectFlaggedIssues(data, {
		ideationLevel,
		suicidalBehaviourPresent,
		recentBehaviour,
		highLethality,
		riskTier
	});

	return {
		ideationLevel,
		suicidalBehaviourPresent,
		recentBehaviour,
		highLethality,
		riskTier,
		managementRecommendation: MANAGEMENT[riskTier],
		firedCriteria,
		flaggedIssues,
		timestamp
	};
}
