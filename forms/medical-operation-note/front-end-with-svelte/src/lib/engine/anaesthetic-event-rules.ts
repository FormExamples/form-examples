import type { CompositeRisk, FiredRule, OperationNote } from './types.js';

/**
 * Parse intra-operative anaesthetic events from
 * `anaesthesia.events` (comma-separated tokens). Each known major event
 * is a high-priority fired rule and lifts composite risk.
 *
 * Tokens (lowercased, trimmed):
 *   failed-intubation, awareness, anaphylaxis, malignant-hyperthermia,
 *   sux-apnoea, hypotension, hypertension, bronchospasm, laryngospasm
 *
 * Major events → composite risk ≥ High-risk.
 * Minor events (hypotension, hypertension, bronchospasm, laryngospasm)
 * → composite risk ≥ Complicated.
 */
const MAJOR = new Set([
  'failed-intubation',
  'awareness',
  'anaphylaxis',
  'malignant-hyperthermia',
  'sux-apnoea',
]);
const MINOR = new Set(['hypotension', 'hypertension', 'bronchospasm', 'laryngospasm']);

export function applyAnaestheticEventRules(data: OperationNote): {
  risk: CompositeRisk;
  firedRules: FiredRule[];
  majorTokens: string[];
  minorTokens: string[];
} {
  const raw = data.anaesthesia.events || '';
  const tokens = raw
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);

  const majorTokens: string[] = [];
  const minorTokens: string[] = [];
  const firedRules: FiredRule[] = [];

  for (const t of tokens) {
    if (MAJOR.has(t)) {
      majorTokens.push(t);
      firedRules.push({
        ruleId: `R-AN-MAJOR-${t.toUpperCase()}`,
        instrument: 'anaesthetic-event',
        grade: 'major',
        category: 'anaesthesia',
        description: `Major anaesthetic event: ${t}`,
      });
    } else if (MINOR.has(t)) {
      minorTokens.push(t);
      firedRules.push({
        ruleId: `R-AN-MINOR-${t.toUpperCase()}`,
        instrument: 'anaesthetic-event',
        grade: 'minor',
        category: 'anaesthesia',
        description: `Minor anaesthetic event: ${t}`,
      });
    }
  }

  let risk: CompositeRisk = 'routine';
  if (majorTokens.length > 0) risk = 'high-risk';
  else if (minorTokens.length > 0) risk = 'complicated';

  return { risk, firedRules, majorTokens, minorTokens };
}
