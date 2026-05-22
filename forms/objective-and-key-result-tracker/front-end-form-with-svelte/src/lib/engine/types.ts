// Domain types for the OKR scoring engine.
// Mirrored in src/scoring/types.rs in the Rust port.

export type RagBand = 'green' | 'amber' | 'red';

export type StretchTier = 1 | 2 | 3; // 1=committed, 2=aspirational, 3=moonshot

export type Instrument =
	| 'progress' | 'confidence' | 'stretch' | 'alignment'
	| 'impact' | 'smart' | 'pace' | 'composite';

export type FlagCode =
	| 'mis-aligned' | 'orphaned' | 'non-smart' | 'unmeasurable' | 'no-dri'
	| 'committed-at-risk' | 'pace-collapse' | 'confidence-collapse'
	| 'stale-check-in' | 'cascading-broken' | 'over-scoped' | 'moonshot-progress';

export type FlagPriority = 'high' | 'medium' | 'low';

export interface RawScores {
	progressPercent: number | null;        // 0..100
	confidenceDecile: number | null;       // 1..10
	stretchTier: StretchTier | null;
	alignmentGrade: number | null;         // 1..5
	impactTier: number | null;             // 1..5
	smartQuality: number | null;           // 0..5
	paceDeviationPercent: number | null;   // -100..+100
}

export interface KeyResult {
	position: number;                      // 1..5
	title: string;
	krType: 'numeric' | 'milestone' | 'binary' | '';
	startValue: number | null;
	currentValue: number | null;
	targetValue: number | null;
	milestonesJson: { name: string; done: boolean }[] | null;
	binaryDone: boolean | null;
	progressFraction: number | null;       // 0..1, computed
}

export interface ObjectiveContext {
	level: 'individual' | 'team' | 'department' | 'company' | '';
	parentObjectiveId: string | null;
	parentObjectiveStatus: string | null;  // for cascading-broken flag
	driPresent: boolean;
	cycleStartDate: string | null;         // ISO yyyy-mm-dd
	cycleEndDate: string | null;
	checkedInAt: string | null;            // ISO timestamp of latest check-in
	previousConfidenceDecile: number | null;
}

export interface FiredRule {
	ruleId: string;
	instrument: Instrument;
	grade: RagBand | string;
	category: string;
	description: string;
}

export interface FiredFlag {
	flagCode: FlagCode;
	priority: FlagPriority;
	description: string;
}

export interface GradeResult {
	computedCompositeRag: RagBand;
	rulesFired: FiredRule[];
	flags: FiredFlag[];
}

export interface ObjectiveAssessment {
	scores: RawScores;
	keyResults: KeyResult[];
	context: ObjectiveContext;
	now: string;                           // ISO timestamp; injectable for tests
}
