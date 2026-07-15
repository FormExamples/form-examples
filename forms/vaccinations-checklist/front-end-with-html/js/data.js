// Sample patient data for the clinician dashboard.
//
// Twelve rows spanning all three compliance categories (compliant / partial
// / non-compliant) and all four UK Green Book schedule types (childhood,
// adult, traveller, occupational/NHS staff). NHS numbers in the canonical
// "NNN NNN NNNN" display form. Outstanding vaccinations use realistic
// Green-Book vaccine names so the missing-list cell reads as a clinically
// useful catch-up plan.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  // ── Childhood (0-18) ────────────────────────────────────────────────
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Oliver',
    ageYears: 4,
    ageBand: 'Childhood (0-18)',
    scheduleType: 'Childhood',
    compliance: 'compliant',
    missingVaccinations: []
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Aanya',
    ageYears: 2,
    ageBand: 'Childhood (0-18)',
    scheduleType: 'Childhood',
    compliance: 'partial',
    missingVaccinations: ['MMR dose 2', 'Hib/MenC booster']
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Lily',
    ageYears: 14,
    ageBand: 'Childhood (0-18)',
    scheduleType: 'Childhood',
    compliance: 'non-compliant',
    missingVaccinations: [
      'MMR dose 1',
      'MMR dose 2',
      'Td/IPV teenage booster',
      'MenACWY',
      'HPV course'
    ]
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, Noah',
    ageYears: 12,
    ageBand: 'Childhood (0-18)',
    scheduleType: 'Childhood',
    compliance: 'partial',
    missingVaccinations: ['HPV dose 2']
  },

  // ── Adult (19-64) ───────────────────────────────────────────────────
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    ageYears: 34,
    ageBand: 'Adult (19-64)',
    scheduleType: 'Adult',
    compliance: 'compliant',
    missingVaccinations: []
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    ageYears: 52,
    ageBand: 'Adult (19-64)',
    scheduleType: 'Adult',
    compliance: 'partial',
    missingVaccinations: ['Td/IPV adult booster (overdue)']
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    ageYears: 67,
    ageBand: 'Older Adult (65+)',
    scheduleType: 'Adult',
    compliance: 'non-compliant',
    missingVaccinations: [
      'Pneumococcal (PPV23)',
      'Shingles (Shingrix x2)',
      'Seasonal influenza',
      'COVID-19 autumn booster'
    ]
  },

  // ── Traveller ───────────────────────────────────────────────────────
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    ageYears: 41,
    ageBand: 'Adult (19-64)',
    scheduleType: 'Traveller',
    compliance: 'compliant',
    missingVaccinations: []
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    ageYears: 29,
    ageBand: 'Adult (19-64)',
    scheduleType: 'Traveller',
    compliance: 'partial',
    missingVaccinations: ['Yellow fever', 'Typhoid (oral)']
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    ageYears: 24,
    ageBand: 'Adult (19-64)',
    scheduleType: 'Traveller',
    compliance: 'non-compliant',
    missingVaccinations: [
      'Hepatitis A',
      'Hepatitis B course (3 doses)',
      'Japanese encephalitis',
      'Rabies pre-exposure',
      'Cholera oral'
    ]
  },

  // ── Occupational (NHS staff) ────────────────────────────────────────
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    ageYears: 31,
    ageBand: 'Adult (19-64)',
    scheduleType: 'Occupational',
    compliance: 'partial',
    missingVaccinations: ['Hepatitis B titre (anti-HBs not adequate)', 'Varicella IgG screen']
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    ageYears: 46,
    ageBand: 'Adult (19-64)',
    scheduleType: 'Occupational',
    compliance: 'non-compliant',
    missingVaccinations: [
      'BCG (no scar, IGRA pending)',
      'Hepatitis B primary course',
      'MMR (no documented immunity)',
      'Seasonal influenza (HCW)'
    ]
  }
];

export { samplePatients };
