// localStorage autosave for the issue-tracker wizard.
//
// Pure functions — no Svelte / framework coupling. The wizard wires the
// `subscribe()` helper into a `$effect` so each keystroke debounces a
// JSON-serialise → write to `localStorage`. Reload restores the draft
// via `load()`; submit clears it via `clear()`.
//
// All functions accept an optional `Storage` argument so tests can pass
// an in-memory mock; default is `globalThis.localStorage` when present.
//
// The schema version embedded in the saved blob lets us migrate or
// discard incompatible drafts without re-prompting the user.

import { issueTrackerAssessmentSchema } from './engine/schemas';
import type { IssueTrackerAssessment } from './engine/types';

const SCHEMA_VERSION = 1;

interface Saved {
	v: number;
	savedAt: string;
	data: unknown;
}

function defaultStorage(): Storage | null {
	const g = globalThis as unknown as { localStorage?: Storage };
	return g.localStorage ?? null;
}

export function save(
	key: string,
	data: IssueTrackerAssessment,
	storage: Storage | null = defaultStorage(),
): void {
	if (!storage) return;
	const blob: Saved = {
		v: SCHEMA_VERSION,
		savedAt: new Date().toISOString(),
		data,
	};
	storage.setItem(key, JSON.stringify(blob));
}

/**
 * Load a draft from `storage` and validate it against the engine
 * schema. Returns `null` if missing, malformed, schema-incompatible,
 * or the saved version doesn't match.
 */
export function load(
	key: string,
	storage: Storage | null = defaultStorage(),
): IssueTrackerAssessment | null {
	if (!storage) return null;
	const raw = storage.getItem(key);
	if (!raw) return null;
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (!parsed || typeof parsed !== 'object') return null;
	const blob = parsed as Saved;
	if (blob.v !== SCHEMA_VERSION) return null;
	const r = issueTrackerAssessmentSchema.safeParse(blob.data);
	return r.success ? r.data : null;
}

export function clear(
	key: string,
	storage: Storage | null = defaultStorage(),
): void {
	if (!storage) return;
	storage.removeItem(key);
}

export interface SubscribeOptions {
	debounceMs?: number;
	storage?: Storage | null;
	now?: () => number; // injectable for tests
	setTimeoutFn?: (cb: () => void, ms: number) => unknown;
	clearTimeoutFn?: (h: unknown) => void;
}

/**
 * Returns a `(data) => void` writer that debounces saves to `storage`.
 * The wizard calls the writer on every input change. Returns a tuple
 * `[writer, cancel]` — `cancel()` clears the pending timeout (e.g.
 * unmount) without forcing a final write.
 */
export function subscribe(
	key: string,
	opts: SubscribeOptions = {},
): {
	write: (data: IssueTrackerAssessment) => void;
	flush: () => void;
	cancel: () => void;
} {
	const debounceMs = opts.debounceMs ?? 500;
	const storage = opts.storage ?? defaultStorage();
	const setT = opts.setTimeoutFn ?? ((cb, ms) => setTimeout(cb, ms));
	const clearT = opts.clearTimeoutFn ?? ((h) => clearTimeout(h as ReturnType<typeof setTimeout>));

	let handle: unknown = null;
	let pending: IssueTrackerAssessment | null = null;

	const flushNow = () => {
		if (pending) {
			save(key, pending, storage);
			pending = null;
		}
		if (handle !== null) {
			clearT(handle);
			handle = null;
		}
	};

	return {
		write(data: IssueTrackerAssessment) {
			pending = data;
			if (handle !== null) clearT(handle);
			handle = setT(() => {
				flushNow();
			}, debounceMs);
		},
		flush: flushNow,
		cancel() {
			pending = null;
			if (handle !== null) {
				clearT(handle);
				handle = null;
			}
		},
	};
}
