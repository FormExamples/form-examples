export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
}

// 16 steps: reporting period (1), one per category (2-15, 14 categories),
// summary & sign-off (16). Category numbers in the title refer to the
// spec/index.md catalogue numbering (1-14).
export const STEPS: StepDef[] = [
  { number: 1, slug: 'reporting-period', title: 'Reporting period', short: 'Period' },
  { number: 2, slug: 'antibiotics-narcotics-culture', title: 'Category 1 — Antibiotics, Narcotics & Culture Monitoring (3 metrics)', short: 'Antibiotics' },
  { number: 3, slug: 'inpatient-ward', title: 'Category 2 — Inpatient / Ward Metrics (11 metrics)', short: 'Inpatient / Ward' },
  { number: 4, slug: 'emergency-department', title: 'Category 3 — Emergency Department Metrics (8 metrics)', short: 'Emergency Dept.' },
  { number: 5, slug: 'infection-control', title: 'Category 4 — Infection Control Metrics (5 metrics)', short: 'Infection Control' },
  { number: 6, slug: 'blood-bank', title: 'Category 5 — Blood Bank Metrics (3 metrics)', short: 'Blood Bank' },
  { number: 7, slug: 'opd', title: 'Category 6 — Outpatient Department (OPD) Metrics (9 metrics)', short: 'OPD' },
  { number: 8, slug: 'surgery-operating-room', title: 'Category 7 — Surgery / Operating Room Metrics (6 metrics)', short: 'Surgery / OR' },
  { number: 9, slug: 'pharmacy', title: 'Category 8 — Pharmacy Metrics (5 metrics)', short: 'Pharmacy' },
  { number: 10, slug: 'radiology', title: 'Category 9 — Radiology Metrics (1 metric)', short: 'Radiology' },
  { number: 11, slug: 'patient-flow-waiting-times', title: 'Category 10 — Patient Flow / Waiting Times (2 metrics)', short: 'Patient Flow' },
  { number: 12, slug: 'human-resources', title: 'Category 11 — Human Resources Metrics (3 metrics)', short: 'HR' },
  { number: 13, slug: 'patient-experience', title: 'Category 12 — Patient Experience Metrics (2 metrics)', short: 'Patient Experience' },
  { number: 14, slug: 'ovr', title: 'Category 13 — Occurrence Variance Report (OVR) Metrics (3 metrics)', short: 'OVR' },
  { number: 15, slug: 'facilities-biomedical', title: 'Category 14 — Facilities & Biomedical Engineering Metrics (6 metrics)', short: 'Facilities' },
  { number: 16, slug: 'summary', title: 'Summary & sign-off', short: 'Summary' },
];

export const TOTAL_STEPS = STEPS.length; // 16
