<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		news2ResponseLabel,
		news2ResponseColor,
		news2ScoreColor,
		calculateAge,
		mtsCategoryLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/casualty-card-form/casualty-cards/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/casualty-cards/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `casualty-card-${data.demographics.lastName || id}.pdf`;
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

	function scoreCell(score: number): string {
		if (score >= 3) return 'bg-error text-error-content';
		if (score >= 1) return 'bg-warning text-warning-content';
		return 'bg-success text-success-content';
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Casualty card report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/casualty-card-form/casualty-cards/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- NEWS2 score + clinical response banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {news2ScoreColor(result.news2.totalScore)}">
			<div class="text-3xl font-bold">NEWS2: {result.news2.totalScore}</div>
			<div class="mt-1 text-lg">{news2ResponseLabel(result.news2.clinicalResponse)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- NEWS2 parameter breakdown -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">NEWS2 parameter scores</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Parameter</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Score</th>
					</tr>
				</thead>
				<tbody>
					{#each result.news2.parameterScores as ps (ps.parameter)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{ps.parameter}</td>
							<td class="py-2 pr-4">{ps.value}</td>
							<td class="py-2">
								<span class="rounded px-2 py-0.5 text-xs font-bold {scoreCell(ps.score)}">{ps.score}</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="mt-4 inline-block rounded-lg border px-3 py-1 text-sm {news2ResponseColor(result.news2.clinicalResponse)}">
				Clinical response: {news2ResponseLabel(result.news2.clinicalResponse)}
			</p>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinical review</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
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
				<div><span class="font-medium text-base-content/70">NHS number:</span> {data.demographics.nhsNumber || 'N/A'}</div>
			</div>
		</div>

		<!-- Triage -->
		{#if data.arrivalTriage.mtsCategory || data.arrivalTriage.arrivalMode}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Triage</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					{#if data.arrivalTriage.mtsCategory}
						<div><span class="font-medium text-base-content/70">MTS category:</span> {mtsCategoryLabel(data.arrivalTriage.mtsCategory)}</div>
					{/if}
					{#if data.arrivalTriage.arrivalMode}
						<div><span class="font-medium text-base-content/70">Arrival mode:</span> {data.arrivalTriage.arrivalMode}</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Presenting complaint -->
		{#if data.presentingComplaint.chiefComplaint}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Presenting complaint</h2>
				<p class="text-sm"><span class="font-medium text-base-content/70">Chief complaint:</span> {data.presentingComplaint.chiefComplaint}</p>
				{#if data.presentingComplaint.historyOfPresentingComplaint}
					<p class="mt-2 text-sm"><span class="font-medium text-base-content/70">HPC:</span> {data.presentingComplaint.historyOfPresentingComplaint}</p>
				{/if}
			</div>
		{/if}

		<!-- Allergies -->
		{#if data.medicalHistory.allergies.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Allergies</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.medicalHistory.allergies as allergy, i (i)}
						<li>
							<strong>{allergy.allergen}</strong> — {allergy.reaction}
							{#if allergy.severity}
								<span class="ml-1 rounded px-1.5 py-0.5 text-xs {allergy.severity === 'anaphylaxis' ? 'bg-error text-error-content' : 'bg-warning text-warning-content'}">
									{allergy.severity}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Disposition -->
		{#if data.disposition.disposition}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Disposition</h2>
				<p class="text-sm"><span class="font-medium text-base-content/70">Outcome:</span> {data.disposition.disposition}</p>
			</div>
		{/if}
	</main>
{/if}
