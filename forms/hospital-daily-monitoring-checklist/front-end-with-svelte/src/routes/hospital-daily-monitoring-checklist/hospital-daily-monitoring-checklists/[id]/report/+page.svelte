<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { CHECKLIST_ITEMS, SECTIONS } from '$lib/config/items';
	import { statusLabel, statusColor } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(
				`/hospital-daily-monitoring-checklist/hospital-daily-monitoring-checklists/${id}/report/pdf`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ data: assessment.data, result: assessment.result })
				}
			);
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `hospital-daily-monitoring-checklist-${data.inspectionDetails.hospitalName || id}.pdf`;
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
		<h1 class="text-lg font-bold text-base-content">Hospital daily monitoring checklist report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button
				data-variant="secondary"
				onclick={() =>
					goto(`/hospital-daily-monitoring-checklist/hospital-daily-monitoring-checklists/${id}`)}
				>Edit</Button
			>
		</div>
	</div>
</header>

<main class="mx-16 px-4 py-6">
	<!-- Needs-attention tally banner -->
	<div
		class="mb-6 rounded-xl border-2 p-6 text-center {result.needsAttentionCount > 0
			? 'border-error bg-error/10 text-error'
			: 'border-success bg-success/10 text-success'}"
	>
		<div class="text-3xl font-bold">
			{result.needsAttentionCount} needs-attention checkpoint{result.needsAttentionCount === 1
				? ''
				: 's'}
		</div>
		<div class="mt-2 text-sm">
			{result.answeredCount} of 97 checkpoints answered
			{#if result.sectionsWithNeedsAttention.length > 0}
				· {result.sectionsWithNeedsAttention.length} area{result.sectionsWithNeedsAttention
					.length === 1
					? ''
					: 's'} affected
			{/if}
		</div>
	</div>

	<!-- Inspection details -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Inspection details</h2>
		<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
			<div><span class="font-medium text-base-content/70">Hospital:</span> {data.inspectionDetails.hospitalName || '—'}</div>
			<div><span class="font-medium text-base-content/70">Department / site:</span> {data.inspectionDetails.departmentOrSite || '—'}</div>
			<div><span class="font-medium text-base-content/70">Inspection date:</span> {data.inspectionDetails.inspectionDate || '—'}</div>
			<div><span class="font-medium text-base-content/70">Inspecting officer:</span> {data.inspectionDetails.inspectingOfficerName || '—'}</div>
			<div><span class="font-medium text-base-content/70">Designation:</span> {data.inspectionDetails.inspectingOfficerDesignation || '—'}</div>
		</div>
	</div>

	<!-- Needs-attention checkpoints -->
	{#if result.needsAttentionItems.length > 0}
		<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-error">Needs-attention checkpoints</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">ID</th>
						<th class="pb-2 pr-4">Area</th>
						<th class="pb-2 pr-4">Checkpoint</th>
						<th class="pb-2">Remarks</th>
					</tr>
				</thead>
				<tbody>
					{#each result.needsAttentionItems as item (item.id)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{item.id}</td>
							<td class="py-2 pr-4">{item.sectionTitle}</td>
							<td class="py-2 pr-4">{item.text}</td>
							<td class="py-2">{item.remarks || '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Overall notes, action plan, sign-off -->
	{#if data.summary.overallNotes || data.summary.actionPlan || data.summary.signedAt}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Overall notes &amp; action plan</h2>
			{#if data.summary.overallNotes}
				<p class="mt-1 whitespace-pre-line text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">Overall notes:</span> {data.summary.overallNotes}
				</p>
			{/if}
			{#if data.summary.actionPlan}
				<p class="mt-3 whitespace-pre-line text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">Action plan:</span> {data.summary.actionPlan}
				</p>
			{/if}
			{#if data.summary.signedAt}
				<p class="mt-3 text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">Signed at:</span> {data.summary.signedAt}
				</p>
			{/if}
		</div>
	{/if}

	<!-- Per-checkpoint answers, grouped by area -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Per-checkpoint answers</h2>
		{#each SECTIONS as section (section.number)}
			<h3 class="mb-2 mt-4 text-sm font-semibold text-base-content first:mt-0">
				{section.number}. {section.title}
			</h3>
			<table class="mb-2 w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">ID</th>
						<th class="pb-2 pr-4">Checkpoint</th>
						<th class="pb-2 pr-4">Status</th>
						<th class="pb-2">Remarks</th>
					</tr>
				</thead>
				<tbody>
					{#each CHECKLIST_ITEMS.filter((i) => i.section === section.number) as item (item.id)}
						{@const response = data.items[item.id]}
						<tr class="border-b border-base-200">
							<td class="py-1.5 pr-4 font-mono text-xs text-base-content/60">{item.id}</td>
							<td class="py-1.5 pr-4">{item.text}</td>
							<td class="py-1.5 pr-4">
								<span
									class="rounded border px-2 py-0.5 text-xs font-semibold {statusColor(
										response?.status ?? ''
									)}">{statusLabel(response?.status ?? '')}</span
								>
							</td>
							<td class="py-1.5">{response?.remarks || '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/each}
	</div>
</main>
