// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every Clavien-Dindo grade and a range of
// procedures, surgeons, and dispositions; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    procedureName: 'Laparoscopic cholecystectomy',
    procedureCategory: 'General surgery',
    surgeon: 'Patel, Anil',
    operationDate: '2026-04-12',
    estimatedBloodLossMl: 50,
    clavienDindoGrade: 'Grade 0',
    disposition: 'Discharged',
    flagged: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    procedureName: 'Total hip arthroplasty (right)',
    procedureCategory: 'Orthopaedic',
    surgeon: 'O\u2019Connor, Liam',
    operationDate: '2026-04-14',
    estimatedBloodLossMl: 320,
    clavienDindoGrade: 'Grade I',
    disposition: 'Ward',
    flagged: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    procedureName: 'Open right hemicolectomy',
    procedureCategory: 'Colorectal',
    surgeon: 'Khan, Sara',
    operationDate: '2026-04-15',
    estimatedBloodLossMl: 480,
    clavienDindoGrade: 'Grade II',
    disposition: 'HDU',
    flagged: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    procedureName: 'Inguinal hernia repair',
    procedureCategory: 'General surgery',
    surgeon: 'Patel, Anil',
    operationDate: '2026-04-16',
    estimatedBloodLossMl: 30,
    clavienDindoGrade: 'Grade 0',
    disposition: 'Discharged',
    flagged: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    procedureName: 'Emergency laparotomy for perforated duodenal ulcer',
    procedureCategory: 'General surgery',
    surgeon: 'Khan, Sara',
    operationDate: '2026-04-17',
    estimatedBloodLossMl: 1200,
    clavienDindoGrade: 'Grade IVa',
    disposition: 'ICU',
    flagged: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    procedureName: 'Knee arthroscopy with meniscectomy',
    procedureCategory: 'Orthopaedic',
    surgeon: 'O\u2019Connor, Liam',
    operationDate: '2026-04-18',
    estimatedBloodLossMl: 25,
    clavienDindoGrade: 'Grade 0',
    disposition: 'Discharged',
    flagged: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    procedureName: 'Coronary artery bypass graft x3',
    procedureCategory: 'Cardiothoracic',
    surgeon: 'Nakamura, Hiro',
    operationDate: '2026-04-19',
    estimatedBloodLossMl: 750,
    clavienDindoGrade: 'Grade IIIb',
    disposition: 'ICU',
    flagged: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    procedureName: 'Transurethral resection of prostate',
    procedureCategory: 'Urology',
    surgeon: 'Adeyemi, Tobi',
    operationDate: '2026-04-20',
    estimatedBloodLossMl: 220,
    clavienDindoGrade: 'Grade I',
    disposition: 'Ward',
    flagged: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    procedureName: 'Caesarean section (LSCS)',
    procedureCategory: 'Obstetric',
    surgeon: 'McGregor, Fiona',
    operationDate: '2026-04-21',
    estimatedBloodLossMl: 600,
    clavienDindoGrade: 'Grade II',
    disposition: 'Ward',
    flagged: true
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    procedureName: 'Drainage of perianal abscess',
    procedureCategory: 'Colorectal',
    surgeon: 'Khan, Sara',
    operationDate: '2026-04-22',
    estimatedBloodLossMl: 40,
    clavienDindoGrade: 'Grade IIIa',
    disposition: 'Ward',
    flagged: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    procedureName: 'Craniotomy for evacuation of subdural haematoma',
    procedureCategory: 'Neurosurgery',
    surgeon: 'Nakamura, Hiro',
    operationDate: '2026-04-23',
    estimatedBloodLossMl: 350,
    clavienDindoGrade: 'Grade IVb',
    disposition: 'ICU',
    flagged: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    procedureName: 'Ruptured abdominal aortic aneurysm repair',
    procedureCategory: 'Vascular',
    surgeon: 'Adeyemi, Tobi',
    operationDate: '2026-04-24',
    estimatedBloodLossMl: 3200,
    clavienDindoGrade: 'Grade V',
    disposition: 'Deceased',
    flagged: true
  }
];

export { samplePatients };
