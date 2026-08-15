<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		riskLevelLabel,
		riskLevelColor,
		carePathwayLabel,
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
			goto(`/obstetrics-assessment/obstetrics-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/obstetrics-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `obstetrics-assessment-${data.maternalDemographics.lastName || id}.pdf`;
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
		urgent: 'bg-error text-error-content border-error',
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Obstetrics assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/obstetrics-assessment/obstetrics-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall risk banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskLevelColor(result.riskLevel)}">
			<div class="text-3xl font-bold">{riskLevelLabel(result.riskLevel)}</div>
			<div class="mt-2 text-sm">
				Recommended care pathway: <span class="font-semibold">{carePathwayLabel(result.riskLevel)}</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				{result.answeredCount} fields answered · Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the maternity team</h2>
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
				<h2 class="mb-4 text-lg font-bold text-base-content">Risk stratification justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Risk</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge risk={rule.risk} /></td>
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
				<div><span class="font-medium text-base-content/70">Name:</span> {data.maternalDemographics.firstName} {data.maternalDemographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.maternalDemographics.dateOfBirth}
					{#if calculateAge(data.maternalDemographics.dateOfBirth)}(Age {calculateAge(data.maternalDemographics.dateOfBirth)}){/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">BMI:</span> {data.maternalDemographics.bmi ?? 'N/A'}
					{#if data.maternalDemographics.bmi}({bmiCategory(data.maternalDemographics.bmi)}){/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Gestation:</span>
					{#if data.currentPregnancy.gestationWeeks != null}
						{data.currentPregnancy.gestationWeeks}+{data.currentPregnancy.gestationDays ?? 0} weeks
					{:else}
						N/A
					{/if}
				</div>
				<div><span class="font-medium text-base-content/70">Gravidity / Parity:</span> G{data.obstetricHistory.gravidity ?? '?'} P{data.obstetricHistory.parity ?? '?'}</div>
				<div><span class="font-medium text-base-content/70">EDD:</span> {data.currentPregnancy.estimatedDueDate || 'N/A'}</div>
			</div>
		</div>
	</main>
{/if}
