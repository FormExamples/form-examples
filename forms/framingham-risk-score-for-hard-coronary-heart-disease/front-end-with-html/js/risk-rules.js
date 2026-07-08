// Framingham Risk Score — declarative risk rules.
//
// Vanilla-JS port of `src/lib/engine/risk-rules.ts`. Each rule has an
// `evaluate(data, riskPct)` predicate; the grader fires every rule whose
// predicate returns true. Pure — no side effects.
(function () {
  'use strict';

  const NS = window.FraminghamRiskScore;
  const { convertMmolToMg, calculateBmi, isSmoker } = NS;

  /** Total cholesterol normalised to mg/dL, or null. */
  function getTcMg(d) {
    if (d.cholesterol.totalCholesterol == null) return null;
    if (d.cholesterol.cholesterolUnit === 'mmolL') {
      return convertMmolToMg(d.cholesterol.totalCholesterol);
    }
    return d.cholesterol.totalCholesterol;
  }

  /** HDL cholesterol normalised to mg/dL, or null. */
  function getHdlMg(d) {
    if (d.cholesterol.hdlCholesterol == null) return null;
    if (d.cholesterol.cholesterolUnit === 'mmolL') {
      return convertMmolToMg(d.cholesterol.hdlCholesterol);
    }
    return d.cholesterol.hdlCholesterol;
  }

  /** Effective BMI: from the lifestyle section if present, else derived. */
  function getBmi(d) {
    if (d.lifestyleFactors.bmi != null) return d.lifestyleFactors.bmi;
    return calculateBmi(d.demographics.heightCm, d.demographics.weightKg);
  }

  /** All 20 risk rules, ordered high → medium → low. */
  function allRules() {
    return [
      // ─── HIGH ─────────────────────────────────────────────
      {
        id: 'FRS-001',
        category: 'Overall Risk',
        description: '10-year CHD risk >= 20% (high risk)',
        riskLevel: 'high',
        evaluate: (_d, riskPct) => riskPct >= 20.0
      },
      {
        id: 'FRS-002',
        category: 'Blood Pressure',
        description: 'Systolic BP >= 180 mmHg (hypertensive crisis)',
        riskLevel: 'high',
        evaluate: (d) =>
          d.bloodPressure.systolicBp != null && d.bloodPressure.systolicBp >= 180.0
      },
      {
        id: 'FRS-003',
        category: 'Cholesterol',
        description: 'Total cholesterol >= 310 mg/dL (severe hypercholesterolemia)',
        riskLevel: 'high',
        evaluate: (d) => {
          const tc = getTcMg(d);
          return tc != null && tc >= 310.0;
        }
      },
      {
        id: 'FRS-004',
        category: 'Cholesterol',
        description: 'HDL < 30 mg/dL (critically low HDL)',
        riskLevel: 'high',
        evaluate: (d) => {
          const hdl = getHdlMg(d);
          return hdl != null && hdl < 30.0;
        }
      },
      {
        id: 'FRS-005',
        category: 'Combined Risk',
        description: 'Multiple risk factors: age >= 60, smoker, BP >= 140, TC >= 240',
        riskLevel: 'high',
        evaluate: (d) => {
          const ageOk = d.demographics.age != null && d.demographics.age >= 60;
          const smoker = isSmoker(d.smokingHistory.smokingStatus);
          const bpOk = d.bloodPressure.systolicBp != null && d.bloodPressure.systolicBp >= 140.0;
          const tc = getTcMg(d);
          const tcOk = tc != null && tc >= 240.0;
          return ageOk && smoker && bpOk && tcOk;
        }
      },
      // ─── MEDIUM ───────────────────────────────────────────
      {
        id: 'FRS-006',
        category: 'Overall Risk',
        description: '10-year CHD risk 10-19.9% (intermediate risk)',
        riskLevel: 'medium',
        evaluate: (_d, riskPct) => riskPct >= 10.0 && riskPct < 20.0
      },
      {
        id: 'FRS-007',
        category: 'Smoking',
        description: 'Current smoker',
        riskLevel: 'medium',
        evaluate: (d) => isSmoker(d.smokingHistory.smokingStatus)
      },
      {
        id: 'FRS-008',
        category: 'Blood Pressure',
        description: 'Systolic BP 140-179 mmHg (stage 2 hypertension)',
        riskLevel: 'medium',
        evaluate: (d) =>
          d.bloodPressure.systolicBp != null &&
          d.bloodPressure.systolicBp >= 140.0 &&
          d.bloodPressure.systolicBp < 180.0
      },
      {
        id: 'FRS-009',
        category: 'Cholesterol',
        description: 'Total cholesterol 240-309 mg/dL (elevated)',
        riskLevel: 'medium',
        evaluate: (d) => {
          const tc = getTcMg(d);
          return tc != null && tc >= 240.0 && tc < 310.0;
        }
      },
      {
        id: 'FRS-010',
        category: 'Cholesterol',
        description: 'HDL 30-39 mg/dL (low)',
        riskLevel: 'medium',
        evaluate: (d) => {
          const hdl = getHdlMg(d);
          return hdl != null && hdl >= 30.0 && hdl < 40.0;
        }
      },
      {
        id: 'FRS-011',
        category: 'Blood Pressure',
        description: 'On BP treatment (indicating known hypertension)',
        riskLevel: 'medium',
        evaluate: (d) => d.bloodPressure.onBpTreatment === 'yes'
      },
      {
        id: 'FRS-012',
        category: 'Family History',
        description: 'Family history of premature CHD (onset < 55)',
        riskLevel: 'medium',
        evaluate: (d) =>
          d.familyHistory.familyChdHistory === 'yes' &&
          d.familyHistory.familyChdAgeOnset === 'under55'
      },
      {
        id: 'FRS-013',
        category: 'Lifestyle',
        description: 'BMI >= 30 (obese)',
        riskLevel: 'medium',
        evaluate: (d) => {
          const bmi = getBmi(d);
          return bmi != null && bmi >= 30.0;
        }
      },
      {
        id: 'FRS-014',
        category: 'Lifestyle',
        description: 'Sedentary lifestyle',
        riskLevel: 'medium',
        evaluate: (d) => d.lifestyleFactors.physicalActivity === 'sedentary'
      },
      {
        id: 'FRS-015',
        category: 'Demographics',
        description: 'Age >= 65',
        riskLevel: 'medium',
        evaluate: (d) => d.demographics.age != null && d.demographics.age >= 65
      },
      // ─── LOW (protective indicators) ──────────────────────
      {
        id: 'FRS-016',
        category: 'Cholesterol',
        description: 'HDL >= 60 mg/dL (protective factor)',
        riskLevel: 'low',
        evaluate: (d) => {
          const hdl = getHdlMg(d);
          return hdl != null && hdl >= 60.0;
        }
      },
      {
        id: 'FRS-017',
        category: 'Smoking',
        description: 'Non-smoker',
        riskLevel: 'low',
        evaluate: (d) =>
          !isSmoker(d.smokingHistory.smokingStatus) &&
          d.smokingHistory.smokingStatus !== ''
      },
      {
        id: 'FRS-018',
        category: 'Blood Pressure',
        description: 'Normal BP (< 120/80) without treatment',
        riskLevel: 'low',
        evaluate: (d) =>
          d.bloodPressure.systolicBp != null &&
          d.bloodPressure.systolicBp < 120.0 &&
          d.bloodPressure.diastolicBp != null &&
          d.bloodPressure.diastolicBp < 80.0 &&
          d.bloodPressure.onBpTreatment !== 'yes'
      },
      {
        id: 'FRS-019',
        category: 'Cholesterol',
        description: 'Total cholesterol < 200 mg/dL (optimal)',
        riskLevel: 'low',
        evaluate: (d) => {
          const tc = getTcMg(d);
          return tc != null && tc < 200.0;
        }
      },
      {
        id: 'FRS-020',
        category: 'Lifestyle',
        description: 'Physically active (moderate or vigorous exercise)',
        riskLevel: 'low',
        evaluate: (d) =>
          d.lifestyleFactors.physicalActivity === 'moderate' ||
          d.lifestyleFactors.physicalActivity === 'vigorous'
      }
    ];
  }

  Object.assign(window.FraminghamRiskScore, {
    allRules
  });
})();
