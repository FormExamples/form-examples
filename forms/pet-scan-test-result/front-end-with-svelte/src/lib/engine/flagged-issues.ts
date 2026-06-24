import type { PetScanResult, Flag, FlagPriority } from './types';
import { hasCriticalFinding } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror sql/07_create_table_pet_scan_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: PetScanResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert (auto-raised with a critical finding) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description: 'A critical finding (distant metastasis or progressive disease) is present.',
			suggestedAction:
				'Communicate the critical result to the referrer immediately, request urgent oncology review, and document the communication.'
		});

		// critical result that has not yet been communicated
		if (!r.criticalResultCommunicated) {
			flags.push({
				flagId: 'F-CRITICAL-RESULT-002',
				category: 'critical-result-alert',
				priority: 'high',
				description: 'Critical finding present but the result has not been recorded as communicated.',
				suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
			});
		}
	}

	// ─── abnormal-requiring-action ───
	if (r.distantMetastasis && r.treatmentResponse !== 'progressive') {
		flags.push({
			flagId: 'F-ABNORMAL-ACTION-001',
			category: 'abnormal-requiring-action',
			priority: 'high',
			description: 'Distant metastatic disease is present and requires timely action.',
			suggestedAction: 'Ensure the referrer is alerted and a clear oncology action plan is documented.'
		});
	}

	// ─── urgent-referral ───
	if ((r.hypermetabolicLesion || r.nodalUptake) && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'medium',
			description: 'Abnormal tracer uptake (hypermetabolic lesion or nodal uptake) is present and may warrant urgent referral.',
			suggestedAction: 'Consider urgent referral to the appropriate oncology / specialist team.'
		});
	}

	// ─── inadequate-technique ───
	if (r.examinationAdequacy === 'non-diagnostic' || r.examinationAdequacy === 'limited') {
		flags.push({
			flagId: 'F-INADEQUATE-TECHNIQUE-001',
			category: 'inadequate-technique',
			priority: r.examinationAdequacy === 'non-diagnostic' ? 'high' : 'medium',
			description: `Examination adequacy is ${r.examinationAdequacy}; diagnostic confidence may be reduced.`,
			suggestedAction: 'Consider repeating or supplementing the examination to reach diagnostic quality.'
		});
	}

	// ─── inadequate-technique (high blood glucose degrades FDG uptake) ───
	if (r.bloodGlucoseMmolL !== null && r.bloodGlucoseMmolL >= 11) {
		flags.push({
			flagId: 'F-INADEQUATE-TECHNIQUE-002',
			category: 'inadequate-technique',
			priority: 'medium',
			description: `Pre-injection blood glucose is ${r.bloodGlucoseMmolL} mmol/L (>= 11); FDG uptake quality may be reduced.`,
			suggestedAction: 'Document the glucose level and consider rescanning after glycaemic control if the study is non-diagnostic.'
		});
	}

	// ─── incidental-finding ───
	if (r.incidentalFinding) {
		flags.push({
			flagId: 'F-INCIDENTAL-FINDING-001',
			category: 'incidental-finding',
			priority: 'low',
			description: 'One or more incidental findings are documented.',
			suggestedAction: 'Manage the incidental finding per the relevant structured pathway.'
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

	// ─── missing-measurement ───
	if (r.hypermetabolicLesion && r.suvMax === null) {
		flags.push({
			flagId: 'F-MISSING-MEASUREMENT-001',
			category: 'missing-measurement',
			priority: 'low',
			description: 'A hypermetabolic lesion is reported but no SUVmax was recorded.',
			suggestedAction: 'Record the SUVmax of the most-avid reference lesion for surveillance.'
		});
	}

	// ─── unexpected-finding (abnormal but no originating request linked) ───
	if (
		(r.hypermetabolicLesion || r.distantMetastasis) &&
		r.originatingRequestReference.trim() === ''
	) {
		flags.push({
			flagId: 'F-UNEXPECTED-FINDING-001',
			category: 'unexpected-finding',
			priority: 'low',
			description: 'A significant finding is present but no originating request reference is recorded.',
			suggestedAction: 'Link the report to the originating request to support discrepancy review.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
