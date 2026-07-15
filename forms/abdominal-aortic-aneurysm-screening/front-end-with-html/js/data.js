// Sample screening data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span every aneurysm category (normal, small, medium, large,
// non-visualised), with the referral flag set whenever a vascular referral is
// indicated (large aneurysm or a symptomatic aneurysm).

/** @type {import('./dashboard-types.js').ScreeningRow[]} */
const sampleScreenings = [
  {
    id: '1',
    patientIdentifier: 'AAA-100482',
    patientName: 'Osei, Grace',
    clinicSite: 'Riverside Community Clinic',
    maxAorticDiameterCm: 2.4,
    category: 'normal',
    surveillanceBand: 'discharge',
    referralFlag: false,
    scannedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'AAA-573110',
    patientName: 'Mackenzie, Ian',
    clinicSite: 'City General Hospital',
    maxAorticDiameterCm: 3.6,
    category: 'small',
    surveillanceBand: 'annual',
    referralFlag: false,
    scannedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'AAA-100517',
    patientName: 'Nowak, Zofia',
    clinicSite: 'Riverside Community Clinic',
    maxAorticDiameterCm: 4.8,
    category: 'medium',
    surveillanceBand: 'three-monthly',
    referralFlag: false,
    scannedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'AAA-100628',
    patientName: 'Ahmed, Bilal',
    clinicSite: 'City General Hospital',
    maxAorticDiameterCm: 5.9,
    category: 'large',
    surveillanceBand: 'refer-vascular',
    referralFlag: true,
    scannedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'AAA-573642',
    patientName: 'Fletcher, Rosemary',
    clinicSite: 'Harbour Health Centre',
    maxAorticDiameterCm: 4.2,
    category: 'small',
    surveillanceBand: 'annual',
    referralFlag: true,
    scannedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'AAA-880204',
    patientName: 'Silva, Marcos',
    clinicSite: 'Harbour Health Centre',
    maxAorticDiameterCm: 2.7,
    category: 'normal',
    surveillanceBand: 'discharge',
    referralFlag: false,
    scannedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'AAA-880351',
    patientName: 'Byrne, Aoife',
    clinicSite: 'City General Hospital',
    maxAorticDiameterCm: null,
    category: 'non-visualised',
    surveillanceBand: 'rescan',
    referralFlag: false,
    scannedAt: '2026-06-28'
  }
];

export { sampleScreenings };
