import type { BillOfSale } from './types';

/** A blank bill of sale with all fields at their unanswered defaults. */
export function createDefaultBillOfSale(): BillOfSale {
  const party = () => ({
    name: '',
    type: '' as const,
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    signed: '' as const
  });
  return {
    transaction: {
      state: '',
      saleDate: null,
      salePriceAsUsd: null,
      paymentMethod: '',
      taxBasis: ''
    },
    seller: party(),
    buyer: party(),
    vehicle: {
      year: null,
      make: '',
      model: '',
      bodyType: '',
      vin: '',
      color: '',
      titleNumber: '',
      titleBrand: '',
      gvwrOver16000: '',
      selfPropelled: ''
    },
    odometer: { readingMiles: null, status: '', sellerCertified: '', buyerAcknowledged: '' },
    terms: {
      sellerHoldsTitle: '',
      titleSigned: '',
      lienStatus: '',
      lienholderName: '',
      lienReleaseDate: null,
      asIsClause: '',
      warrantyNote: '',
      notarized: ''
    },
    afterSale: {
      releaseOfLiabilityFiled: '',
      releaseFiledDate: null,
      platesRemoved: '',
      buyerTitleApplicationDate: null
    }
  };
}
