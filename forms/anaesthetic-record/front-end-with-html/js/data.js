// Sample anaesthetic-record data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span every completeness status, a range of completeness percents and
// safety-flag counts, and every urgency class.

/** @type {import('./dashboard-types.js').RecordRow[]} */
const sampleRecords = [
  {
    id: '1',
    patientIdentifier: 'NHS-448 201 7743',
    patientName: 'Okafor, Beatrice',
    theatre: 'Theatre 3',
    anaesthetistName: 'Dr A. Rahman',
    urgency: 'elective',
    completenessPercent: 100,
    status: 'complete',
    flagCount: 0,
    operationDate: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'NHS-551 903 2210',
    patientName: 'Whitfield, Harold',
    theatre: 'Theatre 1',
    anaesthetistName: 'Dr S. Okoye',
    urgency: 'urgent',
    completenessPercent: 92,
    status: 'partial',
    flagCount: 1,
    operationDate: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: 'NHS-100 442 8890',
    patientName: 'Nowak, Irena',
    theatre: 'Obstetric Theatre',
    anaesthetistName: 'Dr L. Fernandes',
    urgency: 'emergency',
    completenessPercent: 58,
    status: 'incomplete',
    flagCount: 3,
    operationDate: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'NHS-204 981 5567',
    patientName: 'Ahmed, Yusuf',
    theatre: 'Day Surgery 2',
    anaesthetistName: 'Dr A. Rahman',
    urgency: 'elective',
    completenessPercent: 100,
    status: 'complete',
    flagCount: 0,
    operationDate: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'NHS-773 025 1180',
    patientName: 'Fletcher, Margaret',
    theatre: 'Theatre 4',
    anaesthetistName: 'Dr M. Idris',
    urgency: 'urgent',
    completenessPercent: 83,
    status: 'partial',
    flagCount: 2,
    operationDate: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'NHS-880 137 4402',
    patientName: 'Silva, Rui',
    theatre: 'Theatre 2',
    anaesthetistName: 'Dr S. Okoye',
    urgency: 'immediate',
    completenessPercent: 42,
    status: 'incomplete',
    flagCount: 4,
    operationDate: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'NHS-100 519 6631',
    patientName: 'Byrne, Aoife',
    theatre: 'Theatre 5',
    anaesthetistName: 'Dr L. Fernandes',
    urgency: 'elective',
    completenessPercent: 100,
    status: 'complete',
    flagCount: 1,
    operationDate: '2026-06-28'
  }
];

export { sampleRecords };
