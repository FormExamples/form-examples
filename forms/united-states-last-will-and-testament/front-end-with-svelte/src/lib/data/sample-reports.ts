import type { Will, ValidityClass } from '#lib/engine/types.js';
import { validateWill } from '#lib/engine/will-grader.js';

/** A sample will plan: an identifier and the full data the engine grades. */
export interface SampleWill {
  id: string;
  testatorName: string;
  state: string;
  executionForm: string;
  personalRepresentativeName: string;
  updatedDate: string;
  data: Will;
}

/** A row in the drafter dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  testatorName: string;
  state: string;
  executionForm: string;
  personalRepresentativeName: string;
  updatedDate: string;
  validityClass: ValidityClass;
  flagCount: number;
  highFlagCount: number;
}

/** One sample per persona in examples/personas.json. */
export const sampleWills: SampleWill[] = [
  {
    id: '1',
    testatorName: 'Sullivan, Margaret Anne',
    state: 'FL',
    executionForm: 'witnessed',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-10',
    data: {
      testator: {
        state: 'FL',
        testatorName: 'Margaret Anne Sullivan',
        dateOfBirth: '1954-03-12',
        soundMind: 'yes',
        undueInfluenceConcern: 'none',
        maritalStatus: 'widowed'
      },
      family: {
        spouseName: '',
        spouseInheritanceValue: null,
        spouseWaivedElectiveShare: '',
        hasMinorChildren: 'no',
        guardianForMinorsName: '',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 800000,
        specificBequestsTotal: 100000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 40,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'no',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'yes',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'witnessed',
        executionDate: '2026-09-01',
        signedAtEnd: 'yes',
        signedInWitnessPresence: 'yes',
        witnessesSignedInTestatorPresence: 'yes',
        holographicEntirelyHandwritten: '',
        witness1Name: 'Carla Mendez',
        witness1Beneficiary: 'no',
        witness2Name: 'Tom Alvarez',
        witness2Beneficiary: 'no',
        witness3Name: '',
        witness3Beneficiary: ''
      },
      selfProving: {
        selfProvingAffidavit: 'yes',
        notaryName: 'Lena Park',
        notaryAcknowledged: 'yes'
      }
    }
  },
  {
    id: '2',
    testatorName: 'Unnamed, Draft',
    state: '—',
    executionForm: '',
    personalRepresentativeName: '',
    updatedDate: '2026-09-11',
    data: {
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
    }
  },
  {
    id: '3',
    testatorName: 'Raman, Priya',
    state: 'NY',
    executionForm: '',
    personalRepresentativeName: '',
    updatedDate: '2026-09-12',
    data: {
      testator: {
        state: 'NY',
        testatorName: 'Priya Raman',
        dateOfBirth: '1975-06-30',
        soundMind: 'yes',
        undueInfluenceConcern: '',
        maritalStatus: 'married'
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
    }
  },
  {
    id: '4',
    testatorName: 'Sullivan, Margaret Anne',
    state: 'TX',
    executionForm: 'witnessed',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-13',
    data: {
      testator: {
        state: 'TX',
        testatorName: 'Margaret Anne Sullivan',
        dateOfBirth: '1954-03-12',
        soundMind: 'yes',
        undueInfluenceConcern: 'none',
        maritalStatus: 'widowed'
      },
      family: {
        spouseName: '',
        spouseInheritanceValue: null,
        spouseWaivedElectiveShare: '',
        hasMinorChildren: 'no',
        guardianForMinorsName: '',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 1500000,
        specificBequestsTotal: 2000000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 30,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'no',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'yes',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'witnessed',
        executionDate: '2026-09-01',
        signedAtEnd: 'no',
        signedInWitnessPresence: 'no',
        witnessesSignedInTestatorPresence: 'no',
        holographicEntirelyHandwritten: '',
        witness1Name: 'Ray Delgado',
        witness1Beneficiary: 'yes',
        witness2Name: '',
        witness2Beneficiary: '',
        witness3Name: '',
        witness3Beneficiary: ''
      },
      selfProving: {
        selfProvingAffidavit: 'no',
        notaryName: '',
        notaryAcknowledged: ''
      }
    }
  },
  {
    id: '5',
    testatorName: 'Lee, Jordan',
    state: 'NY',
    executionForm: 'holographic',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-14',
    data: {
      testator: {
        state: 'NY',
        testatorName: 'Jordan Lee',
        dateOfBirth: '2010-05-01',
        soundMind: 'no',
        undueInfluenceConcern: 'possible',
        maritalStatus: 'single'
      },
      family: {
        spouseName: '',
        spouseInheritanceValue: null,
        spouseWaivedElectiveShare: '',
        hasMinorChildren: 'no',
        guardianForMinorsName: '',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 800000,
        specificBequestsTotal: 100000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 40,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'no',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'yes',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'holographic',
        executionDate: '2026-09-01',
        signedAtEnd: 'yes',
        signedInWitnessPresence: '',
        witnessesSignedInTestatorPresence: '',
        holographicEntirelyHandwritten: 'no',
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
    }
  },
  {
    id: '6',
    testatorName: 'Kowalski, Walter',
    state: 'OH',
    executionForm: 'electronic',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-15',
    data: {
      testator: {
        state: 'OH',
        testatorName: 'Walter Kowalski',
        dateOfBirth: '1954-03-12',
        soundMind: 'yes',
        undueInfluenceConcern: 'none',
        maritalStatus: 'widowed'
      },
      family: {
        spouseName: '',
        spouseInheritanceValue: null,
        spouseWaivedElectiveShare: '',
        hasMinorChildren: 'no',
        guardianForMinorsName: '',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 800000,
        specificBequestsTotal: 100000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 40,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'no',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'yes',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'electronic',
        executionDate: '2026-09-01',
        signedAtEnd: 'yes',
        signedInWitnessPresence: 'yes',
        witnessesSignedInTestatorPresence: 'yes',
        holographicEntirelyHandwritten: '',
        witness1Name: 'Carla Mendez',
        witness1Beneficiary: 'yes',
        witness2Name: 'Tom Alvarez',
        witness2Beneficiary: 'no',
        witness3Name: '',
        witness3Beneficiary: ''
      },
      selfProving: {
        selfProvingAffidavit: 'yes',
        notaryName: 'Lena Park',
        notaryAcknowledged: 'yes'
      }
    }
  },
  {
    id: '7',
    testatorName: 'Reyes, Alma',
    state: 'CA',
    executionForm: 'witnessed',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-16',
    data: {
      testator: {
        state: 'CA',
        testatorName: 'Alma Reyes',
        dateOfBirth: '1954-03-12',
        soundMind: 'uncertain',
        undueInfluenceConcern: 'none',
        maritalStatus: 'married'
      },
      family: {
        spouseName: 'Luis Reyes',
        spouseInheritanceValue: 0,
        spouseWaivedElectiveShare: '',
        hasMinorChildren: 'no',
        guardianForMinorsName: '',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 800000,
        specificBequestsTotal: 300000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'no',
        residuary1Name: '',
        residuary1Percent: null,
        residuary2Name: '',
        residuary2Percent: null,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'no',
        noContestClause: 'yes',
        digitalAssetsClause: 'no',
        estateTaxReviewed: 'yes',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'witnessed',
        executionDate: '2026-08-15',
        signedAtEnd: 'yes',
        signedInWitnessPresence: 'yes',
        witnessesSignedInTestatorPresence: 'yes',
        holographicEntirelyHandwritten: '',
        witness1Name: 'Carla Mendez',
        witness1Beneficiary: 'no',
        witness2Name: 'Tom Alvarez',
        witness2Beneficiary: 'yes',
        witness3Name: '',
        witness3Beneficiary: ''
      },
      selfProving: {
        selfProvingAffidavit: 'yes',
        notaryName: '',
        notaryAcknowledged: ''
      }
    }
  },
  {
    id: '8',
    testatorName: 'Brandt, Harold',
    state: 'FL',
    executionForm: 'witnessed',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-17',
    data: {
      testator: {
        state: 'FL',
        testatorName: 'Harold Brandt',
        dateOfBirth: '1954-03-12',
        soundMind: 'yes',
        undueInfluenceConcern: 'none',
        maritalStatus: 'married'
      },
      family: {
        spouseName: 'Joan Brandt',
        spouseInheritanceValue: 100000,
        spouseWaivedElectiveShare: 'no',
        hasMinorChildren: 'yes',
        guardianForMinorsName: '',
        disinheritsChild: 'yes',
        disinheritedChildNamed: 'no'
      },
      estate: {
        estimatedEstateValue: 2000000,
        specificBequestsTotal: 100000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 40,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'yes',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'yes',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'witnessed',
        executionDate: '2026-09-01',
        signedAtEnd: 'yes',
        signedInWitnessPresence: 'yes',
        witnessesSignedInTestatorPresence: 'yes',
        holographicEntirelyHandwritten: '',
        witness1Name: 'Carla Mendez',
        witness1Beneficiary: 'no',
        witness2Name: 'Tom Alvarez',
        witness2Beneficiary: 'yes',
        witness3Name: '',
        witness3Beneficiary: ''
      },
      selfProving: {
        selfProvingAffidavit: 'yes',
        notaryName: 'Lena Park',
        notaryAcknowledged: 'yes'
      }
    }
  },
  {
    id: '9',
    testatorName: 'Okafor, Victor',
    state: 'IL',
    executionForm: 'witnessed',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-18',
    data: {
      testator: {
        state: 'IL',
        testatorName: 'Victor Okafor',
        dateOfBirth: '1954-03-12',
        soundMind: 'yes',
        undueInfluenceConcern: 'none',
        maritalStatus: 'married'
      },
      family: {
        spouseName: 'Chidi Okafor',
        spouseInheritanceValue: 5000000,
        spouseWaivedElectiveShare: 'no',
        hasMinorChildren: 'yes',
        guardianForMinorsName: 'Amara Okafor',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 20000000,
        specificBequestsTotal: 1000000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 40,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'no',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'no',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'witnessed',
        executionDate: '2026-09-01',
        signedAtEnd: 'yes',
        signedInWitnessPresence: 'yes',
        witnessesSignedInTestatorPresence: 'yes',
        holographicEntirelyHandwritten: '',
        witness1Name: 'Carla Mendez',
        witness1Beneficiary: 'no',
        witness2Name: 'Tom Alvarez',
        witness2Beneficiary: 'no',
        witness3Name: '',
        witness3Beneficiary: ''
      },
      selfProving: {
        selfProvingAffidavit: 'yes',
        notaryName: '',
        notaryAcknowledged: ''
      }
    }
  },
  {
    id: '10',
    testatorName: 'Whitfield, Samuel',
    state: 'PA',
    executionForm: 'witnessed',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-19',
    data: {
      testator: {
        state: 'PA',
        testatorName: 'Samuel Whitfield',
        dateOfBirth: '1954-03-12',
        soundMind: 'yes',
        undueInfluenceConcern: 'none',
        maritalStatus: 'divorced'
      },
      family: {
        spouseName: '',
        spouseInheritanceValue: null,
        spouseWaivedElectiveShare: '',
        hasMinorChildren: 'no',
        guardianForMinorsName: '',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 800000,
        specificBequestsTotal: 100000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 40,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'no'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: '',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'no',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'yes',
        originalWillLocation: '',
        drafterNote: ''
      },
      execution: {
        executionForm: 'witnessed',
        executionDate: '2026-09-01',
        signedAtEnd: 'yes',
        signedInWitnessPresence: 'yes',
        witnessesSignedInTestatorPresence: 'no',
        holographicEntirelyHandwritten: '',
        witness1Name: 'Carla Mendez',
        witness1Beneficiary: 'no',
        witness2Name: 'Tom Alvarez',
        witness2Beneficiary: 'no',
        witness3Name: '',
        witness3Beneficiary: ''
      },
      selfProving: {
        selfProvingAffidavit: 'yes',
        notaryName: '',
        notaryAcknowledged: 'no'
      }
    }
  },
  {
    id: '11',
    testatorName: 'Whitaker, Dana',
    state: 'NV',
    executionForm: 'witnessed',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-20',
    data: {
      testator: {
        state: 'NV',
        testatorName: 'Dana Whitaker',
        dateOfBirth: '1954-03-12',
        soundMind: 'yes',
        undueInfluenceConcern: 'none',
        maritalStatus: 'single'
      },
      family: {
        spouseName: '',
        spouseInheritanceValue: null,
        spouseWaivedElectiveShare: '',
        hasMinorChildren: 'no',
        guardianForMinorsName: '',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 800000,
        specificBequestsTotal: 100000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 40,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'no',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'yes',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'witnessed',
        executionDate: '2026-09-01',
        signedAtEnd: 'yes',
        signedInWitnessPresence: 'yes',
        witnessesSignedInTestatorPresence: 'yes',
        holographicEntirelyHandwritten: '',
        witness1Name: 'Carla Mendez',
        witness1Beneficiary: 'no',
        witness2Name: 'Tom Alvarez',
        witness2Beneficiary: 'no',
        witness3Name: '',
        witness3Beneficiary: ''
      },
      selfProving: {
        selfProvingAffidavit: 'yes',
        notaryName: 'Lena Park',
        notaryAcknowledged: 'yes'
      }
    }
  },
  {
    id: '12',
    testatorName: 'Larsen, Ingrid',
    state: 'WA',
    executionForm: 'witnessed',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-21',
    data: {
      testator: {
        state: 'WA',
        testatorName: 'Ingrid Larsen',
        dateOfBirth: '1954-03-12',
        soundMind: 'yes',
        undueInfluenceConcern: 'none',
        maritalStatus: 'married'
      },
      family: {
        spouseName: 'Nils Larsen',
        spouseInheritanceValue: 2000000,
        spouseWaivedElectiveShare: '',
        hasMinorChildren: 'no',
        guardianForMinorsName: '',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 5000000,
        specificBequestsTotal: 500000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 40,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'no',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'yes',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'witnessed',
        executionDate: '2026-09-01',
        signedAtEnd: 'yes',
        signedInWitnessPresence: 'yes',
        witnessesSignedInTestatorPresence: 'yes',
        holographicEntirelyHandwritten: '',
        witness1Name: 'Carla Mendez',
        witness1Beneficiary: 'yes',
        witness2Name: 'Tom Alvarez',
        witness2Beneficiary: 'no',
        witness3Name: '',
        witness3Beneficiary: ''
      },
      selfProving: {
        selfProvingAffidavit: 'yes',
        notaryName: 'Lena Park',
        notaryAcknowledged: 'yes'
      }
    }
  },
  {
    id: '13',
    testatorName: 'Delgado, Rosa',
    state: 'TX',
    executionForm: 'holographic',
    personalRepresentativeName: 'Daniel Sullivan',
    updatedDate: '2026-09-22',
    data: {
      testator: {
        state: 'TX',
        testatorName: 'Rosa Delgado',
        dateOfBirth: '1954-03-12',
        soundMind: 'yes',
        undueInfluenceConcern: 'none',
        maritalStatus: 'single'
      },
      family: {
        spouseName: '',
        spouseInheritanceValue: null,
        spouseWaivedElectiveShare: '',
        hasMinorChildren: 'no',
        guardianForMinorsName: '',
        disinheritsChild: 'no',
        disinheritedChildNamed: ''
      },
      estate: {
        estimatedEstateValue: 800000,
        specificBequestsTotal: 100000,
        specificBequestsSummary: '$50,000 each to two grandchildren',
        residuaryClausePresent: 'yes',
        residuary1Name: 'Daniel Sullivan',
        residuary1Percent: 60,
        residuary2Name: 'Erin Sullivan',
        residuary2Percent: 40,
        residuary3Name: '',
        residuary3Percent: null,
        contingentBeneficiaryNamed: 'yes'
      },
      provisions: {
        personalRepresentativeName: 'Daniel Sullivan',
        successorPersonalRepresentativeName: 'Erin Sullivan',
        bondWaived: 'yes',
        revokesPriorWillsClause: 'yes',
        noContestClause: 'no',
        digitalAssetsClause: 'yes',
        estateTaxReviewed: 'yes',
        originalWillLocation: 'Attorney vault, Tampa',
        drafterNote: ''
      },
      execution: {
        executionForm: 'holographic',
        executionDate: '2026-09-01',
        signedAtEnd: 'yes',
        signedInWitnessPresence: '',
        witnessesSignedInTestatorPresence: '',
        holographicEntirelyHandwritten: 'yes',
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
    }
  }
];

/** Dashboard rows, derived by grading each sample with the shared engine. */
export const sampleWillRows: DashboardRow[] = sampleWills.map((s) => {
  const result = validateWill(s.data);
  return {
    id: s.id,
    testatorName: s.testatorName,
    state: s.state,
    executionForm: s.executionForm,
    personalRepresentativeName: s.personalRepresentativeName,
    updatedDate: s.updatedDate,
    validityClass: result.validityClass,
    flagCount: result.flaggedIssues.length,
    highFlagCount: result.flaggedIssues.filter((f) => f.priority === 'high').length
  };
});
