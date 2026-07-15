// Declarative mandatory-item rules for the Anaesthetic Record completeness
// engine.
//
// This is a DOCUMENTATION / COMPLETENESS form — not a numeric score. The engine
// evaluates a fixed set of mandatory-item rules (spec §4), each tagged
// `critical` or `noncritical`, then `grader.js` classifies the record:
//
//   anyCriticalMissing    -> 'incomplete'
//   else anyNoncriticalMissing -> 'partial'
//   else                  -> 'complete'
//
// `completenessPercent` is the proportion of the mandatory rules satisfied,
// rounded to a whole percent. Each rule carries a stable id, a human-readable
// label, its criticality, and a pure `satisfied(record)` predicate, so the UI
// can show exactly which items are still missing (mirroring the
// `anaesthetic_record_grade_rule` SQL table).

/**
 * @typedef {import('./types.js').RecordData} RecordData
 */

// Wrapped in an IIFE; published via window.AnaestheticRecord.

// ---------------------------------------------------------------------------
// Small pure predicates
// ---------------------------------------------------------------------------

/** A text / enum value counts as present when it is a non-empty trimmed string. */
function textPresent(v) {
  return typeof v === 'string' && v.trim() !== '';
}

/** A numeric value counts as present when it is a finite number (not null). */
function numberPresent(v) {
  return typeof v === 'number' && !Number.isNaN(v);
}

/** True when the fluids section carries any summary volume (spec §4). */
function fluidsSummaryPresent(record) {
  const f = record.fluids;
  return (
    numberPresent(f.estimatedBloodLossMl) ||
    numberPresent(f.crystalloidMl) ||
    numberPresent(f.colloidMl) ||
    numberPresent(f.bloodProductsMl) ||
    numberPresent(f.urineOutputMl) ||
    numberPresent(f.cellSalvageMl)
  );
}

// ---------------------------------------------------------------------------
// Mandatory-item rules (spec §4)
// ---------------------------------------------------------------------------

/**
 * The fixed mandatory-item ruleset. Order is stable so the audit trail and the
 * "missing items" list render deterministically.
 *
 * @type {{ id: string, category: 'critical' | 'noncritical', label: string,
 *          satisfied: (record: RecordData) => boolean }[]}
 */
const MANDATORY_RULES = [
  // ── Safety-critical (missing → Incomplete) ──────────────────────────────
  {
    id: 'M-PATIENT-IDENTIFIER',
    category: 'critical',
    label: 'Patient identification recorded',
    satisfied: (r) => textPresent(r.identification.patientIdentifier)
  },
  {
    id: 'M-ANAESTHETIST',
    category: 'critical',
    label: 'Responsible anaesthetist recorded',
    satisfied: (r) => textPresent(r.identification.anaesthetistName)
  },
  {
    id: 'M-ASA-STATUS',
    category: 'critical',
    label: 'ASA physical status recorded',
    satisfied: (r) => textPresent(r.asaAirway.asaStatus)
  },
  {
    id: 'M-ANAESTHETIC-TECHNIQUE',
    category: 'critical',
    label: 'Anaesthetic technique recorded',
    satisfied: (r) => textPresent(r.identification.anaestheticTechnique)
  },
  {
    id: 'M-AIRWAY-TECHNIQUE',
    category: 'critical',
    label: 'Airway-management technique recorded',
    satisfied: (r) => textPresent(r.airway.airwayTechnique)
  },
  {
    id: 'M-WHO-CHECKLIST',
    category: 'critical',
    label: 'WHO checklist status recorded (Sign In and Time Out)',
    satisfied: (r) =>
      textPresent(r.preInduction.whoSignIn) &&
      textPresent(r.preInduction.whoTimeOut)
  },
  {
    id: 'M-TIMED-OBSERVATION',
    category: 'critical',
    label: 'At least one set of timed observations recorded',
    satisfied: (r) => Array.isArray(r.observations) && r.observations.length >= 1
  },
  {
    id: 'M-SIGNATURE',
    category: 'critical',
    label: 'Anaesthetist signature recorded',
    satisfied: (r) => textPresent(r.signoff.anaesthetistSignature)
  },

  // ── Non-critical (missing → Partial) ────────────────────────────────────
  {
    id: 'M-WEIGHT',
    category: 'noncritical',
    label: 'Patient weight recorded',
    satisfied: (r) => numberPresent(r.identification.weightKg)
  },
  {
    id: 'M-MONITORING',
    category: 'noncritical',
    label: 'Monitoring modalities recorded',
    satisfied: (r) =>
      Array.isArray(r.monitoring.monitoringModalities) &&
      r.monitoring.monitoringModalities.length >= 1
  },
  {
    id: 'M-FLUIDS',
    category: 'noncritical',
    label: 'Fluids / blood-loss summary recorded',
    satisfied: (r) => fluidsSummaryPresent(r)
  },
  {
    id: 'M-RECOVERY-DESTINATION',
    category: 'noncritical',
    label: 'Recovery-handover destination recorded',
    satisfied: (r) => textPresent(r.handover.recoveryDestination)
  }
];

export { textPresent, numberPresent, fluidsSummaryPresent, MANDATORY_RULES };
