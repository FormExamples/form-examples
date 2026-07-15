// Sample site data for the safety officer dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every outcome category and every site type
// listed in `forms/workplace-safety-assessment/AGENTS.md`, with a realistic
// distribution of last-audit dates and open-action counts.

/** @type {import('./types.js').SiteRow[]} */
const sampleSites = [
  {
    id: '1',
    siteName: 'St. Thomas\u2019 Hospital',
    location: 'London',
    siteType: 'NHS Hospital',
    outcome: 'Major Findings',
    lastAuditDate: '2026-03-12',
    openActions: 7,
    auditor: 'Khan, Aisha'
  },
  {
    id: '2',
    siteName: 'Riverside GP Practice',
    location: 'Leeds',
    siteType: 'GP Practice',
    outcome: 'Compliant',
    lastAuditDate: '2026-04-22',
    openActions: 0,
    auditor: 'Murphy, Liam'
  },
  {
    id: '3',
    siteName: 'Beechwood Mental Health Unit',
    location: 'Manchester',
    siteType: 'Mental Health Unit',
    outcome: 'Critical Findings',
    lastAuditDate: '2026-04-29',
    openActions: 12,
    auditor: 'Owusu, Daniel'
  },
  {
    id: '4',
    siteName: 'High Street Dental Practice',
    location: 'Bristol',
    siteType: 'Dental Practice',
    outcome: 'Minor Findings',
    lastAuditDate: '2026-02-08',
    openActions: 2,
    auditor: 'Williams, Bethan'
  },
  {
    id: '5',
    siteName: 'Greenfield Community Pharmacy',
    location: 'Cardiff',
    siteType: 'Community Pharmacy',
    outcome: 'Compliant',
    lastAuditDate: '2026-03-30',
    openActions: 0,
    auditor: 'Reid, Fiona'
  },
  {
    id: '6',
    siteName: 'Northgate Ambulance Station',
    location: 'Newcastle',
    siteType: 'Ambulance Station',
    outcome: 'Major Findings',
    lastAuditDate: '2025-12-14',
    openActions: 5,
    auditor: 'Patel, Rohan'
  },
  {
    id: '7',
    siteName: 'Oakwood Care Home',
    location: 'Birmingham',
    siteType: 'Care Home',
    outcome: 'Critical Findings',
    lastAuditDate: '2026-04-18',
    openActions: 9,
    auditor: 'O\u2019Connor, Niamh'
  },
  {
    id: '8',
    siteName: 'Bluebell Hospice',
    location: 'Sheffield',
    siteType: 'Hospice',
    outcome: 'Minor Findings',
    lastAuditDate: '2026-01-25',
    openActions: 3,
    auditor: 'Hughes, Elinor'
  },
  {
    id: '9',
    siteName: 'Royal Infirmary',
    location: 'Edinburgh',
    siteType: 'NHS Hospital',
    outcome: 'Compliant',
    lastAuditDate: '2026-04-10',
    openActions: 0,
    auditor: 'MacLeod, Iain'
  },
  {
    id: '10',
    siteName: 'Hillcrest GP Practice',
    location: 'Nottingham',
    siteType: 'GP Practice',
    outcome: 'Minor Findings',
    lastAuditDate: '2025-11-04',
    openActions: 4,
    auditor: 'Brown, Alice'
  },
  {
    id: '11',
    siteName: 'Lakeside Care Home',
    location: 'Liverpool',
    siteType: 'Care Home',
    outcome: 'Major Findings',
    lastAuditDate: '2024-10-19',
    openActions: 8,
    auditor: 'Singh, Harpreet'
  },
  {
    id: '12',
    siteName: 'Meadowview Dental Practice',
    location: 'Glasgow',
    siteType: 'Dental Practice',
    outcome: 'Compliant',
    lastAuditDate: '2026-04-02',
    openActions: 0,
    auditor: 'Campbell, Ross'
  }
];

export { sampleSites };
