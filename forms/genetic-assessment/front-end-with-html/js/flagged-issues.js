// Genetic Assessment flagged-issue detection.
//
// Independent of the risk score, this module raises clinician-facing flags
// for safety-critical or clinically significant findings (family cancer
// clusters, early-onset cancer, consanguinity, known pathogenic variants,
// recurrent miscarriages, sudden cardiac death, Ashkenazi heritage with
// relevant conditions, multiple primary cancers, variants of uncertain
// significance, Huntington disease, previous affected child, chromosomal
// conditions, and emergency referrals).
//
// Ported verbatim from the SvelteKit reference at
// `forms/genetic-assessment/front-end-form-with-svelte/src/lib/engine/flagged-issues.ts`.

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

  // ─── Family pedigree summary used several times below ───
  const familyMembers = [
    data.familyPedigree.maternalGrandmother,
    data.familyPedigree.maternalGrandfather,
    data.familyPedigree.paternalGrandmother,
    data.familyPedigree.paternalGrandfather,
    data.familyPedigree.mother,
    data.familyPedigree.father
  ];

  const familyCancerCount = familyMembers
    .filter((m) => m && (m.cancers || '').trim() !== '')
    .length;
  if (familyCancerCount >= 3) {
    flags.push({
      id: 'FLAG-FAMILY-CANCER-001',
      category: 'Family Cancer Cluster',
      message: `${familyCancerCount} family members with cancer history - consider hereditary cancer syndrome evaluation`,
      priority: 'high'
    });
  }

  // ─── Early onset disease ────────────────────────────────
  if (
    data.cancerHistory.personalCancerHistory === 'yes' &&
    data.cancerHistory.ageAtDiagnosis !== null &&
    data.cancerHistory.ageAtDiagnosis !== undefined &&
    data.cancerHistory.ageAtDiagnosis < 40
  ) {
    flags.push({
      id: 'FLAG-EARLY-CANCER-001',
      category: 'Early Onset Cancer',
      message: `Cancer diagnosed at age ${data.cancerHistory.ageAtDiagnosis} - early onset warrants genetic testing consideration`,
      priority: 'high'
    });
  }

  // ─── Consanguinity ──────────────────────────────────────
  if (
    data.reproductiveGenetics.consanguinity === 'yes' ||
    data.ethnicBackground.consanguinity === 'yes'
  ) {
    const details = data.ethnicBackground.consanguinityDetails || 'details not specified';
    flags.push({
      id: 'FLAG-CONSANG-001',
      category: 'Consanguinity',
      message: `Consanguineous relationship reported: ${details} - increased risk of autosomal recessive conditions`,
      priority: 'high'
    });
  }

  // ─── Known pathogenic variant ───────────────────────────
  if (data.personalMedicalHistory.knownGeneticCondition === 'yes') {
    flags.push({
      id: 'FLAG-PATHOGENIC-001',
      category: 'Known Genetic Condition',
      message: `Known genetic condition: ${data.personalMedicalHistory.knownGeneticConditionDetails || 'details not specified'} - cascade testing for family members recommended`,
      priority: 'high'
    });
  }

  // ─── Recurrent miscarriages ─────────────────────────────
  if (data.reproductiveGenetics.recurrentMiscarriages === 'yes') {
    flags.push({
      id: 'FLAG-MISCARRIAGE-001',
      category: 'Reproductive Genetics',
      message: 'Recurrent miscarriages reported - consider chromosomal analysis (karyotype) for both partners',
      priority: 'medium'
    });
  }

  // ─── Sudden cardiac death in family ─────────────────────
  if (data.cardiovascularGenetics.suddenCardiacDeath === 'yes') {
    flags.push({
      id: 'FLAG-SCD-001',
      category: 'Cardiovascular Genetics',
      message: 'Sudden cardiac death in family - urgent cardiac genetic evaluation recommended',
      priority: 'high'
    });
  }

  // ─── Ashkenazi heritage with relevant conditions ────────
  if (data.ethnicBackground.ashkenaziJewish === 'yes') {
    const hasRelevantConditions =
      data.cancerHistory.personalCancerHistory === 'yes' ||
      data.reproductiveGenetics.carrierStatus === 'yes' ||
      familyCancerCount > 0;
    if (hasRelevantConditions) {
      flags.push({
        id: 'FLAG-ASHKENAZI-001',
        category: 'Ethnic Background',
        message: 'Ashkenazi Jewish heritage with relevant conditions - consider BRCA1/2 and founder mutation panel testing',
        priority: 'medium'
      });
    }
  }

  // ─── Multiple primary cancers ───────────────────────────
  if (data.cancerHistory.multiplePrimaryCancers === 'yes') {
    flags.push({
      id: 'FLAG-MULTI-CANCER-001',
      category: 'Multiple Cancers',
      message: 'Multiple primary cancers reported - high suspicion for hereditary cancer predisposition syndrome',
      priority: 'high'
    });
  }

  // ─── Variant of uncertain significance ──────────────────
  if (data.geneticTestingHistory.variantsOfUncertainSignificance === 'yes') {
    flags.push({
      id: 'FLAG-VUS-001',
      category: 'Genetic Testing',
      message: `Variant of uncertain significance: ${data.geneticTestingHistory.variantsOfUncertainSignificanceDetails || 'details not specified'} - periodic reclassification review recommended`,
      priority: 'medium'
    });
  }

  // ─── Huntington disease ─────────────────────────────────
  if (data.neurogenetics.huntington === 'yes') {
    flags.push({
      id: 'FLAG-HUNTINGTON-001',
      category: 'Neurogenetics',
      message: 'Family history of Huntington disease - predictive testing protocol and psychological support required',
      priority: 'high'
    });
  }

  // ─── Previous affected child ────────────────────────────
  if (data.reproductiveGenetics.previousAffectedChild === 'yes') {
    flags.push({
      id: 'FLAG-AFFECTED-CHILD-001',
      category: 'Reproductive Genetics',
      message: `Previously affected child: ${data.reproductiveGenetics.previousAffectedChildDetails || 'details not specified'} - prenatal or preimplantation genetic testing may be relevant`,
      priority: 'high'
    });
  }

  // ─── Chromosomal condition ──────────────────────────────
  if (data.personalMedicalHistory.chromosomalCondition === 'yes') {
    flags.push({
      id: 'FLAG-CHROMO-001',
      category: 'Chromosomal Condition',
      message: `Known chromosomal condition: ${data.personalMedicalHistory.chromosomalConditionDetails || 'details not specified'} - genetic counseling for reproductive implications recommended`,
      priority: 'medium'
    });
  }

  // ─── Urgent referral ────────────────────────────────────
  if (data.referralInformation.urgency === 'emergency') {
    flags.push({
      id: 'FLAG-URGENT-001',
      category: 'Referral Urgency',
      message: 'Emergency referral - expedited genetic assessment required',
      priority: 'high'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
