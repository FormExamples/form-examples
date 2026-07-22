<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		calculateAge,
		countConditionsDeclared,
		priorityColor,
		priorityLabel,
		sectionLabel,
		statusColor,
		statusLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'united-kingdom-driver-and-vehicle-licensing-agency-b1-forms';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const validation = $derived(assessment.validation);
	const flags = $derived(assessment.flags);

	const completeness = $derived(
		validation
			? validation.totalRequired === 0
				? 100
				: Math.round((validation.totalSatisfied / validation.totalRequired) * 100)
			: 0
	);

	$effect(() => {
		if (!assessment.validation) {
			goto(`/united-kingdom-driver-and-vehicle-licensing-agency-b1-form/${plural}/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: assessment.data,
					validation: assessment.validation,
					flags: assessment.flags
				})
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `dvla-b1-form-${data.personalDetails.fullName || id}.pdf`;
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

{#if validation}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">DVLA B1 form report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/united-kingdom-driver-and-vehicle-licensing-agency-b1-form/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Completeness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {statusColor(validation.complete)}">
			<div class="text-3xl font-bold">{statusLabel(validation.complete)}</div>
			<div class="mt-2 text-sm">
				{validation.totalSatisfied} of {validation.totalRequired} required fields completed ({completeness}%)
			</div>
		</div>

		<!-- Flagged issues -->
		{#if flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinician review</h2>
				<div class="space-y-2">
					{#each flags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
									flag.priority
								)}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Outstanding items -->
		{#if validation.missing.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Outstanding items</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Section</th>
							<th class="pb-2">Required field</th>
						</tr>
					</thead>
					<tbody>
						{#each validation.missing as miss (miss.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{miss.id}</td>
								<td class="py-2 pr-4">{sectionLabel(miss.section)}</td>
								<td class="py-2">{miss.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-success/40 bg-base-100 p-6 text-sm text-base-content/80">
				All required fields are complete. Please print and send to the DVLA Drivers Medical Group,
				Swansea, SA99 1DF, or email <code>eftd@dvla.gov.uk</code>.
			</div>
		{/if}

		<!-- Applicant summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Applicant summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.personalDetails.title}
					{data.personalDetails.fullName}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{data.personalDetails.dateOfBirth}
					{#if calculateAge(data.personalDetails.dateOfBirth)}(Age {calculateAge(
							data.personalDetails.dateOfBirth
						)}){/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Conditions declared:</span>
					{countConditionsDeclared(data)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Epilepsy declared:</span>
					{data.seizures.diagnosis === 'more-than-one-or-epilepsy' ? 'Yes' : 'No'}
				</div>
			</div>
		</div>
	</main>
{/if}
