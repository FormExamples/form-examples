import { deriveStatus, discrepancyTouchesHighRisk, isIntentional, isUnintentional } from './rules.js';
import { statusLabel } from './types.js';

// Medication-reconciliation grader. Pure function: takes a `ReconciliationData`
// object (a parent header plus its four child lists) and derives the
// documentation-form outputs (spec §4). This is NOT a numeric score — it emits
// per-record counts and a STATUS class:
//
//   sourceCount                = count(informationSources)
//   verifiedSourceCount        = count(informationSources where verified == 'yes')
//   allergyCount               = count(allergies)
//   lineItemCount              = count(lineItems)
//   bpmhCount / inpatientCount = split of lineItems by listSource
//   discrepancyCount           = count(discrepancies)
//   intentionalCount           = discrepancies fully documented (action + rationale)
//   unintentionalCount         = discrepancies not fully documented (outstanding)
//   highRiskUnintentionalCount = unintentional discrepancies touching a high-risk medicine
//   status                     = complete | discrepancies-outstanding | incomplete
//
// The firedRules audit trail mirrors the grade_rule SQL table (id, category,
// description).

/**
 * @typedef {import('./types.js').ReconciliationData} ReconciliationData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Compute the reconciliation grade for the supplied data.
 * @param {ReconciliationData} data
 * @returns {Omit<GradingResult, 'flaggedIssues' | 'timestamp'>}
 */
function calculateReconciliation(data) {
  const sources = data.informationSources || [];
  const allergies = data.allergies || [];
  const lineItems = data.lineItems || [];
  const discrepancies = data.discrepancies || [];

  const sourceCount = sources.length;
  const verifiedSourceCount = sources.filter((s) => s.verified === 'yes').length;
  const allergyCount = allergies.length;

  const lineItemCount = lineItems.length;
  const bpmhCount = lineItems.filter((li) => li.listSource === 'bpmh').length;
  const inpatientCount = lineItems.filter((li) => li.listSource === 'inpatient').length;

  const discrepancyCount = discrepancies.length;
  const intentionalCount = discrepancies.filter(isIntentional).length;
  const unintentionalCount = discrepancies.filter(isUnintentional).length;
  const highRiskUnintentionalCount = discrepancies.filter(
    (d) => isUnintentional(d) && discrepancyTouchesHighRisk(d, lineItems)
  ).length;

  const status = deriveStatus(data, { sourceCount, unintentionalCount });

  // Audit trail mirroring the grade_rule table.
  /** @type {FiredRule[]} */
  const firedRules = [
    {
      id: 'R-SOURCES-01',
      category: 'information-sources',
      description: `${sourceCount} information source(s) (${verifiedSourceCount} verified); minimum of 2 required`
    },
    {
      id: 'R-LINE-ITEMS-01',
      category: 'line-items',
      description: `${lineItemCount} line item(s): ${bpmhCount} BPMH, ${inpatientCount} inpatient`
    },
    {
      id: 'R-DISCREPANCIES-01',
      category: 'discrepancies',
      description: `${discrepancyCount} discrepancy(ies): ${intentionalCount} intentional, ${unintentionalCount} unintentional (${highRiskUnintentionalCount} on a high-risk medicine)`
    },
    {
      id: 'R-STATUS-01',
      category: 'status',
      description: `Reconciliation status: ${statusLabel(status)}`
    }
  ];

  return {
    status,
    sourceCount,
    verifiedSourceCount,
    allergyCount,
    lineItemCount,
    bpmhCount,
    inpatientCount,
    discrepancyCount,
    intentionalCount,
    unintentionalCount,
    highRiskUnintentionalCount,
    firedRules
  };
}

export { calculateReconciliation };
