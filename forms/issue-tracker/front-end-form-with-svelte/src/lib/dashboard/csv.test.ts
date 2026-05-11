import { describe, expect, it } from 'vitest';
import { DEFAULT_COLUMNS, toCsv } from './csv';
import type { CsvColumn, IssueRow } from './csv';

function row(overrides: Partial<IssueRow> = {}): IssueRow {
	return {
		id: 'ISSUE-2026-0001',
		status: 'open',
		compositePriority: 'high',
		scoreByPriorityRank: 2,
		scoreBySeverityOfImpact: 4,
		scoreByMagnitudeOfDamage: 6,
		scoreByHarmGrade: 1,
		scoreByFailureCondition: 'C',
		scoreByMoscowRequirement: 2,
		scoreByFrequencyPercent: 35,
		ccSummary: 'Login endpoint returning 500',
		systemName: 'auth-service',
		environment: 'production',
		ptAssignees: 'identity-team',
		reportedAt: '2026-05-06T14:02:00Z',
		...overrides,
	};
}

describe('toCsv', () => {
	it('emits a header-only file when rows is empty', () => {
		const csv = toCsv([]);
		expect(csv).toBe(
			'id,status,composite_priority,priority_rank,severity,magnitude,harm_grade,failure_condition,moscow,frequency_percent,cc_summary,system_name,environment,assignees,reported_at\r\n',
		);
	});

	it('uses CRLF line endings per RFC 4180 §2.1', () => {
		const csv = toCsv([row()]);
		const lines = csv.split('\r\n');
		// header + 1 row + trailing empty after final CRLF
		expect(lines).toHaveLength(3);
		expect(lines[2]).toBe('');
	});

	it('renders cells in the column order defined by DEFAULT_COLUMNS', () => {
		const csv = toCsv([row()]);
		const lines = csv.split('\r\n');
		const cells = lines[1].split(',');
		expect(cells[0]).toBe('ISSUE-2026-0001');
		expect(cells[2]).toBe('high');
		expect(cells[4]).toBe('4'); // severity
		expect(cells[7]).toBe('C'); // failure_condition
	});

	it('renders nullable numeric fields as empty strings', () => {
		const csv = toCsv([row({ scoreByHarmGrade: null, scoreByFrequencyPercent: null })]);
		const cells = csv.split('\r\n')[1].split(',');
		// harm_grade is column index 6; frequency_percent is index 9.
		expect(cells[6]).toBe('');
		expect(cells[9]).toBe('');
	});

	it('quotes fields containing commas', () => {
		const csv = toCsv([row({ ccSummary: 'Login, billing, and reports endpoints down' })]);
		expect(csv).toContain('"Login, billing, and reports endpoints down"');
	});

	it('escapes embedded double-quotes by doubling them', () => {
		const csv = toCsv([row({ ccSummary: 'User reports "feature gone" after upgrade' })]);
		expect(csv).toContain('"User reports ""feature gone"" after upgrade"');
	});

	it('quotes fields containing newlines', () => {
		const csv = toCsv([row({ ccSummary: 'first line\r\nsecond line' })]);
		const expected = '"first line\r\nsecond line"';
		expect(csv).toContain(expected);
	});

	it('mitigates CSV-injection by prefixing formula leaders with a single quote', () => {
		const csv = toCsv([
			row({ ccSummary: '=cmd|"/c calc"!A1' }),
			row({ ccSummary: '+1 234 567' }),
			row({ ccSummary: '-3' }),
			row({ ccSummary: '@SUM(A1:A10)' }),
		]);
		expect(csv).toContain("'=cmd|");
		expect(csv).toContain("'+1 234 567");
		expect(csv).toContain("'-3");
		expect(csv).toContain("'@SUM(A1:A10)");
	});

	it('accepts a custom column set', () => {
		const cols: CsvColumn[] = [
			{ header: 'ID', field: 'id' },
			{ header: 'Composite', field: 'compositePriority' },
		];
		const csv = toCsv([row()], cols);
		expect(csv.split('\r\n')[0]).toBe('ID,Composite');
		expect(csv.split('\r\n')[1]).toBe('ISSUE-2026-0001,high');
	});

	it('round-trips multiple rows in the order given', () => {
		const csv = toCsv([
			row({ id: 'A' }),
			row({ id: 'B' }),
			row({ id: 'C' }),
		]);
		const lines = csv.split('\r\n');
		expect(lines[1].startsWith('A,')).toBe(true);
		expect(lines[2].startsWith('B,')).toBe(true);
		expect(lines[3].startsWith('C,')).toBe(true);
	});

	it('exposes a stable DEFAULT_COLUMNS shape (15 columns)', () => {
		expect(DEFAULT_COLUMNS).toHaveLength(15);
		expect(DEFAULT_COLUMNS.map((c) => c.field)).toEqual([
			'id',
			'status',
			'compositePriority',
			'scoreByPriorityRank',
			'scoreBySeverityOfImpact',
			'scoreByMagnitudeOfDamage',
			'scoreByHarmGrade',
			'scoreByFailureCondition',
			'scoreByMoscowRequirement',
			'scoreByFrequencyPercent',
			'ccSummary',
			'systemName',
			'environment',
			'ptAssignees',
			'reportedAt',
		]);
	});
});
