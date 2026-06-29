import type { EndoscopyRequest, RiskBand, FiredRule } from './types';

// ----------------------------------------------------------------------
// Axis D — Pre-procedure risk (Glasgow-Blatchford + Rockall + anticoag)
// ----------------------------------------------------------------------
//
// A simplified Glasgow-Blatchford bleeding score (0-23) and pre-endoscopy
// Rockall score (0-11) are computed from the available fields, then combined
// with the BSG/ESGE anticoagulant / antiplatelet stratification into a low /
// moderate / high risk band plus a recommended anticoagulant action. Rule IDs
// are stable (R-RISK-*).

// High-bleeding-risk procedures per BSG/ESGE.
const HIGH_RISK_PROCEDURES = ['ercp', 'eus'];

/**
 * Simplified Glasgow-Blatchford score from haemoglobin, GI bleeding flag, and
 * cardiac/renal comorbidity. Bounded 0-23.
 */
export function glasgowBlatchford(d: EndoscopyRequest): number {
	let score = 0;
	const hb = d.redFlags.haemoglobinGL;
	if (typeof hb === 'number') {
		if (hb < 100) score += 6;
		else if (hb < 120) score += 3;
		else if (hb < 130) score += 1;
	}
	if (d.redFlags.redFlagGiBleeding === true) score += 2;
	if (d.redFlags.redFlagAnaemia === true) score += 1;
	if (d.comorbidities.chronicKidneyDisease === true) score += 2;
	if (d.comorbidities.cardiacNyhaClass === 'III' || d.comorbidities.cardiacNyhaClass === 'IV')
		score += 2;
	return Math.min(score, 23);
}

/**
 * Simplified pre-endoscopy Rockall score from age flag, GI bleeding, and
 * comorbidity. Bounded 0-11.
 */
export function rockall(d: EndoscopyRequest): number {
	let score = 0;
	if (d.redFlags.redFlagAgeOver55 === true) score += 1;
	if (d.redFlags.redFlagGiBleeding === true) score += 1;
	if (d.comorbidities.cardiacNyhaClass === 'III' || d.comorbidities.cardiacNyhaClass === 'IV')
		score += 2;
	if (d.comorbidities.chronicKidneyDisease === true) score += 2;
	if (d.comorbidities.asaGrade === 'IV' || d.comorbidities.asaGrade === 'V') score += 3;
	else if (d.comorbidities.asaGrade === 'III') score += 1;
	return Math.min(score, 11);
}

/**
 * Axis D — pre-procedure risk.
 *
 * Compute the risk band, the Glasgow-Blatchford and Rockall scores, the
 * anticoagulant action text, and the fired risk rules.
 */
export function gradeRisk(r: EndoscopyRequest): {
	riskBand: RiskBand;
	glasgowBlatchfordScore: number;
	rockallScore: number;
	anticoagulantAction: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const gbs = glasgowBlatchford(r);
	const rs = rockall(r);

	let band: RiskBand = 'low';
	const highProcedure = HIGH_RISK_PROCEDURES.includes(r.request.requestedProcedure);
	const onAnticoag = r.medication.takingAnticoagulant === true;
	const onDualAntiplatelet =
		r.medication.takingAntiplatelet === true &&
		(r.medication.antiplateletAgent === 'dual' ||
			r.medication.antiplateletAgent === 'clopidogrel' ||
			r.medication.antiplateletAgent === 'ticagrelor' ||
			r.medication.antiplateletAgent === 'prasugrel');

	// Band from scores.
	if (gbs >= 7 || rs >= 5) {
		band = 'high';
		firedRules.push({
			ruleId: 'R-RISK-SCORE-HIGH',
			axis: 'risk',
			category: 'bleeding-score',
			description: `Glasgow-Blatchford ${gbs} / Rockall ${rs} — high bleeding / mortality risk.`
		});
	} else if (gbs >= 3 || rs >= 2) {
		band = 'moderate';
		firedRules.push({
			ruleId: 'R-RISK-SCORE-MODERATE',
			axis: 'risk',
			category: 'bleeding-score',
			description: `Glasgow-Blatchford ${gbs} / Rockall ${rs} — moderate bleeding risk.`
		});
	} else {
		firedRules.push({
			ruleId: 'R-RISK-SCORE-LOW',
			axis: 'risk',
			category: 'bleeding-score',
			description: `Glasgow-Blatchford ${gbs} / Rockall ${rs} — low bleeding risk.`
		});
	}

	// Anticoagulant stratification escalates the band on high-risk procedures.
	let anticoagulantAction = 'No anticoagulant / antiplatelet management required.';
	if (onAnticoag) {
		const agent = r.medication.anticoagulantAgent || 'anticoagulant';
		if (highProcedure || gbs >= 7) {
			band = 'high';
			firedRules.push({
				ruleId: 'R-RISK-ANTICOAG-HIGH-PROCEDURE',
				axis: 'risk',
				category: 'anticoagulant',
				description: `On ${agent} for a high-bleeding-risk procedure — BSG/ESGE peri-procedure plan required.`
			});
			anticoagulantAction =
				agent === 'warfarin'
					? 'Warfarin: stop 5 days pre-procedure, check INR, bridge if high thrombotic risk per BSG/ESGE.'
					: `DOAC (${agent}): omit on the day (and the day before for high-risk procedures) per BSG/ESGE; confirm renal function.`;
		} else {
			if (band === 'low') band = 'moderate';
			firedRules.push({
				ruleId: 'R-RISK-ANTICOAG-LOW-PROCEDURE',
				axis: 'risk',
				category: 'anticoagulant',
				description: `On ${agent} for a low-bleeding-risk procedure — may continue per BSG/ESGE.`
			});
			anticoagulantAction = `On ${agent}: low-bleeding-risk procedure — anticoagulation may usually continue (confirm per BSG/ESGE).`;
		}
	} else if (onDualAntiplatelet) {
		if (highProcedure && band === 'low') band = 'moderate';
		firedRules.push({
			ruleId: 'R-RISK-ANTIPLATELET',
			axis: 'risk',
			category: 'antiplatelet',
			description: `On ${r.medication.antiplateletAgent} antiplatelet therapy — review per BSG/ESGE for high-risk procedures.`
		});
		anticoagulantAction = `On ${r.medication.antiplateletAgent}: continue aspirin; review thienopyridine / dual therapy with cardiology for high-risk procedures.`;
	}

	if (r.comorbidities.asaGrade === 'IV' || r.comorbidities.asaGrade === 'V') {
		band = 'high';
		firedRules.push({
			ruleId: 'R-RISK-ASA-HIGH',
			axis: 'risk',
			category: 'asa',
			description: `ASA grade ${r.comorbidities.asaGrade} — high peri-procedure risk; consultant-led sedation planning.`
		});
	}

	return {
		riskBand: band,
		glasgowBlatchfordScore: gbs,
		rockallScore: rs,
		anticoagulantAction,
		firedRules
	};
}

export { HIGH_RISK_PROCEDURES };
