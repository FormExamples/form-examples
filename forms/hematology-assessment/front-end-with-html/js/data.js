// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every abnormality level (normal through
// critical) and the full score range, with flagged issues counted for a
// subset; MRN values in the canonical "MRN-NNNNNNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    patientName: 'Smith, John',
    mrn: 'MRN-20260001',
    specimenDate: '2026-03-01',
    referringPhysician: 'Dr. A. Patel',
    abnormalityLevel: 'normal',
    abnormalityScore: 0,
    diagnosis: 'Normal CBC, no abnormalities',
    flagCount: 0
  },
  {
    id: '2',
    patientName: 'Patel, Priya',
    mrn: 'MRN-20260002',
    specimenDate: '2026-03-05',
    referringPhysician: 'Dr. M. Khan',
    abnormalityLevel: 'mildAbnormality',
    abnormalityScore: 12,
    diagnosis: 'Mild microcytic anaemia',
    flagCount: 1
  },
  {
    id: '3',
    patientName: 'Jones, Margaret',
    mrn: 'MRN-20260003',
    specimenDate: '2026-03-03',
    referringPhysician: 'Dr. S. Williams',
    abnormalityLevel: 'severeAbnormality',
    abnormalityScore: 68,
    diagnosis: 'Pancytopenia - suspected aplastic anaemia',
    flagCount: 4
  },
  {
    id: '4',
    patientName: 'Williams, David',
    mrn: 'MRN-20260004',
    specimenDate: '2026-02-18',
    referringPhysician: 'Dr. H. Singh',
    abnormalityLevel: 'normal',
    abnormalityScore: 0,
    diagnosis: 'Normal haematological profile',
    flagCount: 0
  },
  {
    id: '5',
    patientName: 'Brown, Sarah',
    mrn: 'MRN-20260005',
    specimenDate: '2026-02-25',
    referringPhysician: 'Dr. L. Chen',
    abnormalityLevel: 'moderateAbnormality',
    abnormalityScore: 35,
    diagnosis: 'Iron deficiency anaemia with thrombocytosis',
    flagCount: 2
  },
  {
    id: '6',
    patientName: 'Taylor, James',
    mrn: 'MRN-20260006',
    specimenDate: '2026-03-08',
    referringPhysician: 'Dr. R. Thompson',
    abnormalityLevel: 'critical',
    abnormalityScore: 82,
    diagnosis: 'DIC with severe thrombocytopenia',
    flagCount: 6
  },
  {
    id: '7',
    patientName: 'Davies, Helen',
    mrn: 'MRN-20260007',
    specimenDate: '2026-01-28',
    referringPhysician: 'Dr. J. Murray',
    abnormalityLevel: 'normal',
    abnormalityScore: 0,
    diagnosis: 'Normal coagulation profile',
    flagCount: 0
  },
  {
    id: '8',
    patientName: 'Wilson, Robert',
    mrn: 'MRN-20260008',
    specimenDate: '2026-03-02',
    referringPhysician: 'Dr. E. Baker',
    abnormalityLevel: 'mildAbnormality',
    abnormalityScore: 18,
    diagnosis: 'Macrocytosis - B12 deficiency suspected',
    flagCount: 1
  },
  {
    id: '9',
    patientName: 'Evans, Catherine',
    mrn: 'MRN-20260009',
    specimenDate: '2026-03-06',
    referringPhysician: 'Dr. P. Gupta',
    abnormalityLevel: 'critical',
    abnormalityScore: 88,
    diagnosis: 'Acute leukaemia - urgent referral',
    flagCount: 8
  },
  {
    id: '10',
    patientName: 'Thomas, Michael',
    mrn: 'MRN-20260010',
    specimenDate: '2026-03-10',
    referringPhysician: 'Dr. N. Osei',
    abnormalityLevel: 'normal',
    abnormalityScore: 0,
    diagnosis: 'Routine screening - all normal',
    flagCount: 0
  },
  {
    id: '11',
    patientName: 'Robinson, Emma',
    mrn: 'MRN-20260011',
    specimenDate: '2026-02-25',
    referringPhysician: 'Dr. C. Flores',
    abnormalityLevel: 'mildAbnormality',
    abnormalityScore: 15,
    diagnosis: 'Mild leukopenia - monitoring',
    flagCount: 1
  },
  {
    id: '12',
    patientName: 'Hall, Richard',
    mrn: 'MRN-20260012',
    specimenDate: '2026-03-11',
    referringPhysician: 'Dr. B. Nair',
    abnormalityLevel: 'severeAbnormality',
    abnormalityScore: 72,
    diagnosis: 'Iron overload - haemochromatosis suspected',
    flagCount: 3
  }
];

export { samplePatients };
