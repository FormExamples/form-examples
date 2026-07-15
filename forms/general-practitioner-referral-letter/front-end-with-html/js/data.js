// Sample referral data for the dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span both statuses (Complete / Incomplete) and every urgency
// (routine / urgent / two-week-wait / emergency), with at least one emergency
// and one red-flag row to exercise the critical-row styling.

/** @type {import('./dashboard-types.js').ReferralRow[]} */
const sampleReferrals = [
  {
    id: '1',
    patientIdentifier: '943 476 5919',
    patientName: 'Okoro, James',
    referralSpecialty: 'Gastroenterology',
    status: 'Complete',
    completenessPercent: 100,
    urgency: 'two-week-wait',
    redFlag: true,
    referrerName: 'Dr P. Nair',
    referralDate: '2026-06-28'
  },
  {
    id: '2',
    patientIdentifier: '611 209 3344',
    patientName: 'Byrne, Aoife',
    referralSpecialty: 'Cardiology',
    status: 'Complete',
    completenessPercent: 100,
    urgency: 'urgent',
    redFlag: false,
    referrerName: 'Dr L. Mensah',
    referralDate: '2026-06-27'
  },
  {
    id: '3',
    patientIdentifier: '502 771 8820',
    patientName: 'Okafor, Chidi',
    referralSpecialty: 'Dermatology',
    status: 'Complete',
    completenessPercent: 100,
    urgency: 'routine',
    redFlag: false,
    referrerName: 'J. Hughes (ANP)',
    referralDate: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: '778 334 1090',
    patientName: 'Silva, Marcos',
    referralSpecialty: 'Rheumatology',
    status: 'Incomplete',
    completenessPercent: 70,
    urgency: 'routine',
    redFlag: false,
    referrerName: 'Dr S. Patel',
    referralDate: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: '120 998 4471',
    patientName: 'Fletcher, Rosemary',
    referralSpecialty: 'Respiratory',
    status: 'Incomplete',
    completenessPercent: 82,
    urgency: 'urgent',
    redFlag: false,
    referrerName: 'H. Wong (Pharmacist)',
    referralDate: '2026-06-24'
  },
  {
    id: '6',
    patientIdentifier: '365 447 2201',
    patientName: 'Nowak, Piotr',
    referralSpecialty: 'Acute medicine',
    status: 'Incomplete',
    completenessPercent: 50,
    urgency: 'emergency',
    redFlag: true,
    referrerName: '',
    referralDate: '2026-06-23'
  }
];

export { sampleReferrals };
