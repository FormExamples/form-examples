import type { SafetyFlag, WhoSurgicalSafetyChecklist } from './types.js';

/**
 * Compute the WHO Surgical Safety Checklist safety flags, as defined in
 * `forms/who-surgical-safety-checklist/index.md` § "Safety flags". Each flag
 * is evaluated independently of phase completion.
 *
 * Pure function — no side effects, no I/O, no exceptions.
 */
export function computeSafetyFlags(c: WhoSurgicalSafetyChecklist): SafetyFlag[] {
  const flags: SafetyFlag[] = [];

  // Identity not confirmed: Sign In item 1 unanswered once Sign In is started.
  if (
    c.signInIdentitySiteProcedureConsent !== 'yes' &&
    isSignInPartiallyAnswered(c)
  ) {
    flags.push({
      flag: 'identity-not-confirmed',
      priority: 'high',
      message:
        'Patient identity, site, procedure, and consent have not been confirmed.',
    });
  }

  // Site not marked: explicit "no" — represented as empty when site marking
  // expected but not done. The SQL constraint only allows 'yes' / 'not-applicable' / ''
  // so 'no' is encoded as '' once any other Sign In field is answered. Treat
  // unanswered marking as a flag when laterality is not bilateral / midline / na.
  if (
    c.signInSiteMarked === '' &&
    c.laterality !== '' &&
    c.laterality !== 'bilateral' &&
    c.laterality !== 'midline' &&
    c.laterality !== 'na' &&
    isSignInPartiallyAnswered(c)
  ) {
    flags.push({
      flag: 'site-not-marked',
      priority: 'high',
      message: 'Surgical site has not been marked.',
    });
  }

  // Anaesthesia check incomplete: Sign In item 3 not 'yes' once Sign In started.
  if (
    c.signInAnaesthesiaCheckComplete !== 'yes' &&
    isSignInPartiallyAnswered(c)
  ) {
    flags.push({
      flag: 'anaesthesia-check-incomplete',
      priority: 'high',
      message: 'Anaesthesia machine and medication check is incomplete.',
    });
  }

  // Pulse oximeter not functioning: Sign In item 4 not 'yes' once Sign In started.
  if (
    c.signInPulseOximeterOnPatient !== 'yes' &&
    isSignInPartiallyAnswered(c)
  ) {
    flags.push({
      flag: 'pulse-oximeter-not-functioning',
      priority: 'high',
      message: 'Pulse oximeter is not on the patient or not functioning.',
    });
  }

  // Known allergy flagged
  if (c.signInKnownAllergy === 'yes') {
    flags.push({
      flag: 'known-allergy-flagged',
      priority: 'high',
      message: c.signInKnownAllergyDetail
        ? `Known allergy: ${c.signInKnownAllergyDetail}.`
        : 'Known allergy declared without recorded detail.',
    });
  }

  // Difficult airway / aspiration risk
  if (c.signInDifficultAirwayAspirationRisk === 'yes-equipment-available') {
    flags.push({
      flag: 'difficult-airway-risk',
      priority: 'high',
      message:
        'Difficult airway or aspiration risk identified; equipment available.',
    });
  }

  // High blood-loss risk
  if (c.signInBloodLossRisk === 'yes-two-ivs-and-fluids-planned') {
    flags.push({
      flag: 'high-blood-loss-risk',
      priority: 'high',
      message:
        'Risk of > 500 ml blood loss (7 ml/kg in children); two IVs and fluids planned.',
    });
  }

  // Antibiotic prophylaxis missed: Time Out item 3 not 'yes' and not 'not-applicable'.
  if (
    c.timeOutAntibioticProphylaxisWithin60Min !== 'yes' &&
    c.timeOutAntibioticProphylaxisWithin60Min !== 'not-applicable' &&
    isTimeOutPartiallyAnswered(c)
  ) {
    flags.push({
      flag: 'antibiotic-prophylaxis-missed',
      priority: 'high',
      message:
        'Antibiotic prophylaxis has not been given within the last 60 minutes.',
    });
  }

  // Sterility not confirmed: Time Out item 8 not 'yes' once Time Out started.
  if (
    c.timeOutNursingSterilityConfirmed !== 'yes' &&
    isTimeOutPartiallyAnswered(c)
  ) {
    flags.push({
      flag: 'sterility-not-confirmed',
      priority: 'high',
      message: 'Nursing team has not confirmed instrument sterility.',
    });
  }

  // Imaging missing: Time Out item 10 not 'yes' and not 'not-applicable'.
  if (
    c.timeOutEssentialImagingDisplayed !== 'yes' &&
    c.timeOutEssentialImagingDisplayed !== 'not-applicable' &&
    isTimeOutPartiallyAnswered(c)
  ) {
    flags.push({
      flag: 'imaging-missing',
      priority: 'medium',
      message: 'Essential imaging is not displayed.',
    });
  }

  // Count discrepancy
  if (c.signOutCountsConfirmed === 'no') {
    flags.push({
      flag: 'count-discrepancy',
      priority: 'high',
      message:
        'Instrument, sponge, or needle count was not confirmed correct.',
    });
  }

  // Specimen labelling missed
  if (c.signOutSpecimensLabelled === 'no') {
    flags.push({
      flag: 'specimen-labelling-missed',
      priority: 'high',
      message: 'Specimen labelling was not confirmed.',
    });
  }

  // Equipment problem: any free-text content.
  if (c.signOutEquipmentProblems.trim() !== '') {
    flags.push({
      flag: 'equipment-problem',
      priority: 'medium',
      message: `Equipment problem to address: ${c.signOutEquipmentProblems.trim()}`,
    });
  }

  return flags;
}

/**
 * True when at least one Sign In item has been answered (so unanswered items
 * are meaningful flags).
 */
function isSignInPartiallyAnswered(c: WhoSurgicalSafetyChecklist): boolean {
  return (
    c.signInIdentitySiteProcedureConsent !== '' ||
    c.signInSiteMarked !== '' ||
    c.signInAnaesthesiaCheckComplete !== '' ||
    c.signInPulseOximeterOnPatient !== '' ||
    c.signInKnownAllergy !== '' ||
    c.signInDifficultAirwayAspirationRisk !== '' ||
    c.signInBloodLossRisk !== '' ||
    c.signInCompletedAt !== ''
  );
}

/**
 * True when at least one Time Out item has been answered.
 */
function isTimeOutPartiallyAnswered(c: WhoSurgicalSafetyChecklist): boolean {
  return (
    c.timeOutTeamIntroductionsConfirmed !== '' ||
    c.timeOutPatientProcedureIncisionConfirmed !== '' ||
    c.timeOutAntibioticProphylaxisWithin60Min !== '' ||
    c.timeOutNursingSterilityConfirmed !== '' ||
    c.timeOutEssentialImagingDisplayed !== '' ||
    c.timeOutSurgeonCaseDurationMinutes !== null ||
    c.timeOutSurgeonAnticipatedBloodLossMl !== null ||
    c.timeOutSurgeonCriticalSteps !== '' ||
    c.timeOutAnaesthetistPatientConcerns !== '' ||
    c.timeOutNursingEquipmentConcerns !== '' ||
    c.timeOutCompletedAt !== ''
  );
}
