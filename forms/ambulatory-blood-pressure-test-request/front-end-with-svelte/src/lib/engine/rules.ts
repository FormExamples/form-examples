// Four-axis rule catalogue for the Ambulatory Blood Pressure Test Request
// engine (NICE NG136 / BIHS).
//
// Axes:
//   (A) appropriateness — NICE NG136 ordinal 1-9 + band, driven by indication
//       and clinic BP;
//   (B) suitability — oscillometric accuracy (atrial fibrillation, arm size /
//       high BMI): ok / caution / limited;
//   (C) completeness — weighted mandatory-field checklist 0-100;
//   (D) triage — routine / urgent / emergency, with severe / accelerated
//       hypertension (clinic BP >=180/120) auto-escalation.
//
// Rule IDs are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-SUIT-*, R-COMPLETE-*, R-TRIAGE-*).

import type {
	AbpmRequest,
	AppropriatenessBand,
	FiredRule,
	SuitabilityBand,
	TriageTier
} from './types';

// ----------------------------------------------------------------------
// Shared blood-pressure thresholds (NICE NG136)
// ----------------------------------------------------------------------

/** Stage-1 hypertension: clinic BP at or above this prompts ABPM confirmation. */
export const BP_STAGE1_SYSTOLIC = 140;
export const BP_STAGE1_DIASTOLIC = 90;
/** Severe / accelerated hypertension: at or above this prompts same-day review. */
export const BP_SEVERE_SYSTOLIC = 180;
export const BP_SEVERE_DIASTOLIC = 120;
/** High BMI / large-arm threshold affecting cuff sizing and accuracy. */
export const BMI_LARGE_ARM = 35;

/** Coerce a numeric-or-blank value to a number or null. */
function num(v: number | string | null | undefined): number | null {
	if (v === null || v === undefined || v === '') return null;
	const n = Number(v);
	return Number.isNaN(n) ? null : n;
}

/** True when either component reaches the stage-1 hypertension threshold. */
export function isStage1OrAbove(
	sys: number | null | undefined,
	dia: number | null | undefined
): boolean {
	const s = num(sys);
	const d = num(dia);
	if (s === null) return false;
	return s >= BP_STAGE1_SYSTOLIC || (d !== null && d >= BP_STAGE1_DIASTOLIC);
}

/** True when either component reaches the severe-hypertension threshold. */
export function isSevere(
	sys: number | null | undefined,
	dia: number | null | undefined
): boolean {
	const s = num(sys);
	const d = num(dia);
	return (s !== null && s >= BP_SEVERE_SYSTOLIC) || (d !== null && d >= BP_SEVERE_DIASTOLIC);
}

/** True when both clinic BP components are recorded. */
export function bpPresent(d: AbpmRequest): boolean {
	return (
		num(d.bloodPressure.clinicBpSystolic) !== null &&
		num(d.bloodPressure.clinicBpDiastolic) !== null
	);
}

// ----------------------------------------------------------------------
// Axis A — Appropriateness (NICE NG136 1-9 ordinal)
// ----------------------------------------------------------------------

export interface AppropriatenessResult {
	score: number;
	band: AppropriatenessBand;
	firedRule: FiredRule | null;
}

/** Score appropriateness (1-9) for an ABPM request and return the fired rule. */
export function scoreAppropriateness(data: AbpmRequest): AppropriatenessResult {
	const indication = data.request.primaryIndication;
	const sys = data.bloodPressure.clinicBpSystolic;
	const dia = data.bloodPressure.clinicBpDiastolic;

	if (!indication) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: 'unspecified',
				description: 'Indication not yet specified — provisional appropriateness.'
			}
		};
	}

	// Severe / accelerated hypertension: ABPM is not the priority pathway.
	if (isSevere(sys, dia)) {
		return {
			score: 4,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-SEVERE-BP-PRIORITY',
				axis: 'appropriateness',
				category: 'severe-hypertension',
				description:
					'Clinic BP >=180/120 — same-day specialist review takes priority over routine ABPM confirmation.'
			}
		};
	}

	// Diagnosing new hypertension with a confirmatory clinic BP >=140/90.
	if (indication === 'diagnose-hypertension') {
		if (isStage1OrAbove(sys, dia)) {
			return {
				score: 8,
				band: 'usually-appropriate',
				firedRule: {
					ruleId: 'R-APPROP-CONFIRM-DIAGNOSIS',
					axis: 'appropriateness',
					category: 'diagnose-hypertension',
					description:
						'Clinic BP >=140/90 confirming a new diagnosis — ABPM is the recommended confirmation method (NICE NG136).'
				}
			};
		}
		if (bpPresent(data)) {
			return {
				score: 3,
				band: 'usually-not-appropriate',
				firedRule: {
					ruleId: 'R-APPROP-LOW-BP-NO-INDICATION',
					axis: 'appropriateness',
					category: 'diagnose-hypertension',
					description:
						'Clinic BP below 140/90 with no labile / symptom indication — ABPM is not usually appropriate to diagnose hypertension.'
				}
			};
		}
		return {
			score: 6,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-DIAGNOSIS-NO-BP',
				axis: 'appropriateness',
				category: 'diagnose-hypertension',
				description:
					'Diagnosing hypertension but clinic BP not recorded — record clinic BP to confirm appropriateness.'
			}
		};
	}

	// Suspected white-coat or masked hypertension.
	if (indication === 'white-coat-hypertension' || indication === 'masked-hypertension') {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indication.toUpperCase().replace(/[^A-Z]+/g, '-')}`,
				axis: 'appropriateness',
				category: indication,
				description: `Suspected ${indication.replace(/-/g, ' ')} — out-of-office monitoring is usually appropriate (NICE NG136).`
			}
		};
	}

	// Resistant hypertension benefits from out-of-office confirmation.
	if (indication === 'resistant-hypertension') {
		return {
			score: 7,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-RESISTANT',
				axis: 'appropriateness',
				category: 'resistant-hypertension',
				description:
					'Resistant hypertension — ABPM is usually appropriate to confirm control before escalating therapy.'
			}
		};
	}

	// Treatment monitoring of known hypertension.
	if (indication === 'treatment-monitoring') {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-TREATMENT-MONITORING',
				axis: 'appropriateness',
				category: 'treatment-monitoring',
				description:
					'Treatment monitoring of known hypertension — ABPM may be appropriate; consider home monitoring as an alternative.'
			}
		};
	}

	// Hypotension symptoms.
	if (indication === 'hypotension-symptoms') {
		return {
			score: 6,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-HYPOTENSION',
				axis: 'appropriateness',
				category: 'hypotension-symptoms',
				description:
					'Symptoms suggestive of hypotension — ABPM may be appropriate to characterise BP variability.'
			}
		};
	}

	// Pregnancy hypertension — device validation matters.
	if (indication === 'pregnancy-hypertension') {
		return {
			score: 6,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-PREGNANCY',
				axis: 'appropriateness',
				category: 'pregnancy-hypertension',
				description:
					'Pregnancy hypertension — ABPM may be appropriate using a pregnancy-validated device.'
			}
		};
	}

	// Other / unrecognised indication.
	return {
		score: 5,
		band: 'may-be-appropriate',
		firedRule: {
			ruleId: 'R-APPROP-OTHER',
			axis: 'appropriateness',
			category: 'other',
			description: 'Indication recorded as "other" — appropriateness requires clinician vetting.'
		}
	};
}

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Suitability (oscillometric measurement accuracy; BIHS)
// ----------------------------------------------------------------------

export interface SuitabilityResult {
	band: SuitabilityBand;
	firedRules: FiredRule[];
}

/** Evaluate measurement suitability for oscillometric ABPM (worst factor wins). */
export function scoreSuitability(data: AbpmRequest): SuitabilityResult {
	const firedRules: FiredRule[] = [];
	let band: SuitabilityBand = 'ok';

	if (data.symptoms.atrialFibrillation === true) {
		band = 'limited';
		firedRules.push({
			ruleId: 'R-SUIT-ATRIAL-FIBRILLATION',
			axis: 'suitability',
			category: 'atrial-fibrillation',
			description:
				'Atrial fibrillation reduces the accuracy of oscillometric ABPM (BIHS) — consider auscultatory confirmation.'
		});
	}

	const bmi = num(data.patient.bodyMassIndex);
	if (bmi !== null && bmi >= BMI_LARGE_ARM) {
		if (band !== 'limited') band = 'caution';
		firedRules.push({
			ruleId: 'R-SUIT-LARGE-ARM',
			axis: 'suitability',
			category: 'arm-size',
			description: `High BMI (>=${BMI_LARGE_ARM}) implies a large arm circumference — ensure a correctly sized large cuff for accurate readings.`
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SUIT-OK',
			axis: 'suitability',
			category: 'accuracy',
			description: 'No oscillometric accuracy factors identified — standard ABPM is suitable.'
		});
	}

	return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (weighted mandatory-field checklist)
// ----------------------------------------------------------------------

interface CompletenessField {
	weight: number;
	present: (d: AbpmRequest) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 3, present: (d) => bpPresent(d), ruleId: 'R-COMPLETE-CLINIC-BP', label: 'clinic blood pressure' },
	{ weight: 2, present: (d) => !!d.request.testType, ruleId: 'R-COMPLETE-TEST-TYPE', label: 'requested test type' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

export interface CompletenessResult {
	percent: number;
	missing: FiredRule[];
}

/** Compute weighted completeness 0-100 and the missing-field rules. */
export function scoreCompleteness(data: AbpmRequest): CompletenessResult {
	let totalWeight = 0;
	let presentWeight = 0;
	const missing: FiredRule[] = [];
	for (const f of COMPLETENESS_FIELDS) {
		totalWeight += f.weight;
		if (f.present(data)) {
			presentWeight += f.weight;
		} else {
			missing.push({
				ruleId: f.ruleId,
				axis: 'completeness',
				category: 'missing-field',
				description: `Missing ${f.label}.`
			});
		}
	}
	const percent = totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
	return { percent, missing };
}

// ----------------------------------------------------------------------
// Axis D — Triage priority (NICE NG136 severe-BP escalation)
// ----------------------------------------------------------------------

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

export const TARGET_TIMEFRAMES: Record<TriageTier, string> = {
	routine: 'Within 2-4 weeks',
	urgent: 'Within 24-72 hours / same-day specialist review',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: AbpmRequest) => boolean;
	description: string;
}

const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-SEVERE-HYPERTENSION',
		tier: 'urgent',
		fires: (d) => isSevere(d.bloodPressure.clinicBpSystolic, d.bloodPressure.clinicBpDiastolic),
		description: 'Clinic BP >=180/120 — same-day specialist review (NICE NG136).'
	},
	{
		ruleId: 'R-TRIAGE-HYPOTENSION-SYMPTOMS',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'hypotension-symptoms' && d.symptoms.symptomDizziness === true,
		description: 'Hypotension indication with dizziness — expedite assessment.'
	}
];

export interface TriageResult {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
}

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: AbpmRequest): TriageResult {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = (TRIAGE_ORDER as string[]).includes(requested)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];

	for (const rule of TRIAGE_RULES) {
		if (rule.fires(data)) {
			tier = maxTier(tier, rule.tier);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'triage',
				category: 'escalation',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `No escalation triggers; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		firedRules
	};
}
