// Sample bill-of-sale data for the review dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. One
// row per persona in `examples/personas.json`, so the dashboard's offline data
// and the persona oracle cannot disagree. The rows span all three completeness
// classes (complete, incomplete, risk-flagged).

/** @type {import('./dashboard-types.js').BillOfSaleRow[]} */
const sampleBillsOfSale = [
  {
    id: '1',
    vin: '2T1BURHE5JC034461',
    vehicle: '2018 Toyota Corolla',
    completenessClass: 'complete',
    leadIssue: '',
    odometerExempt: false,
    sellerName: 'Dana R. Whitfield',
    updatedAt: '2026-09-02'
  },
  {
    id: '2',
    vin: '1HGCM82633A004352',
    vehicle: '2005 Honda Accord',
    completenessClass: 'complete',
    leadIssue: 'odometer-exempt-note',
    odometerExempt: true,
    sellerName: 'Priya Nair',
    updatedAt: '2026-09-03'
  },
  {
    id: '3',
    vin: '4S4BSANC7K3205517',
    vehicle: '2019 Subaru Outback',
    completenessClass: 'incomplete',
    leadIssue: 'odometer-disclosure-missing',
    odometerExempt: false,
    sellerName: 'Elena Kowalski',
    updatedAt: '2026-09-04'
  },
  {
    id: '4',
    vin: '1GCUYDED4KZ123456',
    vehicle: '2019 Chevrolet Silverado 1500',
    completenessClass: 'risk-flagged',
    leadIssue: 'odometer-discrepancy',
    odometerExempt: false,
    sellerName: 'Gary L. Thompson',
    updatedAt: '2026-09-05'
  },
  {
    id: '5',
    vin: '1FTFW1ET5DFC10312',
    vehicle: '2013 Ford F-150',
    completenessClass: 'risk-flagged',
    leadIssue: 'invalid-vin',
    odometerExempt: false,
    sellerName: 'Walter Hayes',
    updatedAt: '2026-09-06'
  },
  {
    id: '6',
    vin: '3TMCZ5AN2MM123456',
    vehicle: '2021 Toyota Tacoma',
    completenessClass: 'complete',
    leadIssue: 'verify-state-rule',
    odometerExempt: false,
    sellerName: 'Ingrid Larsen',
    updatedAt: '2026-09-07'
  },
  {
    id: '7',
    vin: '19XFC2F57GE123456',
    vehicle: '2016 Honda Civic',
    completenessClass: 'complete',
    leadIssue: 'buyer-title-deadline',
    odometerExempt: false,
    sellerName: 'Frank Delaney',
    updatedAt: '2026-09-08'
  },
  {
    id: '8',
    vin: '1C4PJLCB8',
    vehicle: '2016 Jeep Cherokee',
    completenessClass: 'risk-flagged',
    leadIssue: 'odometer-disclosure-missing',
    odometerExempt: false,
    sellerName: 'Beth Carmichael',
    updatedAt: '2026-09-09'
  },
  {
    id: '9',
    vin: '1N4AL2AP9CN123456',
    vehicle: '2012 Nissan Altima',
    completenessClass: 'complete',
    leadIssue: 'state-form',
    odometerExempt: false,
    sellerName: 'Helen Cho',
    updatedAt: '2026-09-10'
  },
  {
    id: '10',
    vin: '1FTYE1CM2LKA12345',
    vehicle: '2020 Ford Transit 150',
    completenessClass: 'incomplete',
    leadIssue: 'release-of-liability',
    odometerExempt: false,
    sellerName: 'Carla Mendes',
    updatedAt: '2026-09-11'
  },
  {
    id: '11',
    vin: '1FVACWDT2HHJA1234',
    vehicle: '2017 Freightliner M2 106',
    completenessClass: 'complete',
    leadIssue: 'odometer-exempt-note',
    odometerExempt: true,
    sellerName: 'Lone Star Haulage LLC',
    updatedAt: '2026-09-12'
  },
  {
    id: '12',
    vin: '1C6RR6FT3ES123456',
    vehicle: '2014 Dodge Ram 1500',
    completenessClass: 'risk-flagged',
    leadIssue: 'odometer-discrepancy',
    odometerExempt: false,
    sellerName: 'Rene Boudreaux',
    updatedAt: '2026-09-13'
  }
];

export { sampleBillsOfSale };
