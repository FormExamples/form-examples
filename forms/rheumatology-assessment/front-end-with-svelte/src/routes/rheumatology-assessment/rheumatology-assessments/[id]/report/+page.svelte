<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		das28Color,
		bmiCategory,
		calculateAge,
		diseaseActivityLabel,
		diagnosisLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/rheumatology-assessment/rheumatology-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/rheumatology-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `rheumatology-assessment-${data.demographics.lastName || id}.pdf`;
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

	const allMeds = $derived([
		...data.currentMedications.dmards.map((m) => ({ ...m, category: 'DMARD' })),
		...data.currentMedications.biologics.map((m) => ({ ...m, category: 'Biologic' })),
		...data.currentMedications.nsaids.map((m) => ({ ...m, category: 'NSAID' })),
		...data.currentMedications.steroids.map((m) => ({ ...m, category: 'Steroid' })),
		...data.currentMedications.painMedication.map((m) => ({ ...m, category: 'Pain' })),
		...data.currentMedications.supplements.map((m) => ({ ...m, category: 'Supplement' }))
	]);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Rheumatology assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/rheumatology-assessment/rheumatology-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- DAS28 score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {das28Color(result.das28Score)}">
			<div class="text-3xl font-bold">
				{#if result.das28Score !== null}
					DAS28: {result.das28Score.toFixed(2)}
				{:else}
					DAS28: Incomplete data
				{/if}
			</div>
			<div class="mt-1 text-lg">{diseaseActivityLabel(result.diseaseActivity)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for rheumatologist</h2>
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

		<!-- Clinical findings -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Clinical findings</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2">Finding</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2">{rule.description}</td>
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
				<div>
					<span class="font-medium text-base-content/70">BMI:</span> {data.demographics.bmi ?? 'N/A'}
					{#if data.demographics.bmi}({bmiCategory(data.demographics.bmi)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Primary diagnosis:</span> {diagnosisLabel(data.diseaseHistory.primaryDiagnosis)}</div>
				<div><span class="font-medium text-base-content/70">Disease duration:</span> {data.diseaseHistory.diseaseDurationYears ?? 'N/A'} years</div>
			</div>
		</div>

		<!-- DAS28 components -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">DAS28 components</h2>
			<div class="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
				<div class="rounded-lg bg-base-200 p-3 text-center">
					<div class="text-xs text-base-content/60">TJC28</div>
					<div class="text-xl font-bold">{data.jointAssessment.tenderJointCount28 ?? '-'}</div>
				</div>
				<div class="rounded-lg bg-base-200 p-3 text-center">
					<div class="text-xs text-base-content/60">SJC28</div>
					<div class="text-xl font-bold">{data.jointAssessment.swollenJointCount28 ?? '-'}</div>
				</div>
				<div class="rounded-lg bg-base-200 p-3 text-center">
					<div class="text-xs text-base-content/60">ESR (mm/hr)</div>
					<div class="text-xl font-bold">{data.laboratoryResults.esr ?? '-'}</div>
				</div>
				<div class="rounded-lg bg-base-200 p-3 text-center">
					<div class="text-xs text-base-content/60">Patient VAS</div>
					<div class="text-xl font-bold">{data.jointAssessment.patientGlobalVAS ?? '-'}</div>
				</div>
			</div>
		</div>

		<!-- Medications -->
		{#if allMeds.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Medications</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each allMeds as med (med.category + med.name)}
						<li><span class="font-medium">[{med.category}]</span> {med.name} {med.dose} {med.frequency}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Allergies -->
		{#if data.allergies.drugAllergies.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Allergies</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.allergies.drugAllergies as allergy (allergy.allergen)}
						<li>
							<strong>{allergy.allergen}</strong> — {allergy.reaction}
							{#if allergy.severity}
								<span class="ml-1 rounded px-1.5 py-0.5 text-xs {allergy.severity === 'anaphylaxis' ? 'bg-error text-error-content' : 'bg-warning text-warning-content'}">
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
