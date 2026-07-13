import { describe, it, expect } from 'vitest';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte.js';
import { calculateVaccinationStatus } from './vaccination-grader.js';
import {
  calculateCompositeScore,
  dimensionScore02,
  consentScore,
  completenessCategory
} from './utils.js';
import type { AssessmentData } from './types.js';

/** Set every childhood vaccine field to the same 0-2 completeness value. */
function childhoodAll(value: number): AssessmentData {
  const data = createDefaultAssessment();
  data.childhoodVaccinations.dtapIpvHibHepb = value;
  data.childhoodVaccinations.pneumococcal = value;
  data.childhoodVaccinations.rotavirus = value;
  data.childhoodVaccinations.meningitisB = value;
  data.childhoodVaccinations.mmr = value;
  data.childhoodVaccinations.hibMenc = value;
  data.childhoodVaccinations.preschoolBooster = value;
  return data;
}

describe('dimensionScore02', () => {
  it('maps a 0-2 completeness scale onto 0-100', () => {
    expect(dimensionScore02([2, 2, 2])).toBe(100);
    expect(dimensionScore02([1, 1])).toBe(50);
    expect(dimensionScore02([0, 0])).toBe(0);
  });
  it('returns null when nothing is answered', () => {
    expect(dimensionScore02([null, null])).toBeNull();
  });
});

describe('consentScore', () => {
  it('maps the 1-5 Likert scale onto 0-100', () => {
    const data = createDefaultAssessment();
    data.consentInformation.informationProvided = 5;
    data.consentInformation.risksExplained = 5;
    data.consentInformation.benefitsExplained = 5;
    data.consentInformation.questionsAnswered = 5;
    expect(consentScore(data)).toBe(100);
    data.consentInformation.informationProvided = 1;
    data.consentInformation.risksExplained = 1;
    data.consentInformation.benefitsExplained = 1;
    data.consentInformation.questionsAnswered = 1;
    expect(consentScore(data)).toBe(0);
  });
});

describe('calculateCompositeScore', () => {
  it('is 100 when all recorded vaccines are complete', () => {
    expect(calculateCompositeScore(childhoodAll(2))).toBe(100);
  });
  it('is 0 when all recorded vaccines are not given', () => {
    expect(calculateCompositeScore(childhoodAll(0))).toBe(0);
  });
  it('returns null when no vaccine or consent items are answered', () => {
    expect(calculateCompositeScore(createDefaultAssessment())).toBeNull();
  });
});

describe('completenessCategory', () => {
  it('bands a score into complete/partial/overdue', () => {
    expect(completenessCategory(95)).toBe('complete');
    expect(completenessCategory(60)).toBe('partial');
    expect(completenessCategory(30)).toBe('overdue');
  });
});

describe('calculateVaccinationStatus', () => {
  it('returns draft when fewer than 5 items are answered', () => {
    const r = calculateVaccinationStatus(createDefaultAssessment());
    expect(r.level).toBe('draft');
    expect(r.score).toBe(0);
    expect(r.firedRules).toEqual([]);
  });

  it('grades a fully complete childhood record as upToDate', () => {
    const r = calculateVaccinationStatus(childhoodAll(2));
    expect(r.score).toBe(100);
    expect(r.level).toBe('upToDate');
    // VAX-016: all recorded childhood vaccinations complete
    expect(r.firedRules.some((f) => f.id === 'VAX-016')).toBe(true);
  });

  it('grades an all-partial childhood record as partiallyComplete', () => {
    const r = calculateVaccinationStatus(childhoodAll(1));
    expect(r.score).toBe(50);
    expect(r.level).toBe('partiallyComplete');
  });

  it('grades an all-missing childhood record as overdue with a high-concern rule', () => {
    const r = calculateVaccinationStatus(childhoodAll(0));
    expect(r.score).toBe(0);
    expect(r.level).toBe('overdue');
    // VAX-001: MMR not given (measles risk) is high concern
    expect(r.firedRules.some((f) => f.id === 'VAX-001')).toBe(true);
    expect(r.firedRules.some((f) => f.concernLevel === 'high')).toBe(true);
  });

  it('flags previous anaphylaxis as contraindicated', () => {
    const data = childhoodAll(2);
    data.contraindicationsAllergies.previousAnaphylaxis = 'yes';
    const r = calculateVaccinationStatus(data);
    expect(r.level).toBe('contraindicated');
    // VAX-003: previous anaphylaxis to vaccine
    expect(r.firedRules.some((f) => f.id === 'VAX-003')).toBe(true);
  });

  it('scores a complete record above a partial one above an overdue one', () => {
    const complete = calculateVaccinationStatus(childhoodAll(2)).score;
    const partial = calculateVaccinationStatus(childhoodAll(1)).score;
    const overdue = calculateVaccinationStatus(childhoodAll(0)).score;
    expect(complete).toBeGreaterThan(partial);
    expect(partial).toBeGreaterThan(overdue);
  });
});
