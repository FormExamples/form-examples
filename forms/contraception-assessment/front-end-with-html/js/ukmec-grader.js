import { calculateAge } from './types.js';
import { allMethods, methodLabels, ukmecRules } from './ukmec-rules.js';

// UKMEC grader. Pure functions: take an `AssessmentData` object, return
// per-method UKMEC categories and the list of fired rules. Mirrors the
// SvelteKit reference engine in `src/lib/engine/ukmec-grader.ts`.

/**
 * Derive a Set of active clinical conditions from the assessment data.
 * @param {Object} data
 * @returns {Set<string>}
 */
function deriveConditions(data) {
  const conditions = new Set();
  const age = calculateAge(data.demographics.dateOfBirth);

  if (data.medicalHistory.migraineWithAura === 'yes') {
    conditions.add('migraineWithAura');
  }

  if (data.medicalHistory.dvtHistory === 'yes') {
    conditions.add('dvtHistory');
  }

  if (data.medicalHistory.breastCancer === 'yes') {
    conditions.add('breastCancer');
  }

  // Hypertension: severity based on systolic BP
  if (data.medicalHistory.hypertension === 'yes') {
    const systolic = data.cardiovascularRisk.bloodPressureSystolic;
    if (systolic !== null && systolic !== undefined && systolic >= 160) {
      conditions.add('hypertension-severe');
    } else if (systolic !== null && systolic !== undefined && systolic >= 140) {
      conditions.add('hypertension-moderate');
    } else {
      // Hypertension reported but no/low BP values - assume moderate
      conditions.add('hypertension-moderate');
    }
  }

  if (data.medicalHistory.liverDisease === 'yes') {
    conditions.add('liverDisease');
  }

  if (data.medicalHistory.diabetes === 'yes') {
    conditions.add('diabetes');
  }

  if (data.medicalHistory.epilepsy === 'yes') {
    conditions.add('epilepsy');
  }

  // Smoking + age >= 35
  if (age !== null && age >= 35) {
    if (data.cardiovascularRisk.smoking === 'current-heavy') {
      conditions.add('heavy-smoker-over-35');
    } else if (
      data.cardiovascularRisk.smoking === 'current-light' ||
      data.lifestyleFactors.smokingStatus === 'current-light' ||
      data.lifestyleFactors.smokingStatus === 'current-heavy'
    ) {
      conditions.add('smoker-over-35');
    }
  }

  // BMI >= 35
  if (
    data.cardiovascularRisk.bmi !== null &&
    data.cardiovascularRisk.bmi !== undefined &&
    data.cardiovascularRisk.bmi >= 35
  ) {
    conditions.add('obesity-bmi-35');
  }

  // Breastfeeding < 6 weeks postpartum
  if (data.reproductiveHistory.breastfeeding === 'yes') {
    const deliveryDate = data.reproductiveHistory.lastDeliveryDate;
    if (deliveryDate) {
      const delivery = new Date(deliveryDate);
      if (!isNaN(delivery.getTime())) {
        const today = new Date();
        const weeksSinceDelivery =
          (today.getTime() - delivery.getTime()) / (1000 * 60 * 60 * 24 * 7);
        if (weeksSinceDelivery < 6) {
          conditions.add('breastfeeding-under-6-weeks');
        }
      }
    }
  }

  return conditions;
}

/**
 * Pure function: evaluates UKMEC category per contraceptive method based
 * on patient data. Returns the highest UKMEC category for each method
 * along with the reasons for that categorisation.
 *
 * @param {Object} data
 * @returns {{ ukmecResults: Object[], firedRules: Object[] }}
 */
function evaluateUKMEC(data) {
  

  const firedRules = [];
  const methodCategories = new Map();

  for (const method of allMethods) {
    methodCategories.set(method, { category: 1, reasons: [] });
  }

  const conditions = deriveConditions(data);

  for (const rule of ukmecRules) {
    if (conditions.has(rule.condition)) {
      const current = methodCategories.get(rule.method);
      if (current) {
        if (rule.category > current.category) {
          current.category = rule.category;
        }
        current.reasons.push(rule.description);

        firedRules.push({
          id: rule.id,
          domain: rule.condition,
          description: rule.description,
          score: rule.category
        });
      }
    }
  }

  const ukmecResults = allMethods.map((method) => {
    const result = methodCategories.get(method);
    return {
      method,
      methodLabel: methodLabels[method] || method,
      category: result.category,
      reasons: result.reasons
    };
  });

  return { ukmecResults, firedRules };
}

export { evaluateUKMEC, deriveConditions };
