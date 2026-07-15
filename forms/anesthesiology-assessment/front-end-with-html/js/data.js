// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every composite-risk band, every ASA grade
// in routine clinical use, every Mallampati class, with difficult-airway
// flags on a representative subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    surgeryType: 'Laparoscopic cholecystectomy',
    asaGrade: 'I',
    mallampatiClass: 'I',
    rcriScore: 0,
    stopBangScore: 1,
    compositeRisk: 'Low',
    difficultAirwayFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    surgeryType: 'Total hip replacement',
    asaGrade: 'II',
    mallampatiClass: 'II',
    rcriScore: 1,
    stopBangScore: 2,
    compositeRisk: 'Low',
    difficultAirwayFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    surgeryType: 'Coronary artery bypass graft',
    asaGrade: 'III',
    mallampatiClass: 'III',
    rcriScore: 3,
    stopBangScore: 5,
    compositeRisk: 'High',
    difficultAirwayFlag: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    surgeryType: 'Inguinal hernia repair',
    asaGrade: 'II',
    mallampatiClass: 'I',
    rcriScore: 0,
    stopBangScore: 3,
    compositeRisk: 'Moderate',
    difficultAirwayFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    surgeryType: 'Emergency laparotomy',
    asaGrade: 'IV',
    mallampatiClass: 'IV',
    rcriScore: 4,
    stopBangScore: 6,
    compositeRisk: 'Critical',
    difficultAirwayFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    surgeryType: 'Cataract extraction',
    asaGrade: 'I',
    mallampatiClass: 'II',
    rcriScore: 0,
    stopBangScore: 0,
    compositeRisk: 'Low',
    difficultAirwayFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    surgeryType: 'Abdominal aortic aneurysm repair',
    asaGrade: 'IV',
    mallampatiClass: 'III',
    rcriScore: 5,
    stopBangScore: 7,
    compositeRisk: 'Critical',
    difficultAirwayFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    surgeryType: 'Knee arthroscopy',
    asaGrade: 'II',
    mallampatiClass: 'II',
    rcriScore: 1,
    stopBangScore: 4,
    compositeRisk: 'Moderate',
    difficultAirwayFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    surgeryType: 'Carotid endarterectomy',
    asaGrade: 'III',
    mallampatiClass: 'II',
    rcriScore: 2,
    stopBangScore: 5,
    compositeRisk: 'High',
    difficultAirwayFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    surgeryType: 'Tonsillectomy',
    asaGrade: 'I',
    mallampatiClass: 'I',
    rcriScore: 0,
    stopBangScore: 1,
    compositeRisk: 'Low',
    difficultAirwayFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    surgeryType: 'Caesarean section',
    asaGrade: 'II',
    mallampatiClass: 'III',
    rcriScore: 0,
    stopBangScore: 3,
    compositeRisk: 'Moderate',
    difficultAirwayFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    surgeryType: 'Bowel resection',
    asaGrade: 'III',
    mallampatiClass: 'III',
    rcriScore: 2,
    stopBangScore: 5,
    compositeRisk: 'High',
    difficultAirwayFlag: false
  }
];

export { samplePatients };
