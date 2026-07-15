// Sample reconciliation data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every status class, every reconciliation type, and a range of
// source and discrepancy counts.

/** @type {import('./dashboard-types.js').ReconciliationRow[]} */
const sampleReconciliations = [
  {
    id: '1',
    patientIdentifier: 'MRN-448210',
    patientName: 'Okafor, Beatrice',
    reconciliationType: 'admission',
    careSetting: 'acute-medical-unit',
    sourceCount: 3,
    discrepancyCount: 2,
    unintentionalCount: 0,
    status: 'complete',
    reconciledAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'MRN-551903',
    patientName: 'Whitfield, Harold',
    reconciliationType: 'admission',
    careSetting: 'emergency-department',
    sourceCount: 2,
    discrepancyCount: 4,
    unintentionalCount: 2,
    status: 'discrepancies-outstanding',
    reconciledAt: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: 'MRN-100442',
    patientName: 'Nowak, Irena',
    reconciliationType: 'discharge',
    careSetting: 'ward',
    sourceCount: 1,
    discrepancyCount: 0,
    unintentionalCount: 0,
    status: 'incomplete',
    reconciledAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'MRN-204981',
    patientName: 'Ahmed, Yusuf',
    reconciliationType: 'transfer',
    careSetting: 'critical-care',
    sourceCount: 3,
    discrepancyCount: 5,
    unintentionalCount: 1,
    status: 'discrepancies-outstanding',
    reconciledAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'MRN-773025',
    patientName: 'Fletcher, Margaret',
    reconciliationType: 'discharge',
    careSetting: 'surgical-admissions',
    sourceCount: 2,
    discrepancyCount: 3,
    unintentionalCount: 0,
    status: 'complete',
    reconciledAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'MRN-880137',
    patientName: 'Silva, Rui',
    reconciliationType: 'admission',
    careSetting: 'ward',
    sourceCount: 2,
    discrepancyCount: 1,
    unintentionalCount: 0,
    status: 'complete',
    reconciledAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'MRN-100519',
    patientName: 'Byrne, Aoife',
    reconciliationType: 'transfer',
    careSetting: 'acute-medical-unit',
    sourceCount: 1,
    discrepancyCount: 2,
    unintentionalCount: 2,
    status: 'incomplete',
    reconciledAt: '2026-06-28'
  }
];

export { sampleReconciliations };
