import { calculateAge } from './types.js';

// Flagged-issue detection for the Bone Marrow Donation Assessment.
//
// Independent of the rule-firing grader, this module raises clinician-facing
// flags for safety-critical findings (positive infection screens, low Hb,
// difficult airway, coercion concerns, missing consent, etc.) so that the
// assessor sees them immediately in the report.

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @param {*} data Full AssessmentData.
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  const flags = [];

  // ─── HLA / matching ─────────────────────────────────────────
  const hla = data.donorRegistrationHlaTyping;
  if (hla.crossmatchResult === 'positive') {
    flags.push({
      id: 'FLAG-HLA-001',
      category: 'HLA Matching',
      message: 'Positive crossmatch — donor-specific antibodies present; donation contraindicated.',
      priority: 'high'
    });
  }
  if (hla.hlaMatchLevel === '7-of-10') {
    flags.push({
      id: 'FLAG-HLA-002',
      category: 'HLA Matching',
      message: '7/10 HLA match — three antigen mismatches; high GvHD / rejection risk.',
      priority: 'high'
    });
  }
  if (hla.hlaMatchLevel === 'haploidentical') {
    flags.push({
      id: 'FLAG-HLA-003',
      category: 'HLA Matching',
      message: 'Haploidentical match — high GvHD risk; specialist conditioning required.',
      priority: 'medium'
    });
  }

  // ─── Demographics ───────────────────────────────────────────
  const age = calculateAge(data.demographics.dateOfBirth);
  if (age !== null && age < 18) {
    flags.push({
      id: 'FLAG-DM-001',
      category: 'Demographics',
      message: `Donor age ${age} years — minor; specialist paediatric donor pathway required.`,
      priority: 'high'
    });
  } else if (age !== null && age > 60) {
    flags.push({
      id: 'FLAG-DM-002',
      category: 'Demographics',
      message: `Donor age ${age} years — increased peri-procedural risk.`,
      priority: 'medium'
    });
  }
  if (data.demographics.bmi !== null && data.demographics.bmi >= 35) {
    flags.push({
      id: 'FLAG-DM-003',
      category: 'Demographics',
      message: `BMI ${data.demographics.bmi} — obesity increases anaesthetic and harvest risk.`,
      priority: 'medium'
    });
  }

  // ─── Medical history ────────────────────────────────────────
  const mh = data.medicalHistory;
  if (mh.hasMalignancy === 'yes') {
    flags.push({
      id: 'FLAG-MH-001',
      category: 'Medical History',
      message: 'History of malignancy — typically contraindicates donation.',
      priority: 'high'
    });
  }
  if (mh.hasBleedingDisorder === 'yes') {
    flags.push({
      id: 'FLAG-MH-002',
      category: 'Medical History',
      message: 'Bleeding disorder — contraindicates marrow harvest under anaesthetic.',
      priority: 'high'
    });
  }
  if (mh.hasAutoimmuneDisease === 'yes') {
    flags.push({
      id: 'FLAG-MH-003',
      category: 'Medical History',
      message: 'Autoimmune disease — risk of transfer; review with transplant team.',
      priority: 'medium'
    });
  }
  if (mh.hasCardiovascularDisease === 'yes') {
    flags.push({
      id: 'FLAG-MH-004',
      category: 'Medical History',
      message: 'Cardiovascular disease — anaesthetic / fluid-shift risk.',
      priority: 'medium'
    });
  }
  if (mh.hasRenalDisease === 'yes' || mh.hasHepaticDisease === 'yes') {
    flags.push({
      id: 'FLAG-MH-005',
      category: 'Medical History',
      message: 'Renal or hepatic disease present — review fitness for G-CSF and anaesthetic.',
      priority: 'medium'
    });
  }

  // ─── Physical examination ───────────────────────────────────
  const pe = data.physicalExamination;
  if (pe.generalAppearance === 'acutely-unwell') {
    flags.push({
      id: 'FLAG-PE-001',
      category: 'Physical Examination',
      message: 'Donor acutely unwell — defer donation pending recovery.',
      priority: 'high'
    });
  }
  if (pe.oxygenSaturation !== null && pe.oxygenSaturation < 95) {
    flags.push({
      id: 'FLAG-PE-002',
      category: 'Physical Examination',
      message: `SpO2 ${pe.oxygenSaturation}% — investigate before anaesthetic.`,
      priority: 'high'
    });
  }
  if (pe.cardiovascularExamination === 'abnormal') {
    flags.push({
      id: 'FLAG-PE-003',
      category: 'Physical Examination',
      message: 'Abnormal cardiovascular examination — review before anaesthetic.',
      priority: 'medium'
    });
  }
  if (pe.respiratoryExamination === 'abnormal') {
    flags.push({
      id: 'FLAG-PE-004',
      category: 'Physical Examination',
      message: 'Abnormal respiratory examination — review before anaesthetic.',
      priority: 'medium'
    });
  }
  if (pe.posteriorIliacCrestAssessment === 'unsuitable') {
    flags.push({
      id: 'FLAG-PE-005',
      category: 'Physical Examination',
      message: 'Posterior iliac crest unsuitable — consider PBSC route instead of harvest.',
      priority: 'medium'
    });
  }
  if (pe.venousAccessAssessment === 'poor') {
    flags.push({
      id: 'FLAG-PE-006',
      category: 'Physical Examination',
      message: 'Poor peripheral venous access — central line likely required for apheresis.',
      priority: 'medium'
    });
  }

  // ─── Haematological ─────────────────────────────────────────
  const hm = data.haematologicalAssessment;
  if (hm.haemoglobin !== null && hm.haemoglobin < 10) {
    flags.push({
      id: 'FLAG-HM-001',
      category: 'Haematology',
      message: `Severely low haemoglobin (${hm.haemoglobin} g/dL) — defer donation.`,
      priority: 'high'
    });
  } else if (hm.haemoglobin !== null && hm.haemoglobin < 12) {
    flags.push({
      id: 'FLAG-HM-002',
      category: 'Haematology',
      message: `Low haemoglobin (${hm.haemoglobin} g/dL) — investigate and optimise iron stores.`,
      priority: 'medium'
    });
  }
  if (hm.plateletCount !== null && hm.plateletCount < 150) {
    flags.push({
      id: 'FLAG-HM-003',
      category: 'Haematology',
      message: `Low platelets (${hm.plateletCount} x10^9/L) — bleeding risk for harvest.`,
      priority: 'high'
    });
  }
  if (hm.coagulationScreen === 'abnormal') {
    flags.push({
      id: 'FLAG-HM-004',
      category: 'Haematology',
      message: 'Abnormal coagulation screen — bleeding risk for marrow harvest.',
      priority: 'high'
    });
  }
  if (hm.liverFunction === 'abnormal') {
    flags.push({
      id: 'FLAG-HM-005',
      category: 'Haematology',
      message: 'Abnormal liver function — review fitness for G-CSF and anaesthetic.',
      priority: 'medium'
    });
  }
  if (hm.creatinine !== null && hm.creatinine > 120) {
    flags.push({
      id: 'FLAG-HM-006',
      category: 'Haematology',
      message: `Elevated creatinine (${hm.creatinine} umol/L) — review renal function.`,
      priority: 'medium'
    });
  }

  // ─── Infectious disease ─────────────────────────────────────
  const id = data.infectiousDiseaseScreening;
  const positiveLabels = {
    hivStatus: 'HIV',
    hepatitisBSurfaceAntigen: 'Hepatitis B (HBsAg)',
    hepatitisBCoreAntibody: 'Hepatitis B (anti-HBc)',
    hepatitisCAbntibody: 'Hepatitis C antibody',
    htlvStatus: 'HTLV',
    syphilisScreen: 'Syphilis',
    tuberculosisScreen: 'Tuberculosis'
  };
  for (const key of Object.keys(positiveLabels)) {
    if (id[key] === 'positive') {
      flags.push({
        id: `FLAG-ID-${key}`,
        category: 'Infectious Disease',
        message: `${positiveLabels[key]} screen positive — typically contraindicates donation.`,
        priority: 'high'
      });
    }
  }
  if (id.recentInfection === 'yes') {
    flags.push({
      id: 'FLAG-ID-007',
      category: 'Infectious Disease',
      message: `Recent infection: ${id.infectionDetails || 'details not provided'} — defer until resolved.`,
      priority: 'medium'
    });
  }
  if (id.recentTravel === 'yes') {
    flags.push({
      id: 'FLAG-ID-008',
      category: 'Infectious Disease',
      message: `Recent travel reported: ${id.travelDetails || 'details not provided'} — review for exposure-related deferral.`,
      priority: 'low'
    });
  }
  if (id.vaccinationUpToDate === 'no') {
    flags.push({
      id: 'FLAG-ID-009',
      category: 'Infectious Disease',
      message: 'Vaccinations not up to date — review pre-donation immunisation schedule.',
      priority: 'low'
    });
  }

  // ─── Anaesthetic ────────────────────────────────────────────
  const an = data.anaestheticAssessment;
  if (an.asaGrade === 'III' || an.asaGrade === 'IV') {
    flags.push({
      id: 'FLAG-AN-001',
      category: 'Anaesthetic',
      message: `ASA Grade ${an.asaGrade} — high anaesthetic risk for marrow harvest.`,
      priority: 'high'
    });
  }
  if (an.anaestheticComplications === 'yes') {
    flags.push({
      id: 'FLAG-AN-002',
      category: 'Anaesthetic',
      message: `Previous anaesthetic complications: ${an.complicationDetails || 'details not provided'}.`,
      priority: 'high'
    });
  }
  if (an.mallampatiScore === 'III' || an.mallampatiScore === 'IV') {
    flags.push({
      id: 'FLAG-AN-003',
      category: 'Anaesthetic',
      message: `Mallampati ${an.mallampatiScore} — anticipate difficult airway.`,
      priority: 'medium'
    });
  }
  if (an.airwayConcerns === 'yes') {
    flags.push({
      id: 'FLAG-AN-004',
      category: 'Anaesthetic',
      message: `Airway concerns: ${an.airwayDetails || 'details not provided'}.`,
      priority: 'medium'
    });
  }
  if (an.familyAnaestheticProblems === 'yes') {
    flags.push({
      id: 'FLAG-AN-005',
      category: 'Anaesthetic',
      message: `Family history of anaesthetic problems: ${an.familyProblemDetails || 'details not provided'} — consider malignant hyperthermia screening.`,
      priority: 'medium'
    });
  }
  if (an.smokingStatus === 'current') {
    flags.push({
      id: 'FLAG-AN-006',
      category: 'Anaesthetic',
      message: 'Current smoker — increased anaesthetic / respiratory risk.',
      priority: 'low'
    });
  }
  if (an.alcoholUse === 'heavy') {
    flags.push({
      id: 'FLAG-AN-007',
      category: 'Anaesthetic',
      message: 'Heavy alcohol use — review hepatic function and withdrawal risk.',
      priority: 'medium'
    });
  }

  // ─── Collection method ──────────────────────────────────────
  const cm = data.collectionMethodAssessment;
  if (cm.gcsfEligible === 'no') {
    flags.push({
      id: 'FLAG-CM-001',
      category: 'Collection Method',
      message: `G-CSF ineligible: ${cm.gcsfContraindications || 'contraindications not specified'} — PBSC not feasible.`,
      priority: 'high'
    });
  }
  if (cm.venousAccessSuitableForApheresis === 'no') {
    flags.push({
      id: 'FLAG-CM-002',
      category: 'Collection Method',
      message: 'Venous access unsuitable for apheresis — central line required if PBSC chosen.',
      priority: 'medium'
    });
  }
  if (cm.centralLineRequired === 'yes') {
    flags.push({
      id: 'FLAG-CM-003',
      category: 'Collection Method',
      message: 'Central line required — additional procedural risk.',
      priority: 'medium'
    });
  }

  // ─── Psychological readiness ────────────────────────────────
  const ps = data.psychologicalReadiness;
  if (ps.coercionConcerns === 'yes') {
    flags.push({
      id: 'FLAG-PS-001',
      category: 'Psychological',
      message: `Coercion concerns identified: ${ps.coercionDetails || 'details not provided'} — escalate to donor advocate.`,
      priority: 'high'
    });
  }
  if (ps.understandsProcedure === 'no' || ps.understandsRisks === 'no') {
    flags.push({
      id: 'FLAG-PS-002',
      category: 'Psychological',
      message: 'Donor does not fully understand procedure or risks — additional counselling required before consent.',
      priority: 'high'
    });
  }
  if (ps.willingToProceed === 'no') {
    flags.push({
      id: 'FLAG-PS-003',
      category: 'Psychological',
      message: 'Donor unwilling to proceed — donation must not occur.',
      priority: 'high'
    });
  } else if (ps.willingToProceed === 'undecided') {
    flags.push({
      id: 'FLAG-PS-004',
      category: 'Psychological',
      message: 'Donor undecided — allow time and offer further counselling.',
      priority: 'medium'
    });
  }
  if (ps.anxietyAboutProcedure === 'severe') {
    flags.push({
      id: 'FLAG-PS-005',
      category: 'Psychological',
      message: 'Severe anxiety about procedure — psychological support recommended.',
      priority: 'medium'
    });
  }
  if (ps.supportNetwork === 'no') {
    flags.push({
      id: 'FLAG-PS-006',
      category: 'Psychological',
      message: 'No support network identified — arrange additional aftercare.',
      priority: 'medium'
    });
  }
  if (ps.donorAdvocateConsulted === 'no') {
    flags.push({
      id: 'FLAG-PS-007',
      category: 'Psychological',
      message: 'Donor advocate not yet consulted — required prior to consent for unrelated donation.',
      priority: 'low'
    });
  }

  // ─── Consent & eligibility ──────────────────────────────────
  const ce = data.consentEligibility;
  if (ce.informedConsentGiven === 'no' || ce.consentFormSigned === 'no') {
    flags.push({
      id: 'FLAG-CE-001',
      category: 'Consent',
      message: 'Informed consent incomplete — donation cannot proceed without signed consent.',
      priority: 'high'
    });
  }
  if (ce.questionsAnswered === 'no') {
    flags.push({
      id: 'FLAG-CE-002',
      category: 'Consent',
      message: 'Donor questions not yet answered — complete counselling before consent.',
      priority: 'medium'
    });
  }
  if (ce.eligibilityDecision === 'unsuitable') {
    flags.push({
      id: 'FLAG-CE-003',
      category: 'Eligibility',
      message: `Assessor recorded UNSUITABLE: ${ce.deferralReason || 'reason not provided'} (${ce.deferralDuration || 'duration not specified'}).`,
      priority: 'high'
    });
  } else if (ce.eligibilityDecision === 'conditionally-suitable') {
    flags.push({
      id: 'FLAG-CE-004',
      category: 'Eligibility',
      message: `Assessor recorded CONDITIONALLY SUITABLE: ${ce.eligibilityConditions || 'conditions not specified'}.`,
      priority: 'medium'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
