import type {
  AgileChecklist,
  Band,
  GradingResult,
  Maturity,
  SectionScore,
} from './types.js';
import {
  PRACTICES_ITEMS,
  STAKEHOLDERS_ITEMS,
  TEAMS_ITEMS,
  type ItemDef,
  type SectionId,
} from '$lib/config/items.js';
import { applyMaturityRules } from './maturity-rules.js';
import { detectAdditionalFlags } from './flagged-issues.js';

const MIN_ANSWERED_FOR_REPORT = 30;

export function bandFor(percent: number | null): Band {
  if (percent === null) return 'unanswered';
  if (percent >= 75) return 'high';
  if (percent >= 50) return 'mid';
  return 'low';
}

export function deriveMaturity(overallPercent: number | null): Maturity {
  if (overallPercent === null) return 'insufficient-data';
  if (overallPercent >= 90) return 'optimising';
  if (overallPercent >= 75) return 'mature';
  if (overallPercent >= 50) return 'developing';
  if (overallPercent >= 25) return 'initial';
  return 'ad-hoc';
}

function scoreSection(
  section: SectionId,
  items: ItemDef[],
  answers: Record<string, string>,
): SectionScore {
  let yesCount = 0;
  let noCount = 0;
  let notApplicableCount = 0;
  let unansweredCount = 0;

  for (const item of items) {
    const answer = answers[item.id] ?? '';
    if (answer === 'yes') yesCount += 1;
    else if (answer === 'no') noCount += 1;
    else if (answer === 'not-applicable') notApplicableCount += 1;
    else unansweredCount += 1;
  }

  const applicableCount = yesCount + noCount;
  const percent = applicableCount === 0 ? null : round2((yesCount / applicableCount) * 100);
  return {
    section,
    yesCount,
    noCount,
    notApplicableCount,
    unansweredCount,
    applicableCount,
    percent,
    band: bandFor(percent),
  };
}

export function calculateMaturity(data: AgileChecklist): GradingResult {
  const teams = scoreSection('teams', TEAMS_ITEMS, data.answers);
  const stakeholders = scoreSection('stakeholders', STAKEHOLDERS_ITEMS, data.answers);
  const practices = scoreSection('practices', PRACTICES_ITEMS, data.answers);

  const answeredCount =
    teams.yesCount + teams.noCount + teams.notApplicableCount +
    stakeholders.yesCount + stakeholders.noCount + stakeholders.notApplicableCount +
    practices.yesCount + practices.noCount + practices.notApplicableCount;

  const sectionPercents = [teams.percent, stakeholders.percent, practices.percent];
  const definedPercents = sectionPercents.filter((p): p is number => p !== null);

  const haveAllSections = definedPercents.length === 3;
  const overallPercent =
    haveAllSections && answeredCount >= MIN_ANSWERED_FOR_REPORT
      ? round2(definedPercents.reduce((a, b) => a + b, 0) / definedPercents.length)
      : null;

  const maturity = deriveMaturity(overallPercent);

  const { firedRules } = applyMaturityRules({ teams, stakeholders, practices });
  const additionalFlags = detectAdditionalFlags(data, {
    teams,
    stakeholders,
    practices,
    answeredCount,
  });

  return {
    answeredCount,
    teams,
    stakeholders,
    practices,
    overallPercent,
    maturity,
    firedRules,
    additionalFlags,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
