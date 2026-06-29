// Four-axis rule catalogue for the MRI Scan Test Request engine.
//
// Ported verbatim (logic + rule IDs) from the HTML front-end's rules.js:
// (A) appropriateness 1-9 + band by indication x body region (ACR
// Appropriateness Criteria); (B) MRI safety band (cleared / conditional /
// needs-mri-physics-review / contraindicated) from the implant screen, plus a
// gadolinium-vs-eGFR contrast-renal flag; (C) request completeness over
// mandatory fields; (D) triage tier with emergency auto-escalation. Rule IDs
// are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*, R-TRIAGE-*).

import type {
	MriRequest,
	AppropriatenessBand,
	MriSafetyBand,
	ContrastRenalFlag,
	TriageTier,
	FiredRule
} from './types';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------

/** Map of indication -> { ideal:[bodyRegion], plausible:[bodyRegion] }. */
export const INDICATION_REGION_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-malignancy': {
		ideal: ['head-neck', 'chest', 'abdomen', 'pelvis', 'breast', 'whole-body'],
		plausible: ['brain', 'musculoskeletal-joint']
	},
	'cancer-staging': {
		ideal: ['chest', 'abdomen', 'pelvis', 'whole-body', 'breast', 'head-neck'],
		plausible: ['brain', 'spine-thoracic', 'spine-lumbar']
	},
	'neurological-deficit': {
		ideal: ['brain', 'spine-cervical', 'spine-thoracic', 'spine-lumbar'],
		plausible: ['head-neck']
	},
	'suspected-ms': { ideal: ['brain', 'spine-cervical'], plausible: ['spine-thoracic', 'spine-lumbar'] },
	'back-pain-radiculopathy': {
		ideal: ['spine-lumbar', 'spine-cervical', 'spine-thoracic'],
		plausible: ['pelvis']
	},
	'joint-derangement': { ideal: ['musculoskeletal-joint'], plausible: ['spine-lumbar', 'spine-cervical'] },
	'suspected-stroke': { ideal: ['brain', 'mr-angiogram'], plausible: ['head-neck'] },
	epilepsy: { ideal: ['brain'], plausible: [] },
	dementia: { ideal: ['brain'], plausible: [] },
	pituitary: { ideal: ['brain'], plausible: ['head-neck'] },
	'cardiac-function': { ideal: ['cardiac'], plausible: ['chest', 'mr-angiogram'] },
	'follow-up-surveillance': {
		ideal: [
			'brain', 'chest', 'abdomen', 'pelvis', 'whole-body', 'breast', 'musculoskeletal-joint',
			'spine-cervical', 'spine-thoracic', 'spine-lumbar', 'head-neck', 'cardiac', 'mr-angiogram'
		],
		plausible: []
	},
	other: { ideal: [], plausible: [] }
};

/** Result of the appropriateness axis. */
export interface AppropriatenessResult {
	score: number;
	band: AppropriatenessBand;
	firedRule: FiredRule | null;
}

/**
 * Score appropriateness (1-9) for an indication x bodyRegion pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or body region has not yet been chosen.
 */
export function scoreAppropriateness(indication: string, bodyRegion: string): AppropriatenessResult {
	if (!indication || !bodyRegion) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or body region not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_REGION_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(bodyRegion)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `MRI of the ${bodyRegion} is the recommended examination for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(bodyRegion)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `MRI of the ${bodyRegion} may be appropriate for "${indication}" but is not the first-line examination.`
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
			description: `MRI of the ${bodyRegion} is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — MRI safety (ACR Manual on MR Safety / MHRA implant screening)
// ----------------------------------------------------------------------

const SAFETY_ORDER: MriSafetyBand[] = ['cleared', 'conditional', 'needs-mri-physics-review', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
export function maxSafetyBand(a: MriSafetyBand, b: MriSafetyBand): MriSafetyBand {
	const ia = SAFETY_ORDER.indexOf(a);
	const ib = SAFETY_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

interface SafetyRule {
	ruleId: string;
	band: MriSafetyBand;
	fires: (d: MriRequest) => boolean;
	description: string;
}

const SAFETY_RULES: SafetyRule[] = [
	{
		ruleId: 'R-SAFETY-PACEMAKER-ICD',
		band: 'contraindicated',
		fires: (d) => d.safety.pacemakerOrIcd === true,
		description: 'Cardiac pacemaker or ICD present — contraindicated unless MR-conditional and programmed for MRI.'
	},
	{
		ruleId: 'R-SAFETY-ANEURYSM-CLIP',
		band: 'contraindicated',
		fires: (d) => d.safety.aneurysmClip === true,
		description: 'Intracranial aneurysm clip present — contraindicated unless documented MR-conditional / non-ferromagnetic.'
	},
	{
		ruleId: 'R-SAFETY-ORBITAL-FOREIGN-BODY',
		band: 'contraindicated',
		fires: (d) => d.safety.metallicForeignBodyEye === true,
		description: 'Metallic foreign body in the eye / orbit — contraindicated until excluded by orbital radiograph.'
	},
	{
		ruleId: 'R-SAFETY-SHRAPNEL',
		band: 'needs-mri-physics-review',
		fires: (d) => d.safety.shrapnelOrMetalFragments === true,
		description: 'Shrapnel or embedded metal fragments — MR physics review required before scanning.'
	},
	{
		ruleId: 'R-SAFETY-COCHLEAR-IMPLANT',
		band: 'needs-mri-physics-review',
		fires: (d) => d.safety.cochlearImplant === true,
		description: 'Cochlear implant present — confirm MR-conditional labelling and field strength.'
	},
	{
		ruleId: 'R-SAFETY-PROGRAMMABLE-SHUNT',
		band: 'needs-mri-physics-review',
		fires: (d) => d.safety.programmableShunt === true,
		description: 'Programmable CSF shunt present — confirm setting and re-programming after MRI.'
	},
	{
		ruleId: 'R-SAFETY-NEUROSTIMULATOR',
		band: 'needs-mri-physics-review',
		fires: (d) => d.safety.neurostimulator === true,
		description: 'Neurostimulator present — confirm MR-conditional labelling and protocol.'
	},
	{
		ruleId: 'R-SAFETY-INSULIN-PUMP',
		band: 'needs-mri-physics-review',
		fires: (d) => d.safety.insulinPump === true,
		description: 'Insulin pump or external infusion device — must be removed or confirmed MR-conditional.'
	},
	{
		ruleId: 'R-SAFETY-METAL-IMPLANT',
		band: 'conditional',
		fires: (d) => d.safety.metalImplantOrProsthesis === true,
		description: 'Metal implant or prosthesis present — confirm MR-conditional labelling and correct field strength.'
	}
];

/** Result of the MRI safety axis. */
export interface SafetyResult {
	band: MriSafetyBand;
	firedRules: FiredRule[];
}

/** Evaluate the MRI safety band from the implant screen. */
export function scoreSafety(data: MriRequest): SafetyResult {
	let band: MriSafetyBand = 'cleared';
	const firedRules: FiredRule[] = [];

	for (const rule of SAFETY_RULES) {
		if (rule.fires(data)) {
			band = maxSafetyBand(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'safety',
				category: 'implant-screen',
				description: rule.description
			});
		}
	}

	// The referrer's preliminary "unsafe" view also escalates.
	if (
		data.safety.mriSafetyStatus === 'unsafe' &&
		SAFETY_ORDER.indexOf(band) < SAFETY_ORDER.indexOf('needs-mri-physics-review')
	) {
		band = maxSafetyBand(band, 'needs-mri-physics-review');
		firedRules.push({
			ruleId: 'R-SAFETY-REFERRER-UNSAFE',
			axis: 'safety',
			category: 'implant-screen',
			description: 'Referrer flagged a preliminary unsafe status — MR physics review required.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-CLEARED',
			axis: 'safety',
			category: 'implant-screen',
			description: 'No positive MRI safety screen items recorded.'
		});
	}

	return { band, firedRules };
}

/** Result of the contrast-renal sub-check. */
export interface ContrastRenalResult {
	flag: ContrastRenalFlag;
	firedRule: FiredRule | null;
}

/**
 * Compare requested gadolinium contrast against eGFR (ESUR / RCR guidance).
 * eGFR < 30 -> contraindicated (NSF risk); 30-60 -> caution; else none.
 */
export function scoreContrastRenal(data: MriRequest): ContrastRenalResult {
	const gad = data.contrast.contrastRequired === 'iv-gadolinium';
	if (!gad) {
		return { flag: 'none', firedRule: null };
	}
	const egfr = data.contrast.egfr;
	if (egfr === null || egfr === undefined) {
		return {
			flag: 'unknown',
			firedRule: {
				ruleId: 'R-SAFETY-CONTRAST-EGFR-UNKNOWN',
				axis: 'safety',
				category: 'contrast-renal',
				description: 'IV gadolinium requested but eGFR not recorded — obtain renal function before contrast.'
			}
		};
	}
	const n = Number(egfr);
	if (n < 30) {
		return {
			flag: 'contraindicated',
			firedRule: {
				ruleId: 'R-SAFETY-CONTRAST-EGFR-LT30',
				axis: 'safety',
				category: 'contrast-renal',
				description: 'IV gadolinium with eGFR < 30 — contraindicated (nephrogenic-systemic-fibrosis risk).'
			}
		};
	}
	if (n < 60) {
		return {
			flag: 'caution',
			firedRule: {
				ruleId: 'R-SAFETY-CONTRAST-EGFR-30-60',
				axis: 'safety',
				category: 'contrast-renal',
				description: 'IV gadolinium with eGFR 30-60 — use a group II / low-risk agent only when necessary.'
			}
		};
	}
	return { flag: 'none', firedRule: null };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------

interface CompletenessField {
	weight: number;
	present: (d: MriRequest) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 3, present: (d) => !!d.safety.mriSafetyStatus, ruleId: 'R-COMPLETE-SAFETY-SCREEN', label: 'MRI safety screen status' },
	{ weight: 2, present: (d) => !!d.request.bodyRegion, ruleId: 'R-COMPLETE-BODY-REGION', label: 'body region' },
	{ weight: 2, present: (d) => !!d.contrast.contrastRequired, ruleId: 'R-COMPLETE-CONTRAST', label: 'contrast requirement' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/** Result of the completeness axis. */
export interface CompletenessResult {
	percent: number;
	missing: FiredRule[];
}

/** Compute weighted completeness 0-100 and the missing-field rules. */
export function scoreCompleteness(data: MriRequest): CompletenessResult {
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
// Axis D — Triage priority (urgency / red-flag escalation)
// ----------------------------------------------------------------------

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 4-6 weeks',
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
	fires: (d: MriRequest) => boolean;
	description: string;
}

const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-SUSPECTED-STROKE',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'suspected-stroke',
		description: 'Suspected stroke — emergency imaging.'
	},
	{
		ruleId: 'R-TRIAGE-NEUROLOGICAL-DEFICIT',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'neurological-deficit',
		description: 'Neurological deficit — urgent imaging.'
	}
];

/** Result of the triage axis. */
export interface TriageResult {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
}

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: MriRequest): TriageResult {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = (TRIAGE_ORDER as string[]).includes(requested) ? (requested as TriageTier) : 'routine';
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
			description: `No escalation; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
