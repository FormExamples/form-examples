import type { PowerOfAttorney } from './types';

/** A blank durable financial power of attorney plan with every field unanswered. */
export function createDefaultInstrument(): PowerOfAttorney {
  return {
    principal: {
      principalName: '',
      dateOfBirth: null,
      state: '',
      principalAddress: '',
      capacityConfirmed: ''
    },
    instrument: {
      durableStatement: '',
      effectiveness: '',
      springingTrigger: '',
      statutoryNoticeIncluded: ''
    },
    agents: {
      agentName: '',
      agentRelationship: '',
      agentIsAdult: '',
      agentSignedAcknowledgment: '',
      successorAgentName: '',
      coAgentsMode: '',
      compensation: '',
      compensationAmount: null
    },
    authority: {
      grantBanking: '',
      grantRealEstate: '',
      grantInvestments: '',
      grantBusiness: '',
      grantInsurance: '',
      grantTaxMatters: '',
      grantBenefits: '',
      grantRetirement: '',
      grantClaims: '',
      grantPersonalProperty: '',
      hotCreateTrust: '',
      hotGift: '',
      hotSurvivorship: '',
      hotBeneficiary: '',
      hotDelegate: '',
      hotAnnuityWaiver: '',
      hotDisclaim: '',
      hotPowersInitialed: '',
      giftLimitType: '',
      giftLimitAmount: null,
      selfGiftingAllowed: ''
    },
    execution: { notaryArranged: '', witnessCount: null, witnessIsAgent: '' },
    acceptance: { usedForRealEstate: '', bankFormCompleted: '', form2848Status: '' }
  };
}
