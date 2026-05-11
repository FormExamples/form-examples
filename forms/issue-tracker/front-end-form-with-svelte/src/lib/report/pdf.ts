// pdfmake-compatible docDefinition builder for the issue-tracker report.
//
// Pure function returning a structured object suitable for
// `pdfMake.createPdf(buildReportDocDefinition(data, result))`. No
// runtime pdfmake dependency in this module — the SvelteKit endpoint
// or browser-side glue imports pdfmake separately when it's time to
// actually render bytes.
//
// The structure follows pdfmake's docDefinition shape (see
// pdfmake.github.io/docs). We use only widely-supported node kinds:
// `text`, `stack`, `table`, `columns`, plus the `style` registry.

import type {
	AdditionalFlag,
	CompositePriority,
	FiredRule,
	GradeResult,
	IssueTrackerAssessment,
} from '../engine/types';

// pdfmake doesn't ship its own TS types in this codebase; use a loose
// `Json`-style type for the docDefinition so the test can introspect.
type DocNode = Record<string, unknown> | string | number;
type Style = Record<string, unknown>;

export interface ReportDocOptions {
	issueId: string;
	dashboardUrl?: string;
	footer?: string;
	now?: () => Date;
}

const COMPOSITE_HEX: Record<CompositePriority, string> = {
	low: '#16a34a',
	moderate: '#ca8a04',
	high: '#ea580c',
	critical: '#dc2626',
};

export function buildReportDocDefinition(
	data: IssueTrackerAssessment,
	result: GradeResult,
	opts: ReportDocOptions,
): Record<string, unknown> {
	const composite = result.compositePriority;
	const compositeUpper = composite.toUpperCase();
	const generatedAt = (opts.now ? opts.now() : new Date()).toISOString();

	const content: DocNode[] = [
		titleRow(opts.issueId, compositeUpper, COMPOSITE_HEX[composite]),
		{
			text: data.cc.ccSummary || '(no chief complaint)',
			style: 'cc',
		},
		spacer(8),
		metadataRow(data),
		spacer(12),
		sectionHeader('Seven scores'),
		scoresTable(result),
		spacer(12),
		sectionHeader('Fired rules'),
		ruleList(result.firedRules),
		spacer(12),
		sectionHeader('Safety flags'),
		flagList(result.additionalFlags),
		spacer(12),
		sectionHeader('SOAP-style sections'),
		soapBlock(data),
	];

	if (opts.dashboardUrl) {
		content.push(spacer(12), {
			text: [
				{ text: 'Dashboard: ', style: 'muted' },
				{ text: opts.dashboardUrl, link: opts.dashboardUrl, color: '#2563eb' },
			],
		});
	}

	const docDefinition: Record<string, unknown> = {
		info: {
			title: `Issue ${opts.issueId} — Issue Tracker report`,
			author: 'Issue Tracker',
			subject: data.cc.ccSummary || '(no chief complaint)',
			creator: 'issue-tracker',
		},
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		defaultStyle: { font: 'Helvetica', fontSize: 10, lineHeight: 1.3 },
		styles: stylesRegistry(),
		footer: {
			text:
				opts.footer ??
				`Issue ${opts.issueId} — generated ${generatedAt}`,
			alignment: 'center',
			fontSize: 8,
			color: '#6b7280',
			margin: [0, 20, 0, 0],
		},
		content,
	};

	return docDefinition;
}

function stylesRegistry(): Record<string, Style> {
	return {
		title: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
		badge: { fontSize: 10, bold: true, color: 'white' },
		cc: { fontSize: 12, italics: true, margin: [0, 0, 0, 8] },
		sectionHeader: {
			fontSize: 13,
			bold: true,
			color: '#1f2937',
			margin: [0, 8, 0, 4],
		},
		scoreLabel: { color: '#6b7280' },
		scoreValue: { bold: true },
		ruleId: { color: '#2563eb' },
		flagHigh: { color: '#dc2626', bold: true },
		flagMedium: { color: '#ea580c', bold: true },
		flagLow: { color: '#6b7280' },
		muted: { color: '#6b7280' },
	};
}

function spacer(height: number): DocNode {
	return { text: ' ', margin: [0, 0, 0, height] };
}

function sectionHeader(text: string): DocNode {
	return { text, style: 'sectionHeader' };
}

function titleRow(issueId: string, compositeUpper: string, hex: string): DocNode {
	return {
		columns: [
			{
				text: `Issue ${issueId}`,
				style: 'title',
				width: '*',
			},
			{
				width: 'auto',
				table: {
					body: [
						[
							{
								text: compositeUpper,
								style: 'badge',
								fillColor: hex,
								margin: [10, 4, 10, 4],
							},
						],
					],
				},
				layout: 'noBorders',
			},
		],
	};
}

function metadataRow(data: IssueTrackerAssessment): DocNode {
	const r = data.reporter;
	return {
		columns: [
			labeled('System', r.systemName),
			labeled('Environment', r.environment),
			labeled('Category', r.issueCategory),
			labeled('Reported', r.reportedAt),
		],
		columnGap: 12,
	};
}

function labeled(label: string, value: string): DocNode {
	return {
		stack: [
			{ text: label, style: 'scoreLabel', fontSize: 9 },
			{ text: nonEmpty(value), style: 'scoreValue' },
		],
	};
}

function scoresTable(result: GradeResult): DocNode {
	const rows: DocNode[][] = [
		[hd('Instrument'), hd('Score')],
		row('Priority rank', scalar(result.scoreByPriorityRank)),
		row('Severity of impact', scalar(result.scoreBySeverityOfImpact)),
		row('Magnitude of damage', scalar(result.scoreByMagnitudeOfDamage)),
		row('Harm grade (LFPSE)', scalar(result.scoreByHarmGrade)),
		row('Failure condition', nonEmpty(result.scoreByFailureCondition)),
		row('MoSCoW requirement', scalar(result.scoreByMoscowRequirement)),
		row('Frequency %', scalar(result.scoreByFrequencyPercent)),
	];
	return {
		table: { headerRows: 1, widths: ['*', 'auto'], body: rows },
		layout: 'lightHorizontalLines',
	};
}

function hd(text: string): DocNode {
	return { text, bold: true, fillColor: '#f1f5f9', margin: [4, 4, 4, 4] };
}

function row(label: string, value: string): DocNode[] {
	return [
		{ text: label, margin: [4, 4, 4, 4] },
		{ text: value, alignment: 'right', margin: [4, 4, 4, 4] },
	];
}

function ruleList(rules: FiredRule[]): DocNode {
	if (rules.length === 0) return { text: '(none)', style: 'muted' };
	return {
		ul: rules.map((r) => ({
			text: [
				{ text: r.ruleId, style: 'ruleId' },
				` (${r.instrument}) — ${r.description}`,
			],
		})),
	};
}

function flagList(flags: AdditionalFlag[]): DocNode {
	if (flags.length === 0) return { text: '(none)', style: 'muted' };
	return {
		ul: flags.map((f) => ({
			text: [
				{ text: `[${f.category}] `, style: priorityStyle(f.priority) },
				f.description,
				`\n   action: ${f.suggestedAction}`,
			],
		})),
	};
}

function priorityStyle(p: AdditionalFlag['priority']): string {
	if (p === 'high') return 'flagHigh';
	if (p === 'medium') return 'flagMedium';
	return 'flagLow';
}

function soapBlock(data: IssueTrackerAssessment): DocNode {
	const sections: [string, string][] = [
		['Chief Complaint (CC)', data.cc.ccLongDescription],
		['Participants (Pt) — assignees', data.pt.ptAssignees],
		['Symptoms (Sx)', data.sx.sxExternalSignals],
		['Fractures (Fx)', data.fx.fxBrokenComponents],
		['History (Hx)', data.hx.hxTimeline],
		['Investigations (Ix)', data.ix.ixHypotheses],
		['Diagnosis (Dx)', data.dx.dxRootCause],
		['Treatments (Tx)', data.txpx.txMitigationSteps],
		['Prognosis (Px)', data.txpx.pxResidualRisk],
	];
	return {
		stack: sections.map(([title, body]) => ({
			stack: [
				{ text: title, bold: true, margin: [0, 4, 0, 2] },
				{ text: nonEmpty(body) },
			],
		})),
	};
}

function nonEmpty(s: string): string {
	return s && s.trim() !== '' ? s : '—';
}

function scalar<T>(v: T | null): string {
	return v === null || v === undefined ? '—' : String(v);
}
