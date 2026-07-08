// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every ASA grade (I-VI) and a representative
// mix of allergy comorbidities, previous-anaesthesia adverse incidents, and
// safety-flag counts. NHS numbers in the canonical "NNN NNN NNNN" display
// form.

(function () {
'use strict';
window.PreOperativeAssessmentByPatientDashboard =
  window.PreOperativeAssessmentByPatientDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    procedure: 'Inguinal hernia repair',
    asaGrade: 'I',
    flagCount: 0,
    allergyFlag: false,
    adverseIncidentFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    procedure: 'Laparoscopic cholecystectomy',
    asaGrade: 'II',
    flagCount: 1,
    allergyFlag: true,
    adverseIncidentFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    procedure: 'Total knee replacement',
    asaGrade: 'III',
    flagCount: 4,
    allergyFlag: false,
    adverseIncidentFlag: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    procedure: 'Tonsillectomy',
    asaGrade: 'I',
    flagCount: 0,
    allergyFlag: false,
    adverseIncidentFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    procedure: 'CABG x3',
    asaGrade: 'IV',
    flagCount: 7,
    allergyFlag: true,
    adverseIncidentFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    procedure: 'Cataract extraction',
    asaGrade: 'II',
    flagCount: 2,
    allergyFlag: false,
    adverseIncidentFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    procedure: 'Hip arthroplasty',
    asaGrade: 'III',
    flagCount: 5,
    allergyFlag: true,
    adverseIncidentFlag: false
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    procedure: 'Colorectal resection',
    asaGrade: 'III',
    flagCount: 3,
    allergyFlag: false,
    adverseIncidentFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    procedure: 'Emergency laparotomy',
    asaGrade: 'V',
    flagCount: 9,
    allergyFlag: false,
    adverseIncidentFlag: true
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    procedure: 'Carpal tunnel release',
    asaGrade: 'II',
    flagCount: 1,
    allergyFlag: false,
    adverseIncidentFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    procedure: 'Caesarean section',
    asaGrade: 'II',
    flagCount: 2,
    allergyFlag: true,
    adverseIncidentFlag: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    procedure: 'Organ retrieval (donor)',
    asaGrade: 'VI',
    flagCount: 6,
    allergyFlag: false,
    adverseIncidentFlag: false
  }
];

window.PreOperativeAssessmentByPatientDashboard.samplePatients = samplePatients;
})();
