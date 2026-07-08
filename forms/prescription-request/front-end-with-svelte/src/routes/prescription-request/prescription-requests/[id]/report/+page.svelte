<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { priorityLevelLabel, priorityLevelColor } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/prescription-request/prescription-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/prescription-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `prescription-request-${data.patientInformation.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Prescription request report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/prescription-request/prescription-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Priority level banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {priorityLevelColor(result.priorityLevel)}">
			<div class="text-3xl font-bold capitalize">{result.priorityLevel}</div>
			<div class="mt-1 text-lg">{priorityLevelLabel(result.priorityLevel)}</div>
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

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Priority classification justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Priority</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 capitalize">{rule.priorityLevel}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Prescription summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Prescription summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Patient:</span> {data.patientInformation.firstName} {data.patientInformation.lastName}</div>
				<div><span class="font-medium text-base-content/70">NHS Number:</span> {data.patientInformation.nhsNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Clinician:</span> {data.clinicianInformation.firstName} {data.clinicianInformation.lastName}</div>
				<div><span class="font-medium text-base-content/70">NHS Employee No.:</span> {data.clinicianInformation.nhsEmployeeNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Medication:</span> {data.prescriptionDetails.medicationName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Dosage:</span> {data.prescriptionDetails.dosage || 'N/A'} {data.prescriptionDetails.frequency || ''}</div>
				<div><span class="font-medium text-base-content/70">Route:</span> {data.prescriptionDetails.routeOfAdministration || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Request Date:</span> {data.prescriptionDetails.requestDate || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Type:</span> {data.requestType.isNewPrescription === 'yes' ? 'New' : data.requestType.isNewPrescription === 'no' ? 'Refill' : 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Emergency:</span> {data.requestType.isEmergency === 'yes' ? 'Yes' : data.requestType.isEmergency === 'no' ? 'No' : 'N/A'}</div>
			</div>
		</div>

		<!-- Treatment instructions -->
		{#if data.prescriptionDetails.treatmentInstructions.trim()}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Treatment instructions</h2>
				<p class="text-sm whitespace-pre-wrap text-base-content/80">{data.prescriptionDetails.treatmentInstructions}</p>
			</div>
		{/if}

		<!-- Substitution options -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Substitution options</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
				<div><span class="font-medium text-base-content/70">Brand:</span> {data.substitutionOptions.allowBrandSubstitution || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Generic:</span> {data.substitutionOptions.allowGenericSubstitution || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Dosage:</span> {data.substitutionOptions.allowDosageAdjustment || 'N/A'}</div>
			</div>
			{#if data.substitutionOptions.substitutionNotes.trim()}
				<p class="mt-3 text-sm text-base-content/70">{data.substitutionOptions.substitutionNotes}</p>
			{/if}
		</div>
	</main>
{/if}
