// Pure utility functions for the Gerontology Assessment.
// Mirrors `src/lib/engine/utils.ts` from the SvelteKit reference.

(function () {
'use strict';
window.GerontologyAssessment = window.GerontologyAssessment || {};

/** Calculate BMI from weight (kg) and height (cm). Returns null if invalid. */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Get BMI category label. */
function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III (Morbid)';
}

/** Calculate age from date of birth string. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/** Clinical Frailty Scale score label. */
function cfsScoreLabel(score) {
  switch (score) {
    case 1: return 'CFS 1 - Very Fit';
    case 2: return 'CFS 2 - Well';
    case 3: return 'CFS 3 - Managing Well';
    case 4: return 'CFS 4 - Vulnerable';
    case 5: return 'CFS 5 - Mildly Frail';
    case 6: return 'CFS 6 - Moderately Frail';
    case 7: return 'CFS 7 - Severely Frail';
    case 8: return 'CFS 8 - Very Severely Frail';
    case 9: return 'CFS 9 - Terminally Ill';
    default: return `CFS ${score}`;
  }
}

/** CFS score CSS class hint for the badge. */
function cfsScoreClass(score) {
  return `cfs-${score}`;
}

/** Count dependent ADLs (returns count of fields marked 'dependent'). */
function countDependentADLs(data) {
  const fields = [
    data.bathingADL,
    data.dressingADL,
    data.toiletingADL,
    data.transferringADL,
    data.feedingADL
  ];
  return fields.filter((f) => f === 'dependent').length;
}

/** Count ADLs needing assistance (count of 'needs-assistance' or 'dependent'). */
function countADLsNeedingHelp(data) {
  const fields = [
    data.bathingADL,
    data.dressingADL,
    data.toiletingADL,
    data.transferringADL,
    data.feedingADL
  ];
  return fields.filter((f) => f === 'needs-assistance' || f === 'dependent').length;
}

/** Count IADLs needing help. */
function countIADLsNeedingHelp(data) {
  const fields = [
    data.cookingIADL,
    data.cleaningIADL,
    data.shoppingIADL,
    data.financesIADL,
    data.medicationManagementIADL
  ];
  return fields.filter((f) => f === 'needs-assistance' || f === 'dependent').length;
}

Object.assign(window.GerontologyAssessment, {
  calculateBMI,
  bmiCategory,
  calculateAge,
  cfsScoreLabel,
  cfsScoreClass,
  countDependentADLs,
  countADLsNeedingHelp,
  countIADLsNeedingHelp
});
})();
