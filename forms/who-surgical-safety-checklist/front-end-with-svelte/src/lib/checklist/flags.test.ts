import { describe, expect, it } from 'vitest';
import { createEmptyChecklist } from './factory.js';
import { computeSafetyFlags } from './flags.js';

describe('computeSafetyFlags', () => {
  it('returns no flags for a brand-new (untouched) checklist', () => {
    const c = createEmptyChecklist();
    expect(computeSafetyFlags(c)).toEqual([]);
  });

  it('flags identity-not-confirmed once Sign In is started but item 1 is unanswered', () => {
    const c = createEmptyChecklist();
    c.signInSiteMarked = 'yes';
    const flags = computeSafetyFlags(c);
    expect(flags.map((f) => f.flag)).toContain('identity-not-confirmed');
  });

  it('does not flag identity-not-confirmed once item 1 is yes', () => {
    const c = createEmptyChecklist();
    c.signInIdentitySiteProcedureConsent = 'yes';
    expect(computeSafetyFlags(c).map((f) => f.flag)).not.toContain(
      'identity-not-confirmed',
    );
  });

  it('flags site-not-marked when laterality is left and site marking is blank during Sign In', () => {
    const c = createEmptyChecklist();
    c.laterality = 'left';
    c.signInIdentitySiteProcedureConsent = 'yes';
    expect(computeSafetyFlags(c).map((f) => f.flag)).toContain(
      'site-not-marked',
    );
  });

  it('does not flag site-not-marked when laterality is midline', () => {
    const c = createEmptyChecklist();
    c.laterality = 'midline';
    c.signInIdentitySiteProcedureConsent = 'yes';
    expect(computeSafetyFlags(c).map((f) => f.flag)).not.toContain(
      'site-not-marked',
    );
  });

  it('does not flag site-not-marked when site_marked = not-applicable', () => {
    const c = createEmptyChecklist();
    c.laterality = 'left';
    c.signInIdentitySiteProcedureConsent = 'yes';
    c.signInSiteMarked = 'not-applicable';
    expect(computeSafetyFlags(c).map((f) => f.flag)).not.toContain(
      'site-not-marked',
    );
  });

  it('flags anaesthesia-check-incomplete when Sign In started but item 3 not yes', () => {
    const c = createEmptyChecklist();
    c.signInIdentitySiteProcedureConsent = 'yes';
    expect(computeSafetyFlags(c).map((f) => f.flag)).toContain(
      'anaesthesia-check-incomplete',
    );
  });

  it('clears anaesthesia-check-incomplete when item 3 is yes', () => {
    const c = createEmptyChecklist();
    c.signInIdentitySiteProcedureConsent = 'yes';
    c.signInAnaesthesiaCheckComplete = 'yes';
    expect(computeSafetyFlags(c).map((f) => f.flag)).not.toContain(
      'anaesthesia-check-incomplete',
    );
  });

  it('flags pulse-oximeter-not-functioning when Sign In started but item 4 not yes', () => {
    const c = createEmptyChecklist();
    c.signInIdentitySiteProcedureConsent = 'yes';
    expect(computeSafetyFlags(c).map((f) => f.flag)).toContain(
      'pulse-oximeter-not-functioning',
    );
  });

  it('flags known-allergy-flagged with detail when signInKnownAllergy = yes', () => {
    const c = createEmptyChecklist();
    c.signInKnownAllergy = 'yes';
    c.signInKnownAllergyDetail = 'Penicillin — anaphylaxis';
    const flag = computeSafetyFlags(c).find(
      (f) => f.flag === 'known-allergy-flagged',
    );
    expect(flag).toBeDefined();
    expect(flag?.priority).toBe('high');
    expect(flag?.message).toContain('Penicillin');
  });

  it('flags difficult-airway-risk when difficult-airway answer is yes-equipment-available', () => {
    const c = createEmptyChecklist();
    c.signInDifficultAirwayAspirationRisk = 'yes-equipment-available';
    expect(computeSafetyFlags(c).map((f) => f.flag)).toContain(
      'difficult-airway-risk',
    );
  });

  it('flags high-blood-loss-risk when blood-loss answer is yes-two-ivs-and-fluids-planned', () => {
    const c = createEmptyChecklist();
    c.signInBloodLossRisk = 'yes-two-ivs-and-fluids-planned';
    expect(computeSafetyFlags(c).map((f) => f.flag)).toContain(
      'high-blood-loss-risk',
    );
  });

  it('flags antibiotic-prophylaxis-missed when Time Out started but item 3 not answered or NA', () => {
    const c = createEmptyChecklist();
    c.timeOutTeamIntroductionsConfirmed = 'yes';
    expect(computeSafetyFlags(c).map((f) => f.flag)).toContain(
      'antibiotic-prophylaxis-missed',
    );
  });

  it('does not flag antibiotic-prophylaxis-missed when set to not-applicable', () => {
    const c = createEmptyChecklist();
    c.timeOutTeamIntroductionsConfirmed = 'yes';
    c.timeOutAntibioticProphylaxisWithin60Min = 'not-applicable';
    expect(computeSafetyFlags(c).map((f) => f.flag)).not.toContain(
      'antibiotic-prophylaxis-missed',
    );
  });

  it('flags sterility-not-confirmed when Time Out started but item 8 not yes', () => {
    const c = createEmptyChecklist();
    c.timeOutTeamIntroductionsConfirmed = 'yes';
    expect(computeSafetyFlags(c).map((f) => f.flag)).toContain(
      'sterility-not-confirmed',
    );
  });

  it('flags imaging-missing when Time Out started but item 10 not answered or NA', () => {
    const c = createEmptyChecklist();
    c.timeOutTeamIntroductionsConfirmed = 'yes';
    const flag = computeSafetyFlags(c).find((f) => f.flag === 'imaging-missing');
    expect(flag).toBeDefined();
    expect(flag?.priority).toBe('medium');
  });

  it('does not flag imaging-missing when essential imaging is yes', () => {
    const c = createEmptyChecklist();
    c.timeOutTeamIntroductionsConfirmed = 'yes';
    c.timeOutEssentialImagingDisplayed = 'yes';
    expect(computeSafetyFlags(c).map((f) => f.flag)).not.toContain(
      'imaging-missing',
    );
  });

  it('flags count-discrepancy when counts confirmed is no', () => {
    const c = createEmptyChecklist();
    c.signOutCountsConfirmed = 'no';
    expect(computeSafetyFlags(c).map((f) => f.flag)).toContain(
      'count-discrepancy',
    );
  });

  it('flags specimen-labelling-missed when specimens labelled is no', () => {
    const c = createEmptyChecklist();
    c.signOutSpecimensLabelled = 'no';
    expect(computeSafetyFlags(c).map((f) => f.flag)).toContain(
      'specimen-labelling-missed',
    );
  });

  it('does not flag specimen-labelling-missed when specimens labelled is not-applicable', () => {
    const c = createEmptyChecklist();
    c.signOutSpecimensLabelled = 'not-applicable';
    expect(computeSafetyFlags(c).map((f) => f.flag)).not.toContain(
      'specimen-labelling-missed',
    );
  });

  it('flags equipment-problem when free-text content is present', () => {
    const c = createEmptyChecklist();
    c.signOutEquipmentProblems = 'Diathermy pad failed mid-case';
    const flag = computeSafetyFlags(c).find((f) => f.flag === 'equipment-problem');
    expect(flag).toBeDefined();
    expect(flag?.priority).toBe('medium');
    expect(flag?.message).toContain('Diathermy pad');
  });

  it('does not flag equipment-problem for whitespace-only content', () => {
    const c = createEmptyChecklist();
    c.signOutEquipmentProblems = '   ';
    expect(computeSafetyFlags(c).map((f) => f.flag)).not.toContain(
      'equipment-problem',
    );
  });

  it('accumulates multiple flags simultaneously', () => {
    const c = createEmptyChecklist();
    c.signInKnownAllergy = 'yes';
    c.signInKnownAllergyDetail = 'Latex';
    c.signInBloodLossRisk = 'yes-two-ivs-and-fluids-planned';
    c.signOutCountsConfirmed = 'no';
    const codes = computeSafetyFlags(c).map((f) => f.flag);
    expect(codes).toContain('known-allergy-flagged');
    expect(codes).toContain('high-blood-loss-risk');
    expect(codes).toContain('count-discrepancy');
  });

  it('every flag returned has a non-empty message', () => {
    const c = createEmptyChecklist();
    c.signInKnownAllergy = 'yes';
    c.signInBloodLossRisk = 'yes-two-ivs-and-fluids-planned';
    c.signOutCountsConfirmed = 'no';
    for (const f of computeSafetyFlags(c)) {
      expect(f.message.length).toBeGreaterThan(0);
    }
  });
});
