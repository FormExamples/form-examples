// Sample triage-note data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full Manchester Triage System priority range (Level 1
// Immediate → Level 5 Non-urgent), the NEWS2 escalation, and every care
// setting.

/** @type {import('./dashboard-types.js').TriageRow[]} */
const sampleTriageNotes = [
  {
    id: '1',
    patientIdentifier: 'NHS 485 777 3456',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    presentingComplaint: 'Collapse, not breathing normally',
    priorityLevel: 1,
    priorityColour: 'red',
    priorityName: 'Immediate',
    targetMinutes: 0,
    news2Total: 12,
    triagedAt: '2026-06-28'
  },
  {
    id: '2',
    patientIdentifier: 'NHS 943 476 5919',
    patientName: 'Mackenzie, Ian',
    careSetting: 'emergency-department',
    presentingComplaint: 'Central chest pain radiating to left arm',
    priorityLevel: 2,
    priorityColour: 'orange',
    priorityName: 'Very urgent',
    targetMinutes: 10,
    news2Total: 4,
    triagedAt: '2026-06-28'
  },
  {
    id: '3',
    patientIdentifier: 'MRN-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    presentingComplaint: 'Fever and confusion, query sepsis',
    priorityLevel: 2,
    priorityColour: 'orange',
    priorityName: 'Very urgent',
    targetMinutes: 10,
    news2Total: 8,
    triagedAt: '2026-06-27'
  },
  {
    id: '4',
    patientIdentifier: 'NHS 611 209 8842',
    patientName: 'Ahmed, Bilal',
    careSetting: 'urgent-treatment-centre',
    presentingComplaint: 'Abdominal pain, moderate',
    priorityLevel: 3,
    priorityColour: 'yellow',
    priorityName: 'Urgent',
    targetMinutes: 60,
    news2Total: 3,
    triagedAt: '2026-06-27'
  },
  {
    id: '5',
    patientIdentifier: 'MRN-100639',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'minor-injuries-unit',
    presentingComplaint: 'Sprained ankle after fall',
    priorityLevel: 4,
    priorityColour: 'green',
    priorityName: 'Standard',
    targetMinutes: 120,
    news2Total: 1,
    triagedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'PH-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'minor-injuries-unit',
    presentingComplaint: 'Repeat dressing, minor graze',
    priorityLevel: 5,
    priorityColour: 'blue',
    priorityName: 'Non-urgent',
    targetMinutes: 240,
    news2Total: 0,
    triagedAt: '2026-06-26'
  },
  {
    id: '7',
    patientIdentifier: 'NHS 277 641 0093',
    patientName: 'Silva, Marcos',
    careSetting: 'urgent-treatment-centre',
    presentingComplaint: 'Headache with visual disturbance',
    priorityLevel: 3,
    priorityColour: 'yellow',
    priorityName: 'Urgent',
    targetMinutes: 60,
    news2Total: 2,
    triagedAt: '2026-06-28'
  }
];

export { sampleTriageNotes };
