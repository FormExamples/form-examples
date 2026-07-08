<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { sampleAssessments } from '$lib/data/sample-reports';
	import { getRecommendedActions } from '$lib/engine/recommendations';
	import { bandColor, bandLabel, recommendationCopy } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'agile-consulting-scorecards-for-hiring-help';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const grade = $derived(assessment.grade);
	const actions = $derived(getRecommendedActions(data));

	// Hydrate from the route id so the report works on direct navigation /
	// reload (a saved draft wins, otherwise the matching sample seed).
	$effect(() => {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.grade })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `agile-consulting-scorecard-${data.organization.organizationName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const priorityColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};
</script>

<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
		<h1 class="text-lg font-bold text-base-content">Agile consulting scorecard report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button data-variant="secondary" onclick={() => goto(`/agile-consulting-scorecard-for-hiring-help/${plural}/${id}`)}>Edit</Button>
		</div>
	</div>
</header>

<main class="mx-auto max-w-4xl px-4 py-6">
	<!-- Readiness banner -->
	<div class="mb-6 rounded-xl border-2 p-6 text-center {bandColor(grade.computedBand)}">
		<div class="text-3xl font-bold">{grade.scoreTotal} / 16</div>
		<div class="mt-1 text-lg font-semibold">{bandLabel(grade.computedBand)}</div>
		<div class="mt-2 flex justify-center gap-6 text-sm">
			<span>Manifesto {grade.manifestoSubtotal} / 4</span>
			<span>Principles {grade.principlesSubtotal} / 12</span>
		</div>
		<div class="mt-2 text-sm opacity-80">{recommendationCopy(grade.computedBand)}</div>
	</div>

	<!-- Organization & respondent -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Organization &amp; respondent</h2>
		<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
			<div><span class="font-medium text-base-content/70">Organization:</span> {data.organization.organizationName || '—'}</div>
			<div><span class="font-medium text-base-content/70">Sector:</span> {data.organization.sector || '—'}</div>
			<div><span class="font-medium text-base-content/70">Size band:</span> {data.organization.sizeBand || '—'}</div>
			<div><span class="font-medium text-base-content/70">Respondent:</span> {data.respondent.respondentName || '—'}</div>
			<div><span class="font-medium text-base-content/70">Role:</span> {data.respondent.role || '—'}</div>
			<div><span class="font-medium text-base-content/70">Assessment date:</span> {data.assessment.assessmentDate || '—'}</div>
		</div>
	</div>

	<!-- Readiness flags -->
	{#if grade.additionalFlags.length > 0}
		<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-error">Readiness flags</h2>
			<div class="space-y-2">
				{#each grade.additionalFlags as flag (flag.flagId)}
					<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
						<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
							{flag.priority}
						</span>
						<div>
							<span class="font-medium">{flag.category}:</span> {flag.description}
							<div class="mt-1 text-xs opacity-80"><strong>Suggested action:</strong> {flag.suggestedAction}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Recommended next actions -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Recommended next actions</h2>
		{#if actions.length === 0}
			<p class="text-sm text-base-content/70">No items marked "No" — no specific interventions recommended.</p>
		{:else}
			<p class="text-sm text-base-content/70">
				One per item the respondent marked "No". Work through these before (or alongside) any
				agile-consulting engagement.
			</p>
			<ol class="mt-3 list-decimal space-y-3 pl-5 text-sm">
				{#each actions as action (action.itemKey)}
					<li>
						<div class="font-semibold">{action.heading}</div>
						<div class="mt-1">{action.intervention}</div>
						<div class="mt-1 text-xs italic text-base-content/70">Why: {action.rationale}</div>
					</li>
				{/each}
			</ol>
		{/if}
	</div>

	<!-- Item-by-item answers -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Score justification</h2>
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-base-300 text-left text-base-content/70">
					<th class="pb-2 pr-4">Rule</th>
					<th class="pb-2 pr-4">Instrument</th>
					<th class="pb-2 pr-4">Item</th>
					<th class="pb-2 pr-4">Answer</th>
					<th class="pb-2">Points</th>
				</tr>
			</thead>
			<tbody>
				{#each grade.firedRules.filter((r) => r.instrument !== 'composite') as rule (rule.ruleId)}
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
						<td class="py-2 pr-4">{rule.instrument}</td>
						<td class="py-2 pr-4">{rule.description}</td>
						<td class="py-2 pr-4">{rule.grade}</td>
						<td class="py-2">{rule.pointsAwarded}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
