import { ruleFor, nonEmpty, requiredResidencyMonths, stateResidencyShort, countyResidencyShort, separationApplies, separationShort, faultGroundNotAvailable, earliestDecreeDate, decreeBeforeWaitingPeriod, missingCore, childrenIncomplete, homeStateShort, uncontestedWithoutAgreement, serviceComplete, decreeWithoutService, nameRestorationIncomplete, propertyApproachMismatch, militaryWithoutAppearance } from './rules.js';

// Flagged-issue detection. Independent of the readiness class (which the grader
// produces), this module raises preparer-facing flags per spec section 5:
//
//   high   : state or county residency short, separation short, fault ground
//            unavailable, decree before the waiting period, custody plan or
//            child-support worksheet missing, UCCJEA home-state gap, decree
//            without service, core details missing;
//   medium : unknown state rule, property-approach mismatch, uncontested without
//            a signed agreement, financial disclosure missing, service by
//            publication, military respondent;
//   low    : waiting period pending, name restoration incomplete, vital-records
//            certificate not requested, service not yet completed.
//
// Rows mirror the `united_states_divorce_petition_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action). NOTHING here is
// legal advice; the issuing court decides.

/**
 * @typedef {import('./types.js').DivorcePetition} DivorcePetition
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {DivorcePetition} d
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(d) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const { rule, known } = ruleFor(d.filing.state);
  const stateName = known ? rule.name : (nonEmpty(d.filing.state) ? d.filing.state.toUpperCase() : 'the filing state');

  // ─── Unknown state rule (MEDIUM) ────────────────────────────
  if (nonEmpty(d.filing.state) && !known) {
    flags.push({
      id: 'F-DIV-UNKNOWN-STATE-001',
      category: 'unknown-state-rule',
      priority: 'medium',
      description:
        `"${d.filing.state.toUpperCase()}" is not in this tool's verified state-rule table, so the default 90-day domicile rule was used.`,
      suggestedAction:
        'Verify the residency, waiting-period and property rules with the state court website or an attorney before relying on this result.'
    });
  }

  // ─── Core details missing (HIGH) ────────────────────────────
  const missing = missingCore(d);
  if (missing.length > 0) {
    flags.push({
      id: 'F-DIV-CORE-MISSING-001',
      category: 'missing-core-details',
      priority: 'high',
      description: `Required petition details are missing: ${missing.join(', ')}.`,
      suggestedAction: 'Complete every required item before filing.'
    });
  }

  // ─── State residency short (HIGH) ───────────────────────────
  if (stateResidencyShort(d)) {
    flags.push({
      id: 'F-DIV-RESIDENCY-001',
      category: 'state-residency',
      priority: 'high',
      description:
        `The petitioner has lived in ${stateName} for ${d.spouses.petitionerResidencyMonths} month(s); ${requiredResidencyMonths(d)} month(s) are required before filing (${rule.cite}).`,
      suggestedAction:
        'Wait until the residency period is met, or file in a state where a spouse already meets it.'
    });
  }

  // ─── County residency short (HIGH) ──────────────────────────
  if (countyResidencyShort(d)) {
    flags.push({
      id: 'F-DIV-COUNTY-001',
      category: 'county-residency',
      priority: 'high',
      description:
        `The petitioner has lived in the county for ${d.spouses.countyResidencyDays} day(s); ${rule.countyDays} days are required in ${stateName}.`,
      suggestedAction: 'Wait until the county residency period is met, or file in the county where it is met.'
    });
  }

  // ─── Separation period short (HIGH) ─────────────────────────
  if (separationShort(d)) {
    flags.push({
      id: 'F-DIV-SEPARATION-001',
      category: 'separation-period',
      priority: 'high',
      description:
        `A contested no-fault divorce in ${stateName} needs ${rule.separationDays} days of separation before filing, and the stated separation date is too recent.`,
      suggestedAction:
        'Wait until the separation period has run, obtain the respondent\'s written agreement where the state allows, or plead an available fault ground.'
    });
  } else if (separationApplies(d) && !d.spouses.separationDate) {
    flags.push({
      id: 'F-DIV-SEPARATION-002',
      category: 'separation-period',
      priority: 'medium',
      description:
        `${stateName} requires ${rule.separationDays} days of separation for a contested no-fault divorce, but no separation date is recorded.`,
      suggestedAction: 'Record the date the spouses began living separate and apart.'
    });
  }

  // ─── Fault ground unavailable (HIGH) ────────────────────────
  if (faultGroundNotAvailable(d)) {
    flags.push({
      id: 'F-DIV-GROUND-001',
      category: 'ground-not-available',
      priority: 'high',
      description:
        `${stateName} has no fault grounds for divorce; only a no-fault ground (irretrievable breakdown or irreconcilable differences) can be pleaded.`,
      suggestedAction: 'Plead the state\'s no-fault ground instead of a fault ground.'
    });
  }

  // ─── Children: custody plan and child support (HIGH) ────────
  const kids = childrenIncomplete(d);
  if (kids.plan) {
    flags.push({
      id: 'F-DIV-CUSTODY-001',
      category: 'custody-plan-missing',
      priority: 'high',
      description: 'There are minor children but no custody and parenting-time plan is documented.',
      suggestedAction: 'Prepare a parenting plan (legal and physical custody, parenting time, decision-making) to file with the petition.'
    });
  }
  if (kids.worksheet) {
    flags.push({
      id: 'F-DIV-CHILDSUPPORT-001',
      category: 'child-support-missing',
      priority: 'high',
      description: 'There are minor children but the state child-support guideline worksheet is not completed.',
      suggestedAction: 'Complete the state guideline worksheet from both parents\' incomes and parenting time, and record the monthly amount.'
    });
  }
  if (homeStateShort(d)) {
    flags.push({
      id: 'F-DIV-HOMESTATE-001',
      category: 'home-state-jurisdiction',
      priority: 'high',
      description:
        `The children have lived in ${stateName} for ${d.children.childrenHomeStateMonths} month(s). Under the UCCJEA a state is the home state for custody only after six consecutive months, so the court may lack custody jurisdiction.`,
      suggestedAction: 'Confirm which state is the children\'s home state before asking this court to decide custody.'
    });
  }

  // ─── Property approach mismatch (MEDIUM) ────────────────────
  if (propertyApproachMismatch(d)) {
    flags.push({
      id: 'F-DIV-PROPERTY-001',
      category: 'property-approach-mismatch',
      priority: 'medium',
      description:
        `The petition pleads ${d.property.propertyDivisionApproach} property division, but ${stateName} is a ${rule.property} state.`,
      suggestedAction: `Plead the ${rule.property} approach used in ${stateName}.`
    });
  }

  // ─── Financial disclosure missing (MEDIUM) ──────────────────
  if (d.property.financialDisclosureFiled !== 'yes') {
    flags.push({
      id: 'F-DIV-DISCLOSURE-001',
      category: 'financial-disclosure-missing',
      priority: 'medium',
      description: 'The financial disclosure or affidavit is not filed or ready. Most states require sworn disclosure of income, assets and debts.',
      suggestedAction: 'Complete the state financial affidavit or disclosure form and exchange it with the other spouse.'
    });
  }

  // ─── Uncontested without agreement (MEDIUM) ─────────────────
  if (uncontestedWithoutAgreement(d)) {
    flags.push({
      id: 'F-DIV-AGREEMENT-001',
      category: 'uncontested-without-agreement',
      priority: 'medium',
      description: 'The case is marked uncontested, but no signed marital settlement agreement is recorded.',
      suggestedAction: 'Have both spouses sign a settlement agreement covering property, support and children, or treat the case as contested.'
    });
  }

  // ─── Military respondent (MEDIUM) ───────────────────────────
  if (militaryWithoutAppearance(d)) {
    flags.push({
      id: 'F-DIV-MILITARY-001',
      category: 'military-respondent',
      priority: 'medium',
      description: 'The respondent is on active military duty and has not appeared. The Servicemembers Civil Relief Act (50 U.S.C. 3931) requires an affidavit before a default judgment.',
      suggestedAction: 'File the SCRA affidavit (check the DMDC database) before requesting a default decree.'
    });
  }

  // ─── Service (HIGH / MEDIUM / LOW) ──────────────────────────
  if (decreeWithoutService(d)) {
    flags.push({
      id: 'F-DIV-SERVICE-001',
      category: 'service-incomplete',
      priority: 'high',
      description: 'A decree is recorded as entered, but service of process on the respondent was never completed and the respondent has not appeared.',
      suggestedAction: 'Confirm proper service or a signed acceptance of service before relying on the decree.'
    });
  } else if (!serviceComplete(d) && d.decree.decreeEntered !== 'yes') {
    flags.push({
      id: 'F-DIV-SERVICE-002',
      category: 'service-incomplete',
      priority: 'low',
      description: 'The respondent has not yet been served. Service of process follows filing.',
      suggestedAction: 'After filing, serve the respondent personally, by acceptance of service, or by another method the court allows, and file proof of service.'
    });
  }
  if (d.service.serviceMethod === 'publication') {
    flags.push({
      id: 'F-DIV-PUBLICATION-001',
      category: 'service-by-publication',
      priority: 'medium',
      description: 'Service by publication is a last resort and normally needs a court order and proof of a diligent search for the respondent.',
      suggestedAction: 'File a motion for alternate service with a declaration of diligent search before publishing.'
    });
  }

  // ─── Waiting period (HIGH / LOW) ────────────────────────────
  const earliest = earliestDecreeDate(d);
  if (decreeBeforeWaitingPeriod(d)) {
    flags.push({
      id: 'F-DIV-WAITING-001',
      category: 'decree-before-waiting-period',
      priority: 'high',
      description:
        `The decree date ${d.decree.decreeDate} is before the earliest permitted date ${earliest} under the ${stateName} waiting period.`,
      suggestedAction: 'Check the decree and waiting-period dates; a decree entered early may be void or voidable.'
    });
  } else if (earliest !== null && d.decree.decreeEntered !== 'yes' && (rule.waitMonths > 0 || rule.waitDays > 0)) {
    flags.push({
      id: 'F-DIV-WAITING-002',
      category: 'waiting-period-pending',
      priority: 'low',
      description: `${stateName} has a waiting period; the earliest date a decree may be entered is ${earliest}.`,
      suggestedAction: 'Do not schedule the final hearing or submit the decree before that date.'
    });
  }

  // ─── Name restoration (LOW) ─────────────────────────────────
  if (nameRestorationIncomplete(d)) {
    flags.push({
      id: 'F-DIV-NAME-001',
      category: 'name-restoration-incomplete',
      priority: 'low',
      description: 'Restoration of a former name is requested, but the name to restore is not stated.',
      suggestedAction: 'State the exact former name to be restored in the petition and decree.'
    });
  }

  // ─── Vital-records divorce certificate (LOW) ────────────────
  if (d.decree.decreeEntered === 'yes' && d.decree.certificateRequested !== 'yes') {
    flags.push({
      id: 'F-DIV-CERTIFICATE-001',
      category: 'certificate-not-requested',
      priority: 'low',
      description: 'The decree is entered but no vital-records divorce certificate or certified decree is requested.',
      suggestedAction: 'Order certified copies from the clerk, and a divorce certificate from the state vital-records office if needed (for example for a name change or remarriage).'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
