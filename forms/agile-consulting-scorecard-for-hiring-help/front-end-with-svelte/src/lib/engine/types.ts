// Agile Consulting Scorecard for Hiring Help — input and output types for
// the scoring engine.
//
// Conventions: empty string for unanswered text/enum fields; null for
// unanswered booleans (item not yet answered). camelCase property names.
// Field names match the SQL column names in
// `sql/04_create_table_agile_consulting_scorecard_for_hiring_help.sql`
// after snake_case → camelCase conversion.

// ──────────────────────────────────────────────
// Step 1: Organization & respondent metadata
// ──────────────────────────────────────────────

export interface OrganizationMetadata {
	organizationName: string;
	legalName: string;
	sector: Sector;
	sizeBand: SizeBand;
	headcount: number | null;
	country: string;
	region: string;
	website: string;
}

export interface RespondentMetadata {
	respondentName: string;
	respondentEmail: string;
	respondentPhone: string;
	role: RespondentRole;
	department: string;
	seniority: Seniority;
	timezone: string;
	preferredContact: PreferredContact;
}

export interface AssessmentMetadata {
	assessmentDate: string; // YYYY-MM-DD
	status: AssessmentStatus;
}

// ──────────────────────────────────────────────
// Steps 2–5: The 16 yes/no items
// ──────────────────────────────────────────────
//
// Each item is `null` (unanswered), `true` (yes), or `false` (no).
// Each item carries an optional free-text evidence note.

export type Answer = boolean | null;

export interface ChecklistItem {
	done: Answer;
	evidence: string;
}

export interface ManifestoItems {
	m1: ChecklistItem; // Individuals and interactions over processes and tools
	m2: ChecklistItem; // Working software over comprehensive documentation
	m3: ChecklistItem; // Customer collaboration over contract negotiation
	m4: ChecklistItem; // Responding to change over following a plan
}

export interface PrinciplesItems {
	p1: ChecklistItem;  // Customer satisfaction (NPS)
	p2: ChecklistItem;  // Welcome changing requirements (i18n hello world)
	p3: ChecklistItem;  // Deliver working software frequently (i18n shipped)
	p4: ChecklistItem;  // Business and developers work together daily
	p5: ChecklistItem;  // Motivated individuals (3-amigos MVP)
	p6: ChecklistItem;  // Face-to-face conversation (>=50%)
	p7: ChecklistItem;  // Working software is the primary measure (fizz buzz)
	p8: ChecklistItem;  // Sustainable pace (1-year budget)
	p9: ChecklistItem;  // Technical excellence (precommit + CI metrics)
	p10: ChecklistItem; // Simplicity (>=2 process-improvement experts per team)
	p11: ChecklistItem; // Self-organizing teams (Likert >= "Agree")
	p12: ChecklistItem; // Reflection at regular intervals (last 2 retros shared)
}

// ──────────────────────────────────────────────
// Top-level assessment
// ──────────────────────────────────────────────

export interface AgileConsultingScorecardAssessment {
	organization: OrganizationMetadata;
	respondent: RespondentMetadata;
	assessment: AssessmentMetadata;
	manifesto: ManifestoItems;
	principles: PrinciplesItems;
}

// ──────────────────────────────────────────────
// Enumerations
// ──────────────────────────────────────────────

export type Sector =
	| 'healthcare'
	| 'pharmaceuticals'
	| 'medtech'
	| 'public-sector'
	| 'finance'
	| 'insurance'
	| 'retail'
	| 'manufacturing'
	| 'logistics'
	| 'energy'
	| 'utilities'
	| 'media'
	| 'telecommunications'
	| 'technology'
	| 'education'
	| 'charity'
	| 'agriculture'
	| 'professional-services'
	| 'other'
	| '';

export type SizeBand = 'micro' | 'small' | 'medium' | 'large' | 'enterprise' | '';

export type RespondentRole =
	| 'board-member'
	| 'cxo'
	| 'vp'
	| 'director'
	| 'head-of-product'
	| 'head-of-engineering'
	| 'head-of-delivery'
	| 'transformation-lead'
	| 'programme-manager'
	| 'project-manager'
	| 'product-manager'
	| 'engineering-manager'
	| 'agile-coach'
	| 'scrum-master'
	| 'consultant'
	| 'employee'
	| 'other'
	| '';

export type Seniority =
	| 'board'
	| 'executive'
	| 'senior-leader'
	| 'middle-manager'
	| 'team-lead'
	| 'individual-contributor'
	| '';

export type PreferredContact = 'email' | 'phone' | 'chat' | 'in-person' | '';

export type AssessmentStatus = 'draft' | 'in-progress' | 'submitted' | 'finalized' | 'cancelled';

// ──────────────────────────────────────────────
// Output: bands, instruments, fired rules, flags
// ──────────────────────────────────────────────

export type Band = 'low' | 'borderline' | 'medium' | 'high';

export type Instrument = 'manifesto' | 'principles' | 'composite';

export type ItemAnswerGrade = 'yes' | 'no' | 'unanswered';

export interface FiredRule {
	ruleId: string;
	instrument: Instrument;
	itemNumber: number | null; // 1..16; null for composite rules
	grade: ItemAnswerGrade | Band; // 'yes'/'no'/'unanswered' for items, band string for composite
	pointsAwarded: 0 | 1;
	category: string;
	description: string;
}

export type FlagCategory =
	| 'no-senior-leadership-buyin'
	| 'no-customer-contact'
	| 'no-working-software'
	| 'no-sustainable-budget'
	| 'no-self-organization'
	| 'no-reflection-culture'
	| 'other';

export interface AdditionalFlag {
	flagId: string;
	category: FlagCategory;
	priority: 'low' | 'medium' | 'high';
	description: string;
	suggestedAction: string;
}

export type Recommendation =
	| 'do-not-hire-yet'
	| 'do-homework-first'
	| 'trial-engagement'
	| 'hire-with-focus-areas'
	| 'reassess-in-3-months'
	| '';

export interface GradeResult {
	scoreTotal: number;            // 0..16
	manifestoSubtotal: number;     // 0..4
	principlesSubtotal: number;    // 0..12
	computedBand: Band;
	recommendation: Recommendation;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
}
