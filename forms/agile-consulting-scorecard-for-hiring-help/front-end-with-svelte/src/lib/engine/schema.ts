import { z } from 'zod';

// Zod runtime schema for `AgileConsultingScorecardAssessment`. Mirrors
// `types.ts` and the SQL table
// `agile_consulting_scorecard_for_hiring_help`. Use `parseAssessment(json)`
// to validate untrusted input (UI form submission, API payload, file
// upload) before passing it to `gradeScorecard()`.
//
// Conventions kept in lockstep with the type aliases in `types.ts`:
//   - empty string `''` is the unanswered-text default
//   - `null` is the unanswered-numeric / unanswered-boolean default
//   - enum strings include `''` for unanswered

const SECTORS = [
	'healthcare', 'pharmaceuticals', 'medtech', 'public-sector', 'finance',
	'insurance', 'retail', 'manufacturing', 'logistics', 'energy',
	'utilities', 'media', 'telecommunications', 'technology', 'education',
	'charity', 'agriculture', 'professional-services', 'other', '',
] as const;

const SIZE_BANDS = ['micro', 'small', 'medium', 'large', 'enterprise', ''] as const;

const RESPONDENT_ROLES = [
	'board-member', 'cxo', 'vp', 'director', 'head-of-product',
	'head-of-engineering', 'head-of-delivery', 'transformation-lead',
	'programme-manager', 'project-manager', 'product-manager',
	'engineering-manager', 'agile-coach', 'scrum-master', 'consultant',
	'employee', 'other', '',
] as const;

const SENIORITIES = [
	'board', 'executive', 'senior-leader', 'middle-manager',
	'team-lead', 'individual-contributor', '',
] as const;

const PREFERRED_CONTACTS = ['email', 'phone', 'chat', 'in-person', ''] as const;

const ASSESSMENT_STATUSES = [
	'draft', 'in-progress', 'submitted', 'finalized', 'cancelled',
] as const;

export const ChecklistItemSchema = z.object({
	done: z.boolean().nullable(),
	evidence: z.string(),
});

export const OrganizationMetadataSchema = z.object({
	organizationName: z.string(),
	legalName: z.string().default(''),
	sector: z.enum(SECTORS),
	sizeBand: z.enum(SIZE_BANDS),
	headcount: z.number().int().nonnegative().nullable().default(null),
	country: z.string().default(''),
	region: z.string().default(''),
	website: z.string().default(''),
});

export const RespondentMetadataSchema = z.object({
	respondentName: z.string(),
	respondentEmail: z.string(),
	respondentPhone: z.string().default(''),
	role: z.enum(RESPONDENT_ROLES),
	department: z.string().default(''),
	seniority: z.enum(SENIORITIES).default(''),
	timezone: z.string().default(''),
	preferredContact: z.enum(PREFERRED_CONTACTS).default(''),
});

export const AssessmentMetadataSchema = z.object({
	assessmentDate: z.string(),
	status: z.enum(ASSESSMENT_STATUSES).default('draft'),
});

export const ManifestoItemsSchema = z.object({
	m1: ChecklistItemSchema,
	m2: ChecklistItemSchema,
	m3: ChecklistItemSchema,
	m4: ChecklistItemSchema,
});

export const PrinciplesItemsSchema = z.object({
	p1: ChecklistItemSchema,
	p2: ChecklistItemSchema,
	p3: ChecklistItemSchema,
	p4: ChecklistItemSchema,
	p5: ChecklistItemSchema,
	p6: ChecklistItemSchema,
	p7: ChecklistItemSchema,
	p8: ChecklistItemSchema,
	p9: ChecklistItemSchema,
	p10: ChecklistItemSchema,
	p11: ChecklistItemSchema,
	p12: ChecklistItemSchema,
});

export const AgileConsultingScorecardAssessmentSchema = z.object({
	organization: OrganizationMetadataSchema,
	respondent: RespondentMetadataSchema,
	assessment: AssessmentMetadataSchema,
	manifesto: ManifestoItemsSchema,
	principles: PrinciplesItemsSchema,
});

export type AgileConsultingScorecardAssessmentSchemaInput =
	z.input<typeof AgileConsultingScorecardAssessmentSchema>;
export type AgileConsultingScorecardAssessmentSchemaOutput =
	z.output<typeof AgileConsultingScorecardAssessmentSchema>;

/**
 * Parse and validate an untrusted `AgileConsultingScorecardAssessment`
 * payload (e.g. from a form submit, API request body, or uploaded file).
 *
 * Throws a `ZodError` describing every field that failed validation.
 * For a non-throwing variant, use the `safeParseAssessment` helper.
 */
export function parseAssessment(input: unknown): AgileConsultingScorecardAssessmentSchemaOutput {
	return AgileConsultingScorecardAssessmentSchema.parse(input);
}

/**
 * Non-throwing variant of `parseAssessment`. Returns the discriminated
 * union `{ success: true, data } | { success: false, error }` so that
 * callers can render validation errors inline.
 */
export function safeParseAssessment(
	input: unknown,
): ReturnType<typeof AgileConsultingScorecardAssessmentSchema.safeParse> {
	return AgileConsultingScorecardAssessmentSchema.safeParse(input);
}
