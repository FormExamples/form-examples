import type { XRayResult, Flag, FlagPriority } from './types';
import { hasCriticalFinding } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror sql/07_create_table_x_ray_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: XRayResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert (auto-raised with a critical finding) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description:
				'A critical finding (pneumothorax, free intraperitoneal air, or unstable fracture) is present.',
			suggestedAction:
				'Communicate the critical result to the referrer immediately and document the communication.'
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
	if ((r.fracture || r.dislocation) && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-ABNORMAL-ACTION-001',
			category: 'abnormal-requiring-action',
			priority: 'high',
			description: 'A fracture or dislocation requiring timely action is present.',
			suggestedAction: 'Ensure the referrer is alerted and a clear action plan is documented.'
		});
	}

	// ─── urgent-referral ───
	if (r.consolidation || r.pleuralEffusion) {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'medium',
			description: 'Consolidation or pleural effusion is present and may warrant urgent referral.',
			suggestedAction: 'Consider urgent referral to the appropriate specialist team.'
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

	// ─── missing-measurement (bony lesion reported with no projection detail) ───
	if (r.bonyLesion && r.projections.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-MEASUREMENT-001',
			category: 'missing-measurement',
			priority: 'low',
			description: 'A bony lesion is reported but no projections / views were recorded.',
			suggestedAction: 'Record the projections acquired to support lesion characterisation and review.'
		});
	}

	// ─── unexpected-finding (abnormal but no originating request linked) ───
	if ((r.fracture || r.bonyLesion || r.foreignBody) && r.originatingRequestReference.trim() === '') {
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
