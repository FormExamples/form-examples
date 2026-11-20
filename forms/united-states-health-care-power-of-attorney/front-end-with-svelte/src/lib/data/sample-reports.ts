import type { Directive, ReadinessClass } from '#lib/engine/types.js';
import { evaluateDirective } from '#lib/engine/grader.js';

/** A sample directive: an identifier and the full data the engine grades. */
export interface SampleDirective {
  id: string;
  principalName: string;
  reviewerName: string;
  signedDate: string;
  data: Directive;
}

/** A row in the reviewer dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  state: string;
  principalName: string;
  agentName: string;
  reviewerName: string;
  readinessClass: ReadinessClass;
  flagCount: number;
  signedDate: string;
}

/** Sample directives, one per persona in `examples/personas.json`. */
export const sampleDirectives: SampleDirective[] = [
  {
    id: 'HCPOA-2026-0001',
    principalName: 'Maria Elena Vargas',
    reviewerName: 'S. Okoye, MSW',
    signedDate: '2026-09-01',
    data: {
      principal: {
        principalName: 'Maria Elena Vargas',
        birthDate: '1958-03-14',
        state: 'CA',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Daniel Vargas',
        agentRelationship: 'adult-child',
        agentAge: 34,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'yes',
        successor1Name: 'Lucia Vargas',
        successor1Phone: '415-555-0181',
        successor2Name: 'Rosa Ortiz'
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'yes',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-09-01',
        executionMethod: 'two-witnesses',
        witnessesPresent: 'yes',
        witness1Name: 'Grace Okafor',
        witness1IsRelative: 'no',
        witness1IsHeir: 'no',
        witness1IsAgent: 'no',
        witness1IsProvider: 'no',
        witness2Name: 'Peter Lindqvist',
        witness2IsRelative: 'no',
        witness2IsHeir: 'no',
        witness2IsAgent: 'no',
        witness2IsProvider: 'no',
        notaryName: '',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'yes',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  },
  {
    id: 'HCPOA-2026-0002',
    principalName: 'Harold Weiss',
    reviewerName: 'L. Fernandez, Esq.',
    signedDate: '2026-09-01',
    data: {
      principal: {
        principalName: 'Harold Weiss',
        birthDate: '1949-07-02',
        state: 'NY',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Ruth Weiss',
        agentRelationship: 'spouse',
        agentAge: 71,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'yes',
        successor1Name: 'Aaron Weiss',
        successor1Phone: '415-555-0181',
        successor2Name: ''
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'yes',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-09-01',
        executionMethod: 'two-witnesses',
        witnessesPresent: 'yes',
        witness1Name: 'Naomi Weiss',
        witness1IsRelative: 'yes',
        witness1IsHeir: 'no',
        witness1IsAgent: 'no',
        witness1IsProvider: 'no',
        witness2Name: 'Isaac Weiss',
        witness2IsRelative: 'yes',
        witness2IsHeir: 'no',
        witness2IsAgent: 'no',
        witness2IsProvider: 'no',
        notaryName: '',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'yes',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  },
  {
    id: 'HCPOA-2026-0003',
    principalName: 'Billy Ray Tucker',
    reviewerName: 'J. Whitfield, RN',
    signedDate: '2026-09-01',
    data: {
      principal: {
        principalName: 'Billy Ray Tucker',
        birthDate: '1962-11-30',
        state: 'TX',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Daniel Vargas',
        agentRelationship: 'adult-child',
        agentAge: 34,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'yes',
        successor1Name: 'Lucia Vargas',
        successor1Phone: '415-555-0181',
        successor2Name: 'Rosa Ortiz'
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'yes',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-09-01',
        executionMethod: 'notary',
        witnessesPresent: 'yes',
        witness1Name: '',
        witness1IsRelative: '',
        witness1IsHeir: '',
        witness1IsAgent: '',
        witness1IsProvider: '',
        witness2Name: '',
        witness2IsRelative: '',
        witness2IsHeir: '',
        witness2IsAgent: '',
        witness2IsProvider: '',
        notaryName: 'Carla Mendez, Notary Public',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'yes',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  },
  {
    id: 'HCPOA-2026-0004',
    principalName: 'Dolores Kowalski',
    reviewerName: 'A. Rahman, Esq.',
    signedDate: '2026-09-01',
    data: {
      principal: {
        principalName: 'Dolores Kowalski',
        birthDate: '1953-05-21',
        state: 'IL',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Daniel Vargas',
        agentRelationship: 'adult-child',
        agentAge: 34,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'yes',
        successor1Name: 'Lucia Vargas',
        successor1Phone: '415-555-0181',
        successor2Name: 'Rosa Ortiz'
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'yes',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-09-01',
        executionMethod: 'one-witness',
        witnessesPresent: 'yes',
        witness1Name: 'Grace Okafor',
        witness1IsRelative: 'no',
        witness1IsHeir: 'no',
        witness1IsAgent: 'no',
        witness1IsProvider: 'no',
        witness2Name: '',
        witness2IsRelative: '',
        witness2IsHeir: '',
        witness2IsAgent: '',
        witness2IsProvider: '',
        notaryName: '',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'yes',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  },
  {
    id: 'HCPOA-2026-0005',
    principalName: 'Maria Elena Vargas',
    reviewerName: 'S. Okoye, MSW',
    signedDate: '',
    data: {
      principal: {
        principalName: 'Maria Elena Vargas',
        birthDate: '1958-03-14',
        state: 'FL',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Daniel Vargas',
        agentRelationship: 'adult-child',
        agentAge: 34,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'yes',
        successor1Name: '',
        successor1Phone: '415-555-0181',
        successor2Name: ''
      },
      authority: {
        effectiveWhen: '',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'no',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: null,
        executionMethod: '',
        witnessesPresent: '',
        witness1Name: '',
        witness1IsRelative: '',
        witness1IsHeir: '',
        witness1IsAgent: '',
        witness1IsProvider: '',
        witness2Name: '',
        witness2IsRelative: '',
        witness2IsHeir: '',
        witness2IsAgent: '',
        witness2IsProvider: '',
        notaryName: '',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: '',
        copyToPhysician: '',
        copyToSuccessor: '',
        copyToFacility: ''
      }
    }
  },
  {
    id: 'HCPOA-2026-0006',
    principalName: 'Evelyn Brooks',
    reviewerName: 'L. Fernandez, Esq.',
    signedDate: '2026-09-01',
    data: {
      principal: {
        principalName: 'Evelyn Brooks',
        birthDate: '1947-01-09',
        state: 'FL',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Tom Brooks',
        agentRelationship: 'adult-child',
        agentAge: 34,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'yes',
        successor1Name: 'Lucia Vargas',
        successor1Phone: '415-555-0181',
        successor2Name: 'Rosa Ortiz'
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'yes',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-09-01',
        executionMethod: 'two-witnesses',
        witnessesPresent: 'yes',
        witness1Name: 'Tom Brooks',
        witness1IsRelative: 'yes',
        witness1IsHeir: 'no',
        witness1IsAgent: 'yes',
        witness1IsProvider: 'no',
        witness2Name: 'Janet Brooks',
        witness2IsRelative: 'yes',
        witness2IsHeir: 'no',
        witness2IsAgent: 'no',
        witness2IsProvider: 'no',
        notaryName: '',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'yes',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  },
  {
    id: 'HCPOA-2026-0007',
    principalName: 'Walter Ng',
    reviewerName: 'J. Whitfield, RN',
    signedDate: '2026-09-01',
    data: {
      principal: {
        principalName: 'Walter Ng',
        birthDate: '1939-12-02',
        state: 'CA',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Pat Hollis',
        agentRelationship: 'other',
        agentAge: 34,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'yes',
        agentIsFacilityEmployee: 'yes',
        agentRelatedToPrincipal: 'no',
        agentAccepted: 'yes',
        successor1Name: 'Lucia Vargas',
        successor1Phone: '415-555-0181',
        successor2Name: 'Rosa Ortiz'
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'yes',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-09-01',
        executionMethod: 'two-witnesses',
        witnessesPresent: 'yes',
        witness1Name: 'Nurse Alma Reyes',
        witness1IsRelative: 'no',
        witness1IsHeir: 'no',
        witness1IsAgent: 'no',
        witness1IsProvider: 'yes',
        witness2Name: 'Peter Lindqvist',
        witness2IsRelative: 'no',
        witness2IsHeir: 'no',
        witness2IsAgent: 'no',
        witness2IsProvider: 'no',
        notaryName: '',
        principalInSkilledNursingFacility: 'yes',
        ombudsmanSigned: 'no'
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'yes',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  },
  {
    id: 'HCPOA-2026-0008',
    principalName: 'Kai Nakamura',
    reviewerName: 'A. Rahman, Esq.',
    signedDate: '2026-08-01',
    data: {
      principal: {
        principalName: 'Kai Nakamura',
        birthDate: '2009-04-10',
        state: 'WA',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Mika Nakamura',
        agentRelationship: 'sibling',
        agentAge: 16,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'yes',
        successor1Name: 'Lucia Vargas',
        successor1Phone: '415-555-0181',
        successor2Name: 'Rosa Ortiz'
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'yes',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-08-01',
        executionMethod: 'two-witnesses',
        witnessesPresent: 'yes',
        witness1Name: 'Grace Okafor',
        witness1IsRelative: 'no',
        witness1IsHeir: 'no',
        witness1IsAgent: 'no',
        witness1IsProvider: 'no',
        witness2Name: 'Peter Lindqvist',
        witness2IsRelative: 'no',
        witness2IsHeir: 'no',
        witness2IsAgent: 'no',
        witness2IsProvider: 'no',
        notaryName: '',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'yes',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  },
  {
    id: 'HCPOA-2026-0009',
    principalName: 'Frances Miller',
    reviewerName: 'S. Okoye, MSW',
    signedDate: '2026-09-01',
    data: {
      principal: {
        principalName: 'Frances Miller',
        birthDate: '1951-08-17',
        state: 'OH',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Daniel Vargas',
        agentRelationship: 'adult-child',
        agentAge: 34,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'yes',
        successor1Name: 'Lucia Vargas',
        successor1Phone: '415-555-0181',
        successor2Name: 'Rosa Ortiz'
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'yes',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-09-01',
        executionMethod: 'two-witnesses',
        witnessesPresent: 'yes',
        witness1Name: 'Grace Okafor',
        witness1IsRelative: 'no',
        witness1IsHeir: 'no',
        witness1IsAgent: 'no',
        witness1IsProvider: 'no',
        witness2Name: 'Dale Miller',
        witness2IsRelative: 'yes',
        witness2IsHeir: 'no',
        witness2IsAgent: 'no',
        witness2IsProvider: 'no',
        notaryName: '',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'yes',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  },
  {
    id: 'HCPOA-2026-0010',
    principalName: 'Siku Anderson',
    reviewerName: 'L. Fernandez, Esq.',
    signedDate: '2026-09-01',
    data: {
      principal: {
        principalName: 'Siku Anderson',
        birthDate: '1944-06-05',
        state: 'AK',
        phone: '415-555-0142',
        capacityConfirmed: 'yes',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Daniel Vargas',
        agentRelationship: 'adult-child',
        agentAge: 34,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'yes',
        successor1Name: 'Lucia Vargas',
        successor1Phone: '415-555-0181',
        successor2Name: 'Rosa Ortiz'
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'no',
        mentalHealthAuthority: 'yes',
        organDonation: 'not-addressed',
        priorDirectiveStatus: 'none-existing'
      },
      wishes: {
        lifeSustainingTreatment: 'refuse',
        cpr: 'accept',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'yes',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-09-01',
        executionMethod: 'two-witnesses',
        witnessesPresent: 'yes',
        witness1Name: 'Grace Okafor',
        witness1IsRelative: 'no',
        witness1IsHeir: 'no',
        witness1IsAgent: 'no',
        witness1IsProvider: 'no',
        witness2Name: 'Peter Lindqvist',
        witness2IsRelative: 'no',
        witness2IsHeir: 'no',
        witness2IsAgent: 'no',
        witness2IsProvider: 'no',
        notaryName: '',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'no',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  },
  {
    id: 'HCPOA-2026-0011',
    principalName: 'Arthur Pell',
    reviewerName: 'J. Whitfield, RN',
    signedDate: '2026-09-01',
    data: {
      principal: {
        principalName: 'Arthur Pell',
        birthDate: '1940-02-28',
        state: 'PA',
        phone: '415-555-0142',
        capacityConfirmed: 'no',
        signedVoluntarily: 'yes'
      },
      agent: {
        agentName: 'Daniel Vargas',
        agentRelationship: 'adult-child',
        agentAge: 34,
        agentPhone: '415-555-0177',
        agentIsHealthCareProvider: 'no',
        agentIsFacilityEmployee: 'no',
        agentRelatedToPrincipal: 'yes',
        agentAccepted: 'no',
        successor1Name: 'Daniel Vargas',
        successor1Phone: '415-555-0181',
        successor2Name: ''
      },
      authority: {
        effectiveWhen: 'upon-incapacity',
        incapacityDeterminedBy: 'two-physicians',
        hipaaRelease: 'yes',
        mentalHealthAuthority: 'yes',
        organDonation: 'any-needs',
        priorDirectiveStatus: 'prior-remains'
      },
      wishes: {
        lifeSustainingTreatment: 'time-limited-trial',
        cpr: 'agent-decides',
        ventilator: 'agent-decides',
        artificialNutrition: 'agent-decides',
        comfortCareFirst: 'yes',
        seriousIllness: 'no',
        polstStatus: 'none',
        wishesNote: 'Keep me comfortable and at home if possible.'
      },
      execution: {
        signatureDate: '2026-09-01',
        executionMethod: 'two-witnesses',
        witnessesPresent: 'yes',
        witness1Name: 'Grace Okafor',
        witness1IsRelative: 'no',
        witness1IsHeir: 'no',
        witness1IsAgent: 'no',
        witness1IsProvider: 'no',
        witness2Name: 'Peter Lindqvist',
        witness2IsRelative: 'no',
        witness2IsHeir: 'no',
        witness2IsAgent: 'no',
        witness2IsProvider: 'no',
        notaryName: '',
        principalInSkilledNursingFacility: 'no',
        ombudsmanSigned: ''
      },
      distribution: {
        copyToAgent: 'yes',
        copyToPhysician: 'yes',
        copyToSuccessor: 'yes',
        copyToFacility: 'yes'
      }
    }
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleDirectiveRows: DashboardRow[] = sampleDirectives.map((s) => {
  const r = evaluateDirective(s.data);
  return {
    id: s.id,
    state: s.data.principal.state,
    principalName: s.principalName,
    agentName: s.data.agent.agentName,
    reviewerName: s.reviewerName,
    readinessClass: r.readinessClass,
    flagCount: r.flaggedIssues.length,
    signedDate: s.signedDate
  };
});
