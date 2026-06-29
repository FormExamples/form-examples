<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { riskCategoryLabel, riskCategoryColor } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'predicting-risk-of-cardiovascular-disease-events-records';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/${plural}/${id}`);
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
				a.download = `prevent-cvd-risk-${data.patientInformation.fullName.replace(/\s+/g, '-') || id}.pdf`;
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

	const riskLevelColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-success text-success-content border-success'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">PREVENT CVD risk report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Risk category banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskCategoryColor(result.riskCategory)}">
			<div class="text-3xl font-bold">{riskCategoryLabel(result.riskCategory)}</div>
			<div class="mt-2 flex justify-center gap-6 text-sm">
				<span><strong>10-year risk:</strong> {result.tenYearRiskPercent}%</span>
				<span><strong>30-year risk:</strong> {result.thirtyYearRiskPercent}%</span>
			</div>
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
				<h2 class="mb-4 text-lg font-bold text-base-content">Risk rules triggered</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Description</th>
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
									<span class="rounded px-2 py-0.5 text-xs font-bold uppercase {riskLevelColor[rule.riskLevel] ?? 'bg-base-300 text-base-content border-base-300'}">
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
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patientInformation.fullName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">DOB:</span> {data.patientInformation.dateOfBirth || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">NHS number:</span> {data.patientInformation.nhsNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Age / Sex:</span> {data.demographics.age ?? 'N/A'} / {data.demographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Ethnicity:</span> {data.demographics.ethnicity || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">BMI:</span> {data.metabolicHealth.bmi ?? 'N/A'}</div>
			</div>
		</div>

		<!-- Clinical data -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Clinical data</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Systolic BP:</span> {data.bloodPressure.systolicBp ?? 'N/A'} mmHg</div>
				<div><span class="font-medium text-base-content/70">Diastolic BP:</span> {data.bloodPressure.diastolicBp ?? 'N/A'} mmHg</div>
				<div><span class="font-medium text-base-content/70">Total cholesterol:</span> {data.cholesterolLipids.totalCholesterol ?? 'N/A'} mg/dL</div>
				<div><span class="font-medium text-base-content/70">HDL cholesterol:</span> {data.cholesterolLipids.hdlCholesterol ?? 'N/A'} mg/dL</div>
				<div><span class="font-medium text-base-content/70">On statin:</span> {data.cholesterolLipids.onStatin || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Diabetes:</span> {data.metabolicHealth.hasDiabetes || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">HbA1c:</span> {data.metabolicHealth.hba1cValue ?? 'N/A'} {data.metabolicHealth.hba1cUnit || ''}</div>
				<div><span class="font-medium text-base-content/70">eGFR:</span> {data.renalFunction.egfr ?? 'N/A'} mL/min</div>
				<div><span class="font-medium text-base-content/70">Smoking:</span> {data.smokingHistory.smokingStatus || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Known CVD:</span> {data.medicalHistory.hasKnownCvd || 'N/A'}</div>
			</div>
		</div>

		<!-- Clinical notes -->
		{#if data.reviewCalculate.clinicalNotes}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Clinical notes</h2>
				<p class="whitespace-pre-wrap text-sm text-base-content/80">{data.reviewCalculate.clinicalNotes}</p>
				{#if data.reviewCalculate.clinicianName}
					<p class="mt-2 text-sm text-base-content/60">
						Reviewed by: {data.reviewCalculate.clinicianName}
						{#if data.reviewCalculate.reviewDate}on {data.reviewCalculate.reviewDate}{/if}
					</p>
				{/if}
			</div>
		{/if}
	</main>
{/if}
