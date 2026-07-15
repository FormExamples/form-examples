import { fetchApplications } from './api.js';
import { CONDITION_LABELS, OUTCOME_LABELS, STATUS_LABELS } from './dashboard-types.js';

/**
 * FP92A dashboard - filter, render, refresh.
 */

  

  const tbody = document.getElementById("applications-tbody");
  const emptyMsg = document.getElementById("empty-message");
  const banner = document.getElementById("status-banner");
  const filters = {
    search: document.getElementById("filter-search"),
    outcome: document.getElementById("filter-outcome"),
    status: document.getElementById("filter-status"),
    condition: document.getElementById("filter-condition"),
  };

  let items = [];

  function escape(html) {
    return String(html).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function render() {
    const q = (filters.search.value || "").toLowerCase().trim();
    const wantOutcome = filters.outcome.value;
    const wantStatus = filters.status.value;
    const wantCondition = filters.condition.value;
    const matches = items.filter((a) => {
      if (wantOutcome && a.outcome !== wantOutcome) return false;
      if (wantStatus && a.status !== wantStatus) return false;
      if (wantCondition && !(a.conditions || []).includes(wantCondition)) return false;
      if (q) {
        const blob = [a.patientName, a.nhsNumber, a.certificateNumber]
          .join(" ").toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
    tbody.innerHTML = matches.map((a) => {
      const cond = (a.conditions || []).map((c) => CONDITION_LABELS[c] || c).join(", ");
      return `<tr>
        <td>${escape(a.certificateNumber || "—")}</td>
        <td>${escape(a.patientName)}</td>
        <td>${escape(a.nhsNumber)}</td>
        <td>${escape(cond || "—")}</td>
        <td><span class="badge ${escape(a.outcome)}">${escape(OUTCOME_LABELS[a.outcome] || a.outcome)}</span></td>
        <td>${escape(a.validFrom || "—")}</td>
        <td>${escape(a.validUntil || "—")}</td>
        <td><span class="badge status-${escape(a.status)}">${escape(STATUS_LABELS[a.status] || a.status)}</span></td>
      </tr>`;
    }).join("");
    emptyMsg.hidden = matches.length > 0;
  }

  async function load() {
    const { items: data, source } = await fetchApplications();
    items = data;
    if (source === "sample") {
      banner.hidden = false;
      banner.textContent = "Backend not reachable — displaying bundled sample applications.";
    } else {
      banner.hidden = true;
    }
    render();
  }

  Object.values(filters).forEach((el) => el.addEventListener("input", render));
  load();
