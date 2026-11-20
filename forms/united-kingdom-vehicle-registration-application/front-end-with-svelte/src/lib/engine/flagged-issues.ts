import type { FlaggedIssue, VehicleApplication } from './types';
import {
  feeDue,
  identityEvidenceSatisfied,
  identityRequired,
  insuranceRequired,
  motRequired,
  nonEmpty,
  typeApprovalRequired,
  validRegistrationFormat,
  validVinFormat,
  yes
} from './vra-rules';

// Flagged-issue detection (identity, entitlement, approval, fee, and format).
// Independent of the validity class (which the grader produces), this module
// raises applicant-facing flags per spec section 5:
//
//   - Seriously damaged vehicle (high)        - cannot be registered.
//   - Identity evidence missing (high)        - photocard licence, or name plus address.
//   - Type approval missing (high)            - vehicle under 10 years old.
//   - MOT missing (high)                      - used vehicle over 3 years old.
//   - Insurance missing (high)                - Northern Ireland address.
//   - NOVA missing (high)                     - imported vehicle not notified to HMRC.
//   - Fee incorrect (high)                    - none enclosed, or the wrong amount.
//   - Declaration unsigned (high)
//   - Entitlement missing (medium)            - rebuilt or kit build evidence, or no new-keeper slip.
//   - Keeper differs from owner (medium)
//   - VIN invalid, registration number invalid (medium)
//   - V5C lost, stolen, or destroyed (low)
//
// Rows here mirror the `united_kingdom_vehicle_registration_application_grade_flag`
// SQL table (flag_id, category, priority, description, suggested_action).
// NOTHING here decides the application; the flags help the applicant send a
// complete application to the DVLA.

/** Detect applicant-facing flags, computed INDEPENDENTLY of the validity class (spec section 5). */
export function detectFlaggedIssues(d: VehicleApplication): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const t = d.application.applicationType;

  // Seriously damaged (HIGH)
  if (yes(d.vehicle.seriouslyDamaged)) {
    flags.push({
      id: 'F-SERIOUSLY-DAMAGED-001',
      category: 'seriously-damaged',
      priority: 'high',
      description:
        'The vehicle is recorded as seriously damaged, meaning it cannot be repaired. The DVLA cannot register a vehicle in that state, and fees paid beforehand are not refunded.',
      suggestedAction:
        'Do not send the application until the vehicle has been repaired and can be registered.'
    });
  }

  // Identity evidence (HIGH)
  if (identityRequired(d) && !identityEvidenceSatisfied(d)) {
    flags.push({
      id: 'F-IDENTITY-EVIDENCE-MISSING-001',
      category: 'identity-evidence-missing',
      priority: 'high',
      description:
        'Proof of identity is missing. The DVLA asks for a photocopy of a photocard driving licence, or copies of one document proving your name and one proving your address.',
      suggestedAction:
        'Enclose a photocopy of your photocard driving licence, or a passport copy plus a recent utility bill or bank statement.'
    });
  }

  // Entitlement (MEDIUM)
  if (t === 'v627-1-rebuilt-or-kit' && !yes(d.evidence.buildEvidenceProvided)) {
    flags.push({
      id: 'F-ENTITLEMENT-MISSING-001',
      category: 'entitlement-missing',
      priority: 'medium',
      description:
        'A rebuilt or kit vehicle needs the build evidence (receipts, build plans) that shows the vehicle is entitled to be registered.',
      suggestedAction: 'Enclose receipts for the major components and any build plans.'
    });
  }
  if (t === 'v62-acquired-without-v5c' && !yes(d.application.newKeeperSlipProvided)) {
    flags.push({
      id: 'F-ENTITLEMENT-MISSING-002',
      category: 'entitlement-missing',
      priority: 'medium',
      description:
        'No new-keeper slip from the most recent V5C is enclosed, so the 25 pound fee applies and the DVLA may ask for proof that you acquired the vehicle.',
      suggestedAction:
        'Ask the seller for the green new-keeper slip; if you cannot, enclose proof of purchase and the fee.'
    });
  }

  // Type approval (HIGH)
  if (
    typeApprovalRequired(d) &&
    (d.evidence.typeApproval === '' || d.evidence.typeApproval === 'none')
  ) {
    flags.push({
      id: 'F-TYPE-APPROVAL-MISSING-001',
      category: 'type-approval-missing',
      priority: 'high',
      description:
        'Vehicle approval evidence (certificate of conformity, type approval, IVA, or MSVA) is missing for a vehicle under 10 years old.',
      suggestedAction:
        'Enclose the manufacturer certificate of conformity or the approval certificate for the vehicle.'
    });
  }

  // MOT (HIGH)
  if (
    motRequired(d) &&
    d.evidence.motStatus !== 'valid' &&
    d.evidence.motStatus !== 'not-required'
  ) {
    flags.push({
      id: 'F-MOT-MISSING-001',
      category: 'mot-missing',
      priority: 'high',
      description:
        'A used vehicle over 3 years old (over 4 in Northern Ireland) needs a current MOT certificate with the first-registration application.',
      suggestedAction: 'Have the vehicle tested and enclose the MOT certificate.'
    });
  }

  // Insurance (HIGH when required, LOW otherwise)
  if (insuranceRequired(d) && d.evidence.insuranceStatus !== 'in-force') {
    flags.push({
      id: 'F-INSURANCE-MISSING-001',
      category: 'insurance-missing',
      priority: 'high',
      description:
        'A Northern Ireland address needs an insurance certificate or cover note with the first-registration application.',
      suggestedAction: 'Enclose an insurance certificate or cover note naming the vehicle.'
    });
  } else if (d.evidence.insuranceStatus === 'none') {
    flags.push({
      id: 'F-INSURANCE-MISSING-002',
      category: 'insurance-missing',
      priority: 'low',
      description: 'The vehicle is not insured. It must be insured before it is used on the road.',
      suggestedAction: 'Arrange insurance before driving the vehicle.'
    });
  }

  // NOVA (HIGH)
  if (t === 'imported-vehicle' && d.importDetails.novaStatus !== 'notified') {
    flags.push({
      id: 'F-NOVA-MISSING-001',
      category: 'nova-missing',
      priority: 'high',
      description:
        'An imported vehicle must be notified to HMRC through the Notification of Vehicle Arrivals (NOVA) within 14 days of arrival; it is not recorded as notified.',
      suggestedAction:
        'Notify HMRC through NOVA and enter the reference before applying to register the vehicle.'
    });
  }

  // Fee (HIGH)
  const due = feeDue(d);
  if (due !== null && due > 0) {
    const method = d.feeAndDeclaration.feePaymentMethod;
    const paid = d.feeAndDeclaration.feePaidAsPence;
    if (method === '' || method === 'none') {
      flags.push({
        id: 'F-FEE-INCORRECT-001',
        category: 'fee-incorrect',
        priority: 'high',
        description: `A fee of £${(due / 100).toFixed(2)} is due but no payment is enclosed.`,
        suggestedAction:
          'Enclose a cheque or postal order payable to DVLA, Swansea, or pay at a Post Office branch that deals with vehicle tax. Do not send cash.'
      });
    } else if (paid !== due) {
      flags.push({
        id: 'F-FEE-INCORRECT-002',
        category: 'fee-incorrect',
        priority: 'high',
        description: `The fee due is £${(due / 100).toFixed(2)} but the amount recorded is ${paid === null ? 'blank' : '£' + (paid / 100).toFixed(2)}.`,
        suggestedAction: 'Correct the payment so it matches the fee due.'
      });
    }
  } else if (
    due === 0 &&
    d.feeAndDeclaration.feePaidAsPence !== null &&
    d.feeAndDeclaration.feePaidAsPence > 0
  ) {
    flags.push({
      id: 'F-FEE-INCORRECT-003',
      category: 'fee-incorrect',
      priority: 'low',
      description: 'No fee is due for this application, but a payment is recorded.',
      suggestedAction: 'Remove the payment, or check whether the application type is correct.'
    });
  }

  // Keeper differs from owner (MEDIUM)
  if (yes(d.keeper.ownerDiffersFromKeeper)) {
    flags.push({
      id: 'F-KEEPER-OWNER-MISMATCH-001',
      category: 'keeper-owner-mismatch',
      priority: 'medium',
      description:
        'The owner differs from the registered keeper. The keeper named on the V5C is responsible for taxing and insuring the vehicle; the V5C is not proof of ownership.',
      suggestedAction: nonEmpty(d.keeper.ownerName)
        ? 'Check that the keeper details are right and keep proof of the owner.'
        : 'Enter the owner name and check that the keeper details are right.'
    });
  }

  // V5C lost, stolen or destroyed (LOW)
  const status = d.application.v5cStatus;
  if (
    t === 'v62-replacement-v5c' &&
    (status === 'lost' || status === 'stolen' || status === 'destroyed')
  ) {
    flags.push({
      id: 'F-V5C-LOST-STOLEN-DESTROYED-001',
      category: 'v5c-lost-stolen-destroyed',
      priority: 'low',
      description: `The V5C was ${status}, so a replacement is requested with the 25 pound fee.`,
      suggestedAction:
        'Post the V62 with a cheque or postal order for 25 pounds payable to DVLA, Swansea. Do not send cash.'
    });
  }

  // VIN and registration number format (MEDIUM)
  if (nonEmpty(d.vehicle.vehicleIdentificationNumber) && !validVinFormat(d)) {
    flags.push({
      id: 'F-VIN-INVALID-001',
      category: 'vin-invalid',
      priority: 'medium',
      description:
        'The VIN is not 17 characters of letters (not I, O, Q) and digits, as ISO 3779 requires for a vehicle made from 1981.',
      suggestedAction:
        'Check the VIN against the plate on the vehicle or the V5C; a mistyped VIN delays the application.'
    });
  }
  if (
    nonEmpty(d.vehicle.registrationNumber) &&
    !validRegistrationFormat(d.vehicle.registrationNumber)
  ) {
    flags.push({
      id: 'F-REGISTRATION-NUMBER-INVALID-001',
      category: 'registration-number-invalid',
      priority: 'medium',
      description:
        'The registration number does not match a Great Britain or Northern Ireland format.',
      suggestedAction: 'Check the registration number on the number plate or the V5C.'
    });
  }

  // Declaration (HIGH)
  if (!yes(d.feeAndDeclaration.declarationSigned)) {
    flags.push({
      id: 'F-DECLARATION-UNSIGNED-001',
      category: 'declaration-unsigned',
      priority: 'high',
      description:
        'The declaration is not signed, and the DVLA will return an unsigned application.',
      suggestedAction: 'Sign and date the declaration before posting the application.'
    });
  }

  return flags;
}
