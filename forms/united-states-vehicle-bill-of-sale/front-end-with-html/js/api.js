// Backend API client for the United States Vehicle Bill of Sale review dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Axum / axum); the dashboard endpoint returns a
// `DashboardBillsOfSaleResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const BILLS_OF_SALE_PATH = '/api/united-states-vehicle-bill-of-sale/dashboard/bills-of-sale';

/**
 * Fetch the bill-of-sale list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').BillOfSaleRow[]>}
 */
async function fetchBillsOfSale() {
  const res = await fetch(`${API_BASE}${BILLS_OF_SALE_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch bills of sale: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardBillsOfSaleResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchBillsOfSale, API_BASE };
