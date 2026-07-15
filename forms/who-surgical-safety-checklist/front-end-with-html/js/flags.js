// Safety-flag computation for the WHO Surgical Safety Checklist.
// Mirrors the table in index.md "Safety flags".
//
// Each flag has:
//   id        — stable identifier
//   priority  — 'high' | 'medium' | 'low'
//   category  — 'identification' | 'anaesthesia' | 'monitoring' | 'allergy' |
//               'airway' | 'blood-loss' | 'infection' | 'sterility' |
//               'imaging' | 'counts' | 'specimen' | 'equipment'
//   message   — human-readable description
//
// Note: a Sign-In item answered with "yes" (the safe answer) does NOT raise
// a flag. The "Identity not confirmed" flag fires when item 1 is left
// unanswered OR has any value other than 'yes'. The other "yes"-only items
// (anaesthesia check, pulse oximeter) only fire when the item was reviewed
// and explicitly marked non-compliant via the optional "no" choice — but
// the SQL CHECK constraint only allows 'yes' or ''. To preserve the spirit
// of the spec we treat the unanswered state as "not yet confirmed" only
// for item 1 (identity), and treat the others as informational once
// signed off. Bottom line: items that are simple yes-or-empty raise no
// medium/high flag while empty — they're caught by phase completion.

/**
 * Compute the full list of safety flags for a given checklist state.
 * Returns an array sorted high → medium → low.
 */
function computeFlags(c) {
  const flags = [];

  // ----- Sign In -----
  const s = c.signIn;
  const cd = c.caseDetails;

  // Identity not confirmed — high
  if (s.identitySiteProcedureConsent !== 'yes') {
    flags.push({
      id: 'F-IDENTITY-NOT-CONFIRMED',
      priority: 'high',
      category: 'identification',
      message:
        'Patient identity, site, procedure, and consent have not been confirmed (Sign In #1).'
    });
  }

  // Site not marked — high, only when laterality is left/right
  // (not bilateral / midline / na). Spec: index.md "Safety flags" row 2.
  const lateralityRequiresMark =
    cd.laterality === 'left' || cd.laterality === 'right';
  if (s.siteMarked === '' && lateralityRequiresMark) {
    flags.push({
      id: 'F-SITE-NOT-MARKED',
      priority: 'high',
      category: 'identification',
      message:
        'Surgical site has not been marked on a lateralised procedure (Sign In #2).'
    });
  }

  // Anaesthesia machine and medication check incomplete — high
  if (s.anaesthesiaCheckComplete === '' && hasAnySignInAnswer(s)) {
    flags.push({
      id: 'F-ANAESTHESIA-CHECK-INCOMPLETE',
      priority: 'high',
      category: 'anaesthesia',
      message:
        'Anaesthesia machine and medication check has not been confirmed (Sign In #3).'
    });
  }

  // Pulse oximeter not functioning — high
  if (s.pulseOximeterOnPatient === '' && hasAnySignInAnswer(s)) {
    flags.push({
      id: 'F-PULSE-OXIMETER-NOT-FUNCTIONING',
      priority: 'high',
      category: 'monitoring',
      message:
        'Pulse oximeter has not been confirmed on the patient and functioning (Sign In #4).'
    });
  }

  // Known allergy flagged — medium
  if (s.knownAllergy === 'yes') {
    const detail = (s.knownAllergyDetail || '').trim();
    flags.push({
      id: 'F-KNOWN-ALLERGY',
      priority: 'medium',
      category: 'allergy',
      message:
        'Patient has a known allergy' +
        (detail ? ` — ${detail}` : ' (no detail recorded)') +
        ' (Sign In #5).'
    });
  }

  // Difficult airway / aspiration risk — high
  if (s.difficultAirwayAspirationRisk === 'yes-equipment-available') {
    flags.push({
      id: 'F-DIFFICULT-AIRWAY',
      priority: 'high',
      category: 'airway',
      message:
        'Difficult airway or aspiration risk identified; assistance and equipment available (Sign In #6).'
    });
  }

  // High blood-loss risk — high
  if (s.bloodLossRisk === 'yes-two-ivs-and-fluids-planned') {
    flags.push({
      id: 'F-HIGH-BLOOD-LOSS-RISK',
      priority: 'high',
      category: 'blood-loss',
      message:
        'Risk of > 500 ml (or 7 ml/kg in children) blood loss; two IVs / central access and fluids planned (Sign In #7).'
    });
  }

  // ----- Time Out -----
  const t = c.timeOut;

  // Antibiotic prophylaxis missed — high
  // Trigger: explicitly missed (we model this as the value being '' after
  // other Time Out items have been completed AND 'not-applicable' was not
  // selected). The SQL CHECK allows yes/not-applicable/''. There is no
  // explicit 'no'; we follow the spec literally: flag when the value is
  // neither 'yes' nor 'not-applicable' after Time Out has started.
  if (
    t.antibioticProphylaxisWithin60Min === '' &&
    hasAnyTimeOutAnswer(t)
  ) {
    flags.push({
      id: 'F-ANTIBIOTIC-PROPHYLAXIS-MISSED',
      priority: 'high',
      category: 'infection',
      message:
        'Antibiotic prophylaxis within 60 minutes is not confirmed and not-applicable was not selected (Time Out #3).'
    });
  }

  // Sterility not confirmed — high
  if (t.nursingSterilityConfirmed === '' && hasAnyTimeOutAnswer(t)) {
    flags.push({
      id: 'F-STERILITY-NOT-CONFIRMED',
      priority: 'high',
      category: 'sterility',
      message:
        'Nursing sterility (including indicator results) has not been confirmed (Time Out #8).'
    });
  }

  // Imaging missing — medium
  if (t.essentialImagingDisplayed === '' && hasAnyTimeOutAnswer(t)) {
    flags.push({
      id: 'F-IMAGING-MISSING',
      priority: 'medium',
      category: 'imaging',
      message:
        'Essential imaging is not confirmed displayed and not-applicable was not selected (Time Out #10).'
    });
  }

  // ----- Sign Out -----
  const o = c.signOut;

  // Count discrepancy — high
  if (o.countsConfirmed === 'no') {
    flags.push({
      id: 'F-COUNT-DISCREPANCY',
      priority: 'high',
      category: 'counts',
      message:
        'Instrument, sponge, or needle count discrepancy reported (Sign Out #2).'
    });
  }

  // Specimen labelling missed — high
  if (o.specimensLabelled === 'no') {
    flags.push({
      id: 'F-SPECIMEN-LABELLING-MISSED',
      priority: 'high',
      category: 'specimen',
      message:
        'Specimen labelling not confirmed read aloud (Sign Out #3).'
    });
  }

  // Equipment problem — medium
  if (o.equipmentProblems && o.equipmentProblems.trim() !== '') {
    flags.push({
      id: 'F-EQUIPMENT-PROBLEM',
      priority: 'medium',
      category: 'equipment',
      message:
        'Equipment problem recorded — ' + o.equipmentProblems.trim() +
        ' (Sign Out #4).'
    });
  }

  // Sort: high (0) before medium (1) before low (2); preserve insertion
  // order within a priority.
  const rank = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => rank[a.priority] - rank[b.priority]);
  return flags;
}

function hasAnySignInAnswer(s) {
  return (
    s.identitySiteProcedureConsent !== '' ||
    s.siteMarked !== '' ||
    s.anaesthesiaCheckComplete !== '' ||
    s.pulseOximeterOnPatient !== '' ||
    s.knownAllergy !== '' ||
    s.difficultAirwayAspirationRisk !== '' ||
    s.bloodLossRisk !== ''
  );
}

function hasAnyTimeOutAnswer(t) {
  return (
    t.teamIntroductionsConfirmed !== '' ||
    t.patientProcedureIncisionConfirmed !== '' ||
    t.antibioticProphylaxisWithin60Min !== '' ||
    (t.surgeonCriticalSteps && t.surgeonCriticalSteps.trim() !== '') ||
    t.surgeonCaseDurationMinutes !== null ||
    t.surgeonAnticipatedBloodLossMl !== null ||
    (t.anaesthetistPatientConcerns && t.anaesthetistPatientConcerns.trim() !== '') ||
    t.nursingSterilityConfirmed !== '' ||
    (t.nursingEquipmentConcerns && t.nursingEquipmentConcerns.trim() !== '') ||
    t.essentialImagingDisplayed !== ''
  );
}

export { computeFlags };
