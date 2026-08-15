<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { abnormalityLevelLabel, abnormalityLevelColor } from '#lib/engine/utils.js';

	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/hematology-assessment/hematology-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/hematology-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `hematology-assessment-${data.patientInformation.patientName || id}.pdf`;
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

	const concernColor: Record<string, string> = {
		high: 'bg-error text-error-content',
		medium: 'bg-warning text-warning-content',
		low: 'bg-success text-success-content'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Hematology assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/hematology-assessment/hematology-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {abnormalityLevelColor(result.abnormalityLevel)}">
			<div class="text-3xl font-bold">{result.abnormalityScore}%</div>
			<div class="mt-1 text-lg">{abnormalityLevelLabel(result.abnormalityLevel)}</div>
			<div class="mt-2 text-sm opacity-75">
				Composite abnormality score | Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for haematologist</h2>
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

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Hematology analysis</h2>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-base-300 text-left text-base-content/70">
								<th class="pb-2 pr-4">Rule</th>
								<th class="pb-2 pr-4">Category</th>
								<th class="pb-2 pr-4">Description</th>
								<th class="pb-2">Concern</th>
							</tr>
						</thead>
						<tbody>
							{#each result.firedRules as rule (rule.id)}
								<tr class="border-b border-base-200">
									<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
									<td class="py-2 pr-4">{rule.category}</td>
									<td class="py-2 pr-4">{rule.description}</td>
									<td class="py-2">
										<span class="rounded px-2 py-0.5 text-xs font-bold uppercase {concernColor[rule.concernLevel] ?? 'bg-base-300 text-base-content'}">
											{rule.concernLevel}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Patient:</span> {data.patientInformation.patientName || 'Not provided'}</div>
				<div><span class="font-medium text-base-content/70">DOB:</span> {data.patientInformation.dateOfBirth || 'Not provided'}</div>
				<div><span class="font-medium text-base-content/70">MRN:</span> {data.patientInformation.medicalRecordNumber || 'Not provided'}</div>
				<div><span class="font-medium text-base-content/70">Specimen date:</span> {data.patientInformation.specimenDate || 'Not provided'}</div>
				<div><span class="font-medium text-base-content/70">Referring physician:</span> {data.patientInformation.referringPhysician || 'Not provided'}</div>
				<div><span class="font-medium text-base-content/70">Clinical indication:</span> {data.patientInformation.clinicalIndication || 'Not provided'}</div>
			</div>
		</div>

		<!-- Clinical review -->
		{#if data.clinicalReview.diagnosis || data.clinicalReview.clinicalSummary || data.clinicalReview.followUpPlan || data.clinicalReview.additionalNotes}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Clinical review</h2>
				{#if data.clinicalReview.diagnosis}
					<div class="mb-3">
						<span class="font-medium text-base-content/70">Diagnosis:</span>
						<p class="mt-1 text-sm text-base-content/80">{data.clinicalReview.diagnosis}</p>
					</div>
				{/if}
				{#if data.clinicalReview.clinicalSummary}
					<div class="mb-3">
						<span class="font-medium text-base-content/70">Clinical summary:</span>
						<p class="mt-1 text-sm text-base-content/80">{data.clinicalReview.clinicalSummary}</p>
					</div>
				{/if}
				{#if data.clinicalReview.followUpPlan}
					<div class="mb-3">
						<span class="font-medium text-base-content/70">Follow-up plan:</span>
						<p class="mt-1 text-sm text-base-content/80">{data.clinicalReview.followUpPlan}</p>
					</div>
				{/if}
				{#if data.clinicalReview.additionalNotes}
					<div>
						<span class="font-medium text-base-content/70">Additional notes:</span>
						<p class="mt-1 text-sm text-base-content/80">{data.clinicalReview.additionalNotes}</p>
					</div>
				{/if}
			</div>
		{/if}
	</main>
{/if}
