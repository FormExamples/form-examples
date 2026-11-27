import { describe, it, expect } from 'vitest';
import { calculateGrade, deriveRecommendation } from './grader';
import { createDefaultRequest } from './defaults';
import { requiredSamples } from './rules';
import type { HsctTypingRequest } from './types';

/** A well-formed routine request for an HSCT recipient with full volumes. */
function safeRecipient(): HsctTypingRequest {
  const d = createDefaultRequest();
  d.subject.familyName = 'Doe';
  d.subject.givenNames = 'Jane';
  d.subject.birthDate = '1975-02-02';
  d.subject.sex = 'female';
  d.subject.ethnicity = 'White British';
  d.subject.nationalHealthIdentifier = '900 000 0002';
  d.referrer.clinicianName = 'Dr P Anand';
  d.referrer.reportEmail = 'reports@example.org';
  d.request.subjectRole = 'hsct-recipient';
  d.request.clinicalDetails = 'Acute myeloid leukaemia; allogeneic HSCT planned.';
  d.requester.requestedBySignedAt = '2026-09-01T10:00';
  d.requester.consentAndIdentityConfirmed = true;
  d.sample.sampleCollectorName = 'Nurse A Patel';
  d.sample.sampleCollectedAt = '2026-09-01T09:30';
  d.sample.identifiersOnSampleCount = 4;
  d.sample.identifiersOnFormCount = 4;
  d.sample.sampleAndFormDetailsMatch = true;
  d.sample.edtaPurpleVolumeMl = 18;
  d.sample.edtaPinkVolumeMl = 6;
  d.sample.clottedRedVolumeMl = 6;
  return d;
}

/** The same request for a matched-sibling donor with the recipient named. */
function safeDonor(): HsctTypingRequest {
  const d = safeRecipient();
  d.request.subjectRole = 'potential-donor';
  d.request.donorType = 'matched-sibling';
  d.recipient.recipientFamilyName = 'Doe';
  d.recipient.recipientMedicalRecordNumber = 'H123456';
  d.recipient.relationshipToRecipient = 'Sister';
  d.sample.edtaPurpleVolumeMl = 10;
  d.sample.clottedRedVolumeMl = null;
  return d;
}

describe('HSCT HLA typing four-axis grader', () => {
  it('grades a complete safe recipient request as accept / routine', () => {
    const result = calculateGrade(safeRecipient());
    expect(result.appropriatenessBand).toBe('usually-appropriate');
    expect(result.identitySafetyBand).toBe('ok');
    expect(result.triageTier).toBe('routine');
    expect(result.recommendation).toBe('accept');
    expect(result.completenessPercent).toBe(100);
    expect(result.flags).toHaveLength(0);
  });

  it('grades a complete safe donor request as accept', () => {
    const result = calculateGrade(safeDonor());
    expect(result.recommendation).toBe('accept');
    expect(result.completenessPercent).toBe(100);
  });

  it('rejects when fewer than three identifiers are on the sample', () => {
    const d = safeRecipient();
    d.sample.identifiersOnSampleCount = 2;
    const result = calculateGrade(d);
    expect(result.identitySafetyBand).toBe('reject-risk');
    expect(result.recommendation).toBe('reject');
    expect(result.flags.some((f) => f.category === 'identity-mismatch-risk')).toBe(true);
  });

  it('marks a donor with no recipient details as not appropriate', () => {
    const d = safeDonor();
    d.recipient.recipientFamilyName = '';
    d.recipient.recipientMedicalRecordNumber = '';
    const result = calculateGrade(d);
    expect(result.appropriatenessBand).toBe('usually-not-appropriate');
    expect(result.recommendation).toBe('query-referrer');
    expect(result.flags.some((f) => f.category === 'donor-without-recipient-details')).toBe(true);
  });

  it('cautions on volumes below the role requirement', () => {
    const d = safeRecipient();
    d.sample.clottedRedVolumeMl = null;
    const result = calculateGrade(d);
    expect(result.identitySafetyBand).toBe('caution');
    expect(result.flags.some((f) => f.category === 'sample-volume-insufficient')).toBe(true);
  });

  it('treats an urgent request as urgent and flags a missing reason', () => {
    const d = safeRecipient();
    d.urgency.urgentTesting = true;
    const result = calculateGrade(d);
    expect(result.triageTier).toBe('urgent');
    expect(result.flags.some((f) => f.category === 'urgent-without-reason')).toBe(true);
  });

  it('queries the referrer when there are no clinical details', () => {
    const d = safeRecipient();
    d.request.clinicalDetails = '';
    const result = calculateGrade(d);
    expect(result.recommendation).toBe('query-referrer');
    expect(result.flags.some((f) => f.category === 'no-clinical-details')).toBe(true);
  });

  it('works out the tubes each role needs', () => {
    const d = createDefaultRequest();
    d.request.subjectRole = 'hsct-recipient';
    expect(requiredSamples(d).summary).toBe(
      '18 mL EDTA (purple) + 6 mL EDTA (pink, hand-labelled) + 6 mL clotted (red)'
    );
    d.request.subjectRole = 'potential-donor';
    expect(requiredSamples(d).summary).toBe(
      '10 mL EDTA (purple) + 6 mL EDTA (pink, hand-labelled)'
    );
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
