import type { ValidityClass, VehicleApplication } from '#lib/engine/types.js';
import { validateApplication } from '#lib/engine/vra-grader.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleApplication {
  id: string;
  applicantName: string;
  data: VehicleApplication;
}

/** A row in the dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  applicantName: string;
  applicationType: string;
  registrationNumber: string;
  validityClass: ValidityClass;
  feeDueAsPence: number | null;
  missingItemCount: number;
  flagCount: number;
  updatedAt: string;
}

/** V62 replacement for a lost V5C, 25 pound cheque, signed (persona v62-lost-v5c-ready). */
function sample1(): VehicleApplication {
  return {
    application: {
      applicationType: 'v62-replacement-v5c',
      applicationDate: '2026-09-03',
      v5cStatus: 'lost',
      weeksSinceChangeOfKeeper: null,
      newKeeperSlipProvided: ''
    },
    applicant: {
      name: 'Alex Morgan',
      birthDate: '1985-04-12',
      email: 'alex@example.com',
      phone: '07700900123',
      postalAddressAsFullText: '1 High Street, Swansea',
      postcode: 'SA1 1AA',
      drivingLicenceNumber: 'MORGA854125A99XY',
      identityDocumentType: 'photocard-driving-licence',
      addressDocumentType: 'photocard-driving-licence'
    },
    keeper: {
      keeperName: 'Alex Morgan',
      keeperType: 'individual',
      companyRegistrationNumber: '',
      ownerDiffersFromKeeper: 'no',
      ownerName: '',
      keeperAddressInNorthernIreland: 'no'
    },
    vehicle: {
      registrationNumber: 'AB12 CDE',
      vehicleIdentificationNumber: 'WVWZZZ1JZXW000001',
      engineNumber: 'CBZB123456',
      make: 'Volkswagen',
      model: 'Golf',
      colour: 'Blue',
      vehicleCategory: 'car',
      fuelType: 'petrol',
      engineCapacityAsCc: 1197,
      dateOfManufacture: '2019-03-01',
      dateFirstUsed: '2019-03-15',
      seriouslyDamaged: 'no'
    },
    evidence: {
      certificateOfNewnessProvided: '',
      typeApproval: '',
      motStatus: '',
      insuranceStatus: '',
      buildEvidenceProvided: '',
      donorVehicleCount: null
    },
    importDetails: {
      countryOfExport: '',
      importDate: null,
      novaStatus: '',
      novaReference: ''
    },
    feeAndDeclaration: {
      feePaymentMethod: 'cheque',
      feePaidAsPence: 2500,
      declarationSigned: 'yes',
      declarationDate: '2026-09-03',
      applicantNote: ''
    }
  };
}

/** New vehicle first registration with no certificate of newness, no type approval, and no payment (persona v55-4-new-vehicle-missing-docs). */
function sample2(): VehicleApplication {
  return {
    application: {
      applicationType: 'v55-4-new-vehicle',
      applicationDate: '2026-09-03',
      v5cStatus: 'has-v5c',
      weeksSinceChangeOfKeeper: null,
      newKeeperSlipProvided: ''
    },
    applicant: {
      name: 'Alex Morgan',
      birthDate: '1985-04-12',
      email: 'alex@example.com',
      phone: '07700900123',
      postalAddressAsFullText: '1 High Street, Swansea',
      postcode: 'SA1 1AA',
      drivingLicenceNumber: 'MORGA854125A99XY',
      identityDocumentType: 'photocard-driving-licence',
      addressDocumentType: 'photocard-driving-licence'
    },
    keeper: {
      keeperName: 'Alex Morgan',
      keeperType: 'individual',
      companyRegistrationNumber: '',
      ownerDiffersFromKeeper: 'no',
      ownerName: '',
      keeperAddressInNorthernIreland: 'no'
    },
    vehicle: {
      registrationNumber: '',
      vehicleIdentificationNumber: 'WVWZZZ1JZXW000001',
      engineNumber: 'CBZB123456',
      make: 'Volkswagen',
      model: 'Golf',
      colour: 'Blue',
      vehicleCategory: 'car',
      fuelType: 'petrol',
      engineCapacityAsCc: 1197,
      dateOfManufacture: '2026-06-01',
      dateFirstUsed: '2026-07-01',
      seriouslyDamaged: 'no'
    },
    evidence: {
      certificateOfNewnessProvided: 'no',
      typeApproval: 'none',
      motStatus: 'not-required',
      insuranceStatus: 'in-force',
      buildEvidenceProvided: '',
      donorVehicleCount: null
    },
    importDetails: {
      countryOfExport: '',
      importDate: null,
      novaStatus: '',
      novaReference: ''
    },
    feeAndDeclaration: {
      feePaymentMethod: '',
      feePaidAsPence: null,
      declarationSigned: 'yes',
      declarationDate: '2026-09-03',
      applicantNote: ''
    }
  };
}

/** Used vehicle 7 years old, no MOT certificate, vehicle approval present, wrong fee amount (persona v55-5-used-no-mot). */
function sample3(): VehicleApplication {
  return {
    application: {
      applicationType: 'v55-5-used-vehicle',
      applicationDate: '2026-09-03',
      v5cStatus: 'has-v5c',
      weeksSinceChangeOfKeeper: null,
      newKeeperSlipProvided: ''
    },
    applicant: {
      name: 'Alex Morgan',
      birthDate: '1985-04-12',
      email: 'alex@example.com',
      phone: '07700900123',
      postalAddressAsFullText: '1 High Street, Swansea',
      postcode: 'SA1 1AA',
      drivingLicenceNumber: 'MORGA854125A99XY',
      identityDocumentType: 'passport',
      addressDocumentType: 'bank-statement'
    },
    keeper: {
      keeperName: 'Alex Morgan',
      keeperType: 'individual',
      companyRegistrationNumber: '',
      ownerDiffersFromKeeper: 'no',
      ownerName: '',
      keeperAddressInNorthernIreland: 'no'
    },
    vehicle: {
      registrationNumber: '',
      vehicleIdentificationNumber: 'WVWZZZ1JZXW000001',
      engineNumber: 'CBZB123456',
      make: 'Volkswagen',
      model: 'Golf',
      colour: 'Blue',
      vehicleCategory: 'car',
      fuelType: 'petrol',
      engineCapacityAsCc: 1197,
      dateOfManufacture: '2019-03-01',
      dateFirstUsed: '2019-03-15',
      seriouslyDamaged: 'no'
    },
    evidence: {
      certificateOfNewnessProvided: '',
      typeApproval: 'gb-type-approval',
      motStatus: 'missing',
      insuranceStatus: 'in-force',
      buildEvidenceProvided: '',
      donorVehicleCount: null
    },
    importDetails: {
      countryOfExport: '',
      importDate: null,
      novaStatus: '',
      novaReference: ''
    },
    feeAndDeclaration: {
      feePaymentMethod: 'cheque',
      feePaidAsPence: 2500,
      declarationSigned: 'yes',
      declarationDate: '2026-09-03',
      applicantNote: ''
    }
  };
}

/** Imported used vehicle not notified to HMRC through NOVA, with an IVA certificate and MOT (persona imported-vehicle-nova-missing). */
function sample4(): VehicleApplication {
  return {
    application: {
      applicationType: 'imported-vehicle',
      applicationDate: '2026-09-03',
      v5cStatus: 'has-v5c',
      weeksSinceChangeOfKeeper: null,
      newKeeperSlipProvided: ''
    },
    applicant: {
      name: 'Alex Morgan',
      birthDate: '1985-04-12',
      email: 'alex@example.com',
      phone: '07700900123',
      postalAddressAsFullText: '1 High Street, Swansea',
      postcode: 'SA1 1AA',
      drivingLicenceNumber: 'MORGA854125A99XY',
      identityDocumentType: 'photocard-driving-licence',
      addressDocumentType: 'photocard-driving-licence'
    },
    keeper: {
      keeperName: 'Alex Morgan',
      keeperType: 'individual',
      companyRegistrationNumber: '',
      ownerDiffersFromKeeper: 'no',
      ownerName: '',
      keeperAddressInNorthernIreland: 'no'
    },
    vehicle: {
      registrationNumber: '',
      vehicleIdentificationNumber: 'WVWZZZ1JZXW000001',
      engineNumber: 'CBZB123456',
      make: 'Volkswagen',
      model: 'Golf',
      colour: 'Blue',
      vehicleCategory: 'car',
      fuelType: 'petrol',
      engineCapacityAsCc: 1197,
      dateOfManufacture: '2020-02-01',
      dateFirstUsed: '2020-03-01',
      seriouslyDamaged: 'no'
    },
    evidence: {
      certificateOfNewnessProvided: '',
      typeApproval: 'iva',
      motStatus: 'valid',
      insuranceStatus: 'in-force',
      buildEvidenceProvided: '',
      donorVehicleCount: null
    },
    importDetails: {
      countryOfExport: 'Japan',
      importDate: '2026-08-20',
      novaStatus: 'not-notified',
      novaReference: ''
    },
    feeAndDeclaration: {
      feePaymentMethod: 'cheque',
      feePaidAsPence: 5500,
      declarationSigned: 'yes',
      declarationDate: '2026-09-03',
      applicantNote: ''
    }
  };
}

/** Kit vehicle with no build evidence (persona kit-vehicle-no-build-evidence). */
function sample5(): VehicleApplication {
  return {
    application: {
      applicationType: 'v627-1-rebuilt-or-kit',
      applicationDate: '2026-09-03',
      v5cStatus: 'has-v5c',
      weeksSinceChangeOfKeeper: null,
      newKeeperSlipProvided: ''
    },
    applicant: {
      name: 'Alex Morgan',
      birthDate: '1985-04-12',
      email: 'alex@example.com',
      phone: '07700900123',
      postalAddressAsFullText: '1 High Street, Swansea',
      postcode: 'SA1 1AA',
      drivingLicenceNumber: 'MORGA854125A99XY',
      identityDocumentType: 'photocard-driving-licence',
      addressDocumentType: 'photocard-driving-licence'
    },
    keeper: {
      keeperName: 'Alex Morgan',
      keeperType: 'individual',
      companyRegistrationNumber: '',
      ownerDiffersFromKeeper: 'no',
      ownerName: '',
      keeperAddressInNorthernIreland: 'no'
    },
    vehicle: {
      registrationNumber: '',
      vehicleIdentificationNumber: 'WVWZZZ1JZXW000001',
      engineNumber: 'CBZB123456',
      make: 'Caterham',
      model: 'Seven kit',
      colour: 'Blue',
      vehicleCategory: 'car',
      fuelType: 'petrol',
      engineCapacityAsCc: 1197,
      dateOfManufacture: '2025-11-01',
      dateFirstUsed: '2026-02-01',
      seriouslyDamaged: 'no'
    },
    evidence: {
      certificateOfNewnessProvided: '',
      typeApproval: 'msva',
      motStatus: 'not-required',
      insuranceStatus: 'in-force',
      buildEvidenceProvided: 'no',
      donorVehicleCount: 0
    },
    importDetails: {
      countryOfExport: '',
      importDate: null,
      novaStatus: '',
      novaReference: ''
    },
    feeAndDeclaration: {
      feePaymentMethod: 'cheque',
      feePaidAsPence: 5500,
      declarationSigned: 'yes',
      declarationDate: '2026-09-03',
      applicantNote: ''
    }
  };
}

/** V62 with a VIN containing the letter O and a malformed registration number (persona bad-vin-and-registration). */
function sample6(): VehicleApplication {
  return {
    application: {
      applicationType: 'v62-replacement-v5c',
      applicationDate: '2026-09-03',
      v5cStatus: 'destroyed',
      weeksSinceChangeOfKeeper: null,
      newKeeperSlipProvided: ''
    },
    applicant: {
      name: 'Alex Morgan',
      birthDate: '1985-04-12',
      email: 'alex@example.com',
      phone: '07700900123',
      postalAddressAsFullText: '1 High Street, Swansea',
      postcode: 'SA1 1AA',
      drivingLicenceNumber: 'MORGA854125A99XY',
      identityDocumentType: 'photocard-driving-licence',
      addressDocumentType: 'photocard-driving-licence'
    },
    keeper: {
      keeperName: 'Alex Morgan',
      keeperType: 'individual',
      companyRegistrationNumber: '',
      ownerDiffersFromKeeper: 'no',
      ownerName: '',
      keeperAddressInNorthernIreland: 'no'
    },
    vehicle: {
      registrationNumber: '12 ABCDE',
      vehicleIdentificationNumber: 'WVWZZZ1JZXWO00001',
      engineNumber: 'CBZB123456',
      make: 'Volkswagen',
      model: 'Golf',
      colour: 'Blue',
      vehicleCategory: 'car',
      fuelType: 'petrol',
      engineCapacityAsCc: 1197,
      dateOfManufacture: '2019-03-01',
      dateFirstUsed: '2019-03-15',
      seriouslyDamaged: 'no'
    },
    evidence: {
      certificateOfNewnessProvided: '',
      typeApproval: '',
      motStatus: '',
      insuranceStatus: '',
      buildEvidenceProvided: '',
      donorVehicleCount: null
    },
    importDetails: {
      countryOfExport: '',
      importDate: null,
      novaStatus: '',
      novaReference: ''
    },
    feeAndDeclaration: {
      feePaymentMethod: 'cheque',
      feePaidAsPence: 2500,
      declarationSigned: 'yes',
      declarationDate: '2026-09-03',
      applicantNote: ''
    }
  };
}

/** The sample applications, keyed by stable id (used to seed the wizard). */
export const sampleApplications: SampleApplication[] = [
  { id: 'VRA-2026-0001', applicantName: 'Ellis, Margaret', data: sample1() },
  { id: 'VRA-2026-0002', applicantName: 'Nowak, Piotr', data: sample2() },
  { id: 'VRA-2026-0003', applicantName: 'Byrne, Aoife', data: sample3() },
  { id: 'VRA-2026-0004', applicantName: 'Okafor, Chidi', data: sample4() },
  { id: 'VRA-2026-0005', applicantName: 'Silva, Marcos', data: sample5() },
  { id: 'VRA-2026-0006', applicantName: 'Doyle, Sinead', data: sample6() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleApplicationRows: DashboardRow[] = sampleApplications.map((s) => {
  const r = validateApplication(s.data);
  return {
    id: s.id,
    applicantName: s.applicantName,
    applicationType: s.data.application.applicationType,
    registrationNumber: s.data.vehicle.registrationNumber,
    validityClass: r.validityClass,
    feeDueAsPence: r.feeDueAsPence,
    missingItemCount: r.missingItemCount,
    flagCount: r.flaggedIssues.length,
    updatedAt: s.data.application.applicationDate ?? ''
  };
});
