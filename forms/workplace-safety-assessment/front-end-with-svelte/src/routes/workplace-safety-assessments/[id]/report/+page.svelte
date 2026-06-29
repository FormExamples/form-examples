<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { outcomeLabel, outcomeColor, actionTimeframe } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/workplace-safety-assessments/${id}`);
		}
	});

	// Non-compliant findings (severity grade ≥ 2); grade-1 items are compliant.
	const findings = $derived((result?.firedRules ?? []).filter((r) => r.grade >= 2));
	const categories = $derived(Object.values(result?.findingsByCategory ?? {}));

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/workplace-safety-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `workplace-safety-assessment-${data.siteDetails.siteName || id}.pdf`;
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
		urgent: 'bg-error text-error-content border-error',
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Workplace safety audit report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/workplace-safety-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeColor(result.outcome)}">
			<div class="text-3xl font-bold">{outcomeLabel(result.outcome)}</div>
			<div class="mt-2 text-sm">{actionTimeframe(result.outcome)}</div>
			<div class="mt-2 text-sm opacity-75">
				{result.answeredCount} checklist items assessed · Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the auditor</h2>
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

		<!-- Findings by category -->
		{#if categories.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Findings by category</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Compliant</th>
							<th class="pb-2 pr-4">Minor</th>
							<th class="pb-2 pr-4">Major</th>
							<th class="pb-2 pr-4">Critical</th>
							<th class="pb-2">Total</th>
						</tr>
					</thead>
					<tbody>
						{#each categories as c (c.category)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4">{c.category}</td>
								<td class="py-2 pr-4">{c.compliant}</td>
								<td class="py-2 pr-4">{c.minor}</td>
								<td class="py-2 pr-4">{c.major}</td>
								<td class="py-2 pr-4">{c.critical}</td>
								<td class="py-2 font-medium">{c.total}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Non-compliant findings -->
		{#if findings.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Non-compliant findings</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Severity</th>
						</tr>
					</thead>
					<tbody>
						{#each findings as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge grade={rule.grade} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Audit summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Audit summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Site:</span> {data.siteDetails.siteName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Department / area:</span> {data.siteDetails.departmentArea || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Auditor:</span> {data.siteDetails.auditorName} {data.siteDetails.auditorRole ? `(${data.siteDetails.auditorRole})` : ''}</div>
				<div><span class="font-medium text-base-content/70">Audit date:</span> {data.siteDetails.auditDate || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Site manager:</span> {data.siteDetails.siteManager || 'N/A'}</div>
			</div>
			{#if data.signoffActionPlan.overallSummary}
				<p class="mt-4 text-sm text-base-content/80">{data.signoffActionPlan.overallSummary}</p>
			{/if}
		</div>

		<!-- Action plan -->
		{#if data.signoffActionPlan.actionItems.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Action plan</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.signoffActionPlan.actionItems as item, i (i)}
						<li>
							<strong>{item.description || 'Action'}</strong>
							{#if item.owner} — {item.owner}{/if}
							{#if item.dueDate} (due {item.dueDate}){/if}
							{#if item.priority}
								<span class="ml-1 rounded px-1.5 py-0.5 text-xs {item.priority === 'critical' ? 'bg-error text-error-content' : item.priority === 'major' ? 'bg-warning text-warning-content' : 'bg-info text-info-content'}">
									{item.priority}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
