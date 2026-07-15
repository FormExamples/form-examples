// Sample team / department aggregates for the Employee Satisfaction Survey
// HR / management dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every satisfaction category (Excellent /
// Good / Satisfactory / Poor / Very Poor), every worst-domain category,
// and a mix of tenure bands and response counts (8-50 employees per
// aggregate). Composite scores are coherent with their banded category,
// and the worst-domain mean is always the smallest entry in domainMeans.
// eNPS values track the satisfaction band: high promoters in the
// Excellent rows, deeply negative scores in the Very Poor rows.
//
// All entries are anonymous, group-level aggregates only — there are no
// individual employee identifiers anywhere in this dataset.

/** @type {import('./types.js').TeamRow[]} */
const sampleTeams = [
  {
    id: '1',
    department: 'Customer Support',
    responsesCount: 38,
    tenureBand: 'Mixed',
    composite: 18,
    category: 'Very Poor',
    domainMeans: {
      workload:          1.6,
      management:        2.1,
      growth:            2.0,
      compensation:      2.3,
      culture:           2.4,
      environment:       2.5,
      recognition:       1.9,
      overallExperience: 1.8
    },
    worstDomain: 'Workload',
    enps: -62
  },
  {
    id: '2',
    department: 'Field Sales',
    responsesCount: 22,
    tenureBand: '1-3 years',
    composite: 22,
    category: 'Very Poor',
    domainMeans: {
      workload:          2.2,
      management:        1.7,
      growth:            2.1,
      compensation:      2.6,
      culture:           2.3,
      environment:       2.5,
      recognition:       2.0,
      overallExperience: 1.9
    },
    worstDomain: 'Management',
    enps: -48
  },
  {
    id: '3',
    department: 'Warehouse Operations',
    responsesCount: 47,
    tenureBand: '5-10 years',
    composite: 34,
    category: 'Poor',
    domainMeans: {
      workload:          2.4,
      management:        2.7,
      growth:            2.2,
      compensation:      2.5,
      culture:           2.9,
      environment:       2.0,
      recognition:       2.6,
      overallExperience: 2.5
    },
    worstDomain: 'Environment',
    enps: -34
  },
  {
    id: '4',
    department: 'Manufacturing',
    responsesCount: 50,
    tenureBand: '10+ years',
    composite: 41,
    category: 'Poor',
    domainMeans: {
      workload:          2.6,
      management:        2.8,
      growth:            2.4,
      compensation:      2.3,
      culture:           2.9,
      environment:       2.7,
      recognition:       2.5,
      overallExperience: 2.6
    },
    worstDomain: 'Compensation',
    enps: -22
  },
  {
    id: '5',
    department: 'Retail Operations',
    responsesCount: 31,
    tenureBand: 'Mixed',
    composite: 47,
    category: 'Poor',
    domainMeans: {
      workload:          2.7,
      management:        2.9,
      growth:            2.3,
      compensation:      2.8,
      culture:           3.0,
      environment:       2.9,
      recognition:       2.6,
      overallExperience: 2.8
    },
    worstDomain: 'Growth',
    enps: -18
  },
  {
    id: '6',
    department: 'Marketing',
    responsesCount: 14,
    tenureBand: '1-3 years',
    composite: 56,
    category: 'Satisfactory',
    domainMeans: {
      workload:          2.9,
      management:        3.2,
      growth:            3.0,
      compensation:      3.3,
      culture:           3.4,
      environment:       3.5,
      recognition:       2.8,
      overallExperience: 3.1
    },
    worstDomain: 'Recognition',
    enps: 4
  },
  {
    id: '7',
    department: 'Customer Success',
    responsesCount: 19,
    tenureBand: '3-5 years',
    composite: 63,
    category: 'Satisfactory',
    domainMeans: {
      workload:          3.0,
      management:        3.4,
      growth:            3.3,
      compensation:      3.1,
      culture:           3.5,
      environment:       3.6,
      recognition:       3.4,
      overallExperience: 3.5
    },
    worstDomain: 'Workload',
    enps: 12
  },
  {
    id: '8',
    department: 'Product Management',
    responsesCount: 12,
    tenureBand: '3-5 years',
    composite: 68,
    category: 'Satisfactory',
    domainMeans: {
      workload:          3.2,
      management:        3.6,
      growth:            3.7,
      compensation:      3.5,
      culture:           3.8,
      environment:       3.7,
      recognition:       3.4,
      overallExperience: 3.6
    },
    worstDomain: 'Workload',
    enps: 18
  },
  {
    id: '9',
    department: 'Engineering',
    responsesCount: 36,
    tenureBand: '3-5 years',
    composite: 74,
    category: 'Good',
    domainMeans: {
      workload:          3.5,
      management:        3.9,
      growth:            4.1,
      compensation:      3.8,
      culture:           4.0,
      environment:       4.0,
      recognition:       3.6,
      overallExperience: 3.9
    },
    worstDomain: 'Workload',
    enps: 32
  },
  {
    id: '10',
    department: 'Design',
    responsesCount: 9,
    tenureBand: '<1 year',
    composite: 79,
    category: 'Good',
    domainMeans: {
      workload:          3.7,
      management:        4.0,
      growth:            4.2,
      compensation:      3.6,
      culture:           4.3,
      environment:       4.1,
      recognition:       3.9,
      overallExperience: 4.1
    },
    worstDomain: 'Compensation',
    enps: 41
  },
  {
    id: '11',
    department: 'Finance',
    responsesCount: 11,
    tenureBand: '5-10 years',
    composite: 87,
    category: 'Excellent',
    domainMeans: {
      workload:          4.1,
      management:        4.4,
      growth:            4.0,
      compensation:      4.3,
      culture:           4.5,
      environment:       4.4,
      recognition:       4.2,
      overallExperience: 4.4
    },
    worstDomain: 'Growth',
    enps: 58
  },
  {
    id: '12',
    department: 'People & Culture',
    responsesCount: 8,
    tenureBand: '1-3 years',
    composite: 92,
    category: 'Excellent',
    domainMeans: {
      workload:          4.3,
      management:        4.7,
      growth:            4.5,
      compensation:      4.2,
      culture:           4.8,
      environment:       4.6,
      recognition:       4.6,
      overallExperience: 4.7
    },
    worstDomain: 'Compensation',
    enps: 71
  }
];

export { sampleTeams };
