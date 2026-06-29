// Four-axis rule catalogue for the Cystoscopy Test Request engine.
//
// Ported verbatim (rule IDs preserved) from the HTML front-end's js/rules.js:
//   (A) appropriateness 1-9 + band by indication x procedure (NICE NG12 /
//       BAUS haematuria);
//   (B) cancer-pathway urgency: triage tier routine / urgent / two-week-wait /
//       emergency with NICE NG12 two-week-wait eligibility (visible haematuria
//       age >= 45; non-visible age >= 60 with dysuria);
//   (C) request completeness over mandatory fields, indication + clinical
//       question weighted highest;
//   (D) pre-procedure risk: low / moderate / high band from anticoagulant /
//       antiplatelet / active-UTI rules, with an anticoagulant action.
//
// Rule IDs are stable and identical across every front-end and the back-end
// (R-APPROP-*, R-URGENCY-*, R-COMPLETE-*, R-RISK-*).

import type {
	CystoscopyRequest,
	AppropriatenessBand,
	FiredRule,
	Indication,
	Procedure,
	TriageTier,
	RiskBand
} from './types';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (NICE NG12 / BAUS haematuria; 1-9 ordinal)
// ----------------------------------------------------------------------

interface ProcedureMap {
	ideal: Procedure[];
	plausible: Procedure[];
}

const INDICATION_PROCEDURE_MAP: Record<string, ProcedureMap> = {
	'visible-haematuria': { ideal: ['flexible-cystoscopy', 'rigid-cystoscopy'], plausible: [] },
	'non-visible-haematuria': { ideal: ['flexible-cystoscopy'], plausible: ['rigid-cystoscopy'] },
	'suspected-bladder-tumour': { ideal: ['flexible-cystoscopy', 'rigid-cystoscopy'], plausible: [] },
	'bladder-cancer-surveillance': { ideal: ['flexible-cystoscopy'], plausible: ['rigid-cystoscopy'] },
	'recurrent-uti': { ideal: ['flexible-cystoscopy'], plausible: ['rigid-cystoscopy'] },
	'lower-urinary-tract-symptoms': { ideal: ['flexible-cystoscopy'], plausible: ['rigid-cystoscopy'] },
	'urethral-stricture': { ideal: ['rigid-cystoscopy', 'flexible-cystoscopy'], plausible: [] },
	'catheter-problems': { ideal: ['flexible-cystoscopy'], plausible: ['rigid-cystoscopy'] },
	other: { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x procedure pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or procedure has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: Indication,
	procedure: Procedure
): { score: number; band: AppropriatenessBand; firedRule: FiredRule | null } {
	if (!indication || !procedure) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or procedure not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_PROCEDURE_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(procedure)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${procedure} is the recommended examination for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(procedure)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${procedure} may be appropriate for "${indication}" but is not the first-line examination.`
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
			description: `Requested ${procedure} is not usually appropriate for "${indication}"; query the referrer.`
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
// Axis B — Cancer-pathway urgency (NICE NG12 suspected-cancer thresholds)
// ----------------------------------------------------------------------

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'two-week-wait', 'emergency'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 6-18 weeks',
	urgent: 'Within 2 weeks',
	'two-week-wait': 'Seen within 14 days (suspected-cancer pathway)',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

/**
 * Determine NICE NG12 suspected-cancer two-week-wait eligibility.
 *
 * - Visible haematuria, aged >= 45, without an active UTI (or that persists /
 *   recurs after UTI treatment).
 * - Non-visible haematuria, aged >= 60, with dysuria.
 */
export function evaluateTwoWeekWait(data: CystoscopyRequest): {
	eligible: boolean;
	firedRule: FiredRule | null;
} {
	const age = data.patient.age;
	const ageNum = age === null || age === undefined ? null : Number(age);
	const visible =
		data.symptoms.visibleHaematuria === true ||
		data.request.primaryIndication === 'visible-haematuria';
	const nonVisible = data.request.primaryIndication === 'non-visible-haematuria';

	if (visible && ageNum !== null && ageNum >= 45) {
		return {
			eligible: true,
			firedRule: {
				ruleId: 'R-URGENCY-2WW-VISIBLE-HAEMATURIA',
				axis: 'urgency',
				category: 'suspected-cancer-2ww',
				description:
					'Aged >= 45 with unexplained visible haematuria — meets NICE NG12 two-week-wait criteria.'
			}
		};
	}
	if (nonVisible && ageNum !== null && ageNum >= 60 && data.symptoms.symptomDysuria === true) {
		return {
			eligible: true,
			firedRule: {
				ruleId: 'R-URGENCY-2WW-NON-VISIBLE-HAEMATURIA',
				axis: 'urgency',
				category: 'suspected-cancer-2ww',
				description:
					'Aged >= 60 with non-visible haematuria and dysuria — meets NICE NG12 two-week-wait criteria.'
			}
		};
	}
	return { eligible: false, firedRule: null };
}

interface UrgencyRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: CystoscopyRequest) => boolean;
	description: string;
}

const URGENCY_RULES: UrgencyRule[] = [
	{
		ruleId: 'R-URGENCY-SUSPECTED-TUMOUR',
		tier: 'two-week-wait',
		fires: (d) => d.request.primaryIndication === 'suspected-bladder-tumour',
		description: 'Suspected bladder tumour — suspected-cancer two-week-wait pathway.'
	},
	{
		ruleId: 'R-URGENCY-VISIBLE-HAEMATURIA',
		tier: 'two-week-wait',
		fires: (d) => d.symptoms.visibleHaematuria === true,
		description: 'Visible haematuria — urological assessment on the suspected-cancer pathway.'
	},
	{
		ruleId: 'R-URGENCY-RETENTION',
		tier: 'urgent',
		fires: (d) => d.symptoms.symptomRetention === true,
		description: 'Urinary retention — urgent assessment.'
	}
];

/**
 * Compute the triage tier, target timeframe, two-week-wait eligibility, and
 * fired urgency rules.
 */
export function scoreUrgency(data: CystoscopyRequest): {
	tier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	firedRules: FiredRule[];
} {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];

	for (const rule of URGENCY_RULES) {
		if (rule.fires(data)) {
			tier = maxTier(tier, rule.tier);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'urgency',
				category: 'red-flag',
				description: rule.description
			});
		}
	}

	const twoWeekWait = evaluateTwoWeekWait(data);
	if (twoWeekWait.eligible) {
		tier = maxTier(tier, 'two-week-wait');
		if (twoWeekWait.firedRule) firedRules.push(twoWeekWait.firedRule);
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-URGENCY-REQUESTED',
			axis: 'urgency',
			category: 'requested',
			description: `No red flags; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		twoWeekWaitEligible: twoWeekWait.eligible,
		firedRules
	};
}

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------

interface CompletenessField {
	weight: number;
	present: (d: CystoscopyRequest) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.request.procedure, ruleId: 'R-COMPLETE-PROCEDURE', label: 'requested procedure' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => d.patient.age !== null && d.patient.age !== undefined, ruleId: 'R-COMPLETE-AGE', label: 'patient age' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/** Compute weighted completeness 0-100 and the missing-field rules. */
export function scoreCompleteness(data: CystoscopyRequest): {
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
// Axis D — Pre-procedure risk (bleeding-risk + active-infection rules)
// ----------------------------------------------------------------------

export const RISK_ORDER: RiskBand[] = ['low', 'moderate', 'high'];

/** Return whichever of two risk bands is more severe. */
export function maxRisk(a: RiskBand, b: RiskBand): RiskBand {
	const ia = RISK_ORDER.indexOf(a);
	const ib = RISK_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

interface RiskRule {
	ruleId: string;
	band: RiskBand;
	fires: (d: CystoscopyRequest) => boolean;
	description: string;
	action: string;
}

const RISK_RULES: RiskRule[] = [
	{
		ruleId: 'R-RISK-ANTICOAGULANT',
		band: 'high',
		fires: (d) => d.bleeding.takingAnticoagulant === true,
		description: 'Patient is taking an anticoagulant — high bleeding risk.',
		action:
			'Confirm the anticoagulant agent and indication; plan peri-procedure bridging / hold per local policy before any biopsy.'
	},
	{
		ruleId: 'R-RISK-ACTIVE-UTI',
		band: 'high',
		fires: (d) => d.symptoms.currentUti === true,
		description: 'Active urinary tract infection — defer instrumentation until treated.',
		action:
			'Defer the cystoscopy: treat the active UTI first and reschedule once the infection has resolved.'
	},
	{
		ruleId: 'R-RISK-ANTIPLATELET',
		band: 'moderate',
		fires: (d) => d.bleeding.takingAntiplatelet === true,
		description: 'Patient is taking an antiplatelet agent — moderate bleeding risk.',
		action:
			'Note antiplatelet therapy; diagnostic flexible cystoscopy is usually safe to proceed without stopping it.'
	}
];

/**
 * Compute the pre-procedure risk band, anticoagulant / UTI action, and the
 * fired risk rules.
 */
export function scoreRisk(data: CystoscopyRequest): {
	band: RiskBand;
	anticoagulantAction: string;
	firedRules: FiredRule[];
} {
	let band: RiskBand = 'low';
	let action = '';
	const firedRules: FiredRule[] = [];

	for (const rule of RISK_RULES) {
		if (rule.fires(data)) {
			const newBand = maxRisk(band, rule.band);
			// Prefer the action string of the most-severe fired rule.
			if (RISK_ORDER.indexOf(rule.band) >= RISK_ORDER.indexOf(band) || action === '') {
				action = rule.action;
			}
			band = newBand;
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'risk',
				category: 'bleeding-risk',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-RISK-LOW',
			axis: 'risk',
			category: 'baseline',
			description:
				'No bleeding-risk or active-infection factors recorded — low pre-procedure risk.'
		});
	}

	return { band, anticoagulantAction: action, firedRules };
}
