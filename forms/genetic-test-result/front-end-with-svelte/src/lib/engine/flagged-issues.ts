import type { GeneticResult, Flag, FlagPriority } from './types';
import { hasPathogenicVariant, hasVus } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror sql/07_create_table_genetic_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: GeneticResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert + pathogenic-variant-found ───
	if (hasPathogenicVariant(r)) {
		flags.push({
			flagId: 'F-PATHOGENIC-VARIANT-001',
			category: 'pathogenic-variant-found',
			priority: 'high',
			description: 'A pathogenic or likely-pathogenic actionable variant is present.',
			suggestedAction:
				'Communicate the actionable result to the referrer, arrange urgent genetics MDT / counselling, and document the communication.'
		});

		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description: 'Actionable genomic result requiring direct communication to the referrer.',
			suggestedAction:
				'Communicate the critical result to the referrer immediately and record who was informed, with date and time.'
		});

		// critical result that has not yet been communicated
		if (!r.criticalResultCommunicated) {
			flags.push({
				flagId: 'F-CRITICAL-RESULT-002',
				category: 'critical-result-alert',
				priority: 'high',
				description:
					'Actionable variant present but the result has not been recorded as communicated.',
				suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
			});
		}
	}

	// ─── secondary-finding ───
	if (r.secondaryFinding) {
		flags.push({
			flagId: 'F-SECONDARY-FINDING-001',
			category: 'secondary-finding',
			priority: 'high',
			description: 'A secondary / incidental actionable finding was identified.',
			suggestedAction:
				'Review the secondary finding per the relevant secondary-findings policy and arrange genetics review.'
		});
	}

	// ─── variant-uncertain-significance ───
	if (hasVus(r) && !hasPathogenicVariant(r)) {
		flags.push({
			flagId: 'F-VUS-001',
			category: 'variant-uncertain-significance',
			priority: 'medium',
			description: 'A variant of uncertain significance (VUS) is reported.',
			suggestedAction:
				'Do not act clinically on the VUS alone; recommend periodic reclassification review and re-contact.'
		});
	}

	// ─── cascade-testing-recommended ───
	if (r.recommendedCascadeTesting || (hasPathogenicVariant(r) && r.inheritancePattern.trim() !== '')) {
		flags.push({
			flagId: 'F-CASCADE-TESTING-001',
			category: 'cascade-testing-recommended',
			priority: 'medium',
			description: 'Cascade (predictive) testing of at-risk relatives is recommended.',
			suggestedAction: 'Offer cascade testing and genetic counselling to at-risk relatives.'
		});
	}

	// ─── urgent-referral (positive carrier status) ───
	if (r.carrierStatusPositive) {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'medium',
			description: 'Positive carrier status may warrant genetic counselling / reproductive advice.',
			suggestedAction: 'Consider referral for genetic counselling and reproductive options.'
		});
	}

	// ─── missing-classification ───
	if (
		r.variantsDetected.trim() !== '' &&
		r.variantClassification === '' &&
		!r.noClinicallySignificantVariant
	) {
		flags.push({
			flagId: 'F-MISSING-CLASSIFICATION-001',
			category: 'missing-classification',
			priority: 'medium',
			description: 'Variants are described but no ACMG/AMP classification has been recorded.',
			suggestedAction: 'Record the overall ACMG/AMP (ACGS) five-tier variant classification.'
		});
	}

	// ─── missing-impression ───
	if (r.impression.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-IMPRESSION-001',
			category: 'missing-impression',
			priority: 'medium',
			description: 'No impression / conclusion has been recorded.',
			suggestedAction: 'Add an impression that answers the clinical question.'
		});
	}

	// ─── discrepancy-with-request (actionable but no originating request linked) ───
	if (hasPathogenicVariant(r) && r.originatingRequestReference.trim() === '') {
		flags.push({
			flagId: 'F-DISCREPANCY-001',
			category: 'discrepancy-with-request',
			priority: 'low',
			description:
				'An actionable variant is present but no originating request reference is recorded.',
			suggestedAction: 'Link the report to the originating request to support discrepancy review.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
