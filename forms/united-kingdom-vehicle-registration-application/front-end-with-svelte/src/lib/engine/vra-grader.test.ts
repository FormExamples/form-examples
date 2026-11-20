import { describe, it, expect } from 'vitest';
import { deriveValidityClass, validateApplication } from './vra-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  feeDue,
  validRegistrationFormat,
  validVinFormat,
  yearsBetween,
  FIRST_REGISTRATION_FEE_PENCE,
  V62_FEE_PENCE
} from './vra-rules';
import type { VehicleApplication } from './types';
import personas from '../../../../examples/personas.json';

/** A blank application (mirrors the store's `createDefaultApplication`). */
function blank(): VehicleApplication {
  return {
    application: {
      applicationType: '',
      applicationDate: null,
      v5cStatus: '',
      weeksSinceChangeOfKeeper: null,
      newKeeperSlipProvided: ''
    },
    applicant: {
      name: '',
      birthDate: null,
      email: '',
      phone: '',
      postalAddressAsFullText: '',
      postcode: '',
      drivingLicenceNumber: '',
      identityDocumentType: '',
      addressDocumentType: ''
    },
    keeper: {
      keeperName: '',
      keeperType: '',
      companyRegistrationNumber: '',
      ownerDiffersFromKeeper: '',
      ownerName: '',
      keeperAddressInNorthernIreland: ''
    },
    vehicle: {
      registrationNumber: '',
      vehicleIdentificationNumber: '',
      engineNumber: '',
      make: '',
      model: '',
      colour: '',
      vehicleCategory: '',
      fuelType: '',
      engineCapacityAsCc: null,
      dateOfManufacture: null,
      dateFirstUsed: null,
      seriouslyDamaged: ''
    },
    evidence: {
      certificateOfNewnessProvided: '',
      typeApproval: '',
      motStatus: '',
      insuranceStatus: '',
      buildEvidenceProvided: '',
      donorVehicleCount: null
    },
    importDetails: { countryOfExport: '', importDate: null, novaStatus: '', novaReference: '' },
    feeAndDeclaration: {
      feePaymentMethod: '',
      feePaidAsPence: null,
      declarationSigned: '',
      declarationDate: null,
      applicantNote: ''
    }
  };
}

/** A complete V62 replacement for a lost V5C, ready to submit. */
function readyV62(): VehicleApplication {
  const d = blank();
  d.application = {
    applicationType: 'v62-replacement-v5c',
    applicationDate: '2026-09-03',
    v5cStatus: 'lost',
    weeksSinceChangeOfKeeper: null,
    newKeeperSlipProvided: ''
  };
  d.applicant = {
    ...d.applicant,
    name: 'Alex Morgan',
    birthDate: '1985-04-12',
    postalAddressAsFullText: '1 High Street, Swansea',
    postcode: 'SA1 1AA',
    identityDocumentType: 'photocard-driving-licence',
    addressDocumentType: 'photocard-driving-licence'
  };
  d.keeper = {
    ...d.keeper,
    keeperName: 'Alex Morgan',
    keeperType: 'individual',
    ownerDiffersFromKeeper: 'no'
  };
  d.vehicle = {
    ...d.vehicle,
    registrationNumber: 'AB12 CDE',
    vehicleIdentificationNumber: 'WVWZZZ1JZXW000001',
    make: 'Volkswagen',
    model: 'Golf',
    dateOfManufacture: '2019-03-01',
    seriouslyDamaged: 'no'
  };
  d.feeAndDeclaration = {
    ...d.feeAndDeclaration,
    feePaymentMethod: 'cheque',
    feePaidAsPence: 2500,
    declarationSigned: 'yes',
    declarationDate: '2026-09-03'
  };
  return d;
}

describe('fee rules', () => {
  it('charges 25 pounds for a V62 replacement and 55 pounds for a first registration', () => {
    expect(feeDue(readyV62())).toBe(V62_FEE_PENCE);
    const d = readyV62();
    d.application.applicationType = 'v55-5-used-vehicle';
    expect(feeDue(d)).toBe(FIRST_REGISTRATION_FEE_PENCE);
  });
  it('waives the fee with a new-keeper slip or a V5C chased within 6 weeks', () => {
    const slip = readyV62();
    slip.application.applicationType = 'v62-acquired-without-v5c';
    slip.application.newKeeperSlipProvided = 'yes';
    expect(feeDue(slip)).toBe(0);
    const chased = readyV62();
    chased.application.v5cStatus = 'not-received';
    chased.application.weeksSinceChangeOfKeeper = 4;
    expect(feeDue(chased)).toBe(0);
    chased.application.weeksSinceChangeOfKeeper = 9;
    expect(feeDue(chased)).toBe(V62_FEE_PENCE);
  });
  it('has no fee until the application type is chosen', () => {
    expect(feeDue(blank())).toBeNull();
  });
});

describe('format checks', () => {
  it('accepts current, prefix, suffix, and dateless registration marks', () => {
    for (const ok of ['AB12 CDE', 'A123 BCD', 'ABC 123D', 'AB 1234', '1234 AB']) {
      expect(validRegistrationFormat(ok)).toBe(true);
    }
    for (const bad of ['12 ABCDE', 'ABCD1234', '', 'AB-12-CDE']) {
      expect(validRegistrationFormat(bad)).toBe(false);
    }
  });
  it('requires a 17-character VIN without I, O, or Q from 1981', () => {
    const d = readyV62();
    expect(validVinFormat(d)).toBe(true);
    d.vehicle.vehicleIdentificationNumber = 'WVWZZZ1JZXWO00001';
    expect(validVinFormat(d)).toBe(false);
    d.vehicle.vehicleIdentificationNumber = 'ABC1234';
    expect(validVinFormat(d)).toBe(false);
    d.vehicle.dateOfManufacture = '1975-01-01';
    expect(validVinFormat(d)).toBe(true);
  });
  it('counts whole years between dates', () => {
    expect(yearsBetween('2019-03-01', '2026-02-28')).toBe(6);
    expect(yearsBetween('2019-03-01', '2026-03-01')).toBe(7);
    expect(yearsBetween(null, '2026-03-01')).toBeNull();
  });
});

describe('validity classification', () => {
  it('classifies a blank application as incomplete', () => {
    expect(deriveValidityClass(blank())).toBe('incomplete');
    expect(validateApplication(blank()).feeDueAsPence).toBeNull();
  });
  it('classifies a complete V62 as ready to submit', () => {
    const r = validateApplication(readyV62());
    expect(r.validityClass).toBe('ready-to-submit');
    expect(r.missingItemCount).toBe(0);
  });
  it('classifies a missing payment as needing supporting documents', () => {
    const d = readyV62();
    d.feeAndDeclaration.feePaymentMethod = 'none';
    expect(deriveValidityClass(d)).toBe('needs-supporting-documents');
  });
  it('lets incomplete take precedence over missing documents', () => {
    const d = readyV62();
    d.feeAndDeclaration.feePaymentMethod = 'none';
    d.feeAndDeclaration.declarationSigned = 'no';
    expect(deriveValidityClass(d)).toBe('incomplete');
  });
  it('treats a seriously damaged vehicle as incomplete', () => {
    const d = readyV62();
    d.vehicle.seriouslyDamaged = 'yes';
    expect(deriveValidityClass(d)).toBe('incomplete');
    expect(detectFlaggedIssues(d).map((f) => f.category)).toContain('seriously-damaged');
  });
  it('asks a used vehicle over 3 years old for an MOT, and 4 in Northern Ireland', () => {
    const d = readyV62();
    d.application.applicationType = 'v55-5-used-vehicle';
    d.application.v5cStatus = 'has-v5c';
    d.vehicle.registrationNumber = '';
    d.vehicle.engineNumber = 'ENG1';
    d.vehicle.dateOfManufacture = '2022-09-01'; // 4 years old at 2026-09-03
    d.evidence.typeApproval = 'gb-type-approval';
    d.evidence.motStatus = 'missing';
    d.feeAndDeclaration.feePaidAsPence = 5500;
    expect(deriveValidityClass(d)).toBe('needs-supporting-documents');
    d.keeper.keeperAddressInNorthernIreland = 'yes';
    d.evidence.insuranceStatus = 'in-force';
    expect(deriveValidityClass(d)).toBe('ready-to-submit');
  });
  it('requires NOVA for an imported vehicle', () => {
    const d = readyV62();
    d.application.applicationType = 'imported-vehicle';
    d.vehicle.engineNumber = 'ENG1';
    d.evidence.typeApproval = 'iva';
    d.evidence.motStatus = 'valid';
    d.importDetails = {
      countryOfExport: 'Japan',
      importDate: '2026-08-20',
      novaStatus: 'not-notified',
      novaReference: ''
    };
    d.feeAndDeclaration.feePaidAsPence = 5500;
    expect(deriveValidityClass(d)).toBe('needs-supporting-documents');
    expect(detectFlaggedIssues(d).map((f) => f.category)).toContain('nova-missing');
    d.importDetails.novaStatus = 'notified';
    d.importDetails.novaReference = 'NOVA-1';
    expect(deriveValidityClass(d)).toBe('ready-to-submit');
  });
});

describe('persona parity with the HTML engine', () => {
  type Persona = {
    name: string;
    state: VehicleApplication;
    expected: {
      validityClass: string;
      feeDueAsPence: number | null;
      missingItemCount: number;
      flaggedIssues: { id: string }[];
    };
  };
  for (const p of (personas as unknown as { personas: Persona[] }).personas) {
    it(`matches persona ${p.name}`, () => {
      const r = validateApplication(p.state);
      expect(r.validityClass).toBe(p.expected.validityClass);
      expect(r.feeDueAsPence).toBe(p.expected.feeDueAsPence);
      expect(r.missingItemCount).toBe(p.expected.missingItemCount);
      expect(r.flaggedIssues.map((f) => f.id)).toEqual(p.expected.flaggedIssues.map((f) => f.id));
    });
  }
});
