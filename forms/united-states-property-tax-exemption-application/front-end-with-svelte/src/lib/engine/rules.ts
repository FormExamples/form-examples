// Declarative United States Property Tax Exemption Application rules (TypeScript
// port of front-end-with-html/js/rules.js; keep the two in step).
//
// This form is a COMPLETENESS / ELIGIBILITY instrument, not a scored
// assessment. This module holds the primitive predicates the grader
// (`grader.js`) and the flag detector (`flags.js`) compose, and the
// STATE_RULES table of verified state values. Nothing here decides an
// application: it encodes what the published rules require so the engine can
// classify the filled form. Documentation support, not legal advice; the
// county assessor or state agency decides.
//
// Sources and verification dates are in `doc/index.md` and `spec/index.md`.

import type { ExemptionId, ExemptionStatus, PropertyTaxApplication, StateRule } from './types.js';

export const nonEmpty = (s: unknown): s is string => typeof s === 'string' && s.trim() !== '';
export const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/** Common minimum VA service-connected rating for a disabled-veteran exemption. */
export const VETERAN_MIN_PERCENT = 10;

/**
 * Per-state rules. `deadline` is `{ month, day, yearOffset }` relative to the
 * assessment year (yearOffset -1 = the year before the tax year), or null when
 * the state sets no single statewide date. `incomeLimit` (dollars) bounds the
 * income-tested relief (senior, disability, circuit-breaker); null means the
 * state sets none or sets it locally. `verify` is true where a figure comes from
 * a secondary source or varies by county, so the engine raises a low flag.
 */
export const STATE_RULES: Record<string, StateRule> = {
  CA: {
    name: 'California',
    homestead: "$7,000 of assessed value (Homeowners' Exemption, claim BOE-266)",
    seniorProgram: false,
    seniorAge: null,
    incomeLimit: null,
    circuitBreaker: false,
    deadline: { month: 2, day: 15, yearOffset: 0 },
    deadlineNote:
      'Claim by February 15 for the full exemption; a later claim gets a reduced exemption.',
    appealNote:
      'Appeal to the county assessment appeals board; the regular filing window is set by the county and closes in the fall.',
    verify: false
  },
  NY: {
    name: 'New York',
    homestead:
      'Basic STAR exemption or credit (income limit $500,000 credit, $250,000 exemption); Enhanced STAR for age 65+',
    seniorProgram: true,
    seniorAge: 65,
    incomeLimit: 110750,
    circuitBreaker: true,
    deadline: { month: 3, day: 1, yearOffset: 0 },
    deadlineNote: 'Taxable status date is March 1 in most localities; some set another date.',
    appealNote:
      'Grievance with the local Board of Assessment Review; the date is set by the locality.',
    verify: true
  },
  TX: {
    name: 'Texas',
    homestead:
      '$140,000 school district homestead exemption; additional $60,000 for age 65+ or disabled',
    seniorProgram: true,
    seniorAge: 65,
    incomeLimit: null,
    circuitBreaker: false,
    deadline: { month: 4, day: 30, yearOffset: 0 },
    deadlineNote:
      'Apply by April 30; a late application can be filed up to two years after the delinquency date.',
    appealNote:
      'Protest to the appraisal review board by May 15 or 30 days after the notice of appraised value, whichever is later.',
    verify: false
  },
  FL: {
    name: 'Florida',
    homestead:
      '$25,000 plus an additional exemption of up to about $25,722 on assessed value over $50,000 (non-school taxes)',
    seniorProgram: true,
    seniorAge: 65,
    incomeLimit: null,
    circuitBreaker: false,
    deadline: { month: 3, day: 1, yearOffset: 0 },
    deadlineNote: 'Apply (Form DR-501) by March 1; missing it waives the exemption for the year.',
    appealNote: 'Petition the value adjustment board within 25 days of the TRIM notice mailing.',
    verify: true
  },
  IL: {
    name: 'Illinois',
    homestead:
      'General homestead exemption; senior exemption of $8,000 (Cook and contiguous counties) or $5,000; senior assessment freeze',
    seniorProgram: true,
    seniorAge: 65,
    incomeLimit: 65000,
    circuitBreaker: true,
    deadline: null,
    deadlineNote: 'No single statewide filing date; each county sets its own.',
    appealNote: 'Complaint to the county board of review within the window the county publishes.',
    verify: true
  },
  PA: {
    name: 'Pennsylvania',
    homestead:
      'Homestead or farmstead exclusion from the school district property tax; Property Tax/Rent Rebate for age 65+',
    seniorProgram: true,
    seniorAge: 65,
    incomeLimit: 48110,
    circuitBreaker: true,
    deadline: { month: 3, day: 1, yearOffset: -1 },
    deadlineNote:
      'File by March 1 to get relief for the following tax year; the Property Tax/Rent Rebate is due June 30 and is often extended.',
    appealNote: 'Appeal to the county board of assessment appeals, normally by September 1.',
    verify: false
  },
  OH: {
    name: 'Ohio',
    homestead:
      'Homestead exemption on $29,000 of market value for age 65+ or disabled (income-tested); no income test for 100% disabled veterans',
    seniorProgram: true,
    seniorAge: 65,
    incomeLimit: 41000,
    circuitBreaker: true,
    deadline: { month: 12, day: 31, yearOffset: 0 },
    deadlineNote:
      'Application (DTE 105A) is due on or before December 31 of the year the exemption is sought.',
    appealNote:
      'Complaint to the county board of revision by March 31 of the year after the tax lien date.',
    verify: false
  },
  WA: {
    name: 'Washington',
    homestead:
      'Senior citizen and disabled persons exemption (RCW 84.36.381), age 61+; income thresholds set by county',
    seniorProgram: true,
    seniorAge: 61,
    incomeLimit: null,
    circuitBreaker: true,
    deadline: null,
    deadlineNote: "File with the county assessor; confirm the county's date and income threshold.",
    appealNote:
      'Petition the county board of equalization within 60 days of the assessment notice or July 1, whichever is later.',
    verify: true
  }
};

/** Rule applied to a state not in the table. */
export const DEFAULT_RULE: StateRule = {
  name: 'Unknown state',
  homestead: 'unknown',
  seniorProgram: true,
  seniorAge: 65,
  incomeLimit: null,
  circuitBreaker: true,
  deadline: null,
  deadlineNote: 'State rule not encoded; verify with the county assessor.',
  appealNote: 'Verify the appeal window with the county assessor.',
  verify: true
};

export function stateKey(d: PropertyTaxApplication) {
  return String(d.property.state || '')
    .trim()
    .toUpperCase();
}

export function stateKnown(d: PropertyTaxApplication) {
  return Object.prototype.hasOwnProperty.call(STATE_RULES, stateKey(d));
}

export function stateRule(d: PropertyTaxApplication) {
  return stateKnown(d) ? STATE_RULES[stateKey(d)] : DEFAULT_RULE;
}

/** The filing deadline as an ISO date, or null when none can be derived. */
export function filingDeadline(d: PropertyTaxApplication): string | null {
  const rule = stateRule(d);
  const year = d.filing.assessmentYear;
  if (!rule.deadline || !isNum(year)) return null;
  const y = year + rule.deadline.yearOffset;
  const mm = String(rule.deadline.month).padStart(2, '0');
  const dd = String(rule.deadline.day).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

/** True when the filing date is after the state deadline. */
export function filedLate(d: PropertyTaxApplication): boolean {
  const deadline = filingDeadline(d);
  return (
    deadline !== null && nonEmpty(d.filing.filingDate) && (d.filing.filingDate as string) > deadline
  );
}

const yes = (v: string) => v === 'yes';

/** Exemption ids the applicant claims. */
export function claimedExemptions(d: PropertyTaxApplication): ExemptionId[] {
  const e = d.exemptions;
  const out: ExemptionId[] = [];
  if (yes(e.claimHomestead)) out.push('homestead');
  if (yes(e.claimSenior)) out.push('senior');
  if (yes(e.claimDisability)) out.push('disability');
  if (yes(e.claimVeteran)) out.push('veteran');
  if (yes(e.claimCircuitBreaker)) out.push('circuit-breaker');
  return out;
}

/** Base-eligibility failures (all exemptions need them). */
export function ownershipFails(d: PropertyTaxApplication): boolean {
  return d.property.ownerOnAssessmentDate === 'no';
}
export function occupancyFails(d: PropertyTaxApplication): boolean {
  return d.property.occupiedAsPrimaryResidence === 'no';
}
export function duplicateHomestead(d: PropertyTaxApplication): boolean {
  return d.property.otherHomesteadClaimed === 'yes';
}
export function baseFails(d: PropertyTaxApplication): boolean {
  return ownershipFails(d) || occupancyFails(d) || duplicateHomestead(d);
}

/** Base questions not yet answered. */
export function baseUnanswered(d: PropertyTaxApplication): boolean {
  const p = d.property;
  return (
    p.ownerOnAssessmentDate === '' ||
    p.occupiedAsPrimaryResidence === '' ||
    p.otherHomesteadClaimed === ''
  );
}

/** Required identification fields that are still empty (labels). */
export function missingRequired(d: PropertyTaxApplication): string[] {
  const out: string[] = [];
  if (!nonEmpty(d.applicant.applicantName)) out.push('applicant name');
  if (!nonEmpty(d.property.state)) out.push('state');
  if (!nonEmpty(d.property.county)) out.push('county');
  if (!nonEmpty(d.property.parcelNumber)) out.push('parcel number');
  if (!nonEmpty(d.property.propertyAddress)) out.push('property address');
  if (!isNum(d.filing.assessmentYear)) out.push('assessment year');
  if (!nonEmpty(d.filing.filingDate)) out.push('filing date');
  return out;
}

/** True when the exemption is income-tested in this state. */
export function incomeTested(d: PropertyTaxApplication, id: ExemptionId): boolean {
  const rule = stateRule(d);
  return (
    rule.incomeLimit !== null &&
    (id === 'senior' || id === 'disability' || id === 'circuit-breaker')
  );
}

/**
 * Status of one claimed exemption: 'pass', 'fail' or 'unknown' (an answer the
 * test needs is still missing), with a reason.
 */
export function exemptionStatus(d: PropertyTaxApplication, id: ExemptionId): ExemptionStatus {
  const rule = stateRule(d);
  const income = d.income.householdIncomeDollars;
  const age = d.applicant.ageOnAssessmentDate;
  if (incomeTested(d, id) && id !== 'senior' && !isNum(income)) {
    return { status: 'unknown', reason: 'income-missing' };
  }
  if (id === 'homestead') return { status: 'pass', reason: '' };
  if (id === 'senior') {
    if (!rule.seniorProgram) return { status: 'fail', reason: 'no-program' };
    if (!isNum(age)) return { status: 'unknown', reason: 'age-missing' };
    if (rule.seniorAge !== null && age < rule.seniorAge) return { status: 'fail', reason: 'age' };
    if (incomeTested(d, id)) {
      if (!isNum(income)) return { status: 'unknown', reason: 'income-missing' };
      if (income > (rule.incomeLimit as number)) return { status: 'fail', reason: 'income' };
    }
    return { status: 'pass', reason: '' };
  }
  if (id === 'veteran') {
    const pct = d.exemptions.veteranDisabilityPercent;
    if (!isNum(pct)) return { status: 'unknown', reason: 'rating-missing' };
    if (pct < VETERAN_MIN_PERCENT) return { status: 'fail', reason: 'rating' };
    return { status: 'pass', reason: '' };
  }
  if (id === 'circuit-breaker' && !rule.circuitBreaker)
    return { status: 'fail', reason: 'no-program' };
  if (incomeTested(d, id) && (income as number) > (rule.incomeLimit as number))
    return { status: 'fail', reason: 'income' };
  return { status: 'pass', reason: '' };
}

/** Claimed exemptions that pass, as ids. */
export function qualifyingExemptions(d: PropertyTaxApplication): ExemptionId[] {
  return claimedExemptions(d).filter((id) => exemptionStatus(d, id).status === 'pass');
}

/** Proof documents the claimed exemptions need, as [field, label] pairs. */
export function requiredDocuments(
  d: PropertyTaxApplication
): [keyof PropertyTaxApplication['documents'], string][] {
  const claimed = claimedExemptions(d);
  const need: [keyof PropertyTaxApplication['documents'], string][] = [
    ['proofOfOwnership', 'proof of ownership'],
    ['proofOfResidency', 'proof of residency']
  ];
  if (claimed.includes('senior')) need.push(['proofOfAge', 'proof of age']);
  if (claimed.some((c) => c === 'senior' || c === 'disability' || c === 'circuit-breaker')) {
    need.push(['proofOfIncome', 'proof of income']);
  }
  if (claimed.includes('disability') || claimed.includes('veteran')) {
    need.push(['proofOfDisability', 'proof of disability or VA rating']);
  }
  return need;
}

/** Labels of required documents not marked attached. */
export function missingDocuments(d: PropertyTaxApplication): string[] {
  return requiredDocuments(d)
    .filter(([f]) => d.documents[f] !== 'yes')
    .map(([, label]) => label);
}

/** True when the declaration is signed and the false-statement penalty acknowledged. */
export function declarationComplete(d: PropertyTaxApplication): boolean {
  return (
    yes(d.declaration.signedByApplicant) &&
    yes(d.declaration.penaltyAcknowledged) &&
    nonEmpty(d.declaration.signatureDate)
  );
}
