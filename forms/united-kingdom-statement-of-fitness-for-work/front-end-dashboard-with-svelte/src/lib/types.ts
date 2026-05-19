// Type definitions for the UK Statement of Fitness for Work (Med 3 / fit
// note) dashboard. Mirrors the SQL columns from the
// `united_kingdom_statement_of_fitness_for_work` and
// `united_kingdom_statement_of_fitness_for_work_grade` tables, expressed in
// camelCase per the project convention.

/** Fitness-for-work category emitted by the grading engine. */
export type FitnessCategory = 'not_fit' | 'may_be_fit' | '';

/** Adaptation intensity classification (Step 6 tick-box count). */
export type AdaptationIntensity =
  | 'none'
  | 'light'
  | 'moderate'
  | 'substantial'
  | 'comprehensive'
  | '';

/** Period compliance category emitted by the grading engine. */
export type PeriodCompliance =
  | 'self_cert_range'
  | 'compliant'
  | 'long_term'
  | 'very_long_term'
  | 'exceeds_initial_max'
  | '';

/** Engine recommendation (or clinician override). */
export type Recommendation =
  | 'standard'
  | 'refer_occupational_health'
  | 'refer_access_to_work'
  | 'refer_employment_advisor'
  | 'review_for_validity'
  | '';

/** Issuer profession (2022-broadened authorised issuers). */
export type IssuerProfession =
  | 'doctor'
  | 'nurse'
  | 'occupational_therapist'
  | 'pharmacist'
  | 'physiotherapist';

/**
 * One fit-note row as displayed in the dashboard. Joins fields from
 * `patient`, `clinician`, the fit-note record, and its computed grade.
 */
export interface FitNoteSummary {
  id: string;
  patientName: string;
  nhsNumber: string;
  issuerProfession: IssuerProfession;
  issuerName: string;
  assessmentDate: string;            // ISO date YYYY-MM-DD
  diagnosis: string;
  fitnessCategory: FitnessCategory;
  adaptationIntensity: AdaptationIntensity;
  adaptationCount: number;           // 0..4
  periodDays: number | null;
  periodCompliance: PeriodCompliance;
  recommendation: Recommendation;
  safetyFlagCount: number;
}
