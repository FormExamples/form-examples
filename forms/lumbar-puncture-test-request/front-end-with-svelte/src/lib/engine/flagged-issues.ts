// Safety-flag detection for the Lumbar Puncture Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories:
// suspected-raised-icp-needs-imaging, suspected-meningitis-emergency,
// coagulopathy, high-bleeding-risk-anticoag, thrombocytopenia, local-infection,
// missing-indication, missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

import type { LumbarPunctureRequest, Flag } from './types';

function hasNumber(v: number | null | undefined): v is number {
	return v !== null && v !== undefined && !Number.isNaN(Number(v));
}

/** Detect safety flags for a lumbar puncture request. Pure and deterministic. */
export function detectFlags(data: LumbarPunctureRequest): Flag[] {
	const flags: Flag[] = [];

	const raisedIcp =
		data.neuroSafety.suspectedRaisedIntracranialPressure === true ||
		data.neuroSafety.focalNeurologicalSigns === true ||
		data.neuroSafety.reducedConsciousness === true;

	// --- Raised intracranial pressure -----------------------------------
	if (
		raisedIcp &&
		(data.neuroSafety.ctHeadStatus === '' ||
			data.neuroSafety.ctHeadStatus === 'awaited' ||
			data.neuroSafety.ctHeadStatus === 'done-abnormal')
	) {
		flags.push({
			flagId: 'F-RAISED-ICP-NEEDS-IMAGING-001',
			category: 'suspected-raised-icp-needs-imaging',
			priority: 'high',
			description: 'Suspected raised intracranial pressure without a reassuring CT head.',
			suggestedAction:
				'Obtain CT head and stabilise before LP; LP risks cerebral herniation if ICP is raised.'
		});
	}

	// --- Suspected meningitis (time-critical) ---------------------------
	if (data.procedure.primaryIndication === 'suspected-meningitis') {
		flags.push({
			flagId: 'F-SUSPECTED-MENINGITIS-EMERGENCY-001',
			category: 'suspected-meningitis-emergency',
			priority: 'high',
			description: 'Suspected bacterial meningitis — time-critical.',
			suggestedAction:
				'Do not delay antibiotics for LP; give empirical treatment and arrange emergency LP per NICE NG240.'
		});
	}

	// --- Bleeding / coagulation -----------------------------------------
	if (data.bleeding.takingAnticoagulant === true) {
		flags.push({
			flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
			category: 'high-bleeding-risk-anticoag',
			priority: 'high',
			description:
				'Patient is taking an anticoagulant' +
				(data.bleeding.anticoagulantAgent ? ` (${data.bleeding.anticoagulantAgent})` : '') +
				'.',
			suggestedAction:
				'Hold / reverse anticoagulation and discuss timing with haematology before LP.'
		});
	}
	if (data.bleeding.takingAntiplatelet === true) {
		flags.push({
			flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-002',
			category: 'high-bleeding-risk-anticoag',
			priority: 'medium',
			description:
				'Patient is taking an antiplatelet agent' +
				(data.bleeding.antiplateletAgent ? ` (${data.bleeding.antiplateletAgent})` : '') +
				'.',
			suggestedAction:
				'Assess bleeding risk; consider holding the antiplatelet per local policy before LP.'
		});
	}
	if (
		data.bleeding.bleedingDisorder === true ||
		(hasNumber(data.bleeding.inr) && Number(data.bleeding.inr) > 1.5)
	) {
		flags.push({
			flagId: 'F-COAGULOPATHY-001',
			category: 'coagulopathy',
			priority: 'high',
			description: 'Coagulopathy present (bleeding disorder or INR > 1.5).',
			suggestedAction:
				'Correct coagulopathy (target INR ≤ 1.5) and discuss with haematology before LP.'
		});
	}
	if (hasNumber(data.bleeding.plateletCount) && Number(data.bleeding.plateletCount) < 50) {
		const veryLow = Number(data.bleeding.plateletCount) < 40;
		flags.push({
			flagId: 'F-THROMBOCYTOPENIA-001',
			category: 'thrombocytopenia',
			priority: veryLow ? 'high' : 'medium',
			description: `Platelet count ${Number(data.bleeding.plateletCount)} ×10⁹/L (below the LP safety threshold).`,
			suggestedAction: veryLow
				? 'Platelets < 40 ×10⁹/L — transfuse to a safe level and discuss with haematology before LP.'
				: 'Platelets 40–49 ×10⁹/L — borderline; consider transfusion / haematology advice before LP.'
		});
	}

	// --- Local infection ------------------------------------------------
	if (data.bleeding.localSkinInfection === true) {
		flags.push({
			flagId: 'F-LOCAL-INFECTION-001',
			category: 'local-infection',
			priority: 'high',
			description: 'Local skin / soft-tissue infection at the puncture site.',
			suggestedAction:
				'Do not perform LP through infected skin; choose an alternative site or defer until resolved.'
		});
	}

	// --- Completeness / data-quality flags ------------------------------
	if (!data.procedure.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (!data.procedure.clinicalQuestion || data.procedure.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'medium',
			description: 'No specific clinical question recorded.',
			suggestedAction: 'Query the referrer for the specific question the CSF analysis should answer.'
		});
	}

	return flags;
}
