// TypeScript types mirroring the SQL schema.
// camelCase property names; empty string '' for unanswered text/enum;
// null for unanswered numeric or date fields.

export type Disease =
  | 'yellow-fever'
  | 'polio'
  | 'smallpox'
  | 'cholera'
  | 'meningococcal'
  | 'covid-19'
  | 'other'
  | '';

export type Sex = 'male' | 'female' | 'other' | 'unspecified' | '';

export type YesNoBlank = 'yes' | 'no' | '';

export type Severity = 'error' | 'warning' | 'info';

export interface VaccinationEntry {
  entryIndex: number;
  disease: Disease;
  vaccineOrProphylaxisName: string;
  manufacturer: string;
  batchNumber: string;
  route: string;
  anatomicalSite: string;
  doseAmountValue: number | null;
  doseAmountUnit: string;
  vaccinationDate: string;             // ISO date YYYY-MM-DD or ''
  vaccinationTime: string;             // HH:MM or ''
  administeringClinicianSignatureDataUrl: string;
  administeringClinicianProfessionalStatus: string;
  validityStartsOn: string;
  validityEndsOn: string;
  validityIsLifetime: YesNoBlank;
  centreStampImageDataUrl: string;
  centreStampApplied: YesNoBlank;
}

export interface Patient {
  surname: string;
  givenNames: string;
  birthDate: string;
  sex: Sex;
  nationalityAsIso31661Alpha3: string;
  travelDocumentKind: string;
  travelDocumentNumber: string;
  consentedToDataSharing: YesNoBlank;
  signatureImageDataUrl: string;
}

export interface Clinician {
  name: string;
  professionalStatus: string;
  registrationBody: string;
  registrationNumber: string;
  signatureImageDataUrl: string;
}

export interface Center {
  name: string;
  whoDesignationReference: string;
  countryAsIso31661Alpha3: string;
  uniformStampImageDataUrl: string;
}

export interface Certificate {
  patient: Patient;
  clinician: Clinician;
  center: Center;
  primaryLanguageAsBcp47: string;
  secondaryLanguageAsBcp47: string;
  destinationCountriesAsIso31661Alpha3: string;
  plannedArrivalDate: string;
  purposeOfTravel: string;
  declaredPregnancy: YesNoBlank;
  declaredBreastfeeding: YesNoBlank;
  declaredImmunosuppression: YesNoBlank;
  medicalWaiver: YesNoBlank;
  medicalWaiverReason: string;
  electronicSignatureDataUrl: string;
  entries: VaccinationEntry[];
}

export interface FiredRule {
  code: string;
  severity: Severity;
  message: string;
}

export interface PerEntryValidity {
  entryIndex: number;
  validFrom: string;
  validUntil: string | 'lifetime';
}

export interface ValidationReport {
  validityComputedAt: string;
  overallValid: boolean;
  firedRules: FiredRule[];
  perEntryValidity: PerEntryValidity[];
}

export function emptyEntry(index = 1): VaccinationEntry {
  return {
    entryIndex: index,
    disease: '',
    vaccineOrProphylaxisName: '',
    manufacturer: '',
    batchNumber: '',
    route: '',
    anatomicalSite: '',
    doseAmountValue: null,
    doseAmountUnit: '',
    vaccinationDate: '',
    vaccinationTime: '',
    administeringClinicianSignatureDataUrl: '',
    administeringClinicianProfessionalStatus: '',
    validityStartsOn: '',
    validityEndsOn: '',
    validityIsLifetime: '',
    centreStampImageDataUrl: '',
    centreStampApplied: '',
  };
}

export function emptyCertificate(): Certificate {
  return {
    patient: {
      surname: '',
      givenNames: '',
      birthDate: '',
      sex: '',
      nationalityAsIso31661Alpha3: '',
      travelDocumentKind: '',
      travelDocumentNumber: '',
      consentedToDataSharing: '',
      signatureImageDataUrl: '',
    },
    clinician: {
      name: '',
      professionalStatus: '',
      registrationBody: '',
      registrationNumber: '',
      signatureImageDataUrl: '',
    },
    center: {
      name: '',
      whoDesignationReference: '',
      countryAsIso31661Alpha3: '',
      uniformStampImageDataUrl: '',
    },
    primaryLanguageAsBcp47: 'en',
    secondaryLanguageAsBcp47: 'fr',
    destinationCountriesAsIso31661Alpha3: '',
    plannedArrivalDate: '',
    purposeOfTravel: '',
    declaredPregnancy: '',
    declaredBreastfeeding: '',
    declaredImmunosuppression: '',
    medicalWaiver: '',
    medicalWaiverReason: '',
    electronicSignatureDataUrl: '',
    entries: [emptyEntry(1)],
  };
}
