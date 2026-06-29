import type { BloodTestRequest, Flag, FlagContext, FlagPriority } from './types';
import { PANELS, CRITICAL_PANELS, countSelectedPanels } from './panels';

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror the SQL grade_flag CHECK constraint. Flags are returned sorted high →
 * medium → low priority. Flag IDs are stable and identical across every
 * front-end and the back-end.
 */
export function detectFlags(data: BloodTestRequest, context: FlagContext = {}): Flag[] {
	const flags: Flag[] = [];
	const selectedCount = countSelectedPanels(data.panels);

	// ─── No test selected ───
	if (selectedCount === 0) {
		flags.push({
			flagId: 'F-NO-TEST-SELECTED-001',
			category: 'no-test-selected',
			priority: 'high',
			description: 'No blood-test panel has been selected.',
			suggestedAction:
				'Query the referrer; a request with no panel selected cannot be processed.'
		});
	}

	// ─── Fasting required not met ───
	if (context.fastingViolation === true) {
		flags.push({
			flagId: 'F-FASTING-REQUIRED-NOT-MET-001',
			category: 'fasting-required-not-met',
			priority: 'medium',
			description:
				'A fasting-required test was collected non-fasting, or fasting status is unknown.',
			suggestedAction:
				'Confirm fasting status; consider re-collecting fasting samples (e.g. lipid profile, fasting glucose).'
		});
	}

	// ─── Retest-interval breach (heuristic) ───
	const monitoringPanels = ['hba1cMonitoring', 'lipidProfile', 'thyroidFunction'] as const;
	const monitoringSelected = monitoringPanels.some((f) => data.panels[f]);
	if (
		monitoringSelected &&
		data.clinical.primaryIndication === 'routine-monitoring' &&
		data.clinical.clinicalDetails.trim() === ''
	) {
		flags.push({
			flagId: 'F-RETEST-INTERVAL-BREACH-001',
			category: 'retest-interval-breach',
			priority: 'low',
			description:
				'Routine monitoring test ordered without clinical details — may breach the RCPath minimum retesting interval.',
			suggestedAction:
				'Check the date of the last identical test against the RCPath National Minimum Retesting Intervals (G147).'
		});
	}

	// ─── Duplicate recent test (heuristic) ───
	if (
		data.panels.fullBloodCount &&
		data.panels.ureaElectrolytes &&
		data.clinical.primaryIndication === 'routine-monitoring' &&
		data.triage.urgency === 'routine' &&
		data.clinical.clinicalDetails.trim() === ''
	) {
		flags.push({
			flagId: 'F-DUPLICATE-RECENT-TEST-001',
			category: 'duplicate-recent-test',
			priority: 'low',
			description: 'Routine FBC + U&E with no clinical details may duplicate a recent result.',
			suggestedAction: 'Confirm a recent identical result is not already available before bleeding.'
		});
	}

	// ─── Blood-borne-virus precaution ───
	if (data.safety.knownBloodBorneVirus) {
		flags.push({
			flagId: 'F-BLOOD-BORNE-VIRUS-PRECAUTION-001',
			category: 'blood-borne-virus-precaution',
			priority: 'medium',
			description: 'Patient has a known blood-borne virus.',
			suggestedAction:
				'Apply standard / enhanced phlebotomy precautions and label the sample as a biohazard per local policy.'
		});
	}

	// ─── Stat / critical test ───
	const criticalSelected = CRITICAL_PANELS.filter((f) => data.panels[f]);
	if (context.triageTier === 'stat' || criticalSelected.length > 0) {
		const names = criticalSelected
			.map((f) => {
				const p = PANELS.find((x) => x.field === f);
				return p ? p.label : String(f);
			})
			.join(', ');
		flags.push({
			flagId: 'F-STAT-CRITICAL-001',
			category: 'stat-critical',
			priority: 'high',
			description: names
				? `Critical / time-sensitive test requested (${names}).`
				: 'Stat turnaround requested.',
			suggestedAction:
				'Process immediately and telephone any critical result to the requesting clinician.'
		});
	}

	// ─── Completeness / data-quality flags ───
	if (!data.clinical.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (data.clinical.clinicalDetails.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-DETAILS-001',
			category: 'missing-clinical-details',
			priority: 'medium',
			description: 'No clinical details recorded to support the request.',
			suggestedAction:
				'Query the referrer for the clinical details the laboratory needs to interpret the result.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
