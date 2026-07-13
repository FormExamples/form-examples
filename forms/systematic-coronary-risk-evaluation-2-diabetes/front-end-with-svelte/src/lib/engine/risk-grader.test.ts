import { describe, it, expect } from 'vitest';
import { calculateRisk, gradeAssessment } from './risk-grader.js';
import { createDefaultAssessmentData } from './types.js';
import {
  hasEstablishedCvd,
  hba1cMmolMol,
  ckdStageFromEgfr,
  calculateBmi,
  isLikelyDraft
} from './utils.js';
import type { AssessmentData } from './types.js';

/** A default assessment made non-draft by recording an (unremarkable) HbA1c. */
function nonDraft(): AssessmentData {
  const data = createDefaultAssessmentData();
  data.diabetesHistory.hba1cValue = 45; // mmol/mol, below every threshold
  data.diabetesHistory.hba1cUnit = 'mmolMol';
  return data;
}

describe('utility helpers', () => {
  it('hasEstablishedCvd detects prior CVD events', () => {
    expect(hasEstablishedCvd(createDefaultAssessmentData())).toBe(false);
    const data = createDefaultAssessmentData();
    data.cardiovascularHistory.previousStroke = 'yes';
    expect(hasEstablishedCvd(data)).toBe(true);
  });

  it('hba1cMmolMol converts percent via the IFCC formula', () => {
    const data = createDefaultAssessmentData();
    data.diabetesHistory.hba1cValue = 8.0;
    data.diabetesHistory.hba1cUnit = 'percent';
    // (8.0 - 2.15) * 10.929 ≈ 63.9
    expect(hba1cMmolMol(data)).toBeCloseTo(63.9, 1);
  });

  it('ckdStageFromEgfr bands eGFR into KDIGO stages', () => {
    expect(ckdStageFromEgfr(95)).toBe('G1');
    expect(ckdStageFromEgfr(60)).toBe('G2');
    expect(ckdStageFromEgfr(45)).toBe('G3a');
    expect(ckdStageFromEgfr(30)).toBe('G3b');
    expect(ckdStageFromEgfr(15)).toBe('G4');
    expect(ckdStageFromEgfr(10)).toBe('G5');
    expect(ckdStageFromEgfr(null)).toBe('');
  });

  it('calculateBmi computes weight/height^2', () => {
    expect(calculateBmi(180, 80)).toBe(24.7);
    expect(calculateBmi(0, 80)).toBeNull();
  });

  it('isLikelyDraft is true for a blank assessment and false once data is entered', () => {
    expect(isLikelyDraft(createDefaultAssessmentData())).toBe(true);
    expect(isLikelyDraft(nonDraft())).toBe(false);
  });
});

describe('calculateRisk', () => {
  it('returns draft for a blank assessment', () => {
    const r = calculateRisk(createDefaultAssessmentData());
    expect(r.riskCategory).toBe('draft');
    expect(r.firedRules).toEqual([]);
  });

  it('is low risk when no rules fire', () => {
    const r = calculateRisk(nonDraft());
    expect(r.riskCategory).toBe('low');
    expect(r.firedRules).toEqual([]);
  });

  it('maps a low-concern rule (elevated triglycerides) to moderate', () => {
    const data = nonDraft();
    data.lipidProfile.triglycerides = 2.5; // CVR-020, low
    const r = calculateRisk(data);
    expect(r.firedRules.some((f) => f.id === 'CVR-020')).toBe(true);
    expect(r.riskCategory).toBe('moderate');
  });

  it('maps a medium-concern rule (SBP 140-179) to high', () => {
    const data = nonDraft();
    data.bloodPressure.systolicBp = 150; // CVR-008, medium
    const r = calculateRisk(data);
    expect(r.firedRules.some((f) => f.id === 'CVR-008')).toBe(true);
    expect(r.riskCategory).toBe('high');
  });

  it('maps a high-concern rule (SBP >= 180) to veryHigh', () => {
    const data = nonDraft();
    data.bloodPressure.systolicBp = 185; // CVR-002, high
    const r = calculateRisk(data);
    expect(r.firedRules.some((f) => f.id === 'CVR-002')).toBe(true);
    expect(r.riskCategory).toBe('veryHigh');
  });

  it('treats established CVD as a high-concern driver (veryHigh)', () => {
    const data = nonDraft();
    data.cardiovascularHistory.previousMi = 'yes'; // CVR-001, high
    const r = calculateRisk(data);
    expect(r.firedRules.some((f) => f.id === 'CVR-001')).toBe(true);
    expect(r.riskCategory).toBe('veryHigh');
  });
});

describe('gradeAssessment', () => {
  it('returns a well-formed result with flags and a timestamp', () => {
    const data = nonDraft();
    data.bloodPressure.systolicBp = 185;
    const result = gradeAssessment(data);
    expect(result.riskCategory).toBe('veryHigh');
    expect(Array.isArray(result.firedRules)).toBe(true);
    expect(Array.isArray(result.additionalFlags)).toBe(true);
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
