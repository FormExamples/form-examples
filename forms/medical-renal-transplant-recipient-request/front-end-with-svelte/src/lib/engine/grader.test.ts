import { describe, it, expect } from 'vitest';
import { calculateGrade, deriveRecommendation } from './grader';
import { detectFlags } from './flags';
import { createDefaultRequest } from './defaults';
import { requiredSamples } from './rules';
import type { RenalRecipientRequest } from './types';

/** A well-formed routine request: list registration, history answered, identity safe. */
function safeRoutine(): RenalRecipientRequest {
  const d = createDefaultRequest();
  d.recipient.familyName = 'Doe';
  d.recipient.givenNames = 'Jane';
  d.recipient.birthDate = '1970-02-02';
  d.recipient.nationalHealthIdentifier = '900 000 0002';
  d.history.organRequired = 'kidney';
  d.history.previousTransplantCount = 0;
  d.history.transfusionCount = 0;
  d.history.pregnancyCount = 0;
  d.clinical.recipientAboGroup = 'a';
  d.clinical.dialysisMode = 'unit-haemodialysis';
  d.tests.listRegistrationFirstTypingAndRetyping = true;
  d.tests.hlaMonitoringRoutineTransplantList = true;
  d.requester.clinicianName = 'Dr P Anand';
  d.requester.requestedBySignedAt = '2026-09-01T10:00';
  d.requester.consentAndIdentityConfirmed = true;
  d.sample.sampleCollectorName = 'Nurse A Patel';
  d.sample.sampleCollectedAt = '2026-09-01T09:30';
  d.sample.identifiersOnSampleCount = 4;
  d.sample.identifiersOnFormCount = 4;
  d.sample.sampleAndFormDetailsMatch = true;
  d.sample.samplesEdtaPurpleCount = 1;
  d.sample.samplesEdtaPinkHandLabelledCount = 1;
  d.sample.samplesSerumCount = 2;
  return d;
}

describe('Renal transplant recipient four-axis grader', () => {
  it('grades a complete safe routine request as accept / routine', () => {
    const result = calculateGrade(safeRoutine());
    expect(result.appropriatenessBand).toBe('usually-appropriate');
    expect(result.identitySafetyBand).toBe('ok');
    expect(result.triageTier).toBe('routine');
    expect(result.recommendation).toBe('accept');
    expect(result.completenessPercent).toBe(100);
    expect(result.flags).toHaveLength(0);
  });

  it('rejects when fewer than three identifiers are on the sample', () => {
    const d = safeRoutine();
    d.sample.identifiersOnSampleCount = 2;
    const result = calculateGrade(d);
    expect(result.identitySafetyBand).toBe('reject-risk');
    expect(result.recommendation).toBe('reject');
    expect(result.firedRules.some((r) => r.ruleId === 'R-ID-3PT-01')).toBe(true);
    expect(result.flags.some((f) => f.category === 'identity-mismatch-risk')).toBe(true);
  });

  it('escalates a day-of-transplant test to stat', () => {
    const d = safeRoutine();
    d.tests.deceasedDonorDayOfTransplant = true;
    const result = calculateGrade(d);
    expect(result.triageTier).toBe('stat');
    expect(result.firedRules.some((r) => r.ruleId === 'R-TRIAGE-01')).toBe(true);
    expect(result.flags.some((f) => f.category === 'day-of-transplant-stat')).toBe(true);
  });

  it('marks a rejection investigation with no transplant as not appropriate', () => {
    const d = safeRoutine();
    d.tests.hlaRejectionInvestigation = true;
    const result = calculateGrade(d);
    expect(result.appropriatenessBand).toBe('usually-not-appropriate');
    expect(result.recommendation).toBe('query-referrer');
  });

  it('caps a virtual crossmatch without antibody monitoring', () => {
    const d = safeRoutine();
    d.tests.hlaMonitoringRoutineTransplantList = false;
    d.tests.listRegistrationFirstTypingAndRetyping = false;
    d.tests.livingDonorVirtualCrossmatch = true;
    const result = calculateGrade(d);
    expect(result.appropriatenessBand).toBe('may-be-appropriate');
    expect(
      result.flags.some((f) => f.category === 'virtual-crossmatch-without-antibody-profile')
    ).toBe(true);
  });

  it('treats an unanswered sensitization count as different from none', () => {
    const d = safeRoutine();
    d.history.transfusionCount = null;
    const flags = detectFlags(d);
    expect(flags.some((f) => f.category === 'missing-sensitisation-history')).toBe(true);
    expect(calculateGrade(d).completenessPercent).toBeLessThan(100);
  });

  it('works out the sample tubes as the maximum per tube type', () => {
    const d = createDefaultRequest();
    d.tests.deceasedDonorFullCrossmatch = true;
    d.tests.hlaMonitoringRoutineTransplantList = true;
    expect(requiredSamples(d).summary).toBe('30 mL EDTA; 12 mL serum');
  });

  it('drops completeness and queries the referrer for a blank request', () => {
    const result = calculateGrade(createDefaultRequest());
    expect(result.completenessPercent).toBeLessThan(50);
    expect(result.recommendation).toBe('query-referrer');
  });

  it('derives recommendations from the axes', () => {
    expect(deriveRecommendation('usually-appropriate', 'reject-risk', 100)).toBe('reject');
    expect(deriveRecommendation('usually-not-appropriate', 'ok', 100)).toBe('query-referrer');
    expect(deriveRecommendation('usually-appropriate', 'caution', 100)).toBe('query-referrer');
    expect(deriveRecommendation('usually-appropriate', 'ok', 40)).toBe('query-referrer');
    expect(deriveRecommendation('usually-appropriate', 'ok', 100)).toBe('accept');
  });
});
