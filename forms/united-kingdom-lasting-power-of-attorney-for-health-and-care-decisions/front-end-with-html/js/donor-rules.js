// Donor rule family, ported from the SvelteKit engine.

(function () {
'use strict';
window.UkLpaForm = window.UkLpaForm || {};
const { ageYearsAt, findDonorSignature } = window.UkLpaForm;

function applyDonorRules(app) {
  const fired = [];
  const donor = app.donor;
  const donorSig = findDonorSignature(app);
  const signingDate = (donorSig && donorSig.signedAt) || donor.capacityDeclaredAt || new Date().toISOString();

  const age = donor.birthDate ? ageYearsAt(donor.birthDate, signingDate) : null;
  if (age !== null && age < 18) {
    fired.push({
      ruleId: 'R-MCA-S9-AGE',
      severity: 'fatal',
      ruleFamily: 'donor',
      sourceCitation: 'MCA 2005 s.9(2)(c)',
      description: `Donor age at signing is ${age}; must be 18 or older.`,
      suggestedCorrection: 'The donor must be at least 18 years old at the date of signing the LPA.',
    });
  }

  if (donor.capacityDeclared !== 'yes') {
    fired.push({
      ruleId: 'R-MCA-S10-CAP',
      severity: 'fatal',
      ruleFamily: 'donor',
      sourceCitation: 'MCA 2005 s.9(2)(b)',
      description: 'Donor has not declared mental capacity at signing.',
      suggestedCorrection: 'The donor must confirm they understand the LPA and have capacity at the time of signing.',
    });
  }

  if (donor.jurisdiction !== 'england' && donor.jurisdiction !== 'wales') {
    fired.push({
      ruleId: 'R-MCA-DONOR-JURISDICTION',
      severity: 'fatal',
      ruleFamily: 'donor',
      sourceCitation: 'MCA 2005 (extent — England and Wales only)',
      description: 'LP1H applies only to England and Wales; donor jurisdiction must be set.',
      suggestedCorrection: 'Select England or Wales as the donor jurisdiction.',
    });
  }

  if (!donor.givenNames || !donor.familyName) {
    fired.push({
      ruleId: 'R-MCA-DONOR-NAME',
      severity: 'high',
      ruleFamily: 'donor',
      sourceCitation: 'LP1H s.1',
      description: 'Donor given names and family name must both be populated.',
      suggestedCorrection: 'Enter the donor’s full legal name as it appears on identification.',
    });
  }
  if (!donor.postalAddressAsFullText) {
    fired.push({
      ruleId: 'R-MCA-DONOR-ADDRESS',
      severity: 'high',
      ruleFamily: 'donor',
      sourceCitation: 'LP1H s.1',
      description: 'Donor postal address is required.',
      suggestedCorrection: 'Enter the donor’s current postal address.',
    });
  }
  if (!donor.birthDate) {
    fired.push({
      ruleId: 'R-MCA-DONOR-DOB',
      severity: 'high',
      ruleFamily: 'donor',
      sourceCitation: 'LP1H s.1',
      description: 'Donor date of birth is required.',
      suggestedCorrection: 'Enter the donor’s date of birth.',
    });
  }

  return fired;
}

window.UkLpaForm.applyDonorRules = applyDonorRules;
})();
