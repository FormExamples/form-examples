/**
 * UK fit note grader — vitest coverage of the DWP policy matrix.
 */

import { describe, expect, it } from 'vitest';
import { emptyFitNote, type FitNote } from '../types.js';
import { gradeFitNote } from './grader.js';

function validBase(): FitNote {
  const fn = emptyFitNote();
  fn.clinician.name = 'Dr Jane Smith';
  fn.clinician.profession = 'doctor';
  fn.clinician.registrationBody = 'GMC';
  fn.clinician.registrationNumber = '1234567';
  fn.medicalPractice.name = 'Pondside Surgery';
  fn.medicalPractice.postalAddressAsFullText =
    '12 Pondside Lane, London SW1A 1AA';
  fn.medicalPractice.postcode = 'SW1A 1AA';
  fn.medicalPractice.setting = 'primary_care';
  fn.patient.name = 'Alex Patel';
  fn.assessmentDate = '2025-04-01';
  fn.assessmentMethod = 'in_person';
  fn.diagnosisText = 'Lower back pain';
  fn.diagnosisCategory = 'musculoskeletal';
  fn.conditionFirstRecordedDate = '2025-03-25';
  fn.fitnessForWork = 'not_fit';
  fn.periodType = 'duration';
  fn.periodDurationValue = 14;
  fn.periodDurationUnit = 'days';
  fn.issuedAt = '2025-04-01';
  fn.issuedVia = 'digital';
  fn.issueSetting = 'primary_care';
  return fn;
}

describe('validity rules', () => {
  it('fires invalid_no_name when clinician name is missing', () => {
    const fn = validBase();
    fn.clinician.name = '';
    const r = gradeFitNote(fn);
    expect(r.isValid).toBe('no');
    expect(r.safetyFlags.some((f) => f.category === 'invalid_no_name')).toBe(
      true,
    );
    expect(r.firedRules.some((rule) => rule.ruleId === 'R-VALID-NAME-001')).toBe(
      true,
    );
  });

  it('fires invalid_no_profession when profession is missing', () => {
    const fn = validBase();
    fn.clinician.profession = '';
    const r = gradeFitNote(fn);
    expect(
      r.safetyFlags.some((f) => f.category === 'invalid_no_profession'),
    ).toBe(true);
  });

  it('fires invalid_no_practice_address when practice address is missing', () => {
    const fn = validBase();
    fn.medicalPractice.postalAddressAsFullText = '';
    const r = gradeFitNote(fn);
    expect(
      r.safetyFlags.some((f) => f.category === 'invalid_no_practice_address'),
    ).toBe(true);
  });

  it('passes validity when all three required fields are present', () => {
    const r = gradeFitNote(validBase());
    expect(r.isValid).toBe('yes');
    expect(
      r.safetyFlags.some((f) => f.category === 'invalid_no_name'),
    ).toBe(false);
  });
});

describe('adaptation rules', () => {
  function withMayBeFit(): FitNote {
    const fn = validBase();
    fn.fitnessForWork = 'may_be_fit';
    fn.comments = 'Avoid heavy lifting; light desk-based duties only.';
    return fn;
  }

  it('classifies 0 adaptations as none and fires may_be_fit_no_adaptations', () => {
    const r = gradeFitNote(withMayBeFit());
    expect(r.adaptationCount).toBe(0);
    expect(r.adaptationIntensity).toBe('none');
    expect(
      r.safetyFlags.some((f) => f.category === 'may_be_fit_no_adaptations'),
    ).toBe(true);
  });

  it('classifies 1 adaptation as light', () => {
    const fn = withMayBeFit();
    fn.adaptationPhasedReturn = 'yes';
    const r = gradeFitNote(fn);
    expect(r.adaptationCount).toBe(1);
    expect(r.adaptationIntensity).toBe('light');
  });

  it('classifies 2 adaptations as moderate', () => {
    const fn = withMayBeFit();
    fn.adaptationPhasedReturn = 'yes';
    fn.adaptationAlteredHours = 'yes';
    const r = gradeFitNote(fn);
    expect(r.adaptationCount).toBe(2);
    expect(r.adaptationIntensity).toBe('moderate');
  });

  it('classifies 3 adaptations as substantial', () => {
    const fn = withMayBeFit();
    fn.adaptationPhasedReturn = 'yes';
    fn.adaptationAlteredHours = 'yes';
    fn.adaptationAmendedDuties = 'yes';
    const r = gradeFitNote(fn);
    expect(r.adaptationCount).toBe(3);
    expect(r.adaptationIntensity).toBe('substantial');
    expect(r.recommendation).toBe('refer_occupational_health');
  });

  it('classifies 4 adaptations as comprehensive', () => {
    const fn = withMayBeFit();
    fn.adaptationPhasedReturn = 'yes';
    fn.adaptationAlteredHours = 'yes';
    fn.adaptationAmendedDuties = 'yes';
    fn.adaptationWorkplaceAdaptations = 'yes';
    const r = gradeFitNote(fn);
    expect(r.adaptationCount).toBe(4);
    expect(r.adaptationIntensity).toBe('comprehensive');
    expect(r.recommendation).toBe('refer_occupational_health');
  });

  it('does not compute adaptation intensity when not_fit', () => {
    const fn = validBase();
    fn.adaptationPhasedReturn = 'yes';
    const r = gradeFitNote(fn);
    expect(r.adaptationIntensity).toBe('');
  });
});

describe('period rules', () => {
  it('classifies < 7 days as self_cert_range', () => {
    const fn = validBase();
    fn.periodDurationValue = 5;
    fn.periodDurationUnit = 'days';
    const r = gradeFitNote(fn);
    expect(r.periodCompliance).toBe('self_cert_range');
    expect(r.safetyFlags.some((f) => f.category === 'self_cert_range')).toBe(
      true,
    );
  });

  it('classifies 14 days as compliant', () => {
    const fn = validBase();
    fn.periodDurationValue = 14;
    fn.periodDurationUnit = 'days';
    const r = gradeFitNote(fn);
    expect(r.periodCompliance).toBe('compliant');
  });

  it('classifies > 4 weeks as long_term', () => {
    const fn = validBase();
    fn.periodDurationValue = 6;
    fn.periodDurationUnit = 'weeks';
    const r = gradeFitNote(fn);
    expect(r.periodCompliance).toBe('long_term');
    expect(
      r.safetyFlags.some((f) => f.category === 'long_absence_four_weeks'),
    ).toBe(true);
  });

  it('classifies > 3 months in first 6 months as exceeds_initial_max', () => {
    const fn = validBase();
    fn.conditionFirstRecordedDate = '2025-03-25';
    fn.assessmentDate = '2025-04-01';
    fn.periodDurationValue = 5;
    fn.periodDurationUnit = 'months';
    const r = gradeFitNote(fn);
    expect(r.periodCompliance).toBe('exceeds_initial_max');
    expect(
      r.safetyFlags.some(
        (f) => f.category === 'duration_exceeds_3_months_in_first_6_months',
      ),
    ).toBe(true);
  });

  it('classifies > 6 months as very_long_term', () => {
    const fn = validBase();
    fn.conditionFirstRecordedDate = '2023-01-01';
    fn.assessmentDate = '2025-04-01';
    fn.periodDurationValue = 9;
    fn.periodDurationUnit = 'months';
    const r = gradeFitNote(fn);
    expect(r.periodCompliance).toBe('very_long_term');
    expect(r.recommendation).toBe('refer_access_to_work');
  });

  it('supports from_to range calculation', () => {
    const fn = validBase();
    fn.periodType = 'from_to';
    fn.periodDurationValue = null;
    fn.periodDurationUnit = '';
    fn.periodFrom = '2025-04-01';
    fn.periodTo = '2025-04-15';
    const r = gradeFitNote(fn);
    expect(r.periodDays).toBe(14);
    expect(r.periodCompliance).toBe('compliant');
  });
});

describe('safety flags', () => {
  it('fires automatic_disability when diagnosis text contains "HIV"', () => {
    const fn = validBase();
    fn.diagnosisText = 'Patient is HIV positive, well controlled on ART.';
    const r = gradeFitNote(fn);
    expect(r.safetyFlags.some((f) => f.category === 'automatic_disability')).toBe(
      true,
    );
  });

  it('fires automatic_disability when diagnosis text mentions cancer', () => {
    const fn = validBase();
    fn.diagnosisText = 'Stage II breast carcinoma — undergoing chemotherapy.';
    const r = gradeFitNote(fn);
    expect(r.safetyFlags.some((f) => f.category === 'automatic_disability')).toBe(
      true,
    );
  });

  it('fires automatic_disability when diagnosis text mentions multiple sclerosis', () => {
    const fn = validBase();
    fn.diagnosisText = 'Relapsing-remitting multiple sclerosis.';
    const r = gradeFitNote(fn);
    expect(r.safetyFlags.some((f) => f.category === 'automatic_disability')).toBe(
      true,
    );
  });

  it('fires mental_health_condition when category is mental_health', () => {
    const fn = validBase();
    fn.diagnosisCategory = 'mental_health';
    const r = gradeFitNote(fn);
    expect(
      r.safetyFlags.some((f) => f.category === 'mental_health_condition'),
    ).toBe(true);
  });

  it('fires driving_restriction_recommended when comments mention "should not drive"', () => {
    const fn = validBase();
    fn.fitnessForWork = 'may_be_fit';
    fn.comments = 'Patient should not drive for two weeks following surgery.';
    fn.adaptationPhasedReturn = 'yes';
    const r = gradeFitNote(fn);
    expect(
      r.safetyFlags.some((f) => f.category === 'driving_restriction_recommended'),
    ).toBe(true);
  });

  it('fires new_authority_hcp for nurse / OT / pharmacist / physio', () => {
    const fn = validBase();
    fn.clinician.profession = 'physiotherapist';
    fn.clinician.registrationBody = 'HCPC';
    const r = gradeFitNote(fn);
    expect(r.safetyFlags.some((f) => f.category === 'new_authority_hcp')).toBe(
      true,
    );
  });

  it('fires safeguarding_concern when flagged', () => {
    const fn = validBase();
    fn.safeguardingConcern = 'yes';
    const r = gradeFitNote(fn);
    expect(r.safetyFlags.some((f) => f.category === 'safeguarding_concern')).toBe(
      true,
    );
  });
});

describe('recommendation precedence', () => {
  it('review_for_validity supersedes everything else when invalid', () => {
    const fn = validBase();
    fn.clinician.name = '';
    fn.diagnosisText = 'HIV positive';
    fn.periodDurationValue = 12;
    fn.periodDurationUnit = 'months';
    const r = gradeFitNote(fn);
    expect(r.recommendation).toBe('review_for_validity');
  });

  it('refer_access_to_work when automatic disability present and valid', () => {
    const fn = validBase();
    fn.diagnosisText = 'Cancer in remission';
    const r = gradeFitNote(fn);
    expect(r.recommendation).toBe('refer_access_to_work');
  });

  it('refer_occupational_health when not_fit and long_term (> 4 weeks)', () => {
    // With periodDays = 90 the period is long_term (> 28), so the
    // refer_occupational_health branch fires before the
    // refer_employment_advisor branch can be reached. This mirrors the
    // canonical grader.js policy ordering.
    const fn = validBase();
    fn.periodDurationValue = 90;
    fn.periodDurationUnit = 'days';
    fn.conditionFirstRecordedDate = '2024-01-01';
    fn.assessmentDate = '2025-04-01';
    const r = gradeFitNote(fn);
    expect(r.recommendation).toBe('refer_occupational_health');
  });

  it('standard when nothing special fires', () => {
    const r = gradeFitNote(validBase());
    expect(r.recommendation).toBe('standard');
  });
});
