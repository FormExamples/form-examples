import type { BronchoscopyRequest, RiskBand, FiredRule } from './types';

/**
 * Axis D — pre-procedure risk (anticoagulation, platelets, hypoxia, ASA).
 *
 * A base low risk band is escalated by bleeding-risk and procedural-risk
 * factors. The most-severe escalation wins. The fired rules also drive the
 * recommended anticoagulant management action.
 */
const RISK_ORDER: RiskBand[] = ['low', 'moderate', 'high'];

/** Return whichever of two risk bands is more severe. */
export function maxBand(a: RiskBand, b: RiskBand): RiskBand {
	const ia = RISK_ORDER.indexOf(a);
	const ib = RISK_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

const LOW_PLATELET_THRESHOLD = 50; // x10^9/L — high bleeding risk for biopsy
const BORDERLINE_PLATELET_THRESHOLD = 100; // x10^9/L — moderate

interface RiskRule {
	ruleId: string;
	band: RiskBand;
	fires: (d: BronchoscopyRequest) => boolean;
	description: string;
}

const RISK_RULES: RiskRule[] = [
	{
		ruleId: 'R-RISK-ANTICOAGULANT',
		band: 'high',
		fires: (d) => d.bleeding.takingAnticoagulant === true,
		description: 'Patient on an anticoagulant — high bleeding risk for biopsy.'
	},
	{
		ruleId: 'R-RISK-LOW-PLATELETS',
		band: 'high',
		fires: (d) =>
			d.bleeding.plateletCount !== null &&
			d.bleeding.plateletCount !== undefined &&
			d.bleeding.plateletCount < LOW_PLATELET_THRESHOLD,
		description: `Platelet count below ${LOW_PLATELET_THRESHOLD} x10^9/L — high bleeding risk.`
	},
	{
		ruleId: 'R-RISK-ASA-IV',
		band: 'high',
		fires: (d) => d.procedural.asaGrade === 'IV' || d.procedural.asaGrade === 'V',
		description: 'ASA grade IV or V — high procedural risk; consider anaesthetic support.'
	},
	{
		ruleId: 'R-RISK-HYPOXIA',
		band: 'high',
		fires: (d) => d.procedural.oxygenDependent === true,
		description: 'Oxygen-dependent (hypoxia) — high procedural risk; plan oxygenation strategy.'
	},
	{
		ruleId: 'R-RISK-ANTIPLATELET',
		band: 'moderate',
		fires: (d) => d.bleeding.takingAntiplatelet === true,
		description: 'Patient on an antiplatelet agent — moderate bleeding risk.'
	},
	{
		ruleId: 'R-RISK-BORDERLINE-PLATELETS',
		band: 'moderate',
		fires: (d) =>
			d.bleeding.plateletCount !== null &&
			d.bleeding.plateletCount !== undefined &&
			d.bleeding.plateletCount >= LOW_PLATELET_THRESHOLD &&
			d.bleeding.plateletCount < BORDERLINE_PLATELET_THRESHOLD,
		description: `Platelet count ${LOW_PLATELET_THRESHOLD}-${BORDERLINE_PLATELET_THRESHOLD - 1} x10^9/L — moderate bleeding risk.`
	},
	{
		ruleId: 'R-RISK-ASA-III',
		band: 'moderate',
		fires: (d) => d.procedural.asaGrade === 'III',
		description: 'ASA grade III — moderate procedural risk.'
	}
];

/** Compute the recommended anticoagulant / antiplatelet management action. */
export function deriveAnticoagulantAction(d: BronchoscopyRequest): string {
	if (d.bleeding.takingAnticoagulant === true) {
		const agent = d.bleeding.anticoagulantAgent ? ` (${d.bleeding.anticoagulantAgent})` : '';
		return `Withhold the anticoagulant${agent} before the procedure per BTS bleeding-risk guidance; confirm the omission interval and any bridging plan with the responsible team.`;
	}
	if (d.bleeding.takingAntiplatelet === true) {
		const agent = d.bleeding.antiplateletAgent ? ` (${d.bleeding.antiplateletAgent})` : '';
		return `Review the antiplatelet agent${agent}; aspirin may usually continue, but clopidogrel / dual therapy should be discussed before biopsy.`;
	}
	return 'No anticoagulant or antiplatelet recorded; standard bleeding precautions apply.';
}

/** Axis D — compute the pre-procedure risk band, anticoagulant action, and fired rules. */
export function gradeRisk(d: BronchoscopyRequest): {
	riskBand: RiskBand;
	anticoagulantAction: string;
	firedRules: FiredRule[];
} {
	let band: RiskBand = 'low';
	const firedRules: FiredRule[] = [];

	for (const rule of RISK_RULES) {
		if (rule.fires(d)) {
			band = maxBand(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'risk',
				category: 'pre-procedure',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-RISK-LOW',
			axis: 'risk',
			category: 'pre-procedure',
			description:
				'No bleeding or procedural risk factors recorded; pre-procedure risk is low.'
		});
	}

	return {
		riskBand: band,
		anticoagulantAction: deriveAnticoagulantAction(d),
		firedRules
	};
}

export { RISK_ORDER, LOW_PLATELET_THRESHOLD, BORDERLINE_PLATELET_THRESHOLD };
