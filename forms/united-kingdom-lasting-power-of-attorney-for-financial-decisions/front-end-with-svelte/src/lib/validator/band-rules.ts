import type { Lpa, ValidityBand } from '$lib/types.js';

// Derive the validity band from signature presence and registration
// state. The band is independent of the rule-firing output and is used
// as a workflow indicator.
export function computeValidityBand(lpa: Lpa): ValidityBand {
  if (lpa.status === 'registered') return 'registered';
  if (lpa.status === 'rejected') return 'rejected';
  if (lpa.status === 'submitted') return 'submitted';

  const donorSigned = lpa.signatures.some(
    (s) => s.role === 'donor' && s.lp1fSection === 9 && !!s.signedOn,
  );
  const cpSigned = lpa.signatures.some(
    (s) =>
      s.role === 'certificate_provider' &&
      s.lp1fSection === 10 &&
      !!s.signedOn,
  );
  const allAttorneysSigned =
    lpa.attorneys.length > 0 &&
    lpa.attorneys.every((a) =>
      lpa.signatures.some(
        (s) =>
          (s.role === 'attorney' || s.role === 'replacement_attorney') &&
          s.lp1fSection === 11 &&
          s.signatoryPersonId === a.person.id &&
          !!s.signedOn,
      ),
    );

  const section15Signed = lpa.signatures.some(
    (s) => s.role === 'applicant' && s.lp1fSection === 15 && !!s.signedOn,
  );

  const feeOk =
    !!lpa.registrationApplication.paymentMethod &&
    (!lpa.registrationApplication.reducedFeeRequested ||
      lpa.registrationApplication.hasLpa120aEvidence);

  if (
    donorSigned &&
    cpSigned &&
    allAttorneysSigned &&
    section15Signed &&
    feeOk
  ) {
    return 'ready_for_registration';
  }
  if (donorSigned && cpSigned && allAttorneysSigned) {
    return 'fully_signed';
  }
  if (donorSigned) {
    return 'partially_signed';
  }

  // Field-presence threshold for "ready_for_signing": donor populated,
  // at least one attorney, decision mode picked, when-can-act picked.
  const ready =
    !!lpa.donor.firstNames.trim() &&
    !!lpa.donor.lastName.trim() &&
    !!lpa.donor.dateOfBirth &&
    lpa.attorneys.length > 0 &&
    !!lpa.decisionMode &&
    !!lpa.whenAttorneysCanAct &&
    !!lpa.certificateProvider;

  return ready ? 'ready_for_signing' : 'draft';
}
