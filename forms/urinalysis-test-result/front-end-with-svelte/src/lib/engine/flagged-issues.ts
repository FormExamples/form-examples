import type { UrinalysisResult, Flag, FlagPriority } from './types';
import { hasCriticalFinding, hasSignificantGrowth, hasUtiFeatures, isDipstickPositive } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror sql/07_create_table_urinalysis_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: UrinalysisResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert (auto-raised with a critical finding) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description:
				'A critical finding (significant growth in pregnancy, critical organism, suspected urosepsis, or visible haematuria) is present.',
			suggestedAction:
				'Communicate the critical result to the requester immediately and document the communication.'
		});

		// critical result that has not yet been communicated
		if (!r.criticalResultCommunicated) {
			flags.push({
				flagId: 'F-CRITICAL-RESULT-002',
				category: 'critical-result-alert',
				priority: 'high',
				description: 'Critical finding present but the result has not been recorded as communicated.',
				suggestedAction: 'Contact the requester now and record who was informed, with date and time.'
			});
		}
	}

	// ─── abnormal-requiring-action (significant bacteriuria) ───
	if (hasSignificantGrowth(r) && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-ABNORMAL-ACTION-001',
			category: 'abnormal-requiring-action',
			priority: 'high',
			description: 'Significant bacteriuria on culture requiring timely action.',
			suggestedAction: 'Ensure the requester is alerted and treat per sensitivities / antimicrobial guidance.'
		});
	}

	// ─── urgent-referral (visible haematuria — NICE NG12 pathway) ───
	if (r.visibleHaematuria) {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'medium',
			description: 'Visible haematuria is present and may warrant urgent referral.',
			suggestedAction: 'Consider an urgent suspected-cancer referral per NICE NG12.'
		});
	}

	// ─── inadequate-technique (contaminated / insufficient specimen) ───
	if (r.specimenCondition === 'insufficient' || r.specimenCondition === 'contaminated' || r.specimenCondition === 'delayed') {
		flags.push({
			flagId: 'F-INADEQUATE-TECHNIQUE-001',
			category: 'inadequate-technique',
			priority: r.specimenCondition === 'insufficient' ? 'high' : 'medium',
			description: `Specimen condition is ${r.specimenCondition}; diagnostic confidence may be reduced.`,
			suggestedAction: 'Consider repeating with a fresh, correctly-collected midstream specimen.'
		});
	}

	// ─── unexpected-finding (mixed growth likely contaminant) ───
	if (r.cultureResult === 'mixed-growth-likely-contaminant') {
		flags.push({
			flagId: 'F-UNEXPECTED-FINDING-001',
			category: 'unexpected-finding',
			priority: 'low',
			description: 'Mixed growth, likely contaminant; significance uncertain.',
			suggestedAction: 'Recommend a repeat specimen if clinically indicated to confirm significance.'
		});
	}

	// ─── incidental-finding (glucosuria) ───
	if (isDipstickPositive(r.glucose)) {
		flags.push({
			flagId: 'F-INCIDENTAL-FINDING-001',
			category: 'incidental-finding',
			priority: 'low',
			description: 'Glucosuria detected on dipstick (incidental finding).',
			suggestedAction: 'Consider screening for diabetes per the relevant pathway.'
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

	// ─── missing-measurement (significant growth but no colony count) ───
	if (hasSignificantGrowth(r) && r.colonyCountCfuMl.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-MEASUREMENT-001',
			category: 'missing-measurement',
			priority: 'low',
			description: 'Significant growth reported but no colony count was recorded.',
			suggestedAction: 'Record the colony count (cfu/mL) to support the significance interpretation.'
		});
	}

	// ─── discrepancy-with-request (UTI features but no originating request) ───
	if (hasUtiFeatures(r) && r.originatingRequestReference.trim() === '') {
		flags.push({
			flagId: 'F-DISCREPANCY-001',
			category: 'discrepancy-with-request',
			priority: 'low',
			description: 'Abnormal findings are present but no originating request reference is recorded.',
			suggestedAction: 'Link the report to the originating request to support discrepancy review.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
