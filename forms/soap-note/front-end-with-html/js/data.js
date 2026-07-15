// Sample note data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span all three completeness statuses, the full completeness-percent
// range, every care setting, and both safety-flag states.

/** @type {import('./dashboard-types.js').NoteRow[]} */
const sampleNotes = [
  {
    id: '1',
    patientIdentifier: 'GP-204815',
    patientName: 'Okafor, Chidi',
    careSetting: 'general-practice',
    status: 'complete',
    completenessPercent: 100,
    safetyFlag: false,
    encounteredAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'ED-771302',
    patientName: 'Doyle, Aoife',
    careSetting: 'emergency-department',
    status: 'incomplete',
    completenessPercent: 60,
    safetyFlag: true,
    encounteredAt: '2026-06-24'
  },
  {
    id: '3',
    patientIdentifier: 'WD-330149',
    patientName: 'Nowak, Piotr',
    careSetting: 'ward',
    status: 'partial',
    completenessPercent: 80,
    safetyFlag: false,
    encounteredAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'OP-905513',
    patientName: 'Fernandez, Rosa',
    careSetting: 'outpatient',
    status: 'complete',
    completenessPercent: 100,
    safetyFlag: false,
    encounteredAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'CM-118427',
    patientName: 'Thompson, Gary',
    careSetting: 'community',
    status: 'partial',
    completenessPercent: 71,
    safetyFlag: false,
    encounteredAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'ED-771488',
    patientName: 'Abadi, Layla',
    careSetting: 'emergency-department',
    status: 'incomplete',
    completenessPercent: 50,
    safetyFlag: true,
    encounteredAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'TH-560234',
    patientName: 'Whitfield, Eleanor',
    careSetting: 'telehealth',
    status: 'complete',
    completenessPercent: 100,
    safetyFlag: false,
    encounteredAt: '2026-06-27'
  },
  {
    id: '8',
    patientIdentifier: 'GP-330217',
    patientName: 'Sato, Kenji',
    careSetting: 'general-practice',
    status: 'partial',
    completenessPercent: 86,
    safetyFlag: false,
    encounteredAt: '2026-06-28'
  }
];

export { sampleNotes };
