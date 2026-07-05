import type {
	NeurodiversityAdjustmentRequest,
	EligibilityBand,
	ImpactBand,
	Flag,
	FlagPriority
} from './types';
import { anyDifficulty, anyAdjustment } from './utils';

/**
 * Detects compliance-and-wellbeing flags independently of the four axes. Flag
 * categories mirror
 * sql/07_create_table_neurodiversity_adjustment_request_grade_flag.sql. Flags
 * are returned sorted high → medium → low priority.
 *
 * The eligibility band and impact band are passed in because the
 * disability-duty and occupational-health flags depend on the graded axes.
 */
export function detectFlags(
	r: NeurodiversityAdjustmentRequest,
	eligibilityBand: EligibilityBand,
	impactBand: ImpactBand
): Flag[] {
	const flags: Flag[] = [];

	// ─── disability-duty-engaged (eligibility likely-covered) ───
	if (eligibilityBand === 'likely-covered') {
		flags.push({
			flagId: 'F-DISABILITY-DUTY-001',
			category: 'disability-duty-engaged',
			priority: 'high',
			description: 'The Equality Act 2010 duty to make reasonable adjustments is likely engaged.',
			suggestedAction:
				'Treat as a formal request; arrange a meeting and respond without unreasonable delay.'
		});
	}

	// ─── burnout-risk ───
	if (r.atRiskOfAbsence) {
		flags.push({
			flagId: 'F-BURNOUT-RISK-001',
			category: 'burnout-risk',
			priority: 'high',
			description: 'Worker at risk of sickness absence or burnout.',
			suggestedAction: 'Prioritise; consider interim adjustments now.'
		});
	} else if (r.currentImpact === 'severe' || r.difficultyBurnoutWellbeing) {
		flags.push({
			flagId: 'F-BURNOUT-RISK-001',
			category: 'burnout-risk',
			priority: 'medium',
			description: 'Fatigue / burnout or severe impact reported.',
			suggestedAction: 'Monitor wellbeing; consider adjustments promptly.'
		});
	}

	// ─── no-consent-to-share ───
	if (r.disclosureConsent === false) {
		flags.push({
			flagId: 'F-NO-CONSENT-001',
			category: 'no-consent-to-share',
			priority: 'medium',
			description: 'Worker has not consented to share details with HR / occupational health.',
			suggestedAction: 'Handle sensitively; seek explicit consent before sharing.'
		});
	}

	// ─── missing-adjustments ───
	if (!anyAdjustment(r) && r.adjustmentsRequestedDetail.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-ADJUSTMENTS-001',
			category: 'missing-adjustments',
			priority: 'medium',
			description: 'No specific adjustments requested.',
			suggestedAction: 'Ask the worker what adjustments would help, or explore options together.'
		});
	}

	// ─── missing-difficulties ───
	if (!anyDifficulty(r)) {
		flags.push({
			flagId: 'F-MISSING-DIFFICULTIES-001',
			category: 'missing-difficulties',
			priority: 'medium',
			description: 'No functional difficulties identified.',
			suggestedAction: 'Clarify the tasks and situations where the worker is disadvantaged.'
		});
	}

	// ─── access-to-work-recommended ───
	if (r.adjustmentEquipmentTechnology && !r.accessToWorkInvolved) {
		flags.push({
			flagId: 'F-ACCESS-TO-WORK-001',
			category: 'access-to-work-recommended',
			priority: 'low',
			description: 'Equipment / technology adjustment requested without Access to Work involvement.',
			suggestedAction: 'Signpost the government Access to Work scheme for funding and assessment.'
		});
	}

	// ─── occupational-health-recommended ───
	if (impactBand === 'high-risk' && !r.occupationalHealthInvolved) {
		flags.push({
			flagId: 'F-OCC-HEALTH-001',
			category: 'occupational-health-recommended',
			priority: 'medium',
			description: 'High wellbeing risk without occupational-health input.',
			suggestedAction:
				'Consider an occupational-health referral to identify and confirm adjustments.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
