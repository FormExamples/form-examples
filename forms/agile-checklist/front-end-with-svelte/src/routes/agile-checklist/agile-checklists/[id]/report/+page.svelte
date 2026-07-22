<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/checklist.svelte';
	import { ALL_ITEMS, SECTION_LABEL } from '$lib/config/items';
	import {
		maturityLabel,
		maturityColor,
		bandLabel,
		bandColor,
		priorityColor,
		pctOrDash
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/agile-checklists/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `agile-checklist-${data.respondent.teamName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const sections = $derived([
		{ key: 'teams', label: 'Teams', score: result.teams },
		{ key: 'stakeholders', label: 'Stakeholders', score: result.stakeholders },
		{ key: 'practices', label: 'Practices', score: result.practices }
	]);

	const actions = $derived(
		[data.actionPlan.topAction1, data.actionPlan.topAction2, data.actionPlan.topAction3].filter(
			(a) => a.trim().length > 0
		)
	);
</script>

<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
		<h1 class="text-lg font-bold text-base-content">Agile checklist report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button data-variant="secondary" onclick={() => goto(`/agile-checklist/agile-checklists/${id}`)}>Edit</Button>
		</div>
	</div>
</header>

<main class="mx-16 px-4 py-6">
	<!-- Composite maturity banner (status / classification, not a numeric grade) -->
	<div class="mb-6 rounded-xl border-2 p-6 text-center {maturityColor(result.maturity)}">
		<div class="text-3xl font-bold">{maturityLabel(result.maturity)}</div>
		<div class="mt-2 text-sm">
			Overall {pctOrDash(result.overallPercent)} · {result.answeredCount} of 57 items answered
		</div>
	</div>

	<!-- Respondent summary -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Respondent</h2>
		<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
			<div><span class="font-medium text-base-content/70">Name:</span> {data.respondent.fullName || '—'}</div>
			<div><span class="font-medium text-base-content/70">Role:</span> {data.respondent.role || '—'}</div>
			<div><span class="font-medium text-base-content/70">Team:</span> {data.respondent.teamName || '—'}</div>
			<div><span class="font-medium text-base-content/70">Organisation:</span> {data.respondent.organisationName || '—'}</div>
			<div><span class="font-medium text-base-content/70">Date:</span> {data.respondent.assessmentDate || '—'}</div>
			<div><span class="font-medium text-base-content/70">Cadence:</span> {data.respondent.assessmentPeriod || '—'}</div>
		</div>
	</div>

	<!-- Per-section bands -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Per-section bands</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
			{#each sections as s (s.key)}
				<div class="rounded-lg border p-4 text-center {bandColor(s.score.band)}">
					<div class="text-sm font-semibold">{s.label}</div>
					<div class="mt-1 text-2xl font-bold">{pctOrDash(s.score.percent)}</div>
					<div class="mt-1 text-xs uppercase tracking-wide">{bandLabel(s.score.band)}</div>
					<div class="mt-1 text-xs opacity-80">
						{s.score.yesCount} yes · {s.score.noCount} no · {s.score.notApplicableCount} n/a
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Operational flags -->
	{#if result.additionalFlags.length > 0}
		<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-error">Operational flags</h2>
			<div class="space-y-2">
				{#each result.additionalFlags as flag (flag.flagId)}
					<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
						<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
							{flag.priority}
						</span>
						<div>
							<span class="font-medium">{flag.category}:</span>
							{flag.description}
							<span class="opacity-80">— {flag.suggestedAction}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Fired coaching rules -->
	{#if result.firedRules.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Coaching rules</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Rule</th>
						<th class="pb-2 pr-4">Section</th>
						<th class="pb-2 pr-4">Band</th>
						<th class="pb-2">Coaching note</th>
					</tr>
				</thead>
				<tbody>
					{#each result.firedRules as rule (rule.ruleId)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
							<td class="py-2 pr-4">{rule.section ? SECTION_LABEL[rule.section] : '—'}</td>
							<td class="py-2 pr-4">{bandLabel(rule.band)}</td>
							<td class="py-2">{rule.description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Action plan -->
	{#if actions.length > 0 || data.actionPlan.coachNotes || data.actionPlan.overallNotes}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Action plan</h2>
			{#if actions.length > 0}
				<ol class="list-decimal space-y-1 pl-5 text-sm text-base-content/80">
					{#each actions as a, i (i)}
						<li>{a}</li>
					{/each}
				</ol>
			{/if}
			{#if data.actionPlan.coachNotes}
				<p class="mt-3 whitespace-pre-line text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">Coach notes:</span> {data.actionPlan.coachNotes}
				</p>
			{/if}
			{#if data.actionPlan.overallNotes}
				<p class="mt-3 whitespace-pre-line text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">Overall notes:</span> {data.actionPlan.overallNotes}
				</p>
			{/if}
		</div>
	{/if}

	<!-- Per-item answers -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Per-item answers</h2>
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-base-300 text-left text-base-content/70">
					<th class="pb-2 pr-4">ID</th>
					<th class="pb-2 pr-4">Section</th>
					<th class="pb-2 pr-4">Item</th>
					<th class="pb-2">Answer</th>
				</tr>
			</thead>
			<tbody>
				{#each ALL_ITEMS as item (item.id)}
					<tr class="border-b border-base-200">
						<td class="py-1.5 pr-4 font-mono text-xs text-base-content/60">{item.id}</td>
						<td class="py-1.5 pr-4">{SECTION_LABEL[item.section]}</td>
						<td class="py-1.5 pr-4">{item.text}</td>
						<td class="py-1.5 uppercase">{data.answers[item.id] || '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
