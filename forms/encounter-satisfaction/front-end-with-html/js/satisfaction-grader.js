import { satisfactionQuestions } from './satisfaction-questions.js';
import { satisfactionCategory } from './types.js';

// ESS (Encounter Satisfaction Score) grader. Pure functions: take an
// `AssessmentData` object and return the composite mean score (1.0-5.0),
// its category, and per-domain breakdowns.
//
// Composite Score = mean of all answered Likert questions.
//
// Categories:
//   4.5 - 5.0 = Excellent
//   3.5 - 4.4 = Good
//   2.5 - 3.4 = Fair
//   1.5 - 2.4 = Poor
//   1.0 - 1.4 = Very Poor

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DomainScore} DomainScore
 */

/**
 * Calculate the composite ESS score, category, and domain breakdown.
 *
 * @param {AssessmentData} data
 * @returns {{ compositeScore: number, category: string,
 *            domainScores: DomainScore[], answeredCount: number }}
 */
function calculateSatisfaction(data) {
  /** @type {Map<string, DomainScore>} */
  const domainMap = new Map();
  let totalSum = 0;
  let totalCount = 0;

  for (const q of satisfactionQuestions) {
    const section = data[q.section];
    if (!section) continue;
    const score = section[q.field];
    if (typeof score !== 'number' || score < 1 || score > 5) continue;

    totalSum += score;
    totalCount++;

    if (!domainMap.has(q.domain)) {
      domainMap.set(q.domain, {
        domain: q.domain,
        mean: 0,
        count: 0,
        questions: []
      });
    }

    const domain = domainMap.get(q.domain);
    domain.count++;
    domain.questions.push({ id: q.id, text: q.text, score });
  }

  for (const domain of domainMap.values()) {
    const sum = domain.questions.reduce((acc, qq) => acc + qq.score, 0);
    domain.mean = parseFloat((sum / domain.count).toFixed(2));
  }

  const compositeScore = totalCount > 0
    ? parseFloat((totalSum / totalCount).toFixed(2))
    : 0;

  const category = totalCount > 0
    ? satisfactionCategory(compositeScore)
    : 'No responses';

  return {
    compositeScore,
    category,
    domainScores: Array.from(domainMap.values()),
    answeredCount: totalCount
  };
}

export { calculateSatisfaction };
