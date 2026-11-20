import type { Application, FlaggedIssue } from './types';
import {
  MINIMUM_AGE,
  MINIMUM_RESIDENCE_DAYS,
  MINIMUM_WITNESSES,
  NOTICE_PERIOD_DAYS,
  certificateCopiesInvalid,
  certificateOrderIncomplete,
  ceremonyAfterNoticeExpiry,
  closelyRelated,
  earliestCeremonyDate,
  immigrationEvidenceMissing,
  jointNoticeRequired,
  latestCeremonyDate,
  missingRequired,
  needsPriorEvidence,
  nonEmpty,
  noticePeriodTooShort,
  parties,
  partyAlreadyMarried,
  partyUnder18,
  priorEvidenceMissing,
  residenceShort,
  witnessesInsufficient
} from './marriage-rules';

// Flagged-issue detection (eligibility, evidence, timing, logistics). Independent
// of the validity class (which the grader produces), this module raises
// applicant- and registrar-facing flags per spec §5:
//
//   HIGH   party under 18, already married or civil-partnered, closely related,
//          notice period too short, ceremony after the notice expires,
//          previous-relationship evidence missing, immigration referral,
//          joint notice required
//   MEDIUM residence under 7 days, identity or proof of address missing, venue
//          not confirmed, fewer than two witnesses, required fields missing
//   LOW    certificate order incomplete or invalid, no GRO index reference,
//          previous-relationship evidence check fee
//
// Rows here mirror the `united_kingdom_marriage_certificate_application_grade_flag`
// SQL table (flag_id, category, priority, description, suggested_action). NOTHING
// here is legal advice; the register office decides each notice.

export function detectFlaggedIssues(a: Application): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const yes = (v: string): boolean => v === 'yes';
  const who = (list: { label: string }[]): string =>
    list.map((x) => x.label.toLowerCase()).join(' and ');

  // ─── Party under 18 (HIGH) ──────────────────────────────────
  const under = parties(a).filter((x) => partyUnder18(x.party, a));
  if (under.length > 0) {
    flags.push({
      id: 'F-PARTY-UNDER-18-001',
      category: 'party-under-18',
      priority: 'high',
      description: `The ${who(under)} will be under ${MINIMUM_AGE} on the ceremony date. Since 27 February 2023 no one under ${MINIMUM_AGE} may marry or form a civil partnership in England and Wales, even with parental consent.`,
      suggestedAction: `Do not proceed. Notice can be given only for a ceremony on or after the date both parties are ${MINIMUM_AGE}.`
    });
  }

  // ─── Already married or in a civil partnership (HIGH) ───────
  const married = parties(a).filter((x) => partyAlreadyMarried(x.party));
  if (married.length > 0) {
    flags.push({
      id: 'F-ALREADY-MARRIED-001',
      category: 'already-married-or-civil-partnered',
      priority: 'high',
      description: `The ${who(married)} is recorded as currently married or in a civil partnership, so cannot marry or form a new civil partnership.`,
      suggestedAction:
        "Obtain a decree absolute or final order (or the former partner's death certificate) first, then update the marital status. A civil partnership may instead be converted into a marriage."
    });
  }

  // ─── Closely related (HIGH) ─────────────────────────────────
  if (closelyRelated(a)) {
    flags.push({
      id: 'F-CLOSELY-RELATED-001',
      category: 'closely-related',
      priority: 'high',
      description:
        'The parties are within the prohibited degrees of relationship, so cannot marry or form a civil partnership.',
      suggestedAction:
        'Do not proceed. Check the degrees of relationship with the register office if unsure.'
    });
  }

  // ─── Notice period too short (HIGH) ─────────────────────────
  if (noticePeriodTooShort(a)) {
    flags.push({
      id: 'F-NOTICE-PERIOD-TOO-SHORT-001',
      category: 'notice-period-too-short',
      priority: 'high',
      description: `The ceremony is planned for ${a.ceremony.ceremonyDate}, before the earliest permitted date of ${earliestCeremonyDate(a)} (notice must be given at least ${NOTICE_PERIOD_DAYS} days before the ceremony).`,
      suggestedAction:
        'Move the ceremony to the earliest permitted date or later, or give notice earlier.'
    });
  }

  // ─── Ceremony after the notice expires (HIGH) ───────────────
  if (ceremonyAfterNoticeExpiry(a)) {
    flags.push({
      id: 'F-NOTICE-EXPIRES-BEFORE-CEREMONY-001',
      category: 'notice-expires-before-ceremony',
      priority: 'high',
      description: `The ceremony is planned for ${a.ceremony.ceremonyDate}, after the notice lapses on ${latestCeremonyDate(a)}. The ceremony must take place within 12 months of giving notice.`,
      suggestedAction:
        'Bring the ceremony forward, or give notice again closer to the ceremony date.'
    });
  }

  // ─── Previous relationship not evidenced (HIGH) ─────────────
  const priorMissing = parties(a).filter((x) => priorEvidenceMissing(x.party));
  if (priorMissing.length > 0) {
    flags.push({
      id: 'F-PRIOR-RELATIONSHIP-EVIDENCE-MISSING-001',
      category: 'prior-relationship-evidence-missing',
      priority: 'high',
      description: `The ${who(priorMissing)} has a previous marriage or civil partnership with no evidence that it has ended (decree absolute, final order, annulment, or death certificate).`,
      suggestedAction:
        "Bring the original decree absolute, final order, annulment certificate or former partner's death certificate to the notice appointment."
    });
  }

  // ─── Immigration referral (HIGH) ────────────────────────────
  const immMissing = parties(a).filter((x) => immigrationEvidenceMissing(x.party));
  if (immMissing.length > 0) {
    flags.push({
      id: 'F-IMMIGRATION-REFERRAL-001',
      category: 'immigration-status-referral',
      priority: 'high',
      description: `No acceptable immigration evidence is available for the ${who(immMissing)}. Without it the notice is referred to the Home Office, which can add up to 70 days.`,
      suggestedAction:
        'Bring a valid passport with visa or endorsement, an eVisa or biometric residence permit share code, or an EU Settlement Scheme share code.'
    });
  }

  // ─── Joint notice required (HIGH) ───────────────────────────
  if (jointNoticeRequired(a) && !yes(a.notice.noticeGivenTogether)) {
    flags.push({
      id: 'F-JOINT-NOTICE-REQUIRED-001',
      category: 'joint-notice-required',
      priority: 'high',
      description:
        'A party from outside the UK and Ireland (without EU Settlement Scheme status) means both parties must give notice together at a designated register office.',
      suggestedAction:
        'Book one joint appointment at a register office in the district where at least one of you lives.'
    });
  }

  // ─── Residence under 7 days (MEDIUM) ────────────────────────
  const shortRes = parties(a).filter((x) => residenceShort(x.party));
  if (shortRes.length > 0) {
    flags.push({
      id: 'F-RESIDENCE-UNDER-7-DAYS-001',
      category: 'residence-under-7-days',
      priority: 'medium',
      description: `The ${who(shortRes)} has lived in the registration district for fewer than ${MINIMUM_RESIDENCE_DAYS} days, so cannot yet give notice there.`,
      suggestedAction: `Wait until ${MINIMUM_RESIDENCE_DAYS} days' residence is reached, then book the appointment.`
    });
  }

  // ─── Identity / proof of address (MEDIUM) ───────────────────
  const noId = parties(a).filter((x) => !yes(x.party.identityProvided));
  if (noId.length > 0) {
    flags.push({
      id: 'F-IDENTITY-MISSING-001',
      category: 'identity-missing',
      priority: 'medium',
      description: `Original photographic identity is not confirmed for the ${who(noId)}.`,
      suggestedAction:
        'Bring an original passport or other accepted photographic identity document; photocopies are not accepted.'
    });
  }
  const noAddr = parties(a).filter((x) => !yes(x.party.addressProofProvided));
  if (noAddr.length > 0) {
    flags.push({
      id: 'F-ADDRESS-PROOF-MISSING-001',
      category: 'address-proof-missing',
      priority: 'medium',
      description: `Original proof of home address is not confirmed for the ${who(noAddr)}.`,
      suggestedAction:
        'Bring an original recent bill, bank statement or similar showing the home address; give a UK contact address if living overseas.'
    });
  }

  // ─── Venue not confirmed (MEDIUM) ───────────────────────────
  if (!yes(a.ceremony.venueConfirmed)) {
    flags.push({
      id: 'F-VENUE-NOT-CONFIRMED-001',
      category: 'venue-not-confirmed',
      priority: 'medium',
      description:
        'The final ceremony venue is not confirmed. The venue details are needed when giving notice.',
      suggestedAction:
        'Confirm and book the venue, and check it is approved or registered for the ceremony type.'
    });
  }

  // ─── Witnesses (MEDIUM) ─────────────────────────────────────
  if (witnessesInsufficient(a)) {
    flags.push({
      id: 'F-WITNESSES-INSUFFICIENT-001',
      category: 'witnesses-insufficient',
      priority: 'medium',
      description: `Fewer than ${MINIMUM_WITNESSES} witnesses are arranged. Every ceremony needs at least ${MINIMUM_WITNESSES} witnesses.`,
      suggestedAction: `Arrange at least ${MINIMUM_WITNESSES} witnesses to attend and sign.`
    });
  }

  // ─── Required fields missing (MEDIUM) ───────────────────────
  const missing = missingRequired(a);
  if (missing.length > 0) {
    flags.push({
      id: 'F-REQUIRED-FIELDS-MISSING-001',
      category: 'required-fields-missing',
      priority: 'medium',
      description: `Required details are missing: ${missing.join('; ')}.`,
      suggestedAction: 'Complete the missing details before booking the notice appointment.'
    });
  }

  // ─── Certificate order (LOW) ────────────────────────────────
  if (certificateOrderIncomplete(a)) {
    flags.push({
      id: 'F-CERTIFICATE-SERVICE-MISSING-001',
      category: 'certificate-service-missing',
      priority: 'low',
      description:
        'Marriage certificate copies are requested without a GRO service (standard or priority).',
      suggestedAction:
        'Choose the standard service (about 4 days with an index reference) or the priority service (next working day if ordered by 4pm).'
    });
  }
  if (certificateCopiesInvalid(a)) {
    flags.push({
      id: 'F-CERTIFICATE-COPIES-INVALID-001',
      category: 'certificate-copies-invalid',
      priority: 'low',
      description: 'The number of certificate copies must be a whole number of at least 1.',
      suggestedAction: 'Enter the number of copies required, or leave blank to order none.'
    });
  }
  const copies = a.certificate.certificateCopies;
  if (typeof copies === 'number' && copies >= 1 && !nonEmpty(a.certificate.groIndexReference)) {
    flags.push({
      id: 'F-GRO-INDEX-REFERENCE-MISSING-001',
      category: 'gro-index-reference-missing',
      priority: 'low',
      description:
        'No GRO index reference is given, so each certificate search costs extra and takes about 15 working days.',
      suggestedAction:
        'After the ceremony, quote the GRO index reference from the register entry if available.'
    });
  }

  // ─── Evidence check fee (LOW) ───────────────────────────────
  const checked = parties(a).filter(
    (x) => needsPriorEvidence(x.party) && x.party.priorEndEvidenceProvided === 'yes'
  );
  if (checked.length > 0) {
    flags.push({
      id: 'F-PRIOR-EVIDENCE-CHECK-FEE-001',
      category: 'prior-evidence-check-fee',
      priority: 'low',
      description: `The ${who(checked)} has a previous relationship to evidence. The register office charges a fee to check these documents (more if the General Register Office must check them).`,
      suggestedAction: 'Ask the register office for the current document-checking fee when booking.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);

  return flags;
}
