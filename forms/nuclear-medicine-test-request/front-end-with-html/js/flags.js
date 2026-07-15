// Safety-flag detection for the Nuclear Medicine Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: pregnancy, breastfeeding, high-radiation-dose,
// recent-radionuclide-interference, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

/**
 * Detect safety flags for a nuclear medicine request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ radiationDoseBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Pregnancy --------------------------------------------------------
  if (data.safety.pregnancyStatus === 'pregnant') {
    flags.push({
      flagId: 'F-PREGNANCY-001',
      category: 'pregnancy',
      priority: 'high',
      description: 'Patient is pregnant.',
      suggestedAction: 'Do not administer until justified by a nuclear-medicine physician; consider alternative non-ionising imaging.'
    });
  } else if (data.safety.pregnancyStatus === 'possible' || data.safety.pregnancyStatus === 'unknown') {
    flags.push({
      flagId: 'F-PREGNANCY-002',
      category: 'pregnancy',
      priority: 'medium',
      description: 'Pregnancy status is possible or unknown.',
      suggestedAction: 'Confirm pregnancy status (pregnancy test or LMP) before administration.'
    });
  }

  // --- Breastfeeding ----------------------------------------------------
  if (data.safety.breastfeeding === true) {
    flags.push({
      flagId: 'F-BREASTFEEDING-001',
      category: 'breastfeeding',
      priority: 'medium',
      description: 'Patient is breastfeeding.',
      suggestedAction: 'Advise breastfeeding interruption / expression per ARSAC guidance for the chosen radiopharmaceutical.'
    });
  }

  // --- High radiation dose ---------------------------------------------
  if (ctx.radiationDoseBand === 'high') {
    flags.push({
      flagId: 'F-HIGH-RADIATION-DOSE-001',
      category: 'high-radiation-dose',
      priority: 'medium',
      description: 'Requested study carries a high effective radiation dose.',
      suggestedAction: 'Confirm IR(ME)R justification and optimise administered activity (ALARA).'
    });
  }

  // --- Recent radionuclide interference --------------------------------
  if (data.safety.recentOtherNuclearScan === true) {
    flags.push({
      flagId: 'F-RECENT-RADIONUCLIDE-INTERFERENCE-001',
      category: 'recent-radionuclide-interference',
      priority: 'medium',
      description: 'Recent other radionuclide study reported.',
      suggestedAction: 'Confirm timing; residual activity may interfere with imaging — consider rescheduling.'
    });
  }

  // --- Completeness / data-quality flags -------------------------------
  if (!data.request.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.request.clinicalQuestion || data.request.clinicalQuestion.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-QUESTION-001',
      category: 'missing-clinical-question',
      priority: 'medium',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the scan should answer.'
    });
  }
  if (!data.justification.irMeRJustification || data.justification.irMeRJustification.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-JUSTIFICATION-001',
      category: 'other',
      priority: 'low',
      description: 'No IR(ME)R justification statement recorded.',
      suggestedAction: 'Obtain the referrer justification before the practitioner authorises the exposure.'
    });
  }

  return flags;
}

export { detectFlags };
