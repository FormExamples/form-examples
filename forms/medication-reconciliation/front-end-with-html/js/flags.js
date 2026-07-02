// Safety-flag detection. Emitted independently of the status (spec §5). Each
// flag mirrors a category in the `medication_reconciliation_grade_flag` SQL
// table:
//
//   - high-risk-unintentional-discrepancy  (high)   — unresolved discrepancy on
//                                                      anticoagulant / insulin / opioid
//   - insufficient-sources                 (high)   — sourceCount < 2
//   - allergy-conflict                     (high)   — reconciled medicine matches a
//                                                      documented drug allergy
//   - interaction                          (high/medium) — a clinically significant
//                                                      interaction between two reconciled medicines
//   - therapeutic-duplication              (medium) — same drug / class prescribed twice
//   - unintentional-discrepancy-outstanding(medium) — unintentional discrepancy not
//                                                      otherwise covered by the high-risk flag
//   - allergy-status-not-documented        (low)    — allergyStatus not documented
//   - incomplete                           (low)    — status == 'incomplete'

/**
 * @typedef {import('./types.js').ReconciliationData} ReconciliationData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.MedicationReconciliation.
(function () {
'use strict';
window.MedicationReconciliation = window.MedicationReconciliation || {};

// Clinically significant interaction pairs (substring match on drug names of
// any two reconciled line items). This is a prompt for pharmacist review, not a
// definitive decision-support engine.
const INTERACTION_PAIRS = [
  { a: 'warfarin', b: 'aspirin', priority: 'high', note: 'increased bleeding risk' },
  { a: 'warfarin', b: 'ibuprofen', priority: 'high', note: 'increased bleeding risk' },
  { a: 'warfarin', b: 'naproxen', priority: 'high', note: 'increased bleeding risk' },
  { a: 'warfarin', b: 'clarithromycin', priority: 'high', note: 'raised INR' },
  { a: 'warfarin', b: 'miconazole', priority: 'high', note: 'raised INR' },
  { a: 'methotrexate', b: 'trimethoprim', priority: 'high', note: 'bone-marrow suppression' },
  { a: 'simvastatin', b: 'clarithromycin', priority: 'high', note: 'rhabdomyolysis risk' },
  { a: 'simvastatin', b: 'amlodipine', priority: 'medium', note: 'raised statin exposure' },
  { a: 'spironolactone', b: 'ramipril', priority: 'medium', note: 'hyperkalaemia risk' },
  { a: 'spironolactone', b: 'lisinopril', priority: 'medium', note: 'hyperkalaemia risk' }
];

/** Normalise a drug / substance name for case-insensitive matching. */
function norm(s) {
  return (s || '').trim().toLowerCase();
}

/**
 * @param {ReconciliationData} data
 * @param {GradingResult} grade  - result from calculateReconciliation
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const lineItems = data.lineItems || [];
  const allergies = data.allergies || [];

  // ─── High-risk unintentional discrepancy (HIGH) ─────────────
  if (grade.highRiskUnintentionalCount > 0) {
    flags.push({
      id: 'F-HIGH-RISK-UNINTENTIONAL-001',
      category: 'high-risk-unintentional-discrepancy',
      priority: 'high',
      description: `${grade.highRiskUnintentionalCount} unresolved (unintentional) discrepancy(ies) on an anticoagulant, insulin, or opioid`,
      suggestedAction:
        'Escalate to the prescriber immediately: resolve the high-risk discrepancy and document the intended action and rationale before sign-off.'
    });
  }

  // ─── Insufficient sources (HIGH) ────────────────────────────
  if (grade.sourceCount < 2) {
    flags.push({
      id: 'F-INSUFFICIENT-SOURCES-001',
      category: 'insufficient-sources',
      priority: 'high',
      description: `Best-possible medication history built from ${grade.sourceCount} source(s) — fewer than the two independent sources required`,
      suggestedAction:
        'Obtain at least one further independent source (e.g. GP record, dispensing history, patient interview) and verify the medicines list.'
    });
  }

  // ─── Allergy conflict (HIGH) ────────────────────────────────
  const conflicts = [];
  for (const al of allergies) {
    const sub = norm(al.substance);
    if (sub === '') continue;
    for (const li of lineItems) {
      const drug = norm(li.drugName);
      if (drug === '') continue;
      if (drug.includes(sub) || sub.includes(drug)) {
        conflicts.push(`${li.drugName} vs allergy "${al.substance}"`);
      }
    }
  }
  if (conflicts.length > 0) {
    flags.push({
      id: 'F-ALLERGY-CONFLICT-001',
      category: 'allergy-conflict',
      priority: 'high',
      description: `Reconciled medicine matches a documented allergy: ${conflicts.join('; ')}`,
      suggestedAction:
        'Do not administer the conflicting medicine; confirm the allergy with the patient and select a safe alternative.'
    });
  }

  // ─── Drug interaction (HIGH / MEDIUM) ───────────────────────
  const names = lineItems.map((li) => norm(li.drugName)).filter((n) => n !== '');
  const interactions = [];
  let interactionPriority = 'medium';
  for (const pair of INTERACTION_PAIRS) {
    const hasA = names.some((n) => n.includes(pair.a));
    const hasB = names.some((n) => n.includes(pair.b));
    if (hasA && hasB) {
      interactions.push(`${pair.a} + ${pair.b} (${pair.note})`);
      if (pair.priority === 'high') interactionPriority = 'high';
    }
  }
  if (interactions.length > 0) {
    flags.push({
      id: 'F-INTERACTION-001',
      category: 'interaction',
      priority: interactionPriority,
      description: `Potential clinically significant interaction(s): ${interactions.join('; ')}`,
      suggestedAction:
        'Refer for pharmacist review of the interacting medicines; adjust, monitor, or select an alternative as appropriate.'
    });
  }

  // ─── Therapeutic duplication (MEDIUM) ───────────────────────
  const duplicationDiscrepancy = (data.discrepancies || []).some(
    (d) => d.discrepancyType === 'duplication'
  );
  const seen = new Map();
  let duplicateDrug = '';
  for (const li of lineItems) {
    const drug = norm(li.drugName);
    if (drug === '') continue;
    if (seen.has(drug)) {
      duplicateDrug = li.drugName;
    } else {
      seen.set(drug, true);
    }
  }
  if (duplicationDiscrepancy || duplicateDrug !== '') {
    const detail = duplicationDiscrepancy
      ? 'a duplication discrepancy was classified'
      : `"${duplicateDrug}" appears more than once`;
    flags.push({
      id: 'F-THERAPEUTIC-DUPLICATION-001',
      category: 'therapeutic-duplication',
      priority: 'medium',
      description: `Possible therapeutic duplication — ${detail}`,
      suggestedAction:
        'Confirm whether the same drug or therapeutic class is prescribed twice and rationalise the regimen.'
    });
  }

  // ─── Unintentional discrepancy outstanding (MEDIUM) ─────────
  // Only when there is an outstanding unintentional discrepancy NOT already
  // raised as a high-risk one.
  if (grade.unintentionalCount > 0 && grade.highRiskUnintentionalCount === 0) {
    flags.push({
      id: 'F-UNINTENTIONAL-OUTSTANDING-001',
      category: 'unintentional-discrepancy-outstanding',
      priority: 'medium',
      description: `${grade.unintentionalCount} unintentional discrepancy(ies) outstanding — requires prescriber resolution before sign-off`,
      suggestedAction:
        'Resolve each unintentional discrepancy with the prescriber and document the intended action and rationale.'
    });
  }

  // ─── Allergy status not documented (LOW) ────────────────────
  const allergyStatus = data.allergyReview.allergyStatus;
  if (allergyStatus === 'not-documented' || allergyStatus === '') {
    flags.push({
      id: 'F-ALLERGY-STATUS-001',
      category: 'allergy-status-not-documented',
      priority: 'low',
      description:
        'Neither drug allergies nor "no known drug allergies" have been recorded',
      suggestedAction:
        'Ask the patient about drug allergies and record the allergy status before completing the reconciliation.'
    });
  }

  // ─── Incomplete reconciliation (LOW) ────────────────────────
  if (grade.status === 'incomplete') {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        'The reconciliation cannot yet be judged — sources, allergy status, or line-item review are outstanding',
      suggestedAction:
        'Complete the information sources, allergy status, and line-item review, then reconcile every discrepancy.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.MedicationReconciliation.detectFlaggedIssues = detectFlaggedIssues;
})();
