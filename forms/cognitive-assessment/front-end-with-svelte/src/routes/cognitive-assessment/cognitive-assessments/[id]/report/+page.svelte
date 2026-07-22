<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		mmseScoreColor,
		calculateAge,
		educationLabel,
		adlLabel,
		referralSourceLabel,
		referralReasonLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/cognitive-assessment/cognitive-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/cognitive-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `cognitive-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Cognitive assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/cognitive-assessment/cognitive-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- MMSE Score Banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {mmseScoreColor(result.mmseScore)}">
			<div class="text-3xl font-bold">MMSE {result.mmseScore}/30</div>
			<div class="mt-1 text-lg">{result.mmseCategory}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
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

		<!-- MMSE Breakdown -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">MMSE score breakdown</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Item</th>
							<th class="pb-2 pr-4">Domain</th>
							<th class="pb-2 pr-4">Description</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">{rule.score}/1</td>
							</tr>
						{/each}
					</tbody>
				</table>
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
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex}</div>
				<div><span class="font-medium text-base-content/70">Education:</span> {data.demographics.educationLevel ? educationLabel(data.demographics.educationLevel) : 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Referral source:</span> {data.referralInformation.referralSource ? referralSourceLabel(data.referralInformation.referralSource) : 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Referral reason:</span> {data.referralInformation.referralReason ? referralReasonLabel(data.referralInformation.referralReason) : 'N/A'}</div>
			</div>
		</div>

		<!-- Functional history -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Functional history</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Living arrangement:</span> {data.functionalHistory.livingArrangement || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Carers available:</span> {data.functionalHistory.carersAvailable || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Bathing:</span> {adlLabel(data.functionalHistory.adlBathing) || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Dressing:</span> {adlLabel(data.functionalHistory.adlDressing) || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Meals:</span> {adlLabel(data.functionalHistory.adlMeals) || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Medications:</span> {adlLabel(data.functionalHistory.adlMedications) || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Finances:</span> {adlLabel(data.functionalHistory.adlFinances) || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Transport:</span> {adlLabel(data.functionalHistory.adlTransport) || 'N/A'}</div>
			</div>
			{#if data.functionalHistory.safetyConerns}
				<div class="mt-4 rounded-lg border border-error/40 bg-error/10 p-3">
					<span class="font-medium text-error">Safety concerns:</span>
					<p class="text-sm text-base-content/80">{data.functionalHistory.safetyConerns}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
