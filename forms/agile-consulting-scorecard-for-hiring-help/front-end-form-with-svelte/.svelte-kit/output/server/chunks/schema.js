import { z } from "zod";
const SECTORS = [
  "healthcare",
  "pharmaceuticals",
  "medtech",
  "public-sector",
  "finance",
  "insurance",
  "retail",
  "manufacturing",
  "logistics",
  "energy",
  "utilities",
  "media",
  "telecommunications",
  "technology",
  "education",
  "charity",
  "agriculture",
  "professional-services",
  "other",
  ""
];
const SIZE_BANDS = ["micro", "small", "medium", "large", "enterprise", ""];
const RESPONDENT_ROLES = [
  "board-member",
  "cxo",
  "vp",
  "director",
  "head-of-product",
  "head-of-engineering",
  "head-of-delivery",
  "transformation-lead",
  "programme-manager",
  "project-manager",
  "product-manager",
  "engineering-manager",
  "agile-coach",
  "scrum-master",
  "consultant",
  "employee",
  "other",
  ""
];
const SENIORITIES = [
  "board",
  "executive",
  "senior-leader",
  "middle-manager",
  "team-lead",
  "individual-contributor",
  ""
];
const PREFERRED_CONTACTS = ["email", "phone", "chat", "in-person", ""];
const ASSESSMENT_STATUSES = [
  "draft",
  "in-progress",
  "submitted",
  "finalized",
  "cancelled"
];
const ChecklistItemSchema = z.object({
  done: z.boolean().nullable(),
  evidence: z.string()
});
const OrganizationMetadataSchema = z.object({
  organizationName: z.string(),
  legalName: z.string().default(""),
  sector: z.enum(SECTORS),
  sizeBand: z.enum(SIZE_BANDS),
  headcount: z.number().int().nonnegative().nullable().default(null),
  country: z.string().default(""),
  region: z.string().default(""),
  website: z.string().default("")
});
const RespondentMetadataSchema = z.object({
  respondentName: z.string(),
  respondentEmail: z.string(),
  respondentPhone: z.string().default(""),
  role: z.enum(RESPONDENT_ROLES),
  department: z.string().default(""),
  seniority: z.enum(SENIORITIES).default(""),
  timezone: z.string().default(""),
  preferredContact: z.enum(PREFERRED_CONTACTS).default("")
});
const AssessmentMetadataSchema = z.object({
  assessmentDate: z.string(),
  status: z.enum(ASSESSMENT_STATUSES).default("draft")
});
const ManifestoItemsSchema = z.object({
  m1: ChecklistItemSchema,
  m2: ChecklistItemSchema,
  m3: ChecklistItemSchema,
  m4: ChecklistItemSchema
});
const PrinciplesItemsSchema = z.object({
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
  p12: ChecklistItemSchema
});
const AgileConsultingScorecardAssessmentSchema = z.object({
  organization: OrganizationMetadataSchema,
  respondent: RespondentMetadataSchema,
  assessment: AssessmentMetadataSchema,
  manifesto: ManifestoItemsSchema,
  principles: PrinciplesItemsSchema
});
function parseAssessment(input) {
  return AgileConsultingScorecardAssessmentSchema.parse(input);
}
export {
  parseAssessment as p
};
