// The 50-indicator Balanced Scorecard catalogue for the hospital
// performance indicators form, transcribed verbatim from
// ../../../../spec/index.md (the canonical source). Keep this file,
// front-end-with-html/js/indicators.js, and spec/index.md in sync: if the
// spec changes, all three must change with it. Indicator catalogue is
// data, not TypeScript fields — see AGENTS.md — this mirrors the
// hospital-dashboard-metrics convention (67 metrics, same generic-map
// pattern), because 50 indicators across 4 perspectives is well past the
// point where per-indicator TypeScript fields stay maintainable.
//
// The four perspectives are Kaplan & Norton's classic Balanced Scorecard
// applied to a hospital: Finance (9), Process (28), Learning and Growth
// (8), Customer (5).

export interface IndicatorDef {
  /** Stable dotted identifier from spec/index.md, e.g. '1.1', '2.15', '4.5'. */
  id: string;
  /** Balanced Scorecard perspective number, 1-4. */
  category: number;
  /** Perspective heading text. */
  categoryTitle: string;
  /** Full indicator name. */
  text: string;
}

export const PERFORMANCE_INDICATORS: IndicatorDef[] = [
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

export const TOTAL_INDICATORS = PERFORMANCE_INDICATORS.length; // 50

/** The 4 perspectives, in catalogue order, derived from PERFORMANCE_INDICATORS. */
export const CATEGORIES: { number: number; title: string }[] = (() => {
  const seen = new Map<number, string>();
  for (const indicator of PERFORMANCE_INDICATORS) {
    if (!seen.has(indicator.category)) seen.set(indicator.category, indicator.categoryTitle);
  }
  return Array.from(seen.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([number, title]) => ({ number, title }));
})();

export const TOTAL_CATEGORIES = CATEGORIES.length; // 4

export function indicatorsForCategory(category: number): IndicatorDef[] {
  return PERFORMANCE_INDICATORS.filter((i) => i.category === category);
}

export function indicatorById(id: string): IndicatorDef | undefined {
  return PERFORMANCE_INDICATORS.find((i) => i.id === id);
}

export function categoryTitleFor(category: number): string {
  return CATEGORIES.find((c) => c.number === category)?.title ?? '';
}
