import { resolveAlbuminuriaCategory, resolveEgfr } from './kdigo-rules.js';

// Flagged-issue detection for the Renal Assessment form. Independent of the
// KDIGO classification (which the grader computes), this module raises
// clinician-facing flags for severe biochemical derangements (hyperkalemia,
// metabolic acidosis), advanced CKD requiring nephrology referral, anemia
// of CKD, mineral-bone disorder, AKI on CKD, hypertension out of target,
// nephrotoxic drug exposure, and major risk factors (diabetes, smoking,
// family history of polycystic kidney disease).

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

  // Resolved values used across multiple rules
  const egfr = resolveEgfr(data);
  const albuminuriaCategory = resolveAlbuminuriaCategory(data);
  const k = data.bloodTests.potassium;
  const bicarb = data.bloodTests.bicarbonate;
  const hb = data.bloodTests.hemoglobin;
  const phosphate = data.bloodTests.phosphate;
  const calcium = data.bloodTests.calcium;
  const sbp = data.physicalExamination.systolicBp;
  const dbp = data.physicalExamination.diastolicBp;

  // ─── Severe hyperkalemia (urgent) ─────────────────────────
  if (k !== null && k >= 6.5) {
    flags.push({
      id: 'FLAG-K-001',
      category: 'Electrolytes',
      message: `SEVERE hyperkalemia (K+ ${k} mmol/L) - urgent ECG and emergency management indicated.`,
      priority: 'urgent'
    });
  } else if (k !== null && k >= 6.0) {
    flags.push({
      id: 'FLAG-K-002',
      category: 'Electrolytes',
      message: `Hyperkalemia (K+ ${k} mmol/L) - review ACEi/ARB, K-sparing diuretics, dietary K.`,
      priority: 'high'
    });
  } else if (k !== null && k >= 5.5) {
    flags.push({
      id: 'FLAG-K-003',
      category: 'Electrolytes',
      message: `Mild hyperkalemia (K+ ${k} mmol/L) - monitor and review medications.`,
      priority: 'medium'
    });
  }

  // ─── Metabolic acidosis ───────────────────────────────────
  if (bicarb !== null && bicarb < 18) {
    flags.push({
      id: 'FLAG-ACID-001',
      category: 'Acid-Base',
      message: `Severe metabolic acidosis (HCO3 ${bicarb} mmol/L) - consider oral bicarbonate replacement.`,
      priority: 'high'
    });
  } else if (bicarb !== null && bicarb < 22) {
    flags.push({
      id: 'FLAG-ACID-002',
      category: 'Acid-Base',
      message: `Metabolic acidosis (HCO3 ${bicarb} mmol/L) - monitor and consider correction.`,
      priority: 'medium'
    });
  }

  // ─── Advanced CKD / kidney failure ────────────────────────
  if (egfr !== null && egfr < 15) {
    flags.push({
      id: 'FLAG-EGFR-001',
      category: 'CKD Stage',
      message: `eGFR ${egfr} mL/min/1.73 m^2 (G5) - kidney failure; urgent nephrology referral and renal replacement therapy planning.`,
      priority: 'urgent'
    });
  } else if (egfr !== null && egfr < 30) {
    flags.push({
      id: 'FLAG-EGFR-002',
      category: 'CKD Stage',
      message: `eGFR ${egfr} mL/min/1.73 m^2 (G4) - severely decreased kidney function; nephrology referral required.`,
      priority: 'high'
    });
  } else if (egfr !== null && egfr < 45) {
    flags.push({
      id: 'FLAG-EGFR-003',
      category: 'CKD Stage',
      message: `eGFR ${egfr} mL/min/1.73 m^2 (G3b) - moderately to severely decreased; consider nephrology input.`,
      priority: 'medium'
    });
  }

  // ─── Severe albuminuria ───────────────────────────────────
  if (albuminuriaCategory === 'A3') {
    flags.push({
      id: 'FLAG-ACR-001',
      category: 'Albuminuria',
      message: 'Severely increased albuminuria (A3) - high risk; ACEi/ARB and SGLT2 inhibitor indicated unless contraindicated.',
      priority: 'high'
    });
  } else if (albuminuriaCategory === 'A2') {
    flags.push({
      id: 'FLAG-ACR-002',
      category: 'Albuminuria',
      message: 'Moderately increased albuminuria (A2) - consider RAAS blockade and risk-factor modification.',
      priority: 'medium'
    });
  }

  // ─── Anemia of CKD ────────────────────────────────────────
  if (hb !== null && hb < 100) {
    flags.push({
      id: 'FLAG-HB-001',
      category: 'Anemia',
      message: `Severe anemia (Hb ${hb} g/L) - investigate cause; consider ESA / iron therapy per CKD anemia guidelines.`,
      priority: 'high'
    });
  } else if (hb !== null && hb < 110) {
    flags.push({
      id: 'FLAG-HB-002',
      category: 'Anemia',
      message: `Anemia (Hb ${hb} g/L) - workup including iron studies.`,
      priority: 'medium'
    });
  }

  // ─── Mineral-bone disorder ────────────────────────────────
  if (phosphate !== null && phosphate > 1.78) {
    flags.push({
      id: 'FLAG-MBD-001',
      category: 'Mineral-Bone Disorder',
      message: `Hyperphosphatemia (PO4 ${phosphate} mmol/L) - dietary advice and phosphate binders.`,
      priority: 'medium'
    });
  }
  if (calcium !== null && calcium < 2.10) {
    flags.push({
      id: 'FLAG-MBD-002',
      category: 'Mineral-Bone Disorder',
      message: `Hypocalcemia (Ca ${calcium} mmol/L) - investigate vitamin D and PTH.`,
      priority: 'medium'
    });
  }

  // ─── AKI on CKD ───────────────────────────────────────────
  if (data.clinicalImpression.aksuperimposedOnCkd === 'yes') {
    flags.push({
      id: 'FLAG-AKI-001',
      category: 'Acute Kidney Injury',
      message: 'Acute kidney injury superimposed on CKD - identify and reverse precipitants; hold nephrotoxins.',
      priority: 'urgent'
    });
  }

  if (data.presentingSymptoms.reducedUrineOutput === 'yes') {
    flags.push({
      id: 'FLAG-AKI-002',
      category: 'Acute Kidney Injury',
      message: 'Reduced urine output - assess for AKI, urinary obstruction, volume status.',
      priority: 'high'
    });
  }

  if (data.presentingSymptoms.confusion === 'yes' && egfr !== null && egfr < 30) {
    flags.push({
      id: 'FLAG-UREMIA-001',
      category: 'Uremia',
      message: 'Confusion with advanced CKD - assess for uremic encephalopathy.',
      priority: 'urgent'
    });
  }

  // ─── Hypertension control ─────────────────────────────────
  if (sbp !== null && sbp >= 180) {
    flags.push({
      id: 'FLAG-BP-001',
      category: 'Blood Pressure',
      message: `Severe hypertension (SBP ${sbp} mmHg) - urgent BP review.`,
      priority: 'urgent'
    });
  } else if (sbp !== null && sbp >= 140) {
    flags.push({
      id: 'FLAG-BP-002',
      category: 'Blood Pressure',
      message: `Hypertension above target (SBP ${sbp}${dbp !== null ? '/' + dbp : ''} mmHg) - intensify therapy; aim <130/80 in CKD.`,
      priority: 'medium'
    });
  }

  // ─── Nephrotoxin exposure ─────────────────────────────────
  if (data.ckdRiskFactors.nephrotoxicDrugs === 'yes') {
    flags.push({
      id: 'FLAG-NEPH-001',
      category: 'Medications',
      message: `Nephrotoxic drug exposure: ${data.ckdRiskFactors.nephrotoxicDrugDetails || 'details not specified'}.`,
      priority: 'high'
    });
  }
  if (data.ckdRiskFactors.nsaidUse === 'yes') {
    flags.push({
      id: 'FLAG-NEPH-002',
      category: 'Medications',
      message: 'Regular NSAID use - avoid NSAIDs in CKD; review analgesia plan.',
      priority: 'medium'
    });
  }
  if (data.medicationReview.contrastImagingPlanned === 'yes' && egfr !== null && egfr < 30) {
    flags.push({
      id: 'FLAG-NEPH-003',
      category: 'Medications',
      message: 'Contrast-enhanced imaging planned in advanced CKD - weigh benefit/risk; hydrate; consider alternatives.',
      priority: 'high'
    });
  }

  // ─── RAAS / SGLT2 prescribing gaps ────────────────────────
  if (
    (albuminuriaCategory === 'A2' || albuminuriaCategory === 'A3') &&
    data.medicationReview.aceiArb === 'no'
  ) {
    flags.push({
      id: 'FLAG-RX-001',
      category: 'Medications',
      message: 'Albuminuria present but no ACEi/ARB - consider RAAS blockade unless contraindicated.',
      priority: 'medium'
    });
  }
  if (
    data.ckdRiskFactors.diabetes === 'yes' &&
    egfr !== null && egfr >= 20 &&
    data.medicationReview.sglt2Inhibitor === 'no'
  ) {
    flags.push({
      id: 'FLAG-RX-002',
      category: 'Medications',
      message: 'Diabetic CKD without SGLT2 inhibitor - consider SGLT2i for cardiorenal protection.',
      priority: 'medium'
    });
  }

  // ─── Major risk factors ───────────────────────────────────
  if (data.ckdRiskFactors.diabetes === 'yes') {
    flags.push({
      id: 'FLAG-RISK-001',
      category: 'Risk Factors',
      message: 'Diabetes mellitus - leading cause of CKD; optimise glycaemic control and screen annually.',
      priority: 'medium'
    });
  }
  if (data.ckdRiskFactors.hypertension === 'yes') {
    flags.push({
      id: 'FLAG-RISK-002',
      category: 'Risk Factors',
      message: 'Hypertension - second-leading cause of CKD; target <130/80 mmHg.',
      priority: 'low'
    });
  }
  if (data.ckdRiskFactors.familyHistoryPolycysticKidney === 'yes') {
    flags.push({
      id: 'FLAG-RISK-003',
      category: 'Risk Factors',
      message: 'Family history of polycystic kidney disease - consider genetic counselling and renal imaging.',
      priority: 'medium'
    });
  }
  if (data.ckdRiskFactors.smoking === 'current') {
    flags.push({
      id: 'FLAG-RISK-004',
      category: 'Social History',
      message: 'Active smoker - smoking accelerates CKD progression; offer cessation support.',
      priority: 'medium'
    });
  }
  if (data.ckdRiskFactors.priorAki === 'yes') {
    flags.push({
      id: 'FLAG-RISK-005',
      category: 'Risk Factors',
      message: 'Prior AKI - increased risk of CKD progression; monitor renal function regularly.',
      priority: 'low'
    });
  }

  // ─── Hematuria ─────────────────────────────────────────────
  if (data.presentingSymptoms.hematuria === 'yes') {
    flags.push({
      id: 'FLAG-URINE-001',
      category: 'Urinalysis',
      message: 'Hematuria reported - exclude urological malignancy and glomerulonephritis.',
      priority: 'high'
    });
  }

  // ─── Imaging findings ─────────────────────────────────────
  if (data.imagingBiopsy.hydronephrosis === 'yes') {
    flags.push({
      id: 'FLAG-IMG-001',
      category: 'Imaging',
      message: 'Hydronephrosis on imaging - exclude urinary tract obstruction.',
      priority: 'high'
    });
  }

  // ─── Sort by priority ─────────────────────────────────────
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
