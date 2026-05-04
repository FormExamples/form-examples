// Plain-JavaScript / JSDoc type definitions for the Genetics Assessment form.
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard, so newly-added fields default correctly when older saved state
// is rehydrated from localStorage.
//
// Domain reference: NICE CG164 / NCCN family-history thresholds, Manchester
// Score for BRCA1/2 (per-cancer points summed; >=15 considers testing,
// >=20 moderate, >=30 high mutation probability), Revised Bethesda
// guidelines for Lynch syndrome (5 criteria; meeting >=1 prompts MMR
// IHC / MSI testing), Tyrer-Cuzick (IBIS) for breast-cancer risk and
// PREMM5 for Lynch (>=5% threshold for testing).

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNoUnknown
 * @typedef {'low' | 'moderate' | 'high' | ''} RiskLevel
 * @typedef {'routine' | 'soon' | 'urgent' | ''} ReferralUrgency
 */

/**
 * @typedef {Object} ProbandDemographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} mrn               Optional medical-record number.
 * @property {string} preferredContact  Phone, email, etc.
 */

/**
 * @typedef {Object} PresentingConcern
 * @property {string} chiefConcern
 * @property {string} referralReason
 * @property {string} referringClinician
 * @property {ReferralUrgency} urgency
 * @property {string} suspectedSyndrome
 */

/**
 * @typedef {Object} ProbandCancer
 * @property {string} type
 * @property {number | null} ageAtDiagnosis
 * @property {YesNo} bilateral
 * @property {string} treatment
 */

/**
 * @typedef {Object} PersonalMedicalHistory
 * @property {YesNo} personalCancerHistory
 * @property {ProbandCancer[]} cancers
 * @property {YesNo} multiplePrimaryCancers
 * @property {YesNo} congenitalAnomalies
 * @property {string} congenitalAnomaliesDetails
 * @property {YesNo} developmentalDelay
 * @property {YesNo} priorRadiation
 * @property {string} otherSignificantHistory
 */

/**
 * Cancer record on a single relative.
 *
 * @typedef {Object} RelativeCancer
 * @property {string} type
 * @property {number | null} ageAtDiagnosis
 */

/**
 * One relative on the three-generation pedigree. `relation` and `side`
 * label the slot; `name` and other fields are user-entered.
 *
 * @typedef {Object} Relative
 * @property {string} id                Stable id (slot or generated for siblings/children/etc.).
 * @property {string} relation          e.g. 'Mother', 'Sibling', 'Maternal aunt'.
 * @property {'maternal' | 'paternal' | 'self' | ''} side
 * @property {1 | 2 | 3}  generation    1=grandparents, 2=parents/aunts/uncles, 3=siblings/cousins/children.
 * @property {Sex} sex
 * @property {string} name
 * @property {YesNoUnknown} affectedWithCancer
 * @property {RelativeCancer[]} cancers
 * @property {YesNoUnknown} deceased
 * @property {number | null} ageAtDeath
 * @property {string} causeOfDeath
 * @property {string} notes
 */

/**
 * @typedef {Object} FamilyPedigree
 * @property {Relative} maternalGrandmother
 * @property {Relative} maternalGrandfather
 * @property {Relative} paternalGrandmother
 * @property {Relative} paternalGrandfather
 * @property {Relative} mother
 * @property {Relative} father
 * @property {Relative[]} maternalAuntsUncles
 * @property {Relative[]} paternalAuntsUncles
 * @property {Relative[]} siblings
 * @property {Relative[]} children
 * @property {Relative[]} maternalCousins
 * @property {Relative[]} paternalCousins
 */

/**
 * @typedef {Object} ConsanguinityAncestry
 * @property {YesNo} consanguinity
 * @property {string} consanguinityDetails
 * @property {string} maternalAncestry
 * @property {string} paternalAncestry
 * @property {YesNo} ashkenaziJewish
 * @property {YesNo} sephardicJewish
 * @property {YesNo} foundingPopulation       e.g. Quebecois, Finnish, Icelandic, Afrikaner.
 * @property {string} foundingPopulationDetails
 */

/**
 * Manchester Score data — the form captures per-cancer counts in the
 * proband and in first/second-degree relatives so the grader can compute
 * the score.
 *
 * @typedef {Object} ManchesterInputs
 * @property {number | null} probandFemaleBreastUnder30
 * @property {number | null} probandFemaleBreast30to39
 * @property {number | null} probandFemaleBreast40to49
 * @property {number | null} probandOvarianUnder60
 * @property {number | null} probandMaleBreast
 * @property {number | null} relativeFemaleBreastUnder30
 * @property {number | null} relativeFemaleBreast30to39
 * @property {number | null} relativeFemaleBreast40to49
 * @property {number | null} relativeOvarianUnder60
 * @property {number | null} relativeMaleBreast
 * @property {number | null} relativePancreaticUnder60
 * @property {number | null} relativeProstateUnder60
 */

/**
 * Revised Bethesda criteria for Lynch syndrome — five binary items.
 * Meeting one or more is sufficient for MMR IHC / MSI testing.
 *
 * @typedef {Object} BethesdaInputs
 * @property {YesNo} crcUnder50              Colorectal cancer in proband <50.
 * @property {YesNo} synchronousMetachronous Synchronous or metachronous CRC or other Lynch tumour.
 * @property {YesNo} msiHistology            CRC <60 with MSI-H histology.
 * @property {YesNo} firstDegreeLynchTumour  CRC + >=1 first-degree relative with Lynch tumour, one <50.
 * @property {YesNo} multipleRelativesLynch  CRC + >=2 first-or-second-degree relatives with Lynch tumour at any age.
 */

/**
 * Tyrer-Cuzick (IBIS) inputs — the patient form captures the user
 * inputs; the grader does not run the full IBIS model but records
 * results from any external calculation along with key risk-modifier
 * checkboxes.
 *
 * @typedef {Object} TyrerCuzickInputs
 * @property {number | null} ageYears
 * @property {number | null} ageAtMenarche
 * @property {YesNo} parous
 * @property {number | null} ageAtFirstLiveBirth
 * @property {YesNo} menopausal
 * @property {number | null} ageAtMenopause
 * @property {number | null} heightCm
 * @property {number | null} weightKg
 * @property {YesNo} hrtCurrent
 * @property {YesNo} priorBenignBreastDisease
 * @property {YesNo} atypicalHyperplasia
 * @property {YesNo} lcis
 * @property {YesNo} dense Mammographic density category 'dense'.
 * @property {number | null} externalTenYearRisk    External calculator output (%).
 * @property {number | null} externalLifetimeRisk   External calculator output (%).
 */

/**
 * PREMM5 inputs — the published model takes:
 * sex, age at evaluation, personal Lynch tumour history (CRC, endometrial,
 * other), age at first Lynch tumour, family history of Lynch tumours
 * (number of FDR/SDR with each tumour and youngest age). The form
 * captures the necessary indicators and an externally-calculated PREMM5
 * percentage if supplied.
 *
 * @typedef {Object} PREMM5Inputs
 * @property {YesNo} probandColorectal
 * @property {YesNo} probandEndometrial
 * @property {YesNo} probandOtherLynchTumour
 * @property {number | null} youngestProbandAgeAtLynchTumour
 * @property {number | null} firstDegreeWithCRC
 * @property {number | null} firstDegreeWithEndometrial
 * @property {number | null} firstDegreeWithOtherLynch
 * @property {number | null} secondDegreeWithLynch
 * @property {number | null} youngestRelativeAgeAtLynchTumour
 * @property {number | null} externalPREMM5Percent  Externally-computed PREMM5 (%).
 */

/**
 * @typedef {Object} TargetedRiskScoring
 * @property {ManchesterInputs} manchester
 * @property {BethesdaInputs} bethesda
 * @property {TyrerCuzickInputs} tyrerCuzick
 * @property {PREMM5Inputs} premm5
 */

/**
 * @typedef {Object} PriorTestRecord
 * @property {string} testName
 * @property {string} laboratory
 * @property {string} testDate
 * @property {string} resultSummary
 */

/**
 * @typedef {Object} PriorGeneticTesting
 * @property {YesNo} priorTesting
 * @property {PriorTestRecord[]} priorTests
 * @property {YesNo} variantsOfUncertainSignificance
 * @property {string} variantsOfUncertainSignificanceDetails
 * @property {YesNo} familialVariantKnown
 * @property {string} familialVariantDetails
 * @property {YesNo} priorGeneticCounselling
 * @property {string} priorCounsellingNotes
 */

/**
 * @typedef {Object} PatientUnderstandingConcerns
 * @property {string} understandingOfReferral
 * @property {string} primaryConcerns
 * @property {string} expectations
 * @property {YesNo} insuranceConcerns
 * @property {YesNo} confidentialityConcerns
 * @property {YesNo} reproductiveImplications
 * @property {string} supportSystem
 * @property {YesNo} consentToTesting
 */

/**
 * @typedef {Object} RecommendationReferralPlan
 * @property {RiskLevel} clinicianAssignedRisk
 * @property {YesNo} recommendBRCATesting
 * @property {YesNo} recommendLynchTesting
 * @property {YesNo} recommendPanelTesting
 * @property {YesNo} recommendMMRIHC
 * @property {string} recommendedPanel
 * @property {YesNo} referClinicalGenetics
 * @property {YesNo} referBreastSurveillance
 * @property {YesNo} referColonoscopy
 * @property {YesNo} referPsychologicalSupport
 * @property {ReferralUrgency} referralUrgency
 * @property {string} clinicianSummary
 * @property {string} clinicianName
 * @property {string} clinicianRole
 * @property {string} signatureDate
 */

/**
 * @typedef {Object} AssessmentData
 * @property {ProbandDemographics} probandDemographics
 * @property {PresentingConcern} presentingConcern
 * @property {PersonalMedicalHistory} personalMedicalHistory
 * @property {FamilyPedigree} familyPedigree
 * @property {ConsanguinityAncestry} consanguinityAncestry
 * @property {TargetedRiskScoring} targetedRiskScoring
 * @property {PriorGeneticTesting} priorGeneticTesting
 * @property {PatientUnderstandingConcerns} patientUnderstandingConcerns
 * @property {RecommendationReferralPlan} recommendationReferralPlan
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {RiskLevel} severity         Risk weight contributed by this rule.
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {RiskLevel} riskLevel
 * @property {number} manchesterScore
 * @property {number} bethesdaMet           Number of Bethesda criteria met (0-5).
 * @property {number | null} premm5Score    Externally-supplied PREMM5 percent (or null).
 * @property {number} tyrerCuzickLifetime   Externally-supplied lifetime risk (or 0).
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.GeneticsAssessment`.
(function () {
'use strict';
window.GeneticsAssessment = window.GeneticsAssessment || {};

/** Build a fresh, empty fixed-slot Relative.
 *  @param {{relation: string, side: 'maternal' | 'paternal' | 'self' | '',
 *           generation: 1 | 2 | 3, sex: Sex}} opts
 *  @returns {Relative}
 */
function emptyFixedRelative(opts) {
  return {
    id: opts.relation.toLowerCase().replace(/\s+/g, '-'),
    relation: opts.relation,
    side: opts.side,
    generation: opts.generation,
    sex: opts.sex,
    name: '',
    affectedWithCancer: '',
    cancers: [],
    deceased: '',
    ageAtDeath: null,
    causeOfDeath: '',
    notes: ''
  };
}

/** Build a fresh, empty repeating-list Relative (sibling/child/cousin/etc.).
 *  @param {{relation: string, side: 'maternal' | 'paternal' | 'self' | '',
 *           generation: 1 | 2 | 3}} opts
 *  @returns {Relative}
 */
function emptyRelative(opts) {
  return {
    id: `${opts.relation.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    relation: opts.relation,
    side: opts.side,
    generation: opts.generation,
    sex: '',
    name: '',
    affectedWithCancer: '',
    cancers: [],
    deceased: '',
    ageAtDeath: null,
    causeOfDeath: '',
    notes: ''
  };
}

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    probandDemographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      mrn: '',
      preferredContact: ''
    },
    presentingConcern: {
      chiefConcern: '',
      referralReason: '',
      referringClinician: '',
      urgency: '',
      suspectedSyndrome: ''
    },
    personalMedicalHistory: {
      personalCancerHistory: '',
      cancers: [],
      multiplePrimaryCancers: '',
      congenitalAnomalies: '',
      congenitalAnomaliesDetails: '',
      developmentalDelay: '',
      priorRadiation: '',
      otherSignificantHistory: ''
    },
    familyPedigree: {
      maternalGrandmother: emptyFixedRelative({ relation: 'Maternal grandmother', side: 'maternal', generation: 1, sex: 'female' }),
      maternalGrandfather: emptyFixedRelative({ relation: 'Maternal grandfather', side: 'maternal', generation: 1, sex: 'male' }),
      paternalGrandmother: emptyFixedRelative({ relation: 'Paternal grandmother', side: 'paternal', generation: 1, sex: 'female' }),
      paternalGrandfather: emptyFixedRelative({ relation: 'Paternal grandfather', side: 'paternal', generation: 1, sex: 'male' }),
      mother: emptyFixedRelative({ relation: 'Mother', side: 'maternal', generation: 2, sex: 'female' }),
      father: emptyFixedRelative({ relation: 'Father', side: 'paternal', generation: 2, sex: 'male' }),
      maternalAuntsUncles: [],
      paternalAuntsUncles: [],
      siblings: [],
      children: [],
      maternalCousins: [],
      paternalCousins: []
    },
    consanguinityAncestry: {
      consanguinity: '',
      consanguinityDetails: '',
      maternalAncestry: '',
      paternalAncestry: '',
      ashkenaziJewish: '',
      sephardicJewish: '',
      foundingPopulation: '',
      foundingPopulationDetails: ''
    },
    targetedRiskScoring: {
      manchester: {
        probandFemaleBreastUnder30: null,
        probandFemaleBreast30to39: null,
        probandFemaleBreast40to49: null,
        probandOvarianUnder60: null,
        probandMaleBreast: null,
        relativeFemaleBreastUnder30: null,
        relativeFemaleBreast30to39: null,
        relativeFemaleBreast40to49: null,
        relativeOvarianUnder60: null,
        relativeMaleBreast: null,
        relativePancreaticUnder60: null,
        relativeProstateUnder60: null
      },
      bethesda: {
        crcUnder50: '',
        synchronousMetachronous: '',
        msiHistology: '',
        firstDegreeLynchTumour: '',
        multipleRelativesLynch: ''
      },
      tyrerCuzick: {
        ageYears: null,
        ageAtMenarche: null,
        parous: '',
        ageAtFirstLiveBirth: null,
        menopausal: '',
        ageAtMenopause: null,
        heightCm: null,
        weightKg: null,
        hrtCurrent: '',
        priorBenignBreastDisease: '',
        atypicalHyperplasia: '',
        lcis: '',
        dense: '',
        externalTenYearRisk: null,
        externalLifetimeRisk: null
      },
      premm5: {
        probandColorectal: '',
        probandEndometrial: '',
        probandOtherLynchTumour: '',
        youngestProbandAgeAtLynchTumour: null,
        firstDegreeWithCRC: null,
        firstDegreeWithEndometrial: null,
        firstDegreeWithOtherLynch: null,
        secondDegreeWithLynch: null,
        youngestRelativeAgeAtLynchTumour: null,
        externalPREMM5Percent: null
      }
    },
    priorGeneticTesting: {
      priorTesting: '',
      priorTests: [],
      variantsOfUncertainSignificance: '',
      variantsOfUncertainSignificanceDetails: '',
      familialVariantKnown: '',
      familialVariantDetails: '',
      priorGeneticCounselling: '',
      priorCounsellingNotes: ''
    },
    patientUnderstandingConcerns: {
      understandingOfReferral: '',
      primaryConcerns: '',
      expectations: '',
      insuranceConcerns: '',
      confidentialityConcerns: '',
      reproductiveImplications: '',
      supportSystem: '',
      consentToTesting: ''
    },
    recommendationReferralPlan: {
      clinicianAssignedRisk: '',
      recommendBRCATesting: '',
      recommendLynchTesting: '',
      recommendPanelTesting: '',
      recommendMMRIHC: '',
      recommendedPanel: '',
      referClinicalGenetics: '',
      referBreastSurveillance: '',
      referColonoscopy: '',
      referPsychologicalSupport: '',
      referralUrgency: '',
      clinicianSummary: '',
      clinicianName: '',
      clinicianRole: '',
      signatureDate: ''
    }
  };
}

/**
 * Friendly label for a RiskLevel.
 * @param {RiskLevel} level
 */
function riskLevelLabel(level) {
  switch (level) {
    case 'low':      return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high':     return 'High Risk';
    default: return '';
  }
}

/**
 * CSS class hint for the risk-level badge.
 * @param {RiskLevel} level
 */
function riskLevelClass(level) {
  switch (level) {
    case 'low':      return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high':     return 'risk-high';
    default: return '';
  }
}

/**
 * Order risk-level severities so the highest contributing rule wins.
 * @param {RiskLevel} a
 * @param {RiskLevel} b
 * @returns {RiskLevel}
 */
function maxRiskLevel(a, b) {
  const order = { '': 0, low: 1, moderate: 2, high: 3 };
  return (order[a] >= order[b]) ? a : b;
}

/**
 * Calculate age (whole years) from a date-of-birth ISO string.
 * @param {string} dob
 * @returns {number | null}
 */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

Object.assign(window.GeneticsAssessment, {
  emptyFixedRelative,
  emptyRelative,
  emptyAssessment,
  riskLevelLabel,
  riskLevelClass,
  maxRiskLevel,
  calculateAge
});
})();
