// Sample patient data for the palliative MDT clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every ESAS-r severity band (None / Mild /
// Moderate / Severe), every diagnosis-category bucket (Cancer, Heart
// Failure, COPD, Dementia, Neurological), all three PPS bands (High /
// Moderate / Low), and every care setting (Home, Hospice, Hospital, Care
// Home). NHS numbers are in the canonical "NNN NNN NNNN" display form.
//
// Per-symptom scores are realistic for the chosen total — high totals carry
// at least one symptom >= 7 (the grader's individual-flag threshold) and
// low totals carry none. Each score is 0-10; the ten-symptom sum equals
// `esasTotal`.

(function () {
'use strict';
window.PalliativeAssessmentDashboard = window.PalliativeAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Ahmed, Yusuf',
    esasTotal: 78,
    severityBand: 'Severe',
    primaryDiagnosis: 'Metastatic pancreatic adenocarcinoma',
    diagnosisCategory: 'Cancer',
    pps: 30,
    ppsBand: 'Low',
    setting: 'Hospice',
    symptoms: {
      pain: 9, tiredness: 9, drowsiness: 8, nausea: 8, appetite: 9,
      shortnessOfBreath: 7, depression: 6, anxiety: 8, wellbeing: 9, other: 5
    }
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Brown, Sarah',
    esasTotal: 64,
    severityBand: 'Severe',
    primaryDiagnosis: 'NYHA IV congestive heart failure',
    diagnosisCategory: 'Heart Failure',
    pps: 40,
    ppsBand: 'Moderate',
    setting: 'Hospital',
    symptoms: {
      pain: 5, tiredness: 8, drowsiness: 6, nausea: 4, appetite: 7,
      shortnessOfBreath: 9, depression: 6, anxiety: 7, wellbeing: 8, other: 4
    }
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Clark, George',
    esasTotal: 88,
    severityBand: 'Severe',
    primaryDiagnosis: 'Glioblastoma multiforme, post-resection',
    diagnosisCategory: 'Neurological',
    pps: 20,
    ppsBand: 'Low',
    setting: 'Hospice',
    symptoms: {
      pain: 8, tiredness: 10, drowsiness: 9, nausea: 8, appetite: 9,
      shortnessOfBreath: 7, depression: 9, anxiety: 9, wellbeing: 10, other: 9
    }
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Davies, Helen',
    esasTotal: 52,
    severityBand: 'Moderate',
    primaryDiagnosis: 'Stage IV non-small-cell lung cancer',
    diagnosisCategory: 'Cancer',
    pps: 50,
    ppsBand: 'Moderate',
    setting: 'Home',
    symptoms: {
      pain: 6, tiredness: 7, drowsiness: 5, nausea: 4, appetite: 6,
      shortnessOfBreath: 8, depression: 4, anxiety: 5, wellbeing: 5, other: 2
    }
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Evans, Catherine',
    esasTotal: 41,
    severityBand: 'Moderate',
    primaryDiagnosis: 'End-stage COPD with home oxygen',
    diagnosisCategory: 'COPD',
    pps: 50,
    ppsBand: 'Moderate',
    setting: 'Home',
    symptoms: {
      pain: 3, tiredness: 6, drowsiness: 4, nausea: 1, appetite: 4,
      shortnessOfBreath: 9, depression: 5, anxiety: 6, wellbeing: 3, other: 0
    }
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Foster, Margaret',
    esasTotal: 37,
    severityBand: 'Moderate',
    primaryDiagnosis: 'Advanced Alzheimer-type dementia',
    diagnosisCategory: 'Dementia',
    pps: 30,
    ppsBand: 'Low',
    setting: 'Care Home',
    symptoms: {
      pain: 4, tiredness: 6, drowsiness: 5, nausea: 2, appetite: 5,
      shortnessOfBreath: 2, depression: 3, anxiety: 4, wellbeing: 5, other: 1
    }
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Garcia, Maria',
    esasTotal: 32,
    severityBand: 'Moderate',
    primaryDiagnosis: 'Motor neurone disease (ALS)',
    diagnosisCategory: 'Neurological',
    pps: 40,
    ppsBand: 'Moderate',
    setting: 'Home',
    symptoms: {
      pain: 3, tiredness: 5, drowsiness: 3, nausea: 1, appetite: 4,
      shortnessOfBreath: 7, depression: 4, anxiety: 3, wellbeing: 2, other: 0
    }
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Hughes, Robert',
    esasTotal: 26,
    severityBand: 'Mild',
    primaryDiagnosis: 'Stable metastatic prostate cancer',
    diagnosisCategory: 'Cancer',
    pps: 70,
    ppsBand: 'High',
    setting: 'Home',
    symptoms: {
      pain: 4, tiredness: 5, drowsiness: 2, nausea: 1, appetite: 3,
      shortnessOfBreath: 2, depression: 3, anxiety: 3, wellbeing: 3, other: 0
    }
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Ibrahim, Amira',
    esasTotal: 18,
    severityBand: 'Mild',
    primaryDiagnosis: 'Compensated NYHA III heart failure',
    diagnosisCategory: 'Heart Failure',
    pps: 70,
    ppsBand: 'High',
    setting: 'Home',
    symptoms: {
      pain: 2, tiredness: 4, drowsiness: 2, nausea: 0, appetite: 2,
      shortnessOfBreath: 3, depression: 1, anxiety: 2, wellbeing: 2, other: 0
    }
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Jones, Margaret',
    esasTotal: 12,
    severityBand: 'Mild',
    primaryDiagnosis: 'GOLD III COPD on inhaled therapy',
    diagnosisCategory: 'COPD',
    pps: 80,
    ppsBand: 'High',
    setting: 'Home',
    symptoms: {
      pain: 1, tiredness: 3, drowsiness: 1, nausea: 0, appetite: 1,
      shortnessOfBreath: 4, depression: 1, anxiety: 1, wellbeing: 0, other: 0
    }
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Khan, Faisal',
    esasTotal: 8,
    severityBand: 'None',
    primaryDiagnosis: 'Mild Parkinson disease, well controlled',
    diagnosisCategory: 'Neurological',
    pps: 90,
    ppsBand: 'High',
    setting: 'Home',
    symptoms: {
      pain: 1, tiredness: 2, drowsiness: 1, nausea: 0, appetite: 0,
      shortnessOfBreath: 1, depression: 1, anxiety: 1, wellbeing: 1, other: 0
    }
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Lewis, Dorothy',
    esasTotal: 4,
    severityBand: 'None',
    primaryDiagnosis: 'Vascular dementia, stable',
    diagnosisCategory: 'Dementia',
    pps: 60,
    ppsBand: 'Moderate',
    setting: 'Care Home',
    symptoms: {
      pain: 0, tiredness: 1, drowsiness: 1, nausea: 0, appetite: 1,
      shortnessOfBreath: 0, depression: 1, anxiety: 0, wellbeing: 0, other: 0
    }
  }
];

window.PalliativeAssessmentDashboard.samplePatients = samplePatients;
})();
