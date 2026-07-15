// Wires the form to the scoring engine and renders the report.
// Loaded as a classic <script> after scoring.js, so `IssueTracker.gradeIssue`
// is available on the global namespace.
import { gradeIssue } from './scoring.js';

const form = document.getElementById('issue-form');
const reportEl = document.getElementById('report');
const reportBodyEl = document.getElementById('report-body');
const gradeButton = document.getElementById('grade-button');
const progressEl = document.getElementById('progress');
const progressTextEl = document.getElementById('progress-text');
const errorSummary = document.getElementById('error-summary');

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
	setTimeout(updateProgress, 0);
});

updateProgress();
