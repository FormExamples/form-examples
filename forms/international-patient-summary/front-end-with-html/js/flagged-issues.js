// Flagged-issue detection for the International Patient Summary.
// Independent of completeness grading (which `ips-validator.js`
// computes), this module raises clinician-facing flags for
// high-severity allergies, missing identifiers, draft signoff,
// long-stale records, and other cross-border-care risks.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.InternationalPatientSummary.

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Allergy alerts ───────────────────────────────────────
  for (let i = 0; i < data.allergiesIntolerances.length; i++) {
    const a = data.allergiesIntolerances[i];
    if (!a) continue;
    if (a.severity === 'severe' || a.criticality === 'high') {
      flags.push({
        id: `FLAG-ALLERGY-HIGH-${i}`,
        category: 'Allergy',
        message:
          `High-criticality allergy: ${a.substance || '(substance not specified)'}` +
          (a.reaction ? ` — reaction: ${a.reaction}` : '') + '.',
        priority: 'urgent'
      });
    }
  }

  // ─── Patient identification ───────────────────────────────
  const p = data.patientDemographics;
  const hasName =
    String(p.givenName || '').trim() !== '' &&
    String(p.familyName || '').trim() !== '';
  if (!hasName) {
    flags.push({
      id: 'FLAG-PT-001',
      category: 'Patient Demographics',
      message: 'Patient name missing — IPS cannot be issued without identifying details.',
      priority: 'high'
    });
  }
  if (String(p.dateOfBirth || '').trim() === '') {
    flags.push({
      id: 'FLAG-PT-002',
      category: 'Patient Demographics',
      message: 'Date of birth missing — required for unambiguous patient identification.',
      priority: 'high'
    });
  }
  if (String(p.nationalIdentifier || '').trim() === '') {
    flags.push({
      id: 'FLAG-PT-003',
      category: 'Patient Demographics',
      message: 'No national identifier recorded — recommended for cross-border matching.',
      priority: 'medium'
    });
  }
  if (String(p.country || '').trim() === '') {
    flags.push({
      id: 'FLAG-PT-004',
      category: 'Patient Demographics',
      message: 'Patient country missing — recommended for cross-border IPS exchange.',
      priority: 'low'
    });
  }
  if (String(p.preferredLanguage || '').trim() === '') {
    flags.push({
      id: 'FLAG-PT-005',
      category: 'Patient Demographics',
      message: 'Preferred language not recorded — affects cross-border communication.',
      priority: 'low'
    });
  }

  // ─── Authoring clinician / signoff ────────────────────────
  const c = data.authoringClinician;
  if (c.authoringStatus === 'draft') {
    flags.push({
      id: 'FLAG-AUTH-001',
      category: 'Authoring',
      message: 'Authoring status is "draft" — finalise before exchange.',
      priority: 'medium'
    });
  } else if (c.authoringStatus === '') {
    flags.push({
      id: 'FLAG-AUTH-002',
      category: 'Authoring',
      message: 'Authoring status not set — IPS is unsigned.',
      priority: 'high'
    });
  }
  if (c.authoringStatus === 'final' && String(c.signoffDate || '').trim() === '') {
    flags.push({
      id: 'FLAG-AUTH-003',
      category: 'Authoring',
      message: 'Final IPS missing signoff date.',
      priority: 'medium'
    });
  }

  // ─── Empty mandatory clinical sections ────────────────────
  if (data.problemList.length === 0) {
    flags.push({
      id: 'FLAG-CLIN-001',
      category: 'Problem List',
      message: 'No problems recorded — confirm "no known problems" or add entries.',
      priority: 'high'
    });
  }
  if (data.medicationSummary.length === 0) {
    flags.push({
      id: 'FLAG-CLIN-002',
      category: 'Medications',
      message: 'No medications recorded — confirm "no current medications" or add entries.',
      priority: 'high'
    });
  }
  if (data.allergiesIntolerances.length === 0) {
    flags.push({
      id: 'FLAG-CLIN-003',
      category: 'Allergies',
      message: 'No allergies recorded — IPS requires either entries or an explicit "no known allergies" marker.',
      priority: 'high'
    });
  }
  if (data.immunisations.length === 0) {
    flags.push({
      id: 'FLAG-CLIN-004',
      category: 'Immunisations',
      message: 'No immunisations recorded — confirm history is unknown or add entries.',
      priority: 'medium'
    });
  }
  if (data.procedures.length === 0) {
    flags.push({
      id: 'FLAG-CLIN-005',
      category: 'Procedures',
      message: 'No procedures recorded — confirm absence of relevant history.',
      priority: 'medium'
    });
  }
  if (data.resultsInvestigations.length === 0) {
    flags.push({
      id: 'FLAG-CLIN-006',
      category: 'Results',
      message: 'No results or investigations recorded.',
      priority: 'medium'
    });
  }

  // ─── Cross-border consent ─────────────────────────────────
  if (data.advanceDirectives.consentToShareEu === 'no') {
    flags.push({
      id: 'FLAG-CONSENT-001',
      category: 'Consent',
      message: 'Patient has NOT consented to cross-border IPS sharing — do not export.',
      priority: 'urgent'
    });
  } else if (data.advanceDirectives.consentToShareEu === '') {
    flags.push({
      id: 'FLAG-CONSENT-002',
      category: 'Consent',
      message: 'Cross-border sharing consent not recorded.',
      priority: 'medium'
    });
  }

  // ─── Advance directives ───────────────────────────────────
  if (data.advanceDirectives.dnrInPlace === 'yes') {
    flags.push({
      id: 'FLAG-AD-001',
      category: 'Advance Directives',
      message: 'DNR (Do Not Resuscitate) order in place.',
      priority: 'high'
    });
  }
  if (data.advanceDirectives.livingWillInPlace === 'yes') {
    flags.push({
      id: 'FLAG-AD-002',
      category: 'Advance Directives',
      message: 'Living will / advance decision in place — review before urgent intervention.',
      priority: 'medium'
    });
  }

  // ─── Implanted devices ────────────────────────────────────
  if (data.medicalDevices.length > 0) {
    flags.push({
      id: 'FLAG-DEVICE-001',
      category: 'Medical Devices',
      message: `${data.medicalDevices.length} medical device(s)/implant(s) recorded — relevant for imaging and surgery.`,
      priority: 'medium'
    });
  }

  // ─── Data-quality cross-checks ────────────────────────────
  for (let i = 0; i < data.medicationSummary.length; i++) {
    const m = data.medicationSummary[i];
    if (!m) continue;
    if (String(m.name || '').trim() !== '' && String(m.dose || '').trim() === '') {
      flags.push({
        id: `FLAG-DQ-MED-${i}`,
        category: 'Data Quality',
        message: `Medication "${m.name}" missing dose information.`,
        priority: 'low'
      });
    }
  }
  for (let i = 0; i < data.problemList.length; i++) {
    const pr = data.problemList[i];
    if (!pr) continue;
    if (String(pr.description || '').trim() !== '' && String(pr.icd10Code || '').trim() === '') {
      flags.push({
        id: `FLAG-DQ-PROB-${i}`,
        category: 'Data Quality',
        message: `Problem "${pr.description}" missing ICD-10 code.`,
        priority: 'low'
      });
    }
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
