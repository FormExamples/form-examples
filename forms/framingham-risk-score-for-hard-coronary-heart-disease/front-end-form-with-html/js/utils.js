// Framingham Risk Score — Wilson/D'Agostino 1998 Cox regression.
//
// Vanilla-JS port of `src/lib/engine/utils.ts` (calculateFraminghamRisk).
// Returns the 10-year hard-CHD risk percentage given a complete-enough
// assessment. Pure function — no side effects.
(function () {
  'use strict';

  const NS = window.FraminghamRiskScore;
  const { convertMmolToMg, isSmoker } = NS;

  /**
   * Calculate the Framingham 10-year risk of hard CHD as a percentage
   * (0.0-100.0). Returns 0.0 when age or sex are missing.
   *
   * @param {object} data Full assessment data.
   * @returns {number}
   */
  function calculateFraminghamRisk(data) {
    const age = data.demographics.age;
    if (age == null) return 0.0;

    const sex = data.demographics.sex;
    if (!sex) return 0.0;

    // Pull cholesterol, converting from mmol/L if needed.
    let totalChol = data.cholesterol.totalCholesterol;
    let hdlChol = data.cholesterol.hdlCholesterol;
    if (totalChol == null) totalChol = 200.0;
    if (hdlChol == null) hdlChol = 50.0;

    if (data.cholesterol.cholesterolUnit === 'mmolL') {
      totalChol = convertMmolToMg(totalChol);
      hdlChol = convertMmolToMg(hdlChol);
    }

    const sbp = data.bloodPressure.systolicBp != null
      ? data.bloodPressure.systolicBp
      : 120.0;
    const treated = data.bloodPressure.onBpTreatment === 'yes';
    const smoker = isSmoker(data.smokingHistory.smokingStatus);

    const lnAge = Math.log(age);
    const lnTc = Math.log(totalChol);
    const lnHdl = Math.log(hdlChol);
    const lnSbp = Math.log(sbp);

    if (sex === 'male') {
      const lnSbpCoeff = treated ? 1.305784 + 0.241549 : 1.305784;
      const ageForSmokeInteraction = age > 70 ? 70 : age;
      const lnAgeSmoke = Math.log(ageForSmokeInteraction);

      const l =
        52.00961 * lnAge +
        20.014077 * lnTc +
        -0.905964 * lnHdl +
        lnSbpCoeff * lnSbp +
        (smoker ? 12.096316 : 0.0) +
        -4.605038 * lnAge * lnTc +
        (smoker ? -2.84367 * lnAgeSmoke : 0.0) +
        -2.93323 * lnAge * lnAge +
        -172.300168;

      const risk = 1.0 - Math.pow(0.9402, Math.exp(l));
      return Math.max(0, Math.min(100, risk * 100));
    } else {
      const lnSbpCoeff = treated ? 2.552905 + 0.420251 : 2.552905;
      const ageForSmokeInteraction = age > 78 ? 78 : age;
      const lnAgeSmoke = Math.log(ageForSmokeInteraction);

      const l =
        31.764001 * lnAge +
        22.465206 * lnTc +
        -1.187731 * lnHdl +
        lnSbpCoeff * lnSbp +
        (smoker ? 13.07543 : 0.0) +
        -5.060998 * lnAge * lnTc +
        (smoker ? -2.996945 * lnAgeSmoke : 0.0) +
        -146.5933061;

      const risk = 1.0 - Math.pow(0.98767, Math.exp(l));
      return Math.max(0, Math.min(100, risk * 100));
    }
  }

  Object.assign(window.FraminghamRiskScore, {
    calculateFraminghamRisk
  });
})();
