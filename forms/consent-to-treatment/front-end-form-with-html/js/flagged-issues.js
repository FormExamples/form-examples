// Additional safety-critical / clinically-significant flag detection
// for the Consent To Treatment form. Mirrors
// `src/lib/engine/flagged-issues.ts`.
//
// Independent of completeness; runs purely against the assessment data
// and returns prioritised flags sorted high > medium > low.

(function () {
  'use strict';

  const NS = (window.ConsentToTreatment = window.ConsentToTreatment || {});

  /**
   * @param {import('./types.js').AssessmentData} data
   * @returns {import('./types.js').AdditionalFlag[]}
   */
  function detectAdditionalFlags(data) {
    /** @type {import('./types.js').AdditionalFlag[]} */
    const flags = [];

    // Incomplete understanding
    const understanding = data.questionsUnderstanding;
    const understandingFields = [
      understanding.understandsProcedure,
      understanding.understandsRisks,
      understanding.understandsAlternatives,
      understanding.understandsRecovery
    ];
    const noUnderstanding = understandingFields.filter((v) => v === 'no');
    if (noUnderstanding.length > 0) {
      flags.push({
        id: 'FLAG-UNDERSTAND-001',
        category: 'Incomplete Understanding',
        message: 'Patient indicated lack of understanding on ' + noUnderstanding.length +
          ' area(s) - consent may not be fully informed',
        priority: 'high'
      });
    }

    // Previous anesthesia problems
    if (data.anesthesiaInformation.previousAnesthesiaProblems === 'yes') {
      const details = data.anesthesiaInformation.previousAnesthesiaDetails || 'details not specified';
      flags.push({
        id: 'FLAG-ANESTH-001',
        category: 'Anesthesia Risk',
        message: 'Previous anesthesia problems reported: ' + details +
          ' - anesthesia team must be notified',
        priority: 'high'
      });
    }

    // High-risk procedure indicators
    const seriousRisks = (data.risksBenefits.seriousRisks || '').toLowerCase();
    if (
      seriousRisks.indexOf('death') !== -1 ||
      seriousRisks.indexOf('permanent') !== -1 ||
      seriousRisks.indexOf('paralysis') !== -1 ||
      seriousRisks.indexOf('organ failure') !== -1
    ) {
      flags.push({
        id: 'FLAG-HIGHRISK-001',
        category: 'High-Risk Procedure',
        message: 'Serious risks include life-threatening or permanent outcomes - ensure thorough informed consent discussion',
        priority: 'high'
      });
    }

    // Missing acknowledgements
    const rights = data.patientRights;
    const missingAcknowledgements = [];
    if (rights.rightToWithdraw !== 'yes') missingAcknowledgements.push('right to withdraw');
    if (rights.rightToSecondOpinion !== 'yes') missingAcknowledgements.push('right to second opinion');
    if (rights.informedVoluntarily !== 'yes') missingAcknowledgements.push('voluntary consent');
    if (rights.noGuaranteeAcknowledged !== 'yes') missingAcknowledgements.push('no guarantee');

    if (missingAcknowledgements.length > 0) {
      flags.push({
        id: 'FLAG-RIGHTS-001',
        category: 'Missing Acknowledgements',
        message: 'Patient has not acknowledged: ' + missingAcknowledgements.join(', '),
        priority: 'high'
      });
    }

    // Patient concerns noted
    const concerns = (data.questionsUnderstanding.additionalConcerns || '').trim();
    if (concerns.length > 0) {
      flags.push({
        id: 'FLAG-CONCERNS-001',
        category: 'Patient Concerns',
        message: 'Patient has documented additional concerns: "' + concerns + '"',
        priority: 'medium'
      });
    }

    // Interpreter needed but not documented
    if (
      data.signatureConsent.interpreterUsed === 'yes' &&
      !(data.signatureConsent.interpreterName || '').trim()
    ) {
      flags.push({
        id: 'FLAG-INTERPRETER-001',
        category: 'Interpreter Documentation',
        message: 'Interpreter was used but interpreter name has not been documented',
        priority: 'high'
      });
    }

    // Patient consent not given
    if (data.signatureConsent.patientConsent === 'no') {
      flags.push({
        id: 'FLAG-NOCONSENT-001',
        category: 'Consent Refused',
        message: 'Patient has explicitly declined to give consent',
        priority: 'high'
      });
    }

    // General anesthesia with admission not required
    if (
      data.anesthesiaInformation.anesthesiaType === 'general' &&
      data.procedureDetails.admissionRequired === 'no'
    ) {
      flags.push({
        id: 'FLAG-ADMISSION-001',
        category: 'Admission Review',
        message: 'General anesthesia planned but admission not marked as required - please verify',
        priority: 'medium'
      });
    }

    // Sort: high > medium > low
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return flags;
  }

  NS.detectAdditionalFlags = detectAdditionalFlags;
})();
