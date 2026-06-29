import type { BronchoscopyRequest, Flag, FlagPriority } from './types';

/** Optional engine context passed to flag detection. */
export interface FlagContext {
	twoWeekWaitEligible?: boolean;
}

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror the sql grade_flag CHECK constraint:
 * suspected-cancer-2ww, massive-haemoptysis-emergency,
 * high-bleeding-risk-anticoag, hypoxia, asa-iv, missing-indication,
 * missing-clinical-question, other.
 *
 * Flag IDs are stable and identical across every front-end and the back-end.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(d: BronchoscopyRequest, context: FlagContext = {}): Flag[] {
	const flags: Flag[] = [];

	// --- Massive haemoptysis emergency ---------------------------------
	if (d.symptoms.symptomHaemoptysis === true && d.symptoms.haemoptysisSeverity === 'massive') {
		flags.push({
			flagId: 'F-MASSIVE-HAEMOPTYSIS-EMERGENCY-001',
			category: 'massive-haemoptysis-emergency',
			priority: 'high',
			description: 'Massive haemoptysis reported — life-threatening airway emergency.',
			suggestedAction:
				'Immediate emergency assessment with airway protection; do not delay for routine booking.'
		});
	}

	// --- Suspected cancer two-week-wait --------------------------------
	if (
		d.request.primaryIndication === 'suspected-lung-cancer' ||
		d.request.primaryIndication === 'lung-mass-on-imaging' ||
		context.twoWeekWaitEligible === true
	) {
		flags.push({
			flagId: 'F-SUSPECTED-CANCER-2WW-001',
			category: 'suspected-cancer-2ww',
			priority: 'high',
			description: 'Request meets NICE NG12 suspected-cancer criteria.',
			suggestedAction: 'Expedite onto the two-week-wait lung-cancer pathway.'
		});
	}

	// --- High bleeding risk (anticoagulation) --------------------------
	if (d.bleeding.takingAnticoagulant === true) {
		const agent = d.bleeding.anticoagulantAgent ? ` (${d.bleeding.anticoagulantAgent})` : '';
		flags.push({
			flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
			category: 'high-bleeding-risk-anticoag',
			priority: 'high',
			description: `Patient is taking an anticoagulant${agent} — high bleeding risk for biopsy.`,
			suggestedAction:
				'Confirm anticoagulant omission / bridging plan before any endobronchial biopsy.'
		});
	}
	if (
		d.bleeding.plateletCount !== null &&
		d.bleeding.plateletCount !== undefined &&
		d.bleeding.plateletCount < 50
	) {
		flags.push({
			flagId: 'F-HIGH-BLEEDING-RISK-PLATELETS-001',
			category: 'high-bleeding-risk-anticoag',
			priority: 'high',
			description: `Platelet count is low (${d.bleeding.plateletCount} x10^9/L) — high bleeding risk.`,
			suggestedAction: 'Correct thrombocytopenia or avoid biopsy until platelets are adequate.'
		});
	}

	// --- Hypoxia -------------------------------------------------------
	if (d.procedural.oxygenDependent === true) {
		flags.push({
			flagId: 'F-HYPOXIA-001',
			category: 'hypoxia',
			priority: 'high',
			description: 'Patient is oxygen-dependent (hypoxia).',
			suggestedAction:
				'Plan oxygenation / ventilation strategy; consider anaesthetic support and a higher-care setting.'
		});
	}

	// --- ASA IV --------------------------------------------------------
	if (d.procedural.asaGrade === 'IV' || d.procedural.asaGrade === 'V') {
		flags.push({
			flagId: 'F-ASA-IV-001',
			category: 'asa-iv',
			priority: 'medium',
			description: `ASA grade ${d.procedural.asaGrade} — severe systemic disease / high procedural risk.`,
			suggestedAction:
				'Anaesthetic / critical-care review before the procedure; weigh risk against benefit.'
		});
	}

	// --- Completeness / data-quality flags -----------------------------
	if (!d.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (!d.request.clinicalQuestion || d.request.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'medium',
			description: 'No specific clinical question recorded.',
			suggestedAction:
				'Query the referrer for the specific question the procedure should answer.'
		});
	}

	// --- Other ---------------------------------------------------------
	if (!d.symptoms.imagingFindings || d.symptoms.imagingFindings.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-IMAGING-001',
			category: 'other',
			priority: 'low',
			description: 'No supporting imaging findings recorded.',
			suggestedAction: 'Confirm recent chest imaging (x-ray / CT) is available before the procedure.'
		});
	}

	// Sort: high > medium > low (stable).
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
