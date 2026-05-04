// Flagged-issue detection for the Organ Donation Assessment.
//
// Independent of the rule-firing grader, this module raises clinician-facing
// flags for safety-critical findings (positive infection screens, ABO
// incompatibility, malignancy, coercion, missing consent, etc.) so that the
// assessor sees them immediately in the report.
//
// Priorities:
//   - high   — absolute contraindications and safety-critical findings
//   - medium — extended-criteria donor markers, modest organ dysfunction,
//              CMV/EBV mismatch, etc.
//   - low    — advanced age, controlled hypertension, mild dyslipidaemia
//
// Flags are sorted high → medium → low at the end.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

(function () {
'use strict';
window.OrganDonationAssessment = window.OrganDonationAssessment || {};
const { calculateAge } = window.OrganDonationAssessment;

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  const isLiving = data.donorTypeRegistration.donorType === 'living';

  // ─── Demographics ───────────────────────────────────────────
  const age = calculateAge(data.demographics.dateOfBirth);
  if (age !== null && age > 70) {
    flags.push({
      id: 'FLAG-DM-001',
      category: 'Demographics',
      message: `Donor age ${age} years — extended-criteria donor; review organ-specific suitability.`,
      priority: 'medium'
    });
  } else if (age !== null && age >= 60) {
    flags.push({
      id: 'FLAG-DM-002',
      category: 'Demographics',
      message: `Donor age ${age} years — advanced age; expanded-criteria donor.`,
      priority: 'low'
    });
  }
  if (isLiving && age !== null && age < 18) {
    flags.push({
      id: 'FLAG-DM-003',
      category: 'Demographics',
      message: `Living donor age ${age} years — minor cannot give legal consent under HTA Act 2004.`,
      priority: 'high'
    });
  }
  if (data.demographics.bmi !== null && data.demographics.bmi >= 35) {
    flags.push({
      id: 'FLAG-DM-004',
      category: 'Demographics',
      message: `BMI ${data.demographics.bmi} — obesity increases anaesthetic and surgical risk.`,
      priority: 'medium'
    });
  }

  // ─── Medical history ────────────────────────────────────────
  const mh = data.medicalHistory;
  if (mh.hasMalignancy === 'yes' && mh.hasCnsMalignancy !== 'yes') {
    flags.push({
      id: 'FLAG-MH-001',
      category: 'Medical History',
      message: 'Active non-CNS malignancy — absolute contraindication for organ donation.',
      priority: 'high'
    });
  }
  if (mh.hasCjdRisk === 'yes') {
    flags.push({
      id: 'FLAG-MH-002',
      category: 'Medical History',
      message: 'CJD risk identified — transmission risk; donation contraindicated.',
      priority: 'high'
    });
  }
  if (mh.hasUncontrolledSepsis === 'yes') {
    flags.push({
      id: 'FLAG-MH-003',
      category: 'Medical History',
      message: 'Uncontrolled sepsis — absolute contraindication for organ donation.',
      priority: 'high'
    });
  }
  if (mh.hasActiveInfection === 'yes' && mh.hasUncontrolledSepsis !== 'yes') {
    flags.push({
      id: 'FLAG-MH-004',
      category: 'Medical History',
      message: `Active infection: ${mh.activeInfectionDetails || 'details not provided'} — review before proceeding.`,
      priority: 'medium'
    });
  }
  if (mh.hasAutoimmuneDisease === 'yes') {
    flags.push({
      id: 'FLAG-MH-005',
      category: 'Medical History',
      message: 'Autoimmune disease — risk of disease transmission; review with transplant team.',
      priority: 'medium'
    });
  }
  if (mh.hasDiabetes === 'yes') {
    flags.push({
      id: 'FLAG-MH-006',
      category: 'Medical History',
      message: 'Diabetes mellitus — extended-criteria donor for kidney/pancreas.',
      priority: 'medium'
    });
  }
  if (mh.hasHypertension === 'yes') {
    flags.push({
      id: 'FLAG-MH-007',
      category: 'Medical History',
      message: 'Hypertension present — extended-criteria donor; assess end-organ damage.',
      priority: 'low'
    });
  }
  if (mh.hasCardiovascularDisease === 'yes') {
    flags.push({
      id: 'FLAG-MH-008',
      category: 'Medical History',
      message: 'Cardiovascular disease — review fitness for surgery and organ-specific suitability.',
      priority: 'medium'
    });
  }
  if (mh.ivDrugUseHistory === 'yes') {
    flags.push({
      id: 'FLAG-MH-009',
      category: 'Medical History',
      message: 'IV drug use history — increased viral transmission risk; extend NAT screening.',
      priority: 'medium'
    });
  }

  // ─── Organ function ─────────────────────────────────────────
  const of = data.organFunction;
  if (of.severeOrganFailure === 'yes') {
    flags.push({
      id: 'FLAG-OF-001',
      category: 'Organ Function',
      message: `Severe organ failure incompatible with donation: ${of.severeOrganFailureDetails || 'details not provided'}.`,
      priority: 'high'
    });
  }
  if (of.egfr !== null && of.egfr < 60) {
    flags.push({
      id: 'FLAG-OF-002',
      category: 'Organ Function',
      message: `eGFR ${of.egfr} mL/min/1.73m² — renal dysfunction; kidney donation not recommended.`,
      priority: 'medium'
    });
  } else if (of.egfr !== null && of.egfr < 90) {
    flags.push({
      id: 'FLAG-OF-003',
      category: 'Organ Function',
      message: `eGFR ${of.egfr} mL/min/1.73m² — mild renal impairment; review.`,
      priority: 'low'
    });
  }
  if (of.alt !== null && of.alt > 120) {
    flags.push({
      id: 'FLAG-OF-004',
      category: 'Organ Function',
      message: `ALT ${of.alt} U/L — significantly elevated; investigate hepatic function.`,
      priority: 'medium'
    });
  }
  if (of.ejectionFraction !== null && of.ejectionFraction < 50) {
    flags.push({
      id: 'FLAG-OF-005',
      category: 'Organ Function',
      message: `Ejection fraction ${of.ejectionFraction}% — reduced; heart donation unlikely.`,
      priority: 'medium'
    });
  }
  if (of.pao2Fio2Ratio !== null && of.pao2Fio2Ratio < 300) {
    flags.push({
      id: 'FLAG-OF-006',
      category: 'Organ Function',
      message: `PaO2/FiO2 ratio ${of.pao2Fio2Ratio} — impaired gas exchange; review lung suitability.`,
      priority: 'medium'
    });
  }
  if (of.hba1c !== null && of.hba1c > 6.5) {
    flags.push({
      id: 'FLAG-OF-007',
      category: 'Organ Function',
      message: `HbA1c ${of.hba1c}% — diabetes-range; consider impact on pancreas/kidney donation.`,
      priority: 'low'
    });
  }

  // ─── Infectious disease ─────────────────────────────────────
  const id = data.infectiousDiseaseScreening;
  const positiveLabels = {
    hivStatus: 'HIV',
    hbsAg: 'Hepatitis B (HBsAg)',
    hbcAb: 'Hepatitis B (anti-HBc)',
    hcvAb: 'Hepatitis C antibody',
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
  // CMV / EBV mismatch — donor positive, recipient negative is the
  // classical "mismatch"; here we surface any positive donor result as
  // medium, since recipient status isn't tracked in this form.
  if (id.cmvStatus === 'positive') {
    flags.push({
      id: 'FLAG-ID-CMV',
      category: 'Infectious Disease',
      message: 'CMV positive donor — review for D+/R- mismatch and prophylaxis plan.',
      priority: 'medium'
    });
  }
  if (id.ebvStatus === 'positive') {
    flags.push({
      id: 'FLAG-ID-EBV',
      category: 'Infectious Disease',
      message: 'EBV positive donor — review for D+/R- mismatch (PTLD risk).',
      priority: 'medium'
    });
  }
  if (id.recentInfection === 'yes') {
    flags.push({
      id: 'FLAG-ID-INF',
      category: 'Infectious Disease',
      message: `Recent infection: ${id.infectionDetails || 'details not provided'} — defer until resolved.`,
      priority: 'medium'
    });
  }
  if (id.recentTravel === 'yes') {
    flags.push({
      id: 'FLAG-ID-TRV',
      category: 'Infectious Disease',
      message: `Recent travel: ${id.travelDetails || 'details not provided'} — review for endemic disease exposure.`,
      priority: 'low'
    });
  }

  // ─── Immunological ──────────────────────────────────────────
  const im = data.immunologicalAssessment;
  if (im.aboCompatibility === 'incompatible') {
    flags.push({
      id: 'FLAG-IM-001',
      category: 'Immunological',
      message: 'ABO incompatibility — absolute contraindication unless desensitisation programme used.',
      priority: 'high'
    });
  }
  if (im.crossmatchResult === 'incompatible') {
    flags.push({
      id: 'FLAG-IM-002',
      category: 'Immunological',
      message: 'Positive crossmatch — donor-specific antibodies; donation contraindicated.',
      priority: 'high'
    });
  }
  if (im.donorSpecificAntibodies === 'yes') {
    flags.push({
      id: 'FLAG-IM-003',
      category: 'Immunological',
      message: `Donor-specific antibodies present: ${im.dsaDetails || 'details not provided'}.`,
      priority: 'medium'
    });
  }
  if (im.pra !== null && im.pra > 50) {
    flags.push({
      id: 'FLAG-IM-004',
      category: 'Immunological',
      message: `PRA ${im.pra}% — highly sensitised recipient; matching difficult.`,
      priority: 'medium'
    });
  }

  // ─── Surgical / anaesthetic ─────────────────────────────────
  const su = data.surgicalAssessment;
  if (su.asaGrade === 'IV' || su.asaGrade === 'V') {
    flags.push({
      id: 'FLAG-SU-001',
      category: 'Surgical',
      message: `ASA Grade ${su.asaGrade} — life-threatening systemic disease; surgical risk extreme.`,
      priority: 'high'
    });
  } else if (su.asaGrade === 'III') {
    flags.push({
      id: 'FLAG-SU-002',
      category: 'Surgical',
      message: 'ASA Grade III — severe systemic disease; high surgical risk.',
      priority: 'medium'
    });
  }
  if (su.anaestheticComplications === 'yes') {
    flags.push({
      id: 'FLAG-SU-003',
      category: 'Surgical',
      message: `Previous anaesthetic complications: ${su.complicationDetails || 'details not provided'}.`,
      priority: 'medium'
    });
  }
  if (su.mallampatiScore === 'III' || su.mallampatiScore === 'IV') {
    flags.push({
      id: 'FLAG-SU-004',
      category: 'Surgical',
      message: `Mallampati ${su.mallampatiScore} — anticipate difficult airway.`,
      priority: 'medium'
    });
  }
  if (su.surgicalFitness === 'abnormal') {
    flags.push({
      id: 'FLAG-SU-005',
      category: 'Surgical',
      message: `Abnormal surgical fitness assessment: ${su.surgicalFitnessNotes || 'details not provided'}.`,
      priority: 'medium'
    });
  }
  if (su.smokingStatus === 'current') {
    flags.push({
      id: 'FLAG-SU-006',
      category: 'Surgical',
      message: 'Current smoker — increased peri-operative respiratory risk.',
      priority: 'low'
    });
  }
  if (su.alcoholUse === 'heavy') {
    flags.push({
      id: 'FLAG-SU-007',
      category: 'Surgical',
      message: 'Heavy alcohol use — review hepatic function and withdrawal risk.',
      priority: 'medium'
    });
  }

  // ─── Psychological (Living donor only) ──────────────────────
  if (isLiving) {
    const ps = data.psychologicalAssessment;
    if (ps.coercionConcerns === 'yes') {
      flags.push({
        id: 'FLAG-PS-001',
        category: 'Psychological',
        message: `Coercion concerns identified: ${ps.coercionDetails || 'details not provided'} — escalate; donation must not proceed.`,
        priority: 'high'
      });
    }
    if (ps.mentalCapacityConfirmed === 'no') {
      flags.push({
        id: 'FLAG-PS-002',
        category: 'Psychological',
        message: 'Mental capacity not confirmed — informed consent invalid; donation must not proceed.',
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
    }
    if (ps.ambivalence === 'yes') {
      flags.push({
        id: 'FLAG-PS-004',
        category: 'Psychological',
        message: `Donor ambivalence: ${ps.ambivalenceDetails || 'details not provided'} — allow time and offer further counselling.`,
        priority: 'medium'
      });
    }
    if (ps.understandsProcedure === 'no' || ps.understandsRisks === 'no') {
      flags.push({
        id: 'FLAG-PS-005',
        category: 'Psychological',
        message: 'Donor does not fully understand procedure or risks — additional counselling required before consent.',
        priority: 'medium'
      });
    }
    if (ps.anxietyAboutProcedure === 'severe') {
      flags.push({
        id: 'FLAG-PS-006',
        category: 'Psychological',
        message: 'Severe anxiety about procedure — psychological support recommended.',
        priority: 'medium'
      });
    }
    if (ps.supportNetwork === 'no') {
      flags.push({
        id: 'FLAG-PS-007',
        category: 'Psychological',
        message: 'No support network identified — arrange additional aftercare.',
        priority: 'low'
      });
    }
  }

  // ─── Ethical & legal (Living donor only) ────────────────────
  if (isLiving) {
    const el = data.ethicalLegalRequirements;
    if (el.htaAct2004Compliant === 'no') {
      flags.push({
        id: 'FLAG-EL-001',
        category: 'Ethical / Legal',
        message: 'HTA Act 2004 compliance not confirmed — donation cannot proceed.',
        priority: 'high'
      });
    }
    if (el.informedConsentGiven === 'no' || el.consentFormSigned === 'no') {
      flags.push({
        id: 'FLAG-EL-002',
        category: 'Ethical / Legal',
        message: 'Informed consent incomplete — donation cannot proceed without signed consent.',
        priority: 'high'
      });
    }
    if (el.financialRewardCheck === 'no') {
      flags.push({
        id: 'FLAG-EL-003',
        category: 'Ethical / Legal',
        message: 'Financial reward / inducement check not satisfied — HTA Act 2004 prohibits reward; escalate to donor advocate.',
        priority: 'high'
      });
    }
    if (el.independentAssessorReview === 'no') {
      flags.push({
        id: 'FLAG-EL-004',
        category: 'Ethical / Legal',
        message: 'Independent assessor review not yet completed — required before HTA approval.',
        priority: 'medium'
      });
    }
    if (el.questionsAnswered === 'no') {
      flags.push({
        id: 'FLAG-EL-005',
        category: 'Ethical / Legal',
        message: 'Donor questions not yet answered — complete counselling before consent.',
        priority: 'medium'
      });
    }
    if (el.ethicsCommitteeApproval === 'no') {
      flags.push({
        id: 'FLAG-EL-006',
        category: 'Ethical / Legal',
        message: 'Ethics committee approval not yet received.',
        priority: 'low'
      });
    }
  }

  // ─── Eligibility decision ───────────────────────────────────
  const ea = data.eligibilityAllocation;
  if (ea.eligibilityDecision === 'unsuitable') {
    flags.push({
      id: 'FLAG-EA-001',
      category: 'Eligibility',
      message: `Assessor recorded UNSUITABLE: ${ea.deferralReason || 'reason not provided'} (${ea.deferralDuration || 'duration not specified'}).`,
      priority: 'high'
    });
  } else if (ea.eligibilityDecision === 'conditionally-suitable') {
    flags.push({
      id: 'FLAG-EA-002',
      category: 'Eligibility',
      message: `Assessor recorded CONDITIONALLY SUITABLE: ${ea.eligibilityConditions || 'conditions not specified'}.`,
      priority: 'medium'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.OrganDonationAssessment.detectAdditionalFlags = detectAdditionalFlags;
})();
