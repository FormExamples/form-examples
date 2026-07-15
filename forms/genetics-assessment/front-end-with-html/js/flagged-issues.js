import { gradeGenetics } from './genetics-grader.js';

// Genetics Assessment — additional flagged issues.
//
// These flags are independent of the Manchester / Bethesda / PREMM5 /
// Tyrer-Cuzick scoring (which the grader handles). They surface
// clinician-facing issues such as testing recommendations, single-line
// family history, paternal-line considerations, modifier risk factors,
// and general lifestyle counselling reminders.
//
// Priority levels: 'high' | 'medium' | 'low'.

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

  const grading = gradeGenetics(data);
  const { manchesterScore, bethesdaMet, premm5Score, tyrerCuzickLifetime } = grading;

  // ─── HIGH priority ────────────────────────────────────────

  if (manchesterScore >= 15) {
    flags.push({
      id: 'FLAG-BRCA-001',
      category: 'BRCA Testing',
      message: `Manchester score ${manchesterScore} (>=15) — BRCA1/2 germline testing indicated.`,
      priority: 'high'
    });
  }

  if (bethesdaMet >= 1) {
    flags.push({
      id: 'FLAG-LYNCH-001',
      category: 'Lynch Testing',
      message: `${bethesdaMet} Revised Bethesda ${bethesdaMet === 1 ? 'criterion' : 'criteria'} met — MMR IHC / MSI testing on tumour indicated.`,
      priority: 'high'
    });
  }

  if (premm5Score !== null && premm5Score >= 5) {
    flags.push({
      id: 'FLAG-LYNCH-002',
      category: 'Lynch Testing',
      message: `PREMM5 score ${premm5Score}% (>=5%) — Lynch syndrome germline panel indicated.`,
      priority: 'high'
    });
  }

  if (tyrerCuzickLifetime >= 30) {
    flags.push({
      id: 'FLAG-TC-001',
      category: 'Breast Surveillance',
      message: `Tyrer-Cuzick lifetime risk ${tyrerCuzickLifetime}% — high-risk breast surveillance pathway per NICE FH.`,
      priority: 'high'
    });
  } else if (tyrerCuzickLifetime >= 17) {
    flags.push({
      id: 'FLAG-TC-002',
      category: 'Breast Surveillance',
      message: `Tyrer-Cuzick lifetime risk ${tyrerCuzickLifetime}% — moderate-risk breast surveillance pathway per NICE FH.`,
      priority: 'medium'
    });
  }

  // Multiple early-onset cancers
  let earlyOnsetCount = 0;
  let paediatricCount = 0;
  const fp = data.familyPedigree;
  const all = [
    fp.maternalGrandmother, fp.maternalGrandfather,
    fp.paternalGrandmother, fp.paternalGrandfather,
    fp.mother, fp.father
  ]
    .concat(fp.maternalAuntsUncles || [])
    .concat(fp.paternalAuntsUncles || [])
    .concat(fp.siblings || [])
    .concat(fp.children || [])
    .concat(fp.maternalCousins || [])
    .concat(fp.paternalCousins || []);

  for (const r of all) {
    for (const c of (r.cancers || [])) {
      const age = c.ageAtDiagnosis;
      if (age !== null && age !== undefined && Number.isFinite(Number(age))) {
        if (Number(age) <= 50) earlyOnsetCount++;
        if (Number(age) < 18) paediatricCount++;
      }
    }
  }
  for (const c of (data.personalMedicalHistory.cancers || [])) {
    const age = c.ageAtDiagnosis;
    if (age !== null && age !== undefined && Number.isFinite(Number(age))) {
      if (Number(age) <= 50) earlyOnsetCount++;
      if (Number(age) < 18) paediatricCount++;
    }
  }

  if (earlyOnsetCount >= 2) {
    flags.push({
      id: 'FLAG-EARLY-001',
      category: 'Cancer Spectrum',
      message: `${earlyOnsetCount} cancers diagnosed at age 50 or younger across proband and family.`,
      priority: 'high'
    });
  }

  if (paediatricCount >= 1) {
    flags.push({
      id: 'FLAG-PAEDS-001',
      category: 'Cancer Spectrum',
      message: `Paediatric cancer (<18) reported — consider Li-Fraumeni and other paediatric tumour syndromes.`,
      priority: 'high'
    });
  }

  if (data.personalMedicalHistory.multiplePrimaryCancers === 'yes') {
    flags.push({
      id: 'FLAG-MPRIM-001',
      category: 'Proband History',
      message: 'Proband has multiple primary cancers — pre-test probability of pathogenic variant elevated.',
      priority: 'high'
    });
  }

  // ─── MEDIUM priority ──────────────────────────────────────

  // Single-line family history (only one side affected) — limits
  // pedigree informativeness.
  const maternalAffected =
    [fp.maternalGrandmother, fp.maternalGrandfather, fp.mother]
      .concat(fp.maternalAuntsUncles || [])
      .concat(fp.maternalCousins || [])
      .filter((r) => r.affectedWithCancer === 'yes' && (r.cancers || []).length > 0).length;
  const paternalAffected =
    [fp.paternalGrandmother, fp.paternalGrandfather, fp.father]
      .concat(fp.paternalAuntsUncles || [])
      .concat(fp.paternalCousins || [])
      .filter((r) => r.affectedWithCancer === 'yes' && (r.cancers || []).length > 0).length;

  if (maternalAffected > 0 && paternalAffected === 0 &&
      (fp.paternalAuntsUncles.length + fp.paternalCousins.length) <= 1) {
    flags.push({
      id: 'FLAG-LINE-001',
      category: 'Pedigree Limitation',
      message: 'Cancer history concentrated on the maternal line; paternal line under-represented — request additional paternal pedigree where possible.',
      priority: 'medium'
    });
  } else if (paternalAffected > 0 && maternalAffected === 0 &&
             (fp.maternalAuntsUncles.length + fp.maternalCousins.length) <= 1) {
    flags.push({
      id: 'FLAG-LINE-002',
      category: 'Pedigree Limitation',
      message: 'Cancer history concentrated on the paternal line; maternal line under-represented — request additional maternal pedigree where possible.',
      priority: 'medium'
    });
  }

  // Paternal-line consideration: BRCA can transmit through fathers.
  if (paternalAffected > 0) {
    flags.push({
      id: 'FLAG-PAT-001',
      category: 'Paternal Line',
      message: 'Affected paternal-line relatives — remember that BRCA1/2 transmits paternally; consider full paternal pedigree.',
      priority: 'medium'
    });
  }

  // Ancestry modifier: Ashkenazi Jewish founder mutations
  if (data.consanguinityAncestry.ashkenaziJewish === 'yes') {
    flags.push({
      id: 'FLAG-ANC-001',
      category: 'Ancestry',
      message: 'Ashkenazi Jewish ancestry — three BRCA1/2 founder variants account for the majority of mutations in this population.',
      priority: 'medium'
    });
  }
  if (data.consanguinityAncestry.sephardicJewish === 'yes') {
    flags.push({
      id: 'FLAG-ANC-002',
      category: 'Ancestry',
      message: 'Sephardic Jewish ancestry — population-specific founder variants exist; consider extended panel.',
      priority: 'medium'
    });
  }
  if (data.consanguinityAncestry.foundingPopulation === 'yes') {
    flags.push({
      id: 'FLAG-ANC-003',
      category: 'Ancestry',
      message: `Founding-population ancestry${data.consanguinityAncestry.foundingPopulationDetails ? ` (${data.consanguinityAncestry.foundingPopulationDetails})` : ''} — population-specific founder variants may apply.`,
      priority: 'medium'
    });
  }
  if (data.consanguinityAncestry.consanguinity === 'yes') {
    flags.push({
      id: 'FLAG-CONS-001',
      category: 'Consanguinity',
      message: 'Consanguinity reported — increased recurrence risk for autosomal recessive conditions; offer carrier screening.',
      priority: 'medium'
    });
  }

  // Tyrer-Cuzick modifier risk factors
  if (data.targetedRiskScoring.tyrerCuzick.atypicalHyperplasia === 'yes' ||
      data.targetedRiskScoring.tyrerCuzick.lcis === 'yes') {
    flags.push({
      id: 'FLAG-TC-MOD-001',
      category: 'Breast Risk Modifier',
      message: 'Atypical hyperplasia or LCIS reported — strong individual risk modifier; ensure included in Tyrer-Cuzick model run.',
      priority: 'medium'
    });
  }
  if (data.targetedRiskScoring.tyrerCuzick.dense === 'yes') {
    flags.push({
      id: 'FLAG-TC-MOD-002',
      category: 'Breast Risk Modifier',
      message: 'Dense mammographic breast tissue — modest independent risk modifier and reduces mammographic sensitivity.',
      priority: 'medium'
    });
  }

  // Suspected syndrome named by referrer
  if ((data.presentingConcern.suspectedSyndrome || '').trim() !== '') {
    flags.push({
      id: 'FLAG-SYN-001',
      category: 'Suspected Syndrome',
      message: `Referrer suspects: ${data.presentingConcern.suspectedSyndrome}`,
      priority: 'medium'
    });
  }

  // Variants of uncertain significance previously identified
  if (data.priorGeneticTesting.variantsOfUncertainSignificance === 'yes') {
    flags.push({
      id: 'FLAG-VUS-001',
      category: 'Prior Testing',
      message: 'Variant(s) of uncertain significance previously reported — review variant interpretation databases for reclassification.',
      priority: 'medium'
    });
  }
  // Familial variant known
  if (data.priorGeneticTesting.familialVariantKnown === 'yes') {
    flags.push({
      id: 'FLAG-FAM-VAR-001',
      category: 'Prior Testing',
      message: 'Known familial pathogenic variant — predictive testing for the proband is the appropriate first-line approach.',
      priority: 'high'
    });
  }

  // Insurance / confidentiality concerns
  if (data.patientUnderstandingConcerns.insuranceConcerns === 'yes') {
    flags.push({
      id: 'FLAG-PSYCH-001',
      category: 'Counselling',
      message: 'Patient has insurance concerns — discuss GINA / local protections before testing.',
      priority: 'medium'
    });
  }
  if (data.patientUnderstandingConcerns.confidentialityConcerns === 'yes') {
    flags.push({
      id: 'FLAG-PSYCH-002',
      category: 'Counselling',
      message: 'Patient has confidentiality concerns — review consent and information-sharing arrangements.',
      priority: 'medium'
    });
  }

  // ─── LOW priority (lifestyle / general counselling) ───────

  if (data.patientUnderstandingConcerns.reproductiveImplications === 'yes') {
    flags.push({
      id: 'FLAG-REPRO-001',
      category: 'Reproductive Counselling',
      message: 'Patient asking about reproductive implications — offer preconception / prenatal genetic counselling.',
      priority: 'low'
    });
  }

  if (data.priorGeneticTesting.priorGeneticCounselling === 'no' ||
      data.priorGeneticTesting.priorGeneticCounselling === '') {
    flags.push({
      id: 'FLAG-COUN-001',
      category: 'General Counselling',
      message: 'No prior formal genetic counselling recorded — pre-test counselling appointment recommended.',
      priority: 'low'
    });
  }

  if (data.patientUnderstandingConcerns.consentToTesting === 'no') {
    flags.push({
      id: 'FLAG-CONSENT-001',
      category: 'Consent',
      message: 'Patient currently declines testing — document and offer further information.',
      priority: 'low'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
