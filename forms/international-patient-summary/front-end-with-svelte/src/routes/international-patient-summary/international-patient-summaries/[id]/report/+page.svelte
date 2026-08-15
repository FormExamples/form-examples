<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		completenessLevelLabel,
		completenessLevelColor,
		ruleStatusLabel,
		ruleStatusColor,
		priorityColor,
		calculateAge
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/international-patient-summary/international-patient-summaries/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/international-patient-summaries/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `international-patient-summary-${data.patientDemographics.familyName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">International Patient Summary report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/international-patient-summary/international-patient-summaries/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Completeness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {completenessLevelColor(result.completenessLevel)}">
			<div class="text-3xl font-bold">{completenessLevelLabel(result.completenessLevel)}</div>
			<div class="mt-2 text-sm opacity-90">
				{result.mandatoryPopulated} / {result.mandatoryTotal} mandatory sections,
				{result.optionalPopulated} / {result.optionalTotal} optional sections populated
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for receiving clinician</h2>
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

		<!-- Per-section validation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Per-section validation</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">ID</th>
						<th class="pb-2 pr-4">Section</th>
						<th class="pb-2 pr-4">Requirement</th>
						<th class="pb-2">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each result.firedRules as rule (rule.id)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
							<td class="py-2 pr-4">
								{rule.category}
								{#if !rule.mandatory}<span class="ml-1 rounded bg-base-300 px-1.5 py-0.5 text-xs text-base-content">Optional</span>{/if}
							</td>
							<td class="py-2 pr-4">{rule.description}</td>
							<td class="py-2">
								<span class="inline-block rounded-full border px-3 py-1 text-xs font-bold {ruleStatusColor(rule.status)}">
									{ruleStatusLabel(rule.status)}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patientDemographics.givenName} {data.patientDemographics.familyName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patientDemographics.dateOfBirth}
					{#if calculateAge(data.patientDemographics.dateOfBirth)}(Age {calculateAge(data.patientDemographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.patientDemographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">National ID:</span> {data.patientDemographics.nationalIdentifier || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Country:</span> {data.patientDemographics.country || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Authoring clinician:</span> {data.authoringClinician.clinicianName || 'N/A'}</div>
			</div>
		</div>

		<!-- Allergies -->
		{#if data.allergiesIntolerances.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Allergies &amp; intolerances</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.allergiesIntolerances as allergy, i (i)}
						<li>
							<strong>{allergy.substance || '(substance not specified)'}</strong>{#if allergy.reaction} — {allergy.reaction}{/if}
							{#if allergy.severity}
								<span class="ml-1 rounded px-1.5 py-0.5 text-xs {allergy.severity === 'severe' ? 'bg-error text-error-content' : 'bg-warning text-warning-content'}">
									{allergy.severity}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
