// Four-axis rule catalogue for the Angiography Test Request engine.
//
// (A) appropriateness 1-9 + band by indication × angiography type (ACR
// Appropriateness Criteria / RCR iRefer); (B) contrast / radiation safety band
// ok/caution/contraindicated driven by eGFR, contrast allergy, anticoagulation,
// pregnancy, and metformin (ESUR / IR(ME)R); (C) request completeness over
// mandatory fields; (D) triage tier routine/urgent/emergency with acuity
// escalation. Rule IDs are stable and identical across every front-end and the
// back-end (R-APPROP-*, R-SAFETY-*, R-COMPLETE-*, R-TRIAGE-*). Pure data +
// helpers; the grader composes them.

import type {
	AppropriatenessBand,
	FiredRule,
	RequestData,
	SafetyBand,
	TriageTier
} from './types';
import { usesIonisingRadiation } from './utils';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------

/** Map of indication -> { ideal, plausible } angiography types. */
export const INDICATION_TYPE_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-coronary-disease': {
		ideal: ['ct-angiography', 'coronary-angiography'],
		plausible: ['catheter-dsa']
	},
	'peripheral-arterial-disease': {
		ideal: ['ct-angiography', 'mr-angiography', 'peripheral-angiography'],
		plausible: ['catheter-dsa']
	},
	aneurysm: {
		ideal: ['ct-angiography', 'mr-angiography'],
		plausible: ['catheter-dsa', 'cerebral-angiography']
	},
	stenosis: {
		ideal: ['ct-angiography', 'mr-angiography'],
		plausible: ['catheter-dsa', 'peripheral-angiography']
	},
	'suspected-pulmonary-embolism': { ideal: ['ct-angiography'], plausible: ['catheter-dsa'] },
	'gi-bleeding': { ideal: ['ct-angiography', 'catheter-dsa'], plausible: ['mr-angiography'] },
	'pre-intervention-planning': {
		ideal: ['ct-angiography', 'catheter-dsa'],
		plausible: ['mr-angiography', 'peripheral-angiography']
	},
	'suspected-stroke': {
		ideal: ['ct-angiography', 'cerebral-angiography'],
		plausible: ['mr-angiography', 'catheter-dsa']
	},
	other: { ideal: [], plausible: [] }
};

export interface AppropriatenessResult {
	score: number;
	band: AppropriatenessBand;
	firedRule: FiredRule | null;
}

/**
 * Score appropriateness (1-9) for an indication × angiographyType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or angiography type has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: string,
	angiographyType: string
): AppropriatenessResult {
	if (!indication || !angiographyType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description:
					'Indication or angiography type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_TYPE_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(angiographyType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${angiographyType} is a recommended examination for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(angiographyType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${angiographyType} may be appropriate for "${indication}" but is not the first-line examination.`
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
			description: `Requested ${angiographyType} is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Contrast / radiation safety (ESUR Contrast Media + IR(ME)R)
// ----------------------------------------------------------------------

export const SAFETY_ORDER: SafetyBand[] = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
export function maxBand(a: SafetyBand, b: SafetyBand): SafetyBand {
	return SAFETY_ORDER.indexOf(a) >= SAFETY_ORDER.indexOf(b) ? a : b;
}

interface SafetyRule {
	ruleId: string;
	band: SafetyBand;
	fires: (d: RequestData) => boolean;
	description: string;
}

export const SAFETY_RULES: SafetyRule[] = [
	{
		ruleId: 'R-SAFETY-EGFR-SEVERE',
		band: 'contraindicated',
		fires: (d) =>
			d.contrast.contrastRequired === 'iodinated' &&
			d.contrast.egfr !== null &&
			d.contrast.egfr !== undefined &&
			d.contrast.egfr < 30,
		description:
			'eGFR < 30 with iodinated contrast — high post-contrast acute kidney injury risk.'
	},
	{
		ruleId: 'R-SAFETY-CONTRAST-ALLERGY',
		band: 'contraindicated',
		fires: (d) =>
			d.contrast.contrastAllergy === true &&
			(d.contrast.contrastRequired === 'iodinated' ||
				d.contrast.contrastRequired === 'gadolinium'),
		description: 'Previous contrast-media allergy with a contrast-requiring examination.'
	},
	{
		ruleId: 'R-SAFETY-PREGNANCY-RADIATION',
		band: 'contraindicated',
		fires: (d) =>
			d.pregnancy.pregnancyStatus === 'pregnant' &&
			usesIonisingRadiation(d.request.angiographyType),
		description:
			'Pregnancy with an ionising-radiation examination — justify under IR(ME)R or use a non-ionising alternative.'
	},
	{
		ruleId: 'R-SAFETY-BLEEDING-ANTICOAG',
		band: 'contraindicated',
		fires: (d) =>
			d.request.angiographyType === 'catheter-dsa' &&
			d.bleeding.takingAnticoagulant === true &&
			d.bleeding.bleedingDisorder === true,
		description:
			'Catheter / DSA with anticoagulation and a bleeding disorder — high arterial-access bleeding risk.'
	},
	{
		ruleId: 'R-SAFETY-EGFR-MODERATE',
		band: 'caution',
		fires: (d) =>
			d.contrast.contrastRequired === 'iodinated' &&
			d.contrast.egfr !== null &&
			d.contrast.egfr !== undefined &&
			d.contrast.egfr >= 30 &&
			d.contrast.egfr < 45,
		description:
			'eGFR 30-44 with iodinated contrast — use renal-protective hydration and minimise contrast volume.'
	},
	{
		ruleId: 'R-SAFETY-METFORMIN-CONTRAST',
		band: 'caution',
		fires: (d) => d.contrast.metformin === true && d.contrast.contrastRequired === 'iodinated',
		description: 'Metformin with iodinated contrast — review per ESUR guidance based on eGFR.'
	},
	{
		ruleId: 'R-SAFETY-PREGNANCY-POSSIBLE',
		band: 'caution',
		fires: (d) =>
			(d.pregnancy.pregnancyStatus === 'possible' || d.pregnancy.pregnancyStatus === 'unknown') &&
			usesIonisingRadiation(d.request.angiographyType),
		description:
			'Possible / unknown pregnancy with an ionising-radiation examination — confirm pregnancy status.'
	},
	{
		ruleId: 'R-SAFETY-ANTICOAG-CATHETER',
		band: 'caution',
		fires: (d) =>
			d.request.angiographyType === 'catheter-dsa' &&
			(d.bleeding.takingAnticoagulant === true || d.bleeding.takingAntiplatelet === true),
		description:
			'Catheter / DSA on anticoagulant / antiplatelet — review peri-procedural bridging and access plan.'
	}
];

export interface SafetyResult {
	band: SafetyBand;
	firedRules: FiredRule[];
}

/** Compute the contrast / radiation safety band and fired safety rules. */
export function scoreSafety(data: RequestData): SafetyResult {
	let band: SafetyBand = 'ok';
	const firedRules: FiredRule[] = [];

	for (const rule of SAFETY_RULES) {
		if (rule.fires(data)) {
			band = maxBand(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'safety',
				category: 'safety',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-OK',
			axis: 'safety',
			category: 'safety',
			description: 'No contrast or radiation safety concerns identified.'
		});
	}

	return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------

interface CompletenessField {
	weight: number;
	present: (d: RequestData) => boolean;
	ruleId: string;
	label: string;
}

export const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.request.angiographyType, ruleId: 'R-COMPLETE-ANGIOGRAPHY-TYPE', label: 'angiography type' },
	{ weight: 2, present: (d) => !!d.request.bodyRegion, ruleId: 'R-COMPLETE-BODY-REGION', label: 'body region' },
	{ weight: 1, present: (d) => !!d.contrast.contrastRequired, ruleId: 'R-COMPLETE-CONTRAST', label: 'contrast requirement' },
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
export function scoreCompleteness(data: RequestData): CompletenessResult {
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
// Axis D — Triage priority (acuity escalation)
// ----------------------------------------------------------------------

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

export const TARGET_TIMEFRAMES: Record<TriageTier, string> = {
	routine: 'Within 4-6 weeks',
	urgent: 'Within 24-72 hours',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: RequestData) => boolean;
	description: string;
}

export const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-GI-BLEEDING',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'gi-bleeding',
		description: 'Active GI bleeding indication — emergency angiography.'
	},
	{
		ruleId: 'R-TRIAGE-PULMONARY-EMBOLISM',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'suspected-pulmonary-embolism',
		description: 'Suspected pulmonary embolism — emergency CT pulmonary angiography.'
	},
	{
		ruleId: 'R-TRIAGE-STROKE',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'suspected-stroke',
		description: 'Suspected acute stroke — emergency assessment within the treatment window.'
	},
	{
		ruleId: 'R-TRIAGE-ANEURYSM',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'aneurysm',
		description: 'Aneurysm indication — urgent assessment to exclude rupture / leak.'
	},
	{
		ruleId: 'R-TRIAGE-PRE-INTERVENTION',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'pre-intervention-planning',
		description: 'Pre-intervention planning — expedite to support a planned procedure.'
	}
];

export interface TriageResult {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
}

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: RequestData): TriageResult {
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
				category: 'acuity',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `No acuity escalation; triage follows the requested urgency (${tier}).`
		});
	}

	return { tier, targetTimeframe: TARGET_TIMEFRAMES[tier] || '', firedRules };
}
