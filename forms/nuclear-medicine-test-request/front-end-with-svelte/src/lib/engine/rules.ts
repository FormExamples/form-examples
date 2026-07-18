// Four-axis rule catalogue for the Nuclear Medicine Test Request engine.
//
// Ported verbatim (logic + rule IDs) from the HTML front-end's rules.js:
// (A) appropriateness 1-9 + band by indication x scan type (ACR
// Appropriateness Criteria / RCR iRefer); (B) preparation & radiation-safety
// band (ok / caution / contraindicated) from pregnancy / breastfeeding /
// recent radionuclide scan / eGFR, plus a radiation effective-dose band (low /
// moderate / high) from the requested scan type; (C) request completeness over
// mandatory fields; (D) triage tier (routine / urgent / emergency) with
// high-acuity auto-escalation. Rule IDs are stable and identical across every
// front-end and the back-end (R-APPROP-*, R-SAFETY-*, R-DOSE-*, R-COMPLETE-*,
// R-TRIAGE-*).

import type {
	NuclearMedicineRequest,
	AppropriatenessBand,
	PrepSafetyBand,
	RadiationDoseBand,
	TriageTier,
	FiredRule
} from './types';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria / RCR iRefer 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal scan type (or set of types). When the
// requested scan type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

/** Map of indication -> { ideal:[scanType], plausible:[scanType] }. */
export const INDICATION_SCAN_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-bone-metastases': { ideal: ['bone-scan'], plausible: ['gallium-octreotide', 'white-cell-scan'] },
	'cardiac-ischaemia': { ideal: ['myocardial-perfusion'], plausible: [] },
	'pulmonary-embolism': { ideal: ['vq-lung-scan'], plausible: [] },
	'thyroid-function': { ideal: ['thyroid-uptake'], plausible: [] },
	'renal-function': { ideal: ['renal-mag3', 'renal-dmsa'], plausible: [] },
	'infection-localisation': { ideal: ['white-cell-scan', 'gallium-octreotide'], plausible: ['bone-scan'] },
	'tumour-localisation': { ideal: ['gallium-octreotide'], plausible: ['bone-scan', 'white-cell-scan'] },
	'sentinel-node-mapping': { ideal: ['sentinel-node'], plausible: [] },
	other: { ideal: [], plausible: [] }
};

/** Result of the appropriateness axis. */
export interface AppropriatenessResult {
	score: number;
	band: AppropriatenessBand;
	firedRule: FiredRule | null;
}

/**
 * Score appropriateness (1-9) for an indication x scanType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or scan type has not yet been chosen.
 */
export function scoreAppropriateness(indication: string, scanType: string): AppropriatenessResult {
	if (!indication || !scanType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or scan type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_SCAN_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(scanType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${scanType} scan is the recommended examination for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(scanType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${scanType} scan may be appropriate for "${indication}" but is not the first-line examination.`
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
			description: `Requested ${scanType} scan is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B (part 1) — Radiation effective-dose band (ICRP / EANM-SNMMI)
// ----------------------------------------------------------------------
//
// Each radiopharmaceutical / scan type carries a characteristic effective-dose
// band: low, moderate, or high. Taken from the scan-type / dose-band map in
// index.md.

export const SCAN_DOSE_BAND: Record<string, RadiationDoseBand> = {
	'bone-scan': 'moderate',
	'myocardial-perfusion': 'high',
	'vq-lung-scan': 'low',
	'thyroid-uptake': 'low',
	'renal-dmsa': 'low',
	'renal-mag3': 'low',
	'gallium-octreotide': 'high',
	'white-cell-scan': 'moderate',
	'sentinel-node': 'low',
	other: ''
};

/** Result of the radiation-dose sub-check. */
export interface RadiationDoseResult {
	band: RadiationDoseBand;
	firedRule: FiredRule | null;
}

/** Determine the radiation effective-dose band for the requested scan type. */
export function radiationDoseBand(scanType: string): RadiationDoseResult {
	if (!scanType) {
		return {
			band: '',
			firedRule: {
				ruleId: 'R-DOSE-UNKNOWN',
				axis: 'safety',
				category: 'radiation-dose',
				description: 'Scan type not yet specified — radiation-dose band not assessed.'
			}
		};
	}
	const band = SCAN_DOSE_BAND[scanType] || '';
	const scanKey = scanType.toUpperCase().replace(/[^A-Z]+/g, '-');
	if (!band) {
		return {
			band: '',
			firedRule: {
				ruleId: `R-DOSE-${scanKey}-UNKNOWN`,
				axis: 'safety',
				category: 'radiation-dose',
				description: `No defined effective-dose band for ${scanType}; confirm with the radiopharmacy.`
			}
		};
	}
	return {
		band,
		firedRule: {
			ruleId: `R-DOSE-${scanKey}-${band.toUpperCase()}`,
			axis: 'safety',
			category: 'radiation-dose',
			description: `A ${scanType} scan carries a ${band} effective-dose band.`
		}
	};
}

// ----------------------------------------------------------------------
// Axis B (part 2) — Preparation & radiation-safety band (ARSAC / IR(ME)R)
// ----------------------------------------------------------------------
//
// Pregnancy, breastfeeding, and recent interfering radionuclide studies drive
// the prep-safety band toward caution or contraindicated, regardless of the
// other axes. The most-severe band wins. A high radiation dose lifts an
// otherwise-OK band to caution.

const PREP_ORDER: PrepSafetyBand[] = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two prep-safety bands is more severe. */
export function maxPrepBand(a: PrepSafetyBand, b: PrepSafetyBand): PrepSafetyBand {
	const ia = PREP_ORDER.indexOf(a);
	const ib = PREP_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

interface PrepSafetyRule {
	ruleId: string;
	band: PrepSafetyBand;
	fires: (d: NuclearMedicineRequest) => boolean;
	description: string;
}

// Each rule forces at least the given band when it fires.
const PREP_SAFETY_RULES: PrepSafetyRule[] = [
	{
		ruleId: 'R-SAFETY-PREGNANT',
		band: 'contraindicated',
		fires: (d) => d.safety.pregnancyStatus === 'pregnant',
		description: 'Confirmed pregnancy — radionuclide administration is contraindicated pending justification.'
	},
	{
		ruleId: 'R-SAFETY-POSSIBLE-PREGNANCY',
		band: 'caution',
		fires: (d) => d.safety.pregnancyStatus === 'possible' || d.safety.pregnancyStatus === 'unknown',
		description: 'Possible or unknown pregnancy status — confirm before administration.'
	},
	{
		ruleId: 'R-SAFETY-BREASTFEEDING',
		band: 'caution',
		fires: (d) => d.safety.breastfeeding === true,
		description: 'Breastfeeding — radiopharmaceutical choice and interruption advice required.'
	},
	{
		ruleId: 'R-SAFETY-RECENT-RADIONUCLIDE',
		band: 'caution',
		fires: (d) => d.safety.recentOtherNuclearScan === true,
		description: 'Recent other radionuclide study — residual activity may interfere; confirm timing.'
	},
	{
		ruleId: 'R-SAFETY-LOW-EGFR',
		band: 'caution',
		fires: (d) => d.safety.egfr !== null && d.safety.egfr !== undefined && Number(d.safety.egfr) < 30,
		description: 'Reduced renal function (eGFR < 30) — review radiopharmaceutical handling.'
	}
];

/** Result of the preparation & radiation-safety axis. */
export interface PrepSafetyResult {
	band: PrepSafetyBand;
	firedRules: FiredRule[];
}

/**
 * Compute the preparation & radiation-safety band and the fired safety rules.
 *
 * @param data the request data model
 * @param doseBand the radiation-dose band from radiationDoseBand()
 */
export function scorePrepSafety(data: NuclearMedicineRequest, doseBand: RadiationDoseBand): PrepSafetyResult {
	let band: PrepSafetyBand = 'ok';
	const firedRules: FiredRule[] = [];

	for (const rule of PREP_SAFETY_RULES) {
		if (rule.fires(data)) {
			band = maxPrepBand(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'safety',
				category: 'prep-safety',
				description: rule.description
			});
		}
	}

	// A high effective-dose study lifts an otherwise-OK band to caution.
	if (band === 'ok' && doseBand === 'high') {
		band = 'caution';
		firedRules.push({
			ruleId: 'R-SAFETY-HIGH-DOSE',
			axis: 'safety',
			category: 'prep-safety',
			description: 'High effective-dose study — ensure justification and ALARA optimisation.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-OK',
			axis: 'safety',
			category: 'prep-safety',
			description: 'No preparation or radiation-safety concerns identified.'
		});
	}

	return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication and clinical question are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present.

interface CompletenessField {
	weight: number;
	present: (d: NuclearMedicineRequest) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.request.scanType, ruleId: 'R-COMPLETE-SCAN-TYPE', label: 'requested scan type' },
	{ weight: 2, present: (d) => !!d.justification.irMeRJustification && d.justification.irMeRJustification.trim() !== '', ruleId: 'R-COMPLETE-JUSTIFICATION', label: 'IR(ME)R justification' },
	{ weight: 2, present: (d) => !!d.safety.pregnancyStatus, ruleId: 'R-COMPLETE-PREGNANCY-STATUS', label: 'pregnancy status' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => d.patient.weightKg !== null && d.patient.weightKg !== undefined, ruleId: 'R-COMPLETE-WEIGHT', label: 'patient weight' },
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
export function scoreCompleteness(data: NuclearMedicineRequest): CompletenessResult {
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
//
// A base tier is taken from the clinician's requested urgency, then
// high-acuity indications auto-escalate it. The most-severe escalation wins.

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
	fires: (d: NuclearMedicineRequest) => boolean;
	description: string;
}

const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-SUSPECTED-PE',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'pulmonary-embolism' && d.request.scanType === 'vq-lung-scan',
		description: 'Suspected pulmonary embolism — emergency V/Q assessment.'
	},
	{
		ruleId: 'R-TRIAGE-ACUTE-INFECTION',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'infection-localisation',
		description: 'Infection localisation — urgent assessment.'
	},
	{
		ruleId: 'R-TRIAGE-CARDIAC-ISCHAEMIA',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'cardiac-ischaemia',
		description: 'Cardiac ischaemia query — expedited assessment.'
	}
];

/** Result of the triage axis. */
export interface TriageResult {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
}

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: NuclearMedicineRequest): TriageResult {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = (TRIAGE_ORDER as string[]).includes(requested) ? (requested as TriageTier) : 'routine';
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

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
