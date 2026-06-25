import type { NerveConductionStudyResult, Flag, FlagPriority } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror sql/07_create_table_nerve_conduction_study_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: NerveConductionStudyResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert (auto-raised with a critical finding) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description: r.motorNeuroneDiseaseFeatures
				? 'Motor neurone disease / anterior-horn-cell features are present.'
				: 'A severe acute neuropathy (e.g. GBS pattern) is present.',
			suggestedAction:
				'Communicate the critical result to the referrer immediately, arrange urgent neurology review, and document the communication.'
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

	// ─── urgent-referral ───
	if (hasAnyAbnormalFinding(r) && r.severity === 'severe' && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'high',
			description: 'A severe electrodiagnostic abnormality may warrant expedited specialist review.',
			suggestedAction: 'Consider urgent referral to the appropriate specialist team.'
		});
	}

	// ─── abnormal-requiring-action ───
	if (
		(r.peripheralNeuropathy || r.neuromuscularJunctionDisorder) &&
		!hasCriticalFinding(r) &&
		r.severity !== 'severe'
	) {
		flags.push({
			flagId: 'F-ABNORMAL-ACTION-001',
			category: 'abnormal-requiring-action',
			priority: 'medium',
			description:
				'A peripheral neuropathy or neuromuscular-junction disorder is present and may require action.',
			suggestedAction: 'Ensure the referrer is alerted and a clear action plan is documented.'
		});
	}

	// ─── inadequate-technique ───
	if (r.studyAdequacy === 'non-diagnostic' || r.studyAdequacy === 'limited') {
		flags.push({
			flagId: 'F-INADEQUATE-TECHNIQUE-001',
			category: 'inadequate-technique',
			priority: r.studyAdequacy === 'non-diagnostic' ? 'high' : 'medium',
			description: `Study adequacy is ${r.studyAdequacy}; diagnostic confidence may be reduced.`,
			suggestedAction: 'Consider repeating or supplementing the study to reach diagnostic quality.'
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

	// ─── missing-measurement (abnormal finding but no findings narrative) ───
	if (
		hasAnyAbnormalFinding(r) &&
		r.nerveConductionFindings.trim() === '' &&
		r.emgFindings.trim() === ''
	) {
		flags.push({
			flagId: 'F-MISSING-MEASUREMENT-001',
			category: 'missing-measurement',
			priority: 'low',
			description: 'An abnormal finding is reported but no nerve-conduction or EMG findings are recorded.',
			suggestedAction:
				'Record the supporting nerve-conduction and / or needle-EMG findings for the diagnosis.'
		});
	}

	// ─── unexpected-finding (abnormal but no originating request linked) ───
	if (hasAnyAbnormalFinding(r) && r.originatingRequestReference.trim() === '') {
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
