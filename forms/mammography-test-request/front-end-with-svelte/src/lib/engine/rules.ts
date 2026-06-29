// Four-axis rule catalogue for the Mammography Test Request engine.
//
// (A) appropriateness 1–9 + band by exam type × indication (ACR Appropriateness
// Criteria / NHSBSP); (B) cancer-pathway urgency (triage tier routine / urgent /
// two-week-wait / emergency) with NICE NG12 two-week-wait auto-escalation;
// (C) request completeness over mandatory fields, indication + clinical question
// weighted highest; (D) clinical priority (low / moderate / high) from symptom +
// risk escalation rules. Rule IDs are stable and identical across every
// front-end and the back-end (R-APPROP-*, R-URGENCY-*, R-COMPLETE-*, R-PRIORITY-*).

import type {
	AppropriatenessBand,
	FiredRule,
	MammographyRequest,
	PriorityBand,
	TriageTier
} from './types';
import { ageInYears } from './utils';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1–9 ordinal)
// ----------------------------------------------------------------------

/** Map of indication → ideal / plausible exam types; anything else is a mismatch. */
const INDICATION_EXAM_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'routine-screening': { ideal: ['screening'], plausible: [] },
	'family-history': { ideal: ['screening', 'surveillance'], plausible: ['diagnostic'] },
	'breast-lump': { ideal: ['diagnostic', 'symptomatic'], plausible: ['surveillance'] },
	'breast-pain': { ideal: ['symptomatic', 'diagnostic'], plausible: [] },
	'nipple-discharge': { ideal: ['symptomatic', 'diagnostic'], plausible: [] },
	'skin-change': { ideal: ['symptomatic', 'diagnostic'], plausible: [] },
	'recall-from-screening': { ideal: ['diagnostic'], plausible: ['symptomatic', 'surveillance'] },
	'follow-up-known-cancer': { ideal: ['surveillance', 'diagnostic'], plausible: [] },
	'post-treatment-surveillance': { ideal: ['surveillance'], plausible: ['diagnostic', 'screening'] },
	other: { ideal: [], plausible: [] }
};

/** Result of scoring Axis A. */
export interface AppropriatenessResult {
	score: number;
	band: AppropriatenessBand;
	firedRule: FiredRule | null;
}

/**
 * Score appropriateness (1–9) for an indication × examType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or exam type has not yet been chosen.
 */
export function scoreAppropriateness(indication: string, examType: string): AppropriatenessResult {
	if (!indication || !examType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or exam type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_EXAM_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(examType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${examType} mammography is the recommended examination for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(examType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${examType} mammography may be appropriate for "${indication}" but is not the first-line examination.`
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
		score: 2,
		band: 'usually-not-appropriate',
		firedRule: {
			ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${examType} mammography is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Cancer-pathway urgency (NICE NG12 suspected-cancer criteria)
// ----------------------------------------------------------------------

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'two-week-wait', 'emergency'];

const TARGET_TIMEFRAMES: Record<TriageTier, string> = {
	routine: 'Within 6 weeks (routine)',
	urgent: 'Within 1–2 weeks (urgent)',
	'two-week-wait': 'Seen within 14 days (NICE NG12 two-week-wait)',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

function ageGte(d: MammographyRequest, threshold: number): boolean {
	const age = ageInYears(d.patient.dateOfBirth);
	return age !== null && age >= threshold;
}

interface UrgencyRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: MammographyRequest) => boolean;
	rationale: string;
}

// NICE NG12 two-week-wait escalation rules. Each, when it fires, forces at
// least the two-week-wait tier and records a rationale.
const URGENCY_RULES: UrgencyRule[] = [
	{
		ruleId: 'R-URGENCY-NG12-LUMP-30',
		tier: 'two-week-wait',
		fires: (d) => d.symptoms.symptomLump === true && ageGte(d, 30),
		rationale: 'NICE NG12: unexplained breast lump aged 30 or over.'
	},
	{
		ruleId: 'R-URGENCY-NG12-SKIN-CHANGE-50',
		tier: 'two-week-wait',
		fires: (d) => d.symptoms.symptomSkinChange === true && ageGte(d, 50),
		rationale: 'NICE NG12: suspicious skin change aged 50 or over.'
	},
	{
		ruleId: 'R-URGENCY-NG12-NIPPLE-CHANGE-50',
		tier: 'two-week-wait',
		fires: (d) =>
			(d.symptoms.symptomNippleInversion === true || d.symptoms.symptomNippleDischarge === true) &&
			ageGte(d, 50),
		rationale: 'NICE NG12: nipple change (inversion / discharge) aged 50 or over.'
	}
];

/** Result of scoring Axis B. */
export interface UrgencyResult {
	tier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	twoWeekWaitRationale: string;
	firedRules: FiredRule[];
}

/**
 * Compute the cancer-pathway triage tier, target timeframe, two-week-wait
 * eligibility + rationale, and fired urgency rules.
 */
export function scoreUrgency(data: MammographyRequest): UrgencyResult {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = (TRIAGE_ORDER as string[]).includes(requested)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];
	let twoWeekWaitEligible = false;
	const rationales: string[] = [];

	for (const rule of URGENCY_RULES) {
		if (rule.fires(data)) {
			tier = maxTier(tier, rule.tier);
			twoWeekWaitEligible = true;
			rationales.push(rule.rationale);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'urgency',
				category: 'suspected-cancer-2ww',
				description: rule.rationale
			});
		}
	}

	// Honour an explicitly-requested two-week-wait tier.
	if (requested === 'two-week-wait' && !twoWeekWaitEligible) {
		twoWeekWaitEligible = true;
		rationales.push('Requested on the two-week-wait pathway by the referrer.');
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-URGENCY-REQUESTED',
			axis: 'urgency',
			category: 'requested',
			description: `No NICE NG12 trigger fired; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		twoWeekWaitEligible,
		twoWeekWaitRationale: rationales.join(' '),
		firedRules
	};
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------

interface CompletenessField {
	weight: number;
	present: (d: MammographyRequest) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.request.examType, ruleId: 'R-COMPLETE-EXAM-TYPE', label: 'exam type' },
	{ weight: 2, present: (d) => !!d.request.laterality, ruleId: 'R-COMPLETE-LATERALITY', label: 'laterality' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/** Result of scoring Axis C. */
export interface CompletenessResult {
	percent: number;
	missing: FiredRule[];
}

/** Compute weighted completeness 0–100 and the missing-field rules. */
export function scoreCompleteness(data: MammographyRequest): CompletenessResult {
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
// Axis D — Clinical priority (symptom + risk escalation)
// ----------------------------------------------------------------------

const PRIORITY_ORDER: PriorityBand[] = ['low', 'moderate', 'high'];

/** Return whichever of two priority bands is more severe. */
export function maxPriority(a: PriorityBand, b: PriorityBand): PriorityBand {
	return PRIORITY_ORDER.indexOf(a) >= PRIORITY_ORDER.indexOf(b) ? a : b;
}

interface PriorityRule {
	ruleId: string;
	band: PriorityBand;
	fires: (d: MammographyRequest) => boolean;
	description: string;
}

const PRIORITY_RULES: PriorityRule[] = [
	{ ruleId: 'R-PRIORITY-LUMP', band: 'high', fires: (d) => d.symptoms.symptomLump === true, description: 'Breast lump reported — high clinical priority.' },
	{ ruleId: 'R-PRIORITY-BLOODY-DISCHARGE', band: 'high', fires: (d) => d.symptoms.symptomNippleDischarge === true, description: 'Nipple discharge reported — high clinical priority.' },
	{ ruleId: 'R-PRIORITY-SKIN-CHANGE', band: 'high', fires: (d) => d.symptoms.symptomSkinChange === true, description: 'Skin change reported — high clinical priority.' },
	{ ruleId: 'R-PRIORITY-NIPPLE-INVERSION', band: 'high', fires: (d) => d.symptoms.symptomNippleInversion === true, description: 'New nipple inversion / retraction reported — high clinical priority.' },
	{ ruleId: 'R-PRIORITY-FAMILY-HISTORY', band: 'moderate', fires: (d) => d.history.familyHistoryBreastCancer === true, description: 'Family history of breast cancer — moderate clinical priority.' },
	{ ruleId: 'R-PRIORITY-PAIN', band: 'moderate', fires: (d) => d.symptoms.symptomPain === true, description: 'Breast pain reported — moderate clinical priority.' },
	{ ruleId: 'R-PRIORITY-ABNORMAL-PRIOR', band: 'moderate', fires: (d) => d.history.previousMammogram === 'abnormal', description: 'Previous abnormal mammogram — moderate clinical priority.' }
];

/** Result of scoring Axis D. */
export interface PriorityResult {
	band: PriorityBand;
	firedRules: FiredRule[];
}

/** Compute the clinical-priority band and fired priority rules. */
export function scorePriority(data: MammographyRequest): PriorityResult {
	let band: PriorityBand = 'low';
	const firedRules: FiredRule[] = [];
	for (const rule of PRIORITY_RULES) {
		if (rule.fires(data)) {
			band = maxPriority(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'priority',
				category: 'escalation',
				description: rule.description
			});
		}
	}
	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-PRIORITY-BASELINE',
			axis: 'priority',
			category: 'baseline',
			description: 'No symptom or risk escalation; baseline low clinical priority.'
		});
	}
	return { band, firedRules };
}

export { INDICATION_EXAM_MAP, TRIAGE_ORDER, PRIORITY_ORDER, TARGET_TIMEFRAMES };
