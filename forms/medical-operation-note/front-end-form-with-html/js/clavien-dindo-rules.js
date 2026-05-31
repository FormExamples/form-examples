// Clavien-Dindo classification rules. Mirrors the SvelteKit
// `src/lib/engine/clavien-dindo-rules.ts`. Pure functions.
//
// The lead surgeon selects the Clavien-Dindo grade directly (step 10);
// this catalogue surfaces it as a FiredRule so the composite-grader can
// fold it into the overall risk band.

(function () {
'use strict';
window.MedicalOperationNote =
  window.MedicalOperationNote || {};
const NS = window.MedicalOperationNote;

const CLAVIEN_DINDO_DESCRIPTIONS = {
  '0':    'No deviation from normal post-operative course',
  'I':    'Any deviation managed without pharmacological / surgical / endoscopic / radiological intervention',
  'II':   'Pharmacological intervention required (including transfusion / TPN)',
  'IIIa': 'Intervention required, NOT under general anaesthesia',
  'IIIb': 'Intervention required, UNDER general anaesthesia',
  'IVa':  'Life-threatening — single-organ dysfunction',
  'IVb':  'Life-threatening — multi-organ dysfunction',
  'V':    'Death of the patient'
};

/**
 * Surface the Clavien-Dindo grade (if any) as a fired rule. The grade
 * itself drives the composite risk via `clavienToCompositeRisk`.
 */
function applyClavienDindoRules(data) {
  const grade = data.safety.clavienDindoGrade;
  if (!grade) return [];
  const description = CLAVIEN_DINDO_DESCRIPTIONS[grade] || `Clavien-Dindo ${grade}`;
  return [{
    ruleId: `R-CD-${grade}`,
    instrument: 'clavien-dindo',
    grade,
    category: 'complication',
    description
  }];
}

Object.assign(NS, {
  CLAVIEN_DINDO_DESCRIPTIONS,
  applyClavienDindoRules
});
})();
