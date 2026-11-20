// ──────────────────────────────────────────────
// Core data types (United States Divorce Petition)
//
// This is a DOCUMENTATION-SUPPORT instrument, not legal advice. Divorce is state
// law: the engine checks that the petition is complete and that the filing
// state's residency, separation and waiting-period rules look satisfied, then
// classifies it as `ready-to-file` / `incomplete` / `not-yet-eligible`. The court
// decides.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_divorce_petition.sql`. Text / enum fields
// default to `''`; numeric and date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type CaseType = 'uncontested' | 'contested' | '';
export type GroundType = 'no-fault' | 'fault' | '';
export type FaultGround =
  'adultery' | 'cruelty' | 'abandonment' | 'felony-conviction' | 'impotence' | 'other' | '';
export type PropertyApproach = 'community' | 'equitable' | '';
export type ServiceMethod = 'personal' | 'acceptance' | 'mail' | 'publication' | 'none' | '';
export type ReadinessClass = 'ready-to-file' | 'incomplete' | 'not-yet-eligible';
export type PropertyRegime = 'community' | 'equitable' | 'unknown';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1: filing and grounds. */
export interface Filing {
  state: string;
  county: string;
  filingDate: string | null;
  caseType: CaseType;
  groundType: GroundType;
  faultGround: FaultGround;
}

/** Step 2: spouses and residency. */
export interface Spouses {
  petitionerName: string;
  respondentName: string;
  marriageDate: string | null;
  marriagePlace: string;
  separationDate: string | null;
  petitionerResidencyMonths: number | null;
  countyResidencyDays: number | null;
  marriedOrLivedInState: YesNo;
  respondentMilitary: YesNo;
}

/** Step 3: children and support. */
export interface Children {
  hasMinorChildren: YesNo;
  childrenCount: number | null;
  childrenHomeStateMonths: number | null;
  pregnant: YesNo;
  custodyPlanDocumented: YesNo;
  childSupportWorksheetCompleted: YesNo;
  childSupportMonthlyAmount: number | null;
}

/** Step 4: property and settlement. */
export interface PropertySection {
  propertyDivisionApproach: PropertyApproach;
  settlementAgreementSigned: YesNo;
  financialDisclosureFiled: YesNo;
  spousalSupportRequested: YesNo;
}

/** Step 5: service of process. */
export interface Service {
  serviceMethod: ServiceMethod;
  serviceDate: string | null;
  respondentResponded: YesNo;
}

/** Step 6: decree and vital-records certificate. */
export interface Decree {
  decreeEntered: YesNo;
  decreeDate: string | null;
  nameRestorationRequested: YesNo;
  nameToRestore: string;
  certificateRequested: YesNo;
}

/** The full United States Divorce Petition data model. */
export interface DivorcePetition {
  filing: Filing;
  spouses: Spouses;
  children: Children;
  property: PropertySection;
  service: Service;
  decree: Decree;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** A preparer-facing flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full readiness classification result for one petition. */
export interface ValidationResult {
  readinessClass: ReadinessClass;
  propertyRegime: PropertyRegime;
  /** ISO date; null when the state has no waiting period or the base date is unset. */
  earliestDecreeDate: string | null;
  stateRuleKnown: boolean;
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof DivorcePetition;
}

/** A blank petition with all fields at their unanswered defaults. */
export function createDefaultPetition(): DivorcePetition {
  return {
    filing: {
      state: '',
      county: '',
      filingDate: null,
      caseType: '',
      groundType: '',
      faultGround: ''
    },
    spouses: {
      petitionerName: '',
      respondentName: '',
      marriageDate: null,
      marriagePlace: '',
      separationDate: null,
      petitionerResidencyMonths: null,
      countyResidencyDays: null,
      marriedOrLivedInState: '',
      respondentMilitary: ''
    },
    children: {
      hasMinorChildren: '',
      childrenCount: null,
      childrenHomeStateMonths: null,
      pregnant: '',
      custodyPlanDocumented: '',
      childSupportWorksheetCompleted: '',
      childSupportMonthlyAmount: null
    },
    property: {
      propertyDivisionApproach: '',
      settlementAgreementSigned: '',
      financialDisclosureFiled: '',
      spousalSupportRequested: ''
    },
    service: {
      serviceMethod: '',
      serviceDate: null,
      respondentResponded: ''
    },
    decree: {
      decreeEntered: '',
      decreeDate: null,
      nameRestorationRequested: '',
      nameToRestore: '',
      certificateRequested: ''
    }
  };
}
