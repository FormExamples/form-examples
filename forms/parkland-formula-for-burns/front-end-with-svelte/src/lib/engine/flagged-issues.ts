import type { AssessmentData, FlaggedIssue } from './types';
import { FIRST_PHASE_HOURS, referralThreshold } from './parkland-rules';

/** Round a number to one decimal place (returns null unchanged). */
function roundOne(n: number | null): number | null {
	if (n === null || n === undefined || Number.isNaN(n)) return null;
	return Math.round(n * 10) / 10;
}

/**
 * Detect clinician-facing safety flags (red flags), independently of the
 * arithmetic (spec §5):
 *
 *   - Major burn — burns-unit referral (high) — tbsaPercent >= 15 (adult) / >= 10 (child)
 *   - Inhalation / airway risk (high)         — inhalationSuspected == 'yes'
 *   - Escharotomy risk (high)                 — circumferentialOrDeep == 'yes'
 *   - Resuscitation overdue (high)            — hoursSinceInjury > 8
 *   - Titrate to urine output (medium)        — always when a plan is produced
 *   - Special mechanism (medium)              — mechanism electrical / chemical
 *   - Incomplete assessment (low)             — weight, %TBSA, or time of injury missing
 *
 * Rows mirror the `parkland_formula_for_burns_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade: { total24hVolumeMl: number | null; hoursSinceInjury: number | null }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const weightKg = data.weight.weightKg;
	const tbsaPercent = data.burn.tbsaPercent;
	const ageBand = data.identification.ageBand;
	const injuryAt = data.injury.injuryAt;
	const inhalation = data.features.inhalationSuspected;
	const circumferentialOrDeep = data.features.circumferentialOrDeep;
	const mechanism = data.features.mechanism;

	const hoursSinceInjury = grade.hoursSinceInjury;
	const total24hVolumeMl = grade.total24hVolumeMl;

	const weightPresent = weightKg !== null && weightKg !== undefined;
	const tbsaPresent = tbsaPercent !== null && tbsaPercent !== undefined;
	const injuryPresent = injuryAt !== '' && injuryAt !== null && injuryAt !== undefined;

	// ─── Major burn — burns-unit referral (HIGH) ────────────────
	if (tbsaPresent) {
		const threshold = referralThreshold(ageBand);
		if ((tbsaPercent as number) >= threshold) {
			const bandLabel = ageBand === 'child' ? 'child' : 'adult';
			flags.push({
				id: 'F-MAJOR-BURN-REFERRAL-001',
				category: 'major-burn-referral',
				priority: 'high',
				description:
					`%TBSA ${tbsaPercent}% at or above the ${threshold}% ${bandLabel} ` +
					'major-burn threshold — formal fluid resuscitation is indicated',
				suggestedAction:
					'Refer to a specialist burns service, commence Parkland resuscitation, ' +
					'and arrange transfer per National Burn Care Referral Guidance.'
			});
		}
	}

	// ─── Inhalation / airway risk (HIGH) ────────────────────────
	if (inhalation === 'yes') {
		flags.push({
			id: 'F-INHALATION-AIRWAY-001',
			category: 'inhalation-airway',
			priority: 'high',
			description:
				'Inhalation / airway injury suspected — airway oedema can develop rapidly',
			suggestedAction:
				'Assess the airway early; involve anaesthesia / critical care and ' +
				'consider intubation before oedema progresses.'
		});
	}

	// ─── Escharotomy risk (HIGH) ────────────────────────────────
	if (circumferentialOrDeep === 'yes') {
		flags.push({
			id: 'F-ESCHAROTOMY-RISK-001',
			category: 'escharotomy-risk',
			priority: 'high',
			description:
				'Circumferential or deep burn present — risk of constriction and ' +
				'compartment syndrome',
			suggestedAction:
				'Monitor distal perfusion and compartment pressures; seek surgical ' +
				'review for possible escharotomy.'
		});
	}

	// ─── Resuscitation overdue (HIGH) ───────────────────────────
	if (hoursSinceInjury !== null && hoursSinceInjury > FIRST_PHASE_HOURS) {
		flags.push({
			id: 'F-RESUSCITATION-OVERDUE-001',
			category: 'resuscitation-overdue',
			priority: 'high',
			description:
				`${roundOne(hoursSinceInjury)} h have elapsed since injury — the ` +
				'first-8-h resuscitation window has passed',
			suggestedAction:
				'Give the outstanding first-phase volume now as a priority and re-plan ' +
				'the remainder against the 24 h total.'
		});
	}

	// ─── Titrate to urine output (MEDIUM) ───────────────────────
	if (total24hVolumeMl !== null) {
		flags.push({
			id: 'F-TITRATE-URINE-OUTPUT-001',
			category: 'titrate-to-urine-output',
			priority: 'medium',
			description:
				'The Parkland volume is a starting estimate only — fluids must be ' +
				'titrated to physiological endpoints',
			suggestedAction:
				'Titrate to a urine output of 0.5-1.0 mL/kg/h (adults); adjust the rate ' +
				'up or down and seek senior review if output falls.'
		});
	}

	// ─── Special mechanism (MEDIUM) ─────────────────────────────
	if (mechanism === 'electrical' || mechanism === 'chemical') {
		const mechLabel = mechanism === 'electrical' ? 'Electrical' : 'Chemical';
		flags.push({
			id: 'F-SPECIAL-MECHANISM-001',
			category: 'special-mechanism',
			priority: 'medium',
			description:
				`${mechLabel} injury — higher fluid requirement and risk of occult ` +
				'deep-tissue damage',
			suggestedAction:
				'Seek specialist advice; for electrical injury monitor for ' +
				'rhabdomyolysis and arrhythmia and maintain a higher urine-output target.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	if (!weightPresent || !tbsaPresent || !injuryPresent) {
		const missing: string[] = [];
		if (!weightPresent) missing.push('body weight');
		if (!tbsaPresent) missing.push('%TBSA');
		if (!injuryPresent) missing.push('time of injury');
		flags.push({
			id: 'F-INCOMPLETE-DATA-001',
			category: 'incomplete-assessment',
			priority: 'low',
			description:
				`Missing input(s): ${missing.join(', ')} — the plan cannot be fully derived`,
			suggestedAction:
				'Record the missing value(s) and re-calculate the resuscitation plan.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
