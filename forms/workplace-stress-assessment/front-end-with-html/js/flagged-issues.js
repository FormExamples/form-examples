// Flagged-issue detection for the Workplace Stress Assessment.
//
// These flags are computed AFTER the per-domain mean has been graded (by
// stress-grader.js). They surface domain-level concerns to occupational
// health / HR staff and detect free-text indicators of distress or breach
// of anonymity in the closing comments step.
//
// Priority ladder:
//
//   high   - any domain at 'very-high' concern, OR ≥3 domains at 'high+',
//            OR explicit signs of bullying / harassment in Relationships,
//            OR distress wording in free-text.
//   medium - 1-2 domains at 'high' concern, OR Role-Clarity domain at
//            'high'/'very-high' (clarity gaps frequently cascade), OR
//            Manager-Support 'high'+.
//   low    - mild or moderate-only concerns, identifying details in the
//            anonymous comments box (we can't redact for the dashboard,
//            but we do flag it so reviewers know).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').DomainResults} DomainResults
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 */

// Wrapped in an IIFE; published via window.WorkplaceStressAssessment.
(function () {
'use strict';
const NS = window.WorkplaceStressAssessment = window.WorkplaceStressAssessment || {};
const { riskLevelLabel } = NS;

const DOMAIN_LABELS = {
  demands: 'Demands',
  control: 'Control',
  managerSupport: 'Manager Support',
  peerSupport: 'Peer Support',
  relationships: 'Relationships',
  role: 'Role Clarity',
  change: 'Organisational Change'
};

// Words / phrases in a free-text comment that may indicate the employee
// is in distress and should be offered immediate support.
const DISTRESS_PATTERNS = [
  /\bsuicid/i,
  /\bself[\s-]?harm/i,
  /\bbreakdown\b/i,
  /\bcan(?:'?t| ?not) cope\b/i,
  /\bcannot cope\b/i,
  /\bdesperate\b/i,
  /\bhopeless\b/i,
  /\bworthless\b/i,
  /\bpanic attack/i,
  /\bdepressed\b/i,
  /\bmental(?:ly)? ill/i,
  /\bnervous breakdown\b/i,
  /\bharass(ed|ment|ing)\b/i,
  /\bbull(?:y|ied|ying)\b/i
];

// Patterns suggesting the employee has accidentally entered identifying
// details (their own name, manager's name, employee id etc.). The form is
// designed to be anonymous so reviewers should be alerted to redact.
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
 * @param {DomainResults} domains
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, domains) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Domain-level concern roll-up ─────────────────────────────
  /** @type {string[]} */
  const veryHighDomains = [];
  /** @type {string[]} */
  const highDomains = [];

  for (const key of Object.keys(DOMAIN_LABELS)) {
    const r = domains?.[key];
    if (!r) continue;
    if (r.category === 'very-high') veryHighDomains.push(key);
    else if (r.category === 'high') highDomains.push(key);
  }

  for (const key of veryHighDomains) {
    flags.push({
      id: `FLAG-DOMAIN-VH-${key}`,
      category: DOMAIN_LABELS[key],
      message: `${DOMAIN_LABELS[key]} domain at very-high concern (mean ${domains[key].mean ?? '?'}). Immediate review recommended.`,
      priority: 'high'
    });
  }

  if (highDomains.length + veryHighDomains.length >= 3) {
    flags.push({
      id: 'FLAG-DOMAIN-MULTI',
      category: 'Overall',
      message: `${highDomains.length + veryHighDomains.length} domains at high or very-high concern — broad organisational stressor pattern.`,
      priority: 'high'
    });
  }

  for (const key of highDomains) {
    // Role clarity and manager support are weighted as higher-impact when
    // they appear at 'high', because they cascade into other domains.
    const isCascading = (key === 'role' || key === 'managerSupport');
    flags.push({
      id: `FLAG-DOMAIN-H-${key}`,
      category: DOMAIN_LABELS[key],
      message: `${DOMAIN_LABELS[key]} domain at high concern (mean ${domains[key].mean ?? '?'}).` +
               (isCascading ? ' Consider prioritising — this domain frequently amplifies other stressors.' : ''),
      priority: isCascading ? 'medium' : 'medium'
    });
  }

  // ─── Bullying / harassment items in Relationships domain ─────
  // rel1 (harassment) and rel3 (bullying) are reverse-scored, so a *raw*
  // value of 4 (Often) or 5 (Always) is a direct, individually-reported
  // experience of mistreatment and should be flagged regardless of the
  // domain mean.
  if (data.relationships) {
    const rawRel1 = data.relationships.rel1;
    const rawRel3 = data.relationships.rel3;
    if (rawRel1 !== null && rawRel1 !== undefined && rawRel1 >= 4) {
      flags.push({
        id: 'FLAG-REL-HARASS',
        category: 'Relationships',
        message: 'Employee reports being subject to personal harassment "often" or "always". Safeguarding review recommended.',
        priority: 'high'
      });
    }
    if (rawRel3 !== null && rawRel3 !== undefined && rawRel3 >= 4) {
      flags.push({
        id: 'FLAG-REL-BULLY',
        category: 'Relationships',
        message: 'Employee reports being subject to bullying at work "often" or "always". Safeguarding review recommended.',
        priority: 'high'
      });
    }
  }

  // ─── Free-text scanning (Step 9 comments) ─────────────────────
  const allText = [
    data.additionalComments?.mostStressfulAspect ?? '',
    data.additionalComments?.suggestionsForImprovement ?? '',
    data.additionalComments?.otherComments ?? ''
  ].join('\n');

  if (allText.trim()) {
    for (const pat of DISTRESS_PATTERNS) {
      if (pat.test(allText)) {
        flags.push({
          id: 'FLAG-TEXT-DISTRESS',
          category: 'Free-text',
          message: 'Open-text comment includes wording that may indicate the employee is in significant distress. Offer confidential support / EAP referral.',
          priority: 'high'
        });
        break;
      }
    }

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

  // ─── Catch-all: only moderate concerns, no other flags ────────
  if (flags.length === 0) {
    const moderateCount = Object.values(domains || {})
      .filter((r) => r && r.category === 'moderate').length;
    if (moderateCount >= 2) {
      flags.push({
        id: 'FLAG-DOMAIN-MOD',
        category: 'Overall',
        message: `${moderateCount} domains at moderate concern — monitor and re-survey in three months.`,
        priority: 'low'
      });
    }
  }

  // Sort: high > medium > low.
  const order = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => order[a.priority] - order[b.priority]);

  return flags;
}

NS.detectAdditionalFlags = detectAdditionalFlags;
})();
