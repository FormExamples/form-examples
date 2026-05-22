// Canonical TypeScript model of the LP1F lasting power of attorney.
// One-to-one with the SQL migrations under ../sql-migrations/.
// Conventions:
//   - empty string '' for unanswered text / enum fields
//   - null for unanswered numeric and date fields
//   - camelCase property names
//   - all dates are ISO-8601 'YYYY-MM-DD' strings

export type DecisionMode =
  | 'single_attorney'
  | 'jointly_and_severally'
  | 'jointly'
  | 'mixed'
  | '';

export type WhenAttorneysCanAct =
  | 'as_soon_as_registered'
  | 'only_when_no_capacity'
  | '';

export type LpaStatus =
  | 'draft'
  | 'ready_for_signing'
  | 'partially_signed'
  | 'fully_signed'
  | 'ready_for_registration'
  | 'submitted'
  | 'registered'
  | 'rejected'
  | '';

export type ValidityBand =
  | 'draft'
  | 'ready_for_signing'
  | 'partially_signed'
  | 'fully_signed'
  | 'ready_for_registration'
  | 'submitted'
  | 'registered'
  | 'rejected';

export type CompositeRisk = 'low' | 'moderate' | 'high' | 'critical';

export type RulePriority = 'low' | 'moderate' | 'high' | 'critical';

export type FlagPriority = 'low' | 'moderate' | 'high';

export type KnowsDonorAs = 'friend' | 'professional' | '';

export type ApplicantKind = 'donor' | 'attorneys' | '';

export type PaymentMethod = 'card' | 'cheque' | '';

export type RecipientKind = 'donor' | 'attorney' | 'other' | '';

export type ContinuationSheetKind =
  | '1_additional_people'
  | '2_additional_information'
  | '3_donor_cannot_sign'
  | '4_trust_corporation';

export type SignatureRole =
  | 'donor'
  | 'certificate_provider'
  | 'attorney'
  | 'replacement_attorney'
  | 'applicant'
  | 'signing_on_behalf_of_donor'
  | 'trust_corporation_authorised_person'
  | '';

export type Lp1fSection = 9 | 10 | 11 | 15;

export interface Address {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postcode: string;
  countryAsIso3166_1Alpha2: string;
}

export interface Person {
  id: string;
  title: string;
  firstNames: string;
  lastName: string;
  otherNames: string;
  dateOfBirth: string; // ISO date or ''
  email: string;
  phone: string;
  address: Address;
  isTrustCorporation: boolean;
  trustCorporationNumber: string;
  isBankrupt: boolean;
  hasDebtReliefOrder: boolean;
}

export interface Attorney {
  person: Person;
  ordinal: number;
}

export interface ReplacementAttorney {
  person: Person;
  ordinal: number;
  replacementStepInCondition: string;
}

export interface CertificateProvider {
  person: Person;
  knowsDonorAs: KnowsDonorAs;
  isOverEighteen: boolean;
  readLpa: boolean;
  noRestrictionsOnActing: boolean;
  isRelatedToDonorOrAttorney: boolean;
  isCareHomeOwnerOrEmployee: boolean;
  eligibilityConfirmationAt: string; // ISO timestamp or ''
}

export interface PersonToNotify {
  person: Person;
  ordinal: number;
}

export interface Witness {
  person: Person;
  witnessSignatureBlobPath: string;
  witnessedOn: string; // ISO date or ''
}

export interface Signature {
  id: string;
  signatoryPersonId: string;
  role: SignatureRole;
  lp1fSection: Lp1fSection | null;
  signatureBlobPath: string;
  signedOn: string;
  signedOnBehalfFullName: string;
  isWitnessed: boolean;
  witness: Witness | null;
}

export interface ContinuationSheet {
  kind: ContinuationSheetKind;
  bodyText: string;
  signedOn: string;
  ordinal: number;
}

export interface PreferencesAndInstructions {
  preferencesOverflowText: string;
  instructionsOverflowText: string;
  decisionsJointlyOverflowText: string;
  replacementStepInOverflowText: string;
}

export interface RegistrationApplication {
  applicantKind: ApplicantKind;
  paymentMethod: PaymentMethod;
  cardPaymentPhone: string;
  reducedFeeRequested: boolean;
  hasLpa120aEvidence: boolean;
  isRepeatApplication: boolean;
  repeatCaseNumber: string;
  paymentReference: string;
  paymentDate: string;
  paymentAmount: number | null;
}

export interface RegistrationRecipient {
  recipientKind: RecipientKind;
  recipientPersonId: string;
  companyName: string;
  prefersPost: boolean;
  prefersPhone: boolean;
  prefersEmail: boolean;
  prefersWelsh: boolean;
  contactPhone: string;
  contactEmail: string;
  otherFirstNames: string;
  otherLastName: string;
  otherAddressLine1: string;
  otherAddressLine2: string;
  otherAddressLine3: string;
  otherPostcode: string;
}

export interface FiredRule {
  ruleId: string;
  priority: RulePriority;
  citation: string;
  fieldPath: string;
  message: string;
  remediation: string;
}

export interface AdditionalFlag {
  ruleId: string;
  priority: FlagPriority;
  citation: string;
  fieldPath: string;
  message: string;
  remediation: string;
}

export interface ValidationResult {
  validityBand: ValidityBand;
  compositeRisk: CompositeRisk;
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}

// Top-level Lpa aggregate — mirrors lasting_power_of_attorney plus all
// dependent join tables.
export interface Lpa {
  id: string;
  donor: Person;
  attorneys: Attorney[];
  replacementAttorneys: ReplacementAttorney[];
  decisionMode: DecisionMode;
  decisionModeMixedText: string;
  whenAttorneysCanAct: WhenAttorneysCanAct;
  certificateProvider: CertificateProvider | null;
  peopleToNotify: PersonToNotify[];
  preferencesText: string;
  instructionsText: string;
  preferencesAndInstructionsOverflow: PreferencesAndInstructions;
  legalRightsAcknowledged: boolean;
  signatures: Signature[];
  continuationSheets: ContinuationSheet[];
  registrationApplication: RegistrationApplication;
  registrationRecipient: RegistrationRecipient;
  opgReferenceNumber: string;
  opgRegistrationDate: string;
  status: LpaStatus;
  signedDate: string; // convenience reference date for age computations
}
