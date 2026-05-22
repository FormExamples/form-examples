export type ValidityStatus = 'ready-to-register' | 'needs-correction' | 'invalid';

export type RegistrationStage = 'draft' | 'awaiting-signatures' | 'submitted-to-opg' | 'registered' | 'rejected' | 'revoked';

export type Jurisdiction = 'england' | 'wales';

export type DecisionRule = 'jointly' | 'jointly-and-severally' | 'mixed';

export type LstChoice = 'option-a' | 'option-b';

export interface FiredRuleRow {
  ruleId: string;
  severity: 'fatal' | 'high' | 'medium' | 'informational';
  description: string;
}

export interface LpaRow {
  id: string;
  donorMaskedName: string;
  donorBirthYear: number;
  jurisdiction: Jurisdiction;
  attorneyCount: number;
  replacementAttorneyCount: number;
  decisionRule: DecisionRule;
  lstChoice: LstChoice | '';
  validityStatus: ValidityStatus;
  completenessScore: number;
  registrationStage: RegistrationStage;
  updatedAt: string;
  fatalRuleCount: number;
  firedRules: FiredRuleRow[];
}

export const SAMPLE_LPAS: LpaRow[] = [
  {
    id: 'LPA-2026-0001',
    donorMaskedName: 'A. Pritchard',
    donorBirthYear: 1955,
    jurisdiction: 'wales',
    attorneyCount: 2,
    replacementAttorneyCount: 1,
    decisionRule: 'jointly-and-severally',
    lstChoice: 'option-a',
    validityStatus: 'ready-to-register',
    completenessScore: 100,
    registrationStage: 'awaiting-signatures',
    updatedAt: '2026-05-12T14:22:00Z',
    fatalRuleCount: 0,
    firedRules: [],
  },
  {
    id: 'LPA-2026-0002',
    donorMaskedName: 'B. Okafor',
    donorBirthYear: 1948,
    jurisdiction: 'england',
    attorneyCount: 3,
    replacementAttorneyCount: 0,
    decisionRule: 'jointly',
    lstChoice: 'option-b',
    validityStatus: 'needs-correction',
    completenessScore: 86,
    registrationStage: 'draft',
    updatedAt: '2026-05-14T09:10:00Z',
    fatalRuleCount: 0,
    firedRules: [
      {
        ruleId: 'R-MCA-CP-REGISTRATION',
        severity: 'high',
        description: 'Skill-based certificate provider missing registration number.',
      },
      {
        ruleId: 'R-MCA-JOINT-COLLAPSE',
        severity: 'medium',
        description: 'Joint decision rule with no replacement attorneys — high collapse risk.',
      },
    ],
  },
  {
    id: 'LPA-2026-0003',
    donorMaskedName: 'C. Davies',
    donorBirthYear: 1962,
    jurisdiction: 'wales',
    attorneyCount: 1,
    replacementAttorneyCount: 0,
    decisionRule: 'jointly-and-severally',
    lstChoice: '',
    validityStatus: 'invalid',
    completenessScore: 65,
    registrationStage: 'draft',
    updatedAt: '2026-05-15T11:45:00Z',
    fatalRuleCount: 2,
    firedRules: [
      {
        ruleId: 'R-MCA-LST-CHOICE',
        severity: 'fatal',
        description: 'No life-sustaining-treatment option selected.',
      },
      {
        ruleId: 'R-MCA-CP-PRESENT',
        severity: 'fatal',
        description: 'No certificate provider linked.',
      },
    ],
  },
  {
    id: 'LPA-2026-0004',
    donorMaskedName: 'D. Smith',
    donorBirthYear: 1940,
    jurisdiction: 'england',
    attorneyCount: 4,
    replacementAttorneyCount: 2,
    decisionRule: 'mixed',
    lstChoice: 'option-a',
    validityStatus: 'ready-to-register',
    completenessScore: 100,
    registrationStage: 'registered',
    updatedAt: '2026-04-30T16:00:00Z',
    fatalRuleCount: 0,
    firedRules: [],
  },
  {
    id: 'LPA-2026-0005',
    donorMaskedName: 'E. Khan',
    donorBirthYear: 1970,
    jurisdiction: 'england',
    attorneyCount: 2,
    replacementAttorneyCount: 0,
    decisionRule: 'jointly-and-severally',
    lstChoice: 'option-b',
    validityStatus: 'invalid',
    completenessScore: 78,
    registrationStage: 'rejected',
    updatedAt: '2026-04-22T12:30:00Z',
    fatalRuleCount: 1,
    firedRules: [
      {
        ruleId: 'R-MCA-ORDER-DONOR-FIRST',
        severity: 'fatal',
        description: 'Donor signed after the certificate provider — OPG rejected.',
      },
    ],
  },
];
