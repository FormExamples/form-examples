<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/indicators.svelte';
	import { CATEGORIES, PERFORMANCE_INDICATORS, TOTAL_INDICATORS } from '$lib/config/indicators';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(store.data);
	const result = $derived(store.result);

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(
				`/hospital-performance-indicators/hospital-performance-indicator-reports/${id}/report/pdf`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ data: store.data, result: store.result })
				}
			);
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `hospital-performance-indicators-${data.reportingPeriod.hospitalName || id}.pdf`;
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

<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
		<h1 class="text-lg font-bold text-base-content">Hospital performance indicators report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button
				data-variant="secondary"
				onclick={() =>
					goto(`/hospital-performance-indicators/hospital-performance-indicator-reports/${id}`)}
				>Edit</Button
			>
		</div>
	</div>
</header>

<main class="mx-16 px-4 py-6">
	<!-- Indicators-recorded tally banner -->
	<div
		class="mb-6 rounded-xl border-2 p-6 text-center {result.reportedCount === result.totalCount
			? 'border-success bg-success/10 text-success'
			: 'border-primary bg-primary/10 text-primary'}"
	>
		<div class="text-3xl font-bold">
			{result.reportedCount} of {result.totalCount} indicators recorded
		</div>
		<div class="mt-2 text-sm">
			This is a completeness tally, not a scored grading engine.
		</div>
	</div>

	<!-- Reporting period -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Reporting period</h2>
		<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
			<div><span class="font-medium text-base-content/70">Hospital / site:</span> {data.reportingPeriod.hospitalName || '—'}</div>
			<div><span class="font-medium text-base-content/70">Prepared by:</span> {data.reportingPeriod.preparedByName || '—'}</div>
			<div><span class="font-medium text-base-content/70">Period month:</span> {data.reportingPeriod.periodMonth ?? '—'}</div>
			<div><span class="font-medium text-base-content/70">Period year:</span> {data.reportingPeriod.periodYear ?? '—'}</div>
		</div>
	</div>

	<!-- Indicators recorded by perspective -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Recorded by perspective</h2>
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-base-300 text-left text-base-content/70">
					<th class="pb-2 pr-4">Perspective</th>
					<th class="pb-2">Recorded</th>
				</tr>
			</thead>
			<tbody>
				{#each result.categoryCounts as c (c.category)}
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">{c.category}. {c.categoryTitle}</td>
						<td class="py-2">{c.reported} / {c.total}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Overall notes & sign-off -->
	{#if data.summary.overallNotes || data.summary.signedAt}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Overall notes &amp; sign-off</h2>
			{#if data.summary.overallNotes}
				<p class="mt-1 whitespace-pre-line text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">Overall notes:</span> {data.summary.overallNotes}
				</p>
			{/if}
			{#if data.summary.signedAt}
				<p class="mt-3 text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">Signed at:</span> {data.summary.signedAt}
				</p>
			{/if}
		</div>
	{/if}

	<!-- Per-indicator values, grouped by perspective -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Per-indicator values</h2>
		<p class="mb-4 text-sm text-base-content/60">{result.reportedCount} of {TOTAL_INDICATORS} indicators recorded.</p>
		{#each CATEGORIES as category (category.number)}
			<h3 class="mb-2 mt-4 text-sm font-semibold text-base-content first:mt-0">
				{category.number}. {category.title}
			</h3>
			<table class="mb-2 w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">ID</th>
						<th class="pb-2 pr-4">Indicator</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Notes</th>
					</tr>
				</thead>
				<tbody>
					{#each PERFORMANCE_INDICATORS.filter((i) => i.category === category.number) as indicator (indicator.id)}
						{@const response = data.items[indicator.id]}
						<tr class="border-b border-base-200">
							<td class="py-1.5 pr-4 font-mono text-xs text-base-content/60">{indicator.id}</td>
							<td class="py-1.5 pr-4">{indicator.text}</td>
							<td class="py-1.5 pr-4">{response?.value ?? '—'}</td>
							<td class="py-1.5">{response?.notes || '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/each}
	</div>
</main>
