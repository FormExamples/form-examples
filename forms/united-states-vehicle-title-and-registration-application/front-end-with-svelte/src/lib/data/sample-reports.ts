import type { ApplicationClass, TitleApplication } from '#lib/engine/types.js';
import { validateApplication } from '#lib/engine/title-grader.js';
import { detectFlaggedIssues } from '#lib/engine/flagged-issues.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleApplication {
  id: string;
  updatedAt: string;
  data: TitleApplication;
}

/** A row in the clerk dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  ownerName: string;
  vin: string;
  state: string;
  vehicle: string;
  applicationClass: ApplicationClass;
  brandOrLienIssue: boolean;
  outstandingItemCount: number;
  flagCount: number;
  updatedAt: string;
}

// The samples are the first personas in `examples/personas.json`, so the
// dashboard's offline data and the persona oracle describe the same cases.

/** Ready: California used private-party sale, all documents present */
function sample1(): TitleApplication {
  return {
    application: {
      state: 'CA',
      transactionType: 'title-and-registration',
      vehicleCondition: 'used',
      acquisitionMethod: 'private-purchase',
      outOfStateTransfer: 'no',
      previousState: '',
      acquisitionDate: '2026-10-01',
      applicationDate: '2026-10-08'
    },
    owner: {
      ownerType: 'individual',
      ownerName: 'Marisol Alvarez',
      coOwnerName: '',
      coOwnerConjunction: '',
      identificationType: 'drivers-license',
      identificationNumber: 'D1234567',
      mailingAddress: '123 Main Street, Anytown',
      ownerSigned: 'yes',
      coOwnerSigned: ''
    },
    vehicle: {
      vin: '19XFC2F50KE000123',
      modelYear: 2019,
      make: 'Honda',
      model: 'Civic',
      bodyType: '4-door sedan',
      vehicleClass: 'passenger',
      fuelType: 'gasoline',
      gvwrLbs: 4400,
      color: 'Silver'
    },
    odometer: {
      odometerReading: 61250,
      odometerStatus: 'actual',
      sellerOdometerStatement: 'yes',
      buyerOdometerAcknowledged: 'yes'
    },
    titleHistory: {
      titleDocument: 'state-title',
      priorTitleSurrendered: 'yes',
      titleBrand: 'none',
      brandDisclosed: '',
      nmvtisCheck: 'clear',
      brandInspection: 'not-applicable'
    },
    lien: {
      lienStatus: 'none',
      lienholderName: '',
      lienElectronic: ''
    },
    compliance: {
      insuranceProof: 'provided',
      insuranceExpiryDate: '2027-03-01',
      emissionsInspection: 'passed',
      safetyInspection: 'not-required',
      vinVerification: 'not-required'
    },
    feesTax: {
      purchasePriceUsd: 14500,
      salesTaxStatus: 'due-at-title',
      salesTaxRatePercent: 8.75,
      salesTaxAmountUsd: 1268.75,
      taxExemptionReason: '',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: 'yes',
      applicantNote: ''
    }
  };
}

/** Ready: Texas new truck from a dealer, financed, electronic lien */
function sample2(): TitleApplication {
  return {
    application: {
      state: 'TX',
      transactionType: 'title-and-registration',
      vehicleCondition: 'new',
      acquisitionMethod: 'dealer-purchase',
      outOfStateTransfer: 'no',
      previousState: '',
      acquisitionDate: '2026-10-12',
      applicationDate: '2026-10-14'
    },
    owner: {
      ownerType: 'individual',
      ownerName: 'Daniel Brooks',
      coOwnerName: '',
      coOwnerConjunction: '',
      identificationType: 'drivers-license',
      identificationNumber: 'TX 40112233',
      mailingAddress: '88 Ranch Road, Austin, TX',
      ownerSigned: 'yes',
      coOwnerSigned: ''
    },
    vehicle: {
      vin: '1FTFW1E59TFA12345',
      modelYear: 2026,
      make: 'Ford',
      model: 'F-150',
      bodyType: 'Crew cab pickup',
      vehicleClass: 'light-truck',
      fuelType: 'gasoline',
      gvwrLbs: 7050,
      color: 'Blue'
    },
    odometer: {
      odometerReading: 16,
      odometerStatus: 'actual',
      sellerOdometerStatement: 'yes',
      buyerOdometerAcknowledged: 'yes'
    },
    titleHistory: {
      titleDocument: 'manufacturer-statement-of-origin',
      priorTitleSurrendered: '',
      titleBrand: 'none',
      brandDisclosed: '',
      nmvtisCheck: 'clear',
      brandInspection: 'not-applicable'
    },
    lien: {
      lienStatus: 'new-lien',
      lienholderName: 'Lone Star Credit Union',
      lienElectronic: 'yes'
    },
    compliance: {
      insuranceProof: 'provided',
      insuranceExpiryDate: '2027-04-30',
      emissionsInspection: 'not-required',
      safetyInspection: 'not-required',
      vinVerification: 'not-required'
    },
    feesTax: {
      purchasePriceUsd: 52000,
      salesTaxStatus: 'paid-to-dealer',
      salesTaxRatePercent: 6.25,
      salesTaxAmountUsd: 3250,
      taxExemptionReason: '',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: 'yes',
      applicantNote: ''
    }
  };
}

/** Incomplete: Florida purchase with a mistyped VIN, no insurance, no odometer statement */
function sample3(): TitleApplication {
  return {
    application: {
      state: 'FL',
      transactionType: 'title-and-registration',
      vehicleCondition: 'used',
      acquisitionMethod: 'private-purchase',
      outOfStateTransfer: 'no',
      previousState: '',
      acquisitionDate: '2026-10-05',
      applicationDate: '2026-10-20'
    },
    owner: {
      ownerType: 'individual',
      ownerName: 'Tomasz Evans',
      coOwnerName: '',
      coOwnerConjunction: '',
      identificationType: 'drivers-license',
      identificationNumber: 'E123-456-78-901-0',
      mailingAddress: '14 Palm Way, Tampa, FL',
      ownerSigned: 'yes',
      coOwnerSigned: ''
    },
    vehicle: {
      vin: '3VWDB7AJ5GHM00099',
      modelYear: 2016,
      make: 'Volkswagen',
      model: 'Jetta',
      bodyType: 'Sedan',
      vehicleClass: 'passenger',
      fuelType: 'gasoline',
      gvwrLbs: 3900,
      color: 'Black'
    },
    odometer: {
      odometerReading: 142000,
      odometerStatus: 'actual',
      sellerOdometerStatement: 'no',
      buyerOdometerAcknowledged: 'no'
    },
    titleHistory: {
      titleDocument: 'state-title',
      priorTitleSurrendered: 'no',
      titleBrand: 'none',
      brandDisclosed: '',
      nmvtisCheck: 'not-checked',
      brandInspection: 'not-applicable'
    },
    lien: {
      lienStatus: 'none',
      lienholderName: '',
      lienElectronic: ''
    },
    compliance: {
      insuranceProof: 'not-provided',
      insuranceExpiryDate: null,
      emissionsInspection: 'not-required',
      safetyInspection: 'not-required',
      vinVerification: 'not-required'
    },
    feesTax: {
      purchasePriceUsd: 2400,
      salesTaxStatus: 'not-calculated',
      salesTaxRatePercent: null,
      salesTaxAmountUsd: null,
      taxExemptionReason: '',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: 'no',
      applicantNote: ''
    }
  };
}

/** Issue: Washington salvage title, NMVTIS record found, title-only */
function sample4(): TitleApplication {
  return {
    application: {
      state: 'WA',
      transactionType: 'title-only',
      vehicleCondition: 'used',
      acquisitionMethod: 'private-purchase',
      outOfStateTransfer: 'no',
      previousState: '',
      acquisitionDate: '2026-10-10',
      applicationDate: '2026-10-16'
    },
    owner: {
      ownerType: 'individual',
      ownerName: 'Chen Wei',
      coOwnerName: '',
      coOwnerConjunction: '',
      identificationType: 'drivers-license',
      identificationNumber: 'D1234567',
      mailingAddress: '123 Main Street, Anytown',
      ownerSigned: 'yes',
      coOwnerSigned: ''
    },
    vehicle: {
      vin: '4S4BSAHC8E3123456',
      modelYear: 2014,
      make: 'Subaru',
      model: 'Outback',
      bodyType: '4-door sedan',
      vehicleClass: 'passenger',
      fuelType: 'gasoline',
      gvwrLbs: 4400,
      color: 'Silver'
    },
    odometer: {
      odometerReading: 61250,
      odometerStatus: 'actual',
      sellerOdometerStatement: 'yes',
      buyerOdometerAcknowledged: 'yes'
    },
    titleHistory: {
      titleDocument: 'state-title',
      priorTitleSurrendered: 'yes',
      titleBrand: 'salvage',
      brandDisclosed: 'yes',
      nmvtisCheck: 'brand-or-theft-found',
      brandInspection: 'not-done'
    },
    lien: {
      lienStatus: 'none',
      lienholderName: '',
      lienElectronic: ''
    },
    compliance: {
      insuranceProof: 'not-provided',
      insuranceExpiryDate: null,
      emissionsInspection: 'not-required',
      safetyInspection: 'not-required',
      vinVerification: 'not-required'
    },
    feesTax: {
      purchasePriceUsd: 3100,
      salesTaxStatus: 'due-at-title',
      salesTaxRatePercent: 10.1,
      salesTaxAmountUsd: 313.1,
      taxExemptionReason: '',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: 'yes',
      applicantNote: ''
    }
  };
}

/** Issue: Pennsylvania existing lien not released */
function sample5(): TitleApplication {
  return {
    application: {
      state: 'PA',
      transactionType: 'title-and-registration',
      vehicleCondition: 'used',
      acquisitionMethod: 'private-purchase',
      outOfStateTransfer: 'no',
      previousState: '',
      acquisitionDate: '2026-10-01',
      applicationDate: '2026-10-08'
    },
    owner: {
      ownerType: 'individual',
      ownerName: 'Ruth Delaney',
      coOwnerName: '',
      coOwnerConjunction: '',
      identificationType: 'drivers-license',
      identificationNumber: 'D1234567',
      mailingAddress: '123 Main Street, Anytown',
      ownerSigned: 'yes',
      coOwnerSigned: ''
    },
    vehicle: {
      vin: '4T1B11HK6MU654321',
      modelYear: 2021,
      make: 'Toyota',
      model: 'Camry',
      bodyType: '4-door sedan',
      vehicleClass: 'passenger',
      fuelType: 'gasoline',
      gvwrLbs: 4400,
      color: 'Silver'
    },
    odometer: {
      odometerReading: 61250,
      odometerStatus: 'actual',
      sellerOdometerStatement: 'yes',
      buyerOdometerAcknowledged: 'yes'
    },
    titleHistory: {
      titleDocument: 'state-title',
      priorTitleSurrendered: 'yes',
      titleBrand: 'none',
      brandDisclosed: '',
      nmvtisCheck: 'clear',
      brandInspection: 'not-applicable'
    },
    lien: {
      lienStatus: 'existing-lien-unreleased',
      lienholderName: 'Keystone Auto Finance',
      lienElectronic: 'no'
    },
    compliance: {
      insuranceProof: 'provided',
      insuranceExpiryDate: '2027-03-01',
      emissionsInspection: 'not-required',
      safetyInspection: 'not-required',
      vinVerification: 'not-required'
    },
    feesTax: {
      purchasePriceUsd: 21500,
      salesTaxStatus: 'due-at-title',
      salesTaxRatePercent: 6,
      salesTaxAmountUsd: 1290,
      taxExemptionReason: '',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: 'yes',
      applicantNote: ''
    }
  };
}

/** Ready: Montana (state not encoded) uses the uniform default rule */
function sample6(): TitleApplication {
  return {
    application: {
      state: 'MT',
      transactionType: 'title-and-registration',
      vehicleCondition: 'used',
      acquisitionMethod: 'private-purchase',
      outOfStateTransfer: 'no',
      previousState: '',
      acquisitionDate: '2026-10-01',
      applicationDate: '2026-10-08'
    },
    owner: {
      ownerType: 'individual',
      ownerName: 'Anneliese Fischer',
      coOwnerName: '',
      coOwnerConjunction: '',
      identificationType: 'drivers-license',
      identificationNumber: 'D1234567',
      mailingAddress: '123 Main Street, Anytown',
      ownerSigned: 'yes',
      coOwnerSigned: ''
    },
    vehicle: {
      vin: 'JTDKN3DU6A0123456',
      modelYear: 2010,
      make: 'Toyota',
      model: 'Prius',
      bodyType: '4-door sedan',
      vehicleClass: 'passenger',
      fuelType: 'hybrid',
      gvwrLbs: 4300,
      color: 'Silver'
    },
    odometer: {
      odometerReading: null,
      odometerStatus: '',
      sellerOdometerStatement: '',
      buyerOdometerAcknowledged: ''
    },
    titleHistory: {
      titleDocument: 'state-title',
      priorTitleSurrendered: 'yes',
      titleBrand: 'none',
      brandDisclosed: '',
      nmvtisCheck: 'clear',
      brandInspection: 'not-applicable'
    },
    lien: {
      lienStatus: 'none',
      lienholderName: '',
      lienElectronic: ''
    },
    compliance: {
      insuranceProof: 'provided',
      insuranceExpiryDate: '2027-03-01',
      emissionsInspection: 'not-required',
      safetyInspection: 'not-required',
      vinVerification: 'not-required'
    },
    feesTax: {
      purchasePriceUsd: 5200,
      salesTaxStatus: 'exempt',
      salesTaxRatePercent: null,
      salesTaxAmountUsd: null,
      taxExemptionReason: 'Montana levies no general sales tax',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: 'yes',
      applicantNote: ''
    }
  };
}

/** Issue: Ohio gifted vehicle with a not-actual-mileage odometer disclosure */
function sample7(): TitleApplication {
  return {
    application: {
      state: 'OH',
      transactionType: 'title-and-registration',
      vehicleCondition: 'used',
      acquisitionMethod: 'gift',
      outOfStateTransfer: 'no',
      previousState: '',
      acquisitionDate: '2026-10-01',
      applicationDate: '2026-10-08'
    },
    owner: {
      ownerType: 'individual',
      ownerName: 'Priya Nair',
      coOwnerName: '',
      coOwnerConjunction: '',
      identificationType: 'drivers-license',
      identificationNumber: 'D1234567',
      mailingAddress: '123 Main Street, Anytown',
      ownerSigned: 'yes',
      coOwnerSigned: ''
    },
    vehicle: {
      vin: '1FADP3F2XHL123456',
      modelYear: 2017,
      make: 'Ford',
      model: 'Focus',
      bodyType: '4-door sedan',
      vehicleClass: 'passenger',
      fuelType: 'gasoline',
      gvwrLbs: 4400,
      color: 'Silver'
    },
    odometer: {
      odometerReading: 88400,
      odometerStatus: 'not-actual',
      sellerOdometerStatement: 'yes',
      buyerOdometerAcknowledged: 'yes'
    },
    titleHistory: {
      titleDocument: 'state-title',
      priorTitleSurrendered: 'yes',
      titleBrand: 'none',
      brandDisclosed: '',
      nmvtisCheck: 'clear',
      brandInspection: 'not-applicable'
    },
    lien: {
      lienStatus: 'none',
      lienholderName: '',
      lienElectronic: ''
    },
    compliance: {
      insuranceProof: 'provided',
      insuranceExpiryDate: '2027-03-01',
      emissionsInspection: 'not-required',
      safetyInspection: 'not-required',
      vinVerification: 'not-required'
    },
    feesTax: {
      purchasePriceUsd: null,
      salesTaxStatus: 'exempt',
      salesTaxRatePercent: null,
      salesTaxAmountUsd: null,
      taxExemptionReason: 'Gift between family members',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: 'yes',
      applicantNote: ''
    }
  };
}

/** Incomplete: Arizona co-owner AND has not signed, expired insurance, tax rate below the state base */
function sample8(): TitleApplication {
  return {
    application: {
      state: 'AZ',
      transactionType: 'title-and-registration',
      vehicleCondition: 'used',
      acquisitionMethod: 'private-purchase',
      outOfStateTransfer: 'no',
      previousState: '',
      acquisitionDate: '2026-10-01',
      applicationDate: '2026-10-08'
    },
    owner: {
      ownerType: 'individual',
      ownerName: 'Carla Mendes',
      coOwnerName: 'Paulo Mendes',
      coOwnerConjunction: 'and',
      identificationType: 'drivers-license',
      identificationNumber: 'D1234567',
      mailingAddress: '123 Main Street, Anytown',
      ownerSigned: 'yes',
      coOwnerSigned: 'no'
    },
    vehicle: {
      vin: 'JTMBFREV2SJ123456',
      modelYear: 2025,
      make: 'Toyota',
      model: 'RAV4',
      bodyType: '4-door sedan',
      vehicleClass: 'light-truck',
      fuelType: 'gasoline',
      gvwrLbs: 4800,
      color: 'Silver'
    },
    odometer: {
      odometerReading: 61250,
      odometerStatus: 'actual',
      sellerOdometerStatement: 'yes',
      buyerOdometerAcknowledged: 'yes'
    },
    titleHistory: {
      titleDocument: 'state-title',
      priorTitleSurrendered: 'yes',
      titleBrand: 'none',
      brandDisclosed: '',
      nmvtisCheck: 'clear',
      brandInspection: 'not-applicable'
    },
    lien: {
      lienStatus: 'none',
      lienholderName: '',
      lienElectronic: ''
    },
    compliance: {
      insuranceProof: 'provided',
      insuranceExpiryDate: '2026-09-30',
      emissionsInspection: 'not-required',
      safetyInspection: 'not-required',
      vinVerification: 'not-required'
    },
    feesTax: {
      purchasePriceUsd: 31000,
      salesTaxStatus: 'due-at-title',
      salesTaxRatePercent: 5,
      salesTaxAmountUsd: 1550,
      taxExemptionReason: '',
      titleFeeUsd: null,
      registrationFeeUsd: null,
      feesTendered: 'yes',
      applicantNote: ''
    }
  };
}

/** The sample applications, keyed by stable id (used to seed the wizard). */
export const sampleApplications: SampleApplication[] = [
  { id: 'VTA-2026-0001', updatedAt: '2026-10-08', data: sample1() },
  { id: 'VTA-2026-0002', updatedAt: '2026-10-14', data: sample2() },
  { id: 'VTA-2026-0003', updatedAt: '2026-10-20', data: sample3() },
  { id: 'VTA-2026-0004', updatedAt: '2026-10-16', data: sample4() },
  { id: 'VTA-2026-0005', updatedAt: '2026-10-08', data: sample5() },
  { id: 'VTA-2026-0006', updatedAt: '2026-10-08', data: sample6() },
  { id: 'VTA-2026-0007', updatedAt: '2026-10-08', data: sample7() },
  { id: 'VTA-2026-0008', updatedAt: '2026-10-08', data: sample8() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleApplicationRows: DashboardRow[] = sampleApplications.map((s) => {
  const r = validateApplication(s.data);
  const v = s.data.vehicle;
  return {
    id: s.id,
    ownerName: s.data.owner.ownerName,
    vin: v.vin,
    state: s.data.application.state,
    vehicle: [v.modelYear, v.make, v.model].filter((p) => p !== null && p !== '').join(' '),
    applicationClass: r.applicationClass,
    brandOrLienIssue: r.brandOrLienIssue,
    outstandingItemCount: r.outstandingItemCount,
    flagCount: detectFlaggedIssues(s.data).length,
    updatedAt: s.updatedAt
  };
});
