// Hospital Dashboard Metrics — the 67-metric catalogue, transcribed
// verbatim from ../spec/index.md (the canonical, hand-maintained source).
// Keep this file and spec/index.md in sync: if the spec changes, this file
// (and front-end-with-svelte/src/lib/config/metrics.ts) must change with it.
//
// Each entry: { id, category, categoryTitle, text }
//   id            — stable dotted identifier from the catalogue ('1.1', '4.3', '14.6', ...)
//   category      — category number, 1..14
//   categoryTitle — the category's heading text
//   text          — the metric's full name
//
// Note: the 14 category titles are editorially inferred (the source
// proforma only separated groups with `---` dividers, without naming
// most of them) — see ../spec/index.md "Category titles are editorially
// inferred".

const DASHBOARD_METRICS = [
  // 1. Antibiotics, Narcotics & Culture Monitoring
  { id: '1.1', category: 1, categoryTitle: 'Antibiotics, Narcotics & Culture Monitoring', text: 'Antibiotics Issuing' },
  { id: '1.2', category: 1, categoryTitle: 'Antibiotics, Narcotics & Culture Monitoring', text: 'Culture Results' },
  { id: '1.3', category: 1, categoryTitle: 'Antibiotics, Narcotics & Culture Monitoring', text: 'Narcotics Issuing' },

  // 2. Inpatient / Ward Metrics
  { id: '2.1', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'ALOS (Average Length of Stay)' },
  { id: '2.2', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Bed Occupancy Rate' },
  { id: '2.3', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Bed Turnover Rate' },
  { id: '2.4', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Mortality Rate' },
  { id: '2.5', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Readmission within 30 days' },
  { id: '2.6', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Complete Discharge Summary' },
  { id: '2.7', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Incomplete Medical History' },
  { id: '2.8', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Medical Records Discrepancy' },
  { id: '2.9', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Patient Safety Goals' },
  { id: '2.10', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Unplanned Transfer to CCU / ICU' },
  { id: '2.11', category: 2, categoryTitle: 'Inpatient / Ward Metrics', text: 'Staffing Ratios (FTEs)' },

  // 3. Emergency Department Metrics
  { id: '3.1', category: 3, categoryTitle: 'Emergency Department Metrics', text: 'ER Daily Cases' },
  { id: '3.2', category: 3, categoryTitle: 'Emergency Department Metrics', text: 'ECG' },
  { id: '3.3', category: 3, categoryTitle: 'Emergency Department Metrics', text: 'Patients Treated in Less Than 4 Hours' },
  { id: '3.4', category: 3, categoryTitle: 'Emergency Department Metrics', text: 'Consultants Average Arrival Time' },
  { id: '3.5', category: 3, categoryTitle: 'Emergency Department Metrics', text: 'Consultants Arrived in Less Than 30 Minutes' },
  { id: '3.6', category: 3, categoryTitle: 'Emergency Department Metrics', text: 'Return to ER Room Within 24 Hours' },
  { id: '3.7', category: 3, categoryTitle: 'Emergency Department Metrics', text: 'CPR Success Rate' },
  { id: '3.8', category: 3, categoryTitle: 'Emergency Department Metrics', text: 'Availability of Essential Supplies' },

  // 4. Infection Control Metrics
  { id: '4.1', category: 4, categoryTitle: 'Infection Control Metrics', text: 'HAI (Healthcare-Associated Infection)' },
  { id: '4.2', category: 4, categoryTitle: 'Infection Control Metrics', text: 'CAUTI (Catheter-Associated Urinary Tract Infection)' },
  { id: '4.3', category: 4, categoryTitle: 'Infection Control Metrics', text: 'VAP (Ventilator-Associated Pneumonia)' },
  { id: '4.4', category: 4, categoryTitle: 'Infection Control Metrics', text: 'SSI (Surgical Site Infection)' },
  { id: '4.5', category: 4, categoryTitle: 'Infection Control Metrics', text: 'CLABSI (Central Line-Associated Bloodstream Infection)' },

  // 5. Blood Bank Metrics
  { id: '5.1', category: 5, categoryTitle: 'Blood Bank Metrics', text: 'TAT (Turnaround Time)' },
  { id: '5.2', category: 5, categoryTitle: 'Blood Bank Metrics', text: 'Blood Utilization' },
  { id: '5.3', category: 5, categoryTitle: 'Blood Bank Metrics', text: 'Blood Wastage' },

  // 6. Outpatient Department (OPD) Metrics
  { id: '6.1', category: 6, categoryTitle: 'Outpatient Department (OPD) Metrics', text: 'New Registrations' },
  { id: '6.2', category: 6, categoryTitle: 'Outpatient Department (OPD) Metrics', text: 'OPD Statistics' },
  { id: '6.3', category: 6, categoryTitle: 'Outpatient Department (OPD) Metrics', text: 'FTE (Staffing Ratios)' },
  { id: '6.4', category: 6, categoryTitle: 'Outpatient Department (OPD) Metrics', text: 'Visits (by Departments)' },
  { id: '6.5', category: 6, categoryTitle: 'Outpatient Department (OPD) Metrics', text: 'New Visit Rate' },
  { id: '6.6', category: 6, categoryTitle: 'Outpatient Department (OPD) Metrics', text: 'Visits (by Physicians)' },
  { id: '6.7', category: 6, categoryTitle: 'Outpatient Department (OPD) Metrics', text: 'Appointments (by Departments)' },
  { id: '6.8', category: 6, categoryTitle: 'Outpatient Department (OPD) Metrics', text: 'Walk-in Rate' },
  { id: '6.9', category: 6, categoryTitle: 'Outpatient Department (OPD) Metrics', text: 'Appointments (by Physicians)' },

  // 7. Surgery / Operating Room Metrics
  { id: '7.1', category: 7, categoryTitle: 'Surgery / Operating Room Metrics', text: 'Surgical Volumes' },
  { id: '7.2', category: 7, categoryTitle: 'Surgery / Operating Room Metrics', text: 'Elective Surgeries Percentage' },
  { id: '7.3', category: 7, categoryTitle: 'Surgery / Operating Room Metrics', text: 'OR Cancellation Percentage' },
  { id: '7.4', category: 7, categoryTitle: 'Surgery / Operating Room Metrics', text: 'VTE Prophylaxis Prior/Post Surgery — Compliance to VTE Prophylaxis Form' },
  { id: '7.5', category: 7, categoryTitle: 'Surgery / Operating Room Metrics', text: 'Return to OR Within 24 Hours' },
  { id: '7.6', category: 7, categoryTitle: 'Surgery / Operating Room Metrics', text: 'Timing and Use of Antibiotics Prior to Surgery' },

  // 8. Pharmacy Metrics
  { id: '8.1', category: 8, categoryTitle: 'Pharmacy Metrics', text: 'Pharmacy Dispensing Quantities' },
  { id: '8.2', category: 8, categoryTitle: 'Pharmacy Metrics', text: 'Pharmacy Dispensing Cost' },
  { id: '8.3', category: 8, categoryTitle: 'Pharmacy Metrics', text: 'Medication Errors' },
  { id: '8.4', category: 8, categoryTitle: 'Pharmacy Metrics', text: 'Availability of Emergency Medication' },
  { id: '8.5', category: 8, categoryTitle: 'Pharmacy Metrics', text: 'Expired Items Cost to Purchased Cost' },

  // 9. Radiology Metrics
  { id: '9.1', category: 9, categoryTitle: 'Radiology Metrics', text: 'Radiation Volumes' },

  // 10. Patient Flow / Waiting Times
  { id: '10.1', category: 10, categoryTitle: 'Patient Flow / Waiting Times', text: 'Arrival Times in OPD' },
  { id: '10.2', category: 10, categoryTitle: 'Patient Flow / Waiting Times', text: 'Clinic Waiting Time' },

  // 11. Human Resources Metrics
  { id: '11.1', category: 11, categoryTitle: 'Human Resources Metrics', text: 'Staff Satisfaction Survey' },
  { id: '11.2', category: 11, categoryTitle: 'Human Resources Metrics', text: 'Vacancy Rate' },
  { id: '11.3', category: 11, categoryTitle: 'Human Resources Metrics', text: 'Exit Survey' },

  // 12. Patient Experience Metrics
  { id: '12.1', category: 12, categoryTitle: 'Patient Experience Metrics', text: 'Patient Satisfaction Survey' },
  { id: '12.2', category: 12, categoryTitle: 'Patient Experience Metrics', text: 'Patient Complaints Register' },

  // 13. Occurrence Variance Report (OVR) Metrics
  { id: '13.1', category: 13, categoryTitle: 'Occurrence Variance Report (OVR) Metrics', text: 'In-Hospital OVR (by Severity)' },
  { id: '13.2', category: 13, categoryTitle: 'Occurrence Variance Report (OVR) Metrics', text: 'In-Hospital OVR (by Type)' },
  { id: '13.3', category: 13, categoryTitle: 'Occurrence Variance Report (OVR) Metrics', text: 'Responses to OVR' },

  // 14. Facilities & Biomedical Engineering Metrics
  { id: '14.1', category: 14, categoryTitle: 'Facilities & Biomedical Engineering Metrics', text: 'Number of Work Orders on the Timeline' },
  { id: '14.2', category: 14, categoryTitle: 'Facilities & Biomedical Engineering Metrics', text: 'PPM (Planned Preventive Maintenance) Completion Rate' },
  { id: '14.3', category: 14, categoryTitle: 'Facilities & Biomedical Engineering Metrics', text: 'Duration to Complete CM (Corrective Maintenance)' },
  { id: '14.4', category: 14, categoryTitle: 'Facilities & Biomedical Engineering Metrics', text: 'Equipment Breakdowns' },
  { id: '14.5', category: 14, categoryTitle: 'Facilities & Biomedical Engineering Metrics', text: 'Equipment Card' },
  { id: '14.6', category: 14, categoryTitle: 'Facilities & Biomedical Engineering Metrics', text: 'Supplies and Equipment Variances' },
];

// One { number, title } pair per category, in catalogue order — derived from
// DASHBOARD_METRICS so the two can never drift apart.
const CATEGORIES = (function () {
  const seen = new Map();
  DASHBOARD_METRICS.forEach(function (item) {
    if (!seen.has(item.category)) {
      seen.set(item.category, { number: item.category, title: item.categoryTitle });
    }
  });
  return Array.from(seen.values());
})();

export { DASHBOARD_METRICS, CATEGORIES };
