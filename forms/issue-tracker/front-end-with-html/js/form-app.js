// Wires the form to the scoring engine and renders the report.
import { gradeIssue } from './scoring.js';

const form = document.getElementById('issue-form');
const reportEl = document.getElementById('report');
const reportBodyEl = document.getElementById('report-body');
const gradeButton = document.getElementById('grade-button');
const progressEl = document.getElementById('progress');
const progressTextEl = document.getElementById('progress-text');
const errorSummary = document.getElementById('error-summary');

// Autosave: persist a partial fill to localStorage on every edit and
// rehydrate it on load so the draft survives a page reload. This form is
// DOM-driven (no central state object), so we serialize every named control
// by its `name` attribute rather than a state snapshot.
const STORAGE_KEY = 'issue-tracker.front-end-with-html.v1';

function saveState() {
	try {
		const out = {};
		form.querySelectorAll('input, select, textarea').forEach((el) => {
			const name = el.name;
			if (!name) return;
			if (el.type === 'checkbox') {
				out[name] = el.checked;
			} else if (el.type === 'radio') {
				if (el.checked) out[name] = el.value;
			} else {
				out[name] = el.value;
			}
		});
		localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
	} catch (e) {
		console.warn('Could not save issue-tracker draft to localStorage.', e);
	}
}

function loadState() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const saved = JSON.parse(raw);
		if (!saved || typeof saved !== 'object') return;
		form.querySelectorAll('input, select, textarea').forEach((el) => {
			const name = el.name;
			if (!name || !(name in saved)) return;
			const v = saved[name];
			if (el.type === 'checkbox') {
				el.checked = Boolean(v);
			} else if (el.type === 'radio') {
				el.checked = el.value === v;
			} else {
				el.value = v ?? '';
			}
		});
		// Let existing handlers (e.g. updateProgress) re-run against restored values.
		form.dispatchEvent(new Event('input', { bubbles: true }));
	} catch (e) {
		console.warn('Could not read issue-tracker draft from localStorage.', e);
	}
}

function clearState() {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (e) {
		console.warn('Could not clear issue-tracker draft from localStorage.', e);
	}
}

const NUMERIC_FIELDS = new Set([
	'ptAffectedUsersCount',
	'hxPriorOccurrences',
	'scoreByPriorityRank',
	'scoreBySeverityOfImpact',
	'scoreByMagnitudeOfDamage',
	'scoreByHarmGrade',
	'scoreByMoscowRequirement',
	'scoreByFrequencyPercent',
]);

const REPORTER_FIELDS = new Set([
	'reporterName', 'reporterEmail', 'reporterRole', 'reportedAt',
	'discoveredAt', 'issueCategory', 'environment', 'systemName',
	'component', 'customerOrProjectTag', 'externalReference',
]);

const SCORE_FIELDS = new Set([
	'scoreByPriorityRank', 'scoreBySeverityOfImpact', 'scoreByMagnitudeOfDamage',
	'scoreByHarmGrade', 'scoreByFailureCondition', 'scoreByMoscowRequirement',
	'scoreByFrequencyPercent',
]);

function readFormData() {
	const fd = new FormData(form);
	const reporter = {};
	const scores = {};
	const flat = {};

	for (const [name, raw] of fd.entries()) {
		const value = typeof raw === 'string' ? raw.trim() : raw;
		let coerced = value;
		if (NUMERIC_FIELDS.has(name)) {
			coerced = value === '' ? null : Number(value);
		}
		if (REPORTER_FIELDS.has(name)) reporter[name] = coerced;
		else if (SCORE_FIELDS.has(name)) scores[name] = coerced;
		else flat[name] = coerced;
	}

	return {
		reporter,
		cc: pluck(flat, ['ccSummary', 'ccLongDescription', 'ccReportedByName', 'ccReportedVia']),
		pt: pluck(flat, ['ptDiscovererName', 'ptAffectedUsersCount', 'ptAffectedUserGroups',
			'ptAssignees', 'ptStakeholdersToInform', 'ptObservers']),
		sx: pluck(flat, ['sxExternalSignals', 'sxAlertIds', 'sxErrorMessages',
			'sxScreenshotsUrl', 'sxLogsUrl', 'sxFirstObservedAt']),
		fx: pluck(flat, ['fxBrokenComponents', 'fxFailedServices', 'fxStuckProcesses',
			'fxHardwareFaults', 'fxDataCorruption']),
		hx: pluck(flat, ['hxRelatedIssues', 'hxPriorOccurrences', 'hxRecentChangeUrl',
			'hxReferences', 'hxTimeline']),
		ix: pluck(flat, ['ixHypotheses', 'ixReproSteps', 'ixDiagnosticQueries',
			'ixTestsRun', 'ixBlockingUnknowns']),
		dx: pluck(flat, ['dxRootCause', 'dxContributingCauses', 'dxScope', 'dxConfirmed']),
		txpx: pluck(flat, ['txMitigationSteps', 'txFixPlan', 'txWorkaround', 'txRollbackPlan',
			'txCommunicationPlan', 'pxExpectedResolutionAt', 'pxResidualRisk',
			'pxMonitoringPlan', 'pxRecurrenceLikelihood', 'pxLessonsLearned']),
		scores: {
			scoreByPriorityRank: scores.scoreByPriorityRank ?? null,
			scoreBySeverityOfImpact: scores.scoreBySeverityOfImpact ?? null,
			scoreByMagnitudeOfDamage: scores.scoreByMagnitudeOfDamage ?? null,
			scoreByHarmGrade: scores.scoreByHarmGrade ?? null,
			scoreByFailureCondition: scores.scoreByFailureCondition ?? '',
			scoreByMoscowRequirement: scores.scoreByMoscowRequirement ?? null,
			scoreByFrequencyPercent: scores.scoreByFrequencyPercent ?? null,
		},
	};
}

function pluck(src, keys) {
	const out = {};
	for (const k of keys) out[k] = src[k] ?? '';
	return out;
}

function escape(s) {
	return String(s ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function renderReport(data, result) {
	const composite = result.compositePriority;
	const scoreRow = (label, value) =>
		`<div><strong>${escape(label)}</strong>${escape(value ?? '—')}</div>`;

	const ruleItem = (r) =>
		`<li><code>${escape(r.ruleId)}</code> — ${escape(r.description)}</li>`;

	const flagItem = (f) =>
		`<li class="flag-${escape(f.priority)}"><strong>[${escape(f.category)}]</strong>
		 ${escape(f.description)}<br><em>${escape(f.suggestedAction)}</em></li>`;

	reportBodyEl.innerHTML = `
		<p>
			Composite priority:
			<span class="composite ${escape(composite)}">${escape(composite)}</span>
		</p>

		<h3>Chief complaint</h3>
		<p>${escape(data.cc.ccSummary || '(none)')}</p>

		<h3>Seven scores</h3>
		<div class="scores">
			${scoreRow('Priority rank', result.scoreByPriorityRank)}
			${scoreRow('Severity of impact', result.scoreBySeverityOfImpact)}
			${scoreRow('Magnitude of damage', result.scoreByMagnitudeOfDamage)}
			${scoreRow('Harm grade', result.scoreByHarmGrade)}
			${scoreRow('Failure condition', result.scoreByFailureCondition)}
			${scoreRow('MoSCoW requirement', result.scoreByMoscowRequirement)}
			${scoreRow('Frequency %', result.scoreByFrequencyPercent)}
		</div>

		<h3>Fired rules (${result.firedRules.length})</h3>
		<ul>${result.firedRules.map(ruleItem).join('')}</ul>

		<h3>Safety flags (${result.additionalFlags.length})</h3>
		${result.additionalFlags.length === 0
			? '<p>(none)</p>'
			: `<ul>${result.additionalFlags.map(flagItem).join('')}</ul>`}
	`;
	reportEl.hidden = false;
	reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateProgress() {
	const inputs = form.querySelectorAll('input, select, textarea');
	let answered = 0;
	let total = 0;
	inputs.forEach((el) => {
		if (el.type === 'reset' || el.type === 'submit' || el.type === 'button') return;
		total++;
		const v = (el.value ?? '').toString().trim();
		if (v !== '') answered++;
	});
	const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
	if (progressEl) progressEl.value = percent;
	if (progressTextEl) progressTextEl.textContent =
		`${answered} of ${total} fields answered (${percent}%)`;
}

form.addEventListener('input', updateProgress);
form.addEventListener('change', updateProgress);
form.addEventListener('input', saveState);
form.addEventListener('change', saveState);

gradeButton.addEventListener('click', () => {
	const data = readFormData();
	const result = gradeIssue(data);
	renderReport(data, result);
	if (errorSummary) {
		errorSummary.hidden = true;
		errorSummary.innerHTML = '';
	}
});

form.addEventListener('reset', () => {
	reportEl.hidden = true;
	reportBodyEl.innerHTML = '';
	if (errorSummary) {
		errorSummary.hidden = true;
		errorSummary.innerHTML = '';
	}
	clearState();
	setTimeout(updateProgress, 0);
});

// Rehydrate any saved draft, then paint the initial progress.
loadState();
updateProgress();
