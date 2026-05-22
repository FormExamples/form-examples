import { sampleAuthorizations } from './sample-data.js';

async function loadAuthorizations() {
  try {
    const r = await fetch('/api/authorizations', { headers: { Accept: 'application/json' } });
    if (r.ok) return await r.json();
  } catch (_) {}
  return sampleAuthorizations;
}

function renderRow(a) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${a.patientName}</td>
    <td>${a.recipientOrganization}</td>
    <td>${a.primaryPurpose}</td>
    <td>${a.categories.join(', ')}</td>
    <td>${a.expirationDate ?? ''}</td>
    <td><span class="badge ${a.validityStatus}">${a.validityStatus}</span></td>
    <td><span class="flag-count ${a.highPriorityFlags > 0 ? 'high' : ''}">${a.highPriorityFlags}</span></td>
    <td>${a.signatureDate ?? ''}</td>
  `;
  return tr;
}

async function main() {
  const data = await loadAuthorizations();
  const tbody = document.getElementById('rows');
  tbody.replaceChildren(...data.map(renderRow));
}

window.addEventListener('DOMContentLoaded', main);
