# Hospital Dashboard Metrics — Spec

Living spec for `hospital-dashboard-metrics`. This is the canonical,
hand-maintained source of the 67 metrics. Front-end metric catalogues
(`front-end-with-svelte/src/lib/config/metrics.ts`,
`front-end-with-html/js/metrics.js`) and the SQL seed data must stay
in sync with this list.

## Response model

Each metric below is recorded independently as a decimal number (or
left unanswered), with an optional free-text note. The unit —
percentage, rate, day count, currency, minutes — is implied by the
metric name; this form does not enforce a unit per field.

## Category titles are editorially inferred

The source proforma separated metrics into 14 groups using `---`
dividers but named only one of them ("HAI, CAUTI, VAP, SSI, CLABSI"
is source text, not a title). The category titles below were chosen
to describe each group's contents (e.g. a hospital's antibiotics/
narcotics/culture group, an inpatient-ward group, an emergency-
department group) and are **not** part of the original source text.

## Metric catalogue

### 1. Antibiotics, Narcotics & Culture Monitoring

- `1.1` — Antibiotics Issuing
- `1.2` — Culture Results
- `1.3` — Narcotics Issuing

### 2. Inpatient / Ward Metrics

- `2.1` — ALOS (Average Length of Stay)
- `2.2` — Bed Occupancy Rate
- `2.3` — Bed Turnover Rate
- `2.4` — Mortality Rate
- `2.5` — Readmission within 30 days
- `2.6` — Complete Discharge Summary
- `2.7` — Incomplete Medical History
- `2.8` — Medical Records Discrepancy
- `2.9` — Patient Safety Goals
- `2.10` — Unplanned Transfer to CCU / ICU
- `2.11` — Staffing Ratios (FTEs)

### 3. Emergency Department Metrics

- `3.1` — ER Daily Cases
- `3.2` — ECG
- `3.3` — Patients Treated in Less Than 4 Hours
- `3.4` — Consultants Average Arrival Time
- `3.5` — Consultants Arrived in Less Than 30 Minutes
- `3.6` — Return to ER Room Within 24 Hours
- `3.7` — CPR Success Rate
- `3.8` — Availability of Essential Supplies

### 4. Infection Control Metrics

- `4.1` — HAI (Healthcare-Associated Infection)
- `4.2` — CAUTI (Catheter-Associated Urinary Tract Infection)
- `4.3` — VAP (Ventilator-Associated Pneumonia)
- `4.4` — SSI (Surgical Site Infection)
- `4.5` — CLABSI (Central Line-Associated Bloodstream Infection)

### 5. Blood Bank Metrics

- `5.1` — TAT (Turnaround Time)
- `5.2` — Blood Utilization
- `5.3` — Blood Wastage

### 6. Outpatient Department (OPD) Metrics

- `6.1` — New Registrations
- `6.2` — OPD Statistics
- `6.3` — FTE (Staffing Ratios)
- `6.4` — Visits (by Departments)
- `6.5` — New Visit Rate
- `6.6` — Visits (by Physicians)
- `6.7` — Appointments (by Departments)
- `6.8` — Walk-in Rate
- `6.9` — Appointments (by Physicians)

### 7. Surgery / Operating Room Metrics

- `7.1` — Surgical Volumes
- `7.2` — Elective Surgeries Percentage
- `7.3` — OR Cancellation Percentage
- `7.4` — VTE Prophylaxis Prior/Post Surgery — Compliance to VTE Prophylaxis Form
- `7.5` — Return to OR Within 24 Hours
- `7.6` — Timing and Use of Antibiotics Prior to Surgery

### 8. Pharmacy Metrics

- `8.1` — Pharmacy Dispensing Quantities
- `8.2` — Pharmacy Dispensing Cost
- `8.3` — Medication Errors
- `8.4` — Availability of Emergency Medication
- `8.5` — Expired Items Cost to Purchased Cost

### 9. Radiology Metrics

- `9.1` — Radiation Volumes

### 10. Patient Flow / Waiting Times

- `10.1` — Arrival Times in OPD
- `10.2` — Clinic Waiting Time

### 11. Human Resources Metrics

- `11.1` — Staff Satisfaction Survey
- `11.2` — Vacancy Rate
- `11.3` — Exit Survey

### 12. Patient Experience Metrics

- `12.1` — Patient Satisfaction Survey
- `12.2` — Patient Complaints Register

### 13. Occurrence Variance Report (OVR) Metrics

- `13.1` — In-Hospital OVR (by Severity)
- `13.2` — In-Hospital OVR (by Type)
- `13.3` — Responses to OVR

### 14. Facilities & Biomedical Engineering Metrics

- `14.1` — Number of Work Orders on the Timeline
- `14.2` — PPM (Planned Preventive Maintenance) Completion Rate
- `14.3` — Duration to Complete CM (Corrective Maintenance)
- `14.4` — Equipment Breakdowns
- `14.5` — Equipment Card
- `14.6` — Supplies and Equipment Variances

## Source

Transcribed from a hospital quality/performance dashboard metrics
list. Item text is lightly normalised for readability (title case,
expanded abbreviations on first mention) while preserving the
original metric names.
