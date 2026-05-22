// Sensitive-category rules: 42 CFR Part 2 (substance-use), state HIV
// consent, mental-health, psychotherapy notes, VA records.

export const sensitiveCategoryRules = [
  {
    id: 'substance-use-part-2-consent',
    citation: '42 CFR Part 2',
    domain: 'sensitive-category',
    priority: 'high',
    description: 'Substance-use records require the 42 CFR Part 2 prohibition-on-redisclosure notice.',
    test: (a) => a.recordsToDisclose.includeSubstanceUse === 'yes' && a.recordsToDisclose.part2RedisclosureNoticeIncluded !== 'yes',
  },
  {
    id: 'substance-use-initials',
    citation: '42 CFR § 2.31',
    domain: 'sensitive-category',
    priority: 'high',
    description: 'Substance-use disclosure requires patient initials.',
    test: (a) => a.recordsToDisclose.includeSubstanceUse === 'yes' && a.recordsToDisclose.substanceUseInitials === '',
  },
  {
    id: 'hiv-aids-state-consent',
    citation: 'state-specific',
    domain: 'sensitive-category',
    priority: 'high',
    description: 'HIV/AIDS disclosure requires state-specific consent language.',
    test: (a) => a.recordsToDisclose.includeHivAids === 'yes' && a.recordsToDisclose.hivAidsStateConsentIncluded !== 'yes',
  },
  {
    id: 'hiv-aids-initials',
    citation: 'state-specific',
    domain: 'sensitive-category',
    priority: 'high',
    description: 'HIV/AIDS disclosure requires patient initials.',
    test: (a) => a.recordsToDisclose.includeHivAids === 'yes' && a.recordsToDisclose.hivAidsInitials === '',
  },
  {
    id: 'mental-health-separate-initial',
    citation: 'state-specific',
    domain: 'sensitive-category',
    priority: 'medium',
    description: 'Mental-health disclosure should be separately initialled.',
    test: (a) => a.recordsToDisclose.includeMentalHealth === 'yes' && a.recordsToDisclose.mentalHealthInitials === '',
  },
  {
    id: 'psychotherapy-separate-auth',
    citation: '45 CFR § 164.508(a)(2)',
    domain: 'compound',
    priority: 'high',
    description: 'Psychotherapy notes require a separate authorization.',
    test: (a) => {
      if (a.recordsToDisclose.includePsychotherapyNotes !== 'yes') return false;
      const other = ['includeMedicalHealth', 'includeMentalHealth', 'includeSubstanceUse', 'includeHivAids', 'includeGeneticInformation'];
      return other.some((k) => a.recordsToDisclose[k] === 'yes');
    },
  },
];

export function runSensitiveCategoryRules(authorization) {
  return sensitiveCategoryRules
    .filter((r) => r.test(authorization))
    .map((r) => ({
      ruleId: r.id,
      citation: r.citation,
      domain: r.domain,
      priority: r.priority,
      description: r.description,
    }));
}
