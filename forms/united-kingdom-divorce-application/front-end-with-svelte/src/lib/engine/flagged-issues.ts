import type { DivorceApplication, FlaggedIssue } from './types';
import {
  certificateHeld,
  childrenArrangementsOpen,
  conditionalOrderDate,
  feeOutstanding,
  finalOrderDate,
  finalOrderDeadline,
  finalOrderOverdue,
  financialOrderOutstanding,
  jointDespiteAbuse,
  jurisdictionMet,
  jurisdictionUnanswered,
  nameProofMissing,
  oneYearDate,
  serviceAddressProblem,
  translationMissing
} from './divorce-rules';

// Flagged-issue detection (eligibility, documents, service, safeguarding and
// timing). Independent of the application class (which the grader produces),
// this module raises applicant- and caseworker-facing flags per spec section 5:
//
//   - Marriage under one year (high)            - the one-year rule is not met.
//   - Reflection period running (high)          - 20 weeks have not passed.
//   - Final-order wait running (high)           - 6 weeks and 1 day have not passed.
//   - Relationship not recognised / breakdown not stated (high).
//   - Jurisdiction not met (high)               - no England and Wales ground.
//   - Marriage certificate missing (high); certified translation missing (high).
//   - Service address unusable (high)           - sole application.
//   - Joint application despite abuse risk (high).
//   - Financial order reminder (medium; high at the final-order stage).
//   - Children arrangements open (medium); fee outstanding (medium);
//     acknowledgement of service not returned (medium); final-order delay (medium).
//   - Name-change proof missing (low).
//
// Rows here mirror the `united_kingdom_divorce_application_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action). NOTHING here is
// legal advice; the court decides every application.

const RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function detectFlaggedIssues(s: DivorceApplication): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const a = s.application;
  const m = s.marriage;
  const g = s.progress;
  const add = (
    id: string,
    category: string,
    priority: FlaggedIssue['priority'],
    description: string,
    suggestedAction: string
  ) => flags.push({ id, category, priority, description, suggestedAction });

  // Timing gates
  if (
    a.stage === 'application' &&
    !(oneYearDate(s) === '' || a.asOfDate === null) &&
    (a.asOfDate as string) < oneYearDate(s)
  ) {
    add(
      'F-ONE-YEAR-RULE-001',
      'timing',
      'high',
      `The marriage or civil partnership is under one year old; an application cannot be made before ${oneYearDate(s)}.`,
      'Wait until the first anniversary. During the first year you can apply for judicial separation or a nullity order instead.'
    );
  }
  if (
    a.stage === 'conditional-order' &&
    g.applicationIssuedDate !== null &&
    a.asOfDate !== null &&
    (a.asOfDate as string) < conditionalOrderDate(s)
  ) {
    add(
      'F-REFLECTION-PERIOD-001',
      'timing',
      'high',
      `The 20-week reflection period has not ended; a conditional order cannot be applied for before ${conditionalOrderDate(s)}.`,
      'Wait until the 20 weeks since the application was issued have passed, then apply for the conditional order (form D84 or online).'
    );
  }
  if (
    a.stage === 'final-order' &&
    g.conditionalOrderGrantedDate !== null &&
    a.asOfDate !== null &&
    (a.asOfDate as string) < finalOrderDate(s)
  ) {
    add(
      'F-FINAL-ORDER-WAIT-001',
      'timing',
      'high',
      `The 6 weeks and 1 day since the conditional order have not passed; a final order cannot be applied for before ${finalOrderDate(s)}.`,
      'Wait until 43 days after the conditional order, then apply for the final order (form D36 or online).'
    );
  }
  if (a.stage === 'final-order' && finalOrderOverdue(s)) {
    add(
      'F-FINAL-ORDER-DELAY-001',
      'final-order-delay',
      'medium',
      `More than 12 months have passed since the conditional order (the 12 months ended ${finalOrderDeadline(s)}).`,
      'Explain the delay in writing to the court when applying for the final order.'
    );
  }

  // Eligibility
  if (m.legallyRecognised === 'no') {
    add(
      'F-NOT-RECOGNISED-001',
      'relationship-status',
      'high',
      'The marriage or civil partnership is not legally recognised in the United Kingdom.',
      'Take legal advice; a nullity or declaration of status application may be more suitable than a divorce.'
    );
  }
  if (m.breakdownConfirmed === 'no') {
    add(
      'F-BREAKDOWN-NOT-STATED-001',
      'relationship-status',
      'high',
      'The relationship is not stated to have broken down irretrievably, which is the only ground.',
      'A divorce can only be applied for once the applicant states the relationship has broken down irretrievably.'
    );
  }
  if (jointDespiteAbuse(s)) {
    add(
      'F-JOINT-DOMESTIC-ABUSE-001',
      'domestic-abuse',
      'high',
      'A joint application is not suitable where there is a risk of domestic abuse.',
      'Apply as a sole applicant and seek specialist domestic-abuse support; do not ask the other spouse to sign.'
    );
  }

  // Jurisdiction
  if (!jurisdictionMet(s) && !jurisdictionUnanswered(s)) {
    add(
      'F-JURISDICTION-NOT-MET-001',
      'jurisdiction',
      'high',
      'No England and Wales jurisdiction ground is met by the residence and domicile answers given.',
      'Take legal advice: the courts of England and Wales may not be able to hear the application, and another country may have jurisdiction.'
    );
  }

  // Documents
  if (!certificateHeld(s)) {
    add(
      'F-CERTIFICATE-MISSING-001',
      'marriage-certificate',
      'high',
      'The original marriage certificate or a certified copy is not held.',
      'Order a certified copy from the General Register Office or the issuing register office, or from the issuing authority abroad.'
    );
  }
  if (translationMissing(s)) {
    add(
      'F-TRANSLATION-MISSING-001',
      'translation',
      'high',
      'The marriage certificate is not in English and no certified translation is held.',
      "Obtain a certified translation (with the translator's statement of accuracy) and send it with the original certificate."
    );
  }
  if (nameProofMissing(s)) {
    add(
      'F-NAME-CHANGE-PROOF-001',
      'name-change-proof',
      'low',
      'A name has changed since the marriage but no proof is held.',
      'Provide the marriage certificate or the deed poll as proof of the name change.'
    );
  }

  // Service
  if (serviceAddressProblem(s)) {
    add(
      'F-SERVICE-ADDRESS-001',
      'service-address',
      'high',
      "The other spouse's current address (or an email address for online service) is missing or unknown.",
      'Provide a current address or email, or ask the court for permission to use alternative service or to dispense with service.'
    );
  }
  if (
    a.stage === 'conditional-order' &&
    a.applicationMode === 'sole' &&
    g.respondentAcknowledged === 'no'
  ) {
    add(
      'F-ACKNOWLEDGEMENT-001',
      'acknowledgement',
      'medium',
      'The other spouse has not returned the acknowledgement of service (due within 14 days).',
      'Apply for a conditional order with proof of service, or ask the court for deemed or alternative service.'
    );
  }

  // Children, money and fee
  if (childrenArrangementsOpen(s)) {
    add(
      'F-CHILDREN-ARRANGEMENTS-001',
      'children-arrangements',
      'medium',
      'There are children under 18 and the arrangements for them are not agreed.',
      'Try mediation or agree arrangements; if that fails apply separately for a child arrangements order.'
    );
  }
  if (financialOrderOutstanding(s)) {
    const atFinal = a.stage === 'final-order';
    add(
      'F-FINANCIAL-ORDER-REMINDER-001',
      'financial-order',
      atFinal ? 'high' : 'medium',
      atFinal
        ? 'A financial order is wanted but not applied for, and the final order would end the marriage and can remove financial claims such as pension rights.'
        : 'A financial order is wanted or undecided; the divorce does not by itself settle money and property.',
      'Apply for a financial order (a consent order if agreed) before the final order is made, and take legal advice on pensions.'
    );
  }
  if (feeOutstanding(s)) {
    add(
      'F-FEE-001',
      'fee',
      'medium',
      'The application fee (GBP 628 per GOV.UK; check the current fee) has not been paid.',
      'Pay the fee online or by card, or apply for Help with Fees (both spouses must apply for a joint application).'
    );
  }

  return flags
    .map((fl, i) => ({ fl, i }))
    .sort((x, y) => RANK[x.fl.priority] - RANK[y.fl.priority] || x.i - y.i)
    .map((x) => x.fl);
}
