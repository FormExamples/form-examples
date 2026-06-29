<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { DOMAIN_KEYS } from '$lib/engine/stress-grader';
	import {
		riskLevelLabel,
		riskLevelColor,
		domainTitle,
		formatMean,
		departmentLabel,
		tenureBandLabel,
		hoursBandLabel
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/workplace-stress-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/workplace-stress-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `workplace-stress-assessment-${id}.pdf`;
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

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Workplace stress assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/workplace-stress-assessments/${id}`)}>
					Edit
				</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Overall concern banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskLevelColor(result.overallRisk)}">
			<div class="text-3xl font-bold">{riskLevelLabel(result.overallRisk)}</div>
			<div class="mt-2 text-sm">
				{result.answeredCount} of 35 items answered across seven HSE domains
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()} · anonymous response
			</div>
		</div>

		<!-- Domain scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Domain scores</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Domain</th>
						<th class="pb-2 pr-4">Mean (1–5)</th>
						<th class="pb-2 pr-4">Answered</th>
						<th class="pb-2">Concern level</th>
					</tr>
				</thead>
				<tbody>
					{#each DOMAIN_KEYS as key (key)}
						{@const r = result.domains[key]}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 font-medium">{domainTitle(key)}</td>
							<td class="py-2 pr-4">{formatMean(r.mean)}</td>
							<td class="py-2 pr-4 text-base-content/60">{r.answeredCount}/{r.totalCount}</td>
							<td class="py-2"><Badge risk={r.category} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				A higher mean is more favourable (negatively-worded items are reverse-coded). Concern levels
				are benchmarked against HSE percentile norms.
			</p>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for review</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[
									flag.priority
								]}"
							>
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Response context -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Response context</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
				<div>
					<span class="font-medium text-base-content/70">Department:</span>
					{departmentLabel(data.demographics.department)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Tenure:</span>
					{tenureBandLabel(data.demographics.tenureBand)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Hours:</span>
					{hoursBandLabel(data.demographics.hoursBand)}
				</div>
			</div>
		</div>

		<!-- Comments -->
		{#if data.additionalComments.mostStressfulAspect || data.additionalComments.suggestionsForImprovement || data.additionalComments.otherComments}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Comments</h2>
				<dl class="space-y-3 text-sm">
					{#if data.additionalComments.mostStressfulAspect}
						<div>
							<dt class="font-medium text-base-content/70">Most stressful aspect</dt>
							<dd class="mt-1 text-base-content/80">{data.additionalComments.mostStressfulAspect}</dd>
						</div>
					{/if}
					{#if data.additionalComments.suggestionsForImprovement}
						<div>
							<dt class="font-medium text-base-content/70">Suggestions for improvement</dt>
							<dd class="mt-1 text-base-content/80">
								{data.additionalComments.suggestionsForImprovement}
							</dd>
						</div>
					{/if}
					{#if data.additionalComments.otherComments}
						<div>
							<dt class="font-medium text-base-content/70">Other comments</dt>
							<dd class="mt-1 text-base-content/80">{data.additionalComments.otherComments}</dd>
						</div>
					{/if}
				</dl>
			</div>
		{/if}
	</main>
{/if}
