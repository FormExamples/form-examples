/**
 * United States Last Will and Testament: data model for the validity engine.
 *
 * camelCase property names mirror the snake_case columns in
 * `sql/04_create_table_united_states_last_will_and_testament.sql`. This is a
 * documentation and validity-classification instrument, not legal advice. The
 * probate court decides whether a will is valid.
 */

export type YesNo = 'yes' | 'no' | '';
export type SoundMind = 'yes' | 'no' | 'uncertain' | '';
export type UndueInfluence = 'none' | 'possible' | '';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | '';
export type ExecutionForm = 'witnessed' | 'holographic' | 'electronic' | '';
export type ValidityClass = 'valid-ready-to-execute' | 'incomplete' | 'formality-risk';
export type Priority = 'high' | 'medium' | 'low';
export type StateRuleSource = 'state-table' | 'uniform-default';

/** Step 1: testator and state. */
export interface Testator {
  /** Two-letter state code of domicile. */
  state: string;
  testatorName: string;
  dateOfBirth: string | null;
  soundMind: SoundMind;
  undueInfluenceConcern: UndueInfluence;
  maritalStatus: MaritalStatus;
}

/** Step 2: family and spouse. */
export interface Family {
  spouseName: string;
  spouseInheritanceValue: number | null;
  spouseWaivedElectiveShare: YesNo;
  hasMinorChildren: YesNo;
  guardianForMinorsName: string;
  disinheritsChild: YesNo;
  disinheritedChildNamed: YesNo;
}

/** Step 3: estate and bequests. */
export interface Estate {
  estimatedEstateValue: number | null;
  specificBequestsTotal: number | null;
  specificBequestsSummary: string;
  residuaryClausePresent: YesNo;
  residuary1Name: string;
  residuary1Percent: number | null;
  residuary2Name: string;
  residuary2Percent: number | null;
  residuary3Name: string;
  residuary3Percent: number | null;
  contingentBeneficiaryNamed: YesNo;
}

/** Step 4: representative and clauses. */
export interface Provisions {
  personalRepresentativeName: string;
  successorPersonalRepresentativeName: string;
  bondWaived: YesNo;
  revokesPriorWillsClause: YesNo;
  noContestClause: YesNo;
  digitalAssetsClause: YesNo;
  estateTaxReviewed: YesNo;
  originalWillLocation: string;
  drafterNote: string;
}

/** Step 5: execution and witnesses. */
export interface Execution {
  executionForm: ExecutionForm;
  executionDate: string | null;
  signedAtEnd: YesNo;
  signedInWitnessPresence: YesNo;
  witnessesSignedInTestatorPresence: YesNo;
  holographicEntirelyHandwritten: YesNo;
  witness1Name: string;
  witness1Beneficiary: YesNo;
  witness2Name: string;
  witness2Beneficiary: YesNo;
  witness3Name: string;
  witness3Beneficiary: YesNo;
}

/** Step 6: self-proving affidavit. */
export interface SelfProving {
  selfProvingAffidavit: YesNo;
  notaryName: string;
  notaryAcknowledged: YesNo;
}

/** The full United States Last Will and Testament data model. */
export interface Will {
  testator: Testator;
  family: Family;
  estate: Estate;
  provisions: Provisions;
  execution: Execution;
  selfProving: SelfProving;
}

/** A drafter-facing flag (mirrors the grade_flag table). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full validity classification result for one will plan. */
export interface ValidationResult {
  validityClass: ValidityClass;
  residuaryPercentTotal: number;
  electiveShareAmount: number | null;
  witnessCount: number;
  selfProved: boolean;
  federalEstateTaxExposure: boolean;
  stateRuleSource: StateRuleSource;
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof Will;
}

/** A blank will plan: text and enum fields '', numeric and date fields null. */
export function createDefaultWill(): Will {
  return {
    testator: {
      state: '',
      testatorName: '',
      dateOfBirth: null,
      soundMind: '',
      undueInfluenceConcern: '',
      maritalStatus: ''
    },
    family: {
      spouseName: '',
      spouseInheritanceValue: null,
      spouseWaivedElectiveShare: '',
      hasMinorChildren: '',
      guardianForMinorsName: '',
      disinheritsChild: '',
      disinheritedChildNamed: ''
    },
    estate: {
      estimatedEstateValue: null,
      specificBequestsTotal: null,
      specificBequestsSummary: '',
      residuaryClausePresent: '',
      residuary1Name: '',
      residuary1Percent: null,
      residuary2Name: '',
      residuary2Percent: null,
      residuary3Name: '',
      residuary3Percent: null,
      contingentBeneficiaryNamed: ''
    },
    provisions: {
      personalRepresentativeName: '',
      successorPersonalRepresentativeName: '',
      bondWaived: '',
      revokesPriorWillsClause: '',
      noContestClause: '',
      digitalAssetsClause: '',
      estateTaxReviewed: '',
      originalWillLocation: '',
      drafterNote: ''
    },
    execution: {
      executionForm: '',
      executionDate: null,
      signedAtEnd: '',
      signedInWitnessPresence: '',
      witnessesSignedInTestatorPresence: '',
      holographicEntirelyHandwritten: '',
      witness1Name: '',
      witness1Beneficiary: '',
      witness2Name: '',
      witness2Beneficiary: '',
      witness3Name: '',
      witness3Beneficiary: ''
    },
    selfProving: {
      selfProvingAffidavit: '',
      notaryName: '',
      notaryAcknowledged: ''
    }
  };
}
