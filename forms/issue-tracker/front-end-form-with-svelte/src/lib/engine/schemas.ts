// Zod runtime schemas mirroring the engine types.
//
// These schemas validate inputs from the form / API boundary before
// they reach the pure scoring engine. They use z.coerce on the numeric
// fields so HTML form bodies (where every value is a string) can be
// validated without manual conversion.

import { z } from 'zod';
import type {
	IssueTrackerAssessment,
	RawScores,
	ReporterMetadata,
} from './types';

const issueCategorySchema = z.enum([
	'software-defect',
	'service-outage',
	'performance',
	'security',
	'data-protection',
	'clinical-safety',
	'workplace-safety',
	'medical-device',
	'regulatory',
	'project-blocker',
	'customer-complaint',
	'hardware-fault',
	'process',
	'other',
	'',
]);

const environmentSchema = z.enum([
	'dev', 'test', 'staging', 'production', 'on-prem', 'field', '',
]);

const reportedViaSchema = z.enum([
	'self', 'colleague', 'customer', 'monitoring-alert', 'ticket',
	'phone', 'email', 'chat', 'in-person', 'other', '',
]);

const failureConditionSchema = z.enum(['A', 'B', 'C', 'D', 'E', '']);

export const reporterMetadataSchema = z.object({
	reporterName: z.string().default(''),
	reporterEmail: z.string().email().or(z.literal('')).default(''),
	reporterRole: z.string().default(''),
	reportedAt: z.string().default(''),
	discoveredAt: z.string().default(''),
	issueCategory: issueCategorySchema.default(''),
	environment: environmentSchema.default(''),
	systemName: z.string().default(''),
	component: z.string().default(''),
	customerOrProjectTag: z.string().default(''),
	externalReference: z.string().default(''),
}) satisfies z.ZodType<ReporterMetadata>;

// Coerce empty string ('' from a missing form field) and `null` to undefined
// for nullable numeric fields, then apply the bounds.
const numberOrNull = (schema: z.ZodNumber) =>
	z.preprocess((v) => {
		if (v === '' || v === null || v === undefined) return null;
		if (typeof v === 'string') return Number(v);
		return v;
	}, schema.nullable());

export const rawScoresSchema = z.object({
	scoreByPriorityRank: numberOrNull(z.number().int().min(1).max(999)).default(null),
	scoreBySeverityOfImpact: numberOrNull(z.number().int().min(1).max(5))
		.default(null),
	scoreByMagnitudeOfDamage: numberOrNull(z.number().int().min(1).max(10)).default(null),
	scoreByHarmGrade: numberOrNull(z.number().int().min(0).max(4)).default(null),
	scoreByFailureCondition: failureConditionSchema.default(''),
	scoreByMoscowRequirement: numberOrNull(z.number().int().min(1).max(4))
		.default(null),
	scoreByFrequencyPercent: numberOrNull(z.number().min(0).max(100)).default(null),
}) satisfies z.ZodType<RawScores>;

// SOAP sections are deliberately permissive — most fields are free text
// or echoed back into the report. We validate only the enum-shaped fields.
const ccSchema = z.object({
	ccSummary: z.string().max(500).default(''),
	ccLongDescription: z.string().default(''),
	ccReportedByName: z.string().default(''),
	ccReportedVia: reportedViaSchema.default(''),
});

const ptSchema = z.object({
	ptDiscovererName: z.string().default(''),
	ptAffectedUsersCount: numberOrNull(z.number().int().min(0)).default(null),
	ptAffectedUserGroups: z.string().default(''),
	ptAssignees: z.string().default(''),
	ptStakeholdersToInform: z.string().default(''),
	ptObservers: z.string().default(''),
});

const sxSchema = z.object({
	sxExternalSignals: z.string().default(''),
	sxAlertIds: z.string().default(''),
	sxErrorMessages: z.string().default(''),
	sxScreenshotsUrl: z.string().url().or(z.literal('')).default(''),
	sxLogsUrl: z.string().url().or(z.literal('')).default(''),
	sxFirstObservedAt: z.string().default(''),
});

const fxSchema = z.object({
	fxBrokenComponents: z.string().default(''),
	fxFailedServices: z.string().default(''),
	fxStuckProcesses: z.string().default(''),
	fxHardwareFaults: z.string().default(''),
	fxDataCorruption: z.enum(['none', 'suspected', 'confirmed', 'unknown', '']).default(''),
});

const hxSchema = z.object({
	hxRelatedIssues: z.string().default(''),
	hxPriorOccurrences: numberOrNull(z.number().int().min(0)).default(null),
	hxRecentChangeUrl: z.string().url().or(z.literal('')).default(''),
	hxReferences: z.string().default(''),
	hxTimeline: z.string().default(''),
});

const ixSchema = z.object({
	ixHypotheses: z.string().default(''),
	ixReproSteps: z.string().default(''),
	ixDiagnosticQueries: z.string().default(''),
	ixTestsRun: z.string().default(''),
	ixBlockingUnknowns: z.string().default(''),
});

const dxSchema = z.object({
	dxRootCause: z.string().default(''),
	dxContributingCauses: z.string().default(''),
	dxScope: z.enum([
		'single-instance', 'single-service', 'multiple-services',
		'whole-system', 'organisation-wide', '',
	]).default(''),
	dxConfirmed: z.enum(['yes', 'no', 'partial', '']).default(''),
});

const txpxSchema = z.object({
	txMitigationSteps: z.string().default(''),
	txFixPlan: z.string().default(''),
	txWorkaround: z.string().default(''),
	txRollbackPlan: z.string().default(''),
	txCommunicationPlan: z.string().default(''),
	pxExpectedResolutionAt: z.string().default(''),
	pxResidualRisk: z.string().default(''),
	pxMonitoringPlan: z.string().default(''),
	pxRecurrenceLikelihood: z.enum([
		'very-low', 'low', 'moderate', 'high', 'very-high', '',
	]).default(''),
	pxLessonsLearned: z.string().default(''),
});

// Each section is wrapped in `.default({})` so the top-level schema
// accepts a partially populated payload (e.g. `{}` from a brand-new
// form, or `{ scores: {...} }` from a CLI invocation). Default values
// for individual fields are populated by the per-section schemas.
export const issueTrackerAssessmentSchema = z.object({
	reporter: reporterMetadataSchema.default({}),
	cc: ccSchema.default({}),
	pt: ptSchema.default({}),
	sx: sxSchema.default({}),
	fx: fxSchema.default({}),
	hx: hxSchema.default({}),
	ix: ixSchema.default({}),
	dx: dxSchema.default({}),
	txpx: txpxSchema.default({}),
	scores: rawScoresSchema.default({}),
}) satisfies z.ZodType<IssueTrackerAssessment>;

/**
 * Parse-and-throw helpers — convenient at the API boundary where
 * downstream code is typed.
 */
export const parseAssessment = (input: unknown): IssueTrackerAssessment =>
	issueTrackerAssessmentSchema.parse(input);

export const parseScores = (input: unknown): RawScores =>
	rawScoresSchema.parse(input);

/**
 * Safe-parse helper for use in HTTP handlers — returns either
 * `{ ok: true, data }` or `{ ok: false, errors }` so the caller can
 * render field-level errors without try/catch.
 */
export type ParseResult<T> =
	| { ok: true; data: T }
	| { ok: false; errors: { path: string; message: string }[] };

export function safeParseAssessment(input: unknown): ParseResult<IssueTrackerAssessment> {
	const r = issueTrackerAssessmentSchema.safeParse(input);
	if (r.success) return { ok: true, data: r.data };
	return {
		ok: false,
		errors: r.error.issues.map((i) => ({
			path: i.path.join('.'),
			message: i.message,
		})),
	};
}
