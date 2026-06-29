// ──────────────────────────────────────────────
// Axis D — Pre-procedure risk (BSG / ESGE + bowel-prep fitness + ASA)
//
// Risk is stratified from anticoagulant / antiplatelet therapy (high-bleeding
// risk for a high-risk procedure like polypectomy / colonoscopy), bowel-prep
// fitness (and renal function), and ASA physical-status grade. The most-severe
// contributor sets the band; an anticoagulant-management action is emitted when
// relevant. Rule IDs (R-RISK-*) are stable across every front-end and the
// back-end.
// ──────────────────────────────────────────────

import type { ColonoscopyRequest, RiskBand, FiredRule } from './types';

export const RISK_ORDER: RiskBand[] = ['low', 'moderate', 'high'];

export function maxRisk(a: RiskBand, b: RiskBand): RiskBand {
	return RISK_ORDER.indexOf(a) >= RISK_ORDER.indexOf(b) ? a : b;
}

/** Compute the pre-procedure risk band, anticoagulant action, and fired rules. */
export function scoreRisk(data: ColonoscopyRequest): {
	band: RiskBand;
	anticoagulantAction: string;
	firedRules: FiredRule[];
} {
	let band: RiskBand = 'low';
	let anticoagulantAction = '';
	const firedRules: FiredRule[] = [];

	// Anticoagulant / antiplatelet bleeding risk (BSG / ESGE).
	if (data.medication.takingAnticoagulant) {
		band = maxRisk(band, 'high');
		anticoagulantAction = data.medication.anticoagulantAgent
			? `On ${data.medication.anticoagulantAgent}: plan periprocedural interruption per BSG / ESGE (omit DOAC on the morning of the procedure; bridge warfarin per INR / thrombotic risk).`
			: 'On an anticoagulant: plan periprocedural interruption per BSG / ESGE (omit DOAC on the morning of the procedure; bridge warfarin per INR / thrombotic risk).';
		firedRules.push({
			ruleId: 'R-RISK-ANTICOAG',
			axis: 'risk',
			category: 'high-bleeding-risk',
			description: 'Anticoagulant therapy — high bleeding risk for a high-risk lower-GI procedure (BSG / ESGE).'
		});
	} else if (data.medication.takingAntiplatelet) {
		band = maxRisk(band, 'moderate');
		anticoagulantAction = data.medication.antiplateletAgent
			? `On ${data.medication.antiplateletAgent}: continue aspirin; consider stopping a thienopyridine (e.g. clopidogrel) 5-7 days before a high-risk procedure per BSG / ESGE.`
			: 'On an antiplatelet: continue aspirin; consider stopping a thienopyridine (e.g. clopidogrel) 5-7 days before a high-risk procedure per BSG / ESGE.';
		firedRules.push({
			ruleId: 'R-RISK-ANTIPLATELET',
			axis: 'risk',
			category: 'antiplatelet',
			description: 'Antiplatelet therapy — moderate bleeding risk; review periprocedural management (BSG / ESGE).'
		});
	}

	// Bowel-prep fitness.
	if (data.fitness.fitForBowelPrep === false) {
		band = maxRisk(band, 'high');
		firedRules.push({
			ruleId: 'R-RISK-UNFIT-PREP',
			axis: 'risk',
			category: 'unfit-for-prep',
			description: 'Not assessed as fit for bowel preparation — review fitness or consider CT colonography.'
		});
	}

	// Renal impairment affects bowel-prep choice.
	const egfr = data.fitness.egfrMlMin;
	if (data.fitness.chronicKidneyDisease || (egfr !== null && egfr !== undefined && (egfr as unknown as string) !== '' && Number(egfr) < 30)) {
		band = maxRisk(band, 'moderate');
		firedRules.push({
			ruleId: 'R-RISK-RENAL',
			axis: 'risk',
			category: 'renal-impairment',
			description: 'Reduced renal function — avoid sodium-phosphate prep; use an isosmotic PEG-based regimen (BSG / ESGE).'
		});
	}

	// ASA physical status.
	if (data.fitness.asaGrade === 'IV' || data.fitness.asaGrade === 'V') {
		band = maxRisk(band, 'high');
		firedRules.push({
			ruleId: 'R-RISK-ASA-HIGH',
			axis: 'risk',
			category: 'asa-high',
			description: `ASA grade ${data.fitness.asaGrade} — high anaesthetic / sedation risk; senior review and anaesthetic input.`
		});
	} else if (data.fitness.asaGrade === 'III') {
		band = maxRisk(band, 'moderate');
		firedRules.push({
			ruleId: 'R-RISK-ASA-MODERATE',
			axis: 'risk',
			category: 'asa-moderate',
			description: 'ASA grade III — moderate risk; ensure appropriate monitoring and sedation planning.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-RISK-LOW',
			axis: 'risk',
			category: 'low',
			description: 'No anticoagulant, prep-fitness, renal, or ASA risk factors identified.'
		});
	}

	return { band, anticoagulantAction, firedRules };
}
