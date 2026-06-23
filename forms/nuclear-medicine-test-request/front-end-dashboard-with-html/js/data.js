// Sample request data for the nuclear medicine vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, every preparation & radiation-safety
// band, and every radiation-dose band. NHS numbers are placeholder values in
// the canonical "NNN NNN NNNN" display form. Includes the required worked
// cases: a routine bone scan, a pregnancy case, a breastfeeding case, and a
// high-radiation-dose case.

(function () {
'use strict';
window.NuclearMedicineTestRequestDashboard =
  window.NuclearMedicineTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'N001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    scanType: 'bone-scan',
    indication: 'suspected-bone-metastases',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'N002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    scanType: 'thyroid-uptake',
    indication: 'thyroid-function',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'contraindicated',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['pregnancy']
  },
  {
    id: 'N003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    scanType: 'renal-mag3',
    indication: 'renal-function',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'caution',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['breastfeeding']
  },
  {
    id: 'N004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    scanType: 'gallium-octreotide',
    indication: 'tumour-localisation',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'caution',
    radiationDoseBand: 'high',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['high-radiation-dose']
  },
  {
    id: 'N005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    scanType: 'vq-lung-scan',
    indication: 'pulmonary-embolism',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'low',
    triageTier: 'emergency',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'N006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    scanType: 'white-cell-scan',
    indication: 'infection-localisation',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'caution',
    radiationDoseBand: 'moderate',
    triageTier: 'urgent',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: ['recent-radionuclide-interference']
  },
  {
    id: 'N007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    scanType: 'sentinel-node',
    indication: 'follow-up',
    appropriatenessBand: 'may-be-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'N008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    scanType: 'myocardial-perfusion',
    indication: 'cardiac-ischaemia',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'caution',
    radiationDoseBand: 'high',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['high-radiation-dose']
  },
  {
    id: 'N009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    scanType: 'bone-scan',
    indication: 'cardiac-ischaemia',
    appropriatenessBand: 'usually-not-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'moderate',
    triageTier: 'urgent',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'N010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    scanType: 'renal-dmsa',
    indication: 'renal-function',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

window.NuclearMedicineTestRequestDashboard.sampleRequests = sampleRequests;
})();
