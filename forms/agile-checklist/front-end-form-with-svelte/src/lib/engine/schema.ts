import { z } from 'zod';
import { ALL_ITEMS } from '$lib/config/items.js';
import type { AgileChecklist } from './types.js';

const answerSchema = z.enum(['yes', 'no', 'not-applicable', '']);

const roleSchema = z.enum([
  'team-member',
  'team-lead',
  'scrum-master',
  'product-owner',
  'engineering-manager',
  'agile-coach',
  'executive-sponsor',
  'other',
  '',
]);

const periodSchema = z.enum([
  'sprint',
  'quarter',
  'half-year',
  'annual',
  'ad-hoc',
  '',
]);

export const respondentSchema = z.object({
  fullName: z.string().default(''),
  email: z.string().default(''),
  role: roleSchema.default(''),
  teamName: z.string().default(''),
  organisationName: z.string().default(''),
  yearsInAgile: z.number().int().min(0).max(50).nullable().default(null),
  assessmentDate: z.string().default(''),
  assessmentPeriod: periodSchema.default(''),
});

export const actionPlanSchema = z.object({
  topAction1: z.string().default(''),
  topAction2: z.string().default(''),
  topAction3: z.string().default(''),
  coachNotes: z.string().default(''),
  signedAt: z.string().default(''),
  overallNotes: z.string().default(''),
});

/**
 * Answers map: every known item id → answer. Unknown keys are dropped on
 * parse; missing keys default to ''. Built dynamically from ALL_ITEMS so
 * the schema stays in sync if items change.
 */
const answersSchema = z.preprocess(
  (value) => {
    const incoming =
      value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
    const out: Record<string, unknown> = {};
    for (const item of ALL_ITEMS) {
      out[item.id] = incoming[item.id] ?? '';
    }
    return out;
  },
  z.record(z.string(), answerSchema),
);

export const agileChecklistSchema = z.object({
  respondent: respondentSchema,
  answers: answersSchema,
  actionPlan: actionPlanSchema,
});

export type AgileChecklistInput = z.input<typeof agileChecklistSchema>;

/**
 * Returns the parsed checklist, or null when the input does not match.
 * Intended for hydrating an untrusted LocalStorage payload — any field
 * that fails validation falls back to its default in the skeleton.
 */
export function safeParseChecklist(input: unknown): AgileChecklist | null {
  const result = agileChecklistSchema.safeParse(input);
  if (!result.success) return null;
  return result.data as AgileChecklist;
}
