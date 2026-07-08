// Dashboard logic: render the table from window.SAMPLE_MEETINGS, sort by
// header click, filter by the dropdowns, search across title / organiser /
// summary, and expand-on-click to show summary + action items + outcomes.

(function () {
'use strict';

const tableBody     = document.getElementById('meetings-body');
const tilesEl       = document.getElementById('tiles');
const rowCount      = document.getElementById('row-count');
const searchInput   = document.getElementById('search');
const filterSelects = document.querySelectorAll('#filters select');
const headers       = document.querySelectorAll('thead th[data-sort]');
const refreshButton = document.getElementById('refresh-button');

let sortKey = 'scheduledStartAt';
let sortDir = 'desc';
let expandedId = null;
let searchTimer = null;

const HEALTH_RANK = { red: 3, amber: 2, green: 1, '': 0 };

function escape(s) {
	return String(s ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function sortValue(row, key) {
	const v = row[key];
	if (key === 'overallHealth') return HEALTH_RANK[v] || 0;
	if (key === 'acceptedCount') return Number(v) || 0;
	if (key === 'actionItemsOpen') return Number(v) || 0;
	if (typeof v === 'number') return v;
	if (v === null || v === undefined) return '';
	return String(v).toLowerCase();
}

function compare(a, b, key, dir) {
	const av = sortValue(a, key);
	const bv = sortValue(b, key);
	if (av < bv) return dir === 'asc' ? -1 : 1;
	if (av > bv) return dir === 'asc' ?  1 : -1;
	return 0;
}

function applyFilters(rows) {
	const search = (searchInput.value || '').trim().toLowerCase();
	const fields = ['title', 'organizerName', 'summary'];

	return rows.filter((r) => {
		for (const sel of filterSelects) {
			const field = sel.dataset.field;
			const want  = sel.value;
			if (!want) continue;
			if (String(r[field]) !== want) return false;
		}
		if (search) {
			const hay = fields.map((f) => String(r[f] ?? '').toLowerCase()).join(' ');
			if (!hay.includes(search)) return false;
		}
		return true;
	});
}

function formatDateTime(iso) {
	if (!iso) return '—';
	const t = new Date(iso);
	if (isNaN(t.getTime())) return iso;
	return t.toISOString().slice(0, 16).replace('T', ' ');
}

function renderTiles(rows) {
	const total      = rows.length;
	const scheduled  = rows.filter((r) => r.status === 'scheduled').length;
	const completed  = rows.filter((r) => r.status === 'completed').length;
	const cancelled  = rows.filter((r) => r.status === 'cancelled' || r.status === 'no-show').length;
	const overdueRow = rows.reduce((acc, r) => acc + (Number(r.actionItemsOpen) || 0), 0);
	const redHealth  = rows.filter((r) => r.overallHealth === 'red').length;

	tilesEl.innerHTML = [
		{ label: 'Total',          value: total },
		{ label: 'Scheduled',      value: scheduled,  cls: 'amber' },
		{ label: 'Completed',      value: completed,  cls: 'green' },
		{ label: 'Cancelled',      value: cancelled,  cls: 'red' },
		{ label: 'Open actions',   value: overdueRow, cls: 'amber' },
		{ label: 'Red health',     value: redHealth,  cls: 'red' },
	].map((t) => `
		<div class="tile ${escape(t.cls || '')}">
			<span class="label">${escape(t.label)}</span>
			<span class="value">${escape(t.value)}</span>
		</div>
	`).join('');
}

function renderDetailRow(r) {
	const actionsHtml = (r.actionItems || []).length === 0
		? '<p>(none)</p>'
		: '<ul>' + r.actionItems.map((a) =>
			`<li><strong>${escape(a.title)}</strong> — ${escape(a.ownerName)} · ${escape(a.status)}${a.dueDate ? ' · due ' + escape(a.dueDate) : ''}</li>`
		).join('') + '</ul>';

	const outcomesHtml = (r.outcomes || []).length === 0
		? '<p>(none)</p>'
		: '<ul>' + r.outcomes.map((o) =>
			`<li><strong>${escape(o.title)}</strong> — ${escape(o.category)}${o.impact ? ' · impact ' + escape(o.impact) : ''}</li>`
		).join('') + '</ul>';

	return `
		<tr class="row-detail" data-id="${escape(r.id)}">
			<td colspan="11">
				<p class="summary">${escape(r.summary || '(no summary recorded)')}</p>
				<div class="detail-section">
					<h4>Action items (${(r.actionItems || []).length})</h4>
					${actionsHtml}
				</div>
				<div class="detail-section">
					<h4>Outcomes (${(r.outcomes || []).length})</h4>
					${outcomesHtml}
				</div>
			</td>
		</tr>
	`;
}

function renderTable(rows) {
	if (rows.length === 0) {
		tableBody.innerHTML = '<tr><td colspan="11" class="no-results">No matching meetings.</td></tr>';
		return;
	}

	const html = rows.map((r) => {
		const acceptedStr = `${r.acceptedCount ?? '—'} / ${r.participantCount ?? '—'}`;
		const actionsStr  = `${r.actionItemsOpen ?? 0} / ${r.actionItemsTotal ?? 0}`;
		const main = `
			<tr class="row-main" data-id="${escape(r.id)}">
				<td><span class="title-cell" title="${escape(r.title)}">${escape(r.title || '(untitled)')}</span></td>
				<td>${escape(r.organizerName)}</td>
				<td>${escape(r.category)}</td>
				<td>${escape(formatDateTime(r.scheduledStartAt))}</td>
				<td>${escape(r.durationMinutes ?? '—')}</td>
				<td>${escape(acceptedStr)}</td>
				<td>${escape(actionsStr)}</td>
				<td>${escape(r.outcomeCount ?? 0)}</td>
				<td><span class="badge status-${escape(r.status)}">${escape(r.status)}</span></td>
				<td>${escape(r.overallResult || '—')}</td>
				<td><span class="badge ${escape(r.overallHealth)}">${escape(r.overallHealth)}</span></td>
			</tr>
		`;
		return main + (expandedId === r.id ? renderDetailRow(r) : '');
	}).join('');

	tableBody.innerHTML = html;
}

function render() {
	const all      = window.SAMPLE_MEETINGS || [];
	const filtered = applyFilters(all);
	const sorted   = [...filtered].sort((a, b) => compare(a, b, sortKey, sortDir));

	renderTiles(all);
	rowCount.textContent =
		`Showing ${sorted.length} of ${all.length} meetings, sorted by ${sortKey} ${sortDir === 'asc' ? '▲' : '▼'}.`;
	renderTable(sorted);
}

function updateSortIndicators() {
	headers.forEach((h) => {
		const k = h.dataset.sort;
		if (k === sortKey) {
			h.setAttribute('aria-sort', sortDir === 'asc' ? 'ascending' : 'descending');
		} else {
			h.removeAttribute('aria-sort');
		}
	});
}

headers.forEach((h) => {
	h.addEventListener('click', () => {
		const k = h.dataset.sort;
		if (k === sortKey) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = k;
			sortDir = 'asc';
		}
		updateSortIndicators();
		render();
	});
});

tableBody.addEventListener('click', (e) => {
	const tr = e.target.closest('tr.row-main');
	if (!tr) return;
	const id = tr.dataset.id;
	expandedId = (expandedId === id) ? null : id;
	render();
});

searchInput.addEventListener('input', () => {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(render, 150);
});

filterSelects.forEach((sel) => sel.addEventListener('change', render));
refreshButton.addEventListener('click', render);

updateSortIndicators();
render();

})();
