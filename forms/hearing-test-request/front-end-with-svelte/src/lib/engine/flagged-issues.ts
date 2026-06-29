// Safety-flag detection for the Hearing Test Request engine.
//
// Ported verbatim (preserving every flag ID) from the HTML front-end's
// `js/flags.js`. Pure function returning safety flags using the grade_flag
// categories: sudden-sensorineural-hearing-loss-urgent,
// unilateral-symptoms-red-flag, ear-discharge, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

import type { HearingRequest, Flag, FlagPriority } from './types';
import { isUnilateral } from './rules';

/**
 * Detect safety flags for a hearing test request. Flags are returned sorted
 * high → medium → low priority.
 */
export function detectFlags(data: HearingRequest): Flag[] {
	const flags: Flag[] = [];

	// --- Red-flag symptom categories -----------------------------------
	if (data.symptoms.suddenOnset === true) {
		const emergency = data.symptoms.onsetWithinDays === 'within-30-days';
		flags.push({
			flagId: 'F-SUDDEN-SNHL-001',
			category: 'sudden-sensorineural-hearing-loss-urgent',
			priority: 'high',
			description: emergency
				? 'Sudden onset of hearing loss within the past 30 days — possible sudden sensorineural hearing loss (otological emergency).'
				: 'Sudden onset of hearing loss reported — possible sudden sensorineural hearing loss.',
			suggestedAction: emergency
				? 'Refer to ENT to be seen within 24 hours; steroid treatment is time-critical (ENT-UK / BAO-HNS).'
				: 'Refer urgently to ENT / audiovestibular medicine to be seen within 2 weeks (NICE QS185).'
		});
	}

	if (
		isUnilateral(data) &&
		(data.symptoms.hearingLoss === true ||
			data.symptoms.tinnitus === true ||
			data.symptoms.vertigo === true)
	) {
		flags.push({
			flagId: 'F-UNILATERAL-001',
			category: 'unilateral-symptoms-red-flag',
			priority: 'high',
			description: 'Unilateral / asymmetric hearing loss, tinnitus, or vertigo reported.',
			suggestedAction:
				'Refer for ENT / audiovestibular diagnostic assessment to exclude retrocochlear pathology (e.g. vestibular schwannoma).'
		});
	}

	if (data.symptoms.earDischarge === true) {
		flags.push({
			flagId: 'F-EAR-DISCHARGE-001',
			category: 'ear-discharge',
			priority: 'medium',
			description: 'Ear discharge (otorrhoea) reported.',
			suggestedAction:
				'Arrange ENT review before / alongside testing; tympanometry and pure-tone audiometry may be deferred until the ear is dry.'
		});
	}

	// --- Completeness / data-quality flags -----------------------------
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
			priority: 'low',
			description: 'No specific clinical question recorded.',
			suggestedAction: 'Query the referrer for the specific question the test should answer.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
