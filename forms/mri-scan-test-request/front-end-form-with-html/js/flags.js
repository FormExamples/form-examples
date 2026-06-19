// Safety-flag detection for the MRI Scan Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: ferromagnetic-implant, pacemaker-icd, orbital-foreign-body,
// gadolinium-renal-risk, pregnancy, claustrophobia, missing-safety-screen,
// missing-indication, missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.MriScanTestRequest`.

(function () {
'use strict';
window.MriScanTestRequest = window.MriScanTestRequest || {};
const NS = window.MriScanTestRequest;

/**
 * Detect safety flags for an MRI scan request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ contrastRenalFlag })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Absolute / high-risk implant categories -----------------------
  if (data.safety.pacemakerOrIcd === true) {
    flags.push({
      flagId: 'F-PACEMAKER-ICD-001',
      category: 'pacemaker-icd',
      priority: 'high',
      description: 'Cardiac pacemaker or ICD present.',
      suggestedAction: 'Do not scan until device MR-conditional status and programming are confirmed by cardiology and MR physics.'
    });
  }
  if (data.safety.metallicForeignBodyEye === true) {
    flags.push({
      flagId: 'F-ORBITAL-FOREIGN-BODY-001',
      category: 'orbital-foreign-body',
      priority: 'high',
      description: 'Metallic foreign body in the eye / orbit.',
      suggestedAction: 'Exclude with an orbital radiograph before scanning; do not scan if positive.'
    });
  }
  if (data.safety.aneurysmClip === true) {
    flags.push({
      flagId: 'F-FERROMAGNETIC-ANEURYSM-CLIP-001',
      category: 'ferromagnetic-implant',
      priority: 'high',
      description: 'Intracranial aneurysm clip present.',
      suggestedAction: 'Confirm documented MR-conditional / non-ferromagnetic clip before scanning; otherwise contraindicated.'
    });
  }

  // --- Conditional implant categories --------------------------------
  if (
    data.safety.cochlearImplant === true ||
    data.safety.programmableShunt === true ||
    data.safety.neurostimulator === true ||
    data.safety.metalImplantOrProsthesis === true ||
    data.safety.insulinPump === true ||
    data.safety.shrapnelOrMetalFragments === true
  ) {
    flags.push({
      flagId: 'F-FERROMAGNETIC-IMPLANT-001',
      category: 'ferromagnetic-implant',
      priority: 'medium',
      description: 'Conditional implant or metal fragment recorded on the safety screen.',
      suggestedAction: 'Refer to MR physics to confirm MR-conditional labelling, field strength, and protocol.'
    });
  }

  // --- Gadolinium / renal (NSF) risk ---------------------------------
  if (ctx.contrastRenalFlag === 'contraindicated') {
    flags.push({
      flagId: 'F-GADOLINIUM-RENAL-001',
      category: 'gadolinium-renal-risk',
      priority: 'high',
      description: 'IV gadolinium requested with eGFR < 30 (nephrogenic-systemic-fibrosis risk).',
      suggestedAction: 'Avoid gadolinium; discuss non-contrast protocol or alternative with the radiologist.'
    });
  } else if (ctx.contrastRenalFlag === 'caution') {
    flags.push({
      flagId: 'F-GADOLINIUM-RENAL-002',
      category: 'gadolinium-renal-risk',
      priority: 'medium',
      description: 'IV gadolinium requested with eGFR 30-60.',
      suggestedAction: 'Use a group II / low-risk agent only when clinically necessary; document justification.'
    });
  } else if (ctx.contrastRenalFlag === 'unknown') {
    flags.push({
      flagId: 'F-GADOLINIUM-RENAL-003',
      category: 'gadolinium-renal-risk',
      priority: 'medium',
      description: 'IV gadolinium requested but eGFR not recorded.',
      suggestedAction: 'Obtain a recent eGFR before administering gadolinium contrast.'
    });
  }
  if (data.contrast.previousGadoliniumReaction === 'moderate' ||
      data.contrast.previousGadoliniumReaction === 'severe') {
    flags.push({
      flagId: 'F-GADOLINIUM-REACTION-001',
      category: 'gadolinium-renal-risk',
      priority: 'high',
      description: 'Previous moderate-to-severe gadolinium contrast reaction reported.',
      suggestedAction: 'Avoid gadolinium or arrange premedication and supervised administration per local policy.'
    });
  }

  // --- Pregnancy -----------------------------------------------------
  if (
    (data.contrast.pregnancyStatus === 'pregnant' ||
      data.contrast.pregnancyStatus === 'possible') &&
    data.contrast.contrastRequired === 'iv-gadolinium'
  ) {
    flags.push({
      flagId: 'F-PREGNANCY-001',
      category: 'pregnancy',
      priority: 'high',
      description: 'Pregnant / possibly pregnant with IV gadolinium requested.',
      suggestedAction: 'Avoid gadolinium in pregnancy unless the benefit clearly outweighs the risk; senior review required.'
    });
  } else if (data.contrast.pregnancyStatus === 'pregnant' ||
             data.contrast.pregnancyStatus === 'possible') {
    flags.push({
      flagId: 'F-PREGNANCY-002',
      category: 'pregnancy',
      priority: 'medium',
      description: 'Patient is pregnant or possibly pregnant.',
      suggestedAction: 'Confirm the examination is clinically justified in pregnancy; document the decision.'
    });
  }

  // --- Claustrophobia ------------------------------------------------
  if (data.safety.claustrophobia === true) {
    flags.push({
      flagId: 'F-CLAUSTROPHOBIA-001',
      category: 'claustrophobia',
      priority: 'low',
      description: 'Claustrophobia recorded.',
      suggestedAction: 'Consider open-bore scanner, sedation, or anaesthetic support; allow extra appointment time.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (!data.safety.mriSafetyStatus) {
    flags.push({
      flagId: 'F-MISSING-SAFETY-SCREEN-001',
      category: 'missing-safety-screen',
      priority: 'high',
      description: 'No preliminary MRI safety screen status recorded.',
      suggestedAction: 'Complete the MRI safety screen before the request is vetted.'
    });
  }
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

  return flags;
}

Object.assign(NS, { detectFlags });
})();
