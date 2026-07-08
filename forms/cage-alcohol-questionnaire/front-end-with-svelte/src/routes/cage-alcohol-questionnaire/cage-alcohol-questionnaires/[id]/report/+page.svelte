<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		resultBandLabel,
		resultBandColor,
		priorityLabel,
		priorityColor,
		pointColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel
	} from '$lib/engine/utils';
	import type { YesNo } from '$lib/engine/types';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/cage-alcohol-questionnaire/cage-alcohol-questionnaires/${id}`);
		}
	});

	let pdfError = $state('');

	function answer(v: YesNo): string {
		return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded';
	}

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/cage-alcohol-questionnaires/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `cage-assessment-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">CAGE assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/cage-alcohol-questionnaire/cage-alcohol-questionnaires/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {resultBandColor(result.resultBand)}">
			<div class="text-3xl font-bold">CAGE {result.cageScore} of 4</div>
			<div class="mt-2 text-sm font-semibold">{resultBandLabel(result.resultBand)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.thresholdMet === 'yes'}
				<p class="text-sm text-base-content/80">
					This is a <strong>positive CAGE screen</strong> (score &ge; 2), which is clinically
					significant. Undertake a fuller assessment of consumption, dependence, and harm, and
					consider a brief intervention or referral.
				</p>
			{:else if result.resultBand === 'low'}
				<p class="text-sm text-base-content/80">
					This is a <strong>sub-threshold result</strong> (CAGE 1) — below the standard cut-off but
					not reassuring. Make further inquiry into drinking patterns; consider AUDIT-C for earlier
					at-risk detection.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					This is a <strong>negative CAGE screen</strong> (score 0). Provide brief advice as
					appropriate. A zero does not exclude hazardous or harmful drinking; consider AUDIT-C where
					earlier risk detection is the goal.
				</p>
			{/if}
		</div>

		<!-- Criteria -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Criteria</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Criterion</th>
						<th class="pb-2 pr-4">Answer</th>
						<th class="pb-2">Point</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">C — Felt you should cut down</td>
						<td class="py-2 pr-4">{answer(data.criteria.cutDown)}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.cutDownPoint
								)}">{result.cutDownPoint}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">A — Annoyed by criticism of drinking</td>
						<td class="py-2 pr-4">{answer(data.criteria.annoyed)}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.annoyedPoint
								)}">{result.annoyedPoint}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">G — Felt bad or guilty about drinking</td>
						<td class="py-2 pr-4">{answer(data.criteria.guilty)}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.guiltyPoint
								)}">{result.guiltyPoint}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">E — Morning eye-opener drink</td>
						<td class="py-2 pr-4">{answer(data.criteria.eyeOpener)}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.eyeOpenerPoint
								)}">{result.eyeOpenerPoint}</span
							>
						</td>
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
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.identification.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
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
				<div>
					<span class="font-medium text-base-content/70">Assessed at:</span>
					{data.context.assessedAt || 'N/A'}
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
