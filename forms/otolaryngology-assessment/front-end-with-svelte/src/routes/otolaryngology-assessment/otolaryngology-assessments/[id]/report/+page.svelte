<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { severityLabel, severityColor, priorityColor, calculateAge } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/otolaryngology-assessment/otolaryngology-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/otolaryngology-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `otolaryngology-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Otolaryngology assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/otolaryngology-assessment/otolaryngology-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- SNOT-22 result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {severityColor(result.severityLevel)}">
			<div class="text-3xl font-bold">SNOT-22: {result.totalScore} / 110</div>
			<div class="mt-2 text-sm">{severityLabel(result.severityLevel)}</div>
			<div class="mt-2 text-sm opacity-75">
				{result.answeredCount} of 22 items answered · Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for ENT clinician</h2>
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

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Occupation:</span> {data.demographics.occupation || 'N/A'}</div>
			</div>
			{#if data.presentingComplaint.chiefComplaint}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Presenting complaint:</span>
					{data.presentingComplaint.chiefComplaint}
				</div>
			{/if}
		</div>

		<!-- SNOT-22 itemised scores -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">SNOT-22 itemised scores</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Item</th>
							<th class="pb-2 pr-4">Symptom</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">{rule.score}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Clinical impression -->
		{#if data.clinicalImpressionPlan.workingDiagnosis || data.clinicalImpressionPlan.followUpPlan}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Clinical impression &amp; plan</h2>
				<div class="space-y-2 text-sm text-base-content/80">
					{#if data.clinicalImpressionPlan.workingDiagnosis}
						<div><span class="font-medium text-base-content/70">Working diagnosis:</span> {data.clinicalImpressionPlan.workingDiagnosis}</div>
					{/if}
					{#if data.clinicalImpressionPlan.differentialDiagnosis}
						<div><span class="font-medium text-base-content/70">Differential:</span> {data.clinicalImpressionPlan.differentialDiagnosis}</div>
					{/if}
					{#if data.clinicalImpressionPlan.followUpPlan}
						<div><span class="font-medium text-base-content/70">Follow-up:</span> {data.clinicalImpressionPlan.followUpPlan}</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
{/if}
