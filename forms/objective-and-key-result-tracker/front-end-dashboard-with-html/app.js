let data = [];
let view = [];
let sort = { key: null, dir: 'asc' };
const filters = { level: '', status: '', rag: '', owner: '' };

async function load() {
  const r = await fetch('./objectives.json');
  data = await r.json();
  refresh();
}

function applyFilters() {
  view = data.filter((d) =>
    (!filters.level || d.level === filters.level) &&
    (!filters.rag || d.rag === filters.rag) &&
    (!filters.owner || (d.dri || '').toLowerCase().includes(filters.owner.toLowerCase()))
  );
}

function applySort() {
  if (!sort.key) return;
  const get = {
    obj_title: (d) => d.obj_title, level: (d) => d.level, dri: (d) => d.dri,
    cycle: (d) => d.cycle_start_date, rag: (d) => d.rag, progress: (d) => d.progress_percent,
    confidence: (d) => d.confidence_decile, krs: (d) => (d.keyResults ?? []).length,
    flags: (d) => (d.flags ?? []).length, last_check_in_at: (d) => d.latestCheckIn?.checked_in_at ?? '',
  }[sort.key];
  view.sort((a, b) => {
    const av = get(a), bv = get(b);
    return (av < bv ? -1 : av > bv ? 1 : 0) * (sort.dir === 'asc' ? 1 : -1);
  });
}

function row(d) {
  return `<tr data-id="${d.id}" tabindex="0">
    <td>${d.obj_title}</td><td>${d.level}</td><td>${d.dri || '<i>none</i>'}</td>
    <td>${d.cycle}</td><td><span class="rag ${d.rag}">${d.rag.toUpperCase()}</span></td>
    <td>${d.progress_percent}%</td><td>${d.confidence_decile}/10</td>
    <td>${(d.keyResults ?? []).length}</td><td>${(d.flags ?? []).length}</td>
    <td>${d.latestCheckIn?.checked_in_at?.slice(0, 10) ?? ''}</td>
  </tr>`;
}

function refresh() {
  applyFilters(); applySort();
  document.querySelector('#grid tbody').innerHTML = view.map(row).join('');
}

['level', 'status', 'rag', 'owner'].forEach((k) => {
  const el = document.querySelector(`#f-${k}`);
  el.addEventListener('input', () => { filters[k] = el.value; refresh(); });
});

document.querySelectorAll('#grid th[data-sort]').forEach((th) => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    sort = { key, dir: sort.key === key && sort.dir === 'asc' ? 'desc' : 'asc' };
    document.querySelectorAll('#grid th').forEach((t) => t.removeAttribute('data-sort-dir'));
    th.dataset.sortDir = sort.dir;
    refresh();
  });
});

load();
