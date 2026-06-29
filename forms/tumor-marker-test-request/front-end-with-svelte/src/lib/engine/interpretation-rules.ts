// ──────────────────────────────────────────────
// Axis B — Interpretation safety (ok / caution / misuse-risk)
//
// Timing, treatment effects, and screening-misuse checks. Screening misuse
// forces misuse-risk; on-treatment requests or a missing previous value / date
// for a monitoring indication raise caution. Choose ok only when no rule fires.
// Ported verbatim from the HTML front-end's js/rules.js.
// ──────────────────────────────────────────────

import type { FiredRule, Indication, InterpretationBand, TumorMarkerRequest } from './types';

const INTERPRETATION_ORDER: InterpretationBand[] = ['ok', 'caution', 'misuse-risk'];

const MONITORING_INDICATIONS: Indication[] = [
	'cancer-monitoring',
	'treatment-response',
	'recurrence-surveillance'
];

/** Return whichever of two interpretation bands is more severe. */
export function maxInterpretation(a: InterpretationBand, b: InterpretationBand): InterpretationBand {
	const ia = INTERPRETATION_ORDER.indexOf(a);
	const ib = INTERPRETATION_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

/** Engine context passed from Axis A into the interpretation pass. */
export interface InterpretationContext {
	screeningMisuse: boolean;
}

/** The result of scoring Axis B. */
export interface InterpretationResult {
	band: InterpretationBand;
	firedRules: FiredRule[];
}

/** Evaluate interpretation safety for the request. */
export function scoreInterpretation(
	data: TumorMarkerRequest,
	context: InterpretationContext
): InterpretationResult {
	const ctx = context || { screeningMisuse: false };
	const indication = data.context.primaryIndication;
	const firedRules: FiredRule[] = [];
	let band: InterpretationBand = 'ok';

	if (ctx.screeningMisuse) {
		band = maxInterpretation(band, 'misuse-risk');
		firedRules.push({
			ruleId: 'R-INTERP-SCREENING-MISUSE',
			axis: 'interpretation',
			category: 'inappropriate-screening-use',
			description: 'Markers ordered for broad screening have low specificity and are frequently raised in benign conditions — misuse risk.'
		});
	}

	if (data.context.onTreatment === true) {
		band = maxInterpretation(band, 'caution');
		firedRules.push({
			ruleId: 'R-INTERP-ON-TREATMENT',
			axis: 'interpretation',
			category: 'treatment-effect',
			description: 'Patient is on treatment; marker levels may reflect treatment timing rather than disease activity.'
		});
	}

	if (
		MONITORING_INDICATIONS.includes(indication) &&
		(data.context.previousMarkerValue === null ||
			data.context.previousMarkerValue === undefined ||
			(data.context.previousMarkerValue as unknown) === '' ||
			!data.context.previousMarkerDate)
	) {
		band = maxInterpretation(band, 'caution');
		firedRules.push({
			ruleId: 'R-INTERP-NO-BASELINE',
			axis: 'interpretation',
			category: 'missing-baseline',
			description: 'Monitoring / surveillance indication without a previous marker value and date — no baseline for trend interpretation.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-INTERP-OK',
			axis: 'interpretation',
			category: 'ok',
			description: 'No interpretation-safety concerns identified.'
		});
	}

	return { band, firedRules };
}
