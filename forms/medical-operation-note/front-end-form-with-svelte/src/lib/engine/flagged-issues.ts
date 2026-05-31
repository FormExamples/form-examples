import type { AdditionalFlag, OperationNote } from './types.js';
import { bloodLossBand, totalTransfusionUnits } from './utils.js';

/**
 * Compute the set of safety flags for the operation note. Flags are
 * independent of the composite-risk band — they are surfaced verbatim in
 * the report for the surgical team and theatre coordinator.
 *
 * Priorities follow the spec table in `index.md`:
 *   - high   : incorrect-count, retained-foreign-body, never-event,
 *              unplanned-icu-admission, massive-haemorrhage,
 *              massive-transfusion, intra-operative-arrest,
 *              anaesthetic-incident
 *   - medium : conversion-to-open, implant-registry-pending,
 *              specimen-labelling-issue, equipment-problem
 *   - low    : documentation-gap
 */
export function detectAdditionalFlags(data: OperationNote): AdditionalFlag[] {
  const flags: AdditionalFlag[] = [];
  const s = data.safetyCountsEbl;
  const a = data.anaesthesia;
  const p = data.postOperativePlan;
  const m = data.materialsImplants;

  // Incorrect count
  const anyDisagreed =
    s.swabCountAgreed === 'no' ||
    s.needleCountAgreed === 'no' ||
    s.instrumentCountAgreed === 'no';
  if (anyDisagreed) {
    flags.push({
      flagId: 'F-INCORRECT-COUNT',
      category: 'incorrect-count',
      priority: 'high',
      description: 'Swab / needle / instrument count discrepancy unresolved at sign-out',
      suggestedAction: 'X-ray; theatre lockdown; document resolution before patient leaves theatre.',
    });
  }

  // Retained foreign body
  if (s.retainedForeignBody === 'yes') {
    flags.push({
      flagId: 'F-RETAINED-FOREIGN-BODY',
      category: 'retained-foreign-body',
      priority: 'high',
      description: 'Retained foreign body declared',
      suggestedAction: 'Statutory NHS England Never Event notification; duty of candour; patient-safety incident report.',
    });
  }

  // Never-event tokens
  const neverEventTokens = (s.neverEventFlags || '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
  if (neverEventTokens.length > 0) {
    flags.push({
      flagId: 'F-NEVER-EVENT',
      category: 'never-event',
      priority: 'high',
      description: `Never-event suspicion: ${neverEventTokens.join(', ')}`,
      suggestedAction: 'Statutory NHS England Never Event notification; duty of candour; root-cause analysis.',
    });
  }

  // Unplanned ICU admission
  if (
    p.unplannedEscalation === 'yes' ||
    p.recoveryDestination === 'icu' ||
    p.recoveryDestination === 'hdu'
  ) {
    const intensive = p.recoveryDestination === 'icu' || p.recoveryDestination === 'hdu';
    if (p.unplannedEscalation === 'yes') {
      flags.push({
        flagId: 'F-UNPLANNED-ICU',
        category: 'unplanned-icu-admission',
        priority: 'high',
        description: `Unplanned escalation of disposition${intensive ? ` to ${p.recoveryDestination.toUpperCase()}` : ''}`,
        suggestedAction: 'Critical-care handover; ICU/HDU bed confirmation; consultant intensivist notification.',
      });
    }
  }

  // Massive haemorrhage
  const band = bloodLossBand(s.estimatedBloodLossMl);
  if (band === 'severe' || band === 'massive') {
    flags.push({
      flagId: 'F-MASSIVE-HAEMORRHAGE',
      category: 'massive-haemorrhage',
      priority: 'high',
      description: `EBL ${s.estimatedBloodLossMl ?? 0} mL — ${band} band`,
      suggestedAction: 'Activate massive haemorrhage protocol if not already; blood-bank communication; haematology review.',
    });
  }

  // Massive transfusion
  const prbc = s.prbcUnits ?? 0;
  if (prbc >= 4 || s.massiveHaemorrhageProtocolActivated === 'yes') {
    flags.push({
      flagId: 'F-MASSIVE-TRANSFUSION',
      category: 'massive-transfusion',
      priority: 'high',
      description:
        s.massiveHaemorrhageProtocolActivated === 'yes'
          ? 'Massive haemorrhage protocol activated'
          : `≥ 4 units PRBC intra-operatively (${totalTransfusionUnits(s.prbcUnits, s.ffpUnits, s.plateletsUnits, s.cryoUnits)} total units)`,
      suggestedAction: 'Continue MHP; tranexamic acid; near-patient testing; consultant haematologist input.',
    });
  }

  // Conversion to open
  if (s.conversionToOpen === 'yes') {
    flags.push({
      flagId: 'F-CONVERSION-TO-OPEN',
      category: 'conversion-to-open',
      priority: 'medium',
      description: 'Planned minimally-invasive case converted to open',
      suggestedAction: 'Document reason; revisit post-op analgesia and length-of-stay planning.',
    });
  }

  // Intra-operative arrest
  if (s.intraOperativeArrest === 'yes') {
    flags.push({
      flagId: 'F-INTRA-OP-ARREST',
      category: 'intra-operative-arrest',
      priority: 'high',
      description: 'Cardiac or respiratory arrest in theatre',
      suggestedAction: 'Critical-care admission; family communication; M&M referral; debrief.',
    });
  }

  // Anaesthetic incidents (major)
  const events = (a.events || '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
  const majorAnaestheticEvents = events.filter((t) =>
    ['failed-intubation', 'awareness', 'anaphylaxis', 'malignant-hyperthermia', 'sux-apnoea'].includes(t),
  );
  if (majorAnaestheticEvents.length > 0) {
    flags.push({
      flagId: 'F-ANAESTHETIC-INCIDENT',
      category: 'anaesthetic-incident',
      priority: 'high',
      description: `Major anaesthetic event: ${majorAnaestheticEvents.join(', ')}`,
      suggestedAction: 'Critical-incident report; anaesthetic alert on record; consultant anaesthetist debrief.',
    });
  }

  // Implant registry pending
  const hasImplants =
    m.mesh.trim() ||
    m.screwsPlates.trim() ||
    m.prostheticJoints.trim() ||
    m.vascularGrafts.trim();
  if (hasImplants && m.registrySubmitted !== 'yes') {
    flags.push({
      flagId: 'F-IMPLANT-REGISTRY',
      category: 'implant-registry-pending',
      priority: 'medium',
      description: 'Implant placed but registry submission not yet confirmed',
      suggestedAction: 'Submit to relevant registry (NJR, BHIVR, ODEP) within trust deadline.',
    });
  }

  // Specimen labelling issue
  if (s.specimenLabellingIssue === 'yes') {
    flags.push({
      flagId: 'F-SPECIMEN-LABELLING',
      category: 'specimen-labelling-issue',
      priority: 'medium',
      description: 'Specimen sent without complete labelling or chain-of-custody',
      suggestedAction: 'Pathology lab contact; relabel under witness; document discrepancy.',
    });
  }

  // Equipment problem
  if (s.equipmentProblem === 'yes') {
    flags.push({
      flagId: 'F-EQUIPMENT-PROBLEM',
      category: 'equipment-problem',
      priority: 'medium',
      description: 'Equipment failure or sterility breach',
      suggestedAction: 'Quarantine equipment; report on Datix; theatre coordinator notification.',
    });
  }

  // Documentation gap
  if (data.signOff.documentationGap === 'yes') {
    flags.push({
      flagId: 'F-DOCUMENTATION-GAP',
      category: 'documentation-gap',
      priority: 'low',
      description: 'Required field missing at sign-off',
      suggestedAction: 'Complete missing fields before electronic signature; addendum if post-signature.',
    });
  }

  return flags;
}
