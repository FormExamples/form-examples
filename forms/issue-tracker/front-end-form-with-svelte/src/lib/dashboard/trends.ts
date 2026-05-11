// Trend / aggregation helpers for the dashboard's management views.
//
// Pure functions over `IssueRow[]` (the same shape `csv.ts` exports
// and the dashboard table renders). No charting / DOM coupling — these
// functions return JSON-shaped buckets that a chart library (or the
// SVAR Grid summary row, or a `<table>`) can consume.

import type { IssueRow } from './csv';

export type Bucket<V = number> = Record<string, V>;

// ──────────────────────────────────────────────
// Counts
// ──────────────────────────────────────────────

/** Count rows. */
export const count = (rows: IssueRow[]): number => rows.length;

/**
 * Count rows grouped by the value of `field`. Empty / null values
 * bucket under the literal string `"(unspecified)"` so the caller
 * never gets a `null` key.
 */
export function countByField(
	rows: IssueRow[],
	field: keyof IssueRow,
): Bucket {
	const out: Bucket = {};
	for (const r of rows) {
		const k = bucketKey(r[field]);
		out[k] = (out[k] ?? 0) + 1;
	}
	return out;
}

/**
 * Count rows per ISO `YYYY-MM` derived from `reportedAt`. Rows with
 * an empty / unparseable `reportedAt` bucket under `"(unspecified)"`.
 * Output keys are sorted ascending (oldest month first).
 */
export function countByMonth(rows: IssueRow[]): Bucket {
	const raw: Bucket = {};
	for (const r of rows) {
		const m = monthKey(r.reportedAt);
		raw[m] = (raw[m] ?? 0) + 1;
	}
	return sortKeys(raw);
}

/**
 * Two-dimensional bucket: outer key is `YYYY-MM`, inner key is
 * `compositePriority`. Suitable as input to a stacked bar chart.
 */
export function countByCompositeAndMonth(
	rows: IssueRow[],
): Bucket<Bucket> {
	const out: Bucket<Bucket> = {};
	for (const r of rows) {
		const m = monthKey(r.reportedAt);
		const c = bucketKey(r.compositePriority);
		out[m] ??= {};
		out[m][c] = (out[m][c] ?? 0) + 1;
	}
	return sortOuterKeys(out);
}

// ──────────────────────────────────────────────
// Numeric stats
// ──────────────────────────────────────────────

export interface NumericStats {
	count: number;
	sum: number;
	avg: number | null;
	min: number | null;
	max: number | null;
}

const EMPTY_STATS: NumericStats = {
	count: 0, sum: 0, avg: null, min: null, max: null,
};

/**
 * Numeric stats over `numericField`, grouped by `groupBy`. Useful for
 * "harm grade by system" and "severity by environment" tables.
 *
 * Null values for `numericField` are excluded from the count.
 */
export function numericStatsByField(
	rows: IssueRow[],
	groupBy: keyof IssueRow,
	numericField: keyof IssueRow,
): Bucket<NumericStats> {
	const acc: Bucket<NumericStats> = {};
	for (const r of rows) {
		const v = r[numericField];
		if (v === null || v === undefined) continue;
		const n = typeof v === 'number' ? v : Number(v);
		if (!Number.isFinite(n)) continue;
		const k = bucketKey(r[groupBy]);
		const cur = acc[k] ?? { ...EMPTY_STATS };
		cur.count += 1;
		cur.sum += n;
		cur.min = cur.min === null ? n : Math.min(cur.min, n);
		cur.max = cur.max === null ? n : Math.max(cur.max, n);
		cur.avg = cur.sum / cur.count;
		acc[k] = cur;
	}
	return acc;
}

// ──────────────────────────────────────────────
// Top-N
// ──────────────────────────────────────────────

export interface TopNEntry {
	key: string;
	count: number;
}

/**
 * Sort the result of `countByField` descending and take the top `n`.
 * Useful for "top systems by issue count" leaderboards.
 */
export function topNByField(
	rows: IssueRow[],
	field: keyof IssueRow,
	n: number,
): TopNEntry[] {
	const counts = countByField(rows, field);
	return Object.entries(counts)
		.map(([key, count]) => ({ key, count }))
		.sort((a, b) => (b.count - a.count) || a.key.localeCompare(b.key))
		.slice(0, Math.max(0, n));
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const UNSPECIFIED = '(unspecified)';

function bucketKey(v: unknown): string {
	if (v === null || v === undefined || v === '') return UNSPECIFIED;
	return String(v);
}

const ISO_DATE = /^(\d{4}-\d{2})/;

function monthKey(reportedAt: string): string {
	if (!reportedAt) return UNSPECIFIED;
	const m = ISO_DATE.exec(reportedAt);
	return m ? m[1] : UNSPECIFIED;
}

function sortKeys<T>(obj: Bucket<T>): Bucket<T> {
	const keys = Object.keys(obj).sort();
	const out: Bucket<T> = {};
	for (const k of keys) out[k] = obj[k];
	return out;
}

function sortOuterKeys<T>(obj: Bucket<T>): Bucket<T> {
	return sortKeys(obj);
}
