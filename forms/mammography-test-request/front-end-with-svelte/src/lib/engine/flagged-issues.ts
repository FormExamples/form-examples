// Safety-flag detection for the Mammography Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from the
// SQL migrations: suspected-cancer-2ww, breast-lump, bloody-nipple-discharge,
// age-below-screening, pregnancy-lactating, missing-indication,
// missing-clinical-question, other. Flag IDs are stable and identical across
// every front-end and the back-end.

import type { Flag, FlagPriority, MammographyRequest } from './types';
import { ageInYears } from './utils';

/** Optional engine context passed from the urgency axis. */
export interface FlagContext {
	twoWeekWaitEligible?: boolean;
	twoWeekWaitRationale?: string;
}

/**
 * Detect safety flags for a mammography request. Flags are returned sorted
 * high → medium → low priority.
 */
export function detectFlags(data: MammographyRequest, context: FlagContext = {}): Flag[] {
	const flags: Flag[] = [];

	// ─── suspected-cancer-2ww (NICE NG12) ───
	if (context.twoWeekWaitEligible === true) {
		flags.push({
			flagId: 'F-SUSPECTED-CANCER-2WW-001',
			category: 'suspected-cancer-2ww',
			priority: 'high',
			description:
				context.twoWeekWaitRationale ||
				'Request meets NICE NG12 suspected-cancer two-week-wait criteria.',
			suggestedAction: 'Refer on the two-week-wait suspected-cancer pathway; book within 14 days.'
		});
	}

	// ─── symptom-based flags ───
	if (data.symptoms.symptomLump === true) {
		flags.push({
			flagId: 'F-BREAST-LUMP-001',
			category: 'breast-lump',
			priority: 'high',
			description: 'Breast lump reported.',
			suggestedAction: 'Prioritise diagnostic work-up, usually triple assessment with ultrasound.'
		});
	}
	if (data.symptoms.symptomNippleDischarge === true) {
		flags.push({
			flagId: 'F-BLOODY-NIPPLE-DISCHARGE-001',
			category: 'bloody-nipple-discharge',
			priority: 'high',
			description: 'Nipple discharge reported — exclude bloody / single-duct discharge.',
			suggestedAction:
				'Assess for bloody or single-duct discharge; consider diagnostic mammography and ultrasound.'
		});
	}

	// ─── age-below-screening ───
	const age = ageInYears(data.patient.dateOfBirth);
	if (
		age !== null &&
		age < 40 &&
		(data.request.examType === 'screening' || data.request.primaryIndication === 'routine-screening')
	) {
		flags.push({
			flagId: 'F-AGE-BELOW-SCREENING-001',
			category: 'age-below-screening',
			priority: 'medium',
			description: `Patient aged ${age} is below the usual screening age range for a screening mammogram.`,
			suggestedAction:
				'Confirm indication; consider ultrasound first in younger, denser breasts (IR(ME)R justification).'
		});
	}

	// ─── pregnancy / lactation ───
	if (
		data.history.pregnancyOrLactating === 'pregnant' ||
		data.history.pregnancyOrLactating === 'lactating'
	) {
		flags.push({
			flagId: 'F-PREGNANCY-LACTATING-001',
			category: 'pregnancy-lactating',
			priority: 'medium',
			description: `Patient is ${data.history.pregnancyOrLactating} — radiation justification required.`,
			suggestedAction:
				'Justify ionising-radiation exposure (IR(ME)R 2017); consider ultrasound as first-line.'
		});
	}

	// ─── completeness / data-quality flags ───
	if (!data.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (!data.request.clinicalQuestion || data.request.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'medium',
			description: 'No specific clinical question recorded.',
			suggestedAction:
				'Query the referrer for the specific question the examination should answer.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
