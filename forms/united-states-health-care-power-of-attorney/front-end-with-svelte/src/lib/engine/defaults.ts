import type { Directive } from './types';

/**
 * A blank directive with every field at its unanswered default. Lives with the
 * engine, not the store, so tests and the sample data never import the
 * SvelteKit-only `$app/env` module.
 */
export function createDefaultDirective(): Directive {
  return {
    principal: {
      principalName: '',
      birthDate: null,
      state: '',
      phone: '',
      capacityConfirmed: '',
      signedVoluntarily: ''
    },
    agent: {
      agentName: '',
      agentRelationship: '',
      agentAge: null,
      agentPhone: '',
      agentIsHealthCareProvider: '',
      agentIsFacilityEmployee: '',
      agentRelatedToPrincipal: '',
      agentAccepted: '',
      successor1Name: '',
      successor1Phone: '',
      successor2Name: ''
    },
    authority: {
      effectiveWhen: '',
      incapacityDeterminedBy: '',
      hipaaRelease: '',
      mentalHealthAuthority: '',
      organDonation: '',
      priorDirectiveStatus: ''
    },
    wishes: {
      lifeSustainingTreatment: '',
      cpr: '',
      ventilator: '',
      artificialNutrition: '',
      comfortCareFirst: '',
      seriousIllness: '',
      polstStatus: '',
      wishesNote: ''
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
      principalInSkilledNursingFacility: '',
      ombudsmanSigned: ''
    },
    distribution: {
      copyToAgent: '',
      copyToPhysician: '',
      copyToSuccessor: '',
      copyToFacility: ''
    }
  };
}
