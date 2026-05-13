/** Readiness band — must stay in lockstep with the engine's `Band` type. */
export type Band = 'low' | 'borderline' | 'medium' | 'high';

/** A single readiness flag attached to a scorecard. */
export interface ScorecardFlag {
	category: string;
	priority: 'low' | 'medium' | 'high';
}

/** One row in the reviewer dashboard grid. */
export interface ScorecardRow {
	id: string;
	organizationName: string;
	sector: string;
	sizeBand: string;
	respondentName: string;
	assessmentDate: string;
	scoreTotal: number;        // 0..16
	manifestoSubtotal: number; // 0..4
	principlesSubtotal: number;// 0..12
	computedBand: Band;
	flags: ScorecardFlag[];
}

/** Response from GET /api/scorecards (Loco backend). */
export interface DashboardScorecardsResponse {
	items: ScorecardRow[];
	total: number;
}
