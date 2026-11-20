import type { Will, ValidityClass } from '#lib/engine/types.js';
import { validateWill } from '#lib/engine/will-grader.js';

/** A sample will: an identifier and the full data the engine grades. */
export interface SampleWill {
  id: string;
  testatorName: string;
  updatedAt: string;
  data: Will;
}

/** A row in the wills dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  testatorName: string;
  executionStatus: string;
  validityClass: ValidityClass;
  sharesTotalPercent: number;
  witnessCount: number;
  formalityRisk: string;
  flagCount: number;
  updatedAt: string;
}

// One sample per examples/personas.json entry (kept in step with the HTML
// dashboard's js/data.js), so every validity class and formality-risk case
// is represented. Generated from the persona states, not hand-written.

export const sampleWills: SampleWill[] = [
  {
    id: '1',
    testatorName: 'Ellis, Margaret',
    updatedAt: '2026-06-20',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '1958-03-14',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'england-wales',
        maritalStatus: 'widowed',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: 'yes',
        madeVoluntarily: 'yes',
        previousWill: 'none',
        revocationClause: 'yes'
      },
      estate: {
        estateValueBand: 'under-325k',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'yes'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 50,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 50,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'yes'
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: 'cremation',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'draft',
        dateOfWill: null,
        willInWriting: 'yes',
        testatorSigned: '',
        witnessesPresentTogether: '',
        witnessesSigned: '',
        witnessFirstName: '',
        witnessFirstOver18: '',
        witnessFirstIsBeneficiaryOrSpouse: '',
        witnessSecondName: '',
        witnessSecondOver18: '',
        witnessSecondIsBeneficiaryOrSpouse: '',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '2',
    testatorName: 'Okafor, Chidi',
    updatedAt: '2026-06-21',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '1958-03-14',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'england-wales',
        maritalStatus: 'widowed',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: 'yes',
        madeVoluntarily: 'yes',
        previousWill: 'none',
        revocationClause: 'yes'
      },
      estate: {
        estateValueBand: 'under-325k',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'yes'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 50,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 50,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'yes'
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: 'cremation',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'signed',
        dateOfWill: '2026-08-20',
        willInWriting: 'yes',
        testatorSigned: 'yes',
        witnessesPresentTogether: 'yes',
        witnessesSigned: 'yes',
        witnessFirstName: 'Helen Booth',
        witnessFirstOver18: 'yes',
        witnessFirstIsBeneficiaryOrSpouse: 'no',
        witnessSecondName: 'Raj Patel',
        witnessSecondOver18: 'yes',
        witnessSecondIsBeneficiaryOrSpouse: 'no',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '3',
    testatorName: 'Unnamed testator',
    updatedAt: '2026-06-22',
    data: {
      testator: {
        testatorName: '',
        dateOfBirth: null,
        testatorAddress: '',
        domicile: '',
        maritalStatus: '',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: '',
        madeVoluntarily: '',
        previousWill: '',
        revocationClause: ''
      },
      estate: {
        estateValueBand: '',
        ownsHome: '',
        homeToDirectDescendants: '',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: ''
      },
      executors: {
        executorFirstName: '',
        executorFirstRelationship: '',
        executorSecondName: '',
        executorSecondRelationship: '',
        executorsAdultConfirmed: ''
      },
      beneficiaries: {
        beneficiaryFirstName: '',
        beneficiaryFirstRelationship: '',
        beneficiaryFirstSharePercent: null,
        beneficiaryFirstIsMinor: '',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: '',
        beneficiarySecondRelationship: '',
        beneficiarySecondSharePercent: null,
        beneficiarySecondIsMinor: '',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: '',
        dependantsConsidered: ''
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: '',
        funeralWishesNote: ''
      },
      execution: {
        executionStatus: 'draft',
        dateOfWill: null,
        willInWriting: '',
        testatorSigned: '',
        witnessesPresentTogether: '',
        witnessesSigned: '',
        witnessFirstName: '',
        witnessFirstOver18: '',
        witnessFirstIsBeneficiaryOrSpouse: '',
        witnessSecondName: '',
        witnessSecondOver18: '',
        witnessSecondIsBeneficiaryOrSpouse: '',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '4',
    testatorName: 'Byrne, Aoife',
    updatedAt: '2026-06-23',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '1958-03-14',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'england-wales',
        maritalStatus: 'widowed',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: 'yes',
        madeVoluntarily: 'yes',
        previousWill: 'none',
        revocationClause: 'yes'
      },
      estate: {
        estateValueBand: 'under-325k',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'yes'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 40,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 40,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: 'Ollie Ellis',
        beneficiaryThirdRelationship: 'grandchild',
        beneficiaryThirdSharePercent: 0,
        beneficiaryThirdIsMinor: 'yes',
        beneficiaryThirdHasTrustee: 'no',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'yes'
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: 'cremation',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'draft',
        dateOfWill: null,
        willInWriting: 'yes',
        testatorSigned: '',
        witnessesPresentTogether: '',
        witnessesSigned: '',
        witnessFirstName: '',
        witnessFirstOver18: '',
        witnessFirstIsBeneficiaryOrSpouse: '',
        witnessSecondName: '',
        witnessSecondOver18: '',
        witnessSecondIsBeneficiaryOrSpouse: '',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '5',
    testatorName: 'Nowak, Piotr',
    updatedAt: '2026-06-24',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '1958-03-14',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'england-wales',
        maritalStatus: 'widowed',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: 'yes',
        madeVoluntarily: 'yes',
        previousWill: 'none',
        revocationClause: 'yes'
      },
      estate: {
        estateValueBand: 'under-325k',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'yes'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 50,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 50,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'yes'
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: 'cremation',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'signed',
        dateOfWill: '2026-08-20',
        willInWriting: 'yes',
        testatorSigned: 'yes',
        witnessesPresentTogether: 'yes',
        witnessesSigned: 'yes',
        witnessFirstName: 'Helen Booth',
        witnessFirstOver18: 'yes',
        witnessFirstIsBeneficiaryOrSpouse: 'no',
        witnessSecondName: '',
        witnessSecondOver18: '',
        witnessSecondIsBeneficiaryOrSpouse: '',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '6',
    testatorName: 'Fletcher, Rosemary',
    updatedAt: '2026-06-25',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '1958-03-14',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'england-wales',
        maritalStatus: 'widowed',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: 'yes',
        madeVoluntarily: 'yes',
        previousWill: 'none',
        revocationClause: 'yes'
      },
      estate: {
        estateValueBand: 'under-325k',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'yes'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 50,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 50,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'yes'
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: 'cremation',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'signed',
        dateOfWill: '2026-08-20',
        willInWriting: 'yes',
        testatorSigned: 'yes',
        witnessesPresentTogether: 'yes',
        witnessesSigned: 'yes',
        witnessFirstName: 'Anna Ellis',
        witnessFirstOver18: 'yes',
        witnessFirstIsBeneficiaryOrSpouse: 'no',
        witnessSecondName: 'Raj Patel',
        witnessSecondOver18: 'yes',
        witnessSecondIsBeneficiaryOrSpouse: 'no',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '7',
    testatorName: 'Silva, Marcos',
    updatedAt: '2026-06-26',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '2009-06-01',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'england-wales',
        maritalStatus: 'single',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: 'yes',
        madeVoluntarily: 'yes',
        previousWill: 'none',
        revocationClause: 'no'
      },
      estate: {
        estateValueBand: 'under-325k',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'yes'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 50,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 50,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'yes'
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: 'cremation',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'draft',
        dateOfWill: null,
        willInWriting: 'yes',
        testatorSigned: '',
        witnessesPresentTogether: '',
        witnessesSigned: '',
        witnessFirstName: '',
        witnessFirstOver18: '',
        witnessFirstIsBeneficiaryOrSpouse: '',
        witnessSecondName: '',
        witnessSecondOver18: '',
        witnessSecondIsBeneficiaryOrSpouse: '',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '8',
    testatorName: 'Doyle, Sinead',
    updatedAt: '2026-06-27',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '1958-03-14',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'england-wales',
        maritalStatus: 'single',
        marriageExpected: 'yes',
        contemplationOfMarriageClause: 'no',
        hasMentalCapacity: 'yes',
        madeVoluntarily: 'yes',
        previousWill: 'none',
        revocationClause: 'yes'
      },
      estate: {
        estateValueBand: 'under-325k',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'yes'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 50,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 50,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'yes'
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: 'cremation',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'draft',
        dateOfWill: null,
        willInWriting: 'yes',
        testatorSigned: '',
        witnessesPresentTogether: '',
        witnessesSigned: '',
        witnessFirstName: '',
        witnessFirstOver18: '',
        witnessFirstIsBeneficiaryOrSpouse: '',
        witnessSecondName: '',
        witnessSecondOver18: '',
        witnessSecondIsBeneficiaryOrSpouse: '',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '9',
    testatorName: 'MacLeod, Iain',
    updatedAt: '2026-06-28',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '1958-03-14',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'scotland',
        maritalStatus: 'widowed',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: 'yes',
        madeVoluntarily: 'yes',
        previousWill: 'none',
        revocationClause: 'yes'
      },
      estate: {
        estateValueBand: 'under-325k',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'yes'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 50,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 50,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'yes'
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: 'cremation',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'draft',
        dateOfWill: null,
        willInWriting: 'yes',
        testatorSigned: '',
        witnessesPresentTogether: '',
        witnessesSigned: '',
        witnessFirstName: '',
        witnessFirstOver18: '',
        witnessFirstIsBeneficiaryOrSpouse: '',
        witnessSecondName: '',
        witnessSecondOver18: '',
        witnessSecondIsBeneficiaryOrSpouse: '',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '10',
    testatorName: 'Hughes, Gwen',
    updatedAt: '2026-06-29',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '1958-03-14',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'england-wales',
        maritalStatus: 'widowed',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: 'no',
        madeVoluntarily: 'yes',
        previousWill: 'none',
        revocationClause: 'yes'
      },
      estate: {
        estateValueBand: 'under-325k',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'no',
        otherJurisdictionsDetail: '',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'yes'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 50,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 50,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'yes'
      },
      family: {
        hasChildrenUnder18: 'no',
        guardianName: '',
        funeralWishes: 'cremation',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'draft',
        dateOfWill: null,
        willInWriting: 'yes',
        testatorSigned: '',
        witnessesPresentTogether: '',
        witnessesSigned: '',
        witnessFirstName: '',
        witnessFirstOver18: '',
        witnessFirstIsBeneficiaryOrSpouse: '',
        witnessSecondName: '',
        witnessSecondOver18: '',
        witnessSecondIsBeneficiaryOrSpouse: '',
        drafterNote: ''
      }
    } as Will
  },
  {
    id: '11',
    testatorName: 'Whitfield, Callum',
    updatedAt: '2026-06-30',
    data: {
      testator: {
        testatorName: 'Margaret Ellis',
        dateOfBirth: '1958-03-14',
        testatorAddress: '12 Station Road, Leeds LS1 4AB',
        domicile: 'england-wales',
        maritalStatus: 'cohabiting',
        marriageExpected: 'no',
        contemplationOfMarriageClause: '',
        hasMentalCapacity: 'yes',
        madeVoluntarily: 'yes',
        previousWill: 'exists',
        revocationClause: 'no'
      },
      estate: {
        estateValueBand: 'over-2m',
        ownsHome: 'yes',
        homeToDirectDescendants: 'yes',
        charityGiftPercent: null,
        estateOtherJurisdictions: 'yes',
        otherJurisdictionsDetail: 'Holiday flat in Malaga, Spain',
        specificGiftsNotes: 'My wedding ring to my daughter Anna.'
      },
      executors: {
        executorFirstName: 'Anna Ellis',
        executorFirstRelationship: 'daughter',
        executorSecondName: 'Peter Hughes',
        executorSecondRelationship: 'solicitor',
        executorsAdultConfirmed: 'no'
      },
      beneficiaries: {
        beneficiaryFirstName: 'Anna Ellis',
        beneficiaryFirstRelationship: 'child',
        beneficiaryFirstSharePercent: 50,
        beneficiaryFirstIsMinor: 'no',
        beneficiaryFirstHasTrustee: '',
        beneficiarySecondName: 'Tom Ellis',
        beneficiarySecondRelationship: 'child',
        beneficiarySecondSharePercent: 50,
        beneficiarySecondIsMinor: 'no',
        beneficiarySecondHasTrustee: '',
        beneficiaryThirdName: '',
        beneficiaryThirdRelationship: '',
        beneficiaryThirdSharePercent: null,
        beneficiaryThirdIsMinor: '',
        beneficiaryThirdHasTrustee: '',
        beneficiaryFourthName: '',
        beneficiaryFourthRelationship: '',
        beneficiaryFourthSharePercent: null,
        beneficiaryFourthIsMinor: '',
        beneficiaryFourthHasTrustee: '',
        residuaryClause: 'yes',
        dependantsConsidered: 'no'
      },
      family: {
        hasChildrenUnder18: 'yes',
        guardianName: '',
        funeralWishes: '',
        funeralWishesNote: 'A simple service; no flowers.'
      },
      execution: {
        executionStatus: 'draft',
        dateOfWill: null,
        willInWriting: 'yes',
        testatorSigned: '',
        witnessesPresentTogether: '',
        witnessesSigned: '',
        witnessFirstName: '',
        witnessFirstOver18: '',
        witnessFirstIsBeneficiaryOrSpouse: '',
        witnessSecondName: '',
        witnessSecondOver18: '',
        witnessSecondIsBeneficiaryOrSpouse: '',
        drafterNote: ''
      }
    } as Will
  }
];

export const sampleWillRows: DashboardRow[] = sampleWills.map((s) => {
  const r = validateWill(s.data);
  return {
    id: s.id,
    testatorName: s.testatorName,
    executionStatus: s.data.execution.executionStatus === 'signed' ? 'Signed' : 'Draft',
    validityClass: r.validityClass,
    sharesTotalPercent: r.sharesTotalPercent,
    witnessCount: r.witnessCount,
    formalityRisk: r.formalityRisk ? 'Yes' : 'No',
    flagCount: r.flaggedIssues.length,
    updatedAt: s.updatedAt
  };
});
