// Domain types for the UK Lasting Power of Attorney for Health and Welfare
// (LP1H) validity engine. Mirrors the SQL schema in ../../../sql-migrations/.

export type YesNo = 'yes' | 'no' | '';

export type Jurisdiction = 'england' | 'wales' | '';

export type PreferredLanguage = 'en' | 'cy' | '';

export type Relationship =
  | 'spouse'
  | 'civil-partner'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'friend'
  | 'professional'
  | 'other'
  | '';

export type CertificateProviderRoute = 'skill-based' | 'knowledge-based' | '';

export type CertificateProviderProfession =
  | 'solicitor'
  | 'barrister'
  | 'general-practitioner'
  | 'consultant'
  | 'registered-nurse'
  | 'registered-social-worker'
  | 'imca'
  | 'psychiatrist'
  | 'psychologist'
  | 'other-registered-professional'
  | '';

export type CertificateProviderRelationship =
  | 'professional'
  | 'friend'
  | 'colleague'
  | 'neighbour'
  | 'other'
  | '';

export type DecisionRule = 'jointly' | 'jointly-and-severally' | 'mixed' | '';

export type LstChoice = 'option-a' | 'option-b' | '';

export type PreferenceCategory =
  | 'residence'
  | 'contact-with-others'
  | 'religion-and-belief'
  | 'food-and-drink'
  | 'end-of-life-care'
  | 'daily-routine'
  | 'medical-treatment'
  | 'other'
  | '';

export type InstructionCategory =
  | 'medical-treatment-limit'
  | 'residence-restriction'
  | 'contact-restriction'
  | 'religion-and-belief'
  | 'food-and-drink'
  | 'end-of-life-care'
  | 'other'
  | '';

export type SignerRole = 'donor' | 'certificate-provider' | 'attorney' | 'replacement-attorney' | '';

export type SignatureMethod = 'wet-ink' | 'electronic' | 'mark-with-witness' | '';

export type ApplicantRole = 'donor' | 'attorney' | 'attorneys-jointly' | '';

export type FeeRemission = 'none' | 'half' | 'full-exempt' | '';

export type SubmissionChannel = 'post' | 'opg-digital' | 'solicitor-portal' | '';

export interface Donor {
  title: string;
  givenNames: string;
  familyName: string;
  otherNamesUsed: string;
  birthDate: string;
  email: string;
  phone: string;
  postalAddressAsFullText: string;
  countryAsIso31661Alpha2: string;
  postcode: string;
  unitedKingdomNhsNumber: string;
  jurisdiction: Jurisdiction;
  preferredLanguage: PreferredLanguage;
  capacityDeclared: YesNo;
  capacityDeclaredAt: string;
}

export interface Attorney {
  title: string;
  givenNames: string;
  familyName: string;
  birthDate: string;
  email: string;
  phone: string;
  postalAddressAsFullText: string;
  countryAsIso31661Alpha2: string;
  postcode: string;
  relationshipToDonor: Relationship;
  isBankrupt: YesNo;
  capacityDeclared: YesNo;
}

export interface ReplacementAttorney extends Attorney {
  replacementTrigger: string;
}

export interface CertificateProvider {
  title: string;
  givenNames: string;
  familyName: string;
  email: string;
  phone: string;
  postalAddressAsFullText: string;
  countryAsIso31661Alpha2: string;
  postcode: string;
  route: CertificateProviderRoute;
  profession: CertificateProviderProfession;
  professionRegistrationNumber: string;
  yearsKnownDonor: number | null;
  relationshipToDonor: CertificateProviderRelationship;
  declaredNotFamily: YesNo;
  declaredNotEmployee: YesNo;
  declaredNotAttorney: YesNo;
}

export interface PersonToNotify {
  title: string;
  givenNames: string;
  familyName: string;
  email: string;
  phone: string;
  postalAddressAsFullText: string;
  countryAsIso31661Alpha2: string;
  postcode: string;
  relationshipToDonor: Relationship;
}

export interface Preference {
  category: PreferenceCategory;
  statement: string;
}

export interface Instruction {
  category: InstructionCategory;
  statement: string;
  lawfulnessAssessed: YesNo;
  contradictsAdrt: YesNo;
}

export interface Signature {
  signerRole: SignerRole;
  signerIndex: number;
  signedAt: string;
  signatureMethod: SignatureMethod;
  witnessName: string;
  witnessAddress: string;
  witnessSignedAt: string;
  witnessIsAttorney: YesNo;
}

export interface RegistrationApplication {
  applicantRole: ApplicantRole;
  applicantSignedAt: string;
  feeAmountPounds: number;
  feeRemission: FeeRemission;
  feeRemissionReason: string;
  submittedAt: string;
  submissionChannel: SubmissionChannel;
}

export interface LpaApplication {
  formVersion: string;
  jurisdiction: Jurisdiction;
  donor: Donor;
  attorneys: Attorney[];
  replacementAttorneys: ReplacementAttorney[];
  certificateProvider: CertificateProvider | null;
  peopleToNotify: PersonToNotify[];
  decisionRule: DecisionRule;
  jointDecisionSet: string;
  lstChoice: LstChoice;
  lstDonorInitialled: YesNo;
  preferences: Preference[];
  instructions: Instruction[];
  signatures: Signature[];
  registration: RegistrationApplication;
}

export type RuleSeverity = 'fatal' | 'high' | 'medium' | 'informational';

export type RuleFamily =
  | 'donor'
  | 'attorney'
  | 'certificate-provider'
  | 'signature-order'
  | 'instruction'
  | 'registration'
  | '';

export interface FiredRule {
  ruleId: string;
  severity: RuleSeverity;
  ruleFamily: RuleFamily;
  sourceCitation: string;
  description: string;
  suggestedCorrection: string;
}

export type AdditionalFlagCategory =
  | 'donor-capacity-concern'
  | 'coercion-concern'
  | 'adrt-conflict'
  | 'foreign-domicile'
  | 'solicitor-recommended'
  | 'replacement-trigger-ambiguous'
  | 'bilingual-donor'
  | 'attorney-bankrupt'
  | 'multiple-lpas-detected'
  | 'opg-historical-rejection'
  | 'other'
  | '';

export type FlagPriority = 'low' | 'medium' | 'high' | '';

export interface AdditionalFlag {
  flagId: string;
  category: AdditionalFlagCategory;
  priority: FlagPriority;
  description: string;
  suggestedAction: string;
}

export type ValidityStatus = 'ready-to-register' | 'needs-correction' | 'invalid' | '';

export interface LpaValidityResult {
  validityStatus: ValidityStatus;
  completenessScore: number;
  effectiveDate: string | null;
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
  engineVersion: string;
  computedAt: string;
}

export const ENGINE_VERSION = '0.1.0';
