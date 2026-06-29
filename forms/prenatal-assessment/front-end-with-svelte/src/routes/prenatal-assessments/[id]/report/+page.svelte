<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		riskScoreColor,
		riskLevelLabel,
		calculateAge,
		gestationalWeeksLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/prenatal-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/prenatal-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `prenatal-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Prenatal assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/prenatal-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Risk level banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskScoreColor(result.riskScore)}">
			<div class="text-3xl font-bold">{riskLevelLabel(result.riskLevel)}</div>
			<div class="mt-1 text-lg">Risk score: {result.riskScore}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for obstetrician</h2>
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

		<!-- Risk factor breakdown -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Risk factor breakdown</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Description</th>
							<th class="pb-2">Weight</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">+{rule.weight}</td>
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
				<div><span class="font-medium text-base-content/70">Gestational age:</span> {gestationalWeeksLabel(data.pregnancyDetails.gestationalWeeks)}</div>
				<div><span class="font-medium text-base-content/70">EDD:</span> {data.pregnancyDetails.estimatedDueDate || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Gravida/Para:</span> G{data.obstetricHistory.gravida ?? '?'}P{data.obstetricHistory.para ?? '?'}</div>
				<div>
					<span class="font-medium text-base-content/70">Blood type:</span> {data.laboratoryResults.bloodType || 'N/A'}{data.laboratoryResults.rhFactor === 'positive' ? '+' : data.laboratoryResults.rhFactor === 'negative' ? '−' : ''}
				</div>
				<div><span class="font-medium text-base-content/70">Blood pressure:</span> {data.vitalSigns.bloodPressureSystolic ?? '?'}/{data.vitalSigns.bloodPressureDiastolic ?? '?'} mmHg</div>
				<div><span class="font-medium text-base-content/70">Fetal heart rate:</span> {data.vitalSigns.fetalHeartRate ?? 'N/A'} bpm</div>
			</div>
		</div>

		<!-- Mental health -->
		{#if data.mentalHealthScreening.edinburghScore !== null}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Mental health</h2>
				<div class="text-sm">
					<span class="font-medium text-base-content/70">Edinburgh score:</span>
					{data.mentalHealthScreening.edinburghScore}/30
					{#if data.mentalHealthScreening.edinburghScore < 10}
						<span class="ml-2 rounded bg-success px-2 py-0.5 text-success-content">Low risk</span>
					{:else if data.mentalHealthScreening.edinburghScore < 13}
						<span class="ml-2 rounded bg-warning px-2 py-0.5 text-warning-content">Possible depression</span>
					{:else}
						<span class="ml-2 rounded bg-error px-2 py-0.5 text-error-content">Probable depression</span>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Birth plan -->
		{#if data.birthPlanPreferences.deliveryPreference || data.birthPlanPreferences.painManagement || data.birthPlanPreferences.feedingPlan}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Birth plan preferences</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div><span class="font-medium text-base-content/70">Delivery:</span> {data.birthPlanPreferences.deliveryPreference || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Pain management:</span> {data.birthPlanPreferences.painManagement || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Feeding plan:</span> {data.birthPlanPreferences.feedingPlan || 'N/A'}</div>
					{#if data.birthPlanPreferences.specialRequests}
						<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Special requests:</span> {data.birthPlanPreferences.specialRequests}</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
{/if}
