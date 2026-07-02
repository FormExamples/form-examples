// Flagged-issue detection (red flags). Independent of the risk zone (which the
// grader produces), this module raises clinician-facing safety flags per
// spec §5:
//
//   - Above exchange-transfusion threshold (high, urgent) — aboveExchange
//   - Above phototherapy threshold (high)                 — abovePhototherapy
//   - High-risk zone (high)                               — riskZone == 'high'
//   - Early jaundice (high)                               — onset < 24 hours
//   - Risk factors present (medium)                       — any risk-factor flag
//   - High-intermediate zone (medium)                     — riskZone == 'high-intermediate'
//   - Out-of-range age (low)                              — age outside domain
//   - Incomplete assessment (low)                         — age or TSB missing
//
// Rows here mirror the `bhutani_bilirubin_nomogram_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

import type { AssessmentData, FlaggedIssue, GradingResult } from './types';
import { roundOne } from './bhutani-rules';

export function detectFlaggedIssues(data: AssessmentData, grade: GradingResult): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const tsb = data.measurement.totalSerumBilirubinUmolL;
	const age = data.measurement.ageHours;
	const hasAge = age !== null && age !== undefined && !Number.isNaN(age);
	const hasTsb = tsb !== null && tsb !== undefined && !Number.isNaN(tsb);
	const rf = data.riskFactors;

	// ─── Above exchange-transfusion threshold (HIGH, urgent) ────
	if (grade.aboveExchange) {
		flags.push({
			id: 'F-ABOVE-EXCHANGE-001',
			category: 'above-exchange',
			priority: 'high',
			description:
				`TSB ${roundOne(tsb)} µmol/L is at or above the exchange-transfusion ` +
				`threshold (${grade.exchangeThreshold} µmol/L) for this gestation and age — medical emergency`,
			suggestedAction:
				'Urgent senior / neonatal review; start intensive phototherapy immediately and prepare for exchange transfusion per local protocol.'
		});
	}

	// ─── Above phototherapy threshold (HIGH) ────────────────────
	if (grade.abovePhototherapy && !grade.aboveExchange) {
		flags.push({
			id: 'F-ABOVE-PHOTOTHERAPY-001',
			category: 'above-phototherapy',
			priority: 'high',
			description:
				`TSB ${roundOne(tsb)} µmol/L is at or above the phototherapy ` +
				`threshold (${grade.phototherapyThreshold} µmol/L) for this gestation and age`,
			suggestedAction:
				'Start phototherapy per the gestation-specific NICE chart and repeat the TSB within 4–6 hours.'
		});
	}

	// ─── High-risk zone (HIGH) ──────────────────────────────────
	if (grade.riskZone === 'high') {
		flags.push({
			id: 'F-HIGH-RISK-ZONE-001',
			category: 'high-risk-zone',
			priority: 'high',
			description:
				'TSB is at or above the 95th percentile for age (high-risk zone) — highest ' +
				'probability of subsequent significant hyperbilirubinaemia',
			suggestedAction:
				'Ensure timely re-testing, review against the treatment thresholds, and arrange close follow-up.'
		});
	}

	// ─── Early jaundice (HIGH) ──────────────────────────────────
	if (rf.earlyOnsetUnder24h === 'yes') {
		flags.push({
			id: 'F-EARLY-JAUNDICE-001',
			category: 'early-jaundice',
			priority: 'high',
			description:
				'Jaundice onset before 24 hours of age — pathological until proven otherwise',
			suggestedAction:
				'Urgent investigation: measure TSB now and repeat, check blood group / DAT and full blood count, and seek senior review.'
		});
	}

	// ─── Risk factors present (MEDIUM) ──────────────────────────
	if (grade.firedRiskFactors.length > 0) {
		const names = grade.firedRiskFactors.map((f) => f.label).join('; ');
		flags.push({
			id: 'F-RISK-FACTORS-001',
			category: 'risk-factors',
			priority: 'medium',
			description: `${grade.firedRiskFactors.length} recognised risk factor(s) present: ${names}`,
			suggestedAction:
				'Lower the effective threshold for concern and reassess sooner; correlate with the treatment thresholds.'
		});
	}

	// ─── High-intermediate zone (MEDIUM) ────────────────────────
	if (grade.riskZone === 'high-intermediate') {
		flags.push({
			id: 'F-HIGH-INTERMEDIATE-ZONE-001',
			category: 'high-risk-zone',
			priority: 'medium',
			description:
				'TSB in the 75th–95th percentile band (high-intermediate zone) — increased probability of subsequent significant hyperbilirubinaemia',
			suggestedAction: 'Closer surveillance and earlier re-measurement of TSB.'
		});
	}

	// ─── Out-of-range age (LOW) ─────────────────────────────────
	if (grade.outOfRange) {
		flags.push({
			id: 'F-OUT-OF-RANGE-AGE-001',
			category: 'other',
			priority: 'low',
			description:
				`Age ${roundOne(age)} h is outside the nomogram domain (0–168 h) — the ` +
				`result was computed at the nearest defined age`,
			suggestedAction:
				'Re-check the recorded age at measurement; interpret the zone with caution.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	if (!hasAge || !hasTsb) {
		const missing: string[] = [];
		if (!hasAge) missing.push('age at measurement (hours)');
		if (!hasTsb) missing.push('total serum bilirubin (µmol/L)');
		flags.push({
			id: 'F-INCOMPLETE-001',
			category: 'incomplete',
			priority: 'low',
			description: `Missing input(s): ${missing.join(', ')} — no risk zone can be assigned`,
			suggestedAction: 'Record the missing measurement(s) and re-classify.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
