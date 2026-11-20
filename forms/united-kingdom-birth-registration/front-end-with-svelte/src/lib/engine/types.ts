// TypeScript data model for the United Kingdom Birth Registration form
// (register a birth in England and Wales and order the birth certificate).
//
// The property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_birth_registration.sql` (camelCase here).
// This is an ADMINISTRATIVE completeness-and-validity instrument, not a clinical
// score and NOT a substitute for the registrar's statutory judgement: the
// engine classifies the application as `ready-to-submit` / `incomplete` /
// `needs-additional-evidence` / `out-of-scope` and raises flags. The register
// entry made by the registrar remains the legal record.

export type Sex = 'female' | 'male' | 'indeterminate' | '';
export type YesNo = 'yes' | 'no' | '';
export type PlaceOfBirthType = 'hospital' | 'home' | 'birth-centre' | 'other' | '';
export type BirthCountry = 'england' | 'wales' | 'scotland' | 'northern-ireland' | 'abroad' | '';
export type MultipleBirth = 'single' | 'twins' | 'triplets-or-more' | '';
export type ParentsRelationship =
  | 'married-or-civil-partners'
  | 'unmarried'
  | 'female-couple-married'
  | 'female-couple-unmarried'
  | 'male-couple'
  | 'mother-only'
  | '';
export type PaternityBasis =
  | 'married-or-civil-partners'
  | 'joint-registration'
  | 'statutory-declaration'
  | 'court-order-parental-responsibility'
  | 'parental-order'
  | 'none'
  | '';
export type InformantRelationship =
  | 'mother'
  | 'father'
  | 'second-parent'
  | 'both-parents'
  | 'person-present-at-birth'
  | 'person-responsible-for-child'
  | 'hospital-administrator'
  | 'other'
  | '';
export type RegistrationRoute = 'local-register-office' | 'hospital' | 'other-register-office' | '';
export type IdentityPrimaryDocument =
  | 'passport'
  | 'uk-photocard-driving-licence'
  | 'eu-photocard-driving-licence'
  | 'uk-birth-or-adoption-certificate'
  | 'biometric-immigration-document'
  | 'uk-travel-document'
  | 'refugee-or-stateless-travel-document'
  | 'eu-identity-card'
  | 'proof-of-age-card'
  | 'none'
  | '';
export type ServiceLevel = 'standard' | 'priority' | '';
export type ReadinessClass =
  'ready-to-submit' | 'incomplete' | 'needs-additional-evidence' | 'out-of-scope';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — the child. */
export interface Child {
  childForenames: string;
  childSurname: string;
  sex: Sex;
  /** ISO date; null when unset. */
  dateOfBirth: string | null;
  /** HH:MM; null when unset. */
  timeOfBirth: string | null;
  placeOfBirthType: PlaceOfBirthType;
  placeOfBirth: string;
  birthCountry: BirthCountry;
  multipleBirth: MultipleBirth;
  stillbirth: YesNo;
}

/** Step 2 — the mother. */
export interface Mother {
  motherName: string;
  motherMaidenSurname: string;
  motherDateOfBirth: string | null;
  motherPlaceOfBirth: string;
  motherOccupation: string;
  motherAddress: string;
}

/** Step 3 — parentage and the second parent. */
export interface Parentage {
  parentsRelationship: ParentsRelationship;
  marriageDate: string | null;
  secondParentIncluded: YesNo;
  secondParentName: string;
  secondParentDateOfBirth: string | null;
  secondParentPlaceOfBirth: string;
  secondParentOccupation: string;
  paternityBasis: PaternityBasis;
  paternityEvidenceHeld: YesNo;
  licensedClinicTreatment: YesNo;
}

/** Step 4 — the informant, registration and identity evidence. */
export interface Informant {
  informantRelationship: InformantRelationship;
  informantName: string;
  parentsUnableToRegister: YesNo;
  registrationRoute: RegistrationRoute;
  registrationDate: string | null;
  identityPrimaryDocument: IdentityPrimaryDocument;
  identitySecondaryCount: number | null;
  identityOriginals: YesNo;
  redBookPresented: YesNo;
}

/** Step 5 — the certificate order. */
export interface CertificateOrder {
  certificatesRequested: number | null;
  serviceLevel: ServiceLevel;
  deliveryAddress: string;
  paymentConfirmed: YesNo;
  applicantNote: string;
}

/** The whole application the engine grades. */
export interface BirthRegistration {
  child: Child;
  mother: Mother;
  parentage: Parentage;
  informant: Informant;
  certificate: CertificateOrder;
}

/** An applicant- / registrar-facing flag (mirrors the grade_flag table). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full readiness classification result for one application. */
export interface ValidationResult {
  readinessClass: ReadinessClass;
  /** Whole days from birth to registration; null when either date is missing. */
  daysSinceBirth: number | null;
  lateRegistration: YesNo;
  missingItemCount: number;
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof BirthRegistration;
}
