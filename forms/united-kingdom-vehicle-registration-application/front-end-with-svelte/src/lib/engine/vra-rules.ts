// United Kingdom Vehicle Registration Application rules.
//
// This form is a COMPLETENESS AND VALIDITY instrument, not a scored assessment.
// This module holds the primitive predicates and the finding builder that the
// grader (`vra-grader.ts`) and the flag detector (`flagged-issues.ts`) compose
// (spec section 4). Nothing here decides that a vehicle will be registered; it
// encodes what the DVLA and GOV.UK ask an applicant to send.

import type { RuleFinding, VehicleApplication } from './types';

/** V62 replacement V5C fee, in pence. */
export const V62_FEE_PENCE = 2500;
/** First-registration fee (V55/4, V55/5, imports, V627/1), in pence. */
export const FIRST_REGISTRATION_FEE_PENCE = 5500;
/** Weeks within which a missing V5C should be chased without a fee. */
export const NOT_RECEIVED_WINDOW_WEEKS = 6;

export const V62_TYPES = ['v62-replacement-v5c', 'v62-acquired-without-v5c'];
export const FIRST_REGISTRATION_TYPES = [
  'v55-4-new-vehicle',
  'v55-5-used-vehicle',
  'imported-vehicle',
  'v627-1-rebuilt-or-kit'
];

export const nonEmpty = (s: unknown): boolean => typeof s === 'string' && s.trim() !== '';
export const yes = (v: string): boolean => v === 'yes';

export function isV62(d: VehicleApplication): boolean {
  return V62_TYPES.includes(d.application.applicationType);
}

export function isFirstRegistration(d: VehicleApplication): boolean {
  return FIRST_REGISTRATION_TYPES.includes(d.application.applicationType);
}

/**
 * The fee the DVLA requires, in pence; null when the application type is not
 * yet chosen. V62 replacement: 25 pounds, except a V5C not received within 6
 * weeks of a change of keeper. V62 for a vehicle acquired without a V5C: free
 * with the new-keeper slip, else 25 pounds. First registration, import, rebuilt
 * or kit: 55 pounds.
 */
export function feeDue(d: VehicleApplication): number | null {
  const t = d.application.applicationType;
  if (t === '') return null;
  if (t === 'v62-replacement-v5c') {
    if (d.application.v5cStatus === 'not-received') {
      const w = d.application.weeksSinceChangeOfKeeper;
      return w !== null && w !== undefined && w <= NOT_RECEIVED_WINDOW_WEEKS ? 0 : V62_FEE_PENCE;
    }
    return V62_FEE_PENCE;
  }
  if (t === 'v62-acquired-without-v5c') {
    return yes(d.application.newKeeperSlipProvided) ? 0 : V62_FEE_PENCE;
  }
  return FIRST_REGISTRATION_FEE_PENCE;
}

/** Normalise a registration mark: upper-case, spaces removed. */
export function normaliseRegistration(text: string): string {
  return String(text || '')
    .toUpperCase()
    .replace(/\s+/g, '');
}

const REGISTRATION_FORMATS: RegExp[] = [
  /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/, // current, 2001 onward: AB12 CDE
  /^[A-Z][0-9]{1,3}[A-Z]{3}$/, // prefix, 1983 to 2001: A123 BCD
  /^[A-Z]{3}[0-9]{1,3}[A-Z]$/, // suffix, 1963 to 1983: ABC 123D
  /^[A-Z]{1,3}[0-9]{1,4}$/, // dateless: AB 1234
  /^[0-9]{1,4}[A-Z]{1,3}$/ // dateless: 1234 AB
];

/** True when the text has the shape of a GB or NI registration mark (format only). */
export function validRegistrationFormat(text: string): boolean {
  const n = normaliseRegistration(text);
  return REGISTRATION_FORMATS.some((re) => re.test(n));
}

function parseIso(iso: string | null): { y: number; m: number; d: number } | null {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

/** Whole years from `from` to `to` (both ISO dates); null if either is unset. */
export function yearsBetween(from: string | null, to: string | null): number | null {
  const a = parseIso(from);
  const b = parseIso(to);
  if (!a || !b) return null;
  let years = b.y - a.y;
  if (b.m < a.m || (b.m === a.m && b.d < a.d)) years -= 1;
  return years;
}

/**
 * True when the VIN has an acceptable shape: 17 characters from the ISO 3779
 * alphabet (letters except I, O, Q, and digits). A vehicle manufactured before
 * 1981 may carry a shorter chassis number (5 to 17 letters and digits).
 */
export function validVinFormat(d: VehicleApplication): boolean {
  const vin = String(d.vehicle.vehicleIdentificationNumber || '')
    .toUpperCase()
    .replace(/\s+/g, '');
  if (/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return true;
  const made = d.vehicle.dateOfManufacture;
  if (made && made < '1981-01-01') return /^[A-Z0-9]{5,17}$/.test(vin);
  return false;
}

/** Vehicle age in whole years at the application date, from manufacture (else first use). */
export function vehicleAgeYears(d: VehicleApplication): number | null {
  const from = d.vehicle.dateOfManufacture || d.vehicle.dateFirstUsed;
  return yearsBetween(from, d.application.applicationDate);
}

/** Identity evidence: a photocard licence alone, or a name document plus a proof of address. */
export function identityEvidenceSatisfied(d: VehicleApplication): boolean {
  const id = d.applicant.identityDocumentType;
  const addr = d.applicant.addressDocumentType;
  if (id === 'photocard-driving-licence') return true;
  const hasAddr = addr !== '' && addr !== 'none';
  return (id === 'passport' || id === 'other-name-document') && hasAddr;
}

/** Identity evidence is requested for first registrations and a V62 for a vehicle acquired without a V5C. */
export function identityRequired(d: VehicleApplication): boolean {
  return isFirstRegistration(d) || d.application.applicationType === 'v62-acquired-without-v5c';
}

/** Type-approval evidence is requested for a vehicle under 10 years old, unless exempt. */
export function typeApprovalRequired(d: VehicleApplication): boolean {
  if (!isFirstRegistration(d)) return false;
  const age = vehicleAgeYears(d);
  if (age === null) return true;
  return age < 10;
}

/** MOT evidence is requested for a used vehicle over 3 years old (4 in Northern Ireland). */
export function motRequired(d: VehicleApplication): boolean {
  const t = d.application.applicationType;
  if (t === 'v55-4-new-vehicle' || !isFirstRegistration(d)) return false;
  const age = vehicleAgeYears(d);
  if (age === null) return false;
  const threshold = yes(d.keeper.keeperAddressInNorthernIreland) ? 4 : 3;
  return age > threshold;
}

/** Insurance evidence is requested when a first registration is to a Northern Ireland address. */
export function insuranceRequired(d: VehicleApplication): boolean {
  return isFirstRegistration(d) && yes(d.keeper.keeperAddressInNorthernIreland);
}

/**
 * Evaluate the application: every missing data item (which makes it
 * `incomplete`) and every missing document or payment (which makes it
 * `needs-supporting-documents`).
 */
export function evaluate(d: VehicleApplication): { data: RuleFinding[]; documents: RuleFinding[] } {
  const data: RuleFinding[] = [];
  const documents: RuleFinding[] = [];
  const t = d.application.applicationType;
  const addData = (ruleId: string, dimension: string, category: string, description: string) =>
    data.push({ ruleId, dimension, category, description });
  const addDoc = (ruleId: string, dimension: string, category: string, description: string) =>
    documents.push({ ruleId, dimension, category, description });

  // Classification
  if (t === '')
    addData(
      'R-MISSING-TYPE-01',
      'classification',
      'required-field',
      'The application type (V62, V55/4, V55/5, import, V627/1) is not chosen.'
    );
  if (!d.application.applicationDate)
    addData(
      'R-MISSING-DATE-01',
      'classification',
      'required-field',
      'The application date is missing.'
    );
  if (
    t === 'v62-replacement-v5c' &&
    (d.application.v5cStatus === '' ||
      d.application.v5cStatus === 'never-had' ||
      d.application.v5cStatus === 'has-v5c')
  ) {
    addData(
      'R-MISSING-V5C-STATUS-01',
      'classification',
      'required-field',
      'A V62 replacement needs the reason: lost, stolen, destroyed, not received, or damaged.'
    );
  }
  if (yes(d.vehicle.seriouslyDamaged))
    addData(
      'R-SERIOUSLY-DAMAGED-01',
      'vehicle',
      'blocking',
      'A seriously damaged vehicle that cannot be repaired cannot be registered.'
    );

  // Applicant
  if (!nonEmpty(d.applicant.name))
    addData(
      'R-MISSING-APPLICANT-NAME-01',
      'applicant',
      'required-field',
      'The applicant name is missing.'
    );
  if (!d.applicant.birthDate)
    addData(
      'R-MISSING-APPLICANT-DOB-01',
      'applicant',
      'required-field',
      'The applicant date of birth is missing.'
    );
  if (!nonEmpty(d.applicant.postalAddressAsFullText) || !nonEmpty(d.applicant.postcode)) {
    addData(
      'R-MISSING-APPLICANT-ADDRESS-01',
      'applicant',
      'required-field',
      'The applicant address or postcode is missing.'
    );
  }

  // Keeper
  if (!nonEmpty(d.keeper.keeperName))
    addData(
      'R-MISSING-KEEPER-NAME-01',
      'keeper',
      'required-field',
      'The registered keeper name is missing.'
    );
  if (d.keeper.keeperType === '')
    addData(
      'R-MISSING-KEEPER-TYPE-01',
      'keeper',
      'required-field',
      'The keeper type (individual, company, organization, trade) is missing.'
    );
  if (d.keeper.keeperType === 'company' && !nonEmpty(d.keeper.companyRegistrationNumber)) {
    addData(
      'R-MISSING-COMPANY-NUMBER-01',
      'keeper',
      'required-field',
      'A company keeper needs a Companies House registration number.'
    );
  }
  if (yes(d.keeper.ownerDiffersFromKeeper) && !nonEmpty(d.keeper.ownerName)) {
    addData(
      'R-MISSING-OWNER-NAME-01',
      'keeper',
      'required-field',
      'The owner differs from the keeper but the owner name is missing.'
    );
  }

  // Vehicle
  if (isV62(d) && !nonEmpty(d.vehicle.registrationNumber)) {
    addData(
      'R-MISSING-REGISTRATION-01',
      'vehicle',
      'required-field',
      'A V62 needs the vehicle registration number.'
    );
  }
  if (
    nonEmpty(d.vehicle.registrationNumber) &&
    !validRegistrationFormat(d.vehicle.registrationNumber)
  ) {
    addData(
      'R-REGISTRATION-FORMAT-01',
      'vehicle',
      'format',
      'The registration number does not match a known Great Britain or Northern Ireland format.'
    );
  }
  if (!nonEmpty(d.vehicle.make))
    addData('R-MISSING-MAKE-01', 'vehicle', 'required-field', 'The vehicle make is missing.');
  if (!nonEmpty(d.vehicle.model))
    addData('R-MISSING-MODEL-01', 'vehicle', 'required-field', 'The vehicle model is missing.');
  if (isFirstRegistration(d) || nonEmpty(d.vehicle.vehicleIdentificationNumber)) {
    if (!nonEmpty(d.vehicle.vehicleIdentificationNumber)) {
      addData(
        'R-MISSING-VIN-01',
        'vehicle',
        'required-field',
        'The vehicle identification number (VIN) is missing.'
      );
    } else if (!validVinFormat(d)) {
      addData(
        'R-VIN-FORMAT-01',
        'vehicle',
        'format',
        'The VIN is not 17 characters of letters (not I, O, Q) and digits, as ISO 3779 requires for a vehicle made from 1981.'
      );
    }
  }
  if (isFirstRegistration(d)) {
    if (!nonEmpty(d.vehicle.engineNumber))
      addData(
        'R-MISSING-ENGINE-NUMBER-01',
        'vehicle',
        'required-field',
        'The engine number is missing.'
      );
    if (!d.vehicle.dateOfManufacture && !d.vehicle.dateFirstUsed) {
      addData(
        'R-MISSING-VEHICLE-DATE-01',
        'vehicle',
        'required-field',
        'A first registration needs the date of manufacture or the date first used.'
      );
    }
  }

  // Import details
  if (t === 'imported-vehicle') {
    if (!nonEmpty(d.importDetails.countryOfExport))
      addData(
        'R-MISSING-EXPORT-COUNTRY-01',
        'import',
        'required-field',
        'The country of export is missing.'
      );
    if (!d.importDetails.importDate)
      addData(
        'R-MISSING-IMPORT-DATE-01',
        'import',
        'required-field',
        'The date the vehicle arrived in Great Britain is missing.'
      );
  }

  // Declaration
  if (!yes(d.feeAndDeclaration.declarationSigned))
    addData(
      'R-DECLARATION-UNSIGNED-01',
      'classification',
      'declaration',
      'The declaration is not signed.'
    );

  // Documents: identity
  if (identityRequired(d) && !identityEvidenceSatisfied(d)) {
    addDoc(
      'R-IDENTITY-EVIDENCE-01',
      'documents',
      'evidence',
      'Send a photocopy of a photocard driving licence, or copies of one document proving the name and one proving the address.'
    );
  }
  // Documents: certificate of newness
  if (t === 'v55-4-new-vehicle' && !yes(d.evidence.certificateOfNewnessProvided)) {
    addDoc(
      'R-NEWNESS-01',
      'documents',
      'evidence',
      'A new vehicle needs a certificate of newness (or a declaration of newness for an import).'
    );
  }
  // Documents: type approval
  if (
    typeApprovalRequired(d) &&
    (d.evidence.typeApproval === '' || d.evidence.typeApproval === 'none')
  ) {
    addDoc(
      'R-TYPE-APPROVAL-01',
      'documents',
      'evidence',
      'Vehicle approval evidence is needed for a vehicle under 10 years old, unless exempt.'
    );
  }
  // Documents: MOT
  if (
    motRequired(d) &&
    d.evidence.motStatus !== 'valid' &&
    d.evidence.motStatus !== 'not-required'
  ) {
    addDoc(
      'R-MOT-01',
      'documents',
      'evidence',
      'A valid MOT certificate is needed for a used vehicle over 3 years old (over 4 in Northern Ireland).'
    );
  }
  // Documents: insurance (Northern Ireland address)
  if (insuranceRequired(d) && d.evidence.insuranceStatus !== 'in-force') {
    addDoc(
      'R-INSURANCE-01',
      'documents',
      'evidence',
      'An insurance certificate or cover note is needed when registering to a Northern Ireland address.'
    );
  }
  // Documents: build evidence
  if (t === 'v627-1-rebuilt-or-kit' && !yes(d.evidence.buildEvidenceProvided)) {
    addDoc(
      'R-BUILD-EVIDENCE-01',
      'documents',
      'evidence',
      'A rebuilt or kit vehicle needs receipts and build evidence (for example build plans).'
    );
  }
  // Documents: NOVA
  if (t === 'imported-vehicle') {
    if (d.importDetails.novaStatus !== 'notified') {
      addDoc(
        'R-NOVA-01',
        'import',
        'evidence',
        'HMRC must be told of the vehicle arrival (NOVA) within 14 days; the vehicle is not recorded as notified.'
      );
    } else if (!nonEmpty(d.importDetails.novaReference)) {
      addDoc(
        'R-NOVA-REFERENCE-01',
        'import',
        'evidence',
        'The NOVA reference given by HMRC is missing.'
      );
    }
  }

  // Fee
  const due = feeDue(d);
  if (due !== null && due > 0) {
    const method = d.feeAndDeclaration.feePaymentMethod;
    if (method === '' || method === 'none') {
      addDoc(
        'R-FEE-MISSING-01',
        'fee',
        'fee',
        `A fee of £${(due / 100).toFixed(2)} is due but no payment is enclosed.`
      );
    } else if (d.feeAndDeclaration.feePaidAsPence !== due) {
      addDoc(
        'R-FEE-AMOUNT-01',
        'fee',
        'fee',
        `The fee due is £${(due / 100).toFixed(2)} but the amount recorded is different.`
      );
    }
  }

  return { data, documents };
}
