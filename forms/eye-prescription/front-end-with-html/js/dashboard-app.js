import { sampleData as all } from './sample-data.js';

// Eye Prescription — dashboard app.
//
// Renders a sortable, filterable table of prescriptions. Clicking a row
// opens an inline detail panel with full per-eye data, lens
// recommendation, and the safety-flag list.

  
  

  // ----------------------------------------------------------------------
  // State
  // ----------------------------------------------------------------------
  const state = {
    search: '',
    complexity: '',
    lens: '',
    flags: '',
    expired: '',
    prescriber: '',
    sortKey: 'issueDate',
    sortDir: 'desc',
    selectedId: null
  };

  const todayIso = new Date().toISOString().slice(0, 10);

  // ----------------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function fmt(n, digits = 2) {
    if (n === null || n === undefined || n === '') return '—';
    if (typeof n === 'number') {
      if (n === 0) return '0.00';
      const s = n.toFixed(digits);
      return n > 0 ? '+' + s : s;
    }
    return String(n);
  }
  function eyeShort(e) {
    return {
      sph: fmt(e.sphereDiopters),
      cylAx: e.cylinderDiopters == null && e.axisDegrees == null
        ? '—'
        : `${fmt(e.cylinderDiopters)} × ${e.axisDegrees ?? '—'}°`
    };
  }
  function isExpired(rx) { return rx.examination.expiryDate < todayIso; }

  // ----------------------------------------------------------------------
  // Filtering, sorting
  // ----------------------------------------------------------------------
  function rowSortValue(rx, key) {
    switch (key) {
      case 'issueDate': return rx.examination.issueDate;
      case 'expiryDate': return rx.examination.expiryDate;
      case 'patientName': return rx.patient.name.toLowerCase();
      case 'prescriberName': return rx.prescriber.name.toLowerCase();
      case 'complexity': {
        const ord = { simple: 0, moderate: 1, complex: 2 };
        return ord[rx.classification.complexity] ?? -1;
      }
      case 'flagCount': return rx.classification.flags.length;
      default: return '';
    }
  }
  function applyFilter() {
    let rows = all.slice();
    if (state.search) {
      const s = state.search.toLowerCase();
      rows = rows.filter(rx =>
        rx.patient.name.toLowerCase().includes(s) ||
        rx.prescriber.name.toLowerCase().includes(s) ||
        rx.prescriber.gocRegistrationNumber.toLowerCase().includes(s) ||
        rx.prescriber.practiceName.toLowerCase().includes(s)
      );
    }
    if (state.complexity) rows = rows.filter(rx => rx.classification.complexity === state.complexity);
    if (state.lens) rows = rows.filter(rx => rx.lensRecommendation.lensType === state.lens);
    if (state.flags === 'yes') rows = rows.filter(rx => rx.classification.flags.length > 0);
    if (state.flags === 'no') rows = rows.filter(rx => rx.classification.flags.length === 0);
    if (state.expired === 'expired') rows = rows.filter(isExpired);
    if (state.expired === 'active') rows = rows.filter(rx => !isExpired(rx));
    if (state.prescriber) rows = rows.filter(rx => rx.prescriber.name === state.prescriber);
    rows.sort((a, b) => {
      const va = rowSortValue(a, state.sortKey);
      const vb = rowSortValue(b, state.sortKey);
      if (va < vb) return state.sortDir === 'asc' ? -1 : 1;
      if (va > vb) return state.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
  function renderRow(rx) {
    const r = eyeShort(rx.rightEye);
    const l = eyeShort(rx.leftEye);
    const add = rx.rightEye.additionDiopters ?? rx.leftEye.additionDiopters;
    const flagCount = rx.classification.flags.length;
    const expired = isExpired(rx);
    const selected = state.selectedId === rx.id ? ' class="selected"' : '';
    return `
      <tr data-id="${esc(rx.id)}"${selected}>
        <td>${esc(rx.examination.issueDate)}</td>
        <td>${esc(rx.patient.name)}</td>
        <td>${esc(rx.prescriber.name)}<br><small style="color:#6b7280">GOC ${esc(rx.prescriber.gocRegistrationNumber)}</small></td>
        <td class="num">${esc(r.sph)}</td>
        <td class="num">${esc(r.cylAx)}</td>
        <td class="num">${esc(l.sph)}</td>
        <td class="num">${esc(l.cylAx)}</td>
        <td class="num">${add == null ? '—' : fmt(add)}</td>
        <td><span class="complex-pill ${esc(rx.classification.complexity)}">${esc(rx.classification.complexity)}</span></td>
        <td class="num"><span class="flag-pill ${flagCount > 0 ? 'has' : ''}">${flagCount}</span></td>
        <td class="${expired ? 'expired' : ''}">${esc(rx.examination.expiryDate)}</td>
        <td><span class="status-pill ${esc(rx.examination.statusUnused || 'active')}">active</span></td>
      </tr>
    `;
  }
  function renderGrid() {
    const rows = applyFilter();
    const body = document.getElementById('grid-body');
    body.innerHTML = rows.map(renderRow).join('');
    const count = document.getElementById('result-count');
    count.textContent = `${rows.length} of ${all.length} prescriptions`;
    // Update sort arrows
    document.querySelectorAll('th.sortable').forEach(th => {
      const key = th.getAttribute('data-sort');
      th.setAttribute('aria-sort',
        key === state.sortKey ? (state.sortDir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }
  function renderDetail() {
    const host = document.getElementById('detail-panel');
    if (!state.selectedId) { host.innerHTML = ''; return; }
    const rx = all.find(r => r.id === state.selectedId);
    if (!rx) { host.innerHTML = ''; return; }
    const r = rx.rightEye, l = rx.leftEye;
    const flags = rx.classification.flags;
    host.innerHTML = `
      <article class="detail-card">
        <button class="close-btn" type="button" data-action="close-detail">Close</button>
        <h2>${esc(rx.patient.name)} — ${esc(rx.examination.issueDate)}</h2>
        <div class="detail-grid">
          <div><strong>DOB:</strong> ${esc(rx.patient.birthDate)}</div>
          <div><strong>Status:</strong> active</div>
          <div><strong>Prescriber:</strong> ${esc(rx.prescriber.name)}</div>
          <div><strong>GOC:</strong> ${esc(rx.prescriber.gocRegistrationNumber)}</div>
          <div><strong>Practice:</strong> ${esc(rx.prescriber.practiceName)}</div>
          <div><strong>Reason:</strong> ${esc(rx.examination.reasonForSightTest)}</div>
          <div><strong>Examination:</strong> ${esc(rx.examination.examinationDate)}</div>
          <div><strong>Expiry:</strong> <span class="${isExpired(rx) ? 'expired' : ''}">${esc(rx.examination.expiryDate)}</span></div>
        </div>

        <h3>Right eye (OD)</h3>
        <table>
          <tr><th>Sphere</th><th>Cylinder</th><th>Axis</th><th>Add</th><th>Prism H</th><th>Prism V</th></tr>
          <tr>
            <td class="num">${fmt(r.sphereDiopters)}</td>
            <td class="num">${fmt(r.cylinderDiopters)}</td>
            <td class="num">${r.axisDegrees == null ? '—' : r.axisDegrees + '°'}</td>
            <td class="num">${fmt(r.additionDiopters)}</td>
            <td class="num">${fmt(r.prismHorizontalDiopters)} ${esc(r.baseHorizontal)}</td>
            <td class="num">${fmt(r.prismVerticalDiopters)} ${esc(r.baseVertical)}</td>
          </tr>
        </table>

        <h3>Left eye (OS)</h3>
        <table>
          <tr><th>Sphere</th><th>Cylinder</th><th>Axis</th><th>Add</th><th>Prism H</th><th>Prism V</th></tr>
          <tr>
            <td class="num">${fmt(l.sphereDiopters)}</td>
            <td class="num">${fmt(l.cylinderDiopters)}</td>
            <td class="num">${l.axisDegrees == null ? '—' : l.axisDegrees + '°'}</td>
            <td class="num">${fmt(l.additionDiopters)}</td>
            <td class="num">${fmt(l.prismHorizontalDiopters)} ${esc(l.baseHorizontal)}</td>
            <td class="num">${fmt(l.prismVerticalDiopters)} ${esc(l.baseVertical)}</td>
          </tr>
        </table>

        <h3>Lens recommendation</h3>
        <p>
          <strong>${esc(rx.lensRecommendation.lensType || '—')}</strong>,
          ${esc(rx.lensRecommendation.material || '—')}${rx.lensRecommendation.aspheric ? ' (aspheric)' : ''}
        </p>

        <h3>Classification</h3>
        <p>
          Complexity: <span class="complex-pill ${esc(rx.classification.complexity)}">${esc(rx.classification.complexity)}</span>
        </p>

        <h3>Safety flags (${flags.length})</h3>
        ${flags.length === 0 ? '<p style="color:#6b7280">No flags fired.</p>' :
          `<ul class="flag-list">${flags.map(f => `
            <li class="priority-${esc(f.priority)}">
              <span class="flag-cat">${esc(f.category)} · ${esc(f.priority)} · ${esc(f.eye)}</span><br>
              ${esc(f.description)}<br>
              <em>${esc(f.suggestedAction)}</em>
            </li>`).join('')}</ul>`}
      </article>
    `;
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function render() { renderGrid(); renderDetail(); }

  // ----------------------------------------------------------------------
  // Wire up
  // ----------------------------------------------------------------------
  function populatePrescriberFilter() {
    const sel = document.getElementById('f-prescriber');
    const names = Array.from(new Set(all.map(r => r.prescriber.name))).sort();
    for (const n of names) {
      const opt = document.createElement('option');
      opt.value = n; opt.textContent = n;
      sel.appendChild(opt);
    }
  }

  function init() {
    populatePrescriberFilter();
    document.getElementById('f-search').addEventListener('input', e => { state.search = e.target.value; render(); });
    document.getElementById('f-complexity').addEventListener('change', e => { state.complexity = e.target.value; render(); });
    document.getElementById('f-lens').addEventListener('change', e => { state.lens = e.target.value; render(); });
    document.getElementById('f-flags').addEventListener('change', e => { state.flags = e.target.value; render(); });
    document.getElementById('f-expired').addEventListener('change', e => { state.expired = e.target.value; render(); });
    document.getElementById('f-prescriber').addEventListener('change', e => { state.prescriber = e.target.value; render(); });

    document.querySelectorAll('th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.getAttribute('data-sort');
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortKey = key;
          state.sortDir = (key === 'issueDate' || key === 'expiryDate' || key === 'flagCount' || key === 'complexity') ? 'desc' : 'asc';
        }
        render();
      });
    });

    document.getElementById('grid-body').addEventListener('click', e => {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = tr.getAttribute('data-id');
      state.selectedId = state.selectedId === id ? null : id;
      render();
    });

    document.getElementById('detail-panel').addEventListener('click', e => {
      if (e.target.matches('[data-action="close-detail"]')) {
        state.selectedId = null;
        render();
      }
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
