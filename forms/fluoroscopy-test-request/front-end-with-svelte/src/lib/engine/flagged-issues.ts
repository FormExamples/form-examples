import type { FluoroscopyRequest, Flag, FlagPriority, RadiationDoseBand } from './types';
import { isBariumStudy, isIonisingStudy } from './utils';

/**
 * Detect safety flags for a fluoroscopy / contrast-study request, using the
 * grade_flag categories from the SQL schema: pregnancy, contrast-allergy,
 * aspiration-risk, suspected-perforation-contrast-choice, high-radiation-dose,
 * missing-indication, missing-clinical-question, other.
 *
 * Flag IDs are stable and identical across every front-end and the back-end.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(
	data: FluoroscopyRequest,
	context?: { radiationDoseBand?: RadiationDoseBand }
): Flag[] {
	const flags: Flag[] = [];
	const ctx = context || {};
	const studyType = data.request.studyType;
	const indication = data.request.primaryIndication;

	// --- Pregnancy -----------------------------------------------------
	if (
		(data.safety.pregnancyStatus === 'pregnant' || data.safety.pregnancyStatus === 'possible') &&
		isIonisingStudy(studyType)
	) {
		flags.push({
			flagId: 'F-PREGNANCY-001',
			category: 'pregnancy',
			priority: 'high',
			description: 'Pregnant or possibly pregnant with an ionising-radiation study.',
			suggestedAction:
				'Defer to confirm pregnancy status; justify the exposure per IR(ME)R or use a non-ionising alternative.'
		});
	} else if (data.safety.pregnancyStatus === 'unknown' && isIonisingStudy(studyType)) {
		flags.push({
			flagId: 'F-PREGNANCY-002',
			category: 'pregnancy',
			priority: 'medium',
			description: 'Pregnancy status unknown with an ionising-radiation study.',
			suggestedAction:
				'Confirm pregnancy status (LMP / test) before exposure; apply the 28-day / 10-day rule.'
		});
	}

	// --- Contrast allergy ----------------------------------------------
	if (data.safety.contrastAllergy === true) {
		flags.push({
			flagId: 'F-CONTRAST-ALLERGY-001',
			category: 'contrast-allergy',
			priority: 'high',
			description: 'Known contrast-media allergy.',
			suggestedAction:
				'Review allergy history; consider premedication, an alternative agent, or an alternative modality.'
		});
	}

	// --- Aspiration risk -----------------------------------------------
	if (data.safety.aspirationRisk === true) {
		flags.push({
			flagId: 'F-ASPIRATION-RISK-001',
			category: 'aspiration-risk',
			priority: 'medium',
			description: 'Patient at risk of aspiration.',
			suggestedAction:
				'Favour water-soluble (low-osmolar non-ionic) contrast; avoid barium and high-osmolar agents.'
		});
	}

	// --- Suspected perforation contrast choice -------------------------
	if (indication === 'suspected-perforation' && isBariumStudy(studyType)) {
		flags.push({
			flagId: 'F-SUSPECTED-PERFORATION-CONTRAST-CHOICE-001',
			category: 'suspected-perforation-contrast-choice',
			priority: 'high',
			description:
				'Barium study requested when perforation is suspected (barium peritonitis / mediastinitis risk).',
			suggestedAction: 'Redirect to a water-soluble contrast study; do not use barium.'
		});
	}

	// --- High radiation dose -------------------------------------------
	if (ctx.radiationDoseBand === 'high') {
		flags.push({
			flagId: 'F-HIGH-RADIATION-DOSE-001',
			category: 'high-radiation-dose',
			priority: 'medium',
			description: 'Requested study carries a high radiation-dose band.',
			suggestedAction:
				'Confirm justification per IR(ME)R; consider a lower-dose alternative where clinically equivalent.'
		});
	}

	// --- Completeness / data-quality flags -----------------------------
	if (!indication) {
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
			suggestedAction: 'Query the referrer for the specific question the study should answer.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
