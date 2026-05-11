import { describe, expect, it } from 'vitest';
import { gradeIssue } from './composite-grader';
import type { IssueTrackerAssessment, RawScores } from './types';

function blankAssessment(scores: Partial<RawScores> = {}): IssueTrackerAssessment {
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
			...scores,
		},
	};
}

describe('gradeIssue — empty assessment', () => {
	it('grades an empty assessment as low priority with only the composite rule fired', () => {
		const r = gradeIssue(blankAssessment());
		expect(r.compositePriority).toBe('low');
		expect(r.firedRules).toHaveLength(1);
		expect(r.firedRules[0].instrument).toBe('composite');
		expect(r.additionalFlags).toEqual([]);
	});
});

describe('gradeIssue — single-dimension drives composite (max-grade)', () => {
	it('priority rank 1 → critical', () => {
		const r = gradeIssue(blankAssessment({ scoreByPriorityRank: 1 }));
		expect(r.compositePriority).toBe('critical');
	});
	it('severity 5 → critical', () => {
		const r = gradeIssue(blankAssessment({ scoreBySeverityOfImpact: 5 }));
		expect(r.compositePriority).toBe('critical');
	});
	it('magnitude 10 → critical', () => {
		const r = gradeIssue(blankAssessment({ scoreByMagnitudeOfDamage: 10 }));
		expect(r.compositePriority).toBe('critical');
	});
	it('harm 4 → critical', () => {
		const r = gradeIssue(blankAssessment({ scoreByHarmGrade: 4 }));
		expect(r.compositePriority).toBe('critical');
	});
	it('failure A → critical', () => {
		const r = gradeIssue(blankAssessment({ scoreByFailureCondition: 'A' }));
		expect(r.compositePriority).toBe('critical');
	});
	it('moscow 1 → high (not critical)', () => {
		const r = gradeIssue(blankAssessment({ scoreByMoscowRequirement: 1 }));
		expect(r.compositePriority).toBe('high');
	});
	it('frequency 100% → critical', () => {
		const r = gradeIssue(blankAssessment({ scoreByFrequencyPercent: 100 }));
		expect(r.compositePriority).toBe('critical');
	});
	it('failure D + severity 1 + frequency 1% stays low', () => {
		const r = gradeIssue(
			blankAssessment({
				scoreByFailureCondition: 'D',
				scoreBySeverityOfImpact: 1,
				scoreByFrequencyPercent: 1,
			}),
		);
		expect(r.compositePriority).toBe('low');
	});
});

describe('gradeIssue — safety flags', () => {
	it('harm 4 fires the harm-fatal flag', () => {
		const r = gradeIssue(blankAssessment({ scoreByHarmGrade: 4 }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('harm-fatal');
	});
	it('failure A fires the failure-catastrophic flag', () => {
		const r = gradeIssue(blankAssessment({ scoreByFailureCondition: 'A' }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('failure-catastrophic');
	});
	it('severity 5 fires the severity-catastrophic flag', () => {
		const r = gradeIssue(blankAssessment({ scoreBySeverityOfImpact: 5 }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('severity-catastrophic');
	});
	it('magnitude 10 fires the magnitude-total-destruction flag', () => {
		const r = gradeIssue(blankAssessment({ scoreByMagnitudeOfDamage: 10 }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('magnitude-total-destruction');
	});
	it('frequency >= 95 fires the frequency-universal flag', () => {
		const r = gradeIssue(blankAssessment({ scoreByFrequencyPercent: 99 }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('frequency-universal');
	});
	it('clinical-safety + harm 2 fires the regulatory flag', () => {
		const data = blankAssessment({ scoreByHarmGrade: 2 });
		data.reporter.issueCategory = 'clinical-safety';
		const r = gradeIssue(data);
		expect(r.additionalFlags.map((f) => f.category)).toContain('regulatory');
	});
	it('moscow 1 fires the requirement-mandatory flag', () => {
		const r = gradeIssue(blankAssessment({ scoreByMoscowRequirement: 1 }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('requirement-mandatory');
	});
});

describe('gradeIssue — fired rules', () => {
	it('records one rule per non-null instrument plus the composite rule', () => {
		const r = gradeIssue(
			blankAssessment({
				scoreByPriorityRank: 2,
				scoreBySeverityOfImpact: 3,
				scoreByMagnitudeOfDamage: 5,
				scoreByHarmGrade: 1,
				scoreByFailureCondition: 'C',
				scoreByMoscowRequirement: 2,
				scoreByFrequencyPercent: 25,
			}),
		);
		// 7 dimensions + 1 composite
		expect(r.firedRules).toHaveLength(8);
		expect(r.firedRules.map((x) => x.instrument)).toEqual([
			'priority',
			'severity',
			'magnitude',
			'harm',
			'failure',
			'moscow',
			'frequency',
			'composite',
		]);
	});
});
