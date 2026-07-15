// Sample partogram data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every labour-progress classification, both parities, and a mix
// of care settings, with latest dilatation and elapsed hours consistent with
// the classification (the action-line row's dilatation is on / right of the
// action line for its elapsed time; the alert-line row lies between the lines).

/** @type {import('./dashboard-types.js').PartogramRow[]} */
const samplePartograms = [
  {
    id: '1',
    patientIdentifier: 'LW-4B-12',
    patientName: 'Okafor, Beatrice',
    careSetting: 'labour-ward',
    parity: 'nulliparous',
    latestDilatationCm: 8,
    elapsedHours: 3.0,
    progressClassification: 'normal',
    activePhaseStartAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'BC-201',
    patientName: 'Whitfield, Harriet',
    careSetting: 'birth-centre',
    parity: 'multiparous',
    latestDilatationCm: 6,
    elapsedHours: 3.5,
    progressClassification: 'alertLineCrossed',
    activePhaseStartAt: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: 'LW-07',
    patientName: 'Nowak, Irena',
    careSetting: 'labour-ward',
    parity: 'nulliparous',
    latestDilatationCm: 5,
    elapsedHours: 6.0,
    progressClassification: 'actionLineCrossed',
    activePhaseStartAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'TRIAGE-3-08',
    patientName: 'Ahmed, Yusra',
    careSetting: 'triage',
    parity: 'multiparous',
    latestDilatationCm: 4,
    elapsedHours: 0.5,
    progressClassification: 'normal',
    activePhaseStartAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'LW-2A-05',
    patientName: 'Fletcher, Margaret',
    careSetting: 'labour-ward',
    parity: 'nulliparous',
    latestDilatationCm: 7,
    elapsedHours: 4.0,
    progressClassification: 'alertLineCrossed',
    activePhaseStartAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'BC-11',
    patientName: 'Silva, Rita',
    careSetting: 'birth-centre',
    parity: 'multiparous',
    latestDilatationCm: 10,
    elapsedHours: 5.5,
    progressClassification: 'normal',
    activePhaseStartAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'LW-204',
    patientName: 'Byrne, Aoife',
    careSetting: 'labour-ward',
    parity: 'nulliparous',
    latestDilatationCm: 6,
    elapsedHours: 7.0,
    progressClassification: 'actionLineCrossed',
    activePhaseStartAt: '2026-06-28'
  }
];

export { samplePartograms };
