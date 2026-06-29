// ──────────────────────────────────────────────
// Safety-flag detection for the CT Scan Test Request engine.
//
// Pure function returning safety-critical flags using the grade_flag categories
// from the SQL migrations: pregnancy, contrast-allergy, renal-impairment,
// metformin-contrast, high-radiation-dose, unjustified-exposure,
// missing-indication, missing-clinical-question, missing-egfr, and other.
// Flag IDs are stable and identical across every front-end and the back-end.
// Ported verbatim from the source-of-truth HTML engine; flags are returned
// sorted high → medium → low priority.
// ──────────────────────────────────────────────

import type { ContrastSafetyBand, CtScanRequest, DoseBand, Flag, FlagPriority } from './types';
import { usesIvContrast } from './utils';

/** Optional engine context derived by the grader before flag detection. */
export interface FlagContext {
	estimatedDoseBand?: DoseBand;
	contrastSafetyBand?: ContrastSafetyBand;
	renalRisk?: boolean;
}

/** Detect safety flags for a CT scan request. */
export function detectFlags(data: CtScanRequest, context: FlagContext = {}): Flag[] {
	const flags: Flag[] = [];
	const iv = usesIvContrast(data.contrast.contrastRequired);

	// --- Pregnancy with planned exposure ---
	if (data.radiation.pregnancyStatus === 'pregnant' || data.radiation.pregnancyStatus === 'possible') {
		flags.push({
			flagId: 'F-PREGNANCY-001',
			category: 'pregnancy',
			priority: 'high',
			description:
				data.radiation.pregnancyStatus === 'pregnant'
					? 'Patient is pregnant; CT delivers ionising radiation.'
					: 'Pregnancy is possible; confirm status before ionising-radiation exposure.',
			suggestedAction:
				'Justify under IR(ME)R; consider non-ionising alternatives (MRI / ultrasound) and discuss with a radiologist.'
		});
	}

	// --- Contrast allergy / prior severe reaction ---
	if (iv && (data.contrast.iodineContrastAllergy === true || data.contrast.previousContrastReaction === 'severe')) {
		flags.push({
			flagId: 'F-CONTRAST-ALLERGY-001',
			category: 'contrast-allergy',
			priority: 'high',
			description:
				'Known iodinated-contrast allergy or previous severe reaction with IV contrast requested.',
			suggestedAction:
				'Avoid IV iodinated contrast or arrange premedication and a non-contrast / alternative protocol with the radiologist.'
		});
	} else if (iv && data.contrast.previousContrastReaction === 'moderate') {
		flags.push({
			flagId: 'F-CONTRAST-ALLERGY-002',
			category: 'contrast-allergy',
			priority: 'medium',
			description: 'Previous moderate iodinated-contrast reaction with IV contrast requested.',
			suggestedAction:
				'Consider premedication and ensure resuscitation facilities; confirm necessity of contrast.'
		});
	}

	// --- Renal impairment / low eGFR with IV contrast ---
	if (iv && context.renalRisk === true) {
		flags.push({
			flagId: 'F-RENAL-IMPAIRMENT-001',
			category: 'renal-impairment',
			priority: 'high',
			description: 'Reduced renal function (low eGFR) with IV iodinated contrast requested.',
			suggestedAction:
				'Assess contrast-induced nephropathy risk; hydrate and consider a non-contrast or alternative study.'
		});
	} else if (iv && data.contrast.renalImpairment === true) {
		flags.push({
			flagId: 'F-RENAL-IMPAIRMENT-002',
			category: 'renal-impairment',
			priority: 'medium',
			description: 'Known renal impairment with IV iodinated contrast requested.',
			suggestedAction:
				'Obtain a current eGFR and review contrast nephropathy risk before administration.'
		});
	}

	// --- IV contrast with no eGFR ---
	if (iv && (data.contrast.egfr === null || data.contrast.egfr === undefined)) {
		flags.push({
			flagId: 'F-MISSING-EGFR-001',
			category: 'missing-egfr',
			priority: 'medium',
			description: 'IV iodinated contrast requested but no eGFR recorded.',
			suggestedAction: 'Obtain a current eGFR before contrast administration.'
		});
	}

	// --- Metformin + reduced renal function ---
	if (iv && data.contrast.metformin === true && context.renalRisk === true) {
		flags.push({
			flagId: 'F-METFORMIN-CONTRAST-001',
			category: 'metformin-contrast',
			priority: 'medium',
			description: 'Patient on metformin with reduced eGFR and IV iodinated contrast requested.',
			suggestedAction:
				'Withhold metformin around contrast administration per ESUR guidance and recheck renal function.'
		});
	}

	// --- High radiation dose ---
	if (context.estimatedDoseBand === 'high') {
		flags.push({
			flagId: 'F-HIGH-RADIATION-DOSE-001',
			category: 'high-radiation-dose',
			priority: 'medium',
			description: 'Requested study carries a high estimated effective radiation dose.',
			suggestedAction:
				'Confirm the study is justified and optimised (ALARP); consider a more targeted protocol.'
		});
	}

	// --- Unjustified exposure ---
	if (!data.radiation.irMeRJustification || data.radiation.irMeRJustification.trim() === '') {
		flags.push({
			flagId: 'F-UNJUSTIFIED-EXPOSURE-001',
			category: 'unjustified-exposure',
			priority: 'medium',
			description: 'No IR(ME)R justification recorded for this ionising-radiation exposure.',
			suggestedAction:
				'Record the clinical justification; every medical exposure must be justified under IR(ME)R 2017.'
		});
	}

	// --- Completeness / data-quality flags ---
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
			suggestedAction: 'Query the referrer for the specific question the scan should answer.'
		});
	}

	// Sort: high > medium > low (stable for equal priorities).
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
