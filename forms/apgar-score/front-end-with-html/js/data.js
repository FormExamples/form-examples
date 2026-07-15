// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the band range (reassuring / moderately-low / low), both
// vigorous and depressed newborns, and every care setting, with the
// resuscitation flag set whenever any timepoint total is 3 or below.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'NB-100482',
    patientName: 'Osei, Baby of Grace',
    careSetting: 'delivery-room',
    oneMinuteScore: 9,
    fiveMinuteScore: 10,
    band: 'reassuring',
    resuscitationFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'NB-573110',
    patientName: 'Mackenzie, Baby of Iona',
    careSetting: 'theatre',
    oneMinuteScore: 6,
    fiveMinuteScore: 8,
    band: 'reassuring',
    resuscitationFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'NB-100517',
    patientName: 'Nowak, Baby of Zofia',
    careSetting: 'delivery-room',
    oneMinuteScore: 3,
    fiveMinuteScore: 6,
    band: 'moderately-low',
    resuscitationFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'NB-880204',
    patientName: 'Ahmed, Baby of Bilal',
    careSetting: 'birth-centre',
    oneMinuteScore: 8,
    fiveMinuteScore: 9,
    band: 'reassuring',
    resuscitationFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'NB-573642',
    patientName: 'Fletcher, Baby of Rosemary',
    careSetting: 'neonatal-unit',
    oneMinuteScore: 2,
    fiveMinuteScore: 4,
    band: 'moderately-low',
    resuscitationFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'NB-100639',
    patientName: 'Silva, Baby of Marta',
    careSetting: 'home',
    oneMinuteScore: 7,
    fiveMinuteScore: 9,
    band: 'reassuring',
    resuscitationFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'NB-880351',
    patientName: 'Byrne, Baby of Aoife',
    careSetting: 'delivery-room',
    oneMinuteScore: 1,
    fiveMinuteScore: 2,
    band: 'low',
    resuscitationFlag: true,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
