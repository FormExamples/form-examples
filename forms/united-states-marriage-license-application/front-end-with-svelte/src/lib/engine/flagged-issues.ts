import type { FlaggedIssue, MarriageApplication, Priority } from './types';
import {
  bloodTestMissing,
  ceremonyBeforeIssue,
  certificateReturnProblem,
  currentlyMarried,
  earliestCeremonyDate,
  idNotPresented,
  licenseExpired,
  licenseExpiryDate,
  minorConsentMissing,
  minors,
  missingRequired,
  notAppearing,
  officiantProblem,
  parseDate,
  priorMarriageUndocumented,
  prohibitedRelationship,
  proxyNotPermitted,
  ruleFor,
  sameSexCouple,
  stateRuleKnown,
  waitingDays,
  waitingNotElapsed,
  witnessShortfall,
  witnessesRequired
} from './rules';

// Flagged-issue detection (eligibility, timing, ceremony, and certificate).
// Independent of the class (which the grader produces), this module raises
// applicant- and clerk-facing flags per spec section 5. Rows mirror the
// `united_states_marriage_license_application_grade_flag` SQL table (flag_id,
// category, priority, description, suggested_action). NOTHING here is legal
// advice or decides that a license issues; the issuing county clerk (or a
// court) decides.
//
//   HIGH    underage, existing marriage, prohibited relationship, proxy not
//           permitted, minor consent missing, prior marriage undocumented,
//           ceremony inside the waiting period, expired license, ceremony
//           before issuance, witness shortfall, unauthorized officiant
//   MEDIUM  missing data, ID not presented, not appearing in person, officiant
//           details missing, certificate return overdue or late, unlisted
//           state, blood test missing
//   LOW     waiting-period information, fee not recorded, same-sex notice
//           (no bar), Social Security number status

/**
 * @param {MarriageApplication} d
 * @returns {FlaggedIssue[]}
 */
export function detectFlaggedIssues(d: MarriageApplication): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const rule = ruleFor(d);
  const push = (
    id: string,
    category: string,
    priority: Priority,
    description: string,
    suggestedAction: string
  ) => flags.push({ id, category, priority, description, suggestedAction });

  // ─── Underage with no permitted path (HIGH) ─────────────────
  const barred = minors(d).filter((m) => m.barredReason !== '');
  if (barred.length > 0) {
    push(
      'F-USMLA-001',
      'underage',
      'high',
      `${barred.map((m) => `${m.who} is ${m.age}: ${m.barredReason}`).join('; ')}.`,
      'The clerk cannot issue this license. Wait until every applicant reaches the state minimum age, or confirm the state rule with the county clerk.'
    );
  }

  // ─── Minor consent missing (HIGH) ───────────────────────────
  if (minorConsentMissing(d)) {
    const path = d.eligibility.minorConsent;
    push(
      'F-USMLA-002',
      'minor-consent',
      'high',
      `An applicant is under ${rule.minAge}. ${rule.name} allows this only with ${rule.minorPath === 'court' ? 'a court order' : 'parental or guardian consent (or a court order)'}, and that is not recorded${path ? ` (recorded: ${path})` : ''}.`,
      'Obtain the required court order or consent, and bring it and proof of age to the clerk.'
    );
  }

  // ─── Existing marriage (HIGH) ───────────────────────────────
  if (currentlyMarried(d)) {
    push(
      'F-USMLA-003',
      'existing-marriage',
      'high',
      'An applicant is recorded as currently married. A marriage to a second living spouse is void; every prior marriage must have ended by divorce, death, or annulment first.',
      'Finish the divorce or annulment before applying, then record the end date and bring the decree or death certificate if the clerk asks.'
    );
  }

  // ─── Prohibited relationship (HIGH) ─────────────────────────
  if (prohibitedRelationship(d)) {
    push(
      'F-USMLA-004',
      'prohibited-relationship',
      'high',
      'The applicants are related within a degree of kinship the state prohibits, so the marriage would be void.',
      'Do not proceed. Confirm the state prohibited-degrees rule with the county clerk or an attorney.'
    );
  }

  // ─── Proxy not permitted (HIGH) ─────────────────────────────
  if (proxyNotPermitted(d)) {
    push(
      'F-USMLA-005',
      'proxy-not-permitted',
      'high',
      rule.proxy === 'none'
        ? `A proxy marriage is requested, but ${rule.name} does not allow marriage by proxy.`
        : `A proxy marriage is requested, but ${rule.name} allows it only for a service member on active duty who cannot attend, and active-duty service is not recorded.`,
      'Both applicants should appear in person or by an arrangement the clerk accepts; ask the county clerk before relying on a proxy.'
    );
  }

  // ─── Missing required data (MEDIUM) ─────────────────────────
  const missing = missingRequired(d);
  if (missing.length > 0) {
    push(
      'F-USMLA-006',
      'missing-required-data',
      'medium',
      `Required application details are missing: ${missing.join(', ')}.`,
      'Complete every required field before applying to the clerk.'
    );
  }

  // ─── Prior marriage undocumented (HIGH) ─────────────────────
  const undocumented = priorMarriageUndocumented(d);
  if (undocumented.length > 0) {
    push(
      'F-USMLA-007',
      'prior-marriage-undocumented',
      'high',
      `${undocumented.join('; ')}.`,
      'Record when the prior marriage ended, and bring the divorce decree, annulment, or death certificate if the clerk asks for it.'
    );
  }

  // ─── ID not presented (MEDIUM) ──────────────────────────────
  const noId = idNotPresented(d);
  if (noId.length > 0) {
    push(
      'F-USMLA-008',
      'identification',
      'medium',
      `${noId.join(' and ')} has not presented acceptable government photo identification.`,
      'Bring a current government photo ID (driver license, state ID, or passport) and proof of age for each applicant.'
    );
  }

  // ─── Not appearing in person (MEDIUM) ───────────────────────
  if (notAppearing(d)) {
    push(
      'F-USMLA-009',
      'in-person-appearance',
      'medium',
      'Both applicants are not appearing in person and no proxy marriage is requested. Most clerks require both applicants at the counter; a few allow a remote or video appearance.',
      'Ask the county clerk whether a remote appearance is available, or arrange for both applicants to attend.'
    );
  }

  // ─── Waiting period not elapsed (HIGH) ──────────────────────
  if (waitingNotElapsed(d)) {
    push(
      'F-USMLA-010',
      'waiting-period',
      'high',
      `The ceremony is set inside ${rule.name}'s ${rule.waitingHours}-hour waiting period after the license issues (earliest permitted ceremony: ${earliestCeremonyDate(d)}).`,
      `Move the ceremony to ${earliestCeremonyDate(d)} or later, or ask whether a waiver (course, court order) applies.`
    );
  }

  // ─── License expired (HIGH) ─────────────────────────────────
  if (licenseExpired(d)) {
    push(
      'F-USMLA-011',
      'license-expired',
      'high',
      `The ceremony is set after the license expired (${rule.name} licenses are valid ${rule.validDays} days; last valid day ${licenseExpiryDate(d)}).`,
      'Apply for a new license and pay the fee again; do not hold the ceremony on an expired license.'
    );
  }

  // ─── Ceremony before issuance (HIGH) ────────────────────────
  if (ceremonyBeforeIssue(d)) {
    push(
      'F-USMLA-012',
      'ceremony-timing',
      'high',
      'The ceremony date is before the license was issued. A ceremony without a valid license does not create a licensed marriage.',
      'Check the dates. Hold the ceremony only after the license has issued and the waiting period has passed.'
    );
  }

  // ─── Witness shortfall (HIGH) ───────────────────────────────
  if (witnessShortfall(d)) {
    const have = d.ceremony.witnessCount === null ? 0 : d.ceremony.witnessCount;
    push(
      'F-USMLA-013',
      'witnesses',
      'high',
      `${rule.name} requires ${witnessesRequired(d)} witness${witnessesRequired(d) === 1 ? '' : 'es'} at the ceremony; ${have} recorded.`,
      'Have the required number of adult witnesses sign the license at the ceremony.'
    );
  }

  // ─── Officiant (HIGH / MEDIUM) ──────────────────────────────
  const officiant = officiantProblem(d);
  if (officiant === 'unauthorized') {
    push(
      'F-USMLA-014',
      'officiant',
      'high',
      'The officiant is recorded as not authorized to solemnize marriages in this state, which can put the validity of the marriage in doubt.',
      'Use an authorized officiant (clergy, judge, clerk, or another person the state authorizes) and confirm authority with the clerk before the ceremony.'
    );
  } else if (officiant === 'missing') {
    push(
      'F-USMLA-015',
      'officiant',
      'medium',
      'The officiant type, name, or authority is not recorded for a ceremony that has a date.',
      'Record who solemnized the marriage and confirm they are authorized in this state.'
    );
  }

  // ─── Certificate return (MEDIUM) ────────────────────────────
  const ret = certificateReturnProblem(d);
  if (ret === 'overdue') {
    push(
      'F-USMLA-016',
      'certificate-return',
      'medium',
      `The signed license has not been returned to the clerk within ${rule.returnWithinDays} days of the ceremony (the ${rule.name} deadline), so the certified marriage certificate cannot be issued.`,
      'Ask the officiant to return the signed license to the clerk now, then order certified copies.'
    );
  } else if (ret === 'late') {
    push(
      'F-USMLA-017',
      'certificate-return',
      'low',
      `The signed license was returned more than ${rule.returnWithinDays} days after the ceremony (the ${rule.name} deadline).`,
      'Confirm with the clerk that the late return was recorded, and keep the receipt.'
    );
  } else if (ret === 'before-ceremony') {
    push(
      'F-USMLA-018',
      'certificate-return',
      'medium',
      'The license return date is before the ceremony date.',
      'Correct the ceremony or license-return date.'
    );
  }

  // ─── Unlisted state (MEDIUM) ────────────────────────────────
  if (!stateRuleKnown(d.jurisdiction.state) && d.jurisdiction.state !== '') {
    push(
      'F-USMLA-019',
      'state-rule',
      'medium',
      `The state "${d.jurisdiction.state}" is not in this tool's rule table, so the uniform default (18 to marry, 60-day validity, no waiting period, no witnesses) was applied. Verify the state rule.`,
      'Verify the waiting period, license validity, minimum age, and witness rules with the county clerk before relying on this result.'
    );
  }

  // ─── Blood test (MEDIUM) ────────────────────────────────────
  if (bloodTestMissing(d)) {
    push(
      'F-USMLA-020',
      'blood-test',
      'medium',
      `${rule.name} requires premarital blood-test evidence and none is recorded.`,
      'Obtain the required test evidence and bring it to the clerk.'
    );
  }

  // ─── Fee not recorded (LOW) ─────────────────────────────────
  if (
    parseDate(d.issuance.licenseIssuedDate) !== null &&
    (d.issuance.feePaidUsd === null || d.issuance.feePaidUsd <= 0)
  ) {
    push(
      'F-USMLA-021',
      'fee',
      'low',
      `A license issue date is recorded but no fee is (clerks set fees by county; ${rule.name} licenses commonly cost about $${rule.typicalFeeUsd || 'varies'}).`,
      'Record the fee paid, and keep the receipt with the license.'
    );
  }

  // ─── Same-sex couple notice (LOW) ───────────────────────────
  if (sameSexCouple(d)) {
    push(
      'F-USMLA-022',
      'same-sex-couple',
      'low',
      'The applicants are recorded as the same sex. Under Obergefell v. Hodges (2015) every state must license and recognize their marriage on the same terms as any other; this is not a bar.',
      'If a clerk refuses a license because the applicants are the same sex, ask for the refusal in writing and contact the county clerk supervisor or an attorney.'
    );
  }

  // ─── Social Security number status (LOW) ────────────────────
  const noSsn: string[] = [];
  if (d.applicantOne.ssnStatus === 'declined' || d.applicantOne.ssnStatus === 'none-issued')
    noSsn.push('first applicant');
  if (d.applicantTwo.ssnStatus === 'declined' || d.applicantTwo.ssnStatus === 'none-issued')
    noSsn.push('second applicant');
  if (noSsn.length > 0) {
    push(
      'F-USMLA-023',
      'social-security-number',
      'low',
      `Social Security number not provided for the ${noSsn.join(' and ')}. Federal law (42 U.S.C. 666(a)(13)) has states collect it where one has been issued, but most states do not refuse a license to an applicant who has none.`,
      'Tell the clerk if no number was ever issued; the clerk will record that.'
    );
  }

  // ─── Waiting-period information (LOW) ───────────────────────
  const wait = waitingDays(d);
  if (
    parseDate(d.ceremony.ceremonyDate) === null &&
    (wait.days > 0 || rule.validDays > 0) &&
    earliestCeremonyDate(d) !== null &&
    missing.length === 0
  ) {
    const w =
      wait.days > 0
        ? `The earliest permitted ceremony is ${earliestCeremonyDate(d)} (${rule.name} waiting period ${rule.waitingHours} hours) and`
        : `${wait.waivedBy ? 'The waiting period is waived (' + wait.waivedBy + '), and' : 'There is no waiting period, and'}`;
    push(
      'F-USMLA-024',
      'waiting-period',
      'low',
      `${w} the license expires after ${licenseExpiryDate(d)} (${rule.validDays}-day validity).`,
      'Schedule the ceremony between those dates, in the county or state the license allows.'
    );
  }

  // Sort: high > medium > low (stable).
  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  return flags;
}
