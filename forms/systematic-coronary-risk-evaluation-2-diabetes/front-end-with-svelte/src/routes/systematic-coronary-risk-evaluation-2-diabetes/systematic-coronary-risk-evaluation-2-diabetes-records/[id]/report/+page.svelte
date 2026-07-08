<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		riskCategoryLabel,
		riskCategoryBgColor,
		calculateAge,
		hba1cMmolMol
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'systematic-coronary-risk-evaluation-2-diabetes-records';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/systematic-coronary-risk-evaluation-2-diabetes/${plural}/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `score2-diabetes-${data.patientDemographics.fullName || id}.pdf`;
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

	const ruleColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-info text-info-content border-info'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">SCORE2-Diabetes assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/systematic-coronary-risk-evaluation-2-diabetes/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Overall risk banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskCategoryBgColor(result.riskCategory)}">
			<div class="text-3xl font-bold">{riskCategoryLabel(result.riskCategory)}</div>
			<div class="mt-2 text-sm">10-year cardiovascular disease risk</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Clinical safety flags</h2>
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
				<h2 class="mb-4 text-lg font-bold text-base-content">Risk classification justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Level</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2">
									<span class="inline-block rounded-full border px-3 py-0.5 text-xs font-bold uppercase {ruleColor[rule.riskLevel]}">
										{rule.riskLevel}
									</span>
								</td>
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
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patientDemographics.fullName || 'N/A'}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patientDemographics.dateOfBirth || 'N/A'}
					{#if calculateAge(data.patientDemographics.dateOfBirth)}(Age {calculateAge(data.patientDemographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.patientDemographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">NHS number:</span> {data.patientDemographics.nhsNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Diabetes type:</span> {data.diabetesHistory.diabetesType || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">HbA1c:</span> {hba1cMmolMol(data) ?? 'N/A'} mmol/mol</div>
				<div><span class="font-medium text-base-content/70">Blood pressure:</span> {data.bloodPressure.systolicBp ?? 'N/A'}/{data.bloodPressure.diastolicBp ?? 'N/A'} mmHg</div>
				<div><span class="font-medium text-base-content/70">eGFR:</span> {data.renalFunction.egfr ?? 'N/A'} mL/min/1.73m²</div>
				<div><span class="font-medium text-base-content/70">Total cholesterol:</span> {data.lipidProfile.totalCholesterol ?? 'N/A'} mmol/L</div>
				<div><span class="font-medium text-base-content/70">LDL cholesterol:</span> {data.lipidProfile.ldlCholesterol ?? 'N/A'} mmol/L</div>
				<div><span class="font-medium text-base-content/70">BMI:</span> {data.lifestyleFactors.bmi ?? 'N/A'} kg/m²</div>
				<div><span class="font-medium text-base-content/70">Smoking:</span> {data.lifestyleFactors.smokingStatus || 'N/A'}</div>
			</div>
		</div>
	</main>
{/if}
