<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		riskBandLabel,
		riskBandColor,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ethnicityLabel,
		smokingLabel,
		diabetesLabel,
		ckdStageLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const plural = 'qrisk3-cardiovascular-disease-risk-scores';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/qrisk3-cardiovascular-disease-risk-score/${plural}/${id}`);
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
				a.download = `qrisk3-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const riskText = $derived(
		result && result.tenYearRiskPercent !== null ? `${result.tenYearRiskPercent}%` : 'Not computable'
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">QRISK3 assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/qrisk3-cardiovascular-disease-risk-score/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Representative-model disclaimer -->
		<div class="mb-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-base-content/80">
			<strong>Representative model.</strong> This is a documented approximation in the shape of QRISK3,
			not the official QRISK3-2017 algorithm, and must not be used for real clinical decision-making.
		</div>

		<!-- Risk banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskBandColor(result.riskBand)}">
			<div class="text-3xl font-bold">10-year CVD risk: {riskText}</div>
			<div class="mt-2 text-sm font-semibold">{riskBandLabel(result.riskBand)}</div>
			{#if result.heartAge !== null}
				<div class="mt-2 text-sm">Estimated heart age: {result.heartAge} years</div>
			{/if}
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if !result.computable}
				<p class="text-sm text-base-content/80">
					The risk could not be computed. Record age, sex, body mass index, cholesterol : HDL ratio,
					and systolic blood pressure, then re-calculate.
				</p>
			{:else if result.riskBand === 'low'}
				<p class="text-sm text-base-content/80">
					10-year CVD risk is <strong>below the 10% NICE threshold</strong>. Offer structured
					lifestyle advice and reassess per local recall policy.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					10-year CVD risk is <strong>at or above the 10% NICE threshold</strong>. Offer a
					lipid-lowering statin (atorvastatin 20 mg) for primary prevention after informed
					discussion, alongside structured lifestyle advice.
				</p>
			{/if}
		</div>

		<!-- Weighted contributions -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Weighted contributions</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Factor</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Weight</th>
					</tr>
				</thead>
				<tbody>
					{#each result.contributions as c (c.id)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{c.factor}</td>
							<td class="py-2 pr-4">{c.value}</td>
							<td class="py-2 font-mono">{c.weight.toFixed(3)}</td>
						</tr>
					{/each}
					<tr class="border-t border-base-300 font-bold">
						<td class="py-2 pr-4">Linear predictor</td>
						<td class="py-2 pr-4"></td>
						<td class="py-2 font-mono">{result.linearPredictor.toFixed(3)}</td>
					</tr>
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
					<span class="font-medium text-base-content/70">Ethnicity:</span>
					{ethnicityLabel(data.identification.ethnicity) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Smoking:</span>
					{smokingLabel(data.lifestyle.smokingStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Body mass index:</span>
					{data.lifestyle.bodyMassIndex !== null ? `${data.lifestyle.bodyMassIndex} kg/m²` : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Diabetes:</span>
					{diabetesLabel(data.cardiometabolic.diabetesStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Cholesterol : HDL ratio:</span>
					{data.cardiometabolic.cholesterolHdlRatio ?? 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Systolic BP:</span>
					{data.cardiometabolic.systolicBloodPressure !== null
						? `${data.cardiometabolic.systolicBloodPressure} mmHg`
						: 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Chronic kidney disease:</span>
					{ckdStageLabel(data.comorbidities.chronicKidneyDiseaseStage) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
			</div>
			{#if data.note.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
