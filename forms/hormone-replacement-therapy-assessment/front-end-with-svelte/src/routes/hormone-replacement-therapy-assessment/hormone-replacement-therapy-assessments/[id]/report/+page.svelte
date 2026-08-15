<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		mrsSeverityLabel,
		mrsSeverityColor,
		riskClassificationLabel,
		riskClassificationColor,
		bmiCategory,
		calculateAge,
		mrsScoreLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/hormone-replacement-therapy-assessment/hormone-replacement-therapy-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/hormone-replacement-therapy-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `hrt-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">HRT assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/hormone-replacement-therapy-assessment/hormone-replacement-therapy-assessments/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- MRS Score Banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {mrsSeverityColor(result.mrsResult.severity)}">
			<div class="text-3xl font-bold">MRS Total: {result.mrsResult.totalScore}/44</div>
			<div class="mt-1 text-lg">{mrsSeverityLabel(result.mrsResult.severity)}</div>
			<div class="mt-3 flex justify-center gap-6 text-sm">
				<span>Somatic: {result.mrsResult.subscales.somatic}/16</span>
				<span>Psychological: {result.mrsResult.subscales.psychological}/16</span>
				<span>Urogenital: {result.mrsResult.subscales.urogenital}/12</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- HRT Risk Classification Banner -->
		<div
			class="mb-6 rounded-xl border-2 p-6 text-center {riskClassificationColor(
				result.riskClassification
			)}"
		>
			<div class="text-2xl font-bold">HRT Risk Classification: {result.riskClassification}</div>
			<div class="mt-1 text-sm">{riskClassificationLabel(result.riskClassification)}</div>
		</div>

		<!-- Additional Flags -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinician</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[
									flag.priority
								]}"
							>
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

		<!-- MRS Item Scores -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">MRS symptom scores</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Item</th>
							<th class="pb-2 pr-4">Subscale</th>
							<th class="pb-2 pr-4">Symptom</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.system}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">{mrsScoreLabel(rule.score)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient Summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.demographics.firstName}
					{data.demographics.lastName}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}
						(Age {calculateAge(data.demographics.dateOfBirth)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Menopause status:</span>
					{data.menopauseStatus.menopausalStatus || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">BMI:</span>
					{data.demographics.bmi ?? 'N/A'}
					{#if data.demographics.bmi}
						({bmiCategory(data.demographics.bmi)})
					{/if}
				</div>
				{#if data.menopauseStatus.ageAtMenopause}
					<div>
						<span class="font-medium text-base-content/70">Age at menopause:</span>
						{data.menopauseStatus.ageAtMenopause}
					</div>
				{/if}
				{#if data.treatmentPreferences.routePreference}
					<div>
						<span class="font-medium text-base-content/70">Route preference:</span>
						{data.treatmentPreferences.routePreference}
					</div>
				{/if}
			</div>
		</div>

		<!-- Current Medications -->
		{#if data.currentMedications.otherMedications.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Current medications</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.currentMedications.otherMedications as med (med.name)}
						<li>{med.name} {med.dose} {med.frequency}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
