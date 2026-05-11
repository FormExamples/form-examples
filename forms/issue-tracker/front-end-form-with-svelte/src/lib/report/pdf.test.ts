import { describe, expect, it } from 'vitest';
import { gradeIssue } from '../engine/composite-grader';
import type { IssueTrackerAssessment, RawScores } from '../engine/types';
import { buildReportDocDefinition } from './pdf';

function blank(scores: Partial<RawScores> = {}): IssueTrackerAssessment {
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

// JSON.stringify the doc and search the resulting string. Cheap way to
// assert the docDefinition contains expected text without walking the
// nested tree node-by-node.
const text = (doc: unknown) => JSON.stringify(doc);

describe('buildReportDocDefinition — top-level shape', () => {
	it('emits the standard pdfmake top-level keys', () => {
		const data = blank();
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, { issueId: 'demo-1' });
		expect(doc.pageSize).toBe('A4');
		expect(doc.pageMargins).toEqual([40, 60, 40, 60]);
		expect(doc.defaultStyle).toBeDefined();
		expect(doc.styles).toBeDefined();
		expect(doc.content).toBeInstanceOf(Array);
		expect(doc.footer).toBeDefined();
	});

	it('sets PDF metadata from the assessment', () => {
		const data = blank();
		data.cc.ccSummary = 'Pump dosing error after firmware update';
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, { issueId: 'demo-2' }) as Record<
			string,
			unknown
		>;
		const info = doc.info as Record<string, unknown>;
		expect(info.title).toContain('demo-2');
		expect(info.subject).toBe('Pump dosing error after firmware update');
		expect(info.creator).toBe('issue-tracker');
	});
});

describe('buildReportDocDefinition — content', () => {
	it('renders the composite-priority badge in upper case', () => {
		const data = blank({ scoreBySeverityOfImpact: 5 });
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, { issueId: 'X' });
		expect(text(doc)).toContain('"CRITICAL"');
	});

	it('renders the seven scores table with em-dash for null values', () => {
		const data = blank({ scoreBySeverityOfImpact: 4 });
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, { issueId: 'X' });
		const s = text(doc);
		expect(s).toContain('Severity of impact');
		expect(s).toContain('Harm grade (LFPSE)');
		// Empty fields render as em-dash.
		expect(s).toContain('—');
	});

	it('renders fired-rule IDs and the composite rule', () => {
		const data = blank({
			scoreBySeverityOfImpact: 5,
			scoreByHarmGrade: 2,
		});
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, { issueId: 'X' });
		const s = text(doc);
		expect(s).toContain('R-SEVERITY-5');
		expect(s).toContain('R-HARM-2');
		expect(s).toContain('R-COMPOSITE-CRITICAL');
	});

	it('renders safety flags with their priority styles', () => {
		const data = blank({ scoreByHarmGrade: 4 });
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, { issueId: 'X' });
		const s = text(doc);
		expect(s).toContain('harm-fatal');
		expect(s).toContain('flagHigh');
	});

	it('shows "(none)" for empty safety-flag and rule lists', () => {
		const data = blank();
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, { issueId: 'X' });
		const s = text(doc);
		// Empty assessment fires only the composite rule; safety flags is empty.
		expect(s).toContain('(none)');
	});

	it('appends the dashboard URL when provided', () => {
		const data = blank();
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, {
			issueId: 'X',
			dashboardUrl: 'https://example.com/dashboard?id=X',
		});
		expect(text(doc)).toContain('https://example.com/dashboard?id=X');
	});

	it('uses the now() override in the footer for reproducible test output', () => {
		const data = blank();
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, {
			issueId: 'X',
			now: () => new Date('2026-05-11T08:00:00Z'),
		}) as Record<string, unknown>;
		const footer = doc.footer as Record<string, unknown>;
		expect(footer.text).toContain('2026-05-11T08:00:00.000Z');
	});

	it('renders all nine SOAP-section headings', () => {
		const data = blank();
		const r = gradeIssue(data);
		const doc = buildReportDocDefinition(data, r, { issueId: 'X' });
		const s = text(doc);
		expect(s).toContain('Chief Complaint (CC)');
		expect(s).toContain('Participants (Pt)');
		expect(s).toContain('Symptoms (Sx)');
		expect(s).toContain('Fractures (Fx)');
		expect(s).toContain('History (Hx)');
		expect(s).toContain('Investigations (Ix)');
		expect(s).toContain('Diagnosis (Dx)');
		expect(s).toContain('Treatments (Tx)');
		expect(s).toContain('Prognosis (Px)');
	});
});
