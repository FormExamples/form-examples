<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		classificationLabel,
		classificationColor,
		criterionStatusLabel,
		criterionStatusColor,
		priorityLabel,
		priorityColor,
		clinicianRoleLabel,
		careSettingLabel,
		sexLabel,
		pretestProbabilityLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/pulmonary-embolism-rule-out-criterias/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/pulmonary-embolism-rule-out-criterias/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `perc-assessment-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">PERC assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/pulmonary-embolism-rule-out-criterias/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Classification banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {classificationColor(result.classification)}">
			<div class="text-3xl font-bold">{classificationLabel(result.classification)}</div>
			<div class="mt-2 text-sm font-semibold">
				{result.classification === 'perc-negative'
					? 'Pre-test probability low and all eight criteria satisfied'
					: result.failedCriteria.length
						? `Failed criteria: ${result.failedCriteria.join(', ')}`
						: 'Pre-test probability not low — PERC does not apply'}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			{#if result.classification === 'perc-negative'}
				<p class="text-sm text-base-content/80">
					The pre-test probability is low and all eight criteria are satisfied.
					<strong>PERC-negative</strong>: pulmonary embolism is excluded on clinical grounds and no
					D-dimer or imaging is required for PE on the basis of this presentation. Document and
					continue as clinically appropriate.
				</p>
			{:else if !result.applicable}
				<p class="text-sm text-base-content/80">
					The pre-test probability is <strong>not low</strong>. PERC does not apply and cannot
					exclude PE. <strong>PERC-positive</strong>: proceed with D-dimer and/or imaging per local
					policy regardless of the eight criteria.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					At least one criterion failed. <strong>PERC-positive</strong>: PERC does not exclude PE.
					Proceed to the next step in the diagnostic pathway — D-dimer, and imaging (CT pulmonary
					angiography or V/Q) as indicated by local policy and further risk stratification. A
					PERC-positive result is not a diagnosis of PE.
				</p>
			{/if}
		</div>

		<!-- Criteria -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Criteria</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">#</th>
						<th class="pb-2 pr-4">Criterion</th>
						<th class="pb-2">Result</th>
					</tr>
				</thead>
				<tbody>
					{#each result.criterionResults as c (c.number)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{c.number}</td>
							<td class="py-2 pr-4">{c.label}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {criterionStatusColor(
										c.satisfied
									)}">{criterionStatusLabel(c.satisfied)}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Flagged issues ({result.flaggedIssues.length})
				</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
									flag.priority
								)}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.description} — {flag.suggestedAction}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Patient / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age:</span>
					{data.identification.age !== null ? `${data.identification.age} years` : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Pre-test probability:</span>
					{pretestProbabilityLabel(data.pretest.pretestProbability) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Heart rate:</span>
					{data.vitals.heartRate !== null ? `${data.vitals.heartRate} beats/min` : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Oxygen saturation:</span>
					{data.vitals.oxygenSaturation !== null ? `${data.vitals.oxygenSaturation}%` : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
			</div>
			{#if data.context.presentingComplaint}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Presenting complaint:</span>
					<p class="mt-1 text-base-content/80">{data.context.presentingComplaint}</p>
				</div>
			{/if}
			{#if data.result.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.result.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
