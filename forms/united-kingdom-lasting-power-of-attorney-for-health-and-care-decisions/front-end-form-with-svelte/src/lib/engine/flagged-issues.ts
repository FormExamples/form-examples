import type { AdditionalFlag, LpaApplication } from './types.js';

export function detectAdditionalFlags(app: LpaApplication): AdditionalFlag[] {
  const flags: AdditionalFlag[] = [];

  if (app.donor.preferredLanguage === 'cy') {
    flags.push({
      flagId: 'F-BILINGUAL-001',
      category: 'bilingual-donor',
      priority: 'low',
      description: 'Donor preferred language is Welsh; offer the Cymraeg LP1H form path.',
      suggestedAction: 'Use the Welsh-language LP1H template (Welsh Language (Wales) Measure 2011).',
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
      suggestedAction: 'Refer to a solicitor for jurisdictional advice; LP1H applies to England and Wales only.',
    });
  }

  app.attorneys.forEach((a, idx) => {
    if (a.isBankrupt === 'yes') {
      flags.push({
        flagId: `F-ATT-BANKRUPT-${idx + 1}`,
        category: 'attorney-bankrupt',
        priority: 'low',
        description: `Attorney #${idx + 1} is bankrupt. Bankruptcy bars Property and Financial Affairs LPAs, not H&W.`,
        suggestedAction: 'Inform the attorney that bankruptcy does not bar them from acting on a Health and Welfare LPA.',
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

  const hasComplexInstructions =
    app.instructions.some((i) => i.category === 'medical-treatment-limit') &&
    app.lstChoice === 'option-a';
  if (hasComplexInstructions) {
    flags.push({
      flagId: 'F-SOLICITOR-001',
      category: 'solicitor-recommended',
      priority: 'medium',
      description: 'LPA combines Option A life-sustaining-treatment authority with medical-treatment limits; complex interaction.',
      suggestedAction: 'Refer to a solicitor to confirm the instructions are unambiguous.',
    });
  }

  return flags;
}
