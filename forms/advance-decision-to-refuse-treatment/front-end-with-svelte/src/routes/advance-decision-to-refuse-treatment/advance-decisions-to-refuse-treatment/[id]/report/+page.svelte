<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		validityStatusLabel,
		validityStatusColor,
		calculateAge,
		hasLifeSustainingRefusal
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/advance-decision-to-refuse-treatment/advance-decisions-to-refuse-treatment/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/advance-decisions-to-refuse-treatment/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `adrt-${data.personalInformation.fullLegalName.replace(/\s+/g, '-') || id}.pdf`;
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

	const severityColor: Record<string, string> = {
		critical: 'bg-error text-error-content border-error',
		required: 'bg-warning text-warning-content border-warning',
		recommended: 'bg-info text-info-content border-info'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">ADRT report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/advance-decision-to-refuse-treatment/advance-decisions-to-refuse-treatment/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Validity status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {validityStatusColor(result.validityStatus)}">
			<div class="text-3xl font-bold">{validityStatusLabel(result.validityStatus)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for review</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.message}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Validity issues -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Validity issues</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Issue</th>
							<th class="pb-2">Severity</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2">
									<span class="inline-block rounded-full border px-3 py-1 text-xs font-bold {severityColor[rule.severity]}">
										{rule.severity}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Personal information summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Personal information</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Full legal name:</span>
					{data.personalInformation.fullLegalName || 'Not provided'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{data.personalInformation.dateOfBirth || 'Not provided'}
					{#if calculateAge(data.personalInformation.dateOfBirth)}
						(Age {calculateAge(data.personalInformation.dateOfBirth)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">NHS number:</span>
					{data.personalInformation.nhsNumber || 'Not provided'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">GP:</span>
					{data.personalInformation.gpName || 'Not provided'}
				</div>
			</div>
		</div>

		<!-- Treatments refused -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Treatments refused</h2>

			<h3 class="mb-2 font-semibold text-base-content/80">General treatments</h3>
			<ul class="mb-4 list-disc space-y-1 pl-5 text-sm text-base-content/80">
				{#if data.treatmentsRefusedGeneral.antibiotics.refused === 'yes'}
					<li>Antibiotics: {data.treatmentsRefusedGeneral.antibiotics.specification || 'No specification'}</li>
				{/if}
				{#if data.treatmentsRefusedGeneral.bloodTransfusion.refused === 'yes'}
					<li>Blood transfusion: {data.treatmentsRefusedGeneral.bloodTransfusion.specification || 'No specification'}</li>
				{/if}
				{#if data.treatmentsRefusedGeneral.ivFluids.refused === 'yes'}
					<li>IV fluids: {data.treatmentsRefusedGeneral.ivFluids.specification || 'No specification'}</li>
				{/if}
				{#if data.treatmentsRefusedGeneral.tubeFeeding.refused === 'yes'}
					<li>Tube feeding: {data.treatmentsRefusedGeneral.tubeFeeding.specification || 'No specification'}</li>
				{/if}
				{#if data.treatmentsRefusedGeneral.dialysis.refused === 'yes'}
					<li>Dialysis: {data.treatmentsRefusedGeneral.dialysis.specification || 'No specification'}</li>
				{/if}
				{#if data.treatmentsRefusedGeneral.ventilation.refused === 'yes'}
					<li>Ventilation: {data.treatmentsRefusedGeneral.ventilation.specification || 'No specification'}</li>
				{/if}
				{#each data.treatmentsRefusedGeneral.otherTreatments as t (t.treatment)}
					{#if t.refused === 'yes'}
						<li>{t.treatment}: {t.specification || 'No specification'}</li>
					{/if}
				{/each}
			</ul>

			{#if hasLifeSustainingRefusal(data)}
				<h3 class="mb-2 font-semibold text-error">Life-sustaining treatments (legally binding)</h3>
				<ul class="list-disc space-y-1 pl-5 text-sm">
					{#if data.treatmentsRefusedLifeSustaining.cpr.refused === 'yes'}
						<li class="text-error">
							CPR {data.treatmentsRefusedLifeSustaining.cpr.evenIfLifeAtRisk === 'yes' ? '(even if life is at risk)' : ''}
							- {data.treatmentsRefusedLifeSustaining.cpr.specification || 'No specification'}
						</li>
					{/if}
					{#if data.treatmentsRefusedLifeSustaining.mechanicalVentilation.refused === 'yes'}
						<li class="text-error">
							Mechanical ventilation {data.treatmentsRefusedLifeSustaining.mechanicalVentilation.evenIfLifeAtRisk === 'yes' ? '(even if life is at risk)' : ''}
							- {data.treatmentsRefusedLifeSustaining.mechanicalVentilation.specification || 'No specification'}
						</li>
					{/if}
					{#if data.treatmentsRefusedLifeSustaining.artificialNutritionHydration.refused === 'yes'}
						<li class="text-error">
							Artificial nutrition/hydration {data.treatmentsRefusedLifeSustaining.artificialNutritionHydration.evenIfLifeAtRisk === 'yes' ? '(even if life is at risk)' : ''}
							- {data.treatmentsRefusedLifeSustaining.artificialNutritionHydration.specification || 'No specification'}
						</li>
					{/if}
					{#each data.treatmentsRefusedLifeSustaining.otherLifeSustaining as t (t.treatment)}
						{#if t.refused === 'yes'}
							<li class="text-error">
								{t.treatment} {t.evenIfLifeAtRisk === 'yes' ? '(even if life is at risk)' : ''}
								- {t.specification || 'No specification'}
							</li>
						{/if}
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Signature status -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Signature status</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient signed:</span>
					<span class="{data.legalSignatures.patientSignature === 'yes' ? 'text-success' : 'text-error'} font-semibold">
						{data.legalSignatures.patientSignature === 'yes' ? 'Yes' : 'No'}
					</span>
				</div>
				<div>
					<span class="font-medium text-base-content/70">Witness signed:</span>
					<span class="{data.legalSignatures.witnessSignature === 'yes' ? 'text-success' : 'text-error'} font-semibold">
						{data.legalSignatures.witnessSignature === 'yes' ? 'Yes' : 'No'}
					</span>
				</div>
				{#if hasLifeSustainingRefusal(data)}
					<div>
						<span class="font-medium text-base-content/70">Life-sustaining witness:</span>
						<span class="{data.legalSignatures.lifeSustainingWitnessSignature === 'yes' ? 'text-success' : 'text-error'} font-semibold">
							{data.legalSignatures.lifeSustainingWitnessSignature === 'yes' ? 'Yes' : 'No'}
						</span>
					</div>
					<div>
						<span class="font-medium text-base-content/70">"Even if life at risk" statement:</span>
						<span class="{data.legalSignatures.lifeSustainingWrittenStatement === 'yes' ? 'text-success' : 'text-error'} font-semibold">
							{data.legalSignatures.lifeSustainingWrittenStatement === 'yes' ? 'Yes' : 'No'}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</main>
{/if}
