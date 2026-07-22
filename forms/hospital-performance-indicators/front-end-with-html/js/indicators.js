// Hospital Performance Indicators — the 50-indicator Balanced Scorecard
// catalogue, transcribed verbatim from ../spec/index.md (the canonical,
// hand-maintained source). Keep this file and spec/index.md in sync: if the
// spec changes, this file (and
// front-end-with-svelte/src/lib/config/indicators.ts) must change with it.
//
// Each entry: { id, category, categoryTitle, text }
//   id            — stable dotted identifier from the catalogue ('1.1', '2.15', '4.5', ...)
//   category      — Balanced Scorecard perspective number, 1..4
//   categoryTitle — the perspective's heading text
//   text          — the indicator's full name
//
// The four perspectives are Kaplan & Norton's classic Balanced Scorecard
// applied to a hospital: Finance (9), Process (28), Learning and Growth (8),
// Customer (5).

const PERFORMANCE_INDICATORS = [
  // 1. Finance Indicators
  { id: '1.1', category: 1, categoryTitle: 'Finance Indicators', text: 'Ratio of total revenue to total costs' },
  { id: '1.2', category: 1, categoryTitle: 'Finance Indicators', text: '% Deductions of hospital' },
  { id: '1.3', category: 1, categoryTitle: 'Finance Indicators', text: 'Average hospitalization expenditures' },
  { id: '1.4', category: 1, categoryTitle: 'Finance Indicators', text: 'Average outpatient expenditures' },
  { id: '1.5', category: 1, categoryTitle: 'Finance Indicators', text: 'Average expenditures per bed per day' },
  { id: '1.6', category: 1, categoryTitle: 'Finance Indicators', text: 'Current cost per bed' },
  { id: '1.7', category: 1, categoryTitle: 'Finance Indicators', text: 'Ratio of capital expenditures to current costs' },
  { id: '1.8', category: 1, categoryTitle: 'Finance Indicators', text: 'Cost of drugs and materials, and personnel costs, as a percentage of total costs' },
  { id: '1.9', category: 1, categoryTitle: 'Finance Indicators', text: 'Total fixed cost per bed occupancy' },

  // 2. Process Indicators
  { id: '2.1', category: 2, categoryTitle: 'Process Indicators', text: 'Average length of stay' },
  { id: '2.2', category: 2, categoryTitle: 'Process Indicators', text: 'Bed turnover interval' },
  { id: '2.3', category: 2, categoryTitle: 'Process Indicators', text: 'Bed occupancy' },
  { id: '2.4', category: 2, categoryTitle: 'Process Indicators', text: 'Bed turnover' },
  { id: '2.5', category: 2, categoryTitle: 'Process Indicators', text: 'Mortality rate' },
  { id: '2.6', category: 2, categoryTitle: 'Process Indicators', text: 'Cancelled operations' },
  { id: '2.7', category: 2, categoryTitle: 'Process Indicators', text: '% Repeated surgeries' },
  { id: '2.8', category: 2, categoryTitle: 'Process Indicators', text: 'Discharge with personal satisfaction' },
  { id: '2.9', category: 2, categoryTitle: 'Process Indicators', text: 'Hospital infection rate' },
  { id: '2.10', category: 2, categoryTitle: 'Process Indicators', text: 'Clinical errors' },
  { id: '2.11', category: 2, categoryTitle: 'Process Indicators', text: 'Readmission rate' },
  { id: '2.12', category: 2, categoryTitle: 'Process Indicators', text: '% Occupational accidents' },
  { id: '2.13', category: 2, categoryTitle: 'Process Indicators', text: 'Pressure ulcers rate' },
  { id: '2.14', category: 2, categoryTitle: 'Process Indicators', text: 'Medical errors' },
  { id: '2.15', category: 2, categoryTitle: 'Process Indicators', text: 'Wrong-site surgery' },
  { id: '2.16', category: 2, categoryTitle: 'Process Indicators', text: 'Leaving a foreign object during surgery' },
  { id: '2.17', category: 2, categoryTitle: 'Process Indicators', text: 'Medication errors' },
  { id: '2.18', category: 2, categoryTitle: 'Process Indicators', text: 'Wrong blood group / type transfusion error' },
  { id: '2.19', category: 2, categoryTitle: 'Process Indicators', text: 'Patient falls rate' },
  { id: '2.20', category: 2, categoryTitle: 'Process Indicators', text: 'Hospital accidents prevalence rate' },
  { id: '2.21', category: 2, categoryTitle: 'Process Indicators', text: 'Sentinel event rate' },
  { id: '2.22', category: 2, categoryTitle: 'Process Indicators', text: 'Needlestick and sharps injury rate' },
  { id: '2.23', category: 2, categoryTitle: 'Process Indicators', text: 'Legal complaints against the hospital' },
  { id: '2.24', category: 2, categoryTitle: 'Process Indicators', text: 'Doctors on-call at night' },
  { id: '2.25', category: 2, categoryTitle: 'Process Indicators', text: 'Waiting time for admission to the operation room' },
  { id: '2.26', category: 2, categoryTitle: 'Process Indicators', text: 'Mean length of stay in the emergency department' },
  { id: '2.27', category: 2, categoryTitle: 'Process Indicators', text: 'Emergency Room (ER) waiting time' },
  { id: '2.28', category: 2, categoryTitle: 'Process Indicators', text: 'Waiting time from triage to seeing the doctor' },

  // 3. Learning and Growth Indicators
  { id: '3.1', category: 3, categoryTitle: 'Learning and Growth Indicators', text: 'Staff satisfaction rate' },
  { id: '3.2', category: 3, categoryTitle: 'Learning and Growth Indicators', text: 'Staff turnover' },
  { id: '3.3', category: 3, categoryTitle: 'Learning and Growth Indicators', text: 'Training expenditures per capita' },
  { id: '3.4', category: 3, categoryTitle: 'Learning and Growth Indicators', text: 'Key jobs with a trained substitute available' },
  { id: '3.5', category: 3, categoryTitle: 'Learning and Growth Indicators', text: 'Average hours of internet use' },
  { id: '3.6', category: 3, categoryTitle: 'Learning and Growth Indicators', text: 'Ratio of electronic medical record sick-leave days to total employees' },
  { id: '3.7', category: 3, categoryTitle: 'Learning and Growth Indicators', text: 'Employee absenteeism rate' },
  { id: '3.8', category: 3, categoryTitle: 'Learning and Growth Indicators', text: 'Rate of employee sick leave' },

  // 4. Customer Indicators
  { id: '4.1', category: 4, categoryTitle: 'Customer Indicators', text: 'Facilities for families and visitors' },
  { id: '4.2', category: 4, categoryTitle: 'Customer Indicators', text: 'Patient satisfaction percentage' },
  { id: '4.3', category: 4, categoryTitle: 'Customer Indicators', text: 'Rate of patient complaints' },
  { id: '4.4', category: 4, categoryTitle: 'Customer Indicators', text: 'Other stakeholders satisfaction' },
  { id: '4.5', category: 4, categoryTitle: 'Customer Indicators', text: 'Social satisfaction' },
];

// One { number, title } pair per category, in catalogue order — derived from
// PERFORMANCE_INDICATORS so the two can never drift apart.
const CATEGORIES = (function () {
  const seen = new Map();
  PERFORMANCE_INDICATORS.forEach(function (item) {
    if (!seen.has(item.category)) {
      seen.set(item.category, { number: item.category, title: item.categoryTitle });
    }
  });
  return Array.from(seen.values());
})();

export { PERFORMANCE_INDICATORS, CATEGORIES };
