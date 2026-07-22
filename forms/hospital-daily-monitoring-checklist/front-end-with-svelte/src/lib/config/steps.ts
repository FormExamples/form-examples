export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
}

// 24 steps: inspection details (1), one per area (2-23, 22 areas), summary
// & sign-off (24). Section numbers in the title refer to the spec/index.md
// catalogue numbering (1-22).
export const STEPS: StepDef[] = [
  { number: 1, slug: 'inspection-details', title: 'Inspection details', short: 'Details' },
  { number: 2, slug: 'opd', title: 'Section 1 — OPD (11 checkpoints)', short: 'OPD' },
  { number: 3, slug: 'causality', title: 'Section 2 — Causality (4 checkpoints)', short: 'Causality' },
  { number: 4, slug: 'dispensary', title: 'Section 3 — Dispensary (3 checkpoints)', short: 'Dispensary' },
  { number: 5, slug: 'hr-attendance', title: 'Section 4 — H.R. status check attendance (2 checkpoints)', short: 'H.R.' },
  { number: 6, slug: 'ambulance', title: 'Section 5 — Ambulance (3 checkpoints)', short: 'Ambulance' },
  { number: 7, slug: 'diagnostic-facility', title: 'Section 6 — Diagnostic Facility (11 checkpoints)', short: 'Diagnostics' },
  { number: 8, slug: 'store', title: 'Section 7 — Store (4 checkpoints)', short: 'Store' },
  { number: 9, slug: 'ot-icu', title: 'Section 8 — O.T. / ICU (5 checkpoints)', short: 'OT / ICU' },
  { number: 10, slug: 'labour-room', title: 'Section 9 — Labour Room (4 checkpoints)', short: 'Labour Room' },
  { number: 11, slug: 'wards', title: 'Section 10 — Wards (5 checkpoints)', short: 'Wards' },
  { number: 12, slug: 'house-keeping', title: 'Section 11 — House Keeping (8 checkpoints)', short: 'House Keeping' },
  { number: 13, slug: 'water-supply', title: 'Section 12 — Water Supply (6 checkpoints)', short: 'Water Supply' },
  { number: 14, slug: 'electric-supply', title: 'Section 13 — Electric Supply (3 checkpoints)', short: 'Electric Supply' },
  { number: 15, slug: 'diet', title: 'Section 14 — Diet (6 checkpoints)', short: 'Diet' },
  { number: 16, slug: 'hospital-signage', title: 'Section 15 — Hospital Signage (1 checkpoint)', short: 'Signage' },
  { number: 17, slug: 'fire-fighting-equipment', title: 'Section 16 — Fire Fighting Equipment (1 checkpoint)', short: 'Fire Fighting' },
  { number: 18, slug: 'patient-feedback', title: 'Section 17 — Patient Feedback (1 checkpoint)', short: 'Feedback' },
  { number: 19, slug: 'mortuary', title: 'Section 18 — Mortuary (1 checkpoint)', short: 'Mortuary' },
  { number: 20, slug: 'hospital-furniture', title: 'Section 19 — Hospital Furniture (1 checkpoint)', short: 'Furniture' },
  { number: 21, slug: 'waste-management', title: 'Section 20 — Hospital Waste Management (10 checkpoints)', short: 'Waste Mgmt' },
  { number: 22, slug: 'infection-control', title: 'Section 21 — Observance & Practice of Infection Control Protocols (5 checkpoints)', short: 'Infection Control' },
  { number: 23, slug: 'record-room', title: 'Section 22 — Record Room (2 checkpoints)', short: 'Record Room' },
  { number: 24, slug: 'summary', title: 'Summary & sign-off', short: 'Summary' },
];

export const TOTAL_STEPS = STEPS.length; // 24
