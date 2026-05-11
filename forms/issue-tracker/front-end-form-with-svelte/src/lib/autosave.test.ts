import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clear, load, save, subscribe } from './autosave';
import type { IssueTrackerAssessment } from './engine/types';

// In-memory Storage mock that satisfies the Storage interface enough
// for autosave's needs.
function memoryStorage(): Storage {
	const store = new Map<string, string>();
	return {
		get length() {
			return store.size;
		},
		clear: () => store.clear(),
		key: (i) => Array.from(store.keys())[i] ?? null,
		getItem: (k) => store.get(k) ?? null,
		setItem: (k, v) => {
			store.set(k, String(v));
		},
		removeItem: (k) => {
			store.delete(k);
		},
	} as Storage;
}

function blank(): IssueTrackerAssessment {
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
			externalReference: '',
		},
		cc: { ccSummary: '', ccLongDescription: '', ccReportedByName: '', ccReportedVia: '' },
		pt: {
			ptDiscovererName: '',
			ptAffectedUsersCount: null,
			ptAffectedUserGroups: '',
			ptAssignees: '',
			ptStakeholdersToInform: '',
			ptObservers: '',
		},
		sx: {
			sxExternalSignals: '',
			sxAlertIds: '',
			sxErrorMessages: '',
			sxScreenshotsUrl: '',
			sxLogsUrl: '',
			sxFirstObservedAt: '',
		},
		fx: {
			fxBrokenComponents: '',
			fxFailedServices: '',
			fxStuckProcesses: '',
			fxHardwareFaults: '',
			fxDataCorruption: '',
		},
		hx: {
			hxRelatedIssues: '',
			hxPriorOccurrences: null,
			hxRecentChangeUrl: '',
			hxReferences: '',
			hxTimeline: '',
		},
		ix: {
			ixHypotheses: '',
			ixReproSteps: '',
			ixDiagnosticQueries: '',
			ixTestsRun: '',
			ixBlockingUnknowns: '',
		},
		dx: { dxRootCause: '', dxContributingCauses: '', dxScope: '', dxConfirmed: '' },
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
			pxLessonsLearned: '',
		},
		scores: {
			scoreByPriorityRank: null,
			scoreBySeverityOfImpact: null,
			scoreByMagnitudeOfDamage: null,
			scoreByHarmGrade: null,
			scoreByFailureCondition: '',
			scoreByMoscowRequirement: null,
			scoreByFrequencyPercent: null,
		},
	};
}

describe('save / load / clear', () => {
	let s: Storage;
	beforeEach(() => {
		s = memoryStorage();
	});

	it('round-trips a draft through save and load', () => {
		const data = blank();
		data.cc.ccSummary = 'Database read replica lagging';
		data.scores.scoreBySeverityOfImpact = 5;
		save('issue:draft', data, s);
		const out = load('issue:draft', s);
		expect(out).not.toBeNull();
		expect(out!.cc.ccSummary).toBe('Database read replica lagging');
		expect(out!.scores.scoreBySeverityOfImpact).toBe(5);
	});

	it('returns null when no draft is present', () => {
		expect(load('issue:nope', s)).toBeNull();
	});

	it('clear removes the saved draft', () => {
		save('issue:draft', blank(), s);
		clear('issue:draft', s);
		expect(load('issue:draft', s)).toBeNull();
	});

	it('returns null when stored JSON is malformed', () => {
		s.setItem('issue:draft', '{ this is not valid json');
		expect(load('issue:draft', s)).toBeNull();
	});

	it('returns null when the saved version does not match', () => {
		s.setItem(
			'issue:draft',
			JSON.stringify({ v: 99, savedAt: '2026-05-08T00:00:00Z', data: blank() }),
		);
		expect(load('issue:draft', s)).toBeNull();
	});

	it('returns null when the stored data fails schema validation', () => {
		// Saved blob has an out-of-range severity, which the engine schema rejects.
		const bogus = blank();
		(bogus.scores as unknown as { scoreBySeverityOfImpact: number }).scoreBySeverityOfImpact = 9;
		s.setItem(
			'issue:draft',
			JSON.stringify({ v: 1, savedAt: '2026-05-08T00:00:00Z', data: bogus }),
		);
		expect(load('issue:draft', s)).toBeNull();
	});
});

describe('subscribe (debounced writes)', () => {
	it('debounces consecutive writes and only persists the last one', () => {
		vi.useFakeTimers();
		try {
			const s = memoryStorage();
			const sub = subscribe('issue:draft', { debounceMs: 500, storage: s });

			const a = blank();
			a.cc.ccSummary = 'first';
			sub.write(a);

			vi.advanceTimersByTime(200);
			const b = blank();
			b.cc.ccSummary = 'second';
			sub.write(b);

			vi.advanceTimersByTime(200);
			const c = blank();
			c.cc.ccSummary = 'third';
			sub.write(c);

			// Less than debounceMs since the last write — nothing persisted yet.
			expect(s.getItem('issue:draft')).toBeNull();

			// Now wait for debounce.
			vi.advanceTimersByTime(500);

			const out = load('issue:draft', s);
			expect(out!.cc.ccSummary).toBe('third');
		} finally {
			vi.useRealTimers();
		}
	});

	it('flush persists immediately', () => {
		vi.useFakeTimers();
		try {
			const s = memoryStorage();
			const sub = subscribe('issue:draft', { debounceMs: 999_999, storage: s });
			const data = blank();
			data.cc.ccSummary = 'flush me';
			sub.write(data);
			expect(s.getItem('issue:draft')).toBeNull();
			sub.flush();
			expect(load('issue:draft', s)!.cc.ccSummary).toBe('flush me');
		} finally {
			vi.useRealTimers();
		}
	});

	it('cancel discards the pending write without persisting', () => {
		vi.useFakeTimers();
		try {
			const s = memoryStorage();
			const sub = subscribe('issue:draft', { debounceMs: 500, storage: s });
			sub.write(blank());
			sub.cancel();
			vi.advanceTimersByTime(1000);
			expect(load('issue:draft', s)).toBeNull();
		} finally {
			vi.useRealTimers();
		}
	});
});

describe('save without a Storage backend', () => {
	it('save / load / clear are silent no-ops when storage is null', () => {
		expect(() => save('k', blank(), null)).not.toThrow();
		expect(load('k', null)).toBeNull();
		expect(() => clear('k', null)).not.toThrow();
	});
});
