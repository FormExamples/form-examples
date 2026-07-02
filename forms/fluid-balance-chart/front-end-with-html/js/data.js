// Sample chart data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every fluid-status classification, both balance signs, and a
// mix of wards, with urine-output rates consistent with the status (the
// oliguria row's rate is below the 0.5 mL/kg/h threshold).

(function () {
'use strict';
window.FluidBalanceChartDashboard =
  window.FluidBalanceChartDashboard || {};

/** @type {import('./dashboard-types.js').ChartRow[]} */
const sampleCharts = [
  {
    id: '1',
    patientIdentifier: 'AMU-4B-12',
    patientName: 'Okafor, Beatrice',
    wardOrUnit: 'Acute Medical Unit',
    totalIntakeMl: 2400,
    totalOutputMl: 2250,
    netBalanceMl: 150,
    urineOutputRateMlPerKgPerHour: 1.02,
    fluidStatus: 'balanced',
    chartStartAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'HDU-201',
    patientName: 'Whitfield, Harold',
    wardOrUnit: 'High Dependency Unit',
    totalIntakeMl: 3600,
    totalOutputMl: 2100,
    netBalanceMl: 1500,
    urineOutputRateMlPerKgPerHour: 0.78,
    fluidStatus: 'positive',
    chartStartAt: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: 'ICU-07',
    patientName: 'Nowak, Irena',
    wardOrUnit: 'Intensive Care Unit',
    totalIntakeMl: 1800,
    totalOutputMl: 1140,
    netBalanceMl: 660,
    urineOutputRateMlPerKgPerHour: 0.28,
    fluidStatus: 'oliguria',
    chartStartAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'SURG-3-08',
    patientName: 'Ahmed, Yusuf',
    wardOrUnit: 'Surgical Ward 3',
    totalIntakeMl: 1500,
    totalOutputMl: 2900,
    netBalanceMl: -1400,
    urineOutputRateMlPerKgPerHour: 0.95,
    fluidStatus: 'negative',
    chartStartAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'AMU-2A-05',
    patientName: 'Fletcher, Margaret',
    wardOrUnit: 'Acute Medical Unit',
    totalIntakeMl: 2650,
    totalOutputMl: 2500,
    netBalanceMl: 150,
    urineOutputRateMlPerKgPerHour: 1.15,
    fluidStatus: 'balanced',
    chartStartAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'ICU-11',
    patientName: 'Silva, Rui',
    wardOrUnit: 'Intensive Care Unit',
    totalIntakeMl: 4100,
    totalOutputMl: 1900,
    netBalanceMl: 2200,
    urineOutputRateMlPerKgPerHour: 0.62,
    fluidStatus: 'positive',
    chartStartAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'HDU-204',
    patientName: 'Byrne, Aoife',
    wardOrUnit: 'High Dependency Unit',
    totalIntakeMl: 1200,
    totalOutputMl: 1350,
    netBalanceMl: -150,
    urineOutputRateMlPerKgPerHour: 0.18,
    fluidStatus: 'oliguria',
    chartStartAt: '2026-06-28'
  }
];

window.FluidBalanceChartDashboard.sampleCharts = sampleCharts;
})();
