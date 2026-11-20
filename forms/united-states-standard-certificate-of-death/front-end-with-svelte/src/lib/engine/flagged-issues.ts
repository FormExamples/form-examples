import {
  INJURY_MANNERS,
  abbreviationsUsed,
  ageFromDates,
  daysBetween,
  expectedFee,
  illogicalSequence,
  mechanismAsSoleCause,
  missingPartIa,
  missingRequired,
  nonEmpty,
  nonNaturalManner,
  pregnancyItemApplies,
  referralIndicated,
  soleCause,
  stateKnown,
  stateRule,
  traumaInCause,
  unspecifiedDiabetes,
  unspecifiedMalignancy
} from './rules.js';
import type { DeathCertificate, FlaggedIssue, Priority } from './types.js';
import { optionLabel } from './options.js';

// Flagged-issue detection (completeness, specificity, referral, deadlines).
// Independent of the validity class (which the grader produces), this module
// raises certifier-, funeral-director- and registrar-facing flags per spec
// section 5. Flag ids follow `F-<TOPIC>-NNN`:
//
//   F-ME-REFERRAL-001          high    referral criterion asserted or implied
//   F-MECHANISM-001            high    mechanism of death is the only cause
//   F-MISSING-PART-I-001       high    Part I line (a) blank
//   F-MANNER-001               high    manner of death blank
//   F-CREMATION-HOLD-001       high    cremation planned while referral open or manner pending
//   F-SEQUENCE-001             medium  Part I lines not in a downward causal order
//   F-ABBREVIATION-001         medium  abbreviation used in a cause line
//   F-SPECIFICITY-001          medium  diabetes type or cancer histology not stated
//   F-PREGNANCY-001            medium  pregnancy item blank or inconsistent
//   F-INJURY-001               medium  injury items missing for accident, suicide or homicide
//   F-MANNER-MISMATCH-001      medium  manner and cause lines disagree
//   F-PENDING-001              medium  manner pending or undetermined
//   F-CERTIFIER-001            medium  certifier items blank
//   F-DECEDENT-001             medium  decedent items blank
//   F-FUNERAL-DIRECTOR-001     medium  funeral director items blank
//   F-DATES-001                medium  dates inconsistent
//   F-CERTIFY-DEADLINE-001     medium  certified later than the state allows
//   F-FILING-DEADLINE-001      medium  filed later than the state allows
//   F-COPIES-001               medium  certified-copy order incomplete or unverified
//   F-INTERVAL-001             low     completed Part I line has no interval
//   F-TOBACCO-001              low     tobacco item blank
//   F-AUTOPSY-001              low     pending manner with no autopsy answer
//   F-FEE-001                  low     fee paid differs from the state's fee
//   F-VERIFY-STATE-001         low     state rule not in the table or unverified
//
// Rows mirror the `united_states_standard_certificate_of_death_grade_flag` SQL
// table (flag_id, category, priority, description, suggested_action). NOTHING
// here diagnoses or is legal advice; the registering state agency decides.

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function detectFlaggedIssues(d: DeathCertificate): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const add = (
    id: string,
    category: string,
    priority: Priority,
    description: string,
    suggestedAction: string
  ) => flags.push({ id, category, priority, description, suggestedAction });
  const rule = stateRule(d);
  const missing = missingRequired(d);
  const missingIn = (category: string) =>
    missing.filter((m) => m.category === category).map((m) => m.label);

  // --- Referral (HIGH) ---
  if (referralIndicated(d)) {
    const reasons: string[] = [];
    if (d.referral.referredToMedicalExaminer === 'yes') reasons.push('referral recorded');
    if (d.referral.referralReason && d.referral.referralReason !== 'none')
      reasons.push(optionLabel('referralReason', d.referral.referralReason).toLowerCase());
    if (nonNaturalManner(d))
      reasons.push(
        'manner of death is ' + optionLabel('manner', d.manner.mannerOfDeath).toLowerCase()
      );
    if (traumaInCause(d)) reasons.push('injury, poisoning or procedure wording in the cause lines');
    if (d.certifier.attendedDeceased === 'no')
      reasons.push('decedent not attended by the certifier');
    add(
      'F-ME-REFERRAL-001',
      'medical-examiner-referral-required',
      'high',
      `A medical examiner or coroner referral criterion is asserted or implied (${reasons.join('; ')}). A physician should not certify the cause and manner of death until the medical examiner or coroner has accepted or declined jurisdiction.`,
      'Report the death to the medical examiner or coroner and let that office complete the cause-of-death and manner-of-death items, or release the case to you in writing.'
    );
  }

  // --- Mechanism as sole cause (HIGH) ---
  if (mechanismAsSoleCause(d)) {
    add(
      'F-MECHANISM-001',
      'mechanism-of-death',
      'high',
      `The only cause given ("${soleCause(d).trim()}") is a mechanism of death, not a disease or injury. NCHS instructs that a mechanism must not be listed alone.`,
      'State the underlying disease or injury that led to the mechanism on a lower Part I line.'
    );
  }

  // --- Missing Part I line (a) (HIGH) ---
  if (missingPartIa(d)) {
    add(
      'F-MISSING-PART-I-001',
      'missing-part-i',
      'high',
      'No immediate cause of death is recorded on Part I line (a). Every certificate must record the final disease or condition resulting in death.',
      'Record the immediate cause of death on Part I line (a), with the underlying cause on the lowest line used.'
    );
  }

  // --- Manner of death blank (HIGH) ---
  if (!nonEmpty(d.manner.mannerOfDeath)) {
    add(
      'F-MANNER-001',
      'missing-manner',
      'high',
      'Manner of death (natural, accident, suicide, homicide, pending investigation, or could not be determined) is not recorded.',
      'Select the manner of death; use pending investigation rather than leaving the item blank when it is not yet known.'
    );
  }

  // --- Cremation hold (HIGH) ---
  if (
    d.funeral.dispositionMethod === 'cremation' &&
    (referralIndicated(d) ||
      d.manner.mannerOfDeath === 'pending-investigation' ||
      d.manner.mannerOfDeath === 'could-not-be-determined')
  ) {
    add(
      'F-CREMATION-HOLD-001',
      'disposition',
      'high',
      'Cremation is planned while a medical examiner or coroner referral is open or the manner of death is pending or undetermined. Cremation is irreversible and most states require the medical examiner or coroner to authorize it first.',
      'Hold the cremation until the medical examiner or coroner has released the body or issued a cremation authorization.'
    );
  }

  // --- Illogical sequence (MEDIUM) ---
  if (illogicalSequence(d)) {
    add(
      'F-SEQUENCE-001',
      'illogical-sequence',
      'medium',
      'The Part I lines are not in a downward causal order: a lower line is completed while the line above it is empty.',
      'Fill the lines in order, from the immediate cause on line (a) down to the underlying cause, each "due to" the line below.'
    );
  }

  // --- Abbreviations (MEDIUM) ---
  const abbr = abbreviationsUsed(d);
  if (abbr.length > 0) {
    add(
      'F-ABBREVIATION-001',
      'abbreviation-used',
      'medium',
      `The cause lines use abbreviations (${abbr.join(', ')}). The NCHS Handbook asks that every term be written in full; abbreviations can be misread by the coder.`,
      'Write each condition out in full. HIV and AIDS are the only abbreviations accepted.'
    );
  }

  // --- Specificity (MEDIUM) ---
  if (unspecifiedDiabetes(d)) {
    add(
      'F-SPECIFICITY-001',
      'nonspecific-cause',
      'medium',
      'Diabetes is named without its type. The Handbook asks for type 1 or type 2 (or secondary or gestational) and any complications.',
      'State the type of diabetes and any complication, for example "Type 2 diabetes mellitus with chronic kidney disease".'
    );
  } else if (unspecifiedMalignancy(d)) {
    add(
      'F-SPECIFICITY-001',
      'nonspecific-cause',
      'medium',
      'A cancer is named without a histologic type. The Handbook asks for the primary site and the histologic type, and whether the site is primary or metastatic.',
      'State the primary site and cell type, for example "Adenocarcinoma of the sigmoid colon".'
    );
  }

  // --- Pregnancy item (MEDIUM) ---
  const preg = d.manner.pregnancyStatus;
  if (pregnancyItemApplies(d) && !nonEmpty(preg)) {
    add(
      'F-PREGNANCY-001',
      'pregnancy-item',
      'medium',
      'The pregnancy item is blank for a female decedent in the age band to which it applies (10 to 54, or age unknown).',
      'Answer the pregnancy item; use "unknown" if the status cannot be determined.'
    );
  } else if (
    !pregnancyItemApplies(d) &&
    nonEmpty(d.decedent.sex) &&
    /^(pregnant|not-pregnant-but)/.test(preg)
  ) {
    add(
      'F-PREGNANCY-001',
      'pregnancy-item',
      'medium',
      'A pregnancy status is recorded for a decedent to whom the pregnancy item does not apply (male, or female outside the age band).',
      'Check the sex and age entries and the pregnancy status; select "not applicable" when the item does not apply.'
    );
  } else if (pregnancyItemApplies(d) && preg === 'not-applicable') {
    add(
      'F-PREGNANCY-001',
      'pregnancy-item',
      'medium',
      'The pregnancy item is marked not applicable for a female decedent in the age band to which it applies.',
      'Answer whether the decedent was pregnant within the past year, or "unknown".'
    );
  }

  // --- Injury items (MEDIUM) ---
  if (INJURY_MANNERS.indexOf(d.manner.mannerOfDeath) !== -1) {
    const gaps: string[] = [];
    if (!nonEmpty(d.injury.injuryDate || '')) gaps.push('date of injury');
    if (!nonEmpty(d.injury.injuryPlace)) gaps.push('place of injury');
    if (!nonEmpty(d.injury.injuryAtWork)) gaps.push('injury at work');
    if (!nonEmpty(d.injury.injuryDescription)) gaps.push('description of how the injury occurred');
    if (gaps.length > 0) {
      add(
        'F-INJURY-001',
        'injury-items',
        'medium',
        `Manner of death is ${d.manner.mannerOfDeath}, but the injury items are incomplete (${gaps.join(', ')}).`,
        'Complete the injury items; describe how the injury occurred specifically enough to code the external cause.'
      );
    }
  }

  // --- Manner and cause lines disagree (MEDIUM) ---
  if (
    d.manner.mannerOfDeath === 'natural' &&
    (traumaInCause(d) || nonEmpty(d.injury.injuryDate || ''))
  ) {
    add(
      'F-MANNER-MISMATCH-001',
      'manner-mismatch',
      'medium',
      'Manner of death is natural, but the cause lines or injury items describe an injury, poisoning or procedure.',
      'Reconsider the manner of death and refer the case to the medical examiner or coroner if an injury contributed.'
    );
  } else if (INJURY_MANNERS.indexOf(d.manner.mannerOfDeath) !== -1 && !traumaInCause(d)) {
    add(
      'F-MANNER-MISMATCH-001',
      'manner-mismatch',
      'medium',
      `Manner of death is ${d.manner.mannerOfDeath}, but no injury, poisoning or similar cause appears in the cause lines.`,
      'Name the injury or poisoning in Part I, with the external cause described in the injury items.'
    );
  }

  // --- Pending or undetermined manner (MEDIUM) ---
  if (
    d.manner.mannerOfDeath === 'pending-investigation' ||
    d.manner.mannerOfDeath === 'could-not-be-determined'
  ) {
    add(
      'F-PENDING-001',
      'pending-determination',
      'medium',
      d.manner.mannerOfDeath === 'pending-investigation'
        ? 'The manner of death is pending investigation, so this is an interim certificate.'
        : 'The manner of death could not be determined.',
      'File the certificate as pending and submit a supplemental cause-of-death report to the registrar when the investigation concludes.'
    );
  }

  // --- Items blank, by who completes them (MEDIUM) ---
  if (missingIn('incomplete-certifier').length > 0) {
    add(
      'F-CERTIFIER-001',
      'incomplete-certifier',
      'medium',
      `Certifier items are blank: ${missingIn('incomplete-certifier').join(', ')}.`,
      'Complete the certifier name, type, license number and the date certified.'
    );
  }
  if (missingIn('incomplete-decedent').length > 0) {
    add(
      'F-DECEDENT-001',
      'incomplete-decedent',
      'medium',
      `Decedent items are blank: ${missingIn('incomplete-decedent').join(', ')}.`,
      'Complete the decedent items; the registrar cannot accept the certificate without them.'
    );
  }
  if (missingIn('incomplete-funeral-director').length > 0) {
    add(
      'F-FUNERAL-DIRECTOR-001',
      'incomplete-funeral-director',
      'medium',
      `Funeral director items are blank: ${missingIn('incomplete-funeral-director').join(', ')}.`,
      'Complete the funeral director name and the method of disposition.'
    );
  }

  // --- Dates (MEDIUM) ---
  const dod = d.death.dateOfDeath;
  const dateProblems: string[] = [];
  const isEarlier = (a: string | null, b: string | null) => {
    const n = daysBetween(a, b);
    return n !== null && n > 0;
  };
  if (isEarlier(dod, d.decedent.dateOfBirth))
    dateProblems.push('date of death is before date of birth');
  if (isEarlier(d.certifier.certificationDate, dod))
    dateProblems.push('certified before the date of death');
  if (isEarlier(d.funeral.dispositionDate, dod))
    dateProblems.push('disposition before the date of death');
  if (isEarlier(dod, d.certifier.lastSeenAliveDate))
    dateProblems.push('last seen alive after the date of death');
  if (isEarlier(dod, d.injury.injuryDate)) dateProblems.push('injury after the date of death');
  const computed = ageFromDates(d);
  if (
    computed !== null &&
    typeof d.decedent.ageYears === 'number' &&
    Math.abs(computed - d.decedent.ageYears) > 1
  ) {
    dateProblems.push(`stated age ${d.decedent.ageYears} does not match the dates (${computed})`);
  }
  if (dateProblems.length > 0) {
    add(
      'F-DATES-001',
      'date-inconsistency',
      'medium',
      `Dates are inconsistent: ${dateProblems.join('; ')}.`,
      'Check the dates against the medical record and the funeral director’s worksheet.'
    );
  }

  // --- Deadlines (MEDIUM) ---
  const timingNote = (key: 'fee' | 'fileDays' | 'certifyDays') =>
    rule.verified[key]
      ? ''
      : ' This deadline has not been independently verified against the statute; confirm it with the state registrar.';
  if (rule.certifyDays !== null) {
    const taken = daysBetween(dod, d.certifier.certificationDate, rule.business);
    if (taken !== null && taken > rule.certifyDays) {
      add(
        'F-CERTIFY-DEADLINE-001',
        'filing-deadline',
        'medium',
        `The cause of death was certified ${taken} ${rule.business ? 'business ' : ''}days after death; ${rule.name} allows ${rule.certifyDays}.${timingNote('certifyDays')}`,
        'Certify promptly; if the deadline has passed, expect the registrar to ask for a late-filing explanation.'
      );
    }
  }
  if (rule.fileDays !== null) {
    const taken = daysBetween(dod, d.funeral.filedDate, rule.business);
    if (taken !== null && taken > rule.fileDays) {
      add(
        'F-FILING-DEADLINE-001',
        'filing-deadline',
        'medium',
        `The certificate was filed ${taken} ${rule.business ? 'business ' : ''}days after death; ${rule.name} allows ${rule.fileDays}.${timingNote('fileDays')}`,
        'File with the local or state registrar as soon as possible; ask the registrar whether a delayed-registration procedure applies.'
      );
    }
  }

  // --- Certified copies (MEDIUM) ---
  const copies = d.copies.certifiedCopiesRequested;
  if (typeof copies === 'number' && copies > 0) {
    const problems: string[] = [];
    if (!nonEmpty(d.copies.requesterRelationship))
      problems.push('the requester’s relationship to the decedent is blank');
    if (d.copies.requesterIdentityVerified !== 'yes')
      problems.push('the requester’s identity is not recorded as verified');
    if (d.copies.requesterRelationship === 'other')
      problems.push('a requester outside the immediate family needs documented eligibility');
    if (
      referralIndicated(d) ||
      d.manner.mannerOfDeath === 'pending-investigation' ||
      d.manner.mannerOfDeath === 'could-not-be-determined'
    ) {
      problems.push(
        'certified copies are issued only from a registered certificate, and this one is not final'
      );
    }
    if (problems.length > 0) {
      add(
        'F-COPIES-001',
        'certified-copies',
        'medium',
        `The certified-copy order has issues: ${problems.join('; ')}.`,
        'Verify the requester’s identity and eligibility under state law, and order copies once the certificate is registered.'
      );
    }
  }

  // --- Low priority ---
  const incompleteLines = [
    ['a', d.partI.causeIaCondition, d.partI.causeIaInterval],
    ['b', d.partI.causeIbCondition, d.partI.causeIbInterval],
    ['c', d.partI.causeIcCondition, d.partI.causeIcInterval],
    ['d', d.partI.causeIdCondition, d.partI.causeIdInterval]
  ]
    .filter(([, cond, interval]) => nonEmpty(cond) && !nonEmpty(interval))
    .map(([line]) => line);
  if (incompleteLines.length > 0) {
    add(
      'F-INTERVAL-001',
      'missing-interval',
      'low',
      `Part I line${incompleteLines.length > 1 ? 's' : ''} (${incompleteLines.join('), (')}) ${incompleteLines.length > 1 ? 'have' : 'has'} no onset-to-death interval.`,
      'Add the approximate interval between onset and death for each completed line, even "unknown" when it is not known.'
    );
  }
  if (!nonEmpty(d.manner.tobaccoUseContributed)) {
    add(
      'F-TOBACCO-001',
      'tobacco-item',
      'low',
      'The item "Did tobacco use contribute to death?" is blank.',
      'Answer yes, probably, no, or unknown.'
    );
  }
  if (
    (d.manner.mannerOfDeath === 'pending-investigation' ||
      d.manner.mannerOfDeath === 'could-not-be-determined') &&
    !nonEmpty(d.partII.autopsyPerformed)
  ) {
    add(
      'F-AUTOPSY-001',
      'pending-determination',
      'low',
      'The manner of death is pending or undetermined and the autopsy items are blank.',
      'Record whether an autopsy was performed and whether its findings were available.'
    );
  }
  const expected = expectedFee(d);
  if (
    expected !== null &&
    typeof d.copies.feePaidInUsd === 'number' &&
    Math.abs(d.copies.feePaidInUsd - expected) > 0.005
  ) {
    add(
      'F-FEE-001',
      'certified-copies',
      'low',
      `The fee paid ($${d.copies.feePaidInUsd.toFixed(2)}) differs from the ${rule.name} fee for ${copies} certified ${copies === 1 ? 'copy' : 'copies'} ($${expected.toFixed(2)}).`,
      'Confirm the current fee with the issuing vital-records office; fees change and counties may add charges.'
    );
  }
  if (nonEmpty(d.jurisdiction.state) && !stateKnown(d)) {
    add(
      'F-VERIFY-STATE-001',
      'verify-state-rule',
      'low',
      `The state "${d.jurisdiction.state}" is not in this tool’s state table, so the default uniform deadlines apply and no fee check was made.`,
      'Verify the filing deadline, the certification deadline and the certified-copy fee with the state vital-records office.'
    );
  }

  flags.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  return flags;
}

export { detectFlaggedIssues };
