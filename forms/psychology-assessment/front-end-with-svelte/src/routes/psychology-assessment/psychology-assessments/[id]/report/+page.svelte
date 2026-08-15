<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { severityLabel, severityColor, subscaleLabel, calculateAge } from '#lib/engine/utils.js';
	import type { SubscaleScore } from '#lib/engine/types.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/psychology-assessment/psychology-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/psychology-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `psychology-assessment-${data.demographics.lastName || id}.pdf`;
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

	const subscales = $derived(
		result
			? ([
					['depression', result.depression],
					['anxiety', result.anxiety],
					['stress', result.stress]
				] as [('depression' | 'anxiety' | 'stress'), SubscaleScore][])
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Psychology assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/psychology-assessment/psychology-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- DASS-21 subscale scores -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
			{#each subscales as [name, score] (name)}
				<div class="rounded-xl border-2 p-6 text-center {severityColor(score.severity)}">
					<div class="text-sm font-semibold uppercase tracking-wide">{subscaleLabel(name)}</div>
					<div class="mt-2 text-3xl font-bold">{score.scaled}</div>
					<div class="mt-1 text-sm font-medium">{severityLabel(score.severity)}</div>
					<div class="mt-1 text-xs opacity-75">{score.answered}/7 items answered</div>
				</div>
			{/each}
		</div>
		<p class="mb-6 text-center text-xs text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()} · DASS-21 raw scores doubled to align
			with DASS-42 normative cutoffs.
		</p>

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

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Occupation:</span> {data.demographics.occupation || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Primary concern:</span> {data.reasonForAssessment.primaryConcern || 'N/A'}</div>
				<div>
					<span class="font-medium text-base-content/70">Symptom duration:</span>
					{data.reasonForAssessment.symptomDurationWeeks ?? 'N/A'}
					{#if data.reasonForAssessment.symptomDurationWeeks} weeks{/if}
				</div>
			</div>
		</div>

		<!-- Functional impact -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Functional impact</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Work:</span> {data.functionalImpact.workImpact || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Relationships:</span> {data.functionalImpact.relationshipImpact || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Daily activities:</span> {data.functionalImpact.dailyActivitiesImpact || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Sleep:</span> {data.functionalImpact.sleepImpact || 'N/A'}</div>
			</div>
			{#if data.functionalImpact.notes}
				<p class="mt-3 text-sm text-base-content/80">{data.functionalImpact.notes}</p>
			{/if}
		</div>

		<!-- Risk screen summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Safety screen</h2>
			<div class="flex flex-wrap gap-3 text-sm">
				<Badge severity={data.riskScreen.suicidalIdeation === 'yes' ? 'severe' : 'normal'} label={`Suicidal ideation: ${data.riskScreen.suicidalIdeation || 'N/A'}`} />
				<Badge severity={data.riskScreen.selfHarm === 'yes' ? 'severe' : 'normal'} label={`Self-harm: ${data.riskScreen.selfHarm || 'N/A'}`} />
				<Badge severity={data.riskScreen.harmToOthers === 'yes' ? 'severe' : 'normal'} label={`Harm to others: ${data.riskScreen.harmToOthers || 'N/A'}`} />
				<Badge severity={data.riskScreen.hasSafetyPlan === 'no' ? 'moderate' : 'normal'} label={`Safety plan: ${data.riskScreen.hasSafetyPlan || 'N/A'}`} />
			</div>
		</div>
	</main>
{/if}
