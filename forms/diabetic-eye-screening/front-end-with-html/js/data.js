// Sample screening data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span every recall / referral outcome, both worst-eye grades, and the
// urgent flag is set whenever urgent ophthalmology referral (R3A) is indicated.

/** @type {import('./dashboard-types.js').ScreeningRow[]} */
const sampleScreenings = [
  {
    id: '1',
    patientIdentifier: 'DESP-448120',
    patientName: 'Okoro, Amara',
    worstRetinopathy: 'R3A',
    worstMaculopathy: 'M1',
    outcome: 'refer-hes-urgent',
    referral: 'hes-urgent',
    urgentFlag: true,
    screenedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'DESP-448377',
    patientName: 'Nowak, Zofia',
    worstRetinopathy: 'R1',
    worstMaculopathy: 'M1',
    outcome: 'refer-hes',
    referral: 'hes-routine',
    urgentFlag: false,
    screenedAt: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: 'DESP-100517',
    patientName: 'Fletcher, Rosemary',
    worstRetinopathy: 'R3S',
    worstMaculopathy: 'M0',
    outcome: 'refer-hes',
    referral: 'hes-routine',
    urgentFlag: false,
    screenedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'DESP-448512',
    patientName: 'Silva, Marta',
    worstRetinopathy: 'R0',
    worstMaculopathy: 'M0',
    outcome: 'refer-slit-lamp',
    referral: 'slit-lamp',
    urgentFlag: false,
    screenedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'DESP-100639',
    patientName: 'Byrne, Aoife',
    worstRetinopathy: 'R2',
    worstMaculopathy: 'M0',
    outcome: 'surveillance-6-month',
    referral: 'none',
    urgentFlag: false,
    screenedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'DESP-448690',
    patientName: 'MacLeod, Iona',
    worstRetinopathy: 'R1',
    worstMaculopathy: 'M0',
    outcome: 'routine-12-month',
    referral: 'none',
    urgentFlag: false,
    screenedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'DESP-100742',
    patientName: 'Adeyemi, Grace',
    worstRetinopathy: 'R0',
    worstMaculopathy: 'M0',
    outcome: 'routine-24-month',
    referral: 'none',
    urgentFlag: false,
    screenedAt: '2026-06-28'
  }
];

export { sampleScreenings };
