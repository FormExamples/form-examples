// Sample referral data for the duty-team dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every status (complete / partial / incomplete), every urgency
// (emergency / urgent / standard), and each primary category, with at least one
// immediate-danger row to exercise the critical-row styling.

/** @type {import('./dashboard-types.js').ReferralRow[]} */
const sampleReferrals = [
  {
    id: '1',
    childReference: '943 476 5919',
    childName: 'Clarke, Jamie',
    status: 'complete',
    completenessPercent: 100,
    urgency: 'emergency',
    primaryCategory: 'physical',
    immediateDanger: true,
    referrerName: 'Sarah Ahmed',
    referredAt: '2026-06-28'
  },
  {
    id: '2',
    childReference: '611 209 3344',
    childName: 'Byrne, Aoife',
    status: 'partial',
    completenessPercent: 78,
    urgency: 'urgent',
    primaryCategory: 'sexual',
    immediateDanger: false,
    referrerName: 'Dr L. Mensah',
    referredAt: '2026-06-27'
  },
  {
    id: '3',
    childReference: '502 771 8820',
    childName: 'Okafor, Chidi',
    status: 'complete',
    completenessPercent: 100,
    urgency: 'urgent',
    primaryCategory: 'neglect',
    immediateDanger: false,
    referrerName: 'J. Hughes',
    referredAt: '2026-06-26'
  },
  {
    id: '4',
    childReference: '778 334 1090',
    childName: 'Silva, Marcos',
    status: 'incomplete',
    completenessPercent: 52,
    urgency: 'standard',
    primaryCategory: 'emotional',
    immediateDanger: false,
    referrerName: 'Dr S. Patel',
    referredAt: '2026-06-25'
  },
  {
    id: '5',
    childReference: '120 998 4471',
    childName: 'Fletcher, Rosemary',
    status: 'partial',
    completenessPercent: 83,
    urgency: 'standard',
    primaryCategory: 'neglect',
    immediateDanger: false,
    referrerName: 'H. Wong',
    referredAt: '2026-06-24'
  },
  {
    id: '6',
    childReference: '365 447 2201',
    childName: 'Nowak, Piotr',
    status: 'incomplete',
    completenessPercent: 39,
    urgency: 'emergency',
    primaryCategory: '',
    immediateDanger: true,
    referrerName: '',
    referredAt: '2026-06-23'
  }
];

export { sampleReferrals };
