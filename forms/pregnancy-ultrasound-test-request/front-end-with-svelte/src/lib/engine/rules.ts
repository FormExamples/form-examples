// Four-axis rule catalogue for the Pregnancy Ultrasound Test Request engine.
//
// (A) appropriateness 1-9 + band by indication × scan type; (B) gestational-age
// window fit using the scan-window table; (C) request completeness over
// mandatory fields; (D) triage tier with red-flag auto-escalation. Rule IDs are
// stable and identical across every front-end and the back-end (R-APPROP-*,
// R-WINDOW-*, R-COMPLETE-*, R-TRIAGE-*). Pure data + helpers; the grader
// composes them.

import type {
	UltrasoundRequest,
	AppropriatenessBand,
	WindowFit,
	TriageTier,
	ScanType,
	FiredRule
} from './types';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR Appropriateness Criteria 1-9 ordinal)
// ----------------------------------------------------------------------

interface IndicationMap {
	ideal: string[];
	plausible: string[];
}

/** Map of indication → { ideal, plausible } scan types. */
const INDICATION_SCAN_MAP: Record<string, IndicationMap> = {
	dating: { ideal: ['dating', 'viability'], plausible: ['nuchal-translucency'] },
	viability: { ideal: ['viability', 'dating'], plausible: ['reassurance'] },
	'exclude-ectopic': { ideal: ['viability'], plausible: ['dating'] },
	bleeding: {
		ideal: ['viability', 'placental-location'],
		plausible: ['dating', 'reassurance', 'growth']
	},
	pain: { ideal: ['viability'], plausible: ['dating', 'reassurance'] },
	'aneuploidy-screening': { ideal: ['nuchal-translucency'], plausible: ['dating'] },
	'anomaly-screening': { ideal: ['anomaly'], plausible: ['growth'] },
	'suspected-anomaly': { ideal: ['anomaly'], plausible: ['growth', 'doppler'] },
	'growth-restriction': { ideal: ['growth', 'doppler'], plausible: ['liquor-volume'] },
	'large-for-dates': { ideal: ['growth'], plausible: ['liquor-volume', 'dating'] },
	'reduced-fetal-movements': {
		ideal: ['growth', 'doppler'],
		plausible: ['liquor-volume', 'reassurance']
	},
	'multiple-pregnancy': { ideal: ['dating', 'growth'], plausible: ['viability', 'anomaly'] },
	'placental-location': { ideal: ['placental-location', 'anomaly'], plausible: ['growth'] },
	'liquor-assessment': { ideal: ['liquor-volume', 'growth'], plausible: ['doppler'] },
	presentation: { ideal: ['presentation'], plausible: ['growth'] },
	'cervical-assessment': { ideal: ['cervical-length'], plausible: ['anomaly'] },
	'antepartum-haemorrhage': {
		ideal: ['placental-location', 'viability'],
		plausible: ['growth']
	},
	'maternal-condition': { ideal: ['growth', 'doppler'], plausible: ['liquor-volume'] },
	'doppler-surveillance': { ideal: ['doppler', 'growth'], plausible: ['liquor-volume'] },
	'follow-up': {
		ideal: ['growth', 'reassurance'],
		plausible: ['anomaly', 'doppler', 'placental-location']
	},
	other: { ideal: [], plausible: [] }
};

export interface AppropriatenessResult {
	score: number;
	band: AppropriatenessBand;
	firedRule: FiredRule;
}

/**
 * Score appropriateness (1-9) for an indication × scanType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or scan type has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: string,
	scanType: string
): AppropriatenessResult {
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
// Axis B — Gestational-age window fit (ISUOG / NICE NG201 / NHS FASP)
// ----------------------------------------------------------------------

interface ScanWindow {
	scanType: string;
	minDays: number;
	maxDays: number;
}

const SCAN_WINDOWS: ScanWindow[] = [
	{ scanType: 'viability', minDays: 6 * 7, maxDays: 10 * 7 + 6 },
	{ scanType: 'dating', minDays: 11 * 7 + 2, maxDays: 14 * 7 + 1 },
	{ scanType: 'nuchal-translucency', minDays: 11 * 7, maxDays: 14 * 7 },
	{ scanType: 'anomaly', minDays: 18 * 7, maxDays: 20 * 7 + 6 },
	{ scanType: 'cervical-length', minDays: 16 * 7, maxDays: 24 * 7 },
	{ scanType: 'growth', minDays: 26 * 7, maxDays: 42 * 7 },
	{ scanType: 'doppler', minDays: 20 * 7, maxDays: 42 * 7 },
	{ scanType: 'placental-location', minDays: 28 * 7, maxDays: 42 * 7 }
];

/** Scan types with no fixed gestational-age window (any gestation acceptable). */
const WINDOWLESS_SCAN_TYPES = ['presentation', 'liquor-volume', 'reassurance', 'other'];

const WINDOW_BORDER_DAYS = 7; // one week grace either side → borderline

export interface WindowFitResult {
	fit: WindowFit;
	recommendedScanType: ScanType;
	firedRule: FiredRule;
}

/** Evaluate gestational-age window fit for the requested scan type. */
export function evaluateWindowFit(scanType: string, gaDays: number | null): WindowFitResult {
	if (!scanType || gaDays === null || gaDays === undefined) {
		return {
			fit: '',
			recommendedScanType: '',
			firedRule: {
				ruleId: 'R-WINDOW-UNKNOWN',
				axis: 'window',
				category: scanType || 'unspecified',
				description: 'Scan type or gestational age not yet specified — window fit not assessed.'
			}
		};
	}

	if (WINDOWLESS_SCAN_TYPES.includes(scanType)) {
		return {
			fit: 'appropriate',
			recommendedScanType: '',
			firedRule: {
				ruleId: 'R-WINDOW-NO-WINDOW',
				axis: 'window',
				category: scanType,
				description: `${scanType} scan has no fixed gestational-age window.`
			}
		};
	}

	const win = SCAN_WINDOWS.find((w) => w.scanType === scanType);
	if (!win) {
		return {
			fit: 'appropriate',
			recommendedScanType: '',
			firedRule: {
				ruleId: 'R-WINDOW-NO-WINDOW',
				axis: 'window',
				category: scanType,
				description: `No defined window for ${scanType}; treated as appropriate.`
			}
		};
	}

	const scanKey = scanType.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (gaDays >= win.minDays && gaDays <= win.maxDays) {
		return {
			fit: 'appropriate',
			recommendedScanType: '',
			firedRule: {
				ruleId: `R-WINDOW-${scanKey}-FIT`,
				axis: 'window',
				category: scanType,
				description: `Gestation is within the recommended window for a ${scanType} scan.`
			}
		};
	}

	if (gaDays >= win.minDays - WINDOW_BORDER_DAYS && gaDays <= win.maxDays + WINDOW_BORDER_DAYS) {
		return {
			fit: 'borderline',
			recommendedScanType: '',
			firedRule: {
				ruleId: `R-WINDOW-${scanKey}-BORDERLINE`,
				axis: 'window',
				category: scanType,
				description: `Gestation is just outside the ideal window for a ${scanType} scan (borderline).`
			}
		};
	}

	// Clearly outside: recommend whichever windowed scan the gestation fits.
	const recommended = SCAN_WINDOWS.find((w) => gaDays >= w.minDays && gaDays <= w.maxDays);
	return {
		fit: 'outside-window',
		recommendedScanType: (recommended ? recommended.scanType : '') as ScanType,
		firedRule: {
			ruleId: `R-WINDOW-${scanKey}-OUTSIDE`,
			axis: 'window',
			category: scanType,
			description: recommended
				? `Gestation is outside the ${scanType} window; a ${recommended.scanType} scan fits this gestation.`
				: `Gestation is outside the ${scanType} window.`
		}
	};
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------

interface CompletenessField {
	weight: number;
	present: (d: UltrasoundRequest) => boolean;
	ruleId: string;
	label: string;
}

function gestationPresent(d: UltrasoundRequest): boolean {
	return d.dating.gestationalAgeWeeks !== null && d.dating.gestationalAgeWeeks !== undefined;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{
		weight: 3,
		present: (d) => !!d.request.primaryIndication,
		ruleId: 'R-COMPLETE-INDICATION',
		label: 'primary indication'
	},
	{
		weight: 3,
		present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '',
		ruleId: 'R-COMPLETE-CLINICAL-QUESTION',
		label: 'clinical question'
	},
	{
		weight: 2,
		present: (d) => !!d.request.requestedScanType,
		ruleId: 'R-COMPLETE-SCAN-TYPE',
		label: 'requested scan type'
	},
	{
		weight: 2,
		present: (d) => gestationPresent(d),
		ruleId: 'R-COMPLETE-GESTATION',
		label: 'gestational age'
	},
	{
		weight: 1,
		present: (d) => !!d.patient.firstName && !!d.patient.lastName,
		ruleId: 'R-COMPLETE-PATIENT-NAME',
		label: 'patient name'
	},
	{
		weight: 1,
		present: (d) => !!d.patient.nhsNumber,
		ruleId: 'R-COMPLETE-NHS-NUMBER',
		label: 'NHS number'
	},
	{
		weight: 1,
		present: (d) => !!d.patient.dateOfBirth,
		ruleId: 'R-COMPLETE-DOB',
		label: 'date of birth'
	},
	{
		weight: 1,
		present: (d) => !!d.clinician.clinicianName,
		ruleId: 'R-COMPLETE-CLINICIAN',
		label: 'requesting clinician'
	},
	{
		weight: 1,
		present: (d) => !!d.clinician.referralDate,
		ruleId: 'R-COMPLETE-REFERRAL-DATE',
		label: 'referral date'
	},
	{
		weight: 1,
		present: (d) => !!d.triage.urgency,
		ruleId: 'R-COMPLETE-URGENCY',
		label: 'requested urgency'
	}
];

export interface CompletenessResult {
	percent: number;
	missing: FiredRule[];
}

/** Compute weighted completeness 0-100 and the missing-field rules. */
export function scoreCompleteness(data: UltrasoundRequest): CompletenessResult {
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

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'soon', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 4-6 weeks',
	soon: 'Within 1-2 weeks',
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
	fires: (d: UltrasoundRequest) => boolean;
	description: string;
}

const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-INSTABILITY',
		tier: 'emergency',
		fires: (d) => d.symptoms.haemodynamicallyUnstable === true,
		description: 'Haemodynamic instability — emergency assessment.'
	},
	{
		ruleId: 'R-TRIAGE-SUSPECTED-ECTOPIC',
		tier: 'emergency',
		fires: (d) => d.symptoms.suspectedEctopic === true,
		description: 'Suspected ectopic pregnancy — emergency assessment.'
	},
	{
		ruleId: 'R-TRIAGE-HEAVY-BLEEDING',
		tier: 'urgent',
		fires: (d) => d.symptoms.vaginalBleeding === 'heavy',
		description: 'Heavy vaginal bleeding — urgent assessment.'
	},
	{
		ruleId: 'R-TRIAGE-SEVERE-PAIN',
		tier: 'urgent',
		fires: (d) => d.symptoms.abdominalPain === 'severe',
		description: 'Severe abdominal pain — urgent assessment.'
	},
	{
		ruleId: 'R-TRIAGE-REDUCED-MOVEMENTS',
		tier: 'urgent',
		fires: (d) => d.symptoms.reducedFetalMovements === true,
		description: 'Reduced fetal movements — urgent assessment.'
	},
	{
		ruleId: 'R-TRIAGE-MODERATE-BLEEDING',
		tier: 'soon',
		fires: (d) => d.symptoms.vaginalBleeding === 'moderate',
		description: 'Moderate vaginal bleeding — expedited assessment.'
	},
	{
		ruleId: 'R-TRIAGE-MODERATE-PAIN',
		tier: 'soon',
		fires: (d) => d.symptoms.abdominalPain === 'moderate',
		description: 'Moderate abdominal pain — expedited assessment.'
	}
];

export interface TriageResult {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
}

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: UltrasoundRequest): TriageResult {
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
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
