(() => {
  'use strict';

  const SAMPLE_CERTIFICATES = [
    cert('YF-2026-0001', 'Ada', 'Lovelace', 'St Pancras Travel Clinic', 'GBR', 'yellow-fever', 'issued',
      [entry('yellow-fever', '2026-02-12', 'Sanofi', 'YF-K2391', '2026-02-22', null, 'yes')]),
    cert('YF-2026-0002', 'Aleksey', 'Pavlov', 'Moscow Yellow Fever Centre', 'RUS', 'yellow-fever', 'issued',
      [entry('yellow-fever', '2026-03-04', 'Bio-Manguinhos', 'YF-BM-7732', '2026-03-14', null, 'yes')]),
    cert('YF-2026-0003', 'Beatriz', 'Costa', 'Lisbon CRTM', 'PRT', 'yellow-fever', 'issued',
      [entry('yellow-fever', '2026-04-21', 'Bio-Manguinhos', 'YF-BM-8841', '2026-05-01', null, 'yes')]),
    cert('YF-2026-0004', 'Chinedu', 'Okafor', 'Lagos Port Health Unit', 'NGA', 'yellow-fever', 'reissued',
      [entry('yellow-fever', '2026-01-08', 'Sanofi', 'YF-K2104', '2026-01-18', null, 'yes')]),
    cert('YF-2026-0005', 'Hiroshi', 'Tanaka', 'Narita Quarantine Station', 'JPN', 'yellow-fever', 'issued',
      [entry('yellow-fever', '2026-05-02', 'Sanofi', 'YF-K2418', '2026-05-12', null, 'yes')]),
    cert('PV-2026-0006', 'Idrissa', 'Diallo', 'Bamako Travel Clinic', 'MLI', 'polio', 'issued',
      [entry('polio', '2026-02-19', 'GSK', 'PV-D4188', '2026-02-29', '2027-02-29', 'no')]),
    cert('YF-2026-0007', 'Sara', 'Lindqvist', 'Stockholm Vaccination Centre', 'SWE', 'yellow-fever', 'draft',
      [entry('yellow-fever', '2026-05-09', '', '', '2026-05-19', null, 'yes')]),
    cert('YF-2026-0008', 'Tan', 'Wei Ming', 'Singapore Tan Tock Seng', 'SGP', 'yellow-fever', 'issued',
      [entry('yellow-fever', '2026-04-30', 'Sanofi', 'YF-K2407', '2026-05-10', null, 'yes')]),
    cert('YF-2026-0009', 'Tomasz', 'Kowalski', 'Warszawa CMI', 'POL', 'yellow-fever', 'issued',
      [entry('yellow-fever', '2026-04-14', 'Bio-Manguinhos', 'YF-BM-8801', '2026-04-24', null, 'yes')]),
    cert('CO-2026-0010', 'Yuki', 'Sato', 'Osaka International Clinic', 'JPN', 'covid-19', 'issued',
      [entry('covid-19', '2026-03-12', 'Pfizer-BioNTech', 'CO-PFI-2202', '2026-03-12', '2027-03-12', 'no'),
       entry('yellow-fever', '2026-03-12', 'Sanofi', 'YF-K2287', '2026-03-22', null, 'yes')]),
    cert('YF-2026-0011', 'Zhang', 'Wei', 'Shanghai CDC', 'CHN', 'yellow-fever', 'revoked',
      [entry('yellow-fever', '2025-11-04', 'Bio-Manguinhos', 'YF-BM-7501', '2025-11-14', null, 'yes')]),
  ];

  function cert(serial, given, surname, centre, country, primary, status, entries) {
    return {
      serial,
      surname,
      givenNames: given,
      centre,
      issuingCountryAsIso31661Alpha3: country,
      primaryDisease: primary,
      entries: entries,
      entriesCount: entries.length,
      vaccinationDate: entries[0].vaccinationDate,
      validityStatus: status === 'revoked' ? 'expired' : (status === 'draft' ? 'draft' : 'valid'),
      status,
    };
  }
  function entry(disease, vaccinationDate, manufacturer, batchNumber, validityStartsOn, validityEndsOn, validityIsLifetime) {
    return { disease, vaccinationDate, manufacturer, batchNumber, validityStartsOn, validityEndsOn, validityIsLifetime };
  }

  const filters = { disease: '', status: '', centre: '', search: '' };
  const sort = { key: 'serial', direction: 'asc' };
  let selectedSerial = null;

  // Populate centre dropdown.
  const centreSelect = document.getElementById('filterCentre');
  [...new Set(SAMPLE_CERTIFICATES.map((c) => c.centre))].sort().forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    centreSelect.appendChild(opt);
  });

  document.getElementById('filterDisease').addEventListener('change', (e) => { filters.disease = e.target.value; render(); });
  document.getElementById('filterStatus').addEventListener('change', (e) => { filters.status = e.target.value; render(); });
  centreSelect.addEventListener('change', (e) => { filters.centre = e.target.value; render(); });
  document.getElementById('filterSearch').addEventListener('input', (e) => { filters.search = e.target.value.trim().toLowerCase(); render(); });

  document.querySelectorAll('th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      sort.direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
      sort.key = key;
      render();
    });
  });

  function applyFilters(rows) {
    return rows.filter((r) => {
      if (filters.disease && r.primaryDisease !== filters.disease) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.centre && r.centre !== filters.centre) return false;
      if (filters.search) {
        const haystack = `${r.surname} ${r.givenNames} ${r.serial}`.toLowerCase();
        if (!haystack.includes(filters.search)) return false;
      }
      return true;
    });
  }

  function sortRows(rows) {
    const key = sort.key;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a[key], bv = b[key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }

  function render() {
    const tbody = document.getElementById('certificates');
    tbody.innerHTML = '';
    const rows = sortRows(applyFilters(SAMPLE_CERTIFICATES));
    for (const r of rows) {
      const tr = document.createElement('tr');
      if (r.serial === selectedSerial) tr.classList.add('row-selected');
      tr.innerHTML = `
        <td>${escape(r.serial)}</td>
        <td>${escape(r.surname)}</td>
        <td>${escape(r.givenNames)}</td>
        <td>${escape(r.centre)}</td>
        <td>${escape(r.primaryDisease)}</td>
        <td>${r.entriesCount}</td>
        <td>${escape(r.vaccinationDate)}</td>
        <td><span class="badge ${escape(r.validityStatus)}">${escape(r.validityStatus)}</span></td>
        <td>${escape(r.status)}</td>
      `;
      tr.addEventListener('click', () => { selectedSerial = r.serial; render(); renderDetail(r); });
      tbody.appendChild(tr);
    }
    document.querySelectorAll('th').forEach((th) => th.classList.remove('asc', 'desc'));
    const active = document.querySelector(`th[data-sort="${sort.key}"]`);
    if (active) active.classList.add(sort.direction);
  }

  function renderDetail(r) {
    const detail = document.getElementById('detail');
    detail.innerHTML = `
      <h2>${escape(r.serial)} — ${escape(r.givenNames)} ${escape(r.surname)}</h2>
      <p><strong>Issuing centre:</strong> ${escape(r.centre)} (${escape(r.issuingCountryAsIso31661Alpha3)})</p>
      <p><strong>Status:</strong> ${escape(r.status)} — validity: ${escape(r.validityStatus)}</p>
      <h3>Vaccination entries (${r.entriesCount})</h3>
      <ol>
        ${r.entries.map((e) => `
          <li>
            <strong>${escape(e.disease)}</strong> — vaccinated ${escape(e.vaccinationDate)}<br />
            ${escape(e.manufacturer)} / batch ${escape(e.batchNumber)}<br />
            Valid from ${escape(e.validityStartsOn)} until
            ${e.validityIsLifetime === 'yes' ? 'lifetime (2016 IHR amendment)' : escape(e.validityEndsOn ?? '—')}
          </li>`).join('')}
      </ol>
    `;
  }

  function escape(value) {
    return (value ?? '').toString().replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  render();
})();
