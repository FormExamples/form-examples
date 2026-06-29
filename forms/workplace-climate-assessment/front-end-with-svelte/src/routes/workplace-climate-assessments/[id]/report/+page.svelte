<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		categoryLabel,
		categoryColor,
		priorityColor,
		domainLabel,
		optionLabel,
		DOMAIN_LABELS,
		DEPARTMENT_OPTIONS,
		TENURE_OPTIONS,
		HOURS_OPTIONS,
		ROLE_LEVEL_OPTIONS,
		WORK_LOCATION_OPTIONS,
		RECOMMEND_OPTIONS
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { GradedDomainKey } from '$lib/engine/types';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/workplace-climate-assessments/${id}`);
		}
	});

	const domainKeys = Object.keys(DOMAIN_LABELS) as GradedDomainKey[];

	const demoBits = $derived(
		[
			optionLabel(DEPARTMENT_OPTIONS, data.demographics.department) &&
				`Department: ${optionLabel(DEPARTMENT_OPTIONS, data.demographics.department)}`,
			optionLabel(TENURE_OPTIONS, data.demographics.tenureBand) &&
				`Tenure: ${optionLabel(TENURE_OPTIONS, data.demographics.tenureBand)}`,
			optionLabel(HOURS_OPTIONS, data.demographics.hoursBand) &&
				`Hours: ${optionLabel(HOURS_OPTIONS, data.demographics.hoursBand)}`,
			optionLabel(ROLE_LEVEL_OPTIONS, data.demographics.roleLevel) &&
				`Role level: ${optionLabel(ROLE_LEVEL_OPTIONS, data.demographics.roleLevel)}`,
			optionLabel(WORK_LOCATION_OPTIONS, data.demographics.workLocation) &&
				`Location: ${optionLabel(WORK_LOCATION_OPTIONS, data.demographics.workLocation)}`
		].filter(Boolean) as string[]
	);

	const recommendLabel = $derived(
		optionLabel(RECOMMEND_OPTIONS, data.overall.recommendAsPlaceToWork)
	);

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/workplace-climate-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `workplace-climate-assessment-${id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Workplace climate report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/workplace-climate-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Composite index banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {categoryColor(result.category)}">
			<div class="text-3xl font-bold">
				{result.compositeScore !== null ? `${result.compositeScore} / 100` : 'No items answered'}
			</div>
			<div class="mt-2 text-lg font-semibold">{categoryLabel(result.category)} climate</div>
			<div class="mt-2 text-sm opacity-75">
				{result.answeredCount} of {result.totalCount} graded items answered · generated
				{new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<p class="mb-6 text-sm text-base-content/60">
			The composite is the average of the eight graded domain scores; each domain score is the mean
			of its 1-5 Likert items × 20. Bands: 85-100 thriving, 70-84 healthy, 50-69 developing, 25-49
			strained, 0-24 critical. This is a screening and engagement tool, not a clinical instrument.
		</p>

		<!-- Recommendation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommendation</h2>
			{#if recommendLabel}
				<p class="text-sm text-base-content/80">
					Would recommend as a place to work: <strong>{recommendLabel}</strong>
				</p>
			{:else}
				<p class="text-sm text-base-content/60">Recommendation question not answered.</p>
			{/if}
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for HR / leadership</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Per-domain breakdown -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Per-domain breakdown</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Domain</th>
						<th class="pb-2 pr-4">Score (0–100)</th>
						<th class="pb-2 pr-4">Mean (1–5)</th>
						<th class="pb-2 pr-4">Answered</th>
						<th class="pb-2">Category</th>
					</tr>
				</thead>
				<tbody>
					{#each domainKeys as key (key)}
						{@const r = result.domainScores[key]}
						<tr class="border-b border-base-200">
							<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/80">{domainLabel(key)}</th>
							<td class="py-2 pr-4">{r.score === null ? 'No answers' : `${r.score.toFixed(1)} / 100`}</td>
							<td class="py-2 pr-4">{r.mean === null ? '—' : r.mean.toFixed(2)}</td>
							<td class="py-2 pr-4">{r.answeredCount} / {r.totalCount}</td>
							<td class="py-2">
								{#if r.category}<Badge category={r.category} />{:else}—{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Anonymous response context -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Anonymous response context</h2>
			{#if demoBits.length > 0}
				<p class="text-sm text-base-content/70">{demoBits.join(' · ')}</p>
			{:else}
				<p class="text-sm text-base-content/60">No demographic banding entered.</p>
			{/if}
		</div>

		<!-- Free-text feedback -->
		{#if data.overall.biggestStrength || data.overall.biggestImprovement || data.overall.otherComments}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Free-text feedback</h2>
				<dl class="space-y-3 text-sm">
					{#if data.overall.biggestStrength}
						<div>
							<dt class="font-medium text-base-content/70">Biggest strength</dt>
							<dd class="mt-1 text-base-content/80">{data.overall.biggestStrength}</dd>
						</div>
					{/if}
					{#if data.overall.biggestImprovement}
						<div>
							<dt class="font-medium text-base-content/70">Biggest improvement</dt>
							<dd class="mt-1 text-base-content/80">{data.overall.biggestImprovement}</dd>
						</div>
					{/if}
					{#if data.overall.otherComments}
						<div>
							<dt class="font-medium text-base-content/70">Other comments</dt>
							<dd class="mt-1 text-base-content/80">{data.overall.otherComments}</dd>
						</div>
					{/if}
				</dl>
			</div>
		{/if}
	</main>
{/if}
