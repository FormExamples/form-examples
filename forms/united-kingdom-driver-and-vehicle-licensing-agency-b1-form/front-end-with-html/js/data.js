// Sample applicant data for the DVLA B1 clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans complete and partial validation, both
// epilepsy declarations, and a range of high-priority flag counts.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    applicantName: 'Ashworth, Daniel',
    dateOfBirth: '1958-03-14',
    drivingLicenceNumber: 'ASHWO603148D99AB',
    conditionsDeclared: 1,
    epilepsyDeclared: false,
    validationCompleteness: 100,
    highPriorityFlagCount: 0,
    submittedAt: '2026-04-22T09:14:00Z'
  },
  {
    id: '2',
    applicantName: 'Bevan, Catrin',
    dateOfBirth: '1972-11-02',
    drivingLicenceNumber: 'BEVAN711029C97CD',
    conditionsDeclared: 2,
    epilepsyDeclared: true,
    validationCompleteness: 100,
    highPriorityFlagCount: 1,
    submittedAt: '2026-04-21T14:32:00Z'
  },
  {
    id: '3',
    applicantName: 'Carmichael, Hugh',
    dateOfBirth: '1965-07-19',
    drivingLicenceNumber: 'CARMI657192H88EF',
    conditionsDeclared: 3,
    epilepsyDeclared: true,
    validationCompleteness: 92,
    highPriorityFlagCount: 3,
    submittedAt: '2026-04-20T11:08:00Z'
  },
  {
    id: '4',
    applicantName: 'Davies, Eira',
    dateOfBirth: '1981-02-25',
    drivingLicenceNumber: 'DAVIE802254E15GH',
    conditionsDeclared: 1,
    epilepsyDeclared: false,
    validationCompleteness: 78,
    highPriorityFlagCount: 0,
    submittedAt: '2026-04-19T16:47:00Z'
  },
  {
    id: '5',
    applicantName: 'Ellington, Marcus',
    dateOfBirth: '1949-09-30',
    drivingLicenceNumber: 'ELLIN499308M52IJ',
    conditionsDeclared: 4,
    epilepsyDeclared: false,
    validationCompleteness: 100,
    highPriorityFlagCount: 2,
    submittedAt: '2026-04-18T08:21:00Z'
  },
  {
    id: '6',
    applicantName: 'Fletcher, Imogen',
    dateOfBirth: '1990-12-08',
    drivingLicenceNumber: 'FLETC912088I21KL',
    conditionsDeclared: 1,
    epilepsyDeclared: true,
    validationCompleteness: 100,
    highPriorityFlagCount: 0,
    submittedAt: '2026-04-17T13:55:00Z'
  },
  {
    id: '7',
    applicantName: 'Goodwin, Reuben',
    dateOfBirth: '1955-05-17',
    drivingLicenceNumber: 'GOODW555170R74MN',
    conditionsDeclared: 2,
    epilepsyDeclared: false,
    validationCompleteness: 65,
    highPriorityFlagCount: 1,
    submittedAt: '2026-04-16T10:03:00Z'
  },
  {
    id: '8',
    applicantName: 'Hargreaves, Saoirse',
    dateOfBirth: '1976-08-04',
    drivingLicenceNumber: 'HARGR760843S33OP',
    conditionsDeclared: 0,
    epilepsyDeclared: false,
    validationCompleteness: 100,
    highPriorityFlagCount: 0,
    submittedAt: '2026-04-15T17:29:00Z'
  },
  {
    id: '9',
    applicantName: 'Iqbal, Tariq',
    dateOfBirth: '1962-01-22',
    drivingLicenceNumber: 'IQBAL622217T68QR',
    conditionsDeclared: 5,
    epilepsyDeclared: true,
    validationCompleteness: 88,
    highPriorityFlagCount: 4,
    submittedAt: '2026-04-14T12:11:00Z'
  },
  {
    id: '10',
    applicantName: 'Jenkins, Olwen',
    dateOfBirth: '1985-06-11',
    drivingLicenceNumber: 'JENKI856110O40ST',
    conditionsDeclared: 1,
    epilepsyDeclared: false,
    validationCompleteness: 100,
    highPriorityFlagCount: 0,
    submittedAt: '2026-04-13T15:42:00Z'
  },
  {
    id: '11',
    applicantName: 'Kowalski, Piotr',
    dateOfBirth: '1968-04-28',
    drivingLicenceNumber: 'KOWAL684288P19UV',
    conditionsDeclared: 2,
    epilepsyDeclared: false,
    validationCompleteness: 54,
    highPriorityFlagCount: 2,
    submittedAt: '2026-04-12T09:36:00Z'
  },
  {
    id: '12',
    applicantName: 'Llewellyn, Megan',
    dateOfBirth: '1993-10-15',
    drivingLicenceNumber: 'LLEWE931150M07WX',
    conditionsDeclared: 1,
    epilepsyDeclared: true,
    validationCompleteness: 100,
    highPriorityFlagCount: 1,
    submittedAt: '2026-04-11T18:04:00Z'
  }
];

export { samplePatients };
