import { browser } from '$app/env';
import type { GradeResult, IssueTrackerAssessment } from '#lib/engine/types.js';

/** localStorage draft key for a given issue id (defaults to `new`). */
function storageKey(id: string): string {
	return `issue-tracker.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank issue with all fields at their unanswered defaults. */
export function createDefaultAssessment(): IssueTrackerAssessment {
	return {
		reporter: {
			reporterName: '',
			reporterEmail: '',
			reporterRole: '',
			reportedAt: '',
			discoveredAt: '',
			issueCategory: '',
			environment: '',
			systemName: '',
			component: '',
			customerOrProjectTag: '',
			externalReference: ''
		},
		cc: {
			ccSummary: '',
			ccLongDescription: '',
			ccReportedByName: '',
			ccReportedVia: ''
		},
		pt: {
			ptDiscovererName: '',
			ptAffectedUsersCount: null,
			ptAffectedUserGroups: '',
			ptAssignees: '',
			ptStakeholdersToInform: '',
			ptObservers: ''
		},
		sx: {
			sxExternalSignals: '',
			sxAlertIds: '',
			sxErrorMessages: '',
			sxScreenshotsUrl: '',
			sxLogsUrl: '',
			sxFirstObservedAt: ''
		},
		fx: {
			fxBrokenComponents: '',
			fxFailedServices: '',
			fxStuckProcesses: '',
			fxHardwareFaults: '',
			fxDataCorruption: ''
		},
		hx: {
			hxRelatedIssues: '',
			hxPriorOccurrences: null,
			hxRecentChangeUrl: '',
			hxReferences: '',
			hxTimeline: ''
		},
		ix: {
			ixHypotheses: '',
			ixReproSteps: '',
			ixDiagnosticQueries: '',
			ixTestsRun: '',
			ixBlockingUnknowns: ''
		},
		dx: {
			dxRootCause: '',
			dxContributingCauses: '',
			dxScope: '',
			dxConfirmed: ''
		},
		txpx: {
			txMitigationSteps: '',
			txFixPlan: '',
			txWorkaround: '',
			txRollbackPlan: '',
			txCommunicationPlan: '',
			pxExpectedResolutionAt: '',
			pxResidualRisk: '',
			pxMonitoringPlan: '',
			pxRecurrenceLikelihood: '',
			pxLessonsLearned: ''
		},
		scores: {
			scoreByPriorityRank: null,
			scoreBySeverityOfImpact: null,
			scoreByMagnitudeOfDamage: null,
			scoreByHarmGrade: null,
			scoreByFailureCondition: '',
			scoreByMoscowRequirement: null,
			scoreByFrequencyPercent: null
		}
	};
}

/**
 * Svelte 5 reactive store for the issue tracker, with localStorage
 * persistence so an in-progress issue survives a page reload. Drafts are
 * keyed by issue id so each record edits independently.
 */
class AssessmentStore {
	data = $state<IssueTrackerAssessment>(createDefaultAssessment());
	result = $state<GradeResult | null>(null);
	currentStep = $state(1);
	/** The id of the issue currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	constructor() {
		if (browser) {
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
				});
			});
		}
	}

	/**
	 * Load the issue for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` issue is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.reporter`) stay bound to live state.
	 */
	loadForId(id: string, seed?: IssueTrackerAssessment) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: IssueTrackerAssessment | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as IssueTrackerAssessment;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultAssessment() as unknown as Record<string, unknown>
		);
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new issue is loaded.
 */
function deepAssign(target: Record<string, unknown>, source: Record<string, unknown>) {
	for (const key of Object.keys(source)) {
		const sv = source[key];
		const tv = target[key];
		if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object') {
			deepAssign(tv as Record<string, unknown>, sv as Record<string, unknown>);
		} else {
			target[key] = sv;
		}
	}
}

export const assessment = new AssessmentStore();
