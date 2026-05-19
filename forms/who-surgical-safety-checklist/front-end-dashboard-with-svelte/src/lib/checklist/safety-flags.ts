import type { SafetyFlag, WhoSurgicalSafetyChecklist } from './types.js';

/**
 * Compute the safety flags for a single checklist according to the rules in
 * the form's `index.md` (the "Safety flags" section). Pure function — no side
 * effects.
 */
export function computeSafetyFlags(
  c: WhoSurgicalSafetyChecklist,
): SafetyFlag[] {
  const flags: SafetyFlag[] = [];

  // Sign In
  if (c.signInIdentitySiteProcedureConsent !== 'yes') {
    flags.push({
      code: 'identity-not-confirmed',
      label: 'Identity not confirmed',
      severity: 'high',
    });
  }
  if (
    c.signInSiteMarked === '' &&
    c.laterality !== 'bilateral' &&
    c.laterality !== 'midline' &&
    c.laterality !== 'na'
  ) {
    flags.push({
      code: 'site-not-marked',
      label: 'Site not marked',
      severity: 'high',
    });
  }
  if (c.signInAnaesthesiaCheckComplete !== 'yes') {
    flags.push({
      code: 'anaesthesia-check-incomplete',
      label: 'Anaesthesia check incomplete',
      severity: 'high',
    });
  }
  if (c.signInPulseOximeterOnPatient !== 'yes') {
    flags.push({
      code: 'pulse-oximeter-missing',
      label: 'Pulse oximeter not functioning',
      severity: 'high',
    });
  }
  if (c.signInKnownAllergy === 'yes') {
    flags.push({
      code: 'known-allergy',
      label: 'Known allergy flagged',
      severity: 'medium',
    });
  }
  if (c.signInDifficultAirwayAspirationRisk === 'yes-equipment-available') {
    flags.push({
      code: 'difficult-airway',
      label: 'Difficult airway risk',
      severity: 'high',
    });
  }
  if (c.signInBloodLossRisk === 'yes-two-ivs-and-fluids-planned') {
    flags.push({
      code: 'high-blood-loss-risk',
      label: 'High blood-loss risk',
      severity: 'medium',
    });
  }

  // Time Out
  if (c.timeOutAntibioticProphylaxisWithin60Min === '') {
    flags.push({
      code: 'antibiotic-prophylaxis-missed',
      label: 'Antibiotic prophylaxis missed',
      severity: 'medium',
    });
  }
  if (c.timeOutNursingSterilityConfirmed !== 'yes') {
    flags.push({
      code: 'sterility-not-confirmed',
      label: 'Sterility not confirmed',
      severity: 'high',
    });
  }
  if (c.timeOutEssentialImagingDisplayed === '') {
    flags.push({
      code: 'imaging-missing',
      label: 'Imaging missing',
      severity: 'low',
    });
  }

  // Sign Out
  if (c.signOutCountsConfirmed === 'no') {
    flags.push({
      code: 'count-discrepancy',
      label: 'Count discrepancy',
      severity: 'high',
    });
  }
  if (c.signOutSpecimensLabelled === 'no') {
    flags.push({
      code: 'specimen-labelling-missed',
      label: 'Specimen labelling missed',
      severity: 'medium',
    });
  }
  if (c.signOutEquipmentProblems.trim().length > 0) {
    flags.push({
      code: 'equipment-problem',
      label: 'Equipment problem',
      severity: 'low',
    });
  }

  return flags;
}

/** Count how many of the three phases are complete (have a sign-off timestamp). */
export function countPhasesCompleted(
  c: WhoSurgicalSafetyChecklist,
): number {
  let n = 0;
  if (c.signInCompletedAt) n += 1;
  if (c.timeOutCompletedAt) n += 1;
  if (c.signOutCompletedAt) n += 1;
  return n;
}
