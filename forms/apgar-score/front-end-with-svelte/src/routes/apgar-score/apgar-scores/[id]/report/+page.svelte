<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		bandLabel,
		bandColor,
		trendLabel,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		modeOfDeliveryLabel,
		sexLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/apgar-score/apgar-scores/${id}`);
		}
	});

	const scored = $derived((result?.timepoints ?? []).filter((t) => t.scored));
	const worst = $derived(
		scored.length ? scored.reduce((a, b) => (b.total < a.total ? b : a)) : null
	);

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/apgar-scores/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `apgar-score-${data.identification.newbornIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Apgar score report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/apgar-score/apgar-scores/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {bandColor(worst ? worst.band : 'reassuring')}">
			<div class="text-3xl font-bold">
				{worst ? `${worst.total} of 10` : '—'}
			</div>
			<div class="mt-2 text-sm font-semibold">
				{worst ? `Lowest scored total — ${bandLabel(worst.band)}` : 'No timepoints scored'}
			</div>
			<div class="mt-1 text-sm opacity-75">Trend across timepoints: {trendLabel(result.trend)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if worst && worst.total <= 3}
				<p class="text-sm text-base-content/80">
					A timepoint total of 3 or below indicates a <strong>severely depressed newborn</strong>.
					Commence active resuscitation per the newborn-life-support algorithm and obtain senior /
					neonatal support immediately.
				</p>
			{:else if worst && worst.total <= 6}
				<p class="text-sm text-base-content/80">
					A moderately low total (4-6) prompts <strong>support and stimulation</strong> (drying,
					warmth, airway positioning, tactile stimulation, oxygen as indicated). Continue to
					reassess.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					Totals in the reassuring range (7-10) indicate the newborn has adapted well. Continue
					routine care and observation; re-score if the condition changes.
				</p>
			{/if}
		</div>

		<!-- Per-timepoint scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Per-timepoint scores</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Timepoint</th>
						<th class="pb-2 pr-4">Total</th>
						<th class="pb-2 pr-4">Band</th>
						<th class="pb-2">Completeness</th>
					</tr>
				</thead>
				<tbody>
					{#if scored.length === 0}
						<tr>
							<td class="py-2 text-base-content/60" colspan="4">No timepoints scored.</td>
						</tr>
					{:else}
						{#each scored as g (g.timepointMinutes)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4">{g.timepointMinutes == null ? '—' : `${g.timepointMinutes} min`}</td>
								<td class="py-2 pr-4">
									<span class="rounded-full border px-2 py-0.5 text-xs font-bold {bandColor(g.band)}">
										{g.total} of 10
									</span>
								</td>
								<td class="py-2 pr-4">{bandLabel(g.band)}</td>
								<td class="py-2">{g.answeredCount === 5 ? 'All 5 signs' : `${g.answeredCount} of 5 signs`}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Flagged issues ({result.flaggedIssues.length})
				</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.description} — {flag.suggestedAction}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Newborn / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Newborn ID:</span>
					{data.identification.newbornIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Birth order:</span>
					{data.identification.birthOrder === null ? 'N/A' : data.identification.birthOrder}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Gestational age:</span>
					{data.context.gestationalAgeWeeks === null
						? 'N/A'
						: `${data.context.gestationalAgeWeeks} weeks`}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Mode of delivery:</span>
					{modeOfDeliveryLabel(data.context.modeOfDelivery) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Born at:</span>
					{data.context.bornAt || 'N/A'}
				</div>
			</div>
			{#if data.summary.resuscitationMeasures}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Resuscitation measures:</span>
					<p class="mt-1 text-base-content/80">{data.summary.resuscitationMeasures}</p>
				</div>
			{/if}
			{#if data.summary.clinicianNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.summary.clinicianNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
