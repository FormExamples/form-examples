import { describe, it, expect } from 'vitest';
import { calculateGrade, deriveRecommendation } from './grader';
import { detectFlags } from './flags';
import { createDefaultRequest } from './defaults';
import { requiredSamples } from './rules';
import type { RenalLivingDonorRequest } from './types';

/** A well-formed directed donation: full crossmatch, compatible pair, identity safe. */
function safeDirected(): RenalLivingDonorRequest {
  const d = createDefaultRequest();
  d.donor.familyName = 'Doe';
  d.donor.givenNames = 'Jane';
  d.donor.birthDate = '1975-02-02';
  d.donor.nationalHealthIdentifier = '900 000 0002';
  d.recipient.familyName = 'Doe';
  d.recipient.givenNames = 'John';
  d.recipient.birthDate = '1972-03-04';
  d.pathway.donationPathway = 'directed';
  d.pathway.relationshipOfDonorToRecipient = 'Spouse';
  d.pathway.donorAboGroup = 'o';
  d.pathway.recipientAboGroup = 'a';
  d.tests.livingDonorFullCrossmatch = true;
  d.requester.clinicianName = 'Dr P Anand';
  d.requester.requestedBySignedAt = '2026-09-01T10:00';
  d.requester.consentAndIdentityConfirmed = true;
  d.sample.sampleCollectorName = 'Nurse A Patel';
  d.sample.sampleCollectedAt = '2026-09-01T09:30';
  d.sample.identifiersOnSampleCount = 4;
  d.sample.identifiersOnFormCount = 4;
  d.sample.sampleAndFormDetailsMatch = true;
  d.sample.samplesEdtaPurpleCount = 2;
  d.sample.samplesEdtaPinkHandLabelledCount = 1;
  return d;
}

describe('Renal living donor four-axis grader', () => {
  it('grades a complete safe directed donation as accept / routine', () => {
    const result = calculateGrade(safeDirected());
    expect(result.appropriatenessBand).toBe('usually-appropriate');
    expect(result.identitySafetyBand).toBe('ok');
    expect(result.triageTier).toBe('routine');
    expect(result.recommendation).toBe('accept');
    expect(result.completenessPercent).toBe(100);
  });

  it('rejects when fewer than three identifiers are on the sample', () => {
    const d = safeDirected();
    d.sample.identifiersOnSampleCount = 2;
    const result = calculateGrade(d);
    expect(result.identitySafetyBand).toBe('reject-risk');
    expect(result.recommendation).toBe('reject');
    expect(result.flags.map((f) => f.category)).toContain('identity-mismatch-risk');
  });

  it('marks day-of-transplant samples stat', () => {
    const d = safeDirected();
    d.tests.livingDonorFullCrossmatch = false;
    d.tests.dayOfTransplantSamples = true;
    expect(calculateGrade(d).triageTier).toBe('stat');
  });

  it('marks urgent testing urgent, and flags a missing reason', () => {
    const d = safeDirected();
    d.tests.urgentTesting = true;
    expect(calculateGrade(d).triageTier).toBe('urgent');
    expect(detectFlags(d).map((f) => f.category)).toContain('urgent-without-reason');
  });

  it('finds a crossmatch for an altruistic donor not appropriate', () => {
    const d = safeDirected();
    d.pathway.donationPathway = 'altruistic';
    const result = calculateGrade(d);
    expect(result.appropriatenessScore).toBe(2);
    expect(result.appropriatenessBand).toBe('usually-not-appropriate');
    expect(result.recommendation).toBe('query-referrer');
    expect(detectFlags(d).map((f) => f.category)).toContain('altruistic-donor-with-recipient');
  });

  it('flags an ABO-incompatible pair without titres', () => {
    const d = safeDirected();
    d.pathway.donorAboGroup = 'a';
    d.pathway.recipientAboGroup = 'o';
    expect(calculateGrade(d).appropriatenessScore).toBe(5);
    expect(detectFlags(d).map((f) => f.category)).toContain('donor-recipient-abo-incompatible');
    d.tests.aboTitresOnly = true;
    expect(detectFlags(d).map((f) => f.category)).not.toContain('donor-recipient-abo-incompatible');
  });

  it('flags a virtual crossmatch with no recipient ABO group', () => {
    const d = safeDirected();
    d.tests.livingDonorFullCrossmatch = false;
    d.tests.livingDonorVirtualCrossmatch = true;
    d.pathway.recipientAboGroup = 'unknown';
    expect(calculateGrade(d).appropriatenessBand).toBe('may-be-appropriate');
    expect(detectFlags(d).map((f) => f.category)).toContain(
      'virtual-crossmatch-without-antibody-profile'
    );
  });

  it('derives the required donor sample tubes as the largest need per tube type', () => {
    const d = safeDirected();
    d.tests.aboTitresOnly = true;
    const { need, summary } = requiredSamples(d);
    expect(need).toEqual({ edta: 30, pink: 6, abo: 6 });
    expect(summary).toBe('30 mL EDTA; 6 mL EDTA hand-labelled; 6 mL EDTA (potential ABO titres)');
  });

  it('derives the recommendation from the bands', () => {
    expect(deriveRecommendation('usually-appropriate', 'reject-risk', 100)).toBe('reject');
    expect(deriveRecommendation('usually-not-appropriate', 'ok', 100)).toBe('query-referrer');
    expect(deriveRecommendation('usually-appropriate', 'ok', 40)).toBe('query-referrer');
    expect(deriveRecommendation('usually-appropriate', 'caution', 100)).toBe('query-referrer');
    expect(deriveRecommendation('usually-appropriate', 'ok', 100)).toBe('accept');
  });
});
