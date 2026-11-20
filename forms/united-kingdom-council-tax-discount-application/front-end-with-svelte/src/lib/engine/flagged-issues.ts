import type { Application, FlaggedIssue, Priority } from './types';
import {
  ageStatusMismatches,
  countedAdults,
  disqualifiers,
  disregardedWithoutEvidence,
  isBackdated,
  missingItems,
  studentCourseQualifies,
  studentEvidenceStarted
} from './ctda-rules';
import { claimTypeLabel } from './utils';

// Flagged-issue detection (eligibility, evidence and governance). Independent
// of the eligibility class (which the grader produces), this module raises
// applicant- and officer-facing flags per spec §5:
//
//   - adult-count-mismatch (high)    — counted adults do not fit the claim type.
//   - not-main-residence (high)      — the property is not the main home.
//   - student-evidence (high)        — certificate missing or course too short.
//   - smi-evidence (high)            — certificate or qualifying benefit missing.
//   - disability-adaptation (high)   — no qualifying adaptation or main home.
//   - disregard-evidence (medium)    — a disregarded occupant has no evidence.
//   - age-status-mismatch (medium)   — date of birth conflicts with status.
//   - backdating (medium)            — effective date before application date.
//   - care-leaver-age (medium)       — care leaver aged 25 or over.
//   - duty-to-report-changes (medium)— the 21-day duty is not accepted.
//   - fraud-warning (medium)         — the penalty warning is not acknowledged.
//   - band-a-percentage (low)        — Band A gets 17% off, not a band drop.
//   - means-tested (low)             — Council Tax Reduction is decided by income.
//   - incomplete-application (low)   — identity or property details missing.
//
// Rows here mirror the `united_kingdom_council_tax_discount_application_grade_flag`
// SQL table (flag_id, category, priority, description, suggested_action). NOTHING
// here awards a discount; the billing authority decides.

const RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function detectFlaggedIssues(a: Application): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const t = a.claim.claimType;
  const dq = disqualifiers(a);
  const has = (code: string) => dq.some((d) => d.code === code);

  // ─── Adult count versus claim type (HIGH) ───────────────────
  if (has('adult-count') || has('no-student')) {
    const adults = countedAdults(a);
    flags.push({
      id: 'F-ADULT-COUNT-MISMATCH-001',
      category: 'adult-count-mismatch',
      priority: 'high',
      description: `${adults} counted adult(s) on the roster does not fit the claim "${claimTypeLabel(t)}".`,
      suggestedAction:
        "Check each occupant's status. Disregarded people do not count; if the claim is wrong, choose the discount that fits (25% for one counted adult, 50% when everyone is disregarded)."
    });
  }

  // ─── Not the main residence (HIGH) ──────────────────────────
  if (has('not-main-residence')) {
    flags.push({
      id: 'F-NOT-MAIN-RESIDENCE-001',
      category: 'not-main-residence',
      priority: 'high',
      description: "The property is not the applicant's main home.",
      suggestedAction:
        'Discounts apply to a main home. Contact the billing authority about a second home or empty property charge.'
    });
  }

  // ─── Student evidence (HIGH) ────────────────────────────────
  if (
    t === 'student-exemption' &&
    (a.evidence.studentCertificate !== 'yes' ||
      (studentEvidenceStarted(a) && !studentCourseQualifies(a)))
  ) {
    flags.push({
      id: 'F-STUDENT-EVIDENCE-001',
      category: 'student-evidence',
      priority: 'high',
      description:
        a.evidence.studentCertificate !== 'yes'
          ? 'No student certificate from the course provider is held.'
          : 'The course does not meet the full-time criteria of at least 1 year and 21 hours of study a week.',
      suggestedAction:
        'Ask the course provider for a student certificate that states the course length and weekly hours.'
    });
  }

  // ─── Severe mental impairment evidence (HIGH) ───────────────
  if (
    t === 'severe-mental-impairment' &&
    (a.evidence.smiCertificate !== 'yes' || a.evidence.qualifyingBenefit !== 'yes')
  ) {
    flags.push({
      id: 'F-SMI-EVIDENCE-001',
      category: 'smi-evidence',
      priority: 'high',
      description:
        "Severe mental impairment needs a registered medical practitioner's certificate and a qualifying benefit.",
      suggestedAction:
        'Ask a doctor for the certificate and send proof of the qualifying benefit (for example Attendance Allowance or the PIP daily living component).'
    });
  }

  // ─── Disability adaptation (HIGH) ───────────────────────────
  if (
    t === 'disabled-band-reduction' &&
    (a.evidence.disabilityAdaptation === 'none' || a.evidence.disabledPersonMainHome === 'no')
  ) {
    flags.push({
      id: 'F-DISABILITY-ADAPTATION-001',
      category: 'disability-adaptation',
      priority: 'high',
      description:
        "The band reduction needs an extra bathroom, kitchen, room or wheelchair space, and must be a disabled person's main home.",
      suggestedAction: 'Describe the adaptation, or withdraw the claim if the property has none.'
    });
  }

  // ─── Disregarded occupant without evidence (MEDIUM) ─────────
  const noEvidence = disregardedWithoutEvidence(a);
  if (noEvidence.length > 0) {
    flags.push({
      id: 'F-DISREGARD-EVIDENCE-001',
      category: 'disregard-evidence',
      priority: 'medium',
      description: `${noEvidence.length} disregarded occupant(s) on the roster have no evidence held.`,
      suggestedAction:
        'Gather the certificate or declaration for each student, severely mentally impaired person, apprentice or care leaver.'
    });
  }

  // ─── Age and status mismatch (MEDIUM) ───────────────────────
  const mismatches = ageStatusMismatches(a);
  if (mismatches.length > 0) {
    flags.push({
      id: 'F-AGE-STATUS-MISMATCH-001',
      category: 'age-status-mismatch',
      priority: 'medium',
      description: `${mismatches.length} occupant(s) have a date of birth that conflicts with their stated status.`,
      suggestedAction: 'Check the dates of birth and statuses on the roster.'
    });
  }

  // ─── Backdating (MEDIUM) ────────────────────────────────────
  if (isBackdated(a)) {
    flags.push({
      id: 'F-BACKDATING-001',
      category: 'backdating',
      priority: 'medium',
      description: 'The discount is requested from a date before the application.',
      suggestedAction:
        "Backdating is at the authority's discretion. Send evidence that the circumstances applied throughout the period."
    });
  }

  // ─── Care leaver age (MEDIUM) ───────────────────────────────
  if (has('care-leaver-age')) {
    flags.push({
      id: 'F-CARE-LEAVER-AGE-001',
      category: 'care-leaver-age',
      priority: 'medium',
      description: 'Care leaver relief is for care leavers under 25.',
      suggestedAction:
        'Ask the billing authority whether any local scheme covers an older care leaver.'
    });
  }

  // ─── Duty to report changes (MEDIUM) ────────────────────────
  if (a.declaration.agreesToReportChanges !== 'yes') {
    flags.push({
      id: 'F-DUTY-TO-REPORT-CHANGES-001',
      category: 'duty-to-report-changes',
      priority: 'medium',
      description: 'The duty to report a change in circumstances within 21 days is not accepted.',
      suggestedAction:
        'Tell the billing authority within 21 days of any change, such as someone moving in or a student finishing a course; a penalty can follow.'
    });
  }

  // ─── Fraud warning (MEDIUM) ─────────────────────────────────
  if (a.declaration.fraudWarningAcknowledged !== 'yes') {
    flags.push({
      id: 'F-FRAUD-WARNING-001',
      category: 'fraud-warning',
      priority: 'medium',
      description: 'The penalty and prosecution warning for false information is not acknowledged.',
      suggestedAction:
        'Read the warning: giving false information can lead to a penalty and prosecution, and a wrongly received discount must be repaid.'
    });
  }

  // ─── Band A percentage (LOW) ────────────────────────────────
  if (t === 'disabled-band-reduction' && a.property.band === 'A') {
    flags.push({
      id: 'F-BAND-A-PERCENTAGE-001',
      category: 'band-a-percentage',
      priority: 'low',
      description: 'A Band A property cannot drop a band; a 17% reduction applies instead.',
      suggestedAction: 'No action needed; the authority applies the 17% reduction.'
    });
  }

  // ─── Means-tested (LOW) ─────────────────────────────────────
  if (t === 'council-tax-reduction') {
    flags.push({
      id: 'F-MEANS-TESTED-001',
      category: 'means-tested',
      priority: 'low',
      description:
        "Council Tax Reduction depends on income, savings and household, under the authority's local scheme.",
      suggestedAction:
        'Expect to be asked for income, savings and benefit details; the authority decides the award.'
    });
  }

  // ─── Incomplete application (LOW) ───────────────────────────
  const identity = missingItems(a).filter(
    (m) =>
      [
        'billing-authority',
        'effective-date',
        'applicant-name',
        'postcode',
        'band',
        'claim-type'
      ].indexOf(m.code) !== -1
  );
  if (identity.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-APPLICATION-001',
      category: 'incomplete-application',
      priority: 'low',
      description: `Application details are missing: ${identity.map((m) => m.message.replace(/\.$/, '')).join('; ')}.`,
      suggestedAction: 'Complete the claim, applicant and property sections.'
    });
  }

  // Stable sort: high > medium > low, insertion order within a tier.
  return flags
    .map((f, i) => ({ f, i }))
    .sort((x, y) => RANK[x.f.priority] - RANK[y.f.priority] || x.i - y.i)
    .map((x) => x.f);
}
