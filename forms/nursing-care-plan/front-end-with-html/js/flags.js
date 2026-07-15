import { classifyProblem, hasEvaluation, hasGoal, hasIntervention } from './rules.js';

// Flagged-issue detection for the Nursing Care Plan.
//
// Emitted independently of the plan status. Each issue carries a priority
// (high / medium / low). The high-priority flags also gate the plan status:
// a plan cannot be graded "complete" while a high-priority flag is raised
// (see grader.js). Rules mirror spec §5 (`../spec/index.md`):
//   - Risk without intervention (high)
//   - High-risk assessment not actioned (high)
//   - Missing evaluation (medium)
//   - Unmet goal overdue for review (medium)
//   - No review date (medium)
//   - Incomplete problem (low)

/**
 * @typedef {import('./types.js').CarePlan} CarePlan
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// The four referenced risk assessments, mapped to the `linkedRisk` code a
// problem uses to claim it.
const RISK_GROUPS = [
  { key: 'fallsRisk', code: 'falls', label: 'Falls' },
  { key: 'pressureUlcerRisk', code: 'pressure-ulcer', label: 'Pressure ulcer' },
  { key: 'vteRisk', code: 'vte', label: 'VTE' },
  { key: 'nutritionRisk', code: 'nutrition', label: 'Nutrition (MUST)' }
];

/** Today's date as an ISO `YYYY-MM-DD` string (local). */
function todayIso() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** True when `iso` is a non-empty date strictly before `ref` (both YYYY-MM-DD). */
function isBefore(iso, ref) {
  return typeof iso === 'string' && iso !== '' && iso < ref;
}

/**
 * Detect all flagged issues for a plan.
 * @param {CarePlan} plan
 * @returns {FlaggedIssue[]}
 */
function detectFlags(plan) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const problems = Array.isArray(plan.problems) ? plan.problems : [];
  const today = todayIso();

  // ─── Risk-assessment flags (high) ───────────────────────────
  for (const group of RISK_GROUPS) {
    const rg = plan[group.key] || {};
    const isHighRisk = rg.done === 'yes' && rg.level === 'high';
    if (!isHighRisk) continue;

    // High-risk assessment not actioned.
    if (rg.actioned === 'no') {
      flags.push({
        id: `FLAG-RISK-NOACTION-${group.code}`,
        category: 'Risk assessment',
        message: `${group.label} assessed high risk but not actioned`,
        priority: 'high'
      });
    }

    // Risk without a linked, intervened problem.
    const covered = problems.some(
      (p) => p.linkedRisk === group.code && hasIntervention(p)
    );
    if (!covered) {
      flags.push({
        id: `FLAG-RISK-NOINTERVENTION-${group.code}`,
        category: 'Risk assessment',
        message: `${group.label} assessed high risk with no linked intervention`,
        priority: 'high'
      });
    }
  }

  // ─── Per-problem flags ──────────────────────────────────────
  problems.forEach((p, idx) => {
    const label = `Problem ${idx + 1}`;

    // Missing evaluation (medium): has goal + intervention but no evaluation.
    if (hasGoal(p) && hasIntervention(p) && !hasEvaluation(p)) {
      flags.push({
        id: `FLAG-NOEVAL-${p.id}`,
        category: 'Evaluation',
        message: `${label} has a goal and intervention but no evaluation recorded`,
        priority: 'medium'
      });
    }

    // Unmet goal overdue for review (medium): problem-level or goal-level.
    let overdue = false;
    if (p.goalMet === 'not-met' && isBefore(p.nextReviewDate, today)) {
      overdue = true;
    }
    if (
      !overdue &&
      Array.isArray(p.goals) &&
      p.goals.some((g) => g.met === 'not-met' && isBefore(g.targetDate, today))
    ) {
      overdue = true;
    }
    if (overdue) {
      flags.push({
        id: `FLAG-OVERDUE-${p.id}`,
        category: 'Review',
        message: `${label} has an unmet goal overdue for review`,
        priority: 'medium'
      });
    }

    // No review date (medium).
    if (!p.nextReviewDate) {
      flags.push({
        id: `FLAG-NOREVIEW-${p.id}`,
        category: 'Review',
        message: `${label} has no next review date set`,
        priority: 'medium'
      });
    }

    // Incomplete problem (low): statement only.
    if (classifyProblem(p) === 'incomplete') {
      flags.push({
        id: `FLAG-INCOMPLETE-${p.id}`,
        category: 'Completeness',
        message: `${label} is incomplete (a problem statement only)`,
        priority: 'low'
      });
    }
  });

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlags };
