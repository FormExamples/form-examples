// Sample check data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span both completeness statuses, a range of completeness percentages,
// Health Action Plans present and absent, and the STOMP flag set and clear.

/** @type {import('./dashboard-types.js').CheckRow[]} */
const sampleChecks = [
  {
    id: '1',
    personIdentifier: 'LD-100482',
    personName: 'Okafor, Grace',
    practiceName: 'Meadow Lane Surgery',
    status: 'complete',
    completenessPercent: 100,
    healthActionPlan: true,
    stompFlag: false,
    checkedOn: '2026-06-20'
  },
  {
    id: '2',
    personIdentifier: 'LD-573110',
    personName: 'Mackenzie, Ian',
    practiceName: 'Riverside Health Centre',
    status: 'incomplete',
    completenessPercent: 78,
    healthActionPlan: false,
    stompFlag: true,
    checkedOn: '2026-06-22'
  },
  {
    id: '3',
    personIdentifier: 'LD-100517',
    personName: 'Nowak, Zofia',
    practiceName: 'Meadow Lane Surgery',
    status: 'complete',
    completenessPercent: 100,
    healthActionPlan: true,
    stompFlag: true,
    checkedOn: '2026-06-24'
  },
  {
    id: '4',
    personIdentifier: 'LD-880204',
    personName: 'Ahmed, Bilal',
    practiceName: 'The Elms Practice',
    status: 'incomplete',
    completenessPercent: 61,
    healthActionPlan: false,
    stompFlag: false,
    checkedOn: '2026-06-25'
  },
  {
    id: '5',
    personIdentifier: 'LD-573642',
    personName: 'Fletcher, Rosemary',
    practiceName: 'Riverside Health Centre',
    status: 'incomplete',
    completenessPercent: 94,
    healthActionPlan: true,
    stompFlag: false,
    checkedOn: '2026-06-26'
  },
  {
    id: '6',
    personIdentifier: 'LD-100639',
    personName: 'Silva, Marcos',
    practiceName: 'The Elms Practice',
    status: 'complete',
    completenessPercent: 100,
    healthActionPlan: true,
    stompFlag: false,
    checkedOn: '2026-06-27'
  },
  {
    id: '7',
    personIdentifier: 'LD-880351',
    personName: 'Byrne, Aoife',
    practiceName: 'Meadow Lane Surgery',
    status: 'incomplete',
    completenessPercent: 44,
    healthActionPlan: false,
    stompFlag: true,
    checkedOn: '2026-06-28'
  }
];

export { sampleChecks };
