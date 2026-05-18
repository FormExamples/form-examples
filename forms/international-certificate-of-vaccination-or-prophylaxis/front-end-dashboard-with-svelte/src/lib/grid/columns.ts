export const COLUMNS = [
  { id: 'serial', header: 'Serial', sort: true, width: 130 },
  { id: 'surname', header: 'Surname', sort: true, width: 130 },
  { id: 'givenNames', header: 'Given names', sort: true, width: 150 },
  { id: 'centre', header: 'Centre', sort: true, width: 220 },
  { id: 'primaryDisease', header: 'Primary disease', sort: true, width: 140 },
  { id: 'entriesCount', header: 'Entries', sort: true, width: 80, align: 'right' as const },
  { id: 'vaccinationDate', header: 'Vaccination date', sort: true, width: 140 },
  { id: 'validityStatus', header: 'Validity', sort: true, width: 100 },
  { id: 'status', header: 'Status', sort: true, width: 100 },
];
