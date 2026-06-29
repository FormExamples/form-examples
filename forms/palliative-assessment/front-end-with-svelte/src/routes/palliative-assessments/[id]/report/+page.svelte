<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		severityBandLabel,
		severityBandColor,
		classifyIndividualSymptom,
		priorityColor,
		ppsBand,
		ppsBandLabel,
		calculateAge
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/palliative-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/palliative-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `palliative-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Palliative assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/palliative-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- ESAS-r severity banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {severityBandColor(result.severityBand)}">
			<div class="text-3xl font-bold">{severityBandLabel(result.severityBand)} symptom burden</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				<span>ESAS-r total: {result.esasTotal} / 100</span>
				<span>{result.answeredCount} / 10 symptoms scored</span>
				{#if result.individualFlags.length > 0}
					<span>{result.individualFlags.length} severe symptom(s)</span>
				{/if}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Severe individual symptoms (>= 7) -->
		{#if result.individualFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Severe symptoms requiring urgent review</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each result.individualFlags as flag (flag.symptomKey)}
						<li><strong>{flag.symptomLabel}</strong> — ESAS-r {flag.score}/10</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the palliative team</h2>
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

		<!-- ESAS-r symptom scores -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Symptom scores &amp; fired rules</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-medium">{rule.score}</td>
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
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Primary diagnosis:</span> {data.primaryDiagnosisPrognosis.primaryDiagnosis || 'N/A'}</div>
				<div>
					<span class="font-medium text-base-content/70">Performance status:</span>
					PPS {data.performanceStatus.ppsScore ?? 'N/A'}
					{#if data.performanceStatus.ppsScore !== null}({ppsBandLabel(ppsBand(data.performanceStatus.ppsScore))}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Setting:</span> {data.demographics.assessmentSetting || 'N/A'}</div>
			</div>
		</div>

		<!-- Other symptom -->
		{#if data.esasrSymptoms.other !== null && data.esasrSymptoms.otherLabel}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-2 text-lg font-bold text-base-content">Other symptom</h2>
				<p class="text-sm text-base-content/80">
					<strong>{data.esasrSymptoms.otherLabel}</strong> — ESAS-r {data.esasrSymptoms.other}/10
					<span class="ml-1 text-base-content/60">({classifyIndividualSymptom(data.esasrSymptoms.other)})</span>
				</p>
			</div>
		{/if}
	</main>
{/if}
