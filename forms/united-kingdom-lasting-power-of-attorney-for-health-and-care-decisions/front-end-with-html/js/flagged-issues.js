// Non-statutory ambiguity and risk flag detection.

(function () {
'use strict';
window.UkLpaForm = window.UkLpaForm || {};

function detectAdditionalFlags(app) {
  const flags = [];

  if (app.donor.preferredLanguage === 'cy') {
    flags.push({
      flagId: 'F-BILINGUAL-001',
      category: 'bilingual-donor',
      priority: 'low',
      description: 'Donor preferred language is Welsh; offer the Cymraeg LP1H form path.',
      suggestedAction: 'Use the Welsh-language LP1H template.',
    });
  }

  if (
    app.donor.countryAsIso31661Alpha2 &&
    app.donor.countryAsIso31661Alpha2.toUpperCase() !== 'GB'
  ) {
    flags.push({
      flagId: 'F-FOREIGN-DOMICILE-001',
      category: 'foreign-domicile',
      priority: 'medium',
      description: 'Donor habitual residence appears to be outside the United Kingdom.',
      suggestedAction: 'Refer to a solicitor for jurisdictional advice.',
    });
  }

  app.attorneys.forEach((a, idx) => {
    if (a.isBankrupt === 'yes') {
      flags.push({
        flagId: `F-ATT-BANKRUPT-${idx + 1}`,
        category: 'attorney-bankrupt',
        priority: 'low',
        description: `Attorney #${idx + 1} is bankrupt. Bankruptcy bars P&FA LPAs, not H&W.`,
        suggestedAction: 'Inform the attorney that bankruptcy does not bar them on an H&W LPA.',
      });
    }
  });

  if (app.instructions.some((i) => i.contradictsAdrt === 'yes')) {
    flags.push({
      flagId: 'F-ADRT-CONFLICT-001',
      category: 'adrt-conflict',
      priority: 'high',
      description: 'At least one instruction contradicts a known Advance Decision to Refuse Treatment.',
      suggestedAction: 'Reconcile the LPA instructions with the donor’s ADRT before submission.',
    });
  }

  const hasComplex =
    app.instructions.some((i) => i.category === 'medical-treatment-limit') &&
    app.lstChoice === 'option-a';
  if (hasComplex) {
    flags.push({
      flagId: 'F-SOLICITOR-001',
      category: 'solicitor-recommended',
      priority: 'medium',
      description: 'LPA combines Option A LST authority with medical-treatment limits; complex interaction.',
      suggestedAction: 'Refer to a solicitor to confirm the instructions are unambiguous.',
    });
  }

  return flags;
}

window.UkLpaForm.detectAdditionalFlags = detectAdditionalFlags;
})();
