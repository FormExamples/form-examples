// Composite grader for the Hernia Diagnostic Evaluation.
//
// Composes the classification, reducibility, and red-flag rules, and the
// safety flags, into a single pure, deterministic grading result. The public
// entry point is `calculateHerniaEvaluation(data)`. The output shape and the
// rule / flag IDs are identical across every front-end and the back-end.
//
// Algorithm: red-flag-first. Any positive red flag from step 8 forces the
// urgency band to `emergency`; this cannot be diluted by an otherwise
// reassuring examination, mirroring how `perioperative-optimization`'s
// `insufficient-time` domain forces `defer-surgery`.

import {
	assessReducibility,
	classifyHernia,
	computeUrgency,
	screenRedFlags
} from './classification-rules';
import { detectFlags } from './flagged-issues';
import type { FiredRule, GradingResult, HerniaDiagnosticEvaluation, ManagementPlan, UrgencyBand } from './types';
import { ageInYears } from './utils';

export const URGENCY_ORDER: UrgencyBand[] = ['routine', 'soon', 'urgent', 'emergency'];

/**
 * Derive the overall recommendation from the urgency band, following the
 * management-plan options offered on step 13.
 */
export function deriveRecommendation(urgency: UrgencyBand): ManagementPlan {
	switch (urgency) {
		case 'emergency':
			return 'emergency-referral';
		case 'urgent':
			return 'urgent-referral';
		case 'soon':
			return 'elective-repair-referral';
		case 'routine':
			return 'watchful-waiting';
		default:
			return '';
	}
}

/**
 * Public entry point. Pure and deterministic: no I/O, no clock. The caller
 * supplies the assessment date via `data.clinician.assessmentDate`, so age is
 * computed from recorded data rather than from `Date.now()`.
 */
export function calculateHerniaEvaluation(data: HerniaDiagnosticEvaluation): GradingResult {
	const firedRules: FiredRule[] = [];

	const age = ageInYears(data.patient.birthDate, data.clinician.assessmentDate);

	// --- Classification (step 9) ---------------------------------------------
	const classification = classifyHernia(data);
	firedRules.push(...classification.firedRules);

	// --- Reducibility (step 7) -------------------------------------------------
	const reducibility = assessReducibility(data);
	firedRules.push(...reducibility.firedRules);

	// --- Red-flag screen (step 8) -----------------------------------------------
	const redFlag = screenRedFlags(data);
	firedRules.push(...redFlag.firedRules);

	// --- Urgency band (red-flag-first) ------------------------------------------
	const urgencyResult = computeUrgency(data, reducibility, redFlag);
	firedRules.push(...urgencyResult.firedRules);
	const computedUrgency = urgencyResult.urgency;

	// --- Clinician override ------------------------------------------------------
	// The override changes the urgency band only. Safety flags are computed
	// independently below and are always reported.
	const override = data.summary.overrideUrgency;
	const finalUrgency: UrgencyBand =
		override && URGENCY_ORDER.includes(override) ? override : computedUrgency;
	const overrideReason = finalUrgency !== computedUrgency ? data.summary.overrideReason : '';

	const flags = detectFlags(data, { reducibility, redFlag, age });

	return {
		herniaType: classification.herniaType,
		herniaSubtype: classification.herniaSubtype,
		ehsClassification: classification.ehsClassification,
		ehsSizeGrade: classification.ehsSizeGrade,
		reducibilityStatus: reducibility.status,
		anyRedFlag: redFlag.anyRedFlag,
		computedUrgency,
		finalUrgency,
		overrideReason,
		recommendation: deriveRecommendation(finalUrgency),
		firedRules,
		flags
	};
}

/** Display labels for the urgency bands. */
export const URGENCY_LABELS: Record<UrgencyBand, string> = {
	routine: 'Routine',
	soon: 'Soon (elective referral)',
	urgent: 'Urgent',
	emergency: 'Emergency',
	'': 'Not yet computed'
};

/** Display labels for the overall recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	'watchful-waiting': 'Watchful waiting',
	'elective-repair-referral': 'Elective repair referral',
	'urgent-referral': 'Urgent referral',
	'emergency-referral': 'Emergency referral',
	conservative: 'Conservative management'
};
