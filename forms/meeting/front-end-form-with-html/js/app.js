// Wires the meeting form to the validation engine. Loaded as a classic
// <script> after scoring.js, so Meeting.validateMeeting is on the global
// namespace.
(function () {
'use strict';

const { validateMeeting } = window.Meeting;
const DRAFT_KEY = 'meeting-draft';

const form           = document.getElementById('meeting-form');
const reportEl       = document.getElementById('report');
const reportBodyEl   = document.getElementById('report-body');
const validateButton = document.getElementById('validate-button');
const exportButton   = document.getElementById('export-button');
const summaryEl      = document.getElementById('summary');
const summaryCountEl = document.getElementById('summary-count');

// Row templates per table id. Each entry is a function returning an HTML
// string for a single <tr> row.
const rowTemplates = {
	'agenda-table': () => `
		<td class="row-index"></td>
		<td><input name="agendaTitle"      type="text"></td>
		<td><input name="agendaDuration"   type="number" min="0" max="1440"></td>
		<td><input name="agendaPresenter"  type="text"></td>
		<td><input name="agendaNotes"      type="text"></td>
		<td>
			<select name="agendaStatus">
				<option value=""></option><option>planned</option>
				<option>discussed</option><option>skipped</option>
				<option>deferred</option>
			</select>
		</td>
		<td class="row-remove"><button type="button" class="remove">×</button></td>
	`,
	'participants-table': () => `
		<td class="row-index"></td>
		<td><input name="participantName"  type="text"></td>
		<td><input name="participantEmail" type="email"></td>
		<td>
			<select name="participantRole">
				<option value=""></option><option>organizer</option>
				<option>chair</option><option>required</option>
				<option>optional</option><option>observer</option>
				<option>presenter</option><option>note-taker</option>
			</select>
		</td>
		<td>
			<select name="participantResponse">
				<option value=""></option><option>no-response</option>
				<option>accepted</option><option>declined</option>
				<option>tentative</option><option>delegated</option>
			</select>
		</td>
		<td>
			<select name="participantAttendance">
				<option value=""></option><option>present</option>
				<option>late</option><option>absent</option>
				<option>partial</option><option>remote</option>
				<option>unknown</option>
			</select>
		</td>
		<td class="row-remove"><button type="button" class="remove">×</button></td>
	`,
	'resources-table': () => `
		<td class="row-index"></td>
		<td>
			<select name="resourceType">
				<option value=""></option><option>room</option>
				<option>equipment</option><option>document</option>
				<option>link</option><option>budget</option>
				<option>catering</option><option>interpreter</option>
				<option>transport</option><option>other</option>
			</select>
		</td>
		<td><input name="resourceName"   type="text"></td>
		<td><input name="resourceQuantity" type="number" min="0"></td>
		<td><input name="resourceCost"     type="number" step="0.01" min="0"></td>
		<td>
			<select name="resourceStatus">
				<option value=""></option><option>requested</option>
				<option>reserved</option><option>confirmed</option>
				<option>unavailable</option><option>cancelled</option>
			</select>
		</td>
		<td class="row-remove"><button type="button" class="remove">×</button></td>
	`,
	'actions-table': () => `
		<td class="row-index"></td>
		<td><input name="actionTitle"   type="text"></td>
		<td><input name="actionOwner"   type="text"></td>
		<td><input name="actionDueDate" type="date"></td>
		<td>
			<select name="actionPriority">
				<option value=""></option><option>low</option>
				<option>medium</option><option>high</option><option>urgent</option>
			</select>
		</td>
		<td>
			<select name="actionStatus">
				<option>open</option><option>in-progress</option>
				<option>blocked</option><option>done</option><option>cancelled</option>
			</select>
		</td>
		<td class="row-remove"><button type="button" class="remove">×</button></td>
	`,
	'outputs-table': () => `
		<td class="row-index"></td>
		<td><input name="outputTitle" type="text"></td>
		<td>
			<select name="outputKind">
				<option value=""></option><option>document</option>
				<option>decision</option><option>data</option>
				<option>recording</option><option>minutes</option>
				<option>slides</option><option>agreement</option>
				<option>other</option>
			</select>
		</td>
		<td><input name="outputUrl"   type="url"></td>
		<td><input name="outputOwner" type="text"></td>
		<td class="row-remove"><button type="button" class="remove">×</button></td>
	`,
	'outcomes-table': () => `
		<td class="row-index"></td>
		<td><input name="outcomeTitle" type="text"></td>
		<td>
			<select name="outcomeCategory">
				<option value=""></option><option>goal-reached</option>
				<option>risk-identified</option><option>risk-mitigated</option>
				<option>alignment-achieved</option><option>decision</option>
				<option>blocker-cleared</option><option>blocker-raised</option>
				<option>commitment</option><option>no-outcome</option>
				<option>other</option>
			</select>
		</td>
		<td>
			<select name="outcomeImpact">
				<option value=""></option><option>low</option>
				<option>medium</option><option>high</option><option>strategic</option>
			</select>
		</td>
		<td><input name="outcomeDescription" type="text"></td>
		<td class="row-remove"><button type="button" class="remove">×</button></td>
	`,
};

function addRow(tableId) {
	const table = document.getElementById(tableId);
	const tr = document.createElement('tr');
	tr.innerHTML = rowTemplates[tableId]();
	table.tBodies[0].appendChild(tr);
	renumber(table);
}

function removeRow(tr) {
	const table = tr.closest('table');
	tr.remove();
	renumber(table);
}

function renumber(table) {
	const rows = table.tBodies[0].rows;
	for (let i = 0; i < rows.length; i++) {
		const idx = rows[i].querySelector('.row-index');
		if (idx) idx.textContent = String(i + 1);
	}
}

function readRows(tableId, mapFn) {
	const rows = document.getElementById(tableId).tBodies[0].rows;
	const out = [];
	for (let i = 0; i < rows.length; i++) {
		const fields = {};
		rows[i].querySelectorAll('input, select, textarea').forEach((el) => {
			fields[el.name] = el.value.trim();
		});
		out.push(mapFn(fields, i));
	}
	return out;
}

function readData() {
	const fd = new FormData(form);
	const flat = {};
	for (const [name, raw] of fd.entries()) {
		flat[name] = typeof raw === 'string' ? raw.trim() : raw;
	}

	return {
		organizerName:         flat.organizerName || '',
		organizerEmail:        flat.organizerEmail || '',
		organizerRole:         flat.organizerRole || '',
		organizerOrganisation: flat.organizerOrganisation || '',
		organizerTeam:         flat.organizerTeam || '',
		organizerTimezone:     flat.organizerTimezone || '',

		status:               flat.status || 'draft',
		title:                flat.title || '',
		purpose:              flat.purpose || '',
		longDescription:      flat.longDescription || '',
		category:             flat.category || '',
		visibility:           flat.visibility || '',

		scheduledStartAt:     flat.scheduledStartAt || '',
		scheduledEndAt:       flat.scheduledEndAt || '',
		timezone:             flat.timezone || '',
		location:             flat.location || '',
		videoUrl:             flat.videoUrl || '',
		phoneNumber:          flat.phoneNumber || '',
		dialInCode:           flat.dialInCode || '',
		joiningInstructions:  flat.joiningInstructions || '',
		calendarUid:          flat.calendarUid || '',

		recurringFrequency:    flat.recurringFrequency || 'none',
		recurringIntervalCount: flat.recurringIntervalCount || '1',
		recurringByDayOfWeek:  flat.recurringByDayOfWeek || '',
		recurringByDayOfMonth: flat.recurringByDayOfMonth || '',
		recurringBySetPosition: flat.recurringBySetPosition || '',
		recurringByMonthOfYear: flat.recurringByMonthOfYear || '',
		recurringSeriesCount:  flat.recurringSeriesCount || '',
		recurringSeriesUntil:  flat.recurringSeriesUntil || '',

		summary:           flat.summary || '',
		actualStartAt:     flat.actualStartAt || '',
		actualEndAt:       flat.actualEndAt || '',
		overallResult:     flat.overallResult || '',
		additionalNotes:   flat.additionalNotes || '',
		signedByName:      flat.signedByName || '',
		signedAt:          flat.signedAt || '',

		agenda: readRows('agenda-table', (f, i) => ({
			position: i,
			title: f.agendaTitle,
			durationMinutes: f.agendaDuration === '' ? null : Number(f.agendaDuration),
			presenter: f.agendaPresenter,
			notes: f.agendaNotes,
			status: f.agendaStatus,
		})),
		participants: readRows('participants-table', (f, i) => ({
			position: i,
			name: f.participantName,
			email: f.participantEmail,
			role: f.participantRole,
			responseStatus: f.participantResponse,
			attendanceStatus: f.participantAttendance,
		})),
		resources: readRows('resources-table', (f, i) => ({
			position: i,
			resourceType: f.resourceType,
			name: f.resourceName,
			quantity: f.resourceQuantity === '' ? null : Number(f.resourceQuantity),
			costAmount: f.resourceCost === '' ? null : Number(f.resourceCost),
			status: f.resourceStatus,
		})),
		actionItems: readRows('actions-table', (f, i) => ({
			position: i,
			title: f.actionTitle,
			ownerName: f.actionOwner,
			dueDate: f.actionDueDate,
			priority: f.actionPriority,
			status: f.actionStatus,
		})),
		outputs: readRows('outputs-table', (f, i) => ({
			position: i,
			title: f.outputTitle,
			kind: f.outputKind,
			url: f.outputUrl,
			ownerName: f.outputOwner,
		})),
		outcomes: readRows('outcomes-table', (f, i) => ({
			position: i,
			title: f.outcomeTitle,
			category: f.outcomeCategory,
			impact: f.outcomeImpact,
			description: f.outcomeDescription,
		})),
	};
}

function escape(s) {
	return String(s ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function renderReport(data, result) {
	const countRow = (label, value) =>
		`<div><strong>${escape(label)}</strong>${escape(value ?? '—')}</div>`;

	const ruleItem = (r) =>
		`<li><code>${escape(r.ruleId)}</code> [${escape(r.instrument)}/${escape(r.grade)}] — ${escape(r.description)}</li>`;

	const flagItem = (f) =>
		`<li class="flag-${escape(f.priority)}"><strong>[${escape(f.category)}]</strong>
		 ${escape(f.description)}<br><em>${escape(f.suggestedAction)}</em></li>`;

	reportBodyEl.innerHTML = `
		<p>
			Overall health:
			<span class="health ${escape(result.overallHealth)}">${escape(result.overallHealth)}</span>
			&nbsp;|&nbsp;
			Completion: <strong>${escape(result.completionStatus)}</strong>
		</p>

		<h3>Title</h3>
		<p>${escape(data.title || '(untitled)')}</p>

		<h3>Counts</h3>
		<div class="counts">
			${countRow('Duration (min)', result.durationMinutes)}
			${countRow('Participants', result.participantCount)}
			${countRow('Accepted', result.acceptedCount)}
			${countRow('Attended', result.attendedCount)}
			${countRow('Agenda items', result.agendaItemCount)}
			${countRow('Action items', result.actionItemCount)}
			${countRow('Outputs', result.outputCount)}
			${countRow('Outcomes', result.outcomeCount)}
		</div>

		<h3>Fired rules (${result.firedRules.length})</h3>
		${result.firedRules.length === 0
			? '<p>(none)</p>'
			: `<ul>${result.firedRules.map(ruleItem).join('')}</ul>`}

		<h3>Flags (${result.flags.length})</h3>
		${result.flags.length === 0
			? '<p>(none)</p>'
			: `<ul>${result.flags.map(flagItem).join('')}</ul>`}
	`;
	reportEl.hidden = false;
	reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateSummaryCount() {
	const n = (summaryEl.value || '').length;
	summaryCountEl.textContent = String(n);
	summaryCountEl.parentElement.classList.toggle('over', n > 250);
}

// localStorage autosave — debounced.
let saveTimer = null;
function scheduleSave() {
	clearTimeout(saveTimer);
	saveTimer = setTimeout(() => {
		try {
			localStorage.setItem(DRAFT_KEY, JSON.stringify(readData()));
		} catch (_e) { /* quota — ignore */ }
	}, 500);
}

function restoreDraft() {
	let draft;
	try {
		const raw = localStorage.getItem(DRAFT_KEY);
		if (!raw) return;
		draft = JSON.parse(raw);
	} catch (_e) { return; }
	if (!draft || typeof draft !== 'object') return;

	for (const el of form.elements) {
		if (!el.name) continue;
		if (Object.prototype.hasOwnProperty.call(draft, el.name)) {
			el.value = draft[el.name];
		}
	}
	const lists = [
		['agenda',       'agenda-table'],
		['participants', 'participants-table'],
		['resources',    'resources-table'],
		['actionItems',  'actions-table'],
		['outputs',      'outputs-table'],
		['outcomes',     'outcomes-table'],
	];
	for (const [key, tableId] of lists) {
		const rows = draft[key];
		if (!Array.isArray(rows)) continue;
		for (const row of rows) {
			addRow(tableId);
			const tr = document.getElementById(tableId).tBodies[0].lastElementChild;
			tr.querySelectorAll('input, select, textarea').forEach((el) => {
				const name = el.name;
				const map = {
					agendaTitle: 'title', agendaDuration: 'durationMinutes',
					agendaPresenter: 'presenter', agendaNotes: 'notes',
					agendaStatus: 'status',
					participantName: 'name', participantEmail: 'email',
					participantRole: 'role', participantResponse: 'responseStatus',
					participantAttendance: 'attendanceStatus',
					resourceType: 'resourceType', resourceName: 'name',
					resourceQuantity: 'quantity', resourceCost: 'costAmount',
					resourceStatus: 'status',
					actionTitle: 'title', actionOwner: 'ownerName',
					actionDueDate: 'dueDate', actionPriority: 'priority',
					actionStatus: 'status',
					outputTitle: 'title', outputKind: 'kind',
					outputUrl: 'url', outputOwner: 'ownerName',
					outcomeTitle: 'title', outcomeCategory: 'category',
					outcomeImpact: 'impact', outcomeDescription: 'description',
				};
				const dataKey = map[name];
				if (dataKey && row[dataKey] !== undefined && row[dataKey] !== null) {
					el.value = String(row[dataKey]);
				}
			});
		}
	}
	updateSummaryCount();
}

// Wire-up.
document.addEventListener('click', (e) => {
	const t = e.target;
	if (t.matches('button.add-row')) {
		addRow(t.dataset.target);
	} else if (t.matches('button.remove')) {
		removeRow(t.closest('tr'));
	}
});

form.addEventListener('input', () => {
	updateSummaryCount();
	scheduleSave();
});

form.addEventListener('reset', () => {
	reportEl.hidden = true;
	reportBodyEl.innerHTML = '';
	for (const id of ['agenda-table', 'participants-table', 'resources-table',
	                  'actions-table', 'outputs-table', 'outcomes-table']) {
		document.getElementById(id).tBodies[0].innerHTML = '';
	}
	localStorage.removeItem(DRAFT_KEY);
	setTimeout(updateSummaryCount, 0);
});

validateButton.addEventListener('click', () => {
	const data = readData();
	const result = validateMeeting(data);
	renderReport(data, result);
});

exportButton.addEventListener('click', () => {
	const data = readData();
	const result = validateMeeting(data);
	const payload = JSON.stringify({ data, validation: result }, null, 2);
	const blob = new Blob([payload], { type: 'application/json' });
	const url  = URL.createObjectURL(blob);
	const a    = document.createElement('a');
	a.href = url;
	a.download = 'meeting.json';
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
});

restoreDraft();
updateSummaryCount();

})();
