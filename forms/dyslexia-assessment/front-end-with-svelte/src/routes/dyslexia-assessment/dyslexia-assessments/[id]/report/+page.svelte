<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { severityLabel, severityColor, scoreBandLabel, calculateAge } from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/dyslexia-assessment/dyslexia-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/dyslexia-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `dyslexia-assessment-${data.demographics.lastName || id}.pdf`;
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

	const severityCellColor: Record<string, string> = {
		none: 'text-success',
		mild: 'text-warning',
		moderate: 'text-warning',
		severe: 'text-error'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Dyslexia assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/dyslexia-assessment/dyslexia-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall severity banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {severityColor(result.overallSeverity)}">
			<div class="text-3xl font-bold">{severityLabel(result.overallSeverity)}</div>
			<div class="mt-2 text-sm">
				{#if result.lowestScore === null}
					No standardised scores entered
				{:else}
					Lowest standardised score: {result.lowestScore} ({scoreBandLabel(result.lowestScore)})
				{/if}
			</div>
			<div class="mt-1 text-sm opacity-75">
				Based on {result.answeredCount} of {result.domainScores.length} domain scores · Generated {new Date(
					result.timestamp
				).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinician</h2>
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

		<!-- Per-domain scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Per-domain standardised scores</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">ID</th>
						<th class="pb-2 pr-4">Category</th>
						<th class="pb-2 pr-4">Domain</th>
						<th class="pb-2 pr-4">Score</th>
						<th class="pb-2">Severity</th>
					</tr>
				</thead>
				<tbody>
					{#each result.domainScores as s (s.id)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{s.id}</td>
							<td class="py-2 pr-4">{s.category}</td>
							<td class="py-2 pr-4">{s.description}</td>
							<td class="py-2 pr-4">{s.score === null ? '—' : s.score}</td>
							<td class="py-2 font-medium {severityCellColor[s.severity]}">{severityLabel(s.severity)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if data.demographics.ageYears ?? calculateAge(data.demographics.dateOfBirth)}(Age {data.demographics.ageYears ?? calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Referral:</span> {data.demographics.referralSource || 'N/A'}</div>
			</div>
		</div>
	</main>
{/if}
