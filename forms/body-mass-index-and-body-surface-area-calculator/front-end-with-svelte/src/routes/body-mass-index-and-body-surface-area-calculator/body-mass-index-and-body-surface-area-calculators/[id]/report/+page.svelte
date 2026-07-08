<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		bmiCategoryLabel,
		bmiCategoryColor,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		purposeLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		ancestryLabel,
		bsaFormulaLabel,
		formatBmi,
		formatBsa
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/body-mass-index-and-body-surface-area-calculator/body-mass-index-and-body-surface-area-calculators/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(
				`/body-mass-index-and-body-surface-area-calculators/${id}/report/pdf`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ data: assessment.data, result: assessment.result })
				}
			);
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `bmi-bsa-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const isSevere = $derived(
		!!result &&
			result.flaggedIssues.some(
				(f) => f.id === 'F-SEVERE-OBESITY-001' || f.id === 'F-UNDERWEIGHT-001'
			)
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">BMI and BSA report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/body-mass-index-and-body-surface-area-calculator/body-mass-index-and-body-surface-area-calculators/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {bmiCategoryColor(result.bmiCategory)}">
			<div class="text-3xl font-bold">{formatBmi(result.bmi)}</div>
			<div class="mt-2 text-sm font-semibold">{bmiCategoryLabel(result.bmiCategory)}</div>
			<div class="mt-2 text-sm opacity-75">
				BSA (Mosteller) {formatBsa(result.bsaMosteller)} · BSA (Du Bois) {formatBsa(
					result.bsaDuBois
				)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.bmiCategory === ''}
				<p class="text-sm text-base-content/80">
					Both the measured height and weight are required to compute a BMI and BSA. Record the
					missing input and re-calculate.
				</p>
			{:else if isSevere}
				<p class="text-sm text-base-content/80">
					This is a <strong>flagged result</strong> (severe obesity or underweight). Review
					obesity-related comorbidities or possible undernutrition and consider a specialist or
					nutritional referral as appropriate.
				</p>
			{:else if result.bmiCategory === 'normal'}
				<p class="text-sm text-base-content/80">
					The BMI is <strong>within the WHO healthy-weight range</strong>. Interpret in clinical
					context; BMI does not distinguish fat from lean mass.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The BMI is <strong>outside the WHO healthy-weight range</strong>. Correlate with clinical
					context and offer lifestyle advice and follow-up as indicated.
				</p>
			{/if}
		</div>

		<!-- Calculation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Calculation</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Measure</th>
						<th class="pb-2">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Measured height</td>
						<td class="py-2"
							>{data.height.heightCm === null ? 'Not recorded' : `${data.height.heightCm} cm`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Measured weight</td>
						<td class="py-2"
							>{data.weight.weightKg === null ? 'Not recorded' : `${data.weight.weightKg} kg`}</td
						>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Body Mass Index (BMI)</td>
						<td class="py-2">{formatBmi(result.bmi)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">WHO weight-status category</td>
						<td class="py-2">{bmiCategoryLabel(result.bmiCategory)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">BSA (Mosteller)</td>
						<td class="py-2">{formatBsa(result.bsaMosteller)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">BSA (Du Bois)</td>
						<td class="py-2">{formatBsa(result.bsaDuBois)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Preferred BSA formula</td>
						<td class="py-2">{bsaFormulaLabel(data.results.bsaFormula) || 'N/A'}</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				BMI = weightKg ÷ (heightCm ÷ 100)²; BSA (Mosteller) = √((heightCm × weightKg) ÷ 3600); BSA
				(Du Bois) = 0.007184 × heightCm^0.725 × weightKg^0.425
			</p>
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
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.identification.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Ancestry:</span>
					{ancestryLabel(data.identification.ancestry) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Purpose:</span>
					{purposeLabel(data.context.purpose) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
			</div>
			{#if data.results.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.results.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
