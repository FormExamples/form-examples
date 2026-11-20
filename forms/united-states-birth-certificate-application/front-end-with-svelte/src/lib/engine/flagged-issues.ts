import type { BirthCertificateApplication, FlaggedIssue, Priority } from './types';
import {
  ruleFor,
  hasStateRule,
  stateCode,
  validStateShape,
  ineligibleRequester,
  underageSelf,
  missingRegistrantData,
  missingId,
  missingProof,
  missingAuthority,
  missingNotarization,
  certificateTypeUnacceptable,
  expectedFee,
  feeShortfall,
  missingApostilleCountry,
  missingDeclaration
} from './birth-rules';
import { relationshipLabel, certificateTypeLabel } from './utils';

// Flagged-issue detection. Independent of the application class (which the
// grader produces), this module raises applicant-facing flags per spec §5, in
// stable priority order (high, then medium, then low; insertion order within a
// tier):
//
//   high    ineligible requester, underage self-requester, missing
//           registrant / order data, missing or expired photo ID, missing proof
//           of relationship, missing authority document, missing notarized
//           sworn statement, certificate type unacceptable for the purpose,
//           unsigned declaration
//   medium  fee shortfall, missing apostille destination, apostille process,
//           adopted registrant, deceased registrant
//   low     verify-state-rule (unknown state or unverified fee), New York City
//
// Rows mirror the `*_grade_flag` SQL table. NOTHING here is legal advice or
// guarantees acceptance; the issuing agency decides.

const ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function detectFlaggedIssues(d: BirthCertificateApplication): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const rule = ruleFor(d);
  const rel = d.purpose.relationship;
  const add = (
    id: string,
    category: string,
    priority: Priority,
    description: string,
    suggestedAction: string
  ) => flags.push({ id, category, priority, description, suggestedAction });

  if (ineligibleRequester(d) && !underageSelf(d)) {
    add(
      'F-BIRTH-INELIGIBLE-001',
      'ineligible-requester',
      'high',
      `${rule.name} restricts certified copies, and a ${relationshipLabel(rel).toLowerCase()} is not on its list of eligible requesters.`,
      rule.informationalAvailable
        ? 'Request an informational copy instead, or ask an eligible person (or a court order holder) to apply.'
        : 'Ask an eligible person (the person named, a parent named on the record, a guardian, or a legal representative) to apply, or obtain a court order.'
    );
  }
  if (underageSelf(d)) {
    add(
      'F-BIRTH-UNDERAGE-001',
      'requester-underage',
      'high',
      `${rule.name} does not issue a certified copy to a registrant under age ${rule.minSelfAge} ordering their own record.`,
      'Have a parent named on the certificate, or a legal guardian, make the request.'
    );
  }
  if (missingRegistrantData(d)) {
    add(
      'F-BIRTH-DATA-001',
      'missing-registrant-data',
      'high',
      "The request lacks identifiers needed to locate the record (full name, valid date of birth, place and state of birth, mother's name before first marriage) or the order details (relationship, purpose, copy type, copies, delivery).",
      'Complete every identifying and order field; a record cannot be searched without them.'
    );
  }
  if (missingId(d)) {
    add(
      'F-BIRTH-ID-001',
      'missing-id',
      'high',
      'Certified copies require a current, unexpired government-issued photo ID; none is stated as valid.',
      'Attach a copy of an unexpired photo ID, or ask the office which alternative documents it accepts.'
    );
  }
  if (missingProof(d)) {
    add(
      'F-BIRTH-PROOF-001',
      'missing-proof',
      'high',
      'The request does not include proof of the relationship to the person named (for example a marriage certificate, your own birth certificate, or a death certificate for a deceased registrant).',
      'Enclose documents that link you to the person named on the certificate.'
    );
  }
  if (missingAuthority(d)) {
    add(
      'F-BIRTH-AUTHORITY-001',
      'missing-authority',
      'high',
      'A guardian, legal representative, or agency request needs the authorizing document (court order or letters of guardianship, attorney engagement letter, or official agency request).',
      'Enclose the authorizing document with the application.'
    );
  }
  if (missingNotarization(d)) {
    add(
      'F-BIRTH-NOTARY-001',
      'missing-notarization',
      'high',
      `${rule.name} requires a notarized sworn statement of identity with a mailed application for a certified copy.`,
      'Sign the sworn statement before a notary public and enclose it.'
    );
  }
  if (certificateTypeUnacceptable(d)) {
    add(
      'F-BIRTH-TYPE-001',
      'certificate-type-unacceptable',
      'high',
      `The ${certificateTypeLabel(d.order.certificateType).toLowerCase()} you chose cannot serve this purpose: passports, foreign use and apostilles need the certified long form (a full copy with the registrar's signature and seal); informational copies are never valid for identity.`,
      'Order the certified long form.'
    );
  }
  if (missingDeclaration(d)) {
    add(
      'F-BIRTH-DECLARATION-001',
      'missing-declaration',
      'high',
      'The declaration under penalty of perjury has not been signed.',
      'Sign and date the declaration before submitting.'
    );
  }

  if (feeShortfall(d)) {
    const fee = expectedFee(d);
    add(
      'F-BIRTH-FEE-001',
      'fee-shortfall',
      'medium',
      `The fee enclosed is missing or below the expected total of $${(fee ?? 0).toFixed(2)} for ${d.order.copies} ${d.order.copies === 1 ? 'copy' : 'copies'} in ${rule.name}.`,
      'Enclose the full fee in the form of payment the office accepts.'
    );
  }
  if (missingApostilleCountry(d)) {
    add(
      'F-BIRTH-APOSTILLE-001',
      'apostille',
      'medium',
      'An apostille is wanted but no destination country is named.',
      'Name the destination country; a Hague Apostille Convention member accepts an apostille, otherwise embassy legalization is needed.'
    );
  } else if (d.purpose.needsApostille === 'yes') {
    add(
      'F-BIRTH-APOSTILLE-002',
      'apostille',
      'medium',
      'An apostille is issued by the state Secretary of State (or equivalent), not by the vital records office, and only on a recent certified long-form copy.',
      'Order the certified copy first, then submit it to the Secretary of State for the apostille; check whether the destination country is a Hague Apostille Convention member.'
    );
  }
  if (d.registrant.adopted === 'yes') {
    add(
      'F-BIRTH-ADOPTED-001',
      'adopted-registrant',
      'medium',
      'For an adopted registrant the original record is typically sealed and an amended certificate is issued; the office may need the adoption decree.',
      'Request the amended certificate and attach the adoption decree if the office asks for it.'
    );
  }
  if (d.registrant.deceased === 'yes') {
    add(
      'F-BIRTH-DECEASED-001',
      'deceased-registrant',
      'medium',
      "The person named is deceased; offices usually require proof of death and of the requester's relationship before issuing a certified copy.",
      'Enclose a death certificate and proof of relationship.'
    );
  }

  if (!hasStateRule(d) || !rule.feeVerified) {
    add(
      'F-BIRTH-STATE-001',
      'state-rule-unverified',
      'low',
      hasStateRule(d)
        ? `The ${rule.name} fee in this tool is not confirmed against the current official schedule.`
        : `No verified rule is held for ${validStateShape(d) ? stateCode(d) : 'the state entered'}; the uniform default rule was applied.`,
      'Verify eligibility, fees, and accepted ID with the issuing office (CDC/NCHS Where to Write for Vital Records) before sending.'
    );
  }
  if (stateCode(d) === 'NY') {
    add(
      'F-BIRTH-NYC-001',
      'state-rule-unverified',
      'low',
      'Births in New York City are issued by the NYC Department of Health and Mental Hygiene, not the State Department of Health.',
      'If the birth was in one of the five boroughs, apply to the NYC Health Department instead.'
    );
  }

  return flags.sort((a, b) => ORDER[a.priority] - ORDER[b.priority]);
}
