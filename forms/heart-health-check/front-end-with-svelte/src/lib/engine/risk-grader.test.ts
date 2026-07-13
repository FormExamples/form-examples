import { describe, it, expect } from 'vitest';
import { calculateRisk, gradeAssessment } from './risk-grader.js';
import { estimateTenYearRisk } from './risk-calculator.js';
import {
  createDefaultAssessmentData,
  calculateBMI,
  calculateTcHdlRatio,
  smokingPoints,
  isLikelyDraft
} from './utils.js';
import type { AssessmentData } from './types.js';

/** A default assessment with age and sex set (so it is no longer a draft). */
function withAgeSex(age: number, sex: string): AssessmentData {
  const data = createDefaultAssessmentData();
  data.demographicsEthnicity.age = age;
  data.demographicsEthnicity.sex = sex;
  return data;
}

describe('helper calculations', () => {
  it('smokingPoints scale each smoking status', () => {
    expect(smokingPoints('heavySmoker')).toBe(15);
    expect(smokingPoints('moderateSmoker')).toBe(10);
    expect(smokingPoints('lightSmoker')).toBe(5);
    expect(smokingPoints('exSmoker')).toBe(2);
    expect(smokingPoints('')).toBe(0);
  });

  it('calculateBMI computes weight/height^2', () => {
    // 80kg at 1.8m -> 24.7
    expect(calculateBMI(180, 80)).toBe(24.7);
    expect(calculateBMI(null, 80)).toBeNull();
    expect(calculateBMI(0, 80)).toBeNull();
  });

  it('calculateTcHdlRatio divides total by HDL', () => {
    expect(calculateTcHdlRatio(5, 1.25)).toBe(4);
    expect(calculateTcHdlRatio(5, 0)).toBeNull();
  });
});

describe('isLikelyDraft', () => {
  it('is true for a blank assessment (no age and no sex)', () => {
    expect(isLikelyDraft(createDefaultAssessmentData())).toBe(true);
  });
  it('is false once age and sex are recorded', () => {
    expect(isLikelyDraft(withAgeSex(50, 'male'))).toBe(false);
  });
});

describe('estimateTenYearRisk', () => {
  it('is low for a young healthy patient', () => {
    // age 30 male, everything else default: points = (30-25)*0.8 = 4
    // risk = 0.8 * exp(0.4) ≈ 1.2
    expect(estimateTenYearRisk(withAgeSex(30, 'male'))).toBeCloseTo(1.2, 1);
  });

  it('rises with age', () => {
    expect(estimateTenYearRisk(withAgeSex(70, 'male'))).toBeGreaterThan(
      estimateTenYearRisk(withAgeSex(30, 'male'))
    );
  });

  it('is clamped to the 0.1..95 range', () => {
    const data = withAgeSex(69, 'male');
    data.smokingAlcohol.smokingStatus = 'heavySmoker';
    data.bloodPressure.systolicBP = 200;
    data.cholesterol.totalHDLRatio = 9;
    data.medicalConditions.hasDiabetes = 'type1';
    expect(estimateTenYearRisk(data)).toBeLessThanOrEqual(95);
    expect(estimateTenYearRisk(data)).toBeGreaterThanOrEqual(0.1);
  });
});

describe('calculateRisk', () => {
  it('returns draft for a blank assessment', () => {
    const r = calculateRisk(createDefaultAssessmentData());
    expect(r.riskCategory).toBe('draft');
    expect(r.tenYearRiskPercent).toBe(0);
    expect(r.heartAge).toBeNull();
    expect(r.firedRules).toEqual([]);
  });

  it('categorises a young healthy patient as low risk', () => {
    const r = calculateRisk(withAgeSex(30, 'male'));
    expect(r.riskCategory).toBe('low');
    expect(r.tenYearRiskPercent).toBeLessThan(10);
  });

  it('categorises a 60-year-old as moderate risk (10-19.9%)', () => {
    const r = calculateRisk(withAgeSex(60, 'male'));
    expect(r.riskCategory).toBe('moderate');
    expect(r.tenYearRiskPercent).toBeGreaterThanOrEqual(10);
    expect(r.tenYearRiskPercent).toBeLessThan(20);
  });

  it('categorises a high-burden patient as high risk with a high-risk rule fired', () => {
    const data = withAgeSex(65, 'male');
    data.smokingAlcohol.smokingStatus = 'heavySmoker';
    data.bloodPressure.systolicBP = 185;
    data.medicalConditions.hasChronicKidneyDisease = 'yes';
    data.medicalConditions.hasDiabetes = 'type2';
    const r = calculateRisk(data);
    expect(r.riskCategory).toBe('high');
    expect(r.tenYearRiskPercent).toBeGreaterThanOrEqual(20);
    expect(r.firedRules.length).toBeGreaterThan(0);
    expect(r.firedRules.some((f) => f.riskLevel === 'high')).toBe(true);
  });
});

describe('gradeAssessment', () => {
  it('returns a well-formed result with flags and a timestamp', () => {
    const result = gradeAssessment(withAgeSex(60, 'male'));
    expect(result.riskCategory).toBe('moderate');
    expect(Array.isArray(result.firedRules)).toBe(true);
    expect(Array.isArray(result.additionalFlags)).toBe(true);
    expect(typeof result.timestamp).toBe('string');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
