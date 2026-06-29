// Four-axis rule catalogue for the Lumbar Puncture Test Request engine.
//
// (A) appropriateness 1-9 + band by indication × procedure intent; (B) safety /
// contraindication band (ok / caution / contraindicated) from
// raised-ICP-needing-imaging, coagulopathy / anticoagulation, thrombocytopenia,
// and local infection; (C) request completeness over mandatory fields; (D)
// triage tier (routine / urgent / emergency) with suspected-meningitis /
// suspected-SAH auto-escalation to emergency. Rule IDs are stable and identical
// across every front-end and the back-end (R-APPROP-*, R-SAFETY-*,
// R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader composes them.

import type {
	LumbarPunctureRequest,
	AppropriatenessBand,
	ContraindicationBand,
	FiredRule,
	TriageTier
} from './types';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (1-9 ordinal indication match)
// ----------------------------------------------------------------------

/** Map of indication -> { ideal:[intent], plausible:[intent] }. */
const INDICATION_INTENT_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-meningitis': { ideal: ['diagnostic'], plausible: [] },
	'suspected-subarachnoid-haemorrhage': { ideal: ['diagnostic'], plausible: [] },
	'suspected-multiple-sclerosis': { ideal: ['diagnostic'], plausible: [] },
	'suspected-guillain-barre': { ideal: ['diagnostic'], plausible: [] },
	'idiopathic-intracranial-hypertension': { ideal: ['diagnostic', 'therapeutic'], plausible: [] },
	'suspected-cns-malignancy': { ideal: ['diagnostic'], plausible: [] },
	'cns-infection': { ideal: ['diagnostic'], plausible: ['therapeutic'] },
	other: { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication × procedureIntent pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or intent has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: string,
	intent: string
): { score: number; band: AppropriatenessBand; firedRule: FiredRule } {
	if (!indication || !intent) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or procedure intent not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_INTENT_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(intent)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `A ${intent} lumbar puncture is the recommended procedure for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(intent)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `A ${intent} lumbar puncture may be appropriate for "${indication}" but is not the first-line procedure.`
			}
		};
	}
	if (indication === 'other') {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-OTHER',
				axis: 'appropriateness',
				category: 'other',
				description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
			}
		};
	}
	return {
		score: 3,
		band: 'usually-not-appropriate',
		firedRule: {
			ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
			axis: 'appropriateness',
			category: indication,
			description: `A ${intent} lumbar puncture is not usually the recommended procedure for "${indication}"; query the referrer.`
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
// Axis B — Safety / contraindication band (ok / caution / contraindicated)
// ----------------------------------------------------------------------

const CONTRAINDICATION_ORDER: ContraindicationBand[] = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two contraindication bands is more severe. */
export function maxBand(a: ContraindicationBand, b: ContraindicationBand): ContraindicationBand {
	const ia = CONTRAINDICATION_ORDER.indexOf(a);
	const ib = CONTRAINDICATION_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

function hasNumber(v: number | null | undefined): v is number {
	return v !== null && v !== undefined && !Number.isNaN(Number(v));
}

/** Whether raised intracranial pressure is suspected. */
export function raisedIcpSuspected(d: LumbarPunctureRequest): boolean {
	return (
		d.neuroSafety.suspectedRaisedIntracranialPressure === true ||
		d.neuroSafety.focalNeurologicalSigns === true ||
		d.neuroSafety.reducedConsciousness === true
	);
}

interface SafetyRule {
	ruleId: string;
	band: ContraindicationBand;
	fires: (d: LumbarPunctureRequest) => boolean;
	category: string;
	description: string;
}

// Each safety rule forces at least the given band when it fires.
const SAFETY_RULES: SafetyRule[] = [
	{
		ruleId: 'R-SAFETY-LOCAL-INFECTION',
		band: 'contraindicated',
		fires: (d) => d.bleeding.localSkinInfection === true,
		category: 'local-infection',
		description: 'Local skin / soft-tissue infection at the puncture site — contraindicated.'
	},
	{
		ruleId: 'R-SAFETY-RAISED-ICP-NO-IMAGING',
		band: 'contraindicated',
		fires: (d) =>
			raisedIcpSuspected(d) &&
			(d.neuroSafety.ctHeadStatus === '' ||
				d.neuroSafety.ctHeadStatus === 'awaited' ||
				d.neuroSafety.ctHeadStatus === 'done-abnormal'),
		category: 'suspected-raised-icp-needs-imaging',
		description:
			'Suspected raised intracranial pressure without a reassuring CT head — image and stabilise before LP.'
	},
	{
		ruleId: 'R-SAFETY-PLATELETS-LOW',
		band: 'contraindicated',
		fires: (d) => hasNumber(d.bleeding.plateletCount) && Number(d.bleeding.plateletCount) < 40,
		category: 'thrombocytopenia',
		description: 'Platelet count below 40 ×10⁹/L — high spinal-haematoma risk; correct before LP.'
	},
	{
		ruleId: 'R-SAFETY-PLATELETS-BORDERLINE',
		band: 'caution',
		fires: (d) =>
			hasNumber(d.bleeding.plateletCount) &&
			Number(d.bleeding.plateletCount) >= 40 &&
			Number(d.bleeding.plateletCount) < 50,
		category: 'thrombocytopenia',
		description:
			'Platelet count 40–49 ×10⁹/L — borderline; consider platelet transfusion / haematology advice.'
	},
	{
		ruleId: 'R-SAFETY-INR-HIGH',
		band: 'caution',
		fires: (d) => hasNumber(d.bleeding.inr) && Number(d.bleeding.inr) > 1.5,
		category: 'coagulopathy',
		description: 'INR above 1.5 — correct coagulopathy before LP.'
	},
	{
		ruleId: 'R-SAFETY-ANTICOAGULANT',
		band: 'caution',
		fires: (d) => d.bleeding.takingAnticoagulant === true,
		category: 'high-bleeding-risk-anticoag',
		description:
			'Patient taking an anticoagulant — hold / reverse and discuss with haematology before LP.'
	},
	{
		ruleId: 'R-SAFETY-BLEEDING-DISORDER',
		band: 'caution',
		fires: (d) => d.bleeding.bleedingDisorder === true,
		category: 'coagulopathy',
		description:
			'Known bleeding disorder / coagulopathy — correct and discuss with haematology before LP.'
	},
	{
		ruleId: 'R-SAFETY-ANTIPLATELET',
		band: 'caution',
		fires: (d) => d.bleeding.takingAntiplatelet === true,
		category: 'high-bleeding-risk-anticoag',
		description: 'Patient taking an antiplatelet agent — assess bleeding risk before LP.'
	}
];

/** Compute the safety / contraindication band and the fired safety rules. */
export function scoreSafety(data: LumbarPunctureRequest): {
	band: ContraindicationBand;
	firedRules: FiredRule[];
} {
	let band: ContraindicationBand = 'ok';
	const firedRules: FiredRule[] = [];

	for (const rule of SAFETY_RULES) {
		if (rule.fires(data)) {
			band = maxBand(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'safety',
				category: rule.category,
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-OK',
			axis: 'safety',
			category: 'ok',
			description: 'No raised-ICP, bleeding, or local-infection contraindication identified.'
		});
	}

	return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------

interface CompletenessField {
	weight: number;
	present: (d: LumbarPunctureRequest) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.procedure.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.procedure.clinicalQuestion && d.procedure.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.procedure.procedureIntent, ruleId: 'R-COMPLETE-PROCEDURE-INTENT', label: 'procedure intent' },
	{ weight: 2, present: (d) => !!d.neuroSafety.ctHeadStatus, ruleId: 'R-COMPLETE-CT-HEAD-STATUS', label: 'CT head status' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/** Compute weighted completeness 0-100 and the missing-field rules. */
export function scoreCompleteness(data: LumbarPunctureRequest): {
	percent: number;
	missing: FiredRule[];
} {
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
// Axis D — Triage priority (red-flag escalation)
// ----------------------------------------------------------------------

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 2-6 weeks',
	urgent: 'Within 24-72 hours',
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
	fires: (d: LumbarPunctureRequest) => boolean;
	description: string;
}

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-SUSPECTED-MENINGITIS',
		tier: 'emergency',
		fires: (d) => d.procedure.primaryIndication === 'suspected-meningitis',
		description: 'Suspected meningitis — emergency lumbar puncture / treatment.'
	},
	{
		ruleId: 'R-TRIAGE-SUSPECTED-SAH',
		tier: 'emergency',
		fires: (d) => d.procedure.primaryIndication === 'suspected-subarachnoid-haemorrhage',
		description: 'Suspected subarachnoid haemorrhage — emergency assessment.'
	},
	{
		ruleId: 'R-TRIAGE-CNS-INFECTION',
		tier: 'emergency',
		fires: (d) => d.procedure.primaryIndication === 'cns-infection',
		description: 'CNS infection — emergency assessment.'
	},
	{
		ruleId: 'R-TRIAGE-REDUCED-CONSCIOUSNESS',
		tier: 'urgent',
		fires: (d) => d.neuroSafety.reducedConsciousness === true,
		description: 'Reduced consciousness — urgent assessment.'
	},
	{
		ruleId: 'R-TRIAGE-GUILLAIN-BARRE',
		tier: 'urgent',
		fires: (d) => d.procedure.primaryIndication === 'suspected-guillain-barre',
		description: 'Suspected Guillain-Barré — urgent assessment.'
	}
];

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: LumbarPunctureRequest): {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];

	for (const rule of TRIAGE_RULES) {
		if (rule.fires(data)) {
			tier = maxTier(tier, rule.tier);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'triage',
				category: 'red-flag',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `No red flags; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		firedRules
	};
}

export { INDICATION_INTENT_MAP, TARGET_TIMEFRAMES };
