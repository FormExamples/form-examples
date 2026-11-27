import { describe, it, expect } from 'vitest';
import { calculateGrade, deriveRecommendation } from './grader';
import { createDefaultRequest } from './defaults';
import { requiredSamples } from './rules';
import type { HlaAssociationRequest } from './types';

/** A well-formed routine request: HLA-B27 for suspected spondyloarthritis, identity safe. */
function safeRoutine(): HlaAssociationRequest {
  const d = createDefaultRequest();
  d.patient.familyName = 'Doe';
  d.patient.givenNames = 'Jane';
  d.patient.birthDate = '1981-02-02';
  d.patient.ethnicity = 'White British';
  d.patient.nationalHealthIdentifier = '900 000 0002';
  d.referrer.clinicianName = 'Dr P Anand';
  d.referrer.reportEmail = 'reports@example.org';
  d.tests.hlaB27 = true;
  d.clinical.indicationCategory = 'suspected-disease';
  d.clinical.clinicalDetails = 'Chronic inflammatory back pain, suspected axial spondyloarthritis.';
  d.requester.requestedBySignedAt = '2026-09-01T10:00';
  d.requester.consentAndIdentityConfirmed = true;
  d.sample.sampleCollectorName = 'Nurse A Patel';
  d.sample.sampleCollectedAt = '2026-09-01T09:30';
  d.sample.identifiersOnSampleCount = 4;
  d.sample.identifiersOnFormCount = 4;
  d.sample.sampleAndFormDetailsMatch = true;
  d.sample.sampleVolumeMl = 6;
  return d;
}

describe('HLA disease association four-axis grader', () => {
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
    expect(result.flags.some((f) => f.category === 'identity-mismatch-risk')).toBe(true);
  });

  it('marks a repeat of a known HLA type as not appropriate', () => {
    const d = safeRoutine();
    d.clinical.previousHlaTypingKnown = true;
    const result = calculateGrade(d);
    expect(result.appropriatenessBand).toBe('usually-not-appropriate');
    expect(result.recommendation).toBe('query-referrer');
    expect(result.flags.some((f) => f.category === 'previous-hla-result-possible-duplicate')).toBe(
      true
    );
  });

  it('treats HLA-B*57:01 with a planned drug as urgent and flags it', () => {
    const d = safeRoutine();
    d.tests.hlaB27 = false;
    d.tests.hlaB5701 = true;
    d.clinical.plannedDrug = 'abacavir';
    const result = calculateGrade(d);
    expect(result.triageTier).toBe('urgent');
    expect(result.flags.some((f) => f.category === 'abacavir-start-pending')).toBe(true);
  });

  it('caps a request with no clinical details and queries the referrer', () => {
    const d = safeRoutine();
    d.clinical.clinicalDetails = '';
    const result = calculateGrade(d);
    expect(result.appropriatenessBand).toBe('may-be-appropriate');
    expect(result.recommendation).toBe('query-referrer');
    expect(result.flags.some((f) => f.category === 'no-clinical-details')).toBe(true);
  });

  it('cautions on a volume outside the expected range and a high-risk sample with no description', () => {
    const d = safeRoutine();
    d.sample.sampleVolumeMl = 3;
    d.urgency.highRiskSample = true;
    const result = calculateGrade(d);
    expect(result.identitySafetyBand).toBe('caution');
    expect(result.firedRules.some((r) => r.ruleId === 'R-ID-VOL-01')).toBe(true);
    expect(result.firedRules.some((r) => r.ruleId === 'R-ID-RISK-01')).toBe(true);
    expect(result.flags.some((f) => f.category === 'high-risk-sample')).toBe(true);
  });

  it('works out the sample as one EDTA tube whatever the tests', () => {
    const d = createDefaultRequest();
    d.tests.hlaB27 = true;
    d.tests.hlaDq2Dq8 = true;
    expect(requiredSamples(d).summary).toBe('5-10 mL EDTA blood (one tube serves every test)');
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
    expect(deriveRecommendation('usually-appropriate', 'ok', 100, false)).toBe('query-referrer');
    expect(deriveRecommendation('usually-appropriate', 'ok', 100)).toBe('accept');
  });
});
