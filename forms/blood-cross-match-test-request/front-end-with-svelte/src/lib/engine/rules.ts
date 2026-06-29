// Four-axis rule catalogue for the Blood Cross-Match Test Request engine.
//
// Ported from the HTML front-end's `rules.js` source of truth:
//   (A) appropriateness 1-9 + band anchored on NICE NG24 restrictive thresholds
//       and indication appropriateness;
//   (B) identity / sample safety band ok / caution / reject-risk driven by the
//       BSH / SHOT two-sample (group-check) rule, positive patient ID, and
//       labelling;
//   (C) request completeness over mandatory fields, with indication, blood
//       group, and sample status weighted highest;
//   (D) triage tier routine / urgent / emergency / stat with
//       massive-haemorrhage auto-escalation to stat.
//
// Rule IDs are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-IDENTITY-*, R-COMPLETE-*, R-TRIAGE-*).

import type {
	AppropriatenessBand,
	CrossMatchRequest,
	FiredRule,
	IdentitySafetyBand,
	TriageTier
} from './types';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (1-9 ordinal, anchored on NICE NG24)
// ----------------------------------------------------------------------

/** Map of indication -> ideal / plausible request types. */
const INDICATION_REQUEST_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	surgery: { ideal: ['group-and-save', 'crossmatch'], plausible: ['antibody-screen'] },
	'acute-bleeding': { ideal: ['crossmatch', 'emergency-o-negative'], plausible: ['group-and-save'] },
	anaemia: { ideal: ['crossmatch', 'group-and-save'], plausible: ['antibody-screen'] },
	'obstetric-haemorrhage': {
		ideal: ['crossmatch', 'emergency-o-negative'],
		plausible: ['group-and-save']
	},
	'chemotherapy-support': { ideal: ['crossmatch', 'group-and-save'], plausible: ['antibody-screen'] },
	'transfusion-dependent': { ideal: ['crossmatch', 'group-and-save'], plausible: ['antibody-screen'] },
	other: { ideal: [], plausible: [] }
};

/** NICE NG24 restrictive red-cell thresholds, expressed in g/L. */
export const HB_THRESHOLD_DEFAULT = 70;
export const HB_THRESHOLD_ACS = 80;

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1-9) for an indication × requestType pairing, adjusted
 * by NICE NG24 haemoglobin thresholds where a current haemoglobin is supplied.
 */
export function scoreAppropriateness(data: CrossMatchRequest): {
	score: number;
	band: AppropriatenessBand;
	firedRule: FiredRule | null;
} {
	const indication = data.indication.primaryIndication;
	const requestType = data.request.requestType;

	if (!indication || !requestType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or request type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_REQUEST_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');
	let score: number;
	let firedRule: FiredRule;

	if (map.ideal.includes(requestType)) {
		score = 8;
		firedRule = {
			ruleId: `R-APPROP-${indicationKey}-IDEAL`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${requestType} is the recommended test for "${indication}".`
		};
	} else if (map.plausible.includes(requestType)) {
		score = 5;
		firedRule = {
			ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${requestType} may be appropriate for "${indication}" but is not the first-line test.`
		};
	} else if (indication === 'other') {
		score = 5;
		firedRule = {
			ruleId: 'R-APPROP-OTHER',
			axis: 'appropriateness',
			category: 'other',
			description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
		};
	} else {
		score = 2;
		firedRule = {
			ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${requestType} is not usually appropriate for "${indication}"; query the referrer.`
		};
	}

	// NICE NG24 restrictive-threshold adjustment for red-cell transfusion when a
	// non-bleeding indication and a current haemoglobin are supplied.
	const hb = data.indication.currentHaemoglobin;
	const isRedCell =
		data.request.component === 'red-cells' ||
		requestType === 'crossmatch' ||
		requestType === 'emergency-o-negative';
	const isNonBleeding =
		indication === 'anaemia' ||
		indication === 'chemotherapy-support' ||
		indication === 'transfusion-dependent';
	if (hb !== null && hb !== undefined && isRedCell && isNonBleeding) {
		const threshold = data.indication.acuteCoronarySyndrome ? HB_THRESHOLD_ACS : HB_THRESHOLD_DEFAULT;
		const hbNum = Number(hb);
		if (!Number.isNaN(hbNum)) {
			if (hbNum > threshold + 20) {
				score = Math.min(score, 2);
				firedRule = {
					ruleId: 'R-APPROP-NG24-ABOVE-THRESHOLD',
					axis: 'appropriateness',
					category: indication,
					description: `Current haemoglobin ${hbNum} g/L is well above the NICE NG24 restrictive threshold (${threshold} g/L); red-cell transfusion is usually not appropriate.`
				};
			} else if (hbNum > threshold) {
				score = Math.min(score, 5);
				firedRule = {
					ruleId: 'R-APPROP-NG24-NEAR-THRESHOLD',
					axis: 'appropriateness',
					category: indication,
					description: `Current haemoglobin ${hbNum} g/L is above the NICE NG24 restrictive threshold (${threshold} g/L); consider alternatives before transfusing.`
				};
			} else {
				firedRule = {
					ruleId: 'R-APPROP-NG24-BELOW-THRESHOLD',
					axis: 'appropriateness',
					category: indication,
					description: `Current haemoglobin ${hbNum} g/L is at or below the NICE NG24 restrictive threshold (${threshold} g/L); transfusion is appropriate.`
				};
			}
		}
	}

	return { score, band: appropriatenessBand(score), firedRule };
}

// ----------------------------------------------------------------------
// Axis B — Identity / sample safety (BSH / SHOT)
// ----------------------------------------------------------------------

const IDENTITY_ORDER: IdentitySafetyBand[] = ['ok', 'caution', 'reject-risk'];

/** Return whichever of two identity-safety bands is more severe. */
export function worstBand(a: IdentitySafetyBand, b: IdentitySafetyBand): IdentitySafetyBand {
	return IDENTITY_ORDER.indexOf(a) >= IDENTITY_ORDER.indexOf(b) ? a : b;
}

/** Evaluate identity / sample safety and return the band plus fired rules. */
export function scoreIdentitySafety(data: CrossMatchRequest): {
	band: IdentitySafetyBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let band: IdentitySafetyBand = 'ok';

	const needsCompatibility =
		data.request.requestType === 'crossmatch' ||
		data.request.requestType === 'group-and-save' ||
		data.request.requestType === 'antibody-screen';
	const sampleCollected = data.sample.sampleCollected === 'yes';

	// Emergency O-negative bypasses pre-transfusion compatibility safety gating.
	if (data.request.requestType === 'emergency-o-negative') {
		firedRules.push({
			ruleId: 'R-IDENTITY-EMERGENCY-BYPASS',
			axis: 'identity',
			category: 'emergency',
			description:
				'Emergency O-negative request — issued without full compatibility testing in a life-threatening situation.'
		});
		return { band: 'ok', firedRules };
	}

	if (needsCompatibility && sampleCollected && !data.sample.twoSampleRuleMet) {
		band = worstBand(band, 'reject-risk');
		firedRules.push({
			ruleId: 'R-IDENTITY-TWO-SAMPLE-NOT-MET',
			axis: 'identity',
			category: 'two-sample-rule',
			description:
				'BSH / SHOT two-sample (group-check) rule not satisfied; a second independent group sample is required before non-emergency red cells are issued.'
		});
	}

	if (sampleCollected && !data.sample.labellingCheckComplete) {
		band = worstBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-IDENTITY-LABELLING-UNCHECKED',
			axis: 'identity',
			category: 'labelling',
			description:
				'Sample labelling check not confirmed; Wrong Blood in Tube (WBIT) risk — verify hand-written, fully-labelled sample against the patient.'
		});
	}

	if (!data.patient.positivePatientIdConfirmed) {
		band = worstBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-IDENTITY-PATIENT-ID-UNCONFIRMED',
			axis: 'identity',
			category: 'patient-id',
			description:
				'Positive patient identification not confirmed at the bedside; confirm core identifiers before sampling.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-IDENTITY-OK',
			axis: 'identity',
			category: 'ok',
			description:
				'Positive patient ID, labelling, and two-sample rule satisfied (where applicable).'
		});
	}

	return { band, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------

interface CompletenessField {
	weight: number;
	present: (d: CrossMatchRequest) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.indication.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.history.patientBloodGroup && d.history.patientBloodGroup !== 'unknown', ruleId: 'R-COMPLETE-BLOOD-GROUP', label: 'patient blood group' },
	{ weight: 3, present: (d) => d.sample.sampleCollected === 'yes', ruleId: 'R-COMPLETE-SAMPLE', label: 'sample collected' },
	{ weight: 2, present: (d) => !!d.request.requestType, ruleId: 'R-COMPLETE-REQUEST-TYPE', label: 'requested test type' },
	{ weight: 2, present: (d) => !!d.request.component, ruleId: 'R-COMPLETE-COMPONENT', label: 'requested component' },
	{ weight: 2, present: (d) => !!d.indication.clinicalDetails && d.indication.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/** Compute weighted completeness 0-100 and the missing-field rules. */
export function scoreCompleteness(data: CrossMatchRequest): {
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

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency', 'stat'];

export const TARGET_TIMEFRAMES: Record<TriageTier, string> = {
	routine: 'Within 24-48 hours',
	urgent: 'Within 2-4 hours',
	emergency: 'Within 1 hour',
	stat: 'Immediate — issue emergency / O-negative blood now'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: CrossMatchRequest) => boolean;
	description: string;
}

const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-MASSIVE-HAEMORRHAGE',
		tier: 'stat',
		fires: (d) => d.triage.massiveHaemorrhage === true,
		description: 'Declared major / massive haemorrhage — activate the major haemorrhage protocol (stat).'
	},
	{
		ruleId: 'R-TRIAGE-EMERGENCY-O-NEGATIVE',
		tier: 'stat',
		fires: (d) => d.request.requestType === 'emergency-o-negative',
		description: 'Emergency O-negative requested before the group is known — issue immediately (stat).'
	},
	{
		ruleId: 'R-TRIAGE-ACTIVE-BLEEDING',
		tier: 'emergency',
		fires: (d) => d.triage.activeUncontrolledBleeding === true,
		description: 'Active uncontrolled bleeding — emergency provision of compatible blood.'
	},
	{
		ruleId: 'R-TRIAGE-INSTABILITY',
		tier: 'emergency',
		fires: (d) => d.triage.haemodynamicallyUnstable === true,
		description: 'Haemodynamic instability — emergency provision of compatible blood.'
	},
	{
		ruleId: 'R-TRIAGE-OBSTETRIC-HAEMORRHAGE',
		tier: 'emergency',
		fires: (d) => d.indication.primaryIndication === 'obstetric-haemorrhage',
		description: 'Obstetric haemorrhage indication — emergency provision.'
	}
];

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: CrossMatchRequest): {
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
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
