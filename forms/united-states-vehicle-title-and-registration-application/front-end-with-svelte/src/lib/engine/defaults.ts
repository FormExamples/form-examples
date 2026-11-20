import type { TitleApplication } from './types';

/** A blank application with all fields at their unanswered defaults ('' or null). */
export function createDefaultApplication(): TitleApplication {
  return {
    application: {
      state: '',
      transactionType: '',
      vehicleCondition: '',
      acquisitionMethod: '',
      outOfStateTransfer: '',
      previousState: '',
      acquisitionDate: null,
      applicationDate: null
    },
    owner: {
      ownerType: '',
      ownerName: '',
      coOwnerName: '',
      coOwnerConjunction: '',
      identificationType: '',
      identificationNumber: '',
      mailingAddress: '',
      ownerSigned: '',
      coOwnerSigned: ''
    },
    vehicle: {
      vin: '',
      modelYear: null,
      make: '',
      model: '',
      bodyType: '',
      vehicleClass: '',
      fuelType: '',
      gvwrLbs: null,
      color: ''
    },
    odometer: {
      odometerReading: null,
      odometerStatus: '',
      sellerOdometerStatement: '',
      buyerOdometerAcknowledged: ''
    },
    titleHistory: {
      titleDocument: '',
      priorTitleSurrendered: '',
      titleBrand: '',
      brandDisclosed: '',
      nmvtisCheck: '',
      brandInspection: ''
    },
    lien: {
      lienStatus: '',
      lienholderName: '',
      lienElectronic: ''
    },
    compliance: {
      insuranceProof: '',
      insuranceExpiryDate: null,
      emissionsInspection: '',
      safetyInspection: '',
      vinVerification: ''
    },
    feesTax: {
      purchasePriceUsd: null,
      salesTaxStatus: '',
      salesTaxRatePercent: null,
      salesTaxAmountUsd: null,
      taxExemptionReason: '',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: '',
      applicantNote: ''
    }
  };
}
