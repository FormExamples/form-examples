<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		eligibilityLabel,
		eligibilityColor,
		priorityColor,
		eligibilityShortLabel,
		donorTypeLabel,
		calculateAgeYears,
		TRACKED_FIELD_COUNT
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/blood-donation-assessment/blood-donation-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/blood-donation-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `blood-donation-assessment-${data.donorDemographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Blood donation eligibility report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/blood-donation-assessment/blood-donation-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Eligibility banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {eligibilityColor(result.eligibilityStatus)}">
			<div class="text-3xl font-bold">{eligibilityLabel(result.eligibilityStatus)}</div>
			{#if result.eligibilityStatus === 'temporarily-deferred' && result.deferralWindow}
				<div class="mt-2 text-sm">Deferral window: {result.deferralWindow}</div>
			{/if}
			<div class="mt-2 text-sm opacity-75">
				Based on {result.answeredCount} of {TRACKED_FIELD_COUNT} fields · Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinician</h2>
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

		<!-- Triggered deferral rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Triggered deferral rules</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Reason</th>
							<th class="pb-2 pr-4">Status</th>
							<th class="pb-2">Deferral window</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 pr-4 font-medium">{eligibilityShortLabel(rule.status)}</td>
								<td class="py-2">{rule.deferralWindow || '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<p class="text-sm text-base-content/70">
					No deferral criteria triggered — donor is eligible based on the supplied answers.
				</p>
			</div>
		{/if}

		<!-- Donor summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Donor summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.donorDemographics.firstName} {data.donorDemographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.donorDemographics.dateOfBirth}
					{#if calculateAgeYears(data.donorDemographics.dateOfBirth) != null}(Age {calculateAgeYears(data.donorDemographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.donorDemographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Donor type:</span> {donorTypeLabel(data.donorDemographics.donorType)}</div>
				<div><span class="font-medium text-base-content/70">Weight:</span> {data.donorDemographics.weight != null ? `${data.donorDemographics.weight} kg` : 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Haemoglobin:</span> {data.vitalSigns.hemoglobin != null ? `${data.vitalSigns.hemoglobin} g/dL` : 'N/A'}</div>
			</div>
		</div>

		<!-- Current medications -->
		{#if data.medicalHistory.currentMedications.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Current medications</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.medicalHistory.currentMedications as med, i (i)}
						<li><strong>{med.name}</strong>{#if med.reason} — {med.reason}{/if}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
