// Flagged-issue detection for the Workplace Climate Assessment.
//
// Flags surface notable issues to HR / leadership reviewers AFTER the
// composite and per-domain scores have been computed by grader.js.
//
// Priority ladder (per AGENTS.md spec):
//
//   high   - composite category 'critical', OR ≥2 graded domains at
//            'critical', OR any psychological-safety item rated 1, OR
//            any inclusion-and-belonging item rated 1.
//   medium - composite category 'strained', OR explicit leadership
//            concerns (Leadership domain at 'strained' or 'critical',
//            or any individual leadership item rated 1), OR retention /
//            recommendation risk (would NOT recommend as a place to work).
//   low    - free-text suggestion-box ideas (so HR can triage them), or
//            free-text that may identify the respondent and break
//            anonymity.
//
// Free-text scanning is intentionally lightweight — the survey is
// anonymous, so reviewers should be told if a comment looks like it
// names a person, contains contact details, or mentions employee /
// staff numbers.

/**
 * @typedef {import('./types.js').AssessmentData}   AssessmentData
 * @typedef {import('./types.js').AdditionalFlag}   AdditionalFlag
 * @typedef {import('./types.js').DomainScores}     DomainScores
 * @typedef {import('./types.js').ClimateCategory}  ClimateCategory
 */

// Wrapped in an IIFE; published via window.WorkplaceClimateAssessment.

const DOMAIN_LABELS = {
  leadership:    'Leadership & Management',
  psychSafety:   'Psychological Safety',
  inclusion:     'Inclusion & Belonging',
  communication: 'Communication',
  collaboration: 'Collaboration & Teamwork',
  recognition:   'Recognition & Reward',
  wellbeing:     'Wellbeing',
  career:        'Career Development'
};

// Patterns suggesting the employee accidentally entered identifying
// details. Anonymity is the design intent of this assessment, so reviewers
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
 *   category: ClimateCategory,
 *   domainScores: DomainScores,
 *   answeredCount: number
 * }} grading
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, grading) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  const domains = grading.domainScores || {};

  // ─── Composite-level ─────────────────────────────────────────
  if (grading.category === 'critical') {
    flags.push({
      id: 'FLAG-COMPOSITE-CRITICAL',
      category: 'Overall',
      message: `Composite climate score ${grading.compositeScore ?? '?'}/100 is in the critical band. Urgent organisational action recommended.`,
      priority: 'high'
    });
  } else if (grading.category === 'strained') {
    flags.push({
      id: 'FLAG-COMPOSITE-STRAINED',
      category: 'Overall',
      message: `Composite climate score ${grading.compositeScore ?? '?'}/100 is in the strained band. Targeted intervention recommended.`,
      priority: 'medium'
    });
  }

  // ─── Per-domain roll-up ──────────────────────────────────────
  /** @type {string[]} */
  const criticalDomains = [];
  /** @type {string[]} */
  const strainedDomains = [];

  for (const key of Object.keys(DOMAIN_LABELS)) {
    const r = domains[key];
    if (!r) continue;
    if (r.category === 'critical') criticalDomains.push(key);
    else if (r.category === 'strained') strainedDomains.push(key);
  }

  if (criticalDomains.length >= 2) {
    flags.push({
      id: 'FLAG-DOMAIN-CRITICAL-MULTI',
      category: 'Overall',
      message: `${criticalDomains.length} graded domains at critical (${criticalDomains.map((k) => DOMAIN_LABELS[k]).join(', ')}) — broad organisational issue.`,
      priority: 'high'
    });
  }

  for (const key of criticalDomains) {
    flags.push({
      id: `FLAG-DOMAIN-CRITICAL-${key}`,
      category: DOMAIN_LABELS[key],
      message: `${DOMAIN_LABELS[key]} at critical (${domains[key].score ?? '?'}/100). Immediate review recommended.`,
      priority: 'high'
    });
  }

  for (const key of strainedDomains) {
    flags.push({
      id: `FLAG-DOMAIN-STRAINED-${key}`,
      category: DOMAIN_LABELS[key],
      message: `${DOMAIN_LABELS[key]} at strained (${domains[key].score ?? '?'}/100). Targeted improvement recommended.`,
      priority: 'medium'
    });
  }

  // ─── Psychological-safety items rated "Strongly disagree" ────
  // Any single PS item at 1 is a high-priority signal — psychological
  // safety is foundational, and even one "strongly disagree" warrants
  // attention regardless of the domain mean.
  if (data.psychSafety) {
    const psKeys = ['ps1', 'ps2', 'ps3', 'ps4', 'ps5'];
    const stronglyDisagreePs = psKeys.filter((k) => data.psychSafety[k] === 1);
    if (stronglyDisagreePs.length > 0) {
      flags.push({
        id: 'FLAG-PSYCH-SAFETY-STRONG-DISAGREE',
        category: DOMAIN_LABELS.psychSafety,
        message: `Strong disagreement on ${stronglyDisagreePs.length} psychological-safety item${stronglyDisagreePs.length === 1 ? '' : 's'}. People may not feel safe speaking up — investigate immediately.`,
        priority: 'high'
      });
    }
  }

  // ─── Inclusion items rated "Strongly disagree" ───────────────
  if (data.inclusion) {
    const inKeys = ['in1', 'in2', 'in3', 'in4', 'in5'];
    const stronglyDisagreeIn = inKeys.filter((k) => data.inclusion[k] === 1);
    if (stronglyDisagreeIn.length > 0) {
      flags.push({
        id: 'FLAG-INCLUSION-STRONG-DISAGREE',
        category: DOMAIN_LABELS.inclusion,
        message: `Strong disagreement on ${stronglyDisagreeIn.length} inclusion-and-belonging item${stronglyDisagreeIn.length === 1 ? '' : 's'}. Possible exclusion, unfairness or unaddressed misconduct — investigate immediately.`,
        priority: 'high'
      });
    }
  }

  // ─── Leadership-specific concerns ────────────────────────────
  if (data.leadership) {
    const ldKeys = ['ld1', 'ld2', 'ld3', 'ld4', 'ld5'];
    const stronglyDisagreeLd = ldKeys.filter((k) => data.leadership[k] === 1);
    const ldCat = domains.leadership ? domains.leadership.category : '';
    const alreadyFlagged = ldCat === 'strained' || ldCat === 'critical';
    if (stronglyDisagreeLd.length > 0 && !alreadyFlagged) {
      flags.push({
        id: 'FLAG-LEADERSHIP-STRONG-DISAGREE',
        category: DOMAIN_LABELS.leadership,
        message: `Strong disagreement on ${stronglyDisagreeLd.length} leadership item${stronglyDisagreeLd.length === 1 ? '' : 's'}. Review line-management quality and senior-leadership trust.`,
        priority: 'medium'
      });
    }
  }

  // ─── Recommend / retention risk ──────────────────────────────
  const recommend = data.overall ? data.overall.recommendAsPlaceToWork : '';
  if (recommend === 'definitely-not' || recommend === 'probably-not') {
    flags.push({
      id: 'FLAG-RECOMMEND-RISK',
      category: 'Retention',
      message: `Respondent would ${recommend === 'definitely-not' ? 'definitely not' : 'probably not'} recommend this organisation as a place to work. Investigate retention drivers in this segment.`,
      priority: 'medium'
    });
  }

  // ─── Free-text suggestion box ────────────────────────────────
  const strength    = (data.overall && data.overall.biggestStrength) || '';
  const improvement = (data.overall && data.overall.biggestImprovement) || '';
  const otherText   = (data.overall && data.overall.otherComments) || '';
  const allText     = [strength, improvement, otherText].join('\n').trim();

  if (improvement.trim() || strength.trim()) {
    flags.push({
      id: 'FLAG-TEXT-SUGGESTION',
      category: 'Suggestion box',
      message: 'Respondent submitted free-text feedback (strength and/or improvement) — route to the relevant team for triage.',
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
