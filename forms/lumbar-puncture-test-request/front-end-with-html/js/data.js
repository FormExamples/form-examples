// Sample request data for the lumbar puncture vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / emergency),
// every appropriateness band, and every contraindication band (ok / caution /
// contraindicated). NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form. Includes the required worked cases: a routine
// suspected-MS request, an emergency suspected-meningitis case, a coagulopathy
// contraindication case, and a raised-ICP-needs-imaging case.

(function () {
'use strict';
window.LumbarPunctureTestRequestDashboard =
  window.LumbarPunctureTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'L001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    procedureIntent: 'diagnostic',
    indication: 'suspected-multiple-sclerosis',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'L002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    procedureIntent: 'diagnostic',
    indication: 'suspected-meningitis',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'emergency',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-meningitis-emergency']
  },
  {
    id: 'L003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    procedureIntent: 'diagnostic',
    indication: 'suspected-cns-malignancy',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'contraindicated',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['coagulopathy']
  },
  {
    id: 'L004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    procedureIntent: 'diagnostic',
    indication: 'suspected-subarachnoid-haemorrhage',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'contraindicated',
    triageTier: 'emergency',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-raised-icp-needs-imaging']
  },
  {
    id: 'L005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    procedureIntent: 'therapeutic',
    indication: 'idiopathic-intracranial-hypertension',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'L006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    procedureIntent: 'diagnostic',
    indication: 'suspected-guillain-barre',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['high-bleeding-risk-anticoag']
  },
  {
    id: 'L007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    procedureIntent: 'other',
    indication: 'other',
    appropriatenessBand: 'may-be-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'L008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    procedureIntent: 'diagnostic',
    indication: 'cns-infection',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'caution',
    triageTier: 'emergency',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: ['thrombocytopenia']
  },
  {
    id: 'L009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    procedureIntent: 'therapeutic',
    indication: 'suspected-multiple-sclerosis',
    appropriatenessBand: 'may-be-appropriate',
    contraindicationBand: 'contraindicated',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['local-infection']
  },
  {
    id: 'L010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    procedureIntent: 'diagnostic',
    indication: 'suspected-cns-malignancy',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['high-bleeding-risk-anticoag']
  }
];

window.LumbarPunctureTestRequestDashboard.sampleRequests = sampleRequests;
})();
