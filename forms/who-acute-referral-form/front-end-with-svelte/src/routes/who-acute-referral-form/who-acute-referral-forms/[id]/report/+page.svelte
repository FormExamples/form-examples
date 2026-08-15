<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		calculateAge,
		sectionLabel,
		priorityColor,
		priorityLabel,
		modeOfTransferLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const validation = $derived(assessment.validation);
	const flags = $derived(assessment.flags);

	$effect(() => {
		if (!assessment.validation) {
			goto(`/who-acute-referral-form/who-acute-referral-forms/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/who-acute-referral-forms/${id}/report/pdf`, {
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
				a.download = `who-acute-referral-${data.patientIdentification.patientLastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const age = $derived(calculateAge(data.patientIdentification.dateOfBirth));
</script>

{#if validation}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Acute referral report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/who-acute-referral-form/who-acute-referral-forms/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Completeness banner -->
		<div
			class="mb-6 rounded-xl border-2 p-6 text-center {validation.complete
				? 'bg-success text-success-content border-success'
				: 'bg-warning text-warning-content border-warning'}"
		>
			<div class="text-3xl font-bold">{validation.complete ? 'Referral complete' : 'Referral incomplete'}</div>
			<div class="mt-2 text-sm">
				{validation.totalSatisfied} of {validation.totalRequired} required fields completed.
			</div>
			{#if validation.complete}
				<div class="mt-2 text-sm opacity-75">
					A copy of this form should travel with the patient to the referral facility.
				</div>
			{/if}
		</div>

		<!-- Flagged issues -->
		{#if flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for receiving facility</h2>
				<div class="space-y-2">
					{#each flags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{priorityLabel(flag.priority)}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Missing fields -->
		{#if validation.missing.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Outstanding required fields</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Section</th>
							<th class="pb-2">Field required</th>
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
		{/if}

		<!-- Patient & referral summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient &amp; referral summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient:</span>
					{data.patientIdentification.patientLastName}, {data.patientIdentification.patientFirstName}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patientIdentification.dateOfBirth}
					{#if age != null}(Age {age}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.patientIdentification.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Primary diagnosis:</span> {data.situation.primaryDiagnosis || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Chief complaint:</span> {data.situation.chiefComplaint || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Pregnant:</span> {data.situation.pregnant || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">From (initiating):</span> {data.facilityAndTransport.initiatingFacility.name || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">To (referral):</span> {data.facilityAndTransport.referralFacility.name || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Mode of transfer:</span> {modeOfTransferLabel(data.facilityAndTransport.modeOfTransfer)}</div>
				<div><span class="font-medium text-base-content/70">Departure:</span> {data.facilityAndTransport.departureDateTime || 'N/A'}</div>
			</div>
		</div>

		<!-- Clinical assessment -->
		{#if data.assessment.clinicalAssessment}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Clinical assessment</h2>
				<p class="text-sm text-base-content/80 whitespace-pre-line">{data.assessment.clinicalAssessment}</p>
			</div>
		{/if}
	</main>
{/if}
