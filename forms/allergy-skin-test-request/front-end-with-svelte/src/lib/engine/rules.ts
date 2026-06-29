// Four-axis rule catalogue for the Allergy Skin Test Request engine.
//
// Ported verbatim (in behaviour) from `front-end-form-with-html/js/rules.js`:
// (A) appropriateness 1-9 + band by indication × test type; (B) validity-and-
// safety band ok/caution/contraindicated driven by antihistamines, beta-blocker
// + anaphylaxis, and active skin disease; (C) request completeness over
// mandatory fields including allergen-panel selection; (D) triage tier
// (routine / urgent) with red-flag auto-escalation. Rule IDs are stable and
// identical across every front-end and the back-end.

import type {
	RequestData,
	Test,
	AppropriatenessBand,
	ValidityBand,
	TriageTier,
	FiredRule
} from './types';

/** The boolean allergen-panel keys of the `Test` section. */
export type AllergenField =
	| 'allergenAeroallergens'
	| 'allergenFood'
	| 'allergenDrug'
	| 'allergenVenom'
	| 'allergenLatex'
	| 'allergenContact';

/** The six allergen-panel boolean fields, in canonical display order. */
export const ALLERGEN_PANELS: { field: AllergenField; label: string; hint: string }[] = [
	{ field: 'allergenAeroallergens', label: 'Aeroallergens', hint: 'Pollens, house dust mite, animal dander, moulds' },
	{ field: 'allergenFood', label: 'Food', hint: 'Milk, egg, peanut, tree nut, fish, shellfish, wheat, soy' },
	{ field: 'allergenDrug', label: 'Drug', hint: 'Beta-lactams, NSAIDs, perioperative agents' },
	{ field: 'allergenVenom', label: 'Venom', hint: 'Bee, wasp / Vespula venom' },
	{ field: 'allergenLatex', label: 'Latex', hint: 'Natural rubber latex' },
	{ field: 'allergenContact', label: 'Contact', hint: 'Nickel, fragrances, preservatives (patch-test series)' }
];

/** Count how many allergen panels are selected in a test section. */
export function countSelectedPanels(test: Test | undefined): number {
	if (!test) return 0;
	let n = 0;
	for (const p of ALLERGEN_PANELS) {
		if (test[p.field] === true) n++;
	}
	return n;
}

/** Return the kebab-case categories of the selected allergen panels. */
export function selectedPanelCategories(test: Test | undefined): string[] {
	const out: string[] = [];
	if (!test) return out;
	if (test.allergenAeroallergens) out.push('aeroallergens');
	if (test.allergenFood) out.push('food');
	if (test.allergenDrug) out.push('drug');
	if (test.allergenVenom) out.push('venom');
	if (test.allergenLatex) out.push('latex');
	if (test.allergenContact) out.push('contact');
	return out;
}

// ----------------------------------------------------------------------
// Axis A — Appropriateness (BSACI / EAACI indication match, 1-9 ordinal)
// ----------------------------------------------------------------------

/** Map of indication -> ideal / plausible test types. */
export const INDICATION_TEST_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-food-allergy': { ideal: ['skin-prick-test', 'specific-ige-blood'], plausible: ['intradermal-test'] },
	'suspected-drug-allergy': { ideal: ['intradermal-test', 'drug-provocation-challenge'], plausible: ['skin-prick-test', 'specific-ige-blood'] },
	'rhinitis-asthma': { ideal: ['skin-prick-test', 'specific-ige-blood'], plausible: ['intradermal-test'] },
	'anaphylaxis-investigation': { ideal: ['skin-prick-test', 'specific-ige-blood'], plausible: ['intradermal-test', 'drug-provocation-challenge'] },
	'venom-allergy': { ideal: ['skin-prick-test', 'intradermal-test'], plausible: ['specific-ige-blood'] },
	'contact-dermatitis': { ideal: ['patch-test'], plausible: [] },
	'urticaria': { ideal: ['skin-prick-test', 'specific-ige-blood'], plausible: ['intradermal-test'] },
	'other': { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication × testType pairing. Defaults to
 * a neutral may-be-appropriate when either has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: string,
	testType: string
): { score: number; band: AppropriatenessBand; firedRule: FiredRule | null } {
	if (!indication || !testType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or test type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_TEST_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(testType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${testType} is the recommended test for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(testType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${testType} may be appropriate for "${indication}" but is not the first-line test.`
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
			description: `Requested ${testType} is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}

/**
 * A request with no allergen panel selected cannot be actioned — drop
 * appropriateness to the lowest band.
 */
export function noAllergenAppropriatenessRule(test: Test): FiredRule | null {
	if (countSelectedPanels(test) === 0) {
		return {
			ruleId: 'R-APPROP-NO-ALLERGEN-SELECTED',
			axis: 'appropriateness',
			category: 'no-allergen-selected',
			description: 'No allergen panel selected — the test cannot be performed as requested.'
		};
	}
	return null;
}

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis B — Validity and safety (BSACI / EAACI / WAO)
// ----------------------------------------------------------------------

export const VALIDITY_ORDER: ValidityBand[] = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two validity bands is more severe. */
export function maxValidityBand(a: ValidityBand, b: ValidityBand): ValidityBand {
	return VALIDITY_ORDER.indexOf(a) >= VALIDITY_ORDER.indexOf(b) ? a : b;
}

/** Test types whose validity is suppressed by antihistamines / skin disease. */
export const SKIN_TEST_TYPES = ['skin-prick-test', 'intradermal-test'];

/** Evaluate the validity-and-safety axis. */
export function scoreValiditySafety(data: RequestData): { band: ValidityBand; firedRules: FiredRule[] } {
	const test = data.test;
	const safety = data.safety;
	let band: ValidityBand = 'ok';
	const firedRules: FiredRule[] = [];
	const isSkinTest = SKIN_TEST_TYPES.includes(test.testType);

	// Antihistamines invalidate skin-prick / intradermal tests.
	if (safety.onAntihistamines === true && isSkinTest) {
		band = maxValidityBand(band, 'contraindicated');
		firedRules.push({
			ruleId: 'R-VALIDITY-ANTIHISTAMINES-INVALIDATE',
			axis: 'validity',
			category: 'antihistamines-invalidate-test',
			description: 'Patient is on antihistamines — skin-prick / intradermal testing is invalidated until an appropriate washout (typically five half-lives).'
		});
	} else if (safety.onAntihistamines === true) {
		band = maxValidityBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-VALIDITY-ANTIHISTAMINES-NOTE',
			axis: 'validity',
			category: 'antihistamines-invalidate-test',
			description: 'Patient is on antihistamines; this does not affect specific-IgE blood testing but would invalidate a skin test.'
		});
	}

	// Active skin disease at the test site invalidates / distorts skin testing.
	if (safety.currentSkinDisease === true && isSkinTest) {
		band = maxValidityBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-VALIDITY-ACTIVE-SKIN-DISEASE',
			axis: 'validity',
			category: 'active-skin-disease',
			description: 'Active skin disease (eczema / dermographism) at the test site can invalidate or distort skin-test results.'
		});
	}

	// Beta-blocker with a history of anaphylaxis — safety caution.
	if (safety.onBetaBlocker === true && safety.previousAnaphylaxis === true) {
		band = maxValidityBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-VALIDITY-BETA-BLOCKER-ANAPHYLAXIS',
			axis: 'validity',
			category: 'beta-blocker-caution',
			description: 'Beta-blocker with a history of anaphylaxis — adrenaline may be less effective if a systemic reaction occurs during testing.'
		});
	} else if (safety.onBetaBlocker === true) {
		band = maxValidityBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-VALIDITY-BETA-BLOCKER',
			axis: 'validity',
			category: 'beta-blocker-caution',
			description: 'Patient is on a beta-blocker — relative caution for procedures carrying anaphylaxis risk; ensure resuscitation readiness.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-VALIDITY-OK',
			axis: 'validity',
			category: 'ok',
			description: 'No validity or safety concerns recorded.'
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
	{ weight: 3, present: (d) => !!d.indication.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.indication.clinicalQuestion && d.indication.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 3, present: (d) => countSelectedPanels(d.test) > 0, ruleId: 'R-COMPLETE-ALLERGEN-PANEL', label: 'allergen panel' },
	{ weight: 2, present: (d) => !!d.test.testType, ruleId: 'R-COMPLETE-TEST-TYPE', label: 'requested test type' },
	{ weight: 1, present: (d) => !!d.indication.clinicalDetails && d.indication.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/** Compute weighted completeness 0-100 and the missing-field rules. */
export function scoreCompleteness(data: RequestData): { percent: number; missing: FiredRule[] } {
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
// Axis D — Triage priority (routine / urgent, red-flag escalation)
// ----------------------------------------------------------------------

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent'];

export const TARGET_TIMEFRAMES: Record<TriageTier, string> = {
	routine: 'Within 6-12 weeks',
	urgent: 'Within 1-2 weeks'
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
		ruleId: 'R-TRIAGE-ANAPHYLAXIS-INVESTIGATION',
		tier: 'urgent',
		fires: (d) => d.indication.primaryIndication === 'anaphylaxis-investigation',
		description: 'Anaphylaxis investigation — expedite to identify the trigger.'
	},
	{
		ruleId: 'R-TRIAGE-PREVIOUS-ANAPHYLAXIS',
		tier: 'urgent',
		fires: (d) => d.safety.previousAnaphylaxis === true,
		description: 'History of anaphylaxis — expedite assessment in a resuscitation-ready setting.'
	},
	{
		ruleId: 'R-TRIAGE-VENOM-ALLERGY',
		tier: 'urgent',
		fires: (d) => d.indication.primaryIndication === 'venom-allergy',
		description: 'Venom allergy with systemic-reaction risk — expedite testing and immunotherapy assessment.'
	}
];

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: RequestData): { tier: TriageTier; targetTimeframe: string; firedRules: FiredRule[] } {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier) ? (requested as TriageTier) : 'routine';
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
			description: `No escalation rules fired; triage follows the requested urgency (${tier}).`
		});
	}

	return { tier, targetTimeframe: TARGET_TIMEFRAMES[tier] || '', firedRules };
}
