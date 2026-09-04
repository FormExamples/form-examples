// International Certificate of Vaccination or Prophylaxis — pure validation
// engine (VAL001..VAL012). Extracted verbatim from form-app.js so it can be
// imported headless (bin/test-engines, bin/test-personas) as well as by the
// wizard. Mirrors the SvelteKit `validation-rules.ts` / `validity-dates.ts`.
//
// Deterministic rule evaluation in a fixed order; severity hierarchy
// error > warning. `overallValid` is true when no 'error' rule fires. The
// only impurity is VAL001, which compares the vaccination date with today.

/**
 * Build a fresh, fully-blank certificate in the flat shape the wizard holds
 * in `state.data` and validateCertificate() consumes: one key per form
 * field, '' for text / date / select fields, and — mirroring form-app.js's
 * checkbox handling — '' (unchecked) or 'yes' (checked) for the three
 * checkboxes. The dose amount is kept as the wizard stores it (a string
 * from the number input), so it defaults to '' rather than null.
 * `validateCertificate(emptyCertificate())` fires VAL005-VAL007
 * (manufacturer/batch, clinician status, and centre stamp all missing).
 */
function emptyCertificate() {
  return {
    // Step 1 — centre & clinician
    centreName: '', centreCountryAlpha3: '', whoDesignationReference: '', uniformStamp: '',
    clinicianName: '', clinicianProfessionalStatus: '', clinicianRegistrationBody: '',
    clinicianRegistrationNumber: '',
    // Step 2 — vaccinee identity
    patientGivenNames: '', patientSurname: '', patientBirthDate: '', patientSex: '',
    patientNationalityAlpha3: '', patientTravelDocumentKind: '', patientTravelDocumentNumber: '',
    // Step 3 — signature & consent
    patientSignature: '', consentedToDataSharing: '',
    declaredPregnancy: '', declaredBreastfeeding: '', declaredImmunosuppression: '',
    // Step 4 — travel context
    destinationCountriesAlpha3: '', plannedArrivalDate: '', purposeOfTravel: '',
    // Step 5 — disease & vaccine
    entryDisease: '', entryVaccineName: '', entryManufacturer: '', entryBatchNumber: '',
    // Step 6 — administration
    entryVaccinationDate: '', entryVaccinationTime: '', entryRoute: '', entryAnatomicalSite: '',
    entryDoseAmountValue: '', entryDoseAmountUnit: '',
    entryClinicianSignature: '', entryClinicianProfessionalStatus: '',
    // Step 7 — validity & stamp
    entryValidityStartsOn: '', entryValidityEndsOn: '', entryValidityIsLifetime: '',
    entryCentreStampApplied: '', entryCentreStampImage: '',
    // Step 8 — summary & sign-off
    medicalWaiver: '', medicalWaiverReason: '', electronicSignature: '',
  };
}

function addDays(yyyymmdd, days) {
  const d = new Date(yyyymmdd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function monthsBetween(birth, vacc) {
  const b = new Date(birth + 'T00:00:00Z');
  const v = new Date(vacc + 'T00:00:00Z');
  return (v.getUTCFullYear() - b.getUTCFullYear()) * 12 + (v.getUTCMonth() - b.getUTCMonth());
}

// Embedded validation engine — VAL001..VAL012.
function validateCertificate(data) {
  const fired = [];
  const today = new Date().toISOString().slice(0, 10);
  const vaccDate = data.entryVaccinationDate || '';
  const disease = data.entryDisease || '';
  const validityStart = data.entryValidityStartsOn || '';
  const validityEnd = data.entryValidityEndsOn || '';

  // VAL001
  if (vaccDate && vaccDate > today) {
    fired.push({ code: 'VAL001', severity: 'error', message: 'Vaccination date is in the future.' });
  }
  // VAL002
  if (vaccDate && validityStart && validityStart < vaccDate) {
    fired.push({ code: 'VAL002', severity: 'error', message: 'Validity start is before vaccination date.' });
  }
  // VAL003
  if (disease === 'yellow-fever' && vaccDate && validityStart) {
    const expected = addDays(vaccDate, 10);
    if (validityStart !== expected) {
      fired.push({ code: 'VAL003', severity: 'error', message: 'Yellow-fever validity start must be vaccination date + 10 days.' });
    }
  }
  // VAL004
  if (disease === 'yellow-fever' && !validityEnd && (data.entryValidityIsLifetime !== 'yes')) {
    fired.push({ code: 'VAL004', severity: 'warning', message: 'Yellow-fever validity end overridden to lifetime per 2016 IHR amendment.' });
  }
  // VAL005
  if (!data.entryManufacturer || !data.entryBatchNumber) {
    fired.push({ code: 'VAL005', severity: 'error', message: 'Manufacturer and batch number are required.' });
  }
  // VAL006
  if (!data.entryClinicianProfessionalStatus) {
    fired.push({ code: 'VAL006', severity: 'error', message: 'Supervising clinician signature/professional status is required.' });
  }
  // VAL007
  if (data.entryCentreStampApplied !== 'yes') {
    fired.push({ code: 'VAL007', severity: 'error', message: 'Official centre stamp is required.' });
  }
  // VAL008 / VAL009 — age window for yellow fever (9 months .. 60 years)
  if (disease === 'yellow-fever' && data.patientBirthDate && vaccDate) {
    const ageMonths = monthsBetween(data.patientBirthDate, vaccDate);
    if (ageMonths < 9) {
      fired.push({ code: 'VAL008', severity: 'warning', message: 'Vaccinee is younger than 9 months; yellow-fever vaccination is contraindicated.' });
    }
    if (ageMonths / 12 > 60) {
      fired.push({ code: 'VAL009', severity: 'warning', message: 'Vaccinee is older than 60 years; yellow-fever vaccination needs clinician review.' });
    }
  }
  // VAL010
  if (data.declaredPregnancy === 'yes' || data.declaredBreastfeeding === 'yes') {
    fired.push({ code: 'VAL010', severity: 'warning', message: 'Vaccinee declared pregnancy/breastfeeding; yellow-fever vaccination is contraindicated.' });
  }
  // VAL011
  if (data.declaredImmunosuppression === 'yes') {
    fired.push({ code: 'VAL011', severity: 'warning', message: 'Vaccinee declared immunosuppression; yellow-fever vaccination is contraindicated.' });
  }
  // VAL012 — not enforced in the static form; the printed certificate uses English by default.

  return { overallValid: fired.every((r) => r.severity !== 'error'), firedRules: fired };
}

export { emptyCertificate, addDays, monthsBetween, validateCertificate };
