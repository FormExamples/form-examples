// calculateHealthScreening() — the single public entry point.
//
// Composes the PAR-Q+ screen, the AUDIT-C alcohol screen, the symptom review,
// and family/medical history into a composite risk band by max-grade: the
// worst finding wins. Safety flags are computed independently and are never
// suppressed by an assessor override. See spec/index.md §3 for the full
// rule table and doc/parq-plus-and-auditc.md for the rule IDs.

import { computeAuditCBand, computeAuditCScore, evaluateAuditC } from './audit-c-rules';
import { detectFlags } from './flagged-issues';
import { computeParqPlusClearance, evaluateParqPlus } from './parq-rules';
import type {
	AdditionalFlag,
	FiredRule,
	GradingResult,
	HealthScreeningQuestionnaire,
	Recommendation,
	RiskBand
} from './types';
import { ageInYears, num, round1, rule } from './utils';

/** Body mass index from height and weight, or null when either is missing. */
export function computeBodyMassIndex(data: HealthScreeningQuestionnaire): number | null {
	const heightCm = num(data.vitals.heightAsCm);
	const weightKg = num(data.vitals.weightAsKg);
	if (heightCm === null || weightKg === null || heightCm <= 0) return null;
	const heightM = heightCm / 100;
	return round1(weightKg / (heightM * heightM));
}

const RISK_BAND_RANK: Record<Exclude<RiskBand, ''>, number> = {
	low: 0,
	moderate: 1,
	high: 2,
	'refer-urgently': 3
};

function worst(a: RiskBand, b: RiskBand): RiskBand {
	if (!a) return b;
	if (!b) return a;
	return RISK_BAND_RANK[a as Exclude<RiskBand, ''>] >= RISK_BAND_RANK[b as Exclude<RiskBand, ''>] ? a : b;
}

/** Composite risk band by max-grade across every domain. See spec/index.md §3.3. */
export function computeRiskBand(
	data: HealthScreeningQuestionnaire,
	parqPlusClearance: ReturnType<typeof computeParqPlusClearance>,
	auditCBand: ReturnType<typeof computeAuditCBand>
): { band: RiskBand; rules: FiredRule[] } {
	const s = data.symptoms;
	const fired: FiredRule[] = [];
	let band: RiskBand = 'low';

	if (s.symptomUnexplainedChestPain === 'yes' || s.symptomDizzySpellsOrFainting === 'yes') {
		band = worst(band, 'refer-urgently');
		fired.push(
			rule(
				'R-COMPOSITE-URGENT',
				'composite',
				'symptom review',
				null,
				'refer-urgently',
				'refer-urgently',
				'Unexplained chest pain or fainting/loss-of-consciousness reported — same-day medical attention needed.'
			)
		);
	}

	const otherRedFlags = [
		s.symptomPersistentCoughOver3Weeks,
		s.symptomUnexplainedWeightLoss,
		s.symptomJointPainRestrictingMovement,
		s.symptomShortnessOfBreathOnExertion,
		s.symptomPalpitations
	];
	if (otherRedFlags.some((v) => v === 'yes')) {
		band = worst(band, 'high');
		fired.push(
			rule(
				'R-COMPOSITE-HIGH-SYMPTOM',
				'composite',
				'symptom review',
				null,
				'high',
				'high',
				'A red-flag symptom from the step 7 review is present.'
			)
		);
	}

	if (auditCBand === 'higher-risk') {
		band = worst(band, 'high');
		fired.push(
			rule(
				'R-COMPOSITE-HIGH-AUDITC',
				'composite',
				'AUDIT-C',
				null,
				'high',
				'high',
				'AUDIT-C is higher-risk.'
			)
		);
	}

	const conditions = [
		data.medicalHistory.conditionDiabetes,
		data.medicalHistory.conditionHypertension,
		data.medicalHistory.conditionAsthma,
		data.medicalHistory.conditionCopd,
		data.medicalHistory.conditionHeartDisease,
		data.medicalHistory.conditionKidneyDisease,
		data.medicalHistory.conditionThyroid
	];
	const conditionCount = conditions.filter((v) => v === 'yes').length;

	if (data.familyHistory.familyHistoryPrematureCardiacEvent === 'yes' && conditionCount > 0) {
		band = worst(band, 'high');
		fired.push(
			rule(
				'R-COMPOSITE-HIGH-FAMILY',
				'composite',
				'family history',
				null,
				'high',
				'high',
				'Family history of a premature cardiac event combined with a current chronic condition.'
			)
		);
	}

	if (parqPlusClearance === 'further-assessment-required') {
		band = worst(band, 'moderate');
		fired.push(
			rule(
				'R-COMPOSITE-MODERATE-PARQ',
				'composite',
				'PAR-Q+',
				null,
				'moderate',
				'moderate',
				'PAR-Q+ requires further assessment.'
			)
		);
	}

	if (auditCBand === 'increasing-risk') {
		band = worst(band, 'moderate');
		fired.push(
			rule(
				'R-COMPOSITE-MODERATE-AUDITC',
				'composite',
				'AUDIT-C',
				null,
				'moderate',
				'moderate',
				'AUDIT-C is increasing-risk.'
			)
		);
	}

	if (conditionCount === 1 && !otherRedFlags.some((v) => v === 'yes')) {
		band = worst(band, 'moderate');
		fired.push(
			rule(
				'R-COMPOSITE-MODERATE-CONDITION',
				'composite',
				'medical history',
				conditionCount,
				'moderate',
				'moderate',
				'A single chronic condition is present without a red-flag symptom.'
			)
		);
	}

	if (fired.length === 0) {
		fired.push(
			rule('R-COMPOSITE-LOW', 'composite', 'overall', null, 'low', 'low', 'No risk-raising finding identified.')
		);
	}

	return { band, rules: fired };
}

const RECOMMENDATION_BY_BAND: Record<Exclude<RiskBand, ''>, Recommendation> = {
	low: 'clear-to-proceed',
	moderate: 'routine-review',
	high: 'gp-review-required',
	'refer-urgently': 'refer-urgently'
};

/** The single public entry point: grade a health screening questionnaire. */
export function calculateHealthScreening(data: HealthScreeningQuestionnaire): GradingResult {
	const age = ageInYears(data.patient.birthDate, data.context.assessmentDate);
	const isPaediatric = age !== null && age < 16;

	const parqPlusClearance = computeParqPlusClearance(data);
	const auditCScore = computeAuditCScore(data);
	const auditCBand = computeAuditCBand(data);
	const bodyMassIndex = computeBodyMassIndex(data);

	const { band: computedBand, rules: compositeRules } = computeRiskBand(data, parqPlusClearance, auditCBand);
	const computedRiskBand: RiskBand = isPaediatric ? '' : computedBand;
	const computedRecommendation: Recommendation = isPaediatric
		? 'paediatric-pathway'
		: RECOMMENDATION_BY_BAND[computedBand as Exclude<RiskBand, ''>];

	const overrideRiskBand = data.summary.overrideRiskBand;
	const finalRiskBand: RiskBand = overrideRiskBand || computedRiskBand;
	const finalRecommendation: Recommendation =
		finalRiskBand && finalRiskBand !== computedRiskBand
			? (RECOMMENDATION_BY_BAND[finalRiskBand as Exclude<RiskBand, ''>] ?? computedRecommendation)
			: computedRecommendation;

	const firedRules: FiredRule[] = [...evaluateParqPlus(data), ...evaluateAuditC(data), ...compositeRules];

	const flags: AdditionalFlag[] = detectFlags(data, {
		parqPlusClearance,
		auditCScore,
		auditCBand,
		age
	});

	return {
		parqPlusClearance,
		bodyMassIndex,
		auditCScore,
		auditCBand,
		computedRiskBand,
		finalRiskBand,
		computedRecommendation,
		finalRecommendation,
		overrideReason: data.summary.overrideReason,
		isPaediatric,
		firedRules,
		flags
	};
}

/** Display labels for the risk band, for the dashboard and the report. */
export const RISK_BAND_LABELS: Record<Exclude<RiskBand, ''>, string> = {
	low: 'Low',
	moderate: 'Moderate',
	high: 'High',
	'refer-urgently': 'Refer urgently'
};

/** Display labels for the referral recommendation. */
export const RECOMMENDATION_LABELS: Record<Exclude<Recommendation, ''>, string> = {
	'clear-to-proceed': 'Clear to proceed',
	'routine-review': 'Routine review',
	'gp-review-required': 'GP review required',
	'refer-urgently': 'Refer urgently — same-day medical attention',
	'paediatric-pathway': 'Redirect to paediatric pathway'
};

/** Display labels for the PAR-Q+ clearance status. */
export const PARQ_CLEARANCE_LABELS: Record<Exclude<ReturnType<typeof computeParqPlusClearance>, ''>, string> = {
	cleared: 'Cleared for general physical activity',
	'further-assessment-required': 'Further assessment required'
};

/** Display labels for the AUDIT-C band. */
export const AUDIT_C_BAND_LABELS: Record<Exclude<ReturnType<typeof computeAuditCBand>, ''>, string> = {
	low: 'Low',
	'increasing-risk': 'Increasing risk',
	'higher-risk': 'Higher risk'
};
