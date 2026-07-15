import { completenessPercent, validationStatus } from './types.js';
import { validationRules as rules } from './validation-rules.js';

// Pure form-completeness validator for the Consent To Treatment form.
// Mirrors `src/lib/engine/form-validator.ts`.
//
// Walks every rule from validation-rules.js, checks the corresponding
// field on the assessment data, and returns the completeness percent,
// status label, and the list of fired rules (missing required fields).

  

  /**
   * @param {import('./types.js').AssessmentData} data
   * @returns {{ completeness: number, status: 'Complete' | 'Incomplete', firedRules: import('./types.js').FiredRule[] }}
   */
  function validateForm(data) {
    const firedRules = [];
    

    for (const rule of rules) {
      const section = data[rule.section];
      const value = section ? section[rule.field] : undefined;
      if (value === '' || value === null || value === undefined) {
        firedRules.push({
          id: rule.id,
          section: rule.section,
          description: rule.message,
          field: rule.field
        });
      }
    }

    const totalRequired = rules.length;
    const completedCount = totalRequired - firedRules.length;
    const completeness = completenessPercent(completedCount, totalRequired);
    const status = validationStatus(completeness);

    return { completeness, status, firedRules };
  }

  

export { validateForm };
