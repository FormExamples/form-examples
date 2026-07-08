// Backend API client for the Medical Waiting List Card dashboard. Mirrors
// the SvelteKit dashboard. The backend lives at http://localhost:5150
// (Loco / axum). When fetch fails or the response is empty, callers fall
// back to the sample data in `data.js`.

(function () {
  'use strict';
  window.MedicalWaitingListCardDashboard = window.MedicalWaitingListCardDashboard || {};

  const API_BASE = 'http://localhost:5150';
  const CARDS_PATH = '/api/dashboard/cards';

  /**
   * @returns {Promise<import('./types.js').WaitingListCardSummary[]>}
   */
  async function fetchCards() {
    const res = await fetch(API_BASE + CARDS_PATH);
    if (!res.ok) {
      throw new Error('Failed to fetch cards: ' + res.status + ' ' + res.statusText);
    }
    /** @type {import('./types.js').DashboardCardsResponse} */
    const data = await res.json();
    return data.items || [];
  }

  window.MedicalWaitingListCardDashboard.fetchCards = fetchCards;
  window.MedicalWaitingListCardDashboard.API_BASE = API_BASE;
})();
