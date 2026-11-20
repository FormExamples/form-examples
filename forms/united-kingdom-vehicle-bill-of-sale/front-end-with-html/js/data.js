// Sample bill-of-sale data for the sales dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span all three classifications (complete, incomplete, risk-flagged).

/** @type {import('./dashboard-types.js').BillOfSaleRow[]} */
const sampleBillsOfSale = [
  { id: '1', registration: 'LB68 KXR', vehicle: 'Ford Focus', sellerName: 'Hannah Whitfield', buyerName: 'Omar Siddiqui', classification: 'complete', riskFlagCount: 0, missingItemCount: 0, updatedAt: '2026-06-20' },
  { id: '2', registration: 'YK19 TDN', vehicle: 'Vauxhall Corsa', sellerName: 'Peter Lawson', buyerName: 'Chloe Barnes', classification: 'complete', riskFlagCount: 0, missingItemCount: 0, updatedAt: '2026-06-22' },
  { id: '3', registration: 'SN15 OWE', vehicle: 'Honda Civic', sellerName: 'Gareth Pugh', buyerName: 'Mei Tan', classification: 'incomplete', riskFlagCount: 0, missingItemCount: 3, updatedAt: '2026-06-25' },
  { id: '4', registration: 'RX70 HJA', vehicle: 'Nissan Qashqai', sellerName: 'Fiona Maclean', buyerName: 'Daniel Okoro', classification: 'risk-flagged', riskFlagCount: 1, missingItemCount: 0, updatedAt: '2026-06-26' },
  { id: '5', registration: 'BD64 PLM', vehicle: 'Volkswagen Golf', sellerName: 'Terry Holmes', buyerName: 'Sara Ahmed', classification: 'risk-flagged', riskFlagCount: 2, missingItemCount: 2, updatedAt: '2026-06-27' },
  { id: '6', registration: 'MK21 FZC', vehicle: 'Tesla Model 3', sellerName: 'Anita Rao', buyerName: 'Luke Fraser', classification: 'complete', riskFlagCount: 0, missingItemCount: 0, updatedAt: '2026-06-28' },
  { id: '7', registration: 'CP12 EBT', vehicle: 'Mini Cooper', sellerName: 'Neil Gardner', buyerName: '', classification: 'incomplete', riskFlagCount: 0, missingItemCount: 9, updatedAt: '2026-06-29' }
];

export { sampleBillsOfSale };
