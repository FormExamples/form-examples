// Flagged-issue detection. Independent of risk level (which the grader
// computes), this module raises clinician-facing flags for safety-critical
// or administrative concerns: anaphylaxis history, latex allergy, missing
// emergency contacts / GP details, polypharmacy, multiple chronic
// conditions, emergency visit, refused consent, advance directives,
// active smoking / heavy alcohol / regular drug use, cardiovascular
// symptoms, and family genetic conditions.
//
// Mirrors `src/lib/engine/flagged-issues.ts` from the SvelteKit reference.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Multiple allergies ─────────────────────────────────
  if (data.allergies.length >= 3) {
    flags.push({
      id: 'FLAG-ALLERGY-001',
      category: 'Allergy',
      message: `${data.allergies.length} allergies documented - review for cross-reactivity`,
      priority: 'medium'
    });
  }

  // ─── Anaphylaxis history ────────────────────────────────
  for (let i = 0; i < data.allergies.length; i++) {
    const allergy = data.allergies[i];
    if (allergy && allergy.severity === 'anaphylaxis') {
      flags.push({
        id: `FLAG-ALLERGY-ANAPH-${i}`,
        category: 'Allergy',
        message: `ANAPHYLAXIS history: ${allergy.allergen || '(allergen not specified)'}`,
        priority: 'high'
      });
    }
  }

  // ─── Latex allergy ──────────────────────────────────────
  if (data.allergies.some((a) => a.allergyType === 'latex')) {
    flags.push({
      id: 'FLAG-ALLERGY-LATEX',
      category: 'Allergy',
      message: 'Latex allergy - ensure latex-free environment',
      priority: 'high'
    });
  }

  // ─── Polypharmacy ───────────────────────────────────────
  if (data.medications.length >= 5) {
    flags.push({
      id: 'FLAG-MEDS-001',
      category: 'Medications',
      message: `Polypharmacy: ${data.medications.length} medications - review for interactions`,
      priority: 'medium'
    });
  }

  // ─── Uncontrolled / multiple chronic conditions ─────────
  if (data.medicalHistory.chronicConditions.length >= 3) {
    flags.push({
      id: 'FLAG-CHRONIC-001',
      category: 'Medical History',
      message: `${data.medicalHistory.chronicConditions.length} chronic conditions - complex care needs`,
      priority: 'high'
    });
  }

  // ─── Missing emergency contact ──────────────────────────
  if (
    data.personalInformation.emergencyContactName.trim() === '' ||
    data.personalInformation.emergencyContactPhone.trim() === ''
  ) {
    flags.push({
      id: 'FLAG-CONTACT-001',
      category: 'Administrative',
      message: 'Emergency contact information missing',
      priority: 'low'
    });
  }

  // ─── Missing GP details ─────────────────────────────────
  if (data.insuranceAndId.gpName.trim() === '') {
    flags.push({
      id: 'FLAG-GP-001',
      category: 'Administrative',
      message: 'GP name not provided',
      priority: 'low'
    });
  }

  // ─── Emergency visit ────────────────────────────────────
  if (data.reasonForVisit.urgencyLevel === 'emergency') {
    flags.push({
      id: 'FLAG-URGENT-001',
      category: 'Urgency',
      message: 'Emergency visit - prioritize assessment',
      priority: 'high'
    });
  }

  // ─── Consent issues ─────────────────────────────────────
  if (data.consentAndPreferences.consentToTreatment === 'no') {
    flags.push({
      id: 'FLAG-CONSENT-001',
      category: 'Consent',
      message: 'Patient has NOT consented to treatment',
      priority: 'high'
    });
  }

  if (data.consentAndPreferences.privacyAcknowledgement === 'no') {
    flags.push({
      id: 'FLAG-CONSENT-002',
      category: 'Consent',
      message: 'Patient has NOT acknowledged privacy notice',
      priority: 'medium'
    });
  }

  // ─── Advance directives ─────────────────────────────────
  if (data.consentAndPreferences.advanceDirectives === 'yes') {
    flags.push({
      id: 'FLAG-DIRECTIVE-001',
      category: 'Consent',
      message: `Advance directives on file: ${data.consentAndPreferences.advanceDirectiveDetails || 'details not specified'}`,
      priority: 'medium'
    });
  }

  // ─── Heavy smoking ──────────────────────────────────────
  if (data.socialHistory.smokingStatus === 'current') {
    flags.push({
      id: 'FLAG-SMOKE-001',
      category: 'Social History',
      message: 'Current smoker - consider cessation counselling',
      priority: 'medium'
    });
  }

  // ─── Heavy alcohol ──────────────────────────────────────
  if (data.socialHistory.alcoholFrequency === 'heavy') {
    flags.push({
      id: 'FLAG-ALCOHOL-001',
      category: 'Social History',
      message: 'Heavy alcohol use reported',
      priority: 'medium'
    });
  }

  // ─── Regular drug use ───────────────────────────────────
  if (data.socialHistory.drugUse === 'regular') {
    flags.push({
      id: 'FLAG-DRUGS-001',
      category: 'Social History',
      message: `Regular drug use: ${data.socialHistory.drugDetails || 'details not specified'}`,
      priority: 'high'
    });
  }

  // ─── Cardiovascular symptoms ────────────────────────────
  if (data.reviewOfSystems.cardiovascular.trim() !== '') {
    flags.push({
      id: 'FLAG-ROS-CV',
      category: 'Review of Systems',
      message: 'Cardiovascular symptoms reported - requires clinical review',
      priority: 'medium'
    });
  }

  // ─── Family genetic conditions ──────────────────────────
  if (data.familyHistory.geneticConditions === 'yes') {
    flags.push({
      id: 'FLAG-GENETIC-001',
      category: 'Family History',
      message: `Genetic conditions in family: ${data.familyHistory.geneticConditionsDetails || 'details not specified'}`,
      priority: 'medium'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
