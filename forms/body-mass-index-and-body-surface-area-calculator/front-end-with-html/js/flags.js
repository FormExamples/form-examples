import { ASIAN_HIGH, ASIAN_INCREASED, BMI_MAX, BMI_MIN, BMI_NORMAL, BMI_OBESE_3, HEIGHT_MAX, HEIGHT_MIN, WEIGHT_MAX, WEIGHT_MIN } from './rules.js';

// Flagged-issue detection (red flags). Independent of the WHO category (which the
// grader produces), this module raises clinician-facing safety flags per spec §5,
// using the unrounded BMI and the raw height/weight inputs:
//
//   - Severe obesity (high)        — bmiCategory == 'obese-class-3' (bmi >= 40)
//   - Underweight (high)           — bmi < 18.5
//   - Extreme value — verify (high)— heightCm < 100 or > 250, weightKg < 20 or
//                                     > 400, or bmi < 10 or > 80
//   - Asian high risk (medium)     — ancestry == 'asian' && bmi >= 27.5
//   - Asian increased risk (low)   — ancestry == 'asian' && 23 <= bmi < 27.5
//   - Incomplete data (low)        — height or weight missing / non-positive
//
// Rows here mirror the
// `body_mass_index_and_body_surface_area_calculator_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.BmiBsaCalculator.

/**
 * @param {AssessmentData} data
 * @param {number | null} bmi   - unrounded BMI, or null when inputs are missing
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, bmi) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const heightCm = data.height.heightCm;
  const weightKg = data.weight.weightKg;
  const ancestry = data.identification.ancestry;

  const heightMissing =
    heightCm === null || heightCm === undefined || !(heightCm > 0);
  const weightMissing =
    weightKg === null || weightKg === undefined || !(weightKg > 0);

  // ─── Incomplete data (LOW) ──────────────────────────────────────────
  if (bmi === null || heightMissing || weightMissing) {
    const missing = [];
    if (heightMissing) missing.push('height');
    if (weightMissing) missing.push('weight');
    flags.push({
      id: 'F-INCOMPLETE-DATA-001',
      category: 'incomplete-data',
      priority: 'low',
      description: `Missing or non-positive input(s): ${missing.join(', ')} — no BMI or BSA can be computed`,
      suggestedAction:
        'Record the measured height and weight, then re-calculate.'
    });
    return flags;
  }

  const shownBmi = `${(Math.round(bmi * 10) / 10).toFixed(1)} kg/m²`;

  // ─── Severe obesity (HIGH) ──────────────────────────────────────────
  if (bmi >= BMI_OBESE_3) {
    flags.push({
      id: 'F-SEVERE-OBESITY-001',
      category: 'severe-obesity',
      priority: 'high',
      description: `BMI ${shownBmi} at or above the 40 kg/m² threshold — obese class III`,
      suggestedAction:
        'Consider specialist weight-management referral and review obesity-related comorbidities.'
    });
  }

  // ─── Underweight (HIGH) ─────────────────────────────────────────────
  if (bmi < BMI_NORMAL) {
    flags.push({
      id: 'F-UNDERWEIGHT-001',
      category: 'underweight',
      priority: 'high',
      description: `BMI ${shownBmi} below the 18.5 kg/m² threshold — underweight`,
      suggestedAction:
        'Possible undernutrition; consider nutritional assessment and investigate the cause.'
    });
  }

  // ─── Extreme value — verify (HIGH) ──────────────────────────────────
  const extremeReasons = [];
  if (heightCm < HEIGHT_MIN || heightCm > HEIGHT_MAX) {
    extremeReasons.push(`height ${heightCm} cm outside ${HEIGHT_MIN}–${HEIGHT_MAX} cm`);
  }
  if (weightKg < WEIGHT_MIN || weightKg > WEIGHT_MAX) {
    extremeReasons.push(`weight ${weightKg} kg outside ${WEIGHT_MIN}–${WEIGHT_MAX} kg`);
  }
  if (bmi < BMI_MIN || bmi > BMI_MAX) {
    extremeReasons.push(`BMI ${shownBmi} outside ${BMI_MIN}–${BMI_MAX} kg/m²`);
  }
  if (extremeReasons.length > 0) {
    flags.push({
      id: 'F-EXTREME-VALUE-001',
      category: 'extreme-value',
      priority: 'high',
      description: `Physiologically extreme value(s): ${extremeReasons.join('; ')} — likely data-entry error`,
      suggestedAction:
        'Re-measure and re-enter height and weight before using the BSA for drug dosing.'
    });
  }

  // ─── Asian high risk (MEDIUM) ───────────────────────────────────────
  if (ancestry === 'asian' && bmi >= ASIAN_HIGH) {
    flags.push({
      id: 'F-ASIAN-HIGH-RISK-001',
      category: 'asian-high-risk',
      priority: 'medium',
      description: `BMI ${shownBmi} at or above the 27.5 kg/m² Asian high-risk action point`,
      suggestedAction:
        'Cardiometabolic risk is elevated at a lower BMI in Asian populations; assess and manage accordingly.'
    });
  }

  // ─── Asian increased risk (LOW) ─────────────────────────────────────
  if (ancestry === 'asian' && bmi >= ASIAN_INCREASED && bmi < ASIAN_HIGH) {
    flags.push({
      id: 'F-ASIAN-INCREASED-RISK-001',
      category: 'asian-increased-risk',
      priority: 'low',
      description: `BMI ${shownBmi} at or above the 23 kg/m² Asian increased-risk action point`,
      suggestedAction:
        'Increased cardiometabolic risk in Asian populations; consider lifestyle advice and monitoring.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
