<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		categoryLabel,
		categoryColor,
		enpsClassificationLabel,
		enpsColor,
		domainLabel,
		retentionIntentLabel
	} from '$lib/engine/utils';
	import { GRADED_DOMAIN_KEYS } from '$lib/engine/rules';
	import { DEPARTMENT_OPTIONS, TENURE_OPTIONS, HOURS_OPTIONS } from '$lib/engine/rules';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/employee-satisfaction-surveys/${id}`);
		}
	});

	function labelFor(options: { value: string; label: string }[], value: string): string {
		return options.find((o) => o.value === value)?.label ?? '—';
	}

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/employee-satisfaction-surveys/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `employee-satisfaction-survey-${id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Employee satisfaction survey report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/employee-satisfaction-surveys/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Composite banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {categoryColor(result.category)}">
			<div class="text-3xl font-bold">
				{result.compositeScore ?? '—'}<span class="text-xl font-semibold">/100</span>
			</div>
			<div class="mt-1 text-lg font-semibold">{categoryLabel(result.category)}</div>
			<div class="mt-2 text-sm opacity-75">
				{result.answeredCount} of {result.totalCount} items answered · generated
				{new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- eNPS -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">eNPS &amp; retention</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Recommend score:</span>
					{result.eNPS.score ?? '—'}/10
					{#if result.eNPS.classification}
						<span class="ml-2 inline-block rounded-full border px-2 py-0.5 text-xs font-bold {enpsColor(result.eNPS.classification)}">
							{enpsClassificationLabel(result.eNPS.classification)}
						</span>
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Retention intent:</span>
					{retentionIntentLabel(data.overall.retentionIntent)}
				</div>
			</div>
		</div>

		<!-- Domain scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Domain scores</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Domain</th>
						<th class="pb-2 pr-4">Answered</th>
						<th class="pb-2 pr-4">Score</th>
						<th class="pb-2">Category</th>
					</tr>
				</thead>
				<tbody>
					{#each GRADED_DOMAIN_KEYS as key (key)}
						{@const ds = result.domainScores[key]}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{domainLabel(key)}</td>
							<td class="py-2 pr-4 text-base-content/70">{ds.answeredCount}/{ds.totalCount}</td>
							<td class="py-2 pr-4 font-medium">{ds.score ?? '—'}{ds.score !== null ? '/100' : ''}</td>
							<td class="py-2">
								{#if ds.category}
									<span class="inline-block rounded-full border px-2 py-0.5 text-xs font-bold {categoryColor(ds.category)}">
										{categoryLabel(ds.category)}
									</span>
								{:else}
									<span class="text-base-content/60">—</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for HR review</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Respondent context -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Respondent context (anonymised)</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Department:</span> {labelFor(DEPARTMENT_OPTIONS, data.demographics.department)}</div>
				<div><span class="font-medium text-base-content/70">Tenure:</span> {labelFor(TENURE_OPTIONS, data.demographics.tenureBand)}</div>
				<div><span class="font-medium text-base-content/70">Hours:</span> {labelFor(HOURS_OPTIONS, data.demographics.hoursBand)}</div>
			</div>
		</div>

		<!-- Free-text comments -->
		{#if data.overall.suggestionsForImprovement || data.overall.otherComments}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Open-text comments</h2>
				{#if data.overall.suggestionsForImprovement}
					<p class="mb-3 text-sm text-base-content/80">
						<span class="font-medium text-base-content/70">Most important improvement:</span>
						{data.overall.suggestionsForImprovement}
					</p>
				{/if}
				{#if data.overall.otherComments}
					<p class="text-sm text-base-content/80">
						<span class="font-medium text-base-content/70">Other comments:</span>
						{data.overall.otherComments}
					</p>
				{/if}
			</div>
		{/if}
	</main>
{/if}
