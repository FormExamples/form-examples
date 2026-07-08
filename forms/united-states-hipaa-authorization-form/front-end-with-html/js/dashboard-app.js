import { sampleAuthorizations } from './sample-data.js';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function loadAuthorizations() {
  try {
    const r = await fetch('/api/authorizations', { headers: { Accept: 'application/json' } });
    if (r.ok) return await r.json();
  } catch (_) {}
  return sampleAuthorizations;
}

function renderRow(a) {
  const tr = document.createElement('tr');
  tr.className = 'data-table-row';
  tr.innerHTML = `
    <td class="data-table-td">${esc(a.patientName)}</td>
    <td class="data-table-td">${esc(a.recipientOrganization)}</td>
    <td class="data-table-td">${esc(a.primaryPurpose)}</td>
    <td class="data-table-td">${esc((a.categories || []).join(', '))}</td>
    <td class="data-table-td">${esc(a.expirationDate ?? '')}</td>
    <td class="data-table-td"><span class="badge ${esc(a.validityStatus)}">${esc(a.validityStatus)}</span></td>
    <td class="data-table-td"><span class="flag-count ${a.highPriorityFlags > 0 ? 'high' : ''}">${esc(a.highPriorityFlags)}</span></td>
    <td class="data-table-td">${esc(a.signatureDate ?? '')}</td>
  `;
  return tr;
}

async function main() {
  const data = await loadAuthorizations();
  const tbody = document.getElementById('rows');
  tbody.replaceChildren(...data.map(renderRow));
}

window.addEventListener('DOMContentLoaded', main);
