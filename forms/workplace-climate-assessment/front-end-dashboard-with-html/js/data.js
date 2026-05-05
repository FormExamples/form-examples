// Sample team / department aggregates for the Workplace Climate
// Assessment leadership dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every climate category (Thriving / Healthy
// / Developing / Strained / Critical), every worst-domain category, and a
// mix of tenure bands and response counts (8-50 employees per aggregate).
// Composite scores are coherent with their banded category, and the
// worst-domain mean is always the smallest entry in domainMeans.
//
// All entries are anonymous, group-level aggregates only — there are no
// individual employee identifiers anywhere in this dataset.

(function () {
'use strict';
window.WorkplaceClimateAssessmentDashboard =
  window.WorkplaceClimateAssessmentDashboard || {};

/** @type {import('./types.js').TeamRow[]} */
const sampleTeams = [
  {
    id: '1',
    department: 'Customer Support',
    responsesCount: 42,
    tenureBand: 'Mixed',
    composite: 14,
    category: 'Critical',
    domainMeans: {
      leadership:          1.5,
      psychologicalSafety: 1.7,
      inclusion:           2.0,
      communication:       1.8,
      collaboration:       2.2,
      recognition:         1.6,
      wellbeing:           1.7,
      careerDevelopment:   1.9,
      overallClimate:      1.6
    },
    worstDomain: 'Leadership'
  },
  {
    id: '2',
    department: 'Field Sales',
    responsesCount: 24,
    tenureBand: '1-3 years',
    composite: 21,
    category: 'Critical',
    domainMeans: {
      leadership:          2.0,
      psychologicalSafety: 1.6,
      inclusion:           2.1,
      communication:       2.2,
      collaboration:       2.3,
      recognition:         1.9,
      wellbeing:           2.0,
      careerDevelopment:   2.1,
      overallClimate:      1.9
    },
    worstDomain: 'Psychological Safety'
  },
  {
    id: '3',
    department: 'Warehouse Operations',
    responsesCount: 50,
    tenureBand: '5-10 years',
    composite: 32,
    category: 'Strained',
    domainMeans: {
      leadership:          2.6,
      psychologicalSafety: 2.4,
      inclusion:           2.0,
      communication:       2.5,
      collaboration:       2.7,
      recognition:         2.3,
      wellbeing:           2.5,
      careerDevelopment:   2.4,
      overallClimate:      2.5
    },
    worstDomain: 'Inclusion'
  },
  {
    id: '4',
    department: 'Manufacturing',
    responsesCount: 47,
    tenureBand: '10+ years',
    composite: 39,
    category: 'Strained',
    domainMeans: {
      leadership:          2.7,
      psychologicalSafety: 2.6,
      inclusion:           2.5,
      communication:       2.0,
      collaboration:       2.8,
      recognition:         2.4,
      wellbeing:           2.6,
      careerDevelopment:   2.5,
      overallClimate:      2.5
    },
    worstDomain: 'Communication'
  },
  {
    id: '5',
    department: 'Retail Operations',
    responsesCount: 33,
    tenureBand: 'Mixed',
    composite: 46,
    category: 'Strained',
    domainMeans: {
      leadership:          2.8,
      psychologicalSafety: 2.9,
      inclusion:           2.7,
      communication:       2.8,
      collaboration:       2.3,
      recognition:         2.6,
      wellbeing:           2.7,
      careerDevelopment:   2.5,
      overallClimate:      2.6
    },
    worstDomain: 'Collaboration'
  },
  {
    id: '6',
    department: 'Marketing',
    responsesCount: 16,
    tenureBand: '1-3 years',
    composite: 55,
    category: 'Developing',
    domainMeans: {
      leadership:          3.2,
      psychologicalSafety: 3.0,
      inclusion:           3.1,
      communication:       3.3,
      collaboration:       3.2,
      recognition:         2.6,
      wellbeing:           3.0,
      careerDevelopment:   3.1,
      overallClimate:      3.0
    },
    worstDomain: 'Recognition'
  },
  {
    id: '7',
    department: 'Customer Success',
    responsesCount: 21,
    tenureBand: '3-5 years',
    composite: 62,
    category: 'Developing',
    domainMeans: {
      leadership:          3.4,
      psychologicalSafety: 3.5,
      inclusion:           3.6,
      communication:       3.4,
      collaboration:       3.5,
      recognition:         3.3,
      wellbeing:           2.9,
      careerDevelopment:   3.2,
      overallClimate:      3.3
    },
    worstDomain: 'Wellbeing'
  },
  {
    id: '8',
    department: 'Product Management',
    responsesCount: 13,
    tenureBand: '3-5 years',
    composite: 67,
    category: 'Developing',
    domainMeans: {
      leadership:          3.7,
      psychologicalSafety: 3.6,
      inclusion:           3.8,
      communication:       3.5,
      collaboration:       3.6,
      recognition:         3.4,
      wellbeing:           3.5,
      careerDevelopment:   3.0,
      overallClimate:      3.5
    },
    worstDomain: 'Career Development'
  },
  {
    id: '9',
    department: 'Engineering',
    responsesCount: 38,
    tenureBand: '3-5 years',
    composite: 73,
    category: 'Healthy',
    domainMeans: {
      leadership:          4.0,
      psychologicalSafety: 4.1,
      inclusion:           3.9,
      communication:       3.8,
      collaboration:       4.2,
      recognition:         3.6,
      wellbeing:           3.8,
      careerDevelopment:   3.9,
      overallClimate:      3.5
    },
    worstDomain: 'Overall Climate'
  },
  {
    id: '10',
    department: 'Design',
    responsesCount: 9,
    tenureBand: '<1 year',
    composite: 80,
    category: 'Healthy',
    domainMeans: {
      leadership:          4.2,
      psychologicalSafety: 4.3,
      inclusion:           4.4,
      communication:       4.1,
      collaboration:       4.3,
      recognition:         3.7,
      wellbeing:           4.0,
      careerDevelopment:   4.1,
      overallClimate:      4.2
    },
    worstDomain: 'Recognition'
  },
  {
    id: '11',
    department: 'Finance',
    responsesCount: 11,
    tenureBand: '5-10 years',
    composite: 86,
    category: 'Thriving',
    domainMeans: {
      leadership:          4.4,
      psychologicalSafety: 4.5,
      inclusion:           4.3,
      communication:       4.4,
      collaboration:       4.5,
      recognition:         4.2,
      wellbeing:           4.3,
      careerDevelopment:   4.0,
      overallClimate:      4.4
    },
    worstDomain: 'Career Development'
  },
  {
    id: '12',
    department: 'People & Culture',
    responsesCount: 8,
    tenureBand: '1-3 years',
    composite: 92,
    category: 'Thriving',
    domainMeans: {
      leadership:          4.7,
      psychologicalSafety: 4.8,
      inclusion:           4.9,
      communication:       4.6,
      collaboration:       4.7,
      recognition:         4.5,
      wellbeing:           4.6,
      careerDevelopment:   4.6,
      overallClimate:      4.4
    },
    worstDomain: 'Overall Climate'
  }
];

window.WorkplaceClimateAssessmentDashboard.sampleTeams = sampleTeams;
})();
