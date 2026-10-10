import { CRITERIA, SECTIONS } from './criteria.js';
import { detectFlags } from './flags.js';

// DTAC grader. Pure and deterministic.
// Per-criterion status -> section result -> overall outcome.
//   does-not-meet : any applicable mandatory criterion is not-met
//   incomplete    : otherwise, any applicable mandatory criterion unanswered
//   conditional   : otherwise, any applicable mandatory criterion partially-met
//   meets         : every applicable mandatory criterion met

const OUTCOME_LABELS = {
  'meets': 'Meets the criteria',
  'conditional': 'Meets with conditions',
  'does-not-meet': 'Does not meet the criteria',
  'incomplete': 'Incomplete'
};

function sectionResult(items, criteria) {
  const applicable = items.filter((c) => criteria[c.id] !== 'not-applicable');
  const mand = applicable.filter((c) => c.mandatory);
  if (mand.some((c) => criteria[c.id] === 'not-met')) return 'not-met';
  if (mand.some((c) => criteria[c.id] === '')) return 'incomplete';
  const all = applicable;
  if (all.every((c) => criteria[c.id] === 'met')) return 'met';
  return 'partially-met';
}

function calculateGrade(data) {
  const criteria = data.criteria;
  const firedRules = [];
  let mandatoryTotal = 0, mandatoryMet = 0, advisoryTotal = 0, advisoryMet = 0;
  for (const c of CRITERIA) {
    const status = criteria[c.id] || '';
    if (status === 'not-applicable') continue;
    if (c.mandatory) { mandatoryTotal++; if (status === 'met') mandatoryMet++; }
    else { advisoryTotal++; if (status === 'met') advisoryMet++; }
    if (status === 'not-met' || status === 'partially-met') {
      firedRules.push({
        ruleId: 'R-' + c.id.toUpperCase() + '-' + (status === 'not-met' ? 'NOT-MET' : 'PARTIAL'),
        section: c.section,
        criterionId: c.id,
        status,
        mandatory: c.mandatory,
        description: c.description
      });
    }
  }
  const sections = {};
  for (const s of SECTIONS) {
    sections[s.id] = sectionResult(CRITERIA.filter((c) => c.section === s.id), criteria);
  }
  const mand = CRITERIA.filter((c) => c.mandatory && criteria[c.id] !== 'not-applicable');
  let outcome = 'meets';
  if (mand.some((c) => criteria[c.id] === 'not-met')) outcome = 'does-not-meet';
  else if (mand.some((c) => !criteria[c.id])) outcome = 'incomplete';
  else if (mand.some((c) => criteria[c.id] === 'partially-met')) outcome = 'conditional';

  const result = {
    outcome,
    outcomeLabel: OUTCOME_LABELS[outcome],
    mandatoryTotal, mandatoryMet, advisoryTotal, advisoryMet,
    sections,
    firedRules,
    flags: []
  };
  result.flags = detectFlags(data, result);
  return result;
}

export { calculateGrade, sectionResult, OUTCOME_LABELS };
