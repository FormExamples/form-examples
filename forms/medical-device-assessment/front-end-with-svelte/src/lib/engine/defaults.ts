// Default (unanswered) state for the Medical Device Assessment.
//
// Kept apart from the store on purpose: the store imports `$app/environment`
// (via `$app/env`), which Vitest cannot resolve, whereas the engine and its
// tests only need these plain functions. Unanswered text and enum fields are
// '' and unanswered dates are null.

/** The fields the scoring engine reads (ported from js/device-grader.js). */
export function createEngineDefaults() {
  return {
    status: 'draft',
    deviceName: '',
    intendedPurpose: '',
    isInVitroDiagnostic: '',
    deviceKind: '',
    contactDuration: '',
    bodySite: '',
    channelsOrStoresBodySubstances: '',
    connectedToActiveDeviceClassIiaOrHigher: '',
    reusableSurgicalInstrument: '',
    activeTherapeutic: '',
    activeDiagnostic: '',
    administersOrExchangesEnergy: '',
    energyPotentiallyHazardous: '',
    administersOrRemovesMedicinalSubstances: '',
    administrationPotentiallyHazardous: '',
    monitorsVitalPhysiologicalParameters: '',
    closedLoopTherapy: '',
    softwarePurpose: '',
    softwareWorstCaseHarm: '',
    containsMedicinalSubstance: '',
    containsHumanOrAnimalTissue: '',
    containsNanomaterialWithHighExposurePotential: '',
    composedOfAbsorbedSubstances: '',
    contraceptionOrStiPrevention: '',
    disinfectsOrCleansDevices: '',
    suppliedSterile: '',
    hasMeasuringFunction: '',
    clinicalEvidenceStatus: '',
    riskManagementFileIso14971: '',
    qualityManagementSystemIso13485: '',
    cybersecurityAssessmentDone: '',
    postMarketSurveillancePlan: '',
    uniqueDeviceIdentifierAssigned: '',
    finalDeviceClass: '',
    overrideReason: ''
  };
}

/** A fresh, fully-defaulted wizard state (engine fields plus descriptive fields). */
export function createDefaultAssessment() {
  return {
    ...createEngineDefaults(),
    assessmentDate: null as string | null,
    modelOrCatalogueNumber: '',
    uniqueDeviceIdentifier: '',
    intendedUser: '',
    targetJurisdiction: '',
    assessorNotes: '',
    manufacturer: {
      name: '',
      email: '',
      phone: '',
      postalAddressAsFullText: '',
      countryAsIso31661Alpha2: '',
      postcode: '',
      singleRegistrationNumber: '',
      authorizedRepresentativeName: '',
      unitedKingdomResponsiblePersonName: ''
    },
    assessor: {
      name: '',
      email: '',
      phone: '',
      role: '',
      organization: ''
    }
  };
}
