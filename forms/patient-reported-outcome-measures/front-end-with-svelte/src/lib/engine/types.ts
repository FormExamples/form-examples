// ──────────────────────────────────────────────
// Data model for the Patient-Reported Outcome Measures battery
// (SF-36v2, NDI, mJOA, EQ-5D-3L).
//
// This is a direct TypeScript port of the field names and shape defined
// in ../../../front-end-with-html/js/types.js (the authoritative,
// already-verified vanilla-JS engine) and documented in ../../../AGENTS.md.
// Every field name here MUST match that JS source exactly.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/`. All instrument items are nullable numeric enums; only the
// visit header uses text fields.
// ──────────────────────────────────────────────

/** Header — one patient, one visit/time point. */
export interface VisitDetails {
	subjectId: string;
	visit: string;
	/** ISO date string (yyyy-mm-dd); '' when unset. */
	assessmentDate: string;
}

/** SF-36v2 Health Survey — 36 raw items across 11 numbered questions. */
export interface Sf36Response {
	generalHealth: 1 | 2 | 3 | 4 | 5 | null;
	healthChangeVsYearAgo: 1 | 2 | 3 | 4 | 5 | null;
	vigorousActivities: 1 | 2 | 3 | null;
	moderateActivities: 1 | 2 | 3 | null;
	liftingCarryingGroceries: 1 | 2 | 3 | null;
	climbingSeveralFlights: 1 | 2 | 3 | null;
	climbingOneFlight: 1 | 2 | 3 | null;
	bendingKneelingStooping: 1 | 2 | 3 | null;
	walkingMoreThanMile: 1 | 2 | 3 | null;
	walkingSeveralHundredYards: 1 | 2 | 3 | null;
	walkingOneHundredYards: 1 | 2 | 3 | null;
	bathingDressing: 1 | 2 | 3 | null;
	cutDownTimePhysical: 1 | 2 | 3 | 4 | 5 | null;
	accomplishedLessPhysical: 1 | 2 | 3 | 4 | 5 | null;
	limitedInKindPhysical: 1 | 2 | 3 | 4 | 5 | null;
	difficultyPerformingPhysical: 1 | 2 | 3 | 4 | 5 | null;
	cutDownTimeEmotional: 1 | 2 | 3 | 4 | 5 | null;
	accomplishedLessEmotional: 1 | 2 | 3 | 4 | 5 | null;
	lessCarefulThanUsual: 1 | 2 | 3 | 4 | 5 | null;
	socialActivitiesInterference: 1 | 2 | 3 | 4 | 5 | null;
	bodilyPain: 1 | 2 | 3 | 4 | 5 | 6 | null;
	painInterferenceWithWork: 1 | 2 | 3 | 4 | 5 | null;
	feltFullOfLife: 1 | 2 | 3 | 4 | 5 | null;
	veryNervous: 1 | 2 | 3 | 4 | 5 | null;
	soDownInDumps: 1 | 2 | 3 | 4 | 5 | null;
	feltCalmPeaceful: 1 | 2 | 3 | 4 | 5 | null;
	lotOfEnergy: 1 | 2 | 3 | 4 | 5 | null;
	downheartedDepressed: 1 | 2 | 3 | 4 | 5 | null;
	feltWornOut: 1 | 2 | 3 | 4 | 5 | null;
	beenHappy: 1 | 2 | 3 | 4 | 5 | null;
	feltTired: 1 | 2 | 3 | 4 | 5 | null;
	socialActivitiesInterferenceTime: 1 | 2 | 3 | 4 | 5 | null;
	getSickEasier: 1 | 2 | 3 | 4 | 5 | null;
	asHealthyAsAnybody: 1 | 2 | 3 | 4 | 5 | null;
	expectHealthWorse: 1 | 2 | 3 | 4 | 5 | null;
	healthExcellent: 1 | 2 | 3 | 4 | 5 | null;
}

/** Neck Disability Index — 10 sections, each 0-5 (A=0 ... F=5). */
export interface NdiResponse {
	painIntensity: 0 | 1 | 2 | 3 | 4 | 5 | null;
	personalCare: 0 | 1 | 2 | 3 | 4 | 5 | null;
	lifting: 0 | 1 | 2 | 3 | 4 | 5 | null;
	reading: 0 | 1 | 2 | 3 | 4 | 5 | null;
	headache: 0 | 1 | 2 | 3 | 4 | 5 | null;
	concentration: 0 | 1 | 2 | 3 | 4 | 5 | null;
	work: 0 | 1 | 2 | 3 | 4 | 5 | null;
	driving: 0 | 1 | 2 | 3 | 4 | 5 | null;
	sleeping: 0 | 1 | 2 | 3 | 4 | 5 | null;
	recreation: 0 | 1 | 2 | 3 | 4 | 5 | null;
}

/** modified Japanese Orthopedic Association — 6 subscales. */
export interface MjoaResponse {
	motorArms: 0 | 1 | 2 | 3 | 4 | null;
	motorLegs: 0 | 1 | 2 | 3 | 4 | null;
	sensationArms: 0 | 1 | 2 | null;
	sensationLegs: 0 | 1 | 2 | null;
	sensationTrunk: 0 | 1 | 2 | null;
	bladderFunction: 0 | 1 | 2 | 3 | null;
}

/** EQ-5D-3L — 5 dimensions (1-3 each) + a 0-100 VAS. */
export interface Eq5dResponse {
	mobility: 1 | 2 | 3 | null;
	selfCare: 1 | 2 | 3 | null;
	usualActivities: 1 | 2 | 3 | null;
	painDiscomfort: 1 | 2 | 3 | null;
	anxietyDepression: 1 | 2 | 3 | null;
	/** 0-100; null when unset. */
	vasScore: number | null;
}

/** The full PRO-measures battery for one visit. */
export interface PatientReportedOutcomeMeasures {
	visitDetails: VisitDetails;
	sf36: Sf36Response;
	ndi: NdiResponse;
	mjoa: MjoaResponse;
	eq5d: Eq5dResponse;
}

// ──────────────────────────────────────────────
// Scoring engine output types
// ──────────────────────────────────────────────

/** Output of computeSf36() — 8 domain scores (0-100) + simplified summaries. */
export interface Sf36Result {
	pf: number | null;
	rp: number | null;
	bp: number | null;
	gh: number | null;
	vt: number | null;
	sf: number | null;
	re: number | null;
	mh: number | null;
	/** Simplified, non-licensed approximation of the physical component summary. */
	pcsApprox: number | null;
	/** Simplified, non-licensed approximation of the mental component summary. */
	mcsApprox: number | null;
}

export type NdiBand = 'no-disability' | 'mild' | 'moderate' | 'severe' | 'complete' | '';

/** Output of computeNdi(). */
export interface NdiResult {
	rawScore: number;
	answeredSections: number;
	percentageScore: number | null;
	band: NdiBand;
}

export type MjoaBand = 'mild' | 'moderate' | 'severe' | '';

/** Output of computeMjoa(). */
export interface MjoaResult {
	totalScore: number | null;
	band: MjoaBand;
}

/** Output of computeEq5d(). */
export interface Eq5dResult {
	healthStateDescriptor: string;
	ukIndexValue: number | null;
	vasScore: number | null;
}

/** Output of computeAllScores() — the 4 independent instrument results. */
export interface AllScoresResult {
	sf36: Sf36Result;
	ndi: NdiResult;
	mjoa: MjoaResult;
	eq5d: Eq5dResult;
}
