import {
  claimedExemptions, declarationComplete, duplicateHomestead, exemptionStatus, filedLate, filingDeadline,
  missingDocuments, missingRequired, nonEmpty, occupancyFails, ownershipFails, stateKnown, stateRule
} from './rules.js';

// Flagged-issue detection. Independent of the eligibility class (which the
// grader produces), this module raises applicant- and assessor-facing flags:
//
//   high   ownership, occupancy, duplicate homestead, late filing, age, income,
//          veteran rating below the minimum, unsigned declaration
//   medium late-filing relief, no statewide program, no exemption claimed,
//          missing information, income missing, missing proof documents,
//          unknown state
//   low    no statewide deadline, figures to verify, appeal guidance
//
// Rows mirror the `property_tax_exemption_application_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action). Documentation
// support, not legal advice; the county assessor decides.

/**
 * @typedef {import('./types.js').PropertyTaxApplication} PropertyTaxApplication
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

const ORDER = { high: 0, medium: 1, low: 2 };

/**
 * @param {PropertyTaxApplication} d
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(d) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const rule = stateRule(d);
  const claimed = claimedExemptions(d);
  const push = (id, category, priority, description, suggestedAction) =>
    flags.push({ id, category, priority, description, suggestedAction });

  if (ownershipFails(d)) {
    push('F-OWNERSHIP-001', 'ownership', 'high',
      'The applicant did not hold title on the assessment date, so the owner-occupant exemptions do not apply for this year.',
      'Confirm the deed date. If title passed after the assessment date, apply for the following year.');
  }
  if (occupancyFails(d)) {
    push('F-OCCUPANCY-001', 'occupancy', 'high',
      'The property was not the applicant\'s primary residence on the assessment date.',
      'A homestead exemption needs owner occupancy as a primary residence on that date. Apply for the year when it is met.');
  }
  if (duplicateHomestead(d)) {
    push('F-DUPLICATE-HOMESTEAD-001', 'duplicate-homestead', 'high',
      'A homestead exemption is already claimed on another property. Only one primary residence may carry one.',
      'Remove the other homestead claim or choose which property is the primary residence.');
  }
  if (filedLate(d)) {
    const lateRelief = d.filing.applicationType === 'late';
    push('F-DEADLINE-LATE-001', 'late-filing', lateRelief ? 'medium' : 'high',
      `The filing date ${d.filing.filingDate} is after the ${rule.name} deadline of ${filingDeadline(d)}.`,
      lateRelief
        ? 'Late-filing relief is discretionary; attach a statement of the reason and ask the assessor how to proceed.'
        : 'Mark the application as late and ask the assessor whether late-filing relief is available. ' + rule.deadlineNote);
  }
  for (const id of claimed) {
    const st = exemptionStatus(d, id);
    if (st.status === 'fail' && st.reason === 'no-program') {
      push(`F-PROGRAM-${id.toUpperCase()}-001`, 'state-rule-verify', 'medium',
        `${rule.name} has no statewide ${id} program in the rule table; the claim cannot be assessed here.`,
        'Ask the county assessor whether a local program applies.');
    } else if (st.status === 'fail' && st.reason === 'age') {
      push('F-AGE-001', 'age-requirement', 'high',
        `The applicant is ${d.applicant.ageOnAssessmentDate}, below the ${rule.name} senior minimum age of ${rule.seniorAge}.`,
        'Drop the senior claim, or apply in the year the age requirement is met.');
    } else if (st.status === 'fail' && st.reason === 'income') {
      push('F-INCOME-001', 'income-limit', 'high',
        `Household income of $${d.income.householdIncomeDollars} is above the ${rule.name} limit of $${rule.incomeLimit} for the ${id} claim.`,
        'Check which income counts, and drop the claim if the limit is exceeded.');
    } else if (st.status === 'fail' && st.reason === 'rating') {
      push('F-VETERAN-RATING-001', 'veteran-rating', 'high',
        `The VA service-connected rating is ${d.exemptions.veteranDisabilityPercent}%, below the common 10% minimum.`,
        'Attach the VA rating letter and confirm the state minimum rating.');
    }
  }
  if (!declarationComplete(d)) {
    push('F-SIGNATURE-001', 'missing-signature', 'high',
      'The declaration is unsigned, undated, or the penalty for a false statement is not acknowledged. A false statement can lead to back taxes, penalties and prosecution.',
      'Read the penalty statement, acknowledge it, sign and date the application.');
  }
  if (claimed.length === 0) {
    push('F-NO-EXEMPTION-001', 'no-exemption-claimed', 'medium',
      'No exemption is claimed, so there is nothing to decide.',
      'Tick the exemption or relief you are applying for.');
  }
  const missing = missingRequired(d);
  const p = d.property;
  if (p.ownerOnAssessmentDate === '') missing.push('owner on the assessment date');
  if (p.occupiedAsPrimaryResidence === '') missing.push('primary-residence occupancy');
  if (p.otherHomesteadClaimed === '') missing.push('other-homestead answer');
  if (missing.length > 0) {
    push('F-MISSING-INFO-001', 'missing-information', 'medium',
      `Required information is missing: ${missing.join(', ')}.`,
      'Complete the identification, parcel and assessment-date answers.');
  }
  const unknown = claimed.filter((id) => exemptionStatus(d, id).status === 'unknown');
  if (unknown.length > 0) {
    push('F-INCOME-MISSING-001', 'missing-information', 'medium',
      `A test for the ${unknown.join(', ')} claim needs an answer that is blank (age, household income or VA rating).`,
      'Enter the age, household income or VA rating the claim depends on.');
  }
  const docs = missingDocuments(d);
  if (docs.length > 0) {
    push('F-DOCUMENTS-001', 'missing-documents', 'medium',
      `Proof is not marked attached: ${docs.join(', ')}.`,
      'Attach each document, or the assessor will return the application.');
  }
  if (!stateKnown(d) && nonEmpty(d.property.state)) {
    push('F-STATE-VERIFY-001', 'state-rule-verify', 'medium',
      `State "${d.property.state}" is not in the encoded rule table, so the default rule is used and the deadline is unknown.`,
      'Verify the deadline, age and income limits with the county assessor or state revenue department.');
  }
  if (stateKnown(d) && rule.deadline === null) {
    push('F-STATE-NODEADLINE-001', 'state-rule-verify', 'low',
      `${rule.name} sets no single statewide filing date. ${rule.deadlineNote}`,
      'Ask the county assessor for the local filing date.');
  }
  if (stateKnown(d) && rule.verify) {
    push('F-STATE-FIGURES-001', 'state-rule-verify', 'low',
      `Some ${rule.name} figures vary by county or year (${rule.homestead}).`,
      'Confirm the current amounts and income limit with the county assessor.');
  }
  if (d.appeal.appealRequested === 'yes') {
    push('F-APPEAL-001', 'appeal-guidance', 'low',
      `Assessment appeal basics: an exemption does not appeal the value. ${rule.appealNote}`,
      'Keep the notice of value and file the appeal inside the stated window.');
    if (!nonEmpty(d.appeal.noticeOfValueDate)) {
      push('F-APPEAL-NOTICE-001', 'appeal-guidance', 'low',
        'The date of the notice of value is blank, so the appeal window cannot be checked.',
        'Enter the notice date; the appeal clock starts from it.');
    }
  }

  return flags
    .map((f, i) => ({ f, i }))
    .sort((a, b) => ORDER[a.f.priority] - ORDER[b.f.priority] || a.i - b.i)
    .map((x) => x.f);
}

export { detectFlaggedIssues };
