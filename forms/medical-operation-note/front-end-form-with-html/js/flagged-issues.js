// Additional safety-flag detection. Mirrors the SvelteKit
// `src/lib/engine/flagged-issues.ts`. Pure function — same output shape
// and flag IDs as the canonical engine.
//
// Flag categories (from the form's index.md): incorrect count, retained
// foreign body, wrong-site / wrong-side / wrong-patient / wrong-implant,
// unplanned ICU admission, massive haemorrhage, massive transfusion,
// conversion to open, intra-operative arrest, anaesthetic incident,
// implant registry pending, specimen labelling issue, equipment problem,
// documentation gap.

(function () {
'use strict';
window.MedicalOperationNote =
  window.MedicalOperationNote || {};
const NS = window.MedicalOperationNote;
const { countsAgreed, ANAESTHETIC_EVENTS } = NS;

function detectAdditionalFlags(data) {
  const flags = [];

  // ---- Counts ----
  if (!countsAgreed(data)) {
    flags.push({
      flagId: 'F-INCORRECT-COUNT',
      category: 'incorrect-count',
      priority: 'high',
      description: 'Swab / needle / instrument count discrepancy at sign-out',
      suggestedAction: 'Recount; perform intra-op imaging; do not close until resolved.'
    });
  }

  // ---- Retained foreign body ----
  if (data.safety.retainedItemSuspected === 'yes') {
    flags.push({
      flagId: 'F-RETAINED-ITEM',
      category: 'retained-foreign-body',
      priority: 'high',
      description: 'Retained foreign object suspected',
      suggestedAction: 'NHS England Never Event protocol; statutory notification within 48 h.'
    });
  }

  // ---- Never event ----
  if (data.safety.neverEventFlagged === 'yes') {
    flags.push({
      flagId: 'F-NEVER-EVENT',
      category: 'never-event',
      priority: 'high',
      description: `Never-event candidate: ${data.safety.neverEventType || 'unspecified'}`,
      suggestedAction: 'StEIS reporting; Duty of Candour disclosure; root-cause analysis.'
    });
  }

  // ---- Unplanned ICU / HDU step-up ----
  const order = ['day-case', 'ward', 'pacu', 'enhanced-care', 'hdu', 'icu'];
  const planned = order.indexOf(data.postOp.preOpPlannedDestination);
  const actual = order.indexOf(data.postOp.recoveryDestination);
  if (planned >= 0 && actual >= 0 && actual > planned) {
    flags.push({
      flagId: 'F-UNPLANNED-ICU',
      category: 'unplanned-icu-admission',
      priority: 'high',
      description: `Recovery destination escalated from ${data.postOp.preOpPlannedDestination} to ${data.postOp.recoveryDestination}`,
      suggestedAction: 'Critical-care handover; document indication for escalation.'
    });
  }

  // ---- Massive haemorrhage ----
  const ebl = Number(data.safety.estimatedBloodLossMl);
  if (Number.isFinite(ebl) && ebl > 1500) {
    flags.push({
      flagId: 'F-MASSIVE-HAEMORRHAGE',
      category: 'massive-haemorrhage',
      priority: 'high',
      description: `Estimated blood loss ${ebl} mL`,
      suggestedAction: 'Activate massive haemorrhage protocol; transfusion lab liaison.'
    });
  }

  // ---- Massive transfusion ----
  const prbc = Number(data.safety.transfusionPrbcUnits) || 0;
  if (prbc >= 4 || data.safety.massiveHaemorrhageProtocolActivated === 'yes') {
    flags.push({
      flagId: 'F-MASSIVE-TRANSFUSION',
      category: 'massive-transfusion',
      priority: 'high',
      description: `${prbc} units PRBC transfused${data.safety.massiveHaemorrhageProtocolActivated === 'yes' ? '; MHP activated' : ''}`,
      suggestedAction: 'Post-op coagulation panel; transfusion reaction surveillance.'
    });
  }

  // ---- Conversion to open ----
  if (data.safety.conversionToOpen === 'yes') {
    flags.push({
      flagId: 'F-CONVERSION-TO-OPEN',
      category: 'conversion-to-open',
      priority: 'medium',
      description: 'Planned minimally-invasive case converted to open',
      suggestedAction: 'Document indication for conversion in operative findings.'
    });
  }

  // ---- Intra-operative arrest ----
  if (data.safety.intraOpArrest === 'yes') {
    flags.push({
      flagId: 'F-INTRA-OP-ARREST',
      category: 'intra-operative-arrest',
      priority: 'high',
      description: 'Cardiac or respiratory arrest in theatre',
      suggestedAction: 'NAP7 reporting; debrief; M&M presentation.'
    });
  }

  // ---- Anaesthetic incident ----
  const ae = data.anaesthesia.anaestheticEvent;
  if (ae && ae !== 'none') {
    const meta = ANAESTHETIC_EVENTS[ae] || {};
    if (meta.severity === 'high' || meta.severity === 'critical') {
      flags.push({
        flagId: 'F-ANAESTHETIC-INCIDENT',
        category: 'anaesthetic-incident',
        priority: 'high',
        description: `Anaesthetic event: ${meta.label || ae}`,
        suggestedAction: 'Anaesthetist debrief; consider NAP / Datix report.'
      });
    }
  }

  // ---- Implant registry pending ----
  const implantPlaced =
    data.materials.prostheticJoint === 'yes' ||
    data.materials.meshUsed === 'yes' ||
    data.materials.vascularGraft === 'yes' ||
    (data.materials.implantLot || '').trim() !== '' ||
    (data.materials.implantSerial || '').trim() !== '';
  if (implantPlaced && data.materials.registrySubmitted !== 'yes') {
    flags.push({
      flagId: 'F-IMPLANT-REGISTRY-PENDING',
      category: 'implant-registry-pending',
      priority: 'medium',
      description: 'Implant placed but registry submission not yet confirmed',
      suggestedAction: 'Submit to NJR / Breast & Cosmetic Implant Registry within 24 h.'
    });
  }

  // ---- Specimen labelling issue ----
  if (
    data.drains.specimensSent === 'yes' &&
    ((data.drains.specimenLabel || '').trim() === '' ||
     (data.drains.specimenContainer || '').trim() === '' ||
     (data.drains.specimenDestination || '').trim() === '')
  ) {
    flags.push({
      flagId: 'F-SPECIMEN-LABELLING',
      category: 'specimen-labelling-issue',
      priority: 'medium',
      description: 'Specimen sent without complete labelling or chain-of-custody',
      suggestedAction: 'Re-label before specimen leaves theatre; document chain of custody.'
    });
  }

  // ---- Equipment / sterility ----
  if (
    data.safety.equipmentProblem === 'yes' ||
    data.safety.sterilityBreach === 'yes'
  ) {
    flags.push({
      flagId: 'F-EQUIPMENT-PROBLEM',
      category: 'equipment-problem',
      priority: 'medium',
      description: 'Equipment failure or sterility breach reported',
      suggestedAction: 'Quarantine item; MHRA Yellow Card / Datix as appropriate.'
    });
  }

  // ---- Documentation gap ----
  const required = [
    ['operation', 'hospital'],
    ['team', 'leadSurgeonName'],
    ['diagnoses', 'procedurePerformed'],
    ['summary', 'finalAttestation']
  ];
  for (const [section, field] of required) {
    if (!data[section][field]) {
      flags.push({
        flagId: 'F-DOCUMENTATION-GAP',
        category: 'documentation-gap',
        priority: 'low',
        description: `Required field missing at sign-off: ${section}.${field}`,
        suggestedAction: 'Complete before electronic signature.'
      });
      break;
    }
  }

  return flags;
}

Object.assign(NS, { detectAdditionalFlags });
})();
