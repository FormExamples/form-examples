// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every NICE NG201 risk level and care pathway,
// with mental health flags set for a subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form. Gestational ages cover all three trimesters.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    gestationalAgeWeeks: 12,
    estimatedDeliveryDate: '2026-11-10',
    riskLevel: 'Low Risk',
    carePathway: 'Midwifery-led',
    mentalHealthFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    gestationalAgeWeeks: 28,
    estimatedDeliveryDate: '2026-07-22',
    riskLevel: 'Moderate Risk',
    carePathway: 'Obstetrician-led',
    mentalHealthFlag: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    gestationalAgeWeeks: 34,
    estimatedDeliveryDate: '2026-06-05',
    riskLevel: 'High Risk',
    carePathway: 'Multidisciplinary',
    mentalHealthFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, Sophie',
    gestationalAgeWeeks: 8,
    estimatedDeliveryDate: '2026-12-15',
    riskLevel: 'Low Risk',
    carePathway: 'Midwifery-led',
    mentalHealthFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    gestationalAgeWeeks: 32,
    estimatedDeliveryDate: '2026-06-28',
    riskLevel: 'High Risk',
    carePathway: 'Multidisciplinary',
    mentalHealthFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, Hannah',
    gestationalAgeWeeks: 20,
    estimatedDeliveryDate: '2026-09-15',
    riskLevel: 'Low Risk',
    carePathway: 'Midwifery-led',
    mentalHealthFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    gestationalAgeWeeks: 36,
    estimatedDeliveryDate: '2026-05-20',
    riskLevel: 'High Risk',
    carePathway: 'Obstetrician-led',
    mentalHealthFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Charlotte',
    gestationalAgeWeeks: 24,
    estimatedDeliveryDate: '2026-08-12',
    riskLevel: 'Moderate Risk',
    carePathway: 'Obstetrician-led',
    mentalHealthFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    gestationalAgeWeeks: 30,
    estimatedDeliveryDate: '2026-07-08',
    riskLevel: 'Moderate Risk',
    carePathway: 'Obstetrician-led',
    mentalHealthFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Olivia',
    gestationalAgeWeeks: 16,
    estimatedDeliveryDate: '2026-10-04',
    riskLevel: 'Low Risk',
    carePathway: 'Midwifery-led',
    mentalHealthFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    gestationalAgeWeeks: 38,
    estimatedDeliveryDate: '2026-05-09',
    riskLevel: 'Moderate Risk',
    carePathway: 'Obstetrician-led',
    mentalHealthFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, Grace',
    gestationalAgeWeeks: 26,
    estimatedDeliveryDate: '2026-08-01',
    riskLevel: 'High Risk',
    carePathway: 'Multidisciplinary',
    mentalHealthFlag: true
  }
];

export { samplePatients };
