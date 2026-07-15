// Flagged-issue detection for the Employee Satisfaction Survey.
//
// Flags surface notable issues to HR / engagement reviewers AFTER the
// composite and per-domain scores have been computed by grader.js.
//
// Priority ladder (per AGENTS.md spec):
//
//   high   - composite category 'very-poor', OR ≥2 graded domains at
//            'very-poor', OR retention intent "leaving within 6 months",
//            OR an eNPS detractor (0-6).
//   medium - composite category 'poor', OR exactly one graded domain at
//            'poor', OR explicit dissatisfaction with management
//            (Management domain at 'poor' or 'very-poor', or any single
//            management item rated 1).
//   low    - free-text suggestion-box ideas (so HR can triage them), or
//            free-text that may identify the respondent and break
//            anonymity.
//
// Free-text scanning is intentionally lightweight — the survey is
// anonymous, so reviewers should be told if a comment looks like it
// names a person, contains contact details, or mentions employee /
// staff numbers.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').DomainScores} DomainScores
 * @typedef {import('./types.js').SatisfactionCategory} SatisfactionCategory
 * @typedef {import('./types.js').ENpsResult} ENpsResult
 */

// Wrapped in an IIFE; published via window.EmployeeSatisfactionSurvey.

const DOMAIN_LABELS = {
  workload: 'Workload & Work-Life Balance',
  management: 'Management & Leadership',
  growth: 'Growth & Development',
  compensation: 'Compensation & Benefits',
  culture: 'Culture & Inclusion',
  environment: 'Environment & Resources',
  recognition: 'Recognition & Engagement',
  overall: 'Overall Experience'
};

// Patterns suggesting the employee accidentally entered identifying
// details. Anonymity is the design intent of this survey, so reviewers
// should be alerted to redact before sharing.
const IDENTIFYING_PATTERNS = [
  /\b(my name is|i am|i'm)\s+[A-Z][a-z]+/,        // "I am John"
  /\b[A-Z][a-z]+\s+[A-Z][a-z]+/,                  // "John Smith"
  /\bemployee\s*(id|number|no\.?)\s*[:#]?\s*\w+/i,
  /\bstaff\s*(id|number|no\.?)\s*[:#]?\s*\w+/i,
  /\bni\s*number\b/i,
  /\b\d{3}[-\s]?\d{3,}\b/,                        // long numeric strings
  /[\w.+-]+@[\w-]+\.[\w.-]+/                      // email address
];

/**
 * @param {AssessmentData} data
 * @param {{
 *   compositeScore: number | null,
 *   category: SatisfactionCategory,
 *   domainScores: DomainScores,
 *   eNPS: ENpsResult,
 *   answeredCount: number
 * }} grading
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, grading) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  const domains = grading.domainScores || {};

  // ─── Composite-level ─────────────────────────────────────────
  if (grading.category === 'very-poor') {
    flags.push({
      id: 'FLAG-COMPOSITE-VP',
      category: 'Overall',
      message: `Composite satisfaction score ${grading.compositeScore ?? '?'}/100 is in the very-poor band. Urgent attention recommended.`,
      priority: 'high'
    });
  } else if (grading.category === 'poor') {
    flags.push({
      id: 'FLAG-COMPOSITE-POOR',
      category: 'Overall',
      message: `Composite satisfaction score ${grading.compositeScore ?? '?'}/100 is in the poor band. Significant improvement areas should be addressed.`,
      priority: 'medium'
    });
  }

  // ─── Per-domain roll-up ──────────────────────────────────────
  /** @type {string[]} */
  const veryPoorDomains = [];
  /** @type {string[]} */
  const poorDomains = [];

  for (const key of Object.keys(DOMAIN_LABELS)) {
    const r = domains[key];
    if (!r) continue;
    if (r.category === 'very-poor') veryPoorDomains.push(key);
    else if (r.category === 'poor') poorDomains.push(key);
  }

  if (veryPoorDomains.length >= 2) {
    flags.push({
      id: 'FLAG-DOMAIN-VP-MULTI',
      category: 'Overall',
      message: `${veryPoorDomains.length} graded domains at very-poor (${veryPoorDomains.map((k) => DOMAIN_LABELS[k]).join(', ')}) — broad organisational issue.`,
      priority: 'high'
    });
  }

  for (const key of veryPoorDomains) {
    flags.push({
      id: `FLAG-DOMAIN-VP-${key}`,
      category: DOMAIN_LABELS[key],
      message: `${DOMAIN_LABELS[key]} at very-poor (${domains[key].score ?? '?'}/100). Immediate review recommended.`,
      priority: 'high'
    });
  }

  // Single-poor domain → medium. Multiple-poor domains still each get a
  // medium flag (the spec calls out "single poor domain" as medium, and
  // doesn't escalate multiple-poor to high — that's reserved for very-poor.)
  for (const key of poorDomains) {
    flags.push({
      id: `FLAG-DOMAIN-POOR-${key}`,
      category: DOMAIN_LABELS[key],
      message: `${DOMAIN_LABELS[key]} at poor (${domains[key].score ?? '?'}/100). Targeted improvement recommended.`,
      priority: 'medium'
    });
  }

  // ─── Management-specific dissatisfaction ─────────────────────
  // Either the whole domain is poor/very-poor (already covered above),
  // or one or more individual management items is rated 1 (Strongly
  // disagree). Surface that explicitly so HR knows to look at line
  // management quality.
  if (data.management) {
    const mgKeys = ['mg1', 'mg2', 'mg3', 'mg4', 'mg5'];
    const stronglyDisagreeMg = mgKeys.filter((k) => data.management[k] === 1);
    const mgCat = domains.management ? domains.management.category : '';
    const alreadyFlagged = mgCat === 'poor' || mgCat === 'very-poor';
    if (stronglyDisagreeMg.length > 0 && !alreadyFlagged) {
      flags.push({
        id: 'FLAG-MGMT-STRONG-DISAGREE',
        category: DOMAIN_LABELS.management,
        message: `Strong disagreement on ${stronglyDisagreeMg.length} management item${stronglyDisagreeMg.length === 1 ? '' : 's'}. Review line-management quality and senior-leadership trust.`,
        priority: 'medium'
      });
    }
  }

  // ─── Retention intent ────────────────────────────────────────
  const retention = data.overall ? data.overall.retentionIntent : '';
  if (retention === 'leaving-within-6-months') {
    flags.push({
      id: 'FLAG-RETENTION-LEAVING',
      category: 'Retention',
      message: 'Respondent is actively planning to leave within 6 months. Consider stay-interview / retention conversation if anonymity allows.',
      priority: 'high'
    });
  } else if (retention === 'probably-leave-12-months') {
    flags.push({
      id: 'FLAG-RETENTION-PROBABLY-LEAVE',
      category: 'Retention',
      message: 'Respondent will probably leave within 12 months. Investigate drivers in this segment.',
      priority: 'medium'
    });
  }

  // ─── eNPS ────────────────────────────────────────────────────
  const enpsScore = grading.eNPS ? grading.eNPS.score : null;
  if (enpsScore !== null && enpsScore !== undefined) {
    if (grading.eNPS.classification === 'detractor') {
      flags.push({
        id: 'FLAG-ENPS-DETRACTOR',
        category: 'eNPS',
        message: `eNPS recommend score ${enpsScore}/10 — respondent is a detractor.`,
        priority: 'high'
      });
    }
  }

  // ─── Free-text scanning (Step 10 comments) ───────────────────
  const suggestions = (data.overall?.suggestionsForImprovement || '').trim();
  const otherText  = (data.overall?.otherComments || '').trim();
  const allText = [suggestions, otherText].join('\n');

  if (suggestions) {
    flags.push({
      id: 'FLAG-TEXT-SUGGESTION',
      category: 'Suggestion box',
      message: 'Respondent submitted improvement suggestions — route to the relevant team for triage.',
      priority: 'low'
    });
  }

  if (allText) {
    for (const pat of IDENTIFYING_PATTERNS) {
      if (pat.test(allText)) {
        flags.push({
          id: 'FLAG-TEXT-PII',
          category: 'Anonymity',
          message: 'Open-text comment may contain identifying details (name, employee id, contact info). Anonymity could be compromised; reviewer should redact before sharing.',
          priority: 'low'
        });
        break;
      }
    }
  }

  // Sort: high > medium > low.
  const order = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => order[a.priority] - order[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
