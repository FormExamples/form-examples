<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		riskLevelLabel,
		riskLevelColor,
		priorityColor,
		bmiCategory,
		calculateAge
	} from '#lib/engine/utils.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/integumentary-assessment/integumentary-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/integumentary-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `integumentary-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Integumentary assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/integumentary-assessment/integumentary-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Braden score + risk banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskLevelColor(result.riskLevel)}">
			<div class="text-3xl font-bold">{result.bradenScore} / 23</div>
			<div class="mt-2 text-lg font-semibold">{riskLevelLabel(result.riskLevel)}</div>
			<div class="mt-2 text-sm opacity-75">
				Based on {result.answeredCount} of 6 Braden subscales answered · Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the tissue-viability team</h2>
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

		<!-- Per-subscale scores -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Per-subscale Braden scores</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">ID</th>
							<th class="pb-2 pr-4">Subscale</th>
							<th class="pb-2 pr-4">Description</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge score={rule.score} maxScore={rule.maxScore} /></td>
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
			</div>
		</div>

		<!-- Wound summary -->
		{#if data.woundAssessment.woundPresent === 'yes'}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Wound assessment</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div><span class="font-medium text-base-content/70">Location:</span> {data.woundAssessment.woundLocation || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Stage:</span> {data.woundAssessment.woundStage || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Tissue type:</span> {data.woundAssessment.tissueType || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Infection signs:</span> {data.woundAssessment.infectionSigns || 'N/A'}</div>
				</div>
			</div>
		{/if}

		<!-- Specific lesions -->
		{#if data.skinInspection.lesions.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Documented lesions</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.skinInspection.lesions as lesion, i (i)}
						<li>
							<strong>{lesion.site || 'Unspecified site'}</strong> — {lesion.type}
							{#if lesion.size}({lesion.size}){/if}
							{#if lesion.description}: {lesion.description}{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
