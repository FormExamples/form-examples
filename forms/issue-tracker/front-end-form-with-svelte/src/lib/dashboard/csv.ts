// RFC 4180 CSV exporter for the issue-tracker dashboard.
//
// Pure function — takes an array of `IssueRow` objects (the same shape
// the dashboard table renders) and emits a single CSV string suitable
// for `Blob` download.
//
// Conventions:
//   - CRLF line endings (RFC 4180 §2.1).
//   - Quote any field containing a comma, double-quote, CR, or LF.
//   - Escape an embedded double-quote by doubling it ("" inside "...").
//   - Empty / null values render as the empty string.
//   - Numeric values pass through their `String()` representation.
//   - The first row is always the header derived from the column list.

export interface IssueRow {
	id: string;
	status: string;
	compositePriority: string;
	scoreByPriorityRank: number | null;
	scoreBySeverityOfImpact: number | null;
	scoreByMagnitudeOfDamage: number | null;
	scoreByHarmGrade: number | null;
	scoreByFailureCondition: string;
	scoreByMoscowRequirement: number | null;
	scoreByFrequencyPercent: number | null;
	ccSummary: string;
	systemName: string;
	environment: string;
	ptAssignees: string;
	reportedAt: string;
	[k: string]: unknown;
}

export interface CsvColumn {
	header: string;
	field: keyof IssueRow;
}

export const DEFAULT_COLUMNS: CsvColumn[] = [
	{ header: 'id', field: 'id' },
	{ header: 'status', field: 'status' },
	{ header: 'composite_priority', field: 'compositePriority' },
	{ header: 'priority_rank', field: 'scoreByPriorityRank' },
	{ header: 'severity', field: 'scoreBySeverityOfImpact' },
	{ header: 'magnitude', field: 'scoreByMagnitudeOfDamage' },
	{ header: 'harm_grade', field: 'scoreByHarmGrade' },
	{ header: 'failure_condition', field: 'scoreByFailureCondition' },
	{ header: 'moscow', field: 'scoreByMoscowRequirement' },
	{ header: 'frequency_percent', field: 'scoreByFrequencyPercent' },
	{ header: 'cc_summary', field: 'ccSummary' },
	{ header: 'system_name', field: 'systemName' },
	{ header: 'environment', field: 'environment' },
	{ header: 'assignees', field: 'ptAssignees' },
	{ header: 'reported_at', field: 'reportedAt' },
];

const CRLF = '\r\n';
const QUOTE = '"';
const NEEDS_QUOTING = /[",\r\n]/;

function escapeCell(v: unknown): string {
	if (v === null || v === undefined) return '';
	let s = typeof v === 'string' ? v : String(v);
	// Defensive: strip leading characters that some spreadsheet apps treat
	// as formulas (`=`, `+`, `-`, `@`) by prefixing a single quote. Common
	// CSV-injection mitigation per OWASP.
	if (s.length > 0 && '=+-@'.includes(s[0])) {
		s = `'${s}`;
	}
	if (NEEDS_QUOTING.test(s)) {
		return `${QUOTE}${s.replace(/"/g, '""')}${QUOTE}`;
	}
	return s;
}

export function toCsv(
	rows: IssueRow[],
	columns: CsvColumn[] = DEFAULT_COLUMNS,
): string {
	const header = columns.map((c) => escapeCell(c.header)).join(',');
	const body = rows
		.map((r) => columns.map((c) => escapeCell(r[c.field])).join(','))
		.join(CRLF);
	return rows.length === 0 ? header + CRLF : header + CRLF + body + CRLF;
}

/**
 * Convenience: trigger a browser download of the CSV.
 *
 * Pulled out so the pure `toCsv` stays unit-testable. Caller wires this
 * to the dashboard's "Export CSV" button.
 */
export function downloadCsv(
	rows: IssueRow[],
	filename = `issues-${new Date().toISOString().slice(0, 10)}.csv`,
	columns: CsvColumn[] = DEFAULT_COLUMNS,
): void {
	const csv = toCsv(rows, columns);
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
