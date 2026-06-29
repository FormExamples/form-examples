import { describe, it, expect } from 'vitest';
import { evaluateFitnessToFly } from './composite-grader.js';
import { createEmptyAssessment } from './factory.js';
import { addDaysIso } from './utils.js';

describe('evaluateFitnessToFly', () => {
  it('returns `fit` with no rules and no flags for an empty assessment', () => {
    const data = createEmptyAssessment();
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('fit');
    expect(r.firedRules).toHaveLength(0);
    expect(r.safetyFlags).toHaveLength(0);
  });

  it('takes the worst band when multiple rules fire (max-grade semantics)', () => {
    const data = createEmptyAssessment();
    data.inflightNeeds.requiresMedicalEscort = 'yes'; // fit-with-conditions
    data.cardiovascular.recentMiDate = addDaysIso(new Date().toISOString().slice(0, 10), -3); // unfit
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('unfit-to-fly');
  });

  it('flags acute MI within 7 days as unfit-to-fly with a high-priority cardiac flag', () => {
    const data = createEmptyAssessment();
    data.cardiovascular.recentMiDate = addDaysIso(new Date().toISOString().slice(0, 10), -2);
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('unfit-to-fly');
    expect(r.safetyFlags.some((f) => f.flagId === 'F-CARDIAC-MI-7')).toBe(true);
  });

  it('classifies singleton pregnancy > 36 weeks as unfit-to-fly', () => {
    const data = createEmptyAssessment();
    data.pregnancy.isPregnant = 'yes';
    data.pregnancy.pregnancyType = 'singleton';
    data.pregnancy.gestationWeeks = 37;
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('unfit-to-fly');
    expect(r.safetyFlags.some((f) => f.category === 'obstetric')).toBe(true);
  });

  it('classifies singleton pregnancy 28–36 weeks as requires-review', () => {
    const data = createEmptyAssessment();
    data.pregnancy.isPregnant = 'yes';
    data.pregnancy.pregnancyType = 'singleton';
    data.pregnancy.gestationWeeks = 30;
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('requires-review');
  });

  it('flags severe anaemia (Hb < 75) as unfit-to-fly', () => {
    const data = createEmptyAssessment();
    data.cabinMeds.haemoglobinGPerL = 70;
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('unfit-to-fly');
    expect(r.safetyFlags.some((f) => f.flagId === 'F-ANAEMIA-SEVERE')).toBe(true);
  });

  it('flags SpO2 < 85 % on room air as unfit-to-fly', () => {
    const data = createEmptyAssessment();
    data.respiratory.restingSpo2Percent = 82;
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('unfit-to-fly');
  });

  it('flags oxygen flow > 4 L/min as requires-review', () => {
    const data = createEmptyAssessment();
    data.inflightNeeds.requiresSupplementalOxygen = 'yes';
    data.inflightNeeds.oxygenFlowRateLpm = 6;
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('requires-review');
    expect(r.safetyFlags.some((f) => f.flagId === 'F-OXYGEN-HIGH-FLOW')).toBe(true);
  });

  it('classifies oxygen flow at 2 L/min as fit-with-conditions', () => {
    const data = createEmptyAssessment();
    data.inflightNeeds.requiresSupplementalOxygen = 'yes';
    data.inflightNeeds.oxygenFlowRateLpm = 2;
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('fit-with-conditions');
  });

  it('flags intra-abdominal gas as unfit-to-fly with high-priority gas-expansion flag', () => {
    const data = createEmptyAssessment();
    data.recentEvents.cabinGasRisk = 'intra-abdominal-gas';
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('unfit-to-fly');
    expect(r.safetyFlags.some((f) => f.category === 'gas-expansion')).toBe(true);
  });

  it('classifies active communicable disease as unfit-to-fly', () => {
    const data = createEmptyAssessment();
    data.communicable.communicableDiseaseStatus = 'infectious';
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('unfit-to-fly');
  });

  it('classifies scuba diving within 24 hours as unfit-to-fly', () => {
    const data = createEmptyAssessment();
    data.recentEvents.scubaDivingWithin24h = 'yes';
    const r = evaluateFitnessToFly(data);
    expect(r.fitnessBand).toBe('unfit-to-fly');
  });

  it('produces a valid-until ISO date 14 days after signature', () => {
    const data = createEmptyAssessment();
    data.physician.signatureDate = '2026-05-01';
    const r = evaluateFitnessToFly(data);
    expect(r.validUntil).toBe('2026-05-15');
  });

  it('produces a desk recommendation matching the band', () => {
    const data = createEmptyAssessment();
    const r = evaluateFitnessToFly(data);
    expect(r.deskRecommendation.toLowerCase()).toContain('proceed');
  });
});
