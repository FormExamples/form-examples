// Four-axis rule catalogue for the Biopsy Test Request engine.
//
// Ported verbatim from the HTML reference engine (front-end-form-with-html/js
// /rules.js): (A) appropriateness 1-9 + band by indication × biopsy site;
// (B) periprocedural bleeding-risk band (low/moderate/high) from anticoagulant
// / antiplatelet use, INR, platelet count, and bleeding disorder, plus a
// recommended anticoagulant action; (C) request completeness over mandatory
// fields; (D) urgency / cancer-pathway triage with two-week-wait eligibility.
// Rule IDs are stable and identical across every front-end and the back-end.

import type {
	AppropriatenessBand,
	BiopsyRequestData,
	BleedingRiskBand,
	FiredRule,
	TriageTier
} from './types';

/** True when a numeric/date value has been supplied. */
function hasValue(v: unknown): boolean {
	return v !== null && v !== undefined && v !== '';
}

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------

/** Map of indication → ideal / plausible biopsy sites. */
export const INDICATION_SITE_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-malignancy': {
		ideal: ['skin', 'breast', 'prostate', 'lung', 'gi-tract', 'lymph-node', 'soft-tissue', 'thyroid', 'bone-marrow'],
		plausible: ['liver', 'kidney']
	},
	'cancer-staging': {
		ideal: ['lymph-node', 'breast', 'liver', 'bone-marrow'],
		plausible: ['lung', 'soft-tissue', 'skin']
	},
	'suspected-infection': {
		ideal: ['lung', 'liver'],
		plausible: ['lymph-node', 'kidney', 'skin', 'bone-marrow']
	},
	'inflammatory-disease': {
		ideal: ['kidney', 'gi-tract', 'liver'],
		plausible: ['skin', 'soft-tissue']
	},
	'transplant-monitoring': {
		ideal: ['kidney', 'liver'],
		plausible: ['bone-marrow']
	},
	lymphadenopathy: {
		ideal: ['lymph-node'],
		plausible: ['bone-marrow', 'soft-tissue']
	},
	'characterise-lesion': {
		ideal: ['skin', 'liver', 'thyroid', 'soft-tissue', 'bone-marrow'],
		plausible: ['breast', 'kidney', 'lung', 'lymph-node']
	},
	other: { ideal: [], plausible: [] }
};

export interface AppropriatenessResult {
	score: number;
	band: AppropriatenessBand;
	firedRule: FiredRule | null;
}

/**
 * Score appropriateness (1-9) for an indication × biopsySite pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or site has not yet been chosen.
 */
export function scoreAppropriateness(indication: string, biopsySite: string): AppropriatenessResult {
	if (!indication || !biopsySite) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or biopsy site not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_SITE_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(biopsySite)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `A ${biopsySite} biopsy is a recommended target for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(biopsySite)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `A ${biopsySite} biopsy may be appropriate for "${indication}" but is not first-line.`
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
			description: `A ${biopsySite} biopsy is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Periprocedural bleeding risk (BSG / ESGE & BSIR stratification)
// ----------------------------------------------------------------------

export const BLEEDING_ORDER: BleedingRiskBand[] = ['low', 'moderate', 'high'];

/** Return whichever of two bleeding-risk bands is more severe. */
export function maxBand(a: BleedingRiskBand, b: BleedingRiskBand): BleedingRiskBand {
	return BLEEDING_ORDER.indexOf(a) >= BLEEDING_ORDER.indexOf(b) ? a : b;
}

interface BleedingRuleDef {
	ruleId: string;
	band: BleedingRiskBand;
	fires: (d: BiopsyRequestData) => boolean;
	category: string;
	description: string;
}

// Each rule forces at least the given band when it fires.
const BLEEDING_RULES: BleedingRuleDef[] = [
	{
		ruleId: 'R-BLEED-DISORDER',
		band: 'high',
		fires: (d) => d.bleeding.bleedingDisorder === true,
		category: 'coagulopathy',
		description: 'Known bleeding disorder / coagulopathy — high periprocedural bleeding risk.'
	},
	{
		ruleId: 'R-BLEED-INR-HIGH',
		band: 'high',
		fires: (d) => hasValue(d.bleeding.inr) && Number(d.bleeding.inr) >= 1.5,
		category: 'coagulopathy',
		description: 'INR ≥ 1.5 — correction usually required before biopsy (high risk).'
	},
	{
		ruleId: 'R-BLEED-PLATELETS-LOW',
		band: 'high',
		fires: (d) => hasValue(d.bleeding.plateletCount) && Number(d.bleeding.plateletCount) < 50,
		category: 'thrombocytopenia',
		description: 'Platelet count < 50 ×10⁹/L — severe thrombocytopenia (high risk).'
	},
	{
		ruleId: 'R-BLEED-ANTICOAG',
		band: 'high',
		fires: (d) => d.bleeding.takingAnticoagulant === true,
		category: 'anticoagulant',
		description: 'Patient on an anticoagulant — high periprocedural bleeding risk.'
	},
	{
		ruleId: 'R-BLEED-PLATELETS-BORDERLINE',
		band: 'moderate',
		fires: (d) =>
			hasValue(d.bleeding.plateletCount) &&
			Number(d.bleeding.plateletCount) >= 50 &&
			Number(d.bleeding.plateletCount) < 100,
		category: 'thrombocytopenia',
		description: 'Platelet count 50–99 ×10⁹/L — borderline thrombocytopenia (moderate risk).'
	},
	{
		ruleId: 'R-BLEED-INR-BORDERLINE',
		band: 'moderate',
		fires: (d) =>
			hasValue(d.bleeding.inr) && Number(d.bleeding.inr) >= 1.3 && Number(d.bleeding.inr) < 1.5,
		category: 'coagulopathy',
		description: 'INR 1.3–1.49 — mildly deranged clotting (moderate risk).'
	},
	{
		ruleId: 'R-BLEED-ANTIPLATELET',
		band: 'moderate',
		fires: (d) => d.bleeding.takingAntiplatelet === true,
		category: 'antiplatelet',
		description: 'Patient on an antiplatelet agent — moderate periprocedural bleeding risk.'
	}
];

export interface BleedingResult {
	band: BleedingRiskBand;
	anticoagulantAction: string;
	firedRules: FiredRule[];
}

/** Compute the bleeding-risk band, recommended action, and fired bleeding rules. */
export function scoreBleedingRisk(data: BiopsyRequestData): BleedingResult {
	let band: BleedingRiskBand = 'low';
	const firedRules: FiredRule[] = [];

	for (const rule of BLEEDING_RULES) {
		if (rule.fires(data)) {
			band = maxBand(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'bleeding-risk',
				category: rule.category,
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-BLEED-BASELINE',
			axis: 'bleeding-risk',
			category: 'baseline',
			description: 'No anticoagulant / antiplatelet, normal coagulation — baseline low bleeding risk.'
		});
	}

	return {
		band,
		anticoagulantAction: anticoagulantAction(band, data),
		firedRules
	};
}

/** Recommend a periprocedural anticoagulant / antiplatelet action for the band. */
export function anticoagulantAction(band: BleedingRiskBand, data: BiopsyRequestData): string {
	if (band === 'high') {
		const parts: string[] = [];
		if (data.bleeding.takingAnticoagulant) {
			parts.push(
				`withhold the anticoagulant${data.bleeding.anticoagulantAgent ? ` (${data.bleeding.anticoagulantAgent})` : ''} per BSG / ESGE timing and consider bridging`
			);
		}
		if (data.bleeding.bleedingDisorder)
			parts.push('liaise with haematology and arrange factor / product cover');
		if (hasValue(data.bleeding.inr) && Number(data.bleeding.inr) >= 1.5)
			parts.push('correct the INR to < 1.5');
		if (hasValue(data.bleeding.plateletCount) && Number(data.bleeding.plateletCount) < 50)
			parts.push('transfuse platelets to ≥ 50 ×10⁹/L');
		if (parts.length === 0) parts.push('optimise coagulation before the procedure');
		return `High bleeding risk: ${parts.join('; ')}.`;
	}
	if (band === 'moderate') {
		const parts: string[] = [];
		if (data.bleeding.takingAntiplatelet)
			parts.push(
				`review the antiplatelet${data.bleeding.antiplateletAgent ? ` (${data.bleeding.antiplateletAgent})` : ''}; continue aspirin but consider withholding a P2Y12 inhibitor`
			);
		parts.push('confirm a recent platelet count and clotting screen');
		return `Moderate bleeding risk: ${parts.join('; ')}.`;
	}
	return 'Low bleeding risk: proceed without specific anticoagulant action; standard haemostasis precautions.';
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------

interface CompletenessField {
	weight: number;
	present: (d: BiopsyRequestData) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.indication.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.indication.clinicalQuestion && d.indication.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.procedure.biopsySite, ruleId: 'R-COMPLETE-BIOPSY-SITE', label: 'biopsy site' },
	{ weight: 2, present: (d) => !!d.procedure.biopsyMethod, ruleId: 'R-COMPLETE-BIOPSY-METHOD', label: 'biopsy method' },
	{ weight: 1, present: (d) => !!d.lesion.lesionDescription && d.lesion.lesionDescription.trim() !== '', ruleId: 'R-COMPLETE-LESION', label: 'lesion description' },
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
export function scoreCompleteness(data: BiopsyRequestData): CompletenessResult {
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
// Axis D — Urgency / cancer-pathway triage (NICE NG12)
// ----------------------------------------------------------------------

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'two-week-wait', 'emergency'];

export const TARGET_TIMEFRAMES: Record<TriageTier, string> = {
	routine: 'Within 6 weeks',
	urgent: 'Within 1-2 weeks',
	'two-week-wait': 'Within 14 days (suspected-cancer pathway)',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

// Indications that meet NICE NG12 suspected-cancer two-week-wait eligibility.
export const TWO_WEEK_WAIT_INDICATIONS = ['suspected-malignancy', 'cancer-staging'];

export interface TriageResult {
	tier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	firedRules: FiredRule[];
}

/** Compute the triage tier, target timeframe, 2WW eligibility, and fired rules. */
export function scoreTriage(data: BiopsyRequestData): TriageResult {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = (TRIAGE_ORDER as string[]).includes(requested)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];
	let twoWeekWaitEligible = false;

	if (TWO_WEEK_WAIT_INDICATIONS.includes(data.indication.primaryIndication)) {
		twoWeekWaitEligible = true;
		tier = maxTier(tier, 'two-week-wait');
		firedRules.push({
			ruleId: 'R-TRIAGE-SUSPECTED-CANCER',
			axis: 'urgency',
			category: 'suspected-cancer',
			description: `A "${data.indication.primaryIndication}" indication meets NICE NG12 two-week-wait eligibility.`
		});
	}

	if (data.triage.urgency === 'emergency') {
		tier = maxTier(tier, 'emergency');
		firedRules.push({
			ruleId: 'R-TRIAGE-EMERGENCY',
			axis: 'urgency',
			category: 'requested',
			description: 'Emergency urgency requested — same-day assessment.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'urgency',
			category: 'requested',
			description: `No cancer-pathway escalation; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		twoWeekWaitEligible,
		firedRules
	};
}
