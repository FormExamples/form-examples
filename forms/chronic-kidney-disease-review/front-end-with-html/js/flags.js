import { isRapidDecline, present } from './rules.js';

// Flagged-issue detection for the chronic kidney disease annual review.
// Independent of the review-completeness status (which the grader produces),
// this module raises clinician-facing flags per spec §5, each with a priority.
// Categories mirror the `chronic_kidney_disease_review_grade_flag` SQL CHECK
// constraint: very-high-risk-referral, egfr-referral, acr-referral,
// rapid-decline, hyperkalaemia, anaemia, uncontrolled-bp, nephrotoxic-drug,
// missing-acr, incomplete, other.
//
//   - Nephrology referral — very-high risk (high) — kdigoRiskZone == 'very-high'
//   - Nephrology referral — eGFR < 30 (high)      — G4 or G5
//   - Nephrology referral — ACR >= 70 (high)      — acr >= 70
//   - Rapid eGFR decline (high)                   — decline rule in rules.js
//   - Hyperkalaemia (high >= 6.0; medium 5.5–5.9) — potassium raised
//   - Anaemia of CKD (medium)                     — haemoglobin < 110 g/L
//   - Uncontrolled blood pressure (medium)        — bloodPressureAtTarget == false
//   - Nephrotoxic drug without dose adjustment (high)
//   - Missing ACR (medium)                        — acrMeasured != 'yes' or acr == null
//   - Incomplete review (low)                     — reviewStatus == 'incomplete'

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.ChronicKidneyDiseaseReview.

/**
 * Detect the flags raised by the review findings.
 *
 * @param {AssessmentData} data
 * @param {{ gfrCategory?: string|null, kdigoRiskZone?: string|null,
 *           reviewStatus?: string, bloodPressureAtTarget?: boolean|null }} [grade]
 *        the grader's derived classification; drives the very-high-risk,
 *        uncontrolled-bp, and incomplete flags.
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const g = grade || {};

  const renal = data.renal;
  const alb = data.albuminuria;
  const med = data.medication;
  const bloods = data.bloods;

  // ─── Nephrology referral — very-high risk (HIGH) ───────────
  if (g.kdigoRiskZone === 'very-high') {
    flags.push({
      id: 'F-VERY-HIGH-RISK-REFERRAL-001',
      category: 'very-high-risk-referral',
      priority: 'high',
      description: 'KDIGO risk zone is very high',
      suggestedAction:
        'Consider or arrange nephrology referral and increase monitoring frequency per NICE NG203.'
    });
  }

  // ─── Nephrology referral — eGFR < 30 (HIGH) ────────────────
  if (g.gfrCategory === 'G4' || g.gfrCategory === 'G5') {
    flags.push({
      id: 'F-EGFR-REFERRAL-001',
      category: 'egfr-referral',
      priority: 'high',
      description:
        `eGFR ${present(renal.egfr) ? renal.egfr : ''} corresponds to ${g.gfrCategory} (eGFR < 30 mL/min/1.73 m²)`,
      suggestedAction:
        'Refer to nephrology (eGFR < 30) unless already under specialist care.'
    });
  }

  // ─── Nephrology referral — ACR >= 70 (HIGH) ────────────────
  if (present(alb.acr) && alb.acr >= 70) {
    flags.push({
      id: 'F-ACR-REFERRAL-001',
      category: 'acr-referral',
      priority: 'high',
      description: `Urine ACR ${alb.acr} mg/mmol is >= 70 (severe albuminuria)`,
      suggestedAction:
        'Refer to nephrology for severe albuminuria (ACR >= 70) per NICE NG203.'
    });
  }

  // ─── Rapid eGFR decline (HIGH) ─────────────────────────────
  if (isRapidDecline(data)) {
    flags.push({
      id: 'F-RAPID-DECLINE-001',
      category: 'rapid-decline',
      priority: 'high',
      description:
        `Sustained eGFR fall from ${renal.previousEgfr} to ${renal.egfr} mL/min/1.73 m²`,
      suggestedAction:
        'Investigate the cause of the accelerated decline; refer to nephrology and review nephrotoxic exposures.'
    });
  }

  // ─── Hyperkalaemia (HIGH >= 6.0; MEDIUM 5.5–5.9) ───────────
  if (present(bloods.potassium) && bloods.potassium >= 6.0) {
    flags.push({
      id: 'F-HYPERKALAEMIA-001',
      category: 'hyperkalaemia',
      priority: 'high',
      description: `Serum potassium ${bloods.potassium} mmol/L is >= 6.0`,
      suggestedAction:
        'Assess urgently for the cause; recheck potassium, review RAAS blockade and diet, and treat per local protocol.'
    });
  } else if (present(bloods.potassium) && bloods.potassium >= 5.5) {
    flags.push({
      id: 'F-HYPERKALAEMIA-002',
      category: 'hyperkalaemia',
      priority: 'medium',
      description: `Serum potassium ${bloods.potassium} mmol/L is 5.5–5.9`,
      suggestedAction:
        'Recheck potassium and review ACEi/ARB dosing and dietary potassium.'
    });
  }

  // ─── Anaemia of CKD (MEDIUM) ───────────────────────────────
  if (present(bloods.haemoglobin) && bloods.haemoglobin < 110) {
    flags.push({
      id: 'F-ANAEMIA-001',
      category: 'anaemia',
      priority: 'medium',
      description: `Haemoglobin ${bloods.haemoglobin} g/L is < 110`,
      suggestedAction:
        'Assess iron status and exclude other causes; consider ESA therapy or renal referral for anaemia of CKD.'
    });
  }

  // ─── Uncontrolled blood pressure (MEDIUM) ──────────────────
  if (g.bloodPressureAtTarget === false) {
    flags.push({
      id: 'F-UNCONTROLLED-BP-001',
      category: 'uncontrolled-bp',
      priority: 'medium',
      description: 'Blood pressure is above the applicable CKD target',
      suggestedAction:
        'Optimise antihypertensive therapy (ACEi/ARB first line in CKD) and arrange follow-up per NICE NG203.'
    });
  }

  // ─── Nephrotoxic drug without dose adjustment (HIGH) ───────
  if (
    med.nephrotoxicDrugPresent === 'yes' &&
    med.nephrotoxicDoseAdjusted !== 'yes'
  ) {
    flags.push({
      id: 'F-NEPHROTOXIC-DRUG-001',
      category: 'nephrotoxic-drug',
      priority: 'high',
      description:
        'A nephrotoxic or renally-cleared drug is present and has not been dose-adjusted or held',
      suggestedAction:
        'Review the medication; dose-adjust or hold the nephrotoxic agent and re-check renal function.'
    });
  }

  // ─── Missing ACR (MEDIUM) ──────────────────────────────────
  if (alb.acrMeasured !== 'yes' || !present(alb.acr)) {
    flags.push({
      id: 'F-MISSING-ACR-001',
      category: 'missing-acr',
      priority: 'medium',
      description:
        'Urine albumin:creatinine ratio not measured this review — KDIGO zone cannot be fully determined',
      suggestedAction:
        'Send a urine ACR to complete KDIGO staging and confirm the applicable BP target.'
    });
  }

  // ─── Incomplete review (LOW) ───────────────────────────────
  if (g.reviewStatus === 'incomplete') {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        'Core review bundle items are missing — the review cannot be reliably classified',
      suggestedAction:
        'Re-book to complete the outstanding review components (eGFR, ACR, BP, medication review, core bloods).'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);

  return flags;
}

export { detectFlaggedIssues };
