// Clinical acuity engine: max-band over NEWS2 and the deterioration markers.
//
// Every rule that fires proposes a band; the worst proposed band wins. `stable`
// is the default when no rule fires, and the band never falls below a fired
// rule's band — so adding a rule can only raise acuity, never lower it. See
// `doc/acuity-rules.md` for the clinical justification of each rule and the
// worked examples.
//
// This engine transcribes the RCP's own published thresholds into a band. It
// computes nothing the NEWS2 chart does not already imply; what it adds is
// making the implied escalation visible, and flagging when that escalation was
// not documented.

import { effectiveNews2, type EffectiveNews2 } from './news2';
import { ACUITY_ORDER, type AcuityBand, type AssessmentData, type FiredRule } from './types';

/** Return the worse (higher) of two bands. */
export function maxBand(a: AcuityBand, b: AcuityBand): AcuityBand {
	return ACUITY_ORDER.indexOf(b) > ACUITY_ORDER.indexOf(a) ? b : a;
}

/** True when `band` is at least as severe as `floor`. */
export function atLeast(band: AcuityBand, floor: AcuityBand): boolean {
	return ACUITY_ORDER.indexOf(band) >= ACUITY_ORDER.indexOf(floor);
}

export interface AcuityResult {
	band: AcuityBand;
	firedRules: FiredRule[];
	news2: EffectiveNews2;
}

/** Evaluate every acuity rule (spec §5.2). */
export function evaluateAcuity(data: AssessmentData): AcuityResult {
	const obs = data.observations;
	const a = data.assessment;
	const inv = data.investigations;
	const news2 = effectiveNews2(obs);
	const total = news2.effective;

	const firedRules: FiredRule[] = [];
	let band: AcuityBand = 'stable';

	const fire = (id: string, proposed: AcuityBand, description: string, category: string) => {
		firedRules.push({ id, engine: 'acuity', component: 'acuity', band: proposed, category, description });
		band = maxBand(band, proposed);
	};

	// NEWS2-driven rules. Only evaluated when a total is available: a note with
	// no observations gets no NEWS2 rule, not a falsely reassuring `stable`.
	if (total !== null) {
		if (total >= 9) {
			fire('A-NEWS2-CRITICAL', 'critical', `NEWS2 ${total} — at or above the critical threshold of 9`, 'news2');
		} else if (total >= 7) {
			fire(
				'A-NEWS2-HIGH',
				'escalate',
				`NEWS2 ${total} — RCP high-risk band, emergency assessment by a critical-care-competent team`,
				'news2'
			);
		} else if (total >= 5) {
			fire(
				'A-NEWS2-MEDIUM',
				'watch',
				`NEWS2 ${total} — RCP medium-risk band, urgent review by a clinician competent in acute illness`,
				'news2'
			);
		} else if (!news2.anyParameterScoresThree) {
			fire(
				'A-NEWS2-LOW',
				'stable',
				`NEWS2 ${total} — RCP low-risk band, no single parameter scoring 3`,
				'news2'
			);
		}

		if (news2.anyParameterScoresThree && total < 7) {
			fire(
				'A-NEWS2-SINGLE-3',
				'watch',
				'A single NEWS2 parameter scores 3 — RCP low-medium band, review regardless of the aggregate',
				'news2'
			);
		}
	}

	if (obs.news2Trend === 'worsening') {
		fire(
			'A-NEWS2-TREND',
			'watch',
			'NEWS2 trend is worsening — a rising score predicts deterioration better than a single reading',
			'news2'
		);
	}

	// Deterioration markers, independent of the aggregate.
	if (a.newOxygenRequirement === 'yes') {
		fire('A-NEW-OXYGEN', 'escalate', 'New oxygen requirement recorded', 'deterioration-marker');
	}

	if (a.newConfusion === 'yes' && obs.acvpu && obs.acvpu !== 'alert') {
		fire(
			'A-NEW-CONFUSION',
			'escalate',
			'New confusion with an ACVPU below Alert — a core delirium and sepsis marker',
			'deterioration-marker'
		);
	}

	if (a.sepsisScreen === 'positive') {
		fire(
			'A-SEPSIS',
			'escalate',
			'Sepsis screen positive — NICE NG51 requires senior review and the sepsis pathway',
			'deterioration-marker'
		);
	}

	const unresolvedAbnormal = inv.rows.some((r) => r.abnormal === 'yes' && r.actioned !== 'yes');
	if (unresolvedAbnormal) {
		fire(
			'A-ABNORMAL-UNRESOLVED',
			'escalate',
			'An abnormal investigation result has not been actioned',
			'deterioration-marker'
		);
	}

	if (a.arrestCall && a.arrestCall !== 'none') {
		fire('A-ARREST', 'critical', `Arrest call recorded (${a.arrestCall})`, 'deterioration-marker');
	}

	if (a.criticalCareReferral === 'yes') {
		fire(
			'A-CRITICAL-CARE',
			'critical',
			'Critical-care outreach or ICU referral made',
			'deterioration-marker'
		);
	}

	if (a.newOrganSupport && a.newOrganSupport !== 'none') {
		fire(
			'A-ORGAN-SUPPORT',
			'critical',
			`New organ support started (${a.newOrganSupport}) — level 2 or 3 care by definition`,
			'deterioration-marker'
		);
	}

	return { band, firedRules, news2 };
}
