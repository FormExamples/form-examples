// ──────────────────────────────────────────────
// ADR evaluation engine types
//
// Unlike the clinical assessment forms in this repo, the Architecture Decision
// Record form has no clinical scoring engine. Its "engine" is a pure
// completeness + status validator: it measures how fully the Tyree & Akerman
// template has been filled in, surfaces the chosen position, and flags
// governance gaps (e.g. an approved ADR that is missing a sign-off).
// ──────────────────────────────────────────────

export type {
	AdrFormData,
	Status,
	DecisionGroup,
	AuthorRole,
	Author,
	Organization,
	Position,
	Note,
	ArchitectureDecisionRecord
} from '$lib/types';

import type { Status } from '$lib/types';

/** Re-export the workflow status union for convenience. */
export type AdrStatus = Status;

/** Priority of a governance/completeness flag. */
export type FlagPriority = 'high' | 'medium' | 'low';

/** A single governance or completeness issue surfaced by the engine. */
export interface AdrFlag {
	id: string;
	category: string;
	message: string;
	priority: FlagPriority;
}

/** The result of evaluating an ADR draft. */
export interface AdrEvaluation {
	/** Workflow status carried through from the record. */
	status: Status;
	/** Number of core template sections that have content. */
	filledSections: number;
	/** Total number of core template sections measured. */
	totalSections: number;
	/** Completeness as a whole-number percentage (0–100). */
	completeness: number;
	/** How many alternative positions were recorded. */
	positionCount: number;
	/** The name of the chosen position, or '' if none is marked chosen. */
	chosenPosition: string;
	/** Governance/completeness flags, highest priority first. */
	flags: AdrFlag[];
	/** ISO timestamp of when the evaluation ran. */
	timestamp: string;
}

/** A wizard step definition. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}
